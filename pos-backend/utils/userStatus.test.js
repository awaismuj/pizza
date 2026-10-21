const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeApprovalStatus } = require("./userStatus");

test("normalizes approval statuses regardless of casing or surrounding whitespace", () => {
  assert.equal(normalizeApprovalStatus("approved"), "Approved");
  assert.equal(normalizeApprovalStatus(" PENDING "), "Pending");
  assert.equal(normalizeApprovalStatus("Rejected"), "Rejected");
});

test("leaves unknown statuses unchanged for schema validation to reject", () => {
  assert.equal(normalizeApprovalStatus("enabled"), "enabled");
  assert.equal(normalizeApprovalStatus(undefined), undefined);
});
