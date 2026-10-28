const crypto = require("crypto");
const normalizePakistaniMobile = require("./normalizePakistaniMobile");

const pakistaniMobileKey = (value) => {
  const mobile = normalizePakistaniMobile(value);
  return mobile ? crypto.createHash("sha256").update(mobile).digest("hex") : "";
};

module.exports = pakistaniMobileKey;
