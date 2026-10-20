import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentShift, openShift, closeShift, getShiftHistory } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useUITheme } from "../../context/UIThemeContext";
import {
  MdPointOfSale,
  MdCheckCircle,
  MdWarning,
  MdHistory,
  MdPrint,
  MdLockOpen,
  MdLock,
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown,
  MdReceiptLong,
} from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { printReceipt } from "../../utils/printReceipt";

const QUICK_FLOAT_AMOUNTS = [2000, 3000, 5000, 10000];

const ShiftDrawer = ({ isOpen, onClose }) => {
  const { isClean } = useUITheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("current"); // "current" | "history"

  // Open Shift Form State
  const [startingFloat, setStartingFloat] = useState("5000");
  const [openNotes, setOpenNotes] = useState("");

  // Close Shift Form State
  const [actualCashCounted, setActualCashCounted] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [zReportData, setZReportData] = useState(null);

  const { data: shiftResponse, isLoading, refetch } = useQuery({
    queryKey: ["currentShift"],
    queryFn: async () => {
      const res = await getCurrentShift();
      return res.data;
    },
    enabled: Boolean(isOpen),
    refetchInterval: isOpen ? 10000 : false,
  });

  const { data: historyResponse } = useQuery({
    queryKey: ["shiftHistory"],
    queryFn: async () => {
      const res = await getShiftHistory();
      return res.data;
    },
    enabled: Boolean(isOpen) && activeTab === "history",
  });

  const openShiftMutation = useMutation({
    mutationFn: openShift,
    onSuccess: () => {
      enqueueSnackbar("Cash drawer shift opened successfully!", { variant: "success" });
      queryClient.invalidateQueries(["currentShift"]);
      refetch();
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || "Failed to open shift.", {
        variant: "error",
      });
    },
  });

  const closeShiftMutation = useMutation({
    mutationFn: closeShift,
    onSuccess: (res) => {
      enqueueSnackbar("Shift successfully closed & reconciled!", { variant: "success" });
      setZReportData(res.data?.data?.summary);
      queryClient.invalidateQueries(["currentShift"]);
      queryClient.invalidateQueries(["shiftHistory"]);
      refetch();
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || "Failed to close shift.", {
        variant: "error",
      });
    },
  });

  if (!isOpen) return null;

  const isOpenShift = shiftResponse?.isOpen;
  const shift = shiftResponse?.data?.shift;
  const financials = shiftResponse?.data?.liveFinancials;

  const expectedCash = financials?.expectedCash ?? 0;
  const countedNum = Number(actualCashCounted) || 0;
  const discrepancy = actualCashCounted !== "" ? countedNum - expectedCash : 0;

  // Strict numeric input handler (prevents scientific 'e', '+', '-', etc.)
  const handleFloatChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setStartingFloat(val);
    }
  };

  const handleCashCountedChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setActualCashCounted(val);
    }
  };

  const handleOpenShift = (e) => {
    e.preventDefault();
    const floatNum = Number(startingFloat);
    if (isNaN(floatNum) || floatNum < 0) {
      enqueueSnackbar("Please enter a valid starting float amount.", { variant: "warning" });
      return;
    }
    openShiftMutation.mutate({
      startingCashFloat: floatNum,
      notes: openNotes,
    });
  };

  const handleCloseShift = (e) => {
    e.preventDefault();
    if (actualCashCounted === "") {
      enqueueSnackbar("Please enter the actual counted cash in drawer.", { variant: "warning" });
      return;
    }
    closeShiftMutation.mutate({
      actualCashCounted: countedNum,
      closingNotes: closeNotes,
    });
  };

  const handlePrintZReport = (summaryData = zReportData || financials) => {
    const html = `
      <div style="font-family: monospace; padding: 12px; max-width: 300px; margin: 0 auto; text-align: left; font-size: 12px;">
        <h3 style="text-align: center; margin-bottom: 2px;">GENZ PIZZA LAND</h3>
        <h4 style="text-align: center; margin-top: 0; text-transform: uppercase;">End of Shift Z-Report</h4>
        <hr style="border-top: 1px dashed #444;" />
        <p><strong>Cashier:</strong> ${shift?.cashierName || "Staff"}</p>
        <p><strong>Started:</strong> ${new Date(shift?.startTime).toLocaleString()}</p>
        <p><strong>Ended:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border-top: 1px dashed #444;" />
        <p>Starting Float: Rs ${Number(shift?.startingCashFloat || 0).toFixed(2)}</p>
        <p>+ Cash Sales (${summaryData?.orderCount || 0} orders): Rs ${Number(summaryData?.cashSales || 0).toFixed(2)}</p>
        <p>- Cash Expenses (${summaryData?.expenseCount || 0} items): Rs ${Number(summaryData?.cashExpenses || 0).toFixed(2)}</p>
        <p><strong>= Expected Cash: Rs ${Number(summaryData?.expectedCash || expectedCash).toFixed(2)}</strong></p>
        <p><strong>= Actual Counted: Rs ${Number(actualCashCounted || 0).toFixed(2)}</strong></p>
        <p><strong>Discrepancy: Rs ${discrepancy.toFixed(2)} (${discrepancy === 0 ? "Exact" : discrepancy > 0 ? "Overage" : "Shortage"})</strong></p>
        <hr style="border-top: 1px dashed #444;" />
        <p>Card / Online Sales: Rs ${Number(summaryData?.cardSales || 0).toFixed(2)}</p>
        <p>Total Shift Gross Revenue: Rs ${Number(summaryData?.totalSales || 0).toFixed(2)}</p>
        <hr style="border-top: 1px dashed #444;" />
        <p style="text-align: center; font-size: 10px; margin-top: 15px;">Cashier Signature: __________________</p>
      </div>
    `;
    printReceipt(html, "Shift Z-Report");
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-[99999] flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Slide-In Side Drawer */}
      <div
        className={`relative w-full max-w-lg h-full shadow-2xl flex flex-col z-10 border-l animate-slideInRight transition-colors ${
          isClean
            ? "bg-white text-slate-800 border-slate-200"
            : "bg-slate-900 text-slate-100 border-slate-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          className={`p-5 sm:p-6 border-b shrink-0 ${
            isClean ? "bg-slate-50/90 border-slate-200/80" : "bg-slate-950/90 border-slate-800"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <MdPointOfSale size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Till & Shift Register
                  </h2>
                  {isOpenShift ? (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Shift Active
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-500 dark:text-slate-400 font-bold border border-slate-500/25 flex items-center gap-1">
                      <MdLock size={11} /> Till Closed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Opening float verification, live cash balance & Z-Report reconciliation
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-9 h-9 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition cursor-pointer shrink-0"
              title="Close Drawer"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          {/* Segmented Tab Control */}
          <div className="mt-4 flex p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => setActiveTab("current")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "current"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <MdPointOfSale size={14} className={activeTab === "current" ? "text-amber-500" : ""} />
              <span>Register Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <MdHistory size={14} className={activeTab === "history" ? "text-amber-500" : ""} />
              <span>Shift History & Z-Reports</span>
            </button>
          </div>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="py-24 text-center text-slate-400 text-sm">
              <div className="inline-block w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="font-medium">Connecting to register shift service...</p>
            </div>
          ) : activeTab === "history" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Past Shift Reconciliations
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {historyResponse?.data?.length || 0} records
                </span>
              </div>

              {historyResponse?.data?.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs border border-dashed rounded-2xl border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                  <MdReceiptLong size={32} className="mx-auto mb-2 text-slate-400 opacity-60" />
                  <p className="font-semibold text-slate-600 dark:text-slate-400">No closed shifts recorded yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Past shift audit logs will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyResponse?.data?.map((s) => (
                    <div
                      key={s._id}
                      className={`p-4 rounded-2xl border text-xs flex items-center justify-between transition ${
                        isClean
                          ? "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-black text-sm text-slate-900 dark:text-white">
                          {s.cashierName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                          {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{" "}
                          · {new Date(s.endTime).toLocaleDateString()}
                        </div>
                        <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Float: <strong className="font-mono text-slate-700 dark:text-slate-300">Rs {s.startingCashFloat}</strong></span>
                          <span>Cash: <strong className="font-mono text-emerald-600 dark:text-emerald-400">Rs {s.cashSales}</strong></span>
                          <span>Card: <strong className="font-mono text-slate-700 dark:text-slate-300">Rs {s.cardSales}</strong></span>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          Counted: Rs {s.actualCashCounted}
                        </div>
                        <div
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.discrepancy === 0
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : s.discrepancy > 0
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {s.discrepancy === 0
                            ? "Balanced"
                            : `${s.discrepancy > 0 ? "+" : ""}Rs ${s.discrepancy} (${
                                s.discrepancy > 0 ? "Overage" : "Shortage"
                              })`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : !isOpenShift ? (
            /* Open Shift View */
            <form onSubmit={handleOpenShift} className="space-y-6">
              {/* Highlight Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                  isClean
                    ? "bg-amber-50/80 border-amber-200/90 text-slate-800"
                    : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                }`}
              >
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
                  <MdPointOfSale size={26} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Open Register Shift
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Count and record the initial physical cash in the drawer before ringing up orders.
                  </p>
                </div>
              </div>

              {/* Float Amount Input Container */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Starting Cash Float (Rs.) *
                </label>

                <div
                  className={`flex items-center rounded-2xl border transition-all ${
                    isClean
                      ? "bg-slate-50/80 border-slate-300 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20"
                      : "bg-slate-950/80 border-slate-700 focus-within:bg-slate-950 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20"
                  }`}
                >
                  <span className="px-4 py-3.5 text-sm font-black text-amber-500 bg-amber-500/10 border-r border-slate-200 dark:border-slate-800 rounded-l-2xl select-none">
                    Rs.
                  </span>

                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="0"
                    required
                    value={startingFloat}
                    onChange={handleFloatChange}
                    placeholder="5000"
                    className="flex-1 py-3.5 px-4 bg-transparent font-mono font-black text-xl text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  />

                  <span className="pr-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
                    PKR
                  </span>
                </div>

                {/* Quick denomination chips */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Quick Preset Amounts:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {QUICK_FLOAT_AMOUNTS.map((amt) => {
                      const isSelected = Number(startingFloat) === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setStartingFloat(String(amt))}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]"
                              : isClean
                              ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                              : "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300"
                          }`}
                        >
                          Rs {amt.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5">
                  Standard store opening float is typically Rs. 5,000 in small denominations.
                </p>
              </div>

              {/* Handover notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Handover Notes (Optional)
                </label>
                <input
                  type="text"
                  value={openNotes}
                  onChange={(e) => setOpenNotes(e.target.value)}
                  placeholder="e.g. Morning shift, 20x 100 notes, 6x 500 notes"
                  className={`w-full py-3 px-4 rounded-xl border text-xs outline-none transition ${
                    isClean
                      ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      : "bg-slate-950/80 border-slate-700 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={openShiftMutation.isPending}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MdCheckCircle size={18} />
                  <span>
                    {openShiftMutation.isPending ? "Opening Register..." : "Confirm Opening Float & Open Shift"}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Active Shift Reconciliation View */
            <form onSubmit={handleCloseShift} className="space-y-6">
              {/* Cashier & Active Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
                  isClean ? "bg-slate-50/90 border-slate-200" : "bg-slate-950/80 border-slate-800"
                }`}
              >
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Cashier</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">{shift?.cashierName || "Active Cashier"}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Shift Start Time</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {shift?.startTime ? new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                  </span>
                </div>
              </div>

              {/* Live shift tally */}
              <div
                className={`p-4 rounded-2xl border grid grid-cols-2 gap-3 ${
                  isClean ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MdPointOfSale size={13} className="text-amber-500" /> Opening Float
                  </div>
                  <div className="text-base font-mono font-black text-amber-500 mt-1">
                    Rs {Number(shift?.startingCashFloat || 0).toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MdTrendingUp size={13} className="text-emerald-500" /> Cash Sales (+)
                  </div>
                  <div className="text-base font-mono font-black text-emerald-500 mt-1">
                    +Rs {Number(financials?.cashSales || 0).toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MdTrendingDown size={13} className="text-rose-400" /> Cash Expenses (-)
                  </div>
                  <div className="text-base font-mono font-black text-rose-400 mt-1">
                    -Rs {Number(financials?.cashExpenses || 0).toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-amber-500">Expected In Till</div>
                  <div className="text-lg font-mono font-black text-amber-500 dark:text-amber-400 mt-1">
                    Rs {expectedCash.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Extra summary lines */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-100/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span>Orders: <strong className="text-slate-900 dark:text-slate-100">{financials?.orderCount || 0}</strong></span>
                <span>Card/Online: <strong className="text-slate-900 dark:text-slate-100 font-mono">Rs {Number(financials?.cardSales || 0).toFixed(2)}</strong></span>
                <span>Total Gross: <strong className="text-slate-900 dark:text-slate-100 font-mono">Rs {Number(financials?.totalSales || 0).toFixed(2)}</strong></span>
              </div>

              {/* Counted Cash Input */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Counted Physical Cash In Drawer (Rs.) *
                </label>

                <div
                  className={`flex items-center rounded-2xl border transition-all ${
                    isClean
                      ? "bg-slate-50/80 border-slate-300 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20"
                      : "bg-slate-950/80 border-slate-700 focus-within:bg-slate-950 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20"
                  }`}
                >
                  <span className="px-4 py-3.5 text-sm font-black text-amber-500 bg-amber-500/10 border-r border-slate-200 dark:border-slate-800 rounded-l-2xl select-none">
                    Rs.
                  </span>

                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="0"
                    required
                    value={actualCashCounted}
                    onChange={handleCashCountedChange}
                    placeholder="Enter final cash count..."
                    className="flex-1 py-3.5 px-4 bg-transparent font-mono font-black text-xl text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  />

                  <span className="pr-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
                    PKR
                  </span>
                </div>

                {actualCashCounted !== "" && (
                  <div
                    className={`mt-3 p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                      discrepancy === 0
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : discrepancy > 0
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {discrepancy === 0 ? <MdCheckCircle size={18} /> : <MdWarning size={18} />}
                      <span>
                        {discrepancy === 0
                          ? "Drawer is Perfectly Balanced"
                          : discrepancy > 0
                          ? `Cash Overage Detected (+Rs ${discrepancy.toFixed(2)})`
                          : `Cash Shortage Detected (-Rs ${Math.abs(discrepancy).toFixed(2)})`}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-black">
                      {discrepancy >= 0 ? "+" : ""}Rs {discrepancy.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Closing & Drop Notes
                </label>
                <input
                  type="text"
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  placeholder="e.g. Rs 20,000 deposited into safe, Rs 5,000 retained for next shift"
                  className={`w-full py-3 px-4 rounded-xl border text-xs outline-none transition ${
                    isClean
                      ? "bg-slate-50/80 border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500"
                      : "bg-slate-950/80 border-slate-700 text-white focus:border-amber-400"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlePrintZReport()}
                  className={`py-3.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    isClean
                      ? "border-slate-300 hover:bg-slate-100 text-slate-700"
                      : "border-slate-700 hover:bg-slate-800 text-slate-200"
                  }`}
                >
                  <MdPrint size={18} />
                  <span>Print Shift Z-Report</span>
                </button>

                <button
                  type="submit"
                  disabled={closeShiftMutation.isPending}
                  className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MdLock size={16} />
                  <span>{closeShiftMutation.isPending ? "Reconciling..." : "End Shift & Close Drawer"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

export default ShiftDrawer;
