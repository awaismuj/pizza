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
  isDailyCampaignDue,
  isCustomerBirthday,
  expiryDate,
} = require("./couponCampaignRules");

test("coupon codes normalize case-insensitively and accept campaign and Flat formats", () => {
  assert.equal(normalizeCouponCode(" fLaT345 "), "FLAT345");
  assert.equal(formatCouponCode("flat345"), "Flat345");
  assert.equal(formatCouponCode("SAVE345"), "");
  assert.equal(
    formatCouponCode("wacmp_1795c7023560fed71ce5f9c7ae6dc988"),
    "WACMP_1795C7023560FED71CE5F9C7AE6DC988"
  );
  for (let index = 0; index < 100; index += 1) {
    assert.match(generateCouponCode(), /^Flat\d{3,4}$/);
  }
});

test("Pakistani mobile formats normalize to one canonical mobile", () => {
  const normalizePakistaniMobile = require("./normalizePakistaniMobile");
  const pakistaniMobileKey = require("./pakistaniMobileKey");
  const phones = [
    "03013310954",
    "+923013310954",
    "0092 301 3310954",
    "+92 (0) 301-3310954",
  ];
  for (const phone of phones) {
    assert.equal(normalizePakistaniMobile(phone), "3013310954");
  }
  assert.equal(new Set(phones.map(pakistaniMobileKey)).size, 1);
});

test("Friday campaign timing and cycle use the configured timezone", () => {
  const before = new Date("2026-10-30T12:59:00.000Z");
  const due = new Date("2026-10-30T13:00:00.000Z");
  assert.equal(isFridayCampaignDue(before, "Asia/Karachi"), false);
  assert.equal(isFridayCampaignDue(due, "Asia/Karachi"), true);
  assert.equal(fridayCampaignCycle(due, "Asia/Karachi"), "2026-W44");
});

test("campaign schedules honor the configured weekday, time, and timezone", () => {
  const before = new Date("2026-10-30T13:59:00.000Z");
  const due = new Date("2026-10-30T14:00:00.000Z");
  assert.equal(isFridayCampaignDue(before, "Asia/Karachi", 5, "19:00"), false);
  assert.equal(isFridayCampaignDue(due, "Asia/Karachi", 5, "19:00"), true);
  assert.equal(isFridayCampaignDue(due, "Asia/Karachi", 4, "18:00"), false);
  assert.equal(isDailyCampaignDue(before, "Asia/Karachi", "19:00"), false);
  assert.equal(isDailyCampaignDue(due, "Asia/Karachi", "19:00"), true);
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
