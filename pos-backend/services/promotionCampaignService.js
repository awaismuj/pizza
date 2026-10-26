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
const { createCustomerCouponCode } = require("../utils/customerCouponCode");
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
  if (config.requireMarketingConsent === true) query.marketingConsent = true;
  if (Array.isArray(customerIds) && customerIds.length) {
    if (customerIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) throw new Error("One or more selected customer IDs are invalid.");
    query._id = { $in: customerIds.map((id) => new mongoose.Types.ObjectId(id)) };
  }
  let customers = await Customer.find(query).select("_id name email phone dateOfBirth marketingConsent").limit(20001).lean();
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

const getCouponForExecution = async ({ execution, discountValue, config, source, codeSettings }) => {
  const discountKey = `${config.discountType}:${discountValue}`;
  let coupon = await Coupon.findOne({ promotionExecutionId: execution._id, campaignDiscountKey: discountKey });
  if (!coupon && config.discountType === "percentage") {
    coupon = await Coupon.findOne({ promotionExecutionId: execution._id, campaignDiscountPercentage: discountValue });
  }
  if (coupon) return coupon;
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await Coupon.create({
        name: `${config.campaignName || execution.kind} ${config.discountType === "percentage" ? `${discountValue}%` : `Rs ${discountValue}`}`.slice(0, 120),
        description: `${String(config.description || `Private ${execution.kind} promotion.`).slice(0, 700)} Generated for execution ${execution.executionKey}.`,
        code: createCustomerCouponCode(codeSettings),
        source: source.coupon,
        promotionExecutionId: execution._id,
        campaignDiscountKey: discountKey,
        campaignDiscountPercentage: config.discountType === "percentage" ? discountValue : null,
        discountType: config.discountType,
        discountValue,
        minimumSubtotal: Number(config.minimumSubtotal || 0),
        maximumDiscount: config.maximumDiscount == null ? null : Number(config.maximumDiscount),
        channels: config.eligibleChannels,
        usageLimit: Math.max(1, Math.min(
          Number(execution.counts.eligible || 1) * Number(config.redemptionLimitPerCustomer || 1),
          config.maxCampaignRedemptions == null ? Number.MAX_SAFE_INTEGER : Number(config.maxCampaignRedemptions)
        )),
        perCustomerLimit: Number(config.redemptionLimitPerCustomer || 1),
        startsAt: new Date(),
        expiresAt: null,
        timezone: config.timezone || "Asia/Karachi",
        allowStacking: config.allowStacking === true,
        status: "active",
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      coupon = await Coupon.findOne({ promotionExecutionId: execution._id, campaignDiscountKey: discountKey });
      if (!coupon && config.discountType === "percentage") {
        coupon = await Coupon.findOne({ promotionExecutionId: execution._id, campaignDiscountPercentage: discountValue });
      }
      if (coupon) return coupon;
      lastError = error;
    }
  }
  throw lastError || new Error("Could not allocate a unique campaign coupon code.");
};

