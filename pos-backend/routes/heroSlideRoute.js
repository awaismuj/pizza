const express = require("express");
const {
  addHeroSlide,
  getHeroSlides,
  updateHeroSlide,
  toggleHeroSlideStatus,
  reorderHeroSlides,
  deleteHeroSlide,
  getPublicHeroSlides,
} = require("../controllers/heroSlideController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/")
  .post(isVerifiedUser, addHeroSlide)
  .get(isVerifiedUser, getHeroSlides);

// Public, read-only — used by the genzpizza.online storefront to show only
// slides that are switched on, in staff-set order.
router.route("/public").get(getPublicHeroSlides);

router.route("/reorder")
  .post(isVerifiedUser, reorderHeroSlides);

router.route("/:id/toggle")
  .patch(isVerifiedUser, toggleHeroSlideStatus);

router.route("/:id")
  .put(isVerifiedUser, updateHeroSlide)
  .delete(isVerifiedUser, deleteHeroSlide);

module.exports = router;
