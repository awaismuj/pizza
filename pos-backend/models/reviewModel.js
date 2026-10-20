const mongoose = require("mongoose");

// A customer review left from the public storefront ("Write a Review").
// Reviews publish immediately; staff can hide or delete them from
// POS Dashboard > Reviews.
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: "", trim: true, maxlength: 100 },
  comment: { type: String, required: true, trim: true, maxlength: 1200 },
  // Optional: what they ordered / ate, shown as a small tag.
  dish: { type: String, default: "", trim: true, maxlength: 80 },
  isVisible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ isVisible: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
