import { useNavigate } from "react-router-dom";
import { MdTableBar, MdDeliveryDining, MdOutlineReorder } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";

const ACTIONS = [
  { label: "Dine-in", hint: "Pick a table", to: "/tables", icon: <MdTableBar />, tint: "text-[#f6b100] bg-[#f6b100]/15" },
  { label: "Takeaway", hint: "Counter order", to: "/outdoor", icon: <FaShoppingBag />, tint: "text-[#02ca3a] bg-[#02ca3a]/15" },
  { label: "Online", hint: "Website orders", to: "/online-orders", icon: <MdDeliveryDining />, tint: "text-[#5aa0ff] bg-[#2f7de1]/15" },
  { label: "All orders", hint: "History & edits", to: "/orders", icon: <MdOutlineReorder />, tint: "text-[#d6a8ff] bg-[#a855f7]/15" },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <aside
      aria-label="Quick actions"
      className="rounded-2xl border border-[#2b2b2b] bg-[#1a1a1a] p-3 lg:sticky lg:top-24 lg:p-4"
    >
      <p className="mb-3 hidden px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f6b100] lg:block">Quick actions</p>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-1.5">
        {ACTIONS.map((action) => (
          <button
            key={action.to}
            type="button"
            onClick={() => navigate(action.to)}
            className="group flex items-center gap-3 rounded-xl border border-transparent p-2 text-left transition-colors hover:border-[#f6b100]/40 hover:bg-[#222] sm:p-2.5"
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl lg:h-11 lg:w-11 ${action.tint}`}>{action.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#f5f5f5]">{action.label}</span>
              <span className="block truncate text-xs text-[#7a7a7a]">{action.hint}</span>
            </span>
            <MdChevronRight className="hidden shrink-0 text-lg text-[#555] transition-colors group-hover:text-[#f6b100] lg:block" />
          </button>
        ))}
      </div>
    </aside>
  );
};

export default QuickActions;
