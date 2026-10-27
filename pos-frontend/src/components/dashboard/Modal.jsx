import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaUpload } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  addTable,
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
import { I, FoodIcon, FOOD_ICON_OPTIONS, foodIconKey } from "../shared/AppIcons";

// Icon choices used for both category and dish icons (saved as a key like "pizza").
const EMOJI_OPTIONS = FOOD_ICON_OPTIONS.map((o) => o.key);

const UNIT_OPTIONS = ["pcs", "g", "kg", "ml", "l"];

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
    icon: initialData?.icon || "utensils",
    // dish
    price: initialData?.price ?? "",
    originalPrice: initialData?.originalPrice ? initialData.originalPrice : "",
    category: initialData?.category?._id || initialData?.category || "",
    image: initialData?.image ?? "",
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  // Local edits to a low-stock warning level before "Save" is clicked —
  // keyed by inventory item id. See the "Low-stock warning" panel below.
  const [warnDrafts, setWarnDrafts] = useState({});

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
      if (action === "table") return addTable(reqData);
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
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-500 px-2">
          <I.Close aria-hidden="true" />
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
      payload = { tableNo: Number(formData.tableNo), seats: Number(formData.seats) };
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
    dishes: isEdit ? "Edit Dish" : "Add Dish",
  };

  const submitLabelMap = {
    table: isEdit ? "Update Table" : "Add Table",
    category: isEdit ? "Update Category" : "Add Category",
    dishes: isEdit ? "Update Dish" : "Add Dish",
  };

  const modalContent = (
    <div className="pos-modal-backdrop" onClick={handleCloseModal}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="pos-modal-card max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shrink-0 sticky top-0 z-20">
          <h2 className="text-slate-900 dark:text-white text-base sm:text-lg font-black tracking-tight">{titleMap[action] || "Modal"}</h2>
          <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <IoMdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} id="modal-dashboard-form" className="p-6 overflow-y-auto space-y-4 flex-1">
          {action === "table" && (
            <>
              <div>
                <label className="pos-label">Table Number</label>
                <input
                  type="number"
                  name="tableNo"
                  value={formData.tableNo}
                  onChange={handleInputChange}
                  className="pos-input"
                  required
                />
              </div>

              <div>
                <label className="pos-label">Number of Seats</label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="pos-input"
                  required
                />
              </div>
            </>
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
                  <div className="w-14 h-14 rounded-lg bg-[#1f1f1f] flex items-center justify-center overflow-hidden shrink-0">
                    {isUploadedImage(formData.icon) ? (
                      <img src={resolveImageUrl(formData.icon)} alt="Category icon" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-[#f6b100]"><FoodIcon icon={formData.icon} /></span>
                    )}
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
                <p className="text-[#767676] text-xs mb-2">Or pick an icon instead:</p>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                      title={emoji}
                      aria-label={`Icon: ${emoji}`}
                      className={`text-xl w-10 h-10 rounded-lg flex items-center justify-center ${
                        foodIconKey(formData.icon) === emoji ? "bg-yellow-400 text-[#1f1f1f]" : "bg-[#1f1f1f] text-[#d6d6d6] hover:bg-[#2a2a2a]"
                      }`}
                    >
                      <FoodIcon icon={emoji} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {action === "dishes" && (
            <>
              <div>
                <label className="pos-label">Dish Name</label>
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
                <label className="pos-label">Description (optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="pos-input resize-none"
                  rows={2}
                  placeholder="Shown under the name on storefront"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="pos-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="pos-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="pos-label">Original Price (optional)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="pos-input"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 400"
                  />
                </div>
              </div>

              <p className="text-slate-400 text-xs mt-1">
                Set this higher than Price to show a strike-through "was" price on the menu — e.g. Price 350 with
                Original Price 400 shows <span className="line-through">Rs 400.00</span> next to Rs 350.00. Leave
                blank or 0 to hide it.
              </p>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[#ababab] text-sm font-medium">
                    Size / crust options (optional)
                  </label>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="text-xs font-semibold text-[#f6b100] hover:underline"
                  >
                    + Add option
                  </button>
                </div>
                <p className="text-[#767676] text-xs mt-1 mb-2">
                  For items like pizzas sold by size and crust, each at its own price (e.g. Small/Pan Rs 699,
                  Large/Stuffed Rs 1499). Leave empty for a simple single-price item. Leave "Crust" blank for a
                  size-only item.
                </p>
                {formData.variants.length === 0 && (
                  <p className="text-[#5a5a5a] text-xs italic">No size/crust options — this dish sells at one price.</p>
                )}
                <div className="space-y-2">
                  {formData.variants.map((v, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                      <input
                        type="text"
                        placeholder="Size (e.g. Small)"
                        value={v.size}
                        onChange={(e) => updateVariantRow(index, "size", e.target.value)}
                        className="pos-input py-1 px-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Crust (optional)"
                        value={v.crust}
                        onChange={(e) => updateVariantRow(index, "crust", e.target.value)}
                        className="pos-input py-1 px-2 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={v.price}
                        onChange={(e) => updateVariantRow(index, "price", e.target.value)}
                        className="pos-input py-1 px-2 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Was (optional)"
                        min="0"
                        step="0.01"
                        value={v.originalPrice}
                        onChange={(e) => updateVariantRow(index, "originalPrice", e.target.value)}
                        className="pos-input py-1 px-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(index)}
                        className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                        aria-label="Remove option"
                      >
                        <I.Close aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="pos-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="pos-input"
                  required
                >
                  <option value="">
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-amber-500 text-xs mt-1">No categories yet — add a category first.</p>
                )}
                {!isEdit && /pizza/i.test(categories.find((c) => c._id === formData.category)?.name || "") && (
                  <p className="text-slate-400 text-xs mt-1">
                    Pizza category selected — the usual ingredients (mayonnaise, cheese, maida, chicken, pizza sauce)
                    were prefilled below where they exist in Inventory.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Item Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                      title={emoji}
                      aria-label={`Icon: ${emoji}`}
                      className={`text-xl w-10 h-10 rounded-lg flex items-center justify-center ${
                        foodIconKey(formData.icon) === emoji ? "bg-yellow-400 text-[#1f1f1f]" : "bg-[#1f1f1f] text-[#d6d6d6] hover:bg-[#2a2a2a]"
                      }`}
                    >
                      <FoodIcon icon={emoji} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Photo (optional)</label>
                <div className="flex items-center gap-3">
                  {formData.image && (
                    <img
                      src={resolveImageUrl(formData.image)}
                      alt="Dish"
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <label className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer text-[#f5f5f5] px-4 py-3 rounded-lg text-sm font-medium flex-1 justify-center">
                    <FaUpload />
                    {uploadingImage ? `Uploading${uploadPercent ? ` ${uploadPercent}%` : "..."}` : formData.image ? "Change photo" : "Upload photo"}
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "image", setUploadingImage)}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-lg bg-[#1f1f1f] p-4 space-y-3">
                <label className="flex items-center gap-3 text-[#f5f5f5] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isInventoryTracked}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isInventoryTracked: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  Deduct stock from inventory when this is ordered
                </label>

                {formData.isInventoryTracked && (
                  <>
                    <div className="flex gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, trackingMode: "simple" }))}
                        className={`px-3 py-2 rounded-lg flex-1 ${
                          formData.trackingMode === "simple" ? "bg-yellow-400 text-gray-900" : "bg-[#2a2a2a] text-[#ababab]"
                        }`}
                      >
                        Single item
                        <br />
                        <span className="text-xs font-normal">e.g. bottled cold drink, water</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, trackingMode: "recipe" }))}
                        className={`px-3 py-2 rounded-lg flex-1 ${
                          formData.trackingMode === "recipe" ? "bg-yellow-400 text-gray-900" : "bg-[#2a2a2a] text-[#ababab]"
                        }`}
                      >
                        Recipe
                        <br />
                        <span className="text-xs font-normal">e.g. 200g flour per pizza</span>
                      </button>
                    </div>

                    {formData.trackingMode === "simple" && (
                      <div className="space-y-2">
                        <label className="block text-[#ababab] text-sm font-medium">
                          {hasSizeVariants ? "Stock items used per dish (by size)" : "Stock items used per dish"}
                        </label>
                        <p className="text-[#767676] text-xs -mt-1 mb-1">
                          {hasSizeVariants
                            ? "Link each size to the inventory item(s) it uses, counted in items (not grams). Add more than one item per size if needed. e.g. Regular = Next Cola 300 ml x 1, 1.5 Ltr = Coke 1.5 Liter x 1."
                            : "Pick the inventory item(s) this dish uses, counted in items (not grams). You can add more than one."}
                        </p>

                        {hasSizeVariants
                          ? sizeList.map((size) => {
                              const rows = variantOverrideFor(size)?.ingredients || [];
                              const shown = rows.length > 0 ? rows : [{ inventoryItem: "", quantity: 1, unit: "pcs" }];
                              return (
                                <div key={size} className="rounded-lg bg-[#262626] p-3 space-y-2">
                                  <p className="text-sm text-[#f5f5f5] font-semibold">{size}</p>
                                  {shown.map((row, rowIndex) =>
                                    renderSimpleRow(
                                      row,
                                      rowIndex,
                                      rows.length > 0,
                                      (field, value) => updateVariantIngredientRow(size, rowIndex, field, value),
                                      () => removeVariantIngredientRow(size, rowIndex)
                                    )
                                  )}
                                  {!rows.some((r) => r.inventoryItem) && (
                                    <p className="text-[#5a5a5a] text-xs italic">
                                      No item set for {size} — orders of this size won't deduct stock.
                                    </p>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => addSizeItemRow(size)}
                                    className="text-yellow-400 hover:text-yellow-300 text-xs font-medium"
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
                                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                                  >
                                    + Add another item
                                  </button>
                                </>
                              );
                            })()}

                        <p className="text-[#767676] text-xs">
                          Example: ordering a 1.5 Ltr drink removes 1 from the "Coke 1.5 Liter" stock.
                        </p>
                      </div>
                    )}

                    {formData.trackingMode === "recipe" && (
                      <div className="space-y-2">
                        {hasSizeVariants ? (
                          // Sizes are set below, so the recipe is per size —
                          // there's no separate "base" ingredients list to
                          // fill in on top of it.
                          <>
                            <label className="block text-[#ababab] text-sm font-medium">
                              Ingredients used per dish (by size)
                            </label>
                            <p className="text-[#767676] text-xs -mt-1 mb-1">
                              This dish sells by size, so set the recipe for each size separately — e.g. Small uses
                              less sauce/cheese than Large.
                            </p>
                            {sizeList.map((size) => {
                              const override = variantOverrideFor(size) || { ingredients: [] };
                              return (
                                <div key={size} className="rounded-lg bg-[#262626] p-3 space-y-2">
                                  <p className="text-sm text-[#f5f5f5] font-semibold">{size}</p>
                                  <div className="space-y-2 pl-1">
                                    {override.ingredients.map((row, rowIndex) => (
                                      <div key={rowIndex} className="flex gap-2 items-center">
                                        <select
                                          value={row.inventoryItem}
                                          onChange={(e) =>
                                            updateVariantIngredientRow(size, rowIndex, "inventoryItem", e.target.value)
                                          }
                                          className="bg-[#2a2a2a] text-white rounded-lg px-2 py-2 outline-none flex-1 text-sm"
                                        >
                                          <option value="" className="bg-[#1f1f1f]">
                                            Select item
                                          </option>
                                          {inventoryItems.map((inv) => (
                                            <option key={inv._id} value={inv._id} className="bg-[#1f1f1f]">
                                              {inv.name}
                                            </option>
                                          ))}
                                        </select>
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          placeholder="Qty"
                                          value={row.quantity}
                                          onChange={(e) => updateVariantIngredientRow(size, rowIndex, "quantity", e.target.value)}
                                          className="bg-[#2a2a2a] text-white rounded-lg px-2 py-2 outline-none w-20 text-sm"
                                        />
                                        <select
                                          value={row.unit}
                                          onChange={(e) => updateVariantIngredientRow(size, rowIndex, "unit", e.target.value)}
                                          className="bg-[#2a2a2a] text-white rounded-lg px-2 py-2 outline-none w-20 text-sm"
                                        >
                                          {UNIT_OPTIONS.map((u) => (
                                            <option key={u} value={u} className="bg-[#1f1f1f]">
                                              {u}
                                            </option>
                                          ))}
                                        </select>
                                        <button
                                          type="button"
                                          onClick={() => removeVariantIngredientRow(size, rowIndex)}
                                          className="text-red-400 hover:text-red-500 px-2"
                                        >
                                          <I.Close aria-hidden="true" />
                                        </button>
                                      </div>
                                    ))}
                                    {override.ingredients.length === 0 && (
                                      <p className="text-[#5a5a5a] text-xs italic">No ingredients set for {size} yet.</p>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => addVariantIngredientRow(size)}
                                      className="text-yellow-400 hover:text-yellow-300 text-xs font-medium"
                                    >
                                      + Add ingredient for {size}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                            <p className="text-[#767676] text-xs">
                              Example: 200 g flour per pizza will remove 0.2 kg from a 10 kg flour stock for every
                              pizza ordered.
                            </p>
                          </>
                        ) : (
                          <>
                            <label className="block text-[#ababab] text-sm font-medium">Ingredients used per dish</label>
                            {formData.ingredients.map((row, index) => (
                              <div key={index} className="flex gap-2 items-center">
                                <select
                                  value={row.inventoryItem}
                                  onChange={(e) => updateIngredientRow(index, "inventoryItem", e.target.value)}
                                  className="bg-[#2a2a2a] text-white rounded-lg px-2 py-2 outline-none flex-1 text-sm"
                                >
                                  <option value="" className="bg-[#1f1f1f]">
                                    Select item
                                  </option>
                                  {inventoryItems.map((inv) => (
                                    <option key={inv._id} value={inv._id} className="bg-[#1f1f1f]">
                                      {inv.name}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="Qty"
                                  value={row.quantity}
                                  onChange={(e) => updateIngredientRow(index, "quantity", e.target.value)}
                                  className="bg-[#2a2a2a] text-white rounded-lg px-2 py-2 outline-none w-20 text-sm"
                                />
                                <select
                                  value={row.unit}
                                  onChange={(e) => updateIngredientRow(index, "unit", e.target.value)}
                                  className="bg-[#2a2a2a] text-white rounded-lg px-2 py-2 outline-none w-20 text-sm"
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <option key={u} value={u} className="bg-[#1f1f1f]">
                                      {u}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => removeIngredientRow(index)}
                                  className="text-red-400 hover:text-red-500 px-2"
                                >
                                  <I.Close aria-hidden="true" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addIngredientRow}
                              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                            >
                              + Add ingredient
                            </button>
                            <p className="text-[#767676] text-xs">
                              Example: 200 g flour per pizza will remove 0.2 kg from a 10 kg flour stock for every
                              pizza ordered.
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {usedInventoryIds.length > 0 && (
                      <div className="rounded-lg bg-[#262626] p-3 space-y-2 mt-2">
                        <label className="block text-[#ababab] text-sm font-medium">Low-stock warning</label>
                        <p className="text-[#767676] text-xs -mt-1 mb-1">
                          Set how low each ingredient can get before it shows up as "low stock" on the dashboard —
                          no need to leave this form to set it in Inventory.
                        </p>
                        {usedInventoryIds.map((invId) => {
                          const inv = inventoryItems.find((i) => i._id === invId);
                          if (!inv) return null;
                          const draft = warnDrafts[invId] ?? inv.reorderLevel ?? 0;
                          return (
                            <div key={invId} className="flex items-center gap-2">
                              <span className="flex-1 text-sm text-[#f5f5f5] truncate">{inv.name}</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={draft}
                                onChange={(e) => setWarnDrafts((prev) => ({ ...prev, [invId]: e.target.value }))}
                                className="w-20 bg-[#1f1f1f] text-white rounded-lg px-2 py-1.5 outline-none text-sm"
                              />
                              <span className="text-[#7a7a7a] text-xs w-8 shrink-0">{inv.unit}</span>
                              <button
                                type="button"
                                onClick={() => saveWarnLevel(invId)}
                                disabled={warnLevelMutation.isPending}
                                className="text-yellow-400 hover:text-yellow-300 text-xs font-medium disabled:opacity-50 shrink-0"
                              >
                                Save
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

        </form>

        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shrink-0 sticky bottom-0 z-20">
          <button
            type="submit"
            form="modal-dashboard-form"
            disabled={mutation.isPending || uploadingImage || uploadingIcon}
            className="pos-btn-primary w-full py-2.5 text-sm font-black shadow-sm disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : submitLabelMap[action] || "Save"}
          </button>
        </div>
      </motion.div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
};

export default Modal;
