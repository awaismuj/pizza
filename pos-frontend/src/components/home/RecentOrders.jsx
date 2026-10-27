import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdReceiptLong } from "react-icons/md";
import OrderList from "./OrderList";
import { getOrderNumber } from "../../utils/index";
import { isSameDay } from "../../utils/orderMetrics";
import { TERMINAL_STATUSES } from "../../utils/orderStages";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Open" },
  { key: "done", label: "Completed" },
  { key: "online", label: "Online" },
];

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
    <section className="rounded-2xl border border-[#2b2b2b] bg-[#1a1a1a]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <div>
          <h2 className="text-base font-semibold text-[#f5f5f5] sm:text-lg">{showingToday ? "Today's orders" : "Recent orders"}</h2>
          <p className="text-xs text-[#7a7a7a]">{visible.length} shown</p>
        </div>
        <Link to="/orders" className="text-sm font-semibold text-[#f6b100] hover:underline">View all →</Link>
      </div>

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
