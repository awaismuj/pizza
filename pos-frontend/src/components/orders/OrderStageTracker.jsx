import React from "react";
import { FaCheck } from "react-icons/fa";
import { stagesFor, STAGE_LABELS } from "../../utils/orderStages";
import { formatTime } from "../../utils/index";

// Shows where an order is in its life: done stages are ticked, the current
// stage is highlighted, the rest are greyed out, and each stage the order
// has actually reached gets the time it got there right underneath - when
// it came in, when it went to processing, when it was ready, when it was
// completed/delivered. A cancelled order shows a single red badge instead.
const OrderStageTracker = ({ order }) => {
  const stages = stagesFor(order);
  const status = order.orderStatus;

  if (status === "Cancelled") {
    return (
      <div className="mt-4 rounded-lg bg-[#3b1d1d] px-3 py-2 text-center text-sm font-semibold text-red-500">
        Order cancelled — stock returned to inventory
      </div>
    );
  }

  const currentIndex = Math.max(0, stages.indexOf(status));
  const isFinished = currentIndex === stages.length - 1;

  // The most recent time the order actually entered a given stage, from
  // its history. Orders placed before this tracking existed won't have
  // history yet, so the very first stage falls back to orderDate (which
  // every order has) rather than showing nothing.
  const timeForStage = (stage, index) => {
    const entries = (order.statusHistory || []).filter((h) => h.status === stage);
    if (entries.length > 0) return entries[entries.length - 1].at;
    if (index === 0) return order.orderDate;
    return null;
  };

  return (
    <ol className="mt-4 flex items-start" aria-label="Order progress">
      {stages.map((stage, index) => {
        const done = index < currentIndex || (isFinished && index === currentIndex);
        const current = index === currentIndex && !isFinished;
        const stageTime = timeForStage(stage, index);

        return (
          <li key={stage} className="relative flex flex-1 flex-col items-center text-center">
            {index > 0 && (
              <span
                className={`absolute right-1/2 top-[11px] h-[2px] w-full ${
                  index <= currentIndex ? "bg-[#02ca3a]" : "bg-[#3a3a3a]"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                done
                  ? "bg-[#02ca3a] text-[#1f1f1f]"
                  : current
                  ? "bg-[#f6b100] text-[#1f1f1f] ring-4 ring-[#f6b100]/25"
                  : "bg-[#3a3a3a] text-[#8a8a8a]"
              }`}
            >
              {done ? <FaCheck size={10} /> : index + 1}
            </span>
            <span
              className={`mt-1 text-[10px] leading-tight sm:text-xs ${
                current ? "font-semibold text-[#f6b100]" : done ? "text-[#02ca3a]" : "text-[#6b6b6b]"
              }`}
            >
              {STAGE_LABELS[stage]}
            </span>
            {stageTime && (
              <span className="text-[9px] leading-tight text-[#6b6b6b]">{formatTime(stageTime)}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStageTracker;
