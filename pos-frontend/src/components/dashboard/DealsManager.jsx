import { useState, useMemo } from "react";
import { FaUpload, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import {
  LuSparkles,
  LuPercent,
  LuClock,
  LuPlus,
  LuTrash2,
  LuLayers,
  LuEye,
  LuCheck,
  LuFlame,
  LuTag,
  LuCalendar,
  LuImage,
  LuBoxes,
} from "react-icons/lu";
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
import FoodIcon from "../../utils/foodIcons";

const isUploadedImage = (value = "") => value.startsWith("http") || value.startsWith("/uploads/");

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_PRESETS = [
  { label: "Every day", days: [] },
  { label: "Sunday Special", days: [0] },
  { label: "Friday Craze", days: [5] },
  { label: "Weekend Only (Sat+Sun)", days: [0, 6] },
];

const BADGE_PRESETS = [
  "🔥 HOT DEAL",
  "⭐ BESTSELLER",
  "👨‍👩‍👧‍👦 FAMILY PACK",
  "⚡ LIMITED TIME",
  "🎉 WEEKEND SPECIAL",
  "🍔 DUO COMBO",
];

const PHOTO_PRESETS = [
  {
    label: "Pizza Feast",
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    icon: "pizza",
  },
  {
    label: "Burger Box",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    icon: "burger",
  },
  {
    label: "Shawarma Pack",
    url: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80",
    icon: "fastfood",
  },
  {
    label: "Hot Wings",
    url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
    icon: "bbq",
  },
  {
    label: "Mega Platter",
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    icon: "platter",
  },
];

const DEAL_ICON_OPTIONS = [
  { id: "deals", label: "Special Deal" },
  { id: "pizza", label: "Pizza Feast" },
  { id: "burger", label: "Burger Combo" },
  { id: "bbq", label: "BBQ & Wings" },
  { id: "drinks", label: "Drinks & Soda" },
  { id: "platter", label: "Mega Platter" },
  { id: "fastfood", label: "Fries & Sides" },
  { id: "dessert", label: "Dessert & Sweet" },
];

const defaultDealForm = {
  name: "",
  badge: "⭐ BESTSELLER",
  description: "",
  image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
  icon: "deals",
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
  icon: deal?.icon || "deals",
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
  const dishById = useMemo(() => new Map(dishes.map((d) => [String(d._id), d])), [dishes]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });
  const categories = categoriesData?.data?.data ?? [];

  const [form, setForm] = useState(defaultDealForm);
  const [editingDeal, setEditingDeal] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dealSearch, setDealSearch] = useState("");
  const [catalogFilter, setCatalogFilter] = useState("all"); // 'all' | 'live' | 'inactive'

  // Dynamic Savings Computation
  const priceNum = Number(form.price) || 0;
  const origPriceNum = Number(form.originalPrice) || 0;
  const savingsAmount = origPriceNum > priceNum ? origPriceNum - priceNum : 0;
  const savingsPercent = origPriceNum > priceNum && origPriceNum > 0 ? Math.round((savingsAmount / origPriceNum) * 100) : 0;

  const resetForm = () => {
    setEditingDeal(null);
    setForm(defaultDealForm);
  };

  const startEdit = (deal) => {
    setEditingDeal(deal);
    setForm(buildFormFromDeal(deal));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1-Click Fast Template Loader
  const applyTemplate = (templateType) => {
    if (templateType === "pizza_duo") {
      setForm({
        name: "GenZ Duo Feast",
        badge: "⭐ BESTSELLER",
        description: "1 Medium Pizza of your choice + 2 Crispy Zinger Burgers + 1.5L Chilled Coke.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
        icon: "pizza",
        price: 1850,
        originalPrice: 2200,
        items: [
          { label: "1 Medium Pizza", quantity: 1, dishId: "", size: "", crust: "", customizable: true, allowedCategories: [] },
          { label: "2 Crispy Zinger Burgers", quantity: 2, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
          { label: "1.5L Soft Drink", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
        ],
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        isActive: true,
      });
      enqueueSnackbar("Loaded Pizza Duo Feast template!", { variant: "info" });
    } else if (templateType === "burger_box") {
      setForm({
        name: "Burger Crunch Buddy",
        badge: "🍔 DUO COMBO",
        description: "2 Crispy Zinger Burgers + 1 Loaded Cheesy Pizza Fries + 2 Fresh Mint Margaritas.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
        icon: "burger",
        price: 1250,
        originalPrice: 1500,
        items: [
          { label: "2 Crispy Zinger Burgers", quantity: 2, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
          { label: "Loaded Cheesy Pizza Fries", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
          { label: "2 Fresh Mint Margaritas", quantity: 2, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
        ],
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        isActive: true,
      });
      enqueueSnackbar("Loaded Burger Crunch Buddy template!", { variant: "info" });
    } else if (templateType === "shawarma_pack") {
      setForm({
        name: "Lebanese Shawarma Express",
        badge: "🔥 HOT DEAL",
        description: "2 Arabic Shawarma Rolls with authentic garlic toum + French Fries + Cold Drink.",
        image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&auto=format&fit=crop&q=80",
        icon: "fastfood",
        price: 890,
        originalPrice: 1050,
        items: [
          { label: "2 Arabic Chicken Shawarmas", quantity: 2, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
          { label: "Crispy Golden Fries", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
          { label: "Chilled Soft Drink", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
        ],
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        isActive: true,
      });
      enqueueSnackbar("Loaded Shawarma Express template!", { variant: "info" });
    } else if (templateType === "family_mega") {
      setForm({
        name: "Family Mega Feast",
        badge: "👨‍👩‍👧‍👦 FAMILY PACK",
        description: "2 Large Pizzas + 6 Buffalo Wings + Garlic Parmesan Bread Sticks + 1.5L Coke.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
        icon: "platter",
        price: 3450,
        originalPrice: 3990,
        items: [
          { label: "2 Large Pizzas", quantity: 2, dishId: "", size: "", crust: "", customizable: true, allowedCategories: [] },
          { label: "6 Buffalo Hot Wings", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
          { label: "Garlic Parmesan Bread Sticks", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
          { label: "1.5L Soft Drink", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
        ],
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        isActive: true,
      });
      enqueueSnackbar("Loaded Family Mega Feast template!", { variant: "info" });
    }
  };

  const createMutation = useMutation({
    mutationFn: addDeal,
    onSuccess: () => {
      queryClient.invalidateQueries(["deals"]);
      enqueueSnackbar("Promotional Deal created successfully!", { variant: "success" });
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
      enqueueSnackbar("Promotional Deal updated successfully!", { variant: "success" });
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

  const adjustItemQuantity = (index, delta) => {
    setForm((prev) => {
      const items = [...prev.items];
      const current = Math.max(1, (Number(items[index].quantity) || 1) + delta);
      items[index] = { ...items[index], quantity: current };
      return { ...prev, items };
    });
  };

  const addItemRow = () =>
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { label: "", quantity: 1, dishId: "", size: "", crust: "", customizable: false, allowedCategories: [] },
      ],
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
    setForm((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : prev.items,
    }));

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
      enqueueSnackbar("Give the deal a promotional name.", { variant: "error" });
      return;
    }
    if (!payload.price && payload.price !== 0) {
      enqueueSnackbar("Set a bundle price.", { variant: "error" });
      return;
    }
    if (payload.items.length === 0) {
      enqueueSnackbar("Add at least one food item included in this deal.", { variant: "error" });
      return;
    }

    if (editingDeal) {
      updateMutation.mutate({ dealId: editingDeal._id, ...payload });
      return;
    }
    createMutation.mutate(payload);
  };

  // Filtered Catalog
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        !dealSearch.trim() ||
        deal.name.toLowerCase().includes(dealSearch.toLowerCase()) ||
        deal.badge?.toLowerCase().includes(dealSearch.toLowerCase());

      if (!matchesSearch) return false;
      if (catalogFilter === "live") return deal.isLiveNow;
      if (catalogFilter === "inactive") return !deal.isActive;
      return true;
    });
  }, [deals, dealSearch, catalogFilter]);

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full space-y-5 pb-12">
      {/* =========================================================================
          1. CREATIVE STUDIO HERO & QUICK-LOAD COMBO TEMPLATES BAR
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/10 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900 border border-amber-500/20 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Promotional Studio
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Combo Deal Architect
              <LuSparkles className="text-amber-500 text-lg" />
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
              Create high-converting food bundles with automatic ingredient inventory deductions and live customer storefront badging.
            </p>
          </div>

          {/* Quick-Start Templates */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block w-full sm:w-auto">
              1-Click Templates:
            </span>
            <button
              type="button"
              onClick={() => applyTemplate("pizza_duo")}
              className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>🍕</span>
              <span>Pizza Feast</span>
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("burger_box")}
              className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>🍔</span>
              <span>Burger Duo</span>
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("shawarma_pack")}
              className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>🌯</span>
              <span>Shawarma Box</span>
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("family_mega")}
              className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>👨‍👩‍👧‍👦</span>
              <span>Mega Pack</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN SPLIT STUDIO: CREATIVE FORM (LEFT) + REAL-TIME STOREFRONT PREVIEW (RIGHT)
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        {/* ---- LEFT: DEAL STUDIO EDITOR ---- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: Deal Identity & Pricing Engine */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">
                  01
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Deal Identity & Pricing</h3>
                  <p className="text-[11px] text-slate-400">Set bundle name, badge tag and attractive savings tier</p>
                </div>
              </div>
              {editingDeal && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Deal Title <span className="text-rose-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="pos-input text-xs font-semibold"
                  placeholder="e.g. Sunday Family Feast"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Badge Tag <span className="text-slate-400 text-[10px] font-normal">(Storefront Ribbon)</span>
                </label>
                <input
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="pos-input text-xs font-semibold"
                  placeholder="e.g. BESTSELLER or 25% OFF"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {BADGE_PRESETS.map((bp) => (
                    <button
                      key={bp}
                      type="button"
                      onClick={() => setForm({ ...form, badge: bp })}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold transition"
                    >
                      {bp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Bundle Price (Rs) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="pos-input text-xs font-black text-amber-600 dark:text-amber-400"
                  placeholder="e.g. 1850"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Original Item Price (Rs) <span className="text-slate-400 text-[10px] font-normal">(Strikethrough)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className="pos-input text-xs line-through text-slate-400"
                  placeholder="e.g. 2200"
                />
              </div>
            </div>

            {/* Live Discount Calculator Pill */}
            {savingsAmount > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    %
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Customer Saves Rs {savingsAmount.toLocaleString()} ({savingsPercent}% OFF)
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      High-converting promotional savings tier
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-2xs">
                  {savingsPercent}% DISCOUNT
                </span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Short Catchy Description
              </label>
              <textarea
                rows="2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="pos-input text-xs"
                placeholder="Crisp, mouth-watering description of what is packed inside this deal..."
              />
            </div>
          </div>

          {/* Card 2: Included Food Items & Auto-Stock Linking */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-xs">
                  02
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Included Food Items & Recipe Deductions
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Items are automatically decremented from inventory stock when ordered
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addItemRow}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <LuPlus size={13} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {form.items.map((item, idx) => {
                const linkedDish = item.dishId ? dishById.get(item.dishId) : null;
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-3 transition hover:border-amber-400/80"
                  >
                    {/* Item Top Row */}
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-black flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>

                      {/* Item Title Input */}
                      <div className="flex-1">
                        <input
                          value={item.label}
                          onChange={(e) => updateItemRow(idx, "label", e.target.value)}
                          className="pos-input text-xs font-semibold"
                          placeholder="Item label (e.g. 1 Medium Pizza or 2 Zingers)"
                          required
                        />
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => adjustItemQuantity(idx, -1)}
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustItemQuantity(idx, 1)}
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      {form.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="w-8 h-8 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:text-white hover:bg-rose-500 flex items-center justify-center transition shrink-0"
                          title="Remove item"
                        >
                          <LuTrash2 size={13} />
                        </button>
                      )}
                    </div>

                    {/* Stock Linking Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex-1">
                        <select
                          value={item.dishId || ""}
                          onChange={(e) => linkItemToDish(idx, e.target.value)}
                          className="pos-select text-xs font-medium"
                        >
                          <option value="">Text item only (no automatic stock deduction)</option>
                          {dishes.map((d) => (
                            <option key={d._id} value={d._id}>
                              {d.name} {d.isInventoryTracked ? "· (Auto Recipe Deduction Linked)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {linkedDish && (
                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                            linkedDish.isInventoryTracked
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <LuBoxes size={11} />
                          {linkedDish.isInventoryTracked ? "⚡ Deducts Stock" : "Untracked Dish"}
                        </span>
                      )}
                    </div>

                    {/* Variants if dish has size/crust */}
                    {linkedDish?.variants?.length > 0 && !item.customizable && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <select
                          value={item.size || ""}
                          onChange={(e) => {
                            updateItemRow(idx, "size", e.target.value);
                            updateItemRow(idx, "crust", "");
                          }}
                          className="pos-select text-xs"
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
                            className="pos-select text-xs"
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

                    {/* Flavour customization toggle */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.customizable}
                          onChange={(e) => updateItemRow(idx, "customizable", e.target.checked)}
                          className="rounded accent-amber-500"
                        />
                        <span className="font-medium">
                          Customer chooses flavour on checkout (e.g. Any Pizza Flavour or Drink Flavour)
                        </span>
                      </label>

                      {item.customizable && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 mt-2">
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Visuals & Vector Badge Icon */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black text-xs">
                03
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Deal Photo & Vector Icon</h3>
                <p className="text-[11px] text-slate-400">High-res photography and vector badge icon</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Promotional Food Photo
                </label>
                <div className="flex items-center gap-3">
                  {form.image ? (
                    <img
                      src={isUploadedImage(form.image) ? resolveImageUrl(form.image) : form.image}
                      alt="Deal Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <LuImage size={24} />
                    </div>
                  )}

                  <label className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-3.5 py-2 rounded-xl cursor-pointer text-xs font-bold transition border border-slate-200 dark:border-slate-700 shadow-xs">
                    <FaUpload size={12} className="text-amber-500" />
                    <span>{uploadingImage ? "Uploading…" : "Upload Custom"}</span>
                    <input type="file" accept=".png,.jpg,.jpeg,.webp,.gif,.svg" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                {/* Instant Photo Presets */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Or select high-res curated photo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PHOTO_PRESETS.map((photo) => (
                      <button
                        key={photo.label}
                        type="button"
                        onClick={() => setForm({ ...form, image: photo.url, icon: photo.icon })}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition ${
                          form.image === photo.url
                            ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300"
                        }`}
                      >
                        {photo.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vector Badge Icon */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Vector Badge Icon
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEAL_ICON_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setForm({ ...form, icon: opt.id })}
                      className={`h-9 px-2 rounded-xl border flex items-center justify-start gap-2 transition-all text-xs font-semibold ${
                        form.icon === opt.id || (form.icon === "deal" && opt.id === "deals")
                          ? "bg-amber-500/10 border-amber-500 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/20 shadow-xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-amber-300"
                      }`}
                    >
                      <FoodIcon icon={opt.id} size={18} />
                      <span className="truncate text-[11px]">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Availability Schedule & Publish Toggle */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-xs">
                04
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Availability Schedule</h3>
                <p className="text-[11px] text-slate-400">Limit deal visibility to specific days or run 24/7</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Day Presets */}
              <div className="flex flex-wrap gap-1.5">
                {DAY_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.days)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-slate-200 dark:border-slate-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Day Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {DAY_LABELS.map((label, idx) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => toggleDayCheckbox(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                      form.daysOfWeek.includes(idx)
                        ? "bg-amber-500 border-amber-500 text-slate-950 shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-slate-400 text-[10px]">
                {form.daysOfWeek.length === 0 ? "✓ Visible all week long ('Daily Deal')" : "Active only on selected days"}
              </p>

              {/* Publish Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Publish to Storefront Menu
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Live for cashier POS and online customer ordering
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <LuSparkles size={16} />
              <span>{saving ? "Saving Deal…" : editingDeal ? "Save & Update Deal" : "Launch Promotional Deal"}</span>
            </button>
            {editingDeal && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-xl text-sm font-bold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ---- RIGHT: LIVE REAL-TIME STOREFRONT SIMULATION & CATALOG ---- */}
        <div className="space-y-6">
          {/* 1. Real-Time Customer Storefront Preview Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <LuEye size={14} />
                Live Customer Storefront Preview
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                {form.isActive ? "● Live On Menu" : "○ Draft Mode"}
              </span>
            </div>

            {/* Simulated Menu Card */}
            <div className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
              {/* Food Image Banner */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                {form.image ? (
                  <img
                    src={isUploadedImage(form.image) ? resolveImageUrl(form.image) : form.image}
                    alt={form.name || "Deal"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-amber-500">
                    <FoodIcon icon={form.icon || "deals"} size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badge Tag Ribbon */}
                {form.badge && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-lg shadow-lg">
                    {form.badge}
                  </div>
                )}

                {/* Vector Icon */}
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-md">
                  <FoodIcon icon={form.icon || "deals"} size={22} />
                </div>

                {/* Price Pill */}
                <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-lg text-right">
                  <div className="text-base font-black text-amber-400">
                    Rs {priceNum.toLocaleString()}
                  </div>
                  {origPriceNum > priceNum && (
                    <div className="line-through text-slate-400 text-[10px]">
                      Rs {origPriceNum.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-base font-black text-white tracking-tight">
                    {form.name || "Deal Name Here"}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {form.description || "Crisp promotional description will display here on mobile and desktop ordering."}
                  </p>
                </div>

                {/* Included Items Checklist */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700/60 space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    What's Included in this Combo:
                  </span>
                  <div className="space-y-1.5">
                    {form.items.filter((it) => it.label.trim()).length > 0 ? (
                      form.items
                        .filter((it) => it.label.trim())
                        .map((it, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                            <span className="text-amber-400 font-bold">✓</span>
                            <span className="font-bold text-amber-300">{it.quantity}x</span>
                            <span>{it.label}</span>
                            {it.customizable && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                                Choice of Flavour
                              </span>
                            )}
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No food items added yet.</p>
                    )}
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <LuCalendar size={13} className="text-amber-400" />
                    <span>{scheduleSummary(form)}</span>
                  </span>
                  {savingsAmount > 0 && (
                    <span className="text-emerald-400 font-black">
                      Save Rs {savingsAmount.toLocaleString()} ({savingsPercent}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Active Promotional Catalog List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Promotional Catalog</h3>
                <p className="text-[11px] text-slate-400">Currently configured promotions and bundles</p>
              </div>
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                {deals.length} Deal{deals.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 flex-1">
                <FaSearch className="text-slate-400 text-xs shrink-0" />
                <input
                  type="text"
                  value={dealSearch}
                  onChange={(e) => setDealSearch(e.target.value)}
                  placeholder="Search deals…"
                  className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full"
                />
              </div>

              <select
                value={catalogFilter}
                onChange={(e) => setCatalogFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="all">All Deals</option>
                <option value="live">Live Today</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Deals List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {isLoading && <p className="text-slate-400 text-xs py-4 text-center">Loading promotions…</p>}
              {!isLoading && filteredDeals.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No promotional deals found.
                </div>
              )}

              {filteredDeals.map((deal) => (
                <div
                  key={deal._id}
                  className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3.5 transition hover:shadow-xs"
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
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                          <FoodIcon icon={deal.icon || "deals"} size={24} />
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
                        <p className="text-slate-600 dark:text-slate-300 text-xs font-semibold mt-0.5">
                          Rs {deal.price?.toLocaleString()}
                          {deal.originalPrice > deal.price ? (
                            <span className="line-through text-slate-400 ml-1 font-normal text-[11px]">
                              Rs {deal.originalPrice?.toLocaleString()}
                            </span>
                          ) : null}{" "}
                          · <span className="font-normal text-slate-400">{scheduleSummary(deal)}</span>
                        </p>
                        {deal.items?.length > 0 && (
                          <p className="text-slate-400 text-[10px] mt-0.5">
                            {deal.items.length} items · {deal.items.filter((it) => it.dishId).length} stock-tracked
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
                      {deal.isLiveNow ? "● Live Now" : deal.isActive ? "Scheduled" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => toggleMutation.mutate(deal._id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        deal.isActive
                          ? "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300"
                          : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                      }`}
                    >
                      {deal.isActive ? "Pause Deal" : "Publish Deal"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(deal)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete deal "${deal.name}"?`)) {
                            deleteMutation.mutate(deal._id);
                          }
                        }}
                        className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold px-2.5 py-1 rounded-lg text-xs transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsManager;
