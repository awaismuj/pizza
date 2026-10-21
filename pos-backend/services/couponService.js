const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const CouponCode = require("../models/couponCodeModel");
const CustomerCoupon = require("../models/customerCouponModel");
const CouponCustomerUsage = require("../models/couponCustomerUsageModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const FirstOrderCouponLock = require("../models/firstOrderCouponLockModel");
const CouponOrder = require("../models/orderModel");
const Dish = require("../models/dishModel");
const Deal = require("../models/dealModel");
const { isDealLiveNow } = require("../controllers/dealController");
const { calculateDiscount, normalizePhone } = require("../utils/couponCalculator");

const normalizeCode = (code) => String(code || "").trim().toUpperCase();

const resolveCouponItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
    throw createHttpError(400, "Add at least one item to your order.");
  }

  const resolved = [];
  for (const line of items) {
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw createHttpError(400, "Item quantity must be between 1 and 100.");
    }

    if (line.dealId) {
      const deal = await Deal.findById(line.dealId).select("price isActive daysOfWeek startTime endTime");
      if (!deal || !isDealLiveNow(deal)) throw createHttpError(400, "This deal is no longer available.");
      resolved.push({
        dealId: deal._id,
        isDeal: true,
        price: Number(deal.price),
        quantity,
      });
      continue;
    }

    const dishId = line.dishId || line.id;
    if (!mongoose.Types.ObjectId.isValid(dishId)) throw createHttpError(400, "An order item is invalid.");
    const dish = await Dish.findById(dishId).select("price variants category");
    if (!dish) throw createHttpError(400, "An item is no longer available on the menu.");

    let price = Number(dish.price);
    if (dish.variants?.length) {
      const size = String(line.size || "").trim();
      const crust = String(line.crust || "").trim();
      const variant = dish.variants.find((item) => item.size === size && (item.crust || "") === crust);
      if (!variant) throw createHttpError(400, "Please choose a valid size and crust for each pizza.");
      price = Number(variant.price);
    }
    resolved.push({ dishId: dish._id, categoryId: dish.category, price, quantity });
  }
  return resolved;
};

