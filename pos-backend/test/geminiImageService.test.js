const test = require("node:test");
const assert = require("node:assert/strict");
const { buildImagePrompt, findImagePart } = require("../services/geminiImageService");

test("builds a food-photo prompt with the selected art direction and a unique composition", () => {
    const first = buildImagePrompt({ itemName: "Chicken shawarma", style: "cinematic" });
    const second = buildImagePrompt({ itemName: "Chicken shawarma", style: "cinematic" });

    assert.match(first, /Chicken shawarma/);
    assert.match(first, /cinematic close-up food advertising/);
    assert.match(first, /no text, letters, numbers, logos, watermarks/);
    assert.notEqual(first, second);
});

test("extracts generated images from an Interactions API output block", () => {
    const image = findImagePart({
        output: [
            { type: "model_output", content: [{ type: "image", data: "aGVsbG8=", mime_type: "image/png" }] },
        ],
    });

    assert.deepEqual(image, { data: "aGVsbG8=", mimeType: "image/png" });
});

test("does not treat a text-only response as an image", () => {
    assert.equal(findImagePart({ output: [{ type: "text", text: "No image generated" }] }), null);
});
