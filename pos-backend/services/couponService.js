const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const CouponUsage = require("../models/couponUsageModel");
const Dish = require("../models/dishModel");
const Order = require("../models/orderModel");
const customerPhoneKey = require("../utils/customerPhoneKey");
const { calculateCoupon, roundMoney } = require("../utils/couponCalculator");

const RESERVATION_HOURS = 24;
const SUCCESS_STATUSES = ["Completed", "Closed"];

const normalizeCouponCode = (code) => String(code || "").trim().toUpperCase();

const resolveCouponItems = async (inputItems = []) => {
  if (!Array.isArray(inputItems) || inputItems.length === 0) {
    throw createHttpError(400, "Add at least one item before applying a coupon.");
  }

  const resolved = [];
  let hasPromotion = false;
  for (const line of inputItems) {
    if (line?.dealId || line?.isDeal || line?.byo) {
      hasPromotion = true;
      continue;
    }

    const dishId = line?.dishId || line?.id;
    if (!mongoose.Types.ObjectId.isValid(dishId)) {
      throw createHttpError(400, "One or more selected items are no longer available.");
    }
    const dish = await Dish.findById(dishId).select("name price variants category");
    if (!dish) throw createHttpError(400, "One or more selected items are no longer available.");

    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw createHttpError(400, "Item quantities must be between 1 and 99.");
    }

    let price = Number(dish.price);
    if (Array.isArray(dish.variants) && dish.variants.length > 0) {
      const variant = dish.variants.find(
        (item) => item.size === String(line.size || "").trim() &&
          (item.crust || "") === String(line.crust || "").trim()
      );
      if (!variant) throw createHttpError(400, `Choose a valid size for "${dish.name}".`);
      price = Number(variant.price);
    }
    resolved.push({
      dishId: dish._id,
      categoryId: dish.category,
      name: dish.name,
      price,
      quantity,
    });
  }
  return { items: resolved, hasPromotion };
};

const customerIdentity = ({ customerId, phone }) => {
  if (customerId) return { key: `customer:${String(customerId)}`, customerId };
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 13) {
    return { key: `phone:${customerPhoneKey(digits)}`, customerId: null };
  }
  return { key: "", customerId: null };
};

const checkFirstOrder = async ({ customerId, phone }) => {
  if (customerId) {
    return !(await Order.exists({ customerId, orderStatus: { $in: SUCCESS_STATUSES } }));
  }
  const digits = String(phone || "").replace(/\D/g, "");
  const suffix = digits.slice(-9);
  if (suffix.length < 7) return false;
  return !(await Order.exists({
    "customerDetails.phone": { $regex: `${suffix}$` },
    orderStatus: { $in: SUCCESS_STATUSES },
  }));
};

const getCouponByCode = async (code) => {
  const normalizedCode = normalizeCouponCode(code);
  if (!normalizedCode || normalizedCode.length > 40) {
    throw createHttpError(400, "Enter a valid coupon code.");
  }
  const coupon = await Coupon.findOne({ code: normalizedCode, archivedAt: null });
  if (!coupon) throw createHttpError(400, "Invalid coupon code.");
  return coupon;
};

const validateCoupon = async ({
  code,
  items,
  orderType,
  deliveryFee = 0,
  customerId = null,
  phone = "",
  hasPromotion = false,
  now = new Date(),
}) => {
  const coupon = await getCouponByCode(code);
  if (!coupon.isActive) throw createHttpError(400, "This coupon is not active.");
  if (coupon.startsAt && now < coupon.startsAt) {
    throw createHttpError(400, "This coupon is not active yet.");
  }
  if (coupon.expiresAt && now > coupon.expiresAt) {
    throw createHttpError(400, "This coupon has expired.");
  }

  const identity = customerIdentity({ customerId, phone });
  if ((coupon.usageLimitPerCustomer || coupon.isFirstOrderOnly || coupon.eligibleCustomerIds.length) && !identity.key) {
    throw createHttpError(400, "Enter a valid mobile number or sign in to use this coupon.");
  }
  if (coupon.isFirstOrderOnly && !(await checkFirstOrder({ customerId, phone }))) {
    throw createHttpError(400, "This coupon is valid for first-time customers only.");
  }

  if (
    coupon.totalUsageLimit != null &&
    coupon.redeemedCount + coupon.reservedCount >= coupon.totalUsageLimit
  ) {
    throw createHttpError(400, "This coupon has reached its usage limit.");
  }
  if (coupon.usageLimitPerCustomer && identity.key) {
    const usage = await CouponUsage.findOne({ couponId: coupon._id, customerKey: identity.key })
      .select("redeemedCount reservedCount");
    if (
      Number(usage?.redeemedCount || 0) + Number(usage?.reservedCount || 0) >=
      coupon.usageLimitPerCustomer
    ) {
      throw createHttpError(400, "You have already used this coupon the maximum allowed number of times.");
    }
  }

  const result = calculateCoupon(coupon, items, {
    orderType,
    deliveryFee,
    customerId,
    hasPromotion,
  });
  if (result.error) throw createHttpError(400, result.error);
  return { coupon, identity, ...result };
};

