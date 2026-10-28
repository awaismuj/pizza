const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const config = require("../config/config");
const Customer = require("../models/customerModel");
const customerPhoneKey = require("../utils/customerPhoneKey");

const normalizePhoneKey = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    throw createHttpError(400, "Enter a valid mobile number with 10 to 15 digits.");
  }
  return customerPhoneKey(digits);
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const safeCustomer = (customer) => ({
  id: String(customer._id),
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  dateOfBirth: customer.dateOfBirth || null,
});

const setCustomerSession = (res, customer) => {
  const accessToken = jwt.sign(
    { _id: customer._id, authVersion: customer.authVersion },
    config.accessTokenSecret,
    { expiresIn: "12h", audience: "store-customer" }
  );
  res.json({
    success: true,
    data: {
      token: accessToken,
      expiresIn: 12 * 60 * 60,
      customer: safeCustomer(customer),
    },
  });
};

const registerCustomer = async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const password = String(req.body.password || "");
    const phoneKey = normalizePhoneKey(phone);
    if (name.length < 2 || name.length > 120) throw createHttpError(400, "Name must be between 2 and 120 characters.");
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) throw createHttpError(400, "Enter a valid email address.");
    if (password.length < 12 || password.length > 128) throw createHttpError(400, "Password must be at least 12 characters.");
    let dateOfBirth = null;
    if (req.body.dateOfBirth) {
      dateOfBirth = new Date(req.body.dateOfBirth);
      if (Number.isNaN(dateOfBirth.getTime()) || dateOfBirth > new Date()) {
        throw createHttpError(400, "Enter a valid date of birth.");
      }
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      phoneKey,
      password,
      dateOfBirth,
    });

    res.status(201);
    setCustomerSession(res, customer);
  } catch (error) {
    if (error.code === 11000) return next(createHttpError(409, "An account already uses this email address or mobile number."));
    next(error);
  }
};

const verifyCustomerEmail = async (req, res, next) => {
  try {
    const token = String(req.params.token || "");
    if (token.length < 32 || token.length > 100) throw createHttpError(400, "This verification link is invalid or expired.");
    const customer = await Customer.findOneAndUpdate(
      {
        verificationTokenHash: hashToken(token),
        verificationExpiresAt: { $gt: new Date() },
        emailVerifiedAt: null,
      },
      {
        $set: { emailVerifiedAt: new Date(), verificationTokenHash: null, verificationExpiresAt: null },
      },
      { new: true }
    );
    if (!customer) throw createHttpError(400, "This verification link is invalid or expired.");
    res.set("Cache-Control", "no-store");
    res.type("html").send("<!doctype html><html><meta name='viewport' content='width=device-width'><title>Email verified</title><body style='font-family:Arial,sans-serif;padding:2rem'><h1>Email verified</h1><p>Your customer account is ready. You may return to the store and sign in.</p></body></html>");
  } catch (error) {
    next(error);
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) throw createHttpError(400, "Email and password are required.");
    const customer = await Customer.findOne({ email }).select("+password +authVersion");
    if (!customer || customer.contactOnly || !await bcrypt.compare(password, customer.password)) {
      throw createHttpError(401, "Invalid email or password.");
    }
    if (!customer.active) throw createHttpError(403, "This customer account is inactive.");
    customer.lastLoginAt = new Date();
    await customer.save();
    setCustomerSession(res, customer);
  } catch (error) {
    next(error);
  }
};

const getCustomerProfile = (req, res) => {
  res.json({ success: true, data: safeCustomer(req.customer) });
};

const logoutCustomer = async (req, res, next) => {
  try {
    req.customer.authVersion += 1;
    await req.customer.save();
    res.json({ success: true, message: "Signed out." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCustomer,
  verifyCustomerEmail,
  loginCustomer,
  getCustomerProfile,
  logoutCustomer,
};
