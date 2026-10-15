import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaHistory } from "react-icons/fa";
import Modal from "../shared/Modal";
import { getDeletedOrders } from "../../https";
import { formatCurrency } from "../../utils/orderMetrics";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

// Admin-only audit trail: every order that's ever been deleted, who deleted
// it, what stage it was at, and whether its stock went back to inventory.
// A deleted order is removed from Orders/Online Orders, and its amount
// drops out of daily sales automatically (Daily Profit reads straight from
// the live orders list) — this panel is the permanent record of that.
const DeletedOrdersPanel = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState(todayStr());
  const [to, setTo] = useState(todayStr());

  const { data, isLoading } = useQuery({
    queryKey: ["deletedOrders", from, to],
    queryFn: () => getDeletedOrders({ from, to }),
    enabled: isOpen,
  });

  if (!isAdmin) return null;
  const logs = data?.data?.data ?? [];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-[#ababab] text-sm sm:text-base rounded-lg px-3 sm:px-4 py-2 font-semibold bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#333] shrink-0"
        title="See every order that's been deleted, and who deleted it"
      >
        <FaHistory /> Deleted Orders
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Deleted order history">
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <label className="flex flex-col text-xs text-[#ababab] gap-1">
              From
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-[#262626] text-[#f5f5f5] rounded-lg px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col text-xs text-[#ababab] gap-1">
              To
              <input
                type="date"
                value={to}
                min={from}
                max={todayStr()}
                onChange={(e) => setTo(e.target.value)}
                className="bg-[#262626] text-[#f5f5f5] rounded-lg px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>

          {isLoading ? (
            <p className="text-[#ababab] text-sm">Loading…</p>
          ) : logs.length === 0 ? (
            <p className="text-[#ababab] text-sm">No orders were deleted in this period.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {logs.map((log) => (
                <div key={log._id} className="rounded-lg border border-[#333] bg-[#262626] p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[#f5f5f5] font-semibold">
                      #{log.orderNumber || String(log.originalOrderId || "").slice(-6).toUpperCase()}
                      <span className="ml-2 text-xs font-normal text-[#ababab]">
                        {log.orderSource === "Online" ? "Online" : "Dine-in / Takeaway"}
                      </span>
                    </span>
                    <span className="text-[#e6402e] font-semibold text-sm">
                      {formatCurrency(log.bills?.totalWithTax)}
                    </span>
                  </div>

                  <p className="text-xs text-[#ababab] mt-1">
                    Was at <span className="text-[#f5f5f5] font-medium">{log.statusAtDelete}</span> when deleted
                    {log.customerDetails?.name ? ` · ${log.customerDetails.name}` : ""}
                  </p>

                  <p className="text-xs text-[#ababab] mt-1">
                    Deleted by{" "}
                    <span className="text-[#f5f5f5] font-medium">
                      {log.deletedBy?.name || "Unknown"} ({log.deletedBy?.role || "—"})
                    </span>{" "}
                    on {new Date(log.deletedAt).toLocaleString("en-GB")}
                  </p>

                  <p className="text-xs mt-1">
                    Stock:{" "}
                    <span className={log.stockReturned ? "text-[#34c76f]" : "text-[#ababab]"}>
                      {log.stockReturned
                        ? "returned to inventory"
                        : "none was deducted for this order"}
                    </span>
                  </p>

                  {log.items?.length > 0 && (
                    <p className="text-xs text-[#ababab] mt-2">
                      {log.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DeletedOrdersPanel;
