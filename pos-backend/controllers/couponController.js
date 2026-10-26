const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const Customer = require("../models/customerModel");
const CustomerCoupon = require("../models/customerCouponModel");
const { resolveCartPrices, calculateEligibleSubtotal, evaluateCoupon, buildWelcomeOfferCoupon, normalizePhoneDigits } = require("../services/couponService");
const { normalizeContactPhone } = require("../services/customerContactService");
const { normalizeNumber } = require("../services/whatsAppCampaignProvider");
const { buildCouponEmail, buildCouponMessage, isValidEmail, maskEmail } = require("../services/couponDeliveryService");
const { sendMail } = require("../utils/mailer");

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
    const couponIds = coupons.map((coupon) => coupon._id);
    const [assignmentCounts, redemptionCounts] = couponIds.length
      ? await Promise.all([
          CustomerCoupon.aggregate([
            { $match: { couponId: { $in: couponIds } } },
            {
              $group: {
                _id: "$couponId",
                assigned: { $sum: 1 },
                activeAssignments: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
              },
            },
          ]),
          CouponRedemption.aggregate([
            { $match: { couponId: { $in: couponIds } } },
            { $group: { _id: { couponId: "$couponId", status: "$status" }, count: { $sum: 1 } } },
          ]),
        ])
      : [[], []];
    const assignmentsByCoupon = new Map(assignmentCounts.map((item) => [String(item._id), item]));
    const redemptionsByCoupon = new Map();
    redemptionCounts.forEach(({ _id, count }) => {
      const couponId = String(_id.couponId);
      const counts = redemptionsByCoupon.get(couponId) || {};
      counts[_id.status] = count;
      redemptionsByCoupon.set(couponId, counts);
    });
    const couponsWithUsage = coupons.map((coupon) => {
      const assigned = assignmentsByCoupon.get(String(coupon._id));
      const redemptions = redemptionsByCoupon.get(String(coupon._id)) || {};
      return {
        ...coupon,
        assignedCount: assigned?.assigned || 0,
        activeAssignmentCount: assigned?.activeAssignments || 0,
        redeemedCount: redemptions.redeemed || 0,
        reservedCount: redemptions.reserved || 0,
      };
    });
    res.json({ success: true, data: couponsWithUsage, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
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
      phone: req.customer?.phone || req.body.phone,
      customerId: req.customer?._id,
      items,
      channel: "Online",
    });
    res.json({ success: true, data: { code: result.code, discountAmount: result.discountAmount, eligibleSubtotal: result.eligibleSubtotal } });
  } catch (error) {
    next(error);
  }
};

const validatePosCoupon = async (req, res, next) => {
  try {
    const items = await resolveCartPrices(req.body.items);
    const result = await evaluateCoupon({
      code: req.body.code,
      phone: req.body.phone,
      items,
      channel: "POS",
    });
    res.json({ success: true, data: { code: result.code, discountAmount: result.discountAmount, eligibleSubtotal: result.eligibleSubtotal } });
  } catch (error) {
    next(error);
  }
};

const checkWelcomeOffer = async (req, res, next) => {
  try {
    const channel = "Online";
    const phone = req.customer?.phone || req.body.phone || "";
    const normalizedPhone = normalizePhoneDigits(phone);
    const items = await resolveCartPrices(req.body.items);
    if (items.some((item) => item.isDeal || item.isPromotion || item.byo)) {
      return res.json({ success: true, data: { eligible: false } });
    }
    const subtotal = await calculateEligibleSubtotal(req.body.items, channel);
    const result = await buildWelcomeOfferCoupon({
      phone: normalizedPhone,
      customerId: req.customer?._id || null,
      channel,
      subtotal,
      session: null,
      now: new Date(),
    });
    res.json({ success: true, data: result.eligible ? result : { eligible: false } });
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
      filter.couponId = new mongoose.Types.ObjectId(req.query.couponId);
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
          redeemed: { $sum: { $cond: [{ $eq: ["$status", "redeemed"] }, 1, 0] } },
          reserved: { $sum: { $cond: [{ $eq: ["$status", "reserved"] }, 1, 0] } },
          reversed: { $sum: { $cond: [{ $eq: ["$status", "reversed"] }, 1, 0] } },
          refunded: { $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] } },
          discountTotal: { $sum: { $cond: [{ $eq: ["$status", "redeemed"] }, "$discountAmount", 0] } },
          reservedDiscountTotal: { $sum: { $cond: [{ $eq: ["$status", "reserved"] }, "$discountAmount", 0] } },
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
      summary: summary || { total: 0, redeemed: 0, reserved: 0, reversed: 0, refunded: 0, discountTotal: 0, reservedDiscountTotal: 0 },
      statusSummary,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    const assignments = await CustomerCoupon.find({
      customerId: req.customer._id,
      status: "active",
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      ],
    })
      .populate({
        path: "couponId",
        match: {
          status: { $in: ["active", "scheduled"] },
          $and: [
            { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
            { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
          ],
        },
        select: "name description discountType discountValue minimumSubtotal maximumDiscount startsAt expiresAt eligibleDishIds eligibleCategoryIds",
      })
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      success: true,
      data: assignments.filter((assignment) => assignment.couponId && assignment.redemptionCount < assignment.redemptionLimit),
    });
  } catch (error) {
    next(error);
  }
};

