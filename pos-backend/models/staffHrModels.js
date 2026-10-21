const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    endTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    breakMinutes: { type: Number, min: 0, default: 0 },
    workingDays: { type: [Number], default: [1, 2, 3, 4, 5] },
    weeklyOffDays: { type: [Number], default: [0, 6] },
    gracePeriodMinutes: { type: Number, min: 0, default: 0 },
    expectedDailyHours: { type: Number, min: 0, default: 8 },
    overtimeEligible: { type: Boolean, default: false },
    branch: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
shiftSchema.index({ name: 1, branch: 1 }, { unique: true });

const shiftAssignmentSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "StaffShift", required: true },
    effectiveFrom: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    effectiveTo: { type: String, default: null, match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
shiftAssignmentSchema.index({ staff: 1, effectiveFrom: 1 });

const leaveTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    annualEntitlementDays: { type: Number, min: 0, default: 0 },
    paid: { type: Boolean, default: true },
    requiresApproval: { type: Boolean, default: true },
    carryForwardLimitDays: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const leaveRequestSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
    leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "StaffLeaveType", required: true },
    startDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    endDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    partialDay: { type: Boolean, default: false },
    reason: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Cancelled"], default: "Pending", index: true },
    reviewNote: { type: String, trim: true, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auditHistory: [{
      action: { type: String, required: true },
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      at: { type: Date, default: Date.now },
      note: { type: String, default: "" },
    }],
  },
  { timestamps: true }
);
leaveRequestSchema.index({ staff: 1, startDate: 1, endDate: 1, status: 1 });

const leaveAccrualSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "StaffLeaveType", required: true },
    monthKey: { type: String, required: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    accruedDays: { type: Number, required: true, min: 0 },
    carryForwardDays: { type: Number, default: 0, min: 0 },
    source: { type: String, enum: ["Scheduled", "Manual"], default: "Scheduled" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);
leaveAccrualSchema.index({ staff: 1, leaveType: 1, monthKey: 1 }, { unique: true });

const overtimeSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    kind: { type: String, enum: ["Regular", "Rest Day", "Public Holiday", "Night"], default: "Regular" },
    regularHoursWorked: { type: Number, min: 0, default: 0 },
    hoursRequested: { type: Number, required: true, min: 0 },
    hoursApproved: { type: Number, min: 0, default: 0 },
    hourlyRate: { type: Number, min: 0, default: 0 },
    rateMultiplier: { type: Number, min: 0, default: 1 },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Paid"], default: "Pending", index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    payrollMonth: { type: String, match: /^\d{4}-\d{2}$/ },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auditHistory: [{
      action: { type: String, required: true },
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      at: { type: Date, default: Date.now },
      before: { type: mongoose.Schema.Types.Mixed, default: null },
      after: { type: mongoose.Schema.Types.Mixed, default: null },
      note: { type: String, default: "" },
    }],
  },
  { timestamps: true }
);
overtimeSchema.index({ staff: 1, date: 1, kind: 1 }, { unique: true });

const payrollPolicySchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    currency: { type: String, default: "PKR", match: /^[A-Z]{3}$/ },
    financialYearStartMonth: { type: Number, min: 1, max: 12, default: 1 },
    jurisdiction: { type: String, trim: true, default: "" },
    prorationMethod: { type: String, enum: ["CalendarDays", "WorkingDays", "FixedDivisor"], default: "CalendarDays" },
    fixedDivisor: { type: Number, min: 1, default: null },
    effectiveFrom: { type: String, default: "2000-01-01", match: /^\d{4}-\d{2}-\d{2}$/ },
    incomeTaxRate: { type: Number, min: 0, max: 1, default: null },
    employeeContributionRate: { type: Number, min: 0, max: 1, default: null },
    employerContributionRate: { type: Number, min: 0, max: 1, default: null },
    maxDeductionRate: { type: Number, min: 0, max: 1, default: null },
    configuredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    auditHistory: [{
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      at: { type: Date, default: Date.now },
      before: { type: mongoose.Schema.Types.Mixed, default: null },
      after: { type: mongoose.Schema.Types.Mixed, required: true },
    }],
  },
  { timestamps: true }
);

const staffLoanSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
    requestedAmount: { type: Number, required: true, min: 0.01 },
    approvedAmount: { type: Number, min: 0, default: null },
    monthlyInstallment: { type: Number, min: 0, default: null },
    startMonth: { type: String, match: /^\d{4}-(0[1-9]|1[0-2])$/, default: null },
    reason: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: ["Pending", "Rejected", "Active", "Completed"], default: "Pending", index: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    auditHistory: [{
      action: { type: String, required: true },
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      at: { type: Date, default: Date.now },
      note: { type: String, default: "" },
      changes: { type: mongoose.Schema.Types.Mixed, default: null },
    }],
  },
  { timestamps: true }
);

const loanRepaymentSchema = new mongoose.Schema(
  {
    loan: { type: mongoose.Schema.Types.ObjectId, ref: "StaffLoan", required: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    monthKey: { type: String, required: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["Pending", "Posted"], default: "Pending" },
    payrollRun: { type: mongoose.Schema.Types.ObjectId, ref: "StaffPayrollRun", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
loanRepaymentSchema.index({ loan: 1, monthKey: 1 }, { unique: true });
loanRepaymentSchema.index({ staff: 1, status: 1, monthKey: 1 });

const payrollItemSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    employeeId: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    baseSalary: { type: Number, required: true, min: 0 },
    earnings: [{ code: String, name: String, amount: { type: Number, min: 0, required: true } }],
    deductions: [{ code: String, name: String, amount: { type: Number, min: 0, required: true } }],
    employerContributions: [{ code: String, name: String, amount: { type: Number, min: 0, required: true } }],
    presentDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    paidLeaveDays: { type: Number, default: 0 },
    unpaidLeaveDays: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    loanRepayments: [{
      loan: { type: mongoose.Schema.Types.ObjectId, ref: "StaffLoan", required: true },
      amount: { type: Number, required: true, min: 0 },
    }],
    grossPay: { type: Number, required: true, min: 0 },
    totalDeductions: { type: Number, required: true, min: 0 },
    netPay: { type: Number, required: true, min: 0 },
    warnings: { type: [String], default: [] },
  },
  { _id: false }
);

const payrollRunSchema = new mongoose.Schema(
  {
    monthKey: { type: String, required: true, unique: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    status: { type: String, enum: ["Draft", "Pending Approval", "Approved", "Finalized"], default: "Draft", index: true },
    currency: { type: String, required: true },
    policySnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    items: { type: [payrollItemSchema], default: [] },
    grossTotal: { type: Number, default: 0 },
    deductionTotal: { type: Number, default: 0 },
    netTotal: { type: Number, default: 0 },
    employerContributionTotal: { type: Number, default: 0 },
    warnings: { type: [String], default: [] },
    preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    finalizedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    finalizedAt: { type: Date, default: null },
    auditHistory: [{
      action: { type: String, required: true },
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      at: { type: Date, default: Date.now },
      note: { type: String, default: "" },
    }],
  },
  { timestamps: true }
);

module.exports = {
  StaffShift: mongoose.model("StaffShift", shiftSchema),
  StaffShiftAssignment: mongoose.model("StaffShiftAssignment", shiftAssignmentSchema),
  StaffLeaveType: mongoose.model("StaffLeaveType", leaveTypeSchema),
  StaffLeaveRequest: mongoose.model("StaffLeaveRequest", leaveRequestSchema),
  StaffLeaveAccrual: mongoose.model("StaffLeaveAccrual", leaveAccrualSchema),
  StaffLoan: mongoose.model("StaffLoan", staffLoanSchema),
  StaffLoanRepayment: mongoose.model("StaffLoanRepayment", loanRepaymentSchema),
  StaffOvertime: mongoose.model("StaffOvertime", overtimeSchema),
  StaffPayrollPolicy: mongoose.model("StaffPayrollPolicy", payrollPolicySchema),
  StaffPayrollRun: mongoose.model("StaffPayrollRun", payrollRunSchema),
};
