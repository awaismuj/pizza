const permissions = [
  ["dashboard.view", "View dashboard"],
  ["orders.view", "View orders"],
  ["orders.create", "Create orders"],
  ["orders.edit", "Edit order items"],
  ["orders.update", "Edit orders and status"],
  ["orders.cancel", "Cancel orders"],
  ["kitchen.update", "Update kitchen preparation status"],
  ["orders.delete", "Delete orders"],
  ["orders.viewDeleted", "View deleted-order history"],
  ["payments.process", "Process payments"],
  ["payments.refund", "Issue refunds"],
  ["tables.view", "View tables"],
  ["tables.manage", "Manage tables"],
  ["tables.delete", "Delete tables"],
  ["menu.view", "View menu"],
  ["menu.create", "Create menu items"],
  ["menu.edit", "Edit menu items"],
  ["menu.changePrice", "Change dish prices"],
  ["menu.delete", "Delete menu items"],
  ["categories.manage", "Manage categories"],
  ["deals.manage", "Manage deals"],
  ["hero.manage", "Manage hero slides"],
  ["inventory.view", "View inventory"],
  ["inventory.manage", "Add and edit inventory"],
  ["inventory.adjust", "Adjust stock"],
  ["inventory.delete", "Delete inventory items"],
  ["expenses.view", "View expenses"],
  ["expenses.create", "Create expenses"],
  ["expenses.delete", "Delete expenses"],
  ["finance.view", "View profit and financial summaries"],
  ["reports.view", "View and export reports"],
  ["reports.manage", "Manage report delivery"],
  ["settings.view", "View settings"],
  ["settings.manage", "Manage restaurant settings"],
  ["users.view", "View employee accounts"],
  ["users.create", "Create employee accounts"],
  ["users.edit", "Edit employee accounts"],
  ["users.deactivate", "Activate or deactivate accounts"],
  ["users.delete", "Delete employee accounts"],
  ["users.resetPassword", "Reset employee passwords"],
  ["users.assignRole", "Assign roles"],
  ["users.managePermissions", "Manage permissions"],
  ["users.manageRoles", "Create and edit custom roles"],
  ["users.viewAudit", "View user activity logs"],
  ["users.manageSecurity", "Manage sensitive account security"],
  ["assets.view", "View assets"],
  ["assets.manage", "Manage assets"],
  ["assets.financial", "Manage asset valuations and financial settings"],
  ["assets.export", "Export asset reports"],
  ["assets.viewValuation", "View asset valuation and depreciation"],
  ["staff.view", "View staff"],
  ["staff.manage", "Manage staff and attendance"],
  ["attendance.view", "View attendance"],
  ["attendance.manage", "Manage attendance"],
  ["hr.view", "View HR records"],
  ["hr.manage", "Manage HR records"],
  ["payroll.view", "View payroll"],
  ["payroll.manage", "Manage payroll"],
  ["payroll.settings", "Manage payroll settings"],
  ["payroll.compensation", "Edit employee compensation"],
  ["payroll.adjust", "Manage payroll adjustments"],
  ["api.access", "Access unclassified protected APIs"],
];

const allPermissions = permissions.map(([key]) => key);
const standardAdminPermissions = allPermissions.filter(
  (key) => !["users.manageSecurity"].includes(key)
);

const roleDefaults = {
  "super admin": allPermissions,
  admin: standardAdminPermissions,
  cashier: [
    "dashboard.view", "orders.view", "orders.create", "orders.edit", "orders.update", "orders.cancel", "orders.delete",
    "payments.process", "tables.view", "tables.manage", "menu.view",
    "inventory.view", "expenses.view", "expenses.create", "staff.view",
    "attendance.view", "attendance.manage",
  ],
  waiter: [
    "orders.view", "orders.create", "orders.update",
    "tables.view", "tables.manage", "menu.view",
  ],
  "kitchen staff": ["orders.view", "kitchen.update"],
  accountant: [
    "dashboard.view", "orders.view", "payments.process", "finance.view",
    "reports.view", "expenses.view", "expenses.create", "assets.view",
    "assets.manage", "assets.financial", "assets.export", "assets.viewValuation",
    "staff.view", "payroll.view", "payroll.manage",
  ],
  "asset manager": ["dashboard.view", "assets.view", "assets.manage"],
  "read only": ["dashboard.view", "orders.view", "menu.view", "assets.view", "assets.export", "assets.viewValuation"],
  "hr manager": ["dashboard.view", "staff.view", "staff.manage", "attendance.view", "attendance.manage", "hr.view", "hr.manage"],
  "payroll manager": ["dashboard.view", "staff.view", "hr.view", "payroll.view", "payroll.manage", "payroll.settings", "payroll.compensation", "payroll.adjust"],
  employee: [],
};

