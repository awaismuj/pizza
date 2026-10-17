const mongoose = require("mongoose");
const Dish = require("../models/dishModel");
const Category = require("../models/categoryModel");

async function cleanup() {
  await mongoose.connect("mongodb://127.0.0.1:27017/pos-db");
  const dishRes = await Dish.deleteMany({ image: "" });
  console.log("Deleted empty dishes:", dishRes.deletedCount);
  const catRes = await Category.deleteMany({ name: { $in: ["Pizza", "Burgers & Shami", "Shawarma"] } });
  console.log("Deleted old duplicate categories:", catRes.deletedCount);
  await mongoose.disconnect();
  console.log("Done!");
}

cleanup().catch(console.error);
