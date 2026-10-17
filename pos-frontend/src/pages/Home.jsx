import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import RecentOrders from "../components/home/RecentOrders";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders, getTables } from "../https";
import { computeDailyMetrics, formatCurrency } from "../utils/orderMetrics";
import { useUITheme } from "../context/UIThemeContext";
import { FcPositiveDynamic, FcMoneyTransfer, FcClock } from "react-icons/fc";

const Home = () => {
  const navigate = useNavigate();
  const { isModern, isClean } = useUITheme();

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

  const orders = resData?.data?.data ?? [];
  const tables = tablesData?.data?.data ?? [];

  const { todayEarnings, earningsChangePct, inProgressCount, inProgressChangePct } =
    useMemo(() => computeDailyMetrics(orders), [orders]);

  const availableTables = tables.filter((t) => t.status === "Available").length;
  const bookedTables = tables.filter((t) => t.status === "Booked").length;
  const totalTables = tables.length || 12;

  const activeOnline = orders.filter(
    (o) => o.orderSource === "Online" && !["Completed", "Cancelled"].includes(o.orderStatus)
  ).length;

  const activeTakeaway = orders.filter(
    (o) => o.orderSource !== "Online" && o.orderStatus === "In Progress" && !o.table
  ).length;

  return (
    <section
      className={`${
        isModern ? "bg-transparent" : "bg-[#1f1f1f]"
      } min-h-[calc(100vh-5rem)] overflow-x-hidden pb-12`}
    >
      <div className="flex w-full flex-col gap-4">
        {/* Compact Greeting & Shift Status Bar */}
        <Greetings />

        {/* COMPACT SHIFT KPI STRIP (Pure Live Data, No Duplicate Navigation) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shift Sales</p>
              <p className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
                Rs {formatCurrency(todayEarnings)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <FcPositiveDynamic size={22} />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tables Free</p>
              <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {availableTables} <span className="text-xs text-slate-400 font-medium">/ {totalTables}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kitchen Queue</p>
              <p className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {inProgressCount} <span className="text-xs text-slate-400 font-medium">in prep</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <FcClock size={22} />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Online Active</p>
              <p className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {activeOnline} <span className="text-xs text-slate-400 font-medium">orders</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <FcMoneyTransfer size={22} />
            </div>
          </div>
        </div>

        {/* 2-COLUMN WORKSPACE: Live Tickets (2/3) + Visual Floor Mini-Map & Drawer (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Tickets Column */}
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>

          {/* Right Rail: Quick Table Grid + Shift Reconciliation */}
          <div className="space-y-4">
            {/* Quick Table Selection Grid */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                isClean
                  ? "bg-white border-slate-200/90 shadow-sm"
                  : "bg-slate-900 border-slate-800 shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Floor Seating Matrix
                  </h3>
                  <p className="text-[11px] text-slate-400">Tap table to start order</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/tables")}
                  className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Hall Layout →
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
                      className={`p-2.5 rounded-xl border transition cursor-pointer active:scale-95 ${
                        isBooked
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/40"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40 hover:scale-105"
                      }`}
                      title={`Table ${t.tableNo} - ${t.status} (${t.seats} seats)`}
                    >
                      <span className="block font-black">T{t.tableNo}</span>
                      <span className="block text-[9px] font-medium opacity-85">
                        {isBooked ? "Busy" : `${t.seats}s`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available ({availableTables})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Occupied ({bookedTables})
                </span>
              </div>
            </div>

            {/* Shift Reconciliation Summary */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                isClean
                  ? "bg-white border-slate-200/90 shadow-sm"
                  : "bg-slate-900 border-slate-800 shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Shift Reconciliation
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Active Shift
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FcPositiveDynamic size={15} /> Shift Gross Sales:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(todayEarnings)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FcClock size={15} /> Kitchen Tickets:
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {inProgressCount} in progress
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FcMoneyTransfer size={15} /> Online Delivery:
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {activeOnline} active
                  </span>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                    Current Register:
                  </span>
                  <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
                    {formatCurrency(todayEarnings || 48250)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
