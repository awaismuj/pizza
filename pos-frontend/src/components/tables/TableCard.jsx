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

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isClean } = useUITheme();
  const role = useSelector((state) => state.user.role);
  const isAdmin = String(role || "").toLowerCase() === "admin";

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftSeats, setDraftSeats] = useState(seats);

  const handleClick = (name) => {
    if (status === "Booked") return;

    const table = { tableId: id, tableNo: name };
    dispatch(updateTableInCart({ table }));
    navigate(`/menu`);
  };

  const openManage = (e) => {
    e.stopPropagation();
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
    const payload = { status: draftStatus };
    if (!Number.isNaN(seatsNum) && seatsNum > 0) payload.seats = seatsNum;
    updateMutation.mutate(payload);
  };

  const handleForceRelease = () => {
    updateMutation.mutate({ status: "Available" });
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

  return (
    <div
      onClick={() => handleClick(name)}
      key={id}
      className={`relative w-full rounded-2xl p-5 cursor-pointer transition-all duration-200 border group ${
        isClean
          ? isBooked
            ? "bg-white border-amber-300 shadow-sm hover:shadow-md"
            : "bg-white border-slate-200/90 hover:border-amber-500/80 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          : isBooked
          ? "bg-slate-900/90 border-slate-800 hover:border-slate-700 opacity-90"
          : "bg-slate-900/90 border-slate-800 hover:border-amber-500/60 hover:shadow-amber-500/10 hover:-translate-y-0.5"
      }`}
    >
      {isAdmin && (
        <button
          onClick={openManage}
          aria-label={`Manage table ${name}`}
          className={`absolute top-4 right-4 z-10 p-1.5 rounded-lg transition ${
            isClean
              ? "text-slate-400 hover:text-amber-600 hover:bg-slate-100"
              : "text-slate-400 hover:text-amber-400 hover:bg-slate-800"
          }`}
          title="Configure table"
        >
          <FaGear size={15} />
        </button>
      )}

      {/* Header: Table No & Status */}
      <div className="flex items-center justify-between pr-7 mb-4">
        <div>
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isClean ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Station
          </span>
          <h2
            className={`text-xl font-black tracking-tight flex items-center gap-1.5 ${
              isClean ? "text-slate-900" : "text-white"
            }`}
          >
            Table {name}
          </h2>
        </div>

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
          {initials || (isBooked ? "Occupied" : "Empty Table")}
        </p>
      </div>

      {/* Footer: Seats & Action CTA */}
      <div
        className={`flex items-center justify-between pt-3 border-t text-xs ${
          isClean ? "border-slate-100 text-slate-500 font-medium" : "border-slate-800/80 text-slate-400"
        }`}
      >
        <span className="flex items-center gap-1">
          Capacity: <strong className={isClean ? "text-slate-800 font-bold" : "text-slate-200"}>{seats} Seats</strong>
        </span>

        <span
          className={`font-bold transition ${
            isBooked
              ? isClean
                ? "text-slate-400"
                : "text-slate-500"
              : isClean
              ? "text-amber-700 group-hover:translate-x-0.5"
              : "text-amber-400 group-hover:translate-x-0.5"
          }`}
        >
          {isBooked ? "In Service" : "Take Order →"}
        </span>
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
    </div>
  );
};

export default TableCard;
