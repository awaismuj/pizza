import PrepBadge from "./PrepBadge";
import ChefMascot from "./ChefMascot";
import { ALERT_COPY, orderLabel } from "../../utils/prepTimer";

// Each level looks different: colour, mascot mood and copy.
export const ALERT_STYLE = {
  warn1: { mood: "happy", from: "#2b2410", to: "#1f1f1f", accent: "#facc15", chip: "10 MIN LEFT" },
  warn2: { mood: "excited", from: "#33200f", to: "#1f1f1f", accent: "#fb923c", chip: "5 MIN LEFT" },
  warn3: { mood: "alarm", from: "#3a1c14", to: "#1f1f1f", accent: "#f97316", chip: "2 MIN LEFT" },
  overdue: { mood: "oops", from: "#3b1616", to: "#1f1f1f", accent: "#ef4444", chip: "OVERDUE" },
};

// Presentational popup card (no data fetching) so the same markup is used by
// the live alerts and by the "preview" in Order Prep settings.
const PrepAlertCard = ({ level, order, queueCount = 0, soundOn, onToggleSound, onClose, onView, onExtend, preview = false }) => {
  const style = ALERT_STYLE[level] || ALERT_STYLE.warn1;
  const copy = (ALERT_COPY[level] || ALERT_COPY.warn1)(orderLabel(order));

  return (
    <div
      role="status"
      aria-live="polite"
      className="chef-pop relative overflow-hidden rounded-2xl border shadow-2xl shadow-black/50"
      style={{ borderColor: `${style.accent}88`, background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: style.accent }} />
      <div className="flex items-start gap-2 p-3 pl-4 sm:gap-3 sm:p-4 sm:pl-5">
        <div className="shrink-0 pt-1">
          <ChefMascot mood={style.mood} size={84} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wider" style={{ background: `${style.accent}26`, color: style.accent }}>
              {preview ? "PREVIEW · " : ""}{style.chip}
            </span>
            <div className="-mr-1 -mt-1 flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleSound}
                aria-pressed={soundOn}
                aria-label={soundOn ? "Mute alert sounds" : "Turn alert sounds on"}
                title={soundOn ? "Sound on - click to mute" : "Sound off - click to turn on"}
                className="grid h-7 w-7 place-items-center rounded-lg text-sm text-[#cfcfcf] hover:bg-white/10"
              >
                {soundOn ? "🔔" : "🔕"}
              </button>
              <button type="button" onClick={onClose} aria-label="Close alert" className="grid h-7 w-7 place-items-center rounded-lg text-base font-bold text-[#cfcfcf] hover:bg-white/10">
                ✕
              </button>
            </div>
          </div>

          <p className="mt-1 text-sm font-extrabold leading-snug text-[#f5f5f5]">{copy.title}</p>
          <p className="text-sm leading-snug text-[#e4e4e4]">{copy.body}</p>
          {copy.detail && <p className="text-sm font-semibold leading-snug" style={{ color: style.accent }}>{copy.detail}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PrepBadge order={order} />
            {!preview && onView && (
              <button type="button" onClick={onView} className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-[#f5f5f5] hover:bg-white/15">
                View order
              </button>
            )}
            {!preview && onExtend && (
              <button type="button" onClick={onExtend} className="rounded-lg border px-2.5 py-1 text-xs font-bold hover:bg-white/10" style={{ borderColor: `${style.accent}88`, color: style.accent }}>
                Extend time
              </button>
            )}
            {queueCount > 0 && <span className="text-[11px] text-[#9a9a9a]">+{queueCount} more</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepAlertCard;
