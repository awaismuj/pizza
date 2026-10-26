const PromotionIssue = require("../models/promotionIssueModel");
const Customer = require("../models/customerModel");
const CustomerCoupon = require("../models/customerCouponModel");
const Coupon = require("../models/couponModel");
const config = require("../config/config");
const provider = require("./whatsAppCampaignProvider");
const { sendMail } = require("../utils/mailer");
const { runScheduledPromotions } = require("./promotionCampaignService");

let interval = null;
let running = false;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]));

const failIssueDelivery = async (issue, channel, message) => {
  await PromotionIssue.updateOne(
    { _id: issue._id, [`${channel}Status`]: "sending" },
    {
      $set: {
        [`${channel}Status`]: "failed",
        [`${channel}Error`]: String(message || "Delivery failed.").slice(0, 500),
        [`${channel}LeaseUntil`]: null,
      },
    }
  );
};

const claimDelivery = async (channel) => PromotionIssue.findOneAndUpdate(
  { [`${channel}Status`]: "queued" },
  {
    $set: {
      [`${channel}Status`]: "sending",
      [`${channel}LeaseUntil`]: new Date(Date.now() + 2 * 60 * 1000),
      [`${channel}Error`]: "",
    },
    $inc: { [`${channel}Attempts`]: 1 },
  },
  { new: true, sort: { createdAt: 1, _id: 1 } }
);

const validateIssue = async (issue) => {
  const [customer, assignment] = await Promise.all([
    Customer.findById(issue.customerId).select("name email phone marketingConsent emailVerifiedAt contactOnly active"),
    issue.customerCouponId
      ? CustomerCoupon.findById(issue.customerCouponId).populate("couponId")
      : Promise.resolve(null),
  ]);
  const now = new Date();
  if (!customer?.active || (!customer.contactOnly && !customer.emailVerifiedAt) || customer.marketingConsent !== true) {
    throw new Error("Customer is inactive, unverified, or promotional consent is no longer recorded.");
  }
  const coupon = assignment?.couponId || (issue.couponId ? await Coupon.findById(issue.couponId) : null);
  if ((assignment && (assignment.status !== "active" || assignment.redemptionCount >= assignment.redemptionLimit))
    || !coupon || coupon.status !== "active" || (coupon.usageLimit != null && coupon.redemptionCount >= coupon.usageLimit)) {
    throw new Error("Coupon assignment is no longer active.");
  }
  const startsAt = assignment?.startsAt || coupon.startsAt;
  const expiresAt = assignment?.expiresAt || coupon.expiresAt;
  if ((startsAt && startsAt > now) || (expiresAt && expiresAt <= now)) {
    throw new Error("Coupon assignment is not currently valid.");
  }
  return {
    customer,
    assignment: assignment || { code: coupon.code, expiresAt, startsAt },
    coupon,
  };
};

const deliverEmail = async () => {
  const issue = await claimDelivery("email");
  if (!issue) return false;
  try {
    const { customer, assignment, coupon } = await validateIssue(issue);
    if (!/^\S+@\S+\.\S+$/.test(String(customer.email || ""))) throw new Error("Customer email address is missing or invalid.");
    if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) throw new Error("SMTP is not configured.");
    const expiry = assignment.expiresAt
      ? new Intl.DateTimeFormat("en-PK", { timeZone: coupon.timezone || "Asia/Karachi", dateStyle: "medium", timeStyle: "short" }).format(assignment.expiresAt)
      : "No expiry";
    const result = await sendMail({
      to: customer.email,
      subject: `Your ${coupon.name} coupon`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#222"><h2>Hello ${escapeHtml(customer.name || "Customer")},</h2><p>Your coupon code:</p><p style="font-size:24px;font-weight:bold;letter-spacing:2px">${escapeHtml(assignment.code)}</p><p><strong>${coupon.discountType === "percentage" ? `${escapeHtml(coupon.discountValue)}% off` : `Rs ${Number(coupon.discountValue).toLocaleString("en-US")} off`}</strong> · Minimum order Rs ${Number(coupon.minimumSubtotal || 0).toLocaleString("en-US")}</p><p>Valid until ${escapeHtml(expiry)}. Terms and eligible items apply.</p><p><a href="${escapeHtml(config.storeUrl)}">Order online</a></p><p>You can withdraw promotional consent in your customer account settings.</p></div>`,
    });
    if (result?.skipped) throw new Error("SMTP is not configured; the email was not sent.");
    await PromotionIssue.updateOne(
      { _id: issue._id, emailStatus: "sending" },
      { $set: { emailStatus: "sent", emailMessageId: String(result?.messageId || "").slice(0, 200), emailError: "", emailLeaseUntil: null } }
    );
  } catch (error) {
    await failIssueDelivery(issue, "email", error.message);
  }
  return true;
};

