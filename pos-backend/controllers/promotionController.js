const createHttpError = require("http-errors");
const crypto = require("crypto");
const Customer = require("../models/customerModel");
const CustomerCoupon = require("../models/customerCouponModel");
const PromotionExecution = require("../models/promotionExecutionModel");
const PromotionIssue = require("../models/promotionIssueModel");
const Settings = require("../models/settingsModel");
const Coupon = require("../models/couponModel");
const config = require("../config/config");
const whatsappProvider = require("../services/whatsAppCampaignProvider");
const { getPromotionSettings, validatePromotionSettings } = require("../utils/promotionSettings");
const { previewPromotion, runPromotion } = require("../services/promotionCampaignService");

const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ key: "global" }).lean();
    res.json({ success: true, data: getPromotionSettings(settings?.promotionSettings) });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) throw createHttpError(400, "Promotion settings must be an object.");
    for (const key of ["welcome", "friday", "birthday", "manual"]) {
      if (req.body[key] !== undefined && (!req.body[key] || typeof req.body[key] !== "object" || Array.isArray(req.body[key]))) {
        throw createHttpError(400, `${key} settings must be an object.`);
      }
    }
    const promotionSettings = getPromotionSettings(req.body);
    const validationError = validatePromotionSettings(promotionSettings);
    if (validationError) throw createHttpError(400, validationError);
    const settings = await Settings.findOneAndUpdate(
      { key: "global" },
      { $set: { promotionSettings } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, message: "Coupon marketing settings saved.", data: getPromotionSettings(settings.promotionSettings) });
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
    const search = String(req.query.search || "").trim().slice(0, 100);
    const filter = { active: true, contactOnly: { $ne: true } };
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
        { phone: { $regex: escaped } },
      ];
    }
    const [customers, total] = await Promise.all([
      Customer.find(filter).select("name email phone dateOfBirth emailVerifiedAt marketingConsent createdAt").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Customer.countDocuments(filter),
    ]);
    const assignments = await CustomerCoupon.find({ customerId: { $in: customers.map((customer) => customer._id) } })
      .select("customerId code status redemptionCount redemptionLimit createdAt startsAt expiresAt source")
      .populate("couponId", "name discountType discountValue")
      .sort({ createdAt: -1 })
      .lean();
    const latestByCustomer = new Map();
    for (const assignment of assignments) {
      const key = String(assignment.customerId);
      if (!latestByCustomer.has(key)) latestByCustomer.set(key, assignment);
    }
    res.json({
      success: true,
      data: customers.map((customer) => ({
        ...customer,
        latestCoupon: latestByCustomer.get(String(customer._id)) || null,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getExecutions = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
    const filter = {};
    if (["friday", "birthday", "manual"].includes(req.query.kind)) filter.kind = req.query.kind;
    if (["scheduled", "manual"].includes(req.query.trigger)) filter.trigger = req.query.trigger;
    const [executions, total] = await Promise.all([
      PromotionExecution.find(filter).populate("createdBy", "name email").sort({ startedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      PromotionExecution.countDocuments(filter),
    ]);
    res.json({ success: true, data: executions, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getExecutionIssues = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) throw createHttpError(404, "Promotion execution not found.");
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50));
    const execution = await PromotionExecution.findById(req.params.id).select("_id kind");
    if (!execution) throw createHttpError(404, "Promotion execution not found.");
    const [issues, total] = await Promise.all([
      PromotionIssue.find({ executionId: execution._id })
        .populate("customerId", "name email phone marketingConsent")
        .populate("customerCouponId", "status redemptionCount redemptionLimit expiresAt")
        .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      PromotionIssue.countDocuments({ executionId: execution._id }),
    ]);
    res.json({ success: true, data: issues, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const runManualCampaign = async (req, res, next) => {
  try {
    const kind = String(req.body.kind || "manual");
    if (!["friday", "birthday", "manual"].includes(kind)) throw createHttpError(400, "Choose Friday, birthday, or manual promotion.");
    const requestKey = String(req.body.requestKey || "");
    if (requestKey.length < 16 || requestKey.length > 120) throw createHttpError(400, "A valid idempotency key is required.");
    if (req.body.sendNow !== undefined && typeof req.body.sendNow !== "boolean") throw createHttpError(400, "sendNow must be true or false.");
    if (req.body.customerIds !== undefined && (!Array.isArray(req.body.customerIds) || req.body.customerIds.length > 1000)) {
      throw createHttpError(400, "Customer selection must contain no more than 1,000 IDs.");
    }
    if (Array.isArray(req.body.customerIds) && req.body.customerIds.length === 0) {
      throw createHttpError(400, "Select at least one customer or omit the selection to use all eligible customers.");
    }
    const result = await runPromotion({
      kind,
      trigger: "manual",
      executionKey: `manual:${kind}:${req.user._id}:${crypto.createHash("sha256").update(requestKey).digest("hex")}`,
      createdBy: req.user._id,
      customerIds: req.body.customerIds || null,
      sendNow: req.body.sendNow,
    });
    res.status(result.duplicate ? 200 : 201).json({
      success: true,
      message: result.duplicate ? "This campaign request was already processed." : "Coupon campaign execution finished.",
      data: { execution: result.execution, duplicate: Boolean(result.duplicate), alreadyRunning: Boolean(result.alreadyRunning) },
    });
  } catch (error) {
    next(error.status ? error : createHttpError(400, error.message || "Could not run coupon campaign."));
  }
};

const getPreview = async (req, res, next) => {
  try {
    const kind = String(req.query.kind || "");
    if (!["friday", "birthday", "manual"].includes(kind)) throw createHttpError(400, "Choose Friday, birthday, or manual promotion.");
    const rawCustomerIds = req.query.customerIds;
    const customerIds = rawCustomerIds === undefined
      ? null
      : String(rawCustomerIds).split(",").filter(Boolean);
    if (customerIds && customerIds.length > 1000) throw createHttpError(400, "Customer selection must contain no more than 1,000 IDs.");
    const result = await previewPromotion({ kind, customerIds });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error.status ? error : createHttpError(400, error.message || "Could not preview campaign eligibility."));
  }
};

const revokeAssignment = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.assignmentId)) throw createHttpError(404, "Active coupon assignment not found.");
    const assignment = await CustomerCoupon.findOneAndUpdate(
      { _id: req.params.assignmentId, status: "active", redemptionCount: 0 },
      { $set: { status: "revoked" } },
      { new: true }
    );
    if (!assignment) throw createHttpError(404, "Unused active coupon assignment not found.");
    res.json({ success: true, message: "Coupon assignment revoked." });
  } catch (error) {
    next(error);
  }
};

const retryIssueDelivery = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.issueId)) throw createHttpError(404, "Coupon delivery record not found.");
    const channel = String(req.body.channel || "");
    if (!["email", "whatsapp"].includes(channel)) throw createHttpError(400, "Choose email or WhatsApp delivery.");
    const issue = await PromotionIssue.findById(req.params.issueId).select("customerId customerCouponId couponId emailStatus emailAttempts whatsappStatus whatsappAttempts");
    if (!issue) throw createHttpError(404, "Coupon delivery record not found.");
    const customer = await Customer.findById(issue.customerId).select("email phone marketingConsent emailVerifiedAt active");
    if (!customer?.active || !customer.emailVerifiedAt || customer.marketingConsent !== true) {
      throw createHttpError(400, "A verified active customer with current promotional consent is required before retrying.");
    }
    if (channel === "email") {
      if (!/^\S+@\S+\.\S+$/.test(String(customer.email || ""))) throw createHttpError(400, "A valid customer email address is required.");
      if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) throw createHttpError(400, "SMTP is not configured.");
      if (issue.emailAttempts >= 5) throw createHttpError(400, "This email has reached the five-attempt limit.");
    } else {
      if (!/^\d{10,15}$/.test(whatsappProvider.normalizeNumber(customer.phone))) throw createHttpError(400, "A valid customer mobile number is required.");
      const providerStatus = whatsappProvider.getProviderStatus();
      if (providerStatus.provider !== "cloud" || !providerStatus.configured) throw createHttpError(400, "WhatsApp Cloud API is not configured.");
      if (issue.whatsappAttempts >= 5) throw createHttpError(400, "This WhatsApp message has reached the five-attempt limit.");
    }
    const coupon = issue.customerCouponId
      ? await CustomerCoupon.findById(issue.customerCouponId).populate("couponId")
      : await Coupon.findById(issue.couponId);
    const assignedCoupon = issue.customerCouponId ? coupon?.couponId : coupon;
    const assignmentValid = issue.customerCouponId
      ? coupon?.status === "active"
        && coupon.redemptionCount < coupon.redemptionLimit
        && (!coupon.expiresAt || coupon.expiresAt > new Date())
        && (!coupon.startsAt || coupon.startsAt <= new Date())
      : true;
    if (!assignedCoupon || assignedCoupon.status !== "active"
      || (assignedCoupon.usageLimit != null && assignedCoupon.redemptionCount >= assignedCoupon.usageLimit)
      || (assignedCoupon.expiresAt && assignedCoupon.expiresAt <= new Date()) || !assignmentValid) {
      throw createHttpError(400, "The coupon is no longer active.");
    }
    const statusField = `${channel}Status`;
    const errorField = `${channel}Error`;
    const attemptsField = `${channel}Attempts`;
    const updated = await PromotionIssue.findOneAndUpdate(
      {
        _id: issue._id,
        [statusField]: "failed",
        $or: [{ [attemptsField]: { $lt: 5 } }, { [attemptsField]: { $exists: false } }],
      },
      { $set: { [statusField]: "queued", [errorField]: "", [`${channel}LeaseUntil`]: null } },
      { new: true }
    );
    if (!updated) throw createHttpError(409, "Delivery is no longer failed or the retry limit was reached.");
    res.json({ success: true, message: `${channel === "email" ? "Email" : "WhatsApp"} retry queued.` });
  } catch (error) {
    next(error);
  }
};

