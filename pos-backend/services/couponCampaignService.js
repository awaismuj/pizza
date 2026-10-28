const crypto = require("crypto");
const Customer = require("../models/customerModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const {
  generateCouponCode,
  expiryDate,
  isCustomerBirthday,
  birthdayCampaignCycle,
  fridayCampaignCycle,
  deduplicateCustomers,
} = require("../utils/couponCampaignRules");

const SUCCESS_STATUSES = ["Completed", "Closed"];
const GENERATION_BATCH_SIZE = 100;
const DISCOUNT_LABELS = {
  welcome: "Welcome",
  friday: "Friday",
  birthday: "Birthday",
};

const campaignNameFor = (campaignType, settings) =>
  String(settings.campaignName || DISCOUNT_LABELS[campaignType]).trim();

const randomPercentage = (percentages) => percentages[crypto.randomInt(0, percentages.length)];

const hasPriorSuccessfulOrder = async (customer) => {
  const suffix = String(customer.phone || "").replace(/\D/g, "").slice(-9);
  const byCustomer = await Order.exists({
    $or: [
      { customerId: customer._id },
      ...(suffix.length >= 7 ? [{ "customerDetails.phone": { $regex: `${suffix}$` } }] : []),
    ],
    orderStatus: { $in: SUCCESS_STATUSES },
  });
  return Boolean(byCustomer);
};

const issueCoupon = async ({
  customer,
  customerIds = [customer._id],
  campaignType,
  campaignCycle,
  settings,
  now = new Date(),
}) => {
  const campaignKey = `${campaignType}:${campaignCycle}:${String(customer._id)}`;
  if (campaignKey) {
    const existing = await Coupon.findOne({ campaignKey });
    if (existing) return { coupon: existing, created: false };
  }
  const existingForCustomer = await Coupon.findOne({
    campaignType,
    campaignCycle,
    customerId: { $in: customerIds },
  });
  if (existingForCustomer) return { coupon: existingForCustomer, created: false };

  const discountValue = campaignType === "birthday" && settings.discountMode === "fixed"
    ? Number(settings.fixedPercentage)
    : randomPercentage(settings.percentages);
  const expiresAt = expiryDate({ now, hours: settings.expiryHours });

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateCouponCode();
    const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const codeExists = await Coupon.exists({
      $or: [
        { codeKey: code.toUpperCase() },
        { code: { $regex: `^${escapedCode}$`, $options: "i" } },
      ],
    });
    if (codeExists) continue;
    try {
      const coupon = await Coupon.create({
        code,
        codeKey: code.toUpperCase(),
        name: campaignNameFor(campaignType, settings),
        description: `${discountValue}% off for ${customer.name || "customer"}.`,
        campaignType,
        campaignCycle,
        ...(campaignKey ? { campaignKey } : {}),
        customerId: customer._id,
        eligibleCustomerIds: [customer._id],
        discountType: "percentage",
        discountValue,
        minimumOrderAmount: Number(settings.minimumSubtotal) || 0,
        startsAt: now,
        expiresAt,
        totalUsageLimit: 1,
        usageLimitPerCustomer: 1,
        isActive: true,
        createdBy: { name: "Coupon campaign" },
      });
      return { coupon, created: true };
    } catch (error) {
      if (error.code !== 11000) throw error;
      if (campaignKey && (error.keyPattern?.campaignKey || error.keyValue?.campaignKey)) {
        const existing = await Coupon.findOne({ campaignKey });
        if (existing) return { coupon: existing, created: false };
      }
      if (!(error.keyPattern?.code || error.keyPattern?.codeKey || error.keyValue?.code || error.keyValue?.codeKey)) {
        throw error;
      }
    }
  }
  throw new Error("Could not generate a unique coupon code after several attempts.");
};

