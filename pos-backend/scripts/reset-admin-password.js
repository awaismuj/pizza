require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/userModel");
const UserAuditLog = require("../models/userAuditLogModel");
const config = require("../config/config");

async function resetPassword() {
  const email = String(process.env.RESET_USER_EMAIL || "").trim();
  const newPassword = process.env.RESET_USER_PASSWORD;
  if (!email || !newPassword) throw new Error("Set RESET_USER_EMAIL and RESET_USER_PASSWORD explicitly.");
  if (newPassword.length < 12 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) ||
      !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
    throw new Error("Password must be at least 12 characters and include uppercase, lowercase, number, and symbol characters.");
  }
  await mongoose.connect(config.databaseURI);

  const user = await User.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });

  if (!user) {
    throw new Error("User not found.");
  }

  user.password = newPassword;
  user.forcePasswordChange = true;
  user.authVersion += 1;
  await user.save();
  await UserAuditLog.create({
    targetUserId: user._id,
    action: "user.password.reset",
    reason: "Operator-run password reset",
    details: { forcePasswordChange: true },
  });

  await mongoose.disconnect();
  console.log("Password reset successfully. The user must change it at next sign-in.");
}

resetPassword().catch((error) => {
  console.error("Password reset failed:", error.message);
  process.exit(1);
});
