// Order preparation countdown - the rules, in one dependency-free place so
// they can be unit-tested without a database (see prepTimer.test.js) and so
// the controllers stay thin.
//
// The backend is the source of truth: a deadline is stamped when the order is
// created, only ever moves forward through a recorded extension, and the
// frontend just counts down to it.

// Statuses where the kitchen still owes the customer an order.
// (Pending / Payment Pending Verification are the online "new" stages.)
const PREP_ACTIVE_STATUSES = [
  "In Progress",
  "Pending",
  "Payment Pending Verification",
  "Accepted",
  "Preparing",
];
// Kitchen is done: countdown stops, "actual ready" is recorded.
const PREP_READY_STATUSES = ["Ready", "Ready to Deliver"];

const MS_MIN = 60 * 1000;

const PREP_DEFAULTS = Object.freeze({
  enabled: true,
  defaultMinutes: 20,
  mascotEnabled: true,
  soundEnabled: true,
  timezone: "Asia/Karachi",
  alerts: {
    warn1: { enabled: true, minutes: 10 },
    warn2: { enabled: true, minutes: 5 },
    warn3: { enabled: true, minutes: 2 },
    overdue: { enabled: true },
  },
});

// Alert levels from least to most urgent.
const ALERT_LEVELS = ["warn1", "warn2", "warn3", "overdue"];

const isValidTimezone = (tz) => {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return typeof tz === "string" && tz.length > 0;
  } catch {
    return false;
  }
};

const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

// Whatever is stored (possibly missing fields on an older settings document)
// -> a complete, safe settings object.
const normalizePrepSettings = (raw) => {
  const r = raw && typeof raw.toObject === "function" ? raw.toObject() : raw || {};
  const a = r.alerts || {};
  const level = (key) => ({
    enabled: a[key]?.enabled !== undefined ? Boolean(a[key].enabled) : PREP_DEFAULTS.alerts[key].enabled,
    minutes: num(a[key]?.minutes, PREP_DEFAULTS.alerts[key].minutes),
  });
  return {
    enabled: r.enabled !== undefined ? Boolean(r.enabled) : PREP_DEFAULTS.enabled,
    defaultMinutes: num(r.defaultMinutes, PREP_DEFAULTS.defaultMinutes),
    mascotEnabled: r.mascotEnabled !== undefined ? Boolean(r.mascotEnabled) : PREP_DEFAULTS.mascotEnabled,
    soundEnabled: r.soundEnabled !== undefined ? Boolean(r.soundEnabled) : PREP_DEFAULTS.soundEnabled,
    timezone: isValidTimezone(r.timezone) ? r.timezone : PREP_DEFAULTS.timezone,
    alerts: {
      warn1: level("warn1"),
      warn2: level("warn2"),
      warn3: level("warn3"),
      overdue: { enabled: a.overdue?.enabled !== undefined ? Boolean(a.overdue.enabled) : true },
    },
  };
};

// Validates an admin's partial update and returns the merged settings, or
// { error } describing what's wrong. Nothing here touches existing orders.
const mergePrepSettings = (current, patch) => {
  if (!patch || typeof patch !== "object") return { error: "Invalid order preparation settings." };
  const next = normalizePrepSettings(current);

  if (patch.enabled !== undefined) next.enabled = Boolean(patch.enabled);
  if (patch.mascotEnabled !== undefined) next.mascotEnabled = Boolean(patch.mascotEnabled);
  if (patch.soundEnabled !== undefined) next.soundEnabled = Boolean(patch.soundEnabled);

  if (patch.defaultMinutes !== undefined) {
    const m = Number(patch.defaultMinutes);
    if (!Number.isInteger(m) || m < 1 || m > 240) {
      return { error: "Default preparation time must be a whole number of minutes between 1 and 240." };
    }
    next.defaultMinutes = m;
  }

  if (patch.timezone !== undefined) {
    if (!isValidTimezone(patch.timezone)) return { error: "That timezone isn't recognised (example: Asia/Karachi)." };
    next.timezone = patch.timezone;
  }

  if (patch.alerts !== undefined) {
    if (!patch.alerts || typeof patch.alerts !== "object") return { error: "Invalid alert settings." };
    for (const key of ["warn1", "warn2", "warn3"]) {
      const p = patch.alerts[key];
      if (p === undefined) continue;
      if (p.enabled !== undefined) next.alerts[key].enabled = Boolean(p.enabled);
      if (p.minutes !== undefined) {
        const m = Number(p.minutes);
        if (!Number.isInteger(m) || m < 1 || m > 120) {
          return { error: "Warning times must be whole minutes between 1 and 120." };
        }
        next.alerts[key].minutes = m;
      }
    }
    if (patch.alerts.overdue?.enabled !== undefined) next.alerts.overdue.enabled = Boolean(patch.alerts.overdue.enabled);
  }

  const { warn1, warn2, warn3 } = next.alerts;
  if (!(warn1.minutes > warn2.minutes && warn2.minutes > warn3.minutes)) {
    return { error: "Warning times must go from earliest to latest (for example 10, 5, then 2 minutes)." };
  }
  return { settings: next };
};

