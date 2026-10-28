const createHttpError = require("http-errors");
const config = require("../config/config");
const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const DeletedOrderLog = require("../models/deletedOrderLogModel");
const Dish = require("../models/dishModel");
const Deal = require("../models/dealModel");
const { default: mongoose } = require("mongoose");
const { deductInventoryForOrderItems, restoreInventoryForOrderItems, totalDeductionCost } = require("./inventoryController");
const { isDealLiveNow } = require("./dealController");
const { findOrderShortages, shortageMessage, invalidateAvailabilityCache } = require("../utils/stockAvailability");
const { getOrCreateSettings } = require("./settingsController");
const { normalizeByoConfig, byoDiscountPercent } = require("../utils/byoDiscount");
const { generateOrderNumber } = require("../utils/orderNumber");
const PaymentProof = require("../models/paymentProofModel");
const Branch = require("../models/branchModel");
const { quoteFulfillment } = require("../utils/fulfillment");
const {
  resolveCouponItems,
  validateCoupon,
  reserveCoupon,
  releaseOrderCoupon,
  redeemOrderCoupon,
} = require("../services/couponService");
const {
  PREP_READY_STATUSES,
  buildPrepForNewOrder,
  planExtension,
  prepNow,
  computePrepStats,
} = require("../utils/prepTimer");
const { stampDueAlerts } = require("../services/prepAlertScheduler");
const {
  isValidIdempotencyKey,
  digestIdempotencyKey,
  fingerprintRequest,
} = require("../services/idempotency");
const {
  WAITING_STATUS,
  resolvePublicPayment,
  publicPayment,
  isJazzcashOrder,
} = require("../utils/paymentUtils");

const VALID_ORDER_STATUSES = Order.ORDER_STATUSES;
// Statuses that free up the dine-in table this order was sitting at.
const TABLE_RELEASE_STATUSES = ["Closed", "Completed", "Cancelled"];
// Once an order lands in one of these, its lifecycle is over - no further
// status changes are accepted (prevents double-restoring inventory, e.g. by
// cancelling an already-cancelled/completed order twice).
const TERMINAL_STATUSES = ["Closed", "Completed", "Cancelled"];

// Order permissions (POS):
//  - Any signed-in staff (Waiter/Cashier/Admin) can create an order and
//    move it forward through its normal stages (In Progress -> Ready ->
//    Closed, or Accepted -> Preparing -> ... for online).
//  - Editing an order's items, or cancelling it, is Cashier/Admin only.
//  - Deleting an order outright is Admin only (see the DELETE route).
const canEditOrder = (req) =>
  req.permissions?.includes("orders.edit") ||
  ["cashier", "admin"].includes(String(req.user?.role || "").toLowerCase());

const canCancelOrder = (req) =>
  req.permissions?.includes("orders.cancel") ||
  ["cashier", "admin"].includes(String(req.user?.role || "").toLowerCase());

const publicOrderResponse = (order) => {
  const orderData = order.toObject ? order.toObject() : order;
  delete orderData.idempotencyKeyHash;
  delete orderData.idempotencyRequestHash;
  if (orderData.coupon) {
    delete orderData.coupon.couponId;
  }
  return {
    success: true,
    message: isJazzcashOrder(order)
      ? "Order received! We'll verify your payment and confirm shortly."
      : "Order placed! You'll see live status updates here.",
    data: { ...orderData, payment: publicPayment(order), jazzcash: undefined, jazzcashTid: undefined, prep: undefined },
  };
};

const publicCouponSnapshot = (coupon) => coupon?.code ? {
  code: coupon.code,
  name: coupon.name,
  discountType: coupon.discountType,
  discountValue: coupon.discountValue,
  discountAmount: coupon.discountAmount,
  eligibleSubtotal: coupon.eligibleSubtotal,
} : undefined;

