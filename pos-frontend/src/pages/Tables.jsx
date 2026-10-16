import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getTables } from "../https";

const Tables = () => {
  const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "POS | Tables"
    }, [])

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
    <section className="min-h-[calc(100vh-5rem)] overflow-hidden flex flex-col pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
              Floor Plan & Table Stations
            </h1>
            <p className="text-xs text-slate-400">Select a table to assign order or tap gear to configure</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => setStatus("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              status === "all"
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>All Stations</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-200">
              {tables.length}
            </span>
          </button>

          <button
            onClick={() => setStatus("available")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              status === "available"
                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Available</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-400 font-bold">
              {availableCount}
            </span>
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              status === "booked"
                ? "bg-rose-500 text-white shadow-md font-extrabold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Occupied</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-rose-400 font-bold">
              {bookedCount}
            </span>
          </button>
        </div>
      </div>

      {/* pb-40 clears both the fixed BottomNav and the WhatsApp button
          that floats above it (global, on every page) - pb-28 was only
          sized for the nav bar, so the last row of cards ended up hidden
          behind WhatsApp with no way to scroll past it. */}
      <div className="grid grid-cols-1 gap-3 px-4 py-4 pb-40 flex-1 overflow-y-scroll scrollbar-hide sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10 xl:grid-cols-5 xl:px-16">
        {visibleTables.length === 0 && (
          <p className="col-span-full text-gray-500">No tables yet — add one from the Dashboard.</p>
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
