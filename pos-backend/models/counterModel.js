const mongoose = require("mongoose");

// Generic atomic counter, keyed by any string (e.g. "order-20260927"). One
// document per key; `seq` is incremented atomically via findOneAndUpdate's
// $inc, so it's safe under concurrent requests (two orders placed at the
// exact same millisecond can never get the same number).
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
