const crypto = require("crypto");
const config = require("../config/config");
const whatsappService = require("./whatsappService");

const campaignConfig = config.whatsappCampaign;

const normalizeNumber = (value) => {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  const countryCode = String(campaignConfig.defaultCountryCode || "");
  if (countryCode && digits.startsWith(countryCode)) {
    const nationalNumber = digits.slice(countryCode.length);
    if (nationalNumber.startsWith("0")) digits = `${countryCode}${nationalNumber.slice(1)}`;
  } else if (digits.startsWith("0")) {
    digits = `${countryCode}${digits.slice(1)}`;
  } else if (digits.length === 10 && countryCode === "92" && digits.startsWith("3")) {
    digits = `${countryCode}${digits}`;
  }
  return digits;
};

const assertConfigured = () => {
  if (campaignConfig.provider === "mock") {
    if (config.nodeEnv === "production") {
      throw new Error("Mock WhatsApp campaigns cannot send in production.");
    }
    return;
  }
  if (campaignConfig.provider === "linked") {
    const status = whatsappService.getStatus();
    if (status.status !== "ready") {
      throw new Error(`Link WhatsApp before sending campaign messages (current status: ${status.status}).`);
    }
    return;
  }
  if (campaignConfig.provider !== "cloud") throw new Error("Unsupported WhatsApp campaign provider.");
  if (config.nodeEnv !== "production") throw new Error("WhatsApp Cloud campaigns are restricted to production; development and tests must use the mock provider.");
  const hasAllTemplateParameters = [1, 2, 3, 4, 5].every((index) => campaignConfig.templatePreviewText?.includes(`{{${index}}}`));
  if (!campaignConfig.phoneNumberId || !campaignConfig.accessToken || !campaignConfig.appSecret || !campaignConfig.verifyToken
    || !campaignConfig.templateName || !campaignConfig.templateLanguage || !hasAllTemplateParameters) {
    throw new Error("Configure the approved WhatsApp template, five preview parameters, Cloud API credentials, and webhook secrets first.");
  }
}

const templatePreview = ({ name, discount, code, minimum, expiry }) => {
  const template = campaignConfig.templatePreviewText || "Hi {{1}}! 🍕 Enjoy a special treat from our pizza shop!\\n\\nYour exclusive discount: {{2}}% OFF\\nCoupon Code: {{3}}\\nMinimum Order: Rs. {{4}}\\nValid Until: {{5}}\\n\\nOrder now and enjoy your pizza!";
  return template
    .replaceAll("\\n", "\n")
    .replaceAll("{{1}}", String(name))
    .replaceAll("{{2}}", String(discount))
    .replaceAll("{{3}}", String(code))
    .replaceAll("{{4}}", String(minimum))
    .replaceAll("{{5}}", String(expiry));
};

const sendApprovedTemplate = async ({ to, name, discount, code, minimum, expiry, callbackId }) => {
  assertConfigured();
  const recipient = normalizeNumber(to);
  if (!/^\d{10,15}$/.test(recipient)) throw new Error("Recipient WhatsApp number is invalid.");
  const parameters = [name, discount, code, minimum, expiry].map((text) => ({ type: "text", text: String(text) }));

  if (campaignConfig.provider === "mock") {
    return { messageId: `mock_${callbackId || crypto.randomUUID()}`, provider: "mock" };
  }

  if (campaignConfig.provider === "linked") {
    return whatsappService.sendTextMessage({
      to: recipient,
      text: templatePreview({ name, discount, code, minimum, expiry }),
    });
  }

  const response = await fetch(`https://graph.facebook.com/${campaignConfig.cloudApiVersion}/${campaignConfig.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${campaignConfig.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
      type: "template",
      template: {
        name: campaignConfig.templateName,
        language: { code: campaignConfig.templateLanguage },
        components: [{ type: "body", parameters }],
      },
      biz_opaque_callback_data: callbackId || "",
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error?.message || `WhatsApp provider returned HTTP ${response.status}.`);
    error.providerStatus = response.status;
    const retryAfter = response.headers.get("retry-after");
    const retryAfterSeconds = Number(retryAfter);
    const retryAfterDate = Date.parse(retryAfter || "");
    error.retryAfterMs = response.status === 429
      ? Math.max(1000, Number.isFinite(retryAfterSeconds) && retryAfter
        ? retryAfterSeconds * 1000
        : Number.isFinite(retryAfterDate) ? retryAfterDate - Date.now() : 1000)
      : null;
    error.retryable = response.status === 429;
    throw error;
  }
  const messageId = result.messages?.[0]?.id;
  if (!messageId) throw new Error("WhatsApp provider accepted no message ID.");
  return { messageId, provider: "cloud" };
};

const sendTestTemplate = async ({ name, discount, code, minimum, expiry }) => {
  if (!campaignConfig.testNumber) throw new Error("Set the admin-approved WHATSAPP_CAMPAIGN_TEST_NUMBER before sending a test.");
  return sendApprovedTemplate({
    to: campaignConfig.testNumber,
    name,
    discount,
    code,
    minimum,
    expiry,
    callbackId: `test_${crypto.randomUUID()}`,
  });
};

const verifyWebhookSignature = (rawBody, signature) => {
  if (!campaignConfig.appSecret || !signature) return false;
  const expected = `sha256=${crypto.createHmac("sha256", campaignConfig.appSecret).update(rawBody).digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(String(signature));
  return expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

const verifyWebhookChallenge = ({ mode, token, challenge }) => {
  if (mode !== "subscribe" || !campaignConfig.verifyToken || token !== campaignConfig.verifyToken) return null;
  return challenge || null;
};

const getProviderStatus = () => ({
  provider: campaignConfig.provider,
  configured: campaignConfig.provider === "linked"
    ? whatsappService.getStatus().status === "ready"
    : Boolean(config.nodeEnv === "production" && campaignConfig.provider === "cloud" && campaignConfig.phoneNumberId && campaignConfig.accessToken
      && campaignConfig.appSecret && campaignConfig.verifyToken && campaignConfig.templateName && campaignConfig.templateLanguage
      && [1, 2, 3, 4, 5].every((index) => campaignConfig.templatePreviewText?.includes(`{{${index}}}`))),
  templateName: campaignConfig.templateName || null,
  templateLanguage: campaignConfig.templateLanguage,
  templatePreviewText: campaignConfig.templatePreviewText || null,
  testNumberConfigured: Boolean(campaignConfig.testNumber),
});

module.exports = {
  assertConfigured,
  getProviderStatus,
  normalizeNumber,
  sendApprovedTemplate,
  sendTestTemplate,
  templatePreview,
  verifyWebhookSignature,
  verifyWebhookChallenge,
};