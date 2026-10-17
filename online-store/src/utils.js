// Dish/deal photos uploaded via the POS dashboard are stored on the backend
// and returned as a relative path like "/uploads/xyz.png". That path only
// resolves correctly against the backend's own origin, not the storefront's
// (they're separate domains/deployments) — so it has to be turned into an
// absolute URL before it's used in an <img src>. A full http(s) URL (e.g. an
// external image host) or an empty value is returned unchanged.
const DEFAULT_BACKEND_URL = "https://apipos.muscatfood.com";
const BACKEND_URL = (() => {
  const runtimeOverride =
    typeof window !== "undefined" ? window.__BACKEND_URL__ : undefined;
  const configuredUrl = runtimeOverride || import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL;
  return configuredUrl.replace(/\/+$/, "");
})();

export const resolveImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${BACKEND_URL}${value}`;
  return value;
};
