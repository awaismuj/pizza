const mongoose = require("mongoose");

const couponRedemptionSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },
    couponCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CouponCode",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    customerKey: { type: String, default: null, index: true },
    discountAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["reserved", "redeemed", "reversed"],
      default: "reserved",
    },
    reservedAt: { type: Date, default: Date.now },
    redeemedAt: { type: Date, default: null },
    reversedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

couponRedemptionSchema.index({ coupon: 1, customerKey: 1, status: 1 });

module.exports = mongoose.model("CouponRedemption", couponRedemptionSchema);
