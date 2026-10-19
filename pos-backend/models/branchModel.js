const mongoose = require("mongoose");

// One document per restaurant branch. Everything the fulfillment rules need
// (opening hours, pickup availability, delivery zones + fees, minimum order
// values, preparation estimates and temporary restrictions) lives here, so
// the online store and the POS read exactly the same rules from one place.
// See utils/fulfillment.js for how they are applied.
const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  // Optional list of neighbourhoods shown to the customer under the zone name.
  areas: { type: String, default: "", trim: true, maxlength: 200 },
  fee: { type: Number, default: 0, min: 0 },
  // Extra minimum order just for this zone (0 = use the branch minimum only).
  minOrder: { type: Number, default: 0, min: 0 },
  // Rider travel time for this zone, added on top of the preparation time.
  travelMinutes: { type: Number, default: 20, min: 0, max: 240 },
  active: { type: Boolean, default: true },
});

const hoursSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    open: { type: Boolean, default: true },
    from: { type: String, default: "11:00", match: /^\d{2}:\d{2}$/ },
    to: { type: String, default: "23:00", match: /^\d{2}:\d{2}$/ }, // <= from means past midnight
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
        default: "Come to the counter and give your order number. Bring your phone.",
        trim: true,
        maxlength: 240,
      },
    },
    delivery: {
      enabled: { type: Boolean, default: true },
      prepMinutes: { type: Number, default: 25, min: 0, max: 480 },
      minOrder: { type: Number, default: 0, min: 0 },
      // Order value (before tax) at or above which delivery is free. 0 = never.
      freeAbove: { type: Number, default: 0, min: 0 },
      zones: { type: [zoneSchema], default: [] },
    },
    // Temporary restriction, e.g. "No delivery during the storm". Switches
    // itself off after `until` (if set) with no one having to remember.
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
