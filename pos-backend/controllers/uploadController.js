const path = require("path");
const fs = require("fs");
const createHttpError = require("http-errors");
const UploadedImage = require("../models/uploadedImageModel");
const { buildFilename, uploadsDir } = require("../middlewares/uploadMiddleware");

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, "Please select an image to upload."));
    }

    const filename = buildFilename(req.file.originalname);
    await UploadedImage.create({
      filename,
      mimeType: req.file.mimetype === "image/jpg" || req.file.mimetype === "image/pjpeg" ? "image/jpeg" : req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
    });

    // Kept relative on purpose - the dashboard and storefront prefix it with
    // the backend URL (resolveImageUrl), so it works from any domain.
    const relativeUrl = `/uploads/${filename}`;

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully!",
      data: { url: relativeUrl, filename },
    });
  } catch (error) {
    next(error);
  }
};

// GET /uploads/:filename — serves an image from MongoDB, falling back to the
// old on-disk folder for photos uploaded before the switch.
const serveUploadedImage = async (req, res, next) => {
  try {
    const filename = path.basename(req.params.filename || "");
    if (!filename) return res.status(404).end();

    // Same headers whichever source the bytes come from.
    const send = (mimeType, buffer) => {
      res.set({
        "Content-Type": mimeType,
        "Content-Length": buffer.length,
        // The filename contains a unique timestamp, so it never changes.
        "Cache-Control": "public, max-age=31536000, immutable",
        // Storefront and POS live on other domains than this API.
        "Cross-Origin-Resource-Policy": "cross-origin",
        "X-Content-Type-Options": "nosniff",
        // SVGs can carry scripts - render them inert.
        ...(mimeType === "image/svg+xml" ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox" } : {}),
      });
      res.status(200).send(buffer);
    };

    const image = await UploadedImage.findOne({ filename });
    if (image) return send(image.mimeType, image.data);

    const legacyPath = path.join(uploadsDir, filename);
    if (fs.existsSync(legacyPath)) {
      const mime = MIME_BY_EXT[path.extname(filename).toLowerCase()];
      if (mime) return send(mime, fs.readFileSync(legacyPath));
    }

    return res.status(404).json({ message: "Image not found. Please upload it again." });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, serveUploadedImage };
