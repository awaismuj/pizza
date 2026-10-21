import React, { useState } from "react";
import { FaLongArrowAltRight, FaPen, FaTrash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { formatDateAndTime, getAvatarName, getOrderNumber } from "../../utils/index";
import { updateOrderStatus, deleteOrder as deleteOrderApi } from "../../https";
import { NEXT_ACTION, STAGE_LABELS, TERMINAL_STATUSES, statusPillClass } from "../../utils/orderStages";
import { canEditOrder, canCancelOrder, canDeleteOrder, canExtendPrep } from "../../utils/orderPermissions";
import { isPrepActive } from "../../utils/prepTimer";
import PrepBadge from "../prep/PrepBadge";
import ExtendTimeModal from "../prep/ExtendTimeModal";
import OrderStageTracker from "./OrderStageTracker";
import Invoice from "../invoice/Invoice";
import EditOrderModal from "./EditOrderModal";
import { I } from "../shared/AppIcons";

// Orders finish on different final statuses depending on source (dine-in/
// takeaway end at "Closed", online orders end at "Completed") — either one
// means the order is actually done, so its final receipt should be shown
// now (for staff to print or dismiss).
const COMPLETION_STATUSES = ["Closed", "Completed"];

const OrderCard = ({ order }) => {
  const queryClient = useQueryClient();
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
  const [showExtend, setShowExtend] = useState(false);

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
    <div className="w-full max-w-[500px] bg-[#262626] p-4 rounded-lg mb-4">
      <div className="flex items-center gap-5">
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex items-center justify-between w-[100%]">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {order.customerDetails.name}
            </h1>
            <p className="text-[#ababab] text-sm">
              #{getOrderNumber(order)} /{" "}
              {isOnline ? "Online delivery" : isTakeaway ? "Outdoor / Takeaway" : "Dine in"}
            </p>
            {isOnline ? (
              <p className="text-[#025cca] text-sm"><I.Cart className="inline mr-1.5" />Online order</p>
            ) : isTakeaway ? (
              <p className="text-[#f6b100] text-sm"><I.Bag className="inline mr-1.5" />Takeaway</p>
            ) : (
              <p className="text-[#ababab] text-sm">
                Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {order.table?.tableNo ?? "—"}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className={`px-2 py-1 rounded-lg text-sm font-semibold ${statusPillClass(order.orderStatus)}`}>
              {STAGE_LABELS[order.orderStatus] || order.orderStatus}
            </p>
          </div>
        </div>
      </div>

      <PrepBadge order={order} showNumber className="mt-3" />

      {/* Stage-by-stage progress: Processing -> Ready -> Completed */}
      <OrderStageTracker order={order} />

      <div className="flex justify-between items-center mt-4 text-[#ababab]">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} Items</p>
      </div>
      <hr className="w-full mt-4 border-t-1 border-gray-500" />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">Rs {order.bills.totalWithTax.toFixed(2)}</p>
      </div>

      {/* Action buttons: move the order to its next stage, edit its items,
          cancel it, or (Admin only) delete it outright. Edit/Cancel are
          Cashier+Admin; Delete is Admin only — same rule the server
          enforces, see utils/orderPermissions.js. */}
      {!isTerminal && (
        <div className="mt-4 flex flex-wrap gap-2">
          {next && (
            <button
              onClick={() => setStatus(next.to)}
              disabled={statusMutation.isPending}
              className="flex-1 rounded-lg bg-[#02ca3a] py-2 font-semibold text-[#1f1f1f] disabled:opacity-60"
            >
              {next.label}
            </button>
          )}
          {canExtendPrep(role) && isPrepActive(order) && (
            <button
              onClick={() => setShowExtend(true)}
              className="rounded-lg border border-[#f6b100]/50 bg-[#f6b100]/10 px-3 py-2 font-semibold text-[#f6b100]"
            >
              Extend Time
            </button>
          )}
          {canEditOrder(role) && (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 font-semibold text-[#f6b100]"
              aria-label="Edit order"
            >
              <FaPen size={12} /> Edit
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
              className="rounded-lg bg-[#be3e3f] px-4 py-2 font-semibold text-[#f5f5f5] disabled:opacity-60"
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
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3f1f1f] py-2 text-sm font-semibold text-[#e6402e] disabled:opacity-60"
        >
          <FaTrash size={11} /> {deleteMutation.isPending ? "Deleting…" : "Delete order"}
        </button>
      )}

      {/* Shown here, and only here — the moment the order is actually
          marked complete, not when it was first created. It does not
          auto-print: it just appears on screen so staff can look it over
          and click "Print Receipt" if a copy is needed, or "Close" to
          dismiss it without printing. */}
      {printOrder && (
        <Invoice orderInfo={printOrder} setShowInvoice={() => setPrintOrder(null)} />
      )}

      {showEditModal && <EditOrderModal order={order} onClose={() => setShowEditModal(false)} />}
      {showExtend && <ExtendTimeModal order={order} onClose={() => setShowExtend(false)} />}
    </div>
  );
};

export default OrderCard;
