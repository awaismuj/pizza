const test = require("node:test");
const assert = require("node:assert/strict");
const { daysInRange, monthlyAccrualDays } = require("./staffLeaveAccrualService");

test("leave accrual prorates by days employed in the month", () => {
  assert.equal(daysInRange("2024-02-01", "2024-02-29"), 29);
  assert.equal(daysInRange("2024-02-15", "2024-02-29"), 15);
  assert.equal(monthlyAccrualDays(24, 29, 29), 2);
  assert.equal(monthlyAccrualDays(24, 15, 29), 1.03);
});

test("leave accrual does not grant days outside employment", () => {
  assert.equal(daysInRange("2024-03-01", "2024-02-29"), 0);
  assert.equal(monthlyAccrualDays(12, 0, 31), 0);
});
