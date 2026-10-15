import React from "react";
import { GrUpdate } from "react-icons/gr";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime, getOrderNumber } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  const handleStatusChange = ({orderId, orderStatus}) => {
    orderStatusUpdateMutation.mutate({orderId, orderStatus});
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({orderId, orderStatus}) => updateOrderStatus({orderId, orderStatus}),
    onSuccess: (data) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]); // Refresh order list
      // A status change (e.g. Cancelled) can change whether this order
      // counts as revenue now, so Profit needs to know too.
      queryClient.invalidateQueries(["dailyProfit"]);
      queryClient.invalidateQueries(["monthlyProfit"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  })

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const orders = resData?.data?.data ?? [];

  // Shared between the mobile card and the desktop table so the two views
  // can never drift out of sync with each other.
  const renderTableWhere = (order, isOnline) =>
    isOnline
      ? "🌐 Online"
      : order.table?.tableNo
      ? `Table - ${order.table.tableNo}`
      : "🥡 Takeaway";

  const renderStatus = (order, isOnline) =>
    isOnline ? (
      // Online orders go through a longer status flow
      // (Pending → Accepted → Preparing → ...) managed from
      // the dedicated Online Orders page, so this column is
      // read-only here to avoid conflicting updates.
      <span
        className={`inline-block rounded-lg border p-2 text-sm ${
          order.orderStatus === "Cancelled"
            ? "border-red-500 text-red-500"
            : order.orderStatus === "Completed"
            ? "border-green-500 text-green-500"
            : "border-yellow-500 text-yellow-500"
        }`}
      >
        {order.orderStatus}
      </span>
    ) : (
      <select
        className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${
          order.orderStatus === "Ready"
            ? "text-green-500"
           : order.orderStatus === "Closed" || order.orderStatus === "Cancelled"
           ? "text-red-500"
           : "text-yellow-500"
       }`}
       value={order.orderStatus}
       onChange={(e) => handleStatusChange({orderId: order._id, orderStatus: e.target.value})}
      >
       <option className="text-yellow-500" value="In Progress">
         In Progress
       </option>
       <option className="text-green-500" value="Ready">
         Ready
       </option>
       <option className="text-red-500" value="Closed">
         Closed
       </option>
       <option className="text-red-500" value="Cancelled">
         Cancelled
       </option>
      </select>
    );

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
        Recent Orders
      </h2>

      {orders.length === 0 && (
        <p className="p-4 text-[#ababab]">No orders yet.</p>
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
                <p>{order.paymentMethod}</p>
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
              <th className="p-3">Date & Time</th>
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
                <tr
                  key={order._id || index}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">#{getOrderNumber(order)}</td>
                  <td className="p-4">{order.customerDetails?.name}</td>
                  <td className="p-4">{renderStatus(order, isOnline)}</td>
                  <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                  <td className="p-4">{order.items?.length ?? 0} Items</td>
                  <td className="p-4">{renderTableWhere(order, isOnline)}</td>
                  <td className="p-4">Rs {order.bills?.totalWithTax}</td>
                  <td className="p-4">
                    {order.paymentMethod}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
