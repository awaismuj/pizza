const createHttpError = require("http-errors");

const createRateLimiter = ({ windowMs, maxRequests, message }) => {
  const clients = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    let bucket = clients.get(ip);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      clients.set(ip, bucket);
    }

    if (bucket.count >= maxRequests) {
      res.set("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      return next(createHttpError(429, message));
    }

    bucket.count += 1;
    if (clients.size > 1000) {
      for (const [clientIp, state] of clients) {
        if (state.resetAt <= now) clients.delete(clientIp);
      }
    }
    if (clients.size > 5000) {
      return next(createHttpError(503, "Request protection is temporarily at capacity. Please try again shortly."));
    }
    next();
  };
};

module.exports = createRateLimiter;
