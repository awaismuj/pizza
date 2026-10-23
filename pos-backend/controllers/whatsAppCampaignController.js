const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const WhatsAppCampaign = require("../models/whatsAppCampaignModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const WhatsAppCampaignAudit = require("../models/whatsAppCampaignAuditModel");
const CustomerCoupon = require("../models/customerCouponModel");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const campaignService = require("../services/whatsAppCampaignService");
const campaignCouponService = require("../services/whatsAppCampaignCouponService");
const provider = require("../services/whatsAppCampaignProvider");
const Order = require("../models/orderModel");

const DISCOUNTS = [5, 7, 10];
const MAX_NAME = 120;

const validateCampaignInput = (body = {}) => {
  const name = String(body.name || "").trim();
  if (name.length < 2 || name.length > MAX_NAME) throw createHttpError(400, "Campaign name must be 2 to 120 characters.");
  const campaignType = String(body.campaignType || "custom").trim().slice(0, 80) || "custom";
  const discountOptions = [...new Set(Array.isArray(body.discountOptions) ? body.discountOptions.map(Number) : [])];
  if (!discountOptions.length || discountOptions.some((value) => !DISCOUNTS.includes(value))) {
    throw createHttpError(400, "Choose one or more discounts: 5%, 7%, or 10%.");
  }
  const sourceWeights = body.discountWeights || {};
  const discountWeights = {};
  for (const discount of discountOptions) {
    const weight = Number(sourceWeights[discount] ?? 1);
    if (!Number.isInteger(weight) || weight < 0 || weight > 1000) {
      throw createHttpError(400, "Discount weights must be whole numbers from 0 to 1000.");
    }
    discountWeights[discount] = weight;
  }
  if (Object.values(discountWeights).every((weight) => weight === 0)) {
    throw createHttpError(400, "At least one selected discount weight must be greater than zero.");
  }
  let eligibleOrderStatuses;
  try {
    eligibleOrderStatuses = campaignService.normalizeEligibleOrderStatuses(body.eligibleOrderStatuses);
  } catch (error) {
    throw createHttpError(400, error.message);
  }
  const minimumOrderAmount = Number(body.minimumOrderAmount ?? 1000);
  if (!Number.isFinite(minimumOrderAmount) || minimumOrderAmount < 0) throw createHttpError(400, "Minimum order amount must be zero or greater.");
  const maximumDiscount = body.maximumDiscount === "" || body.maximumDiscount == null ? null : Number(body.maximumDiscount);
  if (maximumDiscount !== null && (!Number.isFinite(maximumDiscount) || maximumDiscount < 0)) {
    throw createHttpError(400, "Maximum discount must be zero or greater.");
  }
  const maxUsesPerCoupon = Number(body.maxUsesPerCoupon ?? 1);
  if (!Number.isInteger(maxUsesPerCoupon) || maxUsesPerCoupon < 1 || maxUsesPerCoupon > 100) {
    throw createHttpError(400, "Maximum uses per coupon must be a whole number from 1 to 100.");
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
    campaignType,
    discountOptions,
    discountWeights,
    eligibleOrderStatuses,
    minimumOrderAmount,
    maximumDiscount,
    maxUsesPerCoupon,
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

const resolveSafely = async (selection, eligibleOrderStatuses) => {
  try {
    return await campaignService.resolveRecipients(selection, eligibleOrderStatuses);
  } catch (error) {
    throw createHttpError(400, error.message || "Could not resolve campaign recipients.");
  }
};

const scanCampaignData = async (campaign) => {
  const recipients = await resolveSafely(campaign.selection, campaign.eligibleOrderStatuses);
  const now = new Date();
  const validAt = campaign.scheduledAt && campaign.scheduledAt > now ? campaign.scheduledAt : now;
  const customerIds = recipients.map(({ customer }) => customer._id);
  const [assignments, existingRecipients] = await Promise.all([
    CustomerCoupon.find({
      customerId: { $in: customerIds },
      source: "whatsapp_campaign",
      status: "active",
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: validAt } }] },
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: validAt } }] },
      ],
    }).populate({
      path: "couponId",
      match: { campaignId: campaign._id, status: "active", startsAt: { $lte: validAt }, expiresAt: { $gt: validAt } },
      select: "campaignId discountValue discountType minimumSubtotal maximumDiscount expiresAt",
    }).lean(),
    WhatsAppCampaignRecipient.find({ campaignId: campaign._id, customerId: { $in: customerIds } }).select("customerId status couponCode").lean(),
  ]);
  const assignmentByCustomer = new Map(assignments.filter((row) => row.couponId).map((row) => [String(row.customerId), row]));
  const recipientByCustomer = new Map(existingRecipients.map((row) => [String(row.customerId), row]));
  const rows = recipients.map(({ customer, eligible, reason }) => {
    const phone = provider.normalizeNumber(customer.phone);
    const assignment = assignmentByCustomer.get(String(customer._id)) || null;
    const existingRecipient = recipientByCustomer.get(String(customer._id)) || null;
    const alreadyMessaged = ["sent", "delivered"].includes(existingRecipient?.status);
    return {
      customer,
      phone,
      eligible,
      reason,
      qualifyingOrderCount: Number(customer.orderCount || 0),
      lastQualifyingOrderAt: customer.lastOrderDate || null,
      assignment,
      alreadyMessaged,
      messageStatus: existingRecipient?.status || "not sent",
      recipientId: existingRecipient?._id || null,
    };
  });

  const uniqueValidPhones = new Set(rows.filter((row) => /^\d{10,15}$/.test(row.phone)).map((row) => row.phone)).size;
  const excluded = rows.filter((row) => !row.eligible).reduce((summary, row) => {
    const reason = row.reason || "Not eligible.";
    summary[reason] = (summary[reason] || 0) + 1;
    return summary;
  }, {});
  return {
    rows,
    counts: {
      customerRecordsFound: rows.length,
      uniqueValidPhoneNumbers: uniqueValidPhones,
      customersWithQualifyingOrders: rows.filter((row) => row.qualifyingOrderCount > 0).length,
      eligibleForWhatsApp: rows.filter((row) => row.eligible).length,
      requiringNewCoupon: rows.filter((row) => row.eligible && !row.assignment).length,
      alreadyHaveValidCoupon: rows.filter((row) => row.assignment).length,
      alreadyMessaged: rows.filter((row) => row.alreadyMessaged).length,
      excluded: rows.filter((row) => !row.eligible).length,
    },
    excludedReasons: excluded,
  };
};

