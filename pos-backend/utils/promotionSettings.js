const crypto = require("crypto");

const DEFAULT_PROMOTION_SETTINGS = Object.freeze({
  global: {
    onlineCouponEntryEnabled: true,
    codePrefix: "FLAT",
    codeLength: 4,
    codeAlphabet: "23456789ABCDEFGHJKLMNPQRSTUVWXYZ",
    storeTimezone: "Asia/Karachi",
  },
  welcome: {
    campaignName: "Welcome offer",
    description: "A first-order offer for verified customers.",
    enabled: false,
    discountType: "percentage",
    fixedAmount: 500,
    percentages: [2, 3, 4],
    minimumSubtotal: 1000,
    maximumDiscount: null,
    allowStacking: false,
    startsAt: null,
    endsAt: null,
    maxCampaignRedemptions: null,
    redemptionLimitPerCustomer: 1,
    timezone: "Asia/Karachi",
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online"],
    sendEmail: false,
    sendWhatsApp: false,
  },
  friday: {
    campaignName: "Friday campaign",
    description: "A Friday promotion for eligible customers.",
    enabled: true,
    automaticGeneration: false,
    generationTime: "18:00",
    timezone: "Asia/Karachi",
    discountMode: "list",
    discountType: "percentage",
    fixedAmount: 500,
    percentages: [4, 5, 6, 7],
    rangeMin: 4,
    rangeMax: 7,
    precision: 1,
    minimumSubtotal: 1000,
    maximumDiscount: null,
    allowStacking: false,
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online", "POS"],
    sendEmail: false,
    sendWhatsApp: false,
    eligibleOrderStatuses: ["Completed", "Closed"],
    maxCouponsPerExecution: 20000,
    maxCampaignRedemptions: null,
    redemptionLimitPerCustomer: 1,
    requireMarketingConsent: true,
  },
  birthday: {
    campaignName: "Birthday coupon",
    description: "A birthday offer for eligible customers.",
    enabled: false,
    automaticGeneration: false,
    processingTime: "09:00",
    timezone: "Asia/Karachi",
    discountMode: "list",
    discountType: "percentage",
    fixedAmount: 500,
    percentages: [5, 6, 7],
    fixedPercentage: 5,
    rangeMin: 4,
    rangeMax: 8,
    precision: 1,
    minimumSubtotal: 1000,
    maximumDiscount: null,
    allowStacking: false,
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online", "POS"],
    sendEmail: false,
    sendWhatsApp: false,
    eligibleOrderStatuses: ["Completed", "Closed"],
    maxCouponsPerExecution: 20000,
    maxCampaignRedemptions: null,
    redemptionLimitPerCustomer: 1,
    requireMarketingConsent: true,
  },
  manual: {
    campaignName: "Manual coupon campaign",
    description: "A manually generated customer coupon campaign.",
    enabled: true,
    discountMode: "list",
    discountType: "percentage",
    fixedAmount: 500,
    percentages: [5, 7, 10],
    rangeMin: 5,
    rangeMax: 10,
    precision: 1,
    minimumSubtotal: 1000,
    maximumDiscount: null,
    allowStacking: false,
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online", "POS"],
    timezone: "Asia/Karachi",
    sendEmail: false,
    sendWhatsApp: false,
    maxCouponsPerExecution: 20000,
    maxCampaignRedemptions: null,
    redemptionLimitPerCustomer: 1,
    requireMarketingConsent: true,
  },
});

const getPromotionSettings = (value) => {
  const global = { ...DEFAULT_PROMOTION_SETTINGS.global, ...(value?.global || {}) };
  return {
    global,
    welcome: { ...DEFAULT_PROMOTION_SETTINGS.welcome, timezone: global.storeTimezone, ...(value?.welcome || {}) },
    friday: { ...DEFAULT_PROMOTION_SETTINGS.friday, timezone: global.storeTimezone, ...(value?.friday || {}) },
    birthday: { ...DEFAULT_PROMOTION_SETTINGS.birthday, timezone: global.storeTimezone, ...(value?.birthday || {}) },
    manual: { ...DEFAULT_PROMOTION_SETTINGS.manual, timezone: global.storeTimezone, ...(value?.manual || {}) },
  };
};

const validTimezone = (timezone) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date());
    return true;
  } catch {
    return false;
  }
};