const routePermission = (baseUrl, path, method, body = {}, user = {}, effectivePermissions = []) => {
  const verb = method.toUpperCase();
  const route = path.replace(/\/+$/, "") || "/";
  if (baseUrl === "/api/user") {
    if (route === "/management") return verb === "GET" ? "users.view" : "users.create";
    if (route === "/permissions") return "users.view";
    if (route === "/roles" && verb === "GET") return "users.view";
    if (route === "/roles" && verb !== "GET") return "users.manageRoles";
    if (route === "/audit") return "users.viewAudit";
    if (route === "/me" && verb === "PATCH") return "users.edit";
    if (route === "/me/password") return null;
    if (route === "/" || route === "/logout") return null;
    if (route.startsWith("/management/")) {
      if (route.endsWith("/reset-password")) return "users.resetPassword";
      if (route.endsWith("/permissions")) return "users.managePermissions";
      if (route.endsWith("/role")) return "users.assignRole";
      if (route.endsWith("/status")) return "users.deactivate";
      if (verb === "DELETE") return "users.delete";
      if (verb === "GET") return "users.view";
      return "users.edit";
    }
  }
  if (baseUrl === "/api/order") {
    if (route === "/deleted/list") return "orders.viewDeleted";
    if (route === "/" && verb === "POST") return "orders.create";
    if (route === "/" && verb === "GET") return "orders.view";
    if (verb === "GET") return "orders.view";
    if (verb === "PUT" && reqBodyOrderCancelled(body)) return "orders.cancel";
    if (verb === "PUT" && body.orderStatus &&
        (String(user.role || "").toLowerCase() === "kitchen staff" ||
          (effectivePermissions.includes("kitchen.update") && !effectivePermissions.includes("orders.update")))) {
      return "kitchen.update";
    }
    if (verb === "PUT" && Array.isArray(body.items)) return "orders.edit";
    if (verb === "PUT" || verb === "PATCH") return "orders.update";
    if (verb === "DELETE") return "orders.delete";
  }
  if (baseUrl === "/api/payment") return "payments.process";
  if (baseUrl === "/api/table") {
    if (verb === "DELETE") return "tables.delete";
    if (verb === "GET") return "tables.view";
    return "tables.manage";
  }
  if (baseUrl === "/api/category") return verb === "GET" ? "menu.view" : "categories.manage";
  if (baseUrl === "/api/dish") {
    if (verb === "GET") return "menu.view";
    if (verb === "POST") return "menu.create";
    if (verb === "DELETE") return "menu.delete";
    return "menu.edit";
  }
  if (baseUrl === "/api/deal") return verb === "GET" ? "menu.view" : "deals.manage";
  if (baseUrl === "/api/hero-slide") return verb === "GET" ? "menu.view" : "hero.manage";
  if (baseUrl === "/api/inventory") {
    if (verb === "GET") return "inventory.view";
    if (verb === "DELETE") return "inventory.delete";
    if (route.endsWith("/adjust")) return "inventory.adjust";
    return "inventory.manage";
  }
  if (baseUrl === "/api/expense") {
    if (verb === "GET") return "expenses.view";
    if (verb === "DELETE") return "expenses.delete";
    return "expenses.create";
  }
  if (baseUrl === "/api/profit") return "finance.view";
  if (baseUrl === "/api/report") return route === "/download" ? "reports.view" : "reports.manage";
  if (baseUrl === "/api/settings") return verb === "GET" ? null : "settings.manage";
  if (baseUrl === "/api/assets") {
    if (route.includes("/export")) return "assets.export";
    if (route === "/settings" && verb === "PUT") return "assets.financial";
    if (["/depreciation/run"].includes(route) || /\/(valuation|adjustment|disposal)$/.test(route)) return "assets.financial";
    if (route.endsWith("/depreciation")) return "assets.viewValuation";
    if (verb === "GET") return "assets.view";
    return "assets.manage";
  }
  if (baseUrl === "/api/staff") {
    if (String(user.role || "").toLowerCase() === "employee" &&
        (route.startsWith("/hr/staff/") || route.startsWith("/hr/documents/"))) return null;
    if (route.startsWith("/hr/me")) return null;
    if (route.startsWith("/attendance")) return verb === "GET" ? "attendance.view" : "attendance.manage";
    if (route.startsWith("/hr/payroll") || route.startsWith("/salary/") || route === "/salary/paid" ||
        route === "/adjustment" || route.startsWith("/adjustment/")) {
      if (route === "/hr/payroll/policy" && verb !== "GET") return "payroll.settings";
      if (route === "/adjustment" || route.startsWith("/adjustment/")) return "payroll.adjust";
      return verb === "GET" ? "payroll.view" : "payroll.manage";
    }
    if (route === "/hr/overtime") return verb === "GET" ? ["hr.view", "payroll.view"] : "hr.manage";
    if (route.startsWith("/hr/reports")) return ["hr.view", "payroll.view", "reports.view"];
    if (route.startsWith("/hr/")) return verb === "GET" ? "hr.view" : "hr.manage";
    if (verb === "GET") return "staff.view";
    return "staff.manage";
  }
  if (baseUrl === "/api/upload") return "menu.edit";
  if (baseUrl === "/api/music") return "settings.view";
  if (baseUrl === "/api/reviews") return "settings.manage";
  return "api.access";
};

const reqBodyOrderCancelled = (path) => {
  return Boolean(path && path.orderStatus === "Cancelled");
};

const getEffectivePermissions = (user, role = null) => {
  const roleKey = String(user.role || "").trim().toLowerCase();
  const rolePermissions = role?.permissions || roleDefaults[roleKey] || [];
  const granted = new Set([...rolePermissions, ...(user.permissionOverrides?.granted || [])]);
  for (const denied of user.permissionOverrides?.denied || []) granted.delete(denied);
  return [...granted];
};

module.exports = { permissions, allPermissions, roleDefaults, routePermission, getEffectivePermissions };