const addOrder = async (req, res, next) => {
  let deductions = [];
  let inventoryRestored = false;
  let couponReservationCreated = false;
  let order;
  try {
    const orderPayload = req.body;
    const couponCode = orderPayload.couponCode;
    delete orderPayload.couponCode;
    const couponOrderItems = couponCode ? await resolveCouponItems(orderPayload.items) : null;

    // Dine-in / POS orders are only created once staff confirm them at the
    // register, so stock is committed immediately (unlike online orders,
    // which defer this until Accept - see addPublicOrder below).
    // Optional fulfillment (delivery/pickup) from the POS: same rules as the
    // website, except staff can ring orders up outside opening hours.
    if (orderPayload.fulfillment?.method) {
      const f = orderPayload.fulfillment;
      const fb = mongoose.Types.ObjectId.isValid(f.branchId) ? await Branch.findById(f.branchId) : null;
      const q = quoteFulfillment({
        branch: fb,
        method: f.method,
        zoneId: f.zoneId,
        subtotal: couponOrderItems
          ? couponOrderItems.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          : Number(orderPayload.bills?.total) || 0,
        staff: true,
      });
      if (!q.ok) return next(createHttpError(400, q.error));
      orderPayload.fulfillment = {
        method: q.method, branchId: fb._id, branchName: fb.name, zoneId: q.zoneId || undefined,
        zoneName: q.zoneName || undefined, deliveryFee: q.fee, minOrder: q.minOrder,
        estimatedMinutes: { min: q.etaMin, max: q.etaMax }, estimatedAt: q.readyAt,
      };
      orderPayload.bills = {
        ...orderPayload.bills,
        deliveryFee: q.fee,
        totalWithTax: (Number(orderPayload.bills?.totalWithTax) || 0) + q.fee,
      };
    }
    deductions = await deductInventoryForOrderItems(orderPayload.items || []);

    // The countdown is the server's to set - never trust one from the browser.
    const settings = await getOrCreateSettings();
    delete orderPayload.prep;

    order = new Order({
      ...orderPayload,
      inventoryDeducted: true,
    });
    const prep = buildPrepForNewOrder(settings.orderPrep, { source: order.orderSource || "POS" });
    if (prep) order.prep = prep;
    order.orderNumber = await generateOrderNumber(order.orderDate || new Date());
    order.costOfGoods = totalDeductionCost(deductions);
    if (couponCode) {
      const orderType = String(
        orderPayload.orderType || orderPayload.fulfillment?.method || (orderPayload.table ? "dineIn" : "pickup")
      );
      const subtotal = couponOrderItems.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = Number(orderPayload.fulfillment?.deliveryFee) || 0;
      const validation = await validateCoupon({
        code: couponCode,
        items: couponOrderItems.items,
        orderType,
        deliveryFee,
        customerId: orderPayload.customerId || null,
        phone: orderPayload.customerDetails?.phone || "",
        hasPromotion: couponOrderItems.hasPromotion,
      });
      const total = Math.max(0, Math.round((subtotal - validation.discountAmount) * 100) / 100);
      const settings = await getOrCreateSettings();
      const tax = (total * settings.taxRatePercent) / 100;
      let quotedDeliveryFee = deliveryFee;
      if (order.fulfillment) {
        const branch = await Branch.findById(order.fulfillment.branchId);
        const finalQuote = quoteFulfillment({
          branch,
          method: order.fulfillment.method,
          zoneId: order.fulfillment.zoneId,
          subtotal: total,
          staff: true,
        });
        if (!finalQuote.ok) throw createHttpError(400, finalQuote.error);
        quotedDeliveryFee = finalQuote.fee;
      }
      const finalDeliveryFee = Math.max(0, quotedDeliveryFee - validation.deliveryDiscount);
      orderPayload.items = couponOrderItems.items.map((item, index) => ({
        ...orderPayload.items[index],
        dishId: item.dishId,
        categoryId: item.categoryId,
        name: item.name,
        price: item.price * item.quantity,
        pricePerQuantity: item.price,
        quantity: item.quantity,
      }));
      order.items = orderPayload.items;
      order.bills = {
        ...orderPayload.bills,
        total,
        tax,
        totalWithTax: total + tax + finalDeliveryFee,
        subtotal,
        couponDiscount: validation.discountAmount,
        couponDeliveryDiscount: validation.deliveryDiscount,
        deliveryFee: finalDeliveryFee,
      };
      if (order.fulfillment) order.fulfillment.deliveryFee = finalDeliveryFee;
      order.coupon = {
        couponId: validation.coupon._id,
        code: validation.coupon.code,
        name: validation.coupon.name,
        discountType: validation.coupon.discountType,
        discountValue: validation.coupon.discountValue,
        discountAmount: validation.totalDiscount,
        eligibleSubtotal: validation.eligibleSubtotal,
        subtotalBeforeDiscount: subtotal,
        totalBeforeDiscount: subtotal + (subtotal * settings.taxRatePercent) / 100 + quotedDeliveryFee,
        totalAfterDiscount: total + tax + finalDeliveryFee,
        orderType,
        appliedAt: new Date(),
      };
      await reserveCoupon({
        validation,
        order,
        subtotal,
        finalTotal: order.bills.totalWithTax,
      });
      couponReservationCreated = true;
    }
    // Seed the timeline with the status this order was created at (whatever
    // the POS sent, e.g. "In Progress") so the very first stage has a time
    // too, not just the ones after it.
    order.statusHistory = [{ status: order.orderStatus, at: order.orderDate || new Date() }];
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    if (couponReservationCreated && order?._id) {
      await releaseOrderCoupon(order._id, "Order creation failed.").catch((releaseError) => {
        console.error("Failed to release coupon reservation after order creation error:", releaseError.message);
      });
    }
    if (deductions.length > 0 && !inventoryRestored) {
      await restoreInventoryForOrderItems(req.body.items || []).catch((restoreError) => {
        console.error("Failed to restore inventory after order creation error:", restoreError);
      });
    }
    next(error);
  }
};

