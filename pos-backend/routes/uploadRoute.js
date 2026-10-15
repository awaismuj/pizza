const express = require("express");
const { uploadImage } = require("../controllers/uploadController");
const { handleUpload } = require("../middlewares/uploadMiddleware");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.route("/").post(isVerifiedUser, handleUpload, uploadImage);

module.exports = router;
