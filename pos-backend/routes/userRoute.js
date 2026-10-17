const express = require("express");
const {
    register,
    login,
    getUserData,
    logout,
    approveUser,
    rejectUser,
    getAllUsers,
    createUserByAdmin,
    updateUser,
    deleteUser,
    updateUserPermissions,
} = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout);

// User & Role Permissions (Admin CRUD)
router.route("/all").get(isVerifiedUser, getAllUsers);
router.route("/create").post(isVerifiedUser, createUserByAdmin);
router.route("/permissions/:id").patch(isVerifiedUser, updateUserPermissions);
router.route("/:id").put(isVerifiedUser, updateUser).delete(isVerifiedUser, deleteUser);

// Clicked from the admin's approval email — no auth required, the random
// token in the URL is what authorizes the action.
router.route("/approve/:id/:token").get(approveUser);
router.route("/reject/:id/:token").get(rejectUser);

router.route("/").get(isVerifiedUser, getUserData);

module.exports = router;