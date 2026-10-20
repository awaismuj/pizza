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
import { FcPositiveDynamic } from "react-icons/fc";
import { BiSolidDish } from "react-icons/bi";
import { MdCategory } from "react-icons/md";

/**
 * SectionSummaryView
 * Displays an executive overview hub of all child navigation items
 * when a user clicks any parent enterprise department in the sidebar.
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

  // 1. Inventory Summary Hub
  if (tabKey === "Stock Operations" || tabKey === "Inventory_Summary") {
    const outOfStockCount = inventoryItems.filter((i) => i.quantity <= 0).length;
    const inStockCount = inventoryItems.filter(
      (i) => i.quantity > (i.reorderLevel || 0)
    ).length;

    const cards = [
      {
        title: "Stock Balance",
        icon: <LuBoxes className="text-amber-500" size={24} />,
        bgIcon: "bg-amber-500/10",
        desc: "Live inventory of all raw ingredients, supplies, packaging, and automatic recipe deduction tracking.",
        metric: `${inventoryItems.length} SKUs`,
        subMetric: lowStockCount > 0 ? `${lowStockCount} below reorder level` : "All items healthy",
        subMetricClass: lowStockCount > 0 ? "text-rose-500 font-bold" : "text-emerald-500 font-medium",
        actionText: "Open Stock",
        to: "/dashboard?tab=Inventory",
      },
      {
        title: "Fixed Assets",
        icon: <LuBuilding2 className="text-indigo-500" size={24} />,
        bgIcon: "bg-indigo-500/10",
        desc: "Restaurant capital assets including commercial ovens, refrigeration, POS billing hardware, and tables.",
        metric: "Equipment",
        subMetric: "Depreciation & maintenance logs",
        subMetricClass: "text-slate-500 dark:text-slate-400 font-medium",
        actionText: "View Assets",
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
                    Inventory & Stock
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Stock SKUs</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{inventoryItems.length}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Stock</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{inStockCount}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
              <p className={`text-xl font-black mt-0.5 ${lowStockCount > 0 ? "text-amber-500" : "text-slate-400"}`}>
                {lowStockCount}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Out of Stock</p>
              <p className={`text-xl font-black mt-0.5 ${outOfStockCount > 0 ? "text-rose-500" : "text-slate-400"}`}>
                {outOfStockCount}
              </p>
            </div>
          </div>
        </div>

        {/* Child Module Cards */}
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
                <span className={`text-[11px] ${c.subMetricClass}`}>{c.subMetric}</span>
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

  // 2. Menu Summary Hub
  if (tabKey === "Menu Operations" || tabKey === "Menu_Summary") {
    const cards = [
      {
        title: "Dishes",
        icon: <LuUtensils className="text-amber-500" size={24} />,
        bgIcon: "bg-amber-500/10",
        desc: "Catalog of all culinary items, multiple portion sizes, crust variants, pricing, and recipe inventory links.",
        metric: `${dishes.length} Dishes`,
        subMetric: `${dishes.filter((d) => d.isInventoryTracked).length} with recipe stock deductions`,
        actionText: "Manage Dishes",
        to: "/dashboard?tab=Menu",
      },
      {
        title: "Categories",
        icon: <LuFolderTree className="text-blue-500" size={24} />,
        bgIcon: "bg-blue-500/10",
        desc: "Storefront food sections (Pizza, Burgers, Sides, Beverages) with drag-and-drop sort order.",
        metric: `${categories.length} Categories`,
        subMetric: "Customer storefront navigation",
        actionText: "Manage Categories",
        to: "/dashboard?tab=Categories",
      },
      {
        title: "Combo Deals",
        icon: <LuFlame className="text-orange-500" size={24} />,
        bgIcon: "bg-orange-500/10",
        desc: "Promotional bundle combos, special bundle pricing, storefront badges, and day-of-week schedules.",
        metric: "Combo Deals",
        subMetric: "Auto inventory stock decrements",
        actionText: "Manage Deals",
        to: "/dashboard?tab=Deals",
      },
      {
        title: "Deal Builder",
        icon: <LuSlidersHorizontal className="text-purple-500" size={24} />,
        bgIcon: "bg-purple-500/10",
        desc: "Build-your-own tier discount rules for multi-item customer bundles (pick 3, 4, 5+ items to save).",
        metric: "Tier Discounts",
        subMetric: "Dynamic customer bundle rules",
        actionText: "Configure Deals",
        to: "/dashboard?tab=Build Your Own",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <BiSolidDish size={24} />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                  Menu & Dishes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recipe management, dish catalogs, menu taxonomy, combo promotions, and custom pizza builder
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenModal && onOpenModal("category")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <MdCategory size={15} />
                <span>+ Category</span>
              </button>
              <button
                onClick={() => onOpenModal && onOpenModal("dishes")}
                className="pos-btn-primary py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <LuPlus size={15} />
                <span>+ New Dish</span>
              </button>
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
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
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

  // 3. Finance Summary Hub
  if (tabKey === "Finance Operations" || tabKey === "Orders_Summary") {
    const cards = [
      {
        title: "Analytics",
        icon: <FcPositiveDynamic size={24} />,
        bgIcon: "bg-emerald-500/10",
        desc: "Live revenue KPIs, order volume trends, dish category distribution, and cashier performance.",
        metric: "Executive KPIs",
        subMetric: "Real-time revenue monitoring",
        actionText: "View Analytics",
        to: "/dashboard?tab=Metrics",
      },
      {
        title: "Profit & Loss",
        icon: <LuTrendingUp className="text-emerald-500" size={24} />,
        bgIcon: "bg-emerald-500/10",
        desc: "Revenue performance, raw material food costs, payroll overheads, and net operating profit reports.",
        metric: "Margins",
        subMetric: "Operating margin breakdown",
        actionText: "View P&L",
        to: "/dashboard?tab=Profit",
      },
      {
        title: "Order History",
        icon: <LuReceipt className="text-amber-500" size={24} />,
        bgIcon: "bg-amber-500/10",
        desc: "Comprehensive audit records of all Counter, Dine-In, Online delivery, and Takeaway orders.",
        metric: `${orders.length} Orders`,
        subMetric: "Full order details & receipt printing",
        actionText: "View History",
        to: "/dashboard?tab=Orders",
      },
      {
        title: "Payments",
        icon: <LuCreditCard className="text-blue-500" size={24} />,
        bgIcon: "bg-blue-500/10",
        desc: "Cash drawer shift balancing, credit/debit card gateway receipts, and online payout settlements.",
        metric: "Settlements",
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
                Finance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Financial profit & loss statements, order audit ledger, payment settlements, and revenue KPIs
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
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
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

  // 4. Staff & HR Summary Hub
  if (tabKey === "HR Operations" || tabKey === "CRM_Summary") {
    const cards = [
      {
        title: "Staff & Payroll",
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
                Staff & HR
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff directory, employee roles, access permissions, and salary payroll disbursements
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
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
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

  // 5. Storefront Summary Hub
  if (tabKey === "Marketing Operations") {
    const cards = [
      {
        title: "Website Banners",
        icon: <LuImage className="text-pink-500" size={24} />,
        bgIcon: "bg-pink-500/10",
        desc: "Promotional hero banners, seasonal marketing graphics, and landing slides for genzpizza.online.",
        metric: "Marketing",
        subMetric: "Online web slider manager",
        actionText: "Manage Banners",
        to: "/dashboard?tab=Hero Slider",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <LuImage size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                Storefront
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Online customer-facing web banners, hero slides, and promotional marketing campaigns
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
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
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

  // 6. Administration Summary Hub
  if (tabKey === "Admin Operations" || tabKey === "Settings_Summary") {
    const cards = [
      {
        title: "Tax & Billing",
        icon: <LuSettings className="text-slate-500" size={24} />,
        bgIcon: "bg-slate-500/10",
        desc: "Configure sales tax rates (GST / VAT), receipt print headers, service charges, and legal company details.",
        metric: "Tax & Setup",
        subMetric: "Sales tax percentages & billing setup",
        actionText: "Configure Taxes",
        to: "/dashboard?tab=Tax",
      },
      {
        title: "Store Music",
        icon: <LuMusic className="text-teal-500" size={24} />,
        bgIcon: "bg-teal-500/10",
        desc: "Curated in-restaurant background music, playlists, and audio player controls for dining room ambiance.",
        metric: "Atmosphere",
        subMetric: "Music playlists & playback control",
        actionText: "Open Player",
        to: "/dashboard?tab=Music",
      },
    ];

    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <LuSettings size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight">
                Administration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sales tax rates, compliance rules, store billing profile, and in-restaurant audio ambience
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
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
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
