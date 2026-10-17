import React, { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiLayers, FiCoffee, FiActivity, FiGrid } from "react-icons/fi";
import { getOrders, getCategories, getDishes, getTables } from "../../https";
import { computeMonthlyMetrics, computeOverallMetrics, formatCurrency } from "../../utils/orderMetrics";

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
      title: "Gross Revenue",
      value: `Rs ${formatCurrency(monthly.revenue.value)}`,
      percentage: `${monthly.revenue.percentage}%`,
      isIncrease: monthly.revenue.percentage >= 0,
      icon: <FiDollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40",
      accentBorder: "border-l-4 border-l-emerald-500",
      helper: "vs previous month benchmark",
    },
    {
      title: "Completed Orders",
      value: monthly.totalOrders.value,
      percentage: `${monthly.totalOrders.percentage}%`,
      isIncrease: monthly.totalOrders.percentage >= 0,
      icon: <FiShoppingBag className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
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
      badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40",
      accentBorder: "border-l-4 border-l-amber-500",
      helper: "unique guests served",
    },
    {
      title: "Total Items Sold",
      value: monthly.itemsSold.value,
      percentage: `${monthly.itemsSold.percentage}%`,
      isIncrease: monthly.itemsSold.percentage >= 0,
      icon: <FiBox className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40",
      accentBorder: "border-l-4 border-l-indigo-500",
      helper: "food & beverage units",
    },
  ];

  const inventorySummaryCards = [
    {
      title: "Active Menu Dishes",
      value: dishes.length,
      icon: <FiCoffee className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
      subtext: "available on counter",
      actionText: "Manage Menu",
      actionTab: "Menu",
    },
    {
      title: "Live Kitchen Orders",
      value: overall.activeOrders,
      icon: <FiActivity className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      subtext: "currently cooking / dispatch",
      actionText: "View Orders",
      actionTab: "Orders",
    },
    {
      title: "Menu Categories",
      value: categories.length,
      icon: <FiLayers className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
      subtext: "catalog classification",
      actionText: "View Categories",
      actionTab: "Menu",
    },
    {
      title: "Dine-in Floor Tables",
      value: tables.length,
      icon: <FiGrid className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
      subtext: "table stations mapped",
      actionText: "Floor Layout",
      actionTab: "table",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Performance Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Overall Sales & Revenue Performance</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Real-time financial metrics, sales volume, and customer order counts
          </p>
        </div>

        {/* Quick Range Filter Actions */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          {["today", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                timeRange === range
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {range === "today" ? "Today" : range === "7d" ? "Last 7 Days" : "Last 30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Clean High-Contrast Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {performanceCards.map((metric, index) => (
          <div
            key={index}
            className={`pos-metric-card ${metric.accentBorder} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {metric.title}
                </span>
                <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  {metric.icon}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {metric.value}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${metric.badgeBg}`}>
                {metric.isIncrease ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                {metric.percentage}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate ml-2">
                {metric.helper}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Operations & Inventory Summary Section */}
      <div className="pt-1">
        <div className="mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Operational Inventory & Floor Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Key operational counts across live stations and products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {inventorySummaryCards.map((item, index) => (
            <div
              key={index}
              className="pos-card p-4 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.title}
                  </span>
                  <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {item.icon}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
                  {item.subtext}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer">
                  {item.actionText} →
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;

