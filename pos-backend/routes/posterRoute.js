const express = require("express");
const { generatePosterImage } = require("../controllers/posterController");
const posterGenerationRateLimit = require("../middlewares/posterGenerationRateLimit");

const router = express.Router();

router.post("/generate", posterGenerationRateLimit, generatePosterImage);

module.exports = router;
