const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Staff = require("../models/staffModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const { StaffAdjustment, SalaryPayment } = require("../models/staffPayrollModels");
const { StaffPayrollRun } = require("../models/staffHrModels");
const { sendMail } = require("../utils/mailer");
const {
  ensureAttendance,
  computeMonthlySummary,
  buildSalarySlipPdf,
  todayKey,
  prettyMonth,
  money,
} = require("../utils/staffService");

const roleOf = (req) => String(req.user?.role || "").toLowerCase();
const isAdmin = (req) => ["admin", "super admin"].includes(roleOf(req));
const canViewPayroll = (req) => req.permissions?.includes("payroll.view") || false;
const canEditPayroll = (req) => req.permissions?.includes("payroll.compensation") || false;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const validDay = (value) => {
  if (!DAY_RE.test(value || "")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const currentMonth = () => todayKey().slice(0, 7);
const payrollRowsForPeriod = async (month) => {
  const run = await StaffPayrollRun.findOne({ monthKey: month });
  if (!run) throw createHttpError(409, "Prepare and finalize payroll before accessing payslips or payments.");
  if (run.status !== "Finalized") {
    throw createHttpError(409, "Payslips are available only after payroll is finalized.");
  }
  const payments = await SalaryPayment.find({ monthKey: month }).lean();
  return run.items.map((item) => {
    const payment = payments.find((entry) => String(entry.staff) === String(item.staff));
    return {
      ...item.toObject(),
      staffId: item.staff,
      monthKey: month,
      baseSalary: item.baseSalary,
      earned: item.grossPay,
      payable: item.netPay,
      status: payment?.status || "Unpaid",
      paidAt: payment?.paidAt || null,
      paidBy: payment?.paidBy || "",
      advance: item.deductions.filter((entry) => entry.code === "ADVANCE").reduce((sum, entry) => sum + entry.amount, 0),
      deduction: item.deductions.filter((entry) => entry.code !== "ADVANCE").reduce((sum, entry) => sum + entry.amount, 0),
      adjustments: item.deductions.map((entry) => ({ type: entry.code, amount: entry.amount, note: entry.name })),
      present: item.presentDays,
      absent: item.absentDays,
      leave: item.paidLeaveDays + item.unpaidLeaveDays,
    };
  });
};

// Salary is Admin-only: everyone else gets the staff record without it.
const shape = (staff, req) => {
  const o = staff.toObject ? staff.toObject() : staff;
  if (!canViewPayroll(req)) {
    delete o.baseSalary;
    delete o.salaryComponents;
    delete o.salaryEffectiveFrom;
    delete o.salaryHistory;
    o.employmentHistory = (o.employmentHistory || []).map((entry) => {
      const safeEntry = { ...entry };
      if (safeEntry.changes && typeof safeEntry.changes === "object") {
        safeEntry.changes = { ...safeEntry.changes };
        delete safeEntry.changes.baseSalary;
        delete safeEntry.changes.salaryComponents;
      }
      return safeEntry;
    });
  }
  if (!req.permissions?.includes("hr.manage")) {
    ["cnic", "address", "dateOfBirth", "guardianName", "emergencyContact",
      "emergencyRelationship", "nationality", "notes"].forEach((key) => delete o[key]);
    delete o.linkedUser;
  }
  return o;
};

const getStaff = async (req, res, next) => {
  try {
    const list = await Staff.find(isAdmin(req) && req.query.all === "1" ? {} : { isActive: true })
      .populate("linkedUser", "name email status")
      .sort({ name: 1 });
    res.json({ success: true, data: list.map((s) => shape(s, req)) });
  } catch (e) {
    next(e);
  }
};

const cleanStaffBody = (b) => {
  const out = {};
  ["name", "phone", "email", "designation", "cnic", "address"].forEach((k) => {
    if (b[k] !== undefined) out[k] = String(b[k]).trim();
  });
  [
    "joinDate", "dateOfBirth", "gender", "guardianName", "emergencyContact", "emergencyRelationship",
    "nationality", "employmentType", "employmentStatus", "department", "branch",
    "probationStartDate", "probationEndDate", "confirmationDate", "contractStartDate",
    "contractEndDate", "lastWorkingDate", "paymentMethod", "notes",
  ].forEach((key) => {
    if (b[key] !== undefined) out[key] = typeof b[key] === "string" ? b[key].trim() : b[key];
  });
  [
    "joinDate", "dateOfBirth", "probationStartDate", "probationEndDate", "confirmationDate",
    "contractStartDate", "contractEndDate", "lastWorkingDate",
  ].forEach((key) => {
    if (b[key] && !validDay(String(b[key]).trim())) {
      throw createHttpError(400, `${key} must be a valid YYYY-MM-DD date.`);
    }
  });
  if (b.reportingManager !== undefined) {
    if (b.reportingManager && !validId(b.reportingManager)) {
      throw createHttpError(400, "Reporting manager must be a valid employee ID.");
    }
    out.reportingManager = b.reportingManager || null;
  }
  if (b.annualLeaveEntitlement !== undefined) out.annualLeaveEntitlement = Number(b.annualLeaveEntitlement);
  if (b.salaryComponents !== undefined) {
    if (!Array.isArray(b.salaryComponents)) throw createHttpError(400, "Salary components must be a list.");
    const componentCodes = new Set();
    out.salaryComponents = b.salaryComponents.map((component) => {
      if (!component || typeof component !== "object") {
        throw createHttpError(400, "Each salary component must be an object.");
      }
      const code = String(component.code || "").trim().toUpperCase();
      const name = String(component.name || "").trim();
      const amount = Number(component.amount);
      if (!code || !name || componentCodes.has(code)) {
        throw createHttpError(400, "Salary components need unique codes and non-empty names.");
      }
      if (!Number.isFinite(amount) || amount < 0 || !validDay(component.effectiveFrom)) {
        throw createHttpError(400, "Salary components need a non-negative amount and a valid effective date.");
      }
      if (component.effectiveTo && (!validDay(component.effectiveTo) || component.effectiveTo < component.effectiveFrom)) {
        throw createHttpError(400, "Salary component end dates must be valid and not precede the start date.");
      }
      componentCodes.add(code);
      return {
        ...component,
        code,
        name,
        amount: Math.round(amount * 100) / 100,
      };
    });
  }
  if (b.baseSalary !== undefined) {
    const salary = Number(b.baseSalary);
    if (!Number.isFinite(salary) || salary < 0) throw createHttpError(400, "Salary must be a non-negative amount.");
    out.baseSalary = Math.round(salary * 100) / 100;
  }
  if (b.isActive !== undefined) {
    if (typeof b.isActive !== "boolean") throw createHttpError(400, "Active status must be true or false.");
    out.isActive = b.isActive;
  }
  return out;
};

const addStaff = async (req, res, next) => {
  try {
    const data = cleanStaffBody(req.body);
    if (!data.name) return next(createHttpError(400, "Name is required."));
    if (!data.joinDate) data.joinDate = todayKey();
    if (req.body.effectiveAt && !validDay(req.body.effectiveAt)) {
      throw createHttpError(400, "Effective date must be a valid YYYY-MM-DD date.");
    }
    const salaryEffectiveAt = req.body.effectiveAt || data.joinDate;
    if (!canEditPayroll(req)) {
      delete data.baseSalary;
      delete data.salaryComponents;
    }
    data.employmentHistory = [{
      effectiveAt: data.joinDate,
      changes: { created: true, designation: data.designation || "", department: data.department || "" },
      reason: "Employee record created",
      changedBy: req.user._id,
    }];
    if (data.baseSalary !== undefined || data.salaryComponents?.length) {
      data.salaryEffectiveFrom = salaryEffectiveAt;
      data.salaryHistory = [{
        effectiveAt: salaryEffectiveAt,
        changes: { baseSalary: data.baseSalary || 0, salaryComponents: data.salaryComponents || [] },
        reason: "Initial salary terms",
        changedBy: req.user._id,
      }];
    }
    const staff = await Staff.create(data);
    res.status(201).json({ success: true, data: shape(staff, req) });
  } catch (e) {
    next(e);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return next(createHttpError(404, "Invalid id!"));
    const staff = await Staff.findById(req.params.id);
    if (!staff) return next(createHttpError(404, "Staff not found!"));
    const data = cleanStaffBody(req.body);
    if (!canEditPayroll(req)) {
      delete data.baseSalary;
      delete data.salaryComponents;
    }
    const before = {};
    Object.keys(data).forEach((key) => {
      if (key !== "salaryComponents" && String(staff[key] ?? "") !== String(data[key] ?? "")) {
        before[key] = { from: staff[key], to: data[key] };
      }
    });
    if (data.baseSalary !== undefined && data.baseSalary !== staff.baseSalary) {
      before.baseSalary = { from: staff.baseSalary, to: data.baseSalary };
    }
    if (
      data.salaryComponents !== undefined &&
      JSON.stringify(staff.salaryComponents || []) !== JSON.stringify(data.salaryComponents)
    ) {
      before.salaryComponents = { changed: true };
    }
    if (req.body.effectiveAt && !validDay(req.body.effectiveAt)) {
      throw createHttpError(400, "Effective date must be a valid YYYY-MM-DD date.");
    }
    const effectiveAt = req.body.effectiveAt || todayKey();
    Object.assign(staff, data);
    if (["Resigned", "Terminated", "Retired"].includes(data.employmentStatus)) {
      staff.isActive = false;
      staff.lastWorkingDate = data.lastWorkingDate || effectiveAt;
    } else if (["Active", "On Probation"].includes(data.employmentStatus)) {
      staff.isActive = true;
    }
    if (Object.keys(before).length) {
      const reason = String(req.body.reason || "").trim();
      staff.employmentHistory.push({ effectiveAt, changes: before, reason, changedBy: req.user._id });
      if (before.baseSalary || before.salaryComponents) {
        staff.salaryEffectiveFrom = effectiveAt;
        staff.salaryHistory.push({
          effectiveAt,
          changes: { baseSalary: staff.baseSalary, salaryComponents: staff.salaryComponents },
          reason,
          changedBy: req.user._id,
        });
      }
      await staff.save();
    }
    res.json({ success: true, data: shape(staff, req) });
  } catch (e) {
    next(e);
  }
};

// Staff are deactivated, never hard-deleted, so their attendance and salary
// history stays intact.
const deactivateStaff = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return next(createHttpError(404, "Invalid id!"));
    const staff = await Staff.findById(req.params.id);
    if (!staff) return next(createHttpError(404, "Staff not found!"));
    const lastWorkingDate = todayKey();
    staff.isActive = false;
    staff.employmentStatus = "Resigned";
    staff.lastWorkingDate = lastWorkingDate;
    staff.employmentHistory.push({
      effectiveAt: lastWorkingDate,
      changes: { employmentStatus: { from: "Active", to: "Resigned" }, isActive: { from: true, to: false } },
      reason: String(req.body?.reason || "Employee deactivated").trim(),
      changedBy: req.user._id,
    });
    await staff.save();
    res.json({ success: true, message: "Staff deactivated (history kept).", data: shape(staff, req) });
  } catch (e) {
    next(e);
  }
};

// ---- Attendance ----
const getAttendanceForDay = async (req, res, next) => {
  try {
    if (req.query.date && !validDay(req.query.date)) {
      return next(createHttpError(400, "Attendance date must be a valid YYYY-MM-DD date."));
    }
    const dayKey = req.query.date || todayKey();
    await ensureAttendance([dayKey]);
    const staff = await Staff.find({ isActive: true, joinDate: { $lte: dayKey } }).sort({ name: 1 });
    const rows = await StaffAttendance.find({ dayKey, staff: { $in: staff.map((s) => s._id) } });
    const byStaff = new Map(rows.map((r) => [String(r.staff), r]));
    const data = staff.map((s) => {
      const r = byStaff.get(String(s._id));
      return {
        staffId: s._id,
        name: s.name,
        designation: s.designation,
        phone: s.phone,
        dayKey,
        status: r?.status || "Present",
        auto: r ? r.auto : true,
        note: r?.note || "",
        actualCheckIn: r?.actualCheckIn || null,
        actualCheckOut: r?.actualCheckOut || null,
        breakMinutes: r?.breakMinutes || 0,
        totalWorkingHours: r?.totalWorkingHours || 0,
        markedBy: r?.markedBy?.name ? `${r.markedBy.name} (${r.markedBy.role})` : "",
      };
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

// Cashier/Admin: mark someone Absent (or back to Present / Leave).
const markAttendance = async (req, res, next) => {
  try {
    const { staffId, date, status, note } = req.body;
    if (!validId(staffId)) return next(createHttpError(400, "Invalid staff."));
    const allowedStatuses = ["Present", "Absent", "Late Arrival", "Early Departure", "Half Day", "Leave",
      "Weekly Off", "Public Holiday", "Rest Day", "Work From Home", "Official Duty"];
    if (!allowedStatuses.includes(status)) return next(createHttpError(400, "Invalid status."));
    if (date && !validDay(date)) return next(createHttpError(400, "Attendance date must be a valid YYYY-MM-DD date."));
    const dayKey = date || todayKey();
    if (dayKey > todayKey()) return next(createHttpError(400, "Can't mark attendance for a future date."));

    const staff = await Staff.findById(staffId);
    if (!staff) return next(createHttpError(404, "Staff not found!"));
    if (dayKey < staff.joinDate || (staff.lastWorkingDate && dayKey > staff.lastWorkingDate)) {
      return next(createHttpError(400, "Attendance date must fall within the employee's employment period."));
    }
    await ensureAttendance([dayKey]);
    const rec = await StaffAttendance.findOne({ staff: staffId, dayKey });
    const before = rec ? {
      status: rec.status,
      actualCheckIn: rec.actualCheckIn,
      actualCheckOut: rec.actualCheckOut,
      breakMinutes: rec.breakMinutes,
      totalWorkingHours: rec.totalWorkingHours,
      regularHours: rec.regularHours,
      overtimeHours: rec.overtimeHours,
      lateMinutes: rec.lateMinutes,
      earlyDepartureMinutes: rec.earlyDepartureMinutes,
      shiftName: rec.shiftName,
      note: rec.note,
    } : null;
    const setTime = (value, label) => {
      if (!value) return null;
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) throw createHttpError(400, `${label} must be a valid timestamp.`);
      return parsed;
    };
    const actualCheckIn = req.body.actualCheckIn === undefined
      ? rec?.actualCheckIn || null
      : setTime(req.body.actualCheckIn, "Check-in");
    const actualCheckOut = req.body.actualCheckOut === undefined
      ? rec?.actualCheckOut || null
      : setTime(req.body.actualCheckOut, "Check-out");
    let totalWorkingHours = rec?.totalWorkingHours || 0;
    let regularHours = rec?.regularHours || 0;
    let overtimeHours = rec?.overtimeHours || 0;
    if (!actualCheckIn || !actualCheckOut) {
      totalWorkingHours = 0;
      regularHours = 0;
      overtimeHours = 0;
    }
    if (actualCheckIn && actualCheckOut) {
      let checkout = actualCheckOut;
      if (checkout < actualCheckIn) checkout = new Date(checkout.getTime() + 86400000);
      const elapsedMinutes = (checkout - actualCheckIn) / 60000;
      const breakMinutes = Number(req.body.breakMinutes ?? rec?.breakMinutes ?? 0);
      if (elapsedMinutes > 1440 || breakMinutes > elapsedMinutes) {
        return next(createHttpError(400, "Check-in/out and break durations must describe at most 24 hours of work."));
      }
      const workedMinutes = elapsedMinutes - breakMinutes;
      totalWorkingHours = Math.round((workedMinutes / 60) * 100) / 100;
      const expectedHours = Number(rec?.expectedDailyHours || 8);
      if (!Number.isFinite(expectedHours) || expectedHours <= 0 || expectedHours > 24) {
        return next(createHttpError(400, "Expected daily hours must be greater than zero and no more than 24."));
      }
      regularHours = Math.min(totalWorkingHours, expectedHours);
      overtimeHours = Math.max(0, totalWorkingHours - expectedHours);
    }
    const values = {
      status,
      auto: false,
      note: String(note ?? rec?.note ?? ""),
      source: "Manual",
      actualCheckIn,
      actualCheckOut,
      breakMinutes: Number(req.body.breakMinutes ?? rec?.breakMinutes ?? 0),
      totalWorkingHours,
      regularHours,
      overtimeHours,
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      expectedDailyHours: rec?.expectedDailyHours || 8,
      gracePeriodMinutes: rec?.gracePeriodMinutes || 0,
      shift: rec?.shift || null,
      shiftName: rec?.shiftName || "",
      shiftStartTime: rec?.shiftStartTime || "",
      shiftEndTime: rec?.shiftEndTime || "",
      correctionReason: String(req.body.correctionReason || ""),
      approvedBy: req.user._id,
      approvedAt: new Date(),
      markedBy: { userId: req.user._id, name: req.user.name, role: req.user.role },
    };
    if (values.breakMinutes < 0 || !Number.isFinite(values.breakMinutes)) {
      return next(createHttpError(400, "Break duration must be a non-negative number of minutes."));
    }
    if (actualCheckIn && actualCheckOut && values.shiftStartTime && values.shiftEndTime) {
      const shiftStart = new Date(`${dayKey}T${values.shiftStartTime}:00`);
      const shiftEnd = new Date(`${dayKey}T${values.shiftEndTime}:00`);
      if (shiftEnd <= shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);
      values.lateMinutes = Math.max(0, Math.floor((actualCheckIn - shiftStart) / 60000));
      if (values.lateMinutes <= values.gracePeriodMinutes) values.lateMinutes = 0;
      values.earlyDepartureMinutes = Math.max(0, Math.floor((shiftEnd - actualCheckOut) / 60000));
      if (["Present", "Late Arrival", "Early Departure"].includes(values.status)) {
        values.status = values.lateMinutes > 0 ? "Late Arrival" :
          values.earlyDepartureMinutes > 0 ? "Early Departure" : "Present";
      }
    }
    if (rec) {
      rec.auditHistory.push({
        changedBy: req.user._id,
        reason: values.correctionReason || String(note || "Attendance updated"),
        before,
        after: {
          status: values.status,
          actualCheckIn,
          actualCheckOut,
          breakMinutes: values.breakMinutes,
          totalWorkingHours: values.totalWorkingHours,
          regularHours: values.regularHours,
          overtimeHours: values.overtimeHours,
          lateMinutes: values.lateMinutes,
          earlyDepartureMinutes: values.earlyDepartureMinutes,
          shiftName: values.shiftName,
          note: values.note,
        },
      });
      Object.assign(rec, values);
      await rec.save();
    } else {
      values.staff = staffId;
      values.dayKey = dayKey;
      values.auditHistory = [{
        changedBy: req.user._id,
        reason: values.correctionReason || String(note || "Attendance marked"),
        before: null,
        after: {
          status: values.status,
          actualCheckIn,
          actualCheckOut,
          breakMinutes: values.breakMinutes,
          totalWorkingHours: values.totalWorkingHours,
          regularHours: values.regularHours,
          overtimeHours: values.overtimeHours,
          lateMinutes: values.lateMinutes,
          earlyDepartureMinutes: values.earlyDepartureMinutes,
          shiftName: values.shiftName,
          note: values.note,
        },
      }];
    }
    const saved = rec || await StaffAttendance.create(values);
    res.json({ success: true, data: saved });
  } catch (e) {
    next(e);
  }
};

// Date-wise history for one staff member for a month.
const getAttendanceHistory = async (req, res, next) => {
  try {
    const { staffId } = req.query;
    if (req.query.month && !MONTH_RE.test(req.query.month)) {
      return next(createHttpError(400, "Month must use YYYY-MM format."));
    }
    const month = MONTH_RE.test(req.query.month || "") ? req.query.month : currentMonth();
    if (!validId(staffId)) return next(createHttpError(400, "Invalid staff."));
    const { monthDayKeys } = require("../utils/staffService");
    await ensureAttendance(monthDayKeys(month));
    const rows = await StaffAttendance.find({ staff: staffId, dayKey: { $regex: `^${month}` } }).sort({ dayKey: 1 });
    res.json({
      success: true,
      data: rows.map((r) => ({
        dayKey: r.dayKey,
        status: r.status,
        auto: r.auto,
        note: r.note,
        markedBy: r.markedBy?.name ? `${r.markedBy.name} (${r.markedBy.role})` : "",
      })),
    });
  } catch (e) {
    next(e);
  }
};

// Monthly summary. Admin sees everything incl. money; Cashier only gets
// Present/Absent counts.
const getMonthlySummary = async (req, res, next) => {
  try {
    if (req.query.month && !MONTH_RE.test(req.query.month)) {
      return next(createHttpError(400, "Month must use YYYY-MM format."));
    }
    const month = MONTH_RE.test(req.query.month || "") ? req.query.month : currentMonth();
    const run = await StaffPayrollRun.findOne({ monthKey: month });
    const rows = run?.status === "Finalized"
      ? await payrollRowsForPeriod(month)
      : await computeMonthlySummary(month);
    const data = canViewPayroll(req)
      ? rows
      : rows.map((r) => ({
          staffId: r.staffId,
          name: r.name,
          designation: r.designation,
          monthKey: r.monthKey,
          daysInMonth: r.daysInMonth,
          present: r.present,
          absent: r.absent,
          leave: r.leave,
        }));
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

// ---- Salary (Admin only via routes) ----
const addAdjustment = async (req, res, next) => {
  try {
    const { staffId, type, amount, date, note } = req.body;
    if (!validId(staffId)) return next(createHttpError(400, "Invalid staff."));
    if (!["Advance", "Deduction"].includes(type)) return next(createHttpError(400, "Type must be Advance or Deduction."));
    const amt = Number(amount);
    if (!Number.isFinite(amt) || !(amt > 0)) return next(createHttpError(400, "Enter a valid amount greater than 0."));
    if (date && !validDay(date)) return next(createHttpError(400, "Adjustment date must be a valid YYYY-MM-DD date."));
    const dayKey = date || todayKey();
    const payrollRun = await StaffPayrollRun.findOne({ monthKey: dayKey.slice(0, 7) });
    if (payrollRun && payrollRun.status !== "Draft") {
      throw createHttpError(409, "Payroll adjustments are locked after submission for approval.");
    }
    const adj = await StaffAdjustment.create({
      staff: staffId,
      type,
      amount: Math.round(amt * 100) / 100,
      dayKey,
      monthKey: dayKey.slice(0, 7),
      note: String(note || ""),
      createdBy: req.user.name,
      createdByUser: req.user._id,
    });
    res.status(201).json({ success: true, data: adj });
  } catch (e) {
    next(e);
  }
};

const deleteAdjustment = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return next(createHttpError(404, "Invalid id!"));
    const adjustment = await StaffAdjustment.findById(req.params.id);
    if (!adjustment) return next(createHttpError(404, "Adjustment not found."));
    if (adjustment.isVoided) return next(createHttpError(409, "Adjustment is already voided."));
    const payrollRun = await StaffPayrollRun.findOne({ monthKey: adjustment.monthKey });
    if (payrollRun && payrollRun.status !== "Draft") {
      throw createHttpError(409, "Payroll adjustments are locked after submission for approval.");
    }
    adjustment.isVoided = true;
    adjustment.voidedAt = new Date();
    adjustment.voidedBy = req.user._id;
    adjustment.voidReason = String(req.body?.reason || "Voided by an authorized payroll user").trim();
    await adjustment.save();
    res.json({ success: true, data: adjustment });
  } catch (e) {
    next(e);
  }
};

const emailSlip = async (row, actor) => {
  if (!row.email) return { skipped: true, reason: "No email on file" };
  const pdf = await buildSalarySlipPdf(row);
  const result = await sendMail({
    to: row.email,
    subject: `Your salary slip — ${prettyMonth(row.monthKey)} — GenZ Pizza Land`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px">
      <h2>Salary slip — ${prettyMonth(row.monthKey)}</h2>
      <p>Hi ${row.name}, your salary slip is attached.</p>
      <p><strong>Net salary payable:</strong> ${money(row.payable)} (${row.status})</p>
      <p style="color:#888;font-size:12px">GenZ Pizza Land</p></div>`,
    attachments: [{ filename: `salary-slip-${row.name.replace(/\s+/g, "_")}-${row.monthKey}.pdf`, content: pdf, contentType: "application/pdf" }],
  });
  if (result?.skipped) return { skipped: true, reason: "Email (SMTP) is not configured on the server" };
  await SalaryPayment.findOneAndUpdate(
    { staff: row.staffId, monthKey: row.monthKey },
    {
      $set: { slipEmailedAt: new Date() },
      $push: {
        auditHistory: {
          actor,
          action: "Payslip emailed",
          after: { email: row.email },
        },
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
  return { sent: true };
};

const setSalaryPaid = async (req, res, next) => {
  try {
    const { staffId, month, paid, sendSlip } = req.body;
    if (!validId(staffId) || !MONTH_RE.test(month || "")) return next(createHttpError(400, "Invalid staff or month."));
    const payrollRun = await StaffPayrollRun.findOne({ monthKey: month });
    if (!payrollRun || payrollRun.status !== "Finalized") {
      throw createHttpError(409, "Finalize the payroll run before marking salary payments.");
    }
    if (!paid) {
      throw createHttpError(409, "Finalized payroll payments cannot be silently reversed. Record a controlled correction.");
    }
    const rows = await payrollRowsForPeriod(month);
    const row = rows.find((r) => String(r.staffId) === String(staffId));
    if (!row) return next(createHttpError(404, "Staff not found!"));

    const previousPayment = await SalaryPayment.findOne({ staff: staffId, monthKey: month }).lean();
    const rec = await SalaryPayment.findOneAndUpdate(
      { staff: staffId, monthKey: month },
      {
        $set: paid
          ? { status: "Paid", paymentStatus: "Paid", amountPaid: row.payable, paidAt: new Date(), paidBy: req.user.name }
          : { status: "Unpaid", paymentStatus: "Draft", amountPaid: 0, paidAt: null, paidBy: "" },
        $push: {
          auditHistory: {
            actor: req.user._id,
            action: "Legacy salary payment updated",
            before: previousPayment ? { status: previousPayment.status, amountPaid: previousPayment.amountPaid } : null,
            after: { status: paid ? "Paid" : "Unpaid", amountPaid: paid ? row.payable : 0 },
          },
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    let slip = null;
    if (paid && sendSlip !== false) {
      try {
        slip = await emailSlip({ ...row, status: "Paid", paidAt: rec.paidAt }, req.user._id);
      } catch (e) {
        slip = { error: e.message };
      }
    }
    res.json({ success: true, data: rec, slip });
  } catch (e) {
    next(e);
  }
};

const sendSlips = async (req, res, next) => {
  try {
    const { month, staffId } = req.body;
    if (!MONTH_RE.test(month || "")) return next(createHttpError(400, "Invalid month."));
    const rows = (await payrollRowsForPeriod(month)).filter((r) => !staffId || String(r.staffId) === String(staffId));
    const results = [];
    for (const row of rows) {
      try {
        results.push({ name: row.name, ...(await emailSlip(row, req.user._id)) });
      } catch (e) {
        results.push({ name: row.name, error: e.message });
      }
    }
    res.json({ success: true, data: results });
  } catch (e) {
    next(e);
  }
};

// Download one slip as PDF (Admin).
const downloadSlip = async (req, res, next) => {
  try {
    const { staffId, month } = req.query;
    const rows = await payrollRowsForPeriod(MONTH_RE.test(month || "") ? month : currentMonth());
    const row = rows.find((r) => String(r.staffId) === String(staffId));
    if (!row) return next(createHttpError(404, "Staff not found!"));
    const pdf = await buildSalarySlipPdf(row);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="salary-slip-${row.name.replace(/\s+/g, "_")}-${row.monthKey}.pdf"`);
    res.send(pdf);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getStaff, addStaff, updateStaff, deactivateStaff,
  getAttendanceForDay, markAttendance, getAttendanceHistory, getMonthlySummary,
  addAdjustment, deleteAdjustment, setSalaryPaid, sendSlips, downloadSlip,
};
