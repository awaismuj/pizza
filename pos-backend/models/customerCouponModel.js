const mongoose = require("mongoose");

const customerCouponSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 16,
      maxlength: 64,
      match: /^[A-Z0-9_-]+$/,
    },
    source: { type: String, enum: ["admin", "welcome", "loyalty", "vip", "birthday", "referral", "win_back"], default: "admin" },
    idempotencyKey: { type: String, default: undefined },
    redemptionLimit: { type: Number, default: 1, min: 1 },
    redemptionCount: { type: Number, default: 0, min: 0 },
    startsAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    status: { type: String, enum: ["active", "revoked", "expired"], default: "active", index: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

customerCouponSchema.index({ customerId: 1, status: 1, expiresAt: 1 });
customerCouponSchema.index(
  { couponId: 1, customerId: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);
customerCouponSchema.index(
  { customerId: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } }
);

module.exports = mongoose.model("CustomerCoupon", customerCouponSchema);