// ---- Clock (test hooks) ----------------------------------------------------
// Production always uses the real clock. In development you can set
//   PREP_TEST_DURATION_SECONDS=90   -> new orders get a 90 second countdown
//   PREP_CLOCK_OFFSET_SECONDS=600   -> the server "clock" runs 10 min ahead
// so alerts can be watched without waiting 20 real minutes. Both are ignored
// when NODE_ENV=production, and neither changes the saved default.
const testHooksAllowed = () => process.env.NODE_ENV !== "production";
const prepNow = () => {
  const offset = testHooksAllowed() ? Number(process.env.PREP_CLOCK_OFFSET_SECONDS) || 0 : 0;
  return new Date(Date.now() + offset * 1000);
};
const testDurationMs = () => {
  if (!testHooksAllowed()) return null;
  const s = Number(process.env.PREP_TEST_DURATION_SECONDS);
  return Number.isFinite(s) && s > 0 ? s * 1000 : null;
};

// ---- Creating the timer -----------------------------------------------------
// Returns the `prep` sub-document for a brand-new order, or null when the
// admin has turned countdowns off. `source` is only recorded for the report.
const buildPrepForNewOrder = (settingsRaw, { now = prepNow(), source } = {}) => {
  const s = normalizePrepSettings(settingsRaw);
  if (!s.enabled) return null;
  const durationMs = testDurationMs() ?? s.defaultMinutes * MS_MIN;
  const deadline = new Date(now.getTime() + durationMs);
  return {
    startedAt: now,
    durationMinutes: Math.round((durationMs / MS_MIN) * 100) / 100,
    originalDeadline: deadline,
    deadline,
    readyAt: null,
    source: source || undefined,
    extensions: [],
    totalExtensionMinutes: 0,
    alerts: { warn1: null, warn2: null, warn3: null, overdue: null },
  };
};

const hasTimer = (order) => Boolean(order?.prep?.deadline);
const isPrepActive = (order) => hasTimer(order) && PREP_ACTIVE_STATUSES.includes(order.orderStatus) && !order.prep.readyAt;

const remainingMs = (order, now = prepNow()) =>
  hasTimer(order) ? new Date(order.prep.deadline).getTime() - now.getTime() : null;

// ---- Extending ---------------------------------------------------------------
const MAX_EXTENSION_MINUTES = 180;

// Pure: given the order's current prep + a request, returns the fields to
// write, or { error, status }. The caller writes them with a compare-and-set
// on the previous deadline so two terminals can't overwrite one another.
const planExtension = (order, minutesRaw, { reason, user, now = prepNow(), settings } = {}) => {
  if (!hasTimer(order)) return { status: 400, error: "This order has no preparation timer (it was placed before countdowns existed)." };
  if (!PREP_ACTIVE_STATUSES.includes(order.orderStatus) || order.prep.readyAt) {
    return { status: 400, error: `This order is already ${String(order.orderStatus).toLowerCase()} - its time can't be extended.` };
  }
  const minutes = Number(minutesRaw);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > MAX_EXTENSION_MINUTES) {
    return { status: 400, error: `Add a whole number of minutes between 1 and ${MAX_EXTENSION_MINUTES}.` };
  }
  const cleanReason = String(reason || "").trim().slice(0, 200);

  const previousDeadline = new Date(order.prep.deadline);
  // Extending adds to the CURRENT deadline, so +10 on a deadline of 2:20 is
  // 2:30 whether or not the order is already overdue.
  const newDeadline = new Date(previousDeadline.getTime() + minutes * MS_MIN);

  // Re-arm only alerts that are still in the future relative to the new
  // deadline; ones already inside their window stay "fired" so nothing
  // repeats. An overdue flag is cleared when the new deadline is ahead.
  const s = normalizePrepSettings(settings);
  const newRemaining = newDeadline.getTime() - now.getTime();
  // Read from a plain copy: Mongoose nested paths don't spread reliably.
  const plainPrep = (typeof order.toObject === "function" ? order.toObject().prep : order.prep) || {};
  const alerts = { warn1: null, warn2: null, warn3: null, overdue: null, ...(plainPrep.alerts || {}) };
  for (const key of ["warn1", "warn2", "warn3"]) {
    if (newRemaining > s.alerts[key].minutes * MS_MIN) alerts[key] = null;
  }
  if (newRemaining > 0) alerts.overdue = null;

  return {
    previousDeadline,
    newDeadline,
    minutes,
    alerts,
    event: {
      previousDeadline,
      newDeadline,
      minutes,
      at: now,
      by: { userId: user?._id, name: user?.name || "" },
      reason: cleanReason,
    },
    totalExtensionMinutes: (Number(order.prep.totalExtensionMinutes) || 0) + minutes,
  };
};