const deliverWhatsApp = async () => {
  const issue = await claimDelivery("whatsapp");
  if (!issue) return false;
  try {
    const { customer, assignment, coupon } = await validateIssue(issue);
    const providerStatus = provider.getProviderStatus();
    if (providerStatus.provider !== "cloud" || !providerStatus.configured) {
      throw new Error("WhatsApp Cloud API and approved template are not configured; use manual WhatsApp handoff.");
    }
    const expiry = assignment.expiresAt
      ? new Intl.DateTimeFormat("en-PK", { timeZone: coupon.timezone || "Asia/Karachi", dateStyle: "medium" }).format(assignment.expiresAt)
      : "No expiry";
    const phone = provider.normalizeNumber(customer.phone);
    if (!/^\d{10,15}$/.test(phone)) throw new Error("Customer mobile number is missing or invalid.");
    if (coupon.discountType !== "percentage") throw new Error("Automated WhatsApp template delivery supports percentage discounts only.");
    const result = await provider.sendApprovedTemplate({
      to: phone,
      name: String(customer.name || "Customer").slice(0, 60),
      discount: coupon.discountValue,
      code: assignment.code,
      minimum: Number(coupon.minimumSubtotal || 0).toLocaleString("en-US"),
      expiry,
      callbackId: `promotion_${issue._id}`,
    });
    if (result.provider !== "cloud") throw new Error("Mock provider did not deliver a real WhatsApp message.");
    await PromotionIssue.updateOne(
      { _id: issue._id, whatsappStatus: "sending" },
      { $set: { whatsappStatus: "sent", whatsappMessageId: String(result.messageId || "").slice(0, 200), whatsappError: "", whatsappLeaseUntil: null } }
    );
  } catch (error) {
    await failIssueDelivery(issue, "whatsapp", error.message);
  }
  return true;
};

const runOnce = async () => {
  if (running) return;
  running = true;
  try {
    const expiredLease = new Date();
    await PromotionIssue.updateMany(
      { emailStatus: "sending", emailLeaseUntil: { $lte: expiredLease } },
      { $set: { emailStatus: "failed", emailError: "Worker stopped during send; delivery outcome is uncertain. Review before retrying.", emailLeaseUntil: null } }
    );
    await PromotionIssue.updateMany(
      { whatsappStatus: "sending", whatsappLeaseUntil: { $lte: expiredLease } },
      { $set: { whatsappStatus: "failed", whatsappError: "Worker stopped during send; delivery outcome is uncertain. Review before retrying.", whatsappLeaseUntil: null } }
    );
    await deliverEmail();
    await deliverWhatsApp();
    await runScheduledPromotions();
  } catch (error) {
    console.error("Coupon promotion worker failed:", error.message);
  } finally {
    running = false;
  }
};

const start = () => {
  if (interval) return;
  setTimeout(runOnce, 10000);
  interval = setInterval(runOnce, 30000);
};

module.exports = { runOnce, start };
