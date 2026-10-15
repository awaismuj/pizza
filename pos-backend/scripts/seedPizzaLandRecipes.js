// Seeds inventory items + dish "recipes" (ingredients) from the
// GenZ_Pizza_Land_Portion_Data.xlsx sheet, so that placing an order
// automatically deducts the right raw-material quantities from Inventory.
//
// Run once (or any time you tweak the numbers below) with:
//   cd pos-backend
//   node scripts/seedPizzaLandRecipes.js
//
// Safe to re-run:
//   - Inventory items: only CREATED if missing (never overwrites current
//     stock quantity, so re-running won't reset how much stock you have).
//   - Dishes: created if missing; if a dish with the same name already
//     exists, only its recipe (ingredients) + inventory-tracking flag are
//     updated - price/image/category you already set are left alone.
//
// ASSUMPTIONS (the sheet gave ranges or left cells blank - double check
// these against your actual recipe and edit the numbers below if needed,
// or edit the dish's ingredients later from Dashboard > Menu):
//   - Burger / Shami Bread ranges (e.g. "60-70g", "15-20g") -> midpoint used.
//   - "Double Anda" only listed a bun in the sheet -> assumed 2 eggs
//     (double = 2x a single egg), no shami/mayo/salad. Adjust if wrong.
//   - "Zinger" only listed chicken (120g) + "40 gram" -> assumed that 40g
//     is salad, and added 1 bun (not in the sheet, but a Zinger burger
//     needs one) - remove/edit if your Zinger is served differently.
//   - Shawarma uses its own "Garlic Sauce" / "Chilli Sauce", kept separate
//     from pizza/burger Mayonnaise + Ketchup/Chilli in case your recipe
//     differs. Merge them into one inventory item later if they're the same.
//   - Prices below are PLACEHOLDER ESTIMATES ONLY (the sheet has no price
//     data) - they are only used the FIRST time a dish is created. Update
//     PRICES below with your real menu prices before running, or just fix
//     them afterwards from Dashboard > Menu.
//
// IMPORTANT - avoiding duplicate/untracked dishes:
// This script matches dishes by EXACT name (case-insensitive). If your real
// menu item is named differently than the `name` used below (e.g. your menu
// has "Chicken Pizza Small" but this script looks for "Small Pizza"), it
// will NOT find your real dish - it will create a brand new one instead,
// and your real menu item stays untouched/untracked. To fix that:
//   1. Run this script once and read the console output carefully.
//   2. For every line that says "⚠️ NOT FOUND", either rename your existing
//      dish (Dashboard > Menu) to match the `name` below, OR edit the
//      `name` below to match your existing dish's real name.
//   3. Re-run the script - matching dishes now update in place instead of
//      creating a duplicate.

require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const Category = require("../models/categoryModel");
const InventoryItem = require("../models/inventoryItemModel");
const Dish = require("../models/dishModel");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------------------------------------------------------------------------
// 1. Inventory items (raw materials). unit: "g" or "pcs".
//    openingQty / reorderLevel only apply the FIRST time the item is
//    created - tweak them here before the first run, or just edit the
//    actual stock numbers in Dashboard > Inventory afterwards.
// ---------------------------------------------------------------------------
const INVENTORY_ITEMS = [
  { name: "Maida (Pizza Dough Flour)", unit: "g", openingQty: 10000, reorderLevel: 2000 },
  { name: "Chicken (Cooked/Shredded)", unit: "g", openingQty: 10000, reorderLevel: 2000 },
  { name: "Cheese", unit: "g", openingQty: 5000, reorderLevel: 1000 },
  { name: "Mayonnaise", unit: "g", openingQty: 3000, reorderLevel: 500 },
  { name: "Pizza Sauce", unit: "g", openingQty: 3000, reorderLevel: 500 },
  { name: "Burger/Shami Bun", unit: "pcs", openingQty: 100, reorderLevel: 20 },
  { name: "Egg", unit: "pcs", openingQty: 200, reorderLevel: 30 },
  { name: "Shami Kabab Patty", unit: "g", openingQty: 5000, reorderLevel: 1000 },
  { name: "Ketchup/Chilli Sauce (Burger)", unit: "g", openingQty: 2000, reorderLevel: 300 },
  { name: "Salad", unit: "g", openingQty: 3000, reorderLevel: 500 },
  { name: "Small Shawarma Bread", unit: "pcs", openingQty: 100, reorderLevel: 20 },
  { name: "Large Shawarma Bread", unit: "pcs", openingQty: 100, reorderLevel: 20 },
  { name: "Shawarma Garlic Sauce", unit: "g", openingQty: 2000, reorderLevel: 300 },
  { name: "Shawarma Chilli Sauce", unit: "g", openingQty: 2000, reorderLevel: 300 },
];

// ---------------------------------------------------------------------------
// 2. Categories the dishes below will be filed under (created if missing).
// ---------------------------------------------------------------------------
const CATEGORIES = ["Pizza", "Burgers & Shami", "Shawarma"];

