import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import RecentOrders from "../components/home/RecentOrders";
import ShiftDrawer from "../components/modern/ShiftDrawer";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders, getTables, getCurrentShift } from "../https";
import { computeDailyMetrics, formatCurrency } from "../utils/orderMetrics";
import { useUITheme } from "../context/UIThemeContext";
import {
  MdPointOfSale,
  MdTableBar,
  MdOutdoorGrill,
  MdDeliveryDining,
  MdArrowForward,
  MdCheckCircle,
  MdLock,
  MdTrendingUp,
} from "react-icons/md";
import { FiArrowUpRight } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();
  const { isModern, isClean } = useUITheme();
  const [isShiftDrawerOpen, setIsShiftDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = "POS | Cashier Station";
  }, []);

  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
    refetchInterval: 12000,
  });

  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    placeholderData: keepPreviousData,
    refetchInterval: 15000,
  });

  const { data: shiftResponse } = useQuery({
    queryKey: ["currentShift"],
    queryFn: async () => {
      const res = await getCurrentShift();
      return res.data;
    },
    refetchInterval: 15000,
  });

  const orders = resData?.data?.data ?? [];
  const tables = tablesData?.data?.data ?? [];

  const { todayEarnings, inProgressCount } = useMemo(
    () => computeDailyMetrics(orders),
    [orders]
  );

  const availableTables = tables.filter((t) => t.status === "Available").length;
  const bookedTables = tables.filter((t) => t.status === "Booked").length;
  const totalTables = tables.length || 12;

  const totalOnline = orders.filter((o) => o.orderSource === "Online").length;
  const activeOnline = orders.filter(
    (o) => o.orderSource === "Online" && !["Completed", "Cancelled"].includes(o.orderStatus)
  ).length;

  const isShiftOpen = shiftResponse?.isOpen;
  const shiftFinancials = shiftResponse?.data?.liveFinancials;
  const registeredCash = shiftFinancials?.expectedCash ?? todayEarnings ?? 0;

  return (
    <section
      className={`${
        isModern ? "bg-transparent" : "bg-[#1f1f1f]"
      } h-full flex flex-col gap-2.5 overflow-hidden`}
    >
      <div className="flex w-full flex-col gap-2.5 flex-1 min-h-0 overflow-hidden">
        {/* Compact Greeting & Shift Status Bar */}
        <div className="shrink-0">
          <Greetings />
        </div>

        {/* 4 CLICKABLE INTERACTIVE METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          {/* Card 1: Shift Sales -> Opens Shift Drawer */}
          <div
            onClick={() => setIsShiftDrawerOpen(true)}
            role="button"
            tabIndex={0}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] relative overflow-hidden ${
              isClean
                ? "bg-white border-slate-200/90 hover:border-amber-400 shadow-xs"
                : "bg-slate-900 border-slate-800 hover:border-amber-500/60 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                Shift Sales
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 text-[10px] font-bold">
                  Open Till ↗
                </span>
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors flex items-center justify-center shrink-0 shadow-2xs">
                <MdPointOfSale size={20} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  Rs {formatCurrency(todayEarnings)}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {isShiftOpen ? "Till Active · Click for reconciliation" : "Till Closed · Tap to open shift"}
                </p>
              </div>
              <FiArrowUpRight className="text-slate-400 group-hover:text-amber-500 transition-colors shrink-0" size={16} />
            </div>
          </div>

          {/* Card 2: Tables Free -> Navigates to Tables */}
          <div
            onClick={() => navigate("/tables")}
            role="button"
            tabIndex={0}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] relative overflow-hidden ${
              isClean
                ? "bg-white border-slate-200/90 hover:border-emerald-400 shadow-xs"
                : "bg-slate-900 border-slate-800 hover:border-emerald-500/60 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                Tables Free
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 text-[10px] font-bold">
                  Floor Map ↗
                </span>
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-2xs">
                <MdTableBar size={22} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  {availableTables} <span className="text-xs text-slate-400 font-bold">/ {totalTables} free</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {bookedTables} dine-in {bookedTables === 1 ? "table" : "tables"} active
                </p>
              </div>
              <FiArrowUpRight className="text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" size={16} />
            </div>
          </div>

          {/* Card 3: Kitchen Queue -> Navigates to Orders */}
          <div
            onClick={() => navigate("/orders")}
            role="button"
            tabIndex={0}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] relative overflow-hidden ${
              isClean
                ? "bg-white border-slate-200/90 hover:border-amber-400 shadow-xs"
                : "bg-slate-900 border-slate-800 hover:border-amber-500/60 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                Kitchen Queue
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 text-[10px] font-bold">
                  KDS Tickets ↗
                </span>
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors flex items-center justify-center shrink-0 shadow-2xs">
                <MdOutdoorGrill size={20} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
                  {inProgressCount} <span className="text-xs text-slate-400 font-bold">tickets</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Cooking & preparation line
                </p>
              </div>
              <FiArrowUpRight className="text-slate-400 group-hover:text-amber-500 transition-colors shrink-0" size={16} />
            </div>
          </div>

          {/* Card 4: Online Orders -> Navigates to Online Orders */}
          <div
            onClick={() => navigate("/online-orders")}
            role="button"
            tabIndex={0}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] relative overflow-hidden ${
              isClean
                ? "bg-white border-slate-200/90 hover:border-blue-400 shadow-xs"
                : "bg-slate-900 border-slate-800 hover:border-blue-500/60 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                Online Orders
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 text-[10px] font-bold">
                  Delivery Hub ↗
                </span>
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-2xs">
                <MdDeliveryDining size={22} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                  {totalOnline} <span className="text-xs text-slate-400 font-bold">orders</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {activeOnline > 0 ? `${activeOnline} active in dispatch queue` : "All online orders completed"}
                </p>
              </div>
              <FiArrowUpRight className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" size={16} />
            </div>
          </div>
        </div>

        {/* 2-COLUMN FULL-HEIGHT WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0 overflow-hidden items-stretch">
          {/* Main Tickets Column (Fills Full Height) */}
          <div className="lg:col-span-2 h-full min-h-0 flex flex-col overflow-hidden">
            <RecentOrders />
          </div>

          {/* Right Rail: Quick Floor Seating Grid + Live Shift Reconciliation */}
          <div className="flex flex-col gap-3 h-full min-h-0 overflow-hidden justify-between">
            {/* Quick Floor Seating Matrix Card */}
            <div
              className={`p-4 rounded-2xl border transition flex-1 flex flex-col justify-between ${
                isClean
                  ? "bg-white border-slate-200/90 shadow-xs"
                  : "bg-slate-900 border-slate-800 shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <MdTableBar className="text-amber-500" size={16} />
                      Floor Seating Matrix
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Tap table to start or inspect orders</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/tables")}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20"
                  >
                    <span>Full Hall</span>
                    <MdArrowForward size={13} />
                  </button>
                </div>

                {/* 12 Tables Grid */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                  {tables.slice(0, 12).map((t) => {
                    const isBooked = t.status === "Booked";
                    return (
                      <div
                        key={t._id}
                        onClick={() => navigate("/tables")}
                        className={`p-2.5 rounded-2xl border transition-all duration-150 cursor-pointer active:scale-95 flex flex-col items-center justify-center ${
                          isBooked
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/40 shadow-xs"
                            : "bg-emerald-50/70 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-900/40 hover:scale-105 shadow-xs"
                        }`}
                        title={`Table ${t.tableNo} - ${t.status} (${t.seats} seats)`}
                      >
                        <span className="block font-black text-xs">T{t.tableNo}</span>
                        <span className="block text-[10px] font-bold opacity-85 mt-0.5">
                          {isBooked ? "Busy" : `${t.seats}s`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status pill strip */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available ({availableTables})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied ({bookedTables})
                </span>
              </div>
            </div>

            {/* Shift Reconciliation Summary Card */}
            <div
              className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                isClean
                  ? "bg-white border-slate-200/90 shadow-xs"
                  : "bg-slate-900 border-slate-800 shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <MdPointOfSale className="text-amber-500" size={16} />
                    Shift Reconciliation
                  </h3>
                  {isShiftOpen ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Shift
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                      <MdLock size={11} /> Till Closed
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-2 font-medium">
                      <MdTrendingUp className="text-emerald-500" size={16} /> Shift Gross Sales:
                    </span>
                    <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                      Rs {formatCurrency(todayEarnings)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-2 font-medium">
                      <MdOutdoorGrill className="text-amber-500" size={16} /> Active Cooking Tickets:
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {inProgressCount} in progress
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-2 font-medium">
                      <MdDeliveryDining className="text-blue-500" size={16} /> Online Delivery Queue:
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {activeOnline} orders
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Till Action CTA */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Expected Drawer Float
                  </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-base">
                    Rs {formatCurrency(registeredCash)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsShiftDrawerOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                >
                  <MdPointOfSale size={15} />
                  <span>{isShiftOpen ? "Manage Till" : "Open Till"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Drawer Shift Side Drawer */}
      <ShiftDrawer
        isOpen={isShiftDrawerOpen}
        onClose={() => setIsShiftDrawerOpen(false)}
      />

      <BottomNav />
    </section>
  );
};

export default Home;
