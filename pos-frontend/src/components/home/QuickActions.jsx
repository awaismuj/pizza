import { useNavigate } from "react-router-dom";
import { MdTableBar, MdDeliveryDining, MdOutlineReorder } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";

const ACTIONS = [
  { label: "Dine-in", hint: "Pick a table", to: "/tables", icon: <MdTableBar />, tint: "text-[#f6b100] bg-[#f6b100]/15" },
  { label: "Takeaway", hint: "Counter order", to: "/outdoor", icon: <FaShoppingBag />, tint: "text-[#02ca3a] bg-[#02ca3a]/15" },
  { label: "Online", hint: "Website orders", to: "/online-orders", icon: <MdDeliveryDining />, tint: "text-[#5aa0ff] bg-[#2f7de1]/15" },
  { label: "All orders", hint: "History & edits", to: "/orders", icon: <MdOutlineReorder />, tint: "text-[#d6a8ff] bg-[#a855f7]/15" },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <section aria-label="Quick actions" className="grid grid-cols-2 gap-3 lg:sticky lg:top-24 lg:grid-cols-1 lg:gap-2.5">
      {ACTIONS.map((action) => (
        <button
          key={action.to}
          type="button"
          onClick={() => navigate(action.to)}
          className="group flex items-center gap-3 rounded-2xl border border-[#2b2b2b] bg-[#1a1a1a] p-3 text-left transition-colors hover:border-[#f6b100]/60 hover:bg-[#222] sm:p-4"
        >
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${action.tint}`}>{action.icon}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#f5f5f5]">{action.label}</span>
            <span className="block truncate text-xs text-[#7a7a7a]">{action.hint}</span>
          </span>
        </button>
      ))}
    </section>
  );
};

export default QuickActions;
