const crypto = require("crypto");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const Customer = require("../models/customerModel");
const CustomerCoupon = require("../models/customerCouponModel");
const Order = require("../models/orderModel");
const PromotionExecution = require("../models/promotionExecutionModel");
const PromotionIssue = require("../models/promotionIssueModel");
const Settings = require("../models/settingsModel");
const whatsappProvider = require("./whatsAppCampaignProvider");
const { calculateExpiry, choosePercentage, getPromotionSettings } = require("../utils/promotionSettings");

const currentLocalParts = (date, timezone) => {
  const values = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(values.map((part) => [part.type, part.value]));
};

const localDateKey = (date, timezone) => {
  const p = currentLocalParts(date, timezone);
  return `${p.year}-${p.month}-${p.day}`;
};

const sourceFor = (kind) => ({
  friday: { coupon: "friday_campaign", assignment: "friday_campaign" },
  birthday: { coupon: "birthday_campaign", assignment: "birthday" },
  manual: { coupon: "manual_campaign", assignment: "manual_campaign" },
}[kind]);

const settingsFor = (promotionSettings, kind) => kind === "manual"
  ? promotionSettings.manual
  : promotionSettings[kind];

const findEligibleCustomers = async ({ kind, config, customerIds, now }) => {
  const query = { active: true, contactOnly: { $ne: true }, emailVerifiedAt: { $ne: null } };
  if (Array.isArray(customerIds) && customerIds.length) {
    if (customerIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) throw new Error("One or more selected customer IDs are invalid.");
    query._id = { $in: customerIds.map((id) => new mongoose.Types.ObjectId(id)) };
  }
  let customers = await Customer.find(query).select("_id name email phone dateOfBirth marketingConsent").limit(20000).lean();
  if (kind === "birthday") {
    const target = localDateKey(now, config.timezone || "Asia/Karachi").slice(5);
    customers = customers.filter((customer) => {
      if (!customer.dateOfBirth) return false;
      const birthday = localDateKey(customer.dateOfBirth, config.timezone || "Asia/Karachi").slice(5);
      return birthday === target || (birthday === "02-29" && target === "02-28");
    });
  }
  const statuses = kind === "friday" ? config.eligibleOrderStatuses : kind === "birthday" ? config.eligibleOrderStatuses : ["Completed", "Closed"];
  if (kind !== "birthday" || statuses.length) {
    const orderCustomerIds = await Order.distinct("customerId", {
      customerId: { $in: customers.map((customer) => customer._id) },
      orderStatus: { $in: statuses },
    });
    const eligible = new Set(orderCustomerIds.map(String));
    customers = customers.filter((customer) => eligible.has(String(customer._id)));
  }
  return customers;
};

const getCouponForExecution = async ({ execution, percentage, config, source }) => {
  let coupon = await Coupon.findOne({ promotionExecutionId: execution._id, campaignDiscountPercentage: percentage });
  if (coupon) return coupon;
  try {
    return await Coupon.create({
      name: `${execution.kind} promotion ${percentage}%`.slice(0, 120),
      description: `Private ${execution.kind} promotion generated for execution ${execution.executionKey}.`,
      code: `PROMO_${crypto.randomBytes(16).toString("hex").toUpperCase()}`,
      source: source.coupon,
      promotionExecutionId: execution._id,
      campaignDiscountPercentage: percentage,
      discountType: "percentage",
      discountValue: percentage,
      minimumSubtotal: Number(config.minimumSubtotal || 0),
      maximumDiscount: config.maximumDiscount == null ? null : Number(config.maximumDiscount),
      channels: config.eligibleChannels,
      usageLimit: Math.max(1, Number(execution.counts.eligible || 1)),
      perCustomerLimit: 1,
      startsAt: new Date(),
      expiresAt: null,
      timezone: config.timezone || "Asia/Karachi",
      allowStacking: false,
      status: "active",
    });
  } catch (error) {
    if (error.code !== 11000) throw error;
    coupon = await Coupon.findOne({ promotionExecutionId: execution._id, campaignDiscountPercentage: percentage });
    if (!coupon) throw error;
    return coupon;
  }
};

const recordBirthdaySkip = async ({ execution, customer, assignment, coupon }) => {
  try {
    const [issue] = await PromotionIssue.create([{
      executionId: execution._id,
      customerId: customer._id,
      customerCouponId: assignment._id,
      couponId: coupon._id,
      couponCode: assignment.code,
      discountPercentage: Number(coupon.discountValue),
      expiresAt: assignment.expiresAt,
      status: "skipped",
      skipReason: "A birthday coupon was already issued for this cycle.",
      emailStatus: "not_requested",
      whatsappStatus: "not_requested",
    }]);
    return issue;
  } catch (error) {
    if (error.code !== 11000) throw error;
    const duplicateIssue = await PromotionIssue.findOne({ executionId: execution._id, customerId: customer._id });
    if (!duplicateIssue) throw error;
    return duplicateIssue;
  }
};

