import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaCheckCircle, FaExclamationTriangle, FaBoxes } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import { getLowStockItems, adjustInventoryItem } from "../../https";
import { I } from "./AppIcons";

export const LOW_STOCK_QUERY_KEY = ["low-stock"];
export const OPEN_LOW_STOCK_EVENT = "open-low-stock";

// How long "Remind me later" hides an item before the popup shows it again
// (only if it's still low). Restocking clears it immediately because the
// item simply stops being returned by the API.
const SNOOZE_MS = 30 * 60 * 1000;
const STORAGE_KEY = "pos_low_stock_snoozed";

const readSnoozed = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

// Popup that warns Admin and Cashier when inventory is running low:
//   < 1000 g (1 kg) / 1000 ml (1 l) / 10 pcs, or already out of stock.
// Admin gets a "Restock" button that opens the Inventory tab. Cashier only
// sees the warning - stock can only be changed by the Admin.
const LowStockAlert = () => {
  const { isAuth, permissions = [] } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const enabled = isAuth && permissions.includes("inventory.view");
  const canRestock = permissions.includes("inventory.adjust");

  const [snoozed, setSnoozed] = useState(readSnoozed);
  const [forceOpen, setForceOpen] = useState(false);
  // Draft "add X" amount typed per item, so stock can be topped up right
  // here instead of having to leave for the Inventory tab.
  const [restockDrafts, setRestockDrafts] = useState({});

  const restockMutation = useMutation({
    mutationFn: adjustInventoryItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LOW_STOCK_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setRestockDrafts((prev) => ({ ...prev, [variables.inventoryId]: "" }));
      enqueueSnackbar("Stock added successfully.", { variant: "success" });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to add stock.", { variant: "error" });
    },
  });

  const quickRestock = (item) => {
    const amount = Number(restockDrafts[item._id]);
    if (!(amount > 0)) return;
    restockMutation.mutate({
      inventoryId: item._id,
      quantityChange: amount,
      note: "Quick restock from low-stock alert",
    });
  };

  const { data } = useQuery({
    queryKey: LOW_STOCK_QUERY_KEY,
    queryFn: getLowStockItems,
    enabled,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const items = useMemo(() => {
    const list = data?.data?.data ?? [];
    // Out of stock first, then the lowest remaining.
    return [...list].sort((a, b) => {
      if (a.stockStatus !== b.stockStatus) return a.stockStatus === "out_of_stock" ? -1 : 1;
      return a.quantity - b.quantity;
    });
  }, [data]);

  const snoozeKey = (item) => `${item._id}:${item.stockStatus}`;

  // Items the popup should currently show.
  const visibleItems = forceOpen
    ? items
    : items.filter((item) => !(snoozed[snoozeKey(item)] > Date.now()));

  // The bell icon or quick action button in the sidebar re-opens the popup on demand.
  useEffect(() => {
    const open = () => setForceOpen(true);
    window.addEventListener(OPEN_LOW_STOCK_EVENT, open);
    return () => window.removeEventListener(OPEN_LOW_STOCK_EVENT, open);
  }, []);

  if (!enabled) return null;

  // If there are no alerts and the user did NOT click to open it, render nothing.
  if (visibleItems.length === 0 && !forceOpen) return null;

  const dismiss = () => {
    const next = { ...readSnoozed() };
    const until = Date.now() + SNOOZE_MS;
    items.forEach((item) => {
      next[snoozeKey(item)] = until;
    });
    // Drop stale entries so the map doesn't grow forever.
    Object.keys(next).forEach((key) => {
      if (next[key] < Date.now()) delete next[key];
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable
    }
    setSnoozed(next);
    setForceOpen(false);
  };

  const takeAction = () => {
    dismiss();
    navigate("/dashboard?tab=Inventory");
  };

  const outCount = visibleItems.filter((i) => i.stockStatus === "out_of_stock").length;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        role="alertdialog"
        aria-label="Low stock warning"
        className="w-full max-w-md overflow-hidden rounded-xl border border-[#be3e3f] bg-[#1f1f1f] shadow-2xl"
      >
        <div className="flex items-center gap-3 bg-[#be3e3f] px-5 py-3">
          <span className="text-2xl" aria-hidden="true">
            <I.Warning />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#f5f5f5]">Stock is going low</h2>
            <p className="text-xs text-[#f5f5f5]/80">
              {visibleItems.length} item{visibleItems.length === 1 ? "" : "s"} need attention
              {outCount > 0 ? ` · ${outCount} out of stock` : ""}
            </p>
          </div>
        </div>

        <div className="px-5 py-4">
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {visibleItems.map((item) => {
              const out = item.stockStatus === "out_of_stock";
              return (
                <li
                  key={item._id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[#262626] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#f5f5f5]">{item.name}</p>
                    <p className="text-xs text-[#ababab]">
                      Warning below {item.threshold} {item.unit}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold ${out ? "text-red-500" : "text-yellow-400"}`}>
                      {out ? "Out of stock" : `${Number(item.quantity.toFixed(2))} ${item.unit} left`}
                    </p>
                    {canRestock && (
                      <div className="mt-1 flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder={`+${item.unit}`}
                          value={restockDrafts[item._id] ?? ""}
                          onChange={(e) =>
                            setRestockDrafts((prev) => ({ ...prev, [item._id]: e.target.value }))
                          }
                          className="w-16 rounded bg-[#1a1a1a] px-2 py-1 text-right text-xs text-[#f5f5f5] outline-none"
                        />
                        <button
                          onClick={() => quickRestock(item)}
                          disabled={restockMutation.isPending || !(Number(restockDrafts[item._id]) > 0)}
                          className="rounded bg-[#34c76f] px-2 py-1 text-xs font-bold text-[#0f1f14] disabled:opacity-40"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {canRestock ? (
            <p className="mt-4 text-sm text-[#ababab]">
              Type how much stock arrived and hit "Add" next to any item above — no need to leave this page.
              Online customers can no longer order more than what is left.
            </p>
          ) : (
            <p className="mt-4 text-sm text-[#ababab]">
              Please tell the admin to restock. Only the admin can change stock.
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setForceOpen(false)}
              aria-label="Close"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {canRestock ? "Remind me later" : "OK, got it"}
            </button>
            {canRestock && (
              <button
                onClick={takeAction}
                className="pos-btn-primary flex-1 py-2.5"
              >
                <FaBoxes size={14} /> Open Inventory
              </button>
            )}
          </div>
        </motion.div>
      </div>,
      document.body
    );
  }

  // Active alerts modal
  return createPortal(
    <div className="pos-modal-backdrop" onClick={dismiss}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-label="Low stock warning"
        className="pos-modal-card max-w-lg p-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center font-bold">
              <FaExclamationTriangle size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Low Stock Warning
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {visibleItems.length} item{visibleItems.length === 1 ? "" : "s"} need attention
                {outCount > 0 ? ` · ${outCount} completely out of stock` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="mt-4 max-h-64 space-y-2.5 overflow-y-auto pr-1">
          {visibleItems.map((item) => {
            const out = item.stockStatus === "out_of_stock";
            return (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/60 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-sm text-slate-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Threshold: {item.threshold} {item.unit}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-xs font-black px-2 py-0.5 rounded-full ${
                      out
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                    }`}
                  >
                    {out ? "Out of stock" : `${Number(item.quantity.toFixed(2))} ${item.unit} left`}
                  </span>
                  {isAdmin && (
                    <div className="mt-1.5 flex items-center gap-1.5 justify-end">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder={`+${item.unit}`}
                        value={restockDrafts[item._id] ?? ""}
                        onChange={(e) =>
                          setRestockDrafts((prev) => ({ ...prev, [item._id]: e.target.value }))
                        }
                        className="w-16 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 text-right text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => quickRestock(item)}
                        disabled={restockMutation.isPending || !(Number(restockDrafts[item._id]) > 0)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-bold transition disabled:opacity-40"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          {isAdmin
            ? "Enter received quantity and tap 'Add' to restock immediately without leaving this view."
            : "Please inform the shift manager or admin to replenish these ingredients."}
        </p>

        <div className="mt-5 flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={dismiss}
            className="pos-btn-secondary flex-1 py-2.5"
          >
            {isAdmin ? "Remind me later" : "OK, Got It"}
          </button>
          {isAdmin && (
            <button
              onClick={takeAction}
              className="pos-btn-primary flex-1 py-2.5"
            >
              <FaBoxes size={14} /> Full Inventory
            </button>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default LowStockAlert;
