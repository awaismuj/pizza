import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../https";
import { resolveImageUrl } from "../utils";
import defaultLogo from "../assets/images/genz-pizza-land-logo.jpg";

const useBrand = () => {
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 60_000,
  });
  const branding = data?.data?.data?.branding;
  return {
    brandName: branding?.name || "GenZ Pizza Land",
    brandLogo: branding?.logo ? resolveImageUrl(branding.logo) : defaultLogo,
  };
};

export default useBrand;
