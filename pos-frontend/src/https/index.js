import { axiosWrapper } from "./axiosWrapper";

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");
export const getManagedUsers = (params) => axiosWrapper.get("/api/user/management", { params });
export const getManagedUser = (userId) => axiosWrapper.get(`/api/user/management/${userId}`);
export const createManagedUser = (data) => axiosWrapper.post("/api/user/management", data);
export const updateManagedUser = ({ userId, ...data }) => axiosWrapper.put(`/api/user/management/${userId}`, data);
export const changeManagedUserRole = ({ userId, role }) => axiosWrapper.patch(`/api/user/management/${userId}/role`, { role });
export const updateManagedUserPermissions = ({ userId, granted, denied }) =>
  axiosWrapper.patch(`/api/user/management/${userId}/permissions`, { granted, denied });
export const updateManagedUserStatus = ({ userId, active }) =>
  axiosWrapper.patch(`/api/user/management/${userId}/status`, { active });
export const deleteManagedUser = (userId) => axiosWrapper.delete(`/api/user/management/${userId}`);
export const resetManagedUserPassword = ({ userId, password, confirmPassword }) =>
  axiosWrapper.post(`/api/user/management/${userId}/reset-password`, { password, confirmPassword });
export const getManagedRoles = () => axiosWrapper.get("/api/user/roles");
export const saveManagedRole = (data) => axiosWrapper.post("/api/user/roles", data);
export const getPermissionCatalog = () => axiosWrapper.get("/api/user/permissions");
export const getUserAuditLogs = (params) => axiosWrapper.get("/api/user/audit", { params });
export const changeOwnPassword = (data) => axiosWrapper.patch("/api/user/me/password", data);

// Table Endpoints
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);
export const deleteTable = (tableId) =>
  axiosWrapper.delete(`/api/table/${tableId}`);

// Settings Endpoints
export const getSettings = () => axiosWrapper.get("/api/settings");
export const updateSettings = (data) => axiosWrapper.put("/api/settings", data);

// Payment Endpoints
const inMemoryPaymentAttempts = new Map();
const paymentAttemptStorageKey = () =>
  `gzp_pos_payment_attempt_${window.location.pathname.replace(/[^a-z0-9]/gi, "_")}`;

export const getPaymentIdempotencyKey = (fingerprint) => {
  const storageKey = paymentAttemptStorageKey();
  const inMemory = inMemoryPaymentAttempts.get(storageKey);
  if (inMemory?.fingerprint === fingerprint) return inMemory.key;
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    if (saved?.fingerprint === fingerprint && typeof saved.key === "string") {
      inMemoryPaymentAttempts.set(storageKey, saved);
      return saved.key;
    }
  } catch {
    // Continue with an in-memory key when browser storage is unavailable.
  }

  const secureCrypto = globalThis.crypto;
  const key = secureCrypto?.randomUUID
    ? secureCrypto.randomUUID()
    : secureCrypto?.getRandomValues
      ? Array.from(secureCrypto.getRandomValues(new Uint8Array(24)), (byte) => byte.toString(16).padStart(2, "0")).join("")
      : "";
  if (!key) throw new Error("Secure random generation is unavailable. Please use a modern browser to take an online payment.");

  const attempt = { fingerprint, key };
  inMemoryPaymentAttempts.set(storageKey, attempt);
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(attempt));
  } catch {
    // The key remains stable in memory for this page session.
  }
  return key;
};

export const clearPaymentIdempotencyKey = () => {
  const storageKey = paymentAttemptStorageKey();
  inMemoryPaymentAttempts.delete(storageKey);
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    // Storage may be unavailable; the next order gets a new key when the page reloads.
  }
};