const recordBirthdaySkip = async ({ execution, customer, assignment, coupon }) => {
  try {
    const [issue] = await PromotionIssue.create([{
      executionId: execution._id,
      customerId: customer._id,
      customerCouponId: assignment._id,
      couponId: coupon._id,
      couponCode: assignment.code,
      discountType: coupon.discountType || "percentage",
      discountPercentage: coupon.discountType === "percentage" ? Number(coupon.discountValue) : null,
      discountValue: Number(coupon.discountValue),
      minimumSubtotal: Number(coupon.minimumSubtotal || 0),
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

const createIssue = async ({ execution, customer, config, source, codeSettings }) => {
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
    const discountValue = choosePercentage(config);
    if (!Number.isFinite(discountValue) || discountValue <= 0
      || (config.discountType === "percentage" && discountValue > 100)
      || (config.discountType === "fixed" && discountValue > 10000000)) {
      throw new Error("Promotion discount configuration is invalid.");
    }
    if (config.discountType === "fixed" && config.sendWhatsApp) {
      throw new Error("Automated WhatsApp template delivery supports percentage discounts only.");
    }
    const coupon = await getCouponForExecution({ execution, discountValue, config, source, codeSettings });
    for (let attempt = 0; attempt < 5 && !assignment; attempt += 1) {
      try {
        assignment = await CustomerCoupon.create({
          couponId: coupon._id,
          customerId: customer._id,
          code: createCustomerCouponCode(codeSettings),
          source: source.assignment,
          idempotencyKey,
          redemptionLimit: Number(config.redemptionLimitPerCustomer || 1),
          redemptionCount: 0,
          startsAt: now,
          expiresAt: expiry,
          status: "active",
          assignedBy: execution.createdBy || null,
        });
      } catch (error) {
        if (error.code !== 11000) throw error;
        assignment = await CustomerCoupon.findOne({ customerId: customer._id, idempotencyKey });
        if (!assignment && attempt === 4) throw error;
      }
    }
    if (!assignment) throw new Error("Could not allocate a unique short coupon code after several attempts.");
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
      discountType: coupon.discountType || "percentage",
      discountPercentage: coupon.discountType === "percentage" ? Number(coupon.discountValue) : null,
      discountValue: Number(coupon.discountValue),
      minimumSubtotal: Number(coupon.minimumSubtotal || 0),
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
  const now = new Date();
  if (config.startsAt && new Date(config.startsAt) > now) throw new Error("This campaign has not reached its configured start date.");
  if (config.endsAt && new Date(config.endsAt) <= now) throw new Error("This campaign has ended.");
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
        settingsSnapshot: { ...config, global: promotions.global },
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
    const codeSettings = execution.settingsSnapshot?.global || getPromotionSettings(settingsDocument?.promotionSettings).global;
    const maxCoupons = Number(executionConfig.maxCouponsPerExecution || 20000);
    const customers = await findEligibleCustomers({ kind, config: executionConfig, customerIds, now: new Date() });
    const boundedCustomers = customers.slice(0, maxCoupons);
    execution.counts.eligible = boundedCustomers.length;
    await execution.save();
    const source = sourceFor(kind);
    let lastHeartbeat = Date.now();
    for (const customer of boundedCustomers) {
      try {
        const issue = await createIssue({ execution, customer, config: executionConfig, source, codeSettings });
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
  const generationLimit = Number(config.maxCouponsPerExecution || 20000);
  return {
    eligible: Math.min(customers.length, generationLimit),
    eligibleTotal: customers.length,
    generationLimit,
    capped: customers.length > generationLimit,
    emailEligible: customers.slice(0, generationLimit).filter((customer) => /^\S+@\S+\.\S+$/.test(String(customer.email || "")) && customer.marketingConsent === true).length,
    whatsappEligible: customers.slice(0, generationLimit).filter((customer) => /^\d{10,15}$/.test(whatsappProvider.normalizeNumber(customer.phone)) && customer.marketingConsent === true).length,
  };
};

const runScheduledPromotions = async (now = new Date()) => {
  const settingsDocument = await Settings.findOne({ key: "global" });
  const promotions = getPromotionSettings(settingsDocument?.promotionSettings);
  const friday = promotions.friday;
  const fridayParts = currentLocalParts(now, friday.timezone || "Asia/Karachi");
  if (friday.automaticGeneration) {
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(fridayParts.weekday);
    const today = new Date(Date.UTC(Number(fridayParts.year), Number(fridayParts.month) - 1, Number(fridayParts.day)));
    const fridayKey = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
    const scheduledTime = `${fridayParts.hour}:${fridayParts.minute}`;
    if (weekday === 5 && scheduledTime >= String(friday.generationTime || "18:00")) {
      await runPromotion({ kind: "friday", trigger: "scheduled", executionKey: `friday:${fridayKey}` });
    }
  }

  const birthday = promotions.birthday;
  const birthdayParts = currentLocalParts(now, birthday.timezone || "Asia/Karachi");
  if (birthday.automaticGeneration && `${birthdayParts.hour}:${birthdayParts.minute}` >= String(birthday.processingTime || "09:00")) {
    await runPromotion({ kind: "birthday", trigger: "scheduled", executionKey: `birthday:${birthdayParts.year}-${birthdayParts.month}-${birthdayParts.day}` });
  }
};

module.exports = { createCustomerCouponCode, previewPromotion, runPromotion, runScheduledPromotions };
