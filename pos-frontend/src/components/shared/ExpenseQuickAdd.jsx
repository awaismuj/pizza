import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
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

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-[#262626] p-5 shadow-lg max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#f5f5f5]">Add expense</h2>
          <button onClick={onClose} aria-label="Close" className="text-[#ababab] hover:text-white">
            <IoMdClose size={22} />
          </button>
        </div>
        <p className="mt-1 text-xs text-[#767676]">Jot down a shop expense — e.g. gas cylinder, delivery fuel.</p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount (Rs)"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="bg-[#1f1f1f] text-white rounded-lg px-3 py-2.5 outline-none text-sm"
          />
          <input
            type="text"
            placeholder="What was it for? (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="bg-[#1f1f1f] text-white rounded-lg px-3 py-2.5 outline-none text-sm"
          />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="mt-1 rounded-lg bg-[#f6b100] py-2.5 font-semibold text-[#1f1f1f] disabled:opacity-60"
          >
            {addMutation.isPending ? "Adding..." : "Add expense"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-medium text-[#ababab]">Today's expenses</p>
          <p className="text-sm font-semibold text-[#f5f5f5]">Rs {todayTotal.toFixed(2)}</p>
        </div>
        <div className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
          {expenses.length === 0 && <p className="text-xs text-[#767676]">Nothing logged yet today.</p>}
          {expenses.map((exp) => (
            <div key={exp._id} className="flex items-center justify-between gap-2 rounded-lg bg-[#1f1f1f] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm text-[#f5f5f5]">{exp.description || "Expense"}</p>
                <p className="text-xs text-[#767676]">Rs {Number(exp.amount).toFixed(2)}</p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(exp._id)}
                aria-label="Delete expense"
                className="shrink-0 text-red-400 hover:text-red-500"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseQuickAdd;
