const mongoose = require("mongoose");

const couponRedemptionSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null, index: true },
    customerCouponId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerCoupon", default: null, index: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    code: { type: String, required: true },
    customerKey: { type: String, required: true, index: true },
    discountAmount: { type: Number, required: true, min: 0 },
    channel: { type: String, enum: ["POS", "Online"], required: true },
    status: {
      type: String,
      enum: ["reserved", "redeemed", "reversed", "refunded"],
      default: "reserved",
      index: true,
    },
    redeemedAt: { type: Date, default: Date.now },
    reversedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

couponRedemptionSchema.index({ couponId: 1, customerKey: 1, status: 1 });

module.exports = mongoose.model("CouponRedemption", couponRedemptionSchema);
