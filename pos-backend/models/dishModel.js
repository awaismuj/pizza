const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  // Optional "was" price, struck through next to the real price on the
  // storefront/menu to show a discount (e.g. price 350, originalPrice 400
  // shows "Rs 350.00" with "Rs 400.00" crossed out beside it).
  // 0/undefined means no strike-through price is shown.
  originalPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Short menu description shown under the name on the storefront/POS
  // (e.g. "Tender, spicy chicken fajita paired with a creamy ranch
  // dressing..."). Optional — blank just means no description line shows.
  description: {
    type: String,
    default: "",
    trim: true,
  },
  // Size/crust price matrix (e.g. pizzas: Small/Medium/Large x Pan/Thin/
  // Stuffed, each combination its own price). Leave empty for a simple
  // single-price item (burgers, sides, drinks, ...) — `price` above is what
  // applies then. When non-empty, `price`/`originalPrice` above are only
  // used as the "from" price shown before a size is picked; the actual
  // charged price always comes from the matching variant, recalculated
  // server-side on every order so a customer's browser is never trusted
  // for it.
  variants: [
    {
      size: { type: String, required: true, trim: true },
      // Blank crust means this size doesn't offer a crust choice (e.g. a
      // dish with only size variants, no crust axis at all).
      crust: { type: String, default: "", trim: true },
      price: { type: Number, required: true, min: 0 },
      originalPrice: { type: Number, default: 0, min: 0 },
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  // Emoji shown for this item on the menu (used instead of a fixed category icon set).
  icon: {
    type: String,
    default: "🍽️",
  },
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InventoryItem",
    default: null,
  },
  // How much of `inventoryItem` one dish ordered consumes, in that item's
  // own unit (e.g. a "Cold Drink" dish mapped to a 2.25L bottle tracked in
  // ml would set this to 300 so each dish takes 300 ml, not the whole
  // bottle). Only used in "Single item" mode — ignored once `ingredients`
  // (recipe mode) has entries. Defaults to 1 to match the old fixed
  // 1-unit-per-dish behaviour for dishes that never set this explicitly.
  inventoryItemQty: {
    type: Number,
    default: 1,
    min: 0,
  },
  // Ingredients defines a recipe for the dish. Each entry specifies which inventory item
  // is consumed per single dish and in what unit (e.g., 200 (g), 0.2 (kg), 1 (pcs)).
  ingredients: [
    {
      inventoryItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryItem",
        required: false,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      unit: {
        type: String,
        default: "pcs",
      },
    },
  ],
  // Per-variant recipe override. A pizza's Small size uses less sauce/cheese
  // than its Large size, so a variant listed here (matched by size, and by
  // crust too when the variant has one) uses ITS OWN ingredient amounts
  // instead of the flat `ingredients` list above for that specific
  // size/crust. Leave empty to keep using one recipe for every size (the
  // old behaviour) — only add entries for the sizes that actually differ.
  variantIngredients: [
    {
      size: { type: String, required: true, trim: true },
      crust: { type: String, default: "", trim: true },
      ingredients: [
        {
          inventoryItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InventoryItem",
            required: false,
          },
          quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
          },
          unit: {
            type: String,
            default: "pcs",
          },
        },
      ],
    },
  ],
  isInventoryTracked: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  dietaryTags: [
    {
      type: String,
      enum: ["Vegetarian", "Spicy", "Chef Special", "Gluten-Free", "Kids Friendly"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Dish", dishSchema);
