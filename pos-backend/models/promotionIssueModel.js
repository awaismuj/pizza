const mongoose = require("mongoose");

const promotionIssueSchema = new mongoose.Schema({
  executionId: { type: mongoose.Schema.Types.ObjectId, ref: "PromotionExecution", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  customerCouponId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerCoupon", default: null },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
  couponCode: { type: String, default: "", maxlength: 64 },
  discountPercentage: { type: Number, default: null, min: 1, max: 100 },
  expiresAt: { type: Date, default: null },
  status: { type: String, enum: ["generated", "skipped", "failed"], default: "generated" },
  skipReason: { type: String, default: "", maxlength: 200 },
  emailStatus: { type: String, enum: ["not_requested", "queued", "sending", "sent", "failed", "skipped"], default: "not_requested" },
  emailMessageId: { type: String, default: "", maxlength: 200 },
  emailError: { type: String, default: "", maxlength: 500 },
  emailAttempts: { type: Number, default: 0, min: 0 },
  whatsappStatus: { type: String, enum: ["not_requested", "queued", "sending", "sent", "failed", "skipped"], default: "not_requested" },
  whatsappMessageId: { type: String, default: "", maxlength: 200 },
  whatsappError: { type: String, default: "", maxlength: 500 },
  whatsappAttempts: { type: Number, default: 0, min: 0 },
  emailLeaseUntil: { type: Date, default: null },
  whatsappLeaseUntil: { type: Date, default: null },
}, { timestamps: true });

promotionIssueSchema.index({ executionId: 1, customerId: 1 }, { unique: true, name: "uniq_promotion_execution_customer" });
promotionIssueSchema.index({ emailStatus: 1, updatedAt: 1 });
promotionIssueSchema.index({ whatsappStatus: 1, updatedAt: 1 });

module.exports = mongoose.model("PromotionIssue", promotionIssueSchema);
