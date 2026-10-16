const express = require("express");
const {
  addReview,
  getPublicReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const router = express.Router();

// Public - no auth. The online store (no login at all) needs to read and
// submit reviews without a token.
router.route("/public")
  .get(getPublicReviews)
  .post(addReview);

// Admin-only moderation.
router.route("/")
  .get(isVerifiedUser, requireRole("Admin"), getAllReviews);

router.route("/:id")
  .put(isVerifiedUser, requireRole("Admin"), updateReviewStatus)
  .delete(isVerifiedUser, requireRole("Admin"), deleteReview);

module.exports = router;
