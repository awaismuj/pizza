const test = require("node:test");
const assert = require("node:assert/strict");
const { decodeBase32, totp, verifyTotp, validOwnerConfiguration } = require("./ownerBrandAuth");

const RFC_SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

test("decodes a Base32 TOTP secret", () => {
  assert.equal(decodeBase32(RFC_SECRET).toString(), "12345678901234567890");
  assert.equal(decodeBase32("invalid0"), null);
});

test("generates and verifies RFC 6238 six-digit TOTP values", () => {
  assert.equal(totp(RFC_SECRET, 59_000), "287082");
  assert.equal(verifyTotp(RFC_SECRET, "287082", 59_000), true);
  assert.equal(verifyTotp(RFC_SECRET, "287083", 59_000), false);
  assert.equal(verifyTotp(RFC_SECRET, "12345", 59_000), false);
});

test("requires a bcrypt password hash, strong Base32 secret, and long signing secret", () => {
  assert.equal(validOwnerConfiguration({
    ownerEmail: "awais.mj@gmail.com",
    ownerPasswordHash: "$2b$12$" + "a".repeat(53),
    ownerTotpSecret: RFC_SECRET,
    ownerSessionSecret: "a".repeat(32),
    accessTokenSecret: "b".repeat(32),
  }), true);
  assert.equal(validOwnerConfiguration({
    ownerEmail: "awais.mj@gmail.com",
    ownerPasswordHash: "plaintext",
    ownerTotpSecret: RFC_SECRET,
    ownerSessionSecret: "a".repeat(32),
    accessTokenSecret: "b".repeat(32),
  }), false);
});
