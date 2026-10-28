const crypto = require("crypto");
const Customer = require("../models/customerModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const {
  generateCouponCode,
  expiryDate,
  isCustomerBirthday,
  fridayCampaignCycle,
} = require("../utils/couponCampaignRules");

const SUCCESS_STATUSES = ["Completed", "Closed"];
const DISCOUNT_LABELS = {
  welcome: "Welcome",
  friday: "Friday",
  birthday: "Birthday",
};

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

const issueCoupon = async ({ customer, campaignType, campaignCycle, settings, now = new Date() }) => {
  const campaignKey = `${campaignType}:${campaignCycle}:${String(customer._id)}`;
  if (campaignKey) {
    const existing = await Coupon.findOne({ campaignKey });
    if (existing) return { coupon: existing, created: false };
  }

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
        name: `${DISCOUNT_LABELS[campaignType]} coupon`,
        description: `${discountValue}% off for ${customer.name}.`,
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
  const customers = await Customer.find({ active: true })
    .select("_id name email phone dateOfBirth")
    .lean();
  let generated = 0;
  let skipped = 0;

  for (const customer of customers) {
    const result = await issueCoupon({
      customer,
      campaignType: "friday",
      campaignCycle,
      settings,
      now,
    });
    if (result.created) generated += 1;
    else skipped += 1;
  }
  return { generated, skipped, campaignCycle, eligible: customers.length };
};

const generateBirthdayCoupons = async ({ now = new Date(), settings, timezone }) => {
  const currentYear = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
  }).format(now);
  const customers = await Customer.find({
    active: true,
    dateOfBirth: { $type: "date" },
  }).select("_id name email phone dateOfBirth").lean();
  let generated = 0;
  let skipped = 0;
  let eligible = 0;

  for (const customer of customers) {
    if (!isCustomerBirthday(customer.dateOfBirth, now, timezone)) continue;
    eligible += 1;
    const result = await issueCoupon({
      customer,
      campaignType: "birthday",
      campaignCycle: currentYear,
      settings,
      now,
    });
    if (result.created) generated += 1;
    else skipped += 1;
  }
  return { generated, skipped, campaignCycle: currentYear, eligible };
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
