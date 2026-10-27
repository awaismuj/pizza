import React, { useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { FaSearch, FaHistory } from "react-icons/fa";
import { MdLanguage, MdTakeoutDining, MdTableBar } from "react-icons/md";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime, getOrderNumber } from "../../utils";
import { paymentKind, paymentKindLabel, PAYMENT_STATUS_STYLE } from "../../utils/payments";
import { I } from "../shared/AppIcons";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();
  const [searchTerm, setSearchTerm] = useState("");

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // Refresh order list
      // A status change (e.g. Cancelled) can change whether this order
      // counts as revenue now, so Profit needs to know too.
      queryClient.invalidateQueries({ queryKey: ["dailyProfit"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyProfit"] });
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    },
  });

  const handleStatusChange = ({ orderId, orderStatus }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong loading orders!", { variant: "error" });
  }

  const allOrders = resData?.data?.data ?? [];

  // Order history filters: payment method (COD / JazzCash) and payment
  // status (Pending / Verified / Rejected).
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const orders = allOrders.filter(
    (o) =>
      (methodFilter === "all" || paymentKind(o) === methodFilter) &&
      (statusFilter === "all" || o.paymentStatus === statusFilter)
  );

  // Method + (for JazzCash) status and TID, shared by card and table.
  const renderPayment = (order) => (
    <>
      <span>{paymentKindLabel(order)}</span>
      {paymentKind(order) !== "pos" && order.paymentStatus && (
        <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${PAYMENT_STATUS_STYLE[order.paymentStatus] || ""}`}>
          {order.paymentStatus}
        </span>
      )}
      {paymentKind(order) === "jazz" && order.jazzcash?.tid && (
        <span className="block text-[11px] text-[#8a8a8a]">TID {order.jazzcash.tid}</span>
      )}
    </>
  );

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const q = searchTerm.toLowerCase();
    return orders.filter((o) => {
      const orderNum = String(getOrderNumber(o)).toLowerCase();
      const name = (o.customerDetails?.name || "").toLowerCase();
      const phone = (o.customerDetails?.phone || "").toLowerCase();
      const status = (o.orderStatus || "").toLowerCase();
      return orderNum.includes(q) || name.includes(q) || phone.includes(q) || status.includes(q);
    });
  }, [orders, searchTerm]);

  const renderTableWhere = (order, isOnline) =>
    isOnline ? (
      <span className="inline-flex items-center gap-1.5">
        <I.Cart /> Online{order.fulfillment?.method ? ` · ${order.fulfillment.method === "pickup" ? "Pickup" : "Delivery"}` : ""}
      </span>
    ) : order.table?.tableNo ? (
      `Table - ${order.table.tableNo}`
    ) : (
      <span className="inline-flex items-center gap-1.5">
        <I.Bag /> Takeaway
      </span>
    );

  const renderStatus = (order, isOnline) =>
    isOnline ? (
      <span
        className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold border ${statusPillClass(
          order.orderStatus
        )}`}
      >
        {STAGE_LABELS[order.orderStatus] || order.orderStatus}
      </span>
    ) : (
      <select
        className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border outline-none transition cursor-pointer ${
          isClean
            ? "bg-slate-50 border-slate-200 text-slate-800 hover:bg-white focus:border-amber-500"
            : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750 focus:border-amber-500"
        }`}
        value={order.orderStatus}
        onChange={(e) => handleStatusChange({ orderId: order._id, orderStatus: e.target.value })}
      >
        <option value="In Progress">In Progress</option>
        <option value="Ready">Ready</option>
        <option value="Closed">Closed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    );

  return (
    <div className="mx-auto w-full bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
        Recent Orders
      </h2>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[#ababab]">
          Payment method
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-lg border border-[#444] bg-[#1a1a1a] px-3 py-2 text-sm text-[#f5f5f5] outline-none"
          >
            <option value="all">All</option>
            <option value="cod">Cash on Delivery</option>
            <option value="jazz">JazzCash/Raast</option>
            <option value="pos">Register (Cash / Online)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-[#ababab]">
          Payment status
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#444] bg-[#1a1a1a] px-3 py-2 text-sm text-[#f5f5f5] outline-none"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        {(methodFilter !== "all" || statusFilter !== "all") && (
          <button
            onClick={() => { setMethodFilter("all"); setStatusFilter("all"); }}
            className="text-sm font-semibold text-[#f6b100] hover:underline"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-[#8a8a8a]">{orders.length} of {allOrders.length} orders</span>
      </div>

      {orders.length === 0 && (
        <p className="p-4 text-[#ababab]">{allOrders.length === 0 ? "No orders yet." : "No orders match these filters."}</p>
      )}

      {/* Mobile / tablet (below md): one self-contained card per order, so
          nothing needs a sideways scroll to be read - every field for an
          order is stacked in the same card instead of split across
          off-screen table columns. */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {orders.map((order, index) => {
          const isOnline = order.orderSource === "Online";
          return (
            <div
              key={order._id || index}
              className="rounded-lg border border-[#3a3a3a] bg-[#1f1f1f] p-3 text-[#f5f5f5]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">#{getOrderNumber(order)}</p>
                  <p className="text-sm text-[#ababab]">{order.customerDetails?.name}</p>
                </div>
                <div className="shrink-0">{renderStatus(order, isOnline)}</div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-[#ababab]">
                <p className="col-span-2">{formatDateAndTime(order.orderDate)}</p>
                <p>{order.items?.length ?? 0} Items</p>
                <p>{renderTableWhere(order, isOnline)}</p>
                <p className="text-[#f5f5f5]">Rs {order.bills?.totalWithTax}</p>
                <p>{renderPayment(order)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop (md and up): the original full table, unchanged. */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date &amp; Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const isOnline = order.orderSource === "Online";
              return (
                <div
                  key={order._id || index}
                  className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 p-4 transition shadow-xs"
                >
                  <td className="p-4">#{getOrderNumber(order)}</td>
                  <td className="p-4">{order.customerDetails?.name}</td>
                  <td className="p-4">{renderStatus(order, isOnline)}</td>
                  <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                  <td className="p-4">{order.items?.length ?? 0} Items</td>
                  <td className="p-4">{renderTableWhere(order, isOnline)}</td>
                  <td className="p-4">Rs {order.bills?.totalWithTax}</td>
                  <td className="p-4">{renderPayment(order)}</td>
                </tr>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3.5">Order ID</th>
                  <th className="py-3 px-3.5">Customer</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Date & Time</th>
                  <th className="py-3 px-3.5">Items</th>
                  <th className="py-3 px-3.5">Origin</th>
                  <th className="py-3 px-3.5">Total Amount</th>
                  <th className="py-3 px-3.5 text-center">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredOrders.map((order, index) => {
                  const isOnline = order.orderSource === "Online";
                  return (
                    <tr
                      key={order._id || index}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        #{getOrderNumber(order)}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {order.customerDetails?.name || "Walk-in Guest"}
                      </td>
                      <td className="py-3 px-3.5">{renderStatus(order, isOnline)}</td>
                      <td className="py-3 px-3.5 text-slate-500">{formatDateAndTime(order.orderDate)}</td>
                      <td className="py-3 px-3.5 font-medium">
                        {order.items?.length ?? 0} {order.items?.length === 1 ? "item" : "items"}
                      </td>
                      <td className="py-3 px-3.5">{renderTableWhere(order, isOnline)}</td>
                      <td className="py-3 px-3.5 font-bold font-mono text-slate-900 dark:text-white">
                        Rs {order.bills?.totalWithTax?.toFixed(2)}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px] text-slate-600 dark:text-slate-300">
                          {order.paymentMethod || "Cash"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentOrders;
