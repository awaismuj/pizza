const mongoose = require("mongoose");

const selectionSchema = new mongoose.Schema({
  mode: { type: String, enum: ["all-eligible", "filtered", "selected"], required: true },
  customerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
  excludedCustomerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
  status: { type: String, enum: ["all", "active", "regular", "new", "inactive"], default: "all" },
  search: { type: String, default: "", maxlength: 100 },
}, { _id: false });

const whatsAppCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  campaignType: { type: String, default: "custom", trim: true, maxlength: 80 },
  requestKey: { type: String, required: true, trim: true, maxlength: 100, index: { unique: true, name: "uniq_whatsapp_campaign_request_key" } },
  status: {
    type: String,
    enum: ["draft", "launching", "scheduled", "running", "paused", "completed", "cancelled", "failed"],
    default: "draft",
    index: true,
  },
  discountOptions: [{ type: Number, enum: [5, 7, 8, 10], required: true }],
  discountWeights: {
    type: Map,
    of: { type: Number, min: 0, max: 1000 },
    default: {},
  },
  eligibleOrderStatuses: { type: [String], default: ["Completed", "Closed"] },
  minimumOrderAmount: { type: Number, required: true, min: 0, default: 1000 },
  maximumDiscount: { type: Number, default: null, min: 0 },
  maxUsesPerCoupon: { type: Number, default: 1, min: 1, max: 100 },
  expiresAt: { type: Date, required: true },
  scheduledAt: { type: Date, default: null },
  timezone: { type: String, default: "Asia/Karachi", trim: true, maxlength: 80 },
  selection: { type: selectionSchema, required: true },
  templateName: { type: String, required: true, trim: true, maxlength: 100 },
  templateLanguage: { type: String, required: true, trim: true, maxlength: 20 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  launchedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  confirmedEligibleCount: { type: Number, default: 0, min: 0 },
  confirmedAssignmentCount: { type: Number, default: 0, min: 0 },
  sendAllRequested: { type: Boolean, default: false },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  pausedAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
}, { timestamps: true });

whatsAppCampaignSchema.index({ status: 1, scheduledAt: 1, createdAt: 1 }, { name: "whatsapp_campaign_worker_queue" });

module.exports = mongoose.model("WhatsAppCampaign", whatsAppCampaignSchema);