const assertCouponEligible = async ({ code, phone, channel, items, existingDiscount = 0 }) => {
  const codeDoc = await CouponCode.findOne({ code: normalizeCode(code), enabled: true }).populate("coupon");
  if (!codeDoc || !codeDoc.coupon) throw createHttpError(400, "Invalid coupon code.");
  const coupon = codeDoc.coupon;
  const now = new Date();
  if (coupon.status !== "active") throw createHttpError(400, "This coupon is not active.");
  if (coupon.startsAt && now < coupon.startsAt) throw createHttpError(400, "This coupon is not available yet.");
  if (coupon.expiresAt && now > coupon.expiresAt) throw createHttpError(400, "This coupon has expired.");
  if (!coupon.channels.includes(channel)) throw createHttpError(400, "This coupon is not valid for this order channel.");

  const customerKey = normalizePhone(phone);
  if (!customerKey) throw createHttpError(400, "A valid customer phone number is required for this coupon.");
  if (codeDoc.kind === "customer" && codeDoc.customerKey !== customerKey) {
    throw createHttpError(400, "This coupon is not available to this customer.");
  }
  if (codeDoc.kind === "customer") {
    const assignment = await CustomerCoupon.findOne({
      code: codeDoc._id,
      customerKey,
      status: "active",
      $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
    });
    if (!assignment) throw createHttpError(400, "This customer coupon is no longer available.");
  }
  if (existingDiscount > 0 && !coupon.stackable) {
    throw createHttpError(400, "This coupon cannot be combined with another discount.");
  }

  if (coupon.firstOrderOnly) {
    const existingOrder = await CouponOrder.exists({
      "customerDetails.phone": { $regex: `${customerKey}$` },
      orderStatus: { $in: ["In Progress", "Ready", "Closed", "Pending", "Accepted", "Preparing", "Ready to Deliver", "Completed"] },
    });
    if (existingOrder) throw createHttpError(400, "This coupon is only valid on a first order.");
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw createHttpError(400, "This coupon's usage limit has been reached.");
  }

  const customerUsage = await CouponCustomerUsage.findOne({ coupon: coupon._id, customerKey });
  if (customerUsage && customerUsage.usageCount >= coupon.perCustomerLimit) {
    throw createHttpError(400, "You have already used this coupon.");
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  try {
    const result = calculateDiscount(coupon, items, subtotal - existingDiscount);
    return { ...result, coupon, codeDoc, customerKey, subtotal, resolvedItems: items };
  } catch (error) {
    throw createHttpError(400, error.message);
  }
};

const validateCoupon = async ({ code, phone, channel, items, existingDiscount, trustedItems }) => {
  const resolvedItems = trustedItems || (await resolveCouponItems(items));
  const result = await assertCouponEligible({
    code,
    phone,
    channel,
    items: resolvedItems,
    existingDiscount,
  });
  return {
    coupon: result.coupon,
    codeDoc: result.codeDoc,
    customerKey: result.customerKey,
    subtotal: result.subtotal,
    eligibleSubtotal: result.eligibleSubtotal,
    discountAmount: result.discountAmount,
    resolvedItems: result.resolvedItems,
  };
};

const reserveCoupon = async ({ code, phone, channel, items, existingDiscount, orderId, trustedItems }) => {
  const quote = await validateCoupon({ code, phone, channel, items, existingDiscount, trustedItems });
  let firstOrderLockReserved = false;
  if (quote.coupon.firstOrderOnly) {
    try {
      await FirstOrderCouponLock.create({
        customerKey: quote.customerKey,
        order: orderId,
        status: "reserved",
      });
      firstOrderLockReserved = true;
    } catch (error) {
      if (error.code === 11000) {
        throw createHttpError(409, "This coupon is only valid on a first order.");
      }
      throw error;
    }
  }
  const now = new Date();
  const campaignFilter = { _id: quote.coupon._id, status: "active" };
  if (quote.coupon.startsAt) campaignFilter.startsAt = { $lte: now };
  if (quote.coupon.expiresAt) campaignFilter.expiresAt = { $gte: now };
  if (quote.coupon.usageLimit !== null) campaignFilter.usageCount = { $lt: quote.coupon.usageLimit };

  const updatedCoupon = await Coupon.findOneAndUpdate(
    campaignFilter,
    { $inc: { usageCount: 1 } },
    { new: true }
  );
  if (!updatedCoupon) {
    if (firstOrderLockReserved) await FirstOrderCouponLock.deleteOne({ order: orderId });
    throw createHttpError(409, "This coupon's usage limit has been reached.");
  }

  let customerUsageReserved = false;
  try {
    if (quote.coupon.perCustomerLimit !== null) {
      const key = { coupon: quote.coupon._id, customerKey: quote.customerKey };
      try {
        await CouponCustomerUsage.findOneAndUpdate(
          key,
          { $setOnInsert: { usageCount: 0 } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
      const usage = await CouponCustomerUsage.findOneAndUpdate(
        { ...key, usageCount: { $lt: quote.coupon.perCustomerLimit } },
        { $inc: { usageCount: 1 } },
        { new: true }
      );
      if (!usage) throw createHttpError(409, "You have already used this coupon.");
      customerUsageReserved = true;
    }

    await CouponRedemption.create({
      coupon: quote.coupon._id,
      couponCode: quote.codeDoc._id,
      order: orderId,
      customerKey: quote.customerKey,
      discountAmount: quote.discountAmount,
      status: "reserved",
    });
    return quote;
  } catch (error) {
    await Coupon.findByIdAndUpdate(quote.coupon._id, { $inc: { usageCount: -1 } });
    if (customerUsageReserved) {
      await CouponCustomerUsage.findOneAndUpdate(
        { coupon: quote.coupon._id, customerKey: quote.customerKey, usageCount: { $gt: 0 } },
        { $inc: { usageCount: -1 } }
      );
    }
    if (firstOrderLockReserved) await FirstOrderCouponLock.deleteOne({ order: orderId });
    throw error;
  }
};

const releaseCouponRedemption = async (orderId) => {
  const redemption = await CouponRedemption.findOneAndUpdate(
    { order: orderId, status: "reserved" },
    { $set: { status: "reversed", reversedAt: new Date() } },
    { new: true }
  );
  if (!redemption) return;

  await Promise.all([
    Coupon.findOneAndUpdate({ _id: redemption.coupon, usageCount: { $gt: 0 } }, { $inc: { usageCount: -1 } }),
    CouponCustomerUsage.findOneAndUpdate(
      { coupon: redemption.coupon, customerKey: redemption.customerKey, usageCount: { $gt: 0 } },
      { $inc: { usageCount: -1 } }
    ),
    FirstOrderCouponLock.deleteOne({ order: orderId, status: "reserved" }),
    CustomerCoupon.findOneAndUpdate(
      { code: redemption.couponCode, status: "redeemed" },
      { $set: { status: "active" } }
    ),
  ]);
};

const confirmCouponRedemption = async (orderId) => {
  const redemption = await CouponRedemption.findOneAndUpdate(
    { order: orderId, status: "reserved" },
    { $set: { status: "redeemed", redeemedAt: new Date() } },
    { new: true }
  );
  if (redemption) {
    const coupon = await Coupon.findById(redemption.coupon).select("perCustomerLimit");
    const usage = await CouponCustomerUsage.findOne({
      coupon: redemption.coupon,
      customerKey: redemption.customerKey,
    }).select("usageCount");
    const assignmentCanRemainActive =
      coupon && usage && usage.usageCount < coupon.perCustomerLimit;
    await Promise.all([
      FirstOrderCouponLock.updateOne(
        { order: orderId, status: "reserved" },
        { $set: { status: "redeemed" } }
      ),
      ...(assignmentCanRemainActive
        ? []
        : [
            CustomerCoupon.updateOne(
              { code: redemption.couponCode, status: "active" },
              { $set: { status: "redeemed" } }
            ),
          ]),
    ]);
  }
  return redemption;
};

module.exports = {
  assertCouponEligible,
  confirmCouponRedemption,
  normalizeCode,
  normalizePhone,
  releaseCouponRedemption,
  reserveCoupon,
  resolveCouponItems,
  validateCoupon,
};
