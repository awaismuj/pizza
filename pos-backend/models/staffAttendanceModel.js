const mongoose = require("mongoose");

// One row per staff member per day. Everyone is auto-marked Present; a
// Cashier/Admin flips it to Absent (or Leave). The date-wise history is
// simply these rows.
const staffAttendanceSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    dayKey: { type: String, required: true }, // "YYYY-MM-DD"
    status: {
      type: String,
      enum: ["Present", "Absent", "Late Arrival", "Early Departure", "Half Day", "Leave", "Weekly Off", "Public Holiday", "Rest Day", "Work From Home", "Official Duty"],
      default: "Present",
    },
    auto: { type: Boolean, default: true }, // true = system auto-marked
    note: { type: String, default: "" },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "StaffShift", default: null },
    shiftName: { type: String, trim: true, default: "" },
    shiftStartTime: { type: String, default: "" },
    shiftEndTime: { type: String, default: "" },
    expectedDailyHours: { type: Number, min: 0, default: 8 },
    gracePeriodMinutes: { type: Number, min: 0, default: 0 },
    actualCheckIn: { type: Date, default: null },
    actualCheckOut: { type: Date, default: null },
    breakMinutes: { type: Number, min: 0, default: 0 },
    totalWorkingHours: { type: Number, min: 0, default: 0 },
    regularHours: { type: Number, min: 0, default: 0 },
    overtimeHours: { type: Number, min: 0, default: 0 },
    lateMinutes: { type: Number, min: 0, default: 0 },
    earlyDepartureMinutes: { type: Number, min: 0, default: 0 },
    source: { type: String, enum: ["Manual", "Employee", "QR", "Biometric", "Device"], default: "Manual" },
    correctionReason: { type: String, trim: true, default: "" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    auditHistory: [{
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      changedAt: { type: Date, default: Date.now },
      reason: { type: String, default: "" },
      before: { type: mongoose.Schema.Types.Mixed, default: null },
      after: { type: mongoose.Schema.Types.Mixed, default: null },
    }],
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
