const crypto = require("crypto");

const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const createCustomerCouponCode = () => {
  let suffix = "";
  for (let index = 0; index < 4; index += 1) {
    suffix += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  }
  return `FLAT${suffix}`;
};

module.exports = { createCustomerCouponCode };
