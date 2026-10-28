const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const Order = require("../models/orderModel");
const Dish = require("../models/dishModel");
const Branch = require("../models/branchModel");
const { quoteFulfillment } = require("../utils/fulfillment");
const {
  normalizeCouponCode,
  resolveCouponItems,
  validateCoupon,
  reverseRedemption,
  roundMoney,
} = require("../services/couponService");

const OPTIONAL_NUMBER_FIELDS = [
  "minimumOrderAmount",
  "maximumDiscountAmount",
  "totalUsageLimit",
  "usageLimitPerCustomer",
  "minimumQualifyingQuantity",
];
const ID_FIELDS = ["eligibleCustomerIds", "eligibleDishIds", "eligibleCategoryIds"];
const ALLOWED_FIELDS = [
  "code", "name", "description", "discountType", "discountValue",
  ...OPTIONAL_NUMBER_FIELDS, "startsAt", "expiresAt", ...ID_FIELDS,
  "eligibleOrderTypes", "isFirstOrderOnly", "isActive",
];

const normalizeArray = (value) => {
  if (value == null || value === "") return [];
  if (!Array.isArray(value)) throw createHttpError(400, "Expected a list of values.");
  return value;
};

const normalizeCouponPayload = (body, { partial = false } = {}) => {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (!Object.hasOwn(body || {}, field)) continue;
    const value = body[field];
    if (ID_FIELDS.includes(field)) {
      const ids = normalizeArray(value).map(String);
      if (ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
        throw createHttpError(400, "One or more selected coupon eligibility records are invalid.");
      }
      data[field] = [...new Set(ids)];
    } else if (field === "eligibleOrderTypes") {
      const types = normalizeArray(value);
      if (types.some((type) => !["delivery", "pickup", "dineIn"].includes(type))) {
        throw createHttpError(400, "Choose valid order types.");
      }
      data[field] = [...new Set(types)];
    } else if (OPTIONAL_NUMBER_FIELDS.includes(field) || field === "discountValue") {
      if (value == null || value === "") {
        if (OPTIONAL_NUMBER_FIELDS.includes(field)) data[field] = null;
        else throw createHttpError(400, "Discount value is required.");
      } else {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
          throw createHttpError(400, "Coupon amounts and limits must be valid non-negative numbers.");
        }
        data[field] = number;
      }
    } else if (field === "startsAt" || field === "expiresAt") {
      if (value == null || value === "") data[field] = null;
      else {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) throw createHttpError(400, "Enter valid coupon dates.");
        data[field] = date;
      }
    } else if (field === "isActive" || field === "isFirstOrderOnly") {
      if (typeof value !== "boolean") throw createHttpError(400, `${field} must be true or false.`);
      data[field] = value;
    } else if (field === "code") {
      const code = normalizeCouponCode(value);
      if (!/^[A-Z0-9_-]{3,40}$/.test(code)) {
        throw createHttpError(400, "Coupon codes must be 3–40 letters, numbers, underscores, or hyphens.");
      }
      data.code = code;
    } else if (field === "name" || field === "description") {
      data[field] = String(value || "").trim();
      if (field === "name" && !data[field]) throw createHttpError(400, "Coupon name is required.");
    }
  }

  if (!partial && (!data.code || !data.name || !data.discountType || data.discountValue == null)) {
    throw createHttpError(400, "Coupon code, name, discount type, and discount value are required.");
  }
  const discountType = data.discountType;
  if (discountType && !["percentage", "fixed", "freeDelivery"].includes(discountType)) {
    throw createHttpError(400, "Choose a valid discount type.");
  }
  if (data.discountValue != null && discountType === "percentage" && data.discountValue > 100) {
    throw createHttpError(400, "Percentage discounts cannot exceed 100%.");
  }
  if (data.discountValue != null && discountType === "freeDelivery") data.discountValue = 0;
  if (data.maximumDiscountAmount != null && discountType && discountType !== "percentage") {
    throw createHttpError(400, "Maximum discount amount is only used for percentage coupons.");
  }
  if (data.startsAt && data.expiresAt && data.expiresAt <= data.startsAt) {
    throw createHttpError(400, "Expiry must be later than the start date.");
  }
  return data;
};

