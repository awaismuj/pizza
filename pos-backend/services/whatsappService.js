// Sends the daily report over WhatsApp for Rs 0 / $0 — no Meta Business
// account, no per-message billing, no API key. It works by remote-controlling
// a real WhatsApp Web session, exactly like scanning "Linked Devices" on
// your phone. That's the only genuinely free way to send WhatsApp messages
// from code today; the official Cloud API is free to set up but bills per
// conversation once you're outside its small free tier and needs Meta
// Business verification, so it isn't a fit given the "no API cost" ask.
//
// Trade-off to know about: this drives WhatsApp the same way WhatsApp Web
// does, which is outside WhatsApp's official Business Platform terms for
// automation. For a low-volume, one-report-a-day use case run from your own
// restaurant number this is what most small shops actually use and the risk
// is low, but it isn't Meta-sanctioned — keep volume low (this app only
// sends ~1 message/day) and expect to re-scan the QR occasionally (session
// expiry, phone offline too long, WhatsApp app update, etc).
//
// Setup (one-time):
//   1. npm install (pulls in whatsapp-web.js + puppeteer/Chromium — needs a
//      real Node server that stays running, e.g. a VPS/Railway/Render box;
//      it will NOT work on serverless/edge hosting).
//   2. Start the backend and watch the server console (or GET
//      /api/report/whatsapp-status from the dashboard) for a QR code.
//   3. On the restaurant's WhatsApp: Settings → Linked Devices → Link a
//      Device → scan it. Session is then saved to disk (WHATSAPP_SESSION_DIR)
//      so you only do this once per server.
//   4. Set WHATSAPP_TARGET_NUMBER in .env to the number reports go to
//      (your own WhatsApp), in international format with no "+" or spaces,
//      e.g. 923001234567.
//
// Troubleshooting "init_failed" (Puppeteer/Chromium couldn't launch — the
// most common failure on a fresh Ubuntu/Debian server, and what usually
// shows up in the dashboard as a link failure): install Chromium's runtime
// libraries, then retry:
//   sudo apt-get update && sudo apt-get install -y \
//     libnss3 libatk-bridge2.0-0 libx11-xcb1 libxcomposite1 libxdamage1 \
//     libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0
// Then hit "Retry" in the dashboard's report panel (or restart the server).

const path = require("path");
const QRCode = require("qrcode");
const config = require("../config/config");

let Client, LocalAuth;
try {
  // Optional require so the rest of the server still boots (and the report
  // PDF download still works) even before `npm install` pulls this in.
  ({ Client, LocalAuth } = require("whatsapp-web.js"));
} catch (err) {
  console.warn("⚠️  whatsapp-web.js not installed yet — run `npm install` in pos-backend. WhatsApp sending is disabled until then.");
}

const state = {
  client: null,
  status: "disabled", // disabled | initializing | qr | ready | auth_failure | disconnected
  qrDataUrl: null,
  lastError: null,
  linkedNumber: null, // the phone number that scanned the QR (the SENDER) — not the same as targetNumber (the RECIPIENT)
};

const buildClient = () => {
  const sessionDir = config.whatsapp.sessionDir || path.join(__dirname, "..", ".wwebjs_auth");

  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: sessionDir }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", async (qr) => {
    state.status = "qr";
    try {
      state.qrDataUrl = await QRCode.toDataURL(qr);
    } catch (err) {
      state.qrDataUrl = null;
    }
    console.log("📱 WhatsApp: scan this QR from Settings → Linked Devices (or open the dashboard's report panel to see it as an image).");
  });

  client.on("ready", () => {
    state.status = "ready";
    state.qrDataUrl = null;
    state.lastError = null;
    // The number that just scanned the QR — i.e. who reports will be SENT
    // FROM. Surfaced to the dashboard so you can confirm the right phone
    // linked, since WhatsApp itself never asks which number "should" scan.
    state.linkedNumber = client.info?.wid?.user || null;
    console.log(`✅ WhatsApp linked and ready (sending from ${state.linkedNumber || "unknown number"}) — daily reports can now be sent.`);
  });

  client.on("auth_failure", (msg) => {
    state.status = "auth_failure";
    state.lastError = msg;
    console.error("❌ WhatsApp auth failed:", msg);
  });

  client.on("disconnected", (reason) => {
    state.status = "disconnected";
    state.lastError = reason;
    console.warn("⚠️  WhatsApp disconnected:", reason);
  });

  return client;
};

