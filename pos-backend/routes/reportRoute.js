const express = require("express");
const {
  downloadReport,
  sendReportToEmail,
} = require("../controllers/reportController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/download").get(isVerifiedUser, requireRole("Admin"), downloadReport);
router.route("/send-email").post(isVerifiedUser, requireRole("Admin"), sendReportToEmail);

module.exports = router;
