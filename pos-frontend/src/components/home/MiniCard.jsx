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
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="mt-3 h-8 w-full" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

// `change` is a % vs yesterday; pass undefined to hide the trend pill.
const MiniCard = ({ title, icon, value, hint, change, accent = "gold", spark }) => {
  const tone = ACCENTS[accent] || ACCENTS.gold;
  const hasChange = typeof change === "number";
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-[#2b2b2b] bg-[#1a1a1a] p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-[#9a9a9a]">{title}</p>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg ${tone.tile}`}>{icon}</span>
      </div>
      <p className="mt-2.5 truncate text-xl font-bold tabular-nums text-[#f5f5f5] sm:text-2xl">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {hasChange && (
          <span className={`rounded-full px-2 py-0.5 font-semibold ${change < 0 ? "bg-[#e6402e]/15 text-[#ff6b5b]" : "bg-[#02ca3a]/15 text-[#02ca3a]"}`}>
            {change > 0 ? "+" : ""}{change}%
          </span>
        )}
        <span className="truncate text-[#7a7a7a]">{hint}</span>
      </div>
      {spark && spark.some((v) => v > 0) && <Sparkline values={spark} color={tone.line} />}
    </div>
  );
};

export default MiniCard;
