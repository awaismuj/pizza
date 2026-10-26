const mongoose = require("mongoose");

const promotionExecutionSchema = new mongoose.Schema({
  kind: { type: String, enum: ["welcome", "friday", "birthday", "manual"], required: true, index: true },
  trigger: { type: String, enum: ["automatic", "scheduled", "manual"], required: true },
  executionKey: { type: String, required: true, trim: true, maxlength: 160 },
  status: { type: String, enum: ["running", "completed", "partial", "failed"], default: "running", index: true },
  settingsSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  counts: {
    eligible: { type: Number, default: 0 },
    generated: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
  error: { type: String, default: "", maxlength: 500 },
}, { timestamps: true });

promotionExecutionSchema.index({ kind: 1, startedAt: -1 });
promotionExecutionSchema.index({ executionKey: 1 }, { unique: true, name: "uniq_promotion_execution_key" });

module.exports = mongoose.model("PromotionExecution", promotionExecutionSchema);
