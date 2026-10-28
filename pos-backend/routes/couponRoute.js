const express = require("express");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { attachOptionalCustomer } = require("../middlewares/customerAuthentication");
const createRateLimiter = require("../middlewares/createRateLimiter");
const {
  validateCouponForOrder,
  listCoupons,
  getCoupon,
  listCouponRedemptions,
  getCouponReport,
  reverseCouponRedemption,
  getCouponCampaignSettings,
  updateCouponCampaignSettings,
  issueWelcomeCoupon,
  generateFridayCampaign,
  cancelCoupon,
  listBirthdayNotifications,
  markBirthdayNotificationRead,
} = require("../controllers/couponController");

const router = express.Router();
const couponRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 20,
  message: "Too many coupon attempts. Please wait before trying again.",
});

router.post("/public/validate", couponRateLimit, attachOptionalCustomer, validateCouponForOrder);
router.post("/public/welcome", createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: "Too many welcome coupon checks. Please try again later.",
}), attachOptionalCustomer, issueWelcomeCoupon);
router.post("/validate", isVerifiedUser, couponRateLimit, validateCouponForOrder);
router.get("/admin/report", isVerifiedUser, getCouponReport);
router.get("/admin/settings", isVerifiedUser, getCouponCampaignSettings);
router.put("/admin/settings", isVerifiedUser, updateCouponCampaignSettings);
router.post("/admin/generate/friday", isVerifiedUser, generateFridayCampaign);
router.get("/admin/notifications/birthday", isVerifiedUser, listBirthdayNotifications);
router.patch("/admin/notifications/birthday/:id/read", isVerifiedUser, markBirthdayNotificationRead);
router.get("/admin", isVerifiedUser, listCoupons);
router.patch("/admin/:id/cancel", isVerifiedUser, cancelCoupon);
router.get("/admin/:id/redemptions", isVerifiedUser, listCouponRedemptions);
router.post("/admin/redemptions/:redemptionId/reverse", isVerifiedUser, reverseCouponRedemption);
router.get("/admin/:id", isVerifiedUser, getCoupon);

module.exports = router;
