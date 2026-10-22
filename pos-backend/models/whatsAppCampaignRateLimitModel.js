const mongoose = require("mongoose");

const whatsAppCampaignRateLimitSchema = new mongoose.Schema({
  _id: { type: String, default: "global" },
  nextAllowedAt: { type: Date, default: () => new Date(0) },
}, { versionKey: false });

module.exports = mongoose.model("WhatsAppCampaignRateLimit", whatsAppCampaignRateLimitSchema);