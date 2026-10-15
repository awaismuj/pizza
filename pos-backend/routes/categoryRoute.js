const express = require("express");
const { addCategory, getCategories, updateCategory, deleteCategory, reorderCategories } = require("../controllers/categoryController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/")
  .post(isVerifiedUser, addCategory)
  .get(isVerifiedUser, getCategories);

// Public, read-only — used by the genzpizza.online storefront's menu page.
router.route("/public").get(getCategories);

router.route("/reorder")
  .post(isVerifiedUser, reorderCategories);

router.route("/:id")
  .put(isVerifiedUser, updateCategory)
  .delete(isVerifiedUser, deleteCategory);

module.exports = router;
