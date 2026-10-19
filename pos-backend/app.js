const path = require("path");
const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { serveUploadedImage } = require("./controllers/uploadController");
const app = express();

const PORT = config.port;
connectDB();

const cleanUrl = (url) => (typeof url === "string" ? url.trim().replace(/\/+$/, "") : "");

const splitOrigins = (str) =>
    (str ? str.split(",").map(cleanUrl).filter(Boolean) : []);

const configuredOrigins = [
    ...splitOrigins(process.env.ALLOWED_ORIGINS),
    ...splitOrigins(config.frontendUrl),
    ...splitOrigins(config.storeUrl),
    ...splitOrigins(config.backendUrl),
    // Common local development and preview servers
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4175',
    'http://localhost:5174',
    'http://localhost:3000',
    // Live deployments
    'https://pizza.strongpass.online',
    'https://bepizza.strongpass.online',
    'https://pos.muscatfood.com',
    'https://apipos.muscatfood.com',
    'https://genzpizza.online',
    'https://www.genzpizza.online',
    'https://genzpizza.muscatfood.com'
].map(cleanUrl).filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true; // allow mobile apps, curl, server-to-server, same-origin
    const originClean = cleanUrl(origin);
    if (configuredOrigins.includes(originClean)) return true;

    // Dynamically allow any subdomain on these verified deployment domains
    if (/^https?:\/\/([a-z0-9-]+\.)*strongpass\.online(:\d+)?$/i.test(originClean)) return true;
    if (/^https?:\/\/([a-z0-9-]+\.)*genzpizza\.online(:\d+)?$/i.test(originClean)) return true;
    if (/^https?:\/\/([a-z0-9-]+\.)*muscatfood\.com(:\d+)?$/i.test(originClean)) return true;

    return false;
};

// Middlewares
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json()); // parse incoming request in json format
app.use(cookieParser())

// Serve uploaded images (category icons, dish images, etc.) so URLs returned by
// the /api/upload endpoint (e.g. /uploads/xyz.png) are actually reachable.
// Images are stored in MongoDB (survives redeploys/restarts); old on-disk
// files are still served as a fallback. See controllers/uploadController.js.
app.get("/uploads/:filename", serveUploadedImage);


// Root Endpoint
app.get("/", (req,res) => {
    res.json({message : "Hello from POS Server!"});
})

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/category", require("./routes/categoryRoute"));
app.use("/api/dish", require("./routes/dishRoute"));
app.use("/api/deal", require("./routes/dealRoute"));
app.use("/api/hero-slide", require("./routes/heroSlideRoute"));
app.use("/api/inventory", require("./routes/inventoryRoute"));
app.use("/api/assets", require("./routes/assetRoute"));
app.use("/api/expense", require("./routes/expenseRoute"));
app.use("/api/profit", require("./routes/profitRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/report", require("./routes/reportRoute"));
app.use("/api/settings", require("./routes/settingsRoute"));
app.use("/api/staff", require("./routes/staffRoute"));
app.use("/api/music", require("./routes/musicRoute"));

// Global Error Handler
app.use(globalErrorHandler);

// Auto-locks each day's actual profit (revenue - expenses) at 11:59pm
// server time — see services/dailyProfitScheduler.js.
require("./services/dailyProfitScheduler").startDailyProfitScheduler();

// Links to WhatsApp (free, QR-based — see services/whatsappService.js) and
// starts the job that auto-sends the daily report if nobody sent it
// manually — see services/dailyReportScheduler.js.
require("./services/whatsappService").initWhatsapp();
require("./services/dailyReportScheduler").startDailyReportScheduler();

// Auto-marks all staff Present each day (cashier only flips absentees).
require("./services/staffAttendanceScheduler").startStaffAttendanceScheduler();

// Posts closed-month asset depreciation. Each asset+period has a unique
// ledger key, so multiple checks or server processes cannot double-post.
require("./services/assetDepreciationScheduler").startAssetDepreciationScheduler();


// Server
app.listen(PORT, () => {
    console.log(`☑️  POS Server is listening on port ${PORT}`);
})