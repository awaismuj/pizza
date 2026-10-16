const Asset = require("../models/assetModel").Asset;
const { processDepreciationForAsset } = require("../controllers/assetController");

const CHECK_INTERVAL_MS = 60 * 1000;
let lastSuccessfulRunDay = "";

const runClosedMonth = async (now = new Date()) => {
  const today = now.toISOString().slice(0, 10);
  if (lastSuccessfulRunDay === today) return 0;
  const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const lastClosedPeriod = `${previous.getUTCFullYear()}-${String(previous.getUTCMonth() + 1).padStart(2, "0")}`;
  const assets = await Asset.find({ depreciationStartDate: { $lte: now } });
  let posted = 0;
  let failed = false;
  for (const asset of assets) {
    const start = new Date(asset.depreciationStartDate);
    let periodDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
    while (true) {
      const period = `${periodDate.getUTCFullYear()}-${String(periodDate.getUTCMonth() + 1).padStart(2, "0")}`;
      if (period > lastClosedPeriod) break;
      try {
        const row = await processDepreciationForAsset(asset, period, "Scheduled");
        if (row) posted += 1;
      } catch (error) {
        failed = true;
        console.error(`Asset depreciation failed for ${asset.assetId} (${period}):`, error);
      }
      periodDate = new Date(Date.UTC(periodDate.getUTCFullYear(), periodDate.getUTCMonth() + 1, 1));
    }
  }
  if (failed) throw new Error("One or more asset depreciation records failed; the scheduler will retry.");
  lastSuccessfulRunDay = today;
  return posted;
};

const startAssetDepreciationScheduler = () => {
  setInterval(() => {
    runClosedMonth().catch((error) => console.error("Asset depreciation scheduler failed:", error));
  }, CHECK_INTERVAL_MS);
};

module.exports = { runClosedMonth, startAssetDepreciationScheduler };
