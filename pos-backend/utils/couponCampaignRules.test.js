const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeCouponCode,
  formatCouponCode,
  generateCouponCode,
  fridayCampaignCycle,
  isFridayCampaignDue,
  isCustomerBirthday,
  expiryDate,
} = require("./couponCampaignRules");

test("coupon codes normalize case-insensitively and use the Flat plus digits format", () => {
  assert.equal(normalizeCouponCode(" fLaT345 "), "FLAT345");
  assert.equal(formatCouponCode("flat345"), "Flat345");
  assert.equal(formatCouponCode("SAVE345"), "");
  for (let index = 0; index < 100; index += 1) {
    assert.match(generateCouponCode(), /^Flat\d{3,5}$/);
  }
});

test("Friday campaign timing and cycle use the configured timezone", () => {
  const before = new Date("2026-10-30T12:59:00.000Z");
  const due = new Date("2026-10-30T13:00:00.000Z");
  assert.equal(isFridayCampaignDue(before, "Asia/Karachi"), false);
  assert.equal(isFridayCampaignDue(due, "Asia/Karachi"), true);
  assert.equal(fridayCampaignCycle(due, "Asia/Karachi"), "2026-W44");
});

test("birthday matching uses the stored calendar date and requested timezone", () => {
  assert.equal(
    isCustomerBirthday(new Date("1990-10-30T00:00:00.000Z"), new Date("2026-10-30T22:00:00.000Z"), "UTC"),
    true
  );
  assert.equal(
    isCustomerBirthday(new Date("1990-10-30T00:00:00.000Z"), new Date("2026-10-31T00:00:00.000Z"), "UTC"),
    false
  );
});

test("coupon expiry is fixed from issuance time", () => {
  const now = new Date("2026-10-28T15:00:00.000Z");
  assert.equal(expiryDate({ now, hours: 72 }).toISOString(), "2026-10-31T15:00:00.000Z");
});
