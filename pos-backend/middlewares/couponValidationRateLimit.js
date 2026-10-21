const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;
const requestsByAddress = new Map();

const couponValidationRateLimit = (req, res, next) => {
  const now = Date.now();
  const address = req.ip || req.socket.remoteAddress || "unknown";
  let window = requestsByAddress.get(address);

  if (!window || now - window.startedAt >= WINDOW_MS) {
    window = { startedAt: now, count: 0 };
    requestsByAddress.set(address, window);
  }

  if (window.count >= MAX_REQUESTS) {
    return res.status(429).json({
      status: 429,
      message: "Too many coupon checks. Please wait a minute and try again.",
    });
  }
  window.count += 1;

  if (requestsByAddress.size > 5000) {
    for (const [key, value] of requestsByAddress) {
      if (now - value.startedAt >= WINDOW_MS) requestsByAddress.delete(key);
    }
  }

  return next();
};

module.exports = couponValidationRateLimit;