const queueIssueDelivery = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.issueId)) throw createHttpError(404, "Coupon delivery record not found.");
    const channel = String(req.body.channel || "");
    if (!["email", "whatsapp"].includes(channel)) throw createHttpError(400, "Choose email or WhatsApp delivery.");
    const issue = await PromotionIssue.findById(req.params.issueId).select("customerId customerCouponId couponId emailStatus whatsappStatus");
    if (!issue) throw createHttpError(404, "Coupon delivery record not found.");
    const customer = await Customer.findById(issue.customerId).select("email phone marketingConsent emailVerifiedAt active");
    if (!customer?.active || !customer.emailVerifiedAt || customer.marketingConsent !== true) {
      throw createHttpError(400, "A verified active customer with current promotional consent is required before delivery.");
    }
    if (channel === "email") {
      if (!/^\S+@\S+\.\S+$/.test(String(customer.email || ""))) throw createHttpError(400, "A valid customer email address is required.");
      if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) throw createHttpError(400, "SMTP is not configured.");
    } else {
      if (!/^\d{10,15}$/.test(whatsappProvider.normalizeNumber(customer.phone))) throw createHttpError(400, "A valid customer mobile number is required.");
      const providerStatus = whatsappProvider.getProviderStatus();
      if (providerStatus.provider !== "cloud" || !providerStatus.configured) throw createHttpError(400, "WhatsApp Cloud API is not configured.");
    }
    const couponRecord = issue.customerCouponId
      ? await CustomerCoupon.findById(issue.customerCouponId).populate("couponId")
      : await Coupon.findById(issue.couponId);
    const coupon = issue.customerCouponId ? couponRecord?.couponId : couponRecord;
    const now = new Date();
    const assignmentValid = issue.customerCouponId
      ? couponRecord?.status === "active"
        && couponRecord.redemptionCount < couponRecord.redemptionLimit
        && (!couponRecord.startsAt || couponRecord.startsAt <= now)
        && (!couponRecord.expiresAt || couponRecord.expiresAt > now)
      : true;
    if (!coupon || coupon.status !== "active"
      || (coupon.usageLimit != null && coupon.redemptionCount >= coupon.usageLimit)
      || (coupon.startsAt && coupon.startsAt > now)
      || (coupon.expiresAt && coupon.expiresAt <= now) || !assignmentValid) {
      throw createHttpError(400, "The coupon is no longer active.");
    }
    const statusField = `${channel}Status`;
    const errorField = `${channel}Error`;
    const queued = await PromotionIssue.findOneAndUpdate(
      { _id: issue._id, [statusField]: { $in: ["not_requested", "skipped"] } },
      { $set: { [statusField]: "queued", [errorField]: "", [`${channel}LeaseUntil`]: null } },
      { new: true }
    );
    if (!queued) throw createHttpError(409, "This delivery has already been queued or attempted.");
    res.json({ success: true, message: `${channel === "email" ? "Email" : "WhatsApp"} delivery queued.` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers, getExecutionIssues, getExecutions, getPreview, getSettings, queueIssueDelivery, retryIssueDelivery, revokeAssignment, runManualCampaign, updateSettings };
