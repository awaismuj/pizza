const createHttpError = require("http-errors");

const containsUnsafeMongoKey = (value, depth = 0) => {
  if (depth > 24) return true;
  if (!value || typeof value !== "object" || Buffer.isBuffer(value)) return false;

  return Object.entries(value).some(([key, child]) =>
    key.startsWith("$") ||
    key.includes(".") ||
    ["__proto__", "prototype", "constructor"].includes(key) ||
    containsUnsafeMongoKey(child, depth + 1)
  );
};

const rejectMongoOperators = (req, res, next) => {
  const isMetaWebhookVerification = req.method === "GET"
    && req.path === "/api/whatsapp-campaign/webhook"
    && Object.keys(req.query || {}).every((key) => ["hub.mode", "hub.verify_token", "hub.challenge"].includes(key));
  if (containsUnsafeMongoKey(req.body) || (!isMetaWebhookVerification && containsUnsafeMongoKey(req.query))) {
    return next(createHttpError(400, "Request contains unsupported field names."));
  }
  next();
};

const securityHeaders = (req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  if (process.env.NODE_ENV === "production" && req.secure) {
    res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
};

module.exports = { rejectMongoOperators, securityHeaders };
