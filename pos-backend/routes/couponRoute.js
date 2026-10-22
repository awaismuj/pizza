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
} = require("../controllers/couponController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const couponValidationRateLimit = require("../middlewares/couponValidationRateLimit");

const router = express.Router();
const adminOnly = [isVerifiedUser, requireRole("Admin")];

router.post("/validate", couponValidationRateLimit, validatePublicCoupon);
router.post("/validate-pos", isVerifiedUser, requireRole("Admin", "Cashier"), validatePosCoupon);
router.get("/redemptions", ...adminOnly, getCouponRedemptions);
router.get("/", ...adminOnly, getCoupons);
router.post("/", ...adminOnly, createCoupon);
router.post("/:id/duplicate", ...adminOnly, duplicateCoupon);
router.patch("/:id/archive", ...adminOnly, archiveCoupon);
router.put("/:id", ...adminOnly, updateCoupon);

module.exports = router;
