const express = require("express");
const { generatePosterImage, generateFullPoster } = require("../controllers/posterController");
const posterGenerationRateLimit = require("../middlewares/posterGenerationRateLimit");

const router = express.Router();

router.post("/generate", posterGenerationRateLimit, generatePosterImage);
router.post("/design", posterGenerationRateLimit, generateFullPoster);

module.exports = router;
