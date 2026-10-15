// Pure helpers (no DB access) shared by the inventory + availability code.

// "Low stock" rules requested by the shop:
//   - weight/volume items warn below 1000 g (1 kg) / 1000 ml (1 l)
//   - anything counted in pieces warns below 10 pcs
// An item can also carry its own reorderLevel — whichever rule trips first wins.
const LOW_STOCK_DEFAULTS = {
  g: 1000,
  kg: 1,
  ml: 1000,
  l: 1,
  pcs: 10,
};
const FALLBACK_LOW_STOCK = 10; // bottle, pack, box, dozen, ...

const normalizeUnit = (unit) => String(unit || "pcs").trim().toLowerCase();

const getDefaultLowStockThreshold = (unit) =>
  LOW_STOCK_DEFAULTS[normalizeUnit(unit)] ?? FALLBACK_LOW_STOCK;

const getStockStatus = (quantity, reorderLevel, unit) => {
  const qty = Number(quantity) || 0;
  if (qty <= 0) return "out_of_stock";

  const reorder = Number(reorderLevel) || 0;
  if (qty < getDefaultLowStockThreshold(unit) || (reorder > 0 && qty <= reorder)) {
    return "low_stock";
  }
  return "in_stock";
};

const UNIT_FACTORS = {
  kg: { g: 1000 },
  g: { kg: 1 / 1000 },
  l: { ml: 1000 },
  ml: { l: 1 / 1000 },
};

// Non-throwing unit conversion: returns null when the units can't be
// converted (e.g. pcs <-> g) instead of throwing.
const convertQuantity = (amount, fromUnit, toUnit) => {
  const f = normalizeUnit(fromUnit);
  const t = normalizeUnit(toUnit);
  if (f === t) return amount;
  if (UNIT_FACTORS[f]?.[t]) return amount * UNIT_FACTORS[f][t];
  if (UNIT_FACTORS[t]?.[f]) return amount / UNIT_FACTORS[t][f];
  return null;
};

module.exports = {
  LOW_STOCK_DEFAULTS,
  getDefaultLowStockThreshold,
  getStockStatus,
  convertQuantity,
  normalizeUnit,
};
