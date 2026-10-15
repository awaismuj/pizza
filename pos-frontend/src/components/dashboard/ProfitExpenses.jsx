import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaLock, FaBolt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import { getDailyProfit, getMonthlyProfit, getDailyOrders, getExpenses, addExpense, deleteExpense } from "../../https";
import { formatCurrency } from "../../utils/orderMetrics";
import ReportSender from "./ReportSender";

// Same palette OrderCard/OnlineOrders use for status pills, kept local so
// this table doesn't have to import the whole orders styling module for
// five colors.
const STATUS_COLORS = {
  Cancelled: "text-[#e6402e]",
  Closed: "text-[#34c76f]",
  Completed: "text-[#34c76f]",
};
const statusColor = (status) => STATUS_COLORS[status] || "text-[#ababab]";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const thisMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
};

const StatBox = ({ label, value, color }) => (
  <div className="rounded-lg p-4" style={{ backgroundColor: color }}>
    <p className="font-medium text-xs text-[#f5f5f5]">{label}</p>
    <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">Rs {formatCurrency(value)}</p>
  </div>
);

const ProfitExpenses = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedMonth, setSelectedMonth] = useState(thisMonthStr());
  const [expenseForm, setExpenseForm] = useState({ amount: "", description: "" });

  const { data: dailyData, isLoading: isDailyLoading } = useQuery({
    queryKey: ["dailyProfit", selectedDate],
    queryFn: () => getDailyProfit(selectedDate),
    placeholderData: keepPreviousData,
    // Polls on its own so a sale rung up on another screen (or by another
    // cashier) shows up here without anyone having to leave and re-open
    // this tab — on top of the explicit invalidation that already fires
    // the moment an order is placed or a status changes.
    refetchInterval: 10000,
  });
  const daily = dailyData?.data?.data;

  const { data: monthlyData } = useQuery({
    queryKey: ["monthlyProfit", selectedMonth],
    queryFn: () => getMonthlyProfit(selectedMonth),
    placeholderData: keepPreviousData,
    refetchInterval: 20000,
  });
  const monthly = monthlyData?.data?.data;

  const { data: expensesData } = useQuery({
    queryKey: ["expenses", selectedDate],
    queryFn: () => getExpenses(selectedDate),
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
  });
  const expenses = expensesData?.data?.data ?? [];

  // Per-order breakdown for the picked day — collapsed by default since a
  // busy day can be a long list; expand to see every order, its own
  // revenue/cost/profit, and how many orders came in.
  const [showOrders, setShowOrders] = useState(false);
  const { data: dayOrdersData, isLoading: isDayOrdersLoading } = useQuery({
    queryKey: ["dailyOrders", selectedDate],
    queryFn: () => getDailyOrders(selectedDate),
    placeholderData: keepPreviousData,
    enabled: showOrders,
    refetchInterval: showOrders ? 10000 : false,
  });
  const dayOrders = dayOrdersData?.data?.data?.orders ?? [];

  const invalidateAllForDate = () => {
    queryClient.invalidateQueries(["dailyProfit", selectedDate]);
    queryClient.invalidateQueries(["dailyOrders", selectedDate]);
    queryClient.invalidateQueries(["expenses", selectedDate]);
    queryClient.invalidateQueries(["monthlyProfit", selectedMonth]);
  };

  const addExpenseMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      invalidateAllForDate();
      setExpenseForm({ amount: "", description: "" });
      enqueueSnackbar("Expense added — profit updated.", { variant: "success" });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to add expense.", { variant: "error" });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      invalidateAllForDate();
      enqueueSnackbar("Expense removed.", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to remove expense.", { variant: "error" });
    },
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    const amount = Number(expenseForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      enqueueSnackbar("Enter a valid amount.", { variant: "warning" });
      return;
    }
    addExpenseMutation.mutate({ amount, description: expenseForm.description.trim(), date: selectedDate });
  };

  const isViewingToday = selectedDate === todayStr();

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      {/* ---- Daily profit ---- */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Daily Profit</h2>
        </div>
        <div className="flex items-center gap-2">
          <ReportSender defaultDate={selectedDate} />
          {!isViewingToday && (
            <button
              onClick={() => setSelectedDate(todayStr())}
              className="text-xs text-[#f6b100] hover:underline"
            >
              Jump to today
            </button>
          )}
          <input
            type="date"
            value={selectedDate}
            max={todayStr()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#1a1a1a] text-[#f5f5f5] rounded-md px-3 py-2 outline-none border border-[#333]"
          />
        </div>
      </div>

      {daily && !isDailyLoading && daily.locked && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-[#8a7c66]">
            <FaLock /> Locked at {new Date(daily.lockedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            — final for this day
          </span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox label="Revenue" value={daily?.revenue ?? 0} color="#025cca" />
        <StatBox label="Purchases/Cost" value={daily?.cost ?? 0} color="#735f32" />
        <StatBox label="Expenses" value={daily?.expenses ?? 0} color="#be3e3f" />
        <StatBox label="Actual Profit" value={daily?.profit ?? 0} color={(daily?.profit ?? 0) >= 0 ? "#02ca3a" : "#7a1f1f"} />
      </div>

      {/* ---- Per-order breakdown for this day ---- */}
      <div className="mt-4 bg-[#1a1a1a] rounded-lg p-4">
        <button
          onClick={() => setShowOrders((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="font-semibold text-[#f5f5f5]">
            Orders on {selectedDate === todayStr() ? "today" : selectedDate}
            {daily?.ordersCount != null && <span className="ml-2 text-xs text-[#7a7a7a]">({daily.ordersCount} counted)</span>}
          </span>
          {showOrders ? <FaChevronUp className="text-[#ababab]" /> : <FaChevronDown className="text-[#ababab]" />}
        </button>

        {showOrders && (
          <div className="mt-3">
            {isDayOrdersLoading && <p className="text-[#7a7a7a] text-sm">Loading orders…</p>}
            {!isDayOrdersLoading && dayOrders.length === 0 && (
              <p className="text-[#7a7a7a] text-sm">No orders received on this day.</p>
            )}
            {dayOrders.length > 0 && (
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-[#7a7a7a] text-xs uppercase">
                      <th className="py-2 pr-3 font-medium">Order</th>
                      <th className="py-2 pr-3 font-medium">Customer</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium text-right">Revenue</th>
                      <th className="py-2 pr-3 font-medium text-right">Cost</th>
                      <th className="py-2 pr-3 font-medium text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayOrders.map((o) => (
                      <tr key={o._id} className="border-t border-[#262626]">
                        <td className="py-2 pr-3 text-[#f5f5f5] whitespace-nowrap">
                          #{o.orderNumber}
                          <span className="block text-[10px] text-[#7a7a7a]">
                            {new Date(o.orderDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                            {o.itemsCount} item{o.itemsCount === 1 ? "" : "s"}
                          </span>
                        </td>
                        <td className="py-2 pr-3 text-[#f5f5f5] truncate max-w-[140px]">{o.customerName}</td>
                        <td className={`py-2 pr-3 whitespace-nowrap ${statusColor(o.orderStatus)}`}>
                          {o.orderStatus}
                          {!o.countedTowardsProfit && (
                            <span className="block text-[10px] text-[#7a7a7a]">not counted</span>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-right text-[#f5f5f5] whitespace-nowrap">
                          Rs {formatCurrency(o.revenue)}
                        </td>
                        <td className="py-2 pr-3 text-right text-[#f5f5f5] whitespace-nowrap">
                          Rs {formatCurrency(o.cost)}
                        </td>
                        <td
                          className={`py-2 pr-3 text-right font-semibold whitespace-nowrap ${
                            o.profit >= 0 ? "text-[#34c76f]" : "text-[#e6402e]"
                          }`}
                        >
                          Rs {formatCurrency(o.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---- Add expense ---- */}
      <div className="mt-8 bg-[#1a1a1a] rounded-lg p-4">
        <h3 className="font-semibold text-[#f5f5f5] mb-3">
          Add expense for {selectedDate === todayStr() ? "today" : selectedDate}
        </h3>
        <form onSubmit={handleAddExpense} className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount (Rs)"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))}
            className="sm:w-40 bg-[#262626] text-white rounded px-3 py-2 outline-none"
          />
          <input
            type="text"
            placeholder="Description (e.g. Gas cylinder, delivery fuel)"
            value={expenseForm.description}
            onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))}
            className="flex-1 bg-[#262626] text-white rounded px-3 py-2 outline-none"
          />
          <button
            type="submit"
            disabled={addExpenseMutation.isPending}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded px-5 py-2 disabled:opacity-60"
          >
            Add expense
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {expenses.length === 0 && (
            <p className="text-[#7a7a7a] text-sm">No expenses logged for this day yet.</p>
          )}
          {expenses.map((exp) => (
            <div key={exp._id} className="flex items-center justify-between bg-[#111] rounded px-3 py-2">
              <div>
                <p className="text-[#f5f5f5] text-sm font-medium">Rs {formatCurrency(exp.amount)}</p>
                {exp.description && <p className="text-[#ababab] text-xs">{exp.description}</p>}
              </div>
              <button
                onClick={() => deleteExpenseMutation.mutate(exp._id)}
                className="text-red-400 hover:text-red-300 px-2"
                aria-label="Delete expense"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Monthly profit ---- */}
      <div className="mt-10 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Monthly Profit</h2>
          <p className="text-sm text-[#ababab]">Total revenue, expenses and actual profit for the month.</p>
        </div>
        <input
          type="month"
          value={selectedMonth}
          max={thisMonthStr()}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[#1a1a1a] text-[#f5f5f5] rounded-md px-3 py-2 outline-none border border-[#333]"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox label="Revenue" value={monthly?.revenue ?? 0} color="#025cca" />
        <StatBox label="Purchases/Cost" value={monthly?.cost ?? 0} color="#735f32" />
        <StatBox label="Expenses" value={monthly?.expenses ?? 0} color="#be3e3f" />
        <StatBox label="Actual Profit" value={monthly?.profit ?? 0} color={(monthly?.profit ?? 0) >= 0 ? "#02ca3a" : "#7a1f1f"} />
      </div>

      {monthly?.days?.length > 0 && (
        <div className="mt-4 bg-[#1a1a1a] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#ababab] text-xs">
              Every day this month — click any date to load its earnings above
            </p>
            <div className="flex items-center gap-3 text-[10px] text-[#7a7a7a]">
              <span className="flex items-center gap-1">
                <FaLock className="text-[8px]" /> Locked (final)
              </span>
              <span className="flex items-center gap-1">
                <FaBolt className="text-[8px]" /> Live
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
            {monthly.days.map((d) => {
              const isSelected = d.dayKey === selectedDate;
              return (
                <button
                  key={d.dayKey}
                  onClick={() => setSelectedDate(d.dayKey)}
                  className={`flex flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors ${
                    isSelected ? "bg-[#f6b100] text-[#1a1a1a]" : "bg-[#111] hover:bg-[#262626] text-[#f5f5f5]"
                  }`}
                >
                  <span className="flex w-full items-center justify-between text-[11px] font-semibold">
                    {Number(d.dayKey.slice(-2))}
                    {d.locked ? (
                      <FaLock className={`text-[9px] ${isSelected ? "text-[#1a1a1a]" : "text-[#8a7c66]"}`} />
                    ) : (
                      <FaBolt className={`text-[9px] ${isSelected ? "text-[#1a1a1a]" : "text-[#34c76f]"}`} />
                    )}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      isSelected ? "text-[#1a1a1a]" : d.profit >= 0 ? "text-[#34c76f]" : "text-[#e6402e]"
                    }`}
                  >
                    Rs {formatCurrency(d.profit)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitExpenses;