export const createOrderRazorpay = async (data, idempotencyKey) => {
  try {
    return await axiosWrapper.post("/api/payment/create-order", data, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
  } catch (error) {
    const code = error?.response?.data?.code;
    if (
      error?.response?.status >= 500 ||
      code === "PAYMENT_ATTEMPT_FAILED" ||
      code === "IDEMPOTENCY_KEY_REUSED"
    ) {
      clearPaymentIdempotencyKey();
    }
    throw error;
  }
};
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment/verify-payment", data);

// Category & Dish Endpoints
export const addCategory = (data) => axiosWrapper.post("/api/category/", data);
export const updateCategory = ({ categoryId, ...data }) => axiosWrapper.put(`/api/category/${categoryId}`, data);
export const reorderCategories = (order) => axiosWrapper.post(`/api/category/reorder`, { order });
export const deleteCategory = (categoryId) => axiosWrapper.delete(`/api/category/${categoryId}`);
export const addDish = (data) => axiosWrapper.post("/api/dish/", data);
export const updateDish = ({ dishId, ...data }) => axiosWrapper.put(`/api/dish/${dishId}`, data);
export const reorderDishes = (order) => axiosWrapper.post(`/api/dish/reorder`, { order });
export const deleteDish = (dishId) => axiosWrapper.delete(`/api/dish/${dishId}`);
export const getCategories = () => axiosWrapper.get("/api/category");
export const getDishes = () => axiosWrapper.get("/api/dish");

// Deal (combo/promo) Endpoints
export const getDeals = () => axiosWrapper.get("/api/deal");
export const addDeal = (data) => axiosWrapper.post("/api/deal/", data);
export const updateDeal = ({ dealId, ...data }) => axiosWrapper.put(`/api/deal/${dealId}`, data);
export const toggleDeal = (dealId) => axiosWrapper.patch(`/api/deal/${dealId}/toggle`);
export const reorderDeals = (order) => axiosWrapper.post(`/api/deal/reorder`, { order });
export const deleteDeal = (dealId) => axiosWrapper.delete(`/api/deal/${dealId}`);

// Coupon management and redemption reporting
export const getCoupons = (params) => axiosWrapper.get("/api/coupon", { params });
export const searchCouponCustomerByPhone = (phone) =>
  axiosWrapper.get("/api/coupon/customers/search", { params: { phone } });
export const addCoupon = (data) => axiosWrapper.post("/api/coupon", data);
export const updateCoupon = ({ couponId, ...data }) => axiosWrapper.put(`/api/coupon/${couponId}`, data);
export const archiveCoupon = (couponId) => axiosWrapper.patch(`/api/coupon/${couponId}/archive`);
export const duplicateCoupon = (couponId) => axiosWrapper.post(`/api/coupon/${couponId}/duplicate`);
export const getCouponRedemptions = (params) => axiosWrapper.get("/api/coupon/redemptions", { params });
export const getCouponAssignments = (params) => axiosWrapper.get("/api/coupon/assignments", { params });
export const assignCouponToCustomer = ({ couponId, ...data }) => axiosWrapper.post(`/api/coupon/${couponId}/assign`, data);
export const revokeCustomerCoupon = (assignmentId) => axiosWrapper.patch(`/api/coupon/assignments/${assignmentId}/revoke`);
export const validatePosCoupon = (data) => axiosWrapper.post("/api/coupon/validate-pos", data);
export const checkWelcomeOffer = (data) => axiosWrapper.post("/api/coupon/welcome-offer/check", data);

// Hero Slider (homepage banner) Endpoints
export const getHeroSlides = () => axiosWrapper.get("/api/hero-slide");
export const addHeroSlide = (data) => axiosWrapper.post("/api/hero-slide/", data);
export const updateHeroSlide = ({ slideId, ...data }) => axiosWrapper.put(`/api/hero-slide/${slideId}`, data);
export const toggleHeroSlide = (slideId) => axiosWrapper.patch(`/api/hero-slide/${slideId}/toggle`);
export const reorderHeroSlides = (order) => axiosWrapper.post(`/api/hero-slide/reorder`, { order });
export const deleteHeroSlide = (slideId) => axiosWrapper.delete(`/api/hero-slide/${slideId}`);

// Upload Endpoints

// Phone/camera photos are often 3-10 MB, which is slow on a shop connection
// and is what made the upload look "hung" (and can exceed the server's 5 MB
// limit). Big photos are shrunk in the browser first - 1600px wide is plenty
// for a menu image. SVG/GIF and already-small files are sent untouched.
const MAX_IMAGE_SIDE = 1600;
const SKIP_COMPRESS_BELOW = 300 * 1024;

const prepareImageForUpload = async (file) => {
  try {
    if (!file || !file.type.startsWith("image/")) return file;
    if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
    if (file.size < SKIP_COMPRESS_BELOW) return file;

    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const keepAlpha = file.type === "image/png" || file.type === "image/webp";
    if (!keepAlpha) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    if (bitmap.close) bitmap.close();

    const outType = keepAlpha ? "image/webp" : "image/jpeg";
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, outType, 0.85));
    // Some browsers can't encode webp and hand back a PNG - only use the
    // result if it's the type we asked for and actually smaller.
    if (!blob || blob.type !== outType || blob.size >= file.size) return file;

    const ext = outType === "image/webp" ? "webp" : "jpg";
    const base = (file.name || "image").replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.${ext}`, { type: outType });
  } catch {
    // Anything unexpected (old browser, odd file) - just upload the original.
    return file;
  }
};

export const uploadImage = async (file, onProgress) => {
  const prepared = await prepareImageForUpload(file);
  const formData = new FormData();
  formData.append("image", prepared);
  return axiosWrapper.post("/api/upload", formData, {
    // axios turns a FormData body into JSON when the Content-Type is
    // application/json (the instance default), so name multipart explicitly;
    // the browser still adds the boundary itself.
    headers: { "Content-Type": "multipart/form-data" },
    // Never sit on "Uploading..." forever.
    timeout: 60000,
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
};

// Inventory Endpoints
export const exportInventoryReport = (params) =>
  axiosWrapper.get("/api/inventory/export", { params, responseType: "blob" });
export const getInventoryItems = () => axiosWrapper.get("/api/inventory");
export const addInventoryItem = (data) => axiosWrapper.post("/api/inventory/", data);
export const updateInventoryItem = ({ inventoryId, ...data }) =>
  axiosWrapper.put(`/api/inventory/${inventoryId}`, data);
export const adjustInventoryItem = ({ inventoryId, quantityChange, note }) =>
  axiosWrapper.patch(`/api/inventory/${inventoryId}/adjust`, { quantityChange, note });
export const deleteInventoryItem = (inventoryId) => axiosWrapper.delete(`/api/inventory/${inventoryId}`);

// Expense Endpoints
export const getExpenses = (date) => axiosWrapper.get("/api/expense", { params: { date } });
export const addExpense = (data) => axiosWrapper.post("/api/expense/", data);
export const deleteExpense = (expenseId) => axiosWrapper.delete(`/api/expense/${expenseId}`);

// Profit Endpoints
export const getDailyProfit = (date) => axiosWrapper.get("/api/profit/day", { params: { date } });
export const getMonthlyProfit = (month) => axiosWrapper.get("/api/profit/month", { params: { month } });
// Per-order breakdown behind a day's Daily Profit summary — every order
// placed that day with its own revenue/cost/profit.
export const exportProfitReport = (params) =>
  axiosWrapper.get("/api/profit/export", { params, responseType: "blob" });
export const getDailyOrders = (date) => axiosWrapper.get("/api/profit/day/orders", { params: { date } });

// Report Endpoints (PDF download / email)
export const downloadReportPdf = (params) =>
  axiosWrapper.get("/api/report/download", { params, responseType: "blob" });
export const sendReportToEmail = (params) => axiosWrapper.post("/api/report/send-email", params);

// Admin WhatsApp coupon campaigns (approved WhatsApp template provider only).
export const getCampaignWhatsAppProvider = () => axiosWrapper.get("/api/whatsapp-campaign/provider");
export const getRecentWhatsAppCampaignMessages = (params) => axiosWrapper.get("/api/whatsapp-campaign/messages/recent", { params });
export const getCampaignWhatsAppCustomers = (params) => axiosWrapper.get("/api/whatsapp-campaign/customers", { params });
export const createCampaignWhatsAppContact = (data) => axiosWrapper.post("/api/whatsapp-campaign/customers", data);
export const updateCampaignWhatsAppContact = ({ customerId, ...data }) =>
  axiosWrapper.patch(`/api/whatsapp-campaign/customers/${customerId}`, data);
export const previewWhatsAppCampaign = (data) => axiosWrapper.post("/api/whatsapp-campaign/preview", data);
export const sendWhatsAppCampaignTest = (data) => axiosWrapper.post("/api/whatsapp-campaign/send-test", data);
export const createWhatsAppCampaign = ({ requestKey, ...data }) =>
  axiosWrapper.post("/api/whatsapp-campaign/campaigns", data, { headers: { "Idempotency-Key": requestKey } });
export const getWhatsAppCampaigns = (params) => axiosWrapper.get("/api/whatsapp-campaign/campaigns", { params });
export const getWhatsAppCampaign = (campaignId) => axiosWrapper.get(`/api/whatsapp-campaign/campaigns/${campaignId}`);
export const scanWhatsAppCampaign = (campaignId) => axiosWrapper.post(`/api/whatsapp-campaign/campaigns/${campaignId}/scan`);
export const generateWhatsAppCampaignTokens = (campaignId) => axiosWrapper.post(`/api/whatsapp-campaign/campaigns/${campaignId}/generate-tokens`);
export const getWhatsAppCampaignRecipients = ({ campaignId, ...params }) =>
  axiosWrapper.get(`/api/whatsapp-campaign/campaigns/${campaignId}/recipients`, { params });
export const launchWhatsAppCampaign = ({ campaignId, confirmedEligibleCount }) =>
  axiosWrapper.post(`/api/whatsapp-campaign/campaigns/${campaignId}/launch`, { confirmedEligibleCount });
export const pauseWhatsAppCampaign = (campaignId) => axiosWrapper.post(`/api/whatsapp-campaign/campaigns/${campaignId}/pause`);
export const cancelWhatsAppCampaign = (campaignId) => axiosWrapper.post(`/api/whatsapp-campaign/campaigns/${campaignId}/cancel`);
export const retryWhatsAppCampaignFailures = ({ campaignId, reason }) => axiosWrapper.post(`/api/whatsapp-campaign/campaigns/${campaignId}/retry-failed`, { reason });

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
// JazzCash/Raast payment review (Cashier/Admin). The screenshot is private,
// so it is fetched with the staff cookie and shown from a blob URL.
export const verifyOrderPayment = (orderId) => axiosWrapper.patch(`/api/order/${orderId}/payment/verify`);
export const rejectOrderPayment = ({ orderId, reason }) =>
  axiosWrapper.patch(`/api/order/${orderId}/payment/reject`, { reason });
export const getPaymentProofBlob = (orderId) =>
  axiosWrapper.get(`/api/order/${orderId}/payment-proof`, { responseType: "blob" });
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });
// Edit an order's items (add/remove/change quantity) — Cashier/Admin only,
// enforced server-side. `items` is the FULL replacement item list.
export const updateOrderItems = ({ orderId, items }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { items });
// Preparation countdown: add minutes to ONE order's deadline (Admin/Cashier/
// Waiter, enforced server-side) and the Admin/Cashier performance report.
export const extendPrepTime = ({ orderId, minutes, reason }) =>
  axiosWrapper.patch(`/api/order/${orderId}/prep/extend`, { minutes, reason });
export const getPrepReport = (params) => axiosWrapper.get("/api/order/prep/report", { params });
// Delete an order outright — Admin only, enforced server-side.
export const deleteOrder = (orderId) => axiosWrapper.delete(`/api/order/${orderId}`);

// Low / out-of-stock items (Admin + Cashier). Read-only - feeds the popup.
export const getLowStockItems = () => axiosWrapper.get("/api/inventory/low-stock");

// Deleted-orders audit (Admin)
export const getDeletedOrders = (params) => axiosWrapper.get("/api/order/deleted/list", { params });

// Staff management
export const getStaff = (params) => axiosWrapper.get("/api/staff", { params });
export const addStaff = (data) => axiosWrapper.post("/api/staff", data);
export const updateStaff = ({ staffId, ...data }) => axiosWrapper.put(`/api/staff/${staffId}`, data);
export const deactivateStaff = (staffId) => axiosWrapper.delete(`/api/staff/${staffId}`);
export const getStaffAttendance = (date) => axiosWrapper.get("/api/staff/attendance", { params: { date } });
export const markStaffAttendance = (data) => axiosWrapper.put("/api/staff/attendance", data);
export const getStaffAttendanceHistory = (params) => axiosWrapper.get("/api/staff/attendance/history", { params });
export const getStaffMonthlySummary = (month) => axiosWrapper.get("/api/staff/summary", { params: { month } });
export const addStaffAdjustment = (data) => axiosWrapper.post("/api/staff/adjustment", data);
export const deleteStaffAdjustment = (id) => axiosWrapper.delete(`/api/staff/adjustment/${id}`);
export const setStaffSalaryPaid = (data) => axiosWrapper.put("/api/staff/salary/paid", data);
export const sendStaffSlips = (data) => axiosWrapper.post("/api/staff/salary/slips", data);

// HR, shift, leave, overtime, and locked payroll workflows
export const getHrShifts = () => axiosWrapper.get("/api/staff/hr/shifts");
export const createHrShift = (data) => axiosWrapper.post("/api/staff/hr/shifts", data);
export const assignHrShift = ({ shiftId, ...data }) => axiosWrapper.post(`/api/staff/hr/shifts/${shiftId}/assign`, data);
export const endHrShiftAssignment = (assignmentId, data) =>
  axiosWrapper.patch(`/api/staff/hr/shifts/assignments/${assignmentId}/end`, data);
export const getHrLeaveTypes = () => axiosWrapper.get("/api/staff/hr/leave/types");
export const createHrLeaveType = (data) => axiosWrapper.post("/api/staff/hr/leave/types", data);
export const getHrLeaveRequests = (params) => axiosWrapper.get("/api/staff/hr/leave", { params });
export const getHrLeaveBalances = (params) => axiosWrapper.get("/api/staff/hr/leave/balances", { params });
export const runHrLeaveAccrual = (data) => axiosWrapper.post("/api/staff/hr/leave/accrual/run", data);
export const getHrLoans = () => axiosWrapper.get("/api/staff/hr/loans");
export const reviewHrLoan = ({ loanId, ...data }) => axiosWrapper.patch(`/api/staff/hr/loans/${loanId}`, data);
export const createHrLeaveRequest = (data) => axiosWrapper.post("/api/staff/hr/leave", data);
export const reviewHrLeaveRequest = ({ requestId, ...data }) => axiosWrapper.patch(`/api/staff/hr/leave/${requestId}`, data);
export const getHrOvertime = (params) => axiosWrapper.get("/api/staff/hr/overtime", { params });
export const createHrOvertime = (data) => axiosWrapper.post("/api/staff/hr/overtime", data);
export const reviewHrOvertime = ({ overtimeId, ...data }) => axiosWrapper.patch(`/api/staff/hr/overtime/${overtimeId}`, data);
export const getHrPayrollPolicy = () => axiosWrapper.get("/api/staff/hr/payroll/policy");
export const updateHrPayrollPolicy = (data) => axiosWrapper.put("/api/staff/hr/payroll/policy", data);
export const getHrPayrollRuns = () => axiosWrapper.get("/api/staff/hr/payroll/runs");
export const createHrPayrollPreview = (data) => axiosWrapper.post("/api/staff/hr/payroll/preview", data);
export const transitionHrPayroll = ({ monthKey, ...data }) => axiosWrapper.patch(`/api/staff/hr/payroll/${monthKey}`, data);
export const recordHrSalaryPayment = ({ monthKey, ...data }) => axiosWrapper.put(`/api/staff/hr/payroll/${monthKey}/payment`, data);
export const linkEmployeeAccount = ({ staffId, email }) => axiosWrapper.post(`/api/staff/hr/staff/${staffId}/account`, { email });
export const unlinkEmployeeAccount = (staffId) => axiosWrapper.delete(`/api/staff/hr/staff/${staffId}/account`);
export const getEmployeeSelf = () => axiosWrapper.get("/api/staff/hr/me");
export const getEmployeeAttendanceSelf = (params) => axiosWrapper.get("/api/staff/hr/me/attendance", { params });
export const clockEmployeeAttendance = (action) => axiosWrapper.post("/api/staff/hr/me/attendance/clock", { action });
export const getEmployeeLeaveTypes = () => axiosWrapper.get("/api/staff/hr/me/leave/types");
export const getEmployeeLeaveRequests = () => axiosWrapper.get("/api/staff/hr/me/leave");
export const getEmployeeLeaveBalances = (params) => axiosWrapper.get("/api/staff/hr/me/leave/balances", { params });
export const getEmployeeLoans = () => axiosWrapper.get("/api/staff/hr/me/loans");
export const createEmployeeLoanRequest = (data) => axiosWrapper.post("/api/staff/hr/me/loans", data);
export const getEmployeeNotifications = () => axiosWrapper.get("/api/staff/hr/me/notifications");
export const createEmployeeLeaveRequest = (data) => axiosWrapper.post("/api/staff/hr/me/leave", data);
export const getEmployeeDocuments = () => axiosWrapper.get("/api/staff/hr/me/documents");
export const uploadEmployeeDocument = ({ file, category }) => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("category", category);
  return axiosWrapper.post("/api/staff/hr/me/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
};
export const downloadStaffHrDocument = (documentId) =>
  axiosWrapper.get(`/api/staff/hr/documents/${documentId}/download`, { responseType: "blob" });
export const getStaffHrDocuments = (staffId) => axiosWrapper.get(`/api/staff/hr/staff/${staffId}/documents`);
export const uploadHrStaffDocument = ({ staffId, file, category, visibility }) => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("category", category);
  formData.append("visibility", visibility);
  return axiosWrapper.post(`/api/staff/hr/staff/${staffId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
};
export const archiveStaffHrDocument = (documentId) => axiosWrapper.delete(`/api/staff/hr/documents/${documentId}`);
export const getStaffHrReport = (params) => axiosWrapper.get("/api/staff/hr/reports", { params });
export const exportStaffHrReport = (params) =>
  axiosWrapper.get("/api/staff/hr/reports/export", { params, responseType: "blob" });

// Business asset management
export const getAssets = (params) => axiosWrapper.get("/api/assets", { params });
export const getAsset = (id) => axiosWrapper.get(`/api/assets/${id}`);
export const getAssetDashboard = () => axiosWrapper.get("/api/assets/dashboard");
export const getAssetSettings = () => axiosWrapper.get("/api/assets/settings");
export const updateAssetSettings = (data) => axiosWrapper.put("/api/assets/settings", data);
export const createAsset = (data) => axiosWrapper.post("/api/assets", data);
export const updateAsset = ({ assetId, ...data }) => axiosWrapper.put(`/api/assets/${assetId}`, data);
export const setAssetArchiveStatus = ({ assetId, status }) => axiosWrapper.patch(`/api/assets/${assetId}/archive`, { status });
export const transferAsset = ({ assetId, ...data }) => axiosWrapper.post(`/api/assets/${assetId}/assignment`, data);
export const updateAssetValuation = ({ assetId, ...data }) => axiosWrapper.post(`/api/assets/${assetId}/valuation`, data);
export const addAssetAdjustment = ({ assetId, ...data }) => axiosWrapper.post(`/api/assets/${assetId}/adjustment`, data);
export const addAssetMaintenance = ({ assetId, ...data }) => axiosWrapper.post(`/api/assets/${assetId}/maintenance`, data);
export const updateAssetMaintenance = ({ assetId, maintenanceId, ...data }) =>
  axiosWrapper.patch(`/api/assets/${assetId}/maintenance/${maintenanceId}`, data);
export const recordAssetUsage = ({ assetId, ...data }) => axiosWrapper.post(`/api/assets/${assetId}/usage`, data);
export const disposeAsset = ({ assetId, ...data }) => axiosWrapper.post(`/api/assets/${assetId}/disposal`, data);
export const getAssetDepreciation = (assetId) => axiosWrapper.get(`/api/assets/${assetId}/depreciation`);
export const runAssetDepreciation = (data) => axiosWrapper.post("/api/assets/depreciation/run", data);
export const exportAssetReport = (params) =>
  axiosWrapper.get("/api/assets/reports/export", { params, responseType: "blob" });
export const uploadAssetDocument = (file) => {
  const formData = new FormData();
  formData.append("document", file);
  return axiosWrapper.post("/api/assets/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
};
export const downloadAssetDocument = (filename) =>
  axiosWrapper.get(`/api/assets/documents/${encodeURIComponent(filename)}`, { responseType: "blob" });

// Customer reviews (storefront "Write a Review") — admin moderation.
export const getReviews = () => axiosWrapper.get("/api/review");
export const toggleReview = (reviewId) => axiosWrapper.patch(`/api/review/${reviewId}/toggle`);
export const deleteReview = (reviewId) => axiosWrapper.delete(`/api/review/${reviewId}`);

// Branches + delivery/pickup rules. Same rules are enforced server-side for
// the website and the POS (see pos-backend/utils/fulfillment.js).
export const getBranches = () => axiosWrapper.get("/api/branch");
export const addBranch = (data) => axiosWrapper.post("/api/branch", data);
export const updateBranch = ({ id, ...data }) => axiosWrapper.put(`/api/branch/${id}`, data);
export const deleteBranch = (id) => axiosWrapper.delete(`/api/branch/${id}`);
export const quoteFulfillment = (data) => axiosWrapper.post("/api/branch/quote", data);
