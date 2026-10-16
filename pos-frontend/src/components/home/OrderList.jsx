import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";
import { STAGE_LABELS, statusPillClass } from "../../utils/orderStages";

const OrderList = ({ key, order }) => {
  return (
    <div className="mb-2.5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 p-3 sm:gap-4 transition">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-sm font-extrabold text-slate-950 shadow-md">
        {getAvatarName(order.customerDetails.name)}
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-white leading-tight">
            {order.customerDetails.name}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {order.items.length} {order.items.length === 1 ? "Item" : "Items"} •{" "}
            <span className="font-mono text-slate-300">Rs {order.bills.totalWithTax.toFixed(0)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {order.orderSource === "Online" ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
              🌐 Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
              Table {order.table?.tableNo ?? "—"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusPillClass(order.orderStatus)}`}>
            {STAGE_LABELS[order.orderStatus] || order.orderStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
