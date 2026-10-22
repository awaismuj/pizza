const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const WhatsAppCampaign = require("../models/whatsAppCampaignModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const Customer = require("../models/customerModel");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const campaignService = require("../services/whatsAppCampaignService");
const provider = require("../services/whatsAppCampaignProvider");

const DISCOUNTS = [5, 7, 10];
const MAX_NAME = 120;

const validateCampaignInput = (body = {}) => {
  const name = String(body.name || "").trim();
  if (name.length < 2 || name.length > MAX_NAME) throw createHttpError(400, "Campaign name must be 2 to 120 characters.");
  const discountOptions = [...new Set(Array.isArray(body.discountOptions) ? body.discountOptions.map(Number) : [])];
  if (!discountOptions.length || discountOptions.some((value) => !DISCOUNTS.includes(value))) {
    throw createHttpError(400, "Choose one or more discounts: 5%, 7%, or 10%.");
  }
  const minimumOrderAmount = Number(body.minimumOrderAmount ?? 1000);
  if (!Number.isFinite(minimumOrderAmount) || minimumOrderAmount < 0) throw createHttpError(400, "Minimum order amount must be zero or greater.");
  const maximumDiscount = body.maximumDiscount === "" || body.maximumDiscount == null ? null : Number(body.maximumDiscount);
  if (maximumDiscount !== null && (!Number.isFinite(maximumDiscount) || maximumDiscount < 0)) {
    throw createHttpError(400, "Maximum discount must be zero or greater.");
  }
  const expiresAt = new Date(body.expiresAt);
  if (!body.expiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
    throw createHttpError(400, "Choose an expiry date in the future.");
  }
  const timezone = String(body.timezone || "Asia/Karachi").trim();
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    throw createHttpError(400, "Enter a valid IANA timezone.");
  }
  let scheduledAt = null;
  if (body.scheduledAt) {
    scheduledAt = new Date(body.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
      throw createHttpError(400, "A scheduled campaign must start in the future.");
    }
    if (scheduledAt >= expiresAt) throw createHttpError(400, "Campaign start must be before its expiry.");
  }
  const selection = body.selection;
  if (!selection || !["all-eligible", "filtered", "selected"].includes(selection.mode)) {
    throw createHttpError(400, "Choose eligible customers or select customer records.");
  }
  return {
    name,
    discountOptions,
    minimumOrderAmount,
    maximumDiscount,
    expiresAt,
    scheduledAt,
    timezone,
    selection: {
      mode: selection.mode,
      customerIds: selection.mode === "selected" ? selection.customerIds : [],
      excludedCustomerIds: ["all-eligible", "filtered"].includes(selection.mode) ? selection.excludedCustomerIds : [],
      status: campaignService.CUSTOMER_STATUSES.includes(selection.status) ? selection.status : "all",
      search: String(selection.search || "").trim().slice(0, 100),
    },
  };
};

const resolveSafely = async (selection) => {
  try {
    return await campaignService.resolveRecipients(selection);
  } catch (error) {
    throw createHttpError(400, error.message || "Could not resolve campaign recipients.");
  }
};

const customerList = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
    const result = await campaignService.listCustomers({
      search: String(req.query.search || "").trim().slice(0, 100),
      status: campaignService.CUSTOMER_STATUSES.includes(req.query.status) ? req.query.status : "all",
      page,
      limit,
    });
    res.json({ success: true, data: result.data, pagination: result.pagination, summary: result.summary });
  } catch (error) {
    next(error);
  }
};

