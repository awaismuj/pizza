const mongoose = require("mongoose");

// One locked record per calendar day, written automatically at 11:59pm
// server time (see services/dailyProfitScheduler.js). Cost, expenses and
// operational counts stay frozen. A one-time accounting-basis upgrade may
// reclassify legacy tax-inclusive revenue without changing those locked
// figures. "Today" is computed live — see profitController.
const dailyProfitSchema = new mongoose.Schema(
  {
    dayKey: {
      type: String, // "YYYY-MM-DD"
      required: true,
      unique: true,
    },
    revenue: { type: Number, required: true, default: 0 },
    revenueBasis: { type: String },
    couponDiscount: { type: Number, default: 0 },
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
