const mongoose = require("mongoose");

// Uploaded photos (dish images, category icons, deal/hero pictures) live in
// MongoDB instead of only on the server's disk. Hosting platforms often wipe
// or don't share the disk between restarts/deploys, which is what made
// freshly uploaded images turn into broken links (e.g. /uploads/t-....jpeg).
// The database survives all of that, and the URL stays "/uploads/<filename>".
const uploadedImageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true, index: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UploadedImage", uploadedImageSchema);
