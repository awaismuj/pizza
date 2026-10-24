const crypto = require("crypto");

const isValidIdempotencyKey = (key) =>
  typeof key === "string" &&
  key.length >= 16 &&
  key.length <= 128 &&
  /^[A-Za-z0-9_-]+$/.test(key);

const digestIdempotencyKey = (key, secret, namespace = "checkout-key") =>
  crypto.createHmac("sha256", secret).update(`${namespace}:${key}`).digest("hex");

const fingerprintRequest = (body, customerId, secret, namespace) => {
  const request = { body, customerId: customerId ? String(customerId) : null };
  if (namespace) request.namespace = namespace;
  return crypto.createHmac("sha256", secret).update(JSON.stringify(request)).digest("hex");
};

module.exports = { isValidIdempotencyKey, digestIdempotencyKey, fingerprintRequest };
