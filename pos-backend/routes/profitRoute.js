const express = require("express");
const { getDailyProfit, getMonthlyProfit, getDayOrders, exportProfit } = require("../controllers/profitController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/day").get(isVerifiedUser, getDailyProfit);
router.route("/day/orders").get(isVerifiedUser, getDayOrders);
router.route("/export").get(isVerifiedUser, exportProfit);
router.route("/month").get(isVerifiedUser, getMonthlyProfit);

module.exports = router;
