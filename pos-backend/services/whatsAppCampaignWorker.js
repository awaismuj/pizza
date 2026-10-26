const WhatsAppCampaign = require("../models/whatsAppCampaignModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const WhatsAppCampaignRateLimit = require("../models/whatsAppCampaignRateLimitModel");
const Customer = require("../models/customerModel");
const CustomerCoupon = require("../models/customerCouponModel");
const config = require("../config/config");
const provider = require("./whatsAppCampaignProvider");
const campaignService = require("./whatsAppCampaignService");
const campaignCouponService = require("./whatsAppCampaignCouponService");
const { sendMail } = require("../utils/mailer");

let interval = null;
let running = false;

const formatExpiry = (date, timezone) => new Intl.DateTimeFormat("en-PK", {
  timeZone: timezone || "Asia/Karachi",
  dateStyle: "medium",
}).format(date);

const normalizeRecipient = (phone) => provider.normalizeNumber(phone);

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]));

const processCouponEmail = async (recipient) => {
  try {
    const [campaign, customer, assignment] = await Promise.all([
      WhatsAppCampaign.findById(recipient.campaignId),
      Customer.findById(recipient.customerId).select("name email marketingConsent"),
      CustomerCoupon.findById(recipient.customerCouponId).populate("couponId"),
    ]);
    if (campaign?.status === "cancelled") throw Object.assign(new Error("Campaign was cancelled before email delivery."), { skip: true });
    if (!customer || customer.marketingConsent !== true) throw Object.assign(new Error("Promotional consent is no longer recorded."), { skip: true });
    if (!/^\S+@\S+\.\S+$/.test(String(customer.email || ""))) throw Object.assign(new Error("Customer email address is missing or invalid."), { skip: true });
    if (!assignment || assignment.status !== "active" || !assignment.couponId || assignment.couponId.status !== "active") {
      throw Object.assign(new Error("Assigned coupon is no longer active."), { skip: true });
    }
    const now = new Date();
    if ((assignment.startsAt && assignment.startsAt > now)
      || (assignment.expiresAt && assignment.expiresAt <= now)
      || (campaign?.expiresAt && campaign.expiresAt <= now)) {
      throw Object.assign(new Error("Assigned coupon has expired or is not active yet."), { skip: true });
    }
    if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) throw new Error("SMTP configuration is missing.");

    const expiry = assignment.expiresAt
      ? new Intl.DateTimeFormat("en-PK", { timeZone: campaign?.timezone || "Asia/Karachi", dateStyle: "medium" }).format(assignment.expiresAt)
      : "No expiry";
    const name = escapeHtml(customer.name || "Customer");
    const code = escapeHtml(assignment.code);
    const discount = escapeHtml(assignment.couponId.discountValue);
    const minimum = Number(assignment.couponId.minimumSubtotal || 0).toLocaleString("en-US");
    const storeUrl = escapeHtml(config.storeUrl);
    const safeCampaignName = String(campaign?.name || "Customer offer").replace(/[\r\n]+/g, " ").slice(0, 120);
    await sendMail({
      to: customer.email,
      subject: `Your ${safeCampaignName} coupon`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#222">
          <h2>Hello ${name},</h2>
          <p>Your promotional coupon is ready:</p>
          <p style="font-size:24px;font-weight:bold;letter-spacing:2px">${code}</p>
          <p><strong>${discount}% off</strong> · Minimum order Rs ${minimum}</p>
          <p>Valid until ${escapeHtml(expiry)}. Terms and eligible items apply.</p>
          <p><a href="${storeUrl}">Order online</a></p>
          <p>You can withdraw promotional consent in your customer account settings.</p>
        </div>
      `,
    });
    await WhatsAppCampaignRecipient.updateOne(
      { _id: recipient._id, emailStatus: "sending" },
      { $set: { emailStatus: "sent", emailSentAt: new Date(), emailLeaseUntil: null, emailLastError: "" } }
    );
  } catch (error) {
    await WhatsAppCampaignRecipient.updateOne(
      { _id: recipient._id, emailStatus: "sending" },
      {
        $set: {
          emailStatus: error.skip ? "skipped" : "failed",
          emailLeaseUntil: null,
          emailLastError: String(error.message || "Coupon email could not be sent.").slice(0, 500),
        },
      }
    );
  }
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

  let currentRecipient;
  try {
    [currentRecipient] = await campaignService.resolveRecipients(
      { mode: "selected", customerIds: [String(recipient.customerId)] },
      campaign.eligibleOrderStatuses
    );
  } catch (error) {
    await failRecipient(recipient, error);
    await refreshCampaignStatus(campaign._id);
    return;
  }
  const customer = currentRecipient?.customer;
  if (!currentRecipient?.eligible) {
    await WhatsAppCampaignRecipient.updateOne(
      { _id: recipient._id, status: "sending" },
      { $set: { status: "skipped", skipReason: currentRecipient?.reason || "Customer record no longer exists.", leaseUntil: null } }
    );
    await refreshCampaignStatus(campaign._id);
    return;
  }

  const phone = normalizeRecipient(customer.phone);

  let sendAttempted = false;
  try {
    const { assignment, coupon } = await campaignCouponService.getExistingAssignment(campaign, recipient, customer);
    const now = new Date();
    if (assignment.status !== "active" || (assignment.startsAt && assignment.startsAt > now)
      || (assignment.expiresAt && assignment.expiresAt <= now)) {
      const error = new Error("The assigned campaign coupon is not currently available.");
      error.retryable = false;
      throw error;
    }
    if (coupon.status !== "active" || (coupon.startsAt && coupon.startsAt > now)
      || (coupon.expiresAt && coupon.expiresAt <= now)) {
      const error = new Error("Campaign coupon is not currently available.");
      error.retryable = false;
      throw error;
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
    if (!sendAttempted && error.retryable !== false) error.retryable = true;
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
    await WhatsAppCampaignRecipient.updateMany(
      { emailStatus: "sending", emailLeaseUntil: { $lte: now } },
      { $set: { emailStatus: "failed", emailLeaseUntil: null, emailLastError: "Worker stopped during email send; delivery outcome is uncertain. Review before retrying." } }
    );
    const emailRecipient = await WhatsAppCampaignRecipient.findOneAndUpdate(
      { emailStatus: "queued" },
      { $set: { emailStatus: "sending", emailLeaseUntil: new Date(now.getTime() + 2 * 60 * 1000) } },
      { new: true, sort: { emailQueuedAt: 1, _id: 1 } }
    );
    if (emailRecipient) await processCouponEmail(emailRecipient);

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