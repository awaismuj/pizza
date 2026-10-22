const createHttpError = require("http-errors");
const { IMAGE_STYLES, generateFoodImage, generatePosterDesign } = require("../services/openaiImageService");

const forwardOpenAIError = (error, next) => {
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
};

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
        return forwardOpenAIError(error, next);
    }
};

const generateFullPoster = async (req, res, next) => {
    const { brand, headline, tagline, items, originalPrice, offerPrice, phone, address, theme, textStyle } = req.body || {};
    const fields = [
        ["brand", brand, 32],
        ["headline", headline, 34],
        ["tagline", tagline, 52],
        ["phone", phone, 24],
        ["address", address, 70],
        ["theme", theme, 32],
        ["text style", textStyle, 32],
    ];
    for (const [name, value, maxLength] of fields) {
        if (typeof value !== "string" || value.length > maxLength) {
            return next(createHttpError(400, `Enter a valid ${name} no longer than ${maxLength} characters.`));
        }
    }
    if (!Array.isArray(items) || items.length < 1 || items.length > 5) {
        return next(createHttpError(400, "A poster must contain between 1 and 5 food items."));
    }
    const validItems = items.every((item) =>
        item &&
        typeof item.name === "string" &&
        item.name.trim().length > 0 &&
        item.name.length <= 48 &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) >= 1 &&
        Number(item.quantity) <= 99
    );
    if (!validItems) {
        return next(createHttpError(400, "Enter a valid name and quantity for every poster item."));
    }
    const validPrice = (price) => price !== "" && Number.isFinite(Number(price)) && Number(price) >= 0;
    if (!validPrice(originalPrice) || !validPrice(offerPrice)) {
        return next(createHttpError(400, "Enter valid, non-negative original and offer prices."));
    }

    try {
        const image = await generatePosterDesign({
            brand,
            headline,
            tagline,
            items: items.map((item) => ({ name: item.name.trim(), quantity: Number(item.quantity) })),
            originalPrice: Number(originalPrice).toLocaleString("en-IN", { maximumFractionDigits: 2 }),
            offerPrice: Number(offerPrice).toLocaleString("en-IN", { maximumFractionDigits: 2 }),
            phone,
            address,
            theme,
            textStyle,
        });
        res.json({ data: image });
    } catch (error) {
        return forwardOpenAIError(error, next);
    }
};

module.exports = { generatePosterImage, generateFullPoster };
