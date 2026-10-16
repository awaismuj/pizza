import React from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";

import { useNavigate } from "react-router-dom";

const RecentOrders = () => {
  const navigate = useNavigate();
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

  return (
    <div className="mt-6 px-2 sm:px-4 md:px-8">
      <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl min-h-[420px] p-2 sm:p-4">
        <div className="flex items-center justify-between px-3 py-3 sm:px-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
              Live Order Activity
            </h2>
            <p className="text-xs text-slate-400">Recent Dine-In and Online transactions</p>
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30"
          >
            Open Orders Board →
          </button>
        </div>

        <div className="mx-4 flex items-center gap-3 rounded-[15px] bg-[#1f1f1f] px-4 py-3 sm:mx-6 sm:px-6">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Search recent orders"
            className="w-full bg-[#1f1f1f] text-sm text-[#f5f5f5] outline-none placeholder:text-[#8a8a8a]"
          />
        </div>

        <div className="mt-4 h-[300px] overflow-y-auto px-4 pb-4 sm:px-6 scrollbar-hide">
          {resData?.data.data.length > 0 ? (
            resData.data.data.map((order) => {
              return <OrderList key={order._id} order={order} />;
            })
          ) : (
            <p className="col-span-3 text-gray-500">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
