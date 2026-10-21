const createHttpError = require("http-errors");
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

const addOrder = async (req, res, next) => {
  try {
    // Dine-in / POS orders are only created once staff confirm them at the
    // register, so stock is committed immediately (unlike online orders,
    // which defer this until Accept - see addPublicOrder below).
    const deductions = await deductInventoryForOrderItems(req.body.items || []);

    const order = new Order({ ...req.body, inventoryDeducted: true });
    order.orderNumber = await generateOrderNumber(order.orderDate || new Date());
    order.costOfGoods = totalDeductionCost(deductions);
    // Seed the timeline with the status this order was created at (whatever
    // the POS sent, e.g. "In Progress") so the very first stage has a time
    // too, not just the ones after it.
    order.statusHistory = [{ status: order.orderStatus, at: order.orderDate || new Date() }];
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

// Public endpoint (no auth) — a customer placing an order from
// genzpizza.online. Prices are recalculated from the live dish price list
// server-side so a customer can't tamper with totals from the browser.
// Inventory is NOT deducted yet — that happens when staff Accept the order,
// so a customer can't hold stock hostage by never checking out.
const addPublicOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, address, items } = req.body;

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      const error = createHttpError(400, "Name, phone, and at least one item are required.");
      return next(error);
    }

    // Mobile numbers only - reject anything that isn't mostly digits (e.g.
    // someone bypassing the frontend and posting to this endpoint directly).
    // 10-13 digits covers local (03xxxxxxxxx) and +92 international formats.
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (!/^\+?[\d\s-]+$/.test(customerPhone) || phoneDigits.length < 10 || phoneDigits.length > 13) {
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
    total -= discount; // from here on `total` is what the customer actually owes pre-tax

    // ---- Fulfilment: delivery or pickup ----
    // The website and the POS share these rules, so eligibility, fees and ETAs
    // are re-validated here from live Settings - the browser is never trusted
    // for money or availability decisions.
    const deliveryType = String(req.body.deliveryType || "delivery") === "pickup" ? "pickup" : "delivery";
    const branchId = req.body.branchId;
    const fulfilmentConfig = settings.deliveryFulfillment || {};
    const timeZone = fulfilmentConfig.timeZone || "Asia/Karachi";
    const branches = fulfilmentConfig.branches || [];

    const minutesFor = (value) => {
      const parts = String(value || "").split(":").map(Number);
      return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
    };

    // A branch is orderable when its configured opening hours (if any) cover
    // right now in the configured time zone. Hours left unset mean "always open".
    const branchIsOpen = (branch) => {
      const hours = branch.openingHours || [];
      if (hours.length === 0) return true;
      const local = new Date(new Date().toLocaleString("en-US", { timeZone }));
      const today = hours.find((h) => h.dayOfWeek === local.getDay());
      if (!today || today.closed) return false;
      const now = local.getHours() * 60 + local.getMinutes();
      return now >= minutesFor(today.open) && now < minutesFor(today.close);
    };

    // Match the delivery address against enabled delivery zones (fuzzy area
    // match, e.g. "Gojra" or "Gojra city" both match zone "Gojra").
    const zoneCovering = (addr) => {
      const text = String(addr || "").toLowerCase().trim();
      for (const branch of branches) {
        if (!branch.enabled || !branch.deliveryEnabled || branch.deliveryRestrictionActive) continue;
        for (const zone of branch.deliveryZones || []) {
          if (!zone.enabled) continue;
          const area = String(zone.area || "").toLowerCase().trim();
          if (area && (text.includes(area) || area.includes(text))) return { branch, zone };
        }
      }
      return null;
    };

    let deliveryFee = 0;
    let eta = null;
    let fulfilmentNote = "";
    let resolvedBranch = null;

    if (deliveryType === "pickup") {
      resolvedBranch = branches.find((b) => String(b.branchId) === String(branchId));
      if (!resolvedBranch) {
        const error = createHttpError(400, "That branch isn't available for pickup.");
        return next(error);
      }
      if (!resolvedBranch.enabled || !resolvedBranch.pickupEnabled) {
        const error = createHttpError(400, "Pickup isn't available at that branch right now.");
        return next(error);
      }
      if (!branchIsOpen(resolvedBranch)) {
        const error = createHttpError(400, `${resolvedBranch.name} is closed at the moment.`);
        return next(error);
      }
      eta = Number(resolvedBranch.preparationMinutes) || 25;
      fulfilmentNote = resolvedBranch.pickupInstructions || "";
    } else {
      // Home delivery: address must fall inside an enabled delivery zone.
      if (!address || !address.trim()) {
        const error = createHttpError(400, "Please enter a delivery address.");
        return next(error);
      }
      const cover = zoneCovering(address);
      if (!cover) {
        const restricted = branches.find((b) => b.deliveryEnabled && b.deliveryRestrictionActive);
        if (restricted) {
          const error = createHttpError(400, restricted.deliveryRestrictionMessage || "Delivery is temporarily unavailable.");
          return next(error);
        }
        const error = createHttpError(400, "We don't deliver to this area yet - please enter another address, or choose pickup.");
        return next(error);
      }
      resolvedBranch = cover.branch;
      const zone = cover.zone;
      if (!branchIsOpen(resolvedBranch)) {
        const error = createHttpError(400, `${resolvedBranch.name} is closed at the moment.`);
        return next(error);
      }
      deliveryFee = Number(zone.fee) || 0;
      const minimumOrder = Number(zone.minimumOrder) || 0;
      if (minimumOrder > 0 && total < minimumOrder) {
        const error = createHttpError(400, `Minimum order for delivery to this area is Rs ${minimumOrder}.`);
        return next(error);
      }
      eta = (Number(resolvedBranch.preparationMinutes) || 25) + (Number(zone.estimatedDeliveryMinutes) || 30);
      fulfilmentNote = "Cash on delivery - pay the rider when the food arrives.";
    }

    const tax = (total * taxRatePercent) / 100;
    const totalWithTax = total + tax + deliveryFee;

    const order = new Order({
      customerDetails: {
        name: customerName,
        phone: customerPhone,
        guests: 1,
        address: deliveryType === "delivery" ? address : "",
      },
      orderStatus: "Pending",
      orderSource: "Online",
      statusHistory: [{ status: "Pending", at: new Date() }],
      deliveryType,
      branch: resolvedBranch ? { branchId: resolvedBranch.branchId, name: resolvedBranch.name } : undefined,
      deliveryFee,
      fulfillmentEtaMinutes: eta,
      fulfilmentNote,
      bills: {
        total,
        tax,
        totalWithTax,
        subtotal: subtotalBeforeDiscount,
        discount,
        discountPercent,
        discountLabel,
        deliveryFee,
      },
      items: resolvedItems,
      paymentMethod: "Cash on Delivery",
    });
    order.orderNumber = await generateOrderNumber(order.orderDate || new Date());

    await order.save();
    invalidateAvailabilityCache(); // this order now reserves stock

    res.status(201).json({
      success: true,
      message: "Order placed! You'll see live status updates here.",
      data: order,
    });
  } catch (error) {
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
        orderDate: order.orderDate,
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
        orderDate: order.orderDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
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

      if (TERMINAL_STATUSES.includes(order.orderStatus)) {
        const error = createHttpError(
          400,
          `This order is already ${order.orderStatus.toLowerCase()} and can no longer be edited.`
        );
        return next(error);
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
    await order.save();
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

module.exports = {
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
