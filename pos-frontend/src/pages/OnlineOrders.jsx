import { useEffect, useState } from "react";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { FaPen, FaTrash } from "react-icons/fa";
import BackButton from "../components/shared/BackButton";
import DeletedOrdersPanel from "../components/orders/DeletedOrdersPanel";
import BottomNav from "../components/shared/BottomNav";
import { getOrders, updateOrderStatus, deleteOrder as deleteOrderApi } from "../https";
import OrderStageTracker from "../components/orders/OrderStageTracker";
import EditOrderModal from "../components/orders/EditOrderModal";
import { NEXT_ACTION } from "../utils/orderStages";
import { canEditOrder, canCancelOrder, canDeleteOrder } from "../utils/orderPermissions";

// The staff-facing flow for orders placed on genzpizza.online:
//   Pending -> (Accept | Accept & Process | Cancel)
//   Accepted -> Preparing (processing) -> Ready to Deliver -> Completed
const TABS = [
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

  const [activeTab, setActiveTab] = useState("Pending");
  const [editingOrder, setEditingOrder] = useState(null);
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
  const visibleOrders = orders.filter((o) => o.orderStatus === activeTab);

  const setStatus = (order, orderStatus) => {
    statusMutation.mutate({ orderId: order._id, orderStatus });
  };

  // Accept the order (this is when stock is taken from inventory) and send
  // it straight to the kitchen in one tap.
  const acceptAndProcess = async (order) => {
    try {
      await statusMutation.mutateAsync({ orderId: order._id, orderStatus: "Accepted" });
      await statusMutation.mutateAsync({ orderId: order._id, orderStatus: "Preparing" });
      enqueueSnackbar("Order accepted and sent to processing", { variant: "success" });
    } catch {
      // The mutation's onError already showed the reason (e.g. not enough stock).
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] overflow-x-hidden pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
              Online Orders Dispatch Pipeline
            </h1>
            <p className="text-xs text-slate-400">Incoming storefront delivery & takeaway orders</p>
          </div>
          <div className="ml-2">
            <DeletedOrdersPanel isAdmin={String(role || "").toLowerCase() === "admin"} />
          </div>
        </div>

        {/* Status Stage Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const count = orders.filter((o) => o.orderStatus === tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-300"
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

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-2 min-[480px]:grid-cols-2 sm:px-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {visibleOrders.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
            <p className="text-slate-400 text-sm font-medium">No {activeTab} online orders at the moment.</p>
          </div>
        )}

        {visibleOrders.map((order) => (
          <div key={order._id} className="rounded-2xl bg-slate-900/95 border border-slate-800 hover:border-slate-700 p-4 shadow-xl flex flex-col justify-between transition">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#f5f5f5]">{order.customerDetails?.name}</h2>
              <span className="text-xs text-[#ababab]">
                {new Date(order.orderDate).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-[#ababab]">{order.customerDetails?.phone}</p>
            {order.customerDetails?.address && (
              <p className="mt-1 text-xs text-[#ababab]">{order.customerDetails.address}</p>
            )}

            <OrderStageTracker order={order} />

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

            <div className="mt-3 flex items-center justify-between border-t border-[#383838] pt-2">
              <span className="text-sm text-[#ababab]">Total</span>
              <span className="font-semibold text-[#f5f5f5]">
                Rs {order.bills?.totalWithTax?.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.orderStatus === "Pending" && (
                <>
                  <button
                    onClick={() => acceptAndProcess(order)}
                    disabled={statusMutation.isPending}
                    className="flex-1 rounded-lg bg-[#02ca3a] py-2 font-semibold text-[#1f1f1f] disabled:opacity-60"
                  >
                    Accept &amp; Process
                  </button>
                  <button
                    onClick={() => setStatus(order, "Accepted")}
                    disabled={statusMutation.isPending}
                    className="flex-1 rounded-lg bg-[#2e4a40] py-2 font-semibold text-[#02ca3a] disabled:opacity-60"
                  >
                    Accept only
                  </button>
                </>
              )}

              {order.orderStatus !== "Pending" && NEXT_ACTION[order.orderStatus] && (
                <button
                  onClick={() => setStatus(order, NEXT_ACTION[order.orderStatus].to)}
                  disabled={statusMutation.isPending}
                  className="flex-1 rounded-lg bg-[#f6b100] py-2 font-semibold text-[#1f1f1f] disabled:opacity-60"
                >
                  {NEXT_ACTION[order.orderStatus].label}
                </button>
              )}

              {/* Cancel/Edit are Cashier+Admin only; Delete is Admin only —
                  same rule the server enforces, see utils/orderPermissions.js. */}
              {!["Completed", "Cancelled"].includes(order.orderStatus) && canEditOrder(role) && (
                <button
                  onClick={() => setEditingOrder(order)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 font-semibold text-[#f6b100]"
                >
                  <FaPen size={12} /> Edit
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

            {canDeleteOrder(role, order.orderStatus) && (
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

      {editingOrder && <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} />}

      <BottomNav />
    </section>
  );
};

export default OnlineOrders;
