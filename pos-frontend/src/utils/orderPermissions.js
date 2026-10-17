// Order permissions (POS):
//  - Any signed-in staff (Waiter/Cashier/Admin) can create an order and
//    move it forward through its normal stages (In Progress -> Ready ->
//    Closed, or Accepted -> Preparing -> ... for online). That's NOT
//    gated here — it's just the default "next stage" button everyone sees.
//  - Editing an order's items, cancelling it, or deleting a wrongly-entered
//    order (to fix a mistake) is Cashier/Admin only.
//  - A Completed/Closed order can NEVER be deleted, by anyone — it's a
//    finished sale and part of the permanent record.
// Mirrors canEditOrRole()/requireRole("Admin", "Cashier") in the backend's
// orderController.js/orderRoute.js — keep both in sync if this ever changes.
// Order permissions (POS):
const norm = (role) => String(role || "").toLowerCase();

export const canEditOrder = (role) => ["cashier", "admin"].includes(norm(role));
export const canCancelOrder = (role) => ["cashier", "admin"].includes(norm(role));
// Cashier/Admin — but never for a finished order (Completed/Closed).
export const canDeleteOrder = (role, orderStatus) =>
  ["cashier", "admin"].includes(norm(role)) && !["Completed", "Closed"].includes(orderStatus);

// Permission check for access to Manager ERP portal
export const canUserAccessERP = (user) => {
  if (!user) return false;
  const role = norm(user.role);
  if (["admin", "manager", "accountant", "asset manager"].includes(role)) return true;
  if (user.canAccessERP === true || user.permissions?.canAccessERP === true) return true;
  return false;
};

// Granular Permission Matrix Specifications
export const PERMISSION_DEFINITIONS = [
  {
    key: "canAccessERP",
    label: "Manager ERP Portal Switcher",
    description: "Permits switching to the Manager ERP Back Office view",
    category: "System Navigation",
  },
  {
    key: "canManageOrders",
    label: "Order Management & Billing",
    description: "Create, edit items, apply discounts, and advance order stages",
    category: "POS Operations",
  },
  {
    key: "canManageMenu",
    label: "Menu & Dish Catalog Engineering",
    description: "Create/edit categories, dishes, variants, prices, and combos",
    category: "Catalog",
  },
  {
    key: "canManageInventory",
    label: "Inventory & Stock Operations",
    description: "Perform stock takes, log supplier receipts, and mark wastage",
    category: "Inventory",
  },
  {
    key: "canManageStaff",
    label: "Staff Directory, Attendance & Payroll",
    description: "Enroll staff, mark daily attendance, issue advances & pay slips",
    category: "Human Resources",
  },
  {
    key: "canViewFinancials",
    label: "Financial Statements & P&L",
    description: "View daily sales profit, expense ledgers, and cash reconciliation",
    category: "Finance",
  },
  {
    key: "canManageAssets",
    label: "Fixed Asset Management",
    description: "Track restaurant equipment, asset register, and depreciation",
    category: "Assets",
  },
  {
    key: "canManageSettings",
    label: "Tax, Store Banners & System Config",
    description: "Configure GST rates, service charges, promotional banners",
    category: "Configuration",
  },
  {
    key: "canDeleteRecords",
    label: "High-Privilege Void & Record Deletion",
    description: "Authority to delete orders, dishes, or audit logs",
    category: "Security",
  },
];

export const ROLE_DEFAULT_PERMISSIONS = {
  Admin: {
    canAccessERP: true,
    canManageOrders: true,
    canManageMenu: true,
    canManageInventory: true,
    canManageStaff: true,
    canViewFinancials: true,
    canManageAssets: true,
    canManageSettings: true,
    canDeleteRecords: true,
  },
  Manager: {
    canAccessERP: true,
    canManageOrders: true,
    canManageMenu: true,
    canManageInventory: true,
    canManageStaff: true,
    canViewFinancials: true,
    canManageAssets: true,
    canManageSettings: false,
    canDeleteRecords: false,
  },
  Cashier: {
    canAccessERP: false,
    canManageOrders: true,
    canManageMenu: false,
    canManageInventory: false,
    canManageStaff: false,
    canViewFinancials: false,
    canManageAssets: false,
    canManageSettings: false,
    canDeleteRecords: false,
  },
  Accountant: {
    canAccessERP: true,
    canManageOrders: false,
    canManageMenu: false,
    canManageInventory: false,
    canManageStaff: true,
    canViewFinancials: true,
    canManageAssets: true,
    canManageSettings: false,
    canDeleteRecords: false,
  },
  "Asset Manager": {
    canAccessERP: true,
    canManageOrders: false,
    canManageMenu: false,
    canManageInventory: true,
    canManageStaff: false,
    canViewFinancials: false,
    canManageAssets: true,
    canManageSettings: false,
    canDeleteRecords: false,
  },
  Kitchen: {
    canAccessERP: false,
    canManageOrders: true,
    canManageMenu: false,
    canManageInventory: true,
    canManageStaff: false,
    canViewFinancials: false,
    canManageAssets: false,
    canManageSettings: false,
    canDeleteRecords: false,
  },
  Waiter: {
    canAccessERP: false,
    canManageOrders: true,
    canManageMenu: false,
    canManageInventory: false,
    canManageStaff: false,
    canViewFinancials: false,
    canManageAssets: false,
    canManageSettings: false,
    canDeleteRecords: false,
  },
  Rider: {
    canAccessERP: false,
    canManageOrders: true,
    canManageMenu: false,
    canManageInventory: false,
    canManageStaff: false,
    canViewFinancials: false,
    canManageAssets: false,
    canManageSettings: false,
    canDeleteRecords: false,
  },
};

