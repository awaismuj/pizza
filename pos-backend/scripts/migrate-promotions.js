require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");

const run = async () => {
  await mongoose.connect(config.databaseURI);
  await mongoose.connection.collection("promotionexecutions").createIndex(
    { executionKey: 1 },
    { unique: true, name: "uniq_promotion_execution_key" }
  );
  await mongoose.connection.collection("promotionissues").createIndex(
    { executionId: 1, customerId: 1 },
    { unique: true, name: "uniq_promotion_execution_customer" }
  );
  await mongoose.connection.collection("promotionissues").createIndex(
    { emailStatus: 1, updatedAt: 1 },
    { name: "promotion_email_queue" }
  );
  await mongoose.connection.collection("promotionissues").createIndex(
    { whatsappStatus: 1, updatedAt: 1 },
    { name: "promotion_whatsapp_queue" }
  );
  await mongoose.connection.collection("coupons").createIndex(
    { promotionExecutionId: 1, campaignDiscountPercentage: 1 },
    {
      unique: true,
      partialFilterExpression: { promotionExecutionId: { $type: "objectId" } },
      name: "uniq_promotion_execution_discount_tier",
    }
  );
  await mongoose.connection.collection("customercoupons").createIndex(
    { customerId: 1, idempotencyKey: 1 },
    {
      unique: true,
      partialFilterExpression: { idempotencyKey: { $type: "string" } },
      name: "customerId_1_idempotencyKey_1",
    }
  );
  console.log("Promotion campaign indexes are ready.");
};

run()
  .catch((error) => {
    console.error("Promotion campaign migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
