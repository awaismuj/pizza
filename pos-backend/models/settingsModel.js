const mongoose = require("mongoose");

// Singleton document (single fixed `key`) so there's always exactly one
// settings record to read/update, instead of a whole collection for one row.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    // Applied to every order - dine-in, outdoor/takeaway and online - from
    // wherever it's read. Admin-editable from Dashboard > Tax.
    taxRatePercent: { type: Number, required: true, default: 16, min: 0 },
    // "Build Your Own Deal" (online store): the customer picks any items from
    // the menu - at least `minItems` of them - and gets a discount that grows
    // with how many they pick. Every number here is admin-editable from
    // Dashboard > Build Your Own, so the shop can run 13% one week and 18%
    // the next without touching code.
    buildYourOwnDeal: {
      enabled: { type: Boolean, default: true },
      minItems: { type: Number, default: 3, min: 1 },
      discount3: { type: Number, default: 15, min: 0, max: 90 }, // exactly 3 items
      discount4: { type: Number, default: 17, min: 0, max: 90 }, // exactly 4 items
      discount5Plus: { type: Number, default: 20, min: 0, max: 90 }, // 5 or more
      description: {
        type: String,
        default:
          "Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically.",
        maxlength: 300,
      },
    },
    // Online-store payment options, editable from Dashboard > Payment Settings.
    payments: {
      codEnabled: { type: Boolean, default: true },
      jazzcashEnabled: { type: Boolean, default: true },
      merchantName: { type: String, default: "GEN Z FOOD", trim: true, maxlength: 60 },
      tillId: { type: String, default: "984661930", trim: true, maxlength: 20 },
      dialCode: { type: String, default: "*786*10#", trim: true, maxlength: 20 },
      // "/uploads/xyz.png" once an admin uploads a new QR; empty = use the
      // QR image bundled with the storefront.
      qrImage: { type: String, default: "", trim: true, maxlength: 300 },
    },
    // Kitchen preparation countdown + mascot alerts. Editable by an Admin from
    // Dashboard > Order Prep. Changing defaultMinutes only affects orders
    // created afterwards - deadlines already stamped on open orders are never
    // rewritten.
    orderPrep: {
      enabled: { type: Boolean, default: true },
      defaultMinutes: { type: Number, default: 20, min: 1, max: 240 },
      mascotEnabled: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true },
      timezone: { type: String, default: "Asia/Karachi" },
      alerts: {
        warn1: { enabled: { type: Boolean, default: true }, minutes: { type: Number, default: 10 } },
        warn2: { enabled: { type: Boolean, default: true }, minutes: { type: Number, default: 5 } },
        warn3: { enabled: { type: Boolean, default: true }, minutes: { type: Number, default: 2 } },
        overdue: { enabled: { type: Boolean, default: true } },
      },
    },
    assetAccounting: {
      currency: { type: String, default: "PKR", match: /^[A-Z]{3}$/ },
      financialYearStartMonth: { type: Number, default: 1, min: 1, max: 12 },
    },
    passwordPolicy: {
      minLength: { type: Number, default: 8, min: 8, max: 64 },
      requireUppercase: { type: Boolean, default: false },
      requireLowercase: { type: Boolean, default: false },
      requireNumber: { type: Boolean, default: false },
      requireSymbol: { type: Boolean, default: false },
    },
    couponCampaigns: {
      welcome: {
        enabled: { type: Boolean, default: false },
        minimumSubtotal: { type: Number, default: 1000, min: 0 },
        percentages: { type: [Number], default: [2, 3, 4] },
        expiryHours: { type: Number, default: 72, min: 1, max: 8760 },
        maxOnePerCustomer: { type: Boolean, default: true },
      },
      friday: {
        automaticGeneration: { type: Boolean, default: false },
        minimumSubtotal: { type: Number, default: 1000, min: 0 },
        percentages: { type: [Number], default: [4, 5, 6, 7] },
        expiryHours: { type: Number, default: 72, min: 1, max: 8760 },
        timezone: { type: String, default: "Asia/Karachi", maxlength: 80 },
      },
      birthday: {
        enabled: { type: Boolean, default: false },
        discountMode: { type: String, enum: ["fixed", "random"], default: "random" },
        fixedPercentage: { type: Number, default: 5, min: 0, max: 100 },
        percentages: { type: [Number], default: [5, 6, 7] },
        minimumSubtotal: { type: Number, default: 1000, min: 0 },
        expiryHours: { type: Number, default: 72, min: 1, max: 8760 },
        timezone: { type: String, default: "Asia/Karachi", maxlength: 80 },
      },
    },
    promotionSettings: { type: mongoose.Schema.Types.Mixed, default: undefined },
    couponSettingsAudit: [{
      changedAt: { type: Date, required: true },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      changedByName: { type: String, default: "", maxlength: 120 },
      area: { type: String, required: true, maxlength: 80 },
      previousValue: { type: mongoose.Schema.Types.Mixed, default: null },
      newValue: { type: mongoose.Schema.Types.Mixed, required: true },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