const scanCampaign = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(404, "Campaign not found.");
    const campaign = await WhatsAppCampaign.findById(req.params.id);
    if (!campaign) throw createHttpError(404, "Campaign not found.");
    const scan = await scanCampaignData(campaign);
    await WhatsAppCampaignAudit.create({
      campaignId: campaign._id,
      actorId: req.user._id,
      action: "scan",
      metadata: scan.counts,
    });
    res.json({ success: true, data: { counts: scan.counts, excludedReasons: scan.excludedReasons, rows: scan.rows.map((row) => ({
      id: String(row.customer._id),
      name: row.customer.name,
      phone: row.customer.phone,
      normalizedPhone: row.phone,
      accountActive: Boolean(row.customer.active),
      marketingConsent: row.customer.marketingConsent === true,
      qualifyingOrderCount: row.qualifyingOrderCount,
      lastQualifyingOrderAt: row.lastQualifyingOrderAt,
      eligible: row.eligible,
      ineligibleReason: row.reason,
      couponCode: row.assignment?.code || "",
      discountPercentage: row.assignment?.couponId?.discountValue || null,
      couponExpiresAt: row.assignment?.expiresAt || null,
      couponStatus: row.assignment ? "active" : "missing",
      messageStatus: row.messageStatus,
      recipientId: row.recipientId ? String(row.recipientId) : null,
    })) } });
  } catch (error) {
    next(error);
  }
};

