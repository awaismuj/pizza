require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const InventoryItem = require("../models/inventoryItemModel");

// Mirrors the sku the model's pre-save hook would generate from a name, so
// we can check for a collision before attempting the insert (not just a
// name match) — e.g. an item originally seeded as "Cold Drink" that was
// later renamed via the admin UI keeps its old "COLD-DRINK" sku forever,
// so a second seed run matching only on name would still crash into it.
const skuFor = (name) =>
  name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "INV";

const seedInventory = async () => {
  if (!config.databaseURI) {
    throw new Error("MONGODB_URI is not configured. Copy .env.example to .env and fill in your MongoDB connection string.");
  }

  await mongoose.connect(config.databaseURI);
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

  const defaults = [
    { name: "Cold Drink", quantity: 10, reorderLevel: 3, unit: "bottle", sellingPrice: 80 },
    { name: "Water Bottle", quantity: 25, reorderLevel: 5, unit: "bottle", sellingPrice: 40 },
    { name: "Paneer Tikka", quantity: 15, reorderLevel: 4, unit: "plate", sellingPrice: 220 },
    { name: "Butter Chicken", quantity: 12, reorderLevel: 3, unit: "plate", sellingPrice: 320 },
  ];

  let created = 0;
  let skipped = 0;

  for (const item of defaults) {
    const existingItem = await InventoryItem.findOne({
      $or: [{ name: { $regex: `^${item.name}$`, $options: "i" } }, { sku: skuFor(item.name) }],
    });

    if (existingItem) {
      skipped += 1;
      continue;
    }

    try {
      await InventoryItem.create({
        name: item.name,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        unit: item.unit,
        sellingPrice: item.sellingPrice,
        isTrackable: true,
        notes: "Seeded default inventory item",
      });
      created += 1;
    } catch (error) {
      // A duplicate name/sku slipping past the check above (a race, or an
      // existing item whose sku doesn't match its current name for some
      // other reason) shouldn't take down the whole seed run — log it and
      // move on to the next default item.
      if (error?.code === 11000) {
        console.warn(`⚠️  Skipped "${item.name}" — already exists (duplicate ${Object.keys(error.keyPattern || {}).join(", ") || "key"}).`);
        skipped += 1;
      } else {
        throw error;
      }
    }
  }

  console.log(`✅ Default inventory items seeded (${created} created, ${skipped} already present)`);
};

seedInventory()
  .then(() => {
    console.log("✅ Seed completed successfully");
    return mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    if (mongoose.connection.readyState !== 0) {
      mongoose.disconnect();
    }
  });
