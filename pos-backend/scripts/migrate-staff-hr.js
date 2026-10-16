require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const Staff = require("../models/staffModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const StaffHrDocument = require("../models/staffHrDocumentModel");
const StaffHrReportAudit = require("../models/staffHrReportAuditModel");
const StaffHrNotification = require("../models/staffHrNotificationModel");
const { StaffAdjustment, SalaryPayment } = require("../models/staffPayrollModels");
const {
  StaffShift,
  StaffShiftAssignment,
  StaffLeaveType,
  StaffLeaveRequest,
  StaffLeaveAccrual,
  StaffLoan,
  StaffLoanRepayment,
  StaffOvertime,
  StaffPayrollPolicy,
  StaffPayrollRun,
} = require("../models/staffHrModels");

const migrate = async () => {
  await mongoose.connect(config.databaseURI);
  console.log(`Connected to MongoDB: ${mongoose.connection.host}`);

  try {
    const needsBackfill = await Staff.find({
      $or: [
        { employeeId: { $exists: false } },
        { employeeId: null },
        { employeeId: "" },
        { salaryEffectiveFrom: { $exists: false } },
        { salaryEffectiveFrom: null },
        { salaryEffectiveFrom: "" },
      ],
    }).sort({ joinDate: 1, createdAt: 1 });
    const migrationDate = new Date().toISOString().slice(0, 10);
    let generatedIds = 0;
    let backfilledSalaries = 0;
    for (const staff of needsBackfill) {
      if (!staff.employeeId) {
        generatedIds += 1;
      }
      if (!staff.salaryEffectiveFrom) {
        staff.salaryEffectiveFrom = staff.salaryHistory.length
          ? staff.salaryHistory[0].effectiveAt
          : migrationDate;
        if (!staff.salaryHistory.length) {
          staff.salaryHistory.push({
            effectiveAt: staff.salaryEffectiveFrom,
            changes: { baseSalary: staff.baseSalary || 0, salaryComponents: staff.salaryComponents || [] },
            reason: "Current legacy salary terms migrated; earlier salary history is unavailable.",
            source: "Migration",
          });
        }
        backfilledSalaries += 1;
      }
      await staff.save();
    }
    console.log(`Generated ${generatedIds} employee IDs and recorded ${backfilledSalaries} salary effective dates.`);

    const models = [
      Staff,
      StaffHrDocument,
      StaffHrReportAudit,
      StaffHrNotification,
      StaffAttendance,
      StaffAdjustment,
      SalaryPayment,
      StaffShift,
      StaffShiftAssignment,
      StaffLeaveType,
      StaffLeaveRequest,
      StaffLeaveAccrual,
      StaffLoan,
      StaffLoanRepayment,
      StaffOvertime,
      StaffPayrollPolicy,
      StaffPayrollRun,
    ];
    await Promise.all(models.map((model) => model.createIndexes()));
    console.log("Staff HR indexes created.");
  } finally {
    await mongoose.disconnect();
  }
};

migrate().catch((error) => {
  console.error("Staff HR migration failed:", error);
  process.exitCode = 1;
});
