const mongoose = require("mongoose");

const inventoryWastageSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    quantityWasted: {
      type: Number,
      required: true,
      min: 0.001,
    },
    unit: {
      type: String,
      default: "pcs",
    },
    unitCost: {
      type: Number,
      required: true,
      default: 0,
    },
    totalLossAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    reason: {
      type: String,
      enum: ["Expired", "Prep Error", "Damaged", "Dropped", "Quality Reject", "Other"],
      default: "Prep Error",
    },
    loggedBy: {
      type: String,
      default: "Staff",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryWastage", inventoryWastageSchema);
