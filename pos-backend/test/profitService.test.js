const test = require("node:test");
const assert = require("node:assert/strict");
const { orderRevenue } = require("../utils/profitService");

test("uses discounted sales before tax and includes the delivery fee in revenue", () => {
  assert.equal(
    orderRevenue({
      bills: {
        total: 1000,
        tax: 160,
        totalWithTax: 1210,
        deliveryFee: 50,
      },
    }),
    1050
  );
});

test("falls back to total-with-tax for legacy orders without a sales total", () => {
  assert.equal(orderRevenue({ bills: { totalWithTax: 1210 } }), 1210);
});
