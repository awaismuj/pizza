import React from "react";
import {
  LuBoxes,
  LuTrendingUp,
  LuDollarSign,
  LuShieldCheck,
  LuChartPie,
  LuLayers,
} from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";

const InventoryAnalytics = ({ inventoryItems = [], onOpenAddDrawer, onFilterCategory }) => {
  const totalItems = inventoryItems.length;

  const inStockItems = inventoryItems.filter(
    (i) => !i.stockStatus || i.stockStatus === "in_stock"
  );
  const lowStockItems = inventoryItems.filter((i) => i.stockStatus === "low_stock");
  const outOfStockItems = inventoryItems.filter((i) => i.stockStatus === "out_of_stock");

  const inStockPercent = totalItems > 0 ? Math.round((inStockItems.length / totalItems) * 100) : 100;
  const lowStockPercent = totalItems > 0 ? Math.round((lowStockItems.length / totalItems) * 100) : 0;
  const outOfStockPercent = totalItems > 0 ? Math.round((outOfStockItems.length / totalItems) * 100) : 0;

  // Valuation computations
  const totalCostValuation = inventoryItems.reduce(
    (acc, it) => acc + (it.quantity || 0) * (it.costPrice || 0),
    0
  );

  const totalRetailValuation = inventoryItems.reduce(
    (acc, it) => acc + (it.quantity || 0) * (it.sellingPrice || it.costPrice * 1.5 || 0),
    0
  );

  const estimatedProfit = Math.max(0, totalRetailValuation - totalCostValuation);
  const grossMarginPercent =
    totalRetailValuation > 0
      ? Math.round((estimatedProfit / totalRetailValuation) * 100)
      : 35;

  // Category breakdown
  const categoryMap = {};
  inventoryItems.forEach((it) => {
    const cat = it.category?.name || it.category || "Uncategorized";
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, costValue: 0 };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].costValue += (it.quantity || 0) * (it.costPrice || 0);
  });

  const categories = Object.entries(categoryMap).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="space-y-4">
      {/* 1. Analytical Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Stock Asset Value */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Inventory Valuation (Cost)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <LuDollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Rs {totalCostValuation.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-500 font-bold">●</span>
            <span>Total raw asset investment</span>
          </div>
        </div>

        {/* Potential Retail Value & Margin */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Est. Retail Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <LuTrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Rs {totalRetailValuation.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
              ~{grossMarginPercent}% Margin
            </span>
            <span className="text-slate-400 dark:text-slate-500">potential yield</span>
          </div>
        </div>

        {/* Operational Stock Health */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Stock Health Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <LuShieldCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {inStockPercent}%
            </p>
            <span className="text-xs text-slate-500 font-semibold">
              ({inStockItems.length}/{totalItems} items)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden flex">
            <div style={{ width: `${inStockPercent}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${lowStockPercent}%` }} className="bg-amber-500 h-full" />
            <div style={{ width: `${outOfStockPercent}%` }} className="bg-rose-500 h-full" />
          </div>
        </div>

        {/* Reorder Attention Counter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Reorder Attention
            </span>
            <div className={`w-8 h-8 rounded-xl ${lowStockItems.length > 0 ? "bg-rose-500/10 text-rose-500" : "bg-slate-100 text-slate-400"} flex items-center justify-center`}>
              <IoWarningOutline size={16} />
            </div>
          </div>
          <p className={`text-2xl font-black tracking-tight ${lowStockItems.length > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}`}>
            {lowStockItems.length} SKU{lowStockItems.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{outOfStockItems.length} out of stock</span>
            <span>·</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">{lowStockItems.length} below minimum</span>
          </div>
        </div>
      </div>

      {/* 2. Visual Stock Status Bar & Category Allocation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <LuChartPie size={17} className="text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Ingredient Categories & Stock Allocation
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              In Stock ({inStockItems.length})
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Low Stock ({lowStockItems.length})
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Out ({outOfStockItems.length})
            </span>
          </div>
        </div>

        {/* Modern Interactive Category Allocation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          {categories.map(([catName, data]) => {
            const catIcons = {
              "sauces & condiments": "🥣",
              "breads & dough": "🍞",
              "vegetables & produce": "🥗",
              "beverages": "🥤",
              "meats & proteins": "🥩",
              "dairy & cheese": "🧀",
              "packaging & supplies": "📦",
            };
            const icon = catIcons[catName.toLowerCase()] || "📦";
            const percentOfTotal = totalCostValuation > 0 ? Math.round((data.costValue / totalCostValuation) * 100) : 0;
            return (
              <button
                key={catName}
                type="button"
                onClick={() => onFilterCategory && onFilterCategory(catName)}
                className="flex flex-col justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 border border-slate-200/90 dark:border-slate-700/80 hover:border-amber-500/60 transition group text-left shadow-2xs hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{icon}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      {data.count} SKUs
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {catName}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-black text-slate-900 dark:text-white">
                      Rs {data.costValue.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {percentOfTotal}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(8, percentOfTotal))}%` }}
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
