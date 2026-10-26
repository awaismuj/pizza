const crypto = require("crypto");

const DEFAULT_CODE_SETTINGS = {
  codePrefix: "FLAT",
  codeLength: 4,
  codeAlphabet: "23456789ABCDEFGHJKLMNPQRSTUVWXYZ",
};

const createCustomerCouponCode = (settings = {}) => {
  const config = { ...DEFAULT_CODE_SETTINGS, ...settings };
  let suffix = "";
  for (let index = 0; index < Number(config.codeLength); index += 1) {
    suffix += config.codeAlphabet[crypto.randomInt(config.codeAlphabet.length)];
  }
  return `${config.codePrefix}${suffix}`;
};

module.exports = { createCustomerCouponCode, DEFAULT_CODE_SETTINGS };
