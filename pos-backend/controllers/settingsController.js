const Settings = require("../models/settingsModel");
const createHttpError = require("http-errors");
const config = require("../config/config");
const { normalizeByoConfig } = require("../utils/byoDiscount");
const { publicPaymentsShape, paymentsConfig, cleanText } = require("../utils/paymentUtils");
const { normalizePrepSettings, mergePrepSettings } = require("../utils/prepTimer");
const { normalizePasswordPolicy } = require("../utils/passwordPolicy");
const { getPromotionSettings } = require("../utils/promotionSettings");

const SETTINGS_KEY = "global";

const publicShape = (settings) => ({
  taxRatePercent: settings.taxRatePercent,
  buildYourOwnDeal: normalizeByoConfig(settings.buildYourOwnDeal),
  payments: publicPaymentsShape(settings),
  orderPrep: normalizePrepSettings(settings.orderPrep),
  passwordPolicy: normalizePasswordPolicy(settings.passwordPolicy),
  couponEntryEnabled: settings.promotionSettings
    ? getPromotionSettings(settings.promotionSettings).global.onlineCouponEntryEnabled
    : true,
  firstTimeCustomerOffer: {
    discountType: settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.discountType
      : "percentage",
    fixedAmount: settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.fixedAmount
      : null,
    enabled: Boolean(settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.enabled
      : settings.firstTimeCustomerOffer?.enabled),
    minimumSubtotal: Number(settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.minimumSubtotal
      : settings.firstTimeCustomerOffer?.minimumSubtotal ?? 1000),
    percentages: Array.isArray(settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.percentages
      : settings.firstTimeCustomerOffer?.percentages)
      ? (settings.promotionSettings
        ? getPromotionSettings(settings.promotionSettings).welcome.percentages
        : settings.firstTimeCustomerOffer.percentages).map(Number).filter((value) => Number.isFinite(value) && value > 0)
      : [5, 7, 10],
    selectionMethod: settings.firstTimeCustomerOffer?.selectionMethod || "random",
    maxDiscountAmount: settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.maximumDiscount
      : settings.firstTimeCustomerOffer?.maxDiscountAmount ?? null,
    startsAt: settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.startsAt
      : settings.firstTimeCustomerOffer?.startsAt || null,
    expiresAt: settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.endsAt
      : settings.firstTimeCustomerOffer?.expiresAt || null,
    maxCampaignRedemptions: settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.maxCampaignRedemptions
      : settings.firstTimeCustomerOffer?.maxCampaignRedemptions ?? null,
    redemptionCount: Number(settings.welcomeOfferRedemptionCount || 0),
    maxOnePerCustomer: Boolean(settings.firstTimeCustomerOffer?.maxOnePerCustomer ?? true),
    eligibleChannels: settings.promotionSettings
      ? getPromotionSettings(settings.promotionSettings).welcome.eligibleChannels
      : Array.isArray(settings.firstTimeCustomerOffer?.eligibleChannels) && settings.firstTimeCustomerOffer.eligibleChannels.length
        ? settings.firstTimeCustomerOffer.eligibleChannels
      : ["Online", "POS", "Pickup", "Delivery"],
    popupTitle: settings.firstTimeCustomerOffer?.popupTitle || "Welcome to our Pizza Store!",
    popupDescription: settings.firstTimeCustomerOffer?.popupDescription || "You're eligible for a special first-order reward.",
    applyButtonLabel: settings.firstTimeCustomerOffer?.applyButtonLabel || "Apply Discount",
    declineButtonLabel: settings.firstTimeCustomerOffer?.declineButtonLabel || "No Thanks",
  },
});

// Seeds from the old static env default (config.TAX_RATE_PERCENT) the very
// first time this is read, so an existing deployment doesn't suddenly
// change its tax rate the moment this ships.
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: SETTINGS_KEY });
  if (!settings) {
    settings = await Settings.create({
      key: SETTINGS_KEY,
      taxRatePercent: config.TAX_RATE_PERCENT,
    });
  }
  return settings;
};

// Public - no auth. The POS reads this before login-gated screens exist for
// a customer, and the online store (genzpizza.online) has no login at all,
// so both need to be able to fetch the live tax rate without a token.
const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, data: publicShape(settings) });
  } catch (error) {
    next(error);
  }
};

