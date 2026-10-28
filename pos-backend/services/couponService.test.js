const test = require("node:test");
const assert = require("node:assert/strict");
const { matchesCouponIdentity } = require("./couponService");

test("phone-bound coupons still validate after the recipient registers an account", () => {
  const phoneKey = "phone:canonical-mobile-hash";
  const identity = {
    key: "customer:registered-account",
    phoneKey,
  };

  assert.equal(matchesCouponIdentity(identity, [phoneKey]), true);
  assert.equal(matchesCouponIdentity(identity, ["phone:another-customer"]), false);
});
