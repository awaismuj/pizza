const crypto = require("crypto");
const WhatsAppCampaign = require("../models/whatsAppCampaignModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const WhatsAppCampaignRateLimit = require("../models/whatsAppCampaignRateLimitModel");
const Customer = require("../models/customerModel");
const Coupon = require("../models/couponModel");
const CustomerCoupon = require("../models/customerCouponModel");
const config = require("../config/config");
const provider = require("./whatsAppCampaignProvider");
const campaignService = require("./whatsAppCampaignService");

let interval = null;
let running = false;

const formatExpiry = (date, timezone) => new Intl.DateTimeFormat("en-PK", {
  timeZone: timezone || "Asia/Karachi",
  dateStyle: "medium",
}).format(date);

const normalizeRecipient = (phone) => provider.normalizeNumber(phone);

const getCampaignCoupon = async (campaign, discount) => {
  const query = { campaignId: campaign._id, campaignDiscountPercentage: discount };
  let coupon = await Coupon.findOne(query);
  if (coupon) return coupon;

  try {
    coupon = await Coupon.create({
      name: `${campaign.name} (${discount}% WhatsApp offer)`.slice(0, 120),
      description: `Private WhatsApp campaign coupon for ${campaign.name}.`,
      code: `WACMP_${crypto.randomBytes(16).toString("hex").toUpperCase()}`,
      source: "whatsapp_campaign",
      campaignId: campaign._id,
      campaignDiscountPercentage: discount,
      discountType: "percentage",
      discountValue: discount,
      minimumSubtotal: campaign.minimumOrderAmount,
      maximumDiscount: campaign.maximumDiscount,
      channels: ["Online", "POS"],
      usageLimit: Math.max(1, campaign.confirmedEligibleCount),
      perCustomerLimit: 1,
      startsAt: campaign.startedAt || new Date(),
      expiresAt: campaign.expiresAt,
      timezone: campaign.timezone,
      firstOrderOnly: false,
      allowStacking: false,
      status: "active",
      createdBy: campaign.createdBy,
    });
    return coupon;
  } catch (error) {
    if (error.code !== 11000) throw error;
    coupon = await Coupon.findOne(query);
    if (!coupon) throw error;
    return coupon;
  }
};

const getOrCreateAssignment = async (campaign, recipient, customer, discount) => {
  const idempotencyKey = `wa-campaign:${campaign._id}`;
  let assignment = await CustomerCoupon.findOne({ customerId: customer._id, idempotencyKey });
  if (assignment) return assignment;

  const coupon = await getCampaignCoupon(campaign, discount);
  try {
    assignment = await CustomerCoupon.create({
      couponId: coupon._id,
      customerId: customer._id,
      code: `WAC_${crypto.randomBytes(18).toString("hex").toUpperCase()}`,
      source: "whatsapp_campaign",
      idempotencyKey,
      redemptionLimit: 1,
      redemptionCount: 0,
      startsAt: campaign.startedAt || new Date(),
      expiresAt: campaign.expiresAt,
      status: "active",
      assignedBy: campaign.createdBy,
    });
  } catch (error) {
    if (error.code !== 11000) throw error;
    assignment = await CustomerCoupon.findOne({ customerId: customer._id, idempotencyKey });
    if (!assignment) throw error;
  }

  await WhatsAppCampaignRecipient.updateOne(
    { _id: recipient._id, status: "sending" },
    {
      $set: {
        couponId: coupon._id,
        customerCouponId: assignment._id,
        couponCode: assignment.code,
        discountPercentage: discount,
      },
    }
  );
  return assignment;
};

const acquireRateSlot = async () => {
  const now = new Date();
  try {
    await WhatsAppCampaignRateLimit.findOneAndUpdate(
      { _id: "global" },
      { $setOnInsert: { nextAllowedAt: new Date(0) } },
      { upsert: true, new: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  const spacing = Math.ceil(1000 / config.whatsappCampaign.messagesPerSecond);
  const slot = await WhatsAppCampaignRateLimit.findOneAndUpdate(
    { _id: "global", nextAllowedAt: { $lte: now } },
    { $set: { nextAllowedAt: new Date(now.getTime() + spacing) } },
    { new: true }
  );
  return Boolean(slot);
};

const refreshCampaignStatus = async (campaignId) => {
  const outstanding = await WhatsAppCampaignRecipient.exists({ campaignId, status: { $in: ["queued", "sending"] } });
  if (!outstanding) {
    await WhatsAppCampaign.updateOne(
      { _id: campaignId, status: "running" },
      { $set: { status: "completed", completedAt: new Date() } }
    );
  }
};

const failRecipient = async (recipient, error, retryAfterMs = null) => {
  const retry = retryAfterMs && recipient.attempts < 5;
  await WhatsAppCampaignRecipient.updateOne(
    { _id: recipient._id, status: "sending" },
    {
      $set: retry
        ? { status: "queued", nextAttemptAt: new Date(Date.now() + retryAfterMs), leaseUntil: null, retryable: Boolean(error.retryable || retry), lastError: String(error.message || error).slice(0, 500) }
        : { status: "failed", failedAt: new Date(), leaseUntil: null, retryable: Boolean(error.retryable), lastError: String(error.message || error).slice(0, 500) },
    }
  );
};

const processRecipient = async (recipient) => {
  const campaign = await WhatsAppCampaign.findById(recipient.campaignId);
  if (!campaign || campaign.status !== "running") {
    await WhatsAppCampaignRecipient.updateOne({ _id: recipient._id, status: "sending" }, { $set: { status: "queued", leaseUntil: null } });
    return;
  }
  if (campaign.expiresAt <= new Date()) {
    await WhatsAppCampaignRecipient.updateOne(
      { _id: recipient._id, status: "sending" },
      { $set: { status: "skipped", skipReason: "Campaign expired before sending.", leaseUntil: null } }
    );
    await refreshCampaignStatus(campaign._id);
    return;
  }

  const customer = await Customer.findById(recipient.customerId).select("name phone active marketingConsent");
  const eligibility = customer
    ? campaignService.eligibilityFor(customer)
    : { eligible: false, reason: "Customer record no longer exists." };
  if (!eligibility.eligible) {
    await WhatsAppCampaignRecipient.updateOne(
      { _id: recipient._id, status: "sending" },
      { $set: { status: "skipped", skipReason: eligibility.reason, leaseUntil: null } }
    );
    await refreshCampaignStatus(campaign._id);
    return;
  }

  const phone = normalizeRecipient(customer.phone);

  let sendAttempted = false;
  try {
    const requestedDiscount = recipient.discountPercentage || campaign.discountOptions[crypto.randomInt(campaign.discountOptions.length)];
    const assignment = await getOrCreateAssignment(campaign, recipient, customer, requestedDiscount);
    if (assignment.status !== "active") throw new Error("The assigned campaign coupon is no longer active.");
    const coupon = await Coupon.findById(assignment.couponId);
    if (!coupon || coupon.status !== "active" || coupon.expiresAt <= new Date()) {
      throw new Error("Campaign coupon is not currently available.");
    }
    const discount = Number(coupon.discountValue);
    await WhatsAppCampaignRecipient.updateOne(
      { _id: recipient._id, status: "sending" },
      {
        $set: {
          couponId: coupon._id,
          customerCouponId: assignment._id,
          couponCode: assignment.code,
          discountPercentage: discount,
        },
      }
    );
    sendAttempted = true;
    const sent = await provider.sendApprovedTemplate({
      to: phone,
      name: customer.name,
      discount,
      code: assignment.code,
      minimum: campaign.minimumOrderAmount,
      expiry: formatExpiry(campaign.expiresAt, campaign.timezone),
      callbackId: String(recipient._id),
    });
    await WhatsAppCampaignRecipient.updateOne(
      { _id: recipient._id, status: "sending" },
      {
        $set: {
          status: "sent",
          phone,
          customerName: customer.name,
          couponId: coupon._id,
          customerCouponId: assignment._id,
          couponCode: assignment.code,
          discountPercentage: discount,
          providerMessageId: sent.messageId,
          sentAt: new Date(),
          leaseUntil: null,
          lastError: "",
        },
      }
    );
    await refreshCampaignStatus(campaign._id);
  } catch (error) {
    if (!sendAttempted) error.retryable = true;
    await failRecipient(recipient, error, error.retryAfterMs);
    await refreshCampaignStatus(campaign._id);
  }
};

const tick = async () => {
  if (running) return;
  running = true;
  try {
    const now = new Date();
    await WhatsAppCampaign.updateMany(
      { status: "scheduled", scheduledAt: { $lte: now } },
      { $set: { status: "running", startedAt: now } }
    );
    await WhatsAppCampaignRecipient.updateMany(
      { status: "sending", leaseUntil: { $lte: now } },
      { $set: { status: "failed", failedAt: now, leaseUntil: null, lastError: "Worker stopped during send; delivery outcome is uncertain. Review before retrying." } }
    );
    const campaigns = await WhatsAppCampaign.find({ status: "running" }).select("_id").limit(100);
    if (!campaigns.length || !await acquireRateSlot()) return;

    const recipient = await WhatsAppCampaignRecipient.findOneAndUpdate(
      {
        campaignId: { $in: campaigns.map((campaign) => campaign._id) },
        status: "queued",
        $or: [{ nextAttemptAt: null }, { nextAttemptAt: { $lte: now } }],
      },
      { $set: { status: "sending", leaseUntil: new Date(now.getTime() + 2 * 60 * 1000) }, $inc: { attempts: 1 } },
      { new: true, sort: { createdAt: 1 } }
    );
    if (recipient) await processRecipient(recipient);
    for (const campaign of campaigns) await refreshCampaignStatus(campaign._id);
  } catch (error) {
    console.error("WhatsApp campaign worker error:", error.message);
  } finally {
    running = false;
  }
};

const start = () => {
  if (interval) return;
  interval = setInterval(tick, 1000);
  interval.unref?.();
  tick();
};

module.exports = { start, tick };