import { useState } from "react";
import PropTypes from "prop-types";
import { FaLongArrowAltRight, FaPen, FaPrint, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { formatDateAndTime, getAvatarName, getOrderNumber } from "../../utils/index";
import { NEXT_ACTION, STAGE_LABELS, TERMINAL_STATUSES, statusPillClass } from "../../utils/orderStages";
import { useOrderDelete, useOrderStatusChange } from "../../hooks/useOrderActions";
import ConfirmDialog from "../shared/ConfirmDialog";
import { canEditOrder, canCancelOrder, canDeleteOrder, canExtendPrep } from "../../utils/orderPermissions";
import { isPrepActive } from "../../utils/prepTimer";
import PrepBadge from "../prep/PrepBadge";
import ExtendTimeModal from "../prep/ExtendTimeModal";
import OrderStageTracker from "./OrderStageTracker";
import Invoice from "../invoice/Invoice";
import EditOrderModal from "./EditOrderModal";
import { I } from "../shared/AppIcons";

const OrderCard = ({ order }) => {
  const role = useSelector((state) => state.user.role);
  const isOnline = order.orderSource === "Online";
  const isTakeaway = !isOnline && !order.table;
  const isTerminal = TERMINAL_STATUSES.includes(order.orderStatus);

  // The receipt is opened explicitly from the compact Print button.
  const [printOrder, setPrintOrder] = useState(null);
  // Edit-items modal — Cashier/Admin only (see orderPermissions.js).
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  // "cancel" or "delete" while waiting for the in-app confirmation.
  const [confirming, setConfirming] = useState(null);

  // Buttons update the card immediately; see hooks/useOrderActions.js.
  const { changeStatus, isPending } = useOrderStatusChange();
  const { removeOrder, isRemoving } = useOrderDelete();
  const setStatus = (orderStatus) => changeStatus(order, orderStatus);
  const busy = isPending(order._id) || isRemoving(order._id);
  const next = NEXT_ACTION[order.orderStatus];

  const confirmAction = () => {
    if (confirming === "cancel") setStatus("Cancelled");
    else if (confirming === "delete") removeOrder(order);
    setConfirming(null);
  };

  return (
    <div className="w-full min-w-0 bg-[#262626] p-4 rounded-lg">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button className="shrink-0 bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col items-start gap-1">
            <h1
              title={order.customerDetails.name}
              className="max-w-full truncate text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wide"
            >
              {order.customerDetails.name}
            </h1>
            <p className="max-w-full truncate text-[#ababab] text-xs sm:text-sm">
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
          <div className="flex shrink-0 flex-col items-end gap-2">
            <p className={`px-2 py-1 rounded-lg text-sm font-semibold ${statusPillClass(order.orderStatus)}`}>
              {STAGE_LABELS[order.orderStatus] || order.orderStatus}
            </p>
          </div>
        </div>
      </div>

      <PrepBadge order={order} showNumber className="mt-3" />

      {/* Clicking the next dot advances one valid order stage. */}
      <OrderStageTracker
        order={order}
        onAdvance={setStatus}
        isAdvancing={busy}
      />
      {order.orderStatus !== "Cancelled" && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setPrintOrder(order)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#2a2a2a] px-2.5 py-1.5 text-xs font-semibold text-[#f5f5f5] hover:bg-[#333]"
          >
            <FaPrint size={11} /> Print
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 text-[#ababab]">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} Items</p>
      </div>
      <hr className="w-full mt-4 border-t-1 border-gray-500" />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">Rs {order.bills.totalWithTax.toFixed(2)}</p>
      </div>

      {/* Edit, cancel, extend prep, or (Admin only) delete. Stage changes
          happen from the progress dots above. Edit/Cancel are
          Cashier+Admin; Delete is Admin only — same rule the server
          enforces, see utils/orderPermissions.js. */}
      {!isTerminal && (
        <div className="mt-4 flex flex-wrap gap-2">
          {/* The main action for this order, as a big button instead of
              only the small numbered dot above. */}
          {next && (
            <button
              type="button"
              onClick={() => setStatus(next.to)}
              disabled={busy}
              className="w-full rounded-lg bg-[#f6b100] py-3 font-bold text-[#1f1f1f] transition active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? "Updating…" : `${next.label} →`}
            </button>
          )}
          {canExtendPrep(role) && isPrepActive(order) && (
            <button
              type="button"
              onClick={() => setShowExtend(true)}
              className="rounded-lg border border-[#f6b100]/50 bg-[#f6b100]/10 px-3 py-2 font-semibold text-[#f6b100]"
            >
              Extend Time
            </button>
          )}
          {canEditOrder(role) && (
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 font-semibold text-[#f6b100] disabled:opacity-60"
              aria-label="Edit order"
            >
              <FaPen size={12} /> Edit
            </button>
          )}
          {canCancelOrder(role) && (
            <button
              type="button"
              onClick={() => setConfirming("cancel")}
              disabled={busy}
              className="rounded-lg bg-[#be3e3f] px-4 py-2 font-semibold text-[#f5f5f5] disabled:opacity-60"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {canDeleteOrder(role, order.orderStatus) && (
        <button
          type="button"
          onClick={() => setConfirming("delete")}
          disabled={busy}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3f1f1f] py-2 text-sm font-semibold text-[#e6402e] disabled:opacity-60"
        >
          <FaTrash size={11} /> {isRemoving(order._id) ? "Deleting…" : "Delete order"}
        </button>
      )}

      <ConfirmDialog
        open={Boolean(confirming)}
        danger
        title={confirming === "delete" ? "Delete this order?" : "Cancel this order?"}
        message={
          confirming === "delete"
            ? "It will be removed permanently. This can't be undone."
            : "Any stock already taken for it goes back to inventory."
        }
        confirmLabel={confirming === "delete" ? "Delete order" : "Cancel order"}
        cancelLabel="Keep order"
        onConfirm={confirmAction}
        onClose={() => setConfirming(null)}
      />

      {/* Opened by the compact Print button; it never prints automatically. */}
      {printOrder && (
        <Invoice orderInfo={printOrder} setShowInvoice={() => setPrintOrder(null)} />
      )}

      {showEditModal && <EditOrderModal order={order} onClose={() => setShowEditModal(false)} />}
      {showExtend && <ExtendTimeModal order={order} onClose={() => setShowExtend(false)} />}
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    orderSource: PropTypes.string,
    orderStatus: PropTypes.string.isRequired,
    orderDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    customerDetails: PropTypes.shape({ name: PropTypes.string }).isRequired,
    table: PropTypes.shape({ tableNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }),
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    bills: PropTypes.shape({ totalWithTax: PropTypes.number }).isRequired,
  }).isRequired,
};

export default OrderCard;