// ---- Alerts --------------------------------------------------------------------
// Which alert levels are due for this order right now (and not yet stamped)?
// Used by tests and by the in-memory fallback; the real stamping is the
// atomic updateMany in services/prepAlertScheduler.js using the same rules.
const dueAlertLevels = (order, settingsRaw, now = prepNow()) => {
  if (!isPrepActive(order)) return [];
  const s = normalizePrepSettings(settingsRaw);
  const rem = remainingMs(order, now);
  const fired = order.prep.alerts || {};
  const due = [];
  for (const key of ["warn1", "warn2", "warn3"]) {
    if (s.alerts[key].enabled && rem <= s.alerts[key].minutes * MS_MIN && !fired[key]) due.push(key);
  }
  if (s.alerts.overdue.enabled && rem <= 0 && !fired.overdue) due.push("overdue");
  return due;
};

// Mongo filters for the atomic stamping pass (one per level).
const alertStampFilter = (key, settingsRaw, now = prepNow()) => {
  const s = normalizePrepSettings(settingsRaw);
  if (key === "overdue") {
    if (!s.alerts.overdue.enabled) return null;
    return { "prep.deadline": { $lte: now }, "prep.alerts.overdue": null };
  }
  if (!s.alerts[key].enabled) return null;
  return {
    "prep.deadline": { $lte: new Date(now.getTime() + s.alerts[key].minutes * MS_MIN) },
    [`prep.alerts.${key}`]: null,
  };
};

// ---- Report ----------------------------------------------------------------------
// Real recorded data only: an order counts toward "ready on time" statistics
// only if it has both a timer and an actual ready timestamp.
const computePrepStats = (orders = []) => {
  const empty = () => ({ total: 0, onTime: 0, late: 0, totalPrepMs: 0, totalDelayMs: 0, extended: 0, extensionMinutes: 0 });
  const bySource = { POS: empty(), Online: empty() };
  const all = empty();
  let withTimer = 0;
  let stillActive = 0;

  for (const o of orders) {
    if (!hasTimer(o)) continue;
    withTimer += 1;
    if (isPrepActive(o)) stillActive += 1;
    if (!o.prep.readyAt) continue;
    const ready = new Date(o.prep.readyAt).getTime();
    const started = new Date(o.prep.startedAt).getTime();
    const deadline = new Date(o.prep.deadline).getTime();
    const late = ready > deadline;
    const src = o.orderSource === "Online" ? "Online" : "POS";
    for (const bucket of [all, bySource[src]]) {
      bucket.total += 1;
      if (late) {
        bucket.late += 1;
        bucket.totalDelayMs += ready - deadline;
      } else bucket.onTime += 1;
      bucket.totalPrepMs += Math.max(0, ready - started);
      if ((o.prep.extensions || []).length > 0) bucket.extended += 1;
      bucket.extensionMinutes += Number(o.prep.totalExtensionMinutes) || 0;
    }
  }

  const finish = (b) => ({
    total: b.total,
    onTime: b.onTime,
    late: b.late,
    onTimePercent: b.total ? Math.round((b.onTime / b.total) * 100) : null,
    avgPrepMinutes: b.total ? Math.round((b.totalPrepMs / b.total / MS_MIN) * 10) / 10 : null,
    avgDelayMinutes: b.late ? Math.round((b.totalDelayMs / b.late / MS_MIN) * 10) / 10 : 0,
    extendedOrders: b.extended,
    totalExtensionMinutes: b.extensionMinutes,
  });
  return { withTimer, stillActive, ...finish(all), bySource: { POS: finish(bySource.POS), Online: finish(bySource.Online) } };
};

module.exports = {
  PREP_ACTIVE_STATUSES,
  PREP_READY_STATUSES,
  PREP_DEFAULTS,
  ALERT_LEVELS,
  MAX_EXTENSION_MINUTES,
  normalizePrepSettings,
  mergePrepSettings,
  prepNow,
  buildPrepForNewOrder,
  hasTimer,
  isPrepActive,
  remainingMs,
  planExtension,
  dueAlertLevels,
  alertStampFilter,
  computePrepStats,
};
