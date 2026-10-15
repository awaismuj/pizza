// Build Your Own Deal - one place that turns "how many items did the customer
// pick" into "what percent do they save", so the order endpoint and the
// public settings can never disagree about it.

const DEFAULT_BYO = {
  enabled: true,
  minItems: 3,
  discount3: 15,
  discount4: 17,
  discount5Plus: 20,
};

// Settings documents created before this feature existed have no
// buildYourOwnDeal block at all - fall back to the defaults instead of NaN.
const normalizeByoConfig = (raw) => {
  const src = raw && typeof raw.toObject === "function" ? raw.toObject() : raw || {};
  const num = (v, fallback) => (typeof v === "number" && !Number.isNaN(v) ? v : fallback);
  return {
    enabled: typeof src.enabled === "boolean" ? src.enabled : DEFAULT_BYO.enabled,
    minItems: Math.max(1, Math.round(num(src.minItems, DEFAULT_BYO.minItems))),
    discount3: num(src.discount3, DEFAULT_BYO.discount3),
    discount4: num(src.discount4, DEFAULT_BYO.discount4),
    discount5Plus: num(src.discount5Plus, DEFAULT_BYO.discount5Plus),
  };
};

// 0 when the deal is switched off or the customer hasn't reached the minimum.
const byoDiscountPercent = (itemCount, rawConfig) => {
  const cfg = normalizeByoConfig(rawConfig);
  if (!cfg.enabled || itemCount < cfg.minItems) return 0;
  if (itemCount >= 5) return cfg.discount5Plus;
  if (itemCount === 4) return cfg.discount4;
  return cfg.discount3;
};

module.exports = { DEFAULT_BYO, normalizeByoConfig, byoDiscountPercent };
