import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getSettings, updateSettings } from "../../https";

const SpecialDiscountManager = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
  const currentEnabled = data?.data?.data?.specialDiscountEnabled;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof currentEnabled === "boolean") setEnabled(currentEnabled);
  }, [currentEnabled]);

  const mutation = useMutation({
    mutationFn: (specialDiscountEnabled) => updateSettings({ specialDiscountEnabled }),
    onSuccess: (response) => {
      enqueueSnackbar(
        response?.data?.data?.specialDiscountEnabled
          ? "Special discounts enabled."
          : "Special discounts disabled.",
        { variant: "success" }
      );
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update special discount setting.", {
        variant: "error",
      });
    },
  });

  const changed = typeof currentEnabled === "boolean" && enabled !== currentEnabled;

  return (
    <div className="mx-auto w-full px-6">
      <div className="max-w-xl rounded-lg bg-[#262626] p-5 sm:p-6">
        <h3 className="mb-1 text-xl font-semibold text-[#f5f5f5]">Special discounts</h3>
        <p className="mb-6 text-sm text-[#ababab]">
          Allow authorized Cashier/Admin staff to apply a fixed rupee discount while placing a POS order.
          The amount and staff member will appear on the printed bill.
        </p>

        {isLoading ? (
          <p className="text-[#ababab]">Loading current setting…</p>
        ) : isError ? (
          <p className="text-red-300" role="alert">
            {error?.response?.data?.message || "Could not load special discount settings. Refresh and try again."}
          </p>
        ) : (
          <>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-[#383838] bg-[#1a1a1a] p-4">
              <span>
                <span className="block font-semibold text-[#f5f5f5]">
                  {enabled ? "Special discount active" : "Special discount inactive"}
                </span>
                <span className="mt-1 block text-xs text-[#ababab]">
                  Applies to new dine-in and takeaway orders only.
                </span>
              </span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                className="h-5 w-5 accent-[#f6b100]"
              />
            </label>

            <button
              type="button"
              onClick={() => mutation.mutate(enabled)}
              disabled={!changed || mutation.isPending}
              className="mt-6 w-full rounded-lg bg-[#f6b100] px-8 py-3 font-semibold text-[#1f1f1f] hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {mutation.isPending ? "Saving…" : "Save setting"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SpecialDiscountManager;
