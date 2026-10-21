// Client side of the order preparation countdown. The backend stamps the
// deadline (prep.deadline); this file only does arithmetic against it, so the
// timer stays correct across refreshes, page changes and other terminals and
// never needs a request per second.
//
import { getOrderNumber } from "./index";

// Keep the status lists in sync with utils/prepTimer.js on the backend.

export const PREP_ACTIVE_STATUSES = ["In Progress", "Pending", "Payment Pending Verification", "Accepted", "Preparing"];
export const PREP_READY_STATUSES = ["Ready", "Ready to Deliver"];
export const DEFAULT_TIMEZONE = "Asia/Karachi";

export const DEFAULT_PREP_SETTINGS = {
  enabled: true,
  defaultMinutes: 20,
  mascotEnabled: true,
  soundEnabled: true,
  timezone: DEFAULT_TIMEZONE,
  alerts: {
    warn1: { enabled: true, minutes: 10 },
    warn2: { enabled: true, minutes: 5 },
    warn3: { enabled: true, minutes: 2 },
    overdue: { enabled: true },
  },
};

const MIN = 60 * 1000;

export const hasPrepTimer = (order) => Boolean(order?.prep?.deadline);

export const isPrepActive = (order) =>
  hasPrepTimer(order) && PREP_ACTIVE_STATUSES.includes(order.orderStatus) && !order.prep.readyAt;

// mm:ss (or h:mm:ss past an hour). Always a positive display value.
export const formatClock = (ms) => {
  const total = Math.floor(Math.abs(ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

// Colours requested for the badge: green > 10 min, yellow <= 10, orange <= 5, red once overdue.
export const TONES = {
  green: { text: "#34d399", bg: "rgba(16,185,129,0.14)", border: "rgba(16,185,129,0.45)", bar: "#10b981", label: "On track" },
  yellow: { text: "#facc15", bg: "rgba(250,204,21,0.14)", border: "rgba(250,204,21,0.45)", bar: "#facc15", label: "Getting close" },
  orange: { text: "#fb923c", bg: "rgba(251,146,60,0.16)", border: "rgba(251,146,60,0.5)", bar: "#fb923c", label: "Almost due" },
  red: { text: "#f87171", bg: "rgba(239,68,68,0.16)", border: "rgba(239,68,68,0.55)", bar: "#ef4444", label: "Overdue" },
  ready: { text: "#60a5fa", bg: "rgba(96,165,250,0.14)", border: "rgba(96,165,250,0.4)", bar: "#60a5fa", label: "Ready" },
};

export const toneFor = (remainingMs) => {
  if (remainingMs <= 0) return "red";
  if (remainingMs <= 5 * MIN) return "orange";
  if (remainingMs <= 10 * MIN) return "yellow";
  return "green";
};

// Everything a badge / card needs for one order at `nowMs`.
// phase: "running" (counting down / overdue), "ready" (kitchen finished) or "none".
export const getPrepState = (order, nowMs = Date.now()) => {
  if (!hasPrepTimer(order)) return { phase: "none" };
  const deadline = new Date(order.prep.deadline).getTime();
  const started = new Date(order.prep.startedAt || order.orderDate || order.createdAt).getTime();

  if (PREP_READY_STATUSES.includes(order.orderStatus) || order.prep.readyAt) {
    const readyAt = order.prep.readyAt ? new Date(order.prep.readyAt).getTime() : null;
    return { phase: "ready", tone: "ready", readyAt, late: readyAt != null ? readyAt > deadline : null, deadline };
  }
  if (!PREP_ACTIVE_STATUSES.includes(order.orderStatus)) return { phase: "none" };

  const remainingMs = deadline - nowMs;
  const totalMs = Math.max(deadline - started, 1);
  const progress = Math.min(1, Math.max(0, (nowMs - started) / totalMs));
  const overdue = remainingMs <= 0;
  const tone = toneFor(remainingMs);
  return {
    phase: "running",
    deadline,
    started,
    remainingMs,
    totalMs,
    progress,
    overdue,
    tone,
    clock: formatClock(remainingMs),
    text: overdue ? `OVERDUE BY ${formatClock(remainingMs)}` : `${formatClock(remainingMs)} remaining`,
  };
};

// Which dashboard group an order belongs to.
export const kitchenGroup = (order) => {
  if (PREP_READY_STATUSES.includes(order.orderStatus)) return "ready";
  if (["Pending", "Payment Pending Verification"].includes(order.orderStatus)) return "new";
  if (PREP_ACTIVE_STATUSES.includes(order.orderStatus)) return "preparing";
  return null;
};

export const orderLabel = (order) => getOrderNumber(order);

export const formatLocalTime = (value, timezone = DEFAULT_TIMEZONE) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timezone }).format(new Date(value));
  } catch {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
};

// Merge whatever the server returned over the defaults (older/partial data safe).
export const withPrepDefaults = (raw) => ({
  ...DEFAULT_PREP_SETTINGS,
  ...(raw || {}),
  alerts: {
    warn1: { ...DEFAULT_PREP_SETTINGS.alerts.warn1, ...(raw?.alerts?.warn1 || {}) },
    warn2: { ...DEFAULT_PREP_SETTINGS.alerts.warn2, ...(raw?.alerts?.warn2 || {}) },
    warn3: { ...DEFAULT_PREP_SETTINGS.alerts.warn3, ...(raw?.alerts?.warn3 || {}) },
    overdue: { ...DEFAULT_PREP_SETTINGS.alerts.overdue, ...(raw?.alerts?.overdue || {}) },
  },
});

// Mascot copy per alert level (exactly the wording requested).
export const ALERT_COPY = {
  warn1: (n) => ({ title: "Hey Chef! 🍕", body: `Order #${n} needs some love!`, detail: "Only 10 minutes left!" }),
  warn2: (n) => ({ title: "Pizza time is getting closer! 🔥", body: `Order #${n} should be ready in 5 minutes!`, detail: "" }),
  warn3: (n) => ({ title: "Quick, Chef! ⏰", body: `Order #${n} is almost due!`, detail: "Let's get it ready for delivery!" }),
  overdue: (n) => ({ title: "Oops, Chef! 😅", body: `Order #${n} has passed its preparation deadline.`, detail: "Please check the kitchen!" }),
};
