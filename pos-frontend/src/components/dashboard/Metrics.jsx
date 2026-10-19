import React, { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMoreHorizontal,
  FiChevronDown,
  FiCheckCircle,
  FiClock,
  FiShoppingBag,
  FiBox,
} from "react-icons/fi";
import { getOrders, getCategories, getDishes, getInventoryItems } from "../../https";
import { computeMonthlyMetrics, formatCurrency } from "../../utils/orderMetrics";
import FoodIcon from "../../utils/foodIcons";

const Metrics = () => {
  const [orderTimeRange, setOrderTimeRange] = useState("1M");
  const [salesTimeRange, setSalesTimeRange] = useState("30d");

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

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
    placeholderData: keepPreviousData,
  });

  const orders = ordersData?.data?.data ?? [];
  const categories = categoriesData?.data?.data ?? [];
  const dishes = dishesData?.data?.data ?? [];
  const inventoryItems = inventoryData?.data?.data ?? [];

  const monthly = useMemo(() => computeMonthlyMetrics(orders), [orders]);

  // Total inventory asset valuation
  const totalAssetValue = useMemo(() => {
    if (!inventoryItems.length) return 329700;
    return inventoryItems.reduce((acc, item) => {
      const price = Number(item.sellingPrice || item.costPrice || 0);
      const qty = Number(item.quantity || 0);
      return acc + price * qty;
    }, 0);
  }, [inventoryItems]);

  // Inventory status breakdown
  const inventoryStats = useMemo(() => {
    if (!inventoryItems.length) {
      return { available: 65, low: 25, outOfStock: 10 };
    }
    const total = inventoryItems.length;
    const out = inventoryItems.filter((i) => i.quantity <= 0).length;
    const low = inventoryItems.filter((i) => i.quantity > 0 && i.quantity <= (i.reorderLevel || 5)).length;
    const avail = total - out - low;
    return {
      available: Math.max(10, Math.round((avail / total) * 100)),
      low: Math.max(5, Math.round((low / total) * 100)),
      outOfStock: Math.max(5, Math.round((out / total) * 100)),
    };
  }, [inventoryItems]);

  // Low stock alert items
  const lowStockRows = useMemo(() => {
    const alerts = inventoryItems.filter((i) => i.quantity <= (i.reorderLevel || 5));
    if (alerts.length > 0) return alerts.slice(0, 3);
    return [
      { _id: "1", name: "Mozzarella Cheese Blend", quantity: 4, unit: "kg" },
      { _id: "2", name: "Chicken Zinger Patty Prep", quantity: 7, unit: "pcs" },
      { _id: "3", name: "Tomato Pizza Sauce Base", quantity: 1, unit: "can" },
    ];
  }, [inventoryItems]);

  // Best selling products
  const bestSellers = useMemo(() => {
    if (dishes.length > 0) {
      return dishes.slice(0, 4).map((d, idx) => ({
        id: d._id || String(idx),
        name: d.name,
        sku: `SKU: GZ-${String(d._id || idx).slice(-4).toUpperCase()}`,
        icon: d.icon || "pizza",
        price: d.price || 450,
      }));
    }
    return [
      { id: "1", name: "GenZ Special Zinger Burger", sku: "SKU: GZ-ZNG-01", icon: "burger", price: 350 },
      { id: "2", name: "Large Chicken Tikka Pizza", sku: "SKU: GZ-PZ-02", icon: "pizza", price: 950 },
      { id: "3", name: "Crispy Shawarma Wrap Roll", sku: "SKU: GZ-SHW-03", icon: "sandwich", price: 260 },
      { id: "4", name: "Loaded Fries & Cheese Sauce", sku: "SKU: GZ-FRS-04", icon: "fastfood", price: 320 },
    ];
  }, [dishes]);

  return (
    <div className="space-y-5">
      {/* ============================================================== */}
      {/* ROW 1: Metronic 3-Card Grid (Orders | Inventory | Best Sellers) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CARD 1: Orders (5 cols) */}
        <div className="lg:col-span-5 pos-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Orders
              </h3>
              <Link
                to="/dashboard?tab=Orders"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-semibold transition"
              >
                See All
              </Link>
            </div>

            {/* Time Range Pills */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg inline-flex items-center gap-0.5 mb-4">
              {["1H", "1D", "14D", "1M", "3M", "1Y", "All"].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setOrderTimeRange(range)}
                  className={`px-2.5 py-1 text-[11px] font-semibold transition rounded-md ${
                    orderTimeRange === range
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Big Revenue Number + Badge */}
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                Rs {formatCurrency(monthly.revenue.value || 9395.72)}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-500/20">
                +4.7%
              </span>
            </div>
          </div>

          {/* Smooth SVG Wave Line Chart */}
          <div className="mt-6 pt-2">
            <svg viewBox="0 0 400 110" className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="orderChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill Area under Curve */}
              <path
                d="M 10 90 Q 60 25, 110 70 T 210 50 T 290 80 T 350 40 T 390 65 L 390 105 L 10 105 Z"
                fill="url(#orderChartGradient)"
              />
              {/* Main Stroke Line */}
              <path
                d="M 10 90 Q 60 25, 110 70 T 210 50 T 290 80 T 350 40 T 390 65"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Sep 8</span>
              <span>Sep 13</span>
              <span>Sep 18</span>
              <span>Sep 23</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Inventory (4 cols) */}
        <div className="lg:col-span-4 pos-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Inventory
              </h3>
              <Link
                to="/dashboard?tab=Inventory"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-semibold transition"
              >
                See All
              </Link>
            </div>

            {/* Total Asset Value */}
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Total Asset Value
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight mt-0.5">
                Rs {formatCurrency(totalAssetValue)}
              </p>
            </div>

            {/* Multi-Colored Segmented Bar */}
            <div className="w-full flex h-2 rounded-full overflow-hidden my-3 bg-slate-100 dark:bg-slate-800">
              <div
                style={{ width: `${inventoryStats.available}%` }}
                className="bg-emerald-500 h-full"
                title={`Available: ${inventoryStats.available}%`}
              />
              <div
                style={{ width: `${inventoryStats.low}%` }}
                className="bg-amber-500 h-full"
                title={`Low stock: ${inventoryStats.low}%`}
              />
              <div
                style={{ width: `${inventoryStats.outOfStock}%` }}
                className="bg-rose-500 h-full"
                title={`Out of stock: ${inventoryStats.outOfStock}%`}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Low stock
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Out of stock
              </span>
            </div>
          </div>

          {/* Low Stock Sub-Table */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Low stock
              </span>
              <Link
                to="/dashboard?tab=Inventory"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-semibold"
              >
                See All
              </Link>
            </div>

            <div className="space-y-2">
              {lowStockRows.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold">
                      Qty: {item.quantity}
                    </span>
                    <Link
                      to="/dashboard?tab=Inventory"
                      className="border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded text-[11px] font-bold transition hover:bg-white dark:hover:bg-slate-700 shadow-2xs"
                    >
                      Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3: Best Sellers (3 cols) */}
        <div className="lg:col-span-3 pos-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Best Sellers
              </h3>
              <Link
                to="/dashboard?tab=Menu"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-semibold transition"
              >
                See All
              </Link>
            </div>

            {/* Product List */}
            <div className="space-y-3.5 mt-2">
              {bestSellers.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-700/60">
                    <FoodIcon icon={item.icon} size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.sku}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Link
              to="/dashboard?tab=Menu"
              className="w-full block text-center py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition border border-slate-200/80 dark:border-slate-700"
            >
              Browse Full Catalog
            </Link>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* ROW 2: Metronic 2-Card Grid (Staff Performance | Sales Activity) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CARD 4: Staff Performance (5 cols) */}
        <div className="lg:col-span-5 pos-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Staff Performance
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Options"
              >
                <FiMoreHorizontal size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Today's Shift Performance & Roster
            </p>

            {/* 3 Metric Stats Columns */}
            <div className="grid grid-cols-3 gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                  {orders.length || 27}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Deals Closed
                </p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                  ↗ +12%
                </span>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                  Rs {formatCurrency(monthly.revenue.value || 182400)}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Revenue
                </p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
                  ↗ +6%
                </span>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                  72%
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Conversion
                </p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-500 mt-1">
                  ↘ -3%
                </span>
              </div>
            </div>

            {/* Pipeline Progress */}
            <div className="space-y-1.5 mb-5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200">
                  Pipeline Progress
                </span>
                <span className="font-mono text-slate-900 dark:text-white">
                  76%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[76%]" />
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Recent Activity
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <FiCheckCircle className="text-emerald-500 shrink-0" size={14} />
                <span className="truncate">Closed deal with counter guest (Rs 1,450)</span>
              </span>
              <span className="text-[11px] text-slate-400 shrink-0 ml-2">Today</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <FiCheckCircle className="text-emerald-500 shrink-0" size={14} />
                <span className="truncate">3 new online delivery orders dispatched</span>
              </span>
              <span className="text-[11px] text-slate-400 shrink-0 ml-2">Yesterday</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <FiClock className="text-amber-500 shrink-0" size={14} />
                <span className="truncate">Night cash audit scheduled</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white shrink-0 ml-2">
                2 days ago
              </span>
            </div>
          </div>
        </div>

        {/* CARD 5: Sales Activity (7 cols) */}
        <div className="lg:col-span-7 pos-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Sales Activity
              </h3>
              <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <span>Last 30 days</span>
                <FiChevronDown size={14} />
              </div>
            </div>

            {/* Sales & Views Banner */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-amber-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Sales</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  Rs 37,600
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  ↗ 8%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-purple-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Store Views</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  30,700
                </span>
                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded">
                  ↘ 5%
                </span>
              </div>
            </div>
          </div>

          {/* Dual Line Comparison Chart */}
          <div className="mt-4 pt-2">
            <svg viewBox="0 0 500 130" className="w-full h-36 overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="20" y1="10" x2="480" y2="10" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="20" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

              {/* Orange Line (Sales) */}
              <path
                d="M 20 75 Q 80 65, 150 78 T 280 75 T 380 40 T 480 65"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Purple Dashed Line (Views) */}
              <path
                d="M 20 100 Q 90 90, 160 80 T 270 95 T 360 40 T 480 85"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Week 5</span>
              <span>Week 6</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Metrics;
