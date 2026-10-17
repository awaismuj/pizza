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
import { useUITheme } from "../context/UIThemeContext";

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
  const { isClean } = useUITheme();

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

      <div className="grid w-full grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 pb-24">
        {visibleOrders.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No {activeTab} online orders at the moment.</p>
          </div>
        )}

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
          </div>
        ))}
      </div>

      {editingOrder && <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} />}

      <BottomNav />
    </section>
  );
};

export default OnlineOrders;
