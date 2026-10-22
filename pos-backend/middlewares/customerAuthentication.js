const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const config = require("../config/config");
const Customer = require("../models/customerModel");

const customerTokenFromRequest = (req) => {
  const authorization = String(req.headers.authorization || "");
  if (authorization.startsWith("Bearer ")) return authorization.slice(7).trim();
  return req.cookies?.customerAccessToken || "";
};

const findCustomerFromRequest = async (req) => {
  const token = customerTokenFromRequest(req);
  if (!token) return null;
  let decoded;
  try {
    decoded = jwt.verify(token, config.accessTokenSecret, { audience: "store-customer" });
  } catch {
    throw createHttpError(401, "Customer session is invalid or expired. Please sign in again.");
  }
  const customer = await Customer.findById(decoded._id).select("+authVersion");
  if (!customer || !customer.active || !customer.emailVerifiedAt) {
    throw createHttpError(401, "Verify your email and sign in to continue.");
  }
  if ((decoded.authVersion ?? 0) !== customer.authVersion) {
    throw createHttpError(401, "Customer session has expired. Please sign in again.");
  }
  return customer;
};

const requireCustomer = async (req, res, next) => {
  try {
    const customer = await findCustomerFromRequest(req);
    if (!customer) throw createHttpError(401, "Sign in to your customer account to continue.");
    req.customer = customer;
    next();
  } catch (error) {
    next(error);
  }
};

const attachOptionalCustomer = async (req, res, next) => {
  try {
    req.customer = await findCustomerFromRequest(req);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireCustomer, attachOptionalCustomer, customerTokenFromRequest };
