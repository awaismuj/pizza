const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildCouponEmail,
  buildCouponMessage,
  discountText,
  escapeHtml,
  isValidEmail,
  maskEmail,
} = require("../services/couponDeliveryService");

const percentCoupon = {
  name: "Weekend 10",
  code: "WEEKEND10",
  discountType: "percentage",
  discountValue: 10,
  minimumSubtotal: 1000,
  maximumDiscount: 500,
  expiresAt: "2026-12-31T10:00:00.000Z",
  timezone: "Asia/Karachi",
  eligibleDishIds: [],
  eligibleCategoryIds: [],
};

const options = { brand: "Test Pizza", storeUrl: "https://shop.example" };

test("formats percentage and fixed discounts", () => {
  assert.equal(discountText(percentCoupon), "10% OFF");
  assert.equal(discountText({ discountType: "fixed", discountValue: 1500 }), "Rs 1,500 OFF");
});

test("WhatsApp message carries the code, limits, expiry and store link", () => {
  const text = buildCouponMessage({ name: "Awais", coupon: percentCoupon, code: "WEEKEND10", ...options });
  assert.match(text, /^Hi Awais! /);
  assert.match(text, /10% OFF/);
  assert.match(text, /Coupon code: WEEKEND10/);
  assert.match(text, /Minimum order: Rs 1,000/);
  assert.match(text, /Maximum discount: Rs 500/);
  assert.match(text, /Valid until: 31 Dec 2026/);
  assert.match(text, /Order now: https:\/\/shop\.example/);
});

test("message skips lines that do not apply and flags item-limited coupons", () => {
  const plain = { ...percentCoupon, minimumSubtotal: 0, maximumDiscount: null, expiresAt: null };
  const text = buildCouponMessage({ name: "", coupon: plain, code: "X", ...options });
  assert.match(text, /^Hi there! /);
  assert.doesNotMatch(text, /Minimum order|Maximum discount|Valid until/);

  const limited = { ...plain, eligibleDishIds: ["abc"] };
  assert.match(buildCouponMessage({ name: "A", coupon: limited, code: "X", ...options }), /selected items only/);
});

test("contact-only placeholder names are not greeted by name", () => {
  const text = buildCouponMessage({ name: "Order customer", coupon: percentCoupon, code: "X", ...options });
  assert.match(text, /^Hi there! /);
});

test("an invalid timezone falls back instead of throwing", () => {
  const text = buildCouponMessage({ name: "A", coupon: { ...percentCoupon, timezone: "Not/AZone" }, code: "X", ...options });
  assert.match(text, /Valid until: 31 Dec 2026/);
});

test("email escapes customer-controlled values", () => {
  const { subject, html } = buildCouponEmail({
    name: '<img src=x onerror="alert(1)">',
    coupon: { ...percentCoupon, name: "<b>x</b>" },
    code: "A&B",
    ...options,
  });
  assert.match(subject, /10% OFF/);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
  assert.match(html, /A&amp;B/);
});

test("escapeHtml handles all special characters and nullish input", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
  assert.equal(escapeHtml(null), "");
});

test("maskEmail only reveals the first character and the domain", () => {
  assert.equal(maskEmail("awais@gmail.com"), "a***@gmail.com");
  assert.equal(maskEmail("nonsense"), "");
  assert.equal(maskEmail(undefined), "");
});

test("isValidEmail rejects blanks, spaces and missing domains", () => {
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("a b@c.co"), false);
  assert.equal(isValidEmail("a@b"), false);
  assert.equal(isValidEmail(""), false);
});
