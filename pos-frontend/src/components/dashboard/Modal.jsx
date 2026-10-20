import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaUpload } from "react-icons/fa";
import { IoCloudUploadOutline, IoCloseCircle } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  addTable,
  updateTable,
  deleteTable,
  addCategory,
  updateCategory,
  addDish,
  updateDish,
  getCategories,
  getInventoryItems,
  updateInventoryItem,
  uploadImage,
} from "../../https";
import { enqueueSnackbar } from "notistack";
import { resolveImageUrl } from "../../utils";
import { FoodIcon, VECTOR_FOOD_ICONS } from "../../utils/foodIcons";

const UNIT_OPTIONS = ["pcs", "g", "kg", "ml", "l"];
const EMOJI_OPTIONS = ["🍕", "🍔", "🌯", "🍟", "🥤", "🍗", "🥪", "🥗", "🍰", "☕"];
const POPULAR_TAGS = ["Vegetarian", "Spicy", "Chef Special", "Gluten-Free", "Kids Friendly", "Bestseller", "New", "Cheese Burst", "Crispy"];


// Usual pizza recipe — auto-filled the first time a NEW dish is put into a
// category whose name contains "pizza" (see applyPizzaDefaults below), so
// staff don't have to add the same five ingredients by hand every time.
// Matched against existing Inventory item names by keyword, so it only
// fills in items that actually exist yet — anything missing is called out
// so it can be added to Inventory first.
const PIZZA_DEFAULT_INGREDIENTS = [
  { label: "Mayonnaise", keywords: ["mayonnaise", "mayo"], quantity: 30, unit: "g" },
  { label: "Cheese", keywords: ["cheese", "mozzarella"], quantity: 100, unit: "g" },
  { label: "Maida (pizza dough flour)", keywords: ["maida", "dough flour", "pizza flour", "flour"], quantity: 200, unit: "g" },
  { label: "Chicken (cooked/shredded)", keywords: ["chicken"], quantity: 80, unit: "g" },
  { label: "Pizza sauce", keywords: ["pizza sauce", "tomato sauce", "sauce"], quantity: 50, unit: "g" },
];

const isUploadedImage = (value = "") => value.startsWith("http") || value.startsWith("/uploads/");

