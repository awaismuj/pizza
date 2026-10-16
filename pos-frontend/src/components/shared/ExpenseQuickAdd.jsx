import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaTrash, FaReceipt } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getExpenses, addExpense, deleteExpense } from "../../https";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

// Quick "jot it down" expense log for whoever's on shift — admin or
// cashier. Deliberately just amount + note + today's list: no revenue,
// profit or totals here (that stays in the Admin-only Dashboard), so a
// cashier can log a delivery-boy fuel top-up or a gas cylinder without
// seeing numbers that aren't theirs to see.
const ExpenseQuickAdd = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ amount: "", description: "" });

  const { data } = useQuery({
    queryKey: ["expenses", todayStr()],
    queryFn: () => getExpenses(todayStr()),
    enabled: open,
  });
  const expenses = data?.data?.data ?? [];
  const todayTotal = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["expenses"] });

  const addMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      invalidate();
      setForm({ amount: "", description: "" });
      enqueueSnackbar("Expense added.", { variant: "success" });
    },
    onError: (err) => enqueueSnackbar(err?.response?.data?.message || "Failed to add expense.", { variant: "error" }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      invalidate();
      enqueueSnackbar("Expense removed.", { variant: "success" });
    },
    onError: () => enqueueSnackbar("Failed to remove expense.", { variant: "error" }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!(amount > 0)) {
      enqueueSnackbar("Enter a valid amount.", { variant: "warning" });
      return;
    }
    addMutation.mutate({ amount, description: form.description.trim(), date: todayStr() });
  };

  if (!open) return null;

  return createPortal(
    <div className="pos-modal-backdrop" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="pos-modal-card max-w-md p-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <FaReceipt size={17} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Record Shop Expense</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quick shift log (fuel, cylinder, supplies)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="pos-label">Amount (Rs) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 500"
              required
              autoFocus
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="pos-input text-base font-semibold"
            />
          </div>
          <div>
            <label className="pos-label">Expense Description (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Delivery rider petrol, dairy items"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="pos-input"
            />
          </div>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="pos-btn-primary w-full py-3 mt-1 text-sm font-bold shadow-md shadow-amber-500/20"
          >
            {addMutation.isPending ? "Recording..." : "Save Expense"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Logged Expenses
            </span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
              Rs {todayTotal.toFixed(2)}
            </span>
          </div>

          <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
            {expenses.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                No expenses logged yet today.
              </div>
            )}
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-2.5 transition"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                    {exp.description || "Shift Expense"}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Rs {Number(exp.amount).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(exp._id)}
                  aria-label="Delete expense"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ExpenseQuickAdd;
