const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^\S+@\S+\.\S+$/,
    },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    phoneKey: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    emailVerifiedAt: { type: Date, default: null },
    verificationTokenHash: { type: String, default: null, select: false },
    verificationExpiresAt: { type: Date, default: null, select: false },
    authVersion: { type: Number, default: 0, select: false },
    dateOfBirth: { type: Date, default: null },
    marketingConsent: { type: Boolean, default: false },
    marketingConsentAt: { type: Date, default: null },
    marketingConsentSource: { type: String, default: "" },
    lastLoginAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ phoneKey: 1 }, { unique: true });

customerSchema.pre("save", async function hashCustomerPassword() {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("Customer", customerSchema);
