import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../../https";
import { MdTableBar, MdShoppingBag, MdClose, MdPerson, MdPhone } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useUITheme } from "../../context/UIThemeContext";

const ModernNewOrderModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isClean } = useUITheme();

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

  const modalJSX = (
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`pointer-events-auto w-screen max-w-lg shadow-2xl flex flex-col h-full border-l transition-colors ${
            isClean
              ? "bg-white border-slate-200 text-slate-900"
              : "bg-[#0F172A] border-slate-800 text-slate-100"
          }`}
        >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isClean ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isClean ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-amber-500/10 text-amber-400"
              }`}
            >
              <BiSolidDish size={22} />
            </div>
            <div>
              <h3 className={`text-base font-extrabold leading-tight ${isClean ? "text-slate-900" : "text-white"}`}>
                Create New Order
              </h3>
              <p className={`text-xs ${isClean ? "text-slate-500 font-medium" : "text-slate-400"}`}>
                Quick Billing & Kitchen Flow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isClean ? "text-slate-400 hover:text-slate-800 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Order Type Toggle: Dine In vs Takeaway */}
          <div
            className={`grid grid-cols-2 gap-3 p-1 rounded-xl border ${
              isClean ? "bg-slate-100 border-slate-200" : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <button
              type="button"
              onClick={() => setOrderType("dineIn")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition ${
                orderType === "dineIn"
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : isClean
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MdTableBar size={18} />
              <span>Dine-In (Table)</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderType("takeaway")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-xs transition ${
                orderType === "takeaway"
                  ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                  : isClean
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MdShoppingBag size={18} />
              <span>Takeaway / Outdoor</span>
            </button>
          </div>

          {/* Customer Name */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isClean ? "text-slate-500" : "text-slate-400"}`}>
              Customer Name
            </label>
            <div className="relative">
              <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Walk-In Customer (or enter name)"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition outline-none ${
                  isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    : "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500"
                }`}
              />
            </div>
          </div>

          {/* Customer Phone */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isClean ? "text-slate-500" : "text-slate-400"}`}>
              Customer Phone
            </label>
            <div className="relative">
              <MdPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+923001234567"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition outline-none ${
                  isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    : "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500"
                }`}
              />
            </div>
          </div>

          {orderType === "dineIn" && (
            <>
              {/* Guest Count */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isClean ? "text-slate-500" : "text-slate-400"}`}>
                  Guest Count
                </label>
                <div
                  className={`flex items-center justify-between p-2 rounded-xl border ${
                    isClean ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    className={`w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition border ${
                      isClean
                        ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-xs"
                        : "bg-slate-800 hover:bg-slate-700 text-white border-transparent"
                    }`}
                  >
                    -
                  </button>
                  <span className={`text-sm font-black ${isClean ? "text-slate-900" : "text-white"}`}>
                    {guestCount} {guestCount === 1 ? "Person" : "Persons"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestCount((g) => Math.min(20, g + 1))}
                    className={`w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition border ${
                      isClean
                        ? "bg-white text-slate-800 border-slate-200 hover:bg-slate-100 shadow-xs"
                        : "bg-slate-800 hover:bg-slate-700 text-white border-transparent"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Direct Table Picker in Modal */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isClean ? "text-slate-500" : "text-slate-400"}`}>
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
                            : isClean
                            ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs"
                            : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">
                          Table {table.tableNo}
                        </span>
                        <span className={`text-[10px] ${isClean ? "text-slate-500" : "opacity-75"}`}>
                          {table.seats} seats
                        </span>
                      </button>
                    );
                  })}
                  {availableTables.length === 0 && (
                    <p className={`col-span-full text-xs py-2 ${isClean ? "text-slate-500" : "text-slate-500"}`}>
                      No tables currently available.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
            isClean ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition border ${
              isClean
                ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                : "border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartOrder}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <span>Proceed to Menu</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
};

export default ModernNewOrderModal;
