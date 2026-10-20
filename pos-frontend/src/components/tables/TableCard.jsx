import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable as updateTableInCart } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { updateTable as updateTableApi, deleteTable as deleteTableApi } from "../../https";
import { useUITheme } from "../../context/UIThemeContext";

import TableOrderDrawer from "./TableOrderDrawer";
import CustomerInfoModal from "../modern/CustomerInfoModal";
import ReservationModal from "./ReservationModal";

import { MdLink, MdCheck, MdCalendarMonth } from "react-icons/md";

const TableCard = ({
  id,
  name,
  status,
  initials,
  seats,
  table,
  onEdit,
  isCombineMode = false,
  isCombineSelected = false,
  onToggleCombine,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();
  const role = useSelector((state) => state.user.role);
  const normalizedRole = String(role || "").toLowerCase();
  const isAdmin = normalizedRole === "admin" || normalizedRole === "manager" || normalizedRole === "system admin";

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [draftTableNo, setDraftTableNo] = useState(name);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftSeats, setDraftSeats] = useState(seats);

  const confirmedReservations = (table?.reservations || []).filter((r) => r.status === "Confirmed");
  const nextBooking = confirmedReservations[0];

  const handleClick = (name) => {
    if (isCombineMode) {
      if (status === "Booked") {
        enqueueSnackbar("Occupied table cannot be combined.", { variant: "warning" });
        return;
      }
      if (onToggleCombine) onToggleCombine(table);
      return;
    }

    if (status === "Booked") {
      setIsOrderDrawerOpen(true);
      return;
    }

    setIsCustomerModalOpen(true);
  };

  const openManage = (e) => {
    e.stopPropagation();
    if (onEdit && table) {
      onEdit(table);
      return;
    }
    setDraftTableNo(name);
    setDraftStatus(status);
    setDraftSeats(seats);
    setIsManageOpen(true);
  };

  const invalidateTables = () => queryClient.invalidateQueries({ queryKey: ["tables"] });

  const updateMutation = useMutation({
    mutationFn: (payload) => updateTableApi({ tableId: id, ...payload }),
    onSuccess: () => {
      enqueueSnackbar("Table updated!", { variant: "success" });
      invalidateTables();
      setIsManageOpen(false);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update table.", { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTableApi(id),
    onSuccess: () => {
      enqueueSnackbar("Table deleted!", { variant: "success" });
      invalidateTables();
      setIsManageOpen(false);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete table.", { variant: "error" });
    },
  });

  const handleSave = () => {
    const seatsNum = Number(draftSeats);
    const tableNoNum = Number(draftTableNo);
    const payload = { status: draftStatus };
    if (!Number.isNaN(seatsNum) && seatsNum > 0) payload.seats = seatsNum;
    if (!Number.isNaN(tableNoNum) && tableNoNum > 0) payload.tableNo = tableNoNum;
    updateMutation.mutate(payload);
  };

  const handleForceRelease = () => {
    const tableIds = table?.currentOrder?.tables && table.currentOrder.tables.length > 0
      ? table.currentOrder.tables
      : [id];
    updateMutation.mutate({ status: "Available", tableIds });
  };

  const handleDelete = () => {
    if (status === "Booked") {
      enqueueSnackbar("Free this table before deleting it.", { variant: "warning" });
      return;
    }
    if (!window.confirm(`Delete Table ${name}? This can't be undone.`)) return;
    deleteMutation.mutate();
  };

  const isBooked = status === "Booked";
  const isCombined = table?.isCombined || Boolean(table?.combinedTableNos);

  return (
    <div
      onClick={() => handleClick(name)}
      key={id}
      className={`relative w-full rounded-2xl p-5 cursor-pointer transition-all duration-200 border group ${
        isCombineMode
          ? isBooked
            ? "opacity-35 cursor-not-allowed bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
            : isCombineSelected
            ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-4 ring-purple-500/30 shadow-lg shadow-purple-500/20 scale-[1.02]"
            : "bg-white dark:bg-slate-900 border-dashed border-2 border-purple-300 dark:border-purple-700/60 hover:border-purple-500 hover:shadow-md"
          : isClean
          ? isBooked
            ? isCombined
              ? "bg-white border-purple-300 shadow-sm hover:shadow-md"
              : "bg-white border-amber-300 shadow-sm hover:shadow-md"
            : "bg-white border-slate-200/90 hover:border-amber-500/80 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          : isBooked
          ? isCombined
            ? "bg-slate-900/90 border-purple-800 hover:border-purple-700"
            : "bg-slate-900/90 border-slate-800 hover:border-slate-700 opacity-90"
          : "bg-slate-900/90 border-slate-800 hover:border-amber-500/60 hover:shadow-amber-500/10 hover:-translate-y-0.5"
      }`}
    >
      {/* Top action buttons */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsReserveModalOpen(true);
          }}
          aria-label={`Reservations for table ${name}`}
          className={`p-1.5 rounded-lg transition ${
            confirmedReservations.length > 0
              ? "text-amber-500 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25"
              : isClean
              ? "text-slate-400 hover:text-amber-600 hover:bg-slate-100"
              : "text-slate-400 hover:text-amber-400 hover:bg-slate-800"
          }`}
          title="Table Bookings & Reservations"
        >
          <MdCalendarMonth size={16} />
        </button>

        {isAdmin && (
          <button
            onClick={openManage}
            aria-label={`Manage table ${name}`}
            className={`p-1.5 rounded-lg transition ${
              isClean
                ? "text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                : "text-slate-400 hover:text-amber-400 hover:bg-slate-800"
            }`}
            title="Configure table"
          >
            <FaGear size={15} />
          </button>
        )}
      </div>

      {/* Header: Table No & Status */}
      <div className="flex items-center justify-between pr-14 mb-3">
        <div>
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isClean ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Station
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2
              className={`text-xl font-black tracking-tight flex items-center gap-1.5 ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              Table {name}
            </h2>
            {isCombined && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <MdLink size={12} />
                <span>Joined T{table.combinedTableNos || table.combinedWith?.join("+")}</span>
              </span>
            )}
          </div>

          {nextBooking && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsReserveModalOpen(true);
              }}
              className="mt-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-500/25 transition"
              title="Click to manage booking or seat party"
            >
              <span>📅 Booked: {nextBooking.customerName} ({new Date(nextBooking.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
            </div>
          )}
        </div>


        {isCombineMode && isCombineSelected ? (
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-600/30 animate-scaleIn">
            <MdCheck size={14} />
          </span>
        ) : (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isBooked
                ? isClean
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : isClean
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isBooked
                  ? isClean
                    ? "bg-amber-600"
                    : "bg-amber-400"
                  : isClean
                  ? "bg-emerald-600 animate-pulse"
                  : "bg-emerald-400 animate-pulse"
              }`}
            ></span>
            {status}
          </span>
        )}
      </div>

      {/* Avatar & Guest initials */}
      <div className="flex flex-col items-center justify-center my-4 py-2">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shadow-xs ring-2 ${
            isClean ? "ring-slate-100 text-white" : "ring-slate-800 text-white"
          }`}
          style={{ backgroundColor: initials ? getBgColor() : isClean ? "#CBD5E1" : "#1E293B" }}
        >
          {getAvatarName(initials) || "—"}
        </div>
        <p
          className={`mt-2 text-xs font-bold truncate max-w-[150px] ${
            isClean ? "text-slate-700" : "text-slate-300"
          }`}
        >
          {initials || table?.currentOrder?.customerDetails?.name || (isBooked ? "Occupied" : "Empty Table")}
        </p>
        {isBooked && (table?.currentOrder?.bills?.totalWithTax || table?.currentOrder?.bills?.total) && (
          <span className="text-[11px] font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5">
            Rs {(table.currentOrder.bills.totalWithTax || table.currentOrder.bills.total).toLocaleString()}
          </span>
        )}
      </div>

      {/* Footer: Seats & Action CTA */}
      <div
        className={`flex items-center justify-between pt-3 border-t text-xs ${
          isClean ? "border-slate-100 text-slate-500 font-medium" : "border-slate-800/80 text-slate-400"
        }`}
      >
        <span className="flex items-center gap-1">
          Capacity: <strong className={isClean ? "text-slate-800 font-bold" : "text-slate-200"}>{seats} Seats</strong>
          {isCombined && table.combinedTotalSeats && (
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold ml-1">
              ({table.combinedTotalSeats} combined)
            </span>
          )}
        </span>

        {isBooked ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOrderDrawerOpen(true);
            }}
            className="font-black text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 transition group-hover:translate-x-0.5"
          >
            <span>View Order</span>
            <span>↗</span>
          </button>
        ) : (
          <span
            className={`font-bold transition ${
              isClean
                ? "text-amber-700 group-hover:translate-x-0.5"
                : "text-amber-400 group-hover:translate-x-0.5"
            }`}
          >
            Take Order →
          </span>
        )}
      </div>

      {isAdmin && (
        <Modal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} title={`Manage Table ${name}`}>
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4">
            {status === "Booked" && (
              <div className={`text-sm rounded-xl p-3 border ${
                isClean
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-amber-950/40 border-amber-800 text-amber-300"
              }`}>
                Showing as Booked. If this table isn't actually occupied (e.g. its
                order was closed elsewhere), use "Force available" below to reset it.
              </div>
            )}

            <div>
              <label className={`block mb-1.5 text-xs font-bold uppercase tracking-wider ${isClean ? "text-slate-600" : "text-slate-400"}`}>
                Table Number
              </label>
              <input
                type="number"
                min="1"
                value={draftTableNo}
                onChange={(e) => setDraftTableNo(e.target.value)}
                className={`w-full rounded-xl p-3 px-4 text-sm font-medium border outline-none transition ${
                  isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                    : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                }`}
              />
            </div>

            <div>
              <label className={`block mb-1.5 text-xs font-bold uppercase tracking-wider ${isClean ? "text-slate-600" : "text-slate-400"}`}>
                Status
              </label>
              <select
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
                className={`w-full rounded-xl p-3 px-4 text-sm font-medium border outline-none transition ${
                  isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                    : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                }`}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </div>

            <div>
              <label className={`block mb-1.5 text-xs font-bold uppercase tracking-wider ${isClean ? "text-slate-600" : "text-slate-400"}`}>
                Seats
              </label>
              <input
                type="number"
                min="1"
                value={draftSeats}
                onChange={(e) => setDraftSeats(e.target.value)}
                className={`w-full rounded-xl p-3 px-4 text-sm font-medium border outline-none transition ${
                  isClean
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-amber-500"
                    : "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                }`}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl py-3 transition shadow-sm disabled:opacity-60 text-sm"
            >
              Save Changes
            </button>

            {status === "Booked" && (
              <button
                onClick={handleForceRelease}
                disabled={updateMutation.isPending}
                className={`w-full font-bold rounded-xl py-3 border transition disabled:opacity-60 text-sm ${
                  isClean
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    : "bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60"
                }`}
              >
                Force Available (Clear Stuck Booking)
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending || status === "Booked"}
              className={`w-full border font-bold rounded-xl py-3 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm ${
                isClean
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : "border-red-800/80 text-red-400 hover:bg-red-950/40"
              }`}
            >
              Delete Table
            </button>
          </div>
        </Modal>
      )}

      {/* Active Table Order Drawer */}
      <TableOrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        table={{ ...table, _id: id, tableNo: name, status, seats }}
        onFreeTable={handleForceRelease}
      />

      {/* New Dining Order Customer Details Modal */}
      <CustomerInfoModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title={`Table ${name} · New Dining Order`}
        tableInfo={{ tableId: id, tableNo: name, seats }}
        onSuccess={() => navigate("/menu")}
      />

      {/* Advance Table Reservation Modal */}
      <ReservationModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        table={{ ...table, _id: id, tableNo: name, seats, reservations: table?.reservations }}
      />
    </div>
  );
};


export default TableCard;
