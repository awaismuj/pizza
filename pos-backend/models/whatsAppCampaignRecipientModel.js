const mongoose = require("mongoose");

const whatsAppCampaignRecipientSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "WhatsAppCampaign", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  customerName: { type: String, default: "", trim: true, maxlength: 120 },
  phone: { type: String, default: "", trim: true, maxlength: 30 },
  status: {
    type: String,
    enum: ["queued", "sending", "sent", "delivered", "failed", "skipped"],
    default: "queued",
    index: true,
  },
  sendRequested: { type: Boolean, default: false, index: true },
  lastSendRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  lastSendRequestedAt: { type: Date, default: null },
  lastRetryReason: { type: String, default: "", maxlength: 300 },
  skipReason: { type: String, default: "", maxlength: 160 },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
  customerCouponId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerCoupon", default: null },
  couponCode: { type: String, default: "", trim: true, maxlength: 64 },
  discountPercentage: { type: Number, min: 1, max: 100, default: null },
  providerMessageId: { type: String, default: null, trim: true, maxlength: 160 },
  attempts: { type: Number, default: 0, min: 0 },
  retryable: { type: Boolean, default: false },
  nextAttemptAt: { type: Date, default: null },
  leaseUntil: { type: Date, default: null },
  lastError: { type: String, default: "", maxlength: 500 },
  sentAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  failedAt: { type: Date, default: null },
}, { timestamps: true });

whatsAppCampaignRecipientSchema.index({ campaignId: 1, customerId: 1 }, { unique: true, name: "uniq_campaign_customer_recipient" });
whatsAppCampaignRecipientSchema.index({ status: 1, nextAttemptAt: 1, createdAt: 1 }, { name: "whatsapp_campaign_recipient_queue" });
whatsAppCampaignRecipientSchema.index({ campaignId: 1, status: 1, createdAt: 1 }, { name: "whatsapp_campaign_recipient_results" });
whatsAppCampaignRecipientSchema.index({ status: 1, updatedAt: -1 }, { name: "whatsapp_campaign_recent_messages" });
whatsAppCampaignRecipientSchema.index({ campaignId: 1, updatedAt: -1 }, { name: "whatsapp_campaign_activity" });
whatsAppCampaignRecipientSchema.index({ providerMessageId: 1 }, { unique: true, partialFilterExpression: { providerMessageId: { $type: "string" } }, name: "uniq_whatsapp_provider_message_id" });

module.exports = mongoose.model("WhatsAppCampaignRecipient", whatsAppCampaignRecipientSchema);