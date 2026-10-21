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

// One-tap presets for the schedules staff actually use ("Sunday Special",
// "Friday Deal", "Daily Deal", weekend deals) — they can still fine-tune
// with the individual day checkboxes below if needed.
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

// `dishId` comes back from the server populated (an object with `_id`) on
// edit, but plain when the form is building a fresh submission — normalize
// both to a plain string id for the <select>.
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

  // Menu dishes, for linking a deal's bundle items to real inventory-tracked
  // dishes ("1 Medium Pizza" -> the actual "Medium Pizza" dish) so selling
  // the deal deducts stock the same way selling that dish on its own would.
  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
  });
  const dishes = dishesData?.data?.data ?? [];
  const dishById = new Map(dishes.map((d) => [String(d._id), d]));

  // Menu categories, so a customer-customizable item (e.g. "the pizza slot")
  // can be restricted to the categories that actually are pizzas, e.g.
  // "Traditional" + "Gen-Z Special".
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
      enqueueSnackbar("Deal added! It'll show up on the storefront on its scheduled days.", { variant: "success" });
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
      enqueueSnackbar("Deal updated!", { variant: "success" });
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

  // Picking a dish from the link dropdown also fills in the label (if it's
  // still empty) so staff don't have to type the name twice.
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
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
      {/* ---- Form ---- */}
      <div className="bg-[#262626] rounded-lg p-5">
        <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">
          {editingDeal ? `Edit Deal — ${editingDeal.name}` : "Add New Deal"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
              placeholder="Deal name (e.g. Sunday Special Deal)"
            />
            <input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
              placeholder="Badge text (e.g. SUNDAY SPECIAL)"
            />
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
              placeholder="Bundle price (Rs)"
            />
            <input
              type="number"
              min="0"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none"
              placeholder="Original price (optional, shown struck-through)"
            />
          </div>

          <textarea
            rows="2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-[#1a1a1a] text-white rounded px-3 py-3 outline-none w-full"
            placeholder="Short description (optional)"
          />

          {/* Items included in the bundle */}
          <div>
            <label className="text-[#ababab] text-sm mb-2 block">Items included in the deal</label>
            <p className="text-[#7a7a7a] text-xs mb-2">
              Link an item to a menu dish so selling the deal deducts that dish's stock automatically. Unlinked
              items still deduct stock if their text matches a dish name (e.g. typing "Burger").
            </p>
            <div className="space-y-2">
              {form.items.map((item, idx) => {
                const linkedDish = item.dishId ? dishById.get(item.dishId) : null;
                return (
                  <div key={idx} className="bg-[#1a1a1a] rounded-lg p-2 space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={item.label}
                        onChange={(e) => updateItemRow(idx, "label", e.target.value)}
                        className="flex-1 bg-[#262626] text-white rounded px-3 py-2 outline-none"
                        placeholder="e.g. 1 Medium Pizza"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemRow(idx, "quantity", e.target.value)}
                        className="w-20 bg-[#262626] text-white rounded px-3 py-2 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="text-red-400 hover:text-red-300 px-2"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={item.dishId || ""}
                        onChange={(e) => linkItemToDish(idx, e.target.value)}
                        className="flex-1 bg-[#262626] text-[#ababab] rounded px-3 py-1.5 outline-none text-xs"
                      >
                        <option value="">Not linked — text only (no auto stock match)</option>
                        {dishes.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name}
                            {d.isInventoryTracked ? "" : " (stock not tracked)"}
                          </option>
                        ))}
                      </select>
                      {linkedDish && (
                        <span
                          className={`shrink-0 px-2 py-1 rounded text-[10px] font-semibold ${
                            linkedDish.isInventoryTracked
                              ? "bg-green-600/20 text-green-300"
                              : "bg-yellow-600/20 text-yellow-300"
                          }`}
                        >
                          {linkedDish.isInventoryTracked ? "Deducts stock" : "Stock not tracked"}
                        </span>
                      )}
                    </div>

                    {/* Size/crust: which exact variant of the linked dish this
                        slot deducts stock for (e.g. the Medium Traditional
                        Pizza's own recipe, not the Small one's). Only shown
                        once a dish with variants is linked. */}
                    {linkedDish?.variants?.length > 0 && !item.customizable && (
                      <div className="flex gap-2">
                        <select
                          value={item.size || ""}
                          onChange={(e) => {
                            updateItemRow(idx, "size", e.target.value);
                            updateItemRow(idx, "crust", "");
                          }}
                          className="flex-1 bg-[#262626] text-[#ababab] rounded px-3 py-1.5 outline-none text-xs"
                        >
                          <option value="">Size…</option>
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
                            className="flex-1 bg-[#262626] text-[#ababab] rounded px-3 py-1.5 outline-none text-xs"
                          >
                            <option value="">Crust…</option>
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

                    {/* Customer-customizable: the online customer picks the
                        category (flavour family), the exact flavour (dish)
                        and the size themselves at checkout — e.g. a "pizza"
                        slot that could be any Traditional or Gen-Z Special
                        flavour, any size. The dish/size above just become
                        the fallback if nothing else applies. */}
                    <label className="flex items-center gap-2 text-xs text-[#ababab]">
                      <input
                        type="checkbox"
                        checked={item.customizable}
                        onChange={(e) => updateItemRow(idx, "customizable", e.target.checked)}
                      />
                      Let the customer choose the category, flavour and size for this item
                    </label>

                    {item.customizable && (
                      <div className="bg-[#111] rounded p-2">
                        <p className="text-[10px] text-[#7a7a7a] mb-1.5">
                          Categories the customer can pick a flavour from:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {categories.map((c) => (
                            <button
                              type="button"
                              key={c._id}
                              onClick={() => toggleItemCategory(idx, c._id)}
                              className={`px-2 py-1 rounded text-[10px] font-semibold ${
                                (item.allowedCategories || []).includes(c._id)
                                  ? "bg-[#f6b100] text-[#1f1f1f]"
                                  : "bg-[#262626] text-[#ababab]"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                        {(item.allowedCategories || []).length === 0 && (
                          <p className="text-[10px] text-yellow-400 mt-1.5">
                            Pick at least one category, or customers won't see any choices.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 flex items-center gap-2 text-sm text-[#f6b100] hover:text-[#ffca3a]"
            >
              <FaPlus /> Add item
            </button>
          </div>

          {/* Schedule */}
          <div>
            <label className="text-[#ababab] text-sm mb-2 block">Available on</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DAY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.days)}
                  className="bg-[#1a1a1a] hover:bg-[#333] text-white px-3 py-1.5 rounded-full text-xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {DAY_LABELS.map((label, idx) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => toggleDayCheckbox(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                    form.daysOfWeek.includes(idx)
                      ? "bg-[#f6b100] text-[#1a1a1a] border-[#f6b100]"
                      : "bg-transparent text-[#ababab] border-[#3a3a3a]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[#7a7a7a] text-xs mt-1">
              No days selected = shown every day ("Daily Deal").
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#ababab] text-sm mb-1 block">Starts at (optional)</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none w-full"
              />
            </div>
            <div>
              <label className="text-[#ababab] text-sm mb-1 block">Expires at (optional)</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none w-full"
              />
            </div>
          </div>

          {/* Image + icon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <label className="text-[#ababab] text-sm mb-1 block">Deal image</label>
              <div className="flex items-center gap-3">
                {form.image && (
                  <img
                    src={isUploadedImage(form.image) ? resolveImageUrl(form.image) : form.image}
                    alt="Deal"
                    className="w-14 h-14 rounded object-cover border border-[#3a3a3a]"
                  />
                )}
                <label className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#333] text-white px-3 py-2 rounded cursor-pointer text-sm">
                  <FaUpload /> {uploadingImage ? "Uploading…" : "Upload"}
                  <input type="file" accept=".png,.jpg,.jpeg,.webp,.gif,.svg" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
            <div>
              <label className="text-[#ababab] text-sm mb-1 block">Fallback icon (shown if no image)</label>
              <div className="flex flex-wrap gap-2">
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

          <label className="flex items-center gap-2 text-[#ababab] text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active (visible on storefront when in schedule)
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              disabled={saving}
            >
              {saving ? "Saving…" : editingDeal ? "Update Deal" : "Save Deal"}
            </button>
            {editingDeal && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ---- List ---- */}
      <div className="bg-[#262626] rounded-lg p-5">
        <h3 className="text-[#f5f5f5] text-xl font-semibold mb-4">All Deals</h3>
        <div className="space-y-3">
          {isLoading && <p className="text-[#ababab]">Loading deals…</p>}
          {!isLoading && deals.length === 0 && <p className="text-[#ababab]">No deals yet — create your first one.</p>}
          {deals.map((deal) => (
            <div key={deal._id} className="rounded-lg bg-[#1a1a1a] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  {deal.image ? (
                    <img
                      src={isUploadedImage(deal.image) ? resolveImageUrl(deal.image) : deal.image}
                      alt={deal.name}
                      className="w-12 h-12 rounded object-cover border border-[#3a3a3a] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-[#262626] flex items-center justify-center text-xl shrink-0">
                      <FoodIcon icon={deal.icon || "flame"} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[#f5f5f5] font-medium truncate">
                      {deal.badge && <span className="text-[#f6b100] mr-1">[{deal.badge}]</span>}
                      {deal.name}
                    </p>
                    <p className="text-[#ababab] text-xs">
                      Rs {deal.price}
                      {deal.originalPrice > deal.price ? ` (was Rs ${deal.originalPrice})` : ""} · {scheduleSummary(deal)}
                    </p>
                    {deal.items?.length > 0 && (
                      <p className="text-[#7a7a7a] text-[11px] mt-0.5">
                        {deal.items.length} item{deal.items.length > 1 ? "s" : ""} ·{" "}
                        {deal.items.filter((it) => it.dishId).length} linked to stock
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                    deal.isLiveNow
                      ? "bg-green-600/20 text-green-300"
                      : deal.isActive
                        ? "bg-yellow-600/20 text-yellow-300"
                        : "bg-red-600/20 text-red-300"
                  }`}
                >
                  {deal.isLiveNow ? "Live now" : deal.isActive ? "Scheduled" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleMutation.mutate(deal._id)}
                  className={`px-3 py-1.5 rounded text-sm text-white ${
                    deal.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {deal.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => startEdit(deal)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete deal "${deal.name}"?`)) {
                      deleteMutation.mutate(deal._id);
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
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
