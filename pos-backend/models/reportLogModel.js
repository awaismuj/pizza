const mongoose = require("mongoose");

// One row per calendar day. Written the moment a daily report for that day
// gets sent to WhatsApp — either because someone clicked "Send to WhatsApp"
// for that day/range in the dashboard (sentBy: "manual"), or because nobody
// did and the end-of-day auto-send job fired instead (sentBy: "auto"). The
// auto-send scheduler checks this collection so it never double-sends a day
// that was already handled manually.
const reportLogSchema = new mongoose.Schema(
  {
    dayKey: {
      type: String, // "YYYY-MM-DD"
      required: true,
      unique: true,
    },
    sentBy: {
      type: String,
      enum: ["manual", "auto"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["whatsapp", "download-only"],
      default: "whatsapp",
    },
    sentTo: { type: String, default: "" }, // whatsapp number it went to
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportLog", reportLogSchema);
