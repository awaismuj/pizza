const mongoose = require("mongoose");

// A single photo in the storefront's full-width homepage slider. Staff
// upload these from the POS dashboard (Dashboard > Hero Slider) — the
// storefront no longer builds its hero banner from deal/dish photos, it
// just plays whatever is configured here, in `order`.
const heroSlideSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  // Optional: where tapping/clicking the slide takes the customer.
  // Left blank, the storefront just scrolls to the menu instead.
  link: {
    type: String,
    default: "",
    trim: true,
  },
  // Optional accessibility label for the slide image.
  altText: {
    type: String,
    default: "",
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Sort position on the storefront (lower first), same convention as
  // Category/Dish/Deal "order".
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
