const test = require("node:test");
const assert = require("node:assert/strict");
const {
  isValidIdempotencyKey,
  digestIdempotencyKey,
  fingerprintRequest,
} = require("../services/idempotency");

test("accepts secure-format checkout keys and rejects malformed keys", () => {
  assert.equal(isValidIdempotencyKey("4e86f7b0-4c26-4c7f-9a88-2bf8d4ee1234"), true);
  assert.equal(isValidIdempotencyKey("short"), false);
  assert.equal(isValidIdempotencyKey("a".repeat(129)), false);
  assert.equal(isValidIdempotencyKey("key.with.dots-012345"), false);
});

test("stores only keyed digests and distinguishes payload or customer changes", () => {
  const secret = "a-long-test-secret-that-is-not-used-in-production";
  assert.notEqual(digestIdempotencyKey("checkout-key-123456", secret), "checkout-key-123456");
  assert.notEqual(
    digestIdempotencyKey("checkout-key-123456", secret),
    digestIdempotencyKey("checkout-key-123456", secret, "pos-payment-key")
  );
  assert.equal(
    fingerprintRequest({ items: [{ dishId: "dish-1", quantity: 1 }] }, "customer-1", secret),
    fingerprintRequest({ items: [{ dishId: "dish-1", quantity: 1 }] }, "customer-1", secret)
  );
  assert.notEqual(
    fingerprintRequest({ items: [{ dishId: "dish-1", quantity: 1 }] }, "customer-1", secret),
    fingerprintRequest({ items: [{ dishId: "dish-1", quantity: 2 }] }, "customer-1", secret)
  );
  assert.notEqual(
    fingerprintRequest({ amount: 1000 }, "staff-1", secret, "pos-payment-request"),
    fingerprintRequest({ amount: 1000 }, "staff-2", secret, "pos-payment-request")
  );
  assert.notEqual(
    fingerprintRequest({ items: [{ dishId: "dish-1", quantity: 1 }] }, "customer-1", secret),
    fingerprintRequest({ items: [{ dishId: "dish-1", quantity: 1 }] }, "customer-2", secret)
  );
});
