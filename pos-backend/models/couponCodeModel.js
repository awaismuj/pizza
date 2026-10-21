const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, trim: true },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },
    kind: { type: String, enum: ["shared", "customer"], default: "shared" },
    customerKey: { type: String, default: null, index: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponCodeSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model("CouponCode", couponCodeSchema);
