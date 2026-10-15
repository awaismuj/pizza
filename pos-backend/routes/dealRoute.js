const express = require("express");
const {
  addDeal,
  getDeals,
  updateDeal,
  toggleDealStatus,
  reorderDeals,
  deleteDeal,
  getPublicDeals,
} = require("../controllers/dealController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/")
  .post(isVerifiedUser, addDeal)
  .get(isVerifiedUser, getDeals);

// Public, read-only — used by the genzpizza.online storefront to show only
// deals that are active AND currently within their scheduled day/time.
router.route("/public").get(getPublicDeals);

router.route("/reorder")
  .post(isVerifiedUser, reorderDeals);

router.route("/:id/toggle")
  .patch(isVerifiedUser, toggleDealStatus);

router.route("/:id")
  .put(isVerifiedUser, updateDeal)
  .delete(isVerifiedUser, deleteDeal);

module.exports = router;
