const fs = require("fs");
const path = require("path");
const multer = require("multer");
const createHttpError = require("http-errors");

// Legacy folder: images uploaded before images moved into MongoDB are still
// served from here if the files exist (see app.js). New uploads don't touch it.
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Files are held in memory just long enough to be saved into MongoDB.
const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/pjpeg", "image/webp", "image/gif", "image/svg+xml"];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(createHttpError(400, "Only image files (png, jpg, jpeg, webp, gif, svg) are allowed."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// "Fries Photo.JPEG" -> "Fries-Photo-1789985073120-124681113.jpeg"
const buildFilename = (originalname = "") => {
  const ext = path.extname(originalname).toLowerCase();
  const safeBase = path
    .basename(originalname, ext)
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .slice(0, 40);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${safeBase || "img"}-${uniqueSuffix}${ext}`;
};

// Turns multer's own errors (file too big, etc.) into clean 400s with a
// message the dashboard can show, instead of a generic 500.
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Image is too large. Please choose a photo under 5 MB." : err.message;
      return next(createHttpError(400, message));
    }
    next(err);
  });
};

module.exports = { upload, handleUpload, buildFilename, uploadsDir };
