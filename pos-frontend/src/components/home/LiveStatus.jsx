import { STAGE_LABELS } from "../../utils/orderStages";

const ORDER = ["Pending", "Payment Pending Verification", "Accepted", "In Progress", "Preparing", "Ready", "Ready to Deliver"];
const COLORS = {
  Pending: "#fb923c",
  "Payment Pending Verification": "#fb923c",
  Accepted: "#facc15",
  "In Progress": "#f6b100",
  Preparing: "#f6b100",
  Ready: "#02ca3a",
  "Ready to Deliver": "#02ca3a",
};

const LiveStatus = ({ stageCounts = {}, total = 0, cancelledToday = 0 }) => {
  // Stages that staff see under one name (e.g. "In Progress" and "Preparing"
  // are both "Processing") are merged into a single row.
  const grouped = new Map();
  ORDER.filter((stage) => stageCounts[stage]).forEach((stage) => {
    const label = STAGE_LABELS[stage] || stage;
    const current = grouped.get(label) || { label, count: 0, color: COLORS[stage] };
    current.count += stageCounts[stage];
    grouped.set(label, current);
  });
  const rows = [...grouped.values()];
  return (
    <section className="rounded-2xl border border-[#2b2b2b] bg-[#1a1a1a] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#f5f5f5]">Live kitchen status</h2>
        <span className="flex items-center gap-1.5 text-xs text-[#7a7a7a]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#02ca3a]" /> Live
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums text-[#f5f5f5]">{total}</p>
      <p className="text-xs text-[#7a7a7a]">orders being worked on</p>

      {rows.length === 0 ? (
        <p className="mt-5 rounded-xl bg-[#222] px-3 py-4 text-center text-sm text-[#8a8a8a]">The kitchen is clear — no open orders.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map(({ label, count, color }) => (
            <li key={label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-[#cfcfcf]">{label}</span>
                <span className="font-semibold tabular-nums text-[#f5f5f5]">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#2b2b2b]">
                <div className="h-full rounded-full" style={{ width: `${Math.max(6, (count / total) * 100)}%`, backgroundColor: color }} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {cancelledToday > 0 && <p className="mt-4 border-t border-[#2b2b2b] pt-3 text-xs text-[#8a8a8a]">{cancelledToday} cancelled today</p>}
    </section>
  );
};

export default LiveStatus;
