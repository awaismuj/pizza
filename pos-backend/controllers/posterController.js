const createHttpError = require("http-errors");
const { IMAGE_STYLES, generateFoodImage } = require("../services/openaiImageService");

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
            return next(createHttpError(429, "OpenAI image generation rate limit or quota reached. Check your OpenAI API billing and usage limits."));
        }
        if (error.statusCode === 401 || error.statusCode === 403) {
            console.error("OpenAI image request was rejected:", error.message);
            return next(createHttpError(502, "OpenAI rejected the request. Check the backend API key, account billing, and image model access."));
        }
        if (error.statusCode === 400 || error.statusCode === 404) {
            console.error("OpenAI image request was invalid:", error.message);
            return next(createHttpError(502, "OpenAI could not process the image request. Check the configured model and try again."));
        }
        if (error.statusCode === 503) {
            return next(createHttpError(503, error.message));
        }
        console.error("OpenAI image generation failed:", error.message);
        return next(createHttpError(502, "OpenAI image generation failed. Please try again."));
    }
};

module.exports = { generatePosterImage };
