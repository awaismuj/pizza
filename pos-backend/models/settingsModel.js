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
    assetAccounting: {
      currency: { type: String, default: "PKR", match: /^[A-Z]{3}$/ },
      financialYearStartMonth: { type: Number, default: 1, min: 1, max: 12 },
    },
    printerConfig: {
      receiptPrinterIp: { type: String, default: "" },
      receiptPrinterPort: { type: Number, default: 9100 },
      kitchenPrinterIp: { type: String, default: "" },
      kitchenPrinterPort: { type: Number, default: 9100 },
      autoPrintReceipt: { type: Boolean, default: false },
      autoPrintKitchen: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
