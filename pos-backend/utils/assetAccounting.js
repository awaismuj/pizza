const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const periodBounds = (period) => {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period || "")) {
    throw new Error("Accounting period must be in YYYY-MM format.");
  }
  const [year, month] = period.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
    days: new Date(Date.UTC(year, month, 0)).getUTCDate(),
  };
};

const daysInServiceForPeriod = (period, startDate, endDate = null) => {
  const bounds = periodBounds(period);
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : bounds.end;
  const first = new Date(Math.max(bounds.start.getTime(), start.getTime()));
  const last = new Date(Math.min(bounds.end.getTime(), end.getTime()));
  if (last < first) return 0;
  return Math.floor((Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate()) -
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), first.getUTCDate())) / 86400000) + 1;
};

const calculateDepreciation = ({
  method,
  acquisitionCost,
  residualValue,
  usefulLifeYears,
  decliningBalanceMultiplier = 2,
  openingBookValue,
  daysInService,
  daysInPeriod,
  unitsProduced,
  estimatedLifetimeUsage,
  remainingMonths,
  depreciableBasis,
}) => {
  const cost = Number(acquisitionCost);
  const residual = Number(residualValue);
  const opening = Number(openingBookValue);
  const life = Number(usefulLifeYears);
  if (![cost, residual, opening, life].every(Number.isFinite) || cost < 0 || residual < 0 || residual > cost || life <= 0) {
    throw new Error("Invalid asset accounting values.");
  }
  if (opening <= residual || daysInService <= 0) return 0;

  let amount;
  if (method === "StraightLine") {
    const months = Number(remainingMonths) > 0 ? Number(remainingMonths) : life * 12;
    const basis = Number.isFinite(depreciableBasis) ? Number(depreciableBasis) : cost;
    amount = ((basis - residual) / months) * (daysInService / daysInPeriod);
  } else if (method === "DecliningBalance") {
    const multiplier = Number(decliningBalanceMultiplier);
    if (!Number.isFinite(multiplier) || multiplier < 1 || multiplier > 3) {
      throw new Error("Declining-balance multiplier must be from 1 to 3.");
    }
    amount = opening * Math.min(1, multiplier / life) * (daysInService / daysInPeriod) / 12;
  } else if (method === "UnitsOfProduction") {
    const units = Number(unitsProduced);
    const lifetimeUnits = Number(estimatedLifetimeUsage);
    if (!Number.isFinite(units) || units < 0 || !Number.isFinite(lifetimeUnits) || lifetimeUnits <= 0) {
      throw new Error("Units of production requires a valid period usage and estimated lifetime usage.");
    }
    const basis = Number.isFinite(depreciableBasis) ? Number(depreciableBasis) : cost;
    amount = ((basis - residual) / lifetimeUnits) * units;
  } else {
    throw new Error("Unsupported depreciation method.");
  }

  return roundMoney(Math.max(0, Math.min(opening - residual, amount)));
};

const bookValueAt = ({ acquisitionCost, depreciationRows, adjustments = [], residualValue = 0, asOf }) => {
  const accumulatedDepreciation = depreciationRows
    .filter((row) => new Date(row.period + "-01T00:00:00.000Z") <= new Date(asOf))
    .reduce((total, row) => total + row.depreciation, 0);
  const adjustmentBalance = adjustments
    .filter((adjustment) => new Date(adjustment.effectiveAt) <= new Date(asOf))
    .reduce((total, adjustment) => total + adjustment.amount, 0);
  return {
    accumulatedDepreciation: roundMoney(accumulatedDepreciation),
    adjustmentBalance: roundMoney(adjustmentBalance),
    currentBookValue: roundMoney(Math.max(residualValue, acquisitionCost + adjustmentBalance - accumulatedDepreciation)),
  };
};

module.exports = { roundMoney, periodBounds, daysInServiceForPeriod, calculateDepreciation, bookValueAt };
