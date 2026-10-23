const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Branch = require("../models/branchModel");
const { quoteFulfillment, publicBranch, defaultHours } = require("../utils/fulfillment");

const ensureDefaultBranch = async () => {
  if ((await Branch.estimatedDocumentCount()) > 0) return;
  await Branch.create({
    name: "GenZ Pizza Land - Gojra",
    address: "Gojra",
    hours: defaultHours(),
    delivery: { zones: [{ name: "Gojra city", areas: "Within city limits", fee: 100, distanceKm: 3, travelMinutes: 25 }] },
  });
};

const num = (v, label, { min = 0, max = 1e7 } = {}) => {
  const n = Number(v);
  if (Number.isNaN(n) || n < min || n > max) throw createHttpError(400, `${label} must be a number between ${min} and ${max}.`);
  return n;
};
const text = (v, max) => String(v ?? "").trim().slice(0, max);
const hhmm = (v, label) => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(v))) throw createHttpError(400, `${label} must be a time like 11:00.`);
  return String(v);
};

const cleanBranch = (b = {}) => {
  const name = text(b.name, 80);
  if (name.length < 2) throw createHttpError(400, "Enter the branch name (at least 2 characters).");

  const out = {
    name,
    address: text(b.address, 240),
    phone: text(b.phone, 30),
    isActive: b.isActive !== false,
    sortOrder: Number(b.sortOrder) || 0,
  };

  if (Array.isArray(b.hours)) {
    out.hours = [0, 1, 2, 3, 4, 5, 6].map((day) => {
      const h = b.hours.find((x) => Number(x.day) === day) || {};
      const open = h.open !== false;
      return { day, open, from: hhmm(h.from || "11:00", "Opening time"), to: hhmm(h.to || "23:00", "Closing time") };
    });
  }

  if (b.pickup) {
    out.pickup = {
      enabled: b.pickup.enabled !== false,
      prepMinutes: num(b.pickup.prepMinutes ?? 20, "Pickup preparation time", { max: 480 }),
      minOrder: num(b.pickup.minOrder ?? 0, "Pickup minimum order"),
      instructions: text(b.pickup.instructions, 240),
    };
  }

  if (b.delivery) {
    const zones = Array.isArray(b.delivery.zones) ? b.delivery.zones : [];
    out.delivery = {
      enabled: b.delivery.enabled !== false,
      prepMinutes: num(b.delivery.prepMinutes ?? 25, "Delivery preparation time", { max: 480 }),
      minOrder: num(b.delivery.minOrder ?? 0, "Delivery minimum order"),
      freeAbove: num(b.delivery.freeAbove ?? 1000, "Free delivery threshold"),
      freeWithinKm: num(b.delivery.freeWithinKm ?? 4, "Free delivery distance"),
      zones: zones.map((z) => {
        const zn = text(z.name, 60);
        if (!zn) throw createHttpError(400, "Every delivery zone needs a name.");
        return {
          ...(mongoose.Types.ObjectId.isValid(z._id) ? { _id: z._id } : {}),
          name: zn,
          areas: text(z.areas, 200),
          fee: num(z.fee ?? 100, `Fee for "${zn}"`),
          distanceKm: z.distanceKm === "" || z.distanceKm == null ? null : num(z.distanceKm, `Distance for "${zn}"`, { max: 500 }),
          minOrder: num(z.minOrder ?? 0, `Minimum order for "${zn}"`),
          travelMinutes: num(z.travelMinutes ?? 20, `Travel time for "${zn}"`, { max: 240 }),
          active: z.active !== false,
        };
      }),
    };
  }

  const display = b.customerDisplay || {};
  out.customerDisplay = {
    showFreeDeliveryNote: display.showFreeDeliveryNote === true,
    showEstimatedTimes: display.showEstimatedTimes === true,
    showDeliveryFees: display.showDeliveryFees === true,
    showDeliveryAreaText: display.showDeliveryAreaText === true,
    showClosedNotice: display.showClosedNotice === true,
    showCashPaymentNote: display.showCashPaymentNote === true,
  };

  if (b.restriction) {
    const r = b.restriction;
    const until = r.until ? new Date(r.until) : null;
    if (until && Number.isNaN(until.getTime())) throw createHttpError(400, "The restriction end time isn't a valid date.");
    out.restriction = {
      active: !!r.active,
      applies: ["delivery", "pickup", "both"].includes(r.applies) ? r.applies : "delivery",
      message: text(r.message, 200),
      until,
    };
  }
  return out;
};

const getPublicBranches = async (req, res, next) => {
  try {
    await ensureDefaultBranch();
    const branches = await Branch.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    const now = new Date();
    res.status(200).json({ success: true, data: branches.map((b) => publicBranch(b, now)) });
  } catch (error) {
    next(error);
  }
};

const quotePublic = async (req, res, next) => {
  try {
    const { branchId, method, zoneId } = req.body || {};
    const subtotal = Math.max(0, Number(req.body?.subtotal) || 0);
    const branch = mongoose.Types.ObjectId.isValid(branchId) ? await Branch.findById(branchId) : null;
    const quote = quoteFulfillment({ branch, method, zoneId, subtotal });
    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

const quoteStaff = async (req, res, next) => {
  try {
    const { branchId, method, zoneId } = req.body || {};
    const subtotal = Math.max(0, Number(req.body?.subtotal) || 0);
    const branch = mongoose.Types.ObjectId.isValid(branchId) ? await Branch.findById(branchId) : null;
    res.status(200).json({ success: true, data: quoteFulfillment({ branch, method, zoneId, subtotal, staff: true }) });
  } catch (error) {
    next(error);
  }
};

const listBranches = async (req, res, next) => {
  try {
    await ensureDefaultBranch();
    res.status(200).json({ success: true, data: await Branch.find().sort({ sortOrder: 1, name: 1 }) });
  } catch (error) {
    next(error);
  }
};

const createBranch = async (req, res, next) => {
  try {
    const data = cleanBranch(req.body);
    if (!data.hours) data.hours = defaultHours();
    const branch = await Branch.create(data);
    res.status(201).json({ success: true, message: "Branch created!", data: branch });
  } catch (error) {
    next(error);
  }
};

const updateBranch = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next(createHttpError(404, "Branch not found."));
    const data = cleanBranch(req.body);
    const branch = await Branch.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true });
    if (!branch) return next(createHttpError(404, "Branch not found."));
    res.status(200).json({ success: true, message: "Branch saved!", data: branch });
  } catch (error) {
    next(error);
  }
};

const deleteBranch = async (req, res, next) => {
  try {
    if ((await Branch.estimatedDocumentCount()) <= 1) {
      return next(createHttpError(400, "You need at least one branch. Switch it off instead of deleting it."));
    }
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return next(createHttpError(404, "Branch not found."));
    res.status(200).json({ success: true, message: "Branch deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ensureDefaultBranch,
  getPublicBranches,
  quotePublic,
  quoteStaff,
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
