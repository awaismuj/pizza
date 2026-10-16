import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../../https";
import { MdTableBar, MdShoppingBag, MdClose, MdPerson, MdPhone } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";

const ModernNewOrderModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("dineIn"); // "dineIn" | "takeaway"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTable, setSelectedTable] = useState(null);

  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    enabled: isOpen,
  });

  const tables = tablesData?.data?.data || [];
  const availableTables = tables.filter((t) => t.status !== "Booked");

  if (!isOpen) return null;

  const handleStartOrder = () => {
    // Phone normalization
    const raw = phone || "";
    let digits = raw.replace(/[^0-9]/g, "");
    let full = raw.trim();

    if (full.startsWith("+")) {
      full = "+" + digits;
    } else {
      if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
      if (digits.length === 10 && digits.startsWith("3")) {
        full = "+92" + digits;
      } else if (digits.length === 10) {
        full = "+92" + digits;
      } else if (digits.length === 11 && digits.startsWith("92")) {
        full = "+" + digits;
        digits = digits.replace(/^92/, "");
      } else {
        full = digits;
      }
    }

    const local = (
      full.startsWith("+92") ? full.replace(/[^0-9]/g, "").replace(/^92/, "") : digits
    ).replace(/^0+/, "");

    const customerPayload = {
      name: name.trim() || "Walk-In Customer",
      phone: full || "+920000000000",
      phoneLocal: local,
      guests: guestCount,
    };

    if (orderType === "takeaway") {
      // Outdoor / Takeaway order
      dispatch(setCustomer(customerPayload));
      onClose();
      navigate("/outdoor");
      return;
    }

    // Dine-in order
    if (selectedTable) {
      // If table selected directly in modal, attach it and go straight to menu!
      dispatch(
        setCustomer({
          ...customerPayload,
          table: selectedTable,
        })
      );
      onClose();
      navigate("/menu");
    } else {
      // Otherwise, open tables floor plan to choose
      dispatch(setCustomer(customerPayload));
      onClose();
      navigate("/tables");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <BiSolidDish size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Create New Order</h3>
              <p className="text-xs text-slate-400">Tossdown POS Fast Checkout Flow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Order Type Toggle: Dine In vs Takeaway */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setOrderType("dineIn")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs transition ${
                orderType === "dineIn"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MdTableBar size={18} />
              <span>Dine-In (Table)</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderType("takeaway")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs transition ${
                orderType === "takeaway"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MdShoppingBag size={18} />
              <span>Takeaway / Outdoor</span>
            </button>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Customer Name
            </label>
            <div className="relative">
              <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Walk-In Customer (or enter name)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Customer Phone
            </label>
            <div className="relative">
              <MdPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+923001234567"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {orderType === "dineIn" && (
            <>
              {/* Guest Count */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Guest Count
                </label>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white">
                    {guestCount} {guestCount === 1 ? "Person" : "Persons"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.min(20, g + 1))}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Direct Table Picker in Modal */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Assign Table (Optional - Or select on floor plan)
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 scrollbar-hide">
                  {availableTables.map((table) => {
                    const isSelected = selectedTable?._id === table._id;
                    return (
                      <button
                        key={table._id}
                        type="button"
                        onClick={() => setSelectedTable(isSelected ? null : table)}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20"
                            : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">
                          Table {table.tableNo}
                        </span>
                        <span className="text-[10px] opacity-75">{table.seats} seats</span>
                      </button>
                    );
                  })}
                  {availableTables.length === 0 && (
                    <p className="col-span-full text-xs text-slate-500 py-2">
                      No tables currently available.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-xs transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartOrder}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <span>Proceed to Menu</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernNewOrderModal;
