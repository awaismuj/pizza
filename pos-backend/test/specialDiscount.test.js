const test = require("node:test");
const assert = require("node:assert/strict");
const { validateSpecialDiscount } = require("../utils/specialDiscount");

test("accepts a fixed discount within the order amount", () => {
  assert.equal(validateSpecialDiscount("200", 850), 200);
});

test("treats an omitted discount as zero", () => {
  assert.equal(validateSpecialDiscount(undefined, 850), 0);
});

test("rejects fractional, non-positive, and excessive discounts", () => {
  for (const amount of ["100.5", "0", "-100", "900", "invalid"]) {
    assert.throws(() => validateSpecialDiscount(amount, 850), { status: 400 });
  }
});