const Modal = ({ action, setIsModalOpen, initialData = null }) => {
  const isEdit = Boolean(initialData && initialData._id);
  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
    enabled: action === "dishes",
  });
  const categories = categoriesData?.data?.data ?? [];

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryItems,
    placeholderData: keepPreviousData,
    enabled: action === "dishes",
  });
  const inventoryItems = inventoryData?.data?.data ?? [];

  const buildInitialFormData = () => ({
    // table
    tableNo: initialData?.tableNo ?? "",
    seats: initialData?.seats ?? "",
    // category
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    icon: initialData?.icon || "🍽️",
    // dish
    price: initialData?.price ?? "",
    originalPrice: initialData?.originalPrice ? initialData.originalPrice : "",
    category: initialData?.category?._id || initialData?.category || "",
    image: initialData?.image ?? "",
    sku: initialData?.sku ?? "",
    barcode: initialData?.barcode ?? "",
    brand: initialData?.brand ?? "In-House",
    isFeatured: Boolean(initialData?.isFeatured),
    status: initialData?.status ?? "active",
    tags: Array.isArray(initialData?.tags) && initialData.tags.length > 0
      ? initialData.tags
      : Array.isArray(initialData?.dietaryTags)
      ? initialData.dietaryTags
      : (initialData?.tags ? [initialData.tags] : []),
    isInventoryTracked: Boolean(initialData?.isInventoryTracked),

    // A dish whose stock rows are all counted in items/pieces (e.g. Coke
    // 1.5 Liter x 1) reopens in "Single item" mode; anything using weight or
    // volume units (g, kg, ml, l) reopens in "Recipe" mode.
    trackingMode: (() => {
      const rows = [
        ...(initialData?.ingredients || []),
        ...(initialData?.variantIngredients || []).flatMap((vi) => vi.ingredients || []),
      ];
      if (rows.length === 0) return "simple";
      const weightUnits = ["g", "kg", "ml", "l"];
      return rows.every((r) => !weightUnits.includes(String(r?.unit || "pcs").toLowerCase())) ? "simple" : "recipe";
    })(),
    inventoryItem: initialData?.inventoryItem?._id || initialData?.inventoryItem || "",
    // How much of that item one dish consumes, in the item's own unit
    // (e.g. 300 ml out of a 2.25L bottle) — only used in "Single item"
    // mode. Defaults to 1 to match old dishes that never set this.
    inventoryItemQty: initialData?.inventoryItemQty ?? 1,
    ingredients: (() => {
      const rows = (initialData?.ingredients || []).map((ing) => ({
        inventoryItem: ing.inventoryItem?._id || ing.inventoryItem || "",
        quantity: ing.quantity ?? "",
        unit: ing.unit || "pcs",
      }));
      // Older single-item dishes (inventoryItem + inventoryItemQty) show up
      // as one row so they can be edited/extended like the new multi-row list.
      if (
        rows.length === 0 &&
        initialData?.isInventoryTracked &&
        initialData?.inventoryItem &&
        !(initialData?.variantIngredients || []).length
      ) {
        rows.push({
          inventoryItem: initialData.inventoryItem?._id || initialData.inventoryItem,
          quantity: initialData?.inventoryItemQty ?? 1,
          unit: "pcs",
        });
      }
      return rows;
    })(),
    // Per-size recipe overrides (e.g. Small pizza uses 50g sauce, Large uses
    // 120g) — only the sizes that differ from the base recipe above need an
    // entry here.
    variantIngredients: (initialData?.variantIngredients || []).map((vi) => ({
      size: vi.size ?? "",
      crust: vi.crust ?? "",
      ingredients: (vi.ingredients || []).map((ing) => ({
        inventoryItem: ing.inventoryItem?._id || ing.inventoryItem || "",
        quantity: ing.quantity ?? "",
        unit: ing.unit || "pcs",
      })),
    })),
    variants: (initialData?.variants || []).map((v) => ({
      size: v.size ?? "",
      crust: v.crust ?? "",
      price: v.price ?? "",
      originalPrice: v.originalPrice ? v.originalPrice : "",
    })),
  });

  const [formData, setFormData] = useState(buildInitialFormData);
  const [tagInput, setTagInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  // Local edits to a low-stock warning level before "Save" is clicked —
  // keyed by inventory item id. See the "Low-stock warning" panel below.
  const [warnDrafts, setWarnDrafts] = useState({});

  const handleAddTag = (tagText) => {
    const t = tagText.trim();
    if (!t) return;
    if (!formData.tags.includes(t)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fills in the usual pizza recipe (mayonnaise, cheese, maida/dough flour,
  // chicken, pizza sauce) the first time a brand-new dish is put into a
  // "pizza" category, matched against whatever Inventory items already
  // exist by name. Never overwrites a dish that already has ingredients set
  // (editing an existing dish, or one the user already started filling in).
  const applyPizzaDefaults = () => {
    const findMatch = (keywords) =>
      inventoryItems.find((inv) => keywords.some((kw) => inv.name.toLowerCase().includes(kw)));

    const rows = [];
    const missing = [];
    PIZZA_DEFAULT_INGREDIENTS.forEach(({ label, keywords, quantity, unit }) => {
      const match = findMatch(keywords);
      if (match) {
        rows.push({ inventoryItem: match._id, quantity, unit: unit || match.unit || "g" });
      } else {
        missing.push(label);
      }
    });

    if (rows.length === 0) {
      enqueueSnackbar(
        "This is a pizza dish, but none of the usual ingredients (mayonnaise, cheese, maida, chicken, pizza sauce) exist in Inventory yet — add them there first.",
        { variant: "info" }
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      isInventoryTracked: true,
      trackingMode: "recipe",
      ingredients: rows,
    }));

    enqueueSnackbar(
      missing.length > 0
        ? `Prefilled ${rows.length} usual pizza ingredient${rows.length > 1 ? "s" : ""} — adjust the amounts if needed. Add these to Inventory too: ${missing.join(", ")}.`
        : "Prefilled the usual pizza ingredients — adjust the amounts if needed.",
      { variant: "info" }
    );
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({ ...prev, category: categoryId }));

    // Only auto-fill for a brand-new dish that hasn't had any recipe
    // touched yet — never overwrite an edit or something already in progress.
    if (isEdit || formData.ingredients.length > 0 || formData.variantIngredients.length > 0) return;
    const cat = categories.find((c) => c._id === categoryId);
    if (cat && /pizza/i.test(cat.name)) {
      applyPizzaDefaults();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileUpload = async (e, field, setUploading) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadPercent(0);
      const res = await uploadImage(file, setUploadPercent);
      const url = res?.data?.data?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, [field]: url }));
      } else {
        enqueueSnackbar("Upload finished but no image link came back. Please try again.", { variant: "error" });
      }
    } catch (error) {
      const message =
        error?.code === "ECONNABORTED"
          ? "Upload timed out. Check your connection and try again."
          : error?.response?.data?.message ||
            (error?.request && !error?.response
              ? "Could not reach the server. Check your connection and try again."
              : "Image upload failed.");
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setUploading(false);
      setUploadPercent(0);
      e.target.value = "";
    }
  };

  // "Single item" mode: a new row starts at 1 item (not grams).
  const addSimpleRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { inventoryItem: "", quantity: 1, unit: "pcs" }],
    }));
  };

  const addIngredientRow = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { inventoryItem: "", quantity: "", unit: "g" }],
    }));
  };

  const updateIngredientRow = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.ingredients];
      next[index] = { inventoryItem: "", quantity: 1, unit: "pcs", ...next[index], [field]: value };

      if (field === "inventoryItem") {
        const invItem = inventoryItems.find((i) => i._id === value);
        if (invItem) next[index].unit = invItem.unit || next[index].unit;
      }

      return { ...prev, ingredients: next };
    });
  };

  const removeIngredientRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // ---- per-size recipe overrides ----

  const variantOverrideFor = (size) => formData.variantIngredients.find((vi) => vi.size === size);

  // Every declared size (Small/Medium/Large/...) gets its own recipe editor
  // directly — no on/off toggle. Adding the first ingredient for a size
  // creates its entry in variantIngredients on the fly.
  const addVariantIngredientRow = (size) => {
    setFormData((prev) => {
      const exists = prev.variantIngredients.some((vi) => vi.size === size);
      const variantIngredients = exists
        ? prev.variantIngredients.map((vi) =>
            vi.size === size
              ? { ...vi, ingredients: [...vi.ingredients, { inventoryItem: "", quantity: "", unit: "g" }] }
              : vi
          )
        : [...prev.variantIngredients, { size, crust: "", ingredients: [{ inventoryItem: "", quantity: "", unit: "g" }] }];
      return { ...prev, variantIngredients };
    });
  };

  const updateVariantIngredientRow = (size, rowIndex, field, value) => {
    setFormData((prev) => {
      const exists = prev.variantIngredients.some((vi) => vi.size === size);
      const base = exists ? prev.variantIngredients : [...prev.variantIngredients, { size, crust: "", ingredients: [] }];
      return {
        ...prev,
        variantIngredients: base.map((vi) => {
          if (vi.size !== size) return vi;
          const rows = [...vi.ingredients];
          rows[rowIndex] = { inventoryItem: "", quantity: 1, unit: "pcs", ...rows[rowIndex], [field]: value };
          if (field === "inventoryItem") {
            const invItem = inventoryItems.find((i) => i._id === value);
            if (invItem) rows[rowIndex].unit = invItem.unit || rows[rowIndex].unit;
          }
          return { ...vi, ingredients: rows };
        }),
      };
    });
  };

  // "Single item" mode with sizes (e.g. cold drinks: Regular / 1 Ltr / 1.5 Ltr /
  // 2.25 Ltr): each size links to one OR MORE inventory items, each counted
  // in items (not grams). Stored as that size's recipe rows.
  const addSizeItemRow = (size) => {
    setFormData((prev) => {
      const exists = prev.variantIngredients.some((vi) => vi.size === size);
      const blank = { inventoryItem: "", quantity: 1, unit: "pcs" };
      const variantIngredients = exists
        ? prev.variantIngredients.map((vi) =>
            vi.size === size ? { ...vi, ingredients: [...vi.ingredients, blank] } : vi
          )
        : [...prev.variantIngredients, { size, crust: "", ingredients: [blank] }];
      return { ...prev, variantIngredients };
    });
  };

  const removeVariantIngredientRow = (size, rowIndex) => {
    setFormData((prev) => ({
      ...prev,
      variantIngredients: prev.variantIngredients.map((vi) =>
        vi.size === size ? { ...vi, ingredients: vi.ingredients.filter((_, i) => i !== rowIndex) } : vi
      ),
    }));
  };

  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", crust: "", price: "", originalPrice: "" }],
    }));
  };

  const updateVariantRow = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, variants: next };
    });
  };

  const removeVariantRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Once a dish sells by size, each size gets its own recipe — there's no
  // more "base" recipe to fall back to, so the single ingredients-per-dish
  // list below is only used for simple, single-price dishes.
  const sizeList = [...new Set(formData.variants.map((v) => v.size.trim()).filter(Boolean))];
  const hasSizeVariants = sizeList.length > 0;

  const mutation = useMutation({
    mutationFn: (reqData) => {
      if (action === "table") {
        return isEdit ? updateTable({ tableId: initialData._id, ...reqData }) : addTable(reqData);
      }
      if (action === "category") {
        return isEdit ? updateCategory({ categoryId: initialData._id, ...reqData }) : addCategory(reqData);
      }
      // action === 'dishes'
      return isEdit ? updateDish({ dishId: initialData._id, ...reqData }) : addDish(reqData);
    },
    onSuccess: (res) => {
      setIsModalOpen(false);
      queryClient.invalidateQueries(["tables"]);
      queryClient.invalidateQueries(["categories"]);
      queryClient.invalidateQueries(["dishes"]);
      const { data } = res;
      enqueueSnackbar(data?.message || "Saved successfully", { variant: "success" });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Something went wrong";
      enqueueSnackbar(message, { variant: "error" });
      console.error(error);
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: () => deleteTable(initialData._id),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries(["tables"]);
      enqueueSnackbar("Dining table station deleted successfully.", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete table.", { variant: "error" });
    },
  });

  const handleDeleteTable = () => {
    if (formData.status === "Booked") {
      enqueueSnackbar("Cannot delete an occupied table. Free or release table first.", { variant: "warning" });
      return;
    }
    if (window.confirm(`Are you sure you want to delete Table ${formData.tableNo || ""}? This action cannot be undone.`)) {
      deleteTableMutation.mutate();
    }
  };

  // Every distinct inventory item currently referenced by this dish's
  // recipe (base ingredients + any per-size overrides) — used to show one
  // "low-stock warning" control per item actually in use, instead of
  // sending staff off to the separate Inventory page for this.
  const usedInventoryIds = [
    ...new Set([
      ...formData.ingredients.map((r) => r.inventoryItem).filter(Boolean),
      ...formData.variantIngredients.flatMap((vi) => vi.ingredients.map((r) => r.inventoryItem).filter(Boolean)),
    ]),
  ];

  const warnLevelMutation = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["low-stock"]);
      enqueueSnackbar("Low-stock warning updated.", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update warning level.", { variant: "error" });
    },
  });

  const saveWarnLevel = (inventoryId) => {
    const draft = warnDrafts[inventoryId];
    if (draft === undefined || draft === "" || Number(draft) < 0) return;
    warnLevelMutation.mutate({ inventoryId, reorderLevel: Number(draft) });
  };

  // One "inventory item + how many items" row for Single item mode.
  const renderSimpleRow = (row, key, canRemove, onChange, onRemove) => (
    <div key={key} className="flex gap-2 items-center">
      <select
        value={row.inventoryItem}
        onChange={(e) => onChange("inventoryItem", e.target.value)}
        className="pos-input flex-1 text-sm py-2"
      >
        <option value="">
          Select item
        </option>
        {inventoryItems.map((inv) => (
          <option key={inv._id} value={inv._id}>
            {inv.name} ({inv.quantity} {inv.unit} in stock)
          </option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        step="1"
        placeholder="Qty"
        value={row.quantity}
        onChange={(e) => onChange("quantity", e.target.value)}
        className="pos-input w-20 text-sm py-2"
      />
      <span className="text-slate-500 dark:text-slate-400 text-xs w-12 truncate font-medium">
        {inventoryItems.find((i) => i._id === row.inventoryItem)?.unit || "items"}
      </span>
      {canRemove && (
        <button type="button" onClick={onRemove} className="text-rose-500 hover:text-rose-700 px-1 font-bold">
          ✕
        </button>
      )}
    </div>
  );

  // In "Single item" mode the quantity is always in the inventory item's own
  // unit (pcs / bottle / ...), so it deducts exactly that many items. In
  // "Recipe" mode the unit the user picked (g, kg, ml, l, pcs) is kept.
  const unitFor = (row) =>
    formData.trackingMode === "simple"
      ? inventoryItems.find((i) => i._id === row.inventoryItem)?.unit || row.unit || "pcs"
      : row.unit;

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = {};

    if (action === "table") {
      payload = {
        tableNo: Number(formData.tableNo),
        seats: Number(formData.seats),
        status: formData.status || "Available",
      };
    } else if (action === "category") {
      payload = { name: formData.name, description: formData.description, icon: formData.icon };
    } else if (action === "dishes") {
      if (!formData.category) {
        enqueueSnackbar("Please select a category.", { variant: "warning" });
        return;
      }

      if (formData.isInventoryTracked && formData.trackingMode === "simple") {
        const rowOk = (row) => row?.inventoryItem && Number(row.quantity) > 0;
        const anySet = hasSizeVariants
          ? formData.variantIngredients.some((vi) => sizeList.includes(vi.size) && vi.ingredients.some(rowOk))
          : formData.ingredients.some(rowOk);
        if (!anySet) {
          enqueueSnackbar(
            hasSizeVariants
              ? "Select an inventory item for at least one size, or turn off inventory tracking."
              : "Please select which inventory item this dish uses.",
            { variant: "warning" }
          );
          return;
        }
      }

      if (formData.isInventoryTracked && formData.trackingMode === "recipe") {
        if (hasSizeVariants) {
          const anyValid = formData.variantIngredients.some((vi) =>
            vi.ingredients.some((row) => row.inventoryItem && Number(row.quantity) > 0)
          );
          if (!anyValid) {
            enqueueSnackbar("Add at least one ingredient for at least one size, or turn off inventory tracking.", {
              variant: "warning",
            });
            return;
          }
        } else {
          const validRows = formData.ingredients.filter((row) => row.inventoryItem && Number(row.quantity) > 0);
          if (validRows.length === 0) {
            enqueueSnackbar("Add at least one ingredient with a quantity, or turn off inventory tracking.", {
              variant: "warning",
            });
            return;
          }
        }
      }

      const validVariants = formData.variants.filter((v) => v.size.trim() && Number(v.price) >= 0 && v.price !== "");
      if (formData.variants.some((v) => v.size.trim() && (v.price === "" || Number(v.price) < 0))) {
        enqueueSnackbar("Every size/crust row needs a price, or remove the row.", { variant: "warning" });
        return;
      }

      payload = {
        name: formData.name,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
        description: formData.description,
        variants: validVariants.map((v) => ({
          size: v.size.trim(),
          crust: v.crust.trim(),
          price: Number(v.price),
          originalPrice: v.originalPrice ? Number(v.originalPrice) : 0,
        })),
        sku: formData.sku,
        barcode: formData.barcode,
        brand: formData.brand,
        isFeatured: formData.isFeatured,
        status: formData.status,
        tags: formData.tags,
        dietaryTags: (formData.tags || []).filter((t) =>
          ["Vegetarian", "Spicy", "Chef Special", "Gluten-Free", "Kids Friendly"].includes(t)
        ),
        category: formData.category,

        image: formData.image,
        icon: formData.icon,
        isInventoryTracked: formData.isInventoryTracked,
        inventoryItem: null,
        inventoryItemQty: Number(formData.inventoryItemQty) > 0 ? Number(formData.inventoryItemQty) : 1,
        ingredients:
          formData.isInventoryTracked && !hasSizeVariants
            ? formData.ingredients
                .filter((row) => row.inventoryItem && Number(row.quantity) > 0)
                .map((row) => ({
                  inventoryItem: row.inventoryItem,
                  quantity: Number(row.quantity),
                  unit: unitFor(row),
                }))
            : [],
        variantIngredients:
          formData.isInventoryTracked && hasSizeVariants
            ? formData.variantIngredients
                .filter((vi) => sizeList.includes(vi.size))
                .map((vi) => ({
                  size: vi.size,
                  crust: vi.crust,
                  ingredients: vi.ingredients
                    .filter((row) => row.inventoryItem && Number(row.quantity) > 0)
                    .map((row) => ({
                      inventoryItem: row.inventoryItem,
                      quantity: Number(row.quantity),
                      unit: unitFor(row),
                    })),
                }))
                .filter((vi) => vi.ingredients.length > 0)
            : [],
      };
    }

    mutation.mutate(payload);
  };

  const titleMap = {
    table: isEdit ? "Edit Table" : "Add Table",
    category: isEdit ? "Edit Category" : "Add Category",
    dishes: isEdit ? "Edit Product" : "Create New Product",
  };

  const submitLabelMap = {
    table: isEdit ? "Update Table" : "Add Table",
    category: isEdit ? "Update Category" : "Add Category",
    dishes: isEdit ? "Update Product" : "Create Product",
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity"
        onClick={handleCloseModal}
      />

      {/* Side Overlay / Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-screen ${
            action === "dishes" ? "max-w-3xl lg:max-w-4xl xl:max-w-5xl" : "max-w-md sm:max-w-lg"
          } bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800`}
          onClick={(e) => e.stopPropagation()}
        >
        {action === "dishes" ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 sticky top-0 z-20 gap-3">
            <div>
              <h2 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">
                {isEdit ? "Edit Product" : "Create New Product"}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <select
                value={formData.status || "active"}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>

              <span className="hidden md:inline text-xs text-slate-400 font-medium">
                Read about: <span className="text-amber-600 dark:text-amber-400 font-semibold cursor-pointer hover:underline">How to Create Product</span>
              </span>

              <button
                type="button"
                onClick={handleCloseModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="modal-dashboard-form"
                disabled={mutation.isPending || uploadingImage || uploadingIcon}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs disabled:opacity-50"
              >
                {mutation.isPending ? "Saving..." : isEdit ? "Save Changes" : "Create"}
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition ml-1"
              >
                <IoMdClose size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shrink-0 sticky top-0 z-20">
            <h2 className="text-slate-900 dark:text-white text-base sm:text-lg font-black tracking-tight">{titleMap[action] || "Modal"}</h2>
            <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <IoMdClose size={20} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} id="modal-dashboard-form" className="p-6 overflow-y-auto space-y-4 flex-1">
          {action === "table" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-3.5">
                <div>
                  <label className="pos-label">Table Number *</label>
                  <input
                    type="number"
                    name="tableNo"
                    value={formData.tableNo}
                    onChange={handleInputChange}
                    placeholder="e.g. 1, 2, 3..."
                    className="pos-input"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Unique numeric identifier for dine-in tickets and KDS routing</p>
                </div>

                <div>
                  <label className="pos-label">Seating Capacity (Guests) *</label>
                  <input
                    type="number"
                    name="seats"
                    min="1"
                    value={formData.seats}
                    onChange={handleInputChange}
                    placeholder="e.g. 2, 4, 6, 8..."
                    className="pos-input"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Maximum guests accommodated at this dining station</p>
                </div>

                {isEdit && (
                  <div>
                    <label className="pos-label">Availability Status</label>
                    <select
                      name="status"
                      value={formData.status || "Available"}
                      onChange={handleInputChange}
                      className="pos-select"
                    >
                      <option value="Available">Available (Open for seating)</option>
                      <option value="Booked">Booked (Occupied with active ticket)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {action === "category" && (
            <>
              <div>
                <label className="pos-label">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pos-input"
                  required
                />
              </div>

              <div>
                <label className="pos-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="pos-input resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="pos-label">Category Icon</label>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center overflow-hidden shrink-0 border border-amber-500/30 shadow-xs">
                    <FoodIcon icon={formData.icon} size={28} />
                  </div>
                  <label className="pos-btn-secondary cursor-pointer flex-1 py-3 text-xs font-bold">
                    <FaUpload size={13} />
                    {uploadingIcon ? `Uploading${uploadPercent ? ` ${uploadPercent}%` : "..."}` : "Upload Custom Icon / SVG"}
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "icon", setUploadingIcon)}
                      disabled={uploadingIcon}
                    />
                  </label>
                </div>
                <p className="text-slate-400 text-xs mb-2 font-medium">Or choose a category vector icon:</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {VECTOR_FOOD_ICONS.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = formData.icon === item.id || (item.emojiMatch && item.emojiMatch.includes(formData.icon));
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData((prev) => ({ ...prev, icon: item.id }))}
                        title={item.label}
                        className={`h-11 rounded-xl flex flex-col items-center justify-center gap-1 transition border ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900"
                        }`}
                      >
                        <IconComponent size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {action === "dishes" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Basic Info, Category & Brand, Variants */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Basic Info Card */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Basic Info
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Featured</span>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.isFeatured)}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500 relative transition-colors" />
                    </label>
                  </div>

                  <div>
                    <label className="pos-label">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Chicken Fajita Pizza"
                      className="pos-input font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="pos-label">SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. SKU-1042"
                        className="pos-input font-medium"
                      />
                    </div>
                    <div>
                      <label className="pos-label">Barcode</label>
                      <input
                        type="text"
                        name="barcode"
                        value={formData.barcode || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. 890123456"
                        className="pos-input font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="pos-label">Product Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="pos-input resize-none font-medium"
                      rows={3}
                      placeholder="Detailed product ingredients, flavor notes, or preparation details..."
                    />
                  </div>
                </div>

                {/* 2. Category & Brand Card */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Category & Brand
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="pos-label">Product Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className="pos-input font-medium"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {categories.length === 0 && (
                        <p className="text-amber-500 text-xs mt-1">No categories yet — add one first.</p>
                      )}
                    </div>

                    <div>
                      <label className="pos-label">Product Brand / Station</label>
                      <select
                        name="brand"
                        value={formData.brand || "In-House"}
                        onChange={handleInputChange}
                        className="pos-input font-medium"
                      >
                        <option value="In-House">In-House Kitchen</option>
                        <option value="Pizza Oven">Pizza Oven Section</option>
                        <option value="Fast Food">Fried & Fast Food</option>
                        <option value="Grill / Shawarma">Grill & Shawarma Counter</option>
                        <option value="Beverages / Bar">Beverages & Dessert</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="pos-label">Item Emoji Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          type="button"
                          key={emoji}
                          onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                          className={`text-lg w-9 h-9 rounded-xl flex items-center justify-center transition border ${
                            formData.icon === emoji
                              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inventory Deduction & Recipe Configuration */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 p-4 space-y-3">
                    <label className="flex items-center gap-2.5 font-semibold text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isInventoryTracked}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isInventoryTracked: e.target.checked }))}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                      />
                      Deduct stock from inventory when this product is ordered
                    </label>

                    {formData.isInventoryTracked && (
                      <div className="space-y-3 pt-1">
                        <div className="flex gap-2 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, trackingMode: "simple" }))}
                            className={`px-3 py-2 rounded-lg flex-1 border transition ${
                              formData.trackingMode === "simple"
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs font-bold"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            Single Item
                            <span className="block text-[10px] font-normal opacity-80 mt-0.5">e.g. cold drink, bottle</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, trackingMode: "recipe" }))}
                            className={`px-3 py-2 rounded-lg flex-1 border transition ${
                              formData.trackingMode === "recipe"
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs font-bold"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            Recipe
                            <span className="block text-[10px] font-normal opacity-80 mt-0.5">e.g. 200g flour per pizza</span>
                          </button>
                        </div>

                        {formData.trackingMode === "simple" && (
                          <div className="space-y-2">
                            {hasSizeVariants
                              ? sizeList.map((size) => {
                                  const rows = variantOverrideFor(size)?.ingredients || [];
                                  const shown = rows.length > 0 ? rows : [{ inventoryItem: "", quantity: 1, unit: "pcs" }];
                                  return (
                                    <div key={size} className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 space-y-2">
                                      <p className="text-xs font-bold text-slate-900 dark:text-white">{size}</p>
                                      {shown.map((row, rowIndex) =>
                                        renderSimpleRow(
                                          row,
                                          rowIndex,
                                          rows.length > 0,
                                          (field, value) => updateVariantIngredientRow(size, rowIndex, field, value),
                                          () => removeVariantIngredientRow(size, rowIndex)
                                        )
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => addSizeItemRow(size)}
                                        className="text-amber-600 dark:text-amber-400 hover:underline text-xs font-semibold"
                                      >
                                        + Add another item for {size}
                                      </button>
                                    </div>
                                  );
                                })
                              : (() => {
                                  const rows = formData.ingredients;
                                  const shown = rows.length > 0 ? rows : [{ inventoryItem: "", quantity: 1, unit: "pcs" }];
                                  return (
                                    <>
                                      {shown.map((row, index) =>
                                        renderSimpleRow(
                                          row,
                                          index,
                                          rows.length > 0,
                                          (field, value) => updateIngredientRow(index, field, value),
                                          () => removeIngredientRow(index)
                                        )
                                      )}
                                      <button
                                        type="button"
                                        onClick={addSimpleRow}
                                        className="text-amber-600 dark:text-amber-400 hover:underline text-xs font-semibold"
                                      >
                                        + Add item
                                      </button>
                                    </>
                                  );
                                })()}
                          </div>
                        )}

                        {formData.trackingMode === "recipe" && (
                          <div className="space-y-2">
                            {hasSizeVariants ? (
                              sizeList.map((size) => {
                                const override = variantOverrideFor(size);
                                if (!override) return null;
                                return (
                                  <div key={size} className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 space-y-2">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{size}</p>
                                    {override.ingredients.map((row, rowIndex) => (
                                      <div key={rowIndex} className="flex gap-2 items-center">
                                        <select
                                          value={row.inventoryItem}
                                          onChange={(e) => updateVariantIngredientRow(size, rowIndex, "inventoryItem", e.target.value)}
                                          className="pos-input text-xs py-1.5 flex-1"
                                        >
                                          <option value="">Select item</option>
                                          {inventoryItems.map((inv) => (
                                            <option key={inv._id} value={inv._id}>{inv.name}</option>
                                          ))}
                                        </select>
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          placeholder="Qty"
                                          value={row.quantity}
                                          onChange={(e) => updateVariantIngredientRow(size, rowIndex, "quantity", e.target.value)}
                                          className="pos-input text-xs py-1.5 w-20"
                                        />
                                        <select
                                          value={row.unit}
                                          onChange={(e) => updateVariantIngredientRow(size, rowIndex, "unit", e.target.value)}
                                          className="pos-input text-xs py-1.5 w-20"
                                        >
                                          {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                        <button
                                          type="button"
                                          onClick={() => removeVariantIngredientRow(size, rowIndex)}
                                          className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => addVariantIngredientRow(size)}
                                      className="text-amber-600 dark:text-amber-400 hover:underline text-xs font-semibold"
                                    >
                                      + Add ingredient for {size}
                                    </button>
                                  </div>
                                );
                              })
                            ) : (
                              <>
                                {formData.ingredients.map((row, index) => (
                                  <div key={index} className="flex gap-2 items-center">
                                    <select
                                      value={row.inventoryItem}
                                      onChange={(e) => updateIngredientRow(index, "inventoryItem", e.target.value)}
                                      className="pos-input text-xs py-1.5 flex-1"
                                    >
                                      <option value="">Select item</option>
                                      {inventoryItems.map((inv) => (
                                        <option key={inv._id} value={inv._id}>{inv.name}</option>
                                      ))}
                                    </select>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="Qty"
                                      value={row.quantity}
                                      onChange={(e) => updateIngredientRow(index, "quantity", e.target.value)}
                                      className="pos-input text-xs py-1.5 w-20"
                                    />
                                    <select
                                      value={row.unit}
                                      onChange={(e) => updateIngredientRow(index, "unit", e.target.value)}
                                      className="pos-input text-xs py-1.5 w-20"
                                    >
                                      {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                    <button
                                      type="button"
                                      onClick={() => removeIngredientRow(index)}
                                      className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={addIngredientRow}
                                  className="text-amber-600 dark:text-amber-400 hover:underline text-xs font-semibold"
                                >
                                  + Add ingredient
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Variants Card */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Variants
                    </h3>
                    <button
                      type="button"
                      onClick={addVariantRow}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                    >
                      + Add New
                    </button>
                  </div>

                  {formData.variants.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-xs italic font-medium">
                      No size or crust variants defined — this product sells at the base price.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.variants.map((v, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5">
                          <input
                            type="text"
                            placeholder="Size (e.g. Small)"
                            value={v.size}
                            onChange={(e) => updateVariantRow(index, "size", e.target.value)}
                            className="pos-input py-1 px-2 text-xs font-medium"
                          />
                          <input
                            type="text"
                            placeholder="Crust (optional)"
                            value={v.crust}
                            onChange={(e) => updateVariantRow(index, "crust", e.target.value)}
                            className="pos-input py-1 px-2 text-xs font-medium"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            value={v.price}
                            onChange={(e) => updateVariantRow(index, "price", e.target.value)}
                            className="pos-input py-1 px-2 text-xs font-medium"
                          />
                          <input
                            type="number"
                            placeholder="Was (optional)"
                            min="0"
                            step="0.01"
                            value={v.originalPrice}
                            onChange={(e) => updateVariantRow(index, "originalPrice", e.target.value)}
                            className="pos-input py-1 px-2 text-xs font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantRow(index)}
                            className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                            aria-label="Remove option"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {usedInventoryIds.length > 0 && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 p-3.5 space-y-2 mt-3">
                      <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Low-Stock Warning Limits
                      </label>
                      <div className="space-y-1.5">
                        {usedInventoryIds.map((invId) => {
                          const inv = inventoryItems.find((i) => i._id === invId);
                          if (!inv) return null;
                          const draft = warnDrafts[invId] ?? inv.reorderLevel ?? 0;
                          return (
                            <div key={invId} className="flex items-center gap-2">
                              <span className="flex-1 text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                                {inv.name}
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={draft}
                                onChange={(e) => setWarnDrafts((prev) => ({ ...prev, [invId]: e.target.value }))}
                                className="w-20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none text-xs font-mono"
                              />
                              <span className="text-slate-500 text-xs w-8 shrink-0">{inv.unit}</span>
                              <button
                                type="button"
                                onClick={() => saveWarnLevel(invId)}
                                disabled={warnLevelMutation.isPending}
                                className="text-amber-600 dark:text-amber-400 hover:underline text-xs font-semibold shrink-0"
                              >
                                Save
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Media Uploader, Base Pricing, Tags */}
              <div className="lg:col-span-5 space-y-5">
                {/* 1. Media / Image Uploader Card */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Media
                  </h3>

                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700/80 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-6 text-center transition flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-850/40 relative group">
                    {formData.image ? (
                      <div className="relative w-full flex flex-col items-center">
                        <img
                          src={resolveImageUrl(formData.image)}
                          alt="Product"
                          className="w-36 h-36 rounded-xl object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="flex items-center gap-2 mt-3.5">
                          <label className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 cursor-pointer shadow-xs transition">
                            {uploadingImage ? `Uploading${uploadPercent ? ` ${uploadPercent}%` : "..."}` : "Change Photo"}
                            <input
                              type="file"
                              accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "image", setUploadingImage)}
                              disabled={uploadingImage}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border border-rose-200 dark:border-rose-900/60"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mb-3 group-hover:scale-105 transition-transform">
                          <IoCloudUploadOutline size={26} />
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Choose a file or drag & drop here.
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 mb-3.5">
                          JPEG, PNG, WEBP, up to 5 MB.
                        </p>
                        <label className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 cursor-pointer shadow-xs transition">
                          {uploadingImage ? `Uploading${uploadPercent ? ` ${uploadPercent}%` : "..."}` : "Browse File"}
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "image", setUploadingImage)}
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Base Pricing Card */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Base Pricing
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="pos-label">Base Price (Rs)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="pos-input font-medium"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required={formData.variants.length === 0}
                      />
                    </div>
                    <div>
                      <label className="pos-label">Original Price (Strike-through)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className="pos-input font-medium"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 400"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Set higher than Price to show strike-through "was" price (e.g. <span className="line-through">Rs 400</span> Rs 350).
                    </p>
                  </div>
                </div>

                {/* 3. Tags Card */}
                <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Tags
                  </h3>

                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            handleAddTag(tagInput);
                          }
                        }}
                        placeholder="Add tags (press Enter or comma)"
                        className="pos-input text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag(tagInput)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                      >
                        Add
                      </button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-rose-500 ml-0.5 text-xs font-bold"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div>
                      <p className="text-[11px] text-slate-400 font-medium mb-1.5">Quick suggested tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {POPULAR_TAGS.map((t) => {
                          const active = formData.tags.includes(t);
                          return (
                            <button
                              type="button"
                              key={t}
                              onClick={() => (active ? handleRemoveTag(t) : handleAddTag(t))}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition border ${
                                active
                                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-2xs"
                                  : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                              }`}
                            >
                              +{t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {action === "dishes" ? (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 sticky bottom-0 z-20">
            <select
              value={formData.status || "active"}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="pos-select text-xs font-semibold py-2 px-3 w-32 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="modal-dashboard-form"
                disabled={mutation.isPending || uploadingImage || uploadingIcon}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs disabled:opacity-50"
              >
                {mutation.isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shrink-0 sticky bottom-0 z-20">
            {action === "table" && isEdit ? (
              <button
                type="button"
                onClick={handleDeleteTable}
                disabled={deleteTableMutation.isPending || mutation.isPending}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/60 transition disabled:opacity-50 shrink-0"
              >
                {deleteTableMutation.isPending ? "Deleting..." : "Delete Station"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              form="modal-dashboard-form"
              disabled={mutation.isPending || uploadingImage || uploadingIcon || deleteTableMutation.isPending}
              className="pos-btn-primary flex-1 py-2.5 text-xs font-bold shadow-sm disabled:opacity-50"
            >
              {mutation.isPending ? "Saving..." : submitLabelMap[action] || "Save"}
            </button>
          </div>
        )}
        </motion.div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
};

export default Modal;
