const mongoose = require("mongoose");

// Permanent audit record written every time an order is deleted, so a
// deleted order is never silently lost: who deleted it, when, what stage
// it was at, and whether its stock went back to inventory. (Completed
// orders can't be deleted at all — see deleteOrder.)
const deletedOrderLogSchema = new mongoose.Schema(
  {
    originalOrderId: { type: mongoose.Schema.Types.ObjectId, index: true },
    orderNumber: { type: String, default: "" },
    orderSource: { type: String, default: "" },
    customerDetails: { type: Object, default: {} },
    items: { type: Array, default: [] },
    bills: { type: Object, default: {} },
    orderDate: { type: Date },
    // The stage the order was at the moment it was deleted.
    statusAtDelete: { type: String, required: true },
    statusHistory: { type: Array, default: [] },
    stockReturned: { type: Boolean, default: false },
    stockReturnedItems: { type: Array, default: [] }, // [{ name, quantity }]
    deletedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String, default: "" },
      role: { type: String, default: "" },
    },
    dayKey: { type: String, index: true }, // "YYYY-MM-DD" of deletion
    deletedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeletedOrderLog", deletedOrderLogSchema);
