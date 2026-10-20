import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reserveTable, updateReservationStatus } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useUITheme } from "../../context/UIThemeContext";
import {
  MdEventSeat,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdPerson,
  MdPhone,
  MdCalendarMonth,
} from "react-icons/md";

const ReservationModal = ({ isOpen, onClose, table }) => {
  const { isClean } = useUITheme();
  const queryClient = useQueryClient();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(table?.seats || 4);
  const [notes, setNotes] = useState("");

  // Default time: today + 1 hour formatted for datetime-local
  const getDefaultDateTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0, 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [reservationTime, setReservationTime] = useState(getDefaultDateTime());

  const reserveMutation = useMutation({
    mutationFn: reserveTable,
    onSuccess: (res) => {
      enqueueSnackbar(res.data?.message || "Table reservation confirmed!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
      setCustomerName("");
      setPhone("");
      setNotes("");
      onClose();
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || "Failed to reserve table.", {
        variant: "error",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: updateReservationStatus,
    onSuccess: (res) => {
      enqueueSnackbar(res.data?.message || "Reservation status updated.", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || "Failed to update reservation status.", {
        variant: "error",
      });
    },
  });

  if (!isOpen || !table) return null;

  const activeReservations = (table.reservations || []).filter(
    (r) => r.status === "Confirmed"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, "");
    if (!customerName || customerName.trim().length < 2) {
      enqueueSnackbar("Customer name is required.", { variant: "warning" });
      return;
    }
    if (cleanDigits.length < 10) {
      enqueueSnackbar("Valid phone number is required (at least 10 digits).", { variant: "warning" });
      return;
    }

    reserveMutation.mutate({
      tableId: table._id,
      customerName: customerName.trim(),
      phone: phone.trim(),
      guests: Number(guests),
      reservationTime: new Date(reservationTime),
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden transition ${
          isClean
            ? "bg-white border-slate-200 text-slate-800"
            : "bg-slate-900 border-slate-800 text-slate-100"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isClean ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-slate-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <MdCalendarMonth size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Table {table.tableNo} Reservations
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400 font-normal">
                  {table.seats} Seats
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Schedule future dining party bookings & manage arrival check-in
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Active Reservations on this Table */}
          {activeReservations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <MdAccessTime size={14} /> Upcoming Confirmed Bookings ({activeReservations.length})
              </h3>
              <div className="space-y-2">
                {activeReservations.map((r) => (
                  <div
                    key={r._id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isClean ? "bg-amber-50/60 border-amber-200" : "bg-amber-950/20 border-amber-500/30"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {r.customerName} ({r.guests} guests)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Phone: {r.phone}
                      </div>
                      <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                        📅 {new Date(r.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{" "}
                        {new Date(r.reservationTime).toLocaleDateString()}
                      </div>
                      {r.notes && (
                        <div className="text-[10px] text-slate-400 italic mt-0.5">
                          "{r.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          statusMutation.mutate({
                            tableId: table._id,
                            reservationId: r._id,
                            status: "Arrived",
                          })
                        }
                        disabled={statusMutation.isPending}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 flex items-center gap-1 transition"
                      >
                        <MdCheckCircle size={13} /> Seat Party
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          statusMutation.mutate({
                            tableId: table._id,
                            reservationId: r._id,
                            status: "Cancelled",
                          })
                        }
                        disabled={statusMutation.isPending}
                        className="px-2 py-0.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-medium text-[10px] flex items-center gap-1 transition"
                      >
                        <MdCancel size={11} /> Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Reservation Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              New Booking for Table {table.tableNo}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Guest Name *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <MdPerson size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest full name"
                    className={`w-full py-2 pl-9 pr-3 rounded-xl border text-xs outline-hidden ${
                      isClean
                        ? "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                        : "bg-slate-950 border-slate-700 text-white focus:border-amber-400"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Mobile Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <MdPhone size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03xxxxxxxxx"
                    className={`w-full py-2 pl-9 pr-3 rounded-xl border text-xs outline-hidden ${
                      isClean
                        ? "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                        : "bg-slate-950 border-slate-700 text-white focus:border-amber-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Party Size (Guests) *</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold outline-hidden ${
                    isClean
                      ? "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                      : "bg-slate-950 border-slate-700 text-white focus:border-amber-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs outline-hidden ${
                    isClean
                      ? "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                      : "bg-slate-950 border-slate-700 text-white focus:border-amber-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Booking Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Birthday cake presentation, window seat requested"
                className={`w-full py-2 px-3 rounded-xl border text-xs outline-hidden ${
                  isClean
                    ? "bg-white border-slate-300 text-slate-900"
                    : "bg-slate-950 border-slate-700 text-white"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={reserveMutation.isPending}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-98 disabled:opacity-50"
            >
              {reserveMutation.isPending ? "Confirming..." : "Confirm Table Reservation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
