require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const UserAuditLog = require("../models/userAuditLogModel");

const migrate = async () => {
  if (!config.databaseURI) throw new Error("MONGODB_URI is not configured.");
  await mongoose.connect(config.databaseURI);
  await Promise.all([User.createIndexes(), Role.createIndexes(), UserAuditLog.createIndexes()]);
  console.log("RBAC indexes are ready. Existing users and records were not modified.");
};

migrate()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error("RBAC migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
