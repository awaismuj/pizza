const config = require("../config/config");

// Builds the text a staff member sends to a customer for a coupon, and the
// matching email. Kept free of database/network code so it is easy to test.

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

// "awais@gmail.com" -> "a***@gmail.com". The admin screen only needs to know
// that an email exists, not to read it back.
const maskEmail = (email) => {
  const [local = "", domain = ""] = String(email || "").split("@");
  if (!local || !domain) return "";
  return `${local[0]}***@${domain}`;
};

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(String(value || "").trim()) && String(value).length <= 254;

const discountText = (coupon) =>
  coupon.discountType === "percentage"
    ? `${Number(coupon.discountValue)}% OFF`
    : `Rs ${Number(coupon.discountValue).toLocaleString("en-US")} OFF`;

const formatDate = (value, timezone) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const options = { day: "numeric", month: "short", year: "numeric" };
  try {
    return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: timezone || "Asia/Karachi" }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "Asia/Karachi" }).format(date);
  }
};

const limitedToItems = (coupon) =>
  (coupon.eligibleDishIds?.length || 0) > 0 || (coupon.eligibleCategoryIds?.length || 0) > 0;

// The facts both the WhatsApp text and the email show, in one place.
const couponFacts = (coupon) => {
  const facts = [];
  const minimum = Number(coupon.minimumSubtotal || 0);
  if (minimum > 0) facts.push(`Minimum order: Rs ${minimum.toLocaleString("en-US")}`);
  const maximum = Number(coupon.maximumDiscount || 0);
  if (coupon.discountType === "percentage" && maximum > 0) {
    facts.push(`Maximum discount: Rs ${maximum.toLocaleString("en-US")}`);
  }
  if (limitedToItems(coupon)) facts.push("Valid on selected items only");
  const expiry = formatDate(coupon.expiresAt, coupon.timezone);
  if (expiry) facts.push(`Valid until: ${expiry}`);
  return facts;
};

const greetingName = (name) => {
  const clean = String(name || "").trim();
  return clean && clean.toLowerCase() !== "order customer" ? clean : "there";
};

const buildCouponMessage = ({ name, coupon, code, brand = config.storeName, storeUrl = config.storeUrl }) =>
  [
    `Hi ${greetingName(name)}! 🍕 A special offer from ${brand}.`,
    "",
    `${discountText(coupon)} on your order`,
    `Coupon code: ${code}`,
    ...couponFacts(coupon),
    "",
    `Order now: ${storeUrl}`,
  ].join("\n");

const buildCouponEmail = ({ name, coupon, code, brand = config.storeName, storeUrl = config.storeUrl }) => {
  const facts = couponFacts(coupon)
    .map((fact) => `<li style="margin:4px 0;">${escapeHtml(fact)}</li>`)
    .join("");
  return {
    subject: `${discountText(coupon)} — your ${brand} coupon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #222;">
        <h2 style="margin-bottom: 4px;">Hi ${escapeHtml(greetingName(name))}! 🍕</h2>
        <p style="margin-top: 0;">Here is a special offer from ${escapeHtml(brand)}.</p>
        <div style="background:#fff7e0;border:2px dashed #f6b100;border-radius:10px;padding:18px;text-align:center;margin:18px 0;">
          <div style="font-size:22px;font-weight:bold;">${escapeHtml(discountText(coupon))}</div>
          <div style="font-size:13px;color:#666;margin-top:8px;">Your coupon code</div>
          <div style="font-size:24px;font-weight:bold;letter-spacing:2px;margin-top:4px;">${escapeHtml(code)}</div>
        </div>
        ${facts ? `<ul style="padding-left:18px;color:#444;">${facts}</ul>` : ""}
        <p style="margin-top:22px;">
          <a href="${escapeHtml(storeUrl)}" style="background:#f6b100;color:#1f1f1f;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:bold;">Order now</a>
        </p>
      </div>
    `,
  };
};

module.exports = {
  buildCouponEmail,
  buildCouponMessage,
  discountText,
  escapeHtml,
  isValidEmail,
  maskEmail,
};
