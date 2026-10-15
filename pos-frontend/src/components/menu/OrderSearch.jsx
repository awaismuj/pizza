import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { getOrders } from "../../https";
import { getAvatarName, getOrderNumber } from "../../utils";
import Invoice from "../invoice/Invoice";

// Search past orders by order #, mobile number, or customer name. Selecting
// a result opens its invoice for review; it only prints when the person
// clicks "Print Receipt" inside that invoice, same as any other receipt.
const OrderSearch = () => {
  const [query, setQuery] = useState("");
  const [printOrder, setPrintOrder] = useState(null);

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
    // Opens the invoice for review — it does NOT print automatically.
    // Printing only happens when the "Print Receipt" button inside the
    // invoice itself is clicked (same component used for a normal
    // paid-order receipt).
    setPrintOrder(order);
    setQuery("");
  };

  return (
    <div className="px-4 pt-3 relative">
      <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-[#f6b100]">
        <FaSearch className="text-[#767676] text-sm shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order # / mobile / name"
          className="bg-transparent flex-1 text-white text-sm outline-none placeholder:text-[#767676] min-w-0"
        />
      </div>

      {query.trim() && (
        <div className="absolute z-20 left-4 right-4 mt-1 bg-[#1f1f1f] rounded-lg shadow-lg max-h-64 overflow-y-auto border border-[#2a2a2a]">
          {results.length === 0 ? (
            <p className="text-[#767676] text-xs px-3 py-3">No matching orders.</p>
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
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] text-left"
                >
                  <span className="bg-[#f6b100] text-[#1f1f1f] font-bold rounded-lg w-8 h-8 flex items-center justify-center text-sm shrink-0">
                    {getAvatarName(order.customerDetails?.name) || "?"}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-[#f5f5f5] truncate">
                      {order.customerDetails?.name || "Walk-in Customer"}
                    </span>
                    <span className="block text-xs text-[#ababab] truncate">
                      #{orderId} / {isOnline ? "Online" : isTakeaway ? "Takeaway" : "Dine in"}
                      {order.customerDetails?.phone ? ` · ${order.customerDetails.phone}` : ""}
                    </span>
                  </span>
                  <span className="text-xs text-[#ababab] shrink-0">
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
