const express = require("express");
const {
  getCurrentShift,
  openShift,
  closeShift,
  getShiftHistory,
} = require("../controllers/shiftController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.get("/current", isVerifiedUser, getCurrentShift);
router.post("/open", isVerifiedUser, openShift);
router.post("/close", isVerifiedUser, closeShift);
router.get("/history", isVerifiedUser, getShiftHistory);

module.exports = router;
