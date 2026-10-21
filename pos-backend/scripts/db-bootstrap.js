require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Coupon = require("../models/couponModel");
const CouponCode = require("../models/couponCodeModel");
const CustomerCoupon = require("../models/customerCouponModel");
const CouponRedemption = require("../models/couponRedemptionModel");
const CouponCustomerUsage = require("../models/couponCustomerUsageModel");
const FirstOrderCouponLock = require("../models/firstOrderCouponLockModel");
const config = require("../config/config");

const bootstrap = async () => {
  if (!config.databaseURI) {
    throw new Error("MONGODB_URI is not configured. Copy .env.example to .env and fill in your MongoDB connection string.");
  }

  await mongoose.connect(config.databaseURI);
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

  try {
    await User.syncIndexes();
    console.log("✅ User indexes synced");
  } catch (error) {
    console.warn(`⚠️ Could not sync indexes: ${error.message}`);
  }

  try {
    // Creates the unique/sparse index for the new orderNumber field (see
    // models/orderModel.js) on any database that predates it. Existing
    // orders without an orderNumber are untouched by this - sparse means
    // the index simply skips them - run `npm run backfill:order-numbers`
    // separately to give them one.
    await Order.syncIndexes();
    console.log("✅ Order indexes synced");
  } catch (error) {
    console.warn(`⚠️ Could not sync Order indexes: ${error.message}`);
  }

  for (const [name, model] of [
    ["Coupon", Coupon],
    ["CouponCode", CouponCode],
    ["CustomerCoupon", CustomerCoupon],
    ["CouponRedemption", CouponRedemption],
    ["CouponCustomerUsage", CouponCustomerUsage],
    ["FirstOrderCouponLock", FirstOrderCouponLock],
  ]) {
    await model.createIndexes();
    console.log(`✅ ${name} indexes created`);
  }

  const adminEmail = String(config.defaultAdmin.email).trim().toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log(`ℹ️ Default admin already exists: ${adminEmail}`);
    return;
  }

  const adminUser = new User({
    name: config.defaultAdmin.name,
    email: adminEmail,
    phone: config.defaultAdmin.phone,
    password: config.defaultAdmin.password,
    role: config.defaultAdmin.role,
    status: "Approved",
  });

  await adminUser.save();
  console.log(`✅ Seeded default admin user: ${adminEmail} / ${config.defaultAdmin.password}`);
};

bootstrap()
  .then(() => {
    console.log("✅ Database bootstrap completed successfully");
    return mongoose.disconnect();
  })
  .catch((error) => {
    console.error("❌ Database bootstrap failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    if (mongoose.connection.readyState !== 0) {
      mongoose.disconnect();
    }
  });
