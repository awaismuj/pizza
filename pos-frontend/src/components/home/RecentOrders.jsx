import React, { useState, useMemo } from "react";
import { FcSearch, FcDocument } from "react-icons/fc";
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

  const allOrders = resData?.data?.data || [];

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return allOrders;
    const term = searchTerm.toLowerCase();
    return allOrders.filter((order) => {
      const name = (order.customerDetails?.name || "").toLowerCase();
      const phone = (order.customerDetails?.phone || "").toLowerCase();
      const orderNo = String(order.orderNumber || "").toLowerCase();
      return name.includes(term) || phone.includes(term) || orderNo.includes(term);
    });
  }, [allOrders, searchTerm]);

  return (
    <div className="mt-3 px-0 w-full">
      <div
        className={`w-full rounded-2xl min-h-[420px] p-2 sm:p-5 transition duration-200 ${
          isClean
            ? "bg-white border border-slate-200/90 shadow-sm"
            : "bg-slate-900/90 border border-slate-800 shadow-xl"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-3 sm:px-4">
          <div>
            <h2
              className={`text-base font-extrabold tracking-tight sm:text-lg ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              Live Order Activity
            </h2>
            <p className={`text-xs ${isClean ? "text-slate-500 font-medium" : "text-slate-400"}`}>
              Recent Dine-In and Online transactions
            </p>
          </div>
          <button
            onClick={() => navigate("/orders")}
            className={`text-xs font-bold transition px-3 py-1.5 rounded-xl border ${
              isClean
                ? "text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200"
                : "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30"
            }`}
          >
            Open Orders Board →
          </button>
        </div>

        <div
          className={`mx-3 sm:mx-4 flex items-center gap-3 rounded-xl px-4 py-3 transition focus-within:ring-2 focus-within:ring-amber-500/30 ${
            isClean
              ? "bg-slate-50 border border-slate-200/90 text-slate-800 focus-within:bg-white focus-within:border-amber-500"
              : "bg-slate-900 border border-slate-800 text-slate-100 focus-within:border-amber-500"
          }`}
        >
          <FcSearch size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recent orders by customer, phone, or #"
            className={`w-full text-sm outline-none bg-transparent ${
              isClean ? "text-slate-900 placeholder:text-slate-400" : "text-slate-100 placeholder:text-slate-500"
            }`}
          />
        </div>

        <div className="mt-4 h-[320px] overflow-y-auto px-3 pb-4 sm:px-4 scrollbar-hide">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return <OrderList key={order._id} order={order} />;
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-2">
                <FcDocument size={36} />
              </span>
              <p className={isClean ? "text-slate-500 font-medium text-sm" : "text-slate-400 text-sm"}>
                {searchTerm ? `No orders matching "${searchTerm}"` : "No orders available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
