const crypto = require("crypto");

const customerPhoneKey = (phoneDigits) =>
  crypto.createHash("sha256").update(String(phoneDigits || "").replace(/\D/g, "").slice(-9)).digest("hex");

module.exports = customerPhoneKey;