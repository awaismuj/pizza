const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeCouponCode,
  formatCouponCode,
  generateCouponCode,
  deduplicateCustomers,
  fridayCampaignCycle,
  birthdayCampaignCycle,
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

test("birthday campaign cycle uses the configured timezone's current year", () => {
  const now = new Date("2026-12-31T20:00:00.000Z");
  assert.equal(birthdayCampaignCycle(now, "Asia/Karachi"), "2027");
  assert.equal(birthdayCampaignCycle(now, "UTC"), "2026");
});

test("coupon expiry is fixed from issuance time", () => {
  const now = new Date("2026-10-28T15:00:00.000Z");
  assert.equal(expiryDate({ now, hours: 72 }).toISOString(), "2026-10-31T15:00:00.000Z");
});

test("customer deduplication combines case-insensitive emails and normalized phone numbers", () => {
  const { customers, duplicateCount } = deduplicateCustomers([
    { _id: "a", name: "First", email: " FIRST@example.com ", phone: "+92 300 1234567" },
    { _id: "b", name: "Duplicate email", email: "first@example.com", phone: "0300 7654321" },
    { _id: "c", name: "Duplicate phone", email: "other@example.com", phone: "0092-300-1234567" },
    { _id: "d", name: "", email: "", phone: "" },
  ]);

  assert.equal(duplicateCount, 2);
  assert.equal(customers.length, 2);
  assert.ok(customers.some(({ customer }) => customer._id === "a"));
  assert.ok(customers.some(({ customer }) => customer._id === "d"));
});

test("customer deduplication joins identities connected through duplicate records", () => {
  const { customers, duplicateCount } = deduplicateCustomers([
    { _id: "a", email: "a@example.com", phone: "0300 1111111" },
    { _id: "b", email: "b@example.com", phone: "0300 1111111" },
    { _id: "c", email: "b@example.com", phone: "0300 2222222" },
  ]);

  assert.equal(customers.length, 1);
  assert.equal(duplicateCount, 2);
  assert.deepEqual(customers[0].customerIds.sort(), ["a", "b", "c"]);
});

test("short phone values do not merge otherwise unrelated customers", () => {
  const { customers } = deduplicateCustomers([
    { _id: "a", phone: "123456" },
    { _id: "b", phone: "123456" },
  ]);

  assert.equal(customers.length, 2);
});
