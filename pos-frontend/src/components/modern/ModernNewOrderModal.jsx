import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../../https";
import {
  MdTableBar,
  MdShoppingBag,
  MdClose,
  MdPerson,
  MdPhone,
  MdCheck,
  MdLink,
  MdInfoOutline,
} from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useUITheme } from "../../context/UIThemeContext";
import { enqueueSnackbar } from "notistack";

const QUICK_GUEST_PRESETS = [1, 2, 4, 6, 8, 10];

const ModernNewOrderModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isClean } = useUITheme();

  const [orderType, setOrderType] = useState("dineIn"); // "dineIn" | "takeaway"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTables, setSelectedTables] = useState([]); // array of table objects

  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    enabled: isOpen,
  });

  const tables = tablesData?.data?.data || [];
  const availableTables = tables.filter((t) => t.status !== "Booked");

  if (!isOpen) return null;

  // Toggle table selection (supports multi-table combining)
  const handleToggleTable = (table) => {
    setSelectedTables((prev) => {
      const exists = prev.some((t) => t._id === table._id);
      if (exists) {
        return prev.filter((t) => t._id !== table._id);
      } else {
        return [...prev, table];
      }
    });
  };

  const totalSeats = selectedTables.reduce((sum, t) => sum + (Number(t.seats) || 0), 0);
  const sortedTableNos = [...selectedTables]
    .map((t) => Number(t.tableNo))
    .sort((a, b) => a - b);
  const combinedTableNosStr = sortedTableNos.join(" + ");

  const handleStartOrder = () => {
    const trimmedName = (name || "").trim();
    if (!trimmedName || trimmedName.length < 2) {
      enqueueSnackbar("Customer Name is mandatory (minimum 2 characters).", { variant: "warning" });
      return;
    }

    // Phone normalization & validation
    const raw = phone || "";
    let digits = raw.replace(/[^0-9]/g, "");
    if (!digits || digits.length < 10) {
      enqueueSnackbar("Customer Mobile Number is mandatory (minimum 10 digits).", { variant: "warning" });
      return;
    }

    let full = raw.trim();
    if (full.startsWith("+")) {
      full = "+" + digits;
    } else {
      if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
      if (digits.length === 10 && digits.startsWith("3")) {
        full = "+92" + digits;
      } else if (digits.length === 10) {
        full = "+92" + digits;
      } else if (digits.length === 11 && digits.startsWith("92")) {
        full = "+" + digits;
        digits = digits.replace(/^92/, "");
      } else {
        full = digits;
      }
    }

    const local = (
      full.startsWith("+92") ? full.replace(/[^0-9]/g, "").replace(/^92/, "") : digits
    ).replace(/^0+/, "");

    const customerPayload = {
      name: trimmedName,
      phone: full,
      phoneLocal: local,
      guests: guestCount,
    };

    if (orderType === "takeaway") {
      dispatch(setCustomer(customerPayload));
      onClose();
      navigate("/outdoor");
      return;
    }

    // Dine-in order
    if (selectedTables.length > 0) {
      const primaryTable = selectedTables[0];
      const tableData = {
        tableId: primaryTable._id,
        tableNo: combinedTableNosStr,
        tableIds: selectedTables.map((t) => t._id),
        tables: selectedTables,
        combinedTableNos: selectedTables.length > 1 ? combinedTableNosStr : "",
        isCombined: selectedTables.length > 1,
        totalSeats: totalSeats,
        seats: totalSeats,
      };

      dispatch(
        setCustomer({
          ...customerPayload,
          table: tableData,
        })
      );
      onClose();
      navigate("/menu");
    } else {
      // If no table picked here, take customer to floor plan to select/combine
      dispatch(setCustomer(customerPayload));
      onClose();
      navigate("/tables");
    }
  };

  const modalJSX = (
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`pointer-events-auto w-screen max-w-xl shadow-2xl flex flex-col h-full border-l transition-colors ${
            isClean
              ? "bg-white border-slate-200 text-slate-900"
              : "bg-[#0B1120] border-slate-800 text-slate-100"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              isClean ? "bg-slate-50/90 border-slate-200" : "bg-slate-900/90 border-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-black">
                <BiSolidDish size={22} />
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-black leading-tight ${isClean ? "text-slate-900" : "text-white"}`}>
                  Create New Order
                </h3>
                <p className={`text-xs ${isClean ? "text-slate-500 font-medium" : "text-slate-400"}`}>
                  Front-of-House Dining & Takeaway Billing
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition ${
                isClean
                  ? "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
            {/* Order Type Toggle: Dine In vs Takeaway */}
            <div>
              <div
                className={`grid grid-cols-2 p-1 rounded-xl border ${
                  isClean ? "bg-slate-100/90 border-slate-200" : "bg-slate-900/90 border-slate-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOrderType("dineIn")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition duration-150 ${
                    orderType === "dineIn"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-black"
                      : isClean
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MdTableBar size={17} />
                  <span>Dine-In (Table)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("takeaway")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition duration-150 ${
                    orderType === "takeaway"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-black"
                      : isClean
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MdShoppingBag size={17} />
                  <span>Takeaway / Outdoor</span>
                </button>
              </div>
            </div>

            {/* Customer Inputs (Mandatory) */}
            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isClean ? "text-slate-600" : "text-slate-300"}`}>
                  Customer Name <span className="text-red-500 font-black">*</span>
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter customer name (e.g. Ahmad Khan)"
                    required
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-semibold transition outline-none ${
                      isClean
                        ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        : "bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                  />
                </div>
              </div>

              {/* Customer Phone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isClean ? "text-slate-600" : "text-slate-300"}`}>
                    Mobile Number <span className="text-red-500 font-black">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    Format: 03001234567 or +923001234567
                  </span>
                </div>
                <div className="relative">
                  <MdPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-11 digit mobile number"
                    required
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-semibold transition outline-none ${
                      isClean
                        ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        : "bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    }`}
                  />
                </div>
              </div>
            </div>

            {orderType === "dineIn" && (
              <>
                {/* Guest Count with Quick Pickers */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`block text-xs font-bold uppercase tracking-wider ${isClean ? "text-slate-600" : "text-slate-300"}`}>
                      Guest Count
                    </label>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Party Size
                    </span>
                  </div>

                  {/* Stepper + Quick Presets */}
                  <div className="space-y-2">
                    <div
                      className={`flex items-center justify-between p-2 rounded-xl border ${
                        isClean ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-slate-900/90 border-slate-800 text-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                        className={`w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition border ${
                          isClean
                            ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-xs"
                            : "bg-slate-800 hover:bg-slate-700 text-white border-transparent"
                        }`}
                      >
                        -
                      </button>
                      <div className="text-center">
                        <span className={`text-base font-black ${isClean ? "text-slate-900" : "text-white"}`}>
                          {guestCount} {guestCount === 1 ? "Person" : "Persons"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuestCount((g) => Math.min(30, g + 1))}
                        className={`w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition border ${
                          isClean
                            ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-xs"
                            : "bg-slate-800 hover:bg-slate-700 text-white border-transparent"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    {/* Quick chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">Quick:</span>
                      {QUICK_GUEST_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setGuestCount(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                            guestCount === preset
                              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs"
                              : isClean
                              ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {preset} {preset === 1 ? "Guest" : "Guests"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table Station Picker & Combine Tables Feature */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider ${isClean ? "text-slate-600" : "text-slate-300"}`}>
                        Assign Table Stations
                      </label>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Select one or tap multiple tables to <span className="font-bold text-amber-500">combine</span> for larger parties
                      </p>
                    </div>

                    {selectedTables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTables([])}
                        className="text-[11px] font-bold text-rose-500 hover:underline"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  {/* Multi-Table Combined Status Card */}
                  {selectedTables.length > 0 && (
                    <div
                      className={`mb-3 p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        totalSeats >= guestCount
                          ? isClean
                            ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                            : "bg-emerald-950/30 border-emerald-800/60 text-emerald-300"
                          : isClean
                          ? "bg-amber-50/80 border-amber-200 text-amber-900"
                          : "bg-amber-950/30 border-amber-800/60 text-amber-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedTables.length > 1 && (
                          <div className="p-1 rounded-md bg-amber-500 text-slate-950">
                            <MdLink size={16} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-black">
                            {selectedTables.length > 1 ? (
                              <span>Combined Station: Table {combinedTableNosStr}</span>
                            ) : (
                              <span>Station: Table {combinedTableNosStr}</span>
                            )}
                          </p>
                          <p className="text-[11px] font-medium opacity-90">
                            Total Capacity: <strong>{totalSeats} Seats</strong> · Party: <strong>{guestCount} Guests</strong>
                          </p>
                        </div>
                      </div>

                      {totalSeats < guestCount ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0">
                          +{guestCount - totalSeats} more seats needed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                          Fits Party
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tables Grid */}
                  <div className="grid grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1 scrollbar-thin">
                    {availableTables.map((table) => {
                      const isSelected = selectedTables.some((t) => t._id === table._id);
                      return (
                        <button
                          key={table._id}
                          type="button"
                          onClick={() => handleToggleTable(table)}
                          className={`relative p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[66px] ${
                            isSelected
                              ? "bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50"
                              : isClean
                              ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs hover:border-slate-300"
                              : "bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-200"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-[10px] font-black shadow-xs">
                              <MdCheck size={11} />
                            </span>
                          )}

                          <span className="text-xs font-extrabold leading-tight">
                            Table {table.tableNo}
                          </span>

                          <span
                            className={`text-[10px] font-semibold mt-0.5 px-1.5 py-0.2 rounded-md ${
                              isSelected
                                ? "bg-slate-950/20 text-slate-950"
                                : isClean
                                ? "bg-slate-100 text-slate-600"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {table.seats} seats
                          </span>
                        </button>
                      );
                    })}

                    {availableTables.length === 0 && (
                      <p className={`col-span-full text-xs py-4 text-center font-medium ${isClean ? "text-slate-500" : "text-slate-400"}`}>
                        No tables currently available.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className={`flex items-center justify-between gap-3 px-6 py-4 border-t ${
              isClean ? "bg-slate-50/90 border-slate-200" : "bg-slate-900/90 border-slate-800"
            }`}
          >
            {/* Live Summary */}
            <div className="text-left hidden sm:block">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Order Summary
              </p>
              <p className={`text-xs font-black truncate max-w-[220px] ${isClean ? "text-slate-800" : "text-slate-200"}`}>
                {orderType === "takeaway"
                  ? "Takeaway / Outdoor"
                  : selectedTables.length > 0
                  ? `Table ${combinedTableNosStr} (${totalSeats}s · ${guestCount}g)`
                  : `Floor Plan (${guestCount} Guests)`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition border ${
                  isClean
                    ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    : "border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleStartOrder}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/25 flex items-center gap-2 active:scale-[0.98]"
              >
                <span>Proceed to Menu</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
};

export default ModernNewOrderModal;
