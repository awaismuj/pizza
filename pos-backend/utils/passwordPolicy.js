const Settings = require("../models/settingsModel");

const DEFAULT_PASSWORD_POLICY = Object.freeze({
  minLength: 8,
  requireUppercase: false,
  requireLowercase: false,
  requireNumber: false,
  requireSymbol: false,
});

const normalizePasswordPolicy = (policy = {}) => ({
  ...DEFAULT_PASSWORD_POLICY,
  ...(policy || {}),
});

const getPasswordPolicy = async () => {
  const settings = await Settings.findOne({ key: "global" }).select("passwordPolicy").lean();
  return normalizePasswordPolicy(settings?.passwordPolicy);
};

const getPasswordPolicyError = (password, policy = DEFAULT_PASSWORD_POLICY) => {
  const current = normalizePasswordPolicy(policy);
  if (typeof password !== "string" || password.length < current.minLength) {
    return `Password must be at least ${current.minLength} characters long.`;
  }
  if (current.requireUppercase && !/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter.";
  }
  if (current.requireLowercase && !/[a-z]/.test(password)) {
    return "Password must include a lowercase letter.";
  }
  if (current.requireNumber && !/\d/.test(password)) {
    return "Password must include a number.";
  }
  if (current.requireSymbol && !/[^A-Za-z0-9]/.test(password)) {
    return "Password must include a symbol.";
  }
  return null;
};

module.exports = {
  DEFAULT_PASSWORD_POLICY,
  normalizePasswordPolicy,
  getPasswordPolicy,
  getPasswordPolicyError,
};
