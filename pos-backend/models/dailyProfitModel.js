const mongoose = require("mongoose");

// One locked record per calendar day, written automatically at 11:59pm
// server time (see services/dailyProfitScheduler.js). Once a day is locked,
// its revenue/expenses/profit are frozen exactly as they stood at close of
// day, so historical figures never silently shift later. "Today" (not yet
// locked) is always computed live instead — see profitController.
const dailyProfitSchema = new mongoose.Schema(
  {
    dayKey: {
      type: String, // "YYYY-MM-DD"
      required: true,
      unique: true,
    },
    revenue: { type: Number, required: true, default: 0 },
    cost: { type: Number, required: true, default: 0 },
    expenses: { type: Number, required: true, default: 0 },
    profit: { type: Number, required: true, default: 0 },
    ordersCount: { type: Number, required: true, default: 0 },
    itemsSold: { type: Number, required: true, default: 0 },
    lockedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyProfit", dailyProfitSchema);
