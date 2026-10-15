const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const router = express.Router();

// No auth - the online store (no login at all) and the POS both need the
// live tax rate to price orders.
router.route("/").get(getSettings);
// Only an Admin can change it.
router.route("/").put(isVerifiedUser, requireRole("Admin"), updateSettings);

module.exports = router;
