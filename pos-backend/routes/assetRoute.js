const express = require("express");
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  archiveAsset,
  recordAssignment,
  recordValuation,
  recordValueAdjustment,
  recordMaintenance,
  updateMaintenance,
  recordUsage,
  disposeAsset,
  getDashboard,
  exportAssets,
  uploadAssetDocument,
  getAssetDocument,
  getAssetDepreciation,
  runDepreciationPeriod,
  getAssetSettings,
  updateAssetSettings,
} = require("../controllers/assetController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const { handleAssetUpload } = require("../middlewares/assetUploadMiddleware");

const router = express.Router();
const ASSET_ROLES = ["Admin", "Accountant", "Asset Manager", "Read Only"];
const EDIT_ROLES = ["Admin", "Accountant", "Asset Manager"];
const FINANCIAL_ROLES = ["Admin", "Accountant"];

router.get("/dashboard", isVerifiedUser, requireRole(...ASSET_ROLES), getDashboard);
router.route("/settings")
  .get(isVerifiedUser, requireRole(...ASSET_ROLES), getAssetSettings)
  .put(isVerifiedUser, requireRole("Admin", "Accountant"), updateAssetSettings);
router.get("/reports/export", isVerifiedUser, requireRole("Admin", "Accountant", "Read Only"), exportAssets);
router.post("/documents", isVerifiedUser, requireRole(...EDIT_ROLES), handleAssetUpload, uploadAssetDocument);
router.get("/documents/:filename", isVerifiedUser, requireRole(...ASSET_ROLES), getAssetDocument);
router.post("/depreciation/run", isVerifiedUser, requireRole(...FINANCIAL_ROLES), runDepreciationPeriod);

router.route("/")
  .get(isVerifiedUser, requireRole(...ASSET_ROLES), getAssets)
  .post(isVerifiedUser, requireRole(...FINANCIAL_ROLES), createAsset);

router.get("/:id/depreciation", isVerifiedUser, requireRole("Admin", "Accountant", "Read Only"), getAssetDepreciation);
router.post("/:id/valuation", isVerifiedUser, requireRole(...FINANCIAL_ROLES), recordValuation);
router.post("/:id/adjustment", isVerifiedUser, requireRole(...FINANCIAL_ROLES), recordValueAdjustment);
router.post("/:id/assignment", isVerifiedUser, requireRole(...EDIT_ROLES), recordAssignment);
router.post("/:id/maintenance", isVerifiedUser, requireRole(...EDIT_ROLES), recordMaintenance);
router.patch("/:id/maintenance/:maintenanceId", isVerifiedUser, requireRole(...EDIT_ROLES), updateMaintenance);
router.post("/:id/usage", isVerifiedUser, requireRole(...EDIT_ROLES), recordUsage);
router.post("/:id/disposal", isVerifiedUser, requireRole(...FINANCIAL_ROLES), disposeAsset);
router.patch("/:id/archive", isVerifiedUser, requireRole(...EDIT_ROLES), archiveAsset);
router.route("/:id")
  .get(isVerifiedUser, requireRole(...ASSET_ROLES), getAsset)
  .put(isVerifiedUser, requireRole(...EDIT_ROLES), updateAsset);

module.exports = router;
