require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const WhatsAppCampaign = require("../models/whatsAppCampaignModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const Coupon = require("../models/couponModel");
const CustomerCoupon = require("../models/customerCouponModel");
const Role = require("../models/roleModel");
const WhatsAppCampaignAudit = require("../models/whatsAppCampaignAuditModel");

const run = async () => {
  await mongoose.connect(config.databaseURI);
  await WhatsAppCampaign.collection.createIndex({ requestKey: 1 }, { unique: true, name: "uniq_whatsapp_campaign_request_key" });
  await WhatsAppCampaign.collection.createIndex({ status: 1, scheduledAt: 1, createdAt: 1 }, { name: "whatsapp_campaign_worker_queue" });
  await WhatsAppCampaignRecipient.collection.createIndex({ campaignId: 1, customerId: 1 }, { unique: true, name: "uniq_campaign_customer_recipient" });
  await WhatsAppCampaignRecipient.collection.createIndex({ status: 1, nextAttemptAt: 1, createdAt: 1 }, { name: "whatsapp_campaign_recipient_queue" });
  await WhatsAppCampaignRecipient.collection.createIndex({ campaignId: 1, status: 1, createdAt: 1 }, { name: "whatsapp_campaign_recipient_results" });
  await WhatsAppCampaignRecipient.collection.createIndex({ status: 1, updatedAt: -1 }, { name: "whatsapp_campaign_recent_messages" });
  await WhatsAppCampaignRecipient.collection.createIndex({ campaignId: 1, updatedAt: -1 }, { name: "whatsapp_campaign_activity" });
  await WhatsAppCampaignRecipient.collection.createIndex({ providerMessageId: 1 }, {
    unique: true,
    partialFilterExpression: { providerMessageId: { $type: "string" } },
    name: "uniq_whatsapp_provider_message_id",
  });
  await Coupon.collection.createIndex({ campaignId: 1, campaignDiscountPercentage: 1 }, {
    unique: true,
    partialFilterExpression: { campaignId: { $type: "objectId" } },
    name: "uniq_campaign_coupon_discount_tier",
  });
  await CustomerCoupon.collection.createIndex({ customerId: 1, idempotencyKey: 1 }, {
    unique: true,
    partialFilterExpression: { idempotencyKey: { $type: "string" } },
    name: "customerId_1_idempotencyKey_1",
  });
  await WhatsAppCampaignAudit.collection.createIndex({ campaignId: 1, createdAt: -1 }, { name: "whatsapp_campaign_audit_history" });
  await Role.updateMany(
    { key: { $in: ["admin", "super admin"] } },
    { $addToSet: { permissions: "whatsapp.campaigns.manage" } }
  );
  console.log("WhatsApp campaign indexes are ready.");
};

run()
  .catch((error) => {
    console.error("WhatsApp campaign migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });