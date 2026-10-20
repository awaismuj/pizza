const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    cashierName: {
      type: String,
      required: true,
      default: "Cashier",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    startingCashFloat: {
      type: Number,
      required: true,
      default: 0,
    },
    cashSales: {
      type: Number,
      default: 0,
    },
    cardSales: {
      type: Number,
      default: 0,
    },
    otherSales: {
      type: Number,
      default: 0,
    },
    cashExpenses: {
      type: Number,
      default: 0,
    },
    expectedCash: {
      type: Number,
      default: 0,
    },
    actualCashCounted: {
      type: Number,
      default: 0,
    },
    discrepancy: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    closingNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", shiftSchema);
