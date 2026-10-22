const express = require("express");
const { streamMusic } = require("../controllers/musicController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

const router = express.Router();

router.get("/:fileId", isVerifiedUser, streamMusic);

module.exports = router;
