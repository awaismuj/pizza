const express = require("express");
const {
  getPublicReviews,
  createPublicReview,
  getAllReviews,
  toggleReviewVisibility,
  deleteReview,
} = require("../controllers/reviewController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");

const router = express.Router();

// Public — used by the storefront's Reviews section.
router.route("/public").get(getPublicReviews).post(createPublicReview);

// Admin moderation.
router.route("/").get(isVerifiedUser, requireRole("Admin"), getAllReviews);
router.route("/:id/toggle").patch(isVerifiedUser, requireRole("Admin"), toggleReviewVisibility);
router.route("/:id").delete(isVerifiedUser, requireRole("Admin"), deleteReview);

module.exports = router;
