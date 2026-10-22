require("dotenv").config();

const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");
const config = require("../config/config");

const run = async () => {
  await mongoose.connect(config.databaseURI);
  await Coupon.collection.createIndex(
    { source: 1, welcomeCustomerKey: 1 },
    {
      unique: true,
      partialFilterExpression: {
        source: "welcome",
        welcomeCustomerKey: { $type: "string" },
      },
      name: "uniq_welcome_coupon_phone_key",
    }
  );
  console.log("Welcome offer phone-key uniqueness index is ready.");
};

run()
  .catch((error) => {
    console.error("Welcome offer index migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });