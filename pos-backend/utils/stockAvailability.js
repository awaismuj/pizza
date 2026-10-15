// Real-time "how many can I actually sell?" calculations, straight from the
// live inventory. Used by:
//   - GET /api/dish/public + /api/deal/public  -> availableQty on every item
//   - POST /api/order/public/checkout          -> blocks over-ordering
//
// availableQty semantics:  null  = not stock-tracked (unlimited)
//                          0     = out of stock
//                          N     = at most N can be ordered right now
//
// Online orders that are still "Pending" (not yet accepted by staff) have
// NOT deducted stock yet, but they ARE counted as reserved here, so two
// customers can't both grab the last few items.
const Dish = require("../models/dishModel");
const InventoryItem = require("../models/inventoryItemModel");
const Order = require("../models/orderModel");
const { convertQuantity } = require("./stockUtils");

const CACHE_TTL_MS = 3000;
let cache = null;

const invalidateAvailabilityCache = () => {
  cache = null;
};

const EPS = 1e-9;

// ---- resolving order lines to dishes (in memory, no extra queries) -------

const resolveDishForLine = (line, ctx) => {
  const id = line?.dishId || line?.dish || line?.id;
  if (id && ctx.dishesById.has(String(id))) return ctx.dishesById.get(String(id));

  const name = typeof line?.name === "string" ? line.name.trim().toLowerCase() : "";
  if (!name) return null;
  // Online lines are stored as "Pizza (Large, Pan)" - try the bare name too.
  const bare = name.replace(/\s*\(.*\)\s*$/, "");
  return ctx.dishesByName.get(name) || ctx.dishesByName.get(bare) || null;
};

const resolveDishForDealItem = (dealItem, ctx) => {
  // dishId may be a plain ObjectId or a populated dish document.
  const linkedId = dealItem?.dishId?._id || dealItem?.dishId;
  if (linkedId && ctx.dishesById.has(String(linkedId))) {
    return ctx.dishesById.get(String(linkedId));
  }
  const label = typeof dealItem?.label === "string" ? dealItem.label.trim().toLowerCase() : "";
  if (!label) return null;
  if (ctx.dishesByName.has(label)) return ctx.dishesByName.get(label);

  let best = null;
  for (const [name, dish] of ctx.dishesByName) {
    if (label.includes(name) && (!best || name.length > best.name.length)) best = { name, dish };
  }
  return best ? best.dish : null;
};

// ---- requirement / capacity maths --------------------------------------

// A pizza's Small size uses less sauce/cheese than its Large size, so a
// dish can override its flat `ingredients` recipe per size/crust via
// `variantIngredients`. Picks, in order: an exact size+crust match, a
// size-only override, then falls back to the dish's one flat recipe.
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

// Adds what `qty` units of `dish` (at the given size/crust, if any) consume
// into `add(invEntry, amountInInvUnit)`.
const accumulateDish = (dish, qty, ctx, add, variant = null) => {
  if (!dish || !dish.isInventoryTracked || !(qty > 0)) return;

  const recipe = recipeFor(dish, variant);

  if (Array.isArray(recipe) && recipe.length > 0) {
    for (const ing of recipe) {
      const inv = ctx.stock.get(String(ing.inventoryItem));
      if (!inv || !inv.isTrackable) continue;
      const per = Number(ing.quantity) || 0;
      if (per <= 0) continue;
      const amount = convertQuantity(per * qty, ing.unit || inv.unit, inv.unit);
      if (amount == null) continue;
      add(inv, amount);
    }
    return;
  }

  if (dish.inventoryItem) {
    const inv = ctx.stock.get(String(dish.inventoryItem));
    const perDishQty = Number(dish.inventoryItemQty) > 0 ? Number(dish.inventoryItemQty) : 1;
    if (inv && inv.isTrackable) add(inv, perDishQty * qty);
  }
};

const requirementsForItems = (items, ctx) => {
  const required = new Map(); // invId -> amount
  const add = (inv, amount) => required.set(String(inv._id), (required.get(String(inv._id)) || 0) + amount);

  for (const line of items || []) {
    const qty = Number(line?.quantity ?? line?.qty ?? 1);
    if (!Number.isFinite(qty) || qty <= 0) continue;

    if (line?.isDeal && Array.isArray(line.dealItems)) {
      for (const di of line.dealItems) {
        const compQty = Math.max(1, Number(di?.quantity) || 1) * qty;
        accumulateDish(resolveDishForDealItem(di, ctx), compQty, ctx, add, { size: di?.size, crust: di?.crust });
      }
      continue;
    }
    accumulateDish(resolveDishForLine(line, ctx), qty, ctx, add, { size: line?.size, crust: line?.crust });
  }
  return required;
};

// Most units of one recipe that current (unreserved) stock can make.
const maxUnitsForRecipe = (recipe, dish, ctx) => {
  let min = Infinity;

  if (Array.isArray(recipe) && recipe.length > 0) {
    for (const ing of recipe) {
      const inv = ctx.stock.get(String(ing.inventoryItem));
      if (!inv || !inv.isTrackable) continue;
      const per = Number(ing.quantity) || 0;
      if (per <= 0) continue;
      const perInInvUnit = convertQuantity(per, ing.unit || inv.unit, inv.unit);
      if (perInInvUnit == null || perInInvUnit <= 0) continue;
      min = Math.min(min, Math.floor(inv.available / perInInvUnit + EPS));
    }
  } else if (dish.inventoryItem) {
    const inv = ctx.stock.get(String(dish.inventoryItem));
    const perDishQty = Number(dish.inventoryItemQty) > 0 ? Number(dish.inventoryItemQty) : 1;
    if (inv && inv.isTrackable) min = Math.floor(inv.available / perDishQty + EPS);
  }

  return min;
};

// Most units of `dish` that current (unreserved) stock can make.
// null = unlimited (not stock-tracked).
//   - With a specific `variant` (checkout time): uses exactly that
//     size/crust's recipe.
//   - Without one (menu browse time, one number per dish/deal card): a dish
//     can have several variants each costing something different, so this
//     takes the LOWEST count across every variant's own recipe — a safe
//     "at least this many, whichever size someone picks" figure that never
//     overpromises a size that happens to use more of a scarce ingredient.
const maxUnitsForDish = (dish, ctx, variant = null) => {
  if (!dish || !dish.isInventoryTracked) return null;

  if (variant) {
    const min = maxUnitsForRecipe(recipeFor(dish, variant), dish, ctx);
    return min === Infinity ? null : Math.max(0, min);
  }

  const variantList = Array.isArray(dish.variants) && dish.variants.length > 0 ? dish.variants : [null];
  let overall = Infinity;
  for (const v of variantList) {
    const min = maxUnitsForRecipe(recipeFor(dish, v), dish, ctx);
    if (min !== Infinity) overall = Math.min(overall, min);
  }

  return overall === Infinity ? null : Math.max(0, overall);
};

const maxUnitsForDeal = (dealItems, ctx) => {
  let min = Infinity;
  for (const di of dealItems || []) {
    const dish = resolveDishForDealItem(di, ctx);
    const units = maxUnitsForDish(dish, ctx);
    if (units == null) continue;
    const compQty = Math.max(1, Number(di?.quantity) || 1);
    min = Math.min(min, Math.floor(units / compQty));
  }
  return min === Infinity ? null : Math.max(0, min);
};

// ---- context (live stock minus what pending online orders have reserved) --

