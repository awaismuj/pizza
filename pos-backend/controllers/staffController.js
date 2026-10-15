const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Staff = require("../models/staffModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const { StaffAdjustment, SalaryPayment } = require("../models/staffPayrollModels");
const { sendMail } = require("../utils/mailer");
const {
  ensureAttendance,
  computeMonthlySummary,
  buildSalarySlipPdf,
  todayKey,
  prettyMonth,
  money,
} = require("../utils/staffService");

const isAdmin = (req) => String(req.user?.role || "").toLowerCase() === "admin";
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const currentMonth = () => todayKey().slice(0, 7);

// Salary is Admin-only: everyone else gets the staff record without it.
const shape = (staff, req) => {
  const o = staff.toObject ? staff.toObject() : staff;
  if (!isAdmin(req)) delete o.baseSalary;
  return o;
};

const getStaff = async (req, res, next) => {
  try {
    const list = await Staff.find(isAdmin(req) && req.query.all === "1" ? {} : { isActive: true }).sort({ name: 1 });
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
  if (b.joinDate !== undefined) out.joinDate = b.joinDate;
  if (b.baseSalary !== undefined) out.baseSalary = Math.max(0, Number(b.baseSalary) || 0);
  if (b.isActive !== undefined) out.isActive = !!b.isActive;
  return out;
};

const addStaff = async (req, res, next) => {
  try {
    const data = cleanStaffBody(req.body);
    if (!data.name) return next(createHttpError(400, "Name is required."));
    if (!DAY_RE.test(data.joinDate || "")) data.joinDate = todayKey();
    const staff = await Staff.create(data);
    res.status(201).json({ success: true, data: staff });
  } catch (e) {
    next(e);
  }
};

const updateStaff = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return next(createHttpError(404, "Invalid id!"));
    const staff = await Staff.findByIdAndUpdate(req.params.id, cleanStaffBody(req.body), { new: true });
    if (!staff) return next(createHttpError(404, "Staff not found!"));
    res.json({ success: true, data: staff });
  } catch (e) {
    next(e);
  }
};

// Staff are deactivated, never hard-deleted, so their attendance and salary
// history stays intact.
const deactivateStaff = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return next(createHttpError(404, "Invalid id!"));
    const staff = await Staff.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!staff) return next(createHttpError(404, "Staff not found!"));
    res.json({ success: true, message: "Staff deactivated (history kept).", data: staff });
  } catch (e) {
    next(e);
  }
};

// ---- Attendance ----
const getAttendanceForDay = async (req, res, next) => {
  try {
    const dayKey = DAY_RE.test(req.query.date || "") ? req.query.date : todayKey();
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
    if (!["Present", "Absent", "Leave"].includes(status)) return next(createHttpError(400, "Invalid status."));
    const dayKey = DAY_RE.test(date || "") ? date : todayKey();
    if (dayKey > todayKey()) return next(createHttpError(400, "Can't mark attendance for a future date."));

    const staff = await Staff.findById(staffId);
    if (!staff) return next(createHttpError(404, "Staff not found!"));

    const rec = await StaffAttendance.findOneAndUpdate(
      { staff: staffId, dayKey },
      {
        status,
        auto: false,
        note: String(note || ""),
        markedBy: { userId: req.user._id, name: req.user.name, role: req.user.role },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: rec });
  } catch (e) {
    next(e);
  }
};

// Date-wise history for one staff member for a month.
const getAttendanceHistory = async (req, res, next) => {
  try {
    const { staffId } = req.query;
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
    const month = MONTH_RE.test(req.query.month || "") ? req.query.month : currentMonth();
    const rows = await computeMonthlySummary(month);
    const data = isAdmin(req)
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
    if (!(amt > 0)) return next(createHttpError(400, "Enter an amount greater than 0."));
    const dayKey = DAY_RE.test(date || "") ? date : todayKey();
    const adj = await StaffAdjustment.create({
      staff: staffId,
      type,
      amount: amt,
      dayKey,
      monthKey: dayKey.slice(0, 7),
      note: String(note || ""),
      createdBy: req.user.name,
    });
    res.status(201).json({ success: true, data: adj });
  } catch (e) {
    next(e);
  }
};

const deleteAdjustment = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return next(createHttpError(404, "Invalid id!"));
    await StaffAdjustment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const emailSlip = async (row) => {
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
    { slipEmailedAt: new Date() },
    { upsert: true, setDefaultsOnInsert: true }
  );
  return { sent: true };
};

const setSalaryPaid = async (req, res, next) => {
  try {
    const { staffId, month, paid, sendSlip } = req.body;
    if (!validId(staffId) || !MONTH_RE.test(month || "")) return next(createHttpError(400, "Invalid staff or month."));
    const rows = await computeMonthlySummary(month);
    const row = rows.find((r) => String(r.staffId) === String(staffId));
    if (!row) return next(createHttpError(404, "Staff not found!"));

    const rec = await SalaryPayment.findOneAndUpdate(
      { staff: staffId, monthKey: month },
      paid
        ? { status: "Paid", amountPaid: row.payable, paidAt: new Date(), paidBy: req.user.name }
        : { status: "Unpaid", amountPaid: 0, paidAt: null, paidBy: "" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    let slip = null;
    if (paid && sendSlip !== false) {
      try {
        slip = await emailSlip({ ...row, status: "Paid", paidAt: rec.paidAt });
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
    const rows = (await computeMonthlySummary(month)).filter((r) => !staffId || String(r.staffId) === String(staffId));
    const results = [];
    for (const row of rows) {
      try {
        results.push({ name: row.name, ...(await emailSlip(row)) });
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
    const rows = await computeMonthlySummary(MONTH_RE.test(month || "") ? month : currentMonth());
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
