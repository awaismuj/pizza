const crypto = require("crypto");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const CustomerCoupon = require("../models/customerCouponModel");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const Dish = require("../models/dishModel");
const Deal = require("../models/dealModel");
const { isDealLiveNow } = require("../controllers/dealController");
const { calculateCoupon, normalizeCouponCode } = require("./couponRules");
const { getOrCreateSettings } = require("../controllers/settingsController");
const { normalizeByoConfig, byoDiscountPercent } = require("../utils/byoDiscount");
const Settings = require("../models/settingsModel");
const PromotionExecution = require("../models/promotionExecutionModel");
const PromotionIssue = require("../models/promotionIssueModel");
const customerPhoneKey = require("../utils/customerPhoneKey");
const { createCustomerCouponCode } = require("../utils/customerCouponCode");
const { calculateExpiry, getPromotionSettings } = require("../utils/promotionSettings");

const normalizePhoneDigits = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    throw createHttpError(400, "Enter a valid mobile number to use a coupon.");
  }
  return digits;
};

const customerKeyFor = (phone) => {
  const digits = normalizePhoneDigits(phone);
  return customerPhoneKey(digits);
};

const getWelcomeOfferConfig = async (now = new Date()) => {
  const settings = await getOrCreateSettings();
  const promotionSettings = getPromotionSettings(settings.promotionSettings);
  const legacyConfig = settings.firstTimeCustomerOffer || {
    enabled: false,
    minimumSubtotal: 1000,
    percentages: [5, 7, 10],
    selectionMethod: "random",
    maxDiscountAmount: null,
    startsAt: null,
    expiresAt: null,
    maxCampaignRedemptions: null,
    maxOnePerCustomer: true,
    eligibleChannels: ["Online", "POS", "Pickup", "Delivery"],
    popupTitle: "Welcome to our Pizza Store!",
    popupDescription: "You're eligible for a special first-order reward.",
    applyButtonLabel: "Apply Discount",
    declineButtonLabel: "No Thanks",
  };
  const storedPromotionSettings = settings.promotionSettings;
  const promoWelcome = storedPromotionSettings ? promotionSettings.welcome : null;
  const config = promoWelcome
    ? {
        ...legacyConfig,
        ...promoWelcome,
        expiresAt: promoWelcome.endsAt,
        maxDiscountAmount: promoWelcome.maximumDiscount,
      }
    : legacyConfig;

  const validPercentages = Array.isArray(config.percentages)
    ? config.percentages.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0 && value <= 100)
    : [];

  const hasActiveWindow = !config.startsAt || config.startsAt <= now;
  const isActive = Boolean(config.enabled && hasActiveWindow && (!config.expiresAt || config.expiresAt >= now));

  return {
    ...config,
    codeSettings: promotionSettings.global,
    redemptionCount: Number(settings.welcomeOfferRedemptionCount || 0),
    validPercentages,
    enabled: Boolean(config.enabled),
    isActive,
  };
};

const chooseWelcomeOfferDiscount = (config) => {
  if (config.discountType === "fixed") return Number(config.fixedAmount);
  const pool = [...new Set((config.validPercentages || []).map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0))];
  if (!pool.length) return null;
  return pool[crypto.randomInt(pool.length)];
};

const calculateEligibleSubtotal = async (items, channel = "Online", session = null) => {
  const resolved = await resolveCartPrices(items, session);
  const existingDiscount = await getExistingDiscount(resolved, channel);
  const grossSubtotal = resolved.reduce((sum, item) => sum + item.subtotal, 0);
  return Math.max(0, grossSubtotal - existingDiscount);
};

