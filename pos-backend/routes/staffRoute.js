const express = require("express");
const c = require("../controllers/staffController");
const { isVerifiedUser, requireRole } = require("../middlewares/tokenVerification");
const router = express.Router();

// Staff list + attendance: Cashier and Admin. (Salary fields are stripped
// from the staff list for Cashier inside the controller.)
router.get("/", isVerifiedUser, requireRole("Admin", "Cashier"), c.getStaff);
router.get("/attendance", isVerifiedUser, requireRole("Admin", "Cashier"), c.getAttendanceForDay);
router.put("/attendance", isVerifiedUser, requireRole("Admin", "Cashier"), c.markAttendance);
router.get("/attendance/history", isVerifiedUser, requireRole("Admin", "Cashier"), c.getAttendanceHistory);
router.get("/summary", isVerifiedUser, requireRole("Admin", "Cashier"), c.getMonthlySummary);

// Everything below involves salary/money or staff records: Admin only.
router.post("/", isVerifiedUser, requireRole("Admin"), c.addStaff);
router.post("/adjustment", isVerifiedUser, requireRole("Admin"), c.addAdjustment);
router.delete("/adjustment/:id", isVerifiedUser, requireRole("Admin"), c.deleteAdjustment);
router.put("/salary/paid", isVerifiedUser, requireRole("Admin"), c.setSalaryPaid);
router.post("/salary/slips", isVerifiedUser, requireRole("Admin"), c.sendSlips);
router.get("/salary/slip", isVerifiedUser, requireRole("Admin"), c.downloadSlip);
router.put("/:id", isVerifiedUser, requireRole("Admin"), c.updateStaff);
router.delete("/:id", isVerifiedUser, requireRole("Admin"), c.deactivateStaff);

module.exports = router;
