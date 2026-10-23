const mongoose = require("mongoose");

const whatsAppCampaignAuditSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "WhatsAppCampaign", default: null, index: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  action: {
    type: String,
    enum: ["scan", "tokens_generated", "send_all", "send_selected", "send_individual", "refresh", "retry", "pause", "cancel", "create"],
    required: true,
  },
  reason: { type: String, default: "", trim: true, maxlength: 300 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

whatsAppCampaignAuditSchema.index({ campaignId: 1, createdAt: -1 });

module.exports = mongoose.model("WhatsAppCampaignAudit", whatsAppCampaignAuditSchema);