const loadContext = async ({ fresh = false } = {}) => {
  if (!fresh && cache && Date.now() - cache.at < CACHE_TTL_MS) return cache;

  const [invItems, dishes, pendingOrders] = await Promise.all([
    InventoryItem.find().select("name unit quantity isTrackable").lean(),
    Dish.find().select("name isInventoryTracked inventoryItem inventoryItemQty ingredients variantIngredients").lean(),
    Order.find({ orderSource: "Online", orderStatus: "Pending", inventoryDeducted: { $ne: true } })
      .select("items")
      .lean(),
  ]);

  const stock = new Map();
  invItems.forEach((i) => {
    const quantity = Number(i.quantity) || 0;
    stock.set(String(i._id), {
      _id: i._id,
      name: i.name,
      unit: i.unit || "pcs",
      isTrackable: i.isTrackable !== false,
      quantity,
      available: quantity,
    });
  });

  const dishesById = new Map();
  const dishesByName = new Map();
  dishes.forEach((d) => {
    dishesById.set(String(d._id), d);
    dishesByName.set(String(d.name).trim().toLowerCase(), d);
  });

  const ctx = { stock, dishesById, dishesByName, at: Date.now() };

  // Hold back what unaccepted online orders are going to need.
  for (const order of pendingOrders) {
    const reserved = requirementsForItems(order.items, ctx);
    for (const [id, amount] of reserved) {
      const inv = stock.get(id);
      if (inv) inv.available = Math.max(0, inv.available - amount);
    }
  }

  cache = ctx;
  return ctx;
};

// ---- public API ---------------------------------------------------------

// Adds availableQty to plain dish objects.
const attachDishAvailability = async (dishes) => {
  const ctx = await loadContext();
  return dishes.map((d) => {
    const plain = typeof d.toObject === "function" ? d.toObject() : d;
    const availableQty = maxUnitsForDish(ctx.dishesById.get(String(plain._id)), ctx);
    return { ...plain, availableQty };
  });
};

const attachDealAvailability = async (deals) => {
  const ctx = await loadContext();
  return deals.map((d) => {
    const plain = typeof d.toObject === "function" ? d.toObject() : d;
    return { ...plain, availableQty: maxUnitsForDeal(plain.items, ctx) };
  });
};

const shortageMessage = (shortages) =>
  shortages
    .map((s) => {
      if (s.type === "ingredient") return `Not enough ${s.name} in stock right now.`;
      if (s.available <= 0) return `${s.name} is out of stock right now.`;
      return `Only ${s.available} ${s.name} in stock. Please select ${s.available}.`;
    })
    .join(" ");

// Checks a whole order (already price-resolved lines) against live stock.
// Returns [] when everything is available, else a list of shortages.
const findOrderShortages = async (items) => {
  const ctx = await loadContext({ fresh: true });

  const required = requirementsForItems(items, ctx);
  const shortIds = [...required.entries()].filter(([id, amt]) => {
    const inv = ctx.stock.get(id);
    return inv && amt > inv.available + EPS;
  });
  if (shortIds.length === 0) return [];

  // Group lines so different sizes/crusts of one dish are checked together.
  const groups = new Map();
  for (const line of items) {
    const qty = Math.max(1, Number(line?.quantity) || 1);
    if (line?.isDeal) {
      const key = `deal:${line.dealId}`;
      const g = groups.get(key) || { type: "deal", name: line.name, dealItems: line.dealItems, qty: 0 };
      g.qty += qty;
      groups.set(key, g);
    } else {
      const dish = resolveDishForLine(line, ctx);
      if (!dish) continue;
      const key = `dish:${dish._id}`;
      const g = groups.get(key) || { type: "dish", name: dish.name, dish, qty: 0 };
      g.qty += qty;
      groups.set(key, g);
    }
  }

  const shortages = [];
  for (const g of groups.values()) {
    const available = g.type === "deal" ? maxUnitsForDeal(g.dealItems, ctx) : maxUnitsForDish(g.dish, ctx);
    if (available != null && g.qty > available) {
      shortages.push({ type: g.type, name: g.name, requested: g.qty, available });
    }
  }

  // Lines are fine on their own but together (shared ingredient) they're not.
  if (shortages.length === 0) {
    for (const [id, amt] of shortIds) {
      const inv = ctx.stock.get(id);
      shortages.push({ type: "ingredient", name: inv.name, requested: amt, available: inv.available, unit: inv.unit });
    }
  }

  return shortages;
};

module.exports = {
  attachDishAvailability,
  attachDealAvailability,
  findOrderShortages,
  shortageMessage,
  invalidateAvailabilityCache,
};
