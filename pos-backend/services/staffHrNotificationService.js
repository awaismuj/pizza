const Staff = require("../models/staffModel");
const StaffHrNotification = require("../models/staffHrNotificationModel");
const { sendMail } = require("../utils/mailer");

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const deliver = async (notification) => {
  try {
    const result = await sendMail({
      to: notification.recipient,
      subject: notification.subject,
      html: `<div style="font-family:Arial,sans-serif"><p>${escapeHtml(notification.message)}</p><p>— HR</p></div>`,
    });
    notification.attempts += 1;
    if (result?.skipped) {
      notification.lastError = "Email was not sent because SMTP is not configured.";
      if (notification.attempts >= 20) notification.status = "Failed";
      await notification.save();
      return false;
    }
    notification.status = "Delivered";
    notification.sentAt = new Date();
    notification.lastError = "";
    await notification.save();
    return true;
  } catch (error) {
    notification.attempts += 1;
    notification.lastError = String(error.message || error).slice(0, 500);
    if (notification.attempts >= 20) notification.status = "Failed";
    await notification.save();
    console.error(`HR notification ${notification._id} email delivery failed:`, error.message || error);
    return false;
  }
};

const notifyStaff = async ({ staffId, type, eventKey, subject, message }) => {
  try {
    const staff = await Staff.findById(staffId).populate("linkedUser", "email");
    if (!staff) {
      console.warn(`HR notification skipped: staff profile ${staffId} no longer exists.`);
      return false;
    }
    const recipient = String(staff.email || staff.linkedUser?.email || "").trim();
    if (!recipient) {
      console.warn(`HR notification skipped: no employee email is set for ${staff.employeeId || staff._id}.`);
      return false;
    }
    const dedupeKey = `${type}:${staff._id}:${eventKey}`;
    let notification;
    try {
      notification = await StaffHrNotification.findOneAndUpdate(
        { dedupeKey },
        {
          $setOnInsert: { dedupeKey, staff: staff._id, type, subject, message, recipient },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
      notification = await StaffHrNotification.findOne({ dedupeKey });
    }
    if (!notification || notification.status === "Delivered") return Boolean(notification);
    return deliver(notification);
  } catch (error) {
    console.error("HR notification could not be queued:", error.message || error);
    return false;
  }
};

const retryPendingStaffNotifications = async () => {
  const notifications = await StaffHrNotification.find({ status: "Pending", attempts: { $lt: 20 } })
    .sort({ createdAt: 1 })
    .limit(50);
  let delivered = 0;
  for (const notification of notifications) {
    if (await deliver(notification)) delivered += 1;
  }
  return delivered;
};

module.exports = { notifyStaff, retryPendingStaffNotifications };
