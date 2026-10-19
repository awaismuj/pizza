import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseOutline } from "react-icons/io5";
import { LuBoxes, LuSave, LuLayers, LuTag, LuScale, LuDollarSign } from "react-icons/lu";

const UNIT_PRESETS = [
  { label: "Grams (g)", value: "g" },
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Pieces (pcs)", value: "pcs" },
  { label: "Liters (L)", value: "L" },
  { label: "Milliliters (ml)", value: "ml" },
  { label: "Bottles", value: "bottles" },
  { label: "Packs", value: "packs" },
];

const CATEGORY_PRESETS = [
  "Sauces & Condiments",
  "Breads & Dough",
  "Cheeses & Dairy",
  "Meats & Proteins",
  "Vegetables & Produce",
  "Packaging & Boxes",
  "Beverages & Soda",
  "Seasonings & Spices",
];

const defaultForm = {
  name: "",
  category: "",
  unit: "pcs",
  quantity: 0,
  reorderLevel: 0,
  costPrice: 0,
  sellingPrice: 0,
  notes: "",
};

const InventoryDrawer = ({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
  isSubmitting = false,
  existingCategories = [],
}) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category?.name || initialData.category || "",
        unit: initialData.unit || "pcs",
        quantity: initialData.quantity ?? 0,
        reorderLevel: initialData.reorderLevel ?? 0,
        costPrice: initialData.costPrice ?? 0,
        sellingPrice: initialData.sellingPrice ?? 0,
        notes: initialData.notes || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  const allCategories = Array.from(
    new Set([...CATEGORY_PRESETS, ...existingCategories.filter(Boolean)])
  );

  const drawerContent = (
    <div
      className="fixed inset-0 z-[99999] overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        <div
          className="pointer-events-auto w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <LuBoxes size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {initialData ? `Edit "${initialData.name}"` : "Add New Stock Item"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {initialData ? "Update inventory parameters and thresholds" : "Register ingredient or supply into stock ledger"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Close drawer"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          {/* Form Body */}
          <form id="inventory-drawer-form" onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
            {/* Item Name */}
            <div>
              <label className="pos-label">Item Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="pos-input text-xs font-semibold"
                placeholder="e.g. Shawarma Garlic Sauce, Pizza Flour, etc."
                required
                autoFocus
              />
            </div>

            {/* Category */}
            <div>
              <label className="pos-label">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="pos-input text-xs mb-2"
                placeholder="Type custom category or pick below…"
              />
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                      form.category === cat
                        ? "bg-amber-500 text-slate-950 font-bold shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Unit & Unit Presets */}
            <div>
              <label className="pos-label">Unit of Measure *</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="pos-select text-xs font-semibold"
                >
                  {UNIT_PRESETS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                  <option value="custom">Other custom unit</option>
                </select>
                <input
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="pos-input text-xs"
                  placeholder="Unit symbol (e.g. kg, g)"
                  required
                />
              </div>
            </div>

            {/* Quantity & Reorder Warning Level */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="pos-label">Current Stock *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
                    className="pos-input text-xs font-bold text-slate-900 dark:text-white"
                    placeholder="0"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-slate-400">
                    {form.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="pos-label text-rose-600 dark:text-rose-400">Reorder Threshold *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.reorderLevel}
                    onChange={(e) => setForm({ ...form, reorderLevel: parseFloat(e.target.value) || 0 })}
                    className="pos-input text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50"
                    placeholder="Min"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-slate-400">
                    {form.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Valuation: Cost Price & Retail Price */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="pos-label">Cost Price (Rs / Unit)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.costPrice}
                  onChange={(e) => setForm({ ...form, costPrice: parseFloat(e.target.value) || 0 })}
                  className="pos-input text-xs"
                  placeholder="e.g. 150"
                />
              </div>

              <div>
                <label className="pos-label">Selling Price (Optional)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.sellingPrice}
                  onChange={(e) => setForm({ ...form, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="pos-input text-xs"
                  placeholder="Retail price"
                />
              </div>
            </div>

            {/* Total Estimated Asset Valuation Pill */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Estimated Item Valuation:</span>
              <span className="font-black text-slate-900 dark:text-white">
                Rs {((form.quantity || 0) * (form.costPrice || 0)).toLocaleString()}
              </span>
            </div>

            {/* Storage Notes */}
            <div>
              <label className="pos-label">Storage Location & Notes</label>
              <textarea
                rows="2"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="pos-input text-xs"
                placeholder="e.g. Walk-in chiller, Shelf B-4, supplier contact…"
              />
            </div>
          </form>

          {/* Sticky Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="inventory-drawer-form"
              disabled={isSubmitting}
              className="pos-btn-primary py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <LuSave size={15} />
              <span>{isSubmitting ? "Saving…" : initialData ? "Update Stock Item" : "Save Stock Item"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

export default InventoryDrawer;
