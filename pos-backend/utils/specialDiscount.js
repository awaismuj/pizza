const createHttpError = require("http-errors");

const roundMoney = (amount) => Math.round((Number(amount) + Number.EPSILON) * 100) / 100;

const validateSpecialDiscount = (amount, maximum) => {
  if (amount === undefined || amount === null || String(amount).trim() === "") return 0;
  if (!["number", "string"].includes(typeof amount)) {
    throw createHttpError(400, "Special discount must be a whole rupee amount greater than zero.");
  }

  const parsed = Number(amount);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    throw createHttpError(400, "Special discount must be a whole rupee amount greater than zero.");
  }
  if (parsed > roundMoney(maximum)) {
    throw createHttpError(400, "Special discount cannot be greater than the order amount.");
  }
  return parsed;
};

module.exports = { roundMoney, validateSpecialDiscount };
