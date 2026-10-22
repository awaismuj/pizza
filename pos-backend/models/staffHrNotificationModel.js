const mongoose = require("mongoose");

const staffHrNotificationSchema = new mongoose.Schema(
  {
    dedupeKey: { type: String, required: true, unique: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
    type: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    recipient: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Delivered", "Failed"], default: "Pending", index: true },
    attempts: { type: Number, default: 0 },
    lastError: { type: String, default: "" },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

staffHrNotificationSchema.index({ staff: 1, createdAt: -1 });

module.exports = mongoose.model("StaffHrNotification", staffHrNotificationSchema);
