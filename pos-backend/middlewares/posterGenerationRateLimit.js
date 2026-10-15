const createHttpError = require("http-errors");

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;
const clients = new Map();

const posterGenerationRateLimit = (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const current = clients.get(key);

    if (!current || now - current.startedAt >= WINDOW_MS) {
        clients.set(key, { startedAt: now, count: 1 });
    } else if (current.count >= MAX_REQUESTS) {
        return next(createHttpError(429, "Image generation is limited to 5 requests per minute. Please wait and try again."));
    } else {
        current.count += 1;
    }

    for (const [clientKey, window] of clients) {
        if (now - window.startedAt >= WINDOW_MS) clients.delete(clientKey);
    }
    next();
};

module.exports = posterGenerationRateLimit;
