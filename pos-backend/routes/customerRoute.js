const express = require("express");
const {
  registerCustomer,
  verifyCustomerEmail,
  loginCustomer,
  getCustomerProfile,
  updateMarketingConsent,
  logoutCustomer,
} = require("../controllers/customerController");
const { requireCustomer } = require("../middlewares/customerAuthentication");

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/verify-email/:token", verifyCustomerEmail);
router.get("/me", requireCustomer, getCustomerProfile);
router.patch("/me/marketing-consent", requireCustomer, updateMarketingConsent);
router.post("/logout", requireCustomer, logoutCustomer);

module.exports = router;