const validateCouponForOrder = async (req, res, next) => {
  try {
    const { items: resolvedItems, hasPromotion } = await resolveCouponItems(req.body.items);
    const orderType = String(req.body.orderType || "").trim();
    if (!["delivery", "pickup", "dineIn"].includes(orderType)) {
      throw createHttpError(400, "Choose a valid order type.");
    }

    let deliveryFee = 0;
    if (orderType === "delivery" && req.body.fulfillment) {
      const branchId = req.body.fulfillment.branchId;
      const branch = mongoose.Types.ObjectId.isValid(branchId) ? await Branch.findById(branchId) : null;
      const quote = quoteFulfillment({
        branch,
        method: "delivery",
        zoneId: req.body.fulfillment.zoneId,
        subtotal: resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      });
      if (!quote.ok) throw createHttpError(400, quote.error);
      deliveryFee = quote.fee;
    }

    const validation = await validateCoupon({
      code: req.body.code,
      items: resolvedItems,
      orderType,
      deliveryFee,
      customerId: req.customer?._id || req.body.customerId || null,
      phone: req.customer?.phone || req.body.phone || "",
      hasPromotion,
    });
    const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newSubtotal = Math.max(0, roundMoney(subtotal - validation.discountAmount));
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      data: {
        code: validation.coupon.code,
        name: validation.coupon.name,
        discountType: validation.coupon.discountType,
        discountAmount: validation.discountAmount,
        deliveryDiscount: validation.deliveryDiscount,
        eligibleSubtotal: validation.eligibleSubtotal,
        subtotal,
        newSubtotal,
        deliveryFee,
        totalDiscount: validation.totalDiscount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listCoupons = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const search = String(req.query.search || "").trim().slice(0, 80);
    const status = String(req.query.status || "all");
    const filter = { archivedAt: null };
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { code: { $regex: escaped, $options: "i" } },
        { name: { $regex: escaped, $options: "i" } },
      ];
    }
    if (status === "active") filter.isActive = true;
    else if (status === "inactive") filter.isActive = false;
    else if (status === "expired") filter.expiresAt = { $lte: new Date() };
    else if (!["all", "active", "inactive", "expired"].includes(status)) {
      throw createHttpError(400, "Choose a valid coupon status filter.");
    }
    const [coupons, total] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Coupon.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      data: coupons,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id).lean();
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    const [redemptionTotals, recentRedemptions] = await Promise.all([
      CouponRedemption.aggregate([
        { $match: { couponId: coupon._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            discountAmount: { $sum: "$discountAmount" },
          },
        },
      ]),
      CouponRedemption.find({ couponId: coupon._id })
        .sort({ appliedAt: -1 })
        .limit(20)
        .select("-customerKey")
        .lean(),
    ]);
    res.status(200).json({
      success: true,
      data: {
        coupon,
        performance: {
          redemptions: redemptionTotals,
          reserved: coupon.reservedCount,
          successfulRedemptions: coupon.redeemedCount,
        },
        recentRedemptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const data = normalizeCouponPayload(req.body);
    const coupon = await Coupon.create({
      ...data,
      createdBy: { userId: req.user?._id || null, name: req.user?.name || "" },
    });
    res.status(201).json({ success: true, message: "Coupon created.", data: coupon });
  } catch (error) {
    if (error.code === 11000) return next(createHttpError(409, "A coupon with this code already exists."));
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const data = normalizeCouponPayload(req.body, { partial: true });
    if (!Object.keys(data).length) throw createHttpError(400, "No coupon fields were provided.");
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true });
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    res.status(200).json({ success: true, message: "Coupon updated.", data: coupon });
  } catch (error) {
    if (error.code === 11000) return next(createHttpError(409, "A coupon with this code already exists."));
    next(error);
  }
};

const toggleCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon || coupon.archivedAt) throw createHttpError(404, "Coupon not found.");
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ success: true, message: `Coupon ${coupon.isActive ? "activated" : "deactivated"}.`, data: coupon });
  } catch (error) {
    next(error);
  }
};

const archiveCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false, archivedAt: new Date() } },
      { new: true }
    );
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    res.status(200).json({ success: true, message: "Coupon archived. Historical orders and usage records remain intact." });
  } catch (error) {
    next(error);
  }
};

const listCouponRedemptions = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
    const filter = { couponId: req.params.id };
    if (req.query.status && ["reserved", "redeemed", "released", "reversed", "expired"].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    const [data, total] = await Promise.all([
      CouponRedemption.find(filter).sort({ appliedAt: -1 }).skip((page - 1) * limit).limit(limit)
        .select("-customerKey").lean(),
      CouponRedemption.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getCouponReport = async (req, res, next) => {
  try {
    const parseDate = (value, endOfDay = false) => {
      if (!value) return null;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
        throw createHttpError(400, "Report dates must use YYYY-MM-DD.");
      }
      const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`);
      if (Number.isNaN(date.getTime())) throw createHttpError(400, "Enter valid report dates.");
      return date;
    };
    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to, true);
    if (from && to && to < from) throw createHttpError(400, "The report end date must follow its start date.");
    const match = {};
    if (from || to) {
      match.appliedAt = {};
      if (from) match.appliedAt.$gte = from;
      if (to) match.appliedAt.$lte = to;
    }

    const [byCoupon, byDate, statuses, couponStatuses] = await Promise.all([
      CouponRedemption.aggregate([
        { $match: match },
        {
          $group: {
            _id: { couponId: "$couponId", code: "$codeSnapshot", status: "$status" },
            count: { $sum: 1 },
            discountAmount: { $sum: "$discountAmount" },
            orderSubtotal: { $sum: "$orderSubtotal" },
            finalTotal: { $sum: "$finalTotal" },
          },
        },
        { $sort: { "_id.code": 1 } },
      ]),
      CouponRedemption.aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" } },
              status: "$status",
            },
            count: { $sum: 1 },
            discountAmount: { $sum: "$discountAmount" },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]),
      CouponRedemption.aggregate([
        { $match: match },
        { $group: { _id: "$status", count: { $sum: 1 }, discountAmount: { $sum: "$discountAmount" } } },
      ]),
      Coupon.aggregate([
        { $group: { _id: { $cond: [{ $eq: ["$isActive", true] }, "active", "inactive"] }, count: { $sum: 1 } } },
      ]),
    ]);

    const successful = byCoupon.filter((item) => item._id.status === "redeemed");
    const successfulRedemptions = successful.reduce((sum, item) => sum + item.count, 0);
    const discountGranted = roundMoney(successful.reduce((sum, item) => sum + item.discountAmount, 0));
    const completedOrderValue = successful.reduce((sum, item) => sum + item.finalTotal, 0);
    res.status(200).json({
      success: true,
      data: {
        successfulRedemptions,
        discountGranted,
        ordersGenerated: successfulRedemptions,
        averageOrderValue: successfulRedemptions
          ? roundMoney(completedOrderValue / successfulRedemptions)
          : 0,
        byCoupon,
        byDate,
        statuses,
        couponStatuses,
      },
    });
  } catch (error) {
    next(error);
  }
};

const reverseCouponRedemption = async (req, res, next) => {
  try {
    const reason = String(req.body.reason || "").trim();
    if (reason.length < 3) throw createHttpError(400, "Enter a reason for reversing this redemption.");
    const data = await reverseRedemption({
      redemptionId: req.params.redemptionId,
      reason,
      userId: req.user?._id,
    });
    res.status(200).json({ success: true, message: "Coupon redemption reversed.", data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCouponForOrder,
  listCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  archiveCoupon,
  listCouponRedemptions,
  getCouponReport,
  reverseCouponRedemption,
};
