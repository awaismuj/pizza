const Razorpay = require("razorpay");
const config = require("../config/config");
const crypto = require("crypto");
const createHttpError = require("http-errors");
const Payment = require("../models/paymentModel");
const PaymentAttempt = require("../models/paymentAttemptModel");
const {
  isValidIdempotencyKey,
  digestIdempotencyKey,
  fingerprintRequest,
} = require("../services/idempotency");

const paymentOrderResponse = (attempt) => ({
  id: attempt.razorpayOrderId,
  amount: attempt.amount,
  currency: attempt.currency,
  receipt: attempt.receipt,
  status: attempt.gatewayStatus,
});

const respondWithExistingAttempt = (res, attempt, requestHash) => {
  if (attempt.requestHash !== requestHash) {
    res.status(409).json({
      success: false,
      code: "IDEMPOTENCY_KEY_REUSED",
      message: "This payment key was already used with a different amount.",
    });
  } else if (attempt.status === "ready") {
    res.status(200).json({ success: true, order: paymentOrderResponse(attempt) });
  } else if (attempt.status === "failed") {
    res.status(409).json({
      success: false,
      code: "PAYMENT_ATTEMPT_FAILED",
      message: "The previous payment setup failed. Start a new payment attempt.",
    });
  } else {
    res.status(409).json({
      success: false,
      code: "PAYMENT_ATTEMPT_IN_PROGRESS",
      message: "Payment setup is still in progress. Please wait and try again.",
    });
  }
};

const signaturesMatch = (expected, actual) => {
  if (
    typeof actual !== "string" ||
    actual.length !== expected.length ||
    actual.length % 2 !== 0 ||
    !/^[a-f\d]+$/i.test(actual)
  ) return false;
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");
  return expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

const createOrder = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    const amountPaisa = Math.round(amount * 100);
    const idempotencyKey = req.get("Idempotency-Key");
    if (!isValidIdempotencyKey(idempotencyKey)) {
      throw createHttpError(400, "A valid Idempotency-Key header is required for payment setup.");
    }
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(amountPaisa)) {
      throw createHttpError(400, "A valid positive payment amount is required.");
    }

    const idempotencyKeyHash = digestIdempotencyKey(idempotencyKey, config.idempotencySecret, "pos-payment-key");
    const requestHash = fingerprintRequest(
      { amount: amountPaisa },
      req.user?._id,
      config.idempotencySecret,
      "pos-payment-request"
    );
    const existingAttempt = await PaymentAttempt.findOne({ idempotencyKeyHash });
    if (existingAttempt) {
      return respondWithExistingAttempt(res, existingAttempt, requestHash);
    }

    const receipt = `pos_${idempotencyKeyHash.slice(0, 32)}`;
    let attempt;
    try {
      attempt = await PaymentAttempt.create({
        idempotencyKeyHash,
        requestHash,
        createdBy: req.user._id,
        status: "creating",
        amount: amountPaisa,
        currency: "PKR",
        receipt,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;
      const racedAttempt = await PaymentAttempt.findOne({ idempotencyKeyHash });
      if (!racedAttempt) throw error;
      return respondWithExistingAttempt(res, racedAttempt, requestHash);
    }

    const razorpay = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpaySecretKey,
    });
    const options = {
      amount: amountPaisa,
      currency: "PKR",
      receipt,
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (error) {
      attempt.status = "failed";
      await attempt.save();
      console.error("Razorpay order creation failed:", error.message);
      return next(createHttpError(502, "The payment provider could not set up this payment. Please start a new attempt."));
    }

    attempt.status = "ready";
    attempt.razorpayOrderId = order.id;
    attempt.amount = order.amount;
    attempt.currency = order.currency;
    attempt.gatewayStatus = order.status;
    await attempt.save();
    res.status(200).json({ success: true, order: paymentOrderResponse(attempt) });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    if (!config.razorpaySecretKey) {
      throw createHttpError(503, "Payment verification is not configured.");
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    if (![razorpay_order_id, razorpay_payment_id].every((value) => typeof value === "string" && value.length > 0)) {
      throw createHttpError(400, "A payment order and payment ID are required.");
    }

    const expectedSignature = crypto
      .createHmac("sha256", config.razorpaySecretKey)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (signaturesMatch(expectedSignature, razorpay_signature)) {
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      const error = createHttpError(400, "Payment verification failed!");
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

const validateRazorpayPaymentAmount = async ({ paymentData, expectedAmount }) => {
  const orderId = paymentData?.razorpay_order_id;
  const paymentId = paymentData?.razorpay_payment_id;
  if (!orderId || !paymentId || !Number.isFinite(expectedAmount)) {
    throw createHttpError(400, "Verified payment details are required for a coupon order paid online.");
  }
  const razorpay = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpaySecretKey,
  });
  let payment;
  try {
    payment = await razorpay.payments.fetch(paymentId);
  } catch (error) {
    throw createHttpError(502, "Could not confirm the online payment amount. Please verify the payment before retrying.");
  }
  if (
    payment.order_id !== orderId
    || payment.currency !== "PKR"
    || Number(payment.amount) !== Math.round(expectedAmount * 100)
    || !["authorized", "captured"].includes(payment.status)
  ) {
    throw createHttpError(400, "The verified payment amount does not match the recalculated coupon order total.");
  }
};

const webHookVerification = async (req, res, next) => {
  try {
    const secret = config.razorpyWebhookSecret;
    const signature = req.headers["x-razorpay-signature"];
    if (!secret) throw createHttpError(503, "Payment webhook verification is not configured.");
    if (!Buffer.isBuffer(req.body)) {
      throw createHttpError(400, "The payment webhook must be sent as JSON.");
    }
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (!signaturesMatch(expectedSignature, signature)) {
      throw createHttpError(400, "Invalid payment webhook signature.");
    }

    let payload;
    try {
      payload = JSON.parse(req.body.toString("utf8"));
    } catch {
      throw createHttpError(400, "The payment webhook contains invalid JSON.");
    }

    if (payload.event === "payment.captured") {
      const payment = payload.payload?.payment?.entity;
      if (!payment?.id || !payment.order_id || !Number.isFinite(payment.amount)) {
        throw createHttpError(400, "The captured payment event is missing required payment details.");
      }

      try {
        await Payment.updateOne(
          { paymentId: payment.id },
          {
            $setOnInsert: {
              paymentId: payment.id,
              orderId: payment.order_id,
              amount: payment.amount / 100,
              currency: payment.currency,
              status: payment.status,
              method: payment.method,
              email: payment.email,
              contact: payment.contact,
              createdAt: new Date(payment.created_at * 1000),
            },
          },
          { upsert: true, runValidators: true }
        );
      } catch (error) {
        if (error?.code !== 11000 || !(await Payment.exists({ paymentId: payment.id }))) {
          throw error;
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, validateRazorpayPaymentAmount, webHookVerification };
