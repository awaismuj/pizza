import React, { useState, useMemo } from "react";
import { GrUpdate } from "react-icons/gr";
import { FaSearch, FaHistory } from "react-icons/fa";
import { MdLanguage, MdTakeoutDining, MdTableBar } from "react-icons/md";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime, getOrderNumber } from "../../utils";
import { useUITheme } from "../../context/UIThemeContext";
import { statusPillClass, STAGE_LABELS } from "../../utils/orderStages";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();
  const [searchTerm, setSearchTerm] = useState("");

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["dailyProfit"]);
      queryClient.invalidateQueries(["monthlyProfit"]);
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

  const orders = resData?.data?.data ?? [];

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
      <span className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold text-xs">
        <MdLanguage size={14} /> Online
      </span>
    ) : order.table?.tableNo ? (
      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
        <MdTableBar size={14} /> Table {order.table.tableNo}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold text-xs">
        <MdTakeoutDining size={14} /> Takeaway
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
    <div className="pos-card p-5 sm:p-6 w-full">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Orders Ledger & Audit Log</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full transactional records of all dine-in, takeaway, and online deliveries
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-700 w-full sm:w-72 shadow-xs">
          <FaSearch className="text-slate-400 text-xs shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer, status…"
            className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-xs">Loading orders ledger…</div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <FaHistory size={28} className="mx-auto mb-2 opacity-40 text-amber-500" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            {searchTerm ? `No orders match "${searchTerm}"` : "No orders recorded yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card List */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredOrders.map((order, index) => {
              const isOnline = order.orderSource === "Online";
              return (
                <div
                  key={order._id || index}
                  className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 p-4 transition shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        #{getOrderNumber(order)}
                      </p>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {order.customerDetails?.name || "Walk-in Guest"}
                      </p>
                    </div>
                    <div className="shrink-0">{renderStatus(order, isOnline)}</div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <p className="col-span-2">{formatDateAndTime(order.orderDate)}</p>
                    <p>{order.items?.length ?? 0} Items</p>
                    <p>{renderTableWhere(order, isOnline)}</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Rs {order.bills?.totalWithTax?.toFixed(2)}
                    </p>
                    <p>{order.paymentMethod || "Cash"}</p>
                  </div>
                </div>
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
