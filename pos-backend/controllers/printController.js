const net = require("net");
const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const Settings = require("../models/settingsModel");
const {
  buildReceiptBuffer,
  buildKitchenTicketBuffer,
} = require("../utils/escposEncoder");

/**
 * Dispatch raw ESC/POS buffer to thermal printer over TCP Port (default 9100).
 */
function sendToNetworkPrinter(host, port = 9100, buffer, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    if (!host) {
      return reject(new Error("Printer IP host is not specified."));
    }

    const client = new net.Socket();
    let isFinished = false;

    client.setTimeout(timeoutMs);

    client.connect(port, host, () => {
      client.write(buffer, () => {
        isFinished = true;
        client.end();
        resolve({ success: true, host, port });
      });
    });

    client.on("timeout", () => {
      if (!isFinished) {
        client.destroy();
        reject(new Error(`Printer connection timed out at ${host}:${port}`));
      }
    });

    client.on("error", (err) => {
      if (!isFinished) {
        client.destroy();
        reject(new Error(`Printer socket error (${host}:${port}): ${err.message}`));
      }
    });

    client.on("close", () => {
      if (!isFinished) {
        resolve({ success: true, host, port });
      }
    });
  });
}

// POST /api/print/receipt
const printReceipt = async (req, res, next) => {
  try {
    const { orderId, orderData } = req.body;
    let order = orderData;
    if (!order && orderId) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return next(createHttpError(404, "Order not found for printing."));
    }

    const settings = await Settings.findOne({ key: "global" });
    const printerIp = settings?.printerConfig?.receiptPrinterIp;
    const printerPort = settings?.printerConfig?.receiptPrinterPort || 9100;

    if (!printerIp) {
      return res.status(200).json({
        success: false,
        message: "Receipt printer IP is not configured in Settings. (Fallback to browser print)",
      });
    }

    const buffer = buildReceiptBuffer(order);
    await sendToNetworkPrinter(printerIp, printerPort, buffer);

    res.status(200).json({
      success: true,
      message: `Receipt dispatched to printer at ${printerIp}:${printerPort}`,
    });
  } catch (error) {
    console.error("Print receipt error:", error.message);
    res.status(200).json({
      success: false,
      message: `Failed to print to hardware: ${error.message}. Use browser print fallback.`,
    });
  }
};

// POST /api/print/kitchen
const printKitchenTicket = async (req, res, next) => {
  try {
    const { orderId, orderData } = req.body;
    let order = orderData;
    if (!order && orderId) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return next(createHttpError(404, "Order not found for kitchen ticket."));
    }

    const settings = await Settings.findOne({ key: "global" });
    const printerIp = settings?.printerConfig?.kitchenPrinterIp || settings?.printerConfig?.receiptPrinterIp;
    const printerPort = settings?.printerConfig?.kitchenPrinterPort || 9100;

    if (!printerIp) {
      return res.status(200).json({
        success: false,
        message: "Kitchen printer IP is not configured in Settings.",
      });
    }

    const buffer = buildKitchenTicketBuffer(order);
    await sendToNetworkPrinter(printerIp, printerPort, buffer);

    res.status(200).json({
      success: true,
      message: `Kitchen ticket sent to ${printerIp}:${printerPort}`,
    });
  } catch (error) {
    console.error("Print kitchen ticket error:", error.message);
    res.status(200).json({
      success: false,
      message: `Failed to send to kitchen printer: ${error.message}`,
    });
  }
};

// POST /api/print/test
const testPrinterConnection = async (req, res, next) => {
  try {
    const { ip, port = 9100 } = req.body;
    if (!ip) {
      return next(createHttpError(400, "Printer IP is required for test."));
    }

    const sampleOrder = {
      _id: "TEST-01",
      orderType: "Printer Diagnostics",
      tableNo: "Test",
      customerDetails: { name: "System Admin", phone: "0300-0000000" },
      items: [
        { name: "Raw ESC/POS Test Feed", quantity: 1, price: 0 },
        { name: "Hardware Connection Verified", quantity: 1, price: 0 },
      ],
      bills: { subtotal: 0, tax: 0, total: 0 },
      paymentMethod: "Hardware Test",
    };

    const buffer = buildReceiptBuffer(sampleOrder);
    await sendToNetworkPrinter(ip, port, buffer);

    res.status(200).json({
      success: true,
      message: `Diagnostic test slip printed successfully at ${ip}:${port}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Printer connection failed: ${error.message}`,
    });
  }
};

module.exports = {
  sendToNetworkPrinter,
  printReceipt,
  printKitchenTicket,
  testPrinterConnection,
};
