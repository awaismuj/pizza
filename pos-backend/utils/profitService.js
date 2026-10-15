const Order = require("../models/orderModel");
const Expense = require("../models/expenseModel");

// Orders are counted as "earned" revenue as soon as payment was actually
// collected for them:
//  - POS orders (dine-in AND Outdoor/Takeaway) are paid at the register the
//    moment the order is placed — "In Progress" -> "Ready" -> "Closed" is
//    just the kitchen/table lifecycle after that, not a payment gate. So
//    every POS order counts immediately except a Cancelled one.
//  - Online orders may be Cash-on-Delivery, so they only count once
//    "Completed" (actually delivered) — a customer can still cancel before
//    then, and staff can also cancel a "Pending" order that never gets
//    accepted.
// Mirrors isEarnedOrder() in the pos-frontend's orderMetrics.js so the two
// never disagree. Returned as a Mongo filter (rather than a plain status
// list) because "earned" now depends on orderSource too, not status alone.
const earnedOrderFilter = () => ({
  $or: [
    { orderSource: { $ne: "Online" }, orderStatus: { $ne: "Cancelled" } },
    { orderSource: "Online", orderStatus: "Completed" },
  ],
});

const pad2 = (n) => String(n).padStart(2, "0");

// "YYYY-MM-DD" in the SERVER's local time zone (matches how the frontend
// already treats "today" everywhere else in this app).
const dayKeyFor = (date = new Date()) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const todayKey = () => dayKeyFor(new Date());

// Local midnight -> next local midnight for a "YYYY-MM-DD" key.
const dayRange = (dayKey) => {
  const [y, m, d] = dayKey.split("-").map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d + 1, 0, 0, 0, 0);
  return { start, end };
};

// First -> first-of-next-month for a "YYYY-MM" key.
const monthRange = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  const start = new Date(y, m - 1, 1, 0, 0, 0, 0);
  const end = new Date(y, m, 1, 0, 0, 0, 0);
  return { start, end };
};

const currentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
};

const orderItemCount = (order) =>
  Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0)
    : 0;

// Revenue + items sold for every EARNED order whose orderDate falls in
// [start, end). Used for both a single day and a whole month.
const revenueForRange = async (start, end) => {
  const orders = await Order.find({
    ...earnedOrderFilter(),
    orderDate: { $gte: start, $lt: end },
  }).select("bills items orderDate costOfGoods");

  const revenue = orders.reduce((sum, o) => sum + (Number(o?.bills?.totalWithTax ?? o?.bills?.total ?? 0) || 0), 0);
  const itemsSold = orders.reduce((sum, o) => sum + orderItemCount(o), 0);
  // "Purchases/Cost" - cost of the ingredients/stock actually consumed for
  // these orders (cost of goods sold), captured per-order at the moment
  // inventory was taken out for it. See models/orderModel.js costOfGoods.
  const cost = orders.reduce((sum, o) => sum + (Number(o?.costOfGoods) || 0), 0);

  return { revenue, cost, itemsSold, ordersCount: orders.length };
};

// Revenue/cost/expenses/profit for a single calendar day (does NOT look at
// any locked DailyProfit record — callers decide whether to prefer a lock).
const computeDayFigures = async (dayKey) => {
  const { start, end } = dayRange(dayKey);
  const [{ revenue, cost, itemsSold, ordersCount }, expenseDocs] = await Promise.all([
    revenueForRange(start, end),
    Expense.find({ dayKey }).select("amount"),
  ]);

  const expenses = expenseDocs.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return {
    dayKey,
    revenue,
    cost,
    expenses,
    // Profit = Sales - Purchases/Cost - Expenses.
    profit: revenue - cost - expenses,
    ordersCount,
    itemsSold,
  };
};

module.exports = {
  earnedOrderFilter,
  dayKeyFor,
  todayKey,
  dayRange,
  monthRange,
  currentMonthKey,
  revenueForRange,
  computeDayFigures,
  orderItemCount,
};
