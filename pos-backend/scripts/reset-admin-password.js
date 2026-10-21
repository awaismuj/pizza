require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/userModel");
const UserAuditLog = require("../models/userAuditLogModel");
const config = require("../config/config");
const { getPasswordPolicy, getPasswordPolicyError } = require("../utils/passwordPolicy");

async function resetPassword() {
  const email = String(process.env.RESET_USER_EMAIL || "").trim();
  const newPassword = process.env.RESET_USER_PASSWORD;
  if (!email || !newPassword) throw new Error("Set RESET_USER_EMAIL and RESET_USER_PASSWORD explicitly.");
  await mongoose.connect(config.databaseURI);
  const passwordError = getPasswordPolicyError(newPassword, await getPasswordPolicy());
  if (passwordError) throw new Error(passwordError);

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
