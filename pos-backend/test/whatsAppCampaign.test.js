const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
process.env.WHATSAPP_CAMPAIGN_PROVIDER = "mock";
process.env.WHATSAPP_CAMPAIGN_DEFAULT_COUNTRY_CODE = "92";
process.env.WHATSAPP_CAMPAIGN_TEMPLATE_PREVIEW = "Hi {{1}}!\\nDiscount {{2}}%\nCode {{3}}\nMinimum Rs. {{4}}\nExpiry {{5}}";
process.env.WHATSAPP_CLOUD_APP_SECRET = "campaign-test-secret";
const provider = require("../services/whatsAppCampaignProvider");
const { digitsExpression, eligibilityFor, normalizeEligibleOrderStatuses, selectionFilter } = require("../services/whatsAppCampaignService");
const { normalizeContactPhone } = require("../services/customerContactService");
const { chooseDiscount } = require("../services/whatsAppCampaignCouponService");
const Customer = require("../models/customerModel");
const Coupon = require("../models/couponModel");
const WhatsAppCampaign = require("../models/whatsAppCampaignModel");

test("normalizes local Pakistani mobile numbers for WhatsApp Cloud API", () => {
  assert.equal(provider.normalizeNumber("0300 123 4567"), "923001234567");
  assert.equal(provider.normalizeNumber("+92 300 1234567"), "923001234567");
  assert.equal(provider.normalizeNumber("0092-300-1234567"), "923001234567");
  assert.equal(provider.normalizeNumber("0092 (0300) 123-4567"), "923001234567");
  assert.equal(provider.normalizeNumber("0300-123-4567"), "923001234567");
});

test("requires active customer, explicit consent, and valid WhatsApp phone", () => {
  assert.deepEqual(eligibilityFor({ active: true, marketingConsent: true, orderCount: 1, phone: "03001234567" }), { eligible: true, reason: "" });
  assert.equal(eligibilityFor({ active: true, marketingConsent: false, phone: "03001234567" }).eligible, false);
  assert.equal(eligibilityFor({ active: false, marketingConsent: true, phone: "03001234567" }).eligible, false);
  assert.equal(eligibilityFor({ active: true, marketingConsent: true, orderCount: 0, phone: "03001234567" }).eligible, false);
  assert.equal(eligibilityFor({ active: true, marketingConsent: true, phone: "not-a-number" }).eligible, false);
});

test("campaign order statuses exclude cancelled and payment-verification orders by default", () => {
  assert.deepEqual(normalizeEligibleOrderStatuses(), ["Completed", "Closed"]);
  assert.deepEqual(normalizeEligibleOrderStatuses(["Completed", "Cancelled", "Payment Pending Verification"]), ["Completed"]);
  assert.throws(() => normalizeEligibleOrderStatuses(["not-a-real-status"]));
});

test("campaign phone matching builds a digit-only expression without newer regex operators", () => {
  const expression = digitsExpression("$phone");
  const serialized = JSON.stringify(expression);
  assert.ok(expression.$reduce);
  assert.ok(serialized.includes('"$range"'));
  assert.ok(!serialized.includes("$regexReplace"));
});

test("customer phone search matches formatted numbers by their final nine digits", () => {
  const filter = selectionFilter({ search: "0301 331 0954" });
  assert.ok(filter.$or.some((entry) => entry.$expr?.$eq?.[1] === "313310954"));
});

test("order contact normalization deduplicates local and international phone formats", () => {
  const local = normalizeContactPhone("0300-123-4567");
  const international = normalizeContactPhone("+92 (300) 123 4567");
  assert.ok(local);
  assert.equal(local.phoneKey, international.phoneKey);
  assert.equal(normalizeContactPhone("12345"), null);
  assert.equal(normalizeContactPhone("not-a-phone-03001234567"), null);
});

test("phone-only customer contacts do not require storefront login credentials", () => {
  const customer = new Customer({
    name: "Order customer",
    phone: "03001234567",
    phoneKey: "contact-key",
    contactOnly: true,
  });
  assert.equal(customer.validateSync(), undefined);
});

test("campaign discount selection supports the 8 percent tier", () => {
  assert.equal(chooseDiscount({ discountOptions: [8], discountWeights: { 8: 1 } }), 8);
});

test("campaign discount selection supports custom percentages", () => {
  assert.equal(chooseDiscount({ discountOptions: [13], discountWeights: { 13: 1 } }), 13);
  const campaign = new WhatsAppCampaign({
    name: "Custom campaign",
    requestKey: "custom-campaign-request-key",
    discountOptions: [13],
    minimumOrderAmount: 1000,
    expiresAt: new Date(Date.now() + 86400000),
    selection: { mode: "all-eligible" },
    templateName: "approved_template",
    templateLanguage: "en",
    createdBy: new mongoose.Types.ObjectId(),
  });
  assert.equal(campaign.validateSync()?.errors?.discountOptions, undefined);

  const coupon = new Coupon({
    name: "Custom campaign coupon",
    code: "CUSTOM13",
    source: "whatsapp_campaign",
    campaignId: new mongoose.Types.ObjectId(),
    campaignDiscountPercentage: 13,
    discountType: "percentage",
    discountValue: 13,
  });
  assert.equal(coupon.validateSync()?.errors?.campaignDiscountPercentage, undefined);
});

test("renders sample values into the server-configured WhatsApp template", () => {
  const message = provider.templatePreview({ name: "Sam", discount: 7, code: "PIZZA7", minimum: 1000, expiry: "Oct 30, 2026" });
  assert.match(message, /Sam/);
  assert.match(message, /7% OFF/);
  assert.match(message, /PIZZA7/);
  assert.match(message, /Rs\. 1000/);
  assert.doesNotMatch(message, /\{\{[1-5]\}\}/);
});

test("verifies Cloud API webhook signatures over the exact raw body", () => {
  const body = Buffer.from('{"entry":[]}');
  const signature = `sha256=${crypto.createHmac("sha256", "campaign-test-secret").update(body).digest("hex")}`;
  assert.equal(provider.verifyWebhookSignature(body, signature), true);
  assert.equal(provider.verifyWebhookSignature(body, "sha256=bad"), false);
});