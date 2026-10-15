const mongoose = require("mongoose");

// A single expense entry (e.g. "Gas cylinder - Rs 1200", "Delivery boy fuel").
// `dayKey` is the calendar day it belongs to, stored as "YYYY-MM-DD" in the
// server's local time zone — grouping/summing by day is then a plain string
// match, and it stays correct regardless of what time of day the entry was
// logged.
const expenseSchema = new mongoose.Schema(
  {
    dayKey: {
      type: String, // "YYYY-MM-DD"
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
