const express = require("express");
const {
  downloadReport,
  sendReportToWhatsapp,
  sendReportToEmail,
  getWhatsappStatus,
  retryWhatsappLink,
  unlinkWhatsappLink,
} = require("../controllers/reportController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/download").get(isVerifiedUser, requireRole("Admin"), downloadReport);
router.route("/send").post(isVerifiedUser, requireRole("Admin"), sendReportToWhatsapp);
router.route("/send-email").post(isVerifiedUser, requireRole("Admin"), sendReportToEmail);
router.route("/whatsapp-status").get(isVerifiedUser, requireRole("Admin"), getWhatsappStatus);
router.route("/whatsapp-retry").post(isVerifiedUser, requireRole("Admin"), retryWhatsappLink);
router.route("/whatsapp-unlink").post(isVerifiedUser, requireRole("Admin"), unlinkWhatsappLink);

module.exports = router;
