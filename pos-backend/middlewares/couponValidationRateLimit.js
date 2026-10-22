const createHttpError = require("http-errors");

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const attempts = new Map();

const couponValidationRateLimit = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  let bucket = attempts.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, bucket);
  }

  if (bucket.count >= MAX_REQUESTS) {
    res.set("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
    return next(createHttpError(429, "Too many coupon checks. Please wait before trying again."));
  }

  bucket.count += 1;
  if (attempts.size > 1000) {
    for (const [ip, state] of attempts) {
      if (state.resetAt <= now) attempts.delete(ip);
    }
  }
  next();
};

module.exports = couponValidationRateLimit;
