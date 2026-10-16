import { useState, useEffect } from "react";
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
    <section className="min-h-[calc(100vh-5rem)] overflow-x-hidden pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
              Kitchen & Dine-In Orders
            </h1>
            <p className="text-xs text-slate-400">Live order pipeline & kitchen display station</p>
          </div>
          <div className="ml-2">
            <DeletedOrdersPanel isAdmin={String(role || "").toLowerCase() === "admin"} />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto scrollbar-hide">
          {[
            { key: "all", label: "All Orders", count: dineInOrders.length },
            { key: "progress", label: "In Kitchen", count: dineInOrders.filter((o) => o.orderStatus === "In Progress").length },
            { key: "ready", label: "Ready to Serve", count: dineInOrders.filter((o) => o.orderStatus === "Ready").length },
            { key: "completed", label: "Closed / Paid", count: dineInOrders.filter((o) => o.orderStatus === "Closed").length },
            { key: "cancelled", label: "Cancelled", count: dineInOrders.filter((o) => o.orderStatus === "Cancelled").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                status === tab.key
                  ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    status === tab.key ? "bg-slate-950/20 text-slate-950" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-3 overflow-y-auto px-4 py-4 scrollbar-hide min-[480px]:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
