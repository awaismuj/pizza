import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack";
import { MdPerson, MdPhone, MdTableBar, MdPeopleAlt } from "react-icons/md";
import { IoCloseOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { useUITheme } from "../../context/UIThemeContext";
import { lookupCustomerByPhone } from "../../https";

const CustomerInfoModal = ({
  isOpen,
  onClose,
  initialData = {},
  title = "Customer Details",
  tableInfo = null,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const { isClean } = useUITheme();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [errors, setErrors] = useState({});
  const [loyaltyProfile, setLoyaltyProfile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const initName =
        initialData.customerName &&
        initialData.customerName !== "Customer Name" &&
        initialData.customerName !== "Walk-In Guest"
          ? initialData.customerName
          : "";
      setName(initName);
      setPhone(initialData.customerPhone || "");
      setGuests(initialData.guests || tableInfo?.seats || 2);
      setErrors({});
      setLoyaltyProfile(null);
    }
  }, [isOpen, initialData, tableInfo]);

  useEffect(() => {
    const clean = (phone || "").replace(/\D/g, "");
    if (clean.length >= 10) {
      const timer = setTimeout(async () => {
        try {
          const res = await lookupCustomerByPhone(clean);
          if (res.data?.success && res.data?.data) {
            setLoyaltyProfile(res.data.data);
            setName((prev) => (prev && prev !== "Guest" ? prev : res.data.data.name));
          } else {
            setLoyaltyProfile(null);
          }
        } catch {
          // silently continue
        }
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setLoyaltyProfile(null);
    }
  }, [phone]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!name || !name.trim()) {
      errs.name = "Customer name is mandatory.";
    } else if (name.trim().length < 2) {
      errs.name = "Enter at least 2 characters.";
    }

    const cleanPhone = (phone || "").replace(/\D/g, "");
    if (!phone || !phone.trim()) {
      errs.phone = "Customer mobile number is mandatory.";
    } else if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      errs.phone = "Enter a valid 10-13 digit mobile number.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      enqueueSnackbar("Customer name and valid mobile number are mandatory!", {
        variant: "warning",
      });
      return;
    }

    // Phone normalization (Pakistan +92 standard with clean local)
    const raw = phone.trim();
    let digits = raw.replace(/\D/g, "");
    let full = raw;

    if (full.startsWith("+")) {
      full = "+" + digits;
    } else {
      if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
      if (digits.length === 10 && digits.startsWith("3")) {
        full = "+92" + digits;
      } else if (digits.length === 11 && digits.startsWith("92")) {
        full = "+" + digits;
        digits = digits.replace(/^92/, "");
      } else {
        full = "+92" + digits;
      }
    }

    const local = (
      full.startsWith("+92") ? full.replace(/\D/g, "").replace(/^92/, "") : digits
    ).replace(/^0+/, "");

    const customerPayload = {
      name: name.trim(),
      phone: full,
      phoneLocal: local,
      guests: Number(guests) || 1,
      loyaltyPoints: loyaltyProfile?.loyaltyPoints || 0,
      table: tableInfo || initialData.table || null,
      orderId: initialData.orderId || undefined,
      existingOrderId: initialData.existingOrderId || undefined,
    };

    dispatch(setCustomer(customerPayload));
    enqueueSnackbar("Customer details recorded!", { variant: "success" });

    if (onSuccess) {
      onSuccess(customerPayload);
    }
    onClose();
  };

  const modalJSX = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border transition-all z-10 overflow-hidden animate-scaleIn ${
          isClean
            ? "bg-white border-slate-200/90 text-slate-900"
            : "bg-slate-900 border-slate-800 text-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/20 shadow-2xs">
              <MdPerson size={20} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Customer name & mobile number are mandatory for order billing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Station Banner (if table assigned) */}
        {(tableInfo || initialData?.table) && (
          <div className="px-5 pt-4">
            {(() => {
              const activeTable = tableInfo || initialData?.table;
              const isCombined = activeTable?.isCombined || Boolean(activeTable?.combinedTableNos);
              const tableNoDisplay = activeTable?.combinedTableNos || activeTable?.tableNo;
              const capacity = activeTable?.totalSeats || activeTable?.seats;

              return (
                <div className="space-y-1.5">
                  <div
                    className={`flex items-center justify-between border rounded-xl px-3.5 py-2 ${
                      isCombined
                        ? "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/50"
                        : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <MdTableBar
                        size={16}
                        className={isCombined ? "text-purple-600 dark:text-purple-400" : "text-amber-600 dark:text-amber-400"}
                      />
                      <span className={isCombined ? "text-purple-950 dark:text-purple-200" : "text-amber-950 dark:text-amber-200"}>
                        {isCombined ? `Combined Station: Table ${tableNoDisplay}` : `Station: Table ${tableNoDisplay}`}
                      </span>
                      {capacity && (
                        <span className="text-[10px] opacity-75 font-semibold">
                          ({capacity} Seats)
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isCombined
                          ? "bg-purple-200/80 dark:bg-purple-500/25 text-purple-900 dark:text-purple-200"
                          : "bg-amber-200/70 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200"
                      }`}
                    >
                      {isCombined ? "🔗 Joined Tables" : "Dine-In"}
                    </span>
                  </div>

                  {capacity && Number(guests) > Number(capacity) && (
                    <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 px-1">
                      ⚠️ Note: {guests} guests exceed Table {tableNoDisplay}'s {capacity} seats.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                placeholder="e.g. Ahmad Bilal"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none transition ${
                  errors.name
                    ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-slate-900 dark:text-white"
                    : isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Customer Mobile Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Customer Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MdPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                placeholder="0300 1234567 or +923001234567"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none transition ${
                  errors.phone
                    ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-slate-900 dark:text-white"
                    : isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.phone}</p>
            )}
            {loyaltyProfile && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400 animate-fadeIn">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">👑</span>
                  <div>
                    <p className="font-bold">Returning Patron: {loyaltyProfile.name}</p>
                    <p className="text-[10px] text-amber-600/90 dark:text-amber-300">
                      {loyaltyProfile.orderCount || 1} past orders • {loyaltyProfile.loyaltyPoints || 0} Loyalty Points
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-200">
                  Rs. {(loyaltyProfile.loyaltyPoints || 0) * 5} Value
                </span>
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              Used for bill receipts, WhatsApp delivery notifications, and order verification.
            </p>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Party / Guest Count
            </label>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <MdPeopleAlt size={16} className="text-slate-400" />
                <span>Guests seated</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-black text-sm flex items-center justify-center hover:bg-slate-100 transition"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">
                  {guests}
                </span>
                <button
                  type="button"
                  onClick={() => setGuests((prev) => prev + 1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-black text-sm flex items-center justify-center hover:bg-slate-100 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
            >
              <IoCheckmarkCircleOutline size={16} />
              <span>Confirm & Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};

export default CustomerInfoModal;
