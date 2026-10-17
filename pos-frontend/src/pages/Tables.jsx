import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getTables } from "../https";
import { useUITheme } from "../context/UIThemeContext";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const { isClean } = useUITheme();

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  const tables = resData?.data?.data ?? [];

  const visibleTables =
    status === "booked"
      ? tables.filter((table) => table.status === "Booked")
      : status === "available"
      ? tables.filter((table) => table.status !== "Booked")
      : tables;

  const bookedCount = tables.filter((t) => t.status === "Booked").length;
  const availableCount = tables.filter((t) => t.status !== "Booked").length;

  return (
    <section className="min-h-[calc(100vh-5rem)] overflow-hidden flex flex-col pb-6">
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl mb-3 transition duration-200 ${
          isClean
            ? "bg-white border border-slate-200/90 shadow-xs"
            : "bg-slate-900/90 border border-slate-800 shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1
              className={`text-lg sm:text-xl font-black tracking-tight leading-none ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              Floor Plan & Table Stations
            </h1>
            <p className={`text-[11px] mt-0.5 ${isClean ? "text-slate-400" : "text-slate-500"}`}>
              Select a table to assign order or tap gear to configure
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-2xl ${
            isClean ? "bg-slate-100 border border-slate-200/90" : "bg-slate-950/80 border border-slate-800"
          }`}
        >
          <button
            onClick={() => setStatus("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              status === "all"
                ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                : isClean
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>All Stations</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isClean ? "bg-white text-slate-800 shadow-xs" : "bg-slate-800 text-slate-200"
              }`}
            >
              {tables.length}
            </span>
          </button>

          <button
            onClick={() => setStatus("available")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              status === "available"
                ? "bg-emerald-600 text-white shadow-sm font-black"
                : isClean
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Available</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isClean ? "bg-white text-emerald-800 shadow-xs" : "bg-slate-800 text-emerald-400"
              }`}
            >
              {availableCount}
            </span>
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              status === "booked"
                ? "bg-rose-600 text-white shadow-sm font-black"
                : isClean
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Occupied</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isClean ? "bg-white text-rose-800 shadow-xs" : "bg-slate-800 text-rose-400"
              }`}
            >
              {bookedCount}
            </span>
          </button>
        </div>
      </div>

      {/* pb-40 clears both the fixed BottomNav and the WhatsApp button
          that floats above it (global, on every page) - pb-28 was only
          sized for the nav bar, so the last row of cards ended up hidden
          behind WhatsApp with no way to scroll past it. */}
      <div className="grid grid-cols-2 gap-2.5 pb-32 flex-1 overflow-y-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visibleTables.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No stations found for this filter.</p>
          </div>
        )}
        {visibleTables.map((table) => {
          return (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails?.name}
              seats={table.seats}
            />
          );
        })}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
