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

const buildImagePrompt = ({ itemName, style }) => {
    const composition = COMPOSITIONS[crypto.randomInt(COMPOSITIONS.length)];
    const variation = crypto.randomInt(1_000_000, 10_000_000);
    return `Create a premium, photorealistic restaurant advertising photograph featuring exactly this menu item: "${itemName}". Art direction: ${IMAGE_STYLES[style]}. Composition: ${composition}. Creative variation ${variation}: invent a distinctive camera angle, plating arrangement, garnish placement, and lighting. Make it look like a polished high-end fast-food campaign: dramatic warm highlights, rich deep shadows, vivid but natural food colors, crisp appetizing textures, delicious melted cheese or glossy sauce where appropriate, and a cinematic shallow-depth-of-field restaurant background. Show one large hero serving, not a collage. Vertical portrait composition. Absolutely no text, letters, numbers, logos, watermarks, people, hands, or packaging.`;
};

const parseGeneratedImage = (response) => {
    const imageData = response.data?.[0]?.b64_json;
    if (typeof imageData !== "string" || !imageData) {
        const error = new Error("OpenAI did not return a supported image.");
        error.statusCode = 502;
        throw error;
    }

    const imageBytes = Buffer.from(imageData, "base64");
    if (!imageBytes.length || imageBytes.length > 12 * 1024 * 1024) {
        const error = new Error("OpenAI returned an invalid or oversized image.");
        error.statusCode = 502;
        throw error;
    }

    return { data: imageBytes.toString("base64"), mimeType: "image/png" };
};

const requestImage = (apiKey, model, prompt) => new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
        model,
        prompt,
        n: 1,
        size: "1024x1536",
        quality: "high",
        output_format: "png",
    });
    const request = https.request(
        {
            hostname: "api.openai.com",
            path: "/v1/images/generations",
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
            timeout: 120000,
        },
        (response) => {
            const chunks = [];
            let responseBytes = 0;
            response.on("data", (chunk) => {
                responseBytes += chunk.length;
                if (responseBytes > 20 * 1024 * 1024) {
                    request.destroy(new Error("OpenAI returned an oversized response."));
                    return;
                }
                chunks.push(chunk);
            });
            response.on("end", () => {
                let result;
                try {
                    result = JSON.parse(Buffer.concat(chunks).toString("utf8"));
                } catch {
                    reject(new Error("OpenAI returned an invalid response."));
                    return;
                }
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    const error = new Error(result.error?.message || `OpenAI API returned status ${response.statusCode}.`);
                    error.statusCode = response.statusCode;
                    reject(error);
                    return;
                }
                resolve(result);
            });
        }
    );

    request.on("timeout", () => request.destroy(new Error("OpenAI image generation timed out.")));
    request.on("error", reject);
    request.end(requestBody);
});

const generateFoodImage = async ({ itemName, style }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        const error = new Error("OpenAI image generation is not configured. Add OPENAI_API_KEY to the backend environment.");
        error.statusCode = 503;
        throw error;
    }

    const prompt = buildImagePrompt({ itemName, style });
    const response = await requestImage(apiKey, process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst", prompt);
    return parseGeneratedImage(response);
};

module.exports = { IMAGE_STYLES, buildImagePrompt, parseGeneratedImage, generateFoodImage };
