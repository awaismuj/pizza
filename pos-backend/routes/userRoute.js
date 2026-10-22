const express = require("express");
const {
    register, login, getUserData, logout, approveUser, rejectUser,
    listUsers, getManagedUser, createManagedUser, updateManagedUser,
    changeUserRole, updateUserPermissions, updateUserStatus, deleteManagedUser,
    resetManagedPassword, changeOwnPassword, listRoles, saveRole, listAuditLogs,
    getPermissionCatalog,
} = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();


// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout)
router.route("/management").get(isVerifiedUser, listUsers).post(isVerifiedUser, createManagedUser);
router.route("/management/:id").get(isVerifiedUser, getManagedUser).put(isVerifiedUser, updateManagedUser);
router.route("/management/:id/role").patch(isVerifiedUser, changeUserRole);
router.route("/management/:id/permissions").patch(isVerifiedUser, updateUserPermissions);
router.route("/management/:id/status").patch(isVerifiedUser, updateUserStatus);
router.route("/management/:id").delete(isVerifiedUser, deleteManagedUser);
router.route("/management/:id/reset-password").post(isVerifiedUser, resetManagedPassword);
router.route("/roles").get(isVerifiedUser, listRoles).post(isVerifiedUser, saveRole);
router.route("/audit").get(isVerifiedUser, listAuditLogs);
router.route("/permissions").get(isVerifiedUser, getPermissionCatalog);
router.route("/me/password").patch(isVerifiedUser, changeOwnPassword);

// Clicked from the admin's approval email — no auth required, the random
// token in the URL is what authorizes the action.
router.route("/approve/:id/:token").get(approveUser);
router.route("/reject/:id/:token").get(rejectUser);

router.route("/").get(isVerifiedUser , getUserData);

module.exports = router;