const createIssue = async ({ execution, customer, config, source }) => {
  const existingIssue = await PromotionIssue.findOne({ executionId: execution._id, customerId: customer._id });
  if (existingIssue) return existingIssue;
  const now = new Date();
  const expiry = calculateExpiry(config, now, config.timezone || "Asia/Karachi");
  const birthdayYear = localDateKey(now, config.timezone || "Asia/Karachi").slice(0, 4);
  const idempotencyKey = execution.kind === "birthday"
    ? `birthday:${birthdayYear}`
    : `promotion-execution:${execution._id}`;
  let assignment = await CustomerCoupon.findOne({ customerId: customer._id, idempotencyKey });
  if (assignment && execution.kind === "birthday") {
    const priorIssue = await PromotionIssue.findOne({ customerCouponId: assignment._id });
    if (priorIssue) {
      const coupon = await Coupon.findById(assignment.couponId);
      if (!coupon) throw new Error("Previously issued birthday coupon is missing.");
      return recordBirthdaySkip({ execution, customer, assignment, coupon });
    }
  }
  if (!assignment) {
    const percentage = choosePercentage(config);
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) throw new Error("Promotion discount configuration is invalid.");
    const coupon = await getCouponForExecution({ execution, percentage, config, source });
    try {
      assignment = await CustomerCoupon.create({
        couponId: coupon._id,
        customerId: customer._id,
        code: `PRIV_${crypto.randomBytes(18).toString("hex").toUpperCase()}`,
        source: source.assignment,
        idempotencyKey,
        redemptionLimit: 1,
        redemptionCount: 0,
        startsAt: now,
        expiresAt: expiry,
        status: "active",
        assignedBy: execution.createdBy || null,
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      assignment = await CustomerCoupon.findOne({ customerId: customer._id, idempotencyKey });
      if (!assignment) throw error;
    }
  }
  const coupon = await Coupon.findById(assignment.couponId);
  if (!coupon) throw new Error("Coupon assigned to this customer is missing.");
  if (execution.kind === "birthday") {
    const priorIssue = await PromotionIssue.findOne({ customerCouponId: assignment._id });
    if (priorIssue) return recordBirthdaySkip({ execution, customer, assignment, coupon });
  }
  const consent = customer.marketingConsent === true;
  const sendEmail = config.sendEmail === true;
  const sendWhatsApp = config.sendWhatsApp === true;
  let issue;
  try {
    [issue] = await PromotionIssue.create([{
      executionId: execution._id,
      customerId: customer._id,
      customerCouponId: assignment._id,
      couponId: coupon._id,
      couponCode: assignment.code,
      discountPercentage: Number(coupon.discountValue),
      expiresAt: assignment.expiresAt,
      emailStatus: sendEmail ? (consent && customer.email ? "queued" : "skipped") : "not_requested",
      emailError: sendEmail && !consent ? "Marketing consent is not recorded." : sendEmail && !customer.email ? "A valid email address is unavailable." : "",
      whatsappStatus: sendWhatsApp ? (consent && customer.phone ? "queued" : "skipped") : "not_requested",
      whatsappError: sendWhatsApp && !consent ? "Marketing consent is not recorded." : sendWhatsApp && !customer.phone ? "A valid mobile number is unavailable." : "",
    }]);
  } catch (error) {
    if (error.code !== 11000) throw error;
    issue = await PromotionIssue.findOne({ executionId: execution._id, customerId: customer._id });
    if (!issue) throw error;
  }
  return issue;
};

const runPromotion = async ({ kind, trigger, executionKey, createdBy = null, customerIds = null, sendNow }) => {
  const settingsDocument = await Settings.findOne({ key: "global" });
  const promotions = getPromotionSettings(settingsDocument?.promotionSettings);
  const configured = settingsFor(promotions, kind);
  const config = sendNow === undefined
    ? configured
    : { ...configured, sendEmail: sendNow === true && configured.sendEmail === true, sendWhatsApp: sendNow === true && configured.sendWhatsApp === true };
  if (!config) throw new Error("Promotion settings are unavailable.");
  if (trigger === "scheduled" && config.enabled !== true) {
    return { skipped: true, reason: "Promotion generation is disabled." };
  }
  if (trigger === "scheduled" && config.automaticGeneration !== true) {
    return { skipped: true, reason: "Automatic generation is disabled." };
  }
  if (trigger === "manual" && config.enabled === false) throw new Error("This promotion type is disabled in settings.");
  let execution = await PromotionExecution.findOne({ executionKey });
  let createdExecution = false;
  if (execution?.status === "completed") return { execution, duplicate: true };
  if (execution && execution.status === "running" && Date.now() - execution.updatedAt.getTime() < 15 * 60 * 1000) {
    return { execution, duplicate: true, alreadyRunning: true };
  }
  if (!execution) {
    try {
      execution = await PromotionExecution.create({
        kind,
        trigger,
        executionKey,
        settingsSnapshot: config,
        createdBy,
      });
      createdExecution = true;
    } catch (error) {
      if (error.code !== 11000) throw error;
      execution = await PromotionExecution.findOne({ executionKey });
      if (!execution || execution.status === "completed") return { execution, duplicate: true };
    }
  }
  if (!createdExecution && execution.status !== "running") {
    const claim = await PromotionExecution.findOneAndUpdate(
      {
        _id: execution._id,
        status: execution.status,
        updatedAt: execution.updatedAt,
      },
      {
        $set: {
          status: "running",
          error: "",
          startedAt: new Date(),
          completedAt: null,
          counts: { eligible: 0, generated: 0, skipped: 0, failed: 0 },
        },
      },
      { new: true }
    );
    if (!claim) return { execution, duplicate: true, alreadyRunning: true };
    execution = claim;
  } else if (!createdExecution && execution.status === "running") {
    const staleBefore = new Date(Date.now() - 15 * 60 * 1000);
    if (execution.updatedAt > staleBefore) return { execution, duplicate: true, alreadyRunning: true };
    const claim = await PromotionExecution.findOneAndUpdate(
      { _id: execution._id, status: "running", updatedAt: execution.updatedAt },
      {
        $set: {
          error: "",
          startedAt: new Date(),
          completedAt: null,
          counts: { eligible: 0, generated: 0, skipped: 0, failed: 0 },
        },
      },
      { new: true }
    );
    if (!claim) return { execution, duplicate: true, alreadyRunning: true };
    execution = claim;
  }
  try {
    const executionConfig = getPromotionSettings({ [kind]: execution.settingsSnapshot })[kind];
    const customers = await findEligibleCustomers({ kind, config: executionConfig, customerIds, now: new Date() });
    execution.counts.eligible = customers.length;
    await execution.save();
    const source = sourceFor(kind);
    let lastHeartbeat = Date.now();
    for (const customer of customers) {
      try {
        const issue = await createIssue({ execution, customer, config: executionConfig, source });
        if (issue.status === "generated") execution.counts.generated += 1;
        else execution.counts.skipped += 1;
      } catch (error) {
        execution.counts.failed += 1;
        console.error("Coupon assignment failed for a promotion customer.", {
          executionId: String(execution._id),
          customerId: String(customer._id),
          message: String(error.message || "Assignment failed").slice(0, 200),
        });
      }
      if (Date.now() - lastHeartbeat >= 60 * 1000) {
        await execution.save();
        lastHeartbeat = Date.now();
      }
    }
    execution.status = execution.counts.failed ? (execution.counts.generated ? "partial" : "failed") : "completed";
    execution.completedAt = new Date();
    await execution.save();
    return { execution };
  } catch (error) {
    execution.status = "failed";
    execution.error = String(error.message || "Promotion execution failed.").slice(0, 500);
    execution.completedAt = new Date();
    await execution.save();
    throw error;
  }
};

const previewPromotion = async ({ kind, customerIds = null }) => {
  const settingsDocument = await Settings.findOne({ key: "global" });
  const promotions = getPromotionSettings(settingsDocument?.promotionSettings);
  const config = settingsFor(promotions, kind);
  if (!config) throw new Error("Promotion settings are unavailable.");
  const customers = await findEligibleCustomers({ kind, config, customerIds, now: new Date() });
  return {
    eligible: customers.length,
    emailEligible: customers.filter((customer) => /^\S+@\S+\.\S+$/.test(String(customer.email || "")) && customer.marketingConsent === true).length,
    whatsappEligible: customers.filter((customer) => /^\d{10,15}$/.test(whatsappProvider.normalizeNumber(customer.phone)) && customer.marketingConsent === true).length,
  };
};

const runScheduledPromotions = async (now = new Date()) => {
  const settingsDocument = await Settings.findOne({ key: "global" });
  const promotions = getPromotionSettings(settingsDocument?.promotionSettings);
  const friday = promotions.friday;
  const fridayParts = currentLocalParts(now, friday.timezone || "Asia/Karachi");
  if (friday.automaticGeneration) {
    const today = new Date(Date.UTC(Number(fridayParts.year), Number(fridayParts.month) - 1, Number(fridayParts.day)));
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(fridayParts.weekday);
    let daysSinceFriday = (weekday - 5 + 7) % 7;
    if (daysSinceFriday === 0 && `${fridayParts.hour}:${fridayParts.minute}` < String(friday.generationTime || "18:00")) daysSinceFriday = 7;
    today.setUTCDate(today.getUTCDate() - daysSinceFriday);
    const fridayKey = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
    const scheduledTime = `${fridayParts.hour}:${fridayParts.minute}`;
    if (daysSinceFriday > 0 || scheduledTime >= String(friday.generationTime || "18:00")) {
      await runPromotion({ kind: "friday", trigger: "scheduled", executionKey: `friday:${fridayKey}` });
    }
  }

  const birthday = promotions.birthday;
  const birthdayParts = currentLocalParts(now, birthday.timezone || "Asia/Karachi");
  if (birthday.automaticGeneration && `${birthdayParts.hour}:${birthdayParts.minute}` >= String(birthday.processingTime || "09:00")) {
    await runPromotion({ kind: "birthday", trigger: "scheduled", executionKey: `birthday:${birthdayParts.year}-${birthdayParts.month}-${birthdayParts.day}` });
  }
};

module.exports = { previewPromotion, runPromotion, runScheduledPromotions };
