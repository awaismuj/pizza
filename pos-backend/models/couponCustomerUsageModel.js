const mongoose = require("mongoose");

const couponCustomerUsageSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    customerKey: { type: String, required: true },
    usageCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

couponCustomerUsageSchema.index({ coupon: 1, customerKey: 1 }, { unique: true });

module.exports = mongoose.model("CouponCustomerUsage", couponCustomerUsageSchema);
