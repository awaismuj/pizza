const createHttpError = require("http-errors");
const Shift = require("../models/shiftModel");
const Order = require("../models/orderModel");
const Expense = require("../models/expenseModel");

/**
 * Helper to compute live sales and expenses since a given start timestamp.
 */
async function computeShiftFinancials(startTime, endTime = new Date()) {
  const queryOrders = {
    orderDate: { $gte: startTime, $lte: endTime },
    orderStatus: { $ne: "Cancelled" },
  };

  const orders = await Order.find(queryOrders).select(
    "bills paymentMethod splitPayments orderStatus orderNumber orderDate"
  );

  let cashSales = 0;
  let cardSales = 0;
  let otherSales = 0;
  let totalSales = 0;

  for (const ord of orders) {
    const totalWithTax = Number(ord.bills?.totalWithTax || 0);
    totalSales += totalWithTax;

    if (ord.paymentMethod === "Cash") {
      cashSales += totalWithTax;
    } else if (ord.paymentMethod === "Online" || ord.paymentMethod === "Card") {
      cardSales += totalWithTax;
    } else if (ord.paymentMethod === "Split" && Array.isArray(ord.splitPayments) && ord.splitPayments.length > 0) {
      for (const sp of ord.splitPayments) {
        const amt = Number(sp.amount || 0);
        if (sp.method === "Cash") cashSales += amt;
        else if (sp.method === "Card" || sp.method === "Online") cardSales += amt;
        else otherSales += amt;
      }
    } else {
      otherSales += totalWithTax;
    }
  }

  const expenses = await Expense.find({
    createdAt: { $gte: startTime, $lte: endTime },
  });

  const cashExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return {
    orderCount: orders.length,
    totalSales,
    cashSales,
    cardSales,
    otherSales,
    cashExpenses,
    expenseCount: expenses.length,
  };
}

// GET /api/shift/current - Get active open shift with live calculated totals
const getCurrentShift = async (req, res, next) => {
  try {
    const activeShift = await Shift.findOne({ status: "Open" }).sort({ createdAt: -1 });
    if (!activeShift) {
      return res.status(200).json({
        success: true,
        isOpen: false,
        data: null,
      });
    }

    const liveFinancials = await computeShiftFinancials(activeShift.startTime);
    const expectedCash =
      Number(activeShift.startingCashFloat || 0) +
      liveFinancials.cashSales -
      liveFinancials.cashExpenses;

    res.status(200).json({
      success: true,
      isOpen: true,
      data: {
        shift: activeShift,
        liveFinancials: {
          ...liveFinancials,
          expectedCash,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/shift/open - Start new shift with cash float
const openShift = async (req, res, next) => {
  try {
    const existing = await Shift.findOne({ status: "Open" });
    if (existing) {
      return next(
        createHttpError(
          400,
          `A shift is already open (started ${existing.startTime.toLocaleTimeString()}). Close it first before opening a new shift.`
        )
      );
    }

    const { startingCashFloat, notes } = req.body;
    const floatAmount = Number(startingCashFloat);
    if (isNaN(floatAmount) || floatAmount < 0) {
      return next(createHttpError(400, "Starting cash drawer float must be a non-negative number."));
    }

    const shift = new Shift({
      cashierId: req.user?._id,
      cashierName: req.user?.name || "Cashier",
      startingCashFloat: floatAmount,
      closingNotes: notes || "",
      status: "Open",
      startTime: new Date(),
    });

    await shift.save();

    res.status(201).json({
      success: true,
      message: "Cash drawer shift opened successfully!",
      data: shift,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/shift/close - Close shift with cash count & generate Z-Report
const closeShift = async (req, res, next) => {
  try {
    const shift = await Shift.findOne({ status: "Open" }).sort({ createdAt: -1 });
    if (!shift) {
      return next(createHttpError(404, "No active open shift found to close."));
    }

    const { actualCashCounted, closingNotes } = req.body;
    const countedAmount = Number(actualCashCounted);
    if (isNaN(countedAmount) || countedAmount < 0) {
      return next(createHttpError(400, "Actual counted cash must be a valid number."));
    }

    const endTime = new Date();
    const financials = await computeShiftFinancials(shift.startTime, endTime);
    const expectedCash =
      Number(shift.startingCashFloat || 0) +
      financials.cashSales -
      financials.cashExpenses;

    const discrepancy = countedAmount - expectedCash;

    shift.endTime = endTime;
    shift.cashSales = financials.cashSales;
    shift.cardSales = financials.cardSales;
    shift.otherSales = financials.otherSales;
    shift.cashExpenses = financials.cashExpenses;
    shift.expectedCash = expectedCash;
    shift.actualCashCounted = countedAmount;
    shift.discrepancy = discrepancy;
    shift.status = "Closed";
    if (closingNotes) shift.closingNotes = closingNotes;

    await shift.save();

    res.status(200).json({
      success: true,
      message: "Shift closed and Z-Report generated successfully!",
      data: {
        shift,
        summary: {
          ...financials,
          expectedCash,
          actualCashCounted: countedAmount,
          discrepancy,
          discrepancyType: discrepancy === 0 ? "Exact" : discrepancy > 0 ? "Overage" : "Shortage",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/shift/history - Shift log and Z-Report archive
const getShiftHistory = async (req, res, next) => {
  try {
    const shifts = await Shift.find({ status: "Closed" })
      .sort({ endTime: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: shifts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentShift,
  openShift,
  closeShift,
  getShiftHistory,
};
