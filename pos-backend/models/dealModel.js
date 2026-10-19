const mongoose = require("mongoose");

// A "Deal" is a combo/bundle promotion (e.g. "Sunday Special", "Friday Deal",
// "Daily Deal") shown on the genzpizza.online storefront and sold as a single
// line item at a fixed bundle price. Bundle contents are staff-typed labels
// ("1 Medium Pizza", "6 Wings", ...) the same way they appear on the promo
// poster, so a deal can be created and scheduled in seconds — but each item
// can optionally be linked to a real Dish (see `items.dishId` below) so that
// selling the deal deducts real inventory, the same as selling that dish on
// its own.
const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Small label shown as a ribbon/badge on the deal card, e.g. "SUNDAY SPECIAL".
  badge: {
    type: String,
    default: "",
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "flame",
  },
  // Bundle contents, shown as a bullet list on the deal card
  // (e.g. { label: "1 Medium Pizza", quantity: 1 }).
  items: [
    {
      label: { type: String, required: true, trim: true },
      quantity: { type: Number, default: 1, min: 1 },
      // Optional link to a real menu Dish, so ordering this deal deducts
      // that dish's own recipe/ingredients from inventory exactly like
      // ordering it à la carte would. When left unset, stock deduction
      // falls back to matching `label` against dish names (e.g. typing
      // "Small Pizza" or "Burger" still deducts that dish's stock).
      dishId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        default: null,
      },
      // Default size/crust charged against `dishId`'s own variant recipe
      // when this item ISN'T customer-customizable (or as the fallback if
      // a customer's choice ever fails to validate at checkout). Blank
      // means "use the dish's base recipe" (a dish with no variants).
      size: { type: String, default: "", trim: true },
      crust: { type: String, default: "", trim: true },
      // When true, the storefront asks the customer to pick which dish
      // (flavour) and size fills this slot, instead of it being fixed to
      // `dishId`/`size` above. `allowedCategories` restricts which menu
      // categories they can choose a flavour from (e.g. only "Traditional"
      // and "Gen-Z Special", not drinks) — leave empty to allow none (i.e.
      // customization stays off until categories are picked).
      customizable: { type: Boolean, default: false },
      allowedCategories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
    },
  ],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  // Optional "was" price, struck through on the card to show savings.
  // 0/undefined means no strike-through price is shown.
  originalPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Which days of the week this deal is available.
  // 0=Sunday ... 6=Saturday. Empty array = every day ("Daily Deal").
  daysOfWeek: {
    type: [Number],
    default: [],
    validate: {
      validator: (arr) => arr.every((d) => Number.isInteger(d) && d >= 0 && d <= 6),
      message: "daysOfWeek must contain integers between 0 (Sun) and 6 (Sat).",
    },
  },
  // Optional daily availability window, 24h "HH:mm" strings. Both empty
  // means "all day". Used e.g. for a deal that expires at 12pm or only
  // starts after night.
  startTime: { type: String, default: "" },
  endTime: { type: String, default: "" },
  // Staff on/off switch — separate from the day/time schedule, so a deal
  // can be prepped ahead of time and only flipped on when ready, or paused
  // instantly (e.g. sold out) without losing its schedule/config.
  isActive: {
    type: Boolean,
    default: true,
  },
  // Sort position on the storefront (lower first), same convention as
  // Category/Dish "order".
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Deal", dealSchema);
