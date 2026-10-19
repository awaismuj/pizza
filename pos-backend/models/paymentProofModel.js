const mongoose = require("mongoose");

// Payment screenshots uploaded by customers at checkout. Kept in their own
// collection (NOT the public /uploads one) because they can show phone
// numbers and account details: they are only ever served to signed-in
// Cashier/Admin staff, never from a public URL.
const paymentProofSchema = new mongoose.Schema(
  {
    mimeType: { type: String, required: true, enum: ["image/png", "image/jpeg"] },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    uploaderIp: { type: String, default: "" },
    // Becomes true when an order claims this upload.
    attached: { type: Boolean, default: false },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

// Uploads that no order ever claimed (customer abandoned checkout) are
// removed after 24h. Attached proofs are kept as the payment record.
paymentProofSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 24 * 60 * 60, partialFilterExpression: { attached: false } }
);

module.exports = mongoose.model("PaymentProof", paymentProofSchema);
