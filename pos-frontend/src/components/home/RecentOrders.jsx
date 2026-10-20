import React, { useState, useMemo } from "react";
import { FcSearch, FcDocument } from "react-icons/fc";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";
import { useNavigate } from "react-router-dom";
import { useUITheme } from "../../context/UIThemeContext";

const RecentOrders = () => {
  const navigate = useNavigate();
  const { isClean } = useUITheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("all"); // "all" | "Dine In" | "Online" | "Takeaway"

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
  });

  if (isError) {
    enqueueSnackbar("Failed to sync orders data.", { variant: "error" });
  }

  const allOrders = resData?.data?.data || [];

  const filteredOrders = useMemo(() => {
    let list = allOrders;
    if (filterSource !== "all") {
      if (filterSource === "Online") {
        list = list.filter((o) => o.orderSource === "Online");
      } else if (filterSource === "Dine In") {
        list = list.filter((o) => o.orderSource === "Dine In" || (o.table && o.orderSource !== "Online"));
      } else if (filterSource === "Takeaway") {
        list = list.filter((o) => o.orderSource === "Takeaway" || (!o.table && o.orderSource !== "Online"));
      }
    }
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter((order) => {
      const name = (order.customerDetails?.name || "").toLowerCase();
      const phone = (order.customerDetails?.phone || "").toLowerCase();
      const orderNo = String(order.orderNumber || "").toLowerCase();
      return name.includes(term) || phone.includes(term) || orderNo.includes(term);
    });
  }, [allOrders, searchTerm, filterSource]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden">
      <div
        className={`w-full h-full min-h-0 flex flex-col rounded-3xl p-4 sm:p-5 transition-all duration-200 border shadow-xs overflow-hidden ${
          isClean
            ? "bg-white border-slate-200/90 shadow-slate-100"
            : "bg-slate-900 border-slate-800/90 shadow-slate-950/50"
        }`}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800/80 gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-base font-black tracking-tight sm:text-lg ${
                    isClean ? "text-slate-900" : "text-white"
                  }`}
                >
                  Live Order Activity
                </h2>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                  {allOrders.length} orders today
                </span>
              </div>
              <p className={`text-xs ${isClean ? "text-slate-500 font-medium" : "text-slate-400"}`}>
                Real-time Dine-In, Online & Counter Takeaway register stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Source Filter Tabs */}
            <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs font-bold">
              {["all", "Dine In", "Online", "Takeaway"].map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setFilterSource(source)}
                  className={`px-2.5 py-1 rounded-lg transition capitalize text-[11px] cursor-pointer ${
                    filterSource === source
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-black"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className={`text-xs font-bold transition px-3 py-1.5 rounded-xl border flex items-center gap-1 cursor-pointer shrink-0 ${
                isClean
                  ? "text-amber-800 bg-amber-50/90 hover:bg-amber-100 border-amber-200 shadow-2xs"
                  : "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30"
              }`}
            >
              <span>Orders Board</span>
              <FiArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="my-2.5 shrink-0">
          <div
            className={`flex items-center gap-3 rounded-2xl px-4 py-2 transition border focus-within:ring-2 focus-within:ring-amber-500/20 ${
              isClean
                ? "bg-slate-50/90 border-slate-200 text-slate-800 focus-within:bg-white focus-within:border-amber-500"
                : "bg-slate-950/80 border-slate-800 text-slate-100 focus-within:border-amber-500"
            }`}
          >
            <FiSearch size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, phone number, or order #..."
              className={`w-full text-xs font-medium outline-none bg-transparent ${
                isClean
                  ? "text-slate-900 placeholder:text-slate-400"
                  : "text-slate-100 placeholder:text-slate-500"
              }`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Order List (Fills Available Height with internal scroll) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return <OrderList key={order._id} order={order} />;
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-2xl border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
              <span className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-2.5 text-slate-400">
                <FcDocument size={34} />
              </span>
              <p className={`font-bold text-sm ${isClean ? "text-slate-700" : "text-slate-300"}`}>
                {searchTerm ? `No orders matching "${searchTerm}"` : "No orders found in this category"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                New incoming orders will appear here automatically in real time
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
