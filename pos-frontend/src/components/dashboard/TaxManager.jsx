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
    <div className="container mx-auto px-6">
      <div className="max-w-xl bg-[#262626] rounded-lg p-5 sm:p-6">
        <h3 className="text-[#f5f5f5] text-xl font-semibold mb-1">Tax rate</h3>
        <p className="text-[#ababab] text-sm mb-6">
          Applied automatically to dine-in, outdoor and online orders — set it once here.
        </p>

        {isLoading ? (
          <p className="text-[#ababab]">Loading current rate…</p>
        ) : (
          <>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">Tax percentage</label>
            <div className="flex items-center gap-3 rounded-lg bg-[#1a1a1a] px-4 py-3 border border-[#333] focus-within:border-[#525252]">
              <input
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={draftRate}
                onChange={(e) => setDraftRate(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-white text-lg outline-none"
                placeholder="e.g. 16"
              />
              <span className="text-[#ababab] font-semibold">%</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDraftRate(String(p))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    parsed === p ? "bg-[#F6B100] text-[#1f1f1f]" : "bg-[#1a1a1a] text-[#ababab] hover:bg-[#333]"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={!isValid || isUnchanged || updateMutation.isPending}
              className="w-full sm:w-auto mt-6 bg-[#F6B100] text-[#1f1f1f] font-semibold rounded-lg px-8 py-3 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Saving…" : "Save tax rate"}
            </button>

            {typeof currentTaxRate === "number" && (
              <p className="text-[#ababab] text-xs mt-3">
                Currently live: <span className="text-[#f5f5f5] font-medium">{currentTaxRate}%</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaxManager;
