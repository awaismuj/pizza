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
        {items.length === 0 && <p className="text-[#7a7a7a] text-sm">No items left — add one below, or close and cancel the order instead.</p>}
        {items.map((it, index) => (
          <div key={index} className="flex items-center justify-between gap-2 bg-[#111] rounded-lg px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="text-[#f5f5f5] text-sm font-medium truncate">
                {it.isDeal && <span className="mr-1 rounded bg-[#f6b100] px-1 text-[10px] font-bold text-black">DEAL</span>}
                {it.name}
              </p>
              <p className="text-[#7a7a7a] text-xs">Rs {(Number(it.price) || 0).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => updateQty(index, -1)}
                className="w-7 h-7 rounded bg-[#262626] text-[#f5f5f5] flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <FaMinus size={10} />
              </button>
              <span className="w-6 text-center text-[#f5f5f5] text-sm">{it.quantity}</span>
              <button
                type="button"
                onClick={() => updateQty(index, 1)}
                className="w-7 h-7 rounded bg-[#262626] text-[#f5f5f5] flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <FaPlus size={10} />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-400 hover:text-red-300 px-1"
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
          className="flex-1 bg-[#262626] text-white rounded-lg px-2 py-2 outline-none text-sm min-w-0"
        >
          <option value="" className="bg-[#1f1f1f]">
            Add a dish…
          </option>
          {dishes.map((d) => (
            <option key={d._id} value={d._id} className="bg-[#1f1f1f]">
              {d.name} {d.variants?.length ? `(from Rs ${d.price})` : `(Rs ${d.price})`}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addDish}
          disabled={!addDishId}
          className="rounded-lg bg-[#262626] hover:bg-[#333] text-[#f6b100] px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#333] pt-3">
        <span className="text-[#ababab] text-sm">New subtotal (before tax)</span>
        <span className="text-[#f5f5f5] font-semibold">Rs {previewTotal.toFixed(2)}</span>
      </div>
      <p className="text-[#7a7a7a] text-xs mt-1">Tax and the final total are recalculated automatically when you save.</p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg bg-[#262626] text-[#ababab] py-2.5 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending}
          className="flex-1 rounded-lg bg-yellow-400 text-gray-900 py-2.5 text-sm font-bold disabled:opacity-60"
        >
          {mutation.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </Modal>
  );
};

export default EditOrderModal;
