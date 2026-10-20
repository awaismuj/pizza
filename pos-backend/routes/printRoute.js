const express = require("express");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const {
  printReceipt,
  printKitchenTicket,
  testPrinterConnection,
} = require("../controllers/printController");

router.post("/receipt", isVerifiedUser, printReceipt);
router.post("/kitchen", isVerifiedUser, printKitchenTicket);
router.post("/test", isVerifiedUser, testPrinterConnection);

module.exports = router;
