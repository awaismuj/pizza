import React from 'react';
import { useUITheme } from "../../context/UIThemeContext";

const MiniCard = ({ title, icon, number, footerNum }) => {
  const { isClean } = useUITheme();
  const isPositive = footerNum >= 0;

  return (
    <div
      className={`w-full rounded-2xl p-5 sm:p-6 md:w-1/2 transition duration-200 ${
        isClean
          ? "bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300"
          : "bg-slate-900/90 border border-slate-800 shadow-xl hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isClean ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Realtime KPI
          </span>
          <h2
            className={`text-base font-extrabold sm:text-lg mt-0.5 ${
              isClean ? "text-slate-900" : "text-white"
            }`}
          >
            {title}
          </h2>
        </div>
        <div
          className={`rounded-xl p-3 text-xl shadow-xs transition ${
            title === "Total Earnings"
              ? isClean
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : isClean
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3
          className={`text-2xl font-black sm:text-3xl md:text-4xl tracking-tight font-mono ${
            isClean ? "text-slate-900" : "text-white"
          }`}
        >
          {title === "Total Earnings" ? `Rs ${number}` : number}
        </h3>
        <p
          className={`mt-2 text-xs sm:text-sm flex items-center gap-1.5 font-medium ${
            isClean ? "text-slate-600" : "text-slate-400"
          }`}
        >
          <span
            className={`font-bold px-2 py-0.5 rounded-md text-xs border ${
              isPositive
                ? isClean
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : isClean
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {isPositive ? "+" : ""}
            {footerNum}%
          </span>
          <span>vs yesterday benchmark</span>
        </p>
      </div>
    </div>
  );
};

export default MiniCard;