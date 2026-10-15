import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../https";
import { TAX_RATE_PERCENT as FALLBACK_TAX_RATE_PERCENT } from "../constants";

// The tax rate is now admin-editable (Dashboard > Tax) and stored in the
// backend, not a hardcoded constant - this fetches whatever is currently
// set so every bill (dine-in, outdoor, and the online store) matches.
// Falls back to the old static constant only for the instant before the
// first fetch resolves, so totals never render as 0% tax while loading.
const useTaxRate = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 60_000,
  });

  const taxRatePercent = data?.data?.data?.taxRatePercent;

  return {
    taxRate: typeof taxRatePercent === "number" ? taxRatePercent : FALLBACK_TAX_RATE_PERCENT,
    isLoading,
  };
};

export default useTaxRate;