const previewCampaign = async (req, res, next) => {
  try {
    const campaign = validateCampaignInput(req.body);
    const recipients = await resolveSafely(campaign.selection);
    const eligible = recipients.filter((recipient) => recipient.eligible).length;
    const skipped = recipients.length - eligible;
    const sampleDiscount = campaign.discountOptions[0];
    const expiryText = new Intl.DateTimeFormat("en-PK", { timeZone: campaign.timezone, dateStyle: "medium" }).format(campaign.expiresAt);
    res.json({
      success: true,
      data: {
        counts: { selected: recipients.length, eligible, skipped, estimatedMessages: eligible },
        skipReasons: recipients.filter((recipient) => !recipient.eligible).reduce((counts, recipient) => {
          const reason = recipient.reason || "Not eligible.";
          counts[reason] = (counts[reason] || 0) + 1;
          return counts;
        }, {}),
        template: {
          name: provider.getProviderStatus().templateName,
          language: provider.getProviderStatus().templateLanguage,
          preview: provider.templatePreview({
            name: "Customer",
            discount: sampleDiscount,
            code: "SAMPLECODE",
            minimum: campaign.minimumOrderAmount,
            expiry: expiryText,
          }),
        },
        provider: provider.getProviderStatus(),
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendTestMessage = async (req, res, next) => {
  try {
    const campaign = validateCampaignInput({
      ...req.body,
      name: String(req.body.name || "Admin WhatsApp test").trim(),
      selection: { mode: "all-eligible" },
    });
    provider.assertConfigured();
    const result = await provider.sendTestTemplate({
      name: String(req.body.testName || "Test Customer").trim().slice(0, 60),
      discount: campaign.discountOptions[0],
      code: "TESTCOUPON",
      minimum: campaign.minimumOrderAmount,
      expiry: new Intl.DateTimeFormat("en-PK", { timeZone: campaign.timezone, dateStyle: "medium" }).format(campaign.expiresAt),
    });
    res.json({ success: true, message: "Test template sent to the configured test number.", data: { provider: result.provider, messageId: result.messageId } });
  } catch (error) {
    next(error.status ? error : createHttpError(503, error.message || "Could not send test message."));
  }
};

const createCampaign = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const campaignData = validateCampaignInput(req.body);
    const requestKey = String(req.get("Idempotency-Key") || req.body.requestKey || "").trim();
    if (requestKey.length < 16 || requestKey.length > 100 || !/^[A-Za-z0-9_-]+$/.test(requestKey)) {
      throw createHttpError(400, "A valid campaign idempotency key is required.");
    }
    const existing = await WhatsAppCampaign.findOne({ requestKey });
    if (existing) {
      const counts = await WhatsAppCampaignRecipient.aggregate([
        { $match: { campaignId: existing._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      return res.status(200).json({ success: true, existing: true, data: { campaign: existing, counts } });
    }

    const recipients = await resolveSafely(campaignData.selection);
    if (!recipients.length) throw createHttpError(400, "No customers match this campaign selection.");
    const eligibleCount = recipients.filter((recipient) => recipient.eligible).length;
    if (!eligibleCount) throw createHttpError(400, "There are no eligible recipients. Check consent and valid WhatsApp numbers.");
    const providerStatus = provider.getProviderStatus();
    const templateName = providerStatus.templateName || "mock_approved_campaign_template";
    const templateLanguage = providerStatus.templateLanguage || "en";
    let savedCampaign;

    await session.withTransaction(async () => {
      [savedCampaign] = await WhatsAppCampaign.create([{
        ...campaignData,
        requestKey,
        templateName,
        templateLanguage,
        status: "draft",
        createdBy: req.user._id,
        confirmedEligibleCount: eligibleCount,
      }], { session });
      const documents = recipients.map(({ customer, eligible, reason }) => ({
        campaignId: savedCampaign._id,
        customerId: customer._id,
        customerName: customer.name,
        phone: customer.phone || "",
        status: eligible ? "queued" : "skipped",
        skipReason: eligible ? "" : reason,
      }));
      await WhatsAppCampaignRecipient.insertMany(documents, { session, ordered: true });
    });
    res.status(201).json({
      success: true,
      data: {
        campaign: savedCampaign,
        counts: { selected: recipients.length, eligible: eligibleCount, skipped: recipients.length - eligibleCount, queued: eligibleCount },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const requestKey = String(req.get("Idempotency-Key") || req.body.requestKey || "").trim();
      const existing = await WhatsAppCampaign.findOne({ requestKey });
      if (existing) return res.status(200).json({ success: true, existing: true, data: { campaign: existing } });
    }
    next(error);
  } finally {
    await session.endSession();
  }
};

const getCampaigns = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
    const filter = {};
    const allowed = ["draft", "scheduled", "running", "paused", "completed", "cancelled", "failed"];
    if (allowed.includes(req.query.status)) filter.status = req.query.status;
    const [campaigns, total] = await Promise.all([
      WhatsAppCampaign.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("createdBy", "name email").populate("launchedBy", "name email").lean(),
      WhatsAppCampaign.countDocuments(filter),
    ]);
    const stats = await Promise.all(campaigns.map((campaign) => summarizeCampaign(campaign)));
    res.json({ success: true, data: campaigns.map((campaign, index) => ({ ...campaign, stats: stats[index] })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const summarizeCampaign = async (campaign) => {
  const rows = await WhatsAppCampaignRecipient.aggregate([
    { $match: { campaignId: campaign._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        retryableFailed: { $sum: { $cond: [{ $and: [{ $eq: ["$status", "failed"] }, { $eq: ["$retryable", true] }] }, 1, 0] } },
      },
    },
  ]);
  const counts = Object.fromEntries(rows.map((row) => [row._id, row.count]));
  const retryableFailed = rows.reduce((sum, row) => sum + Number(row.retryableFailed || 0), 0);
  const couponIds = await Coupon.find({ campaignId: campaign._id }).distinct("_id");
  const redeemed = couponIds.length
    ? await CouponRedemption.countDocuments({ couponId: { $in: couponIds }, status: "redeemed" })
    : 0;
  return {
    selected: Object.values(counts).reduce((sum, count) => sum + count, 0),
    eligible: campaign.confirmedEligibleCount,
    queued: counts.queued || 0,
    sending: counts.sending || 0,
    sent: counts.sent || 0,
    delivered: counts.delivered || 0,
    failed: counts.failed || 0,
    retryableFailed,
    skipped: counts.skipped || 0,
    pending: (counts.queued || 0) + (counts.sending || 0),
    redeemed,
  };
};

const getCampaign = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(404, "Campaign not found.");
    const campaign = await WhatsAppCampaign.findById(req.params.id).populate("createdBy", "name email").populate("launchedBy", "name email").lean();
    if (!campaign) throw createHttpError(404, "Campaign not found.");
    res.json({ success: true, data: { ...campaign, stats: await summarizeCampaign(campaign) } });
  } catch (error) {
    next(error);
  }
};

const getCampaignRecipients = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(404, "Campaign not found.");
    const campaignId = new mongoose.Types.ObjectId(req.params.id);
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
    const filter = { campaignId };
    const status = String(req.query.status || "");
    if (["queued", "sending", "sent", "delivered", "failed", "skipped"].includes(status)) filter.status = status;
    if (status === "pending") filter.status = { $in: ["queued", "sending"] };
    if (status === "redeemed") filter.customerCouponId = { $in: await CouponRedemption.distinct("customerCouponId", { status: "redeemed" }) };
    const [recipients, total] = await Promise.all([
      WhatsAppCampaignRecipient.find(filter).sort({ createdAt: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      WhatsAppCampaignRecipient.countDocuments(filter),
    ]);
    const assignmentIds = recipients.map((row) => row.customerCouponId).filter(Boolean);
    const redemptions = assignmentIds.length
      ? await CouponRedemption.find({ customerCouponId: { $in: assignmentIds }, status: "redeemed" }).select("customerCouponId status redeemedAt").lean()
      : [];
    const redemptionByAssignment = new Map(redemptions.map((row) => [String(row.customerCouponId), row]));
    res.json({
      success: true,
      data: recipients.map((row) => ({ ...row, redemption: redemptionByAssignment.get(String(row.customerCouponId)) || null })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const launchCampaign = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(404, "Campaign not found.");
    provider.assertConfigured();
    const campaign = await WhatsAppCampaign.findById(req.params.id);
    if (!campaign) throw createHttpError(404, "Campaign not found.");
    if (["scheduled", "running", "completed"].includes(campaign.status)) {
      return res.json({ success: true, existing: true, data: { campaign, stats: await summarizeCampaign(campaign) } });
    }
    if (!(["draft", "paused"].includes(campaign.status))) throw createHttpError(409, "This campaign cannot be launched in its current state.");
    const queued = await WhatsAppCampaignRecipient.find({ campaignId: campaign._id, status: "queued" }).select("_id customerId").lean();
    const customerIds = queued.map((row) => row.customerId);
    const customers = await Customer.find({ _id: { $in: customerIds } }).select("_id active marketingConsent phone").lean();
    const customerById = new Map(customers.map((customer) => [String(customer._id), customer]));
    let eligibleCount = 0;
    for (const recipient of queued) {
      const customer = customerById.get(String(recipient.customerId));
      const eligibility = customer
        ? campaignService.eligibilityFor(customer)
        : { eligible: false, reason: "Customer record no longer exists." };
      const reason = eligibility.reason;
      if (reason) {
        await WhatsAppCampaignRecipient.updateOne({ _id: recipient._id, status: "queued" }, { $set: { status: "skipped", skipReason: reason } });
      } else eligibleCount += 1;
    }
    if (eligibleCount < 1) throw createHttpError(400, "No eligible recipients remain. Recheck consent and phone numbers.");
    if (Number(req.body.confirmedEligibleCount) !== eligibleCount) {
      const skippedCount = await WhatsAppCampaignRecipient.countDocuments({ campaignId: campaign._id, status: "skipped" });
      return res.status(409).json({
        success: false,
        message: "Recipient eligibility changed. Review the updated count and confirm again.",
        data: { eligibleCount, skippedCount },
      });
    }
    const now = new Date();
    if (campaign.expiresAt <= now) throw createHttpError(400, "Campaign has expired.");
    const scheduled = campaign.scheduledAt && campaign.scheduledAt > now;
    const updated = await WhatsAppCampaign.findOneAndUpdate(
      { _id: campaign._id, status: { $in: ["draft", "paused"] } },
      {
        $set: {
          status: scheduled ? "scheduled" : "running",
          confirmedEligibleCount: campaign.status === "paused" ? campaign.confirmedEligibleCount : eligibleCount,
          launchedBy: req.user._id,
          startedAt: scheduled ? null : campaign.startedAt || now,
          completedAt: null,
          pausedAt: null,
        },
      },
      { new: true }
    );
    if (!updated) throw createHttpError(409, "Campaign launch was already processed.");
    res.json({ success: true, data: { campaign: updated, stats: await summarizeCampaign(updated) } });
  } catch (error) {
    next(error);
  }
};

const pauseCampaign = async (req, res, next) => {
  try {
    const campaign = await WhatsAppCampaign.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ["scheduled", "running"] } },
      { $set: { status: "paused", pausedAt: new Date() } },
      { new: true }
    );
    if (!campaign) throw createHttpError(409, "Campaign is not currently running or scheduled.");
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

const cancelCampaign = async (req, res, next) => {
  try {
    const campaign = await WhatsAppCampaign.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ["draft", "scheduled", "running", "paused"] } },
      { $set: { status: "cancelled", cancelledAt: new Date() } },
      { new: true }
    );
    if (!campaign) throw createHttpError(409, "Campaign cannot be cancelled in its current state.");
    await WhatsAppCampaignRecipient.updateMany(
      { campaignId: campaign._id, status: "queued" },
      { $set: { status: "skipped", skipReason: "Campaign cancelled before sending." } }
    );
    res.json({ success: true, data: { campaign, stats: await summarizeCampaign(campaign) } });
  } catch (error) {
    next(error);
  }
};

const retryFailed = async (req, res, next) => {
  try {
    const campaign = await WhatsAppCampaign.findById(req.params.id);
    if (!campaign) throw createHttpError(404, "Campaign not found.");
    if (campaign.status === "cancelled" || campaign.expiresAt <= new Date()) {
      throw createHttpError(409, "This campaign is no longer available for retry.");
    }
    provider.assertConfigured();
    const result = await WhatsAppCampaignRecipient.updateMany(
      { campaignId: campaign._id, status: "failed", retryable: true },
      { $set: { status: "queued", nextAttemptAt: null, failedAt: null, retryable: false, lastError: "" } }
    );
    if (!result.modifiedCount) throw createHttpError(400, "There are no safely retryable failed messages.");
    campaign.status = "running";
    campaign.completedAt = null;
    await campaign.save();
    res.json({ success: true, data: { retried: result.modifiedCount, campaign } });
  } catch (error) {
    next(error);
  }
};

const webhookVerify = (req, res) => {
  const challenge = provider.verifyWebhookChallenge({
    mode: req.query["hub.mode"],
    token: req.query["hub.verify_token"],
    challenge: req.query["hub.challenge"],
  });
  if (challenge === null) return res.sendStatus(403);
  res.status(200).send(challenge);
};

const webhookStatus = async (req, res) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  if (!provider.verifyWebhookSignature(rawBody, req.get("x-hub-signature-256"))) return res.sendStatus(401);
  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.sendStatus(400);
  }
  const statuses = (payload.entry || []).flatMap((entry) => entry.changes || []).flatMap((change) => change.value?.statuses || []);
  for (const status of statuses) {
    if (!status.id) continue;
    let row = await WhatsAppCampaignRecipient.findOne({ providerMessageId: status.id }).select("_id status attempts");
    if (!row && mongoose.Types.ObjectId.isValid(status.biz_opaque_callback_data)) {
      row = await WhatsAppCampaignRecipient.findById(status.biz_opaque_callback_data).select("_id status attempts");
    }
    if (!row) continue;
    if (["delivered", "read"].includes(status.status)) {
      await WhatsAppCampaignRecipient.updateOne(
        { _id: row._id, status: { $in: ["sending", "sent", "failed", "delivered"] } },
        { $set: { status: "delivered", providerMessageId: status.id, retryable: false, deliveredAt: new Date(Number(status.timestamp) * 1000 || Date.now()) } }
      );
    } else if (status.status === "failed" && row.status !== "delivered") {
      const providerErrorCodes = (status.errors || []).map((error) => Number(error.code));
      const retryable = providerErrorCodes.some((code) => [130429, 131048, 131056].includes(code));
      await WhatsAppCampaignRecipient.updateOne(
        { _id: row._id, status: { $in: ["sending", "sent", "failed"] } },
        { $set: { status: "failed", providerMessageId: status.id, failedAt: new Date(), retryable, lastError: "Provider reported message failure." } }
      );
    }
  }
  res.sendStatus(200);
};

const getProvider = (req, res) => res.json({ success: true, data: provider.getProviderStatus() });

module.exports = {
  cancelCampaign,
  createCampaign,
  customerList,
  getCampaign,
  getCampaignRecipients,
  getCampaigns,
  getProvider,
  launchCampaign,
  pauseCampaign,
  previewCampaign,
  retryFailed,
  sendTestMessage,
  webhookStatus,
  webhookVerify,
};