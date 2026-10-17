import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MdRestaurantMenu,
  MdTableBar,
  MdOutlineReorder,
  MdDeliveryDining,
  MdOutlineShoppingBag,
  MdChevronLeft,
  MdChevronRight,
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
} from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getLowStockItems } from "../../https";
import { isStockRole, LOW_STOCK_QUERY_KEY, OPEN_LOW_STOCK_EVENT } from "../shared/LowStockAlert";
import genzLogo from "../../assets/images/genz-pizza-land-logo.jpg";
import { useUITheme } from "../../context/UIThemeContext";

const ModernSidebar = ({ collapsed, setCollapsed, onOpenNewOrder, onOpenExpense }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isClean } = useUITheme();
  const userData = useSelector((state) => state.user);
  const roleLower = String(userData.role || "").toLowerCase();

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

  // Front of House operations
  const operationsItems = [
    {
      to: "/menu",
      label: "POS Terminal",
      short: "POS",
      icon: <MdRestaurantMenu size={20} />,
      badge: null,
      desc: "Cashier & quick billing",
    },
    {
      to: "/tables",
      label: "Tables & Floors",
      short: "Tables",
      icon: <MdTableBar size={20} />,
      badge: null,
      desc: "Live floor seating plan",
    },
    {
      to: "/orders",
      label: "Dine-In Kitchen",
      short: "Kitchen",
      icon: <MdOutlineReorder size={20} />,
      badge: inProgressDineIn > 0 ? inProgressDineIn : null,
      badgeColor: "bg-amber-500",
      desc: "Kitchen display system",
    },
    {
      to: "/online-orders",
      label: "Online Dispatch",
      short: "Online",
      icon: <MdDeliveryDining size={22} />,
      badge: pendingOnline > 0 ? pendingOnline : null,
      badgeColor: "bg-emerald-500 animate-pulse",
      desc: "Delivery & takeaway queue",
    },
    {
      to: "/outdoor",
      label: "Takeaway Window",
      short: "Takeaway",
      icon: <MdOutlineShoppingBag size={20} />,
      badge: null,
      desc: "Express counter pickup",
    },
  ];

  // Back Office ERP Modules (Dashboard Tabs)
  const currentTab = new URLSearchParams(location.search).get("tab") || (isFullAdmin ? "Metrics" : "Assets");
  const isDashboard = location.pathname === "/dashboard";

  const erpModules = [
    ...(isFullAdmin
      ? [
          {
            tab: "Metrics",
            label: "KPIs & Analytics",
            icon: <MdInsights size={18} />,
            desc: "Executive performance metrics",
          },
          {
            tab: "Orders",
            label: "Order Ledger",
            icon: <MdReceiptLong size={18} />,
            desc: "Audit trail & settlements",
          },
          {
            tab: "Profit",
            label: "Profit & Loss",
            icon: <MdAccountBalance size={18} />,
            desc: "COGS & trading statement",
          },
          {
            tab: "Payments",
            label: "Settlement Gateway",
            icon: <MdPayments size={18} />,
            desc: "Cash, card & digital",
          },
          {
            tab: "Menu",
            label: "Menu Engineering",
            icon: <MdRestaurantMenu size={18} />,
            desc: "Categories, dishes & prices",
          },
          {
            tab: "Inventory",
            label: "Inventory Control",
            icon: <MdInventory2 size={18} />,
            badge: lowStockCount > 0 ? lowStockCount : null,
            badgeColor: "bg-rose-500",
            desc: "Stock ledger & restock alerts",
          },
          {
            tab: "Staff",
            label: "Staff & Payroll HR",
            icon: <MdPeopleAlt size={18} />,
            desc: "Roster, attendance & slips",
          },
          {
            tab: "Deals",
            label: "Deals & Combos",
            icon: <MdLocalOffer size={18} />,
            desc: "Promotions & discounts",
          },
          {
            tab: "Build Your Own",
            label: "Custom Deal Builder",
            icon: <BiSolidDish size={18} />,
            desc: "Dynamic tier discounts",
          },
          {
            tab: "Hero Slider",
            label: "Store Banners",
            icon: <MdViewCarousel size={18} />,
            desc: "Storefront showcase slides",
          },
          {
            tab: "Tax",
            label: "Tax & Store Config",
            icon: <MdSettings size={18} />,
            desc: "Global tax rates & charges",
          },
        ]
      : []),
    ...(canSeeAssets
      ? [
          {
            tab: "Assets",
            label: "Fixed Asset Register",
            icon: <MdApartment size={18} />,
            desc: "Asset valuations & custody",
          },
        ]
      : []),
  ];

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
                className={`text-sm font-bold tracking-tight truncate leading-tight ${
                  isClean ? "text-slate-900" : "text-white"
                }`}
              >
                GenZ Pizza Land
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Enterprise POS
              </span>
            </div>
          )}
        </button>

        {/* Sleek Floating Expand/Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-5 z-50 w-6 h-6 rounded-full border shadow-md flex items-center justify-center transition-all ${
            isClean
              ? "bg-white border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-slate-50"
              : "bg-slate-900 border-slate-700 text-slate-300 hover:text-amber-400 hover:bg-slate-800"
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <MdChevronRight size={14} /> : <MdChevronLeft size={14} />}
        </button>
      </div>

      {/* Quick Action Button: New Order */}
      <div className="p-3 shrink-0">
        <button
          type="button"
          onClick={onOpenNewOrder}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95"
          title="New Dine-In Order"
        >
          <BiSolidDish size={18} className="shrink-0" />
          {!collapsed && <span>+ New Order</span>}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-1 space-y-4 overflow-y-auto scrollbar-hide">
        {/* SECTION 1: OPERATIONS (Front of House) */}
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span
                className={`text-[10px] font-black tracking-wider uppercase ${
                  isClean ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Operations (FOH)
              </span>
              <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded">
                Live
              </span>
            </div>
          )}

          <div className="space-y-1">
            {operationsItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    active
                      ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 font-bold"
                      : isClean
                      ? "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                  }`}
                  title={item.label}
                >
                  <div
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-slate-950"
                        : isClean
                        ? "text-slate-500 group-hover:text-amber-600"
                        : "text-slate-400 group-hover:text-amber-400"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {!collapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="truncate">
                        <p className="truncate text-xs leading-none font-bold">{item.label}</p>
                        <p
                          className={`text-[10px] leading-tight truncate mt-0.5 ${
                            active
                              ? "text-slate-900/80 font-medium"
                              : isClean
                              ? "text-slate-400 font-normal"
                              : "text-slate-500 font-normal"
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>

                      {item.badge !== null && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 text-[10px] font-black rounded-full text-white shadow-xs ${
                            item.badgeColor || "bg-amber-500"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: FOOD & BEVERAGE ERP PORTAL (Back Office Management) */}
        {isAdmin && erpModules.length > 0 && (
          <div className={`pt-2 border-t ${isClean ? "border-slate-200/80" : "border-slate-800/80"}`}>
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-1.5">
                <span
                  className={`text-[10px] font-black tracking-wider uppercase ${
                    isClean ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  F&B ERP Portal
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                  Back Office
                </span>
              </div>
            )}

            <div className="space-y-1">
              {erpModules.map((item) => {
                const active = isDashboard && currentTab === item.tab;
                return (
                  <NavLink
                    key={item.tab}
                    to={`/dashboard?tab=${item.tab}`}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all group ${
                      active
                        ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 font-bold"
                        : isClean
                        ? "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                        : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                    }`}
                    title={item.label}
                  >
                    <div
                      className={`shrink-0 transition-colors ${
                        active
                          ? "text-slate-950"
                          : isClean
                          ? "text-slate-500 group-hover:text-amber-600"
                          : "text-slate-400 group-hover:text-amber-400"
                      }`}
                    >
                      {item.icon}
                    </div>

                    {!collapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="truncate">
                          <p className="truncate text-xs leading-none font-bold">{item.label}</p>
                          <p
                            className={`text-[10px] leading-tight truncate mt-0.5 ${
                              active
                                ? "text-slate-900/80 font-medium"
                                : isClean
                                ? "text-slate-400 font-normal"
                                : "text-slate-500 font-normal"
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>

                        {item.badge !== null && item.badge !== undefined && (
                          <span
                            className={`ml-2 px-1.5 py-0.5 text-[10px] font-black rounded-full text-white shadow-xs ${
                              item.badgeColor || "bg-rose-500"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: QUICK OPERATIONS */}
        <div className={`pt-2 border-t ${isClean ? "border-slate-200/80" : "border-slate-800/80"}`}>
          {!collapsed && (
            <p
              className={`px-3 text-[10px] font-black tracking-wider uppercase mb-1 ${
                isClean ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Quick Cash & Alerts
            </p>
          )}

          <div className="space-y-1">
            <button
              type="button"
              onClick={onOpenExpense}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isClean
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
              }`}
              title="Add Cash Expense"
            >
              <MdReceiptLong
                size={18}
                className={`shrink-0 ${
                  isClean ? "text-slate-400 group-hover:text-amber-600" : "text-slate-400 group-hover:text-amber-400"
                }`}
              />
              {!collapsed && <span>Record Expense</span>}
            </button>

            {canSeeStock && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_LOW_STOCK_EVENT))}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                  lowStockCount > 0
                    ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20"
                    : isClean
                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                }`}
                title={lowStockCount > 0 ? `${lowStockCount} items need restock` : "Inventory Stock"}
              >
                <FaBell size={16} className="shrink-0" />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Stock Alerts</span>
                    {lowStockCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {lowStockCount}
                      </span>
                    )}
                  </div>
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
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} text-[11px] font-medium`}>
          <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {!collapsed && <span>POS Online</span>}
          </span>
          {!collapsed && (
            <span
              className={`text-[10px] font-mono ${
                isClean ? "text-slate-400" : "text-slate-500"
              }`}
            >
              v2.0-ERP
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ModernSidebar;
