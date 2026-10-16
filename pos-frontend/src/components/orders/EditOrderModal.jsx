import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { getDishes, updateOrderItems } from "../../https";

// Cashier/Admin only (enforced again server-side) — lets staff fix a live
// order: bump/lower a quantity, drop a line the customer no longer wants,
// or add another dish, without having to cancel and re-ring the whole
// order. Totals and inventory are always recalculated by the server from
// the item list this sends, never trusted from here.
const EditOrderModal = ({ order, onClose }) => {
  const queryClient = useQueryClient();

  // Local working copy of the item list — nothing is sent to the server
  // until "Save changes" is clicked.
  const [items, setItems] = useState(() => (order.items || []).map((it) => ({ ...it })));
  const [addDishId, setAddDishId] = useState("");

  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
  });
  const dishes = dishesData?.data?.data ?? [];

  const updateQty = (index, delta) => {
    setItems((prev) =>
      prev
        .map((it, i) => (i === index ? { ...it, quantity: Math.max(0, (Number(it.quantity) || 1) + delta) } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addDish = () => {
    if (!addDishId) return;
    const dish = dishes.find((d) => d._id === addDishId);
    if (!dish) return;

    // Variant dishes (size/crust priced) add at their first variant's
    // price — staff can adjust the size afterwards from the POS menu if
    // it's the wrong one, same as any other correction.
    const variant = Array.isArray(dish.variants) && dish.variants.length > 0 ? dish.variants[0] : null;
    const label = variant ? [variant.size, variant.crust].filter(Boolean).join(", ") : "";

    setItems((prev) => {
      const existingIndex = prev.findIndex((it) => it.dishId === dish._id && !it.isDeal && (it.name || "") === (label ? `${dish.name} (${label})` : dish.name));
      if (existingIndex >= 0) {
        return prev.map((it, i) => (i === existingIndex ? { ...it, quantity: (Number(it.quantity) || 1) + 1 } : it));
      }
      return [
        ...prev,
        {
          dishId: dish._id,
          name: label ? `${dish.name} (${label})` : dish.name,
          price: variant ? variant.price : dish.price,
          quantity: 1,
          size: variant?.size,
          crust: variant?.crust || undefined,
        },
      ];
    });
    setAddDishId("");
  };

  const previewTotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);

  const mutation = useMutation({
    mutationFn: updateOrderItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["dailyProfit"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyProfit"] });
      enqueueSnackbar("Order updated.", { variant: "success" });
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update order.", { variant: "error" });
    },
  });

  const handleSave = () => {
    if (items.length === 0) {
      enqueueSnackbar("An order needs at least one item — cancel it instead of emptying it.", { variant: "warning" });
      return;
    }
    mutation.mutate({
      orderId: order._id,
      items: items.map((it) => ({
        ...it,
        quantity: Math.max(1, Number(it.quantity) || 1),
        price: Number(it.price) || 0,
      })),
    });
  };

  return (
    <Modal isOpen onClose={onClose} title={`Edit order #${(order._id || "").slice(-6).toUpperCase()}`}>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-slate-400 text-sm">No items left — add one below, or close and cancel the order instead.</p>}
        {items.map((it, index) => (
          <div key={index} className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-slate-900 dark:text-white text-sm font-bold truncate">
                {it.isDeal && <span className="mr-1.5 rounded-md bg-amber-400 px-1.5 py-0.5 text-[10px] font-black text-slate-950">DEAL</span>}
                {it.name}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Rs {(Number(it.price) || 0).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => updateQty(index, -1)}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center hover:bg-slate-300 transition"
                aria-label="Decrease quantity"
              >
                <FaMinus size={10} />
              </button>
              <span className="w-6 text-center text-slate-900 dark:text-white font-bold text-sm">{it.quantity}</span>
              <button
                type="button"
                onClick={() => updateQty(index, 1)}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center hover:bg-slate-300 transition"
                aria-label="Increase quantity"
              >
                <FaPlus size={10} />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1.5 text-rose-500 hover:text-rose-700 transition"
                aria-label="Remove item"
              >
                <FaTrash size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <select
          value={addDishId}
          onChange={(e) => setAddDishId(e.target.value)}
          className="pos-input flex-1 text-sm min-w-0"
        >
          <option value="">
            Add a dish…
          </option>
          {dishes.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} {d.variants?.length ? `(from Rs ${d.price})` : `(Rs ${d.price})`}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addDish}
          disabled={!addDishId}
          className="pos-btn-secondary"
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
        <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">New subtotal (before tax)</span>
        <span className="text-slate-900 dark:text-white font-extrabold text-base">Rs {previewTotal.toFixed(2)}</span>
      </div>
      <p className="text-slate-400 text-xs mt-1">Tax and the final total are recalculated automatically when you save.</p>

      <div className="mt-5 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="pos-btn-secondary flex-1 py-2.5 text-xs font-bold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending}
          className="pos-btn-primary flex-1 py-2.5 text-xs font-bold"
        >
          {mutation.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </Modal>
  );
};

export default EditOrderModal;
