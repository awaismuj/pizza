export const DEFAULT_PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: false,
  requireLowercase: false,
  requireNumber: false,
  requireSymbol: false,
};

export const describePasswordPolicy = (policy) => [
  `At least ${policy.minLength} characters`,
  ...(policy.requireUppercase ? ["an uppercase letter"] : []),
  ...(policy.requireLowercase ? ["a lowercase letter"] : []),
  ...(policy.requireNumber ? ["a number"] : []),
  ...(policy.requireSymbol ? ["a symbol"] : []),
].join(", ");

export const getPasswordPolicyError = (password, policy) => {
  if (password.length < policy.minLength) return `Password must be at least ${policy.minLength} characters long.`;
  if (policy.requireUppercase && !/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (policy.requireLowercase && !/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (policy.requireNumber && !/\d/.test(password)) return "Password must include a number.";
  if (policy.requireSymbol && !/[^A-Za-z0-9]/.test(password)) return "Password must include a symbol.";
  return null;
};
