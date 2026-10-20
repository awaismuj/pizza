const PDFDocument = require("pdfkit");
const Staff = require("../models/staffModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const { StaffAdjustment, SalaryPayment } = require("../models/staffPayrollModels");

const pad2 = (n) => String(n).padStart(2, "0");
const dayKeyFor = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const todayKey = () => dayKeyFor(new Date());
const money = (n) => `Rs ${Number(n || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

const daysInMonth = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m, 0).getDate();
};
const monthDayKeys = (monthKey) =>
  Array.from({ length: daysInMonth(monthKey) }, (_, i) => `${monthKey}-${pad2(i + 1)}`);

const prettyMonth = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

// Auto-marks every active staff member Present for each given day (never in
// the future, never before their join date) that has no record yet. Existing
// rows — e.g. an Absent set by the cashier — are never touched.
const ensureAttendance = async (dayKeys) => {
  const today = todayKey();
  const days = dayKeys.filter((k) => k <= today);
  if (days.length === 0) return;

  const staff = await Staff.find({ isActive: true }).select("_id joinDate");
  if (staff.length === 0) return;

  const existing = await StaffAttendance.find({
    dayKey: { $in: days },
    staff: { $in: staff.map((s) => s._id) },
  }).select("staff dayKey");
  const have = new Set(existing.map((e) => `${e.staff}|${e.dayKey}`));

  const toCreate = [];
  for (const s of staff) {
    for (const dayKey of days) {
      if (dayKey < s.joinDate) continue;
      if (!have.has(`${s._id}|${dayKey}`)) {
        toCreate.push({ staff: s._id, dayKey, status: "Present", auto: true });
      }
    }
  }
  if (toCreate.length > 0) {
    // Unique index makes concurrent runs safe; duplicates are just skipped.
    await StaffAttendance.insertMany(toCreate, { ordered: false }).catch(() => {});
  }
};

// Monthly totals + salary payable for every active staff member.
// payable = (base, pro-rated if they joined mid-month)
//           - absent days x per-day rate - advances - other deductions.
const computeMonthlySummary = async (monthKey) => {
  await ensureAttendance(monthDayKeys(monthKey));

  const [staff, attendance, adjustments, payments] = await Promise.all([
    Staff.find({ isActive: true }).sort({ name: 1 }),
    StaffAttendance.find({ dayKey: { $regex: `^${monthKey}` } }),
    StaffAdjustment.find({ monthKey }),
    SalaryPayment.find({ monthKey }),
  ]);

  const total = daysInMonth(monthKey);
  const monthStart = `${monthKey}-01`;

  return staff.map((s) => {
    const rows = attendance.filter((a) => String(a.staff) === String(s._id));
    const present = rows.filter((r) => r.status === "Present").length;
    const absent = rows.filter((r) => r.status === "Absent").length;
    const leave = rows.filter((r) => r.status === "Leave").length;
    const adjs = adjustments.filter((a) => String(a.staff) === String(s._id));
    const advance = adjs.filter((a) => a.type === "Advance").reduce((t, a) => t + a.amount, 0);
    const deduction = adjs.filter((a) => a.type === "Deduction").reduce((t, a) => t + a.amount, 0);

    const startDay = s.joinDate > monthStart ? Number(s.joinDate.slice(8, 10)) : 1;
    const joinedAfterMonth = s.joinDate > `${monthKey}-${pad2(total)}`;
    const payableDays = joinedAfterMonth ? 0 : total - (startDay - 1);
    const perDay = s.baseSalary / total;
    const earned = perDay * payableDays;
    const absentDeduction = perDay * absent;
    const payable = Math.max(0, Math.round(earned - absentDeduction - advance - deduction));
    const payment = payments.find((p) => String(p.staff) === String(s._id));

    return {
      staffId: s._id,
      name: s.name,
      designation: s.designation,
      email: s.email,
      phone: s.phone,
      baseSalary: s.baseSalary,
      monthKey,
      daysInMonth: total,
      present,
      absent,
      leave,
      advance,
      deduction,
      perDay: Math.round(perDay),
      earned: Math.round(earned),
      absentDeduction: Math.round(absentDeduction),
      payable,
      status: payment?.status || "Unpaid",
      paidAt: payment?.paidAt || null,
      paidBy: payment?.paidBy || "",
      slipEmailedAt: payment?.slipEmailedAt || null,
      adjustments: adjs.map((a) => ({ _id: a._id, type: a.type, amount: a.amount, dayKey: a.dayKey, note: a.note })),
    };
  });
};

const buildSalarySlipPdf = (row, businessName = "GenZ Pizza Land") =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.rect(0, 0, 595, 90).fill("#1f1f1f");
      doc.fillColor("#fff").fontSize(20).text(businessName, 40, 28);
      doc.fontSize(11).fillColor("#f0b429").text(`Salary Slip — ${prettyMonth(row.monthKey)}`, 40, 56);

      doc.fillColor("#1a1a1a").fontSize(11);
      let y = 115;
      const line = (label, value) => {
        doc.fillColor("#777").fontSize(9).text(label, 40, y);
        doc.fillColor("#1a1a1a").fontSize(11).text(String(value || "-"), 170, y - 1);
        y += 20;
      };
      line("Employee", row.name);
      line("Designation", row.designation);
      line("Phone", row.phone);
      line("Salary status", row.status + (row.paidAt ? ` (${new Date(row.paidAt).toLocaleDateString("en-GB")})` : ""));

      y += 8;
      doc.fontSize(12).fillColor("#1a1a1a").text("Attendance", 40, y);
      y += 20;
      const boxes = [
        ["Present", row.present, "#0a7a2f"],
        ["Absent", row.absent, "#a01f1f"],
        ["Leave", row.leave, "#8a6d00"],
        ["Days in month", row.daysInMonth, "#444"],
      ];
      boxes.forEach(([label, val, color], i) => {
        const x = 40 + i * 130;
        doc.roundedRect(x, y, 122, 46, 4).strokeColor("#ddd").stroke();
        doc.fillColor("#777").fontSize(8).text(label, x + 10, y + 8);
        doc.fillColor(color).fontSize(16).text(String(val), x + 10, y + 21);
      });
      y += 68;

      doc.fontSize(12).fillColor("#1a1a1a").text("Earnings & Deductions", 40, y);
      y += 22;
      const rows = [
        ["Monthly base salary", money(row.baseSalary), false],
        ["Earned for the month", money(row.earned), false],
        [`Absent deduction (${row.absent} day${row.absent === 1 ? "" : "s"} x ${money(row.perDay)})`, `- ${money(row.absentDeduction)}`, false],
        ["Advance taken", `- ${money(row.advance)}`, false],
        ["Other deductions", `- ${money(row.deduction)}`, false],
      ];
      rows.forEach(([label, value]) => {
        doc.fillColor("#333").fontSize(10).text(label, 40, y);
        doc.text(value, 400, y, { width: 155, align: "right" });
        doc.moveTo(40, y + 16).lineTo(555, y + 16).strokeColor("#eee").stroke();
        y += 24;
      });
      y += 6;
      doc.roundedRect(40, y, 515, 40, 4).fill("#0a7a2f");
      doc.fillColor("#fff").fontSize(12).text("NET SALARY PAYABLE", 54, y + 13);
      doc.fontSize(16).text(money(row.payable), 340, y + 10, { width: 200, align: "right" });

      if (row.adjustments?.length) {
        y += 62;
        doc.fillColor("#1a1a1a").fontSize(11).text("Advance / deduction details", 40, y);
        y += 18;
        row.adjustments.forEach((a) => {
          doc.fillColor("#555").fontSize(9).text(`${a.dayKey}  ${a.type}  ${money(a.amount)}${a.note ? " — " + a.note : ""}`, 40, y);
          y += 14;
        });
      }

      doc.fillColor("#aaa").fontSize(8).text(`Generated ${new Date().toLocaleString("en-GB")} — computer-generated slip.`, 40, 780, { align: "center", width: 515 });
      doc.end();
    } catch (e) {
      reject(e);
    }
  });

module.exports = { ensureAttendance, computeMonthlySummary, buildSalarySlipPdf, todayKey, dayKeyFor, monthDayKeys, prettyMonth, money };