// Call once at server startup. No-op (leaves status "disabled") if the
// package isn't installed or WHATSAPP_ENABLED=false.
const initWhatsapp = () => {
  if (!Client || !config.whatsapp.enabled) return;
  state.status = "initializing";
  state.client = buildClient();
  state.client.initialize().catch((err) => {
    // Distinct from the client's own "auth_failure" event (real WhatsApp
    // login rejection) — this is Puppeteer/Chromium failing to even start,
    // almost always missing system libraries on a fresh Linux server. See
    // the troubleshooting note above.
    state.status = "init_failed";
    state.lastError = err?.message || String(err);
    console.error("❌ WhatsApp init failed (Puppeteer/Chromium could not start — see the system-dependency note at the top of this file):", err);
  });
};

// Re-runs initialize() after fixing whatever caused init_failed/auth_failure,
// without restarting the whole server. Called by POST /api/report/whatsapp-retry.
const retryWhatsapp = async () => {
  if (!Client || !config.whatsapp.enabled) return;
  if (state.client) {
    try {
      await state.client.destroy();
    } catch (err) {
      // ignore — client may already be dead
    }
  }
  state.qrDataUrl = null;
  state.lastError = null;
  initWhatsapp();
};

// Properly logs the currently-linked phone out (so it also disappears from
// that phone's own "Linked Devices" list) and starts a brand new QR flow.
// Use this when the wrong phone scanned it and you need to link the
// correct one instead — a plain "retry" alone keeps the old phone linked.
const unlinkWhatsapp = async () => {
  if (!Client || !config.whatsapp.enabled) return;
  if (state.client) {
    try {
      await state.client.logout();
    } catch (err) {
      // ignore — session may already be invalid
    }
    try {
      await state.client.destroy();
    } catch (err) {
      // ignore
    }
  }
  state.qrDataUrl = null;
  state.lastError = null;
  state.linkedNumber = null;
  initWhatsapp();
};

const getStatus = () => ({
  status: state.status,
  qrDataUrl: state.qrDataUrl,
  lastError: state.lastError,
  linkedNumber: state.linkedNumber,
  targetNumber: config.whatsapp.targetNumber || null,
});

// `to` is a plain international number, e.g. "923001234567".
const toChatId = (to) => `${String(to).replace(/[^\d]/g, "")}@c.us`;

// Sends a PDF (as a Buffer) with a caption. Throws if WhatsApp isn't linked.
const sendPdfReport = async ({ to, buffer, filename, caption }) => {
  if (!state.client || state.status !== "ready") {
    throw new Error(
      state.status === "qr"
        ? "WhatsApp isn't linked yet — scan the QR code shown in the dashboard/report panel first."
        : `WhatsApp isn't connected (status: ${state.status}).`
    );
  }
  const { MessageMedia } = require("whatsapp-web.js");
  const media = new MessageMedia("application/pdf", buffer.toString("base64"), filename);
  const chatId = toChatId(to);
  await state.client.sendMessage(chatId, media, { caption });
};

const sendTextMessage = async ({ to, text }) => {
  if (!state.client || state.status !== "ready") {
    throw new Error(
      state.status === "qr"
        ? "WhatsApp isn't linked yet — scan the QR code shown in the coupon campaign panel first."
        : `WhatsApp isn't connected (status: ${state.status}).`
    );
  }
  if (typeof text !== "string" || !text.trim() || text.length > 4096) {
    throw new Error("WhatsApp message text must be between 1 and 4096 characters.");
  }
  const chatId = toChatId(to);
  const sent = await state.client.sendMessage(chatId, text.trim());
  const messageId = sent?.id?._serialized || sent?.id?.id;
  if (!messageId) throw new Error("WhatsApp returned no message ID.");
  return { messageId, provider: "linked" };
};

module.exports = { initWhatsapp, retryWhatsapp, unlinkWhatsapp, getStatus, sendPdfReport, sendTextMessage };
