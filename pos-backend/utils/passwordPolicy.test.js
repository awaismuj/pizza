const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_PASSWORD_POLICY,
  getPasswordPolicyError,
} = require("./passwordPolicy");

test("default policy accepts the requested 8-character password examples", () => {
  for (const password of ["Abcd@1234", "Abcd1234", "admin123"]) {
    assert.equal(getPasswordPolicyError(password), null);
  }
});

test("policy checks configured minimum length and enabled character rules", () => {
  const policy = {
    ...DEFAULT_PASSWORD_POLICY,
    minLength: 10,
    requireUppercase: true,
    requireNumber: true,
    requireSymbol: true,
  };

  assert.equal(getPasswordPolicyError("abcd1234", policy), "Password must be at least 10 characters long.");
  assert.equal(getPasswordPolicyError("Abcd123456", policy), "Password must include a symbol.");
  assert.equal(getPasswordPolicyError("Abcd@123456", policy), null);
});
