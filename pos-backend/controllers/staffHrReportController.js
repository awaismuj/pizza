const createHttpError = require("http-errors");
const PDFDocument = require("pdfkit");
const Staff = require("../models/staffModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const { StaffLeaveRequest, StaffOvertime, StaffPayrollRun } = require("../models/staffHrModels");
const { SalaryPayment } = require("../models/staffPayrollModels");
const StaffHrReportAudit = require("../models/staffHrReportAuditModel");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const REPORT_TYPES = ["employees", "attendance", "leave", "overtime", "payroll", "payments"];
const toDate = (value, fallback) => {
  const date = value || fallback;
  if (!DATE_RE.test(date)) throw createHttpError(400, "Report dates must use YYYY-MM-DD.");
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw createHttpError(400, "Report dates must be valid calendar dates.");
  }
  return date;
};
const escapeXml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");
const csvCell = (value) => {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

const staffFilterFor = (query) => {
  const filter = {};
  if (query.department) filter.department = String(query.department).trim();
  if (query.branch) filter.branch = String(query.branch).trim();
  if (query.employmentStatus) filter.employmentStatus = String(query.employmentStatus).trim();
  return filter;
};
const populatedStaff = (row) => row.staff && typeof row.staff === "object"
  ? row.staff
  : { _id: row.staff, name: "", employeeId: "", department: "", branch: "" };

const buildRows = async (req, range) => {
  const type = String(req.query.type || "");
  if (!REPORT_TYPES.includes(type)) throw createHttpError(400, "Choose a supported HR report type.");
  const staffFilter = staffFilterFor(req.query);
  const status = req.query.status ? String(req.query.status) : null;

  if (type === "employees") {
    const filter = { ...staffFilter, joinDate: { $gte: range.from, $lte: range.to } };
    if (status) filter.employmentStatus = status;
    const employees = await Staff.find(filter).sort({ name: 1 }).limit(20001).lean();
    if (employees.length > 20000) throw createHttpError(413, "Employee report exceeds 20,000 rows; narrow the filters.");
    return employees.map((person) => ({
      employeeId: person.employeeId,
      name: person.name,
      designation: person.designation,
      department: person.department,
      branch: person.branch,
      employmentType: person.employmentType,
      employmentStatus: person.employmentStatus,
      joinDate: person.joinDate,
      contractEndDate: person.contractEndDate,
    }));
  }

  const matchedStaff = await Staff.find(staffFilter).select("_id").lean();
  const staffIds = matchedStaff.map((person) => person._id);

  if (type === "attendance") {
    const filter = { staff: { $in: staffIds }, dayKey: { $gte: range.from, $lte: range.to } };
    if (status) filter.status = status;
    const rows = await StaffAttendance.find(filter)
      .populate("staff", "employeeId name department branch")
      .sort({ dayKey: -1 })
      .limit(20001)
      .lean();
    if (rows.length > 20000) throw createHttpError(413, "Attendance report exceeds 20,000 rows; narrow the filters.");
    return rows.map((row) => {
      const person = populatedStaff(row);
      return {
        date: row.dayKey,
        employeeId: person.employeeId,
        name: person.name,
        department: person.department,
        branch: person.branch,
        status: row.status,
        shift: row.shiftName,
        checkIn: row.actualCheckIn || "",
        checkOut: row.actualCheckOut || "",
        hours: row.totalWorkingHours,
        overtimeHours: row.overtimeHours,
      };
    });
  }

  if (type === "leave") {
    const filter = { staff: { $in: staffIds }, startDate: { $lte: range.to }, endDate: { $gte: range.from } };
    if (status) filter.status = status;
    const rows = await StaffLeaveRequest.find(filter)
      .populate("staff", "employeeId name department branch")
      .populate("leaveType", "name paid")
      .sort({ startDate: -1 })
      .limit(10001)
      .lean();
    if (rows.length > 10000) throw createHttpError(413, "Leave report exceeds 10,000 rows; narrow the filters.");
    return rows.map((row) => {
      const person = populatedStaff(row);
      return {
        employeeId: person.employeeId,
        name: person.name,
        department: person.department,
        branch: person.branch,
        leaveType: row.leaveType?.name || "",
        paid: row.leaveType?.paid ? "Yes" : "No",
        startDate: row.startDate,
        endDate: row.endDate,
        partialDay: row.partialDay ? "Yes" : "No",
        status: row.status,
        reason: row.reason,
        reviewNote: row.reviewNote,
      };
    });
  }

  if (type === "overtime") {
    const filter = { staff: { $in: staffIds }, date: { $gte: range.from, $lte: range.to } };
    if (status) filter.status = status;
    const rows = await StaffOvertime.find(filter)
      .populate("staff", "employeeId name department branch")
      .sort({ date: -1 })
      .limit(10001)
      .lean();
    if (rows.length > 10000) throw createHttpError(413, "Overtime report exceeds 10,000 rows; narrow the filters.");
    return rows.map((row) => {
      const person = populatedStaff(row);
      return {
        date: row.date,
        employeeId: person.employeeId,
        name: person.name,
        department: person.department,
        branch: person.branch,
        kind: row.kind,
        hoursRequested: row.hoursRequested,
        hoursApproved: row.hoursApproved,
        hourlyRate: row.hourlyRate,
        rateMultiplier: row.rateMultiplier,
        status: row.status,
      };
    });
  }

  if (!req.permissions?.some((permission) => ["hr.view", "payroll.view", "reports.view"].includes(permission))) {
    throw createHttpError(403, "Only payroll-authorized users can access payroll reports.");
  }
  if (!MONTH_RE.test(range.from.slice(0, 7)) || !MONTH_RE.test(range.to.slice(0, 7))) {
    throw createHttpError(400, "Payroll report dates must form valid YYYY-MM months.");
  }
  const fromMonth = range.from.slice(0, 7);
  const toMonth = range.to.slice(0, 7);
  const runs = await StaffPayrollRun.find({ monthKey: { $gte: fromMonth, $lte: toMonth } })
    .sort({ monthKey: -1 })
    .limit(61)
    .lean();
  if (runs.length > 60) throw createHttpError(413, "Payroll reports are limited to 60 months; narrow the date range.");
  const selectedStaff = new Set(staffIds.map(String));
  const payments = type === "payments"
    ? await SalaryPayment.find({ monthKey: { $gte: fromMonth, $lte: toMonth }, staff: { $in: staffIds } }).lean()
    : [];
  const paymentMap = new Map(payments.map((payment) => [`${payment.monthKey}:${payment.staff}`, payment]));
  const rows = [];
  for (const run of runs) {
    for (const item of run.items) {
      if (!selectedStaff.has(String(item.staff))) continue;
      if (status && (type === "payroll" ? run.status : (paymentMap.get(`${run.monthKey}:${item.staff}`)?.paymentStatus || "Unpaid")) !== status) continue;
      const common = {
        month: run.monthKey,
        employeeId: item.employeeId,
        name: item.name,
        department: item.department,
        designation: item.designation,
      };
      if (type === "payroll") {
        rows.push({
          ...common,
          runStatus: run.status,
          grossPay: item.grossPay,
          deductions: item.totalDeductions,
          employerContributions: (item.employerContributions || []).reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
          netPay: item.netPay,
          currency: run.currency,
        });
      } else {
        const payment = paymentMap.get(`${run.monthKey}:${item.staff}`);
        rows.push({
          ...common,
          paymentStatus: payment?.paymentStatus || "Unpaid",
          paymentMethod: payment?.paymentMethod || "",
          amountPaid: payment?.amountPaid || 0,
          paidAt: payment?.paidAt || "",
          reference: payment?.transactionReference || "",
          currency: run.currency,
        });
      }
    }
  }
  return rows;
};

const getRange = (query) => {
  const today = new Date().toISOString().slice(0, 10);
  const defaultFrom = `${today.slice(0, 7)}-01`;
  const from = toDate(query.from, defaultFrom);
  const to = toDate(query.to, today);
  if (from > to) throw createHttpError(400, "The report start date must not be after its end date.");
  return { from, to };
};

const renderSpreadsheet = (rows) => {
  const columns = rows.length ? Object.keys(rows[0]) : ["No data"];
  const cell = (value) => {
    const type = typeof value === "number" && Number.isFinite(value) ? "Number" : "String";
    return `<Cell><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
  };
  const header = `<Row>${columns.map(cell).join("")}</Row>`;
  const body = rows.map((row) => `<Row>${columns.map((column) => cell(row[column])).join("")}</Row>`).join("");
  return `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="HR Report"><Table>${header}${body}</Table></Worksheet></Workbook>`;
};

const renderPdf = (rows, reportType) => new Promise((resolve, reject) => {
  const pdf = new PDFDocument({ size: "A4", layout: "landscape", margin: 30, bufferPages: true });
  const chunks = [];
  pdf.on("data", (chunk) => chunks.push(chunk));
  pdf.on("end", () => resolve(Buffer.concat(chunks)));
  pdf.on("error", reject);
  pdf.fontSize(15).text(`HR ${reportType} report`, { continued: false });
  pdf.fontSize(8).fillColor("#555").text(`Generated ${new Date().toISOString()}`);
  pdf.moveDown();
  for (const row of rows) {
    const line = Object.entries(row).map(([key, value]) => `${key}: ${String(value ?? "")}`).join("  |  ");
    pdf.fontSize(7).fillColor("#111").text(line, { width: 780 });
    if (pdf.y > 520) pdf.addPage();
  }
  if (!rows.length) pdf.fontSize(10).text("No records matched these filters.");
  pdf.end();
});

const getStaffHrReport = async (req, res, next) => {
  try {
    const range = getRange(req.query);
    const rows = await buildRows(req, range);
    res.json({ success: true, data: { type: req.query.type, range, count: rows.length, rows } });
  } catch (error) {
    next(error);
  }
};

const exportStaffHrReport = async (req, res, next) => {
  try {
    const format = String(req.query.format || "").toLowerCase();
    if (!["csv", "xls", "pdf"].includes(format)) throw createHttpError(400, "Choose CSV, Excel, or PDF format.");
    const range = getRange(req.query);
    const reportType = String(req.query.type || "");
    const rows = await buildRows(req, range);
    await StaffHrReportAudit.create({
      reportType,
      format,
      filters: { ...req.query, from: range.from, to: range.to },
      rowCount: rows.length,
      requestedBy: req.user._id,
    });
    const filename = `hr-${reportType}-${range.from}-${range.to}`;
    if (format === "csv") {
      const columns = rows.length ? Object.keys(rows[0]) : [];
      const csv = [columns.map(csvCell).join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\r\n");
      res.set({ "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}.csv"`, "Cache-Control": "private, no-store" });
      return res.send(`\uFEFF${csv}`);
    }
    if (format === "xls") {
      res.set({ "Content-Type": "application/vnd.ms-excel; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}.xls"`, "Cache-Control": "private, no-store" });
      return res.send(renderSpreadsheet(rows));
    }
    const pdf = await renderPdf(rows, reportType);
    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}.pdf"`, "Cache-Control": "private, no-store" });
    return res.send(pdf);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStaffHrReport, exportStaffHrReport };
