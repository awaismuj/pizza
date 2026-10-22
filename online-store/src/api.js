// Talks to the same backend the POS uses (apipos.muscatfood.com), just
// through the public, no-login endpoints.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const CUSTOMER_TOKEN_KEY = "gzp_customer_token";

export const setCustomerToken = (token) => {
  if (token) sessionStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  else sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
};

async function request(path, options = {}) {
  let res;
  try {
    const token = sessionStorage.getItem(CUSTOMER_TOKEN_KEY);
    res = await fetch(`${BACKEND_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Storefront-Client": "online-store",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
  } catch (networkErr) {
    // Network drop / server unreachable — not the same as "order doesn't exist".
    const err = new Error("Network error. Please check your connection.");
    err.isNetworkError = true;
    throw err;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong. Please try again.");
    err.status = res.status;
    // Structured details from the server, e.g. { shortages: [...] } when an
    // order asks for more than the live inventory can supply.
    err.data = data.data;
    throw err;
  }

  return data;
}

export const getPublicCategories = () => request("/api/category/public");
export const getPublicDishes = () => request("/api/dish/public");
// Only returns deals that are switched on AND inside their scheduled
// day/time window (e.g. "Sunday Special" only shows up on Sundays).
export const getPublicDeals = () => request("/api/deal/public");
// Full-width homepage slider photos, staff-managed from the POS dashboard.
export const getPublicHeroSlides = () => request("/api/hero-slide/public");

export const placeOrder = (payload) =>
  request("/api/order/public/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const validatePublicCoupon = (payload) =>
  request("/api/coupon/validate", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const registerCustomer = (payload) =>
  request("/api/customer/register", { method: "POST", body: JSON.stringify(payload) });

export const loginCustomer = async (payload) => {
  const result = await request("/api/customer/login", { method: "POST", body: JSON.stringify(payload) });
  setCustomerToken(result.data.token);
  return result;
};

export const getCustomerProfile = () => request("/api/customer/me");

export const updateCustomerMarketingConsent = (marketingConsent) =>
  request("/api/customer/me/marketing-consent", {
    method: "PATCH",
    body: JSON.stringify({ marketingConsent }),
  });

export const getMyCoupons = () => request("/api/coupon/mine");

export const logoutCustomer = async () => {
  try {
    return await request("/api/customer/logout", { method: "POST" });
  } finally {
    setCustomerToken("");
  }
};

export const getOrderStatus = (orderId) => request(`/api/order/public/${orderId}`);

// Customer cancelling their OWN order — only works while it's still
// "Pending" (before the shop has accepted it). Once it's Accepted or
// later, the backend rejects this and the customer needs to call the shop.
export const cancelOrder = (orderId) =>
  request(`/api/order/public/${orderId}/cancel`, { method: "PATCH" });

export const lookupOrderByPhone = (phone) =>
  request(`/api/order/public/lookup?phone=${encodeURIComponent(phone)}`);

// Live tax rate — admin-editable from POS Dashboard > Tax. Used only to show
// an accurate estimate before checkout; the amount actually charged is
// always recalculated server-side from this same setting.
export const getPublicSettings = () => request("/api/settings");

// Customer reviews: public read + "Write a Review" submit.
export const getPublicReviews = (limit = 30) => request(`/api/review/public?limit=${limit}`);
export const submitReview = (payload) =>
  request("/api/review/public", { method: "POST", body: JSON.stringify(payload) });

// JazzCash/Raast payment screenshot — sent as multipart (NOT JSON) before the
// order is placed; returns { data: { proofId } } to attach to the order.
export async function uploadPaymentProof(file) {
  const body = new FormData();
  body.append("screenshot", file);
  let res;
  try {
    res = await fetch(`${BACKEND_URL}/api/order/public/payment-proof`, { method: "POST", body });
  } catch {
    const err = new Error("Network error. Please check your connection and try again.");
    err.isNetworkError = true;
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Couldn't upload the screenshot. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

// Branches + live fulfillment rules (hours, pickup, delivery zones & fees).
export const getPublicBranches = () => request("/api/branch/public");
// Server-side price/validation of a delivery or pickup choice. The checkout
// endpoint re-runs the exact same rules, so this is what the customer will pay.
export const quoteFulfillment = (payload) =>
  request("/api/branch/public/quote", { method: "POST", body: JSON.stringify(payload) });
