const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Deal = require("../models/dealModel");
const Dish = require("../models/dishModel");
const { attachDealAvailability } = require("../utils/stockAvailability");

// ---- helpers ---------------------------------------------------------

// Normalizes the free-form "bundle contents" list staff type in
// (e.g. "1 Medium Pizza" / qty 1, "6 Wings" / qty 6). Drops empty rows.
// `dishId`, when provided, links a bundle item to a real menu Dish so
// selling the deal deducts that dish's stock — invalid/missing ids are
// simply dropped rather than rejecting the whole deal, since a bundle item
// is still valid as a plain typed label without a link.
const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((it) => ({
      label: String(it?.label ?? "").trim(),
      quantity: Math.max(1, Number(it?.quantity) || 1),
      dishId: it?.dishId && mongoose.Types.ObjectId.isValid(it.dishId) ? it.dishId : null,
      size: String(it?.size ?? "").trim(),
      crust: String(it?.crust ?? "").trim(),
      customizable: Boolean(it?.customizable),
      allowedCategories: Array.isArray(it?.allowedCategories)
        ? it.allowedCategories.filter((c) => mongoose.Types.ObjectId.isValid(c))
        : [],
    }))
    .filter((it) => it.label.length > 0);
};

const normalizeDaysOfWeek = (daysOfWeek) => {
  if (!Array.isArray(daysOfWeek)) return [];
  const days = daysOfWeek
    .map((d) => Number(d))
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  return [...new Set(days)].sort();
};

const isValidTime = (value) => value === "" || value === undefined || value === null || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

// Is `deal` orderable right now (server local time), given its
// active flag + day-of-week + optional time-of-day window?
// The shop's local clock. The server (e.g. Render/VPS) usually runs in UTC,
// which is 5 hours behind Pakistan — so a deal set for "Friday 6pm-11pm"
// would switch on/off at the wrong time and look "missing" online. Override
// with SHOP_TIMEZONE in .env if the shop is somewhere else.
const SHOP_TIMEZONE = process.env.SHOP_TIMEZONE || "Asia/Karachi";
const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const shopClock = (now = new Date()) => {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SHOP_TIMEZONE,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const get = (type) => parts.find((p) => p.type === type)?.value;
    return {
      day: WEEKDAYS[get("weekday")],
      minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
    };
  } catch {
    return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
  }
};

const isDealLiveNow = (deal, now = new Date()) => {
  if (!deal.isActive) return false;

  const clock = shopClock(now);

  if (deal.daysOfWeek && deal.daysOfWeek.length > 0 && !deal.daysOfWeek.includes(clock.day)) {
    return false;
  }

  if (deal.startTime || deal.endTime) {
    const nowMinutes = clock.minutes;
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const start = deal.startTime ? toMinutes(deal.startTime) : 0;
    const end = deal.endTime ? toMinutes(deal.endTime) : 24 * 60 - 1;

    if (start <= end) {
      if (nowMinutes < start || nowMinutes > end) return false;
    } else {
      // Window wraps past midnight (e.g. 18:00 -> 02:00).
      if (nowMinutes < start && nowMinutes > end) return false;
    }
  }

  return true;
};


// For customizable deal items, attaches the list of dishes the customer can
// actually choose from (one per allowed category), each with its own
// variant sizes — so the storefront can render Category -> Flavour -> Size
// pickers, and so whatever gets picked maps straight to a real Dish + its
// own per-variant recipe for inventory deduction (see orderController).
const attachFlavourOptions = async (deals) => {
  const categoryIds = new Set();
  deals.forEach((d) =>
    (d.items || []).forEach((it) => {
      if (it.customizable) (it.allowedCategories || []).forEach((c) => categoryIds.add(String(c)));
    })
  );
  if (categoryIds.size === 0) return deals;

  const dishes = await Dish.find({ category: { $in: [...categoryIds] } })
    .select("name category variants price originalPrice icon isInventoryTracked")
    .populate({ path: "category", select: "name" })
    .sort({ order: 1, name: 1 })
    .lean();

  const byCategory = new Map();
  dishes.forEach((d) => {
    const key = String(d.category?._id || d.category || "");
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push({
      _id: d._id,
      name: d.name,
      icon: d.icon,
      category: d.category ? { _id: d.category._id, name: d.category.name } : null,
      variants: d.variants || [],
      price: d.price,
      originalPrice: d.originalPrice,
    });
  });

  return deals.map((d) => ({
    ...d,
    items: (d.items || []).map((it) => {
      if (!it.customizable) return it;
      const flavourOptions = (it.allowedCategories || []).flatMap(
        (c) => byCategory.get(String(c)) || []
      );
      return { ...it, flavourOptions };
    }),
  }));
};