const generateFridayCoupons = async ({ now = new Date(), settings, timezone }) => {
  const campaignCycle = fridayCampaignCycle(now, timezone);
  const customerCursor = Customer.find({ active: true })
    .select("_id name email phone")
    .lean()
    .cursor({ batchSize: GENERATION_BATCH_SIZE });
  const customers = [];
  for await (const customer of customerCursor) customers.push(customer);

  const deduplicated = deduplicateCustomers(customers);
  let generated = 0;
  let alreadyIssued = 0;
  let errors = 0;
  let processed = 0;
  const errorSamples = [];
  const batchesTotal = Math.ceil(deduplicated.customers.length / GENERATION_BATCH_SIZE);

  for (let start = 0; start < deduplicated.customers.length; start += GENERATION_BATCH_SIZE) {
    const batch = deduplicated.customers.slice(start, start + GENERATION_BATCH_SIZE);
    for (const { customer, customerIds } of batch) {
      processed += 1;
      try {
        const result = await issueCoupon({
          customer,
          customerIds,
          campaignType: "friday",
          campaignCycle,
          settings,
          now,
        });
        if (result.created) generated += 1;
        else alreadyIssued += 1;
      } catch (error) {
        errors += 1;
        console.error("Friday coupon generation failed for a customer:", error.message || error);
        if (errorSamples.length < 10) {
          errorSamples.push({
            customerId: String(customer._id),
            message: "Coupon generation failed for this customer. Review server logs before retrying.",
          });
        }
      }
    }
  }
  return {
    generated,
    skipped: deduplicated.duplicateCount + alreadyIssued,
    errors,
    errorSamples,
    duplicateCustomers: deduplicated.duplicateCount,
    alreadyIssued,
    campaignCycle,
    totalCustomers: customers.length,
    eligible: deduplicated.customers.length,
    processed,
    batchesProcessed: batchesTotal,
    batchesTotal,
  };
};

const generateBirthdayCoupons = async ({ now = new Date(), settings, timezone }) => {
  if (!settings.enabled) {
    return { generated: 0, skipped: 0, errors: 0, totalCustomers: 0, eligible: 0 };
  }
  const currentYear = birthdayCampaignCycle(now, timezone);
  const totalCustomers = await Customer.countDocuments({ active: true });
  const customerCursor = Customer.find({
    active: true,
    dateOfBirth: { $type: "date" },
  }).select("_id name email phone dateOfBirth").lean().cursor({ batchSize: GENERATION_BATCH_SIZE });
  let generated = 0;
  let skipped = 0;
  let errors = 0;
  let eligible = 0;
  const errorSamples = [];

  for await (const customer of customerCursor) {
    if (!isCustomerBirthday(customer.dateOfBirth, now, timezone)) continue;
    eligible += 1;
    try {
      const result = await issueCoupon({
        customer,
        campaignType: "birthday",
        campaignCycle: currentYear,
        settings,
        now,
      });
      if (result.created) generated += 1;
      else skipped += 1;
    } catch (error) {
      errors += 1;
      console.error("Birthday coupon generation failed for a customer:", error.message || error);
      if (errorSamples.length < 10) {
        errorSamples.push({
          customerId: String(customer._id),
          message: "Coupon generation failed for this customer. The scheduler will retry.",
        });
      }
    }
  }
  return {
    generated,
    skipped,
    errors,
    errorSamples,
    campaignCycle: currentYear,
    totalCustomers,
    eligible,
  };
};

const generateWelcomeCoupon = async ({ customer, settings, now = new Date() }) => {
  if (await hasPriorSuccessfulOrder(customer)) {
    return { eligible: false, coupon: null };
  }
  const priorCoupons = await Coupon.find({
    campaignType: "welcome",
    customerId: customer._id,
  }).sort({ createdAt: -1 }).limit(1);
  const existing = priorCoupons[0];
  if (existing?.isActive && existing.expiresAt > now && existing.redeemedCount === 0) {
    return { eligible: true, coupon: existing, existing: true };
  }
  if (settings.maxOnePerCustomer && existing) {
    return { eligible: false, coupon: null };
  }
  const result = await issueCoupon({
    customer,
    campaignType: "welcome",
    campaignCycle: settings.maxOnePerCustomer
      ? "welcome"
      : `welcome:${now.toISOString().slice(0, 10)}`,
    settings,
    now,
  });
  return { eligible: true, coupon: result.coupon, existing: !result.created };
};

module.exports = {
  hasPriorSuccessfulOrder,
  issueCoupon,
  generateFridayCoupons,
  generateBirthdayCoupons,
  generateWelcomeCoupon,
};
