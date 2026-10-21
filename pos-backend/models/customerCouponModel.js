const mongoose = require("mongoose");

const customerCouponSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },
    code: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CouponCode",
      required: true,
      unique: true,
    },
    customerKey: { type: String, required: true, index: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    source: { type: String, default: "admin", trim: true },
    status: {
      type: String,
      enum: ["active", "revoked", "redeemed", "expired"],
      default: "active",
    },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

customerCouponSchema.index({ customerKey: 1, coupon: 1, status: 1 });

module.exports = mongoose.model("CustomerCoupon", customerCouponSchema);
