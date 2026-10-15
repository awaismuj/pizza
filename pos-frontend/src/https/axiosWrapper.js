import axios from "axios";

const demoPreview = import.meta.env.DEV && import.meta.env.VITE_POS_DEMO === "true";
const demoOrders = [
  {
    _id: "demo-order-1",
    orderNumber: "DEMO-001",
    orderDate: new Date().toISOString(),
    customerDetails: { name: "Ayesha Khan", phone: "0300 0000000" },
    orderSource: "Dine In",
    orderStatus: "In Progress",
    table: { tableNo: "3" },
    items: [{ name: "Large Pepperoni Pizza", quantity: 2, price: 1200 }],
    bills: { totalWithTax: 2784 },
  },
  {
    _id: "demo-order-2",
    orderNumber: "DEMO-002",
    orderDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    customerDetails: { name: "Hamza Ali", phone: "0300 0000001" },
    orderSource: "Online",
    orderStatus: "Preparing",
    items: [{ name: "Zinger Burger", quantity: 1, price: 650 }],
    bills: { totalWithTax: 754 },
  },
  {
    _id: "demo-order-3",
    orderNumber: "DEMO-003",
    orderDate: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    customerDetails: { name: "Sara Ahmed", phone: "0300 0000002" },
    orderSource: "Dine In",
    orderStatus: "Closed",
    table: { tableNo: "5" },
    items: [{ name: "Chicken Fajita Pizza", quantity: 1, price: 950 }],
    bills: { totalWithTax: 1102 },
  },
];
const demoTables = Array.from({ length: 12 }, (_, index) => ({
  _id: `demo-table-${index + 1}`,
  tableNo: String(index + 1),
  status: index === 2 || index === 7 ? "Booked" : "Available",
  seats: index % 2 === 0 ? 4 : 2,
}));

const demoAdapter = async (config) => {
  if (config.method?.toLowerCase() !== "get") {
    throw new Error("The local demo preview is read-only.");
  }

  const pathname = new URL(config.url, config.baseURL).pathname;
  const responseData = pathname === "/api/order"
    ? { data: demoOrders }
    : pathname === "/api/table"
      ? { data: demoTables }
      : pathname === "/api/settings"
        ? { data: { taxRate: 16 } }
        : { data: [] };

  return {
    data: responseData,
    status: 200,
    statusText: "OK",
    headers: new axios.AxiosHeaders(),
    config,
    request: {},
  };
};

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Prefer an explicit VITE_BACKEND_URL. If not provided (dev), fall back to localhost:3000
const backendBaseURL =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";

export const axiosWrapper = axios.create({
  baseURL: backendBaseURL,
  withCredentials: true,
  headers: { ...defaultHeader },
  ...(demoPreview ? { adapter: demoAdapter } : {}),
});