const ensureUsageRecord = async (couponId, customerKey) => {
  try {
    await CouponUsage.updateOne(
      { couponId, customerKey },
      { $setOnInsert: { couponId, customerKey } },
      { upsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
};

const reserveCoupon = async ({
  validation,
  order,
  subtotal,
  finalTotal,
}) => {
  const { coupon, identity, totalDiscount } = validation;
  const usageKey = identity.key || `order:${String(order._id)}`;
  let usageReserved = false;
  let couponReserved = false;
  try {
    await ensureUsageRecord(coupon._id, usageKey);
    const usageFilter = { couponId: coupon._id, customerKey: usageKey };
    if (coupon.usageLimitPerCustomer) {
      usageFilter.$expr = {
        $lt: [
          { $add: [{ $ifNull: ["$redeemedCount", 0] }, { $ifNull: ["$reservedCount", 0] }] },
          coupon.usageLimitPerCustomer,
        ],
      };
    }
    const usageResult = await CouponUsage.updateOne(usageFilter, { $inc: { reservedCount: 1 } });
    if (!usageResult.modifiedCount) {
      throw createHttpError(409, "You have already used this coupon the maximum allowed number of times.");
    }
    usageReserved = true;

    const couponFilter = { _id: coupon._id, isActive: true, archivedAt: null };
    if (coupon.totalUsageLimit != null) {
      couponFilter.$expr = {
        $lt: [
          { $add: [{ $ifNull: ["$redeemedCount", 0] }, { $ifNull: ["$reservedCount", 0] }] },
          coupon.totalUsageLimit,
        ],
      };
    }
    const couponResult = await Coupon.updateOne(couponFilter, { $inc: { reservedCount: 1 } });
    if (!couponResult.modifiedCount) {
      throw createHttpError(409, "This coupon has reached its usage limit.");
    }
    couponReserved = true;

    await CouponRedemption.create({
      couponId: coupon._id,
      codeSnapshot: coupon.code,
      orderId: order._id,
      customerId: identity.customerId || null,
      customerKey: usageKey,
      discountAmount: totalDiscount,
      orderSubtotal: roundMoney(subtotal),
      finalTotal: roundMoney(finalTotal),
      status: "reserved",
      expiresAt: new Date(Date.now() + RESERVATION_HOURS * 60 * 60 * 1000),
    });
  } catch (error) {
    if (couponReserved) {
      await Coupon.updateOne({ _id: coupon._id, reservedCount: { $gt: 0 } }, { $inc: { reservedCount: -1 } });
    }
    if (usageReserved) {
      await CouponUsage.updateOne(
        { couponId: coupon._id, customerKey: usageKey, reservedCount: { $gt: 0 } },
        { $inc: { reservedCount: -1 } }
      );
    }
    if (error.code === 11000) throw createHttpError(409, "This coupon was already applied to this order.");
    throw error;
  }
};

const changeRedemptionStatus = async (orderId, status, details = {}) => {
  const redemption = await CouponRedemption.findOne({ orderId, status: "reserved" }).select("+customerKey");
  if (!redemption) {
    if (status === "redeemed" && await CouponRedemption.exists({ orderId, status: "redeemed" })) return;
    return;
  }

  if (status === "redeemed" && redemption.expiresAt <= new Date()) {
    const expired = await CouponRedemption.findOneAndUpdate(
      { _id: redemption._id, status: "reserved", expiresAt: { $lte: new Date() } },
      { $set: { status: "expired", releasedAt: new Date(), releaseReason: "Reservation expired." } }
    );
    if (expired) {
      await Coupon.updateOne({ _id: redemption.couponId, reservedCount: { $gt: 0 } }, { $inc: { reservedCount: -1 } });
      await CouponUsage.updateOne(
        { couponId: redemption.couponId, customerKey: redemption.customerKey, reservedCount: { $gt: 0 } },
        { $inc: { reservedCount: -1 } }
      );
    }
    throw createHttpError(409, "The coupon reservation expired. Cancel and place the order again to revalidate it.");
  }

  const update = status === "redeemed"
    ? { status: "redeemed", redeemedAt: new Date() }
    : { status: "released", releasedAt: new Date(), releaseReason: details.reason || "Order cancelled." };
  const changed = await CouponRedemption.findOneAndUpdate(
    { _id: redemption._id, status: "reserved" },
    { $set: update }
  );
  if (!changed) return;

  const redeemed = status === "redeemed";
  await Promise.all([
    Coupon.updateOne(
      { _id: redemption.couponId, reservedCount: { $gt: 0 } },
      { $inc: redeemed ? { reservedCount: -1, redeemedCount: 1 } : { reservedCount: -1 } }
    ),
    CouponUsage.updateOne(
      { couponId: redemption.couponId, customerKey: redemption.customerKey, reservedCount: { $gt: 0 } },
      { $inc: redeemed ? { reservedCount: -1, redeemedCount: 1 } : { reservedCount: -1 } }
    ),
  ]);
};

const releaseOrderCoupon = (orderId, reason) =>
  changeRedemptionStatus(orderId, "released", { reason });

const redeemOrderCoupon = (orderId) => changeRedemptionStatus(orderId, "redeemed");

const reverseRedemption = async ({ redemptionId, reason, userId }) => {
  const redemption = await CouponRedemption.findById(redemptionId).select("+customerKey");
  if (!redemption) throw createHttpError(404, "Coupon redemption not found.");
  if (redemption.status !== "redeemed") {
    throw createHttpError(400, "Only a completed coupon redemption can be reversed.");
  }
  const reversed = await CouponRedemption.findOneAndUpdate(
    { _id: redemptionId, status: "redeemed" },
    {
      $set: {
        status: "reversed",
        reversedAt: new Date(),
        reversedBy: userId || null,
        reversalReason: String(reason || "").trim().slice(0, 300),
      },
    },
    { new: true }
  );
  if (!reversed) throw createHttpError(409, "This coupon redemption has already changed.");
  await Promise.all([
    Coupon.updateOne(
      { _id: redemption.couponId, redeemedCount: { $gt: 0 } },
      { $inc: { redeemedCount: -1 } }
    ),
    CouponUsage.updateOne(
      { couponId: redemption.couponId, customerKey: redemption.customerKey, redeemedCount: { $gt: 0 } },
      { $inc: { redeemedCount: -1 } }
    ),
  ]);
  return reversed;
};

const expireCouponReservations = async (now = new Date(), limit = 500) => {
  const due = await CouponRedemption.find({
    status: "reserved",
    expiresAt: { $lte: now },
  }).select("_id couponId customerKey").limit(limit).select("+customerKey").lean();
  for (const record of due) {
    const expired = await CouponRedemption.findOneAndUpdate(
      { _id: record._id, status: "reserved", expiresAt: { $lte: now } },
      { $set: { status: "expired", releasedAt: now, releaseReason: "Reservation expired." } }
    );
    if (!expired) continue;
    await Promise.all([
      Coupon.updateOne({ _id: record.couponId, reservedCount: { $gt: 0 } }, { $inc: { reservedCount: -1 } }),
      CouponUsage.updateOne(
        { couponId: record.couponId, customerKey: record.customerKey, reservedCount: { $gt: 0 } },
        { $inc: { reservedCount: -1 } }
      ),
    ]);
  }
  return due.length;
};

module.exports = {
  RESERVATION_HOURS,
  normalizeCouponCode,
  resolveCouponItems,
  customerIdentity,
  validateCoupon,
  reserveCoupon,
  releaseOrderCoupon,
  redeemOrderCoupon,
  reverseRedemption,
  expireCouponReservations,
  roundMoney,
};
