const ACCENTS = {
  green: { tile: "bg-[#02ca3a]/15 text-[#02ca3a]", line: "#02ca3a" },
  gold: { tile: "bg-[#f6b100]/15 text-[#f6b100]", line: "#f6b100" },
  blue: { tile: "bg-[#2f7de1]/15 text-[#5aa0ff]", line: "#5aa0ff" },
  red: { tile: "bg-[#e6402e]/15 text-[#ff6b5b]", line: "#ff6b5b" },
};

const Sparkline = ({ values, color }) => {
  const max = Math.max(...values, 1);
  const step = 100 / (values.length - 1);
  const points = values.map((v, i) => `${(i * step).toFixed(2)},${(26 - (v / max) * 24).toFixed(2)}`).join(" ");
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="hidden h-6 w-14 shrink-0 sm:block lg:w-12 2xl:w-16" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

// Compact tile, same footprint as the quick-action buttons.
// `change` is a % vs yesterday; pass undefined to hide the trend pill.
const MiniCard = ({ title, icon, value, hint, change, accent = "gold", spark }) => {
  const tone = ACCENTS[accent] || ACCENTS.gold;
  const hasChange = typeof change === "number";
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#2b2b2b] bg-[#1a1a1a] p-2.5 sm:gap-3 sm:p-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg sm:h-10 sm:w-10 sm:text-xl ${tone.tile}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium text-[#9a9a9a] sm:text-xs">{title}</p>
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-base font-bold tabular-nums leading-tight text-[#f5f5f5] sm:text-lg">{value}</p>
          {hasChange && (
            <span className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold ${change < 0 ? "bg-[#e6402e]/15 text-[#ff6b5b]" : "bg-[#02ca3a]/15 text-[#02ca3a]"}`}>
              {change > 0 ? "+" : ""}{change}%
            </span>
          )}
        </div>
        <p className="truncate text-[10px] text-[#7a7a7a] sm:text-[11px]">{hint}</p>
      </div>
      {spark && spark.some((v) => v > 0) && <Sparkline values={spark} color={tone.line} />}
    </div>
  );
};

export default MiniCard;
