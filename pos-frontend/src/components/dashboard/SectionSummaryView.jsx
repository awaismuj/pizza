import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LuBoxes,
  LuBuilding2,
  LuUtensils,
  LuFolderTree,
  LuFlame,
  LuSlidersHorizontal,
  LuImage,
  LuReceipt,
  LuTrendingUp,
  LuCreditCard,
  LuLayoutGrid,
  LuUsers,
  LuSettings,
  LuMusic,
  LuArrowRight,
  LuPlus,
} from "react-icons/lu";
import { BiSolidDish } from "react-icons/bi";
import { MdCategory } from "react-icons/md";

/**
 * SectionSummaryView
 * Displays an executive overview hub of all child navigation items
 * when a user clicks any parent nav item in the sidebar.
 */
const SectionSummaryView = ({
  tabKey,
  onOpenModal,
  dishes = [],
  categories = [],
  inventoryItems = [],
  lowStockCount = 0,
  orders = [],
}) => {
  const navigate = useNavigate();

  // 1. Inventory & Stock Summary Hub
  if (tabKey === "Inventory_Summary") {
    const outOfStockCount = inventoryItems.filter((i) => i.quantity <= 0).length;
    const inStockCount = inventoryItems.filter(
      (i) => i.quantity > (i.reorderLevel || 0)
    ).length;

    const cards = [
      {
        title: "Stock Balance Ledger",
        icon: <LuBoxes className="text-amber-500" size={24} />,
        bgIcon: "bg-amber-500/10",
        desc: "Live inventory of all raw ingredients, supplies, packaging, and automatic recipe deduction tracking.",
        metric: `${inventoryItems.length} Tracked SKUs`,
        subMetric: lowStockCount > 0 ? `${lowStockCount} below reorder level` : "All items healthy",
        subMetricClass: lowStockCount > 0 ? "text-rose-500 font-bold" : "text-emerald-500 font-medium",
        actionText: "Open Stock Ledger",
        to: "/dashboard?tab=Inventory",
      },
      {
        title: "Fixed Assets Register",
        icon: <LuBuilding2 className="text-indigo-500" size={24} />,
        bgIcon: "bg-indigo-500/10",
        desc: "Restaurant capital assets including commercial ovens, refrigeration, POS billing hardware, and tables.",
        metric: "Equipment & Hardware",
        subMetric: "Depreciation & maintenance logs",
        subMetricClass: "text-slate-500 dark:text-slate-400 font-medium",
        actionText: "View Assets Register",
        to: "/dashboard?tab=Assets",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <LuBoxes size={22} />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                    Inventory & Stock Operations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time ingredient balances, inventory replenishment, and fixed asset records
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard?tab=Inventory")}
              className="pos-btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <LuPlus size={15} />
              <span>Manage Inventory</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                Total Stock SKUs
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {inventoryItems.length}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                Optimal Stock
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {inStockCount}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-0.5">
                Low Stock Alerts
              </span>
              <span className="text-lg font-black text-rose-500">
                {lowStockCount}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                Out of Stock
              </span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-300">
                {outOfStockCount}
              </span>
            </div>
          </div>
        </div>

        {/* Child Items Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((c) => (
            <div
              key={c.title}
              onClick={() => navigate(c.to)}
              className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${c.bgIcon} flex items-center justify-center shrink-0`}>
                    {c.icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {c.metric}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className={`text-xs ${c.subMetricClass}`}>
                  {c.subMetric}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  {c.actionText} <LuArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Dishes & Menu Catalog Summary Hub
  if (tabKey === "Menu_Summary") {
    const cards = [
      {
        title: "Dishes & Product List",
        icon: <LuUtensils className="text-amber-500" size={24} />,
        bgIcon: "bg-amber-500/10",
        desc: "Catalog of all culinary items, multiple portion sizes, crust variants, pricing, and ingredients link.",
        metric: `${dishes.length} Dishes`,
        subMetric: `${dishes.filter((d) => d.isInventoryTracked).length} with recipe stock deductions`,
        actionText: "Manage Dishes",
        to: "/dashboard?tab=Menu",
      },
      {
        title: "Food Categories",
        icon: <LuFolderTree className="text-blue-500" size={24} />,
        bgIcon: "bg-blue-500/10",
        desc: "Storefront food sections (Pizza, Burgers, Sides, Beverages) with drag-and-drop sort order.",
        metric: `${categories.length} Categories`,
        subMetric: "Customer storefront navigation",
        actionText: "Manage Categories",
        to: "/dashboard?tab=Categories",
      },
      {
        title: "Deals & Combos",
        icon: <LuFlame className="text-orange-500" size={24} />,
        bgIcon: "bg-orange-500/10",
        desc: "Promotional bundle combos, special bundle pricing, storefront badges, and day-of-week schedules.",
        metric: "Promotional Deals",
        subMetric: "Auto inventory stock decrements",
        actionText: "Manage Deals",
        to: "/dashboard?tab=Deals",
      },
      {
        title: "Custom Deal Builder",
        icon: <LuSlidersHorizontal className="text-purple-500" size={24} />,
        bgIcon: "bg-purple-500/10",
        desc: "Build-your-own deal configurator allowing guests to customize specific pizza flavours, sides, and drinks.",
        metric: "Custom Combo Engine",
        subMetric: "Dynamic customer selections",
        actionText: "Open Deal Builder",
        to: "/dashboard?tab=Build Your Own",
      },
      {
        title: "Storefront Banners",
        icon: <LuImage className="text-emerald-500" size={24} />,
        bgIcon: "bg-emerald-500/10",
        desc: "Hero slider banners, seasonal promotions, and high-impact marketing imagery on the customer menu.",
        metric: "Storefront Showcase",
        subMetric: "Hero carousel slides",
        actionText: "Manage Banners",
        to: "/dashboard?tab=Hero Slider",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <LuUtensils size={22} />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                    Dishes & Menu Catalog Overview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive catalog management: products, categories, combo deals, and banners
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenModal && onOpenModal("category")}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <MdCategory size={15} />
                <span>+ Add Category</span>
              </button>
              <button
                onClick={() => onOpenModal && onOpenModal("dishes")}
                className="pos-btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <BiSolidDish size={16} />
                <span>+ Add Dish</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                Total Dishes
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {dishes.length}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                Food Categories
              </span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                {categories.length}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                Inventory Linked
              </span>
              <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                {dishes.filter((d) => d.isInventoryTracked).length}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                Active Catalog
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                100% Online
              </span>
            </div>
          </div>
        </div>

        {/* Child Items Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div
              key={c.title}
              onClick={() => navigate(c.to)}
              className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${c.bgIcon} flex items-center justify-center shrink-0`}>
                    {c.icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {c.metric}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {c.subMetric}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  {c.actionText} <LuArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Sales & Orders Audit Summary Hub
  if (tabKey === "Orders_Summary") {
    const cards = [
      {
        title: "Order Transaction Ledger",
        icon: <LuReceipt className="text-amber-500" size={24} />,
        bgIcon: "bg-amber-500/10",
        desc: "Comprehensive audit records of all Counter, Dine-In, Online delivery, and Takeaway orders.",
        metric: `${orders.length} Recent Orders`,
        subMetric: "Full order details & receipt printing",
        actionText: "Audit Transactions",
        to: "/dashboard?tab=Orders",
      },
      {
        title: "Profit & Loss Statement",
        icon: <LuTrendingUp className="text-emerald-500" size={24} />,
        bgIcon: "bg-emerald-500/10",
        desc: "Revenue performance, raw material food costs, payroll overheads, and net operating profit reports.",
        metric: "Revenue & Margins",
        subMetric: "Operating margin breakdown",
        actionText: "View P&L Reports",
        to: "/dashboard?tab=Profit",
      },
      {
        title: "Payment Settlement Gateway",
        icon: <LuCreditCard className="text-blue-500" size={24} />,
        bgIcon: "bg-blue-500/10",
        desc: "Cash drawer shift balancing, credit/debit card gateway receipts, and online payout settlements.",
        metric: "Settlement Reconciliation",
        subMetric: "Cash vs Card breakdown",
        actionText: "View Settlements",
        to: "/dashboard?tab=Payments",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <LuReceipt size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                Sales & Orders Audit Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transaction history, revenue metrics, profit margins, and payment reconciliation
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div
              key={c.title}
              onClick={() => navigate(c.to)}
              className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${c.bgIcon} flex items-center justify-center shrink-0`}>
                    {c.icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {c.metric}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {c.subMetric}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  {c.actionText} <LuArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Guests & Staff CRM Summary Hub
  if (tabKey === "CRM_Summary") {
    const cards = [
      {
        title: "Dining Tables & Floor Plan",
        icon: <LuLayoutGrid className="text-teal-500" size={24} />,
        bgIcon: "bg-teal-500/10",
        desc: "Live interactive dining hall seating layout, table reservations, live vacancy, and guest orders.",
        metric: "Floor Seating",
        subMetric: "Visual table layout manager",
        actionText: "Open Dining Tables",
        to: "/tables",
      },
      {
        title: "Staff & Payroll HR",
        icon: <LuUsers className="text-purple-500" size={24} />,
        bgIcon: "bg-purple-500/10",
        desc: "Employee rosters, shift schedules, role permissions, salaries, and monthly payroll disbursement.",
        metric: "Human Resources",
        subMetric: "Staff permissions & wages",
        actionText: "Manage Staff",
        to: "/dashboard?tab=Staff",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <LuUsers size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                Guests & Staff CRM Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Floor management, table seating arrangements, and restaurant human resources
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((c) => (
            <div
              key={c.title}
              onClick={() => navigate(c.to)}
              className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${c.bgIcon} flex items-center justify-center shrink-0`}>
                    {c.icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {c.metric}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {c.subMetric}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  {c.actionText} <LuArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Store Configuration Summary Hub
  if (tabKey === "Settings_Summary") {
    const cards = [
      {
        title: "Tax & Business Config",
        icon: <LuSettings className="text-slate-500" size={24} />,
        bgIcon: "bg-slate-500/10",
        desc: "Configure sales tax rates (GST / VAT), receipt print headers, service charges, and legal company details.",
        metric: "Tax & Compliance",
        subMetric: "Sales tax percentages & billing setup",
        actionText: "Configure Taxes",
        to: "/dashboard?tab=Tax",
      },
      {
        title: "In-Store Music Player",
        icon: <LuMusic className="text-rose-500" size={24} />,
        bgIcon: "bg-rose-500/10",
        desc: "Background ambient audio controls for the dining area, playlist queues, and audio atmosphere.",
        metric: "In-Store Audio",
        subMetric: "Live audio playback controls",
        actionText: "Open Music Player",
        to: "/dashboard?tab=Music",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center">
              <LuSettings size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                Store Configuration Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Business compliance, tax policies, and in-store restaurant settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((c) => (
            <div
              key={c.title}
              onClick={() => navigate(c.to)}
              className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${c.bgIcon} flex items-center justify-center shrink-0`}>
                    {c.icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    {c.metric}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {c.subMetric}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  {c.actionText} <LuArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SectionSummaryView;
