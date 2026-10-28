const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
    customerKey: { type: String, required: true, select: false },
    redeemedCount: { type: Number, default: 0, min: 0 },
    reservedCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

couponUsageSchema.index({ couponId: 1, customerKey: 1 }, { unique: true });

module.exports = mongoose.model("CouponUsage", couponUsageSchema);
