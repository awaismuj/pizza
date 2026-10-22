const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateDepreciation,
  daysInServiceForPeriod,
  periodBounds,
  bookValueAt,
} = require("./assetAccounting");

test("straight-line depreciation prorates the first month and preserves residual value", () => {
  const bounds = periodBounds("2025-01");
  const days = daysInServiceForPeriod("2025-01", new Date("2025-01-16T00:00:00.000Z"));
  const amount = calculateDepreciation({
    method: "StraightLine",
    acquisitionCost: 1200,
    residualValue: 120,
    usefulLifeYears: 3,
    openingBookValue: 1200,
    daysInService: days,
    daysInPeriod: bounds.days,
  });
  assert.equal(amount, 15.48);
  assert.ok(1200 - amount >= 120);
});

test("declining-balance depreciation uses opening book value and the double-declining rate", () => {
  assert.equal(calculateDepreciation({
    method: "DecliningBalance",
    acquisitionCost: 1200,
    residualValue: 200,
    usefulLifeYears: 5,
    openingBookValue: 1000,
    daysInService: 30,
    daysInPeriod: 30,
  }), 33.33);
});

test("units-of-production uses actual units and caps at residual value", () => {
  assert.equal(calculateDepreciation({
    method: "UnitsOfProduction",
    acquisitionCost: 1000,
    residualValue: 100,
    usefulLifeYears: 5,
    openingBookValue: 115,
    daysInService: 30,
    daysInPeriod: 30,
    unitsProduced: 100,
    estimatedLifetimeUsage: 1000,
  }), 15);
});

test("book value includes only posted periods up to the requested date", () => {
  assert.deepEqual(bookValueAt({
    acquisitionCost: 500,
    depreciationRows: [
      { period: "2025-01", depreciation: 10 },
      { period: "2025-02", depreciation: 20 },
    ],
    asOf: new Date("2025-01-31T23:59:59.999Z"),
  }), { accumulatedDepreciation: 10, currentBookValue: 490 });
});

test("rejects invalid accounting periods and production inputs", () => {
  assert.throws(() => periodBounds("2025-13"), /YYYY-MM/);
  assert.throws(() => calculateDepreciation({
    method: "UnitsOfProduction",
    acquisitionCost: 1000,
    residualValue: 0,
    usefulLifeYears: 5,
    openingBookValue: 1000,
    daysInService: 30,
    daysInPeriod: 30,
    unitsProduced: 5,
    estimatedLifetimeUsage: 0,
  }), /lifetime usage/);
});