const recordWelcomeCouponIssue = async ({ coupon, customer, config }) => {
  if (!customer?._id) return;
  const executionKey = `welcome:${coupon._id}`;
  let execution = await PromotionExecution.findOne({ executionKey });
  if (!execution) {
    try {
      execution = await PromotionExecution.create({
        kind: "welcome",
        trigger: "automatic",
        executionKey,
        status: "completed",
        settingsSnapshot: config,
        startedAt: new Date(),
        completedAt: new Date(),
        counts: { eligible: 1, generated: 1, skipped: 0, failed: 0 },
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      execution = await PromotionExecution.findOne({ executionKey });
      if (!execution) throw error;
    }
  }
  const marketingConsent = customer.marketingConsent === true;
  try {
    await PromotionIssue.create({
      executionId: execution._id,
      customerId: customer._id,
      couponId: coupon._id,
      couponCode: coupon.code,
      discountType: coupon.discountType || "percentage",
      discountPercentage: coupon.discountType === "percentage" ? Number(coupon.discountValue) : null,
      discountValue: Number(coupon.discountValue),
      minimumSubtotal: Number(coupon.minimumSubtotal || 0),
      expiresAt: coupon.expiresAt,
      emailStatus: config.sendEmail
        ? (marketingConsent && customer.email ? "queued" : "skipped")
        : "not_requested",
      emailError: config.sendEmail && !marketingConsent
        ? "Marketing consent is not recorded."
        : config.sendEmail && !customer.email ? "A valid email address is unavailable." : "",
      whatsappStatus: config.sendWhatsApp
        ? (marketingConsent && customer.phone ? "queued" : "skipped")
        : "not_requested",
      whatsappError: config.sendWhatsApp && !marketingConsent
        ? "Marketing consent is not recorded."
        : config.sendWhatsApp && !customer.phone ? "A valid mobile number is unavailable." : "",
    });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
};

const buildWelcomeOfferCoupon = async ({ customerId, customer: customerRecord, phone, channel, subtotal, session, now = new Date() }) => {
  const config = await getWelcomeOfferConfig(now);
  if (channel === "Online" && config.codeSettings?.onlineCouponEntryEnabled === false) {
    return { eligible: false, reason: "coupon-entry-disabled" };
  }
  if (!config.isActive || !Array.isArray(config.eligibleChannels) || !config.eligibleChannels.includes(channel)) {
    return { eligible: false, reason: "offer-not-active-for-channel" };
  }

  const digits = normalizePhoneDigits(phone);
  const customerKey = customerKeyFor(digits);
  const phoneSuffix = digits.slice(-9);

  const hasPreviousOrder = await Order.exists({
    orderStatus: { $ne: "Cancelled" },
    ...(customerId
      ? { $or: [{ customerId }, { "customerDetails.phone": { $regex: `${phoneSuffix}$` } }] }
      : { "customerDetails.phone": { $regex: `${phoneSuffix}$` } }),
  }).session(session || null);
  if (hasPreviousOrder) {
    return { eligible: false, reason: "existing-customer" };
  }

  if (Number(subtotal) < Number(config.minimumSubtotal || 0)) {
    return { eligible: false, reason: "subtotal-too-low", minimumSubtotal: Number(config.minimumSubtotal || 0), subtotal: Number(subtotal || 0) };
  }

  let created = await Coupon.findOne({ source: "welcome", welcomeCustomerKey: customerKey })
    .select("+welcomeCustomerKey")
    .session(session || null);
  let alreadyAssigned = Boolean(created);
  if (!created) {
    if (config.maxCampaignRedemptions != null && Number(config.redemptionCount || 0) >= Number(config.maxCampaignRedemptions)) {
      return { eligible: false, reason: "campaign-limit-reached" };
    }
    const discountValue = chooseWelcomeOfferDiscount(config);
    if (!Number.isFinite(discountValue) || discountValue <= 0
      || (config.discountType !== "fixed" && discountValue > 100)
      || (config.discountType === "fixed" && discountValue > 10000000)) {
      return { eligible: false, reason: "no-valid-discount" };
    }
    const welcomeChannels = config.eligibleChannels.filter((entry) => ["Online", "POS"].includes(entry));
    if (!welcomeChannels.length) return { eligible: false, reason: "offer-not-active-for-channel" };
    for (let attempt = 0; attempt < 5 && !created; attempt += 1) {
      try {
        [created] = await Coupon.create([{
          name: "First-Time Customer Welcome Offer",
          description: "Automatic first-order welcome discount for new customers.",
          code: createCustomerCouponCode(config.codeSettings),
          source: "welcome",
          welcomeCustomerKey: customerKey,
          discountType: config.discountType || "percentage",
          discountValue: Number(discountValue),
          minimumSubtotal: Number(config.minimumSubtotal || 0),
          maximumDiscount: config.maxDiscountAmount != null ? Number(config.maxDiscountAmount) : null,
          channels: welcomeChannels,
          usageLimit: 1,
          perCustomerLimit: 1,
          startsAt: config.startsAt || now,
          expiresAt: config.expiryMode
            ? calculateExpiry(config, now, config.timezone || "Asia/Karachi")
            : config.expiresAt || null,
          timezone: config.timezone || "Asia/Karachi",
          firstOrderOnly: true,
          allowStacking: false,
          status: "active",
        }], { session: session || null });
      } catch (error) {
        if (error.code !== 11000) throw error;
        created = await Coupon.findOne({ source: "welcome", welcomeCustomerKey: customerKey })
          .select("+welcomeCustomerKey")
          .session(session || null);
        if (created) alreadyAssigned = true;
        else if (attempt === 4) throw error;
      }
    }
    if (!created) throw new Error("Could not allocate a unique welcome coupon code.");
  }

  if (!created || created.status !== "active" || (created.usageLimit != null && created.redemptionCount >= created.usageLimit)) {
    return { eligible: false, reason: "offer-not-active-for-channel" };
  }
  const welcomeCustomer = customerRecord || (customerId
    ? await Customer.findById(customerId).select("_id name email phone marketingConsent active").session(session || null)
    : null);
  if (welcomeCustomer) await recordWelcomeCouponIssue({ coupon: created, customer: welcomeCustomer, config });
  const discountAmount = Math.min(
    Number(subtotal || 0),
    created.discountType === "fixed"
      ? Number(created.discountValue)
      : Math.round((Number(subtotal || 0) * Number(created.discountValue)) / 100),
    created.maximumDiscount != null ? Number(created.maximumDiscount) : Number(subtotal || 0)
  );
  return {
    eligible: true,
    alreadyAssigned,
    discountType: created.discountType || "percentage",
    discountValue: Number(created.discountValue),
    discountPercentage: created.discountType === "percentage" ? Number(created.discountValue) : null,
    couponId: String(created._id),
    code: created.code,
    itemSubtotal: Number(subtotal || 0),
    discountAmount,
    minimumSubtotal: Number(config.minimumSubtotal || 0),
    popupTitle: config.popupTitle || "Welcome to our Pizza Store!",
    popupDescription: config.popupDescription || "You're eligible for a special first-order reward.",
    applyButtonLabel: config.applyButtonLabel || "Apply Discount",
    declineButtonLabel: config.declineButtonLabel || "No Thanks",
  };
};

const resolveCartPrices = async (items, session = null) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
    throw createHttpError(400, "Add at least one valid item to use a coupon.");
  }

  const resolved = [];
  for (const line of items) {
    const quantity = Number(line?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw createHttpError(400, "Item quantity must be between 1 and 100.");
    }

    if (line.dealId) {
      const deal = await Deal.findById(line.dealId).session(session);
      if (!deal || !isDealLiveNow(deal)) throw createHttpError(400, "This deal is no longer available.");
      const unitPrice = Number(deal.price);
      resolved.push({ dishId: "", categoryId: "", unitPrice, subtotal: unitPrice * quantity, isDeal: true });
      continue;
    }

    const dish = await Dish.findById(line.dishId || line.id)
      .select("price originalPrice variants category")
      .session(session);
    if (!dish) throw createHttpError(400, "An item in your cart is no longer available.");
    let unitPrice = dish.price;
    let originalPrice = dish.originalPrice;
    if (dish.variants?.length) {
      const variant = dish.variants.find(
        (entry) => entry.size === String(line.size || "").trim() && (entry.crust || "") === String(line.crust || "").trim()
      );
      if (!variant) throw createHttpError(400, "Please choose a valid size or crust.");
      unitPrice = variant.price;
      originalPrice = variant.originalPrice;
    }
    resolved.push({
      dishId: String(dish._id),
      categoryId: String(dish.category),
      unitPrice: Number(unitPrice),
      subtotal: Number(unitPrice) * quantity,
      byo: line.byo === true,
      quantity,
      isPromotion: Number(originalPrice) > Number(unitPrice),
    });
  }

  return resolved;
};

const getExistingDiscount = async (items, channel) => {
  if (channel !== "Online") return 0;
  const byoItems = items.filter((item) => item.byo);
  const units = byoItems.reduce((sum, item) => sum + item.quantity, 0);
  if (!byoItems.length) return 0;
  const settings = await getOrCreateSettings();
  const config = normalizeByoConfig(settings.buildYourOwnDeal);
  if (!config.enabled || units < config.minItems) {
    throw createHttpError(400, "Build Your Own Deal is not eligible for this order.");
  }
  const percent = byoDiscountPercent(units, config);
  const gross = byoItems.reduce((sum, item) => sum + item.subtotal, 0);
  return Math.round(gross * percent / 100);
};

const evaluateCoupon = async ({ code, phone, customerId, items, channel = "Online", session, now = new Date() }) => {
  const normalizedCode = normalizeCouponCode(code);
  if (!normalizedCode || normalizedCode.length > 40) throw createHttpError(400, "Enter a valid coupon code.");
  const globalSettings = getPromotionSettings((await Settings.findOne({ key: "global" }).select("promotionSettings").session(session || null))?.promotionSettings).global;
  if (channel === "Online" && !globalSettings.onlineCouponEntryEnabled) {
    throw createHttpError(400, "Online coupon entry is currently unavailable.");
  }
  const customerKey = customerKeyFor(phone);
  let assignment = await CustomerCoupon.findOne({ code: normalizedCode, status: "active" }).session(session || null);
  if (assignment) {
    if ((assignment.startsAt && assignment.startsAt > now) || (assignment.expiresAt && assignment.expiresAt <= now)) {
      throw createHttpError(400, "This assigned coupon is not currently available.");
    }
    if (customerId && String(assignment.customerId) !== String(customerId)) {
      throw createHttpError(403, "This coupon is not available to this customer.");
    }
    if (!customerId && assignment.source !== "whatsapp_campaign") {
      throw createHttpError(401, "Sign in to the assigned customer account to use this coupon.");
    }
    if (assignment.source === "whatsapp_campaign") {
      const assignedCustomer = await Customer.findById(assignment.customerId).select("phoneKey").session(session || null);
      if (!assignedCustomer || assignedCustomer.phoneKey !== customerKey) {
        throw createHttpError(403, "This coupon is not available to this mobile number.");
      }
    } else if (String(assignment.customerId) !== String(customerId)) {
      throw createHttpError(403, "This coupon is not available to this customer.");
    }
    if (assignment.redemptionCount >= assignment.redemptionLimit) {
      throw createHttpError(400, "This assigned coupon has reached its use limit.");
    }
  }
  const coupon = assignment
    ? await Coupon.findById(assignment.couponId).session(session || null)
    : await Coupon.findOne({ code: normalizedCode }).select("+welcomeCustomerKey").session(session || null);
  if (!coupon) throw createHttpError(400, "Invalid coupon code.");
  if (coupon.source === "whatsapp_campaign" && !assignment) {
    throw createHttpError(403, "This campaign coupon must be used with the private code sent to your mobile number.");
  }
  if (!assignment && ["friday_campaign", "birthday_campaign", "manual_campaign"].includes(coupon.source)) {
    throw createHttpError(401, "Sign in and use the customer-specific coupon code.");
  }
  if (coupon.source === "welcome" && coupon.welcomeCustomerKey !== customerKey) {
    throw createHttpError(403, "This welcome offer is only available to the mobile number it was issued to.");
  }
  if (coupon.source === "welcome") {
    const welcomeConfig = await getWelcomeOfferConfig(now);
    if (!welcomeConfig.isActive || !welcomeConfig.eligibleChannels?.includes(channel)) {
      throw createHttpError(400, "This welcome offer is no longer available.");
    }
  }

  const priorOrderQuery = {
    orderStatus: { $ne: "Cancelled" },
    ...(customerId
      ? {
          $or: [
            { customerId },
            { "customerDetails.phone": { $regex: `${String(phone).replace(/\D/g, "").slice(-9)}$` } },
          ],
        }
      : { "customerDetails.phone": { $regex: `${String(phone).replace(/\D/g, "").slice(-9)}$` } }),
  };
  const hasPreviousOrder = coupon.firstOrderOnly
    ? await Order.exists(priorOrderQuery).session(session || null)
    : false;
  const priorRedemptions = await CouponRedemption.countDocuments({
    couponId: coupon._id,
    customerKey,
    status: { $in: ["reserved", "redeemed"] },
  }).session(session || null);
  if (coupon.perCustomerLimit != null && priorRedemptions >= coupon.perCustomerLimit) {
    throw createHttpError(400, "Customer has already used this coupon.");
  }

  const existingDiscount = await getExistingDiscount(items, channel);
  const calculatedItems = items.map((item) => ({ ...item }));
  if (existingDiscount > 0) {
    const byoGross = calculatedItems.filter((item) => item.byo).reduce((sum, item) => sum + item.subtotal, 0);
    const settings = await getOrCreateSettings();
    const config = normalizeByoConfig(settings.buildYourOwnDeal);
    const units = calculatedItems.filter((item) => item.byo).reduce((sum, item) => sum + item.quantity, 0);
    const percent = byoDiscountPercent(units, config);
    let remainingDiscount = existingDiscount;
    const byoLines = calculatedItems.filter((item) => item.byo);
    byoLines.forEach((item, index) => {
      const lineDiscount = index === byoLines.length - 1
        ? remainingDiscount
        : Math.min(remainingDiscount, Math.round(existingDiscount * item.subtotal / byoGross));
      item.subtotal = Math.max(0, item.subtotal - lineDiscount);
      remainingDiscount -= lineDiscount;
    });
  }

  const subtotal = calculatedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const result = calculateCoupon(coupon, {
    items: calculatedItems,
    subtotal,
    channel,
    hasPreviousOrder: Boolean(hasPreviousOrder),
    existingDiscount,
    hasOtherPromotion: items.some((item) => item.isDeal || item.isPromotion || item.byo),
    now,
  });
  if (!result.valid) throw createHttpError(400, result.message);
  return {
    ...result,
    code: normalizedCode,
    customerKey,
    customerId: assignment?.customerId || customerId || null,
    customerCoupon: assignment || null,
    existingDiscount,
  };
};

const reserveRedemption = async ({ coupon, code, customerKey, customerId, customerCoupon, orderId, discountAmount, channel, session }) => {
  const current = await Coupon.findById(coupon._id).session(session);
  const now = new Date();
  const canRedeem = current && ["active", "scheduled"].includes(current.status)
    && (!current.startsAt || current.startsAt <= now)
    && (!current.expiresAt || current.expiresAt >= now);
  if (!canRedeem) throw createHttpError(400, "Coupon is no longer available.");
  if (current.usageLimit != null && current.redemptionCount >= current.usageLimit) {
    throw createHttpError(400, "Coupon usage limit reached.");
  }
  if (current.source === "welcome") {
    const settings = await getOrCreateSettings();
    const redemptionCountPath = "welcomeOfferRedemptionCount";
    const campaignLimit = settings.firstTimeCustomerOffer?.maxCampaignRedemptions;
    const filter = { _id: settings._id };
    if (campaignLimit != null) {
      filter.$or = [
        { [redemptionCountPath]: { $lt: campaignLimit } },
        { [redemptionCountPath]: { $exists: false } },
      ];
    }
    const campaignUpdate = await Settings.updateOne(filter, { $inc: { [redemptionCountPath]: 1 } }, { session });
    if (!campaignUpdate.matchedCount) throw createHttpError(400, "Welcome offer campaign redemption limit reached.");
  }
  const customerUsage = await CouponRedemption.countDocuments({
    couponId: current._id,
    customerKey,
    status: { $in: ["reserved", "redeemed"] },
  }).session(session);
  if (customerUsage >= current.perCustomerLimit) {
    throw createHttpError(400, "Customer has already used this coupon.");
  }

  const incremented = await Coupon.findOneAndUpdate(
    { _id: current._id, status: { $in: ["active", "scheduled"] } },
    { $inc: { redemptionCount: 1 } },
    { session, new: true }
  );
  if (!incremented) throw createHttpError(400, "Coupon is no longer available.");
  if (customerCoupon) {
    const assignmentUpdate = await CustomerCoupon.updateOne(
      {
        _id: customerCoupon._id,
        customerId: customerCoupon.customerId,
        status: "active",
        redemptionCount: { $lt: customerCoupon.redemptionLimit },
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        $and: [{ $or: [{ startsAt: null }, { startsAt: { $lte: now } }] }],
      },
      { $inc: { redemptionCount: 1 } },
      { session }
    );
    if (!assignmentUpdate.matchedCount) throw createHttpError(400, "This assigned coupon is no longer available.");
  }
  await CouponRedemption.create(
    [{
      couponId: current._id,
      orderId,
      code: code || current.code,
      customerId: customerId || customerCoupon?.customerId || null,
      customerCouponId: customerCoupon?._id || null,
      customerKey,
      discountAmount,
      channel,
      status: "reserved",
    }],
    { session }
  );
};

const reverseRedemption = async (orderId, session = null) => {
  if (!session && !(await CouponRedemption.exists({ orderId, status: "reserved" }))) return false;
  if (!session) {
    const transactionSession = await mongoose.startSession();
    try {
      let reversed = false;
      await transactionSession.withTransaction(async () => {
        reversed = await reverseRedemption(orderId, transactionSession);
      });
      return reversed;
    } finally {
      await transactionSession.endSession();
    }
  }
  const redemption = await CouponRedemption.findOneAndUpdate(
    { orderId, status: "reserved" },
    { $set: { status: "reversed", reversedAt: new Date() } },
    { new: true, session }
  );
  if (!redemption) return false;
  const counterUpdate = await Coupon.updateOne(
    { _id: redemption.couponId, redemptionCount: { $gt: 0 } },
    { $inc: { redemptionCount: -1 } },
    { session }
  );
  if (!counterUpdate.matchedCount) throw createHttpError(409, "Coupon redemption counters are inconsistent.");
  if (redemption.customerCouponId) {
    await CustomerCoupon.updateOne(
      { _id: redemption.customerCouponId, redemptionCount: { $gt: 0 } },
      { $inc: { redemptionCount: -1 } },
      { session }
    );
  }
  const coupon = await Coupon.findById(redemption.couponId).session(session);
  if (coupon?.source === "welcome") {
    await Settings.updateOne(
      { key: "global", welcomeOfferRedemptionCount: { $gt: 0 } },
      { $inc: { welcomeOfferRedemptionCount: -1 } },
      { session }
    );
  }
  return true;
};

const confirmRedemption = async (orderId) => {
  const result = await CouponRedemption.updateOne(
    { orderId, status: "reserved" },
    { $set: { status: "redeemed" } }
  );
  return result.modifiedCount > 0;
};

module.exports = {
  customerKeyFor,
  resolveCartPrices,
  calculateEligibleSubtotal,
  getExistingDiscount,
  evaluateCoupon,
  reserveRedemption,
  reverseRedemption,
  confirmRedemption,
  normalizePhoneDigits,
  getWelcomeOfferConfig,
  buildWelcomeOfferCoupon,
};
