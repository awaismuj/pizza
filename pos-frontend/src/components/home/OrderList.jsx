import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";
import { STAGE_LABELS, statusPillClass } from "../../utils/orderStages";
import { I } from "../shared/AppIcons";

const OrderList = ({ key, order }) => {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-lg border border-[#2b2b2b] bg-[#1f1f1f] p-2 sm:gap-5 sm:p-3">
      <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f6b100] text-sm font-bold text-[#1f1f1f] sm:h-12 sm:w-12 sm:text-xl">
        {getAvatarName(order.customerDetails.name)}
      </button>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-wide text-[#f5f5f5] sm:text-lg">
            {order.customerDetails.name}
          </h1>
          <p className="text-xs text-[#ababab] sm:text-sm">{order.items.length} Items</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {order.orderSource === "Online" ? (
            <h1 className="inline-flex items-center gap-1 rounded-lg border border-[#025cca] p-1 text-[11px] font-semibold text-[#025cca] sm:text-xs">
              <I.Cart className="inline mr-1" />Online
            </h1>
          ) : (
            <h1 className="inline-flex items-center gap-1 rounded-lg border border-[#f6b100] p-1 text-[11px] font-semibold text-[#f6b100] sm:text-xs">
              Table <FaLongArrowAltRight className="text-[#ababab]" /> {order.table?.tableNo ?? "—"}
            </h1>
          )}
        </div>

        <div className="flex items-center justify-end">
          <p className={`rounded-lg px-2 py-1 text-[10px] font-medium sm:text-xs ${statusPillClass(order.orderStatus)}`}>
            <FaCircle className="mr-1 inline" /> {STAGE_LABELS[order.orderStatus] || order.orderStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
