require("dotenv").config();

const config = Object.freeze({
    port: process.env.PORT || 3000,
    databaseURI: process.env.MONGODB_URI || "mongodb://localhost:27017/pos-db",
    nodeEnv: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    // Public genzpizza.online storefront, so it can be added to the CORS
    // allow-list from an env var without touching app.js in every deploy.
    storeUrl: process.env.STORE_URL || process.env.ONLINE_STORE_URL || "http://localhost:5174",
    backendUrl: process.env.BACKEND_URL || "http://localhost:3000",
    cookieDomain: process.env.COOKIE_DOMAIN || (process.env.NODE_ENV === "production" ? ".muscatfood.com" : undefined),
    accessTokenSecret: process.env.JWT_SECRET || "change_this_to_a_long_random_secret_key",
    // Sales tax rate applied to every order (POS and online). Keep this in
    // sync with TAX_RATE_PERCENT in the frontend's constants/index.js.
    TAX_RATE_PERCENT: Number(process.env.TAX_RATE_PERCENT || 16),
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpaySecretKey: process.env.RAZORPAY_KEY_SECRET,
    razorpyWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    // New staff signups (Waiter/Cashier/Admin) are emailed here for approval
    // before they're allowed to log in.
    adminApprovalEmail: process.env.ADMIN_APPROVAL_EMAIL || "awais.muj@gmail.com",
    smtp: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM,
    },
    whatsapp: {
        // Fully free WhatsApp sending via a linked-device session (see
        // services/whatsappService.js) — set to "false" to disable entirely.
        enabled: String(process.env.WHATSAPP_ENABLED || "true").toLowerCase() !== "false",
        // Number the daily report is sent to, e.g. 923001234567 (no "+").
        targetNumber: process.env.WHATSAPP_TARGET_NUMBER || "",
        sessionDir: process.env.WHATSAPP_SESSION_DIR || undefined,
        // Auto-send fires shortly after midnight for the day that just
        // ended, so it always runs after the 23:59 profit lock and reads
        // that day's frozen final figures — and only if nobody already sent
        // that day's report manually (see models/reportLogModel.js).
        autoSendEnabled: String(process.env.REPORT_AUTO_SEND || "true").toLowerCase() !== "false",
        autoSendHour: Number(process.env.REPORT_AUTO_SEND_HOUR ?? 0),
        autoSendMinute: Number(process.env.REPORT_AUTO_SEND_MINUTE ?? 5),
    },
    defaultAdmin: {
        name: process.env.ADMIN_NAME || "System Admin",
        email: process.env.ADMIN_EMAIL || "devops.awais@gmail.com",
        phone: Number(process.env.ADMIN_PHONE || 9999999999),
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: process.env.ADMIN_ROLE || "Admin"
    }
});

module.exports = config;
