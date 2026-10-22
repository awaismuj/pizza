const test = require("node:test");
const assert = require("node:assert/strict");
const { rejectMongoOperators } = require("../middlewares/requestSecurity");

const runMiddleware = (request) => new Promise((resolve) => {
  rejectMongoOperators(request, {}, (error) => resolve(error || null));
});

test("rejects MongoDB operator keys in request data", async () => {
  const error = await runMiddleware({ body: { email: { $ne: null } }, query: {} });
  assert.equal(error.status, 400);
});

test("rejects dotted and prototype-related keys in nested request data", async () => {
  const dotted = await runMiddleware({ body: { profile: { "role.admin": true } }, query: {} });
  const prototype = await runMiddleware({ body: JSON.parse('{"constructor":{"prototype":{"isAdmin":true}}}'), query: {} });
  assert.equal(dotted.status, 400);
  assert.equal(prototype.status, 400);
});

test("allows regular user-submitted data", async () => {
  assert.equal(await runMiddleware({ body: { email: "guest@example.com", items: [{ quantity: 2 }] }, query: {} }), null);
});

test("allows raw request bodies used for verified payment webhooks", async () => {
  assert.equal(await runMiddleware({ body: Buffer.from('{"event":"payment.captured"}'), query: {} }), null);
});

test("allows only Meta verification keys on the WhatsApp campaign webhook", async () => {
  const allowed = await runMiddleware({
    method: "GET",
    path: "/api/whatsapp-campaign/webhook",
    body: {},
    query: { "hub.mode": "subscribe", "hub.verify_token": "test", "hub.challenge": "123" },
  });
  const rejected = await runMiddleware({
    method: "GET",
    path: "/api/whatsapp-campaign/webhook",
    body: {},
    query: { "hub.mode": "subscribe", "$where": "true" },
  });
  assert.equal(allowed, null);
  assert.equal(rejected.status, 400);
});