// Creates a one-customer private code for a campaign. Shared by "assign" and
// "send" so both apply exactly the same campaign date and status rules.
const issuePrivateCode = async ({ coupon, customer, redemptionLimit, requestedStartsAt = null, requestedExpiresAt = null, assignedBy }) => {
  if (!["active", "scheduled"].includes(coupon.status)) throw createHttpError(400, "Only active or scheduled coupons can be assigned.");
  const startsAt = requestedStartsAt || coupon.startsAt || null;
  const expiresAt = requestedExpiresAt || coupon.expiresAt || null;
  if (startsAt && expiresAt && startsAt >= expiresAt) throw createHttpError(400, "Expiry must be after the start date.");
  if (coupon.startsAt && startsAt && startsAt < coupon.startsAt) throw createHttpError(400, "Assignment cannot start before its campaign.");
  if (coupon.expiresAt && coupon.expiresAt <= new Date()) throw createHttpError(400, "This coupon campaign has expired.");
  if (coupon.expiresAt && (!expiresAt || expiresAt > coupon.expiresAt)) {
    throw createHttpError(400, "Assignment expiry cannot exceed the campaign expiry.");
  }
  const code = `PVT_${crypto.randomBytes(18).toString("base64url").toUpperCase()}`;
  const assignment = await CustomerCoupon.create({
    couponId: coupon._id,
    customerId: customer._id,
    code,
    source: "admin",
    redemptionLimit,
    startsAt,
    expiresAt,
    assignedBy,
  });
  return { assignment, code };
};

const assignCoupon = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(400, "Invalid coupon ID.");
    const email = String(req.body.email || "").trim().toLowerCase();
    const redemptionLimit = Number(req.body.redemptionLimit ?? 1);
    const requestedStartsAt = req.body.startsAt ? new Date(req.body.startsAt) : null;
    const requestedExpiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
    if (!/^\S+@\S+\.\S+$/.test(email)) throw createHttpError(400, "Enter a valid customer email address.");
    if (!Number.isInteger(redemptionLimit) || redemptionLimit < 1 || redemptionLimit > 100) {
      throw createHttpError(400, "Redemption limit must be a whole number between 1 and 100.");
    }
    if ((requestedStartsAt && Number.isNaN(requestedStartsAt.getTime())) || (requestedExpiresAt && Number.isNaN(requestedExpiresAt.getTime()))) {
      throw createHttpError(400, "Enter valid assignment dates.");
    }
    if (requestedStartsAt && requestedExpiresAt && requestedStartsAt >= requestedExpiresAt) throw createHttpError(400, "Expiry must be after the start date.");
    const [coupon, customer] = await Promise.all([
      Coupon.findById(req.params.id),
      Customer.findOne({ email, emailVerifiedAt: { $ne: null }, active: true }).select("_id email"),
    ]);
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    if (!customer) throw createHttpError(404, "No verified customer account was found for that email.");
    const { assignment, code } = await issuePrivateCode({
      coupon,
      customer,
      redemptionLimit,
      requestedStartsAt,
      requestedExpiresAt,
      assignedBy: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Customer coupon assigned. The private code is shown only once.",
      data: { id: assignment._id, customerEmail: customer.email, couponName: coupon.name, code },
    });
  } catch (error) {
    if (error.code === 11000) return next(createHttpError(409, "This customer already has this coupon assignment."));
    next(error);
  }
};

const getCouponAssignments = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
    const filter = {};
    if (req.query.couponId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.couponId)) throw createHttpError(400, "Invalid coupon ID.");
      filter.couponId = new mongoose.Types.ObjectId(req.query.couponId);
    }
    if (req.query.customerId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.customerId)) throw createHttpError(400, "Invalid customer ID.");
      filter.customerId = new mongoose.Types.ObjectId(req.query.customerId);
    }
    const [assignments, total] = await Promise.all([
      CustomerCoupon.find(filter)
        .select("-code")
        .populate("customerId", "name email")
        .populate("couponId", "name code discountType discountValue")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      CustomerCoupon.countDocuments(filter),
    ]);
    const [summary] = await CustomerCoupon.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          assigned: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          revoked: { $sum: { $cond: [{ $eq: ["$status", "revoked"] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] } },
        },
      },
    ]);
    res.json({
      success: true,
      data: assignments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: summary || { assigned: 0, active: 0, revoked: 0, expired: 0 },
    });
  } catch (error) {
    next(error);
  }
};

