// Stamps "alert raised" times on orders whose preparation countdown has
// reached a warning level (10 / 5 / 2 minutes left, or overdue).
//
// The stamp is the single shared fact every POS screen reads: it is set ONCE
// per level per deadline (atomic updateMany with `alerts.<level>: null` in the
// filter, so two server processes or a request-triggered pass racing the
// timer can never raise the same level twice), and an extension clears only
// the levels that are in the future again. Closing a popup on a screen never
// touches it, and a stamp is never made for Ready / Delivered / Cancelled
// orders, so alerts stop as soon as the kitchen is done.
const Order = require("../models/orderModel");
const { getOrCreateSettings } = require("../controllers/settingsController");
const { PREP_ACTIVE_STATUSES, ALERT_LEVELS, alertStampFilter, prepNow } = require("../utils/prepTimer");

const TICK_MS = 5 * 1000;
let lastRun = 0;
let running = null;

const stampDueAlerts = async ({ throttleMs = 0 } = {}) => {
  const nowMs = Date.now();
  if (throttleMs && nowMs - lastRun < throttleMs) return running || 0;
  lastRun = nowMs;
  const job = (async () => {
    const settings = await getOrCreateSettings();
    if (!settings.orderPrep || settings.orderPrep.enabled === false) return 0;
    const now = prepNow();
    let stamped = 0;
    for (const level of ALERT_LEVELS) {
      const filter = alertStampFilter(level, settings.orderPrep, now);
      if (!filter) continue;
      const res = await Order.updateMany(
        { ...filter, orderStatus: { $in: PREP_ACTIVE_STATUSES }, "prep.readyAt": null },
        { $set: { [`prep.alerts.${level}`]: now } }
      );
      stamped += res.modifiedCount || 0;
    }
    return stamped;
  })();
  running = job.finally(() => {
    running = null;
  });
  return job;
};

const startPrepAlertScheduler = () => {
  const timer = setInterval(() => {
    stampDueAlerts().catch((err) => console.error("Prep alert scheduler error:", err.message));
  }, TICK_MS);
  timer.unref?.();
  console.log("🍕 Prep alert scheduler started");
};

module.exports = { stampDueAlerts, startPrepAlertScheduler };
