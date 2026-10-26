const crypto = require("crypto");

const DEFAULT_PROMOTION_SETTINGS = Object.freeze({
  welcome: {
    enabled: false,
    percentages: [2, 3, 4],
    minimumSubtotal: 1000,
    maximumDiscount: null,
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online"],
    sendEmail: false,
    sendWhatsApp: false,
  },
  friday: {
    enabled: true,
    automaticGeneration: false,
    generationTime: "18:00",
    timezone: "Asia/Karachi",
    discountMode: "list",
    percentages: [4, 5, 6, 7],
    rangeMin: 4,
    rangeMax: 7,
    precision: 1,
    minimumSubtotal: 1000,
    maximumDiscount: null,
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online", "POS"],
    sendEmail: false,
    sendWhatsApp: false,
    eligibleOrderStatuses: ["Completed", "Closed"],
  },
  birthday: {
    enabled: false,
    automaticGeneration: false,
    processingTime: "09:00",
    timezone: "Asia/Karachi",
    discountMode: "list",
    percentages: [5, 6, 7],
    fixedPercentage: 5,
    rangeMin: 4,
    rangeMax: 8,
    precision: 1,
    minimumSubtotal: 1000,
    maximumDiscount: null,
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online", "POS"],
    sendEmail: false,
    sendWhatsApp: false,
    eligibleOrderStatuses: ["Completed", "Closed"],
  },
  manual: {
    discountMode: "list",
    percentages: [5, 7, 10],
    rangeMin: 5,
    rangeMax: 10,
    precision: 1,
    minimumSubtotal: 1000,
    maximumDiscount: null,
    expiryMode: "duration",
    expiryHours: 72,
    calendarDays: 3,
    expiryTime: "23:59",
    eligibleChannels: ["Online", "POS"],
    sendEmail: false,
    sendWhatsApp: false,
  },
});

const getPromotionSettings = (value) => ({
  welcome: { ...DEFAULT_PROMOTION_SETTINGS.welcome, ...(value?.welcome || {}) },
  friday: { ...DEFAULT_PROMOTION_SETTINGS.friday, ...(value?.friday || {}) },
  birthday: { ...DEFAULT_PROMOTION_SETTINGS.birthday, ...(value?.birthday || {}) },
  manual: { ...DEFAULT_PROMOTION_SETTINGS.manual, ...(value?.manual || {}) },
});

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
  const settings = getPromotionSettings(value);
  for (const key of ["welcome", "friday", "birthday", "manual"]) {
    const item = settings[key];
    if (!item || typeof item !== "object" || Array.isArray(item)) return `Invalid ${key} settings.`;
    for (const flag of ["enabled", "automaticGeneration", "sendEmail", "sendWhatsApp"]) {
      if (item[flag] !== undefined && typeof item[flag] !== "boolean") return `${key}.${flag} must be true or false.`;
    }
    for (const field of ["minimumSubtotal", "maximumDiscount"]) {
      if (item[field] == null && field === "maximumDiscount") continue;
      const number = Number(item[field]);
      if (!Number.isFinite(number) || number < 0) return `${key}.${field} must be 0 or greater.`;
    }
    if (!["duration", "calendar"].includes(item.expiryMode)) return `${key}.expiryMode is invalid.`;
    for (const field of ["expiryHours", "calendarDays"]) {
      const number = Number(item[field]);
      const max = field === "expiryHours" ? 87600 : 3650;
      if (!Number.isInteger(number) || number < 1 || number > max) return `${key}.${field} must be a whole number from 1 to ${max}.`;
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(item.expiryTime))) return `${key}.expiryTime must use 24-hour HH:MM format.`;
    if (item.timezone && !validTimezone(item.timezone)) return `${key}.timezone is invalid.`;
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
