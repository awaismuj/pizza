const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_PROMOTION_SETTINGS,
  calculateExpiry,
  choosePercentage,
  getPromotionSettings,
  validatePromotionSettings,
} = require("../utils/promotionSettings");
const { createCustomerCouponCode } = require("../utils/customerCouponCode");

test("promotion defaults pass validation and preserve configured campaigns", () => {
  assert.equal(validatePromotionSettings(getPromotionSettings()), null);
  assert.deepEqual(DEFAULT_PROMOTION_SETTINGS.friday.percentages, [4, 5, 6, 7]);
  assert.equal(DEFAULT_PROMOTION_SETTINGS.friday.timezone, "Asia/Karachi");
});

test("rejects invalid discounts, expiry, channels and timezones", () => {
  const settings = getPromotionSettings();
  settings.welcome.percentages = [0, 101];
  assert.match(validatePromotionSettings(settings), /percentages/);

  settings.welcome.percentages = [2, 3];
  settings.welcome.expiryHours = 0;
  assert.match(validatePromotionSettings(settings), /expiryHours/);

  settings.welcome.expiryHours = 72;
  settings.welcome.eligibleChannels = [];
  assert.match(validatePromotionSettings(settings), /eligibleChannels/);

  settings.welcome.eligibleChannels = ["Online"];
  settings.friday.timezone = "Not/A_Timezone";
  assert.match(validatePromotionSettings(settings), /timezone/);
});

test("random percentage selection respects configured list and precision range", () => {
  for (let index = 0; index < 100; index += 1) {
    assert.ok([3, 7.5, 10].includes(choosePercentage({ discountMode: "list", percentages: [3, 7.5, 10] })));
    const ranged = choosePercentage({ discountMode: "range", rangeMin: 4.2, rangeMax: 5.1, precision: 1 });
    assert.ok(ranged >= 4.2 && ranged <= 5.1);
    assert.equal(Math.round(ranged * 10), ranged * 10);
  }
});

test("duration expiry is absolute while calendar expiry uses the configured local timezone", () => {
  const now = new Date("2025-04-01T06:00:00.000Z");
  assert.equal(
    calculateExpiry({ expiryMode: "duration", expiryHours: 72 }, now, "Asia/Karachi").toISOString(),
    "2025-04-04T06:00:00.000Z"
  );
  assert.equal(
    calculateExpiry({ expiryMode: "calendar", calendarDays: 3, expiryTime: "23:59" }, now, "Asia/Karachi").toISOString(),
    "2025-04-04T18:59:00.000Z"
  );
  assert.equal(calculateExpiry({ expiryMode: "none" }, now, "Asia/Karachi"), null);
});

test("fixed discounts, campaign dates, limits, and names are validated and configurable", () => {
  const settings = getPromotionSettings();
  settings.friday.campaignName = "Weekend special";
  settings.friday.description = "A limited-time offer";
  settings.friday.discountType = "fixed";
  settings.friday.fixedAmount = 325;
  settings.friday.sendWhatsApp = false;
  settings.friday.startsAt = new Date("2025-04-01T00:00:00.000Z");
  settings.friday.endsAt = new Date("2025-04-02T00:00:00.000Z");
  settings.friday.redemptionLimitPerCustomer = 3;
  settings.friday.maxCampaignRedemptions = 250;
  assert.equal(validatePromotionSettings(settings), null);
  assert.equal(choosePercentage(settings.friday), 325);

  settings.friday.redemptionLimitPerCustomer = 0;
  assert.match(validatePromotionSettings(settings), /redemptionLimitPerCustomer/);
  settings.friday.redemptionLimitPerCustomer = 3;
  settings.friday.endsAt = settings.friday.startsAt;
  assert.match(validatePromotionSettings(settings), /endsAt must be after startsAt/);
});

test("customer coupon codes are short, easy to read and safely formatted", () => {
  const codes = Array.from({ length: 100 }, () => createCustomerCouponCode());
  for (const code of codes) assert.match(code, /^FLAT[2-9A-HJ-NP-Z]{4}$/);
  assert.equal(new Set(codes).size, codes.length);
  assert.match(createCustomerCouponCode({ codePrefix: "SAVE", codeLength: 5, codeAlphabet: "23456789ABCDEFGHJKLMNPQRSTUVWXYZ" }), /^SAVE[2-9A-HJ-NP-Z]{5}$/);
});
