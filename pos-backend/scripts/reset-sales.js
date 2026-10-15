// Starts revenue, orders and profit again from zero.
//
//   npm run reset:sales                      -> DRY RUN: only shows what would be deleted
//   npm run reset:sales -- --yes             -> really deletes everything below
//   npm run reset:sales -- --yes --keep-expenses
//   npm run reset:sales -- --yes --before=2026-09-21   (only orders BEFORE that day)
//
// What it deletes:  orders (POS + online), daily profit records, expense
//                   entries (unless --keep-expenses), the Razorpay payment log.
// What it resets:   tables that were tied to a deleted order go back to Available.
// What it NEVER touches: menu, categories, deals, images, users, inventory stock.
//
// This cannot be undone - take a backup first (Atlas snapshot or `mongodump`).
// Note: stock used by the deleted orders is NOT put back into inventory; fix
// any quantities from Dashboard > Inventory if you want them corrected.
require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const Order = require("../models/orderModel");
const DailyProfit = require("../models/dailyProfitModel");
const Expense = require("../models/expenseModel");
const Payment = require("../models/paymentModel");
const Table = require("../models/tableModel");

const pad2 = (n) => String(n).padStart(2, "0");

const parseArgs = (argv) => {
  const args = { yes: false, keepExpenses: false, before: null };
  for (const arg of argv) {
    if (arg === "--yes") args.yes = true;
    else if (arg === "--keep-expenses") args.keepExpenses = true;
    else if (arg.startsWith("--before=")) args.before = arg.slice("--before=".length);
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (args.before && !/^\d{4}-\d{2}-\d{2}$/.test(args.before)) {
    throw new Error("--before must look like 2026-09-21");
  }
  return args;
};

const run = async (argv = process.argv.slice(2)) => {
  const args = parseArgs(argv);

  // --before=YYYY-MM-DD keeps that day and everything after it (server local time).
  let cutoff = null;
  let orderFilter = {};
  let dayKeyFilter = {};
  let paymentFilter = {};
  if (args.before) {
    const [y, m, d] = args.before.split("-").map(Number);
    cutoff = new Date(y, m - 1, d, 0, 0, 0, 0);
    orderFilter = { orderDate: { $lt: cutoff } };
    dayKeyFilter = { dayKey: { $lt: args.before } };
    paymentFilter = { createdAt: { $lt: cutoff } };
  }

  await mongoose.connect(config.databaseURI);
  console.log(`Connected to ${mongoose.connection.host} / ${mongoose.connection.name}`);

  const counts = {
    orders: await Order.countDocuments(orderFilter),
    dailyProfit: await DailyProfit.countDocuments(dayKeyFilter),
    expenses: args.keepExpenses ? 0 : await Expense.countDocuments(dayKeyFilter),
    payments: await Payment.countDocuments(paymentFilter),
  };

  console.log(`\n${args.yes ? "DELETING" : "DRY RUN - would delete"}${cutoff ? ` (before ${args.before})` : " (everything)"}:`);
  console.log(`  orders               ${counts.orders}`);
  console.log(`  daily profit records ${counts.dailyProfit}`);
  console.log(`  expenses             ${args.keepExpenses ? "kept" : counts.expenses}`);
  console.log(`  payment log entries  ${counts.payments}`);

  if (!args.yes) {
    console.log("\nNothing was changed. Run again with --yes to apply.");
    await mongoose.disconnect();
    return counts;
  }

  // Free any table that pointed at an order that is about to disappear.
  const doomedIds = (await Order.find(orderFilter).select("_id").lean()).map((o) => o._id);
  const tableResult = await Table.updateMany(
    args.before ? { currentOrder: { $in: doomedIds } } : {},
    { status: "Available", currentOrder: null }
  );

  await Order.deleteMany(orderFilter);
  await DailyProfit.deleteMany(dayKeyFilter);
  if (!args.keepExpenses) await Expense.deleteMany(dayKeyFilter);
  await Payment.deleteMany(paymentFilter);

  console.log(`\nDone. Tables set back to Available: ${tableResult.modifiedCount ?? tableResult.nModified ?? 0}`);
  console.log("Refresh the dashboard - revenue, orders and profit now start from 0.");
  await mongoose.disconnect();
  return counts;
};

module.exports = { run, parseArgs };

if (require.main === module) {
  run().catch(async (error) => {
    console.error("Reset failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
    process.exit(1);
  });
}
