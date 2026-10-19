import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  IoCloseOutline,
  IoCheckmarkCircle,
  IoWarningOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import {
  FcInTransit,
  FcPlanner,
  FcShipped,
  FcMultipleInputs,
} from "react-icons/fc";
import {
  LuBoxes,
  LuReceipt,
  LuUtensils,
  LuLayoutGrid,
  LuArrowRight,
  LuRefreshCw,
} from "react-icons/lu";
import { getOrders, getLowStockItems, getTables } from "../../https";
import { LOW_STOCK_QUERY_KEY } from "../shared/LowStockAlert";

const AlertsDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const { data: ordersData, refetch: refetchOrders, isFetching: isFetchingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: isOpen,
    refetchInterval: 12000,
  });

  const { data: lowStockData, refetch: refetchStock, isFetching: isFetchingStock } = useQuery({
    queryKey: LOW_STOCK_QUERY_KEY,
    queryFn: getLowStockItems,
    enabled: isOpen,
    refetchInterval: 15000,
  });

  const { data: tablesData, refetch: refetchTables } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const orders = ordersData?.data?.data || [];
  const lowStockItems = lowStockData?.data?.data || [];
  const tables = tablesData?.data?.data || [];

  const activeOnline = orders.filter(
    (o) => o.orderSource === "Online" && (o.orderStatus === "Pending" || o.orderStatus === "Accepted")
  );
  const inProgressDineIn = orders.filter(
    (o) => o.orderSource !== "Online" && o.orderStatus === "In Progress"
  );
  const bookedTables = tables.filter((t) => t.status === "Booked");
  const totalTables = tables.length;

  const totalAlertCount = activeOnline.length + inProgressDineIn.length + lowStockItems.length;

  const handleRefreshAll = () => {
    refetchOrders();
    refetchStock();
    refetchTables();
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-[99999] overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        <div
          className="pointer-events-auto w-screen max-w-lg bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    totalAlertCount > 0 ? "bg-amber-400" : "bg-emerald-400"
                  } opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    totalAlertCount > 0 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Live Operational Monitors & Alerts
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time status of orders, kitchen queue, dining floor & stock
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRefreshAll}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Refresh live status"
              >
                <LuRefreshCw size={15} className={isFetchingOrders || isFetchingStock ? "animate-spin text-amber-500" : ""} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Close drawer"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-6 py-2.5 bg-slate-50/80 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filter === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Monitors ({totalAlertCount})
            </button>
            <button
              onClick={() => setFilter("online")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filter === "online"
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Online ({activeOnline.length})
            </button>
            <button
              onClick={() => setFilter("kitchen")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filter === "kitchen"
                  ? "bg-sky-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Kitchen ({inProgressDineIn.length})
            </button>
            <button
              onClick={() => setFilter("stock")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filter === "stock"
                  ? "bg-rose-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Stock ({lowStockItems.length})
            </button>
          </div>

          {/* Alert Cards Body */}
          <div className="p-6 space-y-3.5 flex-1 overflow-y-auto">
            {/* 1. Online Delivery Orders */}
            {(filter === "all" || filter === "online") && (
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-4 transition hover:shadow-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FcInTransit size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Online Delivery Dispatch
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        activeOnline.length > 0
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {activeOnline.length > 0 ? `${activeOnline.length} Active Orders` : "All Fulfilled"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {activeOnline.length > 0
                      ? `${activeOnline.length} customer online orders are awaiting kitchen preparation or delivery rider assignment.`
                      : "Online orders pipeline is clear. All incoming storefront orders are caught up."}
                  </p>

                  {/* List preview if any active orders */}
                  {activeOnline.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      {activeOnline.slice(0, 3).map((o) => (
                        <div key={o._id} className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                          <span className="font-semibold truncate">#{o._id.slice(-6).toUpperCase()} · {o.customerName || "Customer"}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Rs {o.totalAmount}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/online-orders");
                    }}
                    className="mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open Online Orders Dispatch <LuArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Kitchen Display Queue (KDS) */}
            {(filter === "all" || filter === "kitchen") && (
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-4 transition hover:shadow-xs">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                  <FcShipped size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Kitchen Display Queue (KDS)
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        inProgressDineIn.length > 0
                          ? "bg-sky-500/15 text-sky-700 dark:text-sky-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {inProgressDineIn.length > 0 ? `${inProgressDineIn.length} In Prep` : "Queue Clear"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {inProgressDineIn.length > 0
                      ? `${inProgressDineIn.length} dine-in tickets are currently actively baking or being plated at kitchen stations.`
                      : "Kitchen preparation queue is clear. No pending tickets waiting on chef line."}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/orders");
                    }}
                    className="mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open Kitchen Display <LuArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* 3. Raw Materials & Stock Inventory */}
            {(filter === "all" || filter === "stock") && (
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-4 transition hover:shadow-xs">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                  <FcMultipleInputs size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Raw Ingredients & Stock
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        lowStockItems.length > 0
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock` : "All Healthy"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {lowStockItems.length > 0
                      ? `${lowStockItems.length} inventory raw materials have fallen below the configured reorder warning threshold.`
                      : "All inventory raw materials, ingredients, and packaging supplies are at safe operational levels."}
                  </p>

                  {/* Low stock list details */}
                  {lowStockItems.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      {lowStockItems.slice(0, 4).map((item) => (
                        <div key={item._id} className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 bg-rose-50/60 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200/60 dark:border-rose-900/40">
                          <span className="font-semibold truncate">{item.name}</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0">
                            {item.quantity} {item.unit} (Min: {item.reorderLevel})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/dashboard?tab=Inventory");
                    }}
                    className="mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open Inventory Stock Ledger <LuArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* 4. Dining Floor Tables Occupancy */}
            {filter === "all" && (
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-4 transition hover:shadow-xs">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <FcPlanner size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Dining Floor Tables Occupancy
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0">
                      {bookedTables.length} / {totalTables} Seated
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {bookedTables.length > 0
                      ? `${bookedTables.length} restaurant tables currently have active guests seated with open bills.`
                      : "All dining floor tables are currently vacant and ready for seating walk-in guests."}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/tables");
                    }}
                    className="mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open Floor Plan Manager <LuArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Live updates every 15 seconds
            </span>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
            >
              Close Alerts Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

export default AlertsDrawer;
