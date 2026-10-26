const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateCoupon } = require("../services/couponRules");
const customerPhoneKey = require("../utils/customerPhoneKey");

const coupon = (overrides = {}) => ({
  code: "SAVE10",
  status: "active",
  discountType: "percentage",
  discountValue: 10,
  minimumSubtotal: 0,
  maximumDiscount: null,
  eligibleDishIds: [],
  excludedDishIds: [],
  eligibleCategoryIds: [],
  excludedCategoryIds: [],
  channels: ["Online", "POS"],
  usageLimit: null,
  redemptionCount: 0,
  firstOrderOnly: false,
  allowStacking: false,
  ...overrides,
});

const order = (overrides = {}) => ({
  items: [{ dishId: "dish-1", categoryId: "category-1", subtotal: 1000 }],
  subtotal: 1000,
  channel: "Online",
  hasPreviousOrder: false,
  existingDiscount: 0,
  now: new Date("2026-10-22T00:00:00.000Z"),
  ...overrides,
});

test("coupon customer lookup matches local and international formats of the same mobile number", () => {
  assert.equal(customerPhoneKey("0301 331 0954"), customerPhoneKey("+92 301 331 0954"));
});

test("calculates percentage discounts and applies the maximum cap", () => {
  const result = calculateCoupon(coupon({ maximumDiscount: 75 }), order());
  assert.equal(result.valid, true);
  assert.equal(result.discountAmount, 75);
});

test("calculates fixed discounts without exceeding eligible subtotal", () => {
  const result = calculateCoupon(coupon({ discountType: "fixed", discountValue: 500 }), order({
    items: [{ dishId: "dish-1", categoryId: "category-1", subtotal: 200 }],
  }));
  assert.equal(result.discountAmount, 200);
});

test("rejects expired, not-yet-started, minimum, channel, and first-order failures", () => {
  assert.equal(calculateCoupon(coupon({ expiresAt: new Date("2026-10-21") }), order()).valid, false);
  assert.equal(calculateCoupon(coupon({ startsAt: new Date("2026-10-23") }), order()).message, "Coupon is not active yet.");
  assert.match(calculateCoupon(coupon({ minimumSubtotal: 1001 }), order()).message, /Minimum eligible/);
  assert.match(calculateCoupon(coupon({ channels: ["POS"] }), order()).message, /order channel/);
  assert.match(calculateCoupon(coupon({ firstOrderOnly: true }), order({ hasPreviousOrder: true })).message, /first order/);
});

test("applies inclusion and exclusion restrictions to the eligible subtotal", () => {
  const restricted = coupon({ eligibleCategoryIds: ["category-1"], excludedDishIds: ["dish-1"] });
  const result = calculateCoupon(restricted, order());
  assert.equal(result.valid, false);
  assert.match(result.message, /selected products/);
});

test("matches selected dishes or categories, with exclusions taking priority and discounts capped to eligible value", () => {
  const result = calculateCoupon(coupon({
    discountType: "fixed",
    discountValue: 1500,
    eligibleDishIds: ["dish-2"],
    eligibleCategoryIds: ["category-1"],
    excludedDishIds: ["dish-2"],
  }), order({
    items: [
      { dishId: "dish-1", categoryId: "category-1", subtotal: 1000 },
      { dishId: "dish-2", categoryId: "category-2", subtotal: 500 },
      { dishId: "dish-3", categoryId: "category-3", subtotal: 900 },
    ],
    subtotal: 2400,
  }));

  assert.equal(result.valid, true);
  assert.equal(result.eligibleSubtotal, 1000);
  assert.equal(result.discountAmount, 1000);
});

test("rejects exhausted campaigns and non-stackable coupons", () => {
  assert.match(calculateCoupon(coupon({ usageLimit: 4, redemptionCount: 4 }), order()).message, /usage limit/);
  assert.match(calculateCoupon(coupon(), order({ existingDiscount: 100 })).message, /combined/);
  assert.match(calculateCoupon(coupon(), order({ items: [{ ...order().items[0], isDeal: true }] })).message, /combined/);
  assert.equal(calculateCoupon(coupon({ allowStacking: true }), order({ existingDiscount: 100 })).valid, true);
});