const generateCampaignTokens = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(404, "Campaign not found.");
    const campaign = await WhatsAppCampaign.findById(req.params.id);
    if (!campaign) throw createHttpError(404, "Campaign not found.");
    if (campaign.status !== "draft") throw createHttpError(409, "Tokens can only be generated for a draft campaign.");

    const recipients = await resolveSafely(campaign.selection, campaign.eligibleOrderStatuses);
    const existingRecipients = await WhatsAppCampaignRecipient.find({ campaignId: campaign._id }).lean();
    const recipientByCustomer = new Map(existingRecipients.map((recipient) => [String(recipient.customerId), recipient]));
    const counts = {
      eligible: recipients.filter((recipient) => recipient.eligible).length,
      created: 0,
      retained: 0,
      failedValidation: 0,
      failedAssignment: 0,
    };

    for (const { customer, eligible, reason } of recipients) {
      let recipient = recipientByCustomer.get(String(customer._id));
      if (!recipient) {
        try {
          recipient = await WhatsAppCampaignRecipient.create({
            campaignId: campaign._id,
            customerId: customer._id,
            customerName: customer.name,
            phone: customer.phone || "",
            status: eligible ? "queued" : "skipped",
            skipReason: eligible ? "" : reason,
          });
          recipientByCustomer.set(String(customer._id), recipient);
        } catch (error) {
          if (error.code !== 11000) throw error;
          recipient = await WhatsAppCampaignRecipient.findOne({ campaignId: campaign._id, customerId: customer._id });
        }
      }
      if (!eligible) {
        counts.failedValidation += 1;
        if (["queued", "skipped"].includes(recipient.status)) {
          await WhatsAppCampaignRecipient.updateOne(
            { _id: recipient._id, status: { $in: ["queued", "skipped"] } },
            { $set: { status: "skipped", skipReason: reason || "Customer is not currently eligible." } }
          );
        }
        continue;
      }
      if (!["queued", "skipped"].includes(recipient.status)) {
        counts.retained += 1;
        continue;
      }
      try {
        const result = await campaignCouponService.getOrCreateAssignment(campaign, recipient, customer);
        counts[result.created ? "created" : "retained"] += 1;
        await WhatsAppCampaignRecipient.updateOne(
          { _id: recipient._id, status: { $in: ["queued", "skipped"] } },
          { $set: { status: "queued", skipReason: "", customerName: customer.name, phone: customer.phone || "" } }
        );
      } catch {
        counts.failedAssignment += 1;
      }
    }

    campaign.confirmedEligibleCount = counts.eligible;
    await campaign.save();
    await WhatsAppCampaignAudit.create({
      campaignId: campaign._id,
      actorId: req.user._id,
      action: "tokens_generated",
      metadata: counts,
    });
    res.json({ success: true, data: { counts } });
  } catch (error) {
    next(error);
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
    const recipients = await resolveSafely(campaign.selection, campaign.eligibleOrderStatuses);
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

    const recipients = await resolveSafely(campaignData.selection, campaignData.eligibleOrderStatuses);
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
      await WhatsAppCampaignAudit.create([{
        campaignId: savedCampaign._id,
        actorId: req.user._id,
        action: "create",
        metadata: { selected: recipients.length, eligible: eligibleCount },
      }], { session });
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
    const currentRecipients = await resolveSafely(campaign.selection, campaign.eligibleOrderStatuses);
    const currentById = new Map(currentRecipients.map((recipient) => [String(recipient.customer._id), recipient]));
    let eligibleCount = 0;
    const eligibleRows = [];
    for (const recipient of queued) {
      const current = currentById.get(String(recipient.customerId));
      if (!current?.eligible) {
        await WhatsAppCampaignRecipient.updateOne(
          { _id: recipient._id, status: "queued" },
          { $set: { status: "skipped", skipReason: current?.reason || "Customer record no longer qualifies." } }
        );
      } else {
        eligibleRows.push({ recipient, customer: current.customer });
        eligibleCount += 1;
      }
    }
    if (eligibleCount < 1) throw createHttpError(400, "No eligible recipients remain. Recheck consent and phone numbers.");
    const now = new Date();
    const validAt = campaign.scheduledAt && campaign.scheduledAt > now ? campaign.scheduledAt : now;
    const idempotencyKey = `wa-campaign:${campaign._id}`;
    const assignments = await CustomerCoupon.find({
      customerId: { $in: eligibleRows.map((row) => row.customer._id) },
      idempotencyKey,
      status: "active",
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: validAt } }] },
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: validAt } }] },
      ],
    }).populate({
      path: "couponId",
      match: { campaignId: campaign._id, status: "active", startsAt: { $lte: validAt }, expiresAt: { $gt: validAt } },
    }).lean();
    const assignmentByCustomer = new Map(assignments.filter((assignment) => assignment.couponId)
      .map((assignment) => [String(assignment.customerId), assignment]));
    const missingAssignments = [];
    for (const row of eligibleRows) {
      const assignment = assignmentByCustomer.get(String(row.customer._id));
      const coupon = assignment?.couponId;
      if (!assignment || !coupon || (coupon.startsAt && coupon.startsAt > validAt) || (coupon.expiresAt && coupon.expiresAt <= validAt)) {
        missingAssignments.push(row);
        continue;
      }
      await WhatsAppCampaignRecipient.updateOne(
        { _id: row.recipient._id, status: "queued" },
        { $set: { couponId: coupon._id, customerCouponId: assignment._id, couponCode: assignment.code, discountPercentage: coupon.discountValue } }
      );
    }
    if (missingAssignments.length) {
      throw createHttpError(409, `${missingAssignments.length} eligible customer(s) need valid assigned tokens. Generate tokens before launching.`);
    }
    if (Number(req.body.confirmedEligibleCount) !== eligibleCount) {
      const skippedCount = await WhatsAppCampaignRecipient.countDocuments({ campaignId: campaign._id, status: "skipped" });
      return res.status(409).json({
        success: false,
        message: "Recipient eligibility changed. Review the updated count and confirm again.",
        data: { eligibleCount, skippedCount },
      });
    }
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
    await WhatsAppCampaignAudit.create({
      campaignId: campaign._id,
      actorId: req.user._id,
      action: campaign.selection.mode === "selected" ? "send_selected" : "send_all",
      metadata: { eligibleCount },
    });
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
    await WhatsAppCampaignAudit.create({ campaignId: campaign._id, actorId: req.user._id, action: "pause" });
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
    await WhatsAppCampaignAudit.create({ campaignId: campaign._id, actorId: req.user._id, action: "cancel" });
    res.json({ success: true, data: { campaign, stats: await summarizeCampaign(campaign) } });
  } catch (error) {
    next(error);
  }
};

