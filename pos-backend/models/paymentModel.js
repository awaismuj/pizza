const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentId: String,
    orderId: String,
    amount: Number,
    currency: String,
    status: String,
    method: String,
    email: String,
    contact: String,
    createdAt: Date
}, { autoIndex: false })

paymentSchema.index(
    { paymentId: 1 },
    {
        unique: true,
        partialFilterExpression: { paymentId: { $type: "string" } },
        name: "uniq_payment_gateway_payment_id",
    }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;