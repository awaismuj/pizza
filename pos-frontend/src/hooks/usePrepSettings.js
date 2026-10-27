import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../https";
import { withPrepDefaults } from "../utils/prepTimer";

// Order-preparation settings live inside the shared ["settings"] query (same
// one useTaxRate uses), so there is no extra request for them.
const usePrepSettings = () => {
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 60_000,
  });
  return withPrepDefaults(data?.data?.data?.orderPrep);
};

export default usePrepSettings;
