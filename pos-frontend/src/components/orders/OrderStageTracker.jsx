import React from "react";
import { FaCheck } from "react-icons/fa";
import { stagesFor, STAGE_LABELS } from "../../utils/orderStages";
import { formatTime } from "../../utils/index";
import { useUITheme } from "../../context/UIThemeContext";

const OrderStageTracker = ({ order }) => {
  const { isClean } = useUITheme();
  const stages = stagesFor(order);
  const status = order.orderStatus === "Closed" ? "Completed" : order.orderStatus;

  if (status === "Cancelled") {
    return (
      <div className={`mt-3 rounded-xl px-3 py-2 text-center text-xs font-bold border ${
        isClean
          ? "bg-rose-50 border-rose-200 text-rose-700"
          : "bg-rose-950/40 border-rose-900/60 text-rose-400"
      }`}>
        Order cancelled — stock returned to inventory
      </div>
    );
  }

  const currentIndex = Math.max(0, stages.indexOf(status));
  const isFinished = currentIndex === stages.length - 1;

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
