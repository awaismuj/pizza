const express = require("express");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { attachOptionalCustomer } = require("../middlewares/customerAuthentication");
const createRateLimiter = require("../middlewares/createRateLimiter");
const {
  validateCouponForOrder,
  listCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  archiveCoupon,
  listCouponRedemptions,
  getCouponReport,
  reverseCouponRedemption,
} = require("../controllers/couponController");

const router = express.Router();
const couponRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 20,
  message: "Too many coupon attempts. Please wait before trying again.",
});

router.post("/public/validate", couponRateLimit, attachOptionalCustomer, validateCouponForOrder);
router.post("/validate", isVerifiedUser, couponRateLimit, validateCouponForOrder);
router.get("/admin/report", isVerifiedUser, getCouponReport);
router.get("/admin", isVerifiedUser, listCoupons);
router.post("/admin", isVerifiedUser, createCoupon);
router.get("/admin/:id/redemptions", isVerifiedUser, listCouponRedemptions);
router.post("/admin/redemptions/:redemptionId/reverse", isVerifiedUser, reverseCouponRedemption);
router.get("/admin/:id", isVerifiedUser, getCoupon);
router.patch("/admin/:id/toggle", isVerifiedUser, toggleCoupon);
router.put("/admin/:id", isVerifiedUser, updateCoupon);
router.delete("/admin/:id", isVerifiedUser, archiveCoupon);

module.exports = router;
