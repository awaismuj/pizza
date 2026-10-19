import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FcShop,
  FcPlanner,
  FcShipped,
  FcInTransit,
  FcPackage,
  FcPositiveDynamic,
  FcDocument,
  FcBullish,
  FcMoneyTransfer,
  FcRating,
  FcMultipleInputs,
  FcConferenceCall,
  FcApproval,
  FcSalesPerformance,
  FcAdvertising,
  FcServices,
  FcDepartment,
  FcBriefcase,
} from "react-icons/fc";
import {
  MdChevronLeft,
  MdChevronRight,
  MdExpandMore,
  MdReceiptLong,
  MdInsights,
  MdAccountBalance,
  MdPayments,
  MdInventory2,
  MdPeopleAlt,
  MdLocalOffer,
  MdSettings,
  MdApartment,
  MdDashboard,
  MdViewCarousel,
  MdRestaurantMenu,
  MdArrowBack,
} from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getLowStockItems } from "../../https";
import { isStockRole, LOW_STOCK_QUERY_KEY, OPEN_LOW_STOCK_EVENT } from "../shared/LowStockAlert";
import genzLogo from "../../assets/images/genz-pizza-land-logo.jpg";
import { useUITheme } from "../../context/UIThemeContext";
import { canUserAccessERP } from "../../utils/orderPermissions";

