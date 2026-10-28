const mongoose = require("mongoose");

const couponRedemptionSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    codeSnapshot: { type: String, required: true, maxlength: 40 },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    customerKey: { type: String, default: "", select: false },
    discountAmount: { type: Number, required: true, min: 0 },
    orderSubtotal: { type: Number, required: true, min: 0 },
    finalTotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["reserved", "redeemed", "released", "reversed", "expired"],
      default: "reserved",
      index: true,
    },
    appliedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    redeemedAt: { type: Date, default: null },
    releasedAt: { type: Date, default: null },
    releaseReason: { type: String, default: "", maxlength: 200 },
    reversedAt: { type: Date, default: null },
    reversedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reversalReason: { type: String, default: "", maxlength: 300 },
  },
  { timestamps: true }
);

couponRedemptionSchema.index({ couponId: 1, orderId: 1 }, { unique: true });
couponRedemptionSchema.index({ couponId: 1, status: 1, appliedAt: -1 });
couponRedemptionSchema.index({ customerId: 1, couponId: 1, status: 1 });

module.exports = mongoose.model("CouponRedemption", couponRedemptionSchema);
