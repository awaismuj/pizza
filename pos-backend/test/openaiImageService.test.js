const test = require("node:test");
const assert = require("node:assert/strict");
const { buildImagePrompt, buildPosterPrompt, parseGeneratedImage } = require("../services/openaiImageService");

test("builds a high-quality food-photo prompt with the selected art direction and a unique composition", () => {
    const first = buildImagePrompt({ itemName: "Chicken shawarma", style: "cinematic" });
    const second = buildImagePrompt({ itemName: "Chicken shawarma", style: "cinematic" });

    assert.match(first, /Chicken shawarma/);
    assert.match(first, /cinematic close-up food advertising/);
    assert.match(first, /high-end fast-food campaign/);
    assert.match(first, /no text, letters, numbers, logos, watermarks/);
    assert.notEqual(first, second);
});

test("builds a complete campaign-poster prompt from the supplied offer details", () => {
    const prompt = buildPosterPrompt({
        brand: "Gen-Z Pizza Land",
        headline: "Special Deal",
        tagline: "Good Food, Great Mood",
        items: [{ name: "Large Pizza", quantity: 1 }, { name: "Cold Drink", quantity: 1 }],
        originalPrice: "2,000",
        offerPrice: "1,550",
        phone: "0325-9061006",
        address: "Gojra",
        theme: "Gen-Z Classic",
        textStyle: "Bold Brush",
    });

    assert.match(prompt, /Gen-Z Pizza Land/);
    assert.match(prompt, /Special Deal/);
    assert.match(prompt, /1 x Large Pizza, 1 x Cold Drink/);
    assert.match(prompt, /Rs 2,000/);
    assert.match(prompt, /Rs 1,550/);
    assert.match(prompt, /0325-9061006/);
    assert.match(prompt, /Gojra/);
    assert.match(prompt, /Gen-Z Classic/);
    assert.match(prompt, /Bold brush typography/);
});

test("parses OpenAI's base64 PNG image response", () => {
    assert.deepEqual(
        parseGeneratedImage({ data: [{ b64_json: Buffer.from("png bytes").toString("base64") }] }),
        { data: Buffer.from("png bytes").toString("base64"), mimeType: "image/png" }
    );
});

test("rejects OpenAI responses that contain no generated image", () => {
    assert.throws(
        () => parseGeneratedImage({ data: [] }),
        { message: "OpenAI did not return a supported image.", statusCode: 502 }
    );
});
