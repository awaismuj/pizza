import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaHistory } from "react-icons/fa";
import Modal from "../shared/Modal";
import { getDeletedOrders } from "../../https";
import { formatCurrency } from "../../utils/orderMetrics";
import { useUITheme } from "../../context/UIThemeContext";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const DeletedOrdersPanel = ({ isAdmin }) => {
  const { isClean } = useUITheme();
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState(todayStr());
  const [to, setTo] = useState(todayStr());

  const { data, isLoading } = useQuery({
    queryKey: ["deletedOrders", from, to],
    queryFn: () => getDeletedOrders({ from, to }),
    enabled: isOpen,
  });

  if (!isAdmin) return null;
  const logs = data?.data?.data ?? [];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 text-xs font-bold rounded-xl px-3 sm:px-4 py-2 border transition shrink-0 shadow-xs ${
          isClean
            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
        }`}
        title="See every order that's been deleted, and who deleted it"
      >
        <FaHistory size={13} className="text-amber-500" />
        <span>Deleted Orders</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Deleted Order Audit Log">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col text-xs font-bold uppercase tracking-wider text-slate-500 gap-1.5">
              From
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold outline-none border transition ${
                  isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                    : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                }`}
              />
            </label>
            <label className="flex flex-col text-xs font-bold uppercase tracking-wider text-slate-500 gap-1.5">
              To
              <input
                type="date"
                value={to}
                min={from}
                max={todayStr()}
                onChange={(e) => setTo(e.target.value)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold outline-none border transition ${
                  isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                    : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                }`}
              />
            </label>
          </div>

          {isLoading ? (
            <p className="text-slate-400 text-xs">Loading audit logs…</p>
          ) : logs.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">No orders were deleted in this period.</p>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className={`rounded-xl border p-3.5 transition ${
                    isClean
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-800/60 border-slate-700 text-slate-100"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono font-bold text-sm">
                      #{log.orderNumber || String(log.originalOrderId || "").slice(-6).toUpperCase()}
                      <span className="ml-2 font-sans text-[11px] font-semibold text-slate-500">
                        {log.orderSource === "Online" ? "Online" : "Dine-in / Takeaway"}
                      </span>
                    </span>
                    <span className="text-rose-500 font-black text-sm font-mono">
                      Rs {formatCurrency(log.bills?.totalWithTax)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Was at <span className="font-bold text-slate-700 dark:text-slate-200">{log.statusAtDelete}</span> when deleted
                    {log.customerDetails?.name ? ` · ${log.customerDetails.name}` : ""}
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Deleted by{" "}
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {log.deletedBy?.name || "Unknown"} ({log.deletedBy?.role || "—"})
                    </span>{" "}
                    on {new Date(log.deletedAt).toLocaleString("en-GB")}
                  </p>

                  <p className="text-xs mt-1">
                    Stock:{" "}
                    <span className={`font-semibold ${log.stockReturned ? "text-emerald-500" : "text-slate-400"}`}>
                      {log.stockReturned
                        ? "Returned to inventory"
                        : "None deducted"}
                    </span>
                  </p>

                  {log.items?.length > 0 && (
                    <p className="text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700/60 font-medium">
                      {log.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DeletedOrdersPanel;
