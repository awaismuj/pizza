import React, { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiLayers, FiCoffee, FiActivity, FiGrid } from "react-icons/fi";
import { getOrders, getCategories, getDishes, getTables } from "../../https";
import { MdCategory, MdLocalPizza, MdPendingActions, MdTableBar } from "react-icons/md";
import { computeMonthlyMetrics, computeOverallMetrics, formatCurrency } from "../../utils/orderMetrics";

// Gradient + glow card shared by both rows of stats.
const StatCard = ({ color, icon, title, value, trend }) => (
  <div
    className="group relative overflow-hidden rounded-2xl p-4 text-white transition-all duration-300 hover:-translate-y-1"
    style={{
      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 55%, ${color}80 100%)`,
      boxShadow: `0 10px 28px -10px ${color}aa, inset 0 1px 0 rgba(255,255,255,0.25)`,
    }}
  >
    <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 transition-transform duration-500 group-hover:scale-125" />
    <span className="pointer-events-none absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-black/15" />
    <div className="relative flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/90">{title}</p>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-xl backdrop-blur">{icon}</span>
    </div>
    <p className="relative mt-2 text-2xl font-extrabold drop-shadow-sm">{value}</p>
    {trend && (
      <div className="relative mt-1 inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[11px] font-semibold">
        <svg className="h-3 w-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none" style={{ color: trend.isIncrease ? "#fff" : "#ffb4b4" }}>
          <path d={trend.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
        <span style={{ color: trend.isIncrease ? "#fff" : "#ffb4b4" }}>{trend.percentage}</span>
      </div>
    )}
  </div>
);

const Metrics = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });
  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
  });
  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    placeholderData: keepPreviousData,
  });

  const orders = ordersData?.data?.data ?? [];
  const categories = categoriesData?.data?.data ?? [];
  const dishes = dishesData?.data?.data ?? [];
  const tables = tablesData?.data?.data ?? [];

  const monthly = useMemo(() => computeMonthlyMetrics(orders), [orders]);
  const overall = useMemo(() => computeOverallMetrics(orders), [orders]);

  const performanceCards = [
    {
      title: "Revenue",
      value: `Rs ${formatCurrency(monthly.revenue.value)}`,
      percentage: `${monthly.revenue.percentage}%`,
      isIncrease: monthly.revenue.percentage >= 0,
      icon: <FiDollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      color: "#059669",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40",
      accentBorder: "border-l-4 border-l-emerald-500",
      helper: "vs previous month benchmark",
    },
    {
      title: "Total Orders",
      value: monthly.totalOrders.value,
      percentage: `${monthly.totalOrders.percentage}%`,
      isIncrease: monthly.totalOrders.percentage >= 0,
      icon: <FiShoppingBag className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      color: "#0284c7",
      badgeBg: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/40",
      accentBorder: "border-l-4 border-l-sky-500",
      helper: "all dine-in & online tickets",
    },
    {
      title: "Total Customers",
      value: monthly.totalCustomers.value,
      percentage: `${monthly.totalCustomers.percentage}%`,
      isIncrease: monthly.totalCustomers.percentage >= 0,
      icon: <FiUsers className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      color: "#d97706",
      badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40",
      accentBorder: "border-l-4 border-l-amber-500",
      helper: "unique guests served",
    },
    {
      title: "Items Sold",
      value: monthly.itemsSold.value,
      percentage: `${monthly.itemsSold.percentage}%`,
      isIncrease: monthly.itemsSold.percentage >= 0,
      icon: <FiBox className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      color: "#4f46e5",
      badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40",
      accentBorder: "border-l-4 border-l-indigo-500",
      helper: "food & beverage units",
    },
  ];

  const itemsData = [
    { title: "Total Categories", icon: <MdCategory />, value: categories.length, color: "#7c5cff" },
    { title: "Total Dishes", icon: <MdLocalPizza />, value: dishes.length, color: "#16a34a" },
    { title: "Active Orders", icon: <MdPendingActions />, value: overall.activeOrders, color: "#f59e0b" },
    { title: "Total Tables", icon: <MdTableBar />, value: tables.length, color: "#d946ef" },
  ];

  return (
    <div className="mx-auto w-full py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Real-time financial metrics, sales volume, and customer order counts
          </p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-xl text-[#f5f5f5] bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10">
          Last 1 Month
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {performanceCards.map((metric) => (
          <StatCard
            key={metric.title}
            color={metric.color}
            icon={metric.icon}
            title={metric.title}
            value={metric.value}
            trend={{ isIncrease: metric.isIncrease, percentage: metric.percentage }}
          />
        ))}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-bold text-[#f5f5f5] text-xl">
            Item Details
          </h2>
          <p className="text-sm text-[#ababab]">
            Current menu and order counts.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {itemsData.map((item) => (
            <StatCard key={item.title} color={item.color} icon={item.icon} title={item.title} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
