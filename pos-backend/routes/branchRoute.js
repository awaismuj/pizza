const express = require("express");
const c = require("../controllers/branchController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const router = express.Router();

// Public (no login): the online store reads branches and asks for a quote.
router.get("/public", c.getPublicBranches);
router.post("/public/quote", c.quotePublic);

// POS staff: same rules, but outside-hours orders are allowed.
router.post("/quote", isVerifiedUser, c.quoteStaff);
router.get("/", isVerifiedUser, c.listBranches);

// Admin only.
router.post("/", isVerifiedUser, requireRole("Admin"), c.createBranch);
router.put("/:id", isVerifiedUser, requireRole("Admin"), c.updateBranch);
router.delete("/:id", isVerifiedUser, requireRole("Admin"), c.deleteBranch);

module.exports = router;
