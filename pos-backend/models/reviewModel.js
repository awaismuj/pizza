const mongoose = require("mongoose");

// A genuine customer review for the GenZPizza online store. Reviews are
// submitted through the public storefront (no login required) and must be
// approved by staff before they appear publicly.
const reviewSchema = new mongoose.Schema(
  {
    // Customer-supplied display name or nickname.
    customerName: { type: String, required: true, trim: true, maxlength: 60 },
    // Star rating 1-5.
    rating: { type: Number, required: true, min: 1, max: 5 },
    // Review body.
    reviewText: { type: String, required: true, trim: true, maxlength: 1000 },
    // Optional product the review is about (e.g. "Large Pepperoni Pizza").
    productName: { type: String, trim: true, maxlength: 120, default: "" },
    // Whether staff have marked this as a verified purchase.
    verified: { type: Boolean, default: false },
    // Public visibility: "pending" | "approved" | "rejected" | "hidden".
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden"],
      default: "pending",
    },
    // Staff moderation notes (internal only, never shown to customers).
    moderationNote: { type: String, trim: true, default: "", maxlength: 300 },
  },
  { timestamps: true }
);

// One review per customer per product keeps feedback honest.
reviewSchema.index({ customerName: 1, productName: 1 }, { unique: true, partialFilterExpression: { status: { $nin: ["rejected", "hidden"] } } });

module.exports = mongoose.model("Review", reviewSchema);
