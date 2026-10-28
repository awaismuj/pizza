const express = require("express");
const {
  registerCustomer,
  verifyCustomerEmail,
  loginCustomer,
  getCustomerProfile,
  logoutCustomer,
} = require("../controllers/customerController");
const { requireCustomer } = require("../middlewares/customerAuthentication");
const createRateLimiter = require("../middlewares/createRateLimiter");

const router = express.Router();

router.post("/register", createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: "Too many account registration attempts. Please try again later.",
}), registerCustomer);
router.post("/login", createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: "Too many sign-in attempts. Please wait before trying again.",
}), loginCustomer);
router.get("/verify-email/:token", verifyCustomerEmail);
router.get("/me", requireCustomer, getCustomerProfile);
router.post("/logout", requireCustomer, logoutCustomer);

module.exports = router;
