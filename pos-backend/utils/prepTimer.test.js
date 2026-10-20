const test = require("node:test");
const assert = require("node:assert");
const T = require("./prepTimer");

const MIN = 60 * 1000;
const t0 = new Date("2026-10-20T09:00:00Z"); // 2:00 PM in Karachi
const at = (mins) => new Date(t0.getTime() + mins * MIN);
const mkOrder = (over = {}) => ({
  orderStatus: "In Progress",
  orderSource: "POS",
  prep: T.buildPrepForNewOrder(undefined, { now: t0, source: "POS" }),
  ...over,
});

test("new order gets a 20 minute deadline by default", () => {
  const p = T.buildPrepForNewOrder(undefined, { now: t0, source: "Online" });
  assert.equal(p.durationMinutes, 20);
  assert.equal(p.deadline.toISOString(), "2026-10-20T09:20:00.000Z");
  assert.equal(p.originalDeadline.getTime(), p.deadline.getTime());
  assert.equal(p.source, "Online");
  assert.equal(p.readyAt, null);
});

test("changing the default only affects orders created afterwards", () => {
  const before = mkOrder(); // created under 20 min
  const merged = T.mergePrepSettings(undefined, { defaultMinutes: 25 });
  assert.equal(merged.settings.defaultMinutes, 25);
  const after = T.buildPrepForNewOrder(merged.settings, { now: t0 });
  assert.equal(after.deadline.getTime(), at(25).getTime());
  assert.equal(before.prep.deadline.getTime(), at(20).getTime()); // untouched
});

test("countdowns can be disabled", () => {
  const s = T.mergePrepSettings(undefined, { enabled: false }).settings;
  assert.equal(T.buildPrepForNewOrder(s, { now: t0 }), null);
});

test("settings validation", () => {
  assert.ok(T.mergePrepSettings(undefined, { defaultMinutes: 0 }).error);
  assert.ok(T.mergePrepSettings(undefined, { defaultMinutes: 12.5 }).error);
  assert.ok(T.mergePrepSettings(undefined, { defaultMinutes: 500 }).error);
  assert.ok(T.mergePrepSettings(undefined, { alerts: { warn1: { minutes: 3 } } }).error); // 3 < warn2(5)
  assert.ok(T.mergePrepSettings(undefined, { timezone: "Mars/Olympus" }).error);
  const ok = T.mergePrepSettings(undefined, { alerts: { warn1: { minutes: 12 }, warn2: { enabled: false } }, timezone: "Asia/Karachi" });
  assert.equal(ok.settings.alerts.warn1.minutes, 12);
  assert.equal(ok.settings.alerts.warn2.enabled, false);
});

test("legacy settings/orders are handled safely", () => {
  const s = T.normalizePrepSettings({ defaultMinutes: "abc" });
  assert.equal(s.defaultMinutes, 20);
  const legacy = { orderStatus: "In Progress" };
  assert.equal(T.hasTimer(legacy), false);
  assert.equal(T.isPrepActive(legacy), false);
  assert.equal(T.remainingMs(legacy), null);
  assert.deepEqual(T.dueAlertLevels(legacy, undefined, at(99)), []);
  assert.ok(T.planExtension(legacy, 5).error);
});

test("alerts fire at 10, 5, 2 minutes and when overdue - once", () => {
  const o = mkOrder();
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(9)), []); // 11 left
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(10)), ["warn1"]);
  o.prep.alerts.warn1 = at(10); // stamped
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(10.5)), []); // no repeat
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(15)), ["warn2"]);
  o.prep.alerts.warn2 = at(15);
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(18)), ["warn3"]);
  o.prep.alerts.warn3 = at(18);
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(20)), ["overdue"]);
  o.prep.alerts.overdue = at(20);
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(40)), []);
});

test("disabled levels never fire; thresholds are configurable", () => {
  const s = T.mergePrepSettings(undefined, { alerts: { warn1: { minutes: 15 }, warn2: { enabled: false } } }).settings;
  const o = mkOrder();
  assert.deepEqual(T.dueAlertLevels(o, s, at(5)), ["warn1"]); // 15 left
  assert.deepEqual(T.dueAlertLevels(o, s, at(19)), ["warn1", "warn3"]); // 1 min left, warn2 disabled
});

test("no alerts once Ready, Delivered, Cancelled, or after readyAt", () => {
  for (const status of ["Ready", "Ready to Deliver", "Out", "Completed", "Closed", "Cancelled"]) {
    assert.deepEqual(T.dueAlertLevels(mkOrder({ orderStatus: status }), undefined, at(25)), [], status);
  }
  const o = mkOrder();
  o.prep.readyAt = at(8);
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(25)), []);
});

test("mongo stamp filters use the configured thresholds", () => {
  const f = T.alertStampFilter("warn2", undefined, t0);
  assert.equal(f["prep.deadline"].$lte.getTime(), at(5).getTime());
  assert.equal(f["prep.alerts.warn2"], null);
  assert.equal(T.alertStampFilter("overdue", undefined, t0)["prep.deadline"].$lte.getTime(), t0.getTime());
  const off = T.mergePrepSettings(undefined, { alerts: { overdue: { enabled: false } } }).settings;
  assert.equal(T.alertStampFilter("overdue", off, t0), null);
});

