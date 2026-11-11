const express = require("express");
const {
  requireOwnerOrigin,
  ensureConfigured,
  startLogin,
  verifySecondFactor,
  requireOwnerSession,
  getOwnerSession,
  logoutOwner,
  getBranding,
  updateBranding,
  uploadBrandLogo,
} = require("../controllers/ownerBrandingController");
const { handleUpload } = require("../middlewares/uploadMiddleware");

const router = express.Router();
router.use(requireOwnerOrigin);
router.post("/login", ensureConfigured, startLogin);
router.post("/verify", ensureConfigured, verifySecondFactor);
router.get("/session", ensureConfigured, requireOwnerSession, getOwnerSession);
router.post("/logout", logoutOwner);
router.get("/branding", ensureConfigured, requireOwnerSession, getBranding);
router.put("/branding", ensureConfigured, requireOwnerSession, updateBranding);
router.post("/branding/logo", ensureConfigured, requireOwnerSession, handleUpload, uploadBrandLogo);

module.exports = router;
