const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const PaymentProof = require("../models/paymentProofModel");
const { deductInventoryForOrderItems, restoreInventoryForOrderItems, totalDeductionCost } = require("./inventoryController");
const { invalidateAvailabilityCache } = require("../utils/stockAvailability");
const { sniffImageType, cleanText, isJazzcashOrder, WAITING_STATUS } = require("../utils/paymentUtils");
const { releaseOrderCoupon } = require("../services/couponService");

// ---- public: screenshot upload --------------------------------------

// Light in-memory throttle: 10 uploads per IP per hour.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_UPLOADS = 10;
const hits = new Map();
const throttled = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_UPLOADS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
};

// POST /api/order/public/payment-proof — no auth (customers have no
// account). Stores the screenshot privately and returns an id the checkout
// then sends along with the order.
const uploadPaymentProof = async (req, res, next) => {
  try {
    if (!req.file) throw createHttpError(400, "Please choose your payment screenshot.");
    if (throttled(req.ip)) throw createHttpError(429, "Too many uploads. Please try again in a little while.");

    const realType = sniffImageType(req.file.buffer);
    if (!realType) throw createHttpError(400, "That file isn't a valid JPG or PNG image.");

    const proof = await PaymentProof.create({
      mimeType: realType,
      size: req.file.size,
      data: req.file.buffer,
      uploaderIp: req.ip || "",
    });

    res.status(201).json({ success: true, data: { proofId: proof._id } });
  } catch (error) {
    next(error);
  }
};

// ---- staff: view screenshot, verify, reject --------------------------

// GET /api/order/:id/payment-proof — Cashier/Admin only.
const getPaymentProof = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) throw createHttpError(404, "Invalid id!");
    const order = await Order.findById(id).select("jazzcash.proofId");
    if (!order?.jazzcash?.proofId) throw createHttpError(404, "No payment screenshot for this order.");
    const proof = await PaymentProof.findById(order.jazzcash.proofId);
    if (!proof) throw createHttpError(404, "Screenshot not found.");

    res.set({
      "Content-Type": proof.mimeType,
      "Content-Length": proof.data.length,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    res.status(200).send(proof.data);
  } catch (error) {
    next(error);
  }
};

const loadWaitingOrder = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw createHttpError(404, "Invalid id!");
  const order = await Order.findById(id);
  if (!order) throw createHttpError(404, "Order not found!");
  if (!isJazzcashOrder(order)) throw createHttpError(400, "This order wasn't paid via JazzCash / Raast.");
  if (order.orderStatus !== WAITING_STATUS || order.paymentStatus !== "Pending") {
    throw createHttpError(400, "This payment has already been handled.");
  }
  return order;
};

const staffRef = (user) => ({ userId: user?._id, name: user?.name || "" });

// PATCH /api/order/:id/payment/verify — money confirmed. Same effect as
// "Accept" on a normal online order (this is the moment stock is actually
// deducted from inventory), plus the payment is marked Verified. If stock
// ran short the error propagates and the order stays awaiting verification.
const verifyPayment = async (req, res, next) => {
  try {
    await loadWaitingOrder(req.params.id); // friendly errors (not found / already handled)

    // Atomically claim the order, so two cashiers pressing "Verify" at the
    // same moment can't both deduct stock.
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, orderStatus: WAITING_STATUS, paymentStatus: "Pending" },
      { $set: { paymentStatus: "Verified", orderStatus: "Accepted" } },
      { new: true }
    );
    if (!order) throw createHttpError(400, "This payment has already been handled.");

    try {
      const deductions = await deductInventoryForOrderItems(order.items || []);
      order.inventoryDeducted = true;
      order.costOfGoods = totalDeductionCost(deductions);
    } catch (stockError) {
      // Not enough stock: put it back to "waiting" so staff can see why and decide.
      await Order.updateOne(
        { _id: order._id },
        { $set: { paymentStatus: "Pending", orderStatus: WAITING_STATUS } }
      );
      throw stockError;
    }

    order.jazzcash.verifiedAt = new Date();
    order.jazzcash.verifiedBy = staffRef(req.user);
    order.statusHistory = [...(order.statusHistory || []), { status: "Accepted", at: new Date() }];
    await order.save();
    invalidateAvailabilityCache();

    res.status(200).json({ success: true, message: "Payment verified. Order accepted.", data: order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/order/:id/payment/reject  { reason } — the order is cancelled,
// the reserved stock is released (it was only reserved, never deducted, so
// invalidating the availability cache gives it back instantly) and the
// customer sees the reason on their order page.
const rejectPayment = async (req, res, next) => {
  try {
    const reason = cleanText(req.body?.reason, 200);
    if (reason.length < 3) throw createHttpError(400, "Please enter a reason for rejecting the payment (at least 3 characters).");

    const order = await loadWaitingOrder(req.params.id);

    if (order.inventoryDeducted) {
      await restoreInventoryForOrderItems(order.items || []);
      order.inventoryDeducted = false;
      order.costOfGoods = 0;
    }

    order.paymentStatus = "Rejected";
    order.jazzcashTid = undefined; // free the TID so the customer can retry with correct details
    order.jazzcash.rejectionReason = reason;
    order.jazzcash.rejectedAt = new Date();
    order.jazzcash.rejectedBy = staffRef(req.user);
    order.orderStatus = "Cancelled";
    order.statusHistory = [...(order.statusHistory || []), { status: "Cancelled", at: new Date() }];
    await order.save();
    if (order.coupon?.couponId) {
      await releaseOrderCoupon(order._id, "Online payment was rejected.");
    }
    invalidateAvailabilityCache();

    res.status(200).json({ success: true, message: "Payment rejected. Order cancelled and stock released.", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadPaymentProof, getPaymentProof, verifyPayment, rejectPayment };
