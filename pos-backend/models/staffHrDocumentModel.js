const mongoose = require("mongoose");

const staffHrDocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, select: false },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
    category: {
      type: String,
      enum: ["Contract", "Identity", "Certification", "Medical", "Tax", "Other"],
      required: true,
    },
    visibility: { type: String, enum: ["EmployeeAndHR", "HROnly"], default: "EmployeeAndHR" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    auditHistory: [{
      action: { type: String, required: true },
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      at: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

staffHrDocumentSchema.index({ staff: 1, isActive: 1, createdAt: -1 });

module.exports = mongoose.model("StaffHrDocument", staffHrDocumentSchema);
