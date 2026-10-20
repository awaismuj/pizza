const test = require("node:test");
const assert = require("node:assert");
const { quoteFulfillment, isOpenAt, defaultHours } = require("./fulfillment");

const branch = (over = {}) => ({
  _id: "b1", name: "Main", isActive: true, timezone: "Asia/Karachi",
  hours: defaultHours(),
  pickup: { enabled: true, prepMinutes: 15, minOrder: 0, instructions: "Counter" },
  delivery: { enabled: true, prepMinutes: 25, minOrder: 500, freeAbove: 2000,
    zones: [{ _id: "z1", name: "City", fee: 150, minOrder: 0, travelMinutes: 20, active: true }] },
  restriction: { active: false },
  ...over,
});
const noon = new Date("2026-10-19T09:00:00Z");

test("delivery fee, minimum and eta", () => {
  const q = quoteFulfillment({ branch: branch(), method: "delivery", zoneId: "z1", subtotal: 1000, now: noon });
  assert.equal(q.ok, true); assert.equal(q.fee, 150); assert.equal(q.etaMin, 45);
  assert.equal(quoteFulfillment({ branch: branch(), method: "delivery", zoneId: "z1", subtotal: 300, now: noon }).ok, false);
});
test("free delivery above threshold", () => {
  assert.equal(quoteFulfillment({ branch: branch(), method: "delivery", zoneId: "z1", subtotal: 2500, now: noon }).fee, 0);
});
test("free within distance, Rs 100 beyond", () => {
  const b = branch({ delivery: { enabled: true, prepMinutes: 25, minOrder: 0, freeAbove: 1000, freeWithinKm: 4,
    zones: [{ _id: "near", name: "Near", fee: 100, distanceKm: 3, active: true },
            { _id: "far", name: "Far", fee: 100, distanceKm: 7, active: true }] } });
  const q = (zoneId, subtotal) => quoteFulfillment({ branch: b, method: "delivery", zoneId, subtotal, now: noon }).fee;
  assert.equal(q("near", 300), 0);
  assert.equal(q("far", 300), 100);
  assert.equal(q("far", 1000), 0);
});
test("unsupported zone and pickup fee", () => {
  assert.equal(quoteFulfillment({ branch: branch(), method: "delivery", zoneId: "zzz", subtotal: 1000, now: noon }).ok, false);
  const p = quoteFulfillment({ branch: branch(), method: "pickup", subtotal: 100, now: noon });
  assert.equal(p.ok, true); assert.equal(p.fee, 0); assert.equal(p.etaMin, 15);
});
test("closed, restricted, overnight", () => {
  const night = new Date("2026-10-19T20:00:00Z"); 
  assert.equal(quoteFulfillment({ branch: branch(), method: "pickup", subtotal: 1, now: night }).ok, false);
  assert.equal(quoteFulfillment({ branch: branch(), method: "pickup", subtotal: 1, now: night, staff: true }).ok, true);
  const late = branch({ hours: defaultHours().map((h) => ({ ...h, from: "18:00", to: "02:00" })) });
  assert.equal(isOpenAt(late, night), true);
  const r = branch({ restriction: { active: true, applies: "delivery", message: "Storm" } });
  assert.equal(quoteFulfillment({ branch: r, method: "delivery", zoneId: "z1", subtotal: 1000, now: noon }).error, "Storm");
  assert.equal(quoteFulfillment({ branch: r, method: "pickup", subtotal: 100, now: noon }).ok, true);
});
