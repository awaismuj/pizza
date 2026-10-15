const Counter = require("../models/counterModel");

const pad2 = (n) => String(n).padStart(2, "0");

// "YYYYMMDD" for the calendar day an order was placed, in the SERVER's
// local time zone - the same day boundary already used everywhere else in
// this app for "today" (see dayKeyFor/todayKey in utils/profitService.js),
// just without the dashes.
const dateKeyFor = (date = new Date()) =>
  `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;

// Issues the next order number for the calendar day `date` falls on:
// "<YYYYMMDD><3-digit sequence>", e.g. "20260927001", "20260927002", ...
// The sequence is a per-day atomic counter (see models/counterModel.js) that
// starts back at 001 the moment a new day's first order comes in - nothing
// to reset by hand, and it works the same way for POS and online orders
// since they share this one function. Because the counter document is keyed
// by the day itself, the very last order number issued on a given day also
// tells you exactly how many orders came in that day.
const generateOrderNumber = async (date = new Date()) => {
  const dateKey = dateKeyFor(date);
  const counter = await Counter.findOneAndUpdate(
    { _id: `order-${dateKey}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return `${dateKey}${String(counter.seq).padStart(3, "0")}`;
};

module.exports = { generateOrderNumber, dateKeyFor };
