const test = require("node:test");
const assert = require("node:assert/strict");
const { routePermission, roleDefaults } = require("../utils/rbac");

test("requires the dedicated campaign permission and grants it only in default admin roles", () => {
  assert.equal(routePermission("/api/whatsapp-campaign", "/campaigns", "POST"), "whatsapp.campaigns.manage");
  assert.ok(roleDefaults.admin.includes("whatsapp.campaigns.manage"));
  assert.ok(roleDefaults["super admin"].includes("whatsapp.campaigns.manage"));
  assert.ok(!roleDefaults.cashier.includes("whatsapp.campaigns.manage"));
});