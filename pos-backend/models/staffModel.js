const mongoose = require("mongoose");
const Counter = require("./counterModel");

const salaryComponentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Earning", "Deduction", "EmployerContribution"], required: true },
    amount: { type: Number, required: true, min: 0 },
    recurring: { type: Boolean, default: true },
    taxable: { type: Boolean, default: false },
    pensionable: { type: Boolean, default: false },
    effectiveFrom: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    effectiveTo: { type: String, default: null, match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { _id: false }
);

const employmentHistorySchema = new mongoose.Schema(
  {
    effectiveAt: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    changes: { type: mongoose.Schema.Types.Mixed, required: true },
    reason: { type: String, trim: true, default: "" },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    source: { type: String, enum: ["User", "Migration"], default: "User" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// A member of staff (kitchen, delivery, cashier, waiter...). Separate from
// User (a login account): not every staff member needs a login.
// Payroll fields are restricted to payroll-authorized roles by the controller.
const staffSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true, sparse: true, index: true },
    linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" }, // salary slips go here
    designation: { type: String, trim: true, default: "" },
    cnic: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    joinDate: { type: String, required: true }, // "YYYY-MM-DD"
    baseSalary: { type: Number, default: 0, min: 0 }, // monthly, in Rs
    dateOfBirth: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    gender: { type: String, enum: ["", "Female", "Male", "Non-binary", "Prefer not to say"], default: "" },
    guardianName: { type: String, trim: true, default: "" },
    emergencyContact: { type: String, trim: true, default: "" },
    emergencyRelationship: { type: String, trim: true, default: "" },
    nationality: { type: String, trim: true, default: "" },
    employmentType: {
      type: String,
      enum: ["Permanent", "Contract", "Part-Time", "Temporary", "Intern", "Daily Wage", "Hourly Employee"],
      default: "Permanent",
    },
    employmentStatus: {
      type: String,
      enum: ["Active", "On Probation", "On Leave", "Suspended", "Resigned", "Terminated", "Retired"],
      default: "Active",
    },
    department: { type: String, trim: true, default: "" },
    branch: { type: String, trim: true, default: "" },
    reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    probationStartDate: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    probationEndDate: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    confirmationDate: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    contractStartDate: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    contractEndDate: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    lastWorkingDate: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    paymentMethod: { type: String, enum: ["", "Bank Transfer", "Cash", "Digital Payment"], default: "" },
    salaryComponents: { type: [salaryComponentSchema], default: [] },
    salaryEffectiveFrom: { type: String, default: "", match: /^$|^\d{4}-\d{2}-\d{2}$/ },
    salaryHistory: { type: [employmentHistorySchema], default: [] },
    employmentHistory: { type: [employmentHistorySchema], default: [] },
    annualLeaveEntitlement: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

staffSchema.pre("validate", async function assignEmployeeId() {
  if (this.employeeId) return;
  const year = (this.joinDate || new Date().toISOString().slice(0, 10)).slice(0, 4);
  const counter = await Counter.findOneAndUpdate(
    { _id: `staff-${year}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  this.employeeId = `EMP-${year}-${String(counter.seq).padStart(5, "0")}`;
});

staffSchema.index({ department: 1, branch: 1, employmentStatus: 1 });
staffSchema.index(
  { linkedUser: 1 },
  { unique: true, partialFilterExpression: { linkedUser: { $type: "objectId" } } }
);

module.exports = mongoose.model("Staff", staffSchema);
