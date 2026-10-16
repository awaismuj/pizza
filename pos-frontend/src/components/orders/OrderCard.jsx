import React, { useState } from "react";
import { FaLongArrowAltRight, FaPen, FaTrash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { formatDateAndTime, getAvatarName, getOrderNumber } from "../../utils/index";
import { updateOrderStatus, deleteOrder as deleteOrderApi } from "../../https";
import { NEXT_ACTION, STAGE_LABELS, TERMINAL_STATUSES, statusPillClass } from "../../utils/orderStages";
import { canEditOrder, canCancelOrder, canDeleteOrder } from "../../utils/orderPermissions";
import OrderStageTracker from "./OrderStageTracker";
import Invoice from "../invoice/Invoice";
import EditOrderModal from "./EditOrderModal";
import { useUITheme } from "../../context/UIThemeContext";

// Orders finish on different final statuses depending on source (dine-in/
// takeaway end at "Closed", online orders end at "Completed") — either one
// means the order is actually done, so its final receipt should be shown
// now (for staff to print or dismiss).
const COMPLETION_STATUSES = ["Closed", "Completed"];

const OrderCard = ({ order }) => {
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();
  const role = useSelector((state) => state.user.role);
  const isOnline = order.orderSource === "Online";
  const isTakeaway = !isOnline && !order.table;
  const isTerminal = TERMINAL_STATUSES.includes(order.orderStatus);
  const next = NEXT_ACTION[order.orderStatus];

  // Holds the order whose receipt should be shown, set only the moment
  // it's marked complete (never at order creation — that gets its own
  // Kitchen Order Slip instead, see Bill.jsx). The receipt is only shown on
  // screen here, not auto-printed: staff click "Print Receipt" if a copy is
  // actually needed, or "Close" to just dismiss it.
  const [printOrder, setPrintOrder] = useState(null);
  // Edit-items modal — Cashier/Admin only (see orderPermissions.js).
  const [showEditModal, setShowEditModal] = useState(false);

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["dailyProfit"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyProfit"] });
      enqueueSnackbar(`Order is now ${STAGE_LABELS[vars.orderStatus] || vars.orderStatus}`, { variant: "success" });

      if (COMPLETION_STATUSES.includes(vars.orderStatus)) {
        setPrintOrder({ ...order, orderStatus: vars.orderStatus });
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update order.", { variant: "error" });
    },
  });

  const setStatus = (orderStatus) => statusMutation.mutate({ orderId: order._id, orderStatus });

  const deleteMutation = useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dailyProfit"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyProfit"] });
      enqueueSnackbar("Order deleted.", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete order.", { variant: "error" });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Delete this order permanently? This can't be undone.")) {
      deleteMutation.mutate(order._id);
    }
  };

  return (
    <div
      className={`w-full p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between border ${
        isClean
          ? "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md"
          : "bg-slate-900/95 border-slate-800 hover:border-slate-700 shadow-xl"
      }`}
    >
      <div>
        {/* Ticket Header */}
        <div
          className={`flex items-start justify-between gap-3 pb-3 border-b ${
            isClean ? "border-slate-100" : "border-slate-800/80"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
              {getAvatarName(order.customerDetails.name)}
            </div>
            <div className="min-w-0">
              <h3
                className={`text-base font-extrabold truncate leading-tight ${
                  isClean ? "text-slate-900" : "text-white"
                }`}
              >
                {order.customerDetails.name}
              </h3>
              <p
                className={`text-xs mt-0.5 font-mono ${
                  isClean ? "text-slate-500 font-semibold" : "text-slate-400"
                }`}
              >
                Order #{getOrderNumber(order)}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusPillClass(order.orderStatus)}`}>
              {STAGE_LABELS[order.orderStatus] || order.orderStatus}
            </span>
            <span className={`text-[11px] font-semibold ${isClean ? "text-slate-600" : "text-slate-400"}`}>
              {isOnline ? "🌐 Online" : isTakeaway ? "🥡 Takeaway" : `🪑 Table ${order.table?.tableNo ?? "—"}`}
            </span>
          </div>
        </div>

        {/* Stage-by-stage progress tracker */}
        <div className="py-2">
          <OrderStageTracker order={order} />
        </div>

        {/* Order Details & Items Count */}
        <div
          className={`flex justify-between items-center py-2 text-xs ${
            isClean ? "text-slate-500 font-medium" : "text-slate-400"
          }`}
        >
          <span>{formatDateAndTime(order.orderDate)}</span>
          <span
            className={`px-2 py-0.5 rounded-md font-bold ${
              isClean ? "bg-slate-100 text-slate-700" : "bg-slate-800 text-slate-300"
            }`}
          >
            {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Bill Total */}
        <div
          className={`flex items-center justify-between py-2 border-t my-1 ${
            isClean ? "border-slate-100" : "border-slate-800/80"
          }`}
        >
          <span
            className={`text-xs uppercase tracking-wider font-bold ${
              isClean ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Total Amount
          </span>
          <span
            className={`text-base font-black font-mono ${
              isClean ? "text-slate-900" : "text-white"
            }`}
          >
            Rs {order.bills.totalWithTax.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {!isTerminal && (
        <div
          className={`mt-3 pt-3 border-t flex flex-wrap gap-2 ${
            isClean ? "border-slate-100" : "border-slate-800/80"
          }`}
        >
          {next && (
            <button
              onClick={() => setStatus(next.to)}
              disabled={statusMutation.isPending}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-1"
            >
              <span>{next.label}</span>
              <span>→</span>
            </button>
          )}
          {canEditOrder(role) && (
            <button
              onClick={() => setShowEditModal(true)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 font-bold text-xs border transition ${
                isClean
                  ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                  : "bg-[#2a2a2a] text-[#f6b100] border-transparent"
              }`}
              aria-label="Edit order"
            >
              <FaPen size={11} /> Edit
            </button>
          )}
          {canCancelOrder(role) && (
            <button
              onClick={() => {
                if (window.confirm("Cancel this order? Any deducted stock will be returned to inventory.")) {
                  setStatus("Cancelled");
                }
              }}
              disabled={statusMutation.isPending}
              className={`rounded-xl px-3 py-2 font-bold text-xs border transition disabled:opacity-60 ${
                isClean
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                  : "bg-[#be3e3f] text-[#f5f5f5] border-transparent"
              }`}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {canDeleteOrder(role, order.orderStatus) && (
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold border transition disabled:opacity-60 ${
            isClean
              ? "bg-rose-50/70 hover:bg-rose-100 text-rose-700 border-rose-200"
              : "bg-[#3f1f1f] text-[#e6402e] border-transparent"
          }`}
        >
          <FaTrash size={11} /> {deleteMutation.isPending ? "Deleting…" : "Delete order"}
        </button>
      )}

      {printOrder && (
        <Invoice orderInfo={printOrder} setShowInvoice={() => setPrintOrder(null)} />
      )}

      {showEditModal && <EditOrderModal order={order} onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default OrderCard;


