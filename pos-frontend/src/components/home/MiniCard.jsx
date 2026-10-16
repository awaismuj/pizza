import React from 'react'

const MiniCard = ({ title, icon, number, footerNum }) => {
  const isPositive = footerNum >= 0;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl md:w-1/2 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Realtime KPI
          </span>
          <h2 className="text-base font-bold text-white sm:text-lg mt-0.5">
            {title}
          </h2>
        </div>
        <div
          className={`rounded-xl p-3 text-xl shadow-md ${
            title === "Total Earnings"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl tracking-tight font-mono">
          {title === "Total Earnings" ? `Rs ${number}` : number}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 font-medium">
          <span
            className={`font-bold px-1.5 py-0.5 rounded text-xs ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
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

export default MiniCard