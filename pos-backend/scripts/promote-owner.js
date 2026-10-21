require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const User = require("../models/userModel");
const UserAuditLog = require("../models/userAuditLogModel");

const provisionOwner = async () => {
  const ownerEmail = String(process.env.RBAC_OWNER_EMAIL || "").trim().toLowerCase();
  if (!ownerEmail) throw new Error("Set RBAC_OWNER_EMAIL to the email of the existing account to promote.");
  await mongoose.connect(config.databaseURI);

  const user = await User.findOne({ email: new RegExp(`^${ownerEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
  if (!user) throw new Error("No existing account matches RBAC_OWNER_EMAIL. This command does not create accounts.");
  if (String(user.role).toLowerCase() === "super admin") {
    console.log("The selected account is already a Super Admin; no changes made.");
    return;
  }
  if (String(user.role).toLowerCase() !== "admin" || user.status !== "Approved" || !user.active) {
    throw new Error("Only an existing active, approved Admin account can be promoted.");
  }
  const existingOwner = await User.exists({ role: "Super Admin", active: true, status: "Approved" });
  if (existingOwner) throw new Error("An active Super Admin already exists. No changes made.");

  user.role = "Super Admin";
  user.authVersion += 1;
  await user.save();
  await UserAuditLog.create({
    targetUserId: user._id,
    action: "owner.provisioned",
    reason: "Explicit operator-run owner promotion",
  });
  console.log(`Promoted ${user.email} to Super Admin. Existing sessions were invalidated.`);
};

provisionOwner()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error("Owner provisioning failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
