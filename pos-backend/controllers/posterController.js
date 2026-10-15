const createHttpError = require("http-errors");
const { IMAGE_STYLES, generateFoodImage } = require("../services/geminiImageService");

const generatePosterImage = async (req, res, next) => {
    const itemName = typeof req.body?.itemName === "string" ? req.body.itemName.trim() : "";
    const style = req.body?.style;

    if (!itemName || itemName.length > 80) {
        return next(createHttpError(400, "Enter a food name no longer than 80 characters."));
    }
    if (!Object.hasOwn(IMAGE_STYLES, style)) {
        return next(createHttpError(400, "Choose a supported image style."));
    }

    try {
        const image = await generateFoodImage({ itemName, style });
        res.json({ data: image });
    } catch (error) {
        if (error.statusCode === 429) {
            return next(createHttpError(429, "Gemini's generation quota is busy or exhausted. Check the Google AI Studio quota and try again later."));
        }
        if (error.statusCode === 400 || error.statusCode === 403) {
            console.error("Gemini image request was rejected:", error.message);
            return next(createHttpError(502, "Gemini rejected the request. Check the backend API key, model access, and quota."));
        }
        if (error.statusCode === 503) {
            return next(createHttpError(503, error.message));
        }
        console.error("Gemini image generation failed:", error.message);
        return next(createHttpError(502, "Gemini image generation failed. Please try again."));
    }
};

module.exports = { generatePosterImage };
