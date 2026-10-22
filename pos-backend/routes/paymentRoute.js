const express = require("express");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const { createOrder, verifyPayment, webHookVerification } = require("../controllers/paymentController");
const createRateLimiter = require("../middlewares/createRateLimiter");
 
router.route("/create-order").post(createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 30,
  message: "Too many payment setup requests. Please wait before trying again.",
}), isVerifiedUser, createOrder);
router.route("/verify-payment").post(createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 30,
  message: "Too many payment verification requests. Please wait before trying again.",
}), isVerifiedUser, verifyPayment);
router.route("/webhook-verification").post(webHookVerification);


module.exports = router;