test("extension adds to the current deadline and records history", () => {
  const o = mkOrder();
  const user = { _id: "u1", name: "Ali" };
  const plan = T.planExtension(o, 10, { reason: " rush hour ", user, now: at(15) });
  assert.equal(plan.newDeadline.getTime(), at(30).getTime());
  assert.equal(plan.previousDeadline.getTime(), at(20).getTime());
  assert.equal(plan.event.minutes, 10);
  assert.equal(plan.event.reason, "rush hour");
  assert.equal(plan.event.by.name, "Ali");
  assert.equal(plan.totalExtensionMinutes, 10);
  assert.equal(o.prep.originalDeadline.getTime(), at(20).getTime()); // original preserved (pure fn didn't mutate)
});

test("extensions stack and original deadline stays", () => {
  const o = mkOrder();
  const p1 = T.planExtension(o, 5, { now: at(1) });
  o.prep.deadline = p1.newDeadline;
  o.prep.totalExtensionMinutes = p1.totalExtensionMinutes;
  const p2 = T.planExtension(o, 15, { now: at(2) });
  assert.equal(p2.newDeadline.getTime(), at(40).getTime());
  assert.equal(p2.totalExtensionMinutes, 20);
});

test("overdue order can be extended; overdue alert is cleared if deadline is ahead again", () => {
  const o = mkOrder();
  o.prep.alerts = { warn1: at(10), warn2: at(15), warn3: at(18), overdue: at(20) };
  const plan = T.planExtension(o, 20, { now: at(22) }); // new deadline 40, 18 min left
  assert.equal(plan.alerts.overdue, null); // no stale overdue
  assert.equal(plan.alerts.warn1, null); // 18 > 10 -> will warn again later
  assert.equal(plan.alerts.warn2, null);
  assert.equal(plan.alerts.warn3, null);
});

test("extension keeps alerts whose window the order is still inside", () => {
  const o = mkOrder();
  o.prep.alerts = { warn1: at(10), warn2: at(15), warn3: at(18), overdue: null };
  const plan = T.planExtension(o, 5, { now: at(18) }); // 25 deadline, 7 left
  assert.equal(plan.alerts.warn1.getTime(), at(10).getTime()); // 7 <= 10 stays fired
  assert.equal(plan.alerts.warn2, null); // 7 > 5 re-armed
  assert.equal(plan.alerts.warn3, null);
  // and the re-armed ones fire again at the right moment off the NEW deadline:
  o.prep.deadline = plan.newDeadline;
  o.prep.alerts = plan.alerts;
  assert.deepEqual(T.dueAlertLevels(o, undefined, at(20)), ["warn2"]);
});

test("extension is refused for ready/delivered/cancelled and bad input", () => {
  for (const status of ["Ready", "Ready to Deliver", "Completed", "Closed", "Cancelled"]) {
    assert.ok(T.planExtension(mkOrder({ orderStatus: status }), 5).error, status);
  }
  const readyAt = mkOrder();
  readyAt.prep.readyAt = at(5);
  assert.ok(T.planExtension(readyAt, 5).error);
  for (const bad of [0, -5, 2.5, "x", 181, null]) assert.ok(T.planExtension(mkOrder(), bad).error, String(bad));
});

test("report uses only recorded data", () => {
  const mk = (src, readyMin, extra = {}) => {
    const o = mkOrder({ orderSource: src, orderStatus: "Ready" });
    if (readyMin != null) o.prep.readyAt = at(readyMin);
    Object.assign(o.prep, extra);
    return o;
  };
  const legacy = { orderStatus: "Closed", orderSource: "POS" };
  const stats = T.computePrepStats([
    mk("POS", 18), // on time, 18 min
    mk("POS", 26), // late by 6
    mk("Online", 20), // exactly on deadline = on time
    mk("Online", 30, { extensions: [{}], totalExtensionMinutes: 5 }), // late by 10 (original deadline moved is irrelevant: uses current)
    mk("Online", null), // no ready time -> excluded
    legacy,
  ]);
  assert.equal(stats.withTimer, 5);
  assert.equal(stats.total, 4);
  assert.equal(stats.onTime, 2);
  assert.equal(stats.late, 2);
  assert.equal(stats.onTimePercent, 50);
  assert.equal(stats.avgDelayMinutes, 8);
  assert.equal(stats.avgPrepMinutes, 23.5);
  assert.equal(stats.bySource.POS.total, 2);
  assert.equal(stats.bySource.Online.late, 1);
  assert.equal(stats.extendedOrders, 1);
  assert.equal(stats.totalExtensionMinutes, 5);
  assert.equal(T.computePrepStats([]).onTimePercent, null);
});

test("test hooks work outside production only", () => {
  const prev = { env: process.env.NODE_ENV, d: process.env.PREP_TEST_DURATION_SECONDS, o: process.env.PREP_CLOCK_OFFSET_SECONDS };
  try {
    process.env.NODE_ENV = "development";
    process.env.PREP_TEST_DURATION_SECONDS = "90";
    const p = T.buildPrepForNewOrder(undefined, { now: t0 });
    assert.equal(p.deadline.getTime() - t0.getTime(), 90 * 1000);
    process.env.PREP_CLOCK_OFFSET_SECONDS = "600";
    assert.ok(Math.abs(T.prepNow().getTime() - (Date.now() + 600 * 1000)) < 1000);
    process.env.NODE_ENV = "production";
    assert.equal(T.buildPrepForNewOrder(undefined, { now: t0 }).durationMinutes, 20); // ignored
    assert.ok(Math.abs(T.prepNow().getTime() - Date.now()) < 1000);
  } finally {
    for (const [k, v] of [["NODE_ENV", prev.env], ["PREP_TEST_DURATION_SECONDS", prev.d], ["PREP_CLOCK_OFFSET_SECONDS", prev.o]]) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
  }
});