const validatePromotionSettings = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Invalid promotion settings.";
  if (value.global !== undefined && (!value.global || typeof value.global !== "object" || Array.isArray(value.global))) {
    return "Global coupon settings must be an object.";
  }
  for (const key of ["welcome", "friday", "birthday", "manual"]) {
    if (value[key] !== undefined && (!value[key] || typeof value[key] !== "object" || Array.isArray(value[key]))) {
      return `${key} settings must be an object.`;
    }
  }
  const settings = getPromotionSettings(value);
  const global = settings.global;
  global.codePrefix = String(global.codePrefix).toUpperCase();
  global.codeAlphabet = String(global.codeAlphabet).toUpperCase();
  if (typeof global.onlineCouponEntryEnabled !== "boolean") return "Online coupon entry must be enabled or disabled.";
  if (!validTimezone(global.storeTimezone)) return "Store timezone must be a valid IANA timezone.";
  if (typeof global.codePrefix !== "string" || !/^[A-Z0-9_-]{0,16}$/.test(global.codePrefix)) {
    return "Coupon code prefix can contain up to 16 letters, numbers, dashes, or underscores.";
  }
  if (!Number.isInteger(Number(global.codeLength)) || Number(global.codeLength) < 4 || Number(global.codeLength) > 32
    || global.codePrefix.length + Number(global.codeLength) > 40) {
    return "Coupon code suffix length must be 4 to 32 characters, and the full code cannot exceed 40 characters.";
  }
  if (typeof global.codeAlphabet !== "string" || !/^[A-Z0-9_-]+$/.test(global.codeAlphabet)
    || new Set(global.codeAlphabet).size !== global.codeAlphabet.length || global.codeAlphabet.length < 16) {
    return "Coupon code characters must be unique uppercase letters, numbers, dashes, or underscores, with at least 16 choices.";
  }
  if (BigInt(global.codeAlphabet.length) ** BigInt(global.codeLength) < 1000000n) {
    return "Coupon code settings need at least one million possible codes to reduce collision risk.";
  }
  global.codeLength = Number(global.codeLength);
  for (const key of ["welcome", "friday", "birthday", "manual"]) {
    const item = settings[key];
    if (!item || typeof item !== "object" || Array.isArray(item)) return `Invalid ${key} settings.`;
    if (typeof item.campaignName !== "string" || !item.campaignName.trim() || item.campaignName.length > 120) {
      return `${key}.campaignName must be 1 to 120 characters.`;
    }
    if (typeof item.description !== "string" || item.description.length > 500) {
      return `${key}.description must be text no longer than 500 characters.`;
    }
    if (!["percentage", "fixed"].includes(item.discountType)) return `${key}.discountType must be percentage or fixed amount.`;
    for (const flag of ["enabled", "automaticGeneration", "sendEmail", "sendWhatsApp", "allowStacking"]) {
      if (item[flag] !== undefined && typeof item[flag] !== "boolean") return `${key}.${flag} must be true or false.`;
    }
    if (item.discountType === "fixed" && item.sendWhatsApp === true) {
      return `${key}.sendWhatsApp must be disabled for fixed-amount discounts because the approved WhatsApp template is percentage-only.`;
    }
    for (const field of ["minimumSubtotal", "maximumDiscount"]) {
      if (item[field] == null && field === "maximumDiscount") continue;
      const number = Number(item[field]);
      if (!Number.isFinite(number) || number < 0) return `${key}.${field} must be 0 or greater.`;
    }
    if (item.maxCampaignRedemptions != null) {
      const maximum = Number(item.maxCampaignRedemptions);
      if (!Number.isInteger(maximum) || maximum < 1) return `${key}.maxCampaignRedemptions must be a positive whole number or blank for no cap.`;
      item.maxCampaignRedemptions = maximum;
    }
    if (item.redemptionLimitPerCustomer !== undefined) {
      const maximum = Number(item.redemptionLimitPerCustomer);
      if (!Number.isInteger(maximum) || maximum < 1 || maximum > 100) {
        return `${key}.redemptionLimitPerCustomer must be a whole number from 1 to 100.`;
      }
      item.redemptionLimitPerCustomer = maximum;
    }
    for (const field of ["startsAt", "endsAt"]) {
      if (item[field] == null || item[field] === "") {
        item[field] = null;
        continue;
      }
      const date = new Date(item[field]);
      if (Number.isNaN(date.getTime())) return `${key}.${field} must be a valid date and time.`;
      item[field] = date;
    }
    if (item.startsAt && item.endsAt && item.startsAt >= item.endsAt) return `${key}.endsAt must be after startsAt.`;
    if (!["none", "duration", "calendar"].includes(item.expiryMode)) return `${key}.expiryMode is invalid.`;
    for (const field of ["expiryHours", "calendarDays"]) {
      const number = Number(item[field]);
      const max = field === "expiryHours" ? 87600 : 3650;
      if (!Number.isInteger(number) || number < 1 || number > max) return `${key}.${field} must be a whole number from 1 to ${max}.`;
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(item.expiryTime))) return `${key}.expiryTime must use 24-hour HH:MM format.`;
    if (!validTimezone(item.timezone)) return `${key}.timezone is invalid.`;
    if (item.maxCouponsPerExecution !== undefined) {
      const maximum = Number(item.maxCouponsPerExecution);
      if (!Number.isInteger(maximum) || maximum < 1 || maximum > 20000) {
        return `${key}.maxCouponsPerExecution must be a whole number from 1 to 20,000.`;
      }
      item.maxCouponsPerExecution = maximum;
    }
    if (!Array.isArray(item.eligibleChannels) || item.eligibleChannels.length === 0
      || item.eligibleChannels.some((channel) => !["POS", "Online"].includes(channel))) {
      return `${key}.eligibleChannels must contain POS, Online, or both.`;
    }
    item.eligibleChannels = [...new Set(item.eligibleChannels)];
    if (item.percentages !== undefined) {
      if (!Array.isArray(item.percentages) || !item.percentages.length
        || item.percentages.some((entry) => !Number.isFinite(Number(entry)) || Number(entry) <= 0 || Number(entry) > 100)) {
        return `${key}.percentages must contain percentages greater than 0 and no greater than 100.`;
      }
      if (item.discountType === "fixed") {
        const amount = Number(item.fixedAmount);
        if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) return `${key}.fixedAmount must be between 0 and 10,000,000.`;
        item.fixedAmount = amount;
      }
      item.percentages = [...new Set(item.percentages.map(Number))].sort((a, b) => a - b);
    }
    const allowedModes = key === "welcome"
      ? ["list"]
      : key === "friday"
        ? ["list", "range"]
        : key === "birthday"
          ? ["list", "range", "fixed"]
          : ["list", "range"];
    if (item.discountMode && !allowedModes.includes(item.discountMode)) return `${key}.discountMode is invalid.`;
    for (const field of ["rangeMin", "rangeMax", "fixedPercentage"]) {
      if (item[field] === undefined) continue;
      const number = Number(item[field]);
      if (!Number.isFinite(number) || number <= 0 || number > 100) return `${key}.${field} must be greater than 0 and no greater than 100.`;
      item[field] = number;
    }
    if (item.rangeMin > item.rangeMax) return `${key}.rangeMin cannot exceed rangeMax.`;
    if (item.precision !== undefined) {
      if (![0, 1, 2].includes(Number(item.precision))) return `${key}.precision must be 0, 1, or 2.`;
      const scale = 10 ** Number(item.precision);
      if (Math.ceil(item.rangeMin * scale) > Math.floor(item.rangeMax * scale)) return `${key}.range is too narrow for the selected precision.`;
    }
    for (const field of ["generationTime", "processingTime"]) {
      if (item[field] !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(item[field]))) return `${key}.${field} must use 24-hour HH:MM format.`;
    }
    if (item.requireMarketingConsent !== undefined && typeof item.requireMarketingConsent !== "boolean") {
      return `${key}.requireMarketingConsent must be true or false.`;
    }
  }
  if (!Array.isArray(settings.friday.eligibleOrderStatuses) || !settings.friday.eligibleOrderStatuses.length
    || settings.friday.eligibleOrderStatuses.some((status) => !["Completed", "Closed"].includes(status))) {
    return "Friday eligible order statuses must include Completed or Closed.";
  }
  if (!Array.isArray(settings.birthday.eligibleOrderStatuses) || !settings.birthday.eligibleOrderStatuses.length
    || settings.birthday.eligibleOrderStatuses.some((status) => !["Completed", "Closed"].includes(status))) {
    return "Birthday eligible order statuses must include Completed or Closed.";
  }
  return null;
};

