// Shared, single-source-of-truth helpers for turning raw order data into
// the numbers shown on the Home page (Total Earnings / In Progress) and the
// Admin Dashboard (Revenue / Total Orders / Items Sold / Active Orders).
// Keeping this logic in one place guarantees the two screens never disagree.

// Orders are counted as "earned" revenue as soon as payment was actually
// collected for them: POS orders (dine-in + Outdoor/Takeaway) are paid at
// the register the moment the order is placed, so they count immediately
// unless Cancelled — waiting for "Closed" (really just "ticket closed out")
// used to delay showing that revenue for hours. Online orders may be
// Cash-on-Delivery, so they only count once "Completed" (delivered).
//
// JazzCash/Raast orders additionally count ONLY once the payment is
// Verified — money that staff haven't confirmed (or have rejected) is never
// revenue. Mirrors utils/profitService.js on the backend.
export const isEarnedOrder = (order) => {
  if (order.paymentMethod === "JazzCash/Raast" && order.paymentStatus !== "Verified") return false;
  return order.orderSource === "Online" ? order.orderStatus === "Completed" : order.orderStatus !== "Cancelled";
};
export const IN_PROGRESS_STATUS = "In Progress";

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const orderTotal = (order) =>
  Number(order?.bills?.totalWithTax ?? order?.bills?.total ?? 0) || 0;

export const orderItemCount = (order) =>
  Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0)
    : 0;

export const formatCurrency = (value) => {
  // Whole numbers show without decimals, fractional ones keep 2dp (e.g. Rs 1.05).
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

export const pctChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Computes today-vs-yesterday earnings and in-progress counts from a raw
// orders array (as returned by GET /api/order).
export const computeDailyMetrics = (orders = []) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  let todayTotal = 0;
  let yesterdayTotal = 0;
  let todayInProgress = 0;
  let yesterdayInProgress = 0;

  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate || order.createdAt);
    const isToday = isSameDay(orderDate, now);
    const isYesterday = isSameDay(orderDate, yesterday);

    if (isEarnedOrder(order)) {
      if (isToday) todayTotal += orderTotal(order);
      if (isYesterday) yesterdayTotal += orderTotal(order);
    }

    if (order.orderStatus === IN_PROGRESS_STATUS) {
      if (isToday) todayInProgress += 1;
      if (isYesterday) yesterdayInProgress += 1;
    }
  });

  return {
    todayEarnings: todayTotal,
    earningsChangePct: pctChange(todayTotal, yesterdayTotal),
    inProgressCount: todayInProgress,
    inProgressChangePct: pctChange(todayInProgress, yesterdayInProgress),
  };
};

// Computes the all-time totals used by the Admin Dashboard's "Overall
// Performance" cards (Revenue, Total Orders, Items Sold, Active Orders).
export const computeOverallMetrics = (orders = []) => {
  const closedOrders = orders.filter((o) => isEarnedOrder(o));
  const activeOrders = orders.filter((o) => o.orderStatus === IN_PROGRESS_STATUS);

  const revenue = closedOrders.reduce((sum, o) => sum + orderTotal(o), 0);
  const itemsSold = closedOrders.reduce((sum, o) => sum + orderItemCount(o), 0);
  const uniqueCustomers = new Set(
    closedOrders.map((o) => o?.customerDetails?.phone).filter(Boolean)
  ).size;

  return {
    revenue,
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    itemsSold,
    totalCustomers: uniqueCustomers,
  };
};

const isInMonth = (date, monthsAgo, refDate) => {
  const target = new Date(refDate.getFullYear(), refDate.getMonth() - monthsAgo, 1);
  return date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth();
};

// Compares "this calendar month" against "last calendar month" for every
// Overall Performance stat, so the % badges reflect real month-over-month
// change instead of fake numbers.
export const computeMonthlyMetrics = (orders = []) => {
  const now = new Date();
  const thisMonthOrders = orders.filter((o) =>
    isInMonth(new Date(o.orderDate || o.createdAt), 0, now)
  );
  const lastMonthOrders = orders.filter((o) =>
    isInMonth(new Date(o.orderDate || o.createdAt), 1, now)
  );

  const current = computeOverallMetrics(thisMonthOrders);
  const previous = computeOverallMetrics(lastMonthOrders);

  return {
    revenue: { value: current.revenue, percentage: pctChange(current.revenue, previous.revenue) },
    totalOrders: { value: current.totalOrders, percentage: pctChange(current.totalOrders, previous.totalOrders) },
    totalCustomers: { value: current.totalCustomers, percentage: pctChange(current.totalCustomers, previous.totalCustomers) },
    itemsSold: { value: current.itemsSold, percentage: pctChange(current.itemsSold, previous.itemsSold) },
  };
};

// Extra numbers for the redesigned Home page: today's order count, average
// ticket, hourly sales (for the sparkline) and how many live orders sit in
// each stage. Uses the same "earned" rule as every other screen.
export const computeHomeStats = (orders = []) => {
  const now = new Date();
  const todays = orders.filter((o) => isSameDay(new Date(o.orderDate || o.createdAt), now));
  const earned = todays.filter(isEarnedOrder);
  const earnings = earned.reduce((sum, o) => sum + orderTotal(o), 0);

  const hourly = Array.from({ length: 24 }, () => 0);
  earned.forEach((o) => {
    hourly[new Date(o.orderDate || o.createdAt).getHours()] += orderTotal(o);
  });

  const live = orders.filter((o) => !["Closed", "Completed", "Cancelled"].includes(o.orderStatus));
  const stageCounts = live.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return {
    ordersToday: todays.filter((o) => o.orderStatus !== "Cancelled").length,
    cancelledToday: todays.filter((o) => o.orderStatus === "Cancelled").length,
    averageTicket: earned.length ? earnings / earned.length : 0,
    onlineToday: todays.filter((o) => o.orderSource === "Online" && o.orderStatus !== "Cancelled").length,
    hourly,
    liveCount: live.length,
    stageCounts,
  };
};
