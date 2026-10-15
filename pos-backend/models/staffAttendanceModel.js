const mongoose = require("mongoose");

// One row per staff member per day. Everyone is auto-marked Present; a
// Cashier/Admin flips it to Absent (or Leave). The date-wise history is
// simply these rows.
const staffAttendanceSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    dayKey: { type: String, required: true }, // "YYYY-MM-DD"
    status: { type: String, enum: ["Present", "Absent", "Leave"], default: "Present" },
    auto: { type: Boolean, default: true }, // true = system auto-marked
    note: { type: String, default: "" },
    markedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String, default: "" },
      role: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

staffAttendanceSchema.index({ staff: 1, dayKey: 1 }, { unique: true });

module.exports = mongoose.model("StaffAttendance", staffAttendanceSchema);
