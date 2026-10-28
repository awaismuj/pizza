const test = require("node:test");
const assert = require("node:assert/strict");
const customerPhoneKey = require("./customerPhoneKey");
const customerPhoneKeyCandidates = require("./customerPhoneKeyCandidates");

test("legacy customer phone keys cover local and international Pakistan formats", () => {
  const expected = [
    "03013310954",
    "923013310954",
    "00923013310954",
  ].map(customerPhoneKey);

  assert.deepEqual(
    customerPhoneKeyCandidates("3013310954").sort(),
    [...new Set(expected)].sort()
  );
});
