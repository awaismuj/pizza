import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";
import { useUITheme } from "../../context/UIThemeContext";

const CustomerInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const customerData = useSelector((state) => state.customer);
  const { isClean } = useUITheme();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start min-w-0">
        <h3
          className={`text-sm font-extrabold truncate max-w-[170px] ${
            isClean ? "text-slate-900" : "text-[#f5f5f5]"
          }`}
        >
          {customerData.customerName || "Customer Name"}
        </h3>
        <p className={`text-[11px] font-semibold mt-0.5 ${isClean ? "text-slate-500" : "text-[#ababab]"}`}>
          #{customerData.orderId || "New Order"} / Dine-in
        </p>
        <p className={`text-[10px] mt-1 ${isClean ? "text-slate-400" : "text-[#8a8a8a]"}`}>
          {formatDate(dateTime)}
        </p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
        {getAvatarName(customerData.customerName) || "CN"}
      </div>
    </div>
  );
};

export default CustomerInfo;
