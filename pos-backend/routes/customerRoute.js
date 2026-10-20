const express = require("express");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const {
  lookupCustomer,
  getAllCustomers,
} = require("../controllers/customerController");

router.get("/lookup", isVerifiedUser, lookupCustomer);
router.get("/all", isVerifiedUser, getAllCustomers);

module.exports = router;
