import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

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
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
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

// Report Endpoints (PDF download / send to WhatsApp)
export const getWhatsappStatus = () => axiosWrapper.get("/api/report/whatsapp-status");
export const downloadReportPdf = (params) =>
  axiosWrapper.get("/api/report/download", { params, responseType: "blob" });
export const sendReportToWhatsapp = (params) => axiosWrapper.post("/api/report/send", params);
export const sendReportToEmail = (params) => axiosWrapper.post("/api/report/send-email", params);
export const retryWhatsappLink = () => axiosWrapper.post("/api/report/whatsapp-retry");
export const unlinkWhatsapp = () => axiosWrapper.post("/api/report/whatsapp-unlink");
export const unlinkWhatsappLink = () => axiosWrapper.post("/api/report/whatsapp-unlink");

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
