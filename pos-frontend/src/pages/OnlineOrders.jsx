import { useEffect, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { FaPen, FaPrint, FaTrash } from "react-icons/fa";
import BackButton from "../components/shared/BackButton";
import DeletedOrdersPanel from "../components/orders/DeletedOrdersPanel";
import BottomNav from "../components/shared/BottomNav";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { getOrders } from "../https";
import OrderStageTracker from "../components/orders/OrderStageTracker";
import EditOrderModal from "../components/orders/EditOrderModal";
<<<<<<< HEAD
import { NEXT_ACTION } from "../utils/orderStages";
import { canEditOrder, canCancelOrder, canDeleteOrder } from "../utils/orderPermissions";
import { useUITheme } from "../context/UIThemeContext";
=======
import { NEXT_ACTION, PAYMENT_WAITING } from "../utils/orderStages";
import { useOrderDelete, useOrderStatusChange } from "../hooks/useOrderActions";
import { PaymentBadge, PaymentDetails, PaymentActions } from "../components/orders/PaymentPanel";
import { paymentKind } from "../utils/payments";
import Invoice from "../components/invoice/Invoice";
import { canEditOrder, canCancelOrder, canDeleteOrder, canExtendPrep } from "../utils/orderPermissions";
import { isPrepActive } from "../utils/prepTimer";
import PrepBadge from "../components/prep/PrepBadge";
import ExtendTimeModal from "../components/prep/ExtendTimeModal";
import { I } from "../components/shared/AppIcons";
>>>>>>> origin/main

// The staff-facing flow for orders placed on genzpizza.online:
//   Pending -> Accepted -> Preparing (processing) -> Ready to Deliver -> Completed
const TABS = [
  { key: "All", label: "All Orders" },
  { key: PAYMENT_WAITING, label: "Verify Payment" },
  { key: "Pending", label: "New" },
  { key: "Accepted", label: "Accepted" },
  { key: "Preparing", label: "Processing" },
  { key: "Ready to Deliver", label: "Ready to Deliver" },
  { key: "Completed", label: "Completed" },
  { key: "Cancelled", label: "Cancelled" },
];

const OnlineOrders = () => {
  const { isClean } = useUITheme();

  useEffect(() => {
    document.title = "POS | Online Orders";
  }, []);

  const [activeTab, setActiveTab] = useState("All");
  const [payFilter, setPayFilter] = useState("all");
  const [printOrder, setPrintOrder] = useState(null);
  const jumpedToVerify = useRef(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [extendingOrder, setExtendingOrder] = useState(null);
  // The order waiting on a Cancel / Delete confirmation: { type, order }.
  const [confirming, setConfirming] = useState(null);
  const role = useSelector((state) => state.user.role);

  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
    // Poll often and again whenever staff come back to this tab, so a new
    // online order shows up within a few seconds without a manual refresh.
    refetchInterval: 5000,
    refetchOnWindowFocus: "always",
  });

  // Buttons update the card immediately; see hooks/useOrderActions.js.
  const { changeStatus, isPending } = useOrderStatusChange();
  const { removeOrder, isRemoving } = useOrderDelete();

  const confirmAction = () => {
    if (!confirming) return;
    if (confirming.type === "cancel") changeStatus(confirming.order, "Cancelled");
    else removeOrder(confirming.order);
    setConfirming(null);
  };

  const orders = (resData?.data?.data ?? []).filter((o) => o.orderSource === "Online");
  const visibleOrders = orders.filter(
    (o) =>
      (activeTab === "All" || o.orderStatus === activeTab) &&
      (payFilter === "all" || paymentKind(o) === payFilter)
  );

  // When staff are already in a status-specific tab, bring them to payment
  // verification the first time a payment is waiting. All Orders stays put
  // so the whole order lifecycle can be handled from one list.
  const waitingCount = orders.filter((o) => o.orderStatus === PAYMENT_WAITING).length;
  useEffect(() => {
    if (!jumpedToVerify.current && waitingCount > 0 && activeTab !== "All") {
      jumpedToVerify.current = true;
      setActiveTab(PAYMENT_WAITING);
    }
  }, [waitingCount]);

  return (
    <section className="min-h-[calc(100vh-5rem)] overflow-x-hidden pb-8">
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl mb-3 transition duration-200 ${
          isClean
            ? "bg-white border border-slate-200/90 shadow-xs"
            : "bg-slate-900/90 border border-slate-800 shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1
              className={`text-lg sm:text-xl font-black tracking-tight leading-none ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              Online Orders Dispatch Pipeline
            </h1>
            <p className={`text-[11px] mt-0.5 ${isClean ? "text-slate-400" : "text-slate-500"}`}>
              Incoming storefront delivery & takeaway orders
            </p>
          </div>
          <div className="ml-2">
            <DeletedOrdersPanel isAdmin={String(role || "").toLowerCase() === "admin"} />
          </div>
        </div>

        {/* Status Stage Tabs */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-2xl overflow-x-auto scrollbar-hide ${
            isClean ? "bg-slate-100 border border-slate-200/90" : "bg-slate-950/80 border border-slate-800"
          }`}
        >
          {TABS.map((tab) => {
            const count = orders.filter((o) => o.orderStatus === tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                    : isClean
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-slate-950/20 text-slate-950 font-black"
                        : isClean
                        ? "bg-white text-slate-800 shadow-xs"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid w-full grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 pb-24">
=======
      {/* Wraps to as many rows as needed on narrow screens instead of
          relying on the person discovering a horizontal scroll - a row
          that just gets cut off mid-label ("Ready to Deli...") reads as
          broken even though it technically scrolled. */}
      <div className="flex flex-wrap gap-2 px-4 pb-2 sm:px-10">
        {TABS.map((tab) => {
          const count =
            tab.key === "All"
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:px-4 sm:text-sm font-semibold ${
                activeTab === tab.key ? "bg-[#383838] text-[#f5f5f5]" : "text-[#ababab]"
              }`}
            >
              {tab.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-1 sm:px-10">
        <label className="text-xs text-[#ababab]" htmlFor="pay-filter">Payment</label>
        <select
          id="pay-filter"
          value={payFilter}
          onChange={(e) => setPayFilter(e.target.value)}
          className="rounded-lg border border-[#444] bg-[#262626] px-3 py-1.5 text-xs text-[#f5f5f5] outline-none"
        >
          <option value="all">All methods</option>
          <option value="cod">Cash on Delivery</option>
          <option value="jazz">JazzCash/Raast</option>
        </select>
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-3 px-4 py-4 min-[480px]:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
>>>>>>> origin/main
        {visibleOrders.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No {activeTab} online orders at the moment.</p>
          </div>
        )}

<<<<<<< HEAD
        {visibleOrders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 shadow-sm hover:shadow-md flex flex-col justify-between transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 dark:text-white">{order.customerDetails?.name}</h2>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
=======
        {visibleOrders.map((order) => {
          const next = order.orderStatus === PAYMENT_WAITING ? null : NEXT_ACTION[order.orderStatus];
          const busy = isPending(order._id) || isRemoving(order._id);
          return (
          <div key={order._id} className="rounded-lg bg-[#262626] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#f5f5f5]">{order.customerDetails?.name}</h2>
              <span className="text-xs text-[#ababab]">
                {new Date(order.orderDate).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-[#ababab]">{order.customerDetails?.phone}</p>
            {order.fulfillment?.method && (
              <div className="mt-2 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-[#1f1f1f] px-2.5 py-1.5 text-xs text-[#f5f5f5]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#f6b100]">
                  {order.fulfillment.method === "pickup" ? <I.Store /> : <I.Rider />}
                  {order.fulfillment.method === "pickup" ? "Pickup" : "Delivery"}
                </span>
                <span className="text-[#ababab]">
                  {order.fulfillment.branchName}
                  {order.fulfillment.zoneName ? ` · ${order.fulfillment.zoneName}` : ""}
                  {order.fulfillment.estimatedMinutes?.min != null
                    ? ` · ${order.fulfillment.estimatedMinutes.min}-${order.fulfillment.estimatedMinutes.max} min`
                    : ""}
                </span>
              </div>
            )}
            {order.customerDetails?.address && (
              <p className="mt-1 text-xs text-[#ababab]">{order.customerDetails.address}</p>
            )}

            <PaymentBadge order={order} />

            <PrepBadge order={order} showNumber className="mt-3" />

            <OrderStageTracker
              order={order}
              onAdvance={(orderStatus) => changeStatus(order, orderStatus)}
              isAdvancing={busy}
            />
            {order.orderStatus !== PAYMENT_WAITING && order.orderStatus !== "Cancelled" && (
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

            {order.orderStatus === PAYMENT_WAITING && (
              <>
                <PaymentDetails order={order} />
                <PaymentActions order={order} role={role} />
              </>
            )}

            <ul className="mt-3 space-y-1 text-sm text-[#f5f5f5]">
              {(order.items || []).map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            {Number(order.bills?.deliveryFee) > 0 && (
              <div className="mt-3 flex items-center justify-between text-sm text-[#ababab]">
                <span>Delivery fee</span>
                <span>Rs {Number(order.bills.deliveryFee).toFixed(2)}</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-[#383838] pt-2">
              <span className="text-sm text-[#ababab]">Total</span>
              <span className="font-semibold text-[#f5f5f5]">
                Rs {order.bills?.totalWithTax?.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {/* The main action for this order, as a big button instead of
                  only the small numbered dot above. */}
              {next && (
                <button
                  type="button"
                  onClick={() => changeStatus(order, next.to)}
                  disabled={busy}
                  className="w-full rounded-lg bg-[#f6b100] py-3 font-bold text-[#1f1f1f] transition active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? "Updating…" : `${next.label} →`}
                </button>
              )}

              {canExtendPrep(role) && isPrepActive(order) && (
                <button
                  type="button"
                  onClick={() => setExtendingOrder(order)}
                  className="rounded-lg border border-[#f6b100]/50 bg-[#f6b100]/10 px-3 py-2 font-semibold text-[#f6b100]"
                >
                  Extend Time
                </button>
              )}

              {/* Cancel/Edit are Cashier+Admin only; Delete is Admin only —
                  same rule the server enforces, see utils/orderPermissions.js. */}
              {![PAYMENT_WAITING, "Completed", "Cancelled"].includes(order.orderStatus) && canEditOrder(role) && (
                <button
                  type="button"
                  onClick={() => setEditingOrder(order)}
                  disabled={busy}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 font-semibold text-[#f6b100] disabled:opacity-60"
                >
                  <FaPen size={12} /> Edit
                </button>
              )}

              {![PAYMENT_WAITING, "Completed", "Cancelled"].includes(order.orderStatus) && canCancelOrder(role) && (
                <button
                  type="button"
                  onClick={() => setConfirming({ type: "cancel", order })}
                  disabled={busy}
                  className="flex-1 rounded-lg bg-[#be3e3f] py-2 font-semibold text-[#f5f5f5] disabled:opacity-60"
                >
                  Cancel
                </button>
              )}

              {["Completed", "Cancelled"].includes(order.orderStatus) && (
                <span
                  className={`w-full rounded-lg py-2 text-center font-semibold ${
                    order.orderStatus === "Completed"
                      ? "bg-[#1f3f28] text-[#02ca3a]"
                      : "bg-[#3f1f1f] text-[#be3e3f]"
                  }`}
                >
                  {order.orderStatus}
>>>>>>> origin/main
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{order.customerDetails?.phone}</p>
              {order.customerDetails?.address && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-700/60">
                  📍 {order.customerDetails.address}
                </p>
              )}

              <div className="my-2.5">
                <OrderStageTracker order={order} />
              </div>

              <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-200 border-t border-slate-100 dark:border-slate-800 pt-2">
                {(order.items || []).map((item, idx) => (
                  <li key={idx} className="flex justify-between text-xs">
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-mono font-semibold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

<<<<<<< HEAD
            <div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
                <span className="font-black font-mono text-base text-amber-600 dark:text-amber-400">
                  Rs {order.bills?.totalWithTax?.toFixed(2)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {order.orderStatus === "Pending" && (
                  <>
                    <button
                      onClick={() => acceptAndProcess(order)}
                      disabled={statusMutation.isPending}
                      className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-bold text-xs text-white shadow-sm transition disabled:opacity-60"
                    >
                      Accept &amp; Process
                    </button>
                    <button
                      onClick={() => setStatus(order, "Accepted")}
                      disabled={statusMutation.isPending}
                      className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2.5 font-bold text-xs text-slate-800 dark:text-slate-200 transition disabled:opacity-60"
                    >
                      Accept Only
                    </button>
                  </>
                )}

                {order.orderStatus !== "Pending" && NEXT_ACTION[order.orderStatus] && (
                  <button
                    onClick={() => setStatus(order, NEXT_ACTION[order.orderStatus].to)}
                    disabled={statusMutation.isPending}
                    className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 font-black text-xs text-slate-950 shadow-sm transition disabled:opacity-60"
                  >
                    {NEXT_ACTION[order.orderStatus].label}
                  </button>
                )}

                {!["Completed", "Cancelled"].includes(order.orderStatus) && canEditOrder(role) && (
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                  >
                    <FaPen size={11} /> Edit
                  </button>
                )}

                {!["Completed", "Cancelled"].includes(order.orderStatus) && canCancelOrder(role) && (
                  <button
                    onClick={() => {
                      if (window.confirm("Cancel this order? Any deducted stock will be returned to inventory.")) {
                        setStatus(order, "Cancelled");
                      }
                    }}
                    disabled={statusMutation.isPending}
                    className="flex-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}

                {["Completed", "Cancelled"].includes(order.orderStatus) && (
                  <span
                    className={`w-full rounded-xl py-2 text-center text-xs font-bold ${
                      order.orderStatus === "Completed"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                )}
              </div>

              {canDeleteOrder(role, order.orderStatus) && (
                <button
                  onClick={() => handleDelete(order)}
                  disabled={deleteMutation.isPending}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 py-2 text-xs font-semibold text-slate-400 transition disabled:opacity-60"
                >
                  <FaTrash size={11} /> {deleteMutation.isPending ? "Deleting…" : "Delete Order"}
                </button>
              )}
            </div>
=======
            {canDeleteOrder(role, order.orderStatus) && order.orderStatus !== PAYMENT_WAITING && (
              <button
                type="button"
                onClick={() => setConfirming({ type: "delete", order })}
                disabled={busy}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3f1f1f] py-2 text-sm font-semibold text-[#e6402e] disabled:opacity-60"
              >
                <FaTrash size={11} /> {isRemoving(order._id) ? "Deleting…" : "Delete order"}
              </button>
            )}
>>>>>>> origin/main
          </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(confirming)}
        danger
        title={confirming?.type === "delete" ? "Delete this order?" : "Cancel this order?"}
        message={
          confirming?.type === "delete"
            ? "It will be removed permanently. This can't be undone."
            : "Any stock already taken for it goes back to inventory."
        }
        confirmLabel={confirming?.type === "delete" ? "Delete order" : "Cancel order"}
        cancelLabel="Keep order"
        onConfirm={confirmAction}
        onClose={() => setConfirming(null)}
      />

      {printOrder && <Invoice orderInfo={printOrder} setShowInvoice={() => setPrintOrder(null)} />}

      {editingOrder && <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} />}

      {extendingOrder && (
        <ExtendTimeModal
          order={orders.find((o) => o._id === extendingOrder._id) || extendingOrder}
          onClose={() => setExtendingOrder(null)}
        />
      )}

      <BottomNav />
    </section>
  );
};

export default OnlineOrders;