const revokeCouponAssignment = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.assignmentId)) throw createHttpError(400, "Invalid assignment ID.");
    const assignment = await CustomerCoupon.findOneAndUpdate(
      { _id: req.params.assignmentId, status: "active" },
      { $set: { status: "revoked" } },
      { new: true }
    );
    if (!assignment) throw createHttpError(404, "Active coupon assignment not found.");
    res.json({ success: true, message: "Customer coupon assignment revoked." });
  } catch (error) {
    next(error);
  }
};

// Staff type a phone number; this tells the screen who it belongs to and
// whether an email is on file, without returning the address itself.
const lookupCouponCustomer = async (req, res, next) => {
  try {
    const contact = normalizeContactPhone(req.query.phone);
    if (!contact) return res.json({ success: true, data: { valid: false } });
    const customer = await Customer.findOne({ phoneKey: contact.phoneKey })
      .select("name email emailVerifiedAt active contactOnly")
      .lean();
    res.json({
      success: true,
      data: {
        valid: true,
        found: Boolean(customer),
        name: customer?.name || "",
        hasEmail: Boolean(customer?.email),
        emailMasked: maskEmail(customer?.email),
        canReceivePrivateCode: Boolean(customer?.emailVerifiedAt && customer.active !== false),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Prepares a coupon for one customer: returns the WhatsApp text and number
// (the POS opens WhatsApp Web with it) and, when the customer has an email
// on file, emails the same coupon automatically.
//   mode "campaign" - the shared campaign code (works for any phone number)
//   mode "private"  - a new one-time code, verified customer accounts only
const sendCoupon = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) throw createHttpError(400, "Invalid coupon ID.");
    const contact = normalizeContactPhone(req.body.phone);
    if (!contact) throw createHttpError(400, "Enter a valid mobile number.");
    const whatsappPhone = normalizeNumber(contact.digits);
    if (!/^\d{10,15}$/.test(whatsappPhone)) throw createHttpError(400, "Enter a valid mobile number.");
    const mode = req.body.mode === "private" ? "private" : "campaign";
    const typedEmail = String(req.body.email || "").trim().toLowerCase();
    if (typedEmail && !isValidEmail(typedEmail)) throw createHttpError(400, "Enter a valid email address or leave it blank.");

    const [coupon, customer] = await Promise.all([
      Coupon.findById(req.params.id),
      Customer.findOne({ phoneKey: contact.phoneKey }).select("name email emailVerifiedAt active"),
    ]);
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    if (!["active", "scheduled"].includes(coupon.status)) throw createHttpError(400, "Only active or scheduled coupons can be sent.");
    if (coupon.expiresAt && coupon.expiresAt <= new Date()) throw createHttpError(400, "This coupon campaign has expired.");

    let code = coupon.code;
    if (mode === "private") {
      if (!customer || !customer.emailVerifiedAt || customer.active === false) {
        throw createHttpError(400, "A private one-time code needs a customer account with a verified email. Send the campaign code instead.");
      }
      ({ code } = await issuePrivateCode({ coupon, customer, redemptionLimit: 1, assignedBy: req.user._id }));
    }

    const name = String(req.body.name || "").trim().slice(0, 120) || customer?.name || "";
    // A private code only ever goes to the verified address on the account.
    const recipientEmail = mode === "private" ? customer.email : (typedEmail || customer?.email || "");

    let email = { status: "none", to: "" };
    if (recipientEmail) {
      const { subject, html } = buildCouponEmail({ name, coupon, code });
      try {
        const result = await sendMail({ to: recipientEmail, subject, html });
        email = { status: result?.skipped ? "not_configured" : "sent", to: maskEmail(recipientEmail) };
      } catch (error) {
        // Never block the WhatsApp message because the email failed.
        console.error("Coupon email could not be sent.", error.code || "");
        email = { status: "failed", to: maskEmail(recipientEmail) };
      }
    }

    res.status(mode === "private" ? 201 : 200).json({
      success: true,
      message: "Coupon ready to send.",
      data: {
        code,
        mode,
        message: buildCouponMessage({ name, coupon, code }),
        whatsapp: { phone: whatsappPhone },
        email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createHttpError(409, "This customer already has a private code for this coupon. Send the campaign code instead."));
    }
    next(error);
  }
};

module.exports = {
  lookupCouponCustomer,
  sendCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  archiveCoupon,
  duplicateCoupon,
  validatePublicCoupon,
  validatePosCoupon,
  checkWelcomeOffer,
  getCouponRedemptions,
  getMyCoupons,
  assignCoupon,
  getCouponAssignments,
  revokeCouponAssignment,
  buildCouponPayload,
};
