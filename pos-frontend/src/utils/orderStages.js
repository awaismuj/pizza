// One place that describes how an order moves through the shop, so every
// screen (Orders, Online Orders, Home, Dashboard) speaks the same language.
//
//  Dine-in / takeaway (POS):  In Progress -> Ready -> Closed
//  Online (genzpizza.online): Pending -> Accepted -> Preparing -> Ready to Deliver -> Completed
//  Either can be Cancelled (stock is returned to inventory by the backend).

export const DINE_IN_STAGES = ["In Progress", "Ready", "Closed"];
export const ONLINE_STAGES = ["Pending", "Accepted", "Preparing", "Ready to Deliver", "Completed"];
// Online order paid by JazzCash/Raast QR: staff verify the money first.
export const PAYMENT_WAITING = "Payment Pending Verification";
export const PAID_ONLINE_STAGES = [PAYMENT_WAITING, "Accepted", "Preparing", "Ready to Deliver", "Completed"];

// Friendly names shown to staff.
export const STAGE_LABELS = {
  "In Progress": "Processing",
  Ready: "Ready",
  Closed: "Completed",
  Pending: "New",
  [PAYMENT_WAITING]: "Verify Payment",
  Accepted: "Accepted",
  Preparing: "Processing",
  "Ready to Deliver": "Ready to Deliver",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

// The single "next step" button for each status.
export const NEXT_ACTION = {
  // dine-in
  "In Progress": { to: "Ready", label: "Mark Ready" },
  Ready: { to: "Closed", label: "Complete Order" },
  // online
  Pending: { to: "Accepted", label: "Accept" },
  Accepted: { to: "Preparing", label: "Send to Processing" },
  Preparing: { to: "Ready to Deliver", label: "Mark Ready to Deliver" },
  "Ready to Deliver": { to: "Completed", label: "Mark Completed" },
};

export const TERMINAL_STATUSES = ["Closed", "Completed", "Cancelled"];

export const stagesFor = (order) => {
  if (order?.orderSource !== "Online") return DINE_IN_STAGES;
  return order?.paymentMethod === "JazzCash/Raast" ? PAID_ONLINE_STAGES : ONLINE_STAGES;
};

// Tailwind classes for the little status pill.
export const statusPillClass = (status) => {
  switch (status) {
    case "Ready":
    case "Ready to Deliver":
      return "text-green-500 bg-[#2e4a40]";
    case "Closed":
    case "Completed":
      return "text-blue-400 bg-[#1d2a44]";
    case "Cancelled":
      return "text-red-500 bg-[#3b1d1d]";
    case "Pending":
    case PAYMENT_WAITING:
      return "text-orange-400 bg-[#4a3a2e]";
    default:
      return "text-yellow-500 bg-[#4a452e]";
  }
};
