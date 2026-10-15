import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import DeletedOrdersPanel from "../components/orders/DeletedOrdersPanel";
import { useSelector } from "react-redux";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack"

const Orders = () => {

  const [status, setStatus] = useState("all");
  const role = useSelector((state) => state.user.role);

    useEffect(() => {
      document.title = "POS | Orders"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
    refetchInterval: 10000, // keep the board live without a manual refresh
  })

  if(isError) {
    enqueueSnackbar("Something went wrong!", {variant: "error"})
  }

  // This page is the dine-in board (table number, In Progress/Ready/Closed).
  // Online (genzpizza.online) orders have their own dedicated view with the
  // Accept/Preparing/Delivery flow — see the "Online Orders" tab.
  const dineInOrders = (resData?.data.data ?? []).filter((order) => order.orderSource !== "Online");

  const filteredOrders =
    status === "all"
      ? dineInOrders
      : status === "progress"
      ? dineInOrders.filter((order) => order.orderStatus === "In Progress")
      : status === "ready"
      ? dineInOrders.filter((order) => order.orderStatus === "Ready")
      : status === "completed"
      ? dineInOrders.filter((order) => order.orderStatus === "Closed")
      : status === "cancelled"
      ? dineInOrders.filter((order) => order.orderStatus === "Cancelled")
      : dineInOrders;

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] overflow-x-hidden pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-10">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">
            Orders
          </h1>
          <DeletedOrdersPanel isAdmin={String(role || "").toLowerCase() === "admin"} />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {[
            { key: "all", label: "All", count: dineInOrders.length },
            { key: "progress", label: "Processing", count: dineInOrders.filter((o) => o.orderStatus === "In Progress").length },
            { key: "ready", label: "Ready", count: dineInOrders.filter((o) => o.orderStatus === "Ready").length },
            { key: "completed", label: "Completed", count: dineInOrders.filter((o) => o.orderStatus === "Closed").length },
            { key: "cancelled", label: "Cancelled", count: dineInOrders.filter((o) => o.orderStatus === "Cancelled").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={`text-[#ababab] text-sm sm:text-lg rounded-lg px-3 sm:px-5 py-2 font-semibold ${
                status === tab.key ? "bg-[#383838] text-[#f5f5f5]" : ""
              }`}
            >
              {tab.label}
              {tab.count > 0 && <span className="ml-1 text-xs opacity-80">({tab.count})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 overflow-y-auto scrollbar-hide">
        {
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return <OrderCard key={order._id} order={order} />
            })
          ) : <p className="col-span-full text-gray-500">No orders available</p>
        }
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
