const test = require("node:test");
const assert = require("node:assert/strict");
const normalizeEmploymentType = require("./normalizeEmploymentType");

const allowedValues = [
  "Permanent",
  "Contract",
  "Part-Time",
  "Temporary",
  "Intern",
  "Daily Wage",
  "Hourly Employee",
];

test("maps legacy employment type values to current enum values", () => {
  assert.equal(normalizeEmploymentType("Full-time", allowedValues), "Permanent");
  assert.equal(normalizeEmploymentType("Full Time", allowedValues), "Permanent");
  assert.equal(normalizeEmploymentType("Fulltime", allowedValues), "Permanent");
  assert.equal(normalizeEmploymentType("Part Time", allowedValues), "Part-Time");
  assert.equal(normalizeEmploymentType("Daily wage", allowedValues), "Daily Wage");
  assert.equal(normalizeEmploymentType("Hourly", allowedValues), "Hourly Employee");
});

test("preserves valid enum values and falls back for missing or unknown values", () => {
  assert.equal(normalizeEmploymentType("  cOnTrAcT  ", allowedValues), "Contract");
  assert.equal(normalizeEmploymentType("", allowedValues), "Permanent");
  assert.equal(normalizeEmploymentType("Unrecognized", allowedValues), "Permanent");
});
