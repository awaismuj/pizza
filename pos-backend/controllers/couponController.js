const crypto = require("crypto");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const CouponCode = require("../models/couponCodeModel");
const CustomerCoupon = require("../models/customerCouponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const { normalizeCode, normalizePhone, validateCoupon } = require("../services/couponService");

const ALLOWED_CHANNELS = ["online", "pos"];
const ALLOWED_STATUSES = ["draft", "scheduled", "active", "paused", "expired", "archived"];
const LIST_FIELDS = [
  "name", "description", "discountType", "discountValue", "minimumSubtotal",
  "maximumDiscount", "eligibleProducts", "excludedProducts", "eligibleCategories",
  "excludedCategories", "channels", "usageLimit", "perCustomerLimit", "startsAt",
  "expiresAt", "timezone", "firstOrderOnly", "stackable", "status",
];

const validatePayload = (body, partial = false) => {
  const payload = {};
  for (const field of LIST_FIELDS) {
    if (body[field] !== undefined) payload[field] = body[field];
  }
  if ((!partial || payload.name !== undefined) && !String(payload.name || "").trim()) {
    throw createHttpError(400, "Coupon name is required.");
  }
  if ((!partial || payload.discountType !== undefined) &&
      !["percentage", "fixed"].includes(payload.discountType)) {
    throw createHttpError(400, "Choose a supported discount type.");
  }
  if (!partial || payload.discountValue !== undefined) {
    const value = Number(payload.discountValue);
    if (!Number.isFinite(value) || value <= 0 ||
        (payload.discountType === "percentage" && value > 100)) {
      throw createHttpError(400, "Discount value must be positive (and no more than 100 for percentage coupons).");
    }
    payload.discountValue = value;
  }
  for (const field of ["minimumSubtotal", "maximumDiscount", "usageLimit", "perCustomerLimit"]) {
    if (payload[field] === undefined) continue;
    if (payload[field] === null && field !== "perCustomerLimit") continue;
    const value = Number(payload[field]);
    const minimum = field === "minimumSubtotal" || field === "maximumDiscount" ? 0 : 1;
    if (!Number.isFinite(value) || value < minimum || !Number.isInteger(value) && minimum === 1) {
      throw createHttpError(400, `${field} is invalid.`);
    }
    payload[field] = value;
  }
  if (payload.channels !== undefined &&
      (!Array.isArray(payload.channels) || !payload.channels.length ||
       payload.channels.some((channel) => !ALLOWED_CHANNELS.includes(channel)))) {
    throw createHttpError(400, "Select at least one valid order channel.");
  }
  if (payload.status !== undefined && !ALLOWED_STATUSES.includes(payload.status)) {
    throw createHttpError(400, "Choose a valid coupon status.");
  }
  if (payload.startsAt && Number.isNaN(new Date(payload.startsAt).getTime())) {
    throw createHttpError(400, "Start date is invalid.");
  }
  if (payload.expiresAt && Number.isNaN(new Date(payload.expiresAt).getTime())) {
    throw createHttpError(400, "Expiry date is invalid.");
  }
  if (payload.startsAt && payload.expiresAt && new Date(payload.startsAt) >= new Date(payload.expiresAt)) {
    throw createHttpError(400, "Expiry date must be later than the start date.");
  }
  if (payload.timezone !== undefined) {
    if (typeof payload.timezone !== "string" || payload.timezone.length > 80) {
      throw createHttpError(400, "Timezone is invalid.");
    }
    try {
      new Intl.DateTimeFormat("en", { timeZone: payload.timezone });
    } catch {
      throw createHttpError(400, "Timezone must be a valid IANA timezone.");
    }
  }
  for (const field of ["eligibleProducts", "excludedProducts", "eligibleCategories", "excludedCategories"]) {
    if (payload[field] !== undefined &&
        (!Array.isArray(payload[field]) || payload[field].some((id) => !mongoose.Types.ObjectId.isValid(id)))) {
      throw createHttpError(400, `${field} must contain valid menu IDs.`);
    }
  }
  return payload;
};

const uniqueCode = () => crypto.randomBytes(16).toString("hex").toUpperCase();

const createCoupon = async (req, res, next) => {
  try {
    const payload = validatePayload(req.body);
    const code = normalizeCode(req.body.code || uniqueCode());
    if (!/^[A-Z0-9_-]{4,32}$/.test(code)) {
      throw createHttpError(400, "Coupon codes must be 4-32 letters, numbers, hyphens, or underscores.");
    }
    const coupon = await Coupon.create(payload);
    try {
      const couponCode = await CouponCode.create({ code, coupon: coupon._id, kind: "shared" });
      return res.status(201).json({ success: true, data: { coupon, code: couponCode.code } });
    } catch (error) {
      await Coupon.findByIdAndDelete(coupon._id);
      if (error.code === 11000) throw createHttpError(409, "That coupon code is already in use.");
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const listCoupons = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const filter = {};
    if (req.query.status && ALLOWED_STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.search) {
      const search = String(req.query.search).trim().slice(0, 100);
      filter.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }
    const [coupons, total] = await Promise.all([
      Coupon.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Coupon.countDocuments(filter),
    ]);
    const codes = await CouponCode.find({ coupon: { $in: coupons.map((coupon) => coupon._id) }, kind: "shared" })
      .select("coupon code")
      .lean();
    const codeByCoupon = new Map(codes.map(({ coupon, code }) => [String(coupon), code]));
    res.status(200).json({
      success: true,
      data: coupons.map((coupon) => ({ ...coupon, code: codeByCoupon.get(String(coupon._id)) || "" })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(404, "Coupon not found.");
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    const payload = validatePayload({ ...coupon.toObject(), ...req.body });
    Object.assign(coupon, payload);
    await coupon.save();
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

const setCouponStatus = async (req, res, next) => {
  try {
    if (!ALLOWED_STATUSES.includes(req.body.status)) throw createHttpError(400, "Choose a valid coupon status.");
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    );
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

const assignCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    if (coupon.status !== "active") throw createHttpError(400, "Activate the coupon before assigning it.");
    const customerKey = normalizePhone(req.body.phone);
    if (customerKey.length < 7) throw createHttpError(400, "Enter a valid customer phone number.");
    const code = normalizeCode(req.body.code || uniqueCode());
    if (!/^[A-Z0-9_-]{8,32}$/.test(code)) {
      throw createHttpError(400, "Customer coupon codes must be 8-32 letters, numbers, hyphens, or underscores.");
    }
    const assignmentExpiry = req.body.expiresAt ? new Date(req.body.expiresAt) : coupon.expiresAt;
    if (assignmentExpiry && Number.isNaN(assignmentExpiry.getTime())) {
      throw createHttpError(400, "Assignment expiry date is invalid.");
    }
    const codeDoc = await CouponCode.create({
      code,
      coupon: coupon._id,
      kind: "customer",
      customerKey,
    });
    try {
      const assignment = await CustomerCoupon.create({
        coupon: coupon._id,
        code: codeDoc._id,
        customerKey,
        assignedBy: req.user._id,
        expiresAt: assignmentExpiry || null,
      });
      res.status(201).json({ success: true, data: { assignment, code } });
    } catch (error) {
      await CouponCode.findByIdAndDelete(codeDoc._id);
      throw error;
    }
  } catch (error) {
    if (error.code === 11000) return next(createHttpError(409, "That code is already assigned."));
    next(error);
  }
};

const listRedemptions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.couponId && mongoose.Types.ObjectId.isValid(req.query.couponId)) {
      filter.coupon = req.query.couponId;
    }
    if (req.query.status) filter.status = req.query.status;
    const [redemptions, summary] = await Promise.all([
      CouponRedemption.find(filter)
        .populate("coupon", "name discountType")
        .populate("order", "orderNumber orderDate bills.totalWithTax orderStatus")
        .sort({ createdAt: -1 })
        .limit(500)
        .lean(),
      CouponRedemption.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$status",
            redemptions: { $sum: 1 },
            discountGranted: { $sum: "$discountAmount" },
          },
        },
      ]),
    ]);
    res.status(200).json({ success: true, data: redemptions, summary });
  } catch (error) {
    next(error);
  }
};

