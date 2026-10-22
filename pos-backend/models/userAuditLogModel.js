const mongoose = require("mongoose");

const userAuditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  action: { type: String, required: true },
  recordId: { type: String, default: null },
  outcome: { type: String, enum: ["success", "failure"], default: "success" },
  reason: { type: String, default: "" },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, versionKey: false });

userAuditLogSchema.index({ createdAt: -1 });
userAuditLogSchema.index({ targetUserId: 1, createdAt: -1 });

module.exports = mongoose.model("UserAuditLog", userAuditLogSchema);
