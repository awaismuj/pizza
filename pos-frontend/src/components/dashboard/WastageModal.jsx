import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recordInventoryWastage, getInventoryWastage } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useUITheme } from "../../context/UIThemeContext";
import {
  MdDeleteSweep,
  MdClose,
  MdHistory,
  MdWarning,
  MdTrendingDown,
} from "react-icons/md";

const WastageModal = ({ isOpen, onClose, items = [], preselectedItem = null }) => {
  const { isClean } = useUITheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("record"); // "record" | "history"

  const [selectedItemId, setSelectedItemId] = useState(
    preselectedItem?._id || (items[0]?._id ?? "")
  );
  const [quantityWasted, setQuantityWasted] = useState("");
  const [reason, setReason] = useState("Prep Error");
  const [notes, setNotes] = useState("");

  const activeItem = items.find((i) => i._id === selectedItemId) || items[0];

  const { data: wastageData, isLoading: isHistoryLoading, refetch } = useQuery({
    queryKey: ["inventoryWastage"],
    queryFn: async () => {
      const res = await getInventoryWastage();
      return res.data;
    },
    enabled: isOpen && activeTab === "history",
  });

  const wastageMutation = useMutation({
    mutationFn: recordInventoryWastage,
    onSuccess: (res) => {
      enqueueSnackbar(res.data?.message || "Wastage recorded and stock deducted.", {
        variant: "success",
      });
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["dailyProfit"]);
      setQuantityWasted("");
      setNotes("");
      onClose();
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || "Failed to record wastage.", {
        variant: "error",
      });
    },
  });

  if (!isOpen) return null;

  const unitCost = Number(activeItem?.costPrice || activeItem?.sellingPrice || 0);
  const qtyNum = Number(quantityWasted) || 0;
  const calculatedLoss = Math.round(qtyNum * unitCost * 100) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      enqueueSnackbar("Please select an inventory item.", { variant: "warning" });
      return;
    }
    if (qtyNum <= 0) {
      enqueueSnackbar("Quantity wasted must be greater than 0.", { variant: "warning" });
      return;
    }
    if (qtyNum > (activeItem?.quantity || 0)) {
      enqueueSnackbar(
        `Wastage quantity (${qtyNum}) exceeds available stock (${activeItem?.quantity || 0}).`,
        { variant: "warning" }
      );
      return;
    }

    wastageMutation.mutate({
      itemId: selectedItemId,
      quantityWasted: qtyNum,
      reason,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden transition ${
          isClean
            ? "bg-white border-slate-200 text-slate-800"
            : "bg-slate-900 border-slate-800 text-slate-100"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isClean ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-slate-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <MdDeleteSweep size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Inventory Spoilage & Wastage Log
              </h2>
              <p className="text-xs text-slate-400">
                Track kitchen loss, expired toppings & shrinkage deductible to P&L
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-700/50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("record")}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeTab === "record"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Log Loss
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                  activeTab === "history"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MdHistory size={13} /> History
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <MdClose size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {activeTab === "history" ? (
            <div className="space-y-3">
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isClean ? "bg-rose-50/60 border-rose-200" : "bg-rose-950/20 border-rose-500/30"
                }`}
              >
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <MdTrendingDown size={18} /> Total Itemized Shrinkage Loss:
                </div>
                <div className="text-base font-mono font-black text-rose-600 dark:text-rose-400">
                  Rs {Number(wastageData?.data?.totalLossAmount || 0).toLocaleString()}
                </div>
              </div>

              {isHistoryLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading audit history...</div>
              ) : wastageData?.data?.records?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No spoilage logs recorded.</div>
              ) : (
                <div className="space-y-2">
                  {wastageData?.data?.records?.map((rec) => (
                    <div
                      key={rec._id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        isClean ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {rec.itemName} — {rec.quantityWasted} {rec.unit}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Reason: <span className="font-semibold text-rose-500">{rec.reason}</span> · Logged by {rec.loggedBy}
                        </div>
                        {rec.notes && <div className="text-[10px] text-slate-400 italic">"{rec.notes}"</div>}
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-rose-500">
                          -Rs {Number(rec.totalLossAmount).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(rec.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1">Select Ingredient / Item *</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold outline-hidden ${
                    isClean
                      ? "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                      : "bg-slate-950 border-slate-700 text-white focus:border-amber-400"
                  }`}
                >
                  {items.map((it) => (
                    <option key={it._id} value={it._id}>
                      {it.name} (In Stock: {it.quantity} {it.unit} · Rs {it.costPrice || it.sellingPrice || 0}/{it.unit})
                    </option>
                  ))}
                </select>
              </div>

              {activeItem && (
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isClean ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div>
                    <span className="text-slate-400">Available Stock: </span>
                    <strong className="font-mono text-emerald-500">
                      {activeItem.quantity} {activeItem.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Cost Valuation: </span>
                    <strong className="font-mono">
                      Rs {unitCost.toFixed(2)} / {activeItem.unit}
                    </strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Quantity Wasted *</label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    max={activeItem?.quantity || 9999}
                    required
                    value={quantityWasted}
                    onChange={(e) => setQuantityWasted(e.target.value)}
                    placeholder={`e.g. 2.5 (${activeItem?.unit || "pcs"})`}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-mono font-bold outline-hidden ${
                      isClean
                        ? "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                        : "bg-slate-950 border-slate-700 text-white focus:border-amber-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Reason for Loss *</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold outline-hidden ${
                      isClean
                        ? "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                        : "bg-slate-950 border-slate-700 text-white focus:border-amber-400"
                    }`}
                  >
                    <option value="Prep Error">Prep Error (Burnt / Overcooked)</option>
                    <option value="Expired">Expired / Spoiled</option>
                    <option value="Damaged">Packaging Damaged</option>
                    <option value="Dropped">Dropped / Spilled</option>
                    <option value="Quality Reject">Quality Inspection Reject</option>
                    <option value="Other">Other Shrinkage</option>
                  </select>
                </div>
              </div>

              {/* Loss summary */}
              {qtyNum > 0 && (
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    isClean ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-rose-950/20 border-rose-500/30 text-rose-400"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MdWarning size={15} /> Loss Charged to Operating Expenses:
                  </span>
                  <span className="font-mono text-sm">Rs {calculatedLoss.toFixed(2)}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">Incident Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Oven temperature spike burnt batch of 6 medium doughs"
                  className={`w-full py-2 px-3 rounded-xl border text-xs outline-hidden ${
                    isClean
                      ? "bg-white border-slate-300 text-slate-900"
                      : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={wastageMutation.isPending || qtyNum <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition active:scale-98 disabled:opacity-50"
              >
                {wastageMutation.isPending ? "Logging Loss..." : "Confirm & Deduct Wastage from Stock"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WastageModal;