// Public endpoint (no auth) — a customer placing an order from
// genzpizza.online. Prices are recalculated from the live dish price list
// server-side so a customer can't tamper with totals from the browser.
// Inventory is NOT deducted yet — that happens when staff Accept the order,
// so a customer can't hold stock hostage by never checking out.
const addPublicOrder = async (req, res, next) => {
  let couponReservationCreated = false;
  let order;
  try {
    const couponCode = req.body?.couponCode;
    const idempotencyKey = req.get("Idempotency-Key");
    if (!isValidIdempotencyKey(idempotencyKey)) {
      throw createHttpError(400, "A valid Idempotency-Key header is required for checkout.");
    }
    const idempotencyKeyHash = digestIdempotencyKey(idempotencyKey, config.idempotencySecret);
    const idempotencyRequestHash = fingerprintRequest(req.body, req.customer?._id, config.idempotencySecret);
    const priorOrder = await Order.findOne({
      orderSource: "Online",
      idempotencyKeyHash,
    }).select("+idempotencyRequestHash");
    if (priorOrder) {
      if (priorOrder.idempotencyRequestHash !== idempotencyRequestHash) {
        throw createHttpError(409, "This checkout key was already used with different order details. Please review your order.");
      }
      return res.status(200).json(publicOrderResponse(priorOrder));
    }

    const {
      customerName,
      customerPhone,
      address,
      items,
      fulfillment: fulfillmentInput,
    } = req.body;
    const effectiveCustomerName = req.customer?.name || customerName;
    const effectiveCustomerPhone = req.customer?.phone || customerPhone;

    if (!effectiveCustomerName || !effectiveCustomerPhone || !Array.isArray(items) || items.length === 0) {
      const error = createHttpError(400, "Name, phone, and at least one item are required.");
      return next(error);
    }

    // Mobile numbers only - reject anything that isn't mostly digits (e.g.
    // someone bypassing the frontend and posting to this endpoint directly).
    // 10-13 digits covers local (03xxxxxxxxx) and +92 international formats.
    const phoneDigits = effectiveCustomerPhone.replace(/\D/g, "");
    if (!/^\+?[\d\s-]+$/.test(effectiveCustomerPhone) || phoneDigits.length < 10 || phoneDigits.length > 13) {
      const error = createHttpError(400, "Enter a valid mobile number.");
      return next(error);
    }

    const resolvedItems = [];
    let total = 0;
    // Build Your Own Deal: lines the customer flagged `byo: true` (picked
    // inside the "Build your own deal" builder). Counted in units, so 2 pizzas
    // + 1 fries = 3 items. The discount only ever applies to THESE lines -
    // anything else in the cart is charged at its normal price.
    let byoUnits = 0;
    let byoSubtotal = 0;

    // Prices (and, for deals, whether the promo is even still running) are
    // always recalculated server-side from the live menu/deal list — a
    // customer's browser is never trusted for money-affecting values.
    for (const line of items) {
      if (line.dealId) {
        const deal = await Deal.findById(line.dealId);
        if (!deal) {
          const error = createHttpError(400, "This deal is no longer available.");
          return next(error);
        }
        if (!isDealLiveNow(deal)) {
          const error = createHttpError(
            400,
            `"${deal.name}" isn't available right now — check today's deals and try again.`
          );
          return next(error);
        }
        const quantity = Math.max(1, Number(line.quantity) || 1);

        // For each slot the customer can customize (a pizza's category +
        // flavour + size, say), swap in whatever they actually picked —
        // after re-checking it on the server, never trusting the browser.
        // The deal's price never changes either way; only which real Dish
        // (and which of ITS variants) gets its stock deducted does.
        const selections = line.dealSelections && typeof line.dealSelections === "object" ? line.dealSelections : {};
        const resolvedDealItems = [];
        for (let i = 0; i < deal.items.length; i += 1) {
          const templateItem = deal.items[i];
          if (!templateItem.customizable) {
            resolvedDealItems.push(templateItem.toObject ? templateItem.toObject() : templateItem);
            continue;
          }

          const picked = selections[i] || selections[String(i)];
          const allowed = (templateItem.allowedCategories || []).map((c) => String(c));

          if (!picked || !picked.dishId) {
            const error = createHttpError(400, `Please choose an option for "${templateItem.label}".`);
            return next(error);
          }

          const chosenDish = await Dish.findById(picked.dishId);
          if (!chosenDish || !allowed.includes(String(chosenDish.category))) {
            const error = createHttpError(400, `That choice for "${templateItem.label}" isn't available — please pick again.`);
            return next(error);
          }

          const size = String(picked.size || "").trim();
          const crust = String(picked.crust || "").trim();
          if (chosenDish.variants && chosenDish.variants.length > 0) {
            const matches = chosenDish.variants.some(
              (v) => v.size === size && (v.crust || "") === crust
            );
            if (!matches) {
              const error = createHttpError(400, `Please pick a valid size for "${chosenDish.name}".`);
              return next(error);
            }
          }

          resolvedDealItems.push({
            label: `${size ? size + " " : ""}${chosenDish.name}`,
            quantity: templateItem.quantity,
            dishId: chosenDish._id,
            categoryId: chosenDish.category,
            size,
            crust,
          });
        }

        resolvedItems.push({
          dealId: deal._id,
          name: deal.name,
          price: deal.price,
          quantity,
          isDeal: true,
          dealItems: resolvedDealItems,
        });
        total += deal.price * quantity;
        continue;
      }

      const dish = await Dish.findById(line.dishId || line.id);
      if (!dish) {
        const error = createHttpError(400, `Item not found on the menu.`);
        return next(error);
      }
      const quantity = Math.max(1, Number(line.quantity) || 1);

      // Size/crust-priced items (pizzas, mainly): the exact price always
      // comes from the matching variant on the server, never from
      // whatever the browser sends, so a customer can't order a "Large
      // Stuffed" at the "Small" price by tampering with the request.
      let unitPrice = dish.price;
      let variantLabel = "";
      if (Array.isArray(dish.variants) && dish.variants.length > 0) {
        const wantedSize = String(line.size || "").trim();
        const wantedCrust = String(line.crust || "").trim();
        const match = dish.variants.find(
          (v) => v.size === wantedSize && (v.crust || "") === wantedCrust
        );
        if (!match) {
          const error = createHttpError(
            400,
            `Please choose a valid size${dish.variants.some((v) => v.crust) ? "/crust" : ""} for "${dish.name}".`
          );
          return next(error);
        }
        unitPrice = match.price;
        variantLabel = [match.size, match.crust].filter(Boolean).join(", ");
      }

      const isByo = line.byo === true;
      resolvedItems.push({
        dishId: dish._id,
        categoryId: dish.category,
        name: variantLabel ? `${dish.name} (${variantLabel})` : dish.name,
        price: unitPrice,
        quantity,
        size: variantLabel ? line.size : undefined,
        crust: variantLabel && line.crust ? line.crust : undefined,
        byo: isByo || undefined,
      });
      total += unitPrice * quantity;
      if (isByo) {
        byoUnits += quantity;
        byoSubtotal += unitPrice * quantity;
      }
    }

    // Live stock check against inventory (minus what other not-yet-accepted
    // online orders have already reserved). If the customer asks for 5 but
    // only 4 can be made, tell them exactly that instead of letting the
    // order fail later at the counter.
    const shortages = await findOrderShortages(resolvedItems);
    if (shortages.length > 0) {
      return next(createHttpError(409, shortageMessage(shortages), { data: { shortages } }));
    }

    // Live from Settings (admin-editable via Dashboard > Tax), not the old
    // static env value - this is what makes a tax-rate change apply to
    // every order immediately, without a redeploy.
    const settings = await getOrCreateSettings();
    const { taxRatePercent } = settings;

    // Payment method (Cash on Delivery or JazzCash/Raast QR). Everything the
    // customer sent is re-validated here; the amount to pay is always the
    // server-calculated total, never a number from the browser.
    const payment = await resolvePublicPayment(req.body, settings);
    const isJazz = payment.method === Order.PAYMENT_METHOD_JAZZCASH;

    // Build Your Own Deal: the percentage is ALWAYS recalculated here from the
    // live admin setting and the real item count - never from anything the
    // browser claims - so nobody can post a made-up discount.
    let discount = 0;
    let discountPercent = 0;
    let discountLabel = "";
    if (byoUnits > 0) {
      const byoCfg = normalizeByoConfig(settings.buildYourOwnDeal);
      if (!byoCfg.enabled) {
        return next(createHttpError(400, "Build Your Own Deal isn't available right now - please refresh and try again."));
      }
      if (byoUnits < byoCfg.minItems) {
        return next(
          createHttpError(400, `Build Your Own Deal needs at least ${byoCfg.minItems} items - add ${byoCfg.minItems - byoUnits} more to continue.`)
        );
      }
      discountPercent = byoDiscountPercent(byoUnits, byoCfg);
      discount = Math.round((byoSubtotal * discountPercent) / 100);
      discountLabel = `Build Your Own Deal (${byoUnits} items, ${discountPercent}% off)`;
    }

    const subtotalBeforeDiscount = total;
    total -= discount;
    total = Math.max(0, total);

    // Delivery / pickup: branch, area, fee, minimum order, opening hours and
    // temporary restrictions are all re-checked here from the live branch
    // settings - the browser's idea of the fee is never trusted.
    const fInput = fulfillmentInput && typeof fulfillmentInput === "object" ? fulfillmentInput : {};
    const fBranch = mongoose.Types.ObjectId.isValid(fInput.branchId) ? await Branch.findById(fInput.branchId) : null;
    const fQuote = quoteFulfillment({ branch: fBranch, method: fInput.method, zoneId: fInput.zoneId, subtotal: total });
    if (!fQuote.ok) return next(createHttpError(400, fQuote.error));
    if (fQuote.method === "delivery" && String(address || "").trim().length < 10) {
      return next(createHttpError(400, "Enter your full delivery address (house, street, landmark)."));
    }
    let deliveryFee = fQuote.fee;
    let couponValidation = null;
    const grossOrderSubtotal = total;
    if (couponCode) {
      couponValidation = await validateCoupon({
        code: couponCode,
        items: resolvedItems,
        orderType: fQuote.method,
        deliveryFee,
        customerId: req.customer?._id || null,
        phone: effectiveCustomerPhone,
        hasPromotion: discount > 0 || resolvedItems.some((item) => item.dealId),
      });
      total = Math.max(0, Math.round((total - couponValidation.discountAmount) * 100) / 100);
      const finalQuote = quoteFulfillment({
        branch: fBranch,
        method: fQuote.method,
        zoneId: fQuote.zoneId,
        subtotal: total,
      });
      if (!finalQuote.ok) return next(createHttpError(400, finalQuote.error));
      deliveryFee = Math.max(0, finalQuote.fee - couponValidation.deliveryDiscount);
    }

    const tax = (total * taxRatePercent) / 100;
    const totalWithTax = total + tax + deliveryFee;

    order = new Order({
      customerDetails: {
        name: effectiveCustomerName,
        phone: effectiveCustomerPhone,
        guests: 1,
        address: fQuote.method === "delivery" ? String(address || "").trim() : "",
      },
      orderStatus: isJazz ? WAITING_STATUS : "Pending",
      orderSource: "Online",
      idempotencyKeyHash,
      idempotencyRequestHash,
      customerId: req.customer?._id || null,
      statusHistory: [{ status: isJazz ? WAITING_STATUS : "Pending", at: new Date() }],
      bills: {
        total,
        tax,
        totalWithTax,
        subtotal: subtotalBeforeDiscount,
        discount,
        discountPercent,
        discountLabel,
        deliveryFee,
        couponDiscount: couponValidation?.discountAmount || 0,
        couponDeliveryDiscount: couponValidation?.deliveryDiscount || 0,
      },
      fulfillment: {
        method: fQuote.method,
        branchId: fBranch._id,
        branchName: fBranch.name,
        zoneId: fQuote.zoneId || undefined,
        zoneName: fQuote.zoneName || undefined,
        deliveryFee,
        minOrder: fQuote.minOrder,
        estimatedMinutes: { min: fQuote.etaMin, max: fQuote.etaMax },
        estimatedAt: fQuote.readyAt,
      },
      items: resolvedItems,
      coupon: couponValidation ? {
        couponId: couponValidation.coupon._id,
        code: couponValidation.coupon.code,
        name: couponValidation.coupon.name,
        discountType: couponValidation.coupon.discountType,
        discountValue: couponValidation.coupon.discountValue,
        discountAmount: couponValidation.totalDiscount,
        eligibleSubtotal: couponValidation.eligibleSubtotal,
        subtotalBeforeDiscount: grossOrderSubtotal,
        totalBeforeDiscount: grossOrderSubtotal + (grossOrderSubtotal * taxRatePercent) / 100 + fQuote.fee,
        totalAfterDiscount: totalWithTax,
        orderType: fQuote.method,
        appliedAt: new Date(),
      } : undefined,
      paymentMethod: payment.method,
      paymentStatus: "Pending",
    });
    order.orderNumber = await generateOrderNumber(order.orderDate || new Date());
    // Preparation countdown starts the moment the order is created (same
    // rule as POS orders), using the admin's current default duration.
    const prep = buildPrepForNewOrder(settings.orderPrep, { source: "Online" });
    if (prep) order.prep = prep;
    if (couponValidation) {
      await reserveCoupon({
        validation: couponValidation,
        order,
        subtotal: grossOrderSubtotal,
        finalTotal: totalWithTax,
      });
      couponReservationCreated = true;
    }

    let paymentProofClaimed = false;
    const saveOrder = async () => {
      if (isJazz) {
        order.jazzcashTid = payment.tid;
        order.jazzcash = {
          tid: payment.tid,
          senderInfo: payment.senderInfo,
          amount: Math.round((total + tax + deliveryFee) * 100) / 100,
          proofId: payment.proofId,
        };
        const proofQuery = PaymentProof.findOneAndUpdate(
          { _id: payment.proofId, attached: false },
          { attached: true },
          { new: true }
        );
        const claimed = await proofQuery;
        if (!claimed) throw createHttpError(400, "Your payment screenshot expired or was already used. Please upload it again.");
        paymentProofClaimed = true;
      }
      await order.save();
      if (isJazz) {
        const proofUpdate = PaymentProof.updateOne({ _id: payment.proofId }, { orderId: order._id });
        await proofUpdate.catch(() => {});
      }
    };

    if (isJazz) {
      try {
        await saveOrder();
      } catch (saveError) {
        if (paymentProofClaimed) {
          try {
            await PaymentProof.updateOne({ _id: payment.proofId }, { attached: false });
          } catch (cleanupError) {
            console.error("Failed to release payment proof after checkout failed:", cleanupError.message);
          }
        }
        if (saveError?.code === 11000 && saveError?.keyPattern?.jazzcashTid) {
          return next(createHttpError(409, "This Transaction ID was already used on another order. Please check the TID, or contact us on WhatsApp."));
        }
        throw saveError;
      }
    } else {
      await saveOrder();
    }
    invalidateAvailabilityCache(); // this order now reserves stock

    res.status(201).json(publicOrderResponse(order));
  } catch (error) {
    if (couponReservationCreated && order?._id) {
      await releaseOrderCoupon(order._id, "Online checkout failed.").catch((releaseError) => {
        console.error("Failed to release coupon reservation after checkout failure:", releaseError.message);
      });
    }
    if (error?.code === 11000 && error?.keyPattern?.idempotencyKeyHash) {
      try {
        const idempotencyKey = req.get("Idempotency-Key");
        const keyHash = digestIdempotencyKey(idempotencyKey, config.idempotencySecret);
        const priorOrder = await Order.findOne({ orderSource: "Online", idempotencyKeyHash: keyHash })
          .select("+idempotencyRequestHash");
        if (priorOrder?.idempotencyRequestHash === fingerprintRequest(req.body, req.customer?._id, config.idempotencySecret)) {
          return res.status(200).json(publicOrderResponse(priorOrder));
        }
        if (priorOrder) {
          return next(createHttpError(409, "This checkout key was already used with different order details. Please review your order."));
        }
      } catch (lookupError) {
        return next(lookupError);
      }
    }
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    if (req.body.orderStatus === "Cancelled" && !canCancelOrder(req)) {
      return next(createHttpError(403, "You do not have permission to cancel orders."));
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Public order-status lookup — used by the "track my order" view on
// genzpizza.online. Deliberately returns only what a customer needs, not
// the full internal order document.
// Public endpoint (no auth) — lets a customer track their order by phone
// number instead of needing the full order ID, since the storefront only
// ever shows them the short 6-character display code. Matches on the last
// 9 digits so it doesn't matter whether they type "+92...", "0300..." etc.
const lookupPublicOrderByPhone = async (req, res, next) => {
  try {
    const { phone } = req.query;

    if (!phone || !phone.trim()) {
      const error = createHttpError(400, "Enter the phone number used at checkout.");
      return next(error);
    }

    const digits = phone.replace(/\D/g, "");
    const suffix = digits.slice(-9);

    if (suffix.length < 7) {
      const error = createHttpError(400, "Enter a valid phone number.");
      return next(error);
    }

    const order = await Order.findOne({
      orderSource: "Online",
      "customerDetails.phone": { $regex: `${suffix}$` },
    }).sort({ orderDate: -1 });

    if (!order) {
      const error = createHttpError(404, "No recent order found for that phone number.");
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: order._id,
        orderStatus: order.orderStatus,
        items: order.items,
        bills: order.bills,
        fulfillment: order.fulfillment,
        customerDetails: { address: order.customerDetails?.address || "" },
        orderDate: order.orderDate,
        coupon: publicCouponSnapshot(order.coupon),
        payment: publicPayment(order),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPublicOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order || order.orderSource !== "Online") {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        _id: order._id,
        orderStatus: order.orderStatus,
        items: order.items,
        bills: order.bills,
        fulfillment: order.fulfillment,
        customerDetails: { address: order.customerDetails?.address || "" },
        orderDate: order.orderDate,
        coupon: publicCouponSnapshot(order.coupon),
        payment: publicPayment(order),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    // Make sure any due prep alerts are stamped even if the background
    // timer isn't running (throttled, idempotent).
    await stampDueAlerts({ throttleMs: 3000 }).catch(() => {});
    const orders = await Order.find().populate("table").sort({ orderDate: -1 });
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

// PUT /api/order/:id — handles two different kinds of update, kept in one
// route because they share the same "load order, check it's still open"
// setup:
//   1. Editing the order's contents (req.body.items present) — add/remove
//      items, change quantities. Cashier/Admin only.
//   2. Moving the order to its next status (req.body.orderStatus) — open to
//      any signed-in staff for the normal forward stages, but Cashier/Admin
//      only for Cancelled.
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    // ---- 1. Editing items ----
    if (Array.isArray(req.body.items)) {
      if (!canEditOrder(req)) {
        const error = createHttpError(403, "Only Cashier or Admin can edit an order's items.");
        return next(error);
      }
      if (order.coupon?.couponId) {
        return next(createHttpError(400, "Orders with an applied coupon cannot be edited. Cancel and create a new order instead."));
      }

      if (TERMINAL_STATUSES.includes(order.orderStatus)) {
        const error = createHttpError(
          400,
          `This order is already ${order.orderStatus.toLowerCase()} and can no longer be edited.`
        );
        return next(error);
      }

      // The customer paid an exact amount — don't change the bill until
      // that payment has been verified or rejected.
      if (order.orderStatus === WAITING_STATUS) {
        return next(createHttpError(400, "Verify or reject the payment first, then the order can be edited."));
      }

      const newItems = req.body.items;
      if (newItems.length === 0) {
        const error = createHttpError(
          400,
          "An order needs at least one item — cancel the order instead of emptying it."
        );
        return next(error);
      }

      // Give back whatever stock this order was holding before, then take
      // out stock for the new item list, exactly like a fresh order would.
      // Online orders that haven't been Accepted yet never held stock in
      // the first place, so nothing is deducted for those until Accept —
      // same rule addPublicOrder/updateOrder(status) already follow.
      const heldStockBefore = order.inventoryDeducted;
      if (heldStockBefore) {
        await restoreInventoryForOrderItems(order.items || []);
      }

      const shouldHoldStock =
        order.orderSource !== "Online" || order.orderStatus !== "Pending";

      let deductions = [];
      try {
        if (shouldHoldStock) {
          deductions = await deductInventoryForOrderItems(newItems);
        }
      } catch (stockError) {
        // Roll back the restore above so inventory isn't left short if the
        // new item list can't actually be fulfilled.
        if (heldStockBefore) {
          await deductInventoryForOrderItems(order.items || []).catch(() => {});
        }
        return next(stockError);
      }

      const lineTotal = (it) =>
        (Number(it?.price) || 0) * Math.max(1, Number(it?.quantity) || 1);
      const subtotalBeforeDiscount = newItems.reduce((sum, it) => sum + lineTotal(it), 0);

      // If this order was placed with a Build Your Own Deal discount, keep
      // giving the percentage it was originally granted on those lines, so a
      // staff edit (swap a drink, add one more item) doesn't silently strip
      // the customer's discount.
      const grantedPercent = Number(order.bills?.discountPercent) || 0;
      const byoSubtotal = newItems.filter((it) => it?.byo).reduce((sum, it) => sum + lineTotal(it), 0);
      const discount = grantedPercent > 0 ? Math.round((byoSubtotal * grantedPercent) / 100) : 0;

      const total = subtotalBeforeDiscount - discount;
      const { taxRatePercent } = await getOrCreateSettings();
      const tax = (total * taxRatePercent) / 100;

      order.items = newItems;
      order.bills = {
        total,
        tax,
        totalWithTax: total + tax,
        subtotal: subtotalBeforeDiscount,
        discount,
        discountPercent: discount > 0 ? grantedPercent : 0,
        discountLabel: discount > 0 ? order.bills?.discountLabel || "" : "",
      };
      order.inventoryDeducted = shouldHoldStock;
      order.costOfGoods = shouldHoldStock ? totalDeductionCost(deductions) : 0;
      await order.save();
      invalidateAvailabilityCache();

      return res.status(200).json({ success: true, message: "Order updated", data: order });
    }

    // ---- 2. Status change ----
    const { orderStatus } = req.body;

    if (!VALID_ORDER_STATUSES.includes(orderStatus)) {
      const error = createHttpError(400, "Invalid order status.");
      return next(error);
    }

    if ((String(req.user?.role || "").toLowerCase() === "kitchen staff" ||
        (req.permissions?.includes("kitchen.update") && !req.permissions?.includes("orders.update"))) &&
        !["Ready", "Preparing", "Ready to Deliver"].includes(orderStatus)) {
      return next(createHttpError(403, "Kitchen staff can only update preparation statuses."));
    }

    // Cancelling is Cashier/Admin only — a Waiter can still move an order
    // forward (In Progress -> Ready, Accepted -> Preparing, etc.) but can't
    // cancel it or edit its items.
    if (orderStatus === "Cancelled" && !canCancelOrder(req)) {
      const error = createHttpError(403, "Only Cashier or Admin can cancel an order.");
      return next(error);
    }

    // Once an order is Closed/Completed/Cancelled its lifecycle is over -
    // reject further status changes so inventory can't be double-restored
    // (e.g. by cancelling an order twice) or a finished order re-opened.
    if (TERMINAL_STATUSES.includes(order.orderStatus)) {
      const error = createHttpError(
        400,
        `This order is already ${order.orderStatus.toLowerCase()} and can no longer be updated.`
      );
      return next(error);
    }

    // A JazzCash/Raast order only moves forward through "Verify & Accept"
    // (see jazzcashController) — never by skipping straight to Accepted,
    // Preparing, etc. Cancelling is still allowed, and counts as a rejection.
    if (order.orderStatus === WAITING_STATUS && orderStatus !== "Cancelled") {
      return next(createHttpError(400, "Verify the payment first (use \"Verify & Accept\" or \"Reject Payment\")."));
    }
    if (order.orderStatus === WAITING_STATUS && orderStatus === "Cancelled") {
      order.paymentStatus = "Rejected";
      // A rejected payment frees its TID, so the customer can order again
      // with a corrected screenshot/TID (the TID stays on jazzcash.tid as the record).
      order.jazzcashTid = undefined;
      order.jazzcash = {
        ...(order.jazzcash?.toObject ? order.jazzcash.toObject() : order.jazzcash),
        rejectionReason: "Order cancelled by the shop.",
        rejectedAt: new Date(),
        rejectedBy: { userId: req.user?._id, name: req.user?.name || "" },
      };
    }
    // Cash on Delivery: the cash is in hand once the order is delivered.
    if (orderStatus === "Completed" && order.orderSource === "Online" && !isJazzcashOrder(order)) {
      order.paymentStatus = "Verified";
    }

    // Staff accepting an online order is the moment stock actually gets
    // committed — if there isn't enough, this throws and the order stays
    // "Pending" so staff can Cancel it or wait for a restock instead.
    if (order.orderSource === "Online" && order.orderStatus === "Pending" && orderStatus === "Accepted") {
      const deductions = await deductInventoryForOrderItems(order.items || []);
      order.inventoryDeducted = true;
      order.costOfGoods = totalDeductionCost(deductions);
    }

    // Cancelling an order (dine-in or online) after stock was already taken
    // out gives that stock back. This covers online orders cancelled after
    // being Accepted/Preparing/etc., and dine-in orders cancelled after
    // being rung in (stock is deducted immediately for those - see addOrder).
    if (orderStatus === "Cancelled" && order.inventoryDeducted) {
      await restoreInventoryForOrderItems(order.items || []);
      order.inventoryDeducted = false;
      order.costOfGoods = 0;
    }

    order.orderStatus = orderStatus;
    order.statusHistory = [...(order.statusHistory || []), { status: orderStatus, at: new Date() }];
    // Kitchen finished: record the real ready time once. This is what stops
    // the countdown and its alerts (they only run for active statuses), and
    // feeds the preparation report. The timer expiring never does this.
    if (PREP_READY_STATUSES.includes(orderStatus) && order.prep?.deadline && !order.prep.readyAt) {
      order.prep.readyAt = prepNow();
    }
    await order.save();
    if (order.coupon?.couponId) {
      if (orderStatus === "Cancelled") {
        await releaseOrderCoupon(order._id, "Order cancelled.");
      } else if (["Closed", "Completed"].includes(orderStatus)) {
        await redeemOrderCoupon(order._id);
      }
    }
    invalidateAvailabilityCache(); // a Pending order accepted/cancelled changes what's reserved

    if (TABLE_RELEASE_STATUSES.includes(orderStatus) && order.table) {
      await Table.findByIdAndUpdate(
        order.table,
        { status: "Available", currentOrder: null },
        { new: true }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/order/:id — Admin only (see the route). Permanently removes
// the order, giving back any stock it was still holding and freeing its
// table first, so deleting one never leaves inventory or a table stuck.
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    // A finished order is part of the sales/profit record — nobody, not
    // even an Admin, can delete it. (Cancelled or still-open orders can.)
    if (["Completed", "Closed"].includes(order.orderStatus)) {
      const error = createHttpError(403, "Completed orders can't be deleted.");
      return next(error);
    }

    // Give stock back first, and remember whether that really happened so
    // the audit record tells the truth.
    let stockReturned = false;
    if (order.inventoryDeducted) {
      try {
        await restoreInventoryForOrderItems(order.items || []);
        stockReturned = true;
      } catch (e) {
        stockReturned = false;
      }
    }
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, { status: "Available", currentOrder: null }).catch(() => {});
    }

    const now = new Date();
    const pad2 = (n) => String(n).padStart(2, "0");
    await DeletedOrderLog.create({
      originalOrderId: order._id,
      orderNumber: order.orderNumber || "",
      orderSource: order.orderSource || "",
      customerDetails: order.customerDetails || {},
      items: order.items || [],
      bills: order.bills || {},
      orderDate: order.orderDate || order.createdAt,
      statusAtDelete: order.orderStatus,
      statusHistory: order.statusHistory || [],
      stockReturned,
      stockReturnedItems: stockReturned
        ? (order.items || []).map((it) => ({ name: it.name, quantity: it.quantity }))
        : [],
      deletedBy: { userId: req.user?._id, name: req.user?.name || "", role: req.user?.role || "" },
      dayKey: `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`,
      deletedAt: now,
    });

    if (order.jazzcash?.proofId) {
      await PaymentProof.deleteOne({ _id: order.jazzcash.proofId }).catch(() => {});
    }
    if (order.coupon?.couponId) await releaseOrderCoupon(order._id, "Order deleted.");
    await order.deleteOne();
    invalidateAvailabilityCache();

    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/order/public/:id/cancel — public (no auth), for a customer
// cancelling their OWN order from the "track my order" page. Deliberately
// narrow: only works while the order is still "Pending", i.e. before staff
// have accepted it and before any stock/kitchen time has been committed.
// Once it's Accepted or later, cancelling is a staff-only action (through
// the authenticated PUT route above) since real work may already be
// underway.
const cancelPublicOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order || order.orderSource !== "Online") {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    if (order.orderStatus === WAITING_STATUS) {
      return next(
        createHttpError(
          400,
          "You've already sent a payment for this order. Please message us on WhatsApp (+923259061006) so we can cancel it and sort out your refund."
        )
      );
    }

    if (order.orderStatus !== "Pending") {
      const error = createHttpError(
        400,
        "This order is already being prepared — please call the shop to cancel it now."
      );
      return next(error);
    }

    order.orderStatus = "Cancelled";
    order.statusHistory = [...(order.statusHistory || []), { status: "Cancelled", at: new Date() }];
    await order.save();
    if (order.coupon?.couponId) await releaseOrderCoupon(order._id, "Customer cancelled the order.");
    invalidateAvailabilityCache();

    res.status(200).json({
      success: true,
      message: "Order cancelled.",
      data: { _id: order._id, orderStatus: order.orderStatus },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/order/deleted/list — Admin only. The audit trail of deleted orders.
const getDeletedOrders = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.dayKey = {};
      if (from) filter.dayKey.$gte = from;
      if (to) filter.dayKey.$lte = to;
    }
    const logs = await DeletedOrderLog.find(filter).sort({ deletedAt: -1 }).limit(500);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/order/:id/prep/extend - add minutes to ONE order's preparation
// deadline. Any signed-in kitchen/POS staff (Admin, Cashier, Waiter) may do
// it; every extension is recorded with who/when/why and the original
// deadline is preserved. Uses a compare-and-set on the previous deadline so
// two terminals extending at once can't silently overwrite each other.
const extendPrepTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(createHttpError(404, "Invalid id!"));

    const settings = await getOrCreateSettings();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const order = await Order.findById(id);
      if (!order) return next(createHttpError(404, "Order not found!"));

      const plan = planExtension(order, req.body?.minutes, {
        reason: req.body?.reason,
        user: req.user,
        settings: settings.orderPrep,
      });
      if (plan.error) return next(createHttpError(plan.status || 400, plan.error));

      const updated = await Order.findOneAndUpdate(
        {
          _id: id,
          "prep.deadline": plan.previousDeadline,
          orderStatus: { $nin: ["Ready", "Ready to Deliver", "Closed", "Completed", "Cancelled"] },
          "prep.readyAt": null,
        },
        {
          $set: {
            "prep.deadline": plan.newDeadline,
            "prep.totalExtensionMinutes": plan.totalExtensionMinutes,
            "prep.alerts": plan.alerts,
          },
          $push: { "prep.extensions": plan.event },
        },
        { new: true }
      );
      if (updated) {
        return res.status(200).json({
          success: true,
          message: `Order #${updated.orderNumber || String(updated._id).slice(-6)} extended by ${plan.minutes} minutes.`,
          data: updated,
        });
      }
      // Someone else changed the deadline/status between our read and write: re-read and retry.
    }
    return next(createHttpError(409, "This order was just updated on another screen - please try again."));
  } catch (error) {
    next(error);
  }
};

// GET /api/order/prep/report?from=YYYY-MM-DD&to=YYYY-MM-DD - Admin/Cashier.
// Only orders that really carry a timer are counted; nothing is estimated
// for older orders.
const getPrepReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = { "prep.deadline": { $exists: true } };
    const parse = (d, end) => {
      if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(String(d))) return null;
      const dt = new Date(`${d}T${end ? "23:59:59.999" : "00:00:00.000"}`);
      return Number.isNaN(dt.getTime()) ? null : dt;
    };
    const f = parse(from, false);
    const t = parse(to, true);
    if (f || t) {
      filter.orderDate = {};
      if (f) filter.orderDate.$gte = f;
      if (t) filter.orderDate.$lte = t;
    }
    const orders = await Order.find(filter).select("orderSource orderStatus prep").lean();
    res.status(200).json({ success: true, data: computePrepStats(orders) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  extendPrepTime,
  getPrepReport,
  getDeletedOrders,
  addOrder,
  addPublicOrder,
  getOrderById,
  getPublicOrderStatus,
  lookupPublicOrderByPhone,
  cancelPublicOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