// Admin-only. Partial update: send `taxRatePercent`, `buildYourOwnDeal`, or
// both - whatever isn't sent is left exactly as it was. Every order (dine-in,
// outdoor/takeaway, online) reads these live, so one save is enough for it to
// "apply everywhere".
const updateSettings = async (req, res, next) => {
  try {
    const { taxRatePercent, buildYourOwnDeal, payments, orderPrep, passwordPolicy, firstTimeCustomerOffer } = req.body;
    const settings = await getOrCreateSettings();
    const messages = [];
    const couponAuditChanges = [];

    if (taxRatePercent !== undefined) {
      const value = Number(taxRatePercent);
      if (Number.isNaN(value) || value < 0) {
        return next(createHttpError(400, "Tax rate must be a number 0 or greater."));
      }
      settings.taxRatePercent = value;
      messages.push("Tax rate updated!");
    }

    if (buildYourOwnDeal !== undefined) {
      if (!buildYourOwnDeal || typeof buildYourOwnDeal !== "object") {
        return next(createHttpError(400, "Invalid Build Your Own Deal settings."));
      }
      const current = normalizeByoConfig(settings.buildYourOwnDeal);
      const next_ = { ...current };

      if (buildYourOwnDeal.enabled !== undefined) next_.enabled = Boolean(buildYourOwnDeal.enabled);

      for (const field of ["discount3", "discount4", "discount5Plus"]) {
        if (buildYourOwnDeal[field] === undefined) continue;
        const v = Number(buildYourOwnDeal[field]);
        if (Number.isNaN(v) || v < 0 || v > 90) {
          return next(createHttpError(400, "Each discount must be a number between 0 and 90."));
        }
        next_[field] = v;
      }

      if (buildYourOwnDeal.description !== undefined) {
        if (typeof buildYourOwnDeal.description !== "string" || buildYourOwnDeal.description.length > 300) {
          return next(createHttpError(400, "The deal description must be text no longer than 300 characters."));
        }
        next_.description = buildYourOwnDeal.description;
      }

      settings.buildYourOwnDeal = next_;
      messages.push("Build Your Own Deal updated!");
    }

    if (payments !== undefined) {
      if (!payments || typeof payments !== "object") {
        return next(createHttpError(400, "Invalid payment settings."));
      }
      const current = paymentsConfig(settings);
      const updated = { ...current };

      for (const flag of ["codEnabled", "jazzcashEnabled"]) {
        if (payments[flag] !== undefined) updated[flag] = Boolean(payments[flag]);
      }
      if (!updated.codEnabled && !updated.jazzcashEnabled) {
        return next(createHttpError(400, "At least one payment method must stay turned on."));
      }

      if (payments.merchantName !== undefined) {
        const name = cleanText(payments.merchantName, 60);
        if (name.length < 2) return next(createHttpError(400, "Enter the merchant name (at least 2 characters)."));
        updated.merchantName = name;
      }
      if (payments.tillId !== undefined) {
        const till = String(payments.tillId).replace(/\s+/g, "");
        if (!/^\d{6,20}$/.test(till)) return next(createHttpError(400, "The Till ID must be 6 to 20 digits."));
        updated.tillId = till;
      }
      if (payments.dialCode !== undefined) {
        const dial = String(payments.dialCode).trim();
        if (!/^[*#0-9]{3,20}$/.test(dial)) return next(createHttpError(400, "The dial code can only contain digits, * and #."));
        updated.dialCode = dial;
      }
      if (payments.qrImage !== undefined) {
        const img = String(payments.qrImage).trim();
        // Only images uploaded through this system (or empty = bundled default).
        if (img && !/^\/uploads\/[A-Za-z0-9._-]+$/.test(img)) {
          return next(createHttpError(400, "Please upload the QR image using the upload button."));
        }
        updated.qrImage = img;
      }

      settings.payments = updated;
      messages.push("Payment settings updated!");
    }

    if (orderPrep !== undefined) {
      const merged = mergePrepSettings(settings.orderPrep, orderPrep);
      if (merged.error) return next(createHttpError(400, merged.error));
      settings.orderPrep = merged.settings;
      messages.push("Order preparation settings saved!");
    }

    if (passwordPolicy !== undefined) {
      if (!passwordPolicy || typeof passwordPolicy !== "object" || Array.isArray(passwordPolicy)) {
        return next(createHttpError(400, "Invalid password policy settings."));
      }
      const current = normalizePasswordPolicy(settings.passwordPolicy);
      const nextPolicy = { ...current };

      if (passwordPolicy.minLength !== undefined) {
        const minLength = Number(passwordPolicy.minLength);
        if (!Number.isInteger(minLength) || minLength < 8 || minLength > 64) {
          return next(createHttpError(400, "Minimum password length must be a whole number from 8 to 64."));
        }
        nextPolicy.minLength = minLength;
      }

      for (const flag of ["requireUppercase", "requireLowercase", "requireNumber", "requireSymbol"]) {
        if (passwordPolicy[flag] === undefined) continue;
        if (typeof passwordPolicy[flag] !== "boolean") {
          return next(createHttpError(400, "Password policy requirements must be enabled or disabled."));
        }
        nextPolicy[flag] = passwordPolicy[flag];
      }

      settings.passwordPolicy = nextPolicy;
      messages.push("Password policy updated!");
    }

    if (firstTimeCustomerOffer !== undefined) {
      if (!firstTimeCustomerOffer || typeof firstTimeCustomerOffer !== "object") {
        return next(createHttpError(400, "Invalid first-time customer welcome offer settings."));
      }
      const currentOffer = settings.firstTimeCustomerOffer || {
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
      const nextOffer = { ...currentOffer };

      if (firstTimeCustomerOffer.enabled !== undefined) nextOffer.enabled = Boolean(firstTimeCustomerOffer.enabled);
      if (firstTimeCustomerOffer.minimumSubtotal !== undefined) {
        const minimumSubtotal = Number(firstTimeCustomerOffer.minimumSubtotal);
        if (!Number.isFinite(minimumSubtotal) || minimumSubtotal < 0) {
          return next(createHttpError(400, "Minimum subtotal must be 0 or greater."));
        }
        nextOffer.minimumSubtotal = minimumSubtotal;
      }
      if (firstTimeCustomerOffer.percentages !== undefined) {
        const percentages = Array.isArray(firstTimeCustomerOffer.percentages)
          ? firstTimeCustomerOffer.percentages.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0 && value <= 100)
          : [];
        if (!percentages.length) {
          return next(createHttpError(400, "At least one valid discount percentage is required."));
        }
        nextOffer.percentages = [...new Set(percentages)].sort((a, b) => a - b);
      }
      if (firstTimeCustomerOffer.selectionMethod !== undefined) {
        if (firstTimeCustomerOffer.selectionMethod !== "random") {
          return next(createHttpError(400, "Only random selection is supported for this campaign."));
        }
        nextOffer.selectionMethod = "random";
      }
      if (firstTimeCustomerOffer.maxDiscountAmount !== undefined) {
        const maxDiscount = firstTimeCustomerOffer.maxDiscountAmount === null || firstTimeCustomerOffer.maxDiscountAmount === ""
          ? null
          : Number(firstTimeCustomerOffer.maxDiscountAmount);
        if (maxDiscount !== null && (!Number.isFinite(maxDiscount) || maxDiscount < 0)) {
          return next(createHttpError(400, "Maximum discount amount must be 0 or greater."));
        }
        nextOffer.maxDiscountAmount = maxDiscount;
      }
      if (firstTimeCustomerOffer.startsAt !== undefined) {
        nextOffer.startsAt = firstTimeCustomerOffer.startsAt ? new Date(firstTimeCustomerOffer.startsAt) : null;
        if (nextOffer.startsAt && Number.isNaN(nextOffer.startsAt.getTime())) {
          return next(createHttpError(400, "The offer start date must be valid."));
        }
      }
      if (firstTimeCustomerOffer.expiresAt !== undefined) {
        nextOffer.expiresAt = firstTimeCustomerOffer.expiresAt ? new Date(firstTimeCustomerOffer.expiresAt) : null;
        if (nextOffer.expiresAt && Number.isNaN(nextOffer.expiresAt.getTime())) {
          return next(createHttpError(400, "The offer expiry date must be valid."));
        }
      }
      if (nextOffer.startsAt && nextOffer.expiresAt && nextOffer.startsAt >= nextOffer.expiresAt) {
        return next(createHttpError(400, "The offer expiry date must be after the start date."));
      }
      if (firstTimeCustomerOffer.maxCampaignRedemptions !== undefined) {
        const limit = firstTimeCustomerOffer.maxCampaignRedemptions === null || firstTimeCustomerOffer.maxCampaignRedemptions === ""
          ? null
          : Number(firstTimeCustomerOffer.maxCampaignRedemptions);
        if (limit !== null && (!Number.isInteger(limit) || limit < 1)) {
          return next(createHttpError(400, "Campaign redemption limit must be a positive whole number."));
        }
        nextOffer.maxCampaignRedemptions = limit;
      }
      if (firstTimeCustomerOffer.maxOnePerCustomer !== undefined) nextOffer.maxOnePerCustomer = Boolean(firstTimeCustomerOffer.maxOnePerCustomer);
      if (firstTimeCustomerOffer.eligibleChannels !== undefined) {
        const channels = Array.isArray(firstTimeCustomerOffer.eligibleChannels) ? firstTimeCustomerOffer.eligibleChannels : [];
        const validChannels = ["Online", "POS", "Pickup", "Delivery"];
        const cleaned = channels.filter((channel) => validChannels.includes(channel));
        if (!cleaned.length) return next(createHttpError(400, "Choose at least one valid order channel."));
        nextOffer.eligibleChannels = [...new Set(cleaned)];
      }
      if (firstTimeCustomerOffer.popupTitle !== undefined) {
        const popupTitle = String(firstTimeCustomerOffer.popupTitle || "").trim();
        if (!popupTitle || popupTitle.length > 120) return next(createHttpError(400, "The popup title must be a short text string."));
        nextOffer.popupTitle = popupTitle;
      }
      if (firstTimeCustomerOffer.popupDescription !== undefined) {
        const popupDescription = String(firstTimeCustomerOffer.popupDescription || "").trim();
        if (!popupDescription || popupDescription.length > 300) return next(createHttpError(400, "The popup description must be text no longer than 300 characters."));
        nextOffer.popupDescription = popupDescription;
      }
      if (firstTimeCustomerOffer.applyButtonLabel !== undefined) {
        const label = String(firstTimeCustomerOffer.applyButtonLabel || "").trim();
        if (!label || label.length > 40) return next(createHttpError(400, "The apply button label must be 1 to 40 characters."));
        nextOffer.applyButtonLabel = label;
      }
      if (firstTimeCustomerOffer.declineButtonLabel !== undefined) {
        const label = String(firstTimeCustomerOffer.declineButtonLabel || "").trim();
        if (!label || label.length > 40) return next(createHttpError(400, "The decline button label must be 1 to 40 characters."));
        nextOffer.declineButtonLabel = label;
      }

      settings.firstTimeCustomerOffer = nextOffer;
      const promotionSettings = getPromotionSettings(settings.promotionSettings);
      promotionSettings.welcome = {
        ...promotionSettings.welcome,
        enabled: nextOffer.enabled,
        discountType: "percentage",
        minimumSubtotal: nextOffer.minimumSubtotal,
        percentages: nextOffer.percentages,
        maximumDiscount: nextOffer.maxDiscountAmount,
        startsAt: nextOffer.startsAt,
        endsAt: nextOffer.expiresAt,
        eligibleChannels: nextOffer.eligibleChannels.filter((channel) => ["Online", "POS"].includes(channel)),
      };
      if (!promotionSettings.welcome.eligibleChannels.length) promotionSettings.welcome.eligibleChannels = ["Online"];
      settings.promotionSettings = promotionSettings;
      couponAuditChanges.push({
        area: "welcome-offer",
        previousValue: JSON.parse(JSON.stringify(currentOffer)),
        newValue: JSON.parse(JSON.stringify(nextOffer)),
      });
      messages.push("First-time customer welcome offer updated!");
    }

    if (messages.length === 0) {
      return next(createHttpError(400, "Nothing to update."));
    }

    if (couponAuditChanges.length) {
      const audit = [...(settings.couponSettingsAudit || [])];
      for (const change of couponAuditChanges) {
        audit.push({
          changedAt: new Date(),
          changedBy: req.user?._id || null,
          changedByName: String(req.user?.name || req.user?.email || "").slice(0, 120),
          ...change,
        });
      }
      settings.couponSettingsAudit = audit.slice(-200);
    }
    await settings.save();

    res.status(200).json({
      success: true,
      message: messages.join(" "),
      data: publicShape(settings),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings, getOrCreateSettings };
