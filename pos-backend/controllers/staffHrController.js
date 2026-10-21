const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const StaffHrDocument = require("../models/staffHrDocumentModel");
const StaffHrNotification = require("../models/staffHrNotificationModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const { SalaryPayment } = require("../models/staffPayrollModels");
const {
  StaffShift,
  StaffShiftAssignment,
  StaffLeaveType,
  StaffLeaveRequest,
  StaffOvertime,
  StaffLoan,
  StaffLoanRepayment,
  StaffPayrollPolicy,
  StaffPayrollRun,
} = require("../models/staffHrModels");
const { calculatePayrollPreview, getPayrollPolicy, monthBounds } = require("../utils/staffHrService");
const { accrueMonth, getLeaveBalances } = require("../services/staffLeaveAccrualService");
const { prepareLoanRepayments, postFinalizedLoanRepayments, reconcileFinalizedLoanRepayments } = require("../services/staffLoanService");
const { notifyStaff } = require("../services/staffHrNotificationService");
const { ensureAttendance, todayKey } = require("../utils/staffService");

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const validId = (value) => mongoose.Types.ObjectId.isValid(value);
const validDay = (value) => {
  if (!DAY_RE.test(value || "")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const actorId = (req) => req.user._id;
const isHrUser = (req) =>
  req.permissions?.includes("hr.manage") || req.permissions?.includes("hr.view") || false;
const requireText = (value, label) => {
  const result = String(value || "").trim();
  if (!result) throw createHttpError(400, `${label} is required.`);
  return result;
};
const validDateRange = (start, end) => validDay(start) && validDay(end) && start <= end;
const getLinkedStaff = async (req) => {
  const staff = await Staff.findOne({ linkedUser: req.user._id, isActive: true });
  if (!staff) throw createHttpError(403, "No active staff profile is linked to this employee account.");
  return staff;
};
const documentMetadata = (document) => ({
  _id: document._id,
  originalName: document.originalName,
  mimeType: document.mimeType,
  size: document.size,
  category: document.category,
  visibility: document.visibility,
  uploadedAt: document.createdAt,
});
const ensurePayrollDraft = async (monthKey) => {
  const run = await StaffPayrollRun.findOne({ monthKey });
  if (run && run.status !== "Draft") {
    throw createHttpError(409, "This payroll period is locked after submission for approval.");
  }
};
const ensureLeavePeriodsEditable = async (startDate, endDate) => {
  const lockedRun = await StaffPayrollRun.exists({
    status: { $ne: "Draft" },
    monthKey: {
      $gte: startDate.slice(0, 7),
      $lte: endDate.slice(0, 7),
    },
  });
  if (lockedRun) throw createHttpError(409, "Leave records affecting payroll are locked after submission for approval.");
};
const listShifts = async (req, res, next) => {
  try {
    const [shifts, assignments] = await Promise.all([
      StaffShift.find({ isActive: true }).sort({ branch: 1, name: 1 }).lean(),
      StaffShiftAssignment.find({})
        .populate("staff", "employeeId name department branch")
        .populate("shift", "name startTime endTime branch")
        .sort({ effectiveFrom: -1 })
        .lean(),
    ]);
    res.json({ success: true, data: { shifts, assignments } });
  } catch (error) {
    next(error);
  }
};

const createShift = async (req, res, next) => {
  try {
    const body = req.body || {};
    const workingDays = Array.isArray(body.workingDays) ? body.workingDays.map(Number) : [1, 2, 3, 4, 5];
    const weeklyOffDays = Array.isArray(body.weeklyOffDays) ? body.weeklyOffDays.map(Number) : [0, 6];
    if (
      workingDays.length === 0 ||
      workingDays.some((day) => !Number.isInteger(day) || day < 0 || day > 6) ||
      weeklyOffDays.some((day) => !Number.isInteger(day) || day < 0 || day > 6)
    ) {
      throw createHttpError(400, "Working days must use weekday numbers from 0 to 6.");
    }
    const validTime = (value) => /^\d{2}:\d{2}$/.test(value || "") &&
      Number(value.slice(0, 2)) <= 23 && Number(value.slice(3, 5)) <= 59;
    if (!validTime(body.startTime) || !validTime(body.endTime)) {
      throw createHttpError(400, "Shift start and end times must be valid 24-hour times.");
    }
    const breakMinutes = Number(body.breakMinutes ?? 0);
    const gracePeriodMinutes = Number(body.gracePeriodMinutes ?? 0);
    const expectedDailyHours = Number(body.expectedDailyHours ?? 8);
    if (!Number.isFinite(breakMinutes) || breakMinutes < 0 ||
        breakMinutes > 1440 || !Number.isFinite(gracePeriodMinutes) || gracePeriodMinutes < 0 ||
        !Number.isFinite(expectedDailyHours) || expectedDailyHours <= 0 || expectedDailyHours > 24) {
      throw createHttpError(400, "Shift break, grace period, and expected hours must be valid non-negative values.");
    }
    const shift = await StaffShift.create({
      name: requireText(body.name, "Shift name"),
      startTime: body.startTime,
      endTime: body.endTime,
      breakMinutes,
      workingDays,
      weeklyOffDays,
      gracePeriodMinutes,
      expectedDailyHours,
      overtimeEligible: body.overtimeEligible === true,
      branch: String(body.branch || "").trim(),
      createdBy: actorId(req),
    });
    res.status(201).json({ success: true, data: shift });
  } catch (error) {
    next(error);
  }
};

const assignShift = async (req, res, next) => {
  try {
    const { staffId, effectiveFrom, effectiveTo } = req.body || {};
    if (!validId(staffId) || !validDateRange(effectiveFrom, effectiveTo || effectiveFrom)) {
      throw createHttpError(400, "Select a valid employee and shift assignment date range.");
    }
    if (!(await Staff.exists({ _id: staffId, isActive: true }))) throw createHttpError(404, "Active employee not found.");
    const shift = await StaffShift.findById(req.params.shiftId);
    if (!shift || !shift.isActive) throw createHttpError(404, "Active shift not found.");
    const end = effectiveTo || null;
    const overlap = await StaffShiftAssignment.exists({
      staff: staffId,
      effectiveFrom: { $lte: end || "9999-12-31" },
      $or: [{ effectiveTo: null }, { effectiveTo: { $gte: effectiveFrom } }],
    });
    if (overlap) throw createHttpError(409, "This employee already has a shift assignment for that date range.");
    const assignment = await StaffShiftAssignment.create({
      staff: staffId, shift: shift._id, effectiveFrom, effectiveTo: end, assignedBy: actorId(req),
    });
    await notifyStaff({
      staffId,
      type: "shift-assignment",
      eventKey: String(assignment._id),
      subject: `Shift assignment updated — ${shift.name}`,
      message: `You have been assigned to the ${shift.name} shift from ${effectiveFrom}${end ? ` through ${end}` : ""}.`,
    });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

const endShiftAssignment = async (req, res, next) => {
  try {
    if (!validId(req.params.assignmentId)) throw createHttpError(400, "Invalid shift assignment ID.");
    const effectiveTo = req.body?.effectiveTo;
    if (!validDay(effectiveTo)) throw createHttpError(400, "Enter a valid shift end date.");
    const assignment = await StaffShiftAssignment.findById(req.params.assignmentId);
    if (!assignment) throw createHttpError(404, "Shift assignment not found.");
    if (assignment.effectiveTo) throw createHttpError(409, "This shift assignment already has an end date.");
    if (effectiveTo < assignment.effectiveFrom) {
      throw createHttpError(400, "The shift end date cannot be before its start date.");
    }
    const overlap = await StaffShiftAssignment.exists({
      _id: { $ne: assignment._id },
      staff: assignment.staff,
      effectiveFrom: { $lte: effectiveTo },
      $or: [{ effectiveTo: null }, { effectiveTo: { $gte: assignment.effectiveFrom } }],
    });
    if (overlap) throw createHttpError(409, "The end date would overlap another shift assignment.");
    const endedAssignment = await StaffShiftAssignment.findOneAndUpdate(
      { _id: assignment._id, effectiveTo: null },
      { $set: { effectiveTo, endedBy: actorId(req), endedAt: new Date() } },
      { new: true, runValidators: true }
    );
    if (!endedAssignment) throw createHttpError(409, "This shift assignment changed; reload and try again.");
    await notifyStaff({
      staffId: endedAssignment.staff,
      type: "shift-assignment-ended",
      eventKey: `${endedAssignment._id}:${effectiveTo}`,
      subject: "Shift assignment ended",
      message: `Your shift assignment ended effective ${effectiveTo}. Please contact HR if you do not have a new assignment.`,
    });
    res.json({ success: true, data: endedAssignment });
  } catch (error) {
    next(error);
  }
};

const listLeaveTypes = async (req, res, next) => {
  try {
    const types = await StaffLeaveType.find({ isActive: true }).sort({ name: 1 }).lean();
    res.json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
};

const createLeaveType = async (req, res, next) => {
  try {
    const body = req.body || {};
    const leaveType = await StaffLeaveType.create({
      name: requireText(body.name, "Leave type"),
      annualEntitlementDays: Number(body.annualEntitlementDays || 0),
      paid: body.paid !== false,
      requiresApproval: body.requiresApproval !== false,
      carryForwardLimitDays: Number(body.carryForwardLimitDays || 0),
    });
    res.status(201).json({ success: true, data: leaveType });
  } catch (error) {
    next(error);
  }
};

const listLeaveRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && ["Pending", "Approved", "Rejected", "Cancelled"].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (req.query.staffId) {
      if (!validId(req.query.staffId)) throw createHttpError(400, "Invalid employee ID.");
      filter.staff = req.query.staffId;
    }
    const rows = await StaffLeaveRequest.find(filter)
      .populate("staff", "employeeId name department branch")
      .populate("leaveType", "name paid")
      .sort({ startDate: -1 })
      .limit(500)
      .lean();
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

const createLeaveRequest = async (req, res, next) => {
  try {
    const { staffId, leaveTypeId, startDate, endDate, partialDay, reason } = req.body || {};
    if (!validId(staffId) || !validId(leaveTypeId) || !validDateRange(startDate, endDate)) {
      throw createHttpError(400, "Select an employee, leave type, and valid date range.");
    }
    await ensureLeavePeriodsEditable(startDate, endDate);
    if (!(await Staff.exists({ _id: staffId, isActive: true }))) throw createHttpError(404, "Active employee not found.");
    const leaveType = await StaffLeaveType.findOne({ _id: leaveTypeId, isActive: true });
    if (!leaveType) throw createHttpError(404, "Active leave type not found.");
    if (partialDay === true && startDate !== endDate) {
      throw createHttpError(400, "A partial-day leave request must cover one day.");
    }
    const overlap = await StaffLeaveRequest.exists({
      staff: staffId,
      status: { $in: ["Pending", "Approved"] },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });
    if (overlap) throw createHttpError(409, "This leave request overlaps another pending or approved request.");
    const status = leaveType.requiresApproval ? "Pending" : "Approved";
    const request = await StaffLeaveRequest.create({
      staff: staffId,
      leaveType: leaveTypeId,
      startDate,
      endDate,
      partialDay: partialDay === true,
      reason: String(reason || "").trim(),
      status,
      reviewedBy: leaveType.requiresApproval ? null : actorId(req),
      reviewedAt: leaveType.requiresApproval ? null : new Date(),
      createdBy: actorId(req),
      auditHistory: [{ action: status, actor: actorId(req), note: String(reason || "").trim() }],
    });
    await notifyStaff({
      staffId,
      type: "leave-request",
      eventKey: `${request._id}:${status}`,
      subject: "Leave request received",
      message: `Your ${leaveType.name} leave request for ${startDate} to ${endDate} is ${status.toLowerCase()}.`,
    });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

const reviewLeaveRequest = async (req, res, next) => {
  try {
    if (!["Approved", "Rejected", "Cancelled"].includes(req.body?.status)) {
      throw createHttpError(400, "Choose Approved, Rejected, or Cancelled.");
    }
    const request = await StaffLeaveRequest.findById(req.params.requestId);
    if (!request) throw createHttpError(404, "Leave request not found.");
    if (request.status !== "Pending") throw createHttpError(409, "Only pending leave requests can be reviewed.");
    if (req.body.status === "Approved") {
      await ensureLeavePeriodsEditable(request.startDate, request.endDate);
      if (String(request.createdBy) === String(actorId(req))) {
        throw createHttpError(403, "A leave request must be approved by someone other than its creator.");
      }
      const overlap = await StaffLeaveRequest.exists({
        _id: { $ne: request._id },
        staff: request.staff,
        status: { $in: ["Pending", "Approved"] },
        startDate: { $lte: request.endDate },
        endDate: { $gte: request.startDate },
      });
      if (overlap) throw createHttpError(409, "This request overlaps another approved leave.");
    }
    request.status = req.body.status;
    request.reviewNote = String(req.body.note || "").trim();
    request.reviewedBy = actorId(req);
    request.reviewedAt = new Date();
    request.auditHistory.push({ action: req.body.status, actor: actorId(req), note: request.reviewNote });
    await request.save();
    await notifyStaff({
      staffId: request.staff,
      type: "leave-review",
      eventKey: `${request._id}:${req.body.status}`,
      subject: `Leave request ${req.body.status.toLowerCase()}`,
      message: `Your leave request for ${request.startDate} to ${request.endDate} was ${req.body.status.toLowerCase()}${request.reviewNote ? `: ${request.reviewNote}` : "."}`,
    });
    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

const createOvertime = async (req, res, next) => {
  try {
    const { staffId, date, hoursRequested, regularHoursWorked, hourlyRate, rateMultiplier, kind } = req.body || {};
    if (!validId(staffId) || !validDay(date)) throw createHttpError(400, "Select a valid employee and overtime date.");
    const employee = await Staff.findById(staffId);
    if (!employee || date < employee.joinDate || (employee.lastWorkingDate && date > employee.lastWorkingDate)) {
      throw createHttpError(400, "Overtime date must fall within the employee's employment period.");
    }
    const hours = Number(hoursRequested);
    const rate = Number(hourlyRate);
    const multiplier = Number(rateMultiplier);
    const regularHours = Number(regularHoursWorked || 0);
    if (!(hours > 0) || hours > 24 || !Number.isFinite(hours) || !Number.isFinite(rate) || rate < 0 ||
        !Number.isFinite(regularHours) || regularHours < 0 || regularHours > 24 ||
        !Number.isFinite(multiplier) || multiplier <= 0) {
      throw createHttpError(400, "Enter valid requested hours and the approved effective hourly rate.");
    }
    await ensurePayrollDraft(date.slice(0, 7));
    const overtimeKind = ["Regular", "Rest Day", "Public Holiday", "Night"].includes(kind) ? kind : "Regular";
    const row = await StaffOvertime.create({
      staff: staffId,
      date,
      kind: overtimeKind,
      regularHoursWorked: regularHours,
      hoursRequested: hours,
      hourlyRate: rate,
      rateMultiplier: multiplier,
      createdBy: actorId(req),
      auditHistory: [{
        action: "Requested",
        actor: actorId(req),
        after: { date, kind: overtimeKind, hoursRequested: hours, hourlyRate: rate, rateMultiplier: multiplier },
      }],
    });
    await notifyStaff({
      staffId,
      type: "overtime-request",
      eventKey: `${row._id}:created`,
      subject: "Overtime request received",
      message: `Your overtime request for ${date} was recorded for HR review.`,
    });
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    next(error);
  }
};

const listOvertime = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.month && !MONTH_RE.test(req.query.month)) {
      throw createHttpError(400, "Month must use YYYY-MM format.");
    }
    if (req.query.month) {
      const { start, end } = monthBounds(req.query.month);
      filter.date = { $gte: start, $lte: end };
    }
    if (req.query.status && ["Pending", "Approved", "Rejected", "Paid"].includes(req.query.status)) filter.status = req.query.status;
    const rows = await StaffOvertime.find(filter)
      .populate("staff", "employeeId name department branch")
      .sort({ date: -1 })
      .limit(500)
      .lean();
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

const reviewOvertime = async (req, res, next) => {
  try {
    if (!["Approved", "Rejected"].includes(req.body?.status)) throw createHttpError(400, "Choose Approved or Rejected.");
    const hoursApproved = Number(req.body.hoursApproved);
    const overtime = await StaffOvertime.findById(req.params.overtimeId);
    if (!overtime) throw createHttpError(404, "Overtime request not found.");
    if (overtime.status !== "Pending") throw createHttpError(409, "Only pending overtime can be reviewed.");
    if (req.body.status === "Approved") await ensurePayrollDraft(overtime.date.slice(0, 7));
    if (req.body.status === "Approved" && String(overtime.createdBy) === String(actorId(req))) {
      throw createHttpError(403, "Overtime must be approved by someone other than its creator.");
    }
    if (req.body.status === "Approved" &&
        (!Number.isFinite(hoursApproved) || hoursApproved <= 0 || hoursApproved > overtime.hoursRequested)) {
      throw createHttpError(400, "Approved hours must be greater than zero and no more than requested hours.");
    }
    const before = { status: overtime.status, hoursApproved: overtime.hoursApproved };
    overtime.status = req.body.status;
    overtime.hoursApproved = req.body.status === "Approved" ? hoursApproved : 0;
    overtime.approvedBy = actorId(req);
    overtime.approvedAt = new Date();
    overtime.auditHistory.push({
      action: req.body.status,
      actor: actorId(req),
      before,
      after: { status: overtime.status, hoursApproved: overtime.hoursApproved },
    });
    await overtime.save();
    await notifyStaff({
      staffId: overtime.staff,
      type: "overtime-review",
      eventKey: `${overtime._id}:${overtime.status}`,
      subject: `Overtime request ${overtime.status.toLowerCase()}`,
      message: `Your overtime request for ${overtime.date} was ${overtime.status.toLowerCase()}${overtime.status === "Approved" ? ` for ${overtime.hoursApproved} hours` : ""}.`,
    });
    res.json({ success: true, data: overtime });
  } catch (error) {
    next(error);
  }
};

const getPayrollPolicyEndpoint = async (req, res, next) => {
  try {
    res.json({ success: true, data: await getPayrollPolicy() });
  } catch (error) {
    next(error);
  }
};

const updatePayrollPolicy = async (req, res, next) => {
  try {
    const body = req.body || {};
    const policyFields = [
      "currency", "financialYearStartMonth", "jurisdiction", "prorationMethod", "fixedDivisor", "effectiveFrom",
      "incomeTaxRate", "employeeContributionRate", "employerContributionRate",
      "maxDeductionRate", "deductUnpaidLeave",
    ];
    const values = {};
    for (const key of policyFields) if (body[key] !== undefined) values[key] = body[key];
    if (values.currency && !/^[A-Z]{3}$/.test(values.currency)) throw createHttpError(400, "Currency must be a three-letter ISO code.");
    if (values.financialYearStartMonth !== undefined &&
        (!Number.isInteger(Number(values.financialYearStartMonth)) ||
         Number(values.financialYearStartMonth) < 1 || Number(values.financialYearStartMonth) > 12)) {
      throw createHttpError(400, "Financial year start month must be between 1 and 12.");
    }
    if (values.financialYearStartMonth !== undefined) values.financialYearStartMonth = Number(values.financialYearStartMonth);
    if (values.effectiveFrom && !validDay(values.effectiveFrom)) {
      throw createHttpError(400, "Policy effective date must be a valid YYYY-MM-DD date.");
    }
    if (values.prorationMethod && !["CalendarDays", "WorkingDays", "FixedDivisor"].includes(values.prorationMethod)) {
      throw createHttpError(400, "Select a supported salary proration method.");
    }
    if (values.prorationMethod === "FixedDivisor" && !(Number(values.fixedDivisor) > 0)) {
      throw createHttpError(400, "A positive fixed divisor is required for fixed-divisor proration.");
    }
    for (const key of ["incomeTaxRate", "employeeContributionRate", "employerContributionRate", "maxDeductionRate"]) {
      if (values[key] !== undefined && values[key] !== null &&
          (!Number.isFinite(Number(values[key])) || Number(values[key]) < 0 || Number(values[key]) > 1)) {
        throw createHttpError(400, `${key} must be a decimal rate from 0 to 1 or null.`);
      }
    }
    const policy = await StaffPayrollPolicy.findOneAndUpdate(
      { key: "global" },
      {
        $set: { ...values, configuredBy: actorId(req) },
        $push: { auditHistory: { actor: actorId(req), before: await getPayrollPolicy(), after: values } },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: policy });
  } catch (error) {
    next(error);
  }
};

const createPayrollPreview = async (req, res, next) => {
  try {
    const monthKey = String(req.body?.monthKey || "");
    if (!MONTH_RE.test(monthKey)) throw createHttpError(400, "Payroll period must use YYYY-MM format.");
    await reconcileFinalizedLoanRepayments();
    const policy = await getPayrollPolicy();
    if (policy.effectiveFrom.slice(0, 7) > monthKey) {
      throw createHttpError(409, `No payroll policy is effective for ${monthKey}.`);
    }
    const preview = await calculatePayrollPreview(monthKey);
    const existing = await StaffPayrollRun.findOne({ monthKey });
    if (existing?.status === "Finalized") throw createHttpError(409, "This payroll period is finalized and locked.");
    if (existing && existing.status !== "Draft") throw createHttpError(409, "This payroll period is under review and cannot be recalculated.");
    const warnings = [...preview.warnings];
    if (preview.policy.maxDeductionRate !== null) {
      preview.items.forEach((item) => {
        if (item.grossPay > 0 && item.totalDeductions > item.grossPay * preview.policy.maxDeductionRate) {
          item.warnings.push("Deductions exceed the configured policy limit; review before submitting payroll.");
          warnings.push(`${item.employeeId || item.name}: deductions exceed the configured limit.`);
        }
      });
    } else {
      warnings.push("Maximum deduction limit is not configured; review deductions before approval.");
    }
    const data = existing || new StaffPayrollRun({ monthKey, preparedBy: actorId(req) });
    data.status = "Draft";
    data.currency = preview.currency;
    data.policySnapshot = preview.policy;
    data.items = preview.items;
    data.grossTotal = preview.grossTotal;
    data.deductionTotal = preview.deductionTotal;
    data.netTotal = preview.netTotal;
    data.employerContributionTotal = preview.employerContributionTotal;
    data.warnings = [...new Set(warnings)];
    data.preparedBy = actorId(req);
    data.auditHistory.push({ action: "Preview calculated", actor: actorId(req) });
    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const listPayrollRuns = async (req, res, next) => {
  try {
    const rows = await StaffPayrollRun.find().sort({ monthKey: -1 }).limit(36).lean();
    const payments = await SalaryPayment.find({ monthKey: { $in: rows.map((run) => run.monthKey) } }).lean();
    const paymentByKey = new Map(payments.map((payment) => [
      `${payment.monthKey}:${payment.staff}`,
      payment,
    ]));
    const data = rows.map((run) => ({
      ...run,
      items: run.items.map((item) => {
        const payment = paymentByKey.get(`${run.monthKey}:${item.staff}`);
        return {
          ...item,
          paymentStatus: payment?.paymentStatus || (payment?.status === "Paid" ? "Paid" : "Draft"),
          paymentMethod: payment?.paymentMethod || "",
        };
      }),
    }));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const transitionPayroll = async (req, res, next) => {
  try {
    const { action, note } = req.body || {};
    const run = await StaffPayrollRun.findOne({ monthKey: req.params.monthKey });
    if (!run) throw createHttpError(404, "Payroll run not found.");
    if (action === "submit" && run.status === "Draft") {
      run.status = "Pending Approval";
      run.auditHistory.push({ action: "Submitted for approval", actor: actorId(req), note: String(note || "") });
    } else if (action === "approve" && run.status === "Pending Approval") {
      if (String(run.preparedBy) === String(actorId(req))) {
        throw createHttpError(403, "Payroll must be approved by a user other than its preparer.");
      }
      run.status = "Approved";
      run.approvedBy = actorId(req);
      run.approvedAt = new Date();
      run.auditHistory.push({ action: "Approved", actor: actorId(req), note: String(note || "") });
    } else if (action === "finalize" && run.status === "Approved") {
      const pendingWarnings = run.warnings.length > 0;
      if (pendingWarnings && req.body.confirmWarnings !== true) {
        throw createHttpError(409, "Review the payroll warnings and explicitly confirm them before finalizing.");
      }
      await prepareLoanRepayments(run, actorId(req));
      const result = await StaffPayrollRun.updateOne(
        { _id: run._id, status: "Approved" },
        {
          $set: { status: "Finalized", finalizedBy: actorId(req), finalizedAt: new Date() },
          $push: { auditHistory: { action: "Finalized and locked", actor: actorId(req), note: String(note || "") } },
        }
      );
      if (!result.modifiedCount) throw createHttpError(409, "Payroll status changed; reload and try again.");
      const overtimeIds = run.items.map((item) => item.staff);
      const { start, end } = monthBounds(run.monthKey);
      await StaffOvertime.updateMany(
        { staff: { $in: overtimeIds }, date: { $gte: start, $lte: end }, status: "Approved", payrollMonth: { $exists: false } },
        { $set: { status: "Paid", payrollMonth: run.monthKey } }
      );
      await postFinalizedLoanRepayments(run._id);
      const finalized = await StaffPayrollRun.findById(run._id);
      return res.json({ success: true, data: finalized });
    } else {
      throw createHttpError(409, `Cannot perform '${action}' while payroll is ${run.status}.`);
    }
    await run.save();
    res.json({ success: true, data: run });
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { staffId, status, method, reference, paidAt } = req.body || {};
    if (!MONTH_RE.test(req.params.monthKey || "") || !validId(staffId) ||
        !["Pending Approval", "Approved", "Processing", "Paid", "Failed", "Cancelled"].includes(status)) {
      throw createHttpError(400, "Select a valid employee and payment status.");
    }
    if (paidAt && !validDay(paidAt)) throw createHttpError(400, "Payment date must be a valid calendar date.");
    const run = await StaffPayrollRun.findOne({ monthKey: req.params.monthKey, status: "Finalized" });
    if (!run) throw createHttpError(409, "Finalize payroll before recording salary payments.");
    const item = run.items.find((entry) => String(entry.staff) === String(staffId));
    if (!item) throw createHttpError(404, "Employee is not included in this payroll period.");
    const allowedMethod = ["Bank Transfer", "Cash", "Digital Payment", "Other"].includes(method) ? method : "Other";
    const existing = await SalaryPayment.findOne({ staff: staffId, monthKey: req.params.monthKey });
    if (existing?.status === "Paid" && status !== "Paid") throw createHttpError(409, "Paid payroll payments cannot be silently reverted.");
    const before = existing ? {
      paymentStatus: existing.paymentStatus,
      status: existing.status,
      paymentMethod: existing.paymentMethod,
      amountPaid: existing.amountPaid,
      transactionReference: existing.transactionReference,
    } : null;
    const paymentStatus = status === "Paid" ? "Paid" : "Unpaid";
    const paymentMethod = allowedMethod;
    const amountPaid = status === "Paid" ? item.netPay : 0;
    const paidAtValue = status === "Paid"
      ? (paidAt ? new Date(`${paidAt}T00:00:00Z`) : new Date())
      : null;
    const paymentValues = {
      status: paymentStatus,
      amountPaid,
      paidAt: paidAtValue,
      paidBy: req.user.name,
      paymentMethod,
      transactionReference: String(reference || "").trim(),
      paymentStatus: status,
    };
    const auditEvent = {
      actor: actorId(req),
      action: "Payment status updated",
      before,
      after: { status: paymentStatus, paymentStatus: status, paymentMethod, amountPaid },
    };
    let payment;
    if (existing) {
      const filter = { _id: existing._id };
      if (status !== "Paid") filter.status = { $ne: "Paid" };
      payment = await SalaryPayment.findOneAndUpdate(
        filter,
        { $set: paymentValues, $push: { auditHistory: auditEvent } },
        { new: true, runValidators: true }
      );
      if (!payment) throw createHttpError(409, "Payment status changed; reload and try again.");
    } else {
      try {
        payment = await SalaryPayment.create({ staff: staffId, monthKey: req.params.monthKey, ...paymentValues, auditHistory: [auditEvent] });
      } catch (error) {
        if (error.code === 11000) throw createHttpError(409, "A payment record was created concurrently; reload and try again.");
        throw error;
      }
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

const linkEmployeeAccount = async (req, res, next) => {
  try {
    if (!validId(req.params.staffId)) throw createHttpError(400, "Invalid employee ID.");
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) throw createHttpError(400, "Enter a valid employee account email.");
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const [staff, user] = await Promise.all([
      Staff.findById(req.params.staffId),
      User.findOne({ email: { $regex: `^${escapedEmail}$`, $options: "i" } }),
    ]);
    if (!staff || !staff.isActive) throw createHttpError(404, "Active employee not found.");
    if (!user || user.role !== "Employee" || user.status !== "Approved") {
      throw createHttpError(404, "No approved Employee account exists for that email.");
    }
    const existingLink = await Staff.findOne({ linkedUser: user._id, _id: { $ne: staff._id } });
    if (existingLink) throw createHttpError(409, "This account is already linked to another employee.");
    if (staff.linkedUser && String(staff.linkedUser) !== String(user._id)) {
      throw createHttpError(409, "This employee already has a linked account. Unlink it before changing accounts.");
    }
    if (!staff.linkedUser) {
      staff.linkedUser = user._id;
      staff.employmentHistory.push({
        effectiveAt: new Date().toISOString().slice(0, 10),
        changes: { linkedUser: { before: null, after: String(user._id) } },
        reason: "Employee self-service account linked",
        changedBy: actorId(req),
      });
      await staff.save();
    }
    res.json({ success: true, data: { staffId: staff._id, linkedUser: { _id: user._id, name: user.name, email: user.email } } });
  } catch (error) {
    if (error.code === 11000) return next(createHttpError(409, "This employee account is already linked to another staff profile."));
    next(error);
  }
};

const unlinkEmployeeAccount = async (req, res, next) => {
  try {
    if (!validId(req.params.staffId)) throw createHttpError(400, "Invalid employee ID.");
    const staff = await Staff.findById(req.params.staffId);
    if (!staff) throw createHttpError(404, "Employee not found.");
    if (staff.linkedUser) {
      const previousUser = staff.linkedUser;
      staff.linkedUser = null;
      staff.employmentHistory.push({
        effectiveAt: new Date().toISOString().slice(0, 10),
        changes: { linkedUser: { before: String(previousUser), after: null } },
        reason: "Employee self-service account unlinked",
        changedBy: actorId(req),
      });
      await staff.save();
    }
    res.json({ success: true, data: { staffId: staff._id, linkedUser: null } });
  } catch (error) {
    next(error);
  }
};

const getEmployeeSelf = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    res.json({
      success: true,
      data: {
        _id: staff._id,
        employeeId: staff.employeeId,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        designation: staff.designation,
        department: staff.department,
        branch: staff.branch,
        joinDate: staff.joinDate,
        employmentType: staff.employmentType,
        employmentStatus: staff.employmentStatus,
        contractEndDate: staff.contractEndDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeAttendance = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    const endDate = req.query.endDate || todayKey();
    const startDate = req.query.startDate || `${endDate.slice(0, 7)}-01`;
    if (!validDateRange(startDate, endDate)) throw createHttpError(400, "Attendance dates must be a valid YYYY-MM-DD range.");
    const rows = await StaffAttendance.find({
      staff: staff._id,
      dayKey: { $gte: startDate, $lte: endDate },
    }).sort({ dayKey: -1 }).limit(120).select("dayKey status actualCheckIn actualCheckOut breakMinutes totalWorkingHours shiftName");
    res.json({
      success: true,
      data: rows.map((row) => ({
        _id: row._id,
        date: row.dayKey,
        status: row.status,
        checkIn: row.actualCheckIn,
        checkOut: row.actualCheckOut,
        breakMinutes: row.breakMinutes,
        hoursWorked: row.totalWorkingHours,
        shiftName: row.shiftName,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const clockEmployeeAttendance = async (req, res, next) => {
  try {
    const action = String(req.body?.action || "");
    if (!["in", "out"].includes(action)) throw createHttpError(400, "Choose check-in or check-out.");
    const staff = await getLinkedStaff(req);
    const dayKey = todayKey();
    await ensureAttendance([dayKey]);
    const attendance = await StaffAttendance.findOne({ staff: staff._id, dayKey });
    if (!attendance) throw createHttpError(409, "Attendance is unavailable for this employee today.");
    const before = {
      status: attendance.status,
      actualCheckIn: attendance.actualCheckIn,
      actualCheckOut: attendance.actualCheckOut,
      totalWorkingHours: attendance.totalWorkingHours,
    };
    const now = new Date();
    if (action === "in") {
      if (attendance.actualCheckIn) throw createHttpError(409, "You have already checked in today.");
      if (attendance.actualCheckOut) throw createHttpError(409, "Today's attendance has already been closed.");
      attendance.actualCheckIn = now;
      attendance.status = attendance.status === "Weekly Off" ? "Weekly Off" : "Present";
      if (attendance.shiftStartTime) {
        const shiftStart = new Date(`${dayKey}T${attendance.shiftStartTime}:00`);
        attendance.lateMinutes = Math.max(0, Math.floor((now - shiftStart) / 60000));
        if (attendance.lateMinutes <= attendance.gracePeriodMinutes) attendance.lateMinutes = 0;
        if (attendance.lateMinutes > 0) attendance.status = "Late Arrival";
      }
    } else {
      if (!attendance.actualCheckIn) throw createHttpError(409, "Check in before checking out.");
      if (attendance.actualCheckOut) throw createHttpError(409, "You have already checked out today.");
      attendance.actualCheckOut = now;
      const elapsedMinutes = (now - attendance.actualCheckIn) / 60000;
      if (elapsedMinutes > 1440) throw createHttpError(409, "Attendance duration exceeds 24 hours; contact HR to correct it.");
      const breakMinutes = Math.min(attendance.breakMinutes || 0, elapsedMinutes);
      attendance.totalWorkingHours = Math.round(((elapsedMinutes - breakMinutes) / 60) * 100) / 100;
      attendance.regularHours = Math.min(attendance.totalWorkingHours, attendance.expectedDailyHours || 8);
      attendance.overtimeHours = Math.max(0, attendance.totalWorkingHours - (attendance.expectedDailyHours || 8));
      if (attendance.shiftEndTime) {
        const shiftStart = new Date(`${dayKey}T${attendance.shiftStartTime || "00:00"}:00`);
        const shiftEnd = new Date(`${dayKey}T${attendance.shiftEndTime}:00`);
        if (shiftEnd <= shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);
        attendance.earlyDepartureMinutes = Math.max(0, Math.floor((shiftEnd - now) / 60000));
        if (!attendance.lateMinutes && attendance.earlyDepartureMinutes > 0 && attendance.status !== "Weekly Off") {
          attendance.status = "Early Departure";
        }
      }
    }
    attendance.auto = false;
    attendance.source = "Employee";
    attendance.markedBy = { userId: req.user._id, name: req.user.name, role: req.user.role };
    attendance.auditHistory.push({
      changedBy: req.user._id,
      reason: `Employee self-service clock ${action}`,
      before,
      after: {
        status: attendance.status,
        actualCheckIn: attendance.actualCheckIn,
        actualCheckOut: attendance.actualCheckOut,
        totalWorkingHours: attendance.totalWorkingHours,
      },
    });
    await attendance.save();
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

const getEmployeeLeaveTypes = async (req, res, next) => {
  try {
    await getLinkedStaff(req);
    const types = await StaffLeaveType.find({ isActive: true }).sort({ name: 1 }).select("name paid annualEntitlementDays");
    res.json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
};

const getEmployeeLeaveRequests = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    const rows = await StaffLeaveRequest.find({ staff: staff._id })
      .populate("leaveType", "name paid")
      .sort({ startDate: -1 })
      .limit(200)
      .lean();
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

const listLeaveBalances = async (req, res, next) => {
  try {
    const year = Number(req.query.year || new Date().getFullYear());
    if (!Number.isInteger(year) || year < 2000 || year > new Date().getFullYear()) {
      throw createHttpError(400, "Leave balance year must be a valid past or current year.");
    }
    res.json({ success: true, data: await getLeaveBalances({ year }) });
  } catch (error) {
    next(error);
  }
};

const getEmployeeLeaveBalances = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    const year = Number(req.query.year || new Date().getFullYear());
    if (!Number.isInteger(year) || year < 2000 || year > new Date().getFullYear()) {
      throw createHttpError(400, "Leave balance year must be a valid past or current year.");
    }
    res.json({ success: true, data: await getLeaveBalances({ staffId: staff._id, year }) });
  } catch (error) {
    next(error);
  }
};

const runLeaveAccrual = async (req, res, next) => {
  try {
    const monthKey = String(req.body?.monthKey || "");
    if (!MONTH_RE.test(monthKey) || monthKey > new Date().toISOString().slice(0, 7)) {
      throw createHttpError(400, "Choose a valid current or completed month for leave accrual.");
    }
    res.json({ success: true, data: await accrueMonth(monthKey, "Manual", actorId(req)) });
  } catch (error) {
    next(error);
  }
};

const createEmployeeLeaveRequest = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    req.body = { ...(req.body || {}), staffId: String(staff._id) };
    return createLeaveRequest(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getEmployeeLoans = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    const loans = await StaffLoan.find({ staff: staff._id }).sort({ createdAt: -1 }).lean();
    const repayments = await StaffLoanRepayment.aggregate([
      { $match: { staff: staff._id, status: "Posted" } },
      { $group: { _id: "$loan", total: { $sum: "$amount" } } },
    ]);
    const repaidByLoan = new Map(repayments.map((entry) => [String(entry._id), entry.total]));
    res.json({
      success: true,
      data: loans.map((loan) => ({
        _id: loan._id,
        requestedAmount: loan.requestedAmount,
        approvedAmount: loan.approvedAmount,
        monthlyInstallment: loan.monthlyInstallment,
        startMonth: loan.startMonth,
        reason: loan.reason,
        status: loan.status,
        createdAt: loan.createdAt,
        repaidAmount: repaidByLoan.get(String(loan._id)) || 0,
        remainingBalance: Math.max(0, Number(loan.approvedAmount || 0) - (repaidByLoan.get(String(loan._id)) || 0)),
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeNotifications = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    const rows = await StaffHrNotification.find({ staff: staff._id })
      .select("type subject message status createdAt sentAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

const createEmployeeLoanRequest = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    const requestedAmount = Number(req.body?.requestedAmount);
    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      throw createHttpError(400, "Enter a loan request amount greater than zero.");
    }
    if (await StaffLoan.exists({ staff: staff._id, status: "Pending" })) {
      throw createHttpError(409, "You already have a loan request awaiting review.");
    }
    const reason = String(req.body?.reason || "").trim();
    const loan = await StaffLoan.create({
      staff: staff._id,
      requestedAmount: Math.round(requestedAmount * 100) / 100,
      reason,
      requestedBy: actorId(req),
      auditHistory: [{ action: "Requested", actor: actorId(req), note: reason }],
    });
    await notifyStaff({
      staffId: staff._id,
      type: "loan-request",
      eventKey: `${loan._id}:requested`,
      subject: "Loan request received",
      message: "Your salary advance or loan request has been submitted to HR.",
    });
    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
};

const listLoans = async (req, res, next) => {
  try {
    const loans = await StaffLoan.find({})
      .populate("staff", "employeeId name department branch")
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean();
    const repayments = await StaffLoanRepayment.aggregate([
      { $match: { status: "Posted" } },
      { $group: { _id: "$loan", total: { $sum: "$amount" } } },
    ]);
    const repaidByLoan = new Map(repayments.map((entry) => [String(entry._id), entry.total]));
    res.json({
      success: true,
      data: loans.map((loan) => ({
        ...loan,
        repaidAmount: repaidByLoan.get(String(loan._id)) || 0,
        remainingBalance: Math.max(0, Number(loan.approvedAmount || 0) - (repaidByLoan.get(String(loan._id)) || 0)),
      })),
    });
  } catch (error) {
    next(error);
  }
};

const reviewLoan = async (req, res, next) => {
  try {
    if (!validId(req.params.loanId)) throw createHttpError(400, "Invalid loan request ID.");
    const loan = await StaffLoan.findById(req.params.loanId);
    if (!loan) throw createHttpError(404, "Loan request not found.");
    if (loan.status !== "Pending") throw createHttpError(409, "Only pending loan requests can be reviewed.");
    if (String(loan.requestedBy) === String(actorId(req))) {
      throw createHttpError(403, "A loan request must be approved by someone other than its requester.");
    }
    const status = String(req.body?.status || "");
    if (!["Active", "Rejected"].includes(status)) throw createHttpError(400, "Choose Active or Rejected.");
    const note = String(req.body?.note || "").trim();
    if (status === "Active") {
      const approvedAmount = Number(req.body?.approvedAmount);
      const monthlyInstallment = Number(req.body?.monthlyInstallment);
      const startMonth = String(req.body?.startMonth || "");
      if (
        !Number.isFinite(approvedAmount) || approvedAmount <= 0 || approvedAmount > loan.requestedAmount ||
        !Number.isFinite(monthlyInstallment) || monthlyInstallment <= 0 || monthlyInstallment > approvedAmount ||
        !MONTH_RE.test(startMonth) || startMonth < new Date().toISOString().slice(0, 7)
      ) {
        throw createHttpError(400, "Provide a valid approved amount, fixed monthly installment, and current or future start month.");
      }
      loan.approvedAmount = Math.round(approvedAmount * 100) / 100;
      loan.monthlyInstallment = Math.round(monthlyInstallment * 100) / 100;
      loan.startMonth = startMonth;
    }
    loan.status = status;
    loan.reviewedBy = actorId(req);
    loan.reviewedAt = new Date();
    loan.auditHistory.push({
      action: status,
      actor: actorId(req),
      note,
      changes: {
        after: {
          status,
          approvedAmount: loan.approvedAmount,
          monthlyInstallment: loan.monthlyInstallment,
          startMonth: loan.startMonth,
        },
      },
    });
    await loan.save();
    await notifyStaff({
      staffId: loan.staff,
      type: "loan-review",
      eventKey: `${loan._id}:${status}`,
      subject: `Loan request ${status === "Active" ? "approved" : "rejected"}`,
      message: status === "Active"
        ? `Your request was approved for ${loan.approvedAmount} with a monthly payroll deduction of ${loan.monthlyInstallment} starting ${loan.startMonth}.`
        : `Your request was rejected${note ? `: ${note}` : "."}`,
    });
    res.json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
};

const documentMimeMatches = (buffer, mimeType) => {
  if (mimeType === "application/pdf") return buffer.subarray(0, 5).toString() === "%PDF-";
  if (mimeType === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimeType === "image/webp") return buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  return false;
};

const uploadEmployeeDocument = async (req, res, next) => {
  try {
    if (!validId(req.params.staffId)) throw createHttpError(400, "Invalid employee ID.");
    if (!req.file) throw createHttpError(400, "Select a document to upload.");
    const staff = await Staff.findById(req.params.staffId);
    if (!staff || !staff.isActive) throw createHttpError(404, "Active employee not found.");
    const category = String(req.body?.category || "");
    if (!["Contract", "Identity", "Certification", "Medical", "Tax", "Other"].includes(category)) {
      throw createHttpError(400, "Select a valid HR document category.");
    }
    if (!documentMimeMatches(req.file.buffer, req.file.mimetype)) {
      throw createHttpError(400, "The document contents do not match its file type.");
    }
    const originalName = path.basename(req.file.originalname).replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 180);
    const document = await StaffHrDocument.create({
      filename: crypto.randomBytes(24).toString("hex"),
      originalName: originalName || "HR document",
      mimeType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
      staff: staff._id,
      category,
      visibility: req.body?.visibility === "HROnly" ? "HROnly" : "EmployeeAndHR",
      uploadedBy: actorId(req),
      auditHistory: [{ action: "Uploaded", actor: actorId(req) }],
    });
    res.status(201).json({ success: true, data: documentMetadata(document) });
  } catch (error) {
    next(error);
  }
};

const uploadMyEmployeeDocument = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    req.params.staffId = String(staff._id);
    req.body = { ...(req.body || {}), visibility: "EmployeeAndHR" };
    return uploadEmployeeDocument(req, res, next);
  } catch (error) {
    next(error);
  }
};

const listEmployeeDocuments = async (req, res, next) => {
  try {
    if (!validId(req.params.staffId)) throw createHttpError(400, "Invalid employee ID.");
    const filter = { staff: req.params.staffId, isActive: true };
    if (!isHrUser(req)) {
      const staff = await getLinkedStaff(req);
      if (String(staff._id) !== String(req.params.staffId)) throw createHttpError(403, "You can only access your own HR documents.");
      filter.visibility = "EmployeeAndHR";
    }
    const rows = await StaffHrDocument.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: rows.map(documentMetadata) });
  } catch (error) {
    next(error);
  }
};

const listMyEmployeeDocuments = async (req, res, next) => {
  try {
    const staff = await getLinkedStaff(req);
    req.params.staffId = String(staff._id);
    return listEmployeeDocuments(req, res, next);
  } catch (error) {
    next(error);
  }
};

const downloadEmployeeDocument = async (req, res, next) => {
  try {
    if (!validId(req.params.documentId)) throw createHttpError(400, "Invalid document ID.");
    const document = await StaffHrDocument.findOne({ _id: req.params.documentId, isActive: true }).select("+data");
    if (!document) throw createHttpError(404, "HR document not found.");
    if (!isHrUser(req)) {
      const staff = await getLinkedStaff(req);
      if (String(staff._id) !== String(document.staff) || document.visibility !== "EmployeeAndHR") {
        throw createHttpError(403, "You are not authorized to access this HR document.");
      }
    }
    document.auditHistory.push({ action: "Downloaded", actor: actorId(req) });
    await document.save();
    const safeName = encodeURIComponent(document.originalName).replace(/['()]/g, (char) => `%${char.charCodeAt(0).toString(16)}`);
    res.set({
      "Content-Type": document.mimeType,
      "Content-Length": document.size,
      "Content-Disposition": `attachment; filename*=UTF-8''${safeName}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    });
    res.send(document.data);
  } catch (error) {
    next(error);
  }
};

const archiveEmployeeDocument = async (req, res, next) => {
  try {
    if (!validId(req.params.documentId)) throw createHttpError(400, "Invalid document ID.");
    const document = await StaffHrDocument.findOne({ _id: req.params.documentId, isActive: true });
    if (!document) throw createHttpError(404, "HR document not found.");
    document.isActive = false;
    document.auditHistory.push({ action: "Archived", actor: actorId(req) });
    await document.save();
    res.json({ success: true, data: { _id: document._id, isActive: false } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listShifts,
  createShift,
  assignShift,
  endShiftAssignment,
  listLeaveTypes,
  createLeaveType,
  listLeaveRequests,
  createLeaveRequest,
  reviewLeaveRequest,
  createOvertime,
  listOvertime,
  reviewOvertime,
  getPayrollPolicyEndpoint,
  updatePayrollPolicy,
  createPayrollPreview,
  listPayrollRuns,
  transitionPayroll,
  recordPayment,
  linkEmployeeAccount,
  unlinkEmployeeAccount,
  getEmployeeSelf,
  getEmployeeAttendance,
  clockEmployeeAttendance,
  getEmployeeLeaveTypes,
  getEmployeeLeaveRequests,
  getEmployeeLoans,
  getEmployeeNotifications,
  createEmployeeLoanRequest,
  listLoans,
  reviewLoan,
  listLeaveBalances,
  getEmployeeLeaveBalances,
  runLeaveAccrual,
  createEmployeeLeaveRequest,
  uploadEmployeeDocument,
  uploadMyEmployeeDocument,
  listEmployeeDocuments,
  listMyEmployeeDocuments,
  downloadEmployeeDocument,
  archiveEmployeeDocument,
};
