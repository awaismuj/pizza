const express = require("express");
const {
  createInventoryItem,
  getInventoryItems,
  getLowStockItems,
  updateInventoryItem,
  adjustInventoryItem,
  deleteInventoryItem,
  recordInventoryWastage,
  getInventoryWastageHistory,
} = require("../controllers/inventoryController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");

const router = express.Router();

// Stock can only be created / edited / adjusted / deleted by an Admin.
// Cashiers are read-only: they just receive the low-stock popup.
router.route("/")
  .get(isVerifiedUser, getInventoryItems)
  .post(isVerifiedUser, requireRole("Admin"), createInventoryItem);

// Low / out-of-stock items — feeds the popup for Admin and Cashier.
// Declared before "/:id" so "low-stock" isn't mistaken for an id.
router.route("/low-stock").get(isVerifiedUser, requireRole("Admin", "Cashier"), getLowStockItems);

// Spoilage, Wastage & Shrinkage Ledger
router.route("/wastage")
  .post(isVerifiedUser, requireRole("Admin"), recordInventoryWastage)
  .get(isVerifiedUser, getInventoryWastageHistory);

router.route("/:id")

  .put(isVerifiedUser, requireRole("Admin"), updateInventoryItem)
  .delete(isVerifiedUser, requireRole("Admin"), deleteInventoryItem);

router.route("/:id/adjust")
  .patch(isVerifiedUser, requireRole("Admin"), adjustInventoryItem);

module.exports = router;
