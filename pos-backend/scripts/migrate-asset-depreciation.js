require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const AssetDepreciation = require("../models/assetDepreciationModel");

const migrate = async () => {
  await mongoose.connect(config.databaseURI);
  console.log(`Connected to MongoDB: ${mongoose.connection.host}`);

  try {
    await AssetDepreciation.createIndexes();
    console.log("Asset depreciation indexes created.");
  } finally {
    await mongoose.disconnect();
  }
};

migrate().catch((error) => {
  console.error("Asset depreciation migration failed:", error);
  process.exitCode = 1;
});