const retryFailed = async (req, res, next) => {
  try {
    const reason = String(req.body.reason || "").trim();
    if (reason.length < 8 || reason.length > 300) throw createHttpError(400, "Enter a retry reason between 8 and 300 characters.");
    const campaign = await WhatsAppCampaign.findById(req.params.id);
    if (!campaign) throw createHttpError(404, "Campaign not found.");
    if (campaign.status === "cancelled" || campaign.expiresAt <= new Date()) {
      throw createHttpError(409, "This campaign is no longer available for retry.");
    }
    provider.assertConfigured();
    const result = await WhatsAppCampaignRecipient.updateMany(
      { campaignId: campaign._id, status: "failed", retryable: true },
      { $set: { status: "queued", nextAttemptAt: null, failedAt: null, retryable: false, lastError: "", lastRetryReason: reason, lastSendRequestedBy: req.user._id, lastSendRequestedAt: new Date() } }
    );
    if (!result.modifiedCount) throw createHttpError(400, "There are no safely retryable failed messages.");
    campaign.status = "running";
    campaign.completedAt = null;
    await campaign.save();
    await WhatsAppCampaignAudit.create({ campaignId: campaign._id, actorId: req.user._id, action: "retry", reason, metadata: { retried: result.modifiedCount } });
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
  generateCampaignTokens,
  launchCampaign,
  pauseCampaign,
  previewCampaign,
  retryFailed,
  sendTestMessage,
  scanCampaign,
  webhookStatus,
  webhookVerify,
};