import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import Modal from "../components/dashboard/Modal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getTables } from "../https";
import { useUITheme } from "../context/UIThemeContext";
import { FaPlus, FaSearch } from "react-icons/fa";
import { MdTableRestaurant, MdChair } from "react-icons/md";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  const { isClean } = useUITheme();
  const role = useSelector((state) => state.user.role);
  const normalizedRole = String(role || "").toLowerCase();
  const isManager = normalizedRole === "admin" || normalizedRole === "manager" || normalizedRole === "system admin";

  useEffect(() => {
    document.title = "POS | Floor Plan & Tables";
  }, []);

  const { data: resData, isError, refetch } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Failed to fetch dining tables.", { variant: "error" });
    }
  }, [isError]);

  const tables = resData?.data?.data ?? [];

  const handleOpenAddTable = () => {
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditTable = (table) => {
    setModalInitialData(table);
    setIsModalOpen(true);
  };

  const bookedCount = useMemo(() => tables.filter((t) => t.status === "Booked").length, [tables]);
  const availableCount = useMemo(() => tables.filter((t) => t.status !== "Booked").length, [tables]);
  const totalSeats = useMemo(() => tables.reduce((acc, t) => acc + (Number(t.seats) || 0), 0), [tables]);

  const filteredTables = useMemo(() => {
    let result = tables;

    if (status === "booked") {
      result = result.filter((t) => t.status === "Booked");
    } else if (status === "available") {
      result = result.filter((t) => t.status !== "Booked");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => {
        const tableMatch = String(t.tableNo || "").includes(q);
        const guestMatch = String(t?.currentOrder?.customerDetails?.name || "").toLowerCase().includes(q);
        return tableMatch || guestMatch;
      });
    }

    // Sort by table number ascending for clean layout
    return [...result].sort((a, b) => (Number(a.tableNo) || 0) - (Number(b.tableNo) || 0));
  }, [tables, status, searchQuery]);

  return (
    <section className="min-h-[calc(100vh-5rem)] overflow-hidden flex flex-col pb-6">
      {/* Top Header Card */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl mb-4 transition duration-200 ${
          isClean
            ? "bg-white border border-slate-200/90 shadow-xs"
            : "bg-slate-900/90 border border-slate-800 shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-lg sm:text-xl font-bold tracking-tight leading-none ${
                  isClean ? "text-slate-900" : "text-white"
                }`}
              >
                Floor Plan & Table Stations
              </h1>
              {isManager && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  Manager Mode
                </span>
              )}
            </div>
            <p className={`text-xs mt-1 font-medium ${isClean ? "text-slate-500" : "text-slate-400"}`}>
              {tables.length > 0
                ? `${tables.length} dining stations configured · ${totalSeats} total seating capacity`
                : "Configure your restaurant floor layout and table capacities"}
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table # or guest..."
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-8 pr-3 py-2 text-xs font-medium outline-none focus:border-amber-500 w-44 sm:w-52 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl ${
              isClean ? "bg-slate-100 border border-slate-200/90" : "bg-slate-950/80 border border-slate-800"
            }`}
          >
            <button
              onClick={() => setStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                status === "all"
                  ? "bg-amber-500 text-slate-950 shadow-xs font-bold"
                  : isClean
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>All</span>
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                status === "available"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                status === "booked"
                  ? "bg-rose-600 text-white shadow-xs font-bold"
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

          {/* Add Table Button (Manager CRUD) */}
          <button
            type="button"
            onClick={handleOpenAddTable}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition flex items-center gap-1.5 shrink-0"
          >
            <FaPlus size={11} />
            <span>Add Table Station</span>
          </button>
        </div>
      </div>

      {/* Main Floor Grid / Stations List */}
      <div className="grid grid-cols-2 gap-3 pb-32 flex-1 overflow-y-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {/* Empty state: No tables created yet in database */}
        {tables.length === 0 && (
          <div className="col-span-full py-16 px-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
              <MdTableRestaurant size={36} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              No Dining Table Stations Configured
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1.5 mb-6 font-medium leading-relaxed">
              Create your dining room floor layout with table station numbers and guest seat capacities. Once created, cashiers and floor staff can assign walk-in guests and track live dining occupancy.
            </p>
            <button
              type="button"
              onClick={handleOpenAddTable}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center gap-2"
            >
              <FaPlus size={12} />
              <span>Create Your First Table Station</span>
            </button>
          </div>
        )}

        {/* Empty state: Search or filter produced no results */}
        {tables.length > 0 && filteredTables.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              No dining stations match the filter &ldquo;{status !== "all" ? status : searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("all");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Reset filters & view all tables
            </button>
          </div>
        )}

        {/* Table Cards with full CRUD triggers */}
        {filteredTables.map((table) => {
          return (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails?.name}
              seats={table.seats}
              table={table}
              onEdit={handleOpenEditTable}
            />
          );
        })}
      </div>

      {/* Metronic Side Drawer for Create / Edit Table */}
      {isModalOpen && (
        <Modal
          action="table"
          setIsModalOpen={setIsModalOpen}
          initialData={modalInitialData}
        />
      )}

      <BottomNav />
    </section>
  );
};

export default Tables;
