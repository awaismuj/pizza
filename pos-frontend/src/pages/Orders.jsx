import { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import DeletedOrdersPanel from "../components/orders/DeletedOrdersPanel";
import { useSelector } from "react-redux";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";
import { useUITheme } from "../context/UIThemeContext";

const Orders = () => {
  const [status, setStatus] = useState("all");
  const { isClean } = useUITheme();
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
<<<<<<< HEAD
    refetchInterval: 10000,
  });
=======
    refetchInterval: 5000, // keep the board live without a manual refresh
    refetchOnWindowFocus: "always",
  })
>>>>>>> origin/main

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

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
              Kitchen & Dine-In Orders
            </h1>
            <p className={`text-[11px] mt-0.5 ${isClean ? "text-slate-400" : "text-slate-500"}`}>
              Live order pipeline & kitchen display station
            </p>
          </div>
          <div className="ml-2">
            <DeletedOrdersPanel isAdmin={String(role || "").toLowerCase() === "admin"} />
          </div>
        </div>

        {/* Filter Pills */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-2xl overflow-x-auto scrollbar-hide ${
            isClean ? "bg-slate-100 border border-slate-200/90" : "bg-slate-950/80 border border-slate-800"
          }`}
        >
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
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : isClean
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    status === tab.key
                      ? "bg-slate-950/20 text-slate-950 font-black"
                      : isClean
                      ? "bg-white text-slate-800 shadow-xs"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid w-full grid-cols-1 gap-3.5 overflow-y-auto pb-24 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            return <OrderCard key={order._id} order={order} />;
          })
        ) : (
          <div className="col-span-full py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No kitchen orders available for this filter.</p>
          </div>
        )}
=======
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-3 overflow-y-auto px-4 py-4 scrollbar-hide sm:px-6">
        {
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return <OrderCard key={order._id} order={order} />
            })
          ) : <p className="col-span-full text-gray-500">No orders available</p>
        }
>>>>>>> origin/main
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
