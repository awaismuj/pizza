// Checks the clock once a minute (same lightweight approach as
// dailyProfitScheduler.js — no extra cron dependency needed). Shortly after
// midnight it looks at the day that just ended: if nobody clicked "Send to
// WhatsApp" or "Download" for that day already, it builds the report PDF
// itself and sends it to WHATSAPP_TARGET_NUMBER automatically.
const config = require("../config/config");
const ReportLog = require("../models/reportLogModel");
const { collectReportData, buildReportPdfBuffer } = require("../utils/reportPdf");
const whatsappService = require("../services/whatsappService");

const CHECK_INTERVAL_MS = 60 * 1000;
const pad2 = (n) => String(n).padStart(2, "0");

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const sendIfDue = async () => {
  if (!config.whatsapp.autoSendEnabled) return;

  const now = new Date();
  if (now.getHours() !== config.whatsapp.autoSendHour || now.getMinutes() !== config.whatsapp.autoSendMinute) return;

  const dayKey = yesterdayKey();
  const alreadyHandled = await ReportLog.exists({ dayKey });
  if (alreadyHandled) {
    console.log(`📄 Report for ${dayKey} was already sent/downloaded manually — skipping auto-send.`);
    return;
  }

  if (!config.whatsapp.targetNumber) {
    console.warn(`⚠️  No WHATSAPP_TARGET_NUMBER set — skipping auto-send for ${dayKey}.`);
    return;
  }

  const status = whatsappService.getStatus();
  if (status.status !== "ready") {
    console.warn(`⚠️  WhatsApp not linked (status: ${status.status}) — could not auto-send report for ${dayKey}. Link it from the dashboard's report panel.`);
    return;
  }

  try {
    const { days, totals, deletedOrders } = await collectReportData(dayKey, dayKey);
    const buffer = await buildReportPdfBuffer({ rangeLabel: `Today — ${dayKey}`, days, totals, deletedOrders });

    await whatsappService.sendPdfReport({
      to: config.whatsapp.targetNumber,
      buffer,
      filename: `report-${dayKey}.pdf`,
      caption: `📊 GenZ Pizza Land — Daily Profit & Expense Report\n${dayKey} (auto-sent — nobody generated it manually today)`,
    });

    await ReportLog.findOneAndUpdate(
      { dayKey },
      { dayKey, sentBy: "auto", channel: "whatsapp", sentTo: config.whatsapp.targetNumber, sentAt: new Date() },
      { upsert: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Auto-sent daily report for ${dayKey} to WhatsApp (${config.whatsapp.targetNumber}).`);
  } catch (err) {
    console.error(`❌ Auto-send of report for ${dayKey} failed:`, err.message || err);
  }
};

const startDailyReportScheduler = () => {
  setInterval(() => {
    sendIfDue().catch((err) => console.error("Daily report auto-send check failed:", err));
  }, CHECK_INTERVAL_MS);
};

module.exports = { startDailyReportScheduler };
