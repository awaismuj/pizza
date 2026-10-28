const { sendReport, normalizeFormat } = require("../utils/reportExport");
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
  orderRevenue,
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
const buildDaily = async (dayKey) => {
  const isToday = dayKey === todayKey();
  if (!isToday) {
    const locked = await DailyProfit.findOne({ dayKey });
    if (locked) {
      let { revenue } = locked;
      if (locked.revenueBasis !== "net-sales-v1") {
        const { start, end } = dayRange(dayKey);
        ({ revenue } = await revenueForRange(start, end));
        locked.profit = revenue - locked.cost - locked.expenses;
        locked.revenue = revenue;
        locked.revenueBasis = "net-sales-v1";
        await locked.save();
      }
      return {
        dayKey,
        revenue,
        cost: locked.cost,
        expenses: locked.expenses,
        profit: locked.profit,
        ordersCount: locked.ordersCount,
        itemsSold: locked.itemsSold,
        locked: true,
        lockedAt: locked.lockedAt,
      };
    }
  }
  const figures = await computeDayFigures(dayKey);
  return { ...figures, locked: false };
};

const getDailyProfit = async (req, res, next) => {
  try {
    const dayKey = req.query.date && DAY_KEY_RE.test(req.query.date) ? req.query.date : todayKey();
    res.status(200).json({ success: true, data: await buildDaily(dayKey) });
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
const buildMonthly = async (monthKey) => {
  {
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
      revenueByDay[dayKey] = (revenueByDay[dayKey] || 0) + orderRevenue(o);
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
    const migratedLocks = [];
    for (let day = 1; day <= lastDayToShow; day++) {
      const dayKey = `${monthKey}-${String(day).padStart(2, "0")}`;
      const locked = lockedByDay[dayKey];

      if (locked) {
        const revenue = locked.revenueBasis === "net-sales-v1" ? locked.revenue : revenueByDay[dayKey] || 0;
        const profit = locked.revenueBasis === "net-sales-v1"
          ? locked.profit
          : revenue - locked.cost - locked.expenses;
        if (locked.revenueBasis !== "net-sales-v1") {
          migratedLocks.push({
            updateOne: {
              filter: { _id: locked._id, revenueBasis: { $ne: "net-sales-v1" } },
              update: { $set: { revenue, profit, revenueBasis: "net-sales-v1" } },
            },
          });
        }
        days.push({
          dayKey,
          revenue,
          cost: locked.cost,
          expenses: locked.expenses,
          profit,
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
    if (migratedLocks.length) await DailyProfit.bulkWrite(migratedLocks);

    const revenue = days.reduce((sum, d) => sum + d.revenue, 0);
    const cost = days.reduce((sum, d) => sum + d.cost, 0);
    const expenses = days.reduce((sum, d) => sum + d.expenses, 0);
    const itemsSold = days.reduce((sum, d) => sum + d.itemsSold, 0);
    const ordersCount = days.reduce((sum, d) => sum + d.ordersCount, 0);

    return {
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
    };
  }
};

const getMonthlyProfit = async (req, res, next) => {
  try {
    const monthKey = req.query.month && MONTH_KEY_RE.test(req.query.month) ? req.query.month : currentMonthKey();
    res.status(200).json({ success: true, data: await buildMonthly(monthKey) });
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
const buildDayOrders = async (dayKey) => {
  {
    const { start, end } = dayRange(dayKey);

    const orders = await Order.find({ orderDate: { $gte: start, $lt: end } })
      .populate("table", "tableNo")
      .sort({ orderDate: 1 })
      .select("orderNumber customerDetails orderStatus orderSource table items bills costOfGoods orderDate paymentMethod paymentStatus jazzcash.tid");

    const rows = orders.map((o) => {
      // Mirrors earnedOrderFilter() in utils/profitService.js — whether
      // THIS order actually counted towards the day's revenue figure above.
      const paymentOk = o.paymentMethod !== "JazzCash/Raast" || o.paymentStatus === "Verified";
      const isEarned =
        paymentOk && (o.orderSource !== "Online" ? o.orderStatus !== "Cancelled" : o.orderStatus === "Completed");
      const revenue = isEarned ? orderRevenue(o) : 0;
      const cost = isEarned ? Number(o?.costOfGoods) || 0 : 0;

      return {
        _id: o._id,
        orderNumber: o.orderNumber || String(o._id).slice(-6).toUpperCase(),
        customerName: o.customerDetails?.name || "—",
        orderStatus: o.orderStatus,
        orderSource: o.orderSource,
        paymentMethod: o.paymentMethod || "",
        paymentStatus: o.paymentStatus || "",
        tid: o.jazzcash?.tid || "",
        table: o.table?.tableNo ?? null,
        itemsCount: orderItemCount(o),
        orderDate: o.orderDate,
        revenue,
        cost,
        profit: revenue - cost,
        countedTowardsProfit: isEarned,
      };
    });

    return rows;
  }
};

const getDayOrders = async (req, res, next) => {
  try {
    const dayKey = req.query.date && DAY_KEY_RE.test(req.query.date) ? req.query.date : todayKey();
    res.status(200).json({ success: true, data: { dayKey, orders: await buildDayOrders(dayKey) } });
  } catch (error) {
    next(error);
  }
};

const prettyDay = (dayKey) => {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
};
const prettyMonth = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

const MONEY_COLUMNS = (keys) => keys.map(([key, label]) => ({ key, label, type: "money" }));

// Downloadable Profit report — scope "day" (summary + every order + the
// day's expenses) or "month" (summary + one row per day), as CSV, Excel
// (.xlsx) or PDF. Figures come from the very same builders the dashboard
// uses, so an exported file always matches what is on screen.
const exportProfit = async (req, res, next) => {
  try {
    const format = normalizeFormat(req.query.format);
    const scope = req.query.scope === "month" ? "month" : "day";

    if (scope === "month") {
      const monthKey = req.query.month && MONTH_KEY_RE.test(req.query.month) ? req.query.month : currentMonthKey();
      const monthly = await buildMonthly(monthKey);
      const totals = { dayKey: "Total", ordersCount: monthly.ordersCount, itemsSold: monthly.itemsSold, revenue: monthly.revenue, cost: monthly.cost, expenses: monthly.expenses, profit: monthly.profit };
      return await sendReport(res, {
        title: `Monthly Profit Report — ${prettyMonth(monthKey)}`,
        filename: `profit-month-${monthKey}`,
        subtitle: "Revenue = discounted sales before tax + delivery fees · Profit = Revenue − Purchases/Cost − Expenses · Amounts in Rs",
        footer: "GenZ Pizza Land · Profit & Expenses",
        summary: [
          { label: "Revenue (excl. tax)", value: monthly.revenue, type: "money" },
          { label: "Purchases / Cost", value: monthly.cost, type: "money" },
          { label: "Expenses", value: monthly.expenses, type: "money" },
          { label: "Actual Profit", value: monthly.profit, type: "money" },
          { label: "Orders counted", value: monthly.ordersCount, type: "number" },
          { label: "Items sold", value: monthly.itemsSold, type: "number" },
        ],
        sections: [{
          title: "Daily breakdown",
          sheetName: "Daily breakdown",
          columns: [
            { key: "dayKey", label: "Date", type: "text", width: 80 },
            { key: "ordersCount", label: "Orders", type: "number", width: 50 },
            { key: "itemsSold", label: "Items sold", type: "number", width: 60 },
            ...MONEY_COLUMNS([["revenue", "Revenue (excl. tax)"], ["cost", "Purchases / Cost"], ["expenses", "Expenses"], ["profit", "Profit"]]),
            { key: "status", label: "Day status", type: "text", width: 70 },
          ],
          rows: monthly.days.map((day) => ({ ...day, status: day.locked ? "Locked (final)" : "Live" })),
          totals,
        }],
      }, format);
    }

    const dayKey = req.query.date && DAY_KEY_RE.test(req.query.date) ? req.query.date : todayKey();
    const [daily, orders, expenses] = await Promise.all([
      buildDaily(dayKey),
      buildDayOrders(dayKey),
      Expense.find({ dayKey }).sort({ createdAt: 1 }).select("amount description createdAt").lean(),
    ]);
    const time = (value) => (value ? new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "");
    const orderRows = orders.map((o) => ({
      orderNumber: `#${o.orderNumber}`,
      time: time(o.orderDate),
      customer: o.customerName,
      source: o.orderSource === "Online" ? "Online" : o.table ? `Table ${o.table}` : "Takeaway",
      items: o.itemsCount,
      status: o.countedTowardsProfit ? o.orderStatus : `${o.orderStatus} (not counted)`,
      payment: o.paymentMethod || "",
      revenue: o.revenue,
      cost: o.cost,
      profit: o.profit,
    }));
    await sendReport(res, {
      title: `Daily Profit Report — ${prettyDay(dayKey)}`,
      filename: `profit-day-${dayKey}`,
      subtitle: `${daily.locked ? "Locked end-of-day figures" : "Live figures"} · Revenue = discounted sales before tax + delivery fees · Profit = Revenue − Purchases/Cost − Expenses · Amounts in Rs`,
      footer: "GenZ Pizza Land · Profit & Expenses",
      summary: [
        { label: "Revenue (excl. tax)", value: daily.revenue, type: "money" },
        { label: "Purchases / Cost", value: daily.cost, type: "money" },
        { label: "Expenses", value: daily.expenses, type: "money" },
        { label: "Actual Profit", value: daily.profit, type: "money" },
        { label: "Orders counted", value: daily.ordersCount, type: "number" },
        { label: "Items sold", value: daily.itemsSold, type: "number" },
      ],
      sections: [
        {
          title: "Orders",
          sheetName: "Orders",
          columns: [
            { key: "orderNumber", label: "Order", type: "text", width: 60 },
            { key: "time", label: "Time", type: "text", width: 45 },
            { key: "customer", label: "Customer", type: "text", width: 110 },
            { key: "source", label: "Type", type: "text", width: 70 },
            { key: "items", label: "Items", type: "number", width: 40 },
            { key: "status", label: "Status", type: "text", width: 110 },
            { key: "payment", label: "Payment", type: "text", width: 80 },
            ...MONEY_COLUMNS([["revenue", "Revenue (excl. tax)"], ["cost", "Cost"], ["profit", "Profit"]]),
          ],
          rows: orderRows,
          totals: orderRows.length ? {
            orderNumber: "Total",
            revenue: orderRows.reduce((sum, row) => sum + row.revenue, 0),
            cost: orderRows.reduce((sum, row) => sum + row.cost, 0),
            profit: orderRows.reduce((sum, row) => sum + row.profit, 0),
          } : undefined,
        },
        {
          title: "Expenses",
          sheetName: "Expenses",
          columns: [
            { key: "time", label: "Logged at", type: "text", width: 70 },
            { key: "description", label: "Description", type: "text", width: 260 },
            { key: "amount", label: "Amount", type: "money", width: 90 },
          ],
          rows: expenses.map((e) => ({ time: time(e.createdAt), description: e.description || "—", amount: e.amount })),
          totals: expenses.length ? { time: "Total", amount: expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) } : undefined,
        },
      ],
    }, format);
  } catch (error) {
    next(error);
  }
};


module.exports = { getDailyProfit, getMonthlyProfit, getDayOrders, exportProfit };
