// One-off backfill: assigns a proper "<YYYYMMDD><seq>" orderNumber (see
// utils/orderNumber.js) to any order created before that field existed.
// Safe to run more than once - orders that already have an orderNumber are
// left untouched. Orders are processed oldest-first so the numbers they get
// still read in the order they actually happened.
//
// Run with: node scripts/backfill-order-numbers.js
require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const Order = require("../models/orderModel");
const Counter = require("../models/counterModel");
const { dateKeyFor } = require("../utils/orderNumber");

const run = async () => {
  await mongoose.connect(config.databaseURI);
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

  // Make sure the new unique/sparse index on orderNumber actually exists
  // before we start writing values that need to respect it.
  await Order.syncIndexes();
  console.log("✅ Order indexes synced");

  const missing = await Order.find({
    $or: [{ orderNumber: { $exists: false } }, { orderNumber: null }],
  }).sort({ orderDate: 1 });

  console.log(`Found ${missing.length} order(s) without an orderNumber.`);

  for (const order of missing) {
    const dateKey = dateKeyFor(new Date(order.orderDate));
    const counter = await Counter.findOneAndUpdate(
      { _id: `order-${dateKey}` },
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    order.orderNumber = `${dateKey}${String(counter.seq).padStart(3, "0")}`;
    await order.save();
  }

  console.log("✅ Backfill complete.");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
