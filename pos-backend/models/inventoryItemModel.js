const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  unit: {
    type: String,
    default: "pcs",
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  reorderLevel: {
    type: Number,
    default: 0,
    min: 0,
  },
  costPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  isTrackable: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    default: "",
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

inventoryItemSchema.pre("save", function (next) {
  if (!this.sku) {
    this.sku = this.name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "INV";
  }

  this.lastUpdatedAt = new Date();
  next();
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
