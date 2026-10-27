import React from "react";
import { FaCheck } from "react-icons/fa";
import { NEXT_ACTION, stagesFor, STAGE_LABELS } from "../../utils/orderStages";
import { formatTime } from "../../utils/index";
import { useUITheme } from "../../context/UIThemeContext";

<<<<<<< HEAD
const OrderStageTracker = ({ order }) => {
  const { isClean } = useUITheme();
=======
// Shows where an order is in its life: done stages are ticked, the current
// stage is highlighted, the rest are greyed out, and each stage the order
// has actually reached gets the time it got there right underneath - when
// it came in, when it went to processing, when it was ready, when it was
// completed/delivered. A cancelled order shows a single red badge instead.
const OrderStageTracker = ({ order, onAdvance, isAdvancing = false }) => {
>>>>>>> origin/main
  const stages = stagesFor(order);
  const status = order.orderStatus;

  if (status === "Cancelled") {
    return (
<<<<<<< HEAD
      <div className={`mt-3 rounded-xl px-3 py-2 text-center text-xs font-bold border ${
        isClean
          ? "bg-rose-50 border-rose-200 text-rose-700"
          : "bg-rose-950/40 border-rose-900/60 text-rose-400"
      }`}>
        Order cancelled — stock returned to inventory
=======
      <div className="mt-4 rounded-lg bg-[#3b1d1d] px-3 py-2 text-center text-sm font-semibold text-red-500">
        {order.paymentStatus === "Rejected"
          ? `Payment rejected${order.jazzcash?.rejectionReason ? `: ${order.jazzcash.rejectionReason}` : ""}`
          : "Order cancelled — stock returned to inventory"}
>>>>>>> origin/main
      </div>
    );
  }

  const currentIndex = Math.max(0, stages.indexOf(status));
  const isFinished = currentIndex === stages.length - 1;
  const nextStage = NEXT_ACTION[status]?.to;

  const timeForStage = (stage, index) => {
    const entries = (order.statusHistory || []).filter((h) => h.status === stage);
    if (entries.length > 0) return entries[entries.length - 1].at;
    if (index === 0) return order.orderDate;
    return null;
  };

  return (
    <ol className="mt-3 flex items-start" aria-label="Order progress">
      {stages.map((stage, index) => {
        const done = index < currentIndex || (isFinished && index === currentIndex);
        const current = index === currentIndex && !isFinished;
        const stageTime = timeForStage(stage, index);

        return (
          <li key={stage} className="relative flex flex-1 flex-col items-center text-center">
            {index > 0 && (
              <span
<<<<<<< HEAD
                className={`absolute right-1/2 top-[11px] h-[2px] w-full transition-colors ${
                  index <= currentIndex
                    ? "bg-emerald-500"
                    : isClean
                    ? "bg-slate-200"
                    : "bg-slate-700"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition ${
                done
                  ? "bg-emerald-500 text-white shadow-xs"
                  : current
                  ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/25 shadow-xs"
                  : isClean
                  ? "bg-slate-100 text-slate-400 border border-slate-200"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {done ? <FaCheck size={9} /> : index + 1}
            </span>
            <span
              className={`mt-1 text-[10px] font-bold leading-tight sm:text-[11px] ${
                current
                  ? "text-amber-600 dark:text-amber-400 font-extrabold"
                  : done
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : isClean
                  ? "text-slate-400"
                  : "text-slate-500"
=======
                className={`absolute right-1/2 top-[15px] h-[2px] w-full ${
                  index <= currentIndex ? "bg-[#02ca3a]" : "bg-[#3a3a3a]"
                }`}
              />
            )}
            {onAdvance && stage === nextStage ? (
              <button
                type="button"
                onClick={() => onAdvance(stage)}
                disabled={isAdvancing}
                aria-label={`Move order to ${STAGE_LABELS[stage]}`}
                title={`Move to ${STAGE_LABELS[stage]}`}
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#3a3a3a] text-xs font-bold text-[#f5f5f5] ring-2 ring-[#f6b100] transition hover:bg-[#f6b100] hover:text-[#1f1f1f] disabled:cursor-wait disabled:opacity-50"
              >
                {index + 1}
              </button>
            ) : (
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${
                  done
                    ? "bg-[#02ca3a] text-[#1f1f1f]"
                    : current
                    ? "bg-[#f6b100] text-[#1f1f1f] ring-4 ring-[#f6b100]/25"
                    : "bg-[#3a3a3a] text-[#8a8a8a]"
                }`}
              >
                {done ? <FaCheck size={10} /> : index + 1}
              </span>
            )}
            <span
              className={`mt-1 text-[10px] leading-tight sm:text-xs ${
                current || stage === nextStage
                  ? "font-semibold text-[#f6b100]"
                  : done
                  ? "text-[#02ca3a]"
                  : "text-[#6b6b6b]"
>>>>>>> origin/main
              }`}
            >
              {STAGE_LABELS[stage]}
            </span>
            {stageTime && (
              <span className={`text-[9px] leading-tight ${isClean ? "text-slate-400" : "text-slate-500"}`}>
                {formatTime(stageTime)}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStageTracker;
