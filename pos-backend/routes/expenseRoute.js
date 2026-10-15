const express = require("express");
const { addExpense, getExpenses, deleteExpense } = require("../controllers/expenseController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/")
  .get(isVerifiedUser, getExpenses)
  .post(isVerifiedUser, addExpense);

router.route("/:id")
  .delete(isVerifiedUser, deleteExpense);

module.exports = router;
