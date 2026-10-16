import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { getOrders } from "../../https";
import { getAvatarName, getOrderNumber } from "../../utils";
import Invoice from "../invoice/Invoice";
import { useUITheme } from "../../context/UIThemeContext";

// Search past orders by order #, mobile number, or customer name. Selecting
// a result opens its invoice for review; it only prints when the person
// clicks "Print Receipt" inside that invoice, same as any other receipt.
const OrderSearch = () => {
  const [query, setQuery] = useState("");
  const [printOrder, setPrintOrder] = useState(null);
  const { isClean } = useUITheme();

  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const orders = data?.data?.data ?? [];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const digitsOnly = q.replace(/\D/g, "");

    return orders
      .filter((order) => {
        const orderId = getOrderNumber(order).toLowerCase();
        const name = (order.customerDetails?.name || "").toLowerCase();
        const phone = (order.customerDetails?.phone || "").toLowerCase();

        return (
          orderId.includes(q.replace(/^#/, "")) ||
          name.includes(q) ||
          phone.includes(q) ||
          (digitsOnly && phone.replace(/\D/g, "").includes(digitsOnly))
        );
      })
      .slice(0, 8);
  }, [orders, query]);

  const handleSelect = (order) => {
    setPrintOrder(order);
    setQuery("");
  };

  return (
    <div className="px-4 pt-3 relative">
      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
          isClean
            ? "bg-slate-50 border border-slate-200 text-slate-800 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500"
            : "bg-[#1f1f1f] focus-within:ring-1 focus-within:ring-[#f6b100]"
        }`}
      >
        <FaSearch className={isClean ? "text-slate-400 text-sm shrink-0" : "text-[#767676] text-sm shrink-0"} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order # / mobile / name"
          className={`bg-transparent flex-1 text-sm outline-none min-w-0 ${
            isClean ? "text-slate-900 placeholder:text-slate-400" : "text-white placeholder:text-[#767676]"
          }`}
        />
      </div>

      {query.trim() && (
        <div
          className={`absolute z-20 left-4 right-4 mt-1 rounded-xl shadow-xl max-h-64 overflow-y-auto ${
            isClean ? "bg-white border border-slate-200" : "bg-[#1f1f1f] border border-[#2a2a2a]"
          }`}
        >
          {results.length === 0 ? (
            <p className={`text-xs px-3 py-3 ${isClean ? "text-slate-400" : "text-[#767676]"}`}>
              No matching orders.
            </p>
          ) : (
            results.map((order) => {
              const orderId = getOrderNumber(order);
              const isOnline = order.orderSource === "Online";
              const isTakeaway = !isOnline && !order.table;

              return (
                <button
                  key={order._id}
                  type="button"
                  onClick={() => handleSelect(order)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition ${
                    isClean ? "hover:bg-slate-50 text-slate-900" : "hover:bg-[#2a2a2a] text-[#f5f5f5]"
                  }`}
                >
                  <span className="bg-amber-500 text-slate-950 font-black rounded-lg w-8 h-8 flex items-center justify-center text-xs shrink-0">
                    {getAvatarName(order.customerDetails?.name) || "?"}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-xs font-bold truncate ${isClean ? "text-slate-900" : "text-[#f5f5f5]"}`}>
                      {order.customerDetails?.name || "Walk-in Customer"}
                    </span>
                    <span className={`block text-[11px] truncate ${isClean ? "text-slate-500" : "text-[#ababab]"}`}>
                      #{orderId} / {isOnline ? "Online" : isTakeaway ? "Takeaway" : "Dine in"}
                      {order.customerDetails?.phone ? ` · ${order.customerDetails.phone}` : ""}
                    </span>
                  </span>
                  <span className={`text-xs font-bold font-mono shrink-0 ${isClean ? "text-slate-900" : "text-[#ababab]"}`}>
                    Rs {order.bills?.totalWithTax?.toFixed(0) ?? "0"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}

      {printOrder && (
        <Invoice orderInfo={printOrder} setShowInvoice={() => setPrintOrder(null)} />
      )}
    </div>
  );
};

export default OrderSearch;
