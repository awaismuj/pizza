const multer = require("multer");
const createHttpError = require("http-errors");

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return callback(createHttpError(400, "Only PDF, JPEG, PNG, or WebP asset documents are allowed."));
    }
    callback(null, true);
  },
});

const handleAssetUpload = (req, res, next) => {
  upload.single("document")(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      const message = error.code === "LIMIT_FILE_SIZE"
        ? "The asset document is too large. Maximum file size is 10 MB."
        : error.message;
      return next(createHttpError(400, message));
    }
    next(error);
  });
};

module.exports = { handleAssetUpload };
