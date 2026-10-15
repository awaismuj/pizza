const express = require("express");
const { register, login, getUserData, logout, approveUser, rejectUser } = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();


// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout)

// Clicked from the admin's approval email — no auth required, the random
// token in the URL is what authorizes the action.
router.route("/approve/:id/:token").get(approveUser);
router.route("/reject/:id/:token").get(rejectUser);

router.route("/").get(isVerifiedUser , getUserData);

module.exports = router;