const multer = require("multer");
const createHttpError = require("http-errors");

// Payment screenshot: one JPG/PNG, max 5 MB, held in memory just long
// enough to be validated and saved to MongoDB (see jazzcashController).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/jpg", "image/pjpeg"].includes(file.mimetype)) return cb(null, true);
    cb(createHttpError(400, "Only JPG or PNG screenshots are allowed."));
  },
});

const handlePaymentProofUpload = (req, res, next) => {
  upload.single("screenshot")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "That screenshot is too large. Please choose an image under 5 MB." : "Couldn't read that file. Please try another screenshot.";
      return next(createHttpError(400, message));
    }
    next(err);
  });
};

module.exports = { handlePaymentProofUpload };
