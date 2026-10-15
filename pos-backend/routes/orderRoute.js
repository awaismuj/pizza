const express = require("express");
const {
  addOrder,
  addPublicOrder,
  getOrders,
  getOrderById,
  getPublicOrderStatus,
  lookupPublicOrderByPhone,
  cancelPublicOrder,
  updateOrder,
  deleteOrder,
  getDeletedOrders,
} = require("../controllers/orderController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const router = express.Router();

// Public (no auth) — used by the genzpizza.online storefront. Must be
// declared before the /:id routes below, or Express would match "public"
// as an :id and require auth for it. "/public/lookup" must also come
// before "/public/:id" for the same reason.
router.route("/public/checkout").post(addPublicOrder);
router.route("/public/lookup").get(lookupPublicOrderByPhone);
// Customer cancelling their own still-Pending order — see cancelPublicOrder
// for exactly how narrow this is. Must come before "/public/:id" so Express
// doesn't need to disambiguate — different path shape either way, but kept
// together with the other public routes for clarity.
router.route("/public/:id/cancel").patch(cancelPublicOrder);
router.route("/public/:id").get(getPublicOrderStatus);

router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
// Must be before "/:id" or "deleted" would be read as an order id.
router.route("/deleted/list").get(isVerifiedUser, requireRole("Admin"), getDeletedOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
// Editing items vs. changing status have different role rules that depend
// on the request body (e.g. Cancelled needs Cashier/Admin, but a Waiter can
// still move an order forward) — handled inside updateOrder itself.
router.route("/:id").put(isVerifiedUser, updateOrder);
// Deleting an order outright is Admin only.
// Cashier and Admin can both delete a wrongly-entered order (to fix a
// mistake) — but never a Completed/Closed one; see deleteOrder. Every
// deletion is logged with who did it, viewable by Admin at /deleted/list.
router.route("/:id").delete(isVerifiedUser, requireRole("Admin", "Cashier"), deleteOrder);

module.exports = router;