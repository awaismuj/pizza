const express = require("express");
const createHttpError = require("http-errors");
const controller = require("../controllers/whatsAppCampaignController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();
const requireCampaignAdmin = (req, res, next) => {
	if (!["admin", "super admin"].includes(String(req.user?.role || "").trim().toLowerCase())) {
		return next(createHttpError(403, "Only Admin or Super Admin can manage WhatsApp campaigns."));
	}
	next();
};
const adminOnly = [isVerifiedUser, requireCampaignAdmin];

router.get("/webhook", controller.webhookVerify);
router.post("/webhook", controller.webhookStatus);

router.get("/provider", ...adminOnly, controller.getProvider);
router.get("/messages/recent", ...adminOnly, controller.getRecentMessages);
router.get("/whatsapp-link/status", ...adminOnly, controller.getLinkedWhatsAppStatus);
router.post("/whatsapp-link/retry", ...adminOnly, controller.retryLinkedWhatsApp);
router.post("/whatsapp-link/unlink", ...adminOnly, controller.unlinkLinkedWhatsApp);
router.get("/customers", ...adminOnly, controller.customerList);
router.post("/customers", ...adminOnly, controller.createCustomerContact);
router.patch("/customers/:customerId", ...adminOnly, controller.updateCustomerContact);
router.post("/preview", ...adminOnly, controller.previewCampaign);
router.post("/send-test", ...adminOnly, controller.sendTestMessage);
router.post("/campaigns", ...adminOnly, controller.createCampaign);
router.get("/campaigns", ...adminOnly, controller.getCampaigns);
router.get("/campaigns/:id", ...adminOnly, controller.getCampaign);
router.post("/campaigns/:id/scan", ...adminOnly, controller.scanCampaign);
router.post("/campaigns/:id/generate-tokens", ...adminOnly, controller.generateCampaignTokens);
router.get("/campaigns/:id/recipients", ...adminOnly, controller.getCampaignRecipients);
router.post("/campaigns/:id/launch", ...adminOnly, controller.launchCampaign);
router.post("/campaigns/:id/pause", ...adminOnly, controller.pauseCampaign);
router.post("/campaigns/:id/cancel", ...adminOnly, controller.cancelCampaign);
router.post("/campaigns/:id/retry-failed", ...adminOnly, controller.retryFailed);

module.exports = router;