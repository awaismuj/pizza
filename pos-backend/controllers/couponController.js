const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const { resolveCartPrices, evaluateCoupon } = require("../services/couponService");

const DISCOUNT_TYPES = ["percentage", "fixed"];
const STATUSES = ["draft", "scheduled", "active", "paused", "expired", "archived"];
const CHANNELS = ["POS", "Online"];

const parseIds = (value, fieldName) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw createHttpError(400, `${fieldName} must contain valid menu item IDs.`);
  }
  return [...new Set(value.map(String))];
};

const buildCouponPayload = (body, existing = {}) => {
  const name = String(body.name ?? existing.name ?? "").trim();
  const code = String(body.code ?? existing.code ?? "").trim().toUpperCase();
  const discountType = body.discountType ?? existing.discountType;
  const discountValue = Number(body.discountValue ?? existing.discountValue);
  const minimumSubtotal = Number(body.minimumSubtotal ?? existing.minimumSubtotal ?? 0);
  const maximumDiscountValue = body.maximumDiscount ?? existing.maximumDiscount;
  const maximumDiscount = maximumDiscountValue === "" || maximumDiscountValue == null
    ? null
    : Number(maximumDiscountValue);
  const usageLimitValue = body.usageLimit ?? existing.usageLimit;
  const usageLimit = usageLimitValue === "" || usageLimitValue == null
    ? null
    : Number(usageLimitValue);
  const perCustomerLimit = Number(body.perCustomerLimit ?? existing.perCustomerLimit ?? 1);
  const startsAt = body.startsAt === "" || body.startsAt === null
    ? null
    : (body.startsAt === undefined ? existing.startsAt : new Date(body.startsAt));
  const expiresAt = body.expiresAt === "" || body.expiresAt === null
    ? null
    : (body.expiresAt === undefined ? existing.expiresAt : new Date(body.expiresAt));
  const channels = body.channels ?? existing.channels ?? CHANNELS;
  const status = body.status ?? existing.status ?? "draft";

  if (!name || name.length > 120) throw createHttpError(400, "Coupon name is required (maximum 120 characters).");
  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) throw createHttpError(400, "Code must be 3-40 letters, numbers, dashes, or underscores.");
  if (!DISCOUNT_TYPES.includes(discountType)) throw createHttpError(400, "Choose a supported coupon discount type.");
  if (!Number.isFinite(discountValue) || discountValue <= 0 || (discountType === "percentage" && discountValue > 100)) {
    throw createHttpError(400, "Discount value must be greater than 0; percentage discounts cannot exceed 100%.");
  }
  if (!Number.isFinite(minimumSubtotal) || minimumSubtotal < 0) throw createHttpError(400, "Minimum subtotal cannot be negative.");
  if (maximumDiscount !== null && (!Number.isFinite(maximumDiscount) || maximumDiscount < 0)) {
    throw createHttpError(400, "Maximum discount must be 0 or greater.");
  }
  if (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit < 1)) {
    throw createHttpError(400, "Campaign usage limit must be a positive whole number.");
  }
  if (!Number.isInteger(perCustomerLimit) || perCustomerLimit < 1) {
    throw createHttpError(400, "Per-customer usage limit must be a positive whole number.");
  }
  if (!Array.isArray(channels) || channels.length === 0 || channels.some((channel) => !CHANNELS.includes(channel))) {
    throw createHttpError(400, "Choose at least one valid order channel.");
  }
  if (!STATUSES.includes(status)) throw createHttpError(400, "Choose a valid coupon status.");
  for (const field of ["firstOrderOnly", "allowStacking"]) {
    const value = body[field] ?? existing[field] ?? false;
    if (typeof value !== "boolean") throw createHttpError(400, `${field} must be true or false.`);
  }
  if (startsAt && Number.isNaN(startsAt.getTime())) throw createHttpError(400, "Enter a valid start date.");
  if (expiresAt && Number.isNaN(expiresAt.getTime())) throw createHttpError(400, "Enter a valid expiry date.");
  if (startsAt && expiresAt && startsAt >= expiresAt) throw createHttpError(400, "Expiry date must be after the start date.");
  if (status === "scheduled" && !startsAt) throw createHttpError(400, "Scheduled coupons need a start date.");
  if (status === "active" && startsAt && startsAt > new Date()) {
    throw createHttpError(400, "Use Scheduled status for a coupon with a future start date.");
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: body.timezone ?? existing.timezone ?? "Asia/Karachi" });
  } catch {
    throw createHttpError(400, "Enter a valid IANA timezone.");
  }

  const ids = {
    eligibleDishIds: parseIds(body.eligibleDishIds, "Eligible menu items"),
    excludedDishIds: parseIds(body.excludedDishIds, "Excluded menu items"),
    eligibleCategoryIds: parseIds(body.eligibleCategoryIds, "Eligible categories"),
    excludedCategoryIds: parseIds(body.excludedCategoryIds, "Excluded categories"),
  };

  return {
    name,
    description: String(body.description ?? existing.description ?? "").trim().slice(0, 1000),
    code,
    discountType,
    discountValue,
    minimumSubtotal,
    maximumDiscount,
    usageLimit,
    perCustomerLimit,
    startsAt,
    expiresAt,
    timezone: String(body.timezone ?? existing.timezone ?? "Asia/Karachi").trim() || "Asia/Karachi",
    channels: [...new Set(channels)],
    firstOrderOnly: body.firstOrderOnly ?? existing.firstOrderOnly ?? false,
    allowStacking: body.allowStacking ?? existing.allowStacking ?? false,
    status,
    ...Object.fromEntries(Object.entries(ids).filter(([, value]) => value !== undefined)),
  };
};

const getCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    await Coupon.updateMany(
      { status: { $in: ["active", "scheduled"] }, expiresAt: { $ne: null, $lte: now } },
      { $set: { status: "expired" } }
    );
    await Coupon.updateMany(
      {
        status: "scheduled",
        startsAt: { $ne: null, $lte: now },
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      },
      { $set: { status: "active" } }
    );
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const filter = {};
    if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.search) {
      const search = String(req.query.search).trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }
    const [coupons, total] = await Promise.all([
      Coupon.find(filter)
        .populate("eligibleDishIds", "name")
        .populate("excludedDishIds", "name")
        .populate("eligibleCategoryIds", "name")
        .populate("excludedCategoryIds", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Coupon.countDocuments(filter),
    ]);
    res.json({ success: true, data: coupons, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create({ ...buildCouponPayload(req.body), createdBy: req.user._id });
    res.status(201).json({ success: true, message: "Coupon created.", data: coupon });
  } catch (error) {
    next(error.code === 11000 ? createHttpError(409, "Coupon code already exists.") : error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(400, "Invalid coupon ID.");
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    coupon.set(buildCouponPayload(req.body, coupon.toObject()));
    await coupon.save();
    res.json({ success: true, message: "Coupon updated.", data: coupon });
  } catch (error) {
    next(error.code === 11000 ? createHttpError(409, "Coupon code already exists.") : error);
  }
};

const archiveCoupon = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(400, "Invalid coupon ID.");
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { status: "archived" }, { new: true });
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    res.json({ success: true, message: "Coupon archived.", data: coupon });
  } catch (error) {
    next(error);
  }
};

const duplicateCoupon = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(400, "Invalid coupon ID.");
    const source = await Coupon.findById(req.params.id).lean();
    if (!source) throw createHttpError(404, "Coupon not found.");
    delete source._id;
    delete source.__v;
    delete source.createdAt;
    delete source.updatedAt;
    delete source.redemptionCount;
    source.name = `${source.name} copy`;
    source.code = "";
    source.status = "draft";
    source.createdBy = req.user._id;
    res.status(200).json({ success: true, data: source });
  } catch (error) {
    next(error);
  }
};

const validatePublicCoupon = async (req, res, next) => {
  try {
    const items = await resolveCartPrices(req.body.items);
    const result = await evaluateCoupon({
      code: req.body.code,
      phone: req.body.phone,
      items,
      channel: "Online",
    });
    res.json({ success: true, data: { code: result.coupon.code, discountAmount: result.discountAmount, eligibleSubtotal: result.eligibleSubtotal } });
  } catch (error) {
    next(error);
  }
};

const validatePosCoupon = async (req, res, next) => {
  try {
    const items = await resolveCartPrices(req.body.items);
    const result = await evaluateCoupon({
      code: req.body.code,
      phone: req.body.phone || "pos-customer",
      items,
      channel: "POS",
    });
    res.json({ success: true, data: { code: result.coupon.code, discountAmount: result.discountAmount, eligibleSubtotal: result.eligibleSubtotal } });
  } catch (error) {
    next(error);
  }
};

const getCouponRedemptions = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
    const filter = {};
    if (req.query.couponId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.couponId)) throw createHttpError(400, "Invalid coupon ID.");
      filter.couponId = req.query.couponId;
    }
    const [redemptions, total] = await Promise.all([
      CouponRedemption.find(filter).populate("couponId", "name code discountType").populate("orderId", "orderNumber orderStatus bills").sort({ redeemedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      CouponRedemption.countDocuments(filter),
    ]);
    const [summary] = await CouponRedemption.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          redeemed: { $sum: { $cond: [{ $in: ["$status", ["reserved", "redeemed"]] }, 1, 0] } },
          discountTotal: { $sum: { $cond: [{ $in: ["$status", ["reserved", "redeemed"]] }, "$discountAmount", 0] } },
        },
      },
    ]);
    const statusSummary = await CouponRedemption.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json({
      success: true,
      data: redemptions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: summary || { total: 0, redeemed: 0, discountTotal: 0 },
      statusSummary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  archiveCoupon,
  duplicateCoupon,
  validatePublicCoupon,
  validatePosCoupon,
  getCouponRedemptions,
  buildCouponPayload,
};
