const test = require("node:test");
const assert = require("node:assert/strict");
const { getEffectivePermissions, roleDefaults, routePermission } = require("./rbac");

test("role permissions are combined with user overrides and explicit denials win", () => {
  const effective = getEffectivePermissions({
    role: "Waiter",
    permissionOverrides: {
      granted: ["inventory.view"],
      denied: ["orders.update"],
    },
  });

  assert.ok(effective.includes("orders.create"));
  assert.ok(effective.includes("inventory.view"));
  assert.ok(!effective.includes("orders.update"));
});

test("custom role permissions are the baseline for effective access", () => {
  const effective = getEffectivePermissions(
    { role: "Inventory Manager", permissionOverrides: { granted: [], denied: [] } },
    { permissions: ["inventory.view", "inventory.adjust"] }
  );
  assert.deepEqual(effective.sort(), ["inventory.adjust", "inventory.view"]);
});

test("API policy separates sensitive operations", () => {
  assert.equal(routePermission("/api/inventory", "/item-id/adjust", "PATCH"), "inventory.adjust");
  assert.equal(routePermission("/api/inventory", "/item-id", "PUT"), "inventory.manage");
  assert.equal(routePermission("/api/report", "/download", "GET"), "reports.view");
  assert.equal(routePermission("/api/user", "/management", "POST"), "users.create");
  assert.equal(routePermission("/api/user", "/management/user-id", "DELETE"), "users.delete");
  assert.equal(routePermission("/api/order", "/order-id", "PUT", { orderStatus: "Cancelled" }), "orders.cancel");
  assert.equal(routePermission("/api/table", "/table-id", "DELETE"), "tables.delete");
});

test("coupon endpoints distinguish public validation, staff application, and administration", () => {
  assert.equal(routePermission("/api/category", "/", "GET"), "menu.view");
  assert.equal(routePermission("/api/dish", "/", "GET"), "menu.view");
  assert.equal(routePermission("/api/coupon", "/public/validate", "POST"), null);
  assert.equal(routePermission("/api/coupon", "/public/welcome", "POST"), null);
  assert.equal(routePermission("/api/coupon", "/validate", "POST"), "coupons.apply");
  assert.equal(routePermission("/api/coupon", "/admin", "GET"), "coupons.view");
  assert.equal(routePermission("/api/coupon", "/admin", "POST"), "coupons.manage");
  assert.equal(routePermission("/api/coupon", "/admin/settings", "GET"), "coupons.view");
  assert.equal(routePermission("/api/coupon", "/admin/settings", "PUT"), "coupons.manage");
  assert.equal(routePermission("/api/coupon", "/admin/generate/friday", "POST"), "coupons.manage");
  assert.equal(routePermission("/api/coupon", "/admin/notifications/birthday", "GET"), "coupons.view");
  assert.equal(routePermission("/api/coupon", "/admin/notifications/birthday/id/read", "PATCH"), "coupons.manage");
  assert.ok(roleDefaults.admin.includes("coupons.manage"));
  assert.ok(roleDefaults.cashier.includes("coupons.apply"));
});

test("kitchen role receives preparation-only status permission", () => {
  assert.ok(roleDefaults["kitchen staff"].includes("kitchen.update"));
  assert.ok(!roleDefaults["kitchen staff"].includes("payments.process"));
  assert.equal(
    routePermission("/api/order", "/order-id", "PUT", { orderStatus: "Ready" }, { role: "Kitchen Staff" }, roleDefaults["kitchen staff"]),
    "kitchen.update"
  );
});
