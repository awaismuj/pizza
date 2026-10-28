import { useState } from "react";
import { FaUpload, FaPlus, FaTrash } from "react-icons/fa";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  getDeals,
  addDeal,
  updateDeal,
  toggleDeal,
  deleteDeal,
  uploadImage,
  getDishes,
  getCategories,
} from "../../https";
import { resolveImageUrl } from "../../utils";
import { FoodIcon, foodIconKey } from "../shared/AppIcons";

const isUploadedImage = (value = "") => value.startsWith("http") || value.startsWith("/uploads/");

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_PRESETS = [
  { label: "Every day", days: [] },
  { label: "Sunday", days: [0] },
  { label: "Friday", days: [5] },
  { label: "Weekend (Sat+Sun)", days: [0, 6] },
];

const EMOJI_OPTIONS = ["flame", "pizza", "burger", "chicken", "drink", "cake", "star", "cheese", "icecream"];

const defaultDealForm = {
  name: "",
  badge: "",
  description: "",
  image: "",
  icon: "flame",
  price: "",
  originalPrice: "",
  items: [{ label: "", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] }],
  daysOfWeek: [],
  startTime: "",
  endTime: "",
  isActive: true,
};

const dishIdOf = (value) => {
  if (!value) return "";
  return typeof value === "object" ? String(value._id || "") : String(value);
};

const categoryIdsOf = (arr) =>
  Array.isArray(arr) ? arr.map((c) => (typeof c === "object" ? String(c._id || "") : String(c))).filter(Boolean) : [];

const buildFormFromDeal = (deal) => ({
  name: deal?.name ?? "",
  badge: deal?.badge ?? "",
  description: deal?.description ?? "",
  image: deal?.image ?? "",
  icon: deal?.icon || "flame",
  price: deal?.price ?? "",
  originalPrice: deal?.originalPrice || "",
  items: deal?.items?.length
    ? deal.items.map((it) => ({
        label: it.label,
        quantity: it.quantity,
        dishId: dishIdOf(it.dishId),
        size: it.size || "",
        crust: it.crust || "",
        customizable: Boolean(it.customizable),
        allowedCategories: categoryIdsOf(it.allowedCategories),
      }))
    : [{ label: "", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] }],
  daysOfWeek: deal?.daysOfWeek || [],
  startTime: deal?.startTime || "",
  endTime: deal?.endTime || "",
  isActive: deal?.isActive ?? true,
});

const scheduleSummary = (deal) => {
  const dayPart =
    !deal.daysOfWeek || deal.daysOfWeek.length === 0
      ? "Every day"
      : deal.daysOfWeek.map((d) => DAY_LABELS[d]).join(", ");
  const timePart = deal.startTime || deal.endTime ? ` · ${deal.startTime || "00:00"}–${deal.endTime || "23:59"}` : "";
  return dayPart + timePart;
};

