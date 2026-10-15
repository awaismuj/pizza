const test = require("node:test");
const assert = require("node:assert/strict");
const { buildImagePrompt, parseGeneratedImage } = require("../services/openaiImageService");

test("builds a high-quality food-photo prompt with the selected art direction and a unique composition", () => {
    const first = buildImagePrompt({ itemName: "Chicken shawarma", style: "cinematic" });
    const second = buildImagePrompt({ itemName: "Chicken shawarma", style: "cinematic" });

    assert.match(first, /Chicken shawarma/);
    assert.match(first, /cinematic close-up food advertising/);
    assert.match(first, /high-end fast-food campaign/);
    assert.match(first, /no text, letters, numbers, logos, watermarks/);
    assert.notEqual(first, second);
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