// ---------------------------------------------------------------------------
// 3. Dishes + their recipe (list of { item, quantity, unit }). `item` must
//    match a `name` in INVENTORY_ITEMS above exactly.
// ---------------------------------------------------------------------------
const DISHES = [
  {
    name: "Small Pizza",
    category: "Pizza",
    price: 450, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Maida (Pizza Dough Flour)", quantity: 150, unit: "g" },
      { item: "Chicken (Cooked/Shredded)", quantity: 50, unit: "g" },
      { item: "Cheese", quantity: 80, unit: "g" },
      { item: "Mayonnaise", quantity: 25, unit: "g" },
      { item: "Pizza Sauce", quantity: 25, unit: "g" },
    ],
  },
  {
    name: "Medium Pizza",
    category: "Pizza",
    price: 750, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Maida (Pizza Dough Flour)", quantity: 250, unit: "g" },
      { item: "Chicken (Cooked/Shredded)", quantity: 90, unit: "g" },
      { item: "Cheese", quantity: 120, unit: "g" },
      { item: "Mayonnaise", quantity: 35, unit: "g" },
      { item: "Pizza Sauce", quantity: 35, unit: "g" },
    ],
  },
  {
    name: "Large Pizza",
    category: "Pizza",
    price: 1100, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Maida (Pizza Dough Flour)", quantity: 450, unit: "g" },
      { item: "Chicken (Cooked/Shredded)", quantity: 170, unit: "g" },
      { item: "Cheese", quantity: 170, unit: "g" },
      { item: "Mayonnaise", quantity: 45, unit: "g" },
      { item: "Pizza Sauce", quantity: 45, unit: "g" },
    ],
  },
  {
    name: "Extra Large Pizza",
    category: "Pizza",
    price: 1450, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Maida (Pizza Dough Flour)", quantity: 650, unit: "g" },
      { item: "Chicken (Cooked/Shredded)", quantity: 250, unit: "g" },
      { item: "Cheese", quantity: 250, unit: "g" },
      { item: "Mayonnaise", quantity: 55, unit: "g" },
      { item: "Pizza Sauce", quantity: 55, unit: "g" },
    ],
  },
  {
    name: "Burger",
    category: "Burgers & Shami",
    price: 250, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Burger/Shami Bun", quantity: 1, unit: "pcs" },
      { item: "Egg", quantity: 1, unit: "pcs" },
      { item: "Shami Kabab Patty", quantity: 65, unit: "g" }, // midpoint of 60-70g
      { item: "Mayonnaise", quantity: 18, unit: "g" }, // midpoint of 15-20g
      { item: "Ketchup/Chilli Sauce (Burger)", quantity: 13, unit: "g" }, // midpoint of 10-15g
      { item: "Salad", quantity: 25, unit: "g" }, // midpoint of 20-30g
    ],
  },
  {
    name: "Shami Bread",
    category: "Burgers & Shami",
    price: 300, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Burger/Shami Bun", quantity: 1, unit: "pcs" },
      { item: "Egg", quantity: 3, unit: "pcs" },
      { item: "Shami Kabab Patty", quantity: 65, unit: "g" }, // midpoint of 60-70g
      { item: "Mayonnaise", quantity: 20, unit: "g" },
      { item: "Ketchup/Chilli Sauce (Burger)", quantity: 13, unit: "g" }, // midpoint of 10-15g
      { item: "Salad", quantity: 28, unit: "g" }, // midpoint of 25-30g
    ],
  },
  {
    name: "Double Anda",
    category: "Burgers & Shami",
    price: 200, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Burger/Shami Bun", quantity: 1, unit: "pcs" },
      { item: "Egg", quantity: 2, unit: "pcs" }, // ASSUMED: "double" = 2 eggs, sheet gave no other values
    ],
  },
  {
    name: "Small Shawarma",
    category: "Shawarma",
    price: 180, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Chicken (Cooked/Shredded)", quantity: 50, unit: "g" },
      { item: "Small Shawarma Bread", quantity: 1, unit: "pcs" },
      { item: "Shawarma Garlic Sauce", quantity: 20, unit: "g" },
      { item: "Salad", quantity: 30, unit: "g" },
      { item: "Shawarma Chilli Sauce", quantity: 10, unit: "g" },
    ],
  },
  {
    name: "Large Shawarma",
    category: "Shawarma",
    price: 260, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Chicken (Cooked/Shredded)", quantity: 70, unit: "g" },
      { item: "Large Shawarma Bread", quantity: 1, unit: "pcs" },
      { item: "Shawarma Garlic Sauce", quantity: 30, unit: "g" },
      { item: "Salad", quantity: 40, unit: "g" },
      { item: "Shawarma Chilli Sauce", quantity: 15, unit: "g" },
    ],
  },
  {
    name: "Zinger",
    category: "Shawarma",
    price: 350, // PLACEHOLDER - set your real price
    ingredients: [
      { item: "Chicken (Cooked/Shredded)", quantity: 120, unit: "g" },
      { item: "Salad", quantity: 40, unit: "g" }, // ASSUMED: sheet's unlabeled "40 gram" value
      { item: "Burger/Shami Bun", quantity: 1, unit: "pcs" }, // ASSUMED: not in sheet, added since a Zinger needs a bun
    ],
  },
];

