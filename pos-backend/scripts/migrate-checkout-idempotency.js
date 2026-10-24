require("dotenv").config();

const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const PaymentAttempt = require("../models/paymentAttemptModel");
const config = require("../config/config");

const run = async () => {
  await mongoose.connect(config.databaseURI);
  const duplicatePayments = await Payment.aggregate([
    { $match: { paymentId: { $type: "string" } } },
    { $group: { _id: "$paymentId", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $limit: 10 },
  ]);
  if (duplicatePayments.length) {
    const ids = duplicatePayments.map(({ _id }) => _id).join(", ");
    throw new Error(`Duplicate Razorpay payment IDs must be reconciled before migration: ${ids}`);
  }

  await Order.collection.createIndex(
    { idempotencyKeyHash: 1 },
    {
      unique: true,
      partialFilterExpression: { idempotencyKeyHash: { $type: "string" } },
      name: "uniq_order_idempotency_key_hash",
    }
  );
  await Payment.collection.createIndex(
    { paymentId: 1 },
    {
      unique: true,
      partialFilterExpression: { paymentId: { $type: "string" } },
      name: "uniq_payment_gateway_payment_id",
    }
  );
  await PaymentAttempt.collection.createIndex(
    { idempotencyKeyHash: 1 },
    { unique: true, name: "uniq_payment_attempt_idempotency_key" }
  );
  await PaymentAttempt.collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, name: "ttl_payment_attempt_expiration" }
  );
  console.log("Checkout and Razorpay payment idempotency indexes are ready.");
};

run()
  .catch((error) => {
    console.error("Checkout/payment idempotency migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
