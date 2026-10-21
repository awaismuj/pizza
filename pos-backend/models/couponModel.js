const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 1000 },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minimumSubtotal: { type: Number, default: 0, min: 0 },
    maximumDiscount: { type: Number, default: null, min: 0 },
    eligibleProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
    excludedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
    eligibleCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    excludedCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    channels: {
      type: [String],
      enum: ["online", "pos"],
      default: ["online", "pos"],
    },
    usageLimit: { type: Number, default: null, min: 1 },
    perCustomerLimit: { type: Number, default: 1, min: 1 },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    timezone: { type: String, default: "Asia/Karachi", trim: true },
    firstOrderOnly: { type: Boolean, default: false },
    stackable: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "scheduled", "active", "paused", "expired", "archived"],
      default: "draft",
    },
    usageCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

couponSchema.index({ status: 1, startsAt: 1, expiresAt: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
