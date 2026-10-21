const mongoose = require("mongoose");

const staffHrReportAuditSchema = new mongoose.Schema(
  {
    reportType: { type: String, required: true },
    format: { type: String, required: true, enum: ["csv", "xls", "pdf"] },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} },
    rowCount: { type: Number, required: true, min: 0 },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

staffHrReportAuditSchema.index({ requestedAt: -1, requestedBy: 1 });

module.exports = mongoose.model("StaffHrReportAudit", staffHrReportAuditSchema);
