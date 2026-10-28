const crypto = require("crypto");
const Customer = require("../models/customerModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const normalizePakistaniMobile = require("../utils/normalizePakistaniMobile");
const pakistaniMobileKey = require("../utils/pakistaniMobileKey");
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
const shortCouponCode = async () => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const code = generateCouponCode();
    const codeExists = await Coupon.exists({
      $or: [
        { codeKey: code.toUpperCase() },
        { code: { $regex: `^${code}$`, $options: "i" } },
      ],
    });
    if (!codeExists) return code;
  }
  throw new Error("Could not generate an available short coupon code.");
};

const updateExistingRecipient = async (coupon, customer, accountCustomerIds, recipientPhoneKey) => {
  const updates = {};
  if (!String(coupon.recipientName || "").trim() && customer.name) updates.recipientName = customer.name;
  if (!String(coupon.recipientPhone || "").trim() && customer.phone) updates.recipientPhone = customer.phone;
  if (!String(coupon.recipientEmail || "").trim() && customer.email) updates.recipientEmail = customer.email;
  if (!coupon.recipientPhoneKey && recipientPhoneKey) updates.recipientPhoneKey = recipientPhoneKey;
  if (!coupon.customerId && customer.customerId) updates.customerId = customer.customerId;
  if (!coupon.eligibleCustomerIds?.length && accountCustomerIds.length) {
    updates.eligibleCustomerIds = accountCustomerIds;
  }
  if (recipientPhoneKey && !coupon.eligibleCustomerKeys?.length && !accountCustomerIds.length) {
    updates.eligibleCustomerKeys = [`phone:${recipientPhoneKey}`];
  }
  if (
    coupon.campaignType === "friday" &&
    /^WACMP_[0-9A-F]{32}$/i.test(coupon.code || "") &&
    coupon.isActive &&
    coupon.redeemedCount === 0 &&
    coupon.reservedCount === 0
  ) {
    const replacementCode = await shortCouponCode();
    updates.code = replacementCode;
    updates.codeKey = replacementCode.toUpperCase();
  }
  if (Object.keys(updates).length) {
    await Coupon.updateOne({ _id: coupon._id }, { $set: updates });
    Object.assign(coupon, updates);
  }
  return {
    coupon,
    updated: Object.keys(updates).length > 0,
    codeShortened: Object.prototype.hasOwnProperty.call(updates, "code"),
  };
};

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
  const accountCustomerId = customer.customerId ||
    (customer.accountCustomer === false ? null : customer._id);
  const accountCustomerIds = [...new Set(
    (customer.customerIds || (accountCustomerId ? [accountCustomerId] : []))
      .filter(Boolean)
      .map(String)
  )];
  const recipientPhoneKey = customer.recipientPhoneKey ||
    (customer.phone ? pakistaniMobileKey(customer.phone) : "");
  const campaignIdentity = accountCustomerId
    ? String(accountCustomerId)
    : recipientPhoneKey
      ? `phone:${recipientPhoneKey}`
      : String(customer._id);
  const campaignKey = `${campaignType}:${campaignCycle}:${campaignIdentity}`;
  if (campaignKey) {
    const existing = await Coupon.findOne({ campaignKey });
    if (existing) {
      return {
        ...(await updateExistingRecipient(existing, customer, accountCustomerIds, recipientPhoneKey)),
        created: false,
      };
    }
  }
  if (customerIds.length) {
    const existingForCustomer = await Coupon.findOne({
      campaignType,
      campaignCycle,
      customerId: { $in: customerIds },
    });
    if (existingForCustomer) {
      return {
        ...(await updateExistingRecipient(existingForCustomer, customer, accountCustomerIds, recipientPhoneKey)),
        created: false,
      };
    }
  }

  const discountValue = campaignType === "birthday" && settings.discountMode === "fixed"
    ? Number(settings.fixedPercentage)
    : randomPercentage(settings.percentages);
  const expiresAt = expiryDate({ now, hours: settings.expiryHours });

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = await shortCouponCode();
    try {
      const coupon = await Coupon.create({
        code,
        codeKey: code.toUpperCase(),
        name: campaignNameFor(campaignType, settings),
        description: `${discountValue}% off for ${customer.name || "customer"}.`,
        campaignType,
        campaignCycle,
        ...(campaignKey ? { campaignKey } : {}),
        customerId: accountCustomerId,
        recipientName: customer.name || "",
        recipientPhone: customer.phone || "",
        recipientPhoneKey,
        recipientEmail: customer.email || "",
        eligibleCustomerIds: accountCustomerIds,
        eligibleCustomerKeys: accountCustomerId || !recipientPhoneKey
          ? []
          : [`phone:${recipientPhoneKey}`],
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
      return { coupon, created: true, updated: false, codeShortened: false };
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
  const customerById = new Map();
  for await (const customer of customerCursor) {
    const record = { ...customer, accountCustomer: true, customerId: customer._id };
    customers.push(record);
    customerById.set(String(customer._id), record);
  }
  const phoneAccount = new Map();
  for (const customer of customers) {
    const mobile = normalizePakistaniMobile(customer.phone);
    if (mobile && !phoneAccount.has(mobile)) phoneAccount.set(mobile, customer);
  }

  let ordersWithoutMobile = 0;
  const orderCursor = Order.find({})
    .select("_id customerId customerDetails.name customerDetails.phone")
    .lean()
    .cursor({ batchSize: GENERATION_BATCH_SIZE });
  for await (const order of orderCursor) {
    const linkedById = customerById.get(String(order.customerId));
    const mobile = normalizePakistaniMobile(order.customerDetails?.phone);
    if (linkedById) {
      if (!String(linkedById.name || "").trim()) {
        linkedById.name = String(order.customerDetails?.name || "").trim();
      }
      if (!String(linkedById.phone || "").trim()) {
        linkedById.phone = String(order.customerDetails?.phone || "").trim();
      }
      continue;
    }
    if (!mobile) {
      ordersWithoutMobile += 1;
      continue;
    }
    const linkedCustomer = phoneAccount.get(mobile);
    if (linkedCustomer) {
      if (!String(linkedCustomer.name || "").trim()) {
        linkedCustomer.name = String(order.customerDetails?.name || "").trim();
      }
      if (!String(linkedCustomer.phone || "").trim()) {
        linkedCustomer.phone = String(order.customerDetails?.phone || "").trim();
      }
      continue;
    }
    customers.push({
      _id: `order:${String(order._id)}`,
      name: order.customerDetails?.name || "",
      phone: order.customerDetails?.phone || "",
      email: "",
      customerId: null,
      accountCustomer: false,
      recipientPhoneKey: pakistaniMobileKey(mobile),
    });
  }

  const deduplicated = deduplicateCustomers(customers);
  let generated = 0;
  let alreadyIssued = 0;
  let updatedExisting = 0;
  let codesShortened = 0;
  let errors = 0;
  let processed = 0;
  const errorSamples = [];
  const batchesTotal = Math.ceil(deduplicated.customers.length / GENERATION_BATCH_SIZE);

  for (let start = 0; start < deduplicated.customers.length; start += GENERATION_BATCH_SIZE) {
    const batch = deduplicated.customers.slice(start, start + GENERATION_BATCH_SIZE);
    for (const { customer, members } of batch) {
      processed += 1;
      try {
        const accountIds = [...new Set(
          members
            .map((member) => member.customerId || (member.accountCustomer ? member._id : null))
            .filter(Boolean)
            .map(String)
        )];
        const primaryAccountId = accountIds[0] || null;
        const result = await issueCoupon({
          customer: {
            ...customer,
            customerId: primaryAccountId,
            accountCustomer: Boolean(primaryAccountId),
            customerIds: accountIds,
            recipientPhoneKey: customer.phone
              ? pakistaniMobileKey(customer.phone)
              : "",
          },
          customerIds: accountIds,
          campaignType: "friday",
          campaignCycle,
          settings,
          now,
        });
        if (result.created) generated += 1;
        else {
          alreadyIssued += 1;
          if (result.updated) updatedExisting += 1;
          if (result.codeShortened) codesShortened += 1;
        }
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
    updatedExisting,
    codesShortened,
    campaignCycle,
    totalCustomers: customers.length,
    eligible: deduplicated.customers.length,
    skippedNoContact: ordersWithoutMobile,
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
