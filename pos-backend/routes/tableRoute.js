const express = require("express");
const { addTable, getTables, updateTable, deleteTable } = require("../controllers/tableController");
const router = express.Router();
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification")

router.route("/").post(isVerifiedUser , addTable);
router.route("/").get(isVerifiedUser , getTables);
// PUT stays open to any verified staff — Bill.jsx uses it to mark a table
// Booked/Available as part of the normal checkout flow. Deleting a table is
// destructive, so that's Admin only.
router.route("/:id").put(isVerifiedUser , updateTable);
router.route("/:id").delete(isVerifiedUser, requireRole("Admin"), deleteTable);

module.exports = router;