const choosePercentage = (config) => {
  if (config.discountType === "fixed") return Number(config.fixedAmount);
  if (config.discountMode === "fixed") return Number(config.fixedPercentage);
  if (config.discountMode === "range") {
    const scale = 10 ** Number(config.precision || 0);
    const minimum = Math.ceil(Number(config.rangeMin) * scale);
    const maximum = Math.floor(Number(config.rangeMax) * scale);
    return (minimum + crypto.randomInt(maximum - minimum + 1)) / scale;
  }
  const percentages = config.percentages || [];
  return Number(percentages[crypto.randomInt(percentages.length)]);
};

const calculateExpiry = (config, now, timezone) => {
  if (config.expiryMode === "none") return null;
  if (config.expiryMode === "duration") return new Date(now.getTime() + Number(config.expiryHours) * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type) => Number(parts.find((entry) => entry.type === type)?.value);
  const expiryDay = new Date(Date.UTC(part("year"), part("month") - 1, part("day") + Number(config.calendarDays)));
  const dayParts = new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(expiryDay);
  const value = (type) => dayParts.find((entry) => entry.type === type)?.value;
  const localDate = `${value("year")}-${value("month")}-${value("day")}`;
  const localTime = config.expiryTime || "23:59";
  const initialUtc = new Date(`${localDate}T${localTime}:00Z`);
  const represented = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(initialUtc);
  const get = (type) => Number(represented.find((entry) => entry.type === type)?.value);
  const representedUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(initialUtc.getTime() - (representedUtc - initialUtc.getTime()));
};

module.exports = { DEFAULT_PROMOTION_SETTINGS, calculateExpiry, choosePercentage, getPromotionSettings, validatePromotionSettings };
