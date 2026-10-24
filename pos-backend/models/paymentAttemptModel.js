const mongoose = require("mongoose");

const paymentAttemptSchema = new mongoose.Schema({
  idempotencyKeyHash: { type: String, required: true },
  requestHash: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["creating", "ready", "failed"], required: true },
  razorpayOrderId: String,
  amount: Number,
  currency: String,
  receipt: String,
  gatewayStatus: String,
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

paymentAttemptSchema.index(
  { idempotencyKeyHash: 1 },
  { unique: true, name: "uniq_payment_attempt_idempotency_key" }
);
paymentAttemptSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "ttl_payment_attempt_expiration" }
);

module.exports = mongoose.model("PaymentAttempt", paymentAttemptSchema);
