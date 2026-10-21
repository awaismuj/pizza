const Settings = require("../models/settingsModel");
const createHttpError = require("http-errors");
const config = require("../config/config");
const { normalizeByoConfig } = require("../utils/byoDiscount");
const { publicPaymentsShape, paymentsConfig, cleanText } = require("../utils/paymentUtils");
const { normalizePrepSettings, mergePrepSettings } = require("../utils/prepTimer");

const SETTINGS_KEY = "global";

const publicShape = (settings) => ({
  taxRatePercent: settings.taxRatePercent,
  buildYourOwnDeal: normalizeByoConfig(settings.buildYourOwnDeal),
  payments: publicPaymentsShape(settings),
  orderPrep: normalizePrepSettings(settings.orderPrep),
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
    const { taxRatePercent, buildYourOwnDeal, payments, orderPrep } = req.body;
    const settings = await getOrCreateSettings();
    const messages = [];

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

    if (messages.length === 0) {
      return next(createHttpError(400, "Nothing to update."));
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
