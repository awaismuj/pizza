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

const allowedOrigins = [
    config.frontendUrl,
    config.storeUrl,
    // POS frontend dev server (vite default)
    'http://localhost:5173',
    // Online store dev server (see online-store/vite.config.js)
    'http://localhost:5174',
    'http://localhost:3000',
    'https://pos.muscatfood.com',
    'https://apipos.muscatfood.com',
    'https://genzpizza.online',
    'https://www.genzpizza.online',
    'https://genzpizza.muscatfood.com'
].filter(Boolean);

// Middlewares
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    }
}));
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
app.use("/api/expense", require("./routes/expenseRoute"));
app.use("/api/profit", require("./routes/profitRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/report", require("./routes/reportRoute"));
app.use("/api/settings", require("./routes/settingsRoute"));
app.use("/api/staff", require("./routes/staffRoute"));

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


// Server
app.listen(PORT, () => {
    console.log(`☑️  POS Server is listening on port ${PORT}`);
})