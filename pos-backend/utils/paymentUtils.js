const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const PaymentProof = require("../models/paymentProofModel");

const { PAYMENT_METHOD_COD, PAYMENT_METHOD_JAZZCASH } = Order;

const WAITING_STATUS = "Payment Pending Verification";

// Defaults mirror the Settings schema, used when an older settings document
// has no `payments` block yet.
const DEFAULT_PAYMENTS = {
  codEnabled: true,
  jazzcashEnabled: true,
  merchantName: "GEN Z FOOD",
  tillId: "984661930",
  dialCode: "*786*10#",
  qrImage: "",
};

const paymentsConfig = (settings) => {
  const raw = settings?.payments?.toObject ? settings.payments.toObject() : settings?.payments || {};
  return { ...DEFAULT_PAYMENTS, ...raw };
};

// What the public storefront is allowed to see.
const publicPaymentsShape = (settings) => paymentsConfig(settings);

// "  txn-12 ab  " -> "TXN12AB"
const normalizeTid = (value) => String(value ?? "").replace(/\s+/g, "").toUpperCase();
const TID_RE = /^[A-Z0-9]{6,30}$/;

const cleanText = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
// Sender's name or phone number: letters (any language), digits, space and . + - '
const SENDER_RE = /^[\p{L}\p{N} .+\-']{3,60}$/u;

// Only genuine PNG/JPEG bytes are accepted — the mimetype sent by the
// browser is trivially forged, the file's first bytes are not.
const sniffImageType = (buf) => {
  if (!Buffer.isBuffer(buf) || buf.length < 12) return null;
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  return null;
};

const maskTid = (tid) => (tid ? `••••${String(tid).slice(-4)}` : "");

// Payment block returned to the customer on the status page (their own
// order only). The TID is masked; the staff-only screenshot is never exposed.
const publicPayment = (order) => ({
  method: order.paymentMethod || PAYMENT_METHOD_COD,
  status: order.paymentStatus || "Pending",
  rejectionReason: order.jazzcash?.rejectionReason || "",
  tid: maskTid(order.jazzcash?.tid),
  amount: order.jazzcash?.amount ?? order.bills?.totalWithTax,
});

const isJazzcashOrder = (order) => order?.paymentMethod === PAYMENT_METHOD_JAZZCASH;

// Validates the payment part of a public checkout request. Throws friendly
// 400/409 errors. Returns what addPublicOrder needs to build the order.
const resolvePublicPayment = async (body, settings) => {
  const cfg = paymentsConfig(settings);
  const wantsJazz = ["jazzcash", "jazzcash/raast", "raast"].includes(String(body.paymentMethod || "").toLowerCase());

  if (!wantsJazz) {
    if (!cfg.codEnabled) throw createHttpError(400, "Cash on Delivery isn't available right now. Please pay via JazzCash / Raast.");
    return { method: PAYMENT_METHOD_COD };
  }

  if (!cfg.jazzcashEnabled) {
    throw createHttpError(400, "JazzCash / Raast payment isn't available right now. Please choose another method.");
  }

  const tid = normalizeTid(body.tid);
  if (!TID_RE.test(tid)) {
    throw createHttpError(400, "Enter the Transaction ID (TID) from your payment confirmation — 6 to 30 letters or digits.");
  }

  const senderInfo = cleanText(body.senderInfo, 60);
  if (!SENDER_RE.test(senderInfo)) {
    throw createHttpError(400, "Enter the sender's name or mobile number (3–60 characters, no special symbols).");
  }

  if (!mongoose.Types.ObjectId.isValid(body.proofId)) {
    throw createHttpError(400, "Please upload your payment screenshot (JPG or PNG, up to 5 MB).");
  }
  const proof = await PaymentProof.findById(body.proofId).select("attached");
  if (!proof || proof.attached) {
    throw createHttpError(400, "Your payment screenshot expired or was already used. Please upload it again.");
  }

  if (await Order.exists({ jazzcashTid: tid })) {
    throw createHttpError(409, "This Transaction ID was already used on another order. Please check the TID, or contact us on WhatsApp.");
  }

  return { method: PAYMENT_METHOD_JAZZCASH, tid, senderInfo, proofId: proof._id };
};

module.exports = {
  WAITING_STATUS,
  DEFAULT_PAYMENTS,
  paymentsConfig,
  publicPaymentsShape,
  normalizeTid,
  TID_RE,
  SENDER_RE,
  cleanText,
  sniffImageType,
  maskTid,
  publicPayment,
  isJazzcashOrder,
  resolvePublicPayment,
};