const ModernSidebar = ({ collapsed, setCollapsed, onOpenNewOrder, onOpenExpense }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isClean, isCashierMode, setPosRoleMode } = useUITheme();
  const userData = useSelector((state) => state.user);
  const roleLower = String(userData.role || "").toLowerCase();

  const hasERP = canUserAccessERP(userData);
  const isAdmin = ["admin", "accountant", "asset manager", "read only"].includes(roleLower);
  const isFullAdmin = roleLower === "admin";
  const canSeeAssets = ["admin", "accountant", "asset manager", "read only"].includes(roleLower);

  // Live order counts for badges
  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 12000,
  });

  const orders = ordersData?.data?.data || [];
  const inProgressDineIn = orders.filter(
    (o) => o.orderSource !== "Online" && o.orderStatus === "In Progress"
  ).length;
  const pendingOnline = orders.filter(
    (o) => o.orderSource === "Online" && (o.orderStatus === "Pending" || o.orderStatus === "Accepted")
  ).length;

  const canSeeStock = userData.isAuth && isStockRole(userData.role);
  const { data: lowStockData } = useQuery({
    queryKey: LOW_STOCK_QUERY_KEY,
    queryFn: getLowStockItems,
    enabled: canSeeStock,
    refetchInterval: 15000,
  });
  const lowStockCount = canSeeStock ? lowStockData?.data?.data?.length ?? 0 : 0;

  // Front of House operations (Vibrant Colored SVGs)
  const operationsItems = [
    {
      to: "/menu",
      label: "POS Terminal",
      short: "POS",
      icon: <FcShop size={22} />,
      badge: null,
      desc: "Cashier billing grid",
    },
    {
      to: "/tables",
      label: "Tables & Floors",
      short: "Tables",
      icon: <FcPlanner size={22} />,
      badge: null,
      desc: "Live floor seating plan",
    },
    {
      to: "/orders",
      label: "Dine-In Kitchen",
      short: "Kitchen",
      icon: <FcShipped size={22} />,
      badge: inProgressDineIn > 0 ? inProgressDineIn : null,
      badgeColor: "bg-amber-500",
      desc: "Kitchen display system",
    },
    {
      to: "/online-orders",
      label: "Online Dispatch",
      short: "Online",
      icon: <FcInTransit size={22} />,
      badge: pendingOnline > 0 ? pendingOnline : null,
      badgeColor: "bg-emerald-500 animate-pulse",
      desc: "Delivery queue & tracking",
    },
    {
      to: "/outdoor",
      label: "Takeaway Window",
      short: "Takeaway",
      icon: <FcPackage size={22} />,
      badge: null,
      desc: "Express counter pickup",
    },
  ];

  // Back Office ERP Modules Grouped by Function (Collapsible Tree Navigation)
  const currentTab = new URLSearchParams(location.search).get("tab") || (isFullAdmin ? "Metrics" : "Assets");
  const isDashboard = location.pathname === "/dashboard";

  const erpGroups = [
    {
      id: "financials",
      label: "Financials & Audit",
      icon: <FcPositiveDynamic size={18} />,
      items: [
        ...(isFullAdmin
          ? [
              {
                tab: "Metrics",
                label: "KPIs & Analytics",
                icon: <FcPositiveDynamic size={16} />,
                desc: "Executive performance metrics",
              },
              {
                tab: "Orders",
                label: "Order Ledger",
                icon: <FcDocument size={16} />,
                desc: "Audit trail & settlements",
              },
              {
                tab: "Profit",
                label: "Profit & Loss",
                icon: <FcBullish size={16} />,
                desc: "COGS & trading statement",
              },
              {
                tab: "Payments",
                label: "Settlement Gateway",
                icon: <FcMoneyTransfer size={16} />,
                desc: "Cash, card & digital",
              },
            ]
          : []),
      ],
    },
    {
      id: "catalog",
      label: "Menu & Promotions",
      icon: <FcRating size={18} />,
      items: [
        ...(isFullAdmin
          ? [
              {
                tab: "Menu",
                label: "Menu Engineering",
                icon: <FcRating size={16} />,
                desc: "Categories, dishes & prices",
              },
              {
                tab: "Deals",
                label: "Deals & Combos",
                icon: <FcApproval size={16} />,
                desc: "Promotions & discounts",
              },
              {
                tab: "Build Your Own",
                label: "Custom Deal Builder",
                icon: <FcSalesPerformance size={16} />,
                desc: "Dynamic tier discounts",
              },
              {
                tab: "Hero Slider",
                label: "Store Banners",
                icon: <FcAdvertising size={16} />,
                desc: "Storefront showcase slides",
              },
            ]
          : []),
      ],
    },
    {
      id: "operations",
      label: "Operations & HR",
      icon: <FcMultipleInputs size={18} />,
      items: [
        ...(isFullAdmin
          ? [
              {
                tab: "Inventory",
                label: "Inventory Control",
                icon: <FcMultipleInputs size={16} />,
                badge: lowStockCount > 0 ? lowStockCount : null,
                badgeColor: "bg-rose-500",
                desc: "Stock ledger & restock alerts",
              },
              {
                tab: "Staff",
                label: "Staff & Payroll HR",
                icon: <FcConferenceCall size={16} />,
                desc: "Roster, attendance & slips",
              },
            ]
          : []),
        ...(canSeeAssets
          ? [
              {
                tab: "Assets",
                label: "Fixed Asset Register",
                icon: <FcDepartment size={16} />,
                desc: "Asset valuations & custody",
              },
            ]
          : []),
      ],
    },
    {
      id: "settings",
      label: "Store Settings",
      icon: <FcServices size={18} />,
      items: [
        ...(isFullAdmin
          ? [
              {
                tab: "Tax",
                label: "Tax & Store Config",
                icon: <FcServices size={16} />,
                desc: "Global tax rates & charges",
              },
            ]
          : []),
      ],
    },
  ].filter((group) => group.items.length > 0);

  // Collapsible Tree state for Manager Mode
  const [openCategories, setOpenCategories] = React.useState({
    financials: true,
    catalog: true,
    operations: true,
    settings: true,
  });

  const toggleCategory = (catId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Ensure currently selected tab's group stays expanded automatically
  React.useEffect(() => {
    if (isDashboard) {
      const activeGroup = erpGroups.find((g) =>
        g.items.some((item) => item.tab === currentTab)
      );
      if (activeGroup && !openCategories[activeGroup.id]) {
        setOpenCategories((prev) => ({ ...prev, [activeGroup.id]: true }));
      }
    }
  }, [currentTab, isDashboard]);

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-300 ${
        isClean
          ? "bg-white border-r border-slate-200/90 text-slate-800 shadow-sm"
          : "bg-[#0B0F19] border-r border-slate-800/80 text-slate-100"
      } ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Brand Header */}
      <div
        className={`relative flex items-center h-16 px-3 transition-colors shrink-0 ${
          isClean
            ? "border-b border-slate-200/80 bg-slate-50/70"
            : "border-b border-slate-800/80 bg-slate-900/60"
        } ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <button
          onClick={() => navigate("/")}
          className={`flex items-center gap-2.5 overflow-hidden text-left focus:outline-none group ${
            collapsed ? "justify-center" : ""
          }`}
          title="GenZ Pizza Land"
        >
          <img
            src={genzLogo}
            alt="GenZ Pizza Land"
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/40 shrink-0 shadow-xs transition group-hover:scale-105"
          />
          {!collapsed && (
            <div className="min-w-0">
              <h2
                className={`text-sm font-black tracking-tight truncate leading-tight ${
                  isClean ? "text-slate-900" : "text-white"
                }`}
              >
                GenZ Pizza Land
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Enterprise POS
              </span>
            </div>
          )}
        </button>

        {/* Sleek Floating Expand/Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3.5 top-5 z-50 w-7 h-7 rounded-full border shadow-md flex items-center justify-center transition-all ${
            isClean
              ? "bg-white border-slate-200 text-slate-700 hover:text-amber-600 hover:bg-slate-50"
              : "bg-slate-900 border-slate-700 text-slate-200 hover:text-amber-400 hover:bg-slate-800"
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />}
        </button>
      </div>

      {/* Permission-Based Portal Mode Switcher */}
      {hasERP && (
        <div className={`pt-3 pb-1 shrink-0 ${collapsed ? "px-2 flex justify-center" : "px-3"}`}>
          {collapsed ? (
            <button
              type="button"
              onClick={() => {
                const next = isCashierMode ? "manager" : "cashier";
                setPosRoleMode(next);
                if (next === "manager") navigate("/dashboard");
                else if (location.pathname === "/dashboard") navigate("/");
              }}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center relative group transition shadow-xs ${
                isClean
                  ? "bg-slate-50 hover:bg-white border-slate-200 text-slate-800 hover:border-amber-400"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-100 hover:border-amber-400"
              }`}
              title={isCashierMode ? "Mode: Cashier (Click to switch to Manager ERP)" : "Mode: Manager (Click to switch to Cashier POS)"}
            >
              {isCashierMode ? <FcShop size={22} /> : <FcBriefcase size={22} />}
              <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
                {isCashierMode ? "Switch to Manager ERP" : "Switch to Cashier POS"}
              </div>
            </button>
          ) : (
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isClean ? "bg-slate-100 border-slate-200/90" : "bg-slate-900 border-slate-800"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setPosRoleMode("cashier");
                  if (location.pathname === "/dashboard") navigate("/");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  isCashierMode
                    ? isClean
                      ? "bg-white text-slate-950 shadow-xs"
                      : "bg-slate-800 text-white shadow-xs"
                    : isClean
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Cashier Counter POS"
              >
                <FcShop size={16} className="shrink-0" />
                <span>Cashier</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPosRoleMode("manager");
                  navigate("/dashboard");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  !isCashierMode
                    ? isClean
                      ? "bg-white text-slate-950 shadow-xs"
                      : "bg-slate-800 text-white shadow-xs"
                    : isClean
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Manager Back-Office ERP"
              >
                <FcBriefcase size={16} className="shrink-0" />
                <span>Manager</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Button: New Order */}
      <div className={`shrink-0 ${collapsed ? "px-2 py-2 flex justify-center" : "p-3"}`}>
        <button
          type="button"
          onClick={onOpenNewOrder}
          className={`${
            collapsed
              ? "w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95 relative group"
              : "w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95"
          }`}
          title="New Dine-In Order"
        >
          <BiSolidDish size={20} className="shrink-0" />
          {!collapsed && <span>+ New Order</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
              New Dine-In Order
            </div>
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className={`flex-1 overflow-y-auto scrollbar-hide py-1 ${collapsed ? "px-2 space-y-2" : "px-3 space-y-4"}`}>
        {/* If in Cashier Mode: Only show Front of House operations (minimal, fast-lane) */}
        {isCashierMode ? (
          <div>
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-2">
                <span className={`text-[10px] font-black tracking-wider uppercase ${isClean ? "text-slate-500" : "text-slate-400"}`}>
                  Counter Desk
                </span>
                <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                  Cashier Fast-Lane
                </span>
              </div>
            )}

            <div className={collapsed ? "space-y-1.5 flex flex-col items-center" : "space-y-1.5"}>
              {operationsItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`relative transition-all group ${
                      collapsed
                        ? "w-11 h-11 flex items-center justify-center rounded-xl"
                        : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold"
                    } ${
                      active
                        ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 font-black"
                        : isClean
                        ? "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                    title={item.label}
                  >
                    <div className="shrink-0 flex items-center justify-center">{item.icon}</div>

                    {!collapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate text-xs font-bold leading-none">{item.label}</span>
                        {item.badge !== null && (
                          <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-black rounded-full text-white shadow-xs ${item.badgeColor || "bg-amber-500"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {collapsed && (
                      <>
                        {item.badge !== null && (
                          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black rounded-full text-white bg-rose-500 border-2 border-white dark:border-slate-900 shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
                          {item.label}
                        </div>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ) : (
          /* If in Manager Mode: Show Structured Collapsible Tree-Line ERP Suite */
          <div className="space-y-3">
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-1">
                <span className={`text-[10px] font-black tracking-wider uppercase ${isClean ? "text-slate-500" : "text-slate-400"}`}>
                  F&B ERP Portal
                </span>
                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  Back Office
                </span>
              </div>
            )}

            {!collapsed ? (
              <div className="space-y-2">
                {erpGroups.map((group) => {
                  const isExpanded = openCategories[group.id] ?? true;
                  const hasActiveChild = isDashboard && group.items.some((item) => item.tab === currentTab);

                  return (
                    <div key={group.id} className="rounded-xl overflow-hidden">
                      {/* Parent Category Header */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(group.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          hasActiveChild
                            ? isClean
                              ? "bg-amber-50 text-amber-900 border border-amber-200/80 font-black"
                              : "bg-amber-500/10 text-amber-300 border border-amber-500/20 font-black"
                            : isClean
                            ? "text-slate-700 hover:bg-slate-100/90"
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0">{group.icon}</span>
                          <span className="truncate text-xs tracking-tight">{group.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {group.items.length}
                          </span>
                          {isExpanded ? (
                            <MdExpandMore size={16} className="text-slate-400 transition-transform duration-200" />
                          ) : (
                            <MdChevronRight size={16} className="text-slate-400 transition-transform duration-200" />
                          )}
                        </div>
                      </button>

                      {/* Tree Branch Guide Lines & Child Items */}
                      {isExpanded && (
                        <div className="relative pl-3 ml-4.5 my-1.5 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                          {group.items.map((item) => {
                            const active = isDashboard && currentTab === item.tab;
                            return (
                              <NavLink
                                key={item.tab}
                                to={`/dashboard?tab=${item.tab}`}
                                className={`relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all group before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-0.5 before:transition-colors ${
                                  active
                                    ? isClean
                                      ? "bg-amber-500 text-slate-950 font-black shadow-xs before:bg-amber-500"
                                      : "bg-amber-500 text-slate-950 font-black shadow-xs before:bg-amber-500"
                                    : isClean
                                    ? "text-slate-600 hover:text-slate-950 hover:bg-slate-100 before:bg-slate-200 dark:before:bg-slate-800"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 before:bg-slate-200 dark:before:bg-slate-800"
                                }`}
                                title={item.label}
                              >
                                <div className="shrink-0 flex items-center justify-center scale-90">
                                  {item.icon}
                                </div>
                                <span className="truncate flex-1 text-xs leading-none">
                                  {item.label}
                                </span>
                                {item.badge !== null && item.badge !== undefined && (
                                  <span className={`px-1.5 py-0.5 text-[9px] font-black rounded-full text-white shadow-xs ${item.badgeColor || "bg-rose-500"}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* In Collapsed Mode: Clean centered icons grouped with subtle separators and floating tooltips */
              <div className="space-y-2 flex flex-col items-center">
                {erpGroups.map((group, gIdx) => (
                  <div key={group.id} className="w-full flex flex-col items-center space-y-1">
                    {gIdx > 0 && (
                      <div className={`w-6 h-px my-1 ${isClean ? "bg-slate-200" : "bg-slate-800"}`} />
                    )}
                    {group.items.map((item) => {
                      const active = isDashboard && currentTab === item.tab;
                      return (
                        <NavLink
                          key={item.tab}
                          to={`/dashboard?tab=${item.tab}`}
                          className={`relative transition-all group w-11 h-11 flex items-center justify-center rounded-xl ${
                            active
                              ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 font-black"
                              : isClean
                              ? "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                          }`}
                          title={`${group.label} · ${item.label}`}
                        >
                          <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
                          {item.badge !== null && item.badge !== undefined && (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black rounded-full text-white bg-rose-500 border-2 border-white dark:border-slate-900 shadow-xs">
                              {item.badge}
                            </span>
                          )}
                          <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
                            <span className="text-amber-400 text-[10px] uppercase tracking-wider block font-black">{group.label}</span>
                            {item.label}
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: QUICK OPERATIONS */}
        <div className={`pt-2 border-t ${isClean ? "border-slate-200/80" : "border-slate-800/80"}`}>
          {!collapsed && (
            <p
              className={`px-3 text-[10px] font-black tracking-wider uppercase mb-1.5 ${
                isClean ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Quick Cash & Alerts
            </p>
          )}

          <div className={collapsed ? "space-y-1.5 flex flex-col items-center" : "space-y-1"}>
            <button
              type="button"
              onClick={onOpenExpense}
              className={`relative transition group ${
                collapsed
                  ? "w-11 h-11 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  : "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold"
              } ${
                isClean
                  ? "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
              title="Add Cash Expense"
            >
              <FcMoneyTransfer size={20} className="shrink-0" />
              {!collapsed && <span>Record Expense</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
                  Record Expense
                </div>
              )}
            </button>

            {canSeeStock && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_LOW_STOCK_EVENT))}
                className={`relative transition group ${
                  collapsed
                    ? "w-11 h-11 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold"
                } ${
                  lowStockCount > 0
                    ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20"
                    : isClean
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
                title={lowStockCount > 0 ? `${lowStockCount} items need restock` : "Inventory Stock Alerts"}
              >
                <FcServices size={20} className="shrink-0" />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Stock Alerts</span>
                    {lowStockCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                        {lowStockCount}
                      </span>
                    )}
                  </div>
                )}
                {collapsed && (
                  <>
                    {lowStockCount > 0 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black rounded-full text-white bg-rose-500 border-2 border-white dark:border-slate-900 shadow-xs">
                        {lowStockCount}
                      </span>
                    )}
                    <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
                      Stock Alerts {lowStockCount > 0 ? `(${lowStockCount})` : ""}
                    </div>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* System Status Footer */}
      <div
        className={`p-3 border-t transition-colors shrink-0 ${
          isClean
            ? "border-slate-200/80 bg-slate-50/80"
            : "border-slate-800/80 bg-slate-900/60"
        }`}
      >
        <div className={`flex items-center ${collapsed ? "justify-center relative group" : "justify-between"} text-[11px] font-medium`}>
          <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {!collapsed && <span>POS Online</span>}
          </span>
          {!collapsed ? (
            <span
              className={`text-[10px] font-mono font-bold ${
                isClean ? "text-slate-500" : "text-slate-400"
              }`}
            >
              v2.0-ERP
            </span>
          ) : (
            <div className="absolute left-full ml-3 px-2 py-1 text-[11px] font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
              POS Online · v2.0
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ModernSidebar;
