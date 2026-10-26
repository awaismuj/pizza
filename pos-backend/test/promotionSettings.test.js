const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_PROMOTION_SETTINGS,
  calculateExpiry,
  choosePercentage,
  getPromotionSettings,
  validatePromotionSettings,
} = require("../utils/promotionSettings");

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
});
