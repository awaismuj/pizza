<<<<<<< HEAD
import React from "react";
import { MdLanguage } from "react-icons/md";
import { getAvatarName } from "../../utils/index";
import { STAGE_LABELS, statusPillClass } from "../../utils/orderStages";
import { useUITheme } from "../../context/UIThemeContext";

const OrderList = ({ order }) => {
  const { isClean } = useUITheme();

  return (
    <div
      className={`mb-2.5 flex items-center gap-3 rounded-xl p-3 sm:gap-4 transition duration-150 ${
        isClean
          ? "bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
          : "bg-slate-950/70 border border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-sm font-black text-slate-950 shadow-xs">
        {getAvatarName(order.customerDetails.name)}
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
        <div className="min-w-0 flex-1">
          <h4
            className={`truncate text-sm font-extrabold leading-tight ${
              isClean ? "text-slate-900" : "text-white"
            }`}
          >
            {order.customerDetails.name}
          </h4>
          <p className={`text-xs mt-0.5 ${isClean ? "text-slate-500 font-medium" : "text-slate-400"}`}>
            {order.items.length} {order.items.length === 1 ? "Item" : "Items"} •{" "}
            <span className={`font-mono font-bold ${isClean ? "text-slate-900" : "text-slate-300"}`}>
              Rs {order.bills.totalWithTax.toFixed(0)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {order.orderSource === "Online" ? (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${
                isClean
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <MdLanguage size={12} />
              <span>Online</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${
                isClean
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400"
              }`}
            >
              Table {order.table?.tableNo ?? "—"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusPillClass(
              order.orderStatus
            )}`}
          >
            {STAGE_LABELS[order.orderStatus] || order.orderStatus}
          </span>
        </div>
=======
import { FaCircle } from "react-icons/fa";
import { getAvatarName, getOrderNumber } from "../../utils/index";
import { STAGE_LABELS, statusPillClass } from "../../utils/orderStages";
import { formatCurrency, orderItemCount, orderTotal } from "../../utils/orderMetrics";
import { I } from "../shared/AppIcons";

const timeOf = (order) =>
  new Date(order.orderDate || order.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const OrderList = ({ order }) => {
  const isOnline = order.orderSource === "Online";
  const items = orderItemCount(order) || order.items?.length || 0;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-[#2b2b2b] bg-[#1f1f1f] p-3 transition-colors hover:border-[#3a3a3a]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f6b100] text-sm font-bold text-[#1f1f1f]">
        {getAvatarName(order.customerDetails?.name).slice(0, 2) || "?"}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#f5f5f5] sm:text-base">{order.customerDetails?.name || "Walk-in customer"}</p>
        <p className="truncate text-xs text-[#8a8a8a]">
          #{getOrderNumber(order)} · {timeOf(order)} · {items} item{items === 1 ? "" : "s"}
        </p>
>>>>>>> origin/main
      </div>

      <span
        className={`hidden shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold sm:inline-flex ${
          isOnline ? "border-[#2f7de1]/60 text-[#5aa0ff]" : "border-[#f6b100]/50 text-[#f6b100]"
        }`}
      >
        {isOnline ? <><I.Cart /> Online</> : order.table?.tableNo ? `Table ${order.table.tableNo}` : "Takeaway"}
      </span>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="text-sm font-bold tabular-nums text-[#f5f5f5]">Rs {formatCurrency(orderTotal(order))}</p>
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium sm:text-xs ${statusPillClass(order.orderStatus)}`}>
          <FaCircle className="text-[6px]" /> {STAGE_LABELS[order.orderStatus] || order.orderStatus}
        </span>
      </div>
    </li>
  );
};

export default OrderList;

