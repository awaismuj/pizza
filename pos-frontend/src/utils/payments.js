// Payment helpers shared by the POS screens, filters and receipts.

export const PM_COD = "Cash on Delivery";
export const PM_JAZZ = "JazzCash/Raast";

// "jazz" | "cod" | "pos" (register: Cash / Online)
export const paymentKind = (order) =>
  order?.paymentMethod === PM_JAZZ ? "jazz" : order?.paymentMethod === PM_COD ? "cod" : "pos";

export const paymentKindLabel = (order) =>
  ({ jazz: "JazzCash/Raast", cod: "Cash on Delivery", pos: order?.paymentMethod || "—" })[paymentKind(order)];

// Single line printed on every invoice / receipt.
export const paymentReceiptLine = (order) => {
  if (paymentKind(order) === "jazz") {
    return `Paid via JazzCash/Raast (TID: ${order?.jazzcash?.tid || "-"})`;
  }
  if (paymentKind(order) === "cod") return "Cash on Delivery";
  return order?.paymentMethod ? `Paid: ${order.paymentMethod}` : "";
};

export const paymentStatusOf = (order) => order?.paymentStatus || "";

export const PAYMENT_STATUS_STYLE = {
  Pending: "bg-[#4a3a2e] text-orange-400",
  Verified: "bg-[#1f3f28] text-[#02ca3a]",
  Rejected: "bg-[#3f1f1f] text-[#e6402e]",
};
