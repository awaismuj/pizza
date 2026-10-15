// Dish/deal photos uploaded via the POS dashboard are stored on the backend
// and returned as a relative path like "/uploads/xyz.png". That path only
// resolves correctly against the backend's own origin, not the storefront's
// (they're separate domains/deployments) — so it has to be turned into an
// absolute URL before it's used in an <img src>. A full http(s) URL (e.g. an
// external image host) or an empty value is returned unchanged.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const resolveImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${BACKEND_URL}${value}`;
  return value;
};
