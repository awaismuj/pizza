import { useEffect, useRef, useState } from "react";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { FaPen, FaPrint, FaTrash } from "react-icons/fa";
import BackButton from "../components/shared/BackButton";
import DeletedOrdersPanel from "../components/orders/DeletedOrdersPanel";
import BottomNav from "../components/shared/BottomNav";
import { getOrders, updateOrderStatus, deleteOrder as deleteOrderApi } from "../https";
import OrderStageTracker from "../components/orders/OrderStageTracker";
import EditOrderModal from "../components/orders/EditOrderModal";
import { PAYMENT_WAITING } from "../utils/orderStages";
import { PaymentBadge, PaymentDetails, PaymentActions } from "../components/orders/PaymentPanel";
import { paymentKind } from "../utils/payments";
import Invoice from "../components/invoice/Invoice";
import { canEditOrder, canCancelOrder, canDeleteOrder, canExtendPrep } from "../utils/orderPermissions";
import { isPrepActive } from "../utils/prepTimer";
import PrepBadge from "../components/prep/PrepBadge";
import ExtendTimeModal from "../components/prep/ExtendTimeModal";
import { I } from "../components/shared/AppIcons";

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
  useEffect(() => {
    document.title = "POS | Online Orders";
  }, []);

  const [activeTab, setActiveTab] = useState("All");
  const [payFilter, setPayFilter] = useState("all");
  const [printOrder, setPrintOrder] = useState(null);
  const jumpedToVerify = useRef(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [extendingOrder, setExtendingOrder] = useState(null);
  const queryClient = useQueryClient();
  const role = useSelector((state) => state.user.role);

  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
    refetchInterval: 15000, // poll so new online orders show up without a manual refresh
  });

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      // Accepting/cancelling moves stock in or out of inventory.
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["low-stock"]);
      // Reaching "Completed" (or being Cancelled) changes whether this
      // online order counts as revenue, so Profit needs to know too.
      queryClient.invalidateQueries(["dailyProfit"]);
      queryClient.invalidateQueries(["monthlyProfit"]);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to update order.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["dailyProfit"]);
      queryClient.invalidateQueries(["monthlyProfit"]);
      enqueueSnackbar("Order deleted.", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete order.", { variant: "error" });
    },
  });

  const handleDelete = (order) => {
    if (window.confirm("Delete this order permanently? This can't be undone.")) {
      deleteMutation.mutate(order._id);
    }
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

  const setStatus = (order, orderStatus) => {
    statusMutation.mutate({ orderId: order._id, orderStatus });
  };

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] overflow-x-hidden pb-40">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-10">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">
            Online Orders
          </h1>
          <DeletedOrdersPanel isAdmin={String(role || "").toLowerCase() === "admin"} />
        </div>
      </div>

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
        {visibleOrders.length === 0 && (
          <p className="col-span-full text-gray-500">No orders here yet.</p>
        )}

        {visibleOrders.map((order) => (
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
              onAdvance={(orderStatus) => setStatus(order, orderStatus)}
              isAdvancing={statusMutation.isPending}
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
              {order.orderStatus === "Pending" && (
                <p className="w-full rounded-lg bg-[#2a2a2a] py-2 text-center text-xs text-[#ababab]">
                  Click the next stage dot to accept this order.
                </p>
              )}

              {canExtendPrep(role) && isPrepActive(order) && (
                <button
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
                  onClick={() => setEditingOrder(order)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 font-semibold text-[#f6b100]"
                >
                  <FaPen size={12} /> Edit
                </button>
              )}

              {![PAYMENT_WAITING, "Completed", "Cancelled"].includes(order.orderStatus) && canCancelOrder(role) && (
                <button
                  onClick={() => {
                    if (window.confirm("Cancel this order? Any deducted stock will be returned to inventory.")) {
                      setStatus(order, "Cancelled");
                    }
                  }}
                  disabled={statusMutation.isPending}
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
                </span>
              )}
            </div>

            {canDeleteOrder(role, order.orderStatus) && order.orderStatus !== PAYMENT_WAITING && (
              <button
                onClick={() => handleDelete(order)}
                disabled={deleteMutation.isPending}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3f1f1f] py-2 text-sm font-semibold text-[#e6402e] disabled:opacity-60"
              >
                <FaTrash size={11} /> {deleteMutation.isPending ? "Deleting…" : "Delete order"}
              </button>
            )}
          </div>
        ))}
      </div>

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
