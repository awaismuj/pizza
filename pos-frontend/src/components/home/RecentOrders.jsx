<<<<<<< HEAD
import React, { useState, useMemo } from "react";
=======
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
>>>>>>> origin/main
import { FaSearch } from "react-icons/fa";
import { MdReceiptLong } from "react-icons/md";
import OrderList from "./OrderList";
<<<<<<< HEAD
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
=======
import { getOrderNumber } from "../../utils/index";
import { isSameDay } from "../../utils/orderMetrics";
import { TERMINAL_STATUSES } from "../../utils/orderStages";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Open" },
  { key: "done", label: "Completed" },
  { key: "online", label: "Online" },
];
>>>>>>> origin/main

const dateOf = (order) => new Date(order.orderDate || order.createdAt);

const RecentOrders = ({ orders = [], isLoading = false }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const todaysFirst = useMemo(() => {
    const sorted = [...orders].sort((a, b) => dateOf(b) - dateOf(a));
    const now = new Date();
    const today = sorted.filter((o) => isSameDay(dateOf(o), now));
    return today.length ? today : sorted.slice(0, 30);
  }, [orders]);
  const showingToday = todaysFirst.length > 0 && todaysFirst.every((o) => isSameDay(dateOf(o), new Date()));

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return todaysFirst.filter((order) => {
      if (filter === "live" && TERMINAL_STATUSES.includes(order.orderStatus)) return false;
      if (filter === "done" && !["Closed", "Completed"].includes(order.orderStatus)) return false;
      if (filter === "online" && order.orderSource !== "Online") return false;
      if (!needle) return true;
      return [
        order.customerDetails?.name,
        order.customerDetails?.phone,
        getOrderNumber(order),
        order.table?.tableNo,
      ].some((field) => String(field ?? "").toLowerCase().includes(needle));
    });
  }, [todaysFirst, query, filter]);

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
<<<<<<< HEAD
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
=======
    <section className="rounded-2xl border border-[#2b2b2b] bg-[#1a1a1a]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <div>
          <h2 className="text-base font-semibold text-[#f5f5f5] sm:text-lg">{showingToday ? "Today's orders" : "Recent orders"}</h2>
          <p className="text-xs text-[#7a7a7a]">{visible.length} shown</p>
>>>>>>> origin/main
        </div>
        <Link to="/orders" className="text-sm font-semibold text-[#f6b100] hover:underline">View all →</Link>
      </div>

<<<<<<< HEAD
        <div
          className={`mx-3 sm:mx-4 flex items-center gap-3 rounded-xl px-4 py-3 transition focus-within:ring-2 focus-within:ring-amber-500/30 ${
            isClean
              ? "bg-slate-50 border border-slate-200/90 text-slate-800 focus-within:bg-white focus-within:border-amber-500"
              : "bg-slate-900 border border-slate-800 text-slate-100 focus-within:border-amber-500"
          }`}
        >
          <FaSearch className={isClean ? "text-slate-400" : "text-slate-400"} />
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
              <span className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-2">
                <MdReceiptLong size={32} />
              </span>
              <p className={isClean ? "text-slate-500 font-medium text-sm" : "text-slate-400 text-sm"}>
                {searchTerm ? `No orders matching "${searchTerm}"` : "No orders available"}
              </p>
            </div>
          )}
=======
      <div className="flex flex-col gap-3 px-4 pt-4 sm:px-5 md:flex-row md:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-xl bg-[#1f1f1f] px-4 py-2.5 ring-1 ring-[#2b2b2b] focus-within:ring-[#f6b100]/60">
          <FaSearch className="shrink-0 text-[#7a7a7a]" />
          <span className="sr-only">Search orders</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, order # or table"
            className="w-full bg-transparent text-sm text-[#f5f5f5] outline-none placeholder:text-[#6f6f6f]"
          />
        </label>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Order filter">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={filter === item.key}
              onClick={() => setFilter(item.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === item.key ? "bg-[#f6b100] text-[#1a1a1a]" : "bg-[#262626] text-[#bdbdbd] hover:bg-[#303030]"
              }`}
            >
              {item.label}
            </button>
          ))}
>>>>>>> origin/main
        </div>
      </div>

      <div className="mt-4 max-h-[460px] overflow-y-auto px-4 pb-4 scrollbar-hide sm:px-5 sm:pb-5">
        {isLoading && orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#7a7a7a]">Loading orders…</p>
        ) : visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#7a7a7a]">{orders.length ? "No orders match this search." : "No orders yet today."}</p>
        ) : (
          <ul className="space-y-2">
            {visible.map((order) => <OrderList key={order._id} order={order} />)}
          </ul>
        )}
      </div>
    </section>
  );
};

export default RecentOrders;