const findByNameCI = (Model, name) =>
  Model.findOne({ name: { $regex: `^${escapeRegex(name)}$`, $options: "i" } });

const upsertInventoryItem = async ({ name, unit, openingQty, reorderLevel }) => {
  const existing = await findByNameCI(InventoryItem, name);
  if (existing) {
    console.log(`  ↳ Inventory item already exists, leaving stock untouched: ${name}`);
    return existing;
  }

  const created = await InventoryItem.create({
    name,
    unit,
    quantity: openingQty,
    reorderLevel,
    isTrackable: true,
    notes: "Seeded from GenZ Pizza Land portion sheet",
  });
  console.log(`  ✅ Created inventory item: ${name} (${openingQty} ${unit})`);
  return created;
};

const upsertCategory = async (name) => {
  const existing = await findByNameCI(Category, name);
  if (existing) return existing;

  const created = await Category.create({ name });
  console.log(`  ✅ Created category: ${name}`);
  return created;
};

const upsertDish = async (spec, inventoryByName, categoryByName) => {
  const ingredients = spec.ingredients.map((row) => {
    const invItem = inventoryByName.get(row.item.toLowerCase());
    if (!invItem) {
      throw new Error(`Dish "${spec.name}" references unknown inventory item "${row.item}"`);
    }
    return { inventoryItem: invItem._id, quantity: row.quantity, unit: row.unit };
  });

  const category = categoryByName.get(spec.category.toLowerCase());
  if (!category) {
    throw new Error(`Dish "${spec.name}" references unknown category "${spec.category}"`);
  }

  const existing = await findByNameCI(Dish, spec.name);

  if (existing) {
    existing.ingredients = ingredients;
    existing.isInventoryTracked = true;
    existing.inventoryItem = null; // this dish uses the recipe list, not a 1:1 mapping
    if (!existing.category) existing.category = category._id;
    await existing.save();
    console.log(`  🔄 Updated recipe for existing dish: "${spec.name}" (price untouched: Rs. ${existing.price})`);
    return existing;
  }

  const created = await Dish.create({
    name: spec.name,
    price: spec.price ?? 0, // PLACEHOLDER price - fix from Dashboard > Menu if wrong
    category: category._id,
    isInventoryTracked: true,
    ingredients,
  });
  console.log(
    `  ⚠️ NOT FOUND on your menu - created NEW dish "${spec.name}" at placeholder price Rs. ${created.price}.\n` +
      `     If you already sell this under a different name, delete this duplicate, rename your real\n` +
      `     dish to "${spec.name}" (or edit this script's name to match it), then re-run.`
  );
  return created;
};

const run = async () => {
  if (!config.databaseURI) {
    throw new Error("MONGODB_URI is not configured. Copy .env.example to .env and fill in your MongoDB connection string.");
  }

  await mongoose.connect(config.databaseURI);
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

  const existingDishNames = (await Dish.find().select("name price")).map(
    (d) => `"${d.name}" (Rs. ${d.price})`
  );
  console.log(`\n--- Your current menu has ${existingDishNames.length} dish(es) ---`);
  console.log(existingDishNames.length ? existingDishNames.join("\n") : "(none yet)");
  console.log(
    "\nCompare this list against the dish names this script is about to use below.\n" +
      "Any name that doesn't already appear above will be created as a NEW dish."
  );

  console.log("\n--- Inventory items ---");
  const inventoryByName = new Map();
  for (const spec of INVENTORY_ITEMS) {
    const doc = await upsertInventoryItem(spec);
    inventoryByName.set(spec.name.toLowerCase(), doc);
  }

  console.log("\n--- Categories ---");
  const categoryByName = new Map();
  for (const name of CATEGORIES) {
    const doc = await upsertCategory(name);
    categoryByName.set(name.toLowerCase(), doc);
  }

  console.log("\n--- Dishes / recipes ---");
  for (const spec of DISHES) {
    await upsertDish(spec, inventoryByName, categoryByName);
  }

  console.log(
    "\n✅ All done. Scroll up and check for any \"⚠️ NOT FOUND\" lines - those are dishes\n" +
      "   this script couldn't match to your existing menu, so it created a new one instead.\n" +
      "   Fix those first (see the note at the top of this file), then re-run.\n" +
      "   Also double-check placeholder prices and opening stock quantities in\n" +
      "   Dashboard > Menu / Dashboard > Inventory - they're estimates, not your real numbers."
  );
};

run()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error("❌ Seed failed:", error.message);
    process.exitCode = 1;
    if (mongoose.connection.readyState !== 0) {
      return mongoose.disconnect();
    }
  });
