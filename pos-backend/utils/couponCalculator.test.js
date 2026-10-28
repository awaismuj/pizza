const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateCoupon } = require("./couponCalculator");

const items = [
  { dishId: "dish-a", categoryId: "cat-pizza", price: 500, quantity: 2 },
  { dishId: "dish-b", categoryId: "cat-sides", price: 200, quantity: 1 },
];

test("percentage coupon caps the discount and only uses eligible products", () => {
  const result = calculateCoupon(
    {
      discountType: "percentage",
      discountValue: 20,
      maximumDiscountAmount: 150,
      eligibleDishIds: ["dish-a"],
    },
    items,
    { orderType: "pickup" }
  );
  assert.equal(result.eligibleSubtotal, 1000);
  assert.equal(result.discountAmount, 150);
});

test("fixed coupon cannot exceed the eligible subtotal", () => {
  const result = calculateCoupon(
    { discountType: "fixed", discountValue: 500, eligibleCategoryIds: ["cat-sides"] },
    items,
    { orderType: "dineIn" }
  );
  assert.equal(result.eligibleSubtotal, 200);
  assert.equal(result.discountAmount, 200);
});

test("minimums and qualifying quantity use eligible products only", () => {
  const coupon = {
    discountType: "fixed",
    discountValue: 100,
    minimumOrderAmount: 300,
    minimumQualifyingQuantity: 2,
    eligibleCategoryIds: ["cat-sides"],
  };
  assert.match(calculateCoupon(coupon, items, { orderType: "pickup" }).error, /Minimum order/);
  assert.match(
    calculateCoupon({ ...coupon, minimumOrderAmount: 100 }, items, { orderType: "pickup" }).error,
    /eligible item\(s\)/
  );
});

test("free delivery is limited to the actual delivery fee and delivery order type", () => {
  const coupon = { discountType: "freeDelivery", discountValue: 0 };
  assert.equal(calculateCoupon(coupon, items, { orderType: "delivery", deliveryFee: 250 }).deliveryDiscount, 250);
  assert.match(calculateCoupon(coupon, items, { orderType: "pickup", deliveryFee: 250 }).error, /delivery/);
});

test("coupon restrictions and non-stacking are enforced", () => {
  const typeRestricted = calculateCoupon(
    { discountType: "fixed", discountValue: 50, eligibleOrderTypes: ["delivery"] },
    items,
    { orderType: "pickup" }
  );
  assert.match(typeRestricted.error, /selected order type/);
  assert.match(
    calculateCoupon({ discountType: "fixed", discountValue: 50 }, items, {
      orderType: "pickup",
      hasPromotion: true,
    }).error,
    /cannot be combined/
  );
});
