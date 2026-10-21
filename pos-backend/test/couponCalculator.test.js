const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateDiscount, normalizePhone } = require("../utils/couponCalculator");

const items = [
  { dishId: "pizza", categoryId: "pizzas", price: 1000, quantity: 2 },
  { dishId: "drink", categoryId: "drinks", price: 200, quantity: 1 },
  { dealId: "combo", isDeal: true, price: 1500, quantity: 1 },
];

test("calculates a percentage coupon from eligible items and honors its cap", () => {
  const result = calculateDiscount(
    { discountType: "percentage", discountValue: 20, maximumDiscount: 250 },
    items,
    3700
  );

  assert.deepEqual(result, { discountAmount: 250, eligibleSubtotal: 3700 });
});

test("calculates fixed coupons only against eligible products and excluded categories", () => {
  const result = calculateDiscount(
    {
      discountType: "fixed",
      discountValue: 300,
      eligibleCategories: ["pizzas"],
      excludedProducts: ["pizza-small"],
    },
    items,
    3700
  );

  assert.deepEqual(result, { discountAmount: 300, eligibleSubtotal: 2000 });
});

test("does not discount deals when product/category restrictions are configured", () => {
  assert.throws(
    () =>
      calculateDiscount(
        { discountType: "fixed", discountValue: 250, eligibleProducts: ["another-item"] },
        [{ dealId: "combo", isDeal: true, price: 1500, quantity: 1 }],
        1500
      ),
    /restricted to selected products/
  );
});

test("includes deal value for unrestricted coupons and never exceeds eligible subtotal", () => {
  assert.deepEqual(
    calculateDiscount(
      { discountType: "fixed", discountValue: 9000 },
      [{ dealId: "combo", isDeal: true, price: 1500, quantity: 1 }],
      1500
    ),
    { discountAmount: 1500, eligibleSubtotal: 1500 }
  );
});

test("enforces minimum order value and normalizes customer phone keys", () => {
  assert.throws(
    () => calculateDiscount({ discountType: "fixed", discountValue: 100, minimumSubtotal: 2000 }, items, 1200),
    /eligible items/
  );
  assert.equal(normalizePhone("+92 300-1234567"), "3001234567");
});
