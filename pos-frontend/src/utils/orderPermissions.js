// Order permissions (POS):
//  - Any signed-in staff (Waiter/Cashier/Admin) can create an order and
//    move it forward through its normal stages (In Progress -> Ready ->
//    Closed, or Accepted -> Preparing -> ... for online). That's NOT
//    gated here — it's just the default "next stage" button everyone sees.
//  - Editing an order's items, cancelling it, or deleting a wrongly-entered
//    order (to fix a mistake) is Cashier/Admin only.
//  - A Completed/Closed order can NEVER be deleted, by anyone — it's a
//    finished sale and part of the permanent record.
// Mirrors canEditOrRole()/requireRole("Admin", "Cashier") in the backend's
// orderController.js/orderRoute.js — keep both in sync if this ever changes.
const norm = (role) => String(role || "").toLowerCase();

export const canEditOrder = (role) => ["cashier", "admin"].includes(norm(role));
export const canCancelOrder = (role) => ["cashier", "admin"].includes(norm(role));
// Cashier/Admin — but never for a finished order (Completed/Closed).
export const canDeleteOrder = (role, orderStatus) =>
  ["cashier", "admin"].includes(norm(role)) && !["Completed", "Closed"].includes(orderStatus);

// Verifying / rejecting a JazzCash/Raast payment — Cashier/Admin only
// (mirrors requireRole("Admin", "Cashier") on the /payment routes).
export const canVerifyPayment = (role) => ["cashier", "admin"].includes(norm(role));
