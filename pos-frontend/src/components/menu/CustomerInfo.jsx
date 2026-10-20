import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";
import { useUITheme } from "../../context/UIThemeContext";
import { LuPencil } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import CustomerInfoModal from "../modern/CustomerInfoModal";

const CustomerInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customerData = useSelector((state) => state.customer);
  const { isClean } = useUITheme();

  const isMissingDetails =
    !customerData.customerName ||
    customerData.customerName === "Customer Name" ||
    customerData.customerName === "Walk-In Guest" ||
    !customerData.customerPhone ||
    customerData.customerPhone === "N/A";

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition select-none ${
          isMissingDetails
            ? "bg-amber-500/10 hover:bg-amber-500/15 border-b border-amber-500/30"
            : isClean
            ? "hover:bg-slate-50"
            : "hover:bg-slate-800/50"
        }`}
        title="Click to enter or edit customer details"
      >
        <div className="flex flex-col items-start min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5 w-full">
            <h3
              className={`text-sm font-bold tracking-tight truncate max-w-[170px] ${
                isMissingDetails
                  ? "text-amber-700 dark:text-amber-300"
                  : isClean
                  ? "text-slate-900"
                  : "text-[#f5f5f5]"
              }`}
            >
              {customerData.customerName &&
              customerData.customerName !== "Customer Name" &&
              customerData.customerName !== "Walk-In Guest"
                ? customerData.customerName
                : "Customer Name *"}
            </h3>
            <span className="opacity-0 group-hover:opacity-100 text-amber-500 text-xs transition-opacity">
              <LuPencil size={12} />
            </span>
          </div>

          {customerData.customerPhone ? (
            <p className="text-[10px] text-slate-400 font-medium font-mono">
              {customerData.customerPhone}
            </p>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              <MdErrorOutline size={12} />
              <span>Mobile # Required *</span>
            </span>
          )}

          <p className={`text-[11px] font-medium mt-0.5 ${isClean ? "text-slate-500" : "text-[#ababab]"}`}>
            {customerData.orderId
              ? customerData.orderId.startsWith("#")
                ? customerData.orderId
                : `#${customerData.orderId}`
              : "#New Order"}{" "}
            · Dine-in
          </p>
          <p className={`text-[10px] mt-0.5 ${isClean ? "text-slate-400" : "text-[#8a8a8a]"}`}>
            {formatDate(dateTime)}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
          {getAvatarName(customerData.customerName) || "CN"}
        </div>
      </div>

      <CustomerInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={customerData}
        title="Edit Customer Details"
        tableInfo={customerData.table}
      />
    </>
  );
};

export default CustomerInfo;
