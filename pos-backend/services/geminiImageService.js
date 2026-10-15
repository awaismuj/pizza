const https = require("https");
const crypto = require("crypto");

const IMAGE_STYLES = Object.freeze({
    photorealistic: "photorealistic restaurant menu photography, beautifully plated and true-to-life",
    cinematic: "cinematic close-up food advertising, dramatic warm highlights and deep shadows",
    overhead: "editorial top-down flat-lay food photography with carefully arranged fresh ingredients",
    street_food: "vibrant street-food photography, energetic market atmosphere and appetizing natural light",
    studio: "clean premium studio food photography, bright softbox lighting and an elegant simple background",
    illustrated: "high-end hand-painted food illustration with rich color, tactile brushwork and premium editorial detail",
});

const COMPOSITIONS = [
    "three-quarter angle, dish centered, shallow depth of field",
    "slightly overhead angle, off-center composition, soft background bokeh",
    "tight hero close-up, crisp texture, directional side lighting",
    "serving platter at a natural dining angle, gentle rim lighting",
    "dynamic diagonal composition, fresh garnish and subtle ingredient details",
    "front three-quarter angle, warm ambient restaurant light, layered depth",
];

const findImagePart = (value, visited = new Set()) => {
    if (!value || typeof value !== "object" || visited.has(value)) return null;
    visited.add(value);

    const image = value.output_image || value.outputImage || value;
    const data = image.data || image.inline_data?.data || image.inlineData?.data;
    const mimeType = image.mime_type || image.mimeType || image.inline_data?.mime_type || image.inlineData?.mimeType;
    if (typeof data === "string" && typeof mimeType === "string" && mimeType.startsWith("image/")) {
        return { data, mimeType };
    }

    for (const child of Object.values(value)) {
        const result = findImagePart(child, visited);
        if (result) return result;
    }
    return null;
};

const buildImagePrompt = ({ itemName, style }) => {
    const composition = COMPOSITIONS[crypto.randomInt(COMPOSITIONS.length)];
    const variation = crypto.randomInt(1_000_000, 10_000_000);
    return `Create one original food advertisement photograph featuring exactly this menu item: "${itemName}". Art direction: ${IMAGE_STYLES[style]}. Composition: ${composition}. Creative variation ${variation}: use a fresh camera angle, plating arrangement, garnish placement, and lighting from other generations. Make the food look freshly prepared, appetizing, detailed, and realistic. Portrait crop, restaurant advertising quality. Show only food and simple background; absolutely no text, letters, numbers, logos, watermarks, people, or packaging.`;
};

const requestImage = (apiKey, model, prompt) => new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({ model, input: prompt, store: false });
    const request = https.request(
        {
            hostname: "generativelanguage.googleapis.com",
            path: "/v1beta/interactions",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
                "x-goog-api-key": apiKey,
            },
            timeout: 90000,
        },
        (response) => {
            const chunks = [];
            let responseBytes = 0;
            response.on("data", (chunk) => {
                responseBytes += chunk.length;
                if (responseBytes > 16 * 1024 * 1024) {
                    request.destroy(new Error("Gemini returned an oversized response."));
                    return;
                }
                chunks.push(chunk);
            });
            response.on("end", () => {
                let result;
                try {
                    result = JSON.parse(Buffer.concat(chunks).toString("utf8"));
                } catch {
                    reject(new Error("Gemini returned an invalid response."));
                    return;
                }
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    const error = new Error(`Gemini API returned status ${response.statusCode}.`);
                    error.statusCode = response.statusCode;
                    reject(error);
                    return;
                }
                resolve(result);
            });
        }
    );

    request.on("timeout", () => request.destroy(new Error("Gemini image generation timed out.")));
    request.on("error", reject);
    request.end(requestBody);
});

const generateFoodImage = async ({ itemName, style }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        const error = new Error("Gemini image generation is not configured. Add GEMINI_API_KEY to the backend environment.");
        error.statusCode = 503;
        throw error;
    }

    const prompt = buildImagePrompt({ itemName, style });
    const response = await requestImage(apiKey, process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-lite-image", prompt);
    const image = findImagePart(response);
    if (!image || !["image/png", "image/jpeg", "image/webp"].includes(image.mimeType)) {
        const error = new Error("Gemini did not return a supported image.");
        error.statusCode = 502;
        throw error;
    }

    const imageBytes = Buffer.from(image.data, "base64");
    if (!imageBytes.length || imageBytes.length > 12 * 1024 * 1024) {
        const error = new Error("Gemini returned an invalid or oversized image.");
        error.statusCode = 502;
        throw error;
    }

    return { data: imageBytes.toString("base64"), mimeType: image.mimeType };
};

module.exports = { IMAGE_STYLES, buildImagePrompt, findImagePart, generateFoodImage };
