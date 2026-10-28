const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const Customer = require("../models/customerModel");
const Settings = require("../models/settingsModel");
const Branch = require("../models/branchModel");
const customerPhoneKey = require("../utils/customerPhoneKey");
const normalizePakistaniMobile = require("../utils/normalizePakistaniMobile");
const pakistaniMobileKey = require("../utils/pakistaniMobileKey");
const { quoteFulfillment } = require("../utils/fulfillment");
const { DEFAULT_COUPON_CAMPAIGNS } = require("../utils/couponCampaignRules");
const {
  generateFridayCoupons,
  generateWelcomeCoupon,
} = require("../services/couponCampaignService");
const {
  resolveCouponItems,
  validateCoupon,
  reverseRedemption,
  roundMoney,
} = require("../services/couponService");

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
      customerId: req.customer?._id || null,
      phone: req.customer?.phone || req.body.phone || "",
      email: req.customer?.email || req.body.email || "",
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
    const now = new Date();
    const andFilters = [];
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const normalizedPhone = normalizePakistaniMobile(search);
      const phoneKey = pakistaniMobileKey(normalizedPhone);
      const legacyPhoneKey = normalizedPhone ? customerPhoneKey(normalizedPhone) : "";
      const customerIds = await Customer.find({
        $or: [
          { name: { $regex: escaped, $options: "i" } },
          { phone: { $regex: escaped, $options: "i" } },
          { email: { $regex: escaped, $options: "i" } },
          ...(legacyPhoneKey ? [{ phoneKey: legacyPhoneKey }] : []),
        ],
      }).distinct("_id");
      andFilters.push({ $or: [
        { code: { $regex: escaped, $options: "i" } },
        { name: { $regex: escaped, $options: "i" } },
        { recipientName: { $regex: escaped, $options: "i" } },
        { recipientPhone: { $regex: escaped, $options: "i" } },
        { recipientEmail: { $regex: escaped, $options: "i" } },
        ...(customerIds.length ? [{ customerId: { $in: customerIds } }] : []),
        ...(normalizedPhone ? [{ recipientPhone: { $regex: `${normalizedPhone}$` } }] : []),
        ...(phoneKey ? [{ recipientPhoneKey: phoneKey }] : []),
      ] });
    }
    if (req.query.type && ["manual", "welcome", "friday", "birthday"].includes(req.query.type)) {
      filter.campaignType = req.query.type;
    } else if (req.query.type) {
      throw createHttpError(400, "Choose a valid coupon type filter.");
    }
    if (req.query.contact && ["available", "missing"].includes(req.query.contact)) {
      const hasContact = {
        $or: [
          { phone: { $regex: "\\S" } },
          { email: { $regex: "\\S" } },
        ],
      };
      const customerIds = await Customer.find(hasContact).distinct("_id");
      filter.$and = [
        ...(filter.$and || []),
        req.query.contact === "available"
          ? { $or: [
              { customerId: { $in: customerIds } },
              { recipientPhone: { $regex: "\\S" } },
              { recipientEmail: { $regex: "\\S" } },
            ] }
          : { $and: [
              { customerId: { $nin: customerIds } },
              { $or: [{ recipientPhone: "" }, { recipientPhone: { $exists: false } }] },
              { $or: [{ recipientEmail: "" }, { recipientEmail: { $exists: false } }] },
            ] },
      ];
    } else if (req.query.contact) {
      throw createHttpError(400, "Choose a valid contact information filter.");
    }
    if (status === "active") andFilters.push({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      redeemedCount: 0,
    });
    else if (status === "redeemed") filter.redeemedCount = { $gt: 0 };
    else if (status === "expired") andFilters.push({
      isActive: true,
      expiresAt: { $lte: now },
      redeemedCount: 0,
    });
    else if (status === "cancelled") filter.isActive = false;
    else if (status !== "all") throw createHttpError(400, "Choose a valid coupon status filter.");

    if (req.query.from || req.query.to) {
      const createdAt = {};
      if (req.query.from) {
        const from = new Date(req.query.from);
        if (Number.isNaN(from.getTime())) throw createHttpError(400, "Enter a valid start date.");
        createdAt.$gte = from;
      }
      if (req.query.to) {
        const to = new Date(req.query.to);
        if (Number.isNaN(to.getTime())) throw createHttpError(400, "Enter a valid end date.");
        to.setHours(23, 59, 59, 999);
        createdAt.$lte = to;
      }
      filter.createdAt = createdAt;
    }
    if (andFilters.length) filter.$and = [...(filter.$and || []), ...andFilters];
    const [coupons, total] = await Promise.all([
      Coupon.find(filter)
        .populate("customerId", "name phone email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Coupon.countDocuments(filter),
    ]);
    const [active, redeemed, expired, cancelled, generatedToday, birthdayUnread] = await Promise.all([
      Coupon.countDocuments({
        isActive: true,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        redeemedCount: 0,
        archivedAt: null,
      }),
      Coupon.countDocuments({ redeemedCount: { $gt: 0 }, archivedAt: null }),
      Coupon.countDocuments({ isActive: true, expiresAt: { $lte: now }, redeemedCount: 0, archivedAt: null }),
      Coupon.countDocuments({ isActive: false, archivedAt: null }),
      Coupon.countDocuments({ createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } }),
      Coupon.countDocuments({ campaignType: "birthday", notificationReadAt: null, archivedAt: null }),
    ]);
    res.status(200).json({
      success: true,
      data: coupons,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: { active, redeemed, expired, cancelled, generatedToday, birthdayUnread },
    });
  } catch (error) {
    next(error);
  }
};

const getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("customerId", "name phone email dateOfBirth")
      .lean();
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

const getSettingsRecord = async () => {
  let settings = await Settings.findOne({ key: "global" });
  if (!settings) settings = await Settings.create({ key: "global" });
  return settings;
};

const couponCampaignSettings = (settings) => {
  const stored = settings.couponCampaigns?.toObject
    ? settings.couponCampaigns.toObject()
    : settings.couponCampaigns;
  return stored || structuredClone(DEFAULT_COUPON_CAMPAIGNS);
};

const getCouponCampaignSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsRecord();
    res.status(200).json({
      success: true,
      data: {
        ...couponCampaignSettings(settings),
        currency: settings.assetAccounting?.currency || "PKR",
      },
    });
  } catch (error) {
    next(error);
  }
};

const normalizeCampaignSettings = (currentSettings, input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw createHttpError(400, "Provide valid coupon campaign settings.");
  }
  const result = structuredClone(currentSettings);
  const validatePercentages = (percentages) => {
    if (!Array.isArray(percentages) || percentages.length === 0 || percentages.length > 20) {
      throw createHttpError(400, "Provide at least one discount percentage.");
    }
    const values = percentages.map(Number);
    if (values.some((value) => !Number.isFinite(value) || value <= 0 || value > 100)) {
      throw createHttpError(400, "Discount percentages must be greater than 0 and no more than 100.");
    }
    return [...new Set(values)];
  };
  const normalizeGroup = (type, group) => {
    if (!group || typeof group !== "object" || Array.isArray(group)) {
      throw createHttpError(400, `Provide valid ${type} coupon settings.`);
    }
    const allowed = type === "welcome"
      ? ["enabled", "minimumSubtotal", "percentages", "expiryHours", "maxOnePerCustomer"]
      : type === "friday"
        ? ["campaignName", "automaticGeneration", "campaignDay", "generationTime", "minimumSubtotal", "percentages", "expiryHours", "timezone"]
        : ["campaignName", "enabled", "discountMode", "fixedPercentage", "percentages", "minimumSubtotal", "expiryHours", "checkTime", "timezone"];
    if (Object.keys(group).some((key) => !allowed.includes(key))) {
      throw createHttpError(400, `Unsupported ${type} coupon setting.`);
    }
    const next = { ...result[type], ...group };
    if (type !== "welcome") {
      next.campaignName = String(next.campaignName || "").trim();
      if (!next.campaignName || next.campaignName.length > 100) {
        throw createHttpError(400, `${type} campaign name must contain 1 to 100 characters.`);
      }
    }
    if (type !== "friday" && typeof next.enabled !== "boolean") {
      throw createHttpError(400, `${type} coupon enabled setting must be true or false.`);
    }
    next.minimumSubtotal = Number(next.minimumSubtotal);
    next.expiryHours = Number(next.expiryHours);
    if (!Number.isFinite(next.minimumSubtotal) || next.minimumSubtotal < 0 ||
        !Number.isInteger(next.expiryHours) || next.expiryHours < 1 || next.expiryHours > 8760) {
      throw createHttpError(400, `${type} coupon minimum subtotal or expiry is invalid.`);
    }
    next.percentages = validatePercentages(next.percentages);
    if (type === "welcome") {
      if (typeof next.maxOnePerCustomer !== "boolean") {
        throw createHttpError(400, "Choose whether a customer can receive only one welcome coupon.");
      }
    } else {
      if (typeof next.timezone !== "string" || next.timezone.length > 80) {
        throw createHttpError(400, "Enter a valid campaign timezone.");
      }
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: next.timezone });
      } catch {
        throw createHttpError(400, "Enter a valid campaign timezone.");
      }
    }
    if (type === "friday" && typeof next.automaticGeneration !== "boolean") {
      throw createHttpError(400, "Automatic Friday generation must be enabled or disabled.");
    }
    if (type === "friday") {
      next.campaignDay = Number(next.campaignDay);
      if (!Number.isInteger(next.campaignDay) || next.campaignDay < 0 || next.campaignDay > 6) {
        throw createHttpError(400, "Choose a valid campaign day.");
      }
      if (typeof next.generationTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(next.generationTime)) {
        throw createHttpError(400, "Enter a valid campaign generation time.");
      }
    }
    if (type === "birthday") {
      if (typeof next.checkTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(next.checkTime)) {
        throw createHttpError(400, "Enter a valid daily birthday check time.");
      }
      if (!["fixed", "random"].includes(next.discountMode)) {
        throw createHttpError(400, "Choose a fixed or random birthday discount.");
      }
      next.fixedPercentage = Number(next.fixedPercentage);
      if (!Number.isFinite(next.fixedPercentage) || next.fixedPercentage <= 0 || next.fixedPercentage > 100) {
        throw createHttpError(400, "The birthday discount must be greater than 0 and no more than 100.");
      }
    }
    return next;
  };

  for (const type of ["welcome", "friday", "birthday"]) {
    if (Object.hasOwn(input, type)) result[type] = normalizeGroup(type, input[type]);
  }
  if (!["welcome", "friday", "birthday"].some((type) => Object.hasOwn(input, type))) {
    throw createHttpError(400, "Provide at least one coupon settings group.");
  }
  return result;
};

const updateCouponCampaignSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsRecord();
    const previousValue = couponCampaignSettings(settings);
    const nextValue = normalizeCampaignSettings(previousValue, req.body);
    settings.couponCampaigns = nextValue;
    settings.couponSettingsAudit.push({
      changedAt: new Date(),
      changedBy: req.user?._id || null,
      changedByName: req.user?.name || "",
      area: "couponCampaigns",
      previousValue,
      newValue: nextValue,
    });
    settings.couponSettingsAudit = settings.couponSettingsAudit.slice(-100);
    await settings.save();
    res.status(200).json({
      success: true,
      message: "Coupon campaign settings saved.",
      data: couponCampaignSettings(settings),
    });
  } catch (error) {
    next(error);
  }
};

const issueWelcomeCoupon = async (req, res, next) => {
  try {
    const settingsDoc = await getSettingsRecord();
    const settings = couponCampaignSettings(settingsDoc).welcome;
    if (!settings.enabled) throw createHttpError(400, "Welcome coupons are not available right now.");

    let customer = req.customer || null;
    const email = String(req.body.email || "").trim().toLowerCase();
    const digits = String(req.body.phone || "").replace(/\D/g, "");
    if (!customer && email && /^\S+@\S+\.\S+$/.test(email)) {
      customer = await Customer.findOne({ email, active: true });
    }
    if (!customer && digits.length >= 10 && digits.length <= 15) {
      customer = await Customer.findOne({ phoneKey: customerPhoneKey(digits), active: true });
    }
    if (!customer || customer.contactOnly && !email && !digits) {
      throw createHttpError(400, "A welcome coupon is not available for this account.");
    }

    const result = await generateWelcomeCoupon({ customer, settings });
    if (!result.eligible || !result.coupon) {
      throw createHttpError(400, "A welcome coupon is not available for this account.");
    }
    res.status(200).json({
      success: true,
      message: "Your coupon is ready!",
      data: {
        code: result.coupon.code,
        discountPercentage: result.coupon.discountValue,
        minimumSubtotal: result.coupon.minimumOrderAmount,
        expiresAt: result.coupon.expiresAt,
        timezone: "UTC",
        existing: Boolean(result.existing),
      },
    });
  } catch (error) {
    next(error);
  }
};

