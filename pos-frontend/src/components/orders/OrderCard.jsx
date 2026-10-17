import React, { useState } from "react";
import { FaLongArrowAltRight, FaPen, FaTrash } from "react-icons/fa";
import { MdLanguage, MdTakeoutDining, MdTableBar } from "react-icons/md";
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
import ViewOrderModal from "./ViewOrderModal";
import { FcDocument } from "react-icons/fc";
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
  // View full order details modal (items, variants, bill breakdown)
  const [showViewModal, setShowViewModal] = useState(false);

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
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${isClean ? "text-slate-600" : "text-slate-400"}`}>
              {isOnline ? (
                <>
                  <MdLanguage size={13} className="text-sky-500" />
                  <span>Online</span>
                </>
              ) : isTakeaway ? (
                <>
                  <MdTakeoutDining size={13} className="text-amber-500" />
                  <span>Takeaway</span>
                </>
              ) : (
                <>
                  <MdTableBar size={13} className="text-emerald-500" />
                  <span>Table {order.table?.tableNo ?? "—"}</span>
                </>
              )}
            </div>
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

      {/* Action Buttons: View Details button ALWAYS visible */}
      <div className={`mt-3 pt-3 border-t flex flex-col gap-2 ${isClean ? "border-slate-100" : "border-slate-800/80"}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowViewModal(true)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 shadow-xs ${
              isClean
                ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
                : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30"
            }`}
            title="Inspect order items, variants, and notes"
          >
            <FcDocument size={16} />
            <span>View Order Details</span>
          </button>

          {isTerminal && (
            <button
              onClick={() => setPrintOrder(order)}
              className={`py-2 px-3 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1 ${
                isClean
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              }`}
              title="Print Receipt"
            >
              Receipt
            </button>
          )}
        </div>

        {!isTerminal && (
          <div className="flex flex-wrap gap-2">
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
                    ? "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                    : "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700"
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
                    : "bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border-rose-800"
                }`}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {canDeleteOrder(role, order.orderStatus) && (
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold border transition disabled:opacity-60 ${
            isClean
              ? "bg-rose-50/70 hover:bg-rose-100 text-rose-700 border-rose-200"
              : "bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border-rose-900/60"
          }`}
        >
          <FaTrash size={11} /> {deleteMutation.isPending ? "Deleting…" : "Delete order"}
        </button>
      )}

      {showViewModal && (
        <ViewOrderModal
          order={order}
          onClose={() => setShowViewModal(false)}
          onPrint={(ord) => setPrintOrder(ord)}
        />
      )}

      {printOrder && (
        <Invoice orderInfo={printOrder} setShowInvoice={() => setPrintOrder(null)} />
      )}

      {showEditModal && <EditOrderModal order={order} onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default OrderCard;


