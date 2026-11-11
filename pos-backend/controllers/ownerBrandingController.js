const bcrypt = require("bcrypt");
const crypto = require("crypto");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { getOrCreateSettings } = require("./settingsController");
const { uploadImage } = require("./uploadController");
const { validOwnerConfiguration, verifyTotp } = require("../utils/ownerBrandAuth");

const COOKIE_PATH = "/api/owner-branding";
const CHALLENGE_COOKIE = "ownerMfaChallenge";
const SESSION_COOKIE = "ownerSession";
const SESSION_SECONDS = 60 * 60;
const failedAttempts = new Map();

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "strict",
  path: COOKIE_PATH,
  maxAge,
});

const requireOwnerOrigin = (req, res, next) => {
  const origin = req.get("Origin");
  const allowedOrigins = new Set([
    config.frontendUrl,
    "https://pos.muscatfood.com",
    ...config.ownerAdminOrigins,
    ...(config.nodeEnv === "production" ? [] : [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:4175",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:4173",
      "http://127.0.0.1:4175",
    ]),
  ].filter(Boolean).map((value) => {
    try { return new URL(value).origin; } catch { return ""; }
  }));
  if (!origin || !allowedOrigins.has(origin) || req.get("X-Owner-Request") !== "1") {
    return next(createHttpError(403, "Owner access is available only from the authorized POS application."));
  }
  next();
};

const ensureConfigured = (req, res, next) => {
  if (!validOwnerConfiguration(config)) {
    return next(createHttpError(503, "Owner branding access is not configured on the server."));
  }
  next();
};

const checkRateLimit = (req) => {
  const key = String(req.ip || req.socket.remoteAddress || "unknown");
  const now = Date.now();
  const record = failedAttempts.get(key);
  if (record?.lockedUntil > now) return false;
  if (record && record.lockedUntil <= now) failedAttempts.delete(key);
  return true;
};

const recordFailure = (req) => {
  if (failedAttempts.size > 10_000) {
    for (const [ip, attempt] of failedAttempts) {
      if (attempt.lockedUntil <= Date.now()) failedAttempts.delete(ip);
    }
  }
  const key = String(req.ip || req.socket.remoteAddress || "unknown");
  const record = failedAttempts.get(key) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.count = 0;
    record.lockedUntil = Date.now() + 15 * 60 * 1000;
  }
  failedAttempts.set(key, record);
};

const clearFailures = (req) => {
  failedAttempts.delete(String(req.ip || req.socket.remoteAddress || "unknown"));
};

const startLogin = async (req, res, next) => {
  try {
    if (!checkRateLimit(req)) return next(createHttpError(429, "Too many owner sign-in attempts. Try again in 15 minutes."));
    const { email, password } = req.body || {};
    if (typeof password === "string" && Buffer.byteLength(password, "utf8") > 72) {
      recordFailure(req);
      return next(createHttpError(401, "Email or password is incorrect."));
    }
    const matchesEmail = typeof email === "string" &&
      email.trim().toLowerCase() === config.ownerEmail;
    const matchesPassword = typeof password === "string" &&
      await bcrypt.compare(password, config.ownerPasswordHash);
    if (!matchesEmail || !matchesPassword) {
      recordFailure(req);
      return next(createHttpError(401, "Email or password is incorrect."));
    }

    res.cookie(CHALLENGE_COOKIE, jwt.sign(
      { aud: "owner-mfa-challenge", nonce: crypto.randomBytes(24).toString("hex") },
      config.ownerSessionSecret,
      { expiresIn: "5m" }
    ), cookieOptions(5 * 60 * 1000));
    res.status(200).json({ success: true, data: { requiresTotp: true } });
  } catch (error) {
    next(error);
  }
};

const verifySecondFactor = (req, res, next) => {
  try {
    if (!checkRateLimit(req)) return next(createHttpError(429, "Too many owner sign-in attempts. Try again in 15 minutes."));
    const challenge = jwt.verify(req.cookies?.[CHALLENGE_COOKIE] || "", config.ownerSessionSecret, {
      audience: "owner-mfa-challenge",
    });
    if (!challenge.nonce || !verifyTotp(config.ownerTotpSecret, req.body?.code)) {
      recordFailure(req);
      return next(createHttpError(401, "The authenticator code is incorrect or expired."));
    }
    clearFailures(req);
    res.clearCookie(CHALLENGE_COOKIE, cookieOptions(0));
    res.cookie(SESSION_COOKIE, jwt.sign(
      { aud: "owner-branding", sub: config.ownerEmail },
      config.ownerSessionSecret,
      { expiresIn: SESSION_SECONDS }
    ), cookieOptions(SESSION_SECONDS * 1000));
    res.status(200).json({ success: true, data: { email: config.ownerEmail } });
  } catch (error) {
    next(createHttpError(401, "Your sign-in step expired. Enter your password again."));
  }
};

const requireOwnerSession = (req, res, next) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) return next(createHttpError(401, "Complete owner sign-in to continue."));
    const session = jwt.verify(token, config.ownerSessionSecret, { audience: "owner-branding" });
    if (session.sub !== config.ownerEmail) return next(createHttpError(401, "Owner session is invalid."));
    req.ownerEmail = session.sub;
    next();
  } catch {
    next(createHttpError(401, "Owner session expired. Sign in again."));
  }
};

const getOwnerSession = (req, res) => {
  res.status(200).json({ success: true, data: { email: req.ownerEmail } });
};

const logoutOwner = (req, res) => {
  res.clearCookie(CHALLENGE_COOKIE, cookieOptions(0));
  res.clearCookie(SESSION_COOKIE, cookieOptions(0));
  res.status(200).json({ success: true });
};

const getBranding = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      data: {
        name: settings.branding?.name || "GenZ Pizza Land",
        logo: settings.branding?.logo || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateBranding = async (req, res, next) => {
  try {
    const { name, logo } = req.body || {};
    const settings = await getOrCreateSettings();
    const branding = { ...(settings.branding?.toObject?.() || settings.branding || {}) };

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80 || /[\u0000-\u001f\u007f]/.test(name)) {
        return next(createHttpError(400, "Brand name must be 2 to 80 characters without control characters."));
      }
      branding.name = name.trim();
    }
    if (logo !== undefined) {
      if (typeof logo !== "string" || (logo && !/^\/uploads\/[A-Za-z0-9._-]+$/.test(logo))) {
        return next(createHttpError(400, "Upload a valid brand image or clear the current image."));
      }
      branding.logo = logo.trim();
    }
    if (name === undefined && logo === undefined) {
      return next(createHttpError(400, "Provide a brand name or image to update."));
    }

    settings.branding = branding;
    await settings.save();
    res.status(200).json({ success: true, message: "Brand settings updated.", data: settings.branding });
  } catch (error) {
    next(error);
  }
};

const uploadBrandLogo = async (req, res, next) => {
  try {
    if (!req.file) return next(createHttpError(400, "Please select a logo image to upload."));
    await uploadImage(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireOwnerOrigin,
  ensureConfigured,
  startLogin,
  verifySecondFactor,
  requireOwnerSession,
  getOwnerSession,
  logoutOwner,
  getBranding,
  updateBranding,
  uploadBrandLogo,
};
