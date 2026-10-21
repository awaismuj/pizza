import useNow from "../../hooks/useNow";
import { TONES, getPrepState, orderLabel } from "../../utils/prepTimer";

// Live countdown pill for one order, e.g. "#…001 | 14:32 remaining".
// Colour: green > 10 min, yellow <= 10, orange <= 5, red once overdue.
// Renders nothing for orders without a timer (legacy orders) and for orders
// that are no longer being prepared, so it is safe to drop on any order card.
const PrepBadge = ({ order, showNumber = false, className = "" }) => {
  const now = useNow();
  const st = getPrepState(order, now);
  if (st.phase === "none") return null;
  const tone = TONES[st.tone];

  if (st.phase === "ready") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
        style={{ color: tone.text, background: tone.bg, borderColor: tone.border }}
      >
        <span aria-hidden>✅</span>
        {showNumber && <span className="tabular-nums">#{orderLabel(order)} |</span>}
        Ready{st.late === true ? " (late)" : st.late === false ? " · on time" : ""}
      </span>
    );
  }

  return (
    <span
      role="timer"
      aria-label={st.text}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${st.overdue ? "prep-pulse" : ""} ${className}`}
      style={{ color: tone.text, background: tone.bg, borderColor: tone.border, "--pulse": tone.bg }}
    >
      <span aria-hidden>{st.overdue ? "⏰" : "🍕"}</span>
      {showNumber && <span>#{orderLabel(order)} |</span>}
      <span>{st.text}</span>
    </span>
  );
};

export default PrepBadge;
