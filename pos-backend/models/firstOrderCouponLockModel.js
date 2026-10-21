const mongoose = require("mongoose");

const firstOrderCouponLockSchema = new mongoose.Schema(
  {
    customerKey: { type: String, required: true, unique: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    status: { type: String, enum: ["reserved", "redeemed"], default: "reserved" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FirstOrderCouponLock", firstOrderCouponLockSchema);
