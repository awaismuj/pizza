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
    campaignName: "Friday Campaign",
    automaticGeneration: false,
    campaignDay: 5,
    generationTime: "18:00",
    minimumSubtotal: 1000,
    percentages: [4, 5, 6, 7],
    expiryHours: 72,
    timezone: "Asia/Karachi",
  },
  birthday: {
    campaignName: "Birthday Coupon",
    enabled: false,
    discountMode: "random",
    fixedPercentage: 5,
    percentages: [5, 6, 7],
    minimumSubtotal: 1000,
    expiryHours: 72,
    checkTime: "00:00",
    timezone: "Asia/Karachi",
  },
};

const normalizeCouponCode = (code) => String(code || "").trim().toUpperCase();

const formatCouponCode = (code) => {
  const value = String(code || "").trim();
  const flatMatch = /^FLAT(\d+)$/i.exec(value);
  if (flatMatch) return `Flat${flatMatch[1]}`;
  const campaignMatch = /^WACMP_([0-9A-F]{32})$/i.exec(value);
  return campaignMatch ? `WACMP_${campaignMatch[1].toUpperCase()}` : "";
};

const generateCouponCode = () =>
  `Flat${crypto.randomInt(0, 2) === 0 ? crypto.randomInt(100, 1000) : crypto.randomInt(1000, 10000)}`;

const normalizeCustomerPhone = require("./normalizePakistaniMobile");

const deduplicateCustomers = (customers) => {
  const parent = new Map();
  const rank = new Map();
  const identityOwners = new Map();
  const records = new Map();

  const find = (id) => {
    const currentParent = parent.get(id);
    if (currentParent === id) return id;
    const root = find(currentParent);
    parent.set(id, root);
    return root;
  };

  const union = (left, right) => {
    let leftRoot = find(left);
    let rightRoot = find(right);
    if (leftRoot === rightRoot) return;
    if ((rank.get(leftRoot) || 0) < (rank.get(rightRoot) || 0)) {
      [leftRoot, rightRoot] = [rightRoot, leftRoot];
    }
    parent.set(rightRoot, leftRoot);
    if ((rank.get(leftRoot) || 0) === (rank.get(rightRoot) || 0)) {
      rank.set(leftRoot, (rank.get(leftRoot) || 0) + 1);
    }
  };

  for (const customer of customers) {
    const id = String(customer._id);
    parent.set(id, id);
    rank.set(id, 0);
    records.set(id, customer);

    const email = String(customer.email || "").trim().toLowerCase();
    const phone = normalizeCustomerPhone(customer.phone);
    const keys = [
      ...(email ? [`email:${email}`] : []),
      ...(phone ? [`phone:${phone}`] : []),
    ];
    for (const key of keys) {
      const owner = identityOwners.get(key);
      if (owner) union(id, owner);
      else identityOwners.set(key, id);
    }
  }

  const groups = new Map();
  for (const [id, customer] of records) {
    const root = find(id);
    const group = groups.get(root) || [];
    group.push(customer);
    groups.set(root, group);
  }

  const representatives = [...groups.values()].map((group) => {
    group.sort((left, right) => {
      if (Boolean(left.accountCustomer) !== Boolean(right.accountCustomer)) {
        return left.accountCustomer ? -1 : 1;
      }
      const contactScore = (customer) =>
        Number(Boolean(String(customer.phone || "").trim())) +
        Number(Boolean(String(customer.email || "").trim()));
      return contactScore(right) - contactScore(left) ||
        Number(Boolean(String(right.name || "").trim())) - Number(Boolean(String(left.name || "").trim())) ||
        String(left._id).localeCompare(String(right._id));
    });
    return {
      customer: group[0],
      customerIds: group.map((customer) => customer._id),
      members: group,
    };
  });

  return {
    customers: representatives,
    duplicateCount: customers.length - representatives.length,
  };
};

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

const birthdayCampaignCycle = (date, timezone) => zonedParts(date, timezone).year;

const isFridayCampaignDue = (date, timezone, campaignDay = 5, generationTime = "18:00") => {
  const parts = zonedParts(date, timezone);
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const [hour, minute] = String(generationTime).split(":").map(Number);
  return weekdays[parts.weekday] === Number(campaignDay) &&
    Number(parts.hour) * 60 + Number(parts.minute) >= hour * 60 + minute;
};

const isDailyCampaignDue = (date, timezone, checkTime = "00:00") => {
  const parts = zonedParts(date, timezone);
  const [hour, minute] = String(checkTime).split(":").map(Number);
  return Number(parts.hour) * 60 + Number(parts.minute) >= hour * 60 + minute;
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
  normalizeCustomerPhone,
  deduplicateCustomers,
  zonedParts,
  fridayCampaignCycle,
  birthdayCampaignCycle,
  isFridayCampaignDue,
  isDailyCampaignDue,
  isCustomerBirthday,
  expiryDate,
};