const listCustomerAssignments = async (req, res, next) => {
  try {
    const customerKey = normalizePhone(req.query.phone);
    if (customerKey.length < 7) throw createHttpError(400, "Enter a valid customer phone number.");
    const assignments = await CustomerCoupon.find({ customerKey })
      .populate("coupon", "name status discountType discountValue expiresAt")
      .populate("code", "code")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.status(200).json({
      success: true,
      data: assignments.map(({ code, ...assignment }) => ({
        ...assignment,
        code: code?.code || "",
      })),
    });
  } catch (error) {
    next(error);
  }
};

const revokeCustomerAssignment = async (req, res, next) => {
  try {
    const assignment = await CustomerCoupon.findById(req.params.assignmentId);
    if (!assignment || String(assignment.coupon) !== req.params.id) {
      throw createHttpError(404, "Customer coupon assignment not found.");
    }
    assignment.status = "revoked";
    await assignment.save();
    await CouponCode.findByIdAndUpdate(assignment.code, { $set: { enabled: false } });
    res.status(200).json({ success: true, message: "Customer coupon revoked." });
  } catch (error) {
    next(error);
  }
};

const regenerateCustomerAssignment = async (req, res, next) => {
  try {
    const assignment = await CustomerCoupon.findById(req.params.assignmentId);
    if (!assignment || String(assignment.coupon) !== req.params.id || assignment.status !== "active") {
      throw createHttpError(404, "Active customer coupon assignment not found.");
    }
    const code = uniqueCode();
    const codeDoc = await CouponCode.create({
      code,
      coupon: assignment.coupon,
      kind: "customer",
      customerKey: assignment.customerKey,
    });
    try {
      const replacement = await CustomerCoupon.create({
        coupon: assignment.coupon,
        code: codeDoc._id,
        customerKey: assignment.customerKey,
        assignedBy: req.user._id,
        source: "regenerated",
        expiresAt: assignment.expiresAt,
      });
      assignment.status = "revoked";
      await assignment.save();
      await CouponCode.findByIdAndUpdate(assignment.code, { $set: { enabled: false } });
      res.status(201).json({ success: true, data: { assignment: replacement, code } });
    } catch (error) {
      await CouponCode.findByIdAndDelete(codeDoc._id);
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const validatePublicCoupon = async (req, res, next) => {
  try {
    const { code, phone, channel, items, existingDiscount } = req.body;
    if (channel !== (req.user ? "pos" : "online")) throw createHttpError(400, "Invalid order channel.");
    const quote = await validateCoupon({
      code,
      phone,
      channel,
      items,
      existingDiscount: Math.max(0, Number(existingDiscount) || 0),
    });
    res.status(200).json({
      success: true,
      data: {
        code: normalizeCode(code),
        name: quote.coupon.name,
        discountType: quote.coupon.discountType,
        discountAmount: quote.discountAmount,
        eligibleSubtotal: quote.eligibleSubtotal,
        minimumSubtotal: quote.coupon.minimumSubtotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignCoupon,
  createCoupon,
  listCustomerAssignments,
  listCoupons,
  listRedemptions,
  regenerateCustomerAssignment,
  revokeCustomerAssignment,
  setCouponStatus,
  updateCoupon,
  validatePublicCoupon,
};
