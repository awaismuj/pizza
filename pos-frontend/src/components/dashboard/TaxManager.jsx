import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getSettings, updateSettings } from "../../https";

// Dashboard > Tax. One number, applied everywhere: dine-in/outdoor bills,
// the Online Orders screen, and the public genzpizza.online storefront all
// read this same value live (see useTaxRate.js / GET /api/settings), so a
// single save here is enough for it to "apply everywhere".
const TaxManager = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const currentTaxRate = data?.data?.data?.taxRatePercent;
  const [draftRate, setDraftRate] = useState("");

  // Only overwrite the draft from the server the first time it loads (or
  // after a save), not on every background refetch — otherwise typing gets
  // clobbered mid-edit.
  useEffect(() => {
    if (typeof currentTaxRate === "number") {
      setDraftRate(String(currentTaxRate));
    }
  }, [currentTaxRate]);

  const updateMutation = useMutation({
    mutationFn: (taxRatePercent) => updateSettings({ taxRatePercent }),
    onSuccess: (resData) => {
      enqueueSnackbar("Tax rate updated — now applying to every new bill.", { variant: "success" });
      queryClient.setQueryData(["settings"], (old) => ({
        ...old,
        data: { ...old?.data, data: resData?.data?.data },
      }));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update tax rate.", { variant: "error" });
    },
  });

  const parsed = Number(draftRate);
  const isValid = draftRate.trim() !== "" && !Number.isNaN(parsed) && parsed >= 0;
  const isUnchanged = typeof currentTaxRate === "number" && parsed === currentTaxRate;

  const handleSave = () => {
    if (!isValid) {
      enqueueSnackbar("Enter a tax rate of 0 or greater.", { variant: "warning" });
      return;
    }
    updateMutation.mutate(parsed);
  };

  // Common presets so admin doesn't have to type a number for the usual
  // cases — still fully free-form via the input below.
  const presets = [0, 5, 10, 16, 17];

  return (
    <div className="pb-10 max-w-xl">
      <div className="pos-card p-5 sm:p-6">
        <h3 className="text-slate-900 dark:text-white text-lg sm:text-xl font-bold tracking-tight mb-1">Tax Rate Setting</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6">
          Applied automatically to dine-in, takeaway and online store checkouts.
        </p>

        {isLoading ? (
          <p className="text-slate-400 text-sm">Loading current tax rate…</p>
        ) : (
          <>
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider mb-2">
              Tax Percentage
            </label>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus-within:border-amber-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition">
              <input
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={draftRate}
                onChange={(e) => setDraftRate(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-slate-900 dark:text-white text-lg font-bold outline-none"
                placeholder="e.g. 16"
              />
              <span className="text-slate-400 font-bold">%</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDraftRate(String(p))}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                    parsed === p
                      ? "bg-amber-500 border-amber-500 text-slate-950 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={!isValid || isUnchanged || updateMutation.isPending}
              className="w-full sm:w-auto mt-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl px-7 py-3 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
            >
              {updateMutation.isPending ? "Saving Tax Rate…" : "Save Tax Rate"}
            </button>

            {typeof currentTaxRate === "number" && (
              <p className="text-slate-400 text-xs mt-3">
                Currently live: <span className="text-slate-800 dark:text-slate-200 font-bold">{currentTaxRate}%</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaxManager;
