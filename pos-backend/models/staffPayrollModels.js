const mongoose = require("mongoose");

// Advance salary taken, or a deduction (fine, loan repayment...), for a day.
const staffAdjustmentSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
    type: { type: String, enum: ["Advance", "Deduction"], required: true },
    amount: { type: Number, required: true, min: 0 },
    dayKey: { type: String, required: true }, // "YYYY-MM-DD"
    monthKey: { type: String, required: true, index: true }, // "YYYY-MM"
    note: { type: String, default: "" },
    createdBy: { type: String, default: "" },
    createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isVoided: { type: Boolean, default: false },
    voidedAt: { type: Date, default: null },
    voidedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    voidReason: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Paid / unpaid state of one staff member's salary for one month.
const salaryPaymentSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    monthKey: { type: String, required: true },
    status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    paymentStatus: {
      type: String,
      enum: ["Draft", "Pending Approval", "Approved", "Processing", "Paid", "Failed", "Cancelled"],
      default: "Draft",
    },
    paymentMethod: { type: String, enum: ["", "Bank Transfer", "Cash", "Digital Payment", "Other"], default: "" },
    transactionReference: { type: String, trim: true, default: "" },
    amountPaid: { type: Number, default: 0 },
    paidAt: { type: Date },
    paidBy: { type: String, default: "" },
    slipEmailedAt: { type: Date },
    auditHistory: [{
      action: { type: String, required: true },
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      at: { type: Date, default: Date.now },
      before: { type: mongoose.Schema.Types.Mixed, default: null },
      after: { type: mongoose.Schema.Types.Mixed, default: null },
    }],
  },
  { timestamps: true }
);
salaryPaymentSchema.index({ staff: 1, monthKey: 1 }, { unique: true });

module.exports = {
  StaffAdjustment: mongoose.model("StaffAdjustment", staffAdjustmentSchema),
  SalaryPayment: mongoose.model("SalaryPayment", salaryPaymentSchema),
};
