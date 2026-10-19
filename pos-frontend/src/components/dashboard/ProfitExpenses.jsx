import React, { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaLock, FaBolt, FaChevronDown, FaChevronUp, FaReceipt, FaPlus, FaEdit } from "react-icons/fa";
import { FiDollarSign, FiShoppingBag, FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { enqueueSnackbar } from "notistack";
import { getDailyProfit, getMonthlyProfit, getDailyOrders, getExpenses, addExpense, updateExpense, deleteExpense } from "../../https";
import { formatCurrency } from "../../utils/orderMetrics";
import ReportSender from "./ReportSender";
import { useUITheme } from "../../context/UIThemeContext";
import { statusPillClass, STAGE_LABELS } from "../../utils/orderStages";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const thisMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
};

const ERPMetricCard = ({ title, value, subtitle, accentBorder, icon, badgeBg }) => (
  <div className={`pos-metric-card ${accentBorder} flex flex-col justify-between`}>
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className={`p-1.5 rounded-lg text-sm ${badgeBg}`}>
          {icon}
        </span>
      </div>
      <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
        Rs {formatCurrency(value)}
      </div>
    </div>
    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-400 dark:text-slate-500">
      {subtitle}
    </div>
  </div>
);

const ProfitExpenses = () => {
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedMonth, setSelectedMonth] = useState(thisMonthStr());
  const [expenseForm, setExpenseForm] = useState({ amount: "", description: "" });
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: dailyData, isLoading: isDailyLoading } = useQuery({
    queryKey: ["dailyProfit", selectedDate],
    queryFn: () => getDailyProfit(selectedDate),
    placeholderData: keepPreviousData,
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

  const updateExpenseMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      invalidateAllForDate();
      setEditingExpense(null);
      enqueueSnackbar("Expense updated — profit updated.", { variant: "success" });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to update expense.", { variant: "error" });
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
    <div className="space-y-6 max-w-full">
      {/* ---- Daily Profit Section ---- */}
      <div className="pos-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Daily Profit & Loss Statement</span>
              {daily && !isDailyLoading && daily.locked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <FaLock size={10} /> Locked at {new Date(daily.lockedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Net operating profit breakdown after raw ingredient costs and logged shift expenses
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ReportSender defaultDate={selectedDate} />
            {!isViewingToday && (
              <button
                onClick={() => setSelectedDate(todayStr())}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline px-2"
              >
                Today
              </button>
            )}
            <input
              type="date"
              value={selectedDate}
              max={todayStr()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none border border-slate-200 dark:border-slate-700 shadow-xs"
            />
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ERPMetricCard
            title="Gross Revenue"
            value={daily?.revenue ?? 0}
            subtitle="Dine-in, outdoor & delivered tickets"
            accentBorder="border-l-4 border-l-blue-500"
            icon={<FiDollarSign className="text-blue-600 dark:text-blue-400" />}
            badgeBg="bg-blue-50 dark:bg-blue-950/40"
          />
          <ERPMetricCard
            title="Cost of Goods (COGS)"
            value={daily?.cost ?? 0}
            subtitle="Deducted inventory recipe cost"
            accentBorder="border-l-4 border-l-amber-500"
            icon={<FiShoppingBag className="text-amber-600 dark:text-amber-400" />}
            badgeBg="bg-amber-50 dark:bg-amber-950/40"
          />
          <ERPMetricCard
            title="Shift Expenses"
            value={daily?.expenses ?? 0}
            subtitle="Fuel, cylinder & counter outlays"
            accentBorder="border-l-4 border-l-rose-500"
            icon={<FiCreditCard className="text-rose-600 dark:text-rose-400" />}
            badgeBg="bg-rose-50 dark:bg-rose-950/40"
          />
          <ERPMetricCard
            title="Net Operating Profit"
            value={daily?.profit ?? 0}
            subtitle={(daily?.profit ?? 0) >= 0 ? "Profitable trading margin" : "Operating loss recorded"}
            accentBorder={`border-l-4 ${(daily?.profit ?? 0) >= 0 ? "border-l-emerald-500" : "border-l-rose-600"}`}
            icon={<FiTrendingUp className={(daily?.profit ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"} />}
            badgeBg={(daily?.profit ?? 0) >= 0 ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-rose-50 dark:bg-rose-950/40"}
          />
        </div>

        {/* ---- Orders for this day accordion ---- */}
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 p-3.5">
          <button
            onClick={() => setShowOrders((v) => !v)}
            className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <span className="flex items-center gap-2">
              <span>Orders on {selectedDate === todayStr() ? "Today" : selectedDate}</span>
              {daily?.ordersCount != null && (
                <span className="text-[11px] font-normal text-slate-500">
                  ({daily.ordersCount} counted towards profit)
                </span>
              )}
            </span>
            {showOrders ? <FaChevronUp className="text-slate-400" size={12} /> : <FaChevronDown className="text-slate-400" size={12} />}
          </button>

          {showOrders && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80">
              {isDayOrdersLoading && <p className="text-slate-400 text-xs">Loading orders…</p>}
              {!isDayOrdersLoading && dayOrders.length === 0 && (
                <p className="text-slate-400 text-xs py-2">No orders recorded on this date.</p>
              )}
              {dayOrders.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Order</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Revenue</th>
                        <th className="py-2.5 px-3 text-right">Cost</th>
                        <th className="py-2.5 px-3 text-right">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {dayOrders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            #{o.orderNumber}
                            <span className="block text-[10px] font-sans text-slate-400 font-normal">
                              {new Date(o.orderDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {o.itemsCount} item{o.itemsCount === 1 ? "" : "s"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[140px]">
                            {o.customerName || "Walk-in Guest"}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusPillClass(o.orderStatus)}`}>
                              {STAGE_LABELS[o.orderStatus] || o.orderStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            Rs {formatCurrency(o.revenue)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                            Rs {formatCurrency(o.cost)}
                          </td>
                          <td className={`py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap ${
                            o.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                          }`}>
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
      </div>

      {/* ---- Log Shift Expense Section ---- */}
      <div className="pos-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <FaReceipt size={16} />
          </span>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Shift Expenses for {selectedDate === todayStr() ? "Today" : selectedDate}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct counter outlays that are automatically subtracted from daily profit
            </p>
          </div>
        </div>

        <form onSubmit={handleAddExpense} className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount (Rs)"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))}
            className="sm:w-44 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-amber-500"
            required
          />
          <input
            type="text"
            placeholder="Description (e.g. Gas cylinder, fuel top-up, grocery run)"
            value={expenseForm.description}
            onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))}
            className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-amber-500"
            required
          />
          <button
            type="submit"
            disabled={addExpenseMutation.isPending}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl px-5 py-2 text-xs transition shadow-xs disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            <FaPlus size={11} />
            <span>Add Expense</span>
          </button>
        </form>

        <div className="space-y-2">
          {expenses.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-xs py-2 font-medium">No shift expenses logged for this date.</p>
          ) : (
            expenses.map((exp) => (
              <div
                key={exp._id}
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 transition"
              >
                <div>
                  <p className="text-slate-900 dark:text-white text-xs font-mono font-bold">
                    Rs {formatCurrency(exp.amount)}
                  </p>
                  {exp.description && (
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 font-medium">{exp.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingExpense({ ...exp })}
                    className="p-1.5 text-slate-500 hover:text-amber-500 transition rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    title="Edit expense"
                    aria-label="Edit expense"
                  >
                    <FaEdit size={13} />
                  </button>
                  <button
                    onClick={() => deleteExpenseMutation.mutate(exp._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-500 transition rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete expense"
                    aria-label="Delete expense"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Expense Side Overlay (Metronic Style) */}
      {editingExpense && (
        <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setEditingExpense(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
            <div
              className="pointer-events-auto w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Edit Shift Expense
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Update expense amount and reason</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg"
                >
                  ✕
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = Number(editingExpense.amount);
                  if (!Number.isFinite(amount) || amount <= 0) {
                    enqueueSnackbar("Enter a valid amount.", { variant: "warning" });
                    return;
                  }
                  updateExpenseMutation.mutate({
                    id: editingExpense._id,
                    amount,
                    description: editingExpense.description?.trim() || "",
                  });
                }}
                className="p-6 space-y-4 flex-1 overflow-y-auto"
                id="edit-expense-form"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Expense Amount (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense((prev) => ({ ...prev, amount: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Description / Reason
                  </label>
                  <input
                    type="text"
                    value={editingExpense.description}
                    onChange={(e) => setEditingExpense((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </form>
              <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-expense-form"
                  disabled={updateExpenseMutation.isPending}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs disabled:opacity-60"
                >
                  {updateExpenseMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Monthly Profit Overview & Interactive Calendar ---- */}
      <div className="pos-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Monthly P&L & Calendar Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aggregated monthly turnover, inventory consumption, and daily trading ledger
            </p>
          </div>
          <input
            type="month"
            value={selectedMonth}
            max={thisMonthStr()}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs font-bold outline-none border border-slate-200 dark:border-slate-700 shadow-xs self-start sm:self-auto"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <ERPMetricCard
            title="Monthly Revenue"
            value={monthly?.revenue ?? 0}
            subtitle="Gross monthly revenue"
            accentBorder="border-l-4 border-l-blue-500"
            icon={<FiDollarSign className="text-blue-600 dark:text-blue-400" />}
            badgeBg="bg-blue-50 dark:bg-blue-950/40"
          />
          <ERPMetricCard
            title="Monthly COGS"
            value={monthly?.cost ?? 0}
            subtitle="Raw material expenses"
            accentBorder="border-l-4 border-l-amber-500"
            icon={<FiShoppingBag className="text-amber-600 dark:text-amber-400" />}
            badgeBg="bg-amber-50 dark:bg-amber-950/40"
          />
          <ERPMetricCard
            title="Monthly Expenses"
            value={monthly?.expenses ?? 0}
            subtitle="Logged shift outlays"
            accentBorder="border-l-4 border-l-rose-500"
            icon={<FiCreditCard className="text-rose-600 dark:text-rose-400" />}
            badgeBg="bg-rose-50 dark:bg-rose-950/40"
          />
          <ERPMetricCard
            title="Monthly Net Profit"
            value={monthly?.profit ?? 0}
            subtitle="Bottom line earnings"
            accentBorder={`border-l-4 ${(monthly?.profit ?? 0) >= 0 ? "border-l-emerald-500" : "border-l-rose-600"}`}
            icon={<FiTrendingUp className={(monthly?.profit ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"} />}
            badgeBg={(monthly?.profit ?? 0) >= 0 ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-rose-50 dark:bg-rose-950/40"}
          />
        </div>

        {monthly?.days?.length > 0 && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                Daily Trading Calendar (Click any day to inspect in detail)
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <FaLock className="text-slate-400 text-[10px]" /> Locked
                </span>
                <span className="flex items-center gap-1">
                  <FaBolt className="text-emerald-500 text-[10px]" /> Live
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
              {monthly.days.map((d) => {
                const isSelected = d.dayKey === selectedDate;
                const isPositive = d.profit >= 0;
                return (
                  <button
                    key={d.dayKey}
                    onClick={() => setSelectedDate(d.dayKey)}
                    className={`flex flex-col items-start gap-1 rounded-xl p-2.5 text-left border transition-all ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs"
                    }`}
                  >
                    <span className="flex w-full items-center justify-between text-xs font-bold font-mono">
                      <span>Day {Number(d.dayKey.slice(-2))}</span>
                      {d.locked ? (
                        <FaLock className={`text-[10px] ${isSelected ? "text-slate-950" : "text-slate-400"}`} />
                      ) : (
                        <FaBolt className={`text-[10px] ${isSelected ? "text-slate-950" : "text-emerald-500"}`} />
                      )}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold truncate w-full ${
                        isSelected
                          ? "text-slate-950 font-black"
                          : isPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-500"
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
    </div>
  );
};

export default ProfitExpenses;
