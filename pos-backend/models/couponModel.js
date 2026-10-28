const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, maxlength: 40 },
    codeKey: { type: String, trim: true, uppercase: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 500 },
    campaignType: {
      type: String,
      enum: ["manual", "welcome", "friday", "birthday"],
      default: "manual",
      index: true,
    },
    campaignCycle: { type: String, default: "", maxlength: 32 },
    campaignKey: { type: String, default: undefined, maxlength: 180 },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null, index: true },
    notificationReadAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    discountType: { type: String, required: true, enum: ["percentage", "fixed", "freeDelivery"] },
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrderAmount: { type: Number, default: null, min: 0 },
    maximumDiscountAmount: { type: Number, default: null, min: 0 },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    totalUsageLimit: { type: Number, default: null, min: 1 },
    usageLimitPerCustomer: { type: Number, default: null, min: 1 },
    eligibleCustomerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
    eligibleDishIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
    eligibleCategoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    minimumQualifyingQuantity: { type: Number, default: null, min: 1 },
    eligibleOrderTypes: {
      type: [{ type: String, enum: ["delivery", "pickup", "dineIn"] }],
      default: [],
    },
    isFirstOrderOnly: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    archivedAt: { type: Date, default: null },
    redeemedCount: { type: Number, default: 0, min: 0 },
    reservedCount: { type: Number, default: 0, min: 0 },
    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      name: { type: String, default: "", maxlength: 120 },
    },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ codeKey: 1 }, { unique: true, sparse: true });
couponSchema.index({ campaignKey: 1 }, { unique: true, sparse: true });
couponSchema.index({ campaignType: 1, customerId: 1, createdAt: -1 });
couponSchema.index({ isActive: 1, startsAt: 1, expiresAt: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
