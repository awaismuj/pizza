/**
 * ESC/POS Binary Command Generator for Thermal Receipt Printers (80mm & 58mm).
 * Produces standard raw byte buffers for direct TCP socket dispatch.
 */

const ESC = "\x1b";
const GS = "\x1d";

const COMMANDS = {
  INIT: Buffer.from(`${ESC}@`),
  ALIGN_LEFT: Buffer.from(`${ESC}a\x00`),
  ALIGN_CENTER: Buffer.from(`${ESC}a\x01`),
  ALIGN_RIGHT: Buffer.from(`${ESC}a\x02`),
  BOLD_ON: Buffer.from(`${ESC}E\x01`),
  BOLD_OFF: Buffer.from(`${ESC}E\x00`),
  DOUBLE_SIZE: Buffer.from(`${GS}!\x11`),
  NORMAL_SIZE: Buffer.from(`${GS}!\x00`),
  FEED_LINES: (n = 3) => Buffer.from(`${ESC}d${String.fromCharCode(n)}`),
  CUT_FULL: Buffer.from(`${GS}V\x00`),
  CUT_PARTIAL: Buffer.from(`${GS}V\x01`),
  KICK_DRAWER: Buffer.from(`${ESC}p\x00\x19\xfa`),
};

function padRow(left, right, width = 42) {
  const lStr = String(left || "");
  const rStr = String(right || "");
  const spaceCount = Math.max(1, width - lStr.length - rStr.length);
  return lStr + " ".repeat(spaceCount) + rStr;
}

function divider(char = "-", width = 42) {
  return char.repeat(width);
}

/**
 * Generate binary ESC/POS buffer for Customer Cash Receipt
 */
function buildReceiptBuffer(order, storeInfo = {}) {
  const storeName = storeInfo.name || "GEN-Z PIZZA";
  const address = storeInfo.address || "Main Boulevard, Lahore";
  const phone = storeInfo.phone || "0300-1234567";

  const parts = [];
  parts.push(COMMANDS.INIT);
  parts.push(COMMANDS.ALIGN_CENTER);
  parts.push(COMMANDS.BOLD_ON);
  parts.push(COMMANDS.DOUBLE_SIZE);
  parts.push(Buffer.from(`${storeName}\n`));
  parts.push(COMMANDS.NORMAL_SIZE);
  parts.push(COMMANDS.BOLD_OFF);
  parts.push(Buffer.from(`${address}\nTel: ${phone}\n`));
  parts.push(Buffer.from(`${divider("=")}\n`));

  // Order Details
  parts.push(COMMANDS.ALIGN_LEFT);
  const orderId = order._id ? String(order._id).slice(-6).toUpperCase() : "TEMP";
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleString("en-PK", {
    dateStyle: "short",
    timeStyle: "short",
  });

  parts.push(Buffer.from(padRow(`Order: #${orderId}`, order.orderType || "Dine-in") + "\n"));
  parts.push(Buffer.from(padRow(`Date: ${dateStr}`, order.tableNo ? `Table: ${order.tableNo}` : "") + "\n"));
  if (order.customerDetails?.name) {
    parts.push(Buffer.from(`Customer: ${order.customerDetails.name} (${order.customerDetails.phone || ""})\n`));
  }
  parts.push(Buffer.from(`${divider("-")}\n`));
  parts.push(Buffer.from(padRow("ITEM", "QTY x PRICE   TOTAL") + "\n"));
  parts.push(Buffer.from(`${divider("-")}\n`));

  // Line items
  const items = order.items || [];
  items.forEach((item) => {
    const title = item.name || item.title || "Item";
    const qty = item.quantity || 1;
    const price = Number(item.price || 0);
    const lineTotal = qty * price;
    parts.push(COMMANDS.BOLD_ON);
    parts.push(Buffer.from(`${title}\n`));
    parts.push(COMMANDS.BOLD_OFF);
    const detailCol = `${qty} x Rs.${price}`;
    parts.push(Buffer.from(padRow(`  ${detailCol}`, `Rs.${lineTotal}`) + "\n"));
  });

  parts.push(Buffer.from(`${divider("-")}\n`));

  // Totals
  const subtotal = Number(order.bills?.subtotal || order.subTotal || 0);
  const tax = Number(order.bills?.tax || order.tax || 0);
  const discount = Number(order.bills?.discount || order.discount || 0);
  const total = Number(order.bills?.total || order.totalPrice || 0);

  parts.push(Buffer.from(padRow("Subtotal:", `Rs.${subtotal.toFixed(0)}`) + "\n"));
  if (tax > 0) {
    parts.push(Buffer.from(padRow("Sales Tax:", `Rs.${tax.toFixed(0)}`) + "\n"));
  }
  if (discount > 0) {
    parts.push(Buffer.from(padRow("Discount:", `-Rs.${discount.toFixed(0)}`) + "\n"));
  }
  parts.push(COMMANDS.BOLD_ON);
  parts.push(Buffer.from(padRow("NET TOTAL:", `Rs.${total.toFixed(0)}`) + "\n"));
  parts.push(COMMANDS.BOLD_OFF);

  // Split or Standard Payment Breakdown
  parts.push(Buffer.from(`${divider("-")}\n`));
  if (order.paymentMethod === "Split" && Array.isArray(order.splitPayments) && order.splitPayments.length > 0) {
    parts.push(Buffer.from("Payment: Multi-Instrument Split\n"));
    order.splitPayments.forEach((p) => {
      parts.push(Buffer.from(padRow(`  ${p.method}:`, `Rs.${Number(p.amount || 0).toFixed(0)}`) + "\n"));
    });
  } else {
    parts.push(Buffer.from(padRow("Payment Method:", order.paymentMethod || "Cash") + "\n"));
  }

  // Footer & Cash Drawer Kick
  parts.push(COMMANDS.ALIGN_CENTER);
  parts.push(Buffer.from(`${divider("=")}\n`));
  parts.push(Buffer.from("Thank you for your visit!\nPlease come again.\n\n"));

  parts.push(COMMANDS.KICK_DRAWER);
  parts.push(COMMANDS.FEED_LINES(4));
  parts.push(COMMANDS.CUT_PARTIAL);

  return Buffer.concat(parts);
}

