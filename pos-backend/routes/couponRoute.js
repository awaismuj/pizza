const express = require("express");
const {
  assignCoupon,
  createCoupon,
  listCustomerAssignments,
  listCoupons,
  listRedemptions,
  regenerateCustomerAssignment,
  revokeCustomerAssignment,
  setCouponStatus,
  updateCoupon,
  validatePublicCoupon,
} = require("../controllers/couponController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const couponValidationRateLimit = require("../middlewares/couponValidationRateLimit");

const router = express.Router();

router.post("/validate", couponValidationRateLimit, validatePublicCoupon);
router.post(
  "/validate/pos",
  couponValidationRateLimit,
  isVerifiedUser,
  requireRole("Cashier", "Admin"),
  validatePublicCoupon
);
router.use(isVerifiedUser, requireRole("Admin"));
router.get("/redemptions", listRedemptions);
router.get("/assignments", listCustomerAssignments);
router.route("/").get(listCoupons).post(createCoupon);
router.post("/:id/assign", assignCoupon);
router.post("/:id/assignments/:assignmentId/regenerate", regenerateCustomerAssignment);
router.delete("/:id/assignments/:assignmentId", revokeCustomerAssignment);
router.patch("/:id/status", setCouponStatus);
router.put("/:id", updateCoupon);

module.exports = router;