const DealsManager = () => {
  const queryClient = useQueryClient();

  const { data: dealsData, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: getDeals,
    placeholderData: keepPreviousData,
  });
  const deals = dealsData?.data?.data ?? [];

  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
  });
  const dishes = dishesData?.data?.data ?? [];
  const dishById = new Map(dishes.map((d) => [String(d._id), d]));

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });
  const categories = categoriesData?.data?.data ?? [];

  const [form, setForm] = useState(defaultDealForm);
  const [editingDeal, setEditingDeal] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setEditingDeal(null);
    setForm(defaultDealForm);
  };

  const startEdit = (deal) => {
    setEditingDeal(deal);
    setForm(buildFormFromDeal(deal));
  };

  const createMutation = useMutation({
    mutationFn: addDeal,
    onSuccess: () => {
      queryClient.invalidateQueries(["deals"]);
      enqueueSnackbar("Deal created successfully!", { variant: "success" });
      resetForm();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to add deal.", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDeal,
    onSuccess: () => {
      queryClient.invalidateQueries(["deals"]);
      enqueueSnackbar("Deal updated successfully!", { variant: "success" });
      resetForm();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update deal.", { variant: "error" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleDeal,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["deals"]);
      enqueueSnackbar(res?.data?.message || "Deal status updated.", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Failed to update deal status.", { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries(["deals"]);
      enqueueSnackbar("Deal deleted.", { variant: "success" });
      resetForm();
    },
    onError: () => {
      enqueueSnackbar("Failed to delete deal.", { variant: "error" });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await uploadImage(file);
      const url = res?.data?.data?.url;
      if (url) setForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Image upload failed.", { variant: "error" });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const updateItemRow = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItemRow = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { label: "", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] }],
    }));

  const toggleItemCategory = (index, categoryId) => {
    setForm((prev) => {
      const items = [...prev.items];
      const current = items[index].allowedCategories || [];
      const next = current.includes(categoryId)
        ? current.filter((c) => c !== categoryId)
        : [...current, categoryId];
      items[index] = { ...items[index], allowedCategories: next };
      return { ...prev, items };
    });
  };

  const linkItemToDish = (index, dishId) => {
    setForm((prev) => {
      const items = [...prev.items];
      const dish = dishById.get(dishId);
      items[index] = {
        ...items[index],
        dishId,
        label: items[index].label.trim() ? items[index].label : dish?.name || items[index].label,
      };
      return { ...prev, items };
    });
  };

  const removeItemRow = (index) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  const toggleDayCheckbox = (dayIndex) => {
    setForm((prev) => {
      const has = prev.daysOfWeek.includes(dayIndex);
      const daysOfWeek = has ? prev.daysOfWeek.filter((d) => d !== dayIndex) : [...prev.daysOfWeek, dayIndex].sort();
      return { ...prev, daysOfWeek };
    });
  };

  const applyPreset = (days) => setForm((prev) => ({ ...prev, daysOfWeek: days }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
      items: form.items
        .map((it) => ({
          label: it.label.trim(),
          quantity: Math.max(1, Number(it.quantity) || 1),
          dishId: it.dishId || null,
          size: it.size || "",
          crust: it.crust || "",
          customizable: Boolean(it.customizable),
          allowedCategories: it.customizable ? it.allowedCategories || [] : [],
        }))
        .filter((it) => it.label),
    };

    if (!payload.name.trim()) {
      enqueueSnackbar("Give the deal a name.", { variant: "error" });
      return;
    }
    if (!payload.price && payload.price !== 0) {
      enqueueSnackbar("Set a bundle price.", { variant: "error" });
      return;
    }
    if (payload.items.length === 0) {
      enqueueSnackbar("Add at least one item included in the deal.", { variant: "error" });
      return;
    }

    if (editingDeal) {
      updateMutation.mutate({ dealId: editingDeal._id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-6">
      {/* ---- Form ---- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">
              {editingDeal ? `Edit Deal: ${editingDeal.name}` : "Create Promotional Deal"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Configure bundle combos, dynamic schedules, and automatic stock deduction
            </p>
          </div>
          {editingDeal && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Deal Title *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                placeholder="e.g. Sunday Family Feast"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Badge Tag (optional)
              </label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                placeholder="e.g. SUNDAY SPECIAL / SAVE 25%"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Bundle Price (Rs) *
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 transition font-bold"
                placeholder="e.g. 1999"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Original Price (optional)
              </label>
              <input
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
                placeholder="Strikethrough original price (e.g. 2600)"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Short Description
            </label>
            <textarea
              rows="2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 transition"
              placeholder="Crisp description of items in this deal..."
            />
          </div>

          {/* Items included in the bundle */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Included Items & Stock Deductions
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <FaPlus size={10} /> Add Item
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              Link items to real catalog dishes so inventory stock is automatically decremented upon checkout.
            </p>

            <div className="space-y-2.5">
              {form.items.map((item, idx) => {
                const linkedDish = item.dishId ? dishById.get(item.dishId) : null;
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 rounded-xl p-3 space-y-2">
                    <div className="flex gap-2 items-center">
                      <input
                        value={item.label}
                        onChange={(e) => updateItemRow(idx, "label", e.target.value)}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                        placeholder="e.g. 1 Medium Pizza or 1.5L Coke"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemRow(idx, "quantity", e.target.value)}
                        className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2 py-1.5 text-xs outline-none text-center font-bold"
                        title="Quantity"
                      />
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Remove item"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.dishId || ""}
                        onChange={(e) => linkItemToDish(idx, e.target.value)}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 outline-none text-xs"
                      >
                        <option value="">Text only (no auto stock deduction)</option>
                        {dishes.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name} {d.isInventoryTracked ? "· (Stock Tracked)" : ""}
                          </option>
                        ))}
                      </select>
                      {linkedDish && (
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            linkedDish.isInventoryTracked
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {linkedDish.isInventoryTracked ? "Deducts stock" : "Untracked dish"}
                        </span>
                      )}
                    </div>

                    {linkedDish?.variants?.length > 0 && !item.customizable && (
                      <div className="flex gap-2">
                        <select
                          value={item.size || ""}
                          onChange={(e) => {
                            updateItemRow(idx, "size", e.target.value);
                            updateItemRow(idx, "crust", "");
                          }}
                          className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 outline-none text-xs"
                        >
                          <option value="">Select recipe size…</option>
                          {[...new Set(linkedDish.variants.map((v) => v.size))].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {linkedDish.variants.some((v) => v.size === item.size && v.crust) && (
                          <select
                            value={item.crust || ""}
                            onChange={(e) => updateItemRow(idx, "crust", e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 outline-none text-xs"
                          >
                            <option value="">Select crust…</option>
                            {linkedDish.variants
                              .filter((v) => v.size === item.size && v.crust)
                              .map((v) => (
                                <option key={v.crust} value={v.crust}>
                                  {v.crust}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    )}

                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-0.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.customizable}
                        onChange={(e) => updateItemRow(idx, "customizable", e.target.checked)}
                        className="rounded accent-amber-500"
                      />
                      <span>Customer chooses flavour on online checkout (e.g. any pizza flavour)</span>
                    </label>

                    {item.customizable && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-2.5 border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                          Allowed Flavour Categories:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {categories.map((c) => (
                            <button
                              type="button"
                              key={c._id}
                              onClick={() => toggleItemCategory(idx, c._id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                                (item.allowedCategories || []).includes(c._id)
                                  ? "bg-amber-500 text-slate-950 shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Availability Schedule
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {DAY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.days)}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DAY_LABELS.map((label, idx) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => toggleDayCheckbox(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                    form.daysOfWeek.includes(idx)
                      ? "bg-amber-500 border-amber-500 text-slate-950 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-[10px] mt-1.5">
              Empty days = visible all week ("Daily Deal").
            </p>
          </div>

          {/* Image & Vector Icon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Deal Photo
              </label>
              <div className="flex items-center gap-3">
                {form.image && (
                  <img
                    src={isUploadedImage(form.image) ? resolveImageUrl(form.image) : form.image}
                    alt={form.name ? `${form.name} deal preview` : "Deal image preview"}
                    className="w-14 h-14 rounded object-cover border border-[#3a3a3a]"
                  />
                )}
                <label className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-3.5 py-2 rounded-xl cursor-pointer text-xs font-bold transition border border-slate-200 dark:border-slate-700">
                  <FaUpload size={12} /> {uploadingImage ? "Uploading…" : "Upload Image"}
                  <input type="file" accept=".png,.jpg,.jpeg,.webp,.gif,.svg" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Vector Badge Icon
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setForm({ ...form, icon: emoji })}
                    aria-label={`Icon: ${emoji}`}
                    className={`text-xl px-2.5 py-2 rounded ${foodIconKey(form.icon) === emoji ? "bg-[#f6b100] text-[#1f1f1f]" : "bg-[#1a1a1a] text-[#d6d6d6]"}`}
                  >
                    <FoodIcon icon={emoji} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded accent-amber-500"
            />
            <span>Active & published on customer storefront</span>
          </label>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition active:scale-95 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving…" : editingDeal ? "Update Deal" : "Create Deal"}
            </button>
            {editingDeal && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ---- All Deals List ---- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">
            Active Promotional Catalog
          </h3>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {deals.length} Deal{deals.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
          {isLoading && <p className="text-slate-400 text-xs">Loading promotional deals…</p>}
          {!isLoading && deals.length === 0 && (
            <p className="text-slate-400 text-xs py-8 text-center">
              No active deals. Build your first promotion above!
            </p>
          )}

          {deals.map((deal) => (
            <div
              key={deal._id}
              className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-3.5 transition hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  {deal.image ? (
                    <img
                      src={isUploadedImage(deal.image) ? resolveImageUrl(deal.image) : deal.image}
                      alt={deal.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-[#262626] flex items-center justify-center text-xl shrink-0">
                      <FoodIcon icon={deal.icon || "flame"} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-slate-900 dark:text-white font-bold text-xs truncate">
                      {deal.badge && (
                        <span className="text-amber-600 dark:text-amber-400 mr-1.5 uppercase tracking-wider text-[10px] font-black">
                          [{deal.badge}]
                        </span>
                      )}
                      {deal.name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-0.5">
                      Rs {deal.price}
                      {deal.originalPrice > deal.price ? (
                        <span className="line-through text-slate-400 dark:text-slate-500 ml-1 font-normal text-[11px]">
                          Rs {deal.originalPrice}
                        </span>
                      ) : null}{" "}
                      · <span className="font-normal">{scheduleSummary(deal)}</span>
                    </p>
                    {deal.items?.length > 0 && (
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {deal.items.length} item{deal.items.length > 1 ? "s" : ""} ·{" "}
                        {deal.items.filter((it) => it.dishId).length} recipe linked
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    deal.isLiveNow
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : deal.isActive
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {deal.isLiveNow ? "Live Now" : deal.isActive ? "Scheduled" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                <button
                  onClick={() => toggleMutation.mutate(deal._id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    deal.isActive
                      ? "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                  }`}
                >
                  {deal.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => startEdit(deal)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete deal "${deal.name}"?`)) {
                      deleteMutation.mutate(deal._id);
                    }
                  }}
                  className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-2.5 py-1 rounded-lg text-xs transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsManager;
