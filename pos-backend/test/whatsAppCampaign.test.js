const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
process.env.WHATSAPP_CAMPAIGN_PROVIDER = "mock";
process.env.WHATSAPP_CAMPAIGN_DEFAULT_COUNTRY_CODE = "92";
process.env.WHATSAPP_CAMPAIGN_TEMPLATE_PREVIEW = "Hi {{1}}!\\nDiscount {{2}}%\nCode {{3}}\nMinimum Rs. {{4}}\nExpiry {{5}}";
process.env.WHATSAPP_CLOUD_APP_SECRET = "campaign-test-secret";
const provider = require("../services/whatsAppCampaignProvider");
const { eligibilityFor, normalizeEligibleOrderStatuses } = require("../services/whatsAppCampaignService");
const { chooseDiscount } = require("../services/whatsAppCampaignCouponService");

test("normalizes local Pakistani mobile numbers for WhatsApp Cloud API", () => {
  assert.equal(provider.normalizeNumber("0300 123 4567"), "923001234567");
  assert.equal(provider.normalizeNumber("+92 300 1234567"), "923001234567");
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

test("campaign discount selection supports the 8 percent tier", () => {
  assert.equal(chooseDiscount({ discountOptions: [8], discountWeights: { 8: 1 } }), 8);
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