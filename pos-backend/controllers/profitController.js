const createHttpError = require("http-errors");
const DailyProfit = require("../models/dailyProfitModel");
const Expense = require("../models/expenseModel");
const Order = require("../models/orderModel");
const {
  todayKey,
  currentMonthKey,
  monthRange,
  dayRange,
  dayKeyFor,
  revenueForRange,
  computeDayFigures,
  earnedOrderFilter,
  orderItemCount,
} = require("../utils/profitService");

const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY_RE = /^\d{4}-\d{2}$/;

// Revenue - expenses for one calendar day, picked via the date-picker in the
// admin dashboard. "Today" is always computed live (expenses logged an hour
// ago should show up immediately). Any earlier day prefers its locked
// end-of-day record when one exists — see services/dailyProfitScheduler —
// so a day's numbers stay exactly what they were at close of day; if it
// hasn't been locked yet for some reason (server was down at 11:59pm, very
// new deployment, etc.) it's simply computed live as a fallback.
const getDailyProfit = async (req, res, next) => {
  try {
    const dayKey = req.query.date && DAY_KEY_RE.test(req.query.date) ? req.query.date : todayKey();
    const isToday = dayKey === todayKey();

    if (!isToday) {
      const locked = await DailyProfit.findOne({ dayKey });
      if (locked) {
        return res.status(200).json({
          success: true,
          data: {
            dayKey,
            revenue: locked.revenue,
            cost: locked.cost,
            expenses: locked.expenses,
            profit: locked.profit,
            ordersCount: locked.ordersCount,
            itemsSold: locked.itemsSold,
            locked: true,
            lockedAt: locked.lockedAt,
          },
        });
      }
    }

    const figures = await computeDayFigures(dayKey);
    res.status(200).json({ success: true, data: { ...figures, locked: false } });
  } catch (error) {
    next(error);
  }
};

// Whole-month totals (revenue, expenses, profit) plus a figure for EVERY
// day of the month so far — not just the ones that happened to already lock
// overnight — so the admin dashboard can render a full calendar and clicking
// any past date always has a number to show. Locked days use their
// finalized (frozen) figures; any other day is computed live from the same
// orders/expenses the daily-profit endpoint would return for it, so the
// numbers always agree with each other.
const getMonthlyProfit = async (req, res, next) => {
  try {
    const monthKey = req.query.month && MONTH_KEY_RE.test(req.query.month) ? req.query.month : currentMonthKey();
    const { start, end } = monthRange(monthKey);

    const [orders, expenseDocs, lockedDays] = await Promise.all([
      Order.find({
        ...earnedOrderFilter(),
        orderDate: { $gte: start, $lt: end },
      }).select("bills items orderDate costOfGoods"),
      Expense.find({
        dayKey: { $gte: `${monthKey}-01`, $lte: `${monthKey}-31` },
      }).select("amount dayKey"),
      DailyProfit.find({ dayKey: { $gte: `${monthKey}-01`, $lte: `${monthKey}-31` } }),
    ]);

    // Group orders + expenses by calendar day so every day's figures can be
    // built from a single pass instead of one query per day.
    const revenueByDay = {};
    const costByDay = {};
    const itemsByDay = {};
    const ordersCountByDay = {};
    orders.forEach((o) => {
      const dayKey = dayKeyFor(new Date(o.orderDate));
      revenueByDay[dayKey] = (revenueByDay[dayKey] || 0) + (Number(o?.bills?.totalWithTax ?? o?.bills?.total ?? 0) || 0);
      costByDay[dayKey] = (costByDay[dayKey] || 0) + (Number(o?.costOfGoods) || 0);
      itemsByDay[dayKey] = (itemsByDay[dayKey] || 0) + orderItemCount(o);
      ordersCountByDay[dayKey] = (ordersCountByDay[dayKey] || 0) + 1;
    });

    const expensesByDay = {};
    expenseDocs.forEach((e) => {
      expensesByDay[e.dayKey] = (expensesByDay[e.dayKey] || 0) + (Number(e.amount) || 0);
    });

    const lockedByDay = {};
    lockedDays.forEach((d) => {
      lockedByDay[d.dayKey] = d;
    });

    // Every day from the 1st of the month up to today (for the current
    // month) or the last day of the month (for a past month) — so the
    // calendar always has a full run of days to click, including ones with
    // zero activity.
    const now = new Date();
    const isCurrentMonth = monthKey === currentMonthKey();
    const lastDayOfMonth = new Date(end.getTime() - 1).getDate();
    const lastDayToShow = isCurrentMonth ? now.getDate() : lastDayOfMonth;

    const days = [];
    for (let day = 1; day <= lastDayToShow; day++) {
      const dayKey = `${monthKey}-${String(day).padStart(2, "0")}`;
      const locked = lockedByDay[dayKey];

      if (locked) {
        days.push({
          dayKey,
          revenue: locked.revenue,
          cost: locked.cost,
          expenses: locked.expenses,
          profit: locked.profit,
          ordersCount: locked.ordersCount,
          itemsSold: locked.itemsSold,
          locked: true,
        });
      } else {
        const revenue = revenueByDay[dayKey] || 0;
        const cost = costByDay[dayKey] || 0;
        const expenses = expensesByDay[dayKey] || 0;
        days.push({
          dayKey,
          revenue,
          cost,
          expenses,
          profit: revenue - cost - expenses,
          ordersCount: ordersCountByDay[dayKey] || 0,
          itemsSold: itemsByDay[dayKey] || 0,
          locked: false,
        });
      }
    }

    const revenue = days.reduce((sum, d) => sum + d.revenue, 0);
    const cost = days.reduce((sum, d) => sum + d.cost, 0);
    const expenses = days.reduce((sum, d) => sum + d.expenses, 0);
    const itemsSold = days.reduce((sum, d) => sum + d.itemsSold, 0);
    const ordersCount = days.reduce((sum, d) => sum + d.ordersCount, 0);

    res.status(200).json({
      success: true,
      data: {
        monthKey,
        revenue,
        cost,
        expenses,
        // Profit = Sales - Purchases/Cost - Expenses.
        profit: revenue - cost - expenses,
        ordersCount,
        itemsSold,
        // Every day of the month so far, oldest first — click any of them
        // (dashboard side) to load that day into the Daily Profit picker.
        days,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Every order placed on a given calendar day, each with its own
// revenue/cost/profit — the per-order breakdown behind the Daily Profit
// summary, shown when a day is picked on the dashboard. Includes ALL
// orders that day (not just "earned" ones), each clearly marked with its
// status, so a cancelled order still shows up (at Rs 0 profit) instead of
// silently vanishing from the count.
const getDayOrders = async (req, res, next) => {
  try {
    const dayKey = req.query.date && DAY_KEY_RE.test(req.query.date) ? req.query.date : todayKey();
    const { start, end } = dayRange(dayKey);

    const orders = await Order.find({ orderDate: { $gte: start, $lt: end } })
      .populate("table", "tableNo")
      .sort({ orderDate: 1 })
      .select("orderNumber customerDetails orderStatus orderSource table items bills costOfGoods orderDate");

    const rows = orders.map((o) => {
      // Mirrors earnedOrderFilter() in utils/profitService.js — whether
      // THIS order actually counted towards the day's revenue figure above.
      const isEarned =
        o.orderSource !== "Online" ? o.orderStatus !== "Cancelled" : o.orderStatus === "Completed";
      const revenue = isEarned ? Number(o?.bills?.totalWithTax ?? o?.bills?.total ?? 0) || 0 : 0;
      const cost = isEarned ? Number(o?.costOfGoods) || 0 : 0;

      return {
        _id: o._id,
        orderNumber: o.orderNumber || String(o._id).slice(-6).toUpperCase(),
        customerName: o.customerDetails?.name || "—",
        orderStatus: o.orderStatus,
        orderSource: o.orderSource,
        table: o.table?.tableNo ?? null,
        itemsCount: orderItemCount(o),
        orderDate: o.orderDate,
        revenue,
        cost,
        profit: revenue - cost,
        countedTowardsProfit: isEarned,
      };
    });

    res.status(200).json({ success: true, data: { dayKey, orders: rows } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDailyProfit, getMonthlyProfit, getDayOrders };
