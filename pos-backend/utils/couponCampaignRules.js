const crypto = require("crypto");

const DEFAULT_COUPON_CAMPAIGNS = {
  welcome: {
    enabled: false,
    minimumSubtotal: 1000,
    percentages: [2, 3, 4],
    expiryHours: 72,
    maxOnePerCustomer: true,
  },
  friday: {
    automaticGeneration: false,
    minimumSubtotal: 0,
    percentages: [4, 5, 6, 7],
    expiryHours: 72,
    timezone: "Asia/Karachi",
  },
  birthday: {
    enabled: false,
    discountMode: "random",
    fixedPercentage: 5,
    percentages: [5, 6, 7],
    minimumSubtotal: 0,
    expiryHours: 72,
    timezone: "Asia/Karachi",
  },
};

const normalizeCouponCode = (code) => String(code || "").trim().toUpperCase();

const formatCouponCode = (code) => {
  const match = /^FLAT(\d+)$/i.exec(String(code || "").trim());
  return match ? `Flat${match[1]}` : "";
};

const generateCouponCode = () => `Flat${crypto.randomInt(100, 100000)}`;

const zonedParts = (date, timezone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
};

const fridayCampaignCycle = (date, timezone) => {
  const parts = zonedParts(date, timezone);
  const localDate = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  const day = localDate.getUTCDay() || 7;
  localDate.setUTCDate(localDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(localDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((localDate - yearStart) / 86400000) + 1) / 7);
  return `${localDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

const isFridayCampaignDue = (date, timezone) => {
  const parts = zonedParts(date, timezone);
  return parts.weekday === "Fri" && Number(parts.hour) >= 18;
};

const isCustomerBirthday = (dateOfBirth, date, timezone) => {
  if (!(dateOfBirth instanceof Date) || Number.isNaN(dateOfBirth.getTime())) return false;
  const current = zonedParts(date, timezone);
  return dateOfBirth.getUTCMonth() + 1 === Number(current.month) &&
    dateOfBirth.getUTCDate() === Number(current.day);
};

const expiryDate = ({ now = new Date(), hours = 72 }) =>
  new Date(now.getTime() + Number(hours) * 60 * 60 * 1000);

module.exports = {
  DEFAULT_COUPON_CAMPAIGNS,
  normalizeCouponCode,
  formatCouponCode,
  generateCouponCode,
  zonedParts,
  fridayCampaignCycle,
  isFridayCampaignDue,
  isCustomerBirthday,
  expiryDate,
};
