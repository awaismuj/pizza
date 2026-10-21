const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const InventoryItem = require("../models/inventoryItemModel");

const { getStockStatus, getDefaultLowStockThreshold } = require("../utils/stockUtils");
const { invalidateAvailabilityCache } = require("../utils/stockAvailability");
const { sendReport, normalizeFormat } = require("../utils/reportExport");

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveCategoryId = async (categoryValue) => {
  if (!categoryValue) return null;

  if (mongoose.Types.ObjectId.isValid(categoryValue)) {
    return categoryValue;
  }

  const category = await Category.findOne({
    name: { $regex: `^${escapeRegex(String(categoryValue).trim())}$`, $options: "i" },
  });

  if (!category) {
    const error = createHttpError(400, "Category not found. Please create the category first.");
    throw error;
  }

  return category._id;
};

const createInventoryItem = async (req, res, next) => {
  try {
    const { name, category, unit, quantity, reorderLevel, costPrice, sellingPrice, isTrackable, notes } = req.body;
    const trimmedName = String(name || "").trim();
    const trimmedCategory = category ? String(category).trim() : "";
    const trimmedUnit = unit ? String(unit).trim() : "pcs";

    if (!trimmedName) {
      const error = createHttpError(400, "Please provide inventory item name!");
      return next(error);
    }

    const existingItem = await InventoryItem.findOne({ name: { $regex: `^${escapeRegex(trimmedName)}$`, $options: "i" } });
    if (existingItem) {
      const error = createHttpError(400, "Inventory item already exists!");
      return next(error);
    }

    const categoryId = await resolveCategoryId(trimmedCategory);
    const item = await InventoryItem.create({
      name: trimmedName,
      category: categoryId,
      unit: trimmedUnit,
      quantity: Number(quantity) || 0,
      reorderLevel: Number(reorderLevel) || 0,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      isTrackable: typeof isTrackable === "boolean" ? isTrackable : true,
      notes: notes ? String(notes).trim() : "",
    });

    invalidateAvailabilityCache();
    const populatedItem = await item.populate({ path: "category", select: "name" });
    res.status(201).json({
      success: true,
      message: "Inventory item created successfully!",
      data: {
        ...populatedItem.toObject(),
        stockStatus: getStockStatus(populatedItem.quantity, populatedItem.reorderLevel, populatedItem.unit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getInventoryItems = async (req, res, next) => {
  try {
    const items = await InventoryItem.find().populate({ path: "category", select: "name" }).sort({ createdAt: -1 });

    const normalizedItems = items.map((item) => ({
      ...item.toObject(),
      stockStatus: getStockStatus(item.quantity, item.reorderLevel, item.unit),
    }));

    res.status(200).json({ success: true, data: normalizedItems });
  } catch (error) {
    next(error);
  }
};

// Items that are running low (< 1000 g / 1 kg / 1000 ml / 1 l, or < 10 pcs,
// or at/below the item's own reorder level) or already out of stock.
// Read-only and open to Admin + Cashier so both get the low-stock popup;
// only Admin can actually change stock (see inventoryRoute.js).
const getLowStockItems = async (req, res, next) => {
  try {
    const items = await InventoryItem.find({ isTrackable: { $ne: false } })
      .populate({ path: "category", select: "name" })
      .sort({ quantity: 1 });

    const lowItems = items
      .map((item) => ({
        _id: item._id,
        name: item.name,
        category: item.category?.name || "",
        unit: item.unit,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        threshold: Math.max(getDefaultLowStockThreshold(item.unit), Number(item.reorderLevel) || 0),
        stockStatus: getStockStatus(item.quantity, item.reorderLevel, item.unit),
      }))
      .filter((item) => item.stockStatus !== "in_stock");

    res.status(200).json({ success: true, data: lowItems });
  } catch (error) {
    next(error);
  }
};

const STATUS_LABELS = { in_stock: "In stock", low_stock: "Low stock", out_of_stock: "Out of stock" };
const STATUS_FILTERS = { in: "in_stock", low: "low_stock", out: "out_of_stock" };

// Current stock report (live balances right now) as CSV / Excel / PDF.
// Stock value = quantity on hand x the item's saved cost price, in the
// item's own unit, so no unit conversion is involved. It is an estimate
// from saved cost prices, not an accounting valuation. Past-date balances
// are not reported because this system stores only the current quantity.
const exportInventoryReport = async (req, res, next) => {
  try {
    const format = normalizeFormat(req.query.format);
    const statusFilter = STATUS_FILTERS[req.query.status] || "";
    const search = String(req.query.search || "").trim().toLowerCase();

    const items = await InventoryItem.find().populate({ path: "category", select: "name" }).sort({ name: 1 }).lean();
    const all = items.map((item) => ({
      name: item.name,
      category: item.category?.name || "Uncategorized",
      unit: item.unit,
      quantity: item.quantity,
      reorderLevel: item.reorderLevel,
      status: STATUS_LABELS[getStockStatus(item.quantity, item.reorderLevel, item.unit)] || "In stock",
      costPrice: item.costPrice || 0,
      stockValue: Math.round((item.quantity || 0) * (item.costPrice || 0) * 100) / 100,
      tracked: item.isTrackable === false ? "No" : "Yes",
    }));
    const rows = all.filter((row) =>
      (!statusFilter || row.status === STATUS_LABELS[statusFilter]) &&
      (!search || row.name.toLowerCase().includes(search) || row.category.toLowerCase().includes(search)));

    const count = (label) => rows.filter((row) => row.status === label).length;
    const totalValue = rows.reduce((sum, row) => sum + row.stockValue, 0);
    const now = new Date();
    const filterText = [statusFilter ? `Status: ${STATUS_LABELS[statusFilter]}` : "", search ? `Search: ${req.query.search}` : ""].filter(Boolean).join(" · ");

    await sendReport(res, {
      title: "Current Stock Report",
      filename: `stock-report-${now.toISOString().slice(0, 10)}`,
      subtitle: `Live balances as of ${now.toISOString().slice(0, 16).replace("T", " ")} UTC · ${filterText || "All items"} · Value is an estimate (quantity x saved cost price)`,
      footer: "GenZ Pizza Land · Kitchen Stock",
      summary: [
        { label: "Items", value: rows.length, type: "number" },
        { label: "Estimated stock value (Rs)", value: totalValue, type: "money" },
        { label: "Low stock", value: count("Low stock"), type: "number" },
        { label: "Out of stock", value: count("Out of stock"), type: "number" },
      ],
      sections: [{
        title: "Stock on hand",
        sheetName: "Stock",
        columns: [
          { key: "name", label: "Item", type: "text", width: 150 },
          { key: "category", label: "Category", type: "text", width: 100 },
          { key: "unit", label: "Unit", type: "text", width: 45 },
          { key: "quantity", label: "Quantity", type: "number", width: 70 },
          { key: "reorderLevel", label: "Reorder level", type: "number", width: 70 },
          { key: "status", label: "Status", type: "text", width: 80 },
          { key: "costPrice", label: "Unit cost (Rs)", type: "money", width: 80 },
          { key: "stockValue", label: "Stock value (Rs)", type: "money", width: 90 },
        ],
        rows,
        totals: rows.length ? { name: "Total", stockValue: totalValue } : undefined,
      }],
    }, format);
  } catch (error) {
    next(error);
  }
};

const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, unit, quantity, reorderLevel, costPrice, sellingPrice, isTrackable, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(400, "Invalid inventory item id!");
      return next(error);
    }

    const item = await InventoryItem.findById(id);
    if (!item) {
      const error = createHttpError(404, "Inventory item not found!");
      return next(error);
    }
    if (quantity !== undefined && Number(quantity) !== item.quantity &&
        !req.permissions?.includes("inventory.adjust")) {
      return next(createHttpError(403, "You do not have permission to adjust stock."));
    }
    if (quantity !== undefined && Number(quantity) !== item.quantity) {
      req.auditActionOverride = "stock.adjusted";
    }

    const trimmedName = name ? String(name).trim() : "";
    const trimmedCategory = category ? String(category).trim() : "";
    const trimmedUnit = unit ? String(unit).trim() : item.unit;

    if (trimmedName) {
      const duplicateItem = await InventoryItem.findOne({
        _id: { $ne: id },
        name: { $regex: `^${escapeRegex(trimmedName)}$`, $options: "i" },
      });

      if (duplicateItem) {
        const error = createHttpError(400, "Inventory item with this name already exists!");
        return next(error);
      }

      item.name = trimmedName;
    }

    item.category = await resolveCategoryId(trimmedCategory || item.category);
    item.unit = trimmedUnit || item.unit;
    item.quantity = Number(quantity) >= 0 ? Number(quantity) : item.quantity;
    item.reorderLevel = Number(reorderLevel) >= 0 ? Number(reorderLevel) : item.reorderLevel;
    item.costPrice = Number(costPrice) >= 0 ? Number(costPrice) : item.costPrice;
    item.sellingPrice = Number(sellingPrice) >= 0 ? Number(sellingPrice) : item.sellingPrice;
    item.isTrackable = typeof isTrackable === "boolean" ? isTrackable : item.isTrackable;
    item.notes = typeof notes === "string" ? notes.trim() : item.notes;

    await item.save();
    invalidateAvailabilityCache();
    const populatedItem = await item.populate({ path: "category", select: "name" });

    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully!",
      data: {
        ...populatedItem.toObject(),
        stockStatus: getStockStatus(populatedItem.quantity, populatedItem.reorderLevel, populatedItem.unit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const adjustInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantityChange, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(400, "Invalid inventory item id!");
      return next(error);
    }

    const item = await InventoryItem.findById(id);
    if (!item) {
      const error = createHttpError(404, "Inventory item not found!");
      return next(error);
    }

    const adjustment = Number(quantityChange);
    if (!Number.isFinite(adjustment)) {
      const error = createHttpError(400, "Please provide a valid quantity adjustment.");
      return next(error);
    }

    const nextQuantity = item.quantity + adjustment;
    if (nextQuantity < 0) {
      const error = createHttpError(400, `Cannot reduce below zero. Current stock is ${item.quantity}.`);
      return next(error);
    }

    item.quantity = nextQuantity;
    if (note && String(note).trim()) {
      item.notes = String(note).trim();
    }

    await item.save();
    invalidateAvailabilityCache();
    const populatedItem = await item.populate({ path: "category", select: "name" });

    res.status(200).json({
      success: true,
      message: "Inventory adjusted successfully!",
      data: {
        ...populatedItem.toObject(),
        stockStatus: getStockStatus(populatedItem.quantity, populatedItem.reorderLevel, populatedItem.unit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(400, "Invalid inventory item id!");
      return next(error);
    }

    const item = await InventoryItem.findByIdAndDelete(id);
    invalidateAvailabilityCache();
    if (!item) {
      const error = createHttpError(404, "Inventory item not found!");
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully!",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const Dish = require("../models/dishModel");

const UNIT_CONVERSIONS = {
  kg: { g: 1000 },
  g: { kg: 1 / 1000 },
  l: { ml: 1000 },
  ml: { l: 1 / 1000 },
};

const convertToUnit = (amount, fromUnit = "", toUnit = "") => {
  if (!fromUnit || !toUnit) return amount;
  const f = String(fromUnit).toLowerCase();
  const t = String(toUnit).toLowerCase();
  if (f === t) return amount;

  // pcs (pieces) are not convertible to weight/volume
  if (f === "pcs" || t === "pcs") {
    throw createHttpError(400, `Cannot convert between units ${fromUnit} and ${toUnit}`);
  }

  if (UNIT_CONVERSIONS[f] && UNIT_CONVERSIONS[f][t]) {
    return amount * UNIT_CONVERSIONS[f][t];
  }

  if (UNIT_CONVERSIONS[t] && UNIT_CONVERSIONS[t][f]) {
    return amount / UNIT_CONVERSIONS[t][f];
  }

  throw createHttpError(400, `Unsupported unit conversion: ${fromUnit} -> ${toUnit}`);
};

// Resolve which Dish an order line refers to. Cart lines carry a `dishId` (the
// real Dish _id) whenever they were added from the live menu, which is the
// reliable way to find the dish. Older clients / manual API calls may only
// send a `name`, so that is kept as a fallback.
const resolveDishForOrderItem = async (item) => {
  const dishId = item?.dishId || item?.dish || (mongoose.Types.ObjectId.isValid(item?.id) ? item.id : null);

  if (dishId && mongoose.Types.ObjectId.isValid(dishId)) {
    const byId = await Dish.findById(dishId)
      .populate({ path: "ingredients.inventoryItem" })
      .populate({ path: "variantIngredients.ingredients.inventoryItem" })
      .populate("inventoryItem");
    if (byId) return byId;
  }

  const itemName = typeof item?.name === "string" ? String(item.name).trim() : "";
  if (!itemName) return null;

  return Dish.findOne({ name: { $regex: `^${escapeRegex(itemName)}$`, $options: "i" } })
    .populate({ path: "ingredients.inventoryItem" })
    .populate({ path: "variantIngredients.ingredients.inventoryItem" })
    .populate("inventoryItem");
};

// Resolves the real Dish a DEAL's bundle-item line refers to, so ordering a
// deal (e.g. "Family Deal" containing "1 Medium Pizza" + "6 Wings") deducts
// stock exactly like ordering those items à la carte would.
//   1. Preferred: the deal item was explicitly linked to a menu Dish in the
//      deal editor (`dishId`) — fast and unambiguous.
//   2. Fallback: match the staff-typed label (e.g. "Small Pizza", "Burger")
//      against real dish names, so typing a dish's name into a deal is
//      enough even without linking it, the same way a plain order line
//      falls back to name-matching. Prefers the longest/most specific dish
//      name contained in the label (so "Medium Pizza" wins over a shorter
//      "Pizza" dish if both exist), and only after an exact match misses.
const resolveDishForDealItem = async (dealItem) => {
  const dishId = dealItem?.dishId;
  if (dishId && mongoose.Types.ObjectId.isValid(dishId)) {
    const byId = await Dish.findById(dishId)
      .populate({ path: "ingredients.inventoryItem" })
      .populate({ path: "variantIngredients.ingredients.inventoryItem" })
      .populate("inventoryItem");
    if (byId) return byId;
  }

  const label = typeof dealItem?.label === "string" ? dealItem.label.trim() : "";
  if (!label) return null;

  const exact = await Dish.findOne({ name: { $regex: `^${escapeRegex(label)}$`, $options: "i" } })
    .populate({ path: "ingredients.inventoryItem" })
    .populate({ path: "variantIngredients.ingredients.inventoryItem" })
    .populate("inventoryItem");
  if (exact) return exact;

  const allDishNames = await Dish.find({}).select("_id name").lean();
  const normalizedLabel = label.toLowerCase();
  let best = null;
  for (const candidate of allDishNames) {
    const name = candidate.name.toLowerCase();
    if (normalizedLabel.includes(name) && (!best || name.length > best.name.length)) {
      best = candidate;
    }
  }
  if (!best) return null;

  return Dish.findById(best._id)
    .populate({ path: "ingredients.inventoryItem" })
    .populate({ path: "variantIngredients.ingredients.inventoryItem" })
    .populate("inventoryItem");
};

// Walks a single dish's recipe (or its simple 1:1 inventory link) and folds
// the amount required for `qty` units of that dish into `addAmount`. Shared
// by plain menu-item lines and deal bundle-item lines so a dish deducts the
// exact same way whether it's ordered on its own or as part of a deal.
// Picks the right recipe for the size/crust actually ordered:
//   1. An exact size+crust match in variantIngredients (e.g. "Large"+"Stuffed")
//   2. A size-only match (an entry with no crust set) for that size
//   3. Falls back to the dish's one flat `ingredients` recipe
// so a plain dish (no variants) or a variant nobody overrode keeps working
// exactly as before.
const recipeFor = (dish, variant) => {
  const size = variant?.size;
  if (size && Array.isArray(dish.variantIngredients) && dish.variantIngredients.length > 0) {
    const match =
      dish.variantIngredients.find((vi) => vi.size === size && (vi.crust || "") === (variant?.crust || "")) ||
      dish.variantIngredients.find((vi) => vi.size === size && !vi.crust);
    if (match && Array.isArray(match.ingredients) && match.ingredients.length > 0) {
      return match.ingredients;
    }
  }
  return dish.ingredients;
};

const accumulateDishAmount = async (dish, qty, addAmount, variant = null) => {
  if (!dish || !dish.isInventoryTracked || !(qty > 0)) return;

  const recipe = recipeFor(dish, variant);

  if (Array.isArray(recipe) && recipe.length > 0) {
    // Recipe-based dish: walk every ingredient, converted to the unit that
    // ingredient's inventory is tracked in (e.g. 200g per pizza -> kg).
    for (const ing of recipe) {
      const ingInv = ing.inventoryItem;
      if (!ingInv) continue;

      const perDishQty = Number(ing.quantity) || 0;
      if (perDishQty <= 0) continue;

      const amount = perDishQty * qty;
      const invUnit = ingInv.unit || "pcs";
      const ingUnit = ing.unit || invUnit;
      const amountInInventoryUnit = convertToUnit(amount, ingUnit, invUnit);

      const invItem = await InventoryItem.findById(String(ingInv._id));
      if (!invItem || !invItem.isTrackable) continue;

      addAmount(invItem, amountInInventoryUnit);
    }
    return;
  }

  if (dish.inventoryItem) {
    // Simple item (e.g. a bottled cold drink mapped to an inventory item
    // that's tracked in a different unit/quantity than "1 per dish" — a
    // 2.25L bottle poured out in ~300 ml servings, say): each unit ordered
    // consumes `inventoryItemQty` of that item, in the item's own unit.
    // Defaults to 1 so dishes saved before this existed keep behaving
    // exactly as they did (1 unit per dish).
    const invItem = await InventoryItem.findById(String(dish.inventoryItem._id || dish.inventoryItem));
    if (!invItem || !invItem.isTrackable) return;

    const perDishQty = Number(dish.inventoryItemQty) > 0 ? Number(dish.inventoryItemQty) : 1;
    addAmount(invItem, perDishQty * qty);
  }
};

// Deducts inventory for a list of order lines
// ([{ dishId, name, quantity }] and/or [{ isDeal, dealItems, quantity }]).
//
// This runs in two passes so a single order either fully succeeds or fully
// fails, instead of leaving inventory partially decremented if a later line
// in the same order turns out to be out of stock:
//   1. Work out exactly how much of each inventory item every line needs
//      (converted into that item's own unit) and validate stock is enough
//      for the ORDER AS A WHOLE (several lines, or a deal's own bundled
//      items, can share one ingredient).
//   2. Only once everything checks out, apply all the deductions.
const deductInventoryForOrderItems = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  // itemId -> { invItem, required, unit }
  const requirements = new Map();

  const addRequirement = (invItem, amountInInventoryUnit) => {
    const key = String(invItem._id);
    const existing = requirements.get(key);
    if (existing) {
      existing.required += amountInInventoryUnit;
    } else {
      requirements.set(key, { invItem, required: amountInInventoryUnit, unit: invItem.unit || "pcs" });
    }
  };

  for (const item of items) {
    const orderedQty = Number(item?.quantity ?? item?.qty ?? 1);
    if (!Number.isFinite(orderedQty) || orderedQty <= 0) continue;

    // Deal line: deduct every bundled item's own recipe, scaled by both the
    // deal's quantity in the cart and that bundle item's own quantity (e.g.
    // 2x "Family Deal" containing "6 Wings" deducts wings for 12).
    if (item?.isDeal && Array.isArray(item.dealItems) && item.dealItems.length > 0) {
      for (const dealItem of item.dealItems) {
        const componentQty = Math.max(1, Number(dealItem?.quantity) || 1) * orderedQty;
        const dish = await resolveDishForDealItem(dealItem);
        await accumulateDishAmount(dish, componentQty, addRequirement, { size: dealItem?.size, crust: dealItem?.crust });
      }
      continue;
    }

    const dish = await resolveDishForOrderItem(item);

    if (dish && dish.isInventoryTracked) {
      await accumulateDishAmount(dish, orderedQty, addRequirement, { size: item?.size, crust: item?.crust });
      continue;
    }

    // Fallback: no (trackable) dish/recipe link, try matching an inventory
    // item directly by name (useful when selling a bare inventory item).
    const itemName = typeof item?.name === "string" ? String(item.name).trim() : "";
    if (!itemName) continue;

    const inventoryItem = await InventoryItem.findOne({ name: { $regex: `^${escapeRegex(itemName)}$`, $options: "i" } });
    if (!inventoryItem || !inventoryItem.isTrackable) continue;

    addRequirement(inventoryItem, orderedQty);
  }

  // Validate stock is sufficient for the whole order before touching anything.
  for (const { invItem, required, unit } of requirements.values()) {
    if (invItem.quantity < required) {
      const shortBy = Math.round((required - invItem.quantity) * 100) / 100;
      throw createHttpError(
        400,
        `Not available: ${invItem.name}. Only ${invItem.quantity} ${unit} in stock, ${required} ${unit} needed (short by ${shortBy} ${unit}).`
      );
    }
  }

  // Everything checked out - apply the deductions.
  const deductions = [];
  for (const { invItem, required, unit } of requirements.values()) {
    invItem.quantity = Math.max(0, invItem.quantity - required);
    invItem.lastUpdatedAt = new Date();
    await invItem.save();

    deductions.push({
      itemId: String(invItem._id),
      name: invItem.name,
      deducted: required,
      unit,
      remaining: invItem.quantity,
      // Cost of the stock actually consumed, at this item's cost price
      // right now - used to work out this order's cost of goods sold.
      cost: required * (Number(invItem.costPrice) || 0),
    });
  }
  invalidateAvailabilityCache();

  return deductions;
};

// Convenience for callers that just want the total cost of a deduction
// batch (i.e. this order's cost of goods sold), without having to sum the
// per-item `cost` themselves.
const totalDeductionCost = (deductions = []) =>
  deductions.reduce((sum, d) => sum + (Number(d?.cost) || 0), 0);

// Gives back the stock that deductInventoryForOrderItems took for a given
// order (used when an order is cancelled after stock was already
// committed). Mirrors the deduction logic exactly (including deal bundle
// items) so the amount restored always matches the amount originally
// deducted, and simply adds instead of subtracting. Unlike deduction,
// restoring never fails on "not enough stock" - it always succeeds, since
// we're giving stock back, not taking it.
const restoreInventoryForOrderItems = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  // itemId -> { invItem, amount, unit }
  const restorations = new Map();

  const addRestoration = (invItem, amountInInventoryUnit) => {
    const key = String(invItem._id);
    const existing = restorations.get(key);
    if (existing) {
      existing.amount += amountInInventoryUnit;
    } else {
      restorations.set(key, { invItem, amount: amountInInventoryUnit, unit: invItem.unit || "pcs" });
    }
  };

  for (const item of items) {
    const orderedQty = Number(item?.quantity ?? item?.qty ?? 1);
    if (!Number.isFinite(orderedQty) || orderedQty <= 0) continue;

    if (item?.isDeal && Array.isArray(item.dealItems) && item.dealItems.length > 0) {
      for (const dealItem of item.dealItems) {
        const componentQty = Math.max(1, Number(dealItem?.quantity) || 1) * orderedQty;
        const dish = await resolveDishForDealItem(dealItem);
        await accumulateDishAmount(dish, componentQty, addRestoration, { size: dealItem?.size, crust: dealItem?.crust });
      }
      continue;
    }

    const dish = await resolveDishForOrderItem(item);

    if (dish && dish.isInventoryTracked) {
      await accumulateDishAmount(dish, orderedQty, addRestoration, { size: item?.size, crust: item?.crust });
      continue;
    }

    const itemName = typeof item?.name === "string" ? String(item.name).trim() : "";
    if (!itemName) continue;

    const inventoryItem = await InventoryItem.findOne({ name: { $regex: `^${escapeRegex(itemName)}$`, $options: "i" } });
    if (!inventoryItem) continue;

    addRestoration(inventoryItem, orderedQty);
  }

  const restored = [];
  for (const { invItem, amount, unit } of restorations.values()) {
    invItem.quantity = invItem.quantity + amount;
    invItem.lastUpdatedAt = new Date();
    await invItem.save();

    restored.push({
      itemId: String(invItem._id),
      name: invItem.name,
      restored: amount,
      unit,
      remaining: invItem.quantity,
    });
  }
  invalidateAvailabilityCache();

  return restored;
};

module.exports = {
  createInventoryItem,
  exportInventoryReport,
  getInventoryItems,
  getLowStockItems,
  updateInventoryItem,
  adjustInventoryItem,
  deleteInventoryItem,
  deductInventoryForOrderItems,
  restoreInventoryForOrderItems,
  totalDeductionCost,
  getStockStatus,
};
