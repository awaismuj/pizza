const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");
const createHttpError = require("http-errors");
const { attachDishAvailability } = require("../utils/stockAvailability");

// Dish forms send either a category's _id (when picked from a dropdown) or a
// plain category name (older/manual API calls). Resolve either form to the
// actual category document so dishes never end up silently uncategorized.
const resolveCategoryDoc = async (categoryValue) => {
  const value = categoryValue ? String(categoryValue).trim() : "";
  if (!value) return null;

  if (mongoose.Types.ObjectId.isValid(value)) {
    const byId = await Category.findById(value);
    if (byId) return byId;
  }

  return Category.findOne({ name: value });
};

const addCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    if (!name || !name.trim()) {
      const error = createHttpError(400, "Please provide category name!");
      return next(error);
    }

    const categoryName = name.trim();
    const existingCategory = await Category.findOne({ name: categoryName });

    if (existingCategory) {
      const error = createHttpError(400, "Category already exists!");
      return next(error);
    }

    const category = await Category.create({
      name: categoryName,
      description: description || "",
      icon: icon || "🍽️",
    });

    res.status(201).json({
      success: true,
      message: "Category added!",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const reorderCategories = async (req, res, next) => {
  try {
    const { order } = req.body; // [{ id, position }]
    if (!Array.isArray(order)) {
      const error = createHttpError(400, "Order must be an array");
      return next(error);
    }

    const ops = order.map((item) => {
      return Category.findByIdAndUpdate(item.id, { order: Number(item.position) }, { new: true });
    });

    await Promise.all(ops);

    res.status(200).json({ success: true, message: "Categories reordered" });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    if (!id) {
      const error = createHttpError(400, "Category id is required!");
      return next(error);
    }

    if (!name || !name.trim()) {
      const error = createHttpError(400, "Please provide category name!");
      return next(error);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: name.trim(), description: description || "", icon: icon || "🍽️" },
      { new: true }
    );

    if (!updatedCategory) {
      const error = createHttpError(404, "Category not found!");
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = createHttpError(400, "Category id is required!");
      return next(error);
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      const error = createHttpError(404, "Category not found!");
      return next(error);
    }

    await Dish.deleteMany({ category: category._id });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Cleans up a client-submitted variants array: drops empty/invalid rows,
// coerces price to a number, and trims strings. Returns [] for anything
// that isn't an array (simple single-price dishes just have no variants).
const sanitizeVariants = (variants) => {
  if (!Array.isArray(variants)) return [];
  return variants
    .map((v) => ({
      size: String(v?.size || "").trim(),
      crust: String(v?.crust || "").trim(),
      price: Number(v?.price),
      originalPrice: v?.originalPrice ? Number(v.originalPrice) : 0,
    }))
    .filter((v) => v.size && Number.isFinite(v.price) && v.price >= 0);
};

// Sanitizes per-variant recipe overrides. Only kept for a size that also
// exists in `variants` and only when it actually lists ingredients — an
// empty override is the same as "no override", so it's dropped rather than
// stored as dead weight.
const sanitizeVariantIngredients = (variantIngredients, variants) => {
  if (!Array.isArray(variantIngredients)) return [];
  const validSizes = new Set((variants || []).map((v) => v.size));

  return variantIngredients
    .map((vi) => ({
      size: String(vi?.size || "").trim(),
      crust: String(vi?.crust || "").trim(),
      ingredients: Array.isArray(vi?.ingredients)
        ? vi.ingredients
            .map((ing) => ({
              inventoryItem: ing?.inventoryItem || null,
              quantity: Number(ing?.quantity) || 0,
              unit: ing?.unit || "pcs",
            }))
            .filter((ing) => ing.inventoryItem && ing.quantity > 0)
        : [],
    }))
    .filter((vi) => vi.size && validSizes.has(vi.size) && vi.ingredients.length > 0);
};

const addDish = async (req, res, next) => {
  try {
    const { name, price, originalPrice, description, variants, category, image, icon, inventoryItem, inventoryItemQty, isInventoryTracked, ingredients, variantIngredients } = req.body;

    if (!name || !name.trim()) {
      const error = createHttpError(400, "Please provide dish name!");
      return next(error);
    }

    if (!price && price !== 0) {
      const error = createHttpError(400, "Please provide dish price!");
      return next(error);
    }

    const dishName = name.trim();

    const existingDish = await Dish.findOne({ name: dishName });
    if (existingDish) {
      const error = createHttpError(400, "Dish already exists!");
      return next(error);
    }

    const categoryDoc = await resolveCategoryDoc(category);

    if (!categoryDoc) {
      const error = createHttpError(400, "Category not found. Please create the category first.");
      return next(error);
    }

    // isInventoryTracked can arrive as a real boolean (JSON) or as a string ("true"/"false")
    // depending on how the request was made, so normalize it instead of only accepting typeof boolean.
    const trackedFlag = isInventoryTracked === true || isInventoryTracked === "true";

    const sanitizedVariants = sanitizeVariants(variants);

    const dishData = {
      name: dishName,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      description: description ? String(description).trim() : "",
      variants: sanitizedVariants,
      category: categoryDoc._id,
      image: image || "",
      icon: icon || "🍽️",
      inventoryItem: trackedFlag && inventoryItem ? inventoryItem : null,
      inventoryItemQty: Number(inventoryItemQty) > 0 ? Number(inventoryItemQty) : 1,
      isInventoryTracked: trackedFlag,
      ingredients: trackedFlag && Array.isArray(ingredients) ? ingredients : [],
      variantIngredients: trackedFlag ? sanitizeVariantIngredients(variantIngredients, sanitizedVariants) : [],
    };

    const dish = await Dish.create(dishData);

    const populatedDish = await dish.populate({ path: "category", select: "name" });

    res.status(201).json({
      success: true,
      message: "Dish added!",
      data: populatedDish,
    });
  } catch (error) {
    next(error);
  }
};

const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find()
      .populate({ path: "category", select: "name" })
      .sort({ order: 1, createdAt: -1 });
    // availableQty = how many can be sold right now from live inventory
    // (null = not stock-tracked). Powers the "Only 4 left" messages.
    const withAvailability = await attachDishAvailability(dishes);
    res.status(200).json({ success: true, data: withAvailability });
  } catch (error) {
    next(error);
  }
};

const reorderDishes = async (req, res, next) => {
  try {
    const { order } = req.body; // [{ id, position }]
    if (!Array.isArray(order)) {
      const error = createHttpError(400, "Order must be an array");
      return next(error);
    }

    const ops = order.map((item) => {
      return Dish.findByIdAndUpdate(item.id, { order: Number(item.position) }, { new: true });
    });

    await Promise.all(ops);

    res.status(200).json({ success: true, message: "Dishes reordered" });
  } catch (error) {
    next(error);
  }
};

const updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, originalPrice, description, variants, category, image, icon, inventoryItem, inventoryItemQty, isInventoryTracked, ingredients, variantIngredients } = req.body;

    if (!id) {
      const error = createHttpError(400, "Dish id is required!");
      return next(error);
    }

    if (!name || !name.trim()) {
      const error = createHttpError(400, "Please provide dish name!");
      return next(error);
    }

    if (!price && price !== 0) {
      const error = createHttpError(400, "Please provide dish price!");
      return next(error);
    }

    const categoryDoc = await resolveCategoryDoc(category);

    if (!categoryDoc) {
      const error = createHttpError(400, "Category not found. Please create the category first.");
      return next(error);
    }

    const trackedFlag = isInventoryTracked === true || isInventoryTracked === "true";
    const sanitizedVariants = sanitizeVariants(variants);
    const existingDish = await Dish.findById(id);
    if (!existingDish) return next(createHttpError(404, "Dish not found!"));
    const pricesChanged =
      existingDish.price !== Number(price) ||
      existingDish.originalPrice !== (originalPrice ? Number(originalPrice) : 0) ||
      JSON.stringify((existingDish.variants || []).map(({ size, price: variantPrice, originalPrice: variantOriginal }) =>
        [size, variantPrice, variantOriginal || 0]
      )) !== JSON.stringify(sanitizedVariants.map(({ size, price: variantPrice, originalPrice: variantOriginal }) =>
        [size, variantPrice, variantOriginal || 0]
      ));
    if (pricesChanged && !req.permissions?.includes("menu.changePrice")) {
      return next(createHttpError(403, "You do not have permission to change dish prices."));
    }
    if (pricesChanged) req.auditActionOverride = "dish.price.changed";

    const updateData = {
      name: name.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      description: description ? String(description).trim() : "",
      variants: sanitizedVariants,
      category: categoryDoc._id,
      image: image || "",
      icon: icon || "🍽️",
      inventoryItem: trackedFlag && inventoryItem ? inventoryItem : null,
      inventoryItemQty: Number(inventoryItemQty) > 0 ? Number(inventoryItemQty) : 1,
      isInventoryTracked: trackedFlag,
      ingredients: trackedFlag && Array.isArray(ingredients) ? ingredients : [],
      variantIngredients: trackedFlag ? sanitizeVariantIngredients(variantIngredients, sanitizedVariants) : [],
    };

    // Remove undefined so we don't overwrite unintentionally
    Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

    const updatedDish = await Dish.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate({ path: "category", select: "name" });

    if (!updatedDish) {
      const error = createHttpError(404, "Dish not found!");
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Dish updated successfully!",
      data: updatedDish,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = createHttpError(400, "Dish id is required!");
      return next(error);
    }

    const dish = await Dish.findByIdAndDelete(id);

    if (!dish) {
      const error = createHttpError(404, "Dish not found!");
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Dish deleted successfully!",
      data: dish,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  getCategories,
  reorderCategories,
  updateCategory,
  deleteCategory,
  addDish,
  getDishes,
  reorderDishes,
  updateDish,
  deleteDish,
};