const buildDealPayload = (body) => {
  const { name, badge, description, image, icon, items, price, originalPrice, daysOfWeek, startTime, endTime, isActive } = body;

  if (!name || !String(name).trim()) {
    throw createHttpError(400, "Please provide a deal name!");
  }
  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    throw createHttpError(400, "Please provide a deal price!");
  }
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    throw createHttpError(400, "Start/end time must be in HH:mm format.");
  }

  const normalizedItems = normalizeItems(items);
  if (normalizedItems.length === 0) {
    throw createHttpError(400, "Add at least one item included in the deal.");
  }

  return {
    name: String(name).trim(),
    badge: badge ? String(badge).trim() : "",
    description: description || "",
    image: image || "",
    icon: icon || "🔥",
    items: normalizedItems,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : 0,
    daysOfWeek: normalizeDaysOfWeek(daysOfWeek),
    startTime: startTime || "",
    endTime: endTime || "",
    isActive: isActive === undefined ? true : Boolean(isActive),
  };
};

// ---- admin (POS dashboard) endpoints ---------------------------------

const addDeal = async (req, res, next) => {
  try {
    const data = buildDealPayload(req.body);
    const deal = await Deal.create(data);
    res.status(201).json({ success: true, message: "Deal added!", data: deal });
  } catch (error) {
    next(error);
  }
};

// Returns every deal (active + inactive) so staff can see/manage the full
// list, tagged with `isLiveNow` for a quick "would a customer see this
// right now" indicator in the dashboard.
const getDeals = async (req, res, next) => {
  try {
    const deals = await Deal.find()
      .populate({ path: "items.dishId", select: "name isInventoryTracked" })
      .sort({ order: 1, createdAt: -1 });
    const now = new Date();
    const withLiveFlag = deals.map((d) => ({ ...d.toObject(), isLiveNow: isDealLiveNow(d, now) }));
    const withAvailability = await attachDealAvailability(withLiveFlag);
    res.status(200).json({ success: true, data: await attachFlavourOptions(withAvailability) });
  } catch (error) {
    next(error);
  }
};

const updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const error = createHttpError(400, "Deal id is required!");
      return next(error);
    }

    const data = buildDealPayload(req.body);
    const updatedDeal = await Deal.findByIdAndUpdate(id, data, { new: true });

    if (!updatedDeal) {
      const error = createHttpError(404, "Deal not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Deal updated successfully!", data: updatedDeal });
  } catch (error) {
    next(error);
  }
};

// Quick on/off switch, separate from the full edit form — lets staff pause
// a deal (e.g. sold out, ran past its promo window) in one tap without
// reopening the whole edit form.
const toggleDealStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findById(id);

    if (!deal) {
      const error = createHttpError(404, "Deal not found!");
      return next(error);
    }

    deal.isActive = !deal.isActive;
    await deal.save();

    res.status(200).json({
      success: true,
      message: `Deal ${deal.isActive ? "activated" : "deactivated"}.`,
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};

const reorderDeals = async (req, res, next) => {
  try {
    const { order } = req.body; // [{ id, position }]
    if (!Array.isArray(order)) {
      const error = createHttpError(400, "Order must be an array");
      return next(error);
    }

    const ops = order.map((item) => Deal.findByIdAndUpdate(item.id, { order: Number(item.position) }, { new: true }));
    await Promise.all(ops);

    res.status(200).json({ success: true, message: "Deals reordered" });
  } catch (error) {
    next(error);
  }
};

const deleteDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByIdAndDelete(id);

    if (!deal) {
      const error = createHttpError(404, "Deal not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Deal deleted successfully!", data: deal });
  } catch (error) {
    next(error);
  }
};

// ---- public (genzpizza.online storefront) endpoint --------------------

// Only returns deals that are switched on AND currently within their
// scheduled day/time window, so "Sunday Special" simply disappears from
// the storefront on every other day without staff having to touch it.
const getPublicDeals = async (req, res, next) => {
  try {
    const deals = await Deal.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    const now = new Date();
    const liveDeals = deals.filter((d) => isDealLiveNow(d, now));
    // availableQty = how many of this deal the live inventory can still make.
    const withAvailability = await attachDealAvailability(liveDeals);
    res.status(200).json({ success: true, data: await attachFlavourOptions(withAvailability) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDeal,
  getDeals,
  updateDeal,
  toggleDealStatus,
  reorderDeals,
  deleteDeal,
  getPublicDeals,
  isDealLiveNow,
};
