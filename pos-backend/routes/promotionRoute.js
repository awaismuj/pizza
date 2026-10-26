const express = require("express");
const controller = require("../controllers/promotionController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");

const router = express.Router();
const adminOnly = [isVerifiedUser, requireRole("Admin")];

router.get("/settings", ...adminOnly, controller.getSettings);
router.put("/settings", ...adminOnly, controller.updateSettings);
router.get("/customers", ...adminOnly, controller.getCustomers);
router.get("/preview", ...adminOnly, controller.getPreview);
router.get("/executions", ...adminOnly, controller.getExecutions);
router.post("/executions", ...adminOnly, controller.runManualCampaign);
router.get("/executions/:id/issues", ...adminOnly, controller.getExecutionIssues);
router.post("/issues/:issueId/send", ...adminOnly, controller.queueIssueDelivery);
router.post("/issues/:issueId/retry", ...adminOnly, controller.retryIssueDelivery);
router.patch("/assignments/:assignmentId/revoke", ...adminOnly, controller.revokeAssignment);

module.exports = router;
