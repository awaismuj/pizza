const createHttpError = require("http-errors");
const ReportLog = require("../models/reportLogModel");
const { todayKey } = require("../utils/profitService");
const { collectReportData, buildReportPdfBuffer } = require("../utils/reportPdf");
const { sendMail } = require("../utils/mailer");

const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY_RE = /^\d{4}-\d{2}$/;

const monthLabel = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

// Works out (fromKey, toKey, rangeLabel) from the query params for all three
// modes the dashboard offers: today / a picked range / a whole month.
const resolveRange = (query) => {
  if (query.scope === "month") {
    const monthKey = MONTH_KEY_RE.test(query.month) ? query.month : null;
    if (!monthKey) throw createHttpError(400, "Provide a valid month (YYYY-MM).");
    const [y, m] = monthKey.split("-").map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    const pad2 = (n) => String(n).padStart(2, "0");
    return { fromKey: `${monthKey}-01`, toKey: `${monthKey}-${pad2(lastDay)}`, rangeLabel: monthLabel(monthKey) };
  }

  if (query.scope === "range") {
    const { from, to } = query;
    if (!DAY_KEY_RE.test(from) || !DAY_KEY_RE.test(to)) {
      throw createHttpError(400, "Provide valid from/to dates (YYYY-MM-DD).");
    }
    if (from > to) throw createHttpError(400, "'from' date must not be after 'to' date.");
    const label = from === to ? from : `${from} to ${to}`;
    return { fromKey: from, toKey: to, rangeLabel: label };
  }

  // Default / scope=today
  const day = todayKey();
  return { fromKey: day, toKey: day, rangeLabel: `Today — ${day}` };
};

const generatePdfBuffer = async (query) => {
  const { fromKey, toKey, rangeLabel } = resolveRange(query);
  const { days, totals, deletedOrders } = await collectReportData(fromKey, toKey);
  const buffer = await buildReportPdfBuffer({ rangeLabel, days, totals, deletedOrders });
  return { buffer, fromKey, toKey, rangeLabel };
};

// GET /api/report/download?scope=today|range|month&from=&to=&month=
const downloadReport = async (req, res, next) => {
  try {
    const { buffer, fromKey, toKey } = await generatePdfBuffer(req.query);
    const filename = fromKey === toKey ? `report-${fromKey}.pdf` : `report-${fromKey}_to_${toKey}.pdf`;

    // A manual download of a single day counts as that day being "handled"
    // for the auto-send job, same as sending it over WhatsApp does.
    if (fromKey === toKey) {
      await ReportLog.findOneAndUpdate(
        { dayKey: fromKey },
        { dayKey: fromKey, sentBy: "manual", channel: "download-only", sentAt: new Date() },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/report/send-email  { scope, from, to, month, email }
const sendReportToEmail = async (req, res, next) => {
  try {
    const email = req.body?.email;
    if (!email || !EMAIL_RE.test(email)) {
      return next(createHttpError(400, "Provide a valid email address."));
    }

    const { buffer, fromKey, toKey, rangeLabel } = await generatePdfBuffer(req.body);
    const filename = fromKey === toKey ? `report-${fromKey}.pdf` : `report-${fromKey}_to_${toKey}.pdf`;

    const result = await sendMail({
      to: email,
      subject: `GenZ Pizza Land — Profit & Expense Report (${rangeLabel})`,
      html: `<p>Attached: the profit & expense report for <strong>${rangeLabel}</strong>.</p>`,
      attachments: [{ filename, content: buffer, contentType: "application/pdf" }],
    });

    if (result?.skipped) {
      return next(
        createHttpError(502, "Email isn't configured on the server yet — set SMTP_HOST/SMTP_USER/SMTP_PASS in .env.")
      );
    }

    if (fromKey === toKey) {
      await ReportLog.findOneAndUpdate(
        { dayKey: fromKey },
        { dayKey: fromKey, sentBy: "manual", channel: "download-only", sentAt: new Date() },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.status(200).json({ success: true, message: `Report emailed to ${email}.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  downloadReport,
  sendReportToEmail,
};
