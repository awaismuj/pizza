import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getSettings, updateSettings, testPrinterConnection } from "../../https";
import { useUITheme } from "../../context/UIThemeContext";
import { MdPrint, MdCheckCircle, MdWifi, MdPowerSettingsNew, MdSensors } from "react-icons/md";

const PrinterManager = () => {
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();

  const { data: settingsRes, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const [receiptIp, setReceiptIp] = useState("");
  const [receiptPort, setReceiptPort] = useState(9100);
  const [kitchenIp, setKitchenIp] = useState("");
  const [kitchenPort, setKitchenPort] = useState(9100);
  const [autoReceipt, setAutoReceipt] = useState(false);
  const [autoKitchen, setAutoKitchen] = useState(false);
  const [isTestingReceipt, setIsTestingReceipt] = useState(false);
  const [isTestingKitchen, setIsTestingKitchen] = useState(false);

  useEffect(() => {
    const pc = settingsRes?.data?.data?.printerConfig;
    if (pc) {
      setReceiptIp(pc.receiptPrinterIp || "");
      setReceiptPort(pc.receiptPrinterPort || 9100);
      setKitchenIp(pc.kitchenPrinterIp || "");
      setKitchenPort(pc.kitchenPrinterPort || 9100);
      setAutoReceipt(Boolean(pc.autoPrintReceipt));
      setAutoKitchen(Boolean(pc.autoPrintKitchen));
    }
  }, [settingsRes]);

  const saveMutation = useMutation({
    mutationFn: (printerConfig) => updateSettings({ printerConfig }),
    onSuccess: (resData) => {
      enqueueSnackbar("Hardware printer configuration saved successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to update printer settings.", { variant: "error" });
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      receiptPrinterIp: receiptIp.trim(),
      receiptPrinterPort: Number(receiptPort) || 9100,
      kitchenPrinterIp: kitchenIp.trim(),
      kitchenPrinterPort: Number(kitchenPort) || 9100,
      autoPrintReceipt: autoReceipt,
      autoPrintKitchen: autoKitchen,
    });
  };

  const handleTestReceipt = async () => {
    if (!receiptIp.trim()) {
      enqueueSnackbar("Please enter a valid Receipt Printer IP address first.", { variant: "warning" });
      return;
    }
    setIsTestingReceipt(true);
    try {
      const res = await testPrinterConnection({ ip: receiptIp.trim(), port: Number(receiptPort) || 9100 });
      if (res.data?.success) {
        enqueueSnackbar("Diagnostic slip printed on Receipt Printer!", { variant: "success" });
      } else {
        enqueueSnackbar(res.data?.message || "Printer test failed.", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to connect to printer.", { variant: "error" });
    } finally {
      setIsTestingReceipt(false);
    }
  };

  const handleTestKitchen = async () => {
    if (!kitchenIp.trim()) {
      enqueueSnackbar("Please enter a valid Kitchen Printer IP address first.", { variant: "warning" });
      return;
    }
    setIsTestingKitchen(true);
    try {
      const res = await testPrinterConnection({ ip: kitchenIp.trim(), port: Number(kitchenPort) || 9100 });
      if (res.data?.success) {
        enqueueSnackbar("Diagnostic slip printed on Kitchen Printer!", { variant: "success" });
      } else {
        enqueueSnackbar(res.data?.message || "Printer test failed.", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to connect to printer.", { variant: "error" });
    } finally {
      setIsTestingKitchen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse font-medium">
        Loading hardware configuration...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between ${
          isClean
            ? "bg-white border-slate-200/90 shadow-xs"
            : "bg-slate-900/80 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/25">
            <MdPrint size={24} />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
              Thermal Network Hardware Printers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Zero-click raw ESC/POS direct TCP printing for 80mm & 58mm thermal ticket printers
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cashier / Receipt Station */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isClean
                ? "bg-white border-slate-200 shadow-xs"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                <MdPrint className="text-amber-500" size={18} />
                <span>Front Cashier Receipt Printer</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Port 9100
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Printer Static IP Address
                </label>
                <div className="relative">
                  <MdWifi className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={receiptIp}
                    onChange={(e) => setReceiptIp(e.target.value)}
                    placeholder="192.168.1.100"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-mono font-semibold outline-none transition ${
                      isClean
                        ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                        : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Leave empty if using browser print dialog exclusively.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Raw TCP Port
                </label>
                <input
                  type="number"
                  value={receiptPort}
                  onChange={(e) => setReceiptPort(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-semibold outline-none transition ${
                    isClean
                      ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                      : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                  }`}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoReceipt}
                    onChange={(e) => setAutoReceipt(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Auto-print receipt upon order placement
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestReceipt}
                  disabled={isTestingReceipt}
                  className="w-full py-2 px-3 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <MdSensors size={16} />
                  <span>{isTestingReceipt ? "Dispatching Test Slip..." : "Test Cashier Printer"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Kitchen Station */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isClean
                ? "bg-white border-slate-200 shadow-xs"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                <MdPrint className="text-blue-500" size={18} />
                <span>Kitchen Display / KOT Printer</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Port 9100
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Printer Static IP Address
                </label>
                <div className="relative">
                  <MdWifi className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={kitchenIp}
                    onChange={(e) => setKitchenIp(e.target.value)}
                    placeholder="192.168.1.101"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-mono font-semibold outline-none transition ${
                      isClean
                        ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                        : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Prints kitchen order tickets (KOT) with double-sized item titles.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Raw TCP Port
                </label>
                <input
                  type="number"
                  value={kitchenPort}
                  onChange={(e) => setKitchenPort(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-semibold outline-none transition ${
                    isClean
                      ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                      : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                  }`}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoKitchen}
                    onChange={(e) => setAutoKitchen(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Auto-print kitchen ticket on new orders
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestKitchen}
                  disabled={isTestingKitchen}
                  className="w-full py-2 px-3 rounded-xl border border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <MdSensors size={16} />
                  <span>{isTestingKitchen ? "Dispatching Test Slip..." : "Test Kitchen Printer"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-2"
          >
            <MdCheckCircle size={17} />
            <span>{saveMutation.isPending ? "Saving Settings..." : "Save Hardware Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrinterManager;
