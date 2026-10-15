const express = require("express");
const { getDailyProfit, getMonthlyProfit, getDayOrders } = require("../controllers/profitController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/day").get(isVerifiedUser, getDailyProfit);
router.route("/day/orders").get(isVerifiedUser, getDayOrders);
router.route("/month").get(isVerifiedUser, getMonthlyProfit);

module.exports = router;
