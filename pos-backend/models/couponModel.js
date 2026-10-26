const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 1000 },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      match: /^[A-Z0-9_-]+$/,
    },
    source: { type: String, enum: ["admin", "welcome", "whatsapp_campaign", "friday_campaign", "birthday_campaign", "manual_campaign"], default: "admin" },
    welcomeCustomerKey: { type: String, default: undefined, select: false },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "WhatsAppCampaign", default: null },
    promotionExecutionId: { type: mongoose.Schema.Types.ObjectId, ref: "PromotionExecution", default: null, index: true },
    campaignDiscountPercentage: { type: Number, min: 1, max: 100, default: null },
    campaignDiscountKey: { type: String, default: null, maxlength: 32 },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minimumSubtotal: { type: Number, default: 0, min: 0 },
    maximumDiscount: { type: Number, default: null, min: 0 },
    eligibleDishIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
    excludedDishIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
    eligibleCategoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    excludedCategoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    channels: {
      type: [{ type: String, enum: ["POS", "Online"] }],
      default: ["POS", "Online"],
    },
    usageLimit: { type: Number, default: null, min: 1 },
    perCustomerLimit: { type: Number, default: 1, min: 1 },
    redemptionCount: { type: Number, default: 0, min: 0 },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    timezone: { type: String, default: "Asia/Karachi", trim: true },
    firstOrderOnly: { type: Boolean, default: false },
    allowStacking: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "scheduled", "active", "paused", "expired", "archived"],
      default: "draft",
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    auditHistory: {
      type: [{
        changedAt: { type: Date, required: true },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        changedByName: { type: String, default: "", maxlength: 120 },
        previousValue: { type: mongoose.Schema.Types.Mixed, default: null },
        newValue: { type: mongoose.Schema.Types.Mixed, required: true },
      }],
      select: false,
      default: [],
    },
  },
  { timestamps: true }
);

couponSchema.index({ status: 1, startsAt: 1, expiresAt: 1 });
couponSchema.index(
  { source: 1, welcomeCustomerKey: 1 },
  { unique: true, partialFilterExpression: { source: "welcome", welcomeCustomerKey: { $type: "string" } } }
);
couponSchema.index({ campaignId: 1, campaignDiscountPercentage: 1 }, { unique: true, partialFilterExpression: { campaignId: { $type: "objectId" } }, name: "uniq_campaign_coupon_discount_tier" });
couponSchema.index(
  { promotionExecutionId: 1, campaignDiscountPercentage: 1 },
  { unique: true, partialFilterExpression: { promotionExecutionId: { $type: "objectId" } }, name: "uniq_promotion_execution_discount_tier" }
);
couponSchema.index(
  { promotionExecutionId: 1, campaignDiscountKey: 1 },
  {
    unique: true,
    partialFilterExpression: { promotionExecutionId: { $type: "objectId" }, campaignDiscountKey: { $type: "string" } },
    name: "uniq_promotion_execution_discount_key",
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
