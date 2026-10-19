const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  areas: { type: String, default: "", trim: true, maxlength: 200 },
  fee: { type: Number, default: 100, min: 0 },
  distanceKm: { type: Number, default: null, min: 0 },
  minOrder: { type: Number, default: 0, min: 0 },
  travelMinutes: { type: Number, default: 20, min: 0, max: 240 },
  active: { type: Boolean, default: true },
});

const hoursSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 0, max: 6, required: true },
    open: { type: Boolean, default: true },
    from: { type: String, default: "11:00", match: /^\d{2}:\d{2}$/ },
    to: { type: String, default: "23:00", match: /^\d{2}:\d{2}$/ },
  },
  { _id: false }
);

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    address: { type: String, default: "", trim: true, maxlength: 240 },
    phone: { type: String, default: "", trim: true, maxlength: 30 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    timezone: { type: String, default: "Asia/Karachi" },
    hours: { type: [hoursSchema], default: [] },
    pickup: {
      enabled: { type: Boolean, default: true },
      prepMinutes: { type: Number, default: 20, min: 0, max: 480 },
      minOrder: { type: Number, default: 0, min: 0 },
      instructions: {
        type: String,
        default: "Show your order number at the counter.",
        trim: true,
        maxlength: 240,
      },
    },
    delivery: {
      enabled: { type: Boolean, default: true },
      prepMinutes: { type: Number, default: 25, min: 0, max: 480 },
      minOrder: { type: Number, default: 0, min: 0 },
      freeAbove: { type: Number, default: 1000, min: 0 },
      freeWithinKm: { type: Number, default: 4, min: 0 },
      zones: { type: [zoneSchema], default: [] },
    },
    restriction: {
      active: { type: Boolean, default: false },
      applies: { type: String, enum: ["delivery", "pickup", "both"], default: "delivery" },
      message: { type: String, default: "", trim: true, maxlength: 200 },
      until: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
