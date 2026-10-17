import React from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaPrint } from "react-icons/fa";
import { FcDocument, FcShop, FcGlobe, FcMoneyTransfer, FcClock } from "react-icons/fc";
import { formatDateAndTime, getOrderNumber } from "../../utils";
import { STAGE_LABELS, statusPillClass } from "../../utils/orderStages";
import { useUITheme } from "../../context/UIThemeContext";
import FoodIcon from "../../utils/foodIcons";

const ViewOrderModal = ({ order, onClose, onPrint }) => {
  const { isClean } = useUITheme();

  if (!order) return null;

  const isOnline = order.orderSource === "Online";
  const items = order.items || [];
  const bills = order.bills || {};
  const customer = order.customerDetails || {};

  const content = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden transition ${
          isClean ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-white"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-5 border-b shrink-0 ${
            isClean ? "border-slate-100 bg-slate-50/70" : "border-slate-800 bg-slate-950/60"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <FcDocument size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-none">
                  Order #{getOrderNumber(order)}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusPillClass(order.orderStatus)}`}>
                  {STAGE_LABELS[order.orderStatus] || order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <FcClock size={13} /> {formatDateAndTime(order.orderDate || order.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isClean ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title="Close"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Customer & Location Banner */}
          <div
            className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
              isClean ? "bg-slate-50 border-slate-200/80" : "bg-slate-950 border-slate-800"
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Customer</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                {customer.name || "Walk-In Guest"}
              </p>
              {customer.phone && <p className="text-slate-500 font-mono mt-0.5">{customer.phone}</p>}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Source</span>
              <div className="flex items-center gap-1.5 justify-end font-bold text-sm mt-0.5">
                {isOnline ? (
                  <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <FcGlobe size={15} /> Online Delivery
                  </span>
                ) : order.table ? (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <FcShop size={15} /> Table {order.table.tableNo}
                  </span>
                ) : (
                  <span className="text-orange-600 dark:text-orange-400">Takeaway Counter</span>
                )}
              </div>
              {order.customerDetails?.guests > 0 && (
                <span className="text-[11px] text-slate-400">{order.customerDetails.guests} Guests</span>
              )}
            </div>
          </div>

          {/* Itemized Order Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Ordered Items ({items.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Qty × Price</span>
            </div>

            <div className={`divide-y rounded-xl border overflow-hidden ${isClean ? "divide-slate-100 border-slate-200" : "divide-slate-800 border-slate-800"}`}>
              {items.map((it, idx) => (
                <div
                  key={it.id || idx}
                  className={`p-3 flex items-center justify-between gap-3 text-xs ${
                    isClean ? "bg-white hover:bg-slate-50/80" : "bg-slate-900 hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <FoodIcon icon={it.icon || it.name} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-xs sm:text-sm">
                        {it.name}
                      </p>
                      {it.variants && it.variants.length > 0 && (
                        <p className="text-[11px] text-slate-400 truncate">
                          {it.variants.map((v) => `${v.size || ""} ${v.crust ? `(${v.crust})` : ""}`).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {it.quantity} × Rs {Number(it.pricePerQuantity || it.price / (it.quantity || 1)).toFixed(0)}
                    </span>
                    <p className="font-black font-mono text-slate-900 dark:text-white mt-0.5">
                      Rs {Number(it.price || 0).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions / Notes if any */}
          {order.notes && (
            <div className={`p-3 rounded-xl border text-xs ${isClean ? "bg-amber-50/60 border-amber-200/80 text-amber-900" : "bg-amber-950/30 border-amber-900/50 text-amber-300"}`}>
              <span className="font-bold uppercase tracking-wider text-[10px] block">Kitchen Note:</span>
              <p className="mt-0.5">{order.notes}</p>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${isClean ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"}`}>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Items Subtotal:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                Rs {Number(bills.total || bills.subTotal || 0).toFixed(2)}
              </span>
            </div>

            {bills.tax > 0 && (
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Tax / GST:</span>
                <span className="font-mono">Rs {Number(bills.tax).toFixed(2)}</span>
              </div>
            )}

            {bills.deliveryFee > 0 && (
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Delivery Fee:</span>
                <span className="font-mono">Rs {Number(bills.deliveryFee).toFixed(2)}</span>
              </div>
            )}

            {bills.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount Applied:</span>
                <span className="font-mono">-Rs {Number(bills.discount).toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm">
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Net Total:
              </span>
              <span className="font-black font-mono text-amber-600 dark:text-amber-400 text-base">
                Rs {Number(bills.totalWithTax || bills.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-3.5 sm:p-4 border-t shrink-0 flex items-center justify-between gap-2.5 ${
            isClean ? "border-slate-100 bg-slate-50" : "border-slate-800 bg-slate-950"
          }`}
        >
          <button
            onClick={() => {
              if (onPrint) onPrint(order);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
              isClean
                ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
                : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            }`}
          >
            <FaPrint size={13} /> Print Ticket / Receipt
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
};

export default ViewOrderModal;
