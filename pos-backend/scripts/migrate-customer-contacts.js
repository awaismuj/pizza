require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("autoIndex", false);
const config = require("../config/config");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const { normalizeContactPhone, saveOrderContact } = require("../services/customerContactService");

const run = async () => {
  await mongoose.connect(config.databaseURI);
  await Customer.createCollection().catch((error) => {
    if (error.code !== 48) throw error;
  });

  const indexes = await Customer.collection.indexes();
  const emailIndex = indexes.find((index) => index.key?.email === 1);
  const emailIndexIsReady = emailIndex?.unique
    && emailIndex.partialFilterExpression?.email?.$type === "string";
  if (emailIndex && !emailIndexIsReady) await Customer.collection.dropIndex(emailIndex.name);
  if (!emailIndexIsReady) {
    await Customer.collection.createIndex(
      { email: 1 },
      { unique: true, partialFilterExpression: { email: { $type: "string" } }, name: "email_1" }
    );
  }

  const cursor = Order.find({ "customerDetails.phone": { $type: "string", $ne: "" } })
    .select("customerDetails.name customerDetails.phone")
    .lean()
    .cursor();
  let imported = 0;
  let alreadyPresent = 0;
  let skipped = 0;

  for await (const order of cursor) {
    const { name, phone } = order.customerDetails || {};
    const normalized = normalizeContactPhone(phone);
    if (!normalized) {
      skipped += 1;
      continue;
    }
    if (await Customer.exists({ phoneKey: normalized.phoneKey })) {
      alreadyPresent += 1;
      continue;
    }
    const contact = await saveOrderContact({ name, phone });
    if (contact) imported += 1;
    else skipped += 1;
  }

  console.log(`Customer phone contacts ready. Imported: ${imported}; already present: ${alreadyPresent}; invalid order numbers skipped: ${skipped}.`);
};

run()
  .catch((error) => {
    console.error("Customer contact migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
