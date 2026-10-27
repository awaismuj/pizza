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

