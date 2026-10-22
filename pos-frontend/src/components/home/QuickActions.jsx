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
    <section aria-label="Quick actions" className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {ACTIONS.map((action) => (
        <button
          key={action.to}
          type="button"
          onClick={() => navigate(action.to)}
          className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-[#2b2b2b] bg-[#1a1a1a] p-2.5 text-left transition-colors hover:border-[#f6b100]/60 hover:bg-[#222] sm:gap-3 sm:p-3"
        >
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg sm:h-10 sm:w-10 sm:text-xl ${action.tint}`}>{action.icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#f5f5f5]">{action.label}</span>
            <span className="block truncate text-[11px] text-[#7a7a7a] sm:text-xs">{action.hint}</span>
          </span>
          <MdChevronRight className="hidden shrink-0 text-lg text-[#555] transition-colors group-hover:text-[#f6b100] sm:block" />
        </button>
      ))}
    </section>
  );
};

export default QuickActions;
