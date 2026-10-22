const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const METHODS = ["delivery", "pickup"];

const toMin = (hhmm) => {
  const [h, m] = String(hhmm || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const fmt12 = (hhmm) => {
  const total = toMin(hhmm);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
};

const localParts = (date, timeZone = "Asia/Karachi") => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
};

const hoursFor = (branch, day) => (branch.hours || []).find((h) => h.day === day);

const isOpenAt = (branch, date = new Date()) => {
  const { day, minutes } = localParts(date, branch.timezone);
  const today = hoursFor(branch, day);
  if (today?.open) {
    const from = toMin(today.from);
    const to = toMin(today.to);
    if (to > from ? minutes >= from && minutes < to : minutes >= from) return true;
  }
  const yesterday = hoursFor(branch, (day + 6) % 7);
  if (yesterday?.open) {
    const from = toMin(yesterday.from);
    const to = toMin(yesterday.to);
    if (to <= from && minutes < to) return true;
  }
  return false;
};

const nextOpening = (branch, date = new Date()) => {
  const { day, minutes } = localParts(date, branch.timezone);
  for (let i = 0; i < 8; i += 1) {
    const d = (day + i) % 7;
    const h = hoursFor(branch, d);
    if (!h?.open) continue;
    if (i === 0 && toMin(h.from) <= minutes) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAY_NAMES[d];
    return `${when} at ${fmt12(h.from)}`;
  }
  return null;
};

const restrictionFor = (branch, method, date = new Date()) => {
  const r = branch.restriction;
  if (!r?.active) return null;
  if (r.until && new Date(r.until) <= date) return null;
  if (r.applies !== "both" && r.applies !== method) return null;
  return r.message || (method === "delivery" ? "Delivery is temporarily unavailable." : "Pickup is temporarily unavailable.");
};

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

const isFreeByDistance = (zone, freeWithinKm) =>
  freeWithinKm > 0 && zone.distanceKm != null && Number(zone.distanceKm) <= freeWithinKm;

const quoteFulfillment = ({ branch, method, zoneId, subtotal = 0, now = new Date(), staff = false }) => {
  const errors = [];
  const out = {
    ok: false,
    method,
    branchId: branch ? String(branch._id) : null,
    branchName: branch?.name || "",
    zoneId: null,
    zoneName: "",
    fee: 0,
    minOrder: 0,
    shortBy: 0,
    freeDeliveryAbove: 0,
    freeWithinKm: 0,
    prepMinutes: 0,
    etaMin: null,
    etaMax: null,
    readyAt: null,
    openNow: false,
    nextOpen: null,
    instructions: "",
    errors,
    error: "",
  };

  const finish = () => {
    out.ok = errors.length === 0;
    out.error = errors[0] || "";
    return out;
  };

  if (!METHODS.includes(method)) {
    errors.push("Choose Home Delivery or Pickup to continue.");
    return finish();
  }
  if (!branch || !branch.isActive) {
    errors.push("This branch isn't taking orders right now. Please pick another branch.");
    return finish();
  }

  const cfg = method === "delivery" ? branch.delivery : branch.pickup;
  const label = method === "delivery" ? "Delivery" : "Pickup";

  if (!cfg?.enabled) {
    errors.push(`${label} isn't available at ${branch.name}.`);
    return finish();
  }

  const restricted = restrictionFor(branch, method, now);
  if (restricted) errors.push(restricted);

  out.openNow = isOpenAt(branch, now);
  out.nextOpen = out.openNow ? null : nextOpening(branch, now);
  if (!out.openNow && !staff) {
    errors.push(
      out.nextOpen
        ? `${branch.name} is closed right now. We open ${out.nextOpen}.`
        : `${branch.name} is closed right now.`
    );
  }

  let minOrder = Number(cfg.minOrder) || 0;
  let travel = 0;

  if (method === "delivery") {
    const zones = (branch.delivery.zones || []).filter((z) => z.active);
    out.freeDeliveryAbove = Number(branch.delivery.freeAbove) || 0;
    out.freeWithinKm = Number(branch.delivery.freeWithinKm) || 0;
    const zone = zones.find((z) => String(z._id) === String(zoneId));
    if (!zoneId) {
      errors.push("Select your delivery area.");
    } else if (!zone) {
      errors.push("We don't deliver to that area yet. Choose another area or switch to Pickup.");
    } else {
      out.zoneId = String(zone._id);
      out.zoneName = zone.name;
      minOrder = Math.max(minOrder, Number(zone.minOrder) || 0);
      travel = Number(zone.travelMinutes) || 0;
      const free =
        (out.freeDeliveryAbove > 0 && subtotal >= out.freeDeliveryAbove) ||
        isFreeByDistance(zone, out.freeWithinKm);
      out.fee = free ? 0 : round2(zone.fee);
    }
  } else {
    out.instructions = branch.pickup.instructions || "";
  }

  out.minOrder = minOrder;
  if (minOrder > 0 && subtotal < minOrder) {
    out.shortBy = round2(minOrder - subtotal);
    errors.push(`${label} needs a minimum order of Rs. ${minOrder}. Add Rs. ${out.shortBy} more.`);
  }

  out.prepMinutes = Number(cfg.prepMinutes) || 0;
  out.etaMin = out.prepMinutes + travel;
  out.etaMax = out.etaMin + 10;
  out.readyAt = new Date(now.getTime() + out.etaMin * 60000);

  return finish();
};

const publicBranch = (branch, now = new Date()) => {
  const b = branch.toObject ? branch.toObject() : branch;
  const sample = (method) => restrictionFor(b, method, now);
  return {
    _id: String(b._id),
    name: b.name,
    address: b.address,
    phone: b.phone,
    openNow: isOpenAt(b, now),
    nextOpen: isOpenAt(b, now) ? null : nextOpening(b, now),
    hours: (b.hours || []).map((h) => ({ day: h.day, open: h.open, from: h.from, to: h.to })),
    pickup: {
      enabled: !!b.pickup?.enabled,
      prepMinutes: b.pickup?.prepMinutes || 0,
      minOrder: b.pickup?.minOrder || 0,
      instructions: b.pickup?.instructions || "",
      blockedReason: sample("pickup"),
    },
    delivery: {
      enabled: !!b.delivery?.enabled,
      prepMinutes: b.delivery?.prepMinutes || 0,
      minOrder: b.delivery?.minOrder || 0,
      freeAbove: b.delivery?.freeAbove || 0,
      freeWithinKm: b.delivery?.freeWithinKm || 0,
      blockedReason: sample("delivery"),
      zones: (b.delivery?.zones || [])
        .filter((z) => z.active)
        .map((z) => ({
          _id: String(z._id),
          name: z.name,
          areas: z.areas,
          fee: z.fee,
          distanceKm: z.distanceKm ?? null,
          minOrder: z.minOrder,
          travelMinutes: z.travelMinutes,
        })),
    },
  };
};

const defaultHours = () =>
  [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, open: true, from: "11:00", to: "23:00" }));

module.exports = {
  DAY_NAMES,
  METHODS,
  isOpenAt,
  nextOpening,
  restrictionFor,
  quoteFulfillment,
  publicBranch,
  defaultHours,
};