const generateFridayCampaign = async (req, res, next) => {
  try {
    if (req.body.confirm !== true) throw createHttpError(400, "Confirm generation before issuing customer coupons.");
    const settingsDoc = await getSettingsRecord();
    const config = couponCampaignSettings(settingsDoc).friday;
    const result = await generateFridayCoupons({
      settings: config,
      timezone: config.timezone,
    });
    res.status(200).json({
      success: true,
      message: result.eligible === 0
        ? "No eligible customers were found."
        : `Generation finished. ${result.generated} generated; ${result.skipped} skipped; ${result.errors} errors.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const cancelCoupon = async (req, res, next) => {
  try {
    const existing = await Coupon.findById(req.params.id);
    if (!existing) throw createHttpError(404, "Coupon not found.");
    if (existing.redeemedCount > 0) throw createHttpError(409, "A redeemed coupon cannot be cancelled.");
    if (existing.reservedCount > 0) {
      throw createHttpError(409, "This coupon is reserved for a pending order and cannot be cancelled yet.");
    }
    const coupon = await Coupon.findOneAndUpdate(
      { _id: req.params.id, isActive: true, redeemedCount: 0, reservedCount: 0 },
      { $set: { isActive: false, cancelledAt: new Date() } },
      { new: true }
    );
    if (!coupon) throw createHttpError(409, "This coupon is no longer active.");
    res.status(200).json({ success: true, message: "Coupon cancelled.", data: coupon });
  } catch (error) {
    next(error);
  }
};

const setCouponActive = async (req, res, next) => {
  try {
    if (typeof req.body.active !== "boolean") {
      throw createHttpError(400, "Choose whether the coupon should be active.");
    }
    const coupon = await Coupon.findOne({ _id: req.params.id, archivedAt: null });
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    if (coupon.isActive === req.body.active) {
      return res.status(200).json({
        success: true,
        message: req.body.active ? "Coupon is already active." : "Coupon is already inactive.",
        data: coupon,
      });
    }
    if (coupon.redeemedCount > 0) {
      throw createHttpError(409, "A redeemed coupon cannot be activated or deactivated.");
    }
    if (coupon.reservedCount > 0) {
      throw createHttpError(409, "This coupon is reserved for a pending order and cannot be changed.");
    }
    if (req.body.active && coupon.expiresAt && coupon.expiresAt <= new Date()) {
      throw createHttpError(409, "An expired coupon cannot be reactivated.");
    }
    coupon.isActive = req.body.active;
    if (req.body.active) coupon.cancelledAt = null;
    await coupon.save();
    res.status(200).json({
      success: true,
      message: coupon.isActive ? "Coupon activated." : "Coupon deactivated.",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

const archiveCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id, archivedAt: null });
    if (!coupon) throw createHttpError(404, "Coupon not found.");
    if (coupon.reservedCount > 0) {
      throw createHttpError(409, "This coupon is reserved for a pending order and cannot be deleted yet.");
    }
    coupon.archivedAt = new Date();
    await coupon.save();
    res.status(200).json({
      success: true,
      message: "Coupon removed from the list. Redemption and audit history are retained.",
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

const listBirthdayNotifications = async (req, res, next) => {
  try {
    const unreadOnly = req.query.unread === "true";
    const filter = { campaignType: "birthday", archivedAt: null };
    if (unreadOnly) filter.notificationReadAt = null;
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 25));
    const [coupons, total, unreadCount] = await Promise.all([
      Coupon.find(filter)
        .populate("customerId", "name phone email dateOfBirth")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Coupon.countDocuments(filter),
      Coupon.countDocuments({ campaignType: "birthday", notificationReadAt: null, archivedAt: null }),
    ]);
    res.status(200).json({
      success: true,
      data: coupons,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const markBirthdayNotificationRead = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      { _id: req.params.id, campaignType: "birthday" },
      { $set: { notificationReadAt: new Date() } },
      { new: true }
    );
    if (!coupon) throw createHttpError(404, "Birthday notification not found.");
    res.status(200).json({ success: true, message: "Notification marked as read.", data: coupon });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCouponForOrder,
  listCoupons,
  getCoupon,
  listCouponRedemptions,
  getCouponReport,
  reverseCouponRedemption,
  getCouponCampaignSettings,
  updateCouponCampaignSettings,
  issueWelcomeCoupon,
  generateFridayCampaign,
  cancelCoupon,
  setCouponActive,
  archiveCoupon,
  listBirthdayNotifications,
  markBirthdayNotificationRead,
};