/**
 * Generate binary ESC/POS buffer for Kitchen Order Ticket (KOT)
 */
function buildKitchenTicketBuffer(order) {
  const parts = [];
  parts.push(COMMANDS.INIT);
  parts.push(COMMANDS.ALIGN_CENTER);
  parts.push(COMMANDS.BOLD_ON);
  parts.push(COMMANDS.DOUBLE_SIZE);
  parts.push(Buffer.from("--- KITCHEN TICKET ---\n"));
  parts.push(COMMANDS.NORMAL_SIZE);

  const orderId = order._id ? String(order._id).slice(-6).toUpperCase() : "NEW";
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleTimeString("en-PK", {
    timeStyle: "medium",
  });

  parts.push(Buffer.from(`Ticket: #${orderId}  |  ${dateStr}\n`));
  if (order.tableNo) {
    parts.push(COMMANDS.DOUBLE_SIZE);
    parts.push(Buffer.from(`TABLE: ${order.tableNo}\n`));
    parts.push(COMMANDS.NORMAL_SIZE);
  } else {
    parts.push(Buffer.from(`ORDER TYPE: ${order.orderType || "TAKEAWAY"}\n`));
  }
  parts.push(COMMANDS.BOLD_OFF);
  parts.push(Buffer.from(`${divider("=", 42)}\n`));

  parts.push(COMMANDS.ALIGN_LEFT);
  const items = order.items || [];
  items.forEach((item) => {
    const qty = item.quantity || 1;
    const title = item.name || item.title || "Item";
    parts.push(COMMANDS.BOLD_ON);
    parts.push(COMMANDS.DOUBLE_SIZE);
    parts.push(Buffer.from(`[${qty}]  ${title}\n`));
    parts.push(COMMANDS.NORMAL_SIZE);
    parts.push(COMMANDS.BOLD_OFF);

    if (item.customizations || item.notes || item.selectedOptions) {
      const note = item.customizations || item.notes || JSON.stringify(item.selectedOptions);
      parts.push(Buffer.from(`     * Special: ${note}\n`));
    }
  });

  parts.push(Buffer.from(`${divider("=", 42)}\n`));
  parts.push(COMMANDS.FEED_LINES(4));
  parts.push(COMMANDS.CUT_PARTIAL);

  return Buffer.concat(parts);
}

module.exports = {
  buildReceiptBuffer,
  buildKitchenTicketBuffer,
};
