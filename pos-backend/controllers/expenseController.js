const createHttpError = require("http-errors");
const Expense = require("../models/expenseModel");
const { dayKeyFor, todayKey } = require("../utils/profitService");

const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

// Adds one expense entry (e.g. "Gas cylinder", Rs 1200) against a day.
// Defaults to today if no date is given, so the common case — logging an
// expense as it happens — needs nothing but the amount + description.
const addExpense = async (req, res, next) => {
  try {
    const { amount, description, date } = req.body;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return next(createHttpError(400, "Enter a valid expense amount."));
    }

    let dayKey = todayKey();
    if (date) {
      dayKey = DAY_KEY_RE.test(date) ? date : dayKeyFor(new Date(date));
    }

    const expense = await Expense.create({
      dayKey,
      amount: numericAmount,
      description: String(description || "").trim(),
    });

    res.status(201).json({ success: true, message: "Expense added!", data: expense });
  } catch (error) {
    next(error);
  }
};

// Lists expenses for a single day (defaults to today).
const getExpenses = async (req, res, next) => {
  try {
    const dayKey = req.query.date && DAY_KEY_RE.test(req.query.date) ? req.query.date : todayKey();
    const expenses = await Expense.find({ dayKey }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return next(createHttpError(404, "Expense not found."));
    }
    res.status(200).json({ success: true, message: "Expense removed." });
  } catch (error) {
    next(error);
  }
};

module.exports = { addExpense, getExpenses, deleteExpense };
