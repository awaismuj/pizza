const crypto = require("crypto");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const CustomerCoupon = require("../models/customerCouponModel");
const Order = require("../models/orderModel");
const Dish = require("../models/dishModel");
const Deal = require("../models/dealModel");
const { isDealLiveNow } = require("../controllers/dealController");
const { calculateCoupon, normalizeCouponCode } = require("./couponRules");
const { getOrCreateSettings } = require("../controllers/settingsController");
const { normalizeByoConfig, byoDiscountPercent } = require("../utils/byoDiscount");

const customerKeyFor = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 7) throw createHttpError(400, "Enter a valid mobile number to use a coupon.");
  return crypto.createHash("sha256").update(digits.slice(-9)).digest("hex");
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
  let assignment = await CustomerCoupon.findOne({ code: normalizedCode, status: "active" }).session(session || null);
  if (assignment) {
    if ((assignment.startsAt && assignment.startsAt > now) || (assignment.expiresAt && assignment.expiresAt <= now)) {
      throw createHttpError(400, "This assigned coupon is not currently available.");
    }
    if (customerId && String(assignment.customerId) !== String(customerId)) {
      throw createHttpError(403, "This coupon is not available to this customer.");
    }
    if (!customerId) {
      throw createHttpError(401, "Sign in to the assigned customer account to use this coupon.");
    }
    if (String(assignment.customerId) !== String(customerId)) {
      throw createHttpError(403, "This coupon is not available to this customer.");
    }
    if (assignment.redemptionCount >= assignment.redemptionLimit) {
      throw createHttpError(400, "This assigned coupon has reached its use limit.");
    }
  }
  const coupon = assignment
    ? await Coupon.findById(assignment.couponId).session(session || null)
    : await Coupon.findOne({ code: normalizedCode }).session(session || null);
  if (!coupon) throw createHttpError(400, "Invalid coupon code.");
  const customerKey = customerKeyFor(phone);

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
  evaluateCoupon,
  reserveRedemption,
  reverseRedemption,
  confirmRedemption,
};
