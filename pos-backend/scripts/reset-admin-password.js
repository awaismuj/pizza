require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const config = require("../config/config");

async function resetPassword() {
  await mongoose.connect(config.databaseURI);

  const email = "devops.awais@gmail.com";
  const newPassword = "admin123"; // change this if you want

  const user = await User.findOne({ email });

  if (!user) {
    console.log("❌ Admin user not found:", email);
    await mongoose.disconnect();
    return;
  }

  user.password = newPassword;
  await user.save();

  console.log("✅ Admin password reset successfully:", email);

  await mongoose.disconnect();
}

resetPassword().catch((error) => {
  console.error("❌ Password reset failed:", error.message);
  process.exit(1);
});
