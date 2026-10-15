const express = require("express");
const { addDish, getDishes, updateDish, deleteDish, reorderDishes } = require("../controllers/categoryController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/")
  .post(isVerifiedUser, addDish)
  .get(isVerifiedUser, getDishes);

// Public, read-only — used by the genzpizza.online storefront's menu page.
router.route("/public").get(getDishes);

router.route("/reorder")
  .post(isVerifiedUser, reorderDishes);

router.route("/:id")
  .put(isVerifiedUser, updateDish)
  .delete(isVerifiedUser, deleteDish);

module.exports = router;
