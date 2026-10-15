import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAvatarName, getBgColor } from "../../utils"
import { useDispatch } from "react-redux";
import { updateTable as updateTableInCart } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { updateTable as updateTableApi, deleteTable as deleteTableApi } from "../../https";

const TableCard = ({id, name, status, initials, seats}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useSelector((state) => state.user.role);
  const isAdmin = String(role || "").toLowerCase() === "admin";

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftSeats, setDraftSeats] = useState(seats);

  const handleClick = (name) => {
    if(status === "Booked") return;

    const table = { tableId: id, tableNo: name }
    dispatch(updateTableInCart({table}))
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

  // One-click fix for the exact bug this modal exists to solve: a table
  // stuck on "Booked" with no order actually attached to it anymore.
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

  return (
    <div onClick={() => handleClick(name)} key={id} className="relative w-full hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-lg cursor-pointer">
      {isAdmin && (
        <button
          onClick={openManage}
          aria-label={`Manage table ${name}`}
          className="absolute top-3 right-3 z-10 text-[#ababab] hover:text-[#f6b100] p-1.5 rounded-full hover:bg-[#1f1f1f]"
        >
          <FaGear size={16} />
        </button>
      )}
      <div className="flex items-center justify-between px-1 pr-6">
        <h1 className="text-[#f5f5f5] text-xl font-semibold">Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {name}</h1>
        <p className={`${status === "Booked" ? "text-green-600 bg-[#2e4a40]" : "bg-[#664a04] text-white"} px-2 py-1 rounded-lg`}>
          {status}
        </p>
      </div>
      <div className="flex items-center justify-center mt-5 mb-8">
        <h1 className={`text-white rounded-full p-5 text-xl`} style={{backgroundColor : initials ? getBgColor() : "#1f1f1f"}} >{getAvatarName(initials) || "N/A"}</h1>
      </div>
      <p className="text-[#ababab] text-xs">Seats: <span className="text-[#f5f5f5]">{seats}</span></p>

      {isAdmin && (
        <Modal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} title={`Manage Table ${name}`}>
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4">
            {status === "Booked" && (
              <div className="bg-[#332b12] border border-[#664a04] text-[#f6b100] text-sm rounded-lg p-3">
                Showing as Booked. If this table isn't actually occupied (e.g. its
                order was closed elsewhere), use "Force available" below to reset it.
              </div>
            )}

            <div>
              <label className="block text-[#ababab] mb-2 text-sm font-medium">Status</label>
              <select
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
                className="w-full bg-[#1f1f1f] text-white rounded-lg p-3 px-4 focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </div>

            <div>
              <label className="block text-[#ababab] mb-2 text-sm font-medium">Seats</label>
              <input
                type="number"
                min="1"
                value={draftSeats}
                onChange={(e) => setDraftSeats(e.target.value)}
                className="w-full bg-[#1f1f1f] text-white rounded-lg p-3 px-4 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full bg-[#F6B100] text-[#1f1f1f] font-semibold rounded-lg py-3 hover:bg-yellow-600 disabled:opacity-60"
            >
              Save changes
            </button>

            {status === "Booked" && (
              <button
                onClick={handleForceRelease}
                disabled={updateMutation.isPending}
                className="w-full bg-[#2e4a40] text-green-400 font-semibold rounded-lg py-3 hover:bg-[#375a4d] disabled:opacity-60"
              >
                Force available (clear stuck booking)
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending || status === "Booked"}
              className="w-full bg-transparent border border-red-600 text-red-500 font-semibold rounded-lg py-3 hover:bg-red-950 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete table
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TableCard;
