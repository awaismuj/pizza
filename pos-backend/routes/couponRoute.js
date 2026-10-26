const express = require("express");
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  archiveCoupon,
  duplicateCoupon,
  validatePublicCoupon,
  validatePosCoupon,
  getCouponRedemptions,
  getMyCoupons,
  assignCoupon,
  searchCouponCustomerByPhone,
  getCouponAssignments,
  revokeCouponAssignment,
  checkWelcomeOffer,
} = require("../controllers/couponController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const { requireCustomer, attachOptionalCustomer } = require("../middlewares/customerAuthentication");
const couponValidationRateLimit = require("../middlewares/couponValidationRateLimit");

const router = express.Router();
const adminOnly = [isVerifiedUser, requireRole("Admin")];

router.post("/validate", couponValidationRateLimit, attachOptionalCustomer, validatePublicCoupon);
router.post("/welcome-offer/check", couponValidationRateLimit, attachOptionalCustomer, checkWelcomeOffer);
router.post("/validate-pos", isVerifiedUser, requireRole("Admin", "Cashier"), validatePosCoupon);
router.get("/mine", requireCustomer, getMyCoupons);
router.get("/redemptions", ...adminOnly, getCouponRedemptions);
router.get("/assignments", ...adminOnly, getCouponAssignments);
router.get("/customers/search", ...adminOnly, searchCouponCustomerByPhone);
router.get("/", ...adminOnly, getCoupons);
router.post("/", ...adminOnly, createCoupon);
router.post("/:id/assign", ...adminOnly, assignCoupon);
router.patch("/assignments/:assignmentId/revoke", ...adminOnly, revokeCouponAssignment);
router.post("/:id/duplicate", ...adminOnly, duplicateCoupon);
router.patch("/:id/archive", ...adminOnly, archiveCoupon);
router.put("/:id", ...adminOnly, updateCoupon);

module.exports = router;
