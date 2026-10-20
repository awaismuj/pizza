import React, { useState, useEffect } from "react";
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
  FcApproval,
  FcSalesPerformance,
  FcAdvertising,
  FcMultipleInputs,
  FcConferenceCall,
  FcDepartment,
  FcServices,
  FcBriefcase,
  FcHome,
} from "react-icons/fc";
import {
  MdChevronLeft,
  MdChevronRight,
  MdExpandMore,
  MdDashboard,
} from "react-icons/md";
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
} from "react-icons/lu";
import { BiSolidDish } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getLowStockItems } from "../../https";
import { isStockRole, LOW_STOCK_QUERY_KEY } from "../shared/LowStockAlert";
import { useUITheme } from "../../context/UIThemeContext";
import { canUserAccessERP } from "../../utils/orderPermissions";
import genzLogo from "../../assets/images/genz-pizza-land-logo.jpg";

const ModernSidebar = ({ collapsed, setCollapsed, onOpenNewOrder }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isClean, isCashierMode, setPosRoleMode } = useUITheme();
  const userData = useSelector((state) => state.user);
  const roleLower = String(userData.role || "").toLowerCase();

  const hasERP = canUserAccessERP(userData);
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

  const currentTab = new URLSearchParams(location.search).get("tab") || (isFullAdmin ? "Metrics" : "Assets");
  const isDashboard = location.pathname === "/dashboard";

  // Cashier Fast-Lane Front of House Operations Navigation Items (Minimal Titles)
  const cashierNavItems = [
    {
      to: "/",
      label: "Overview",
      icon: <FcHome size={20} />,
      badge: null,
      desc: "Live shift dashboard & floor status",
    },
    {
      to: "/menu",
      label: "Counter POS",
      icon: <FcShop size={20} />,
      badge: null,
      desc: "Cashier billing counter",
    },
    {
      to: "/tables",
      label: "Dining Tables",
      icon: <FcPlanner size={20} />,
      badge: null,
      desc: "Live floor seating plan",
    },
    {
      to: "/orders",
      label: "Kitchen Queue",
      icon: <FcShipped size={20} />,
      badge: inProgressDineIn > 0 ? inProgressDineIn : null,
      badgeColor: "bg-amber-500",
      desc: "Dine-in kitchen orders",
    },
    {
      to: "/online-orders",
      label: "Online Delivery",
      icon: <FcInTransit size={20} />,
      badge: pendingOnline > 0 ? pendingOnline : null,
      badgeColor: "bg-emerald-500 animate-pulse",
      desc: "Delivery order pipeline",
    },
    {
      to: "/outdoor",
      label: "Takeaway Pickup",
      icon: <FcPackage size={20} />,
      badge: null,
      desc: "Express counter pickup",
    },
  ];

  // Manager Operations & ERP Navigation Groups (Only one expanded at a time)
  const [dashboardsOpen, setDashboardsOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState("inventory");

  const toggleSection = (sectionId) => {
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const storeInventoryNav = [
    {
      id: "finance",
      title: "Finance",
      icon: <FcBullish size={18} />,
      badge: inProgressDineIn > 0 ? inProgressDineIn : null,
      badgeColor: "bg-amber-500",
      mainTo: "/dashboard?tab=Finance Operations",
      summaryTab: "Finance Operations",
      subItems: [
        {
          label: "Analytics",
          to: "/dashboard?tab=Metrics",
          tab: "Metrics",
          icon: <FcPositiveDynamic size={15} />,
        },
        {
          label: "Profit & Loss",
          to: "/dashboard?tab=Profit",
          tab: "Profit",
          icon: <LuTrendingUp size={15} />,
        },
        {
          label: "Order History",
          to: "/dashboard?tab=Orders",
          tab: "Orders",
          icon: <LuReceipt size={15} />,
        },
        {
          label: "Payments",
          to: "/dashboard?tab=Payments",
          tab: "Payments",
          icon: <LuCreditCard size={15} />,
        },
      ],
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: <FcMultipleInputs size={18} />,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: "bg-rose-500",
      mainTo: "/dashboard?tab=Stock Operations",
      summaryTab: "Stock Operations",
      subItems: [
        {
          label: "Stock Balance",
          to: "/dashboard?tab=Inventory",
          tab: "Inventory",
          icon: <LuBoxes size={15} />,
        },
        ...(canSeeAssets
          ? [
              {
                label: "Fixed Assets",
                to: "/dashboard?tab=Assets",
                tab: "Assets",
                icon: <LuBuilding2 size={15} />,
              },
            ]
          : []),
      ],
    },
    {
      id: "products",
      title: "Menu & Dishes",
      icon: <FcRating size={18} />,
      mainTo: "/dashboard?tab=Menu Operations",
      summaryTab: "Menu Operations",
      subItems: [
        {
          label: "Dishes",
          to: "/dashboard?tab=Menu",
          tab: "Menu",
          icon: <LuUtensils size={15} />,
        },
        {
          label: "Categories",
          to: "/dashboard?tab=Categories",
          tab: "Categories",
          icon: <LuFolderTree size={15} />,
        },
        {
          label: "Combo Deals",
          to: "/dashboard?tab=Deals",
          tab: "Deals",
          icon: <LuFlame size={15} />,
        },
        {
          label: "Deal Builder",
          to: "/dashboard?tab=Build Your Own",
          tab: "Build Your Own",
          icon: <LuSlidersHorizontal size={15} />,
        },
      ],
    },
    {
      id: "dining",
      title: "Dining Tables",
      icon: <FcPlanner size={18} />,
      mainTo: "/tables",
      subItems: [
        {
          label: "Floor Plan",
          to: "/tables",
          path: "/tables",
          icon: <LuLayoutGrid size={15} />,
        },
      ],
    },
    {
      id: "hr",
      title: "Staff & HR",
      icon: <FcConferenceCall size={18} />,
      mainTo: "/dashboard?tab=HR Operations",
      summaryTab: "HR Operations",
      subItems: [
        {
          label: "Staff & Payroll",
          to: "/dashboard?tab=Staff",
          tab: "Staff",
          icon: <LuUsers size={15} />,
        },
      ],
    },
    {
      id: "marketing",
      title: "Storefront",
      icon: <FcAdvertising size={18} />,
      mainTo: "/dashboard?tab=Marketing Operations",
      summaryTab: "Marketing Operations",
      subItems: [
        {
          label: "Website Banners",
          to: "/dashboard?tab=Hero Slider",
          tab: "Hero Slider",
          icon: <LuImage size={15} />,
        },
      ],
    },
    {
      id: "administration",
      title: "Administration",
      icon: <FcServices size={18} />,
      mainTo: "/dashboard?tab=Admin Operations",
      summaryTab: "Admin Operations",
      subItems: [
        {
          label: "Tax & Billing",
          to: "/dashboard?tab=Tax",
          tab: "Tax",
          icon: <LuSettings size={15} />,
        },
        {
          label: "Store Music",
          to: "/dashboard?tab=Music",
          tab: "Music",
          icon: <LuMusic size={15} />,
        },
      ],
    },
  ];

  // Auto-expand active group in Manager mode (only one at a time)
  useEffect(() => {
    if (isDashboard) {
      storeInventoryNav.forEach((sec) => {
        if (
          sec.summaryTab === currentTab ||
          sec.subItems.some((sub) => sub.tab === currentTab)
        ) {
          setExpandedSection(sec.id);
        }
      });
    } else if (location.pathname === "/tables") {
      setExpandedSection("dining");
    }
  }, [currentTab, isDashboard, location.pathname]);

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-300 ${
        isClean
          ? "bg-white border-r border-slate-200/90 text-slate-800 shadow-xs"
          : "bg-[#0B0F19] border-r border-slate-800/80 text-slate-100"
      } ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Brand Header with GenZ Pizza Land Logo & Name */}
      <div
        className={`relative flex items-center h-16 px-4 transition-colors shrink-0 ${
          isClean ? "border-b border-slate-100 bg-white" : "border-b border-slate-800/80 bg-[#0B0F19]"
        } ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <button
          onClick={() => navigate("/")}
          className={`flex items-center gap-2.5 overflow-hidden text-left focus:outline-none group ${
            collapsed ? "justify-center" : ""
          }`}
          title="GenZ Pizza Land POS & ERP"
        >
          <img
            src={genzLogo}
            alt="GenZ Pizza Land"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-500/40 shrink-0 shadow-xs transition group-hover:scale-105"
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
              <span className="text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase block -mt-0.5">
                Store POS & ERP
              </span>
            </div>
          )}
        </button>

        {/* Sleek Floating Expand/Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-5 z-50 w-6 h-6 rounded-full border shadow-sm flex items-center justify-center transition-all ${
            isClean
              ? "bg-white border-slate-200 text-slate-700 hover:text-amber-600 hover:bg-slate-50"
              : "bg-slate-900 border-slate-700 text-slate-200 hover:text-amber-400 hover:bg-slate-800"
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <MdChevronRight size={14} /> : <MdChevronLeft size={14} />}
        </button>
      </div>

      {/* Cashier / Manager Role Switcher (Metronic Segmented Control) */}
      {hasERP && (
        <div className={`pt-3 pb-1 shrink-0 ${collapsed ? "px-2 flex justify-center" : "px-3.5"}`}>
          {collapsed ? (
            <button
              type="button"
              onClick={() => {
                const next = isCashierMode ? "manager" : "cashier";
                setPosRoleMode(next);
                if (next === "manager") navigate("/dashboard");
                else if (location.pathname === "/dashboard") navigate("/menu");
              }}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center relative group transition shadow-2xs ${
                isClean
                  ? "bg-slate-50 hover:bg-white border-slate-200 text-slate-800 hover:border-amber-400"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-100 hover:border-amber-400"
              }`}
              title={isCashierMode ? "Mode: Cashier (Click to switch to Manager)" : "Mode: Manager (Click to switch to Cashier)"}
            >
              {isCashierMode ? <FcShop size={20} /> : <FcBriefcase size={20} />}
              <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
                {isCashierMode ? "Switch to Manager ERP" : "Switch to Cashier POS"}
              </div>
            </button>
          ) : (
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isClean ? "bg-slate-100/90 border-slate-200" : "bg-slate-900 border-slate-800"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setPosRoleMode("cashier");
                  if (location.pathname === "/dashboard") navigate("/menu");
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition ${
                  isCashierMode
                    ? isClean
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "bg-slate-800 text-white shadow-2xs font-semibold"
                    : isClean
                    ? "text-slate-700 hover:text-slate-950 font-medium"
                    : "text-slate-300 hover:text-white font-medium"
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
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition ${
                  !isCashierMode
                    ? isClean
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "bg-slate-800 text-white shadow-2xs font-semibold"
                    : isClean
                    ? "text-slate-700 hover:text-slate-950 font-medium"
                    : "text-slate-300 hover:text-white font-medium"
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

      {/* POS Quick Action Button: New Order */}
      <div className={`shrink-0 ${collapsed ? "px-2 py-2.5 flex justify-center" : "px-3.5 py-2.5"}`}>
        <button
          type="button"
          onClick={onOpenNewOrder}
          className={`${
            collapsed
              ? "w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition active:scale-95 relative group"
              : "w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition active:scale-95"
          }`}
          title="New Dine-In / Counter Order"
        >
          <BiSolidDish size={18} className="shrink-0" />
          {!collapsed && <span>+ Create Order</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
              Create Order
            </div>
          )}
        </button>
      </div>

      {/* Navigation Scroll Area */}
      <nav className={`flex-1 overflow-y-auto scrollbar-hide pb-6 ${collapsed ? "px-2 space-y-2" : "px-3 space-y-3"}`}>
        {/* If in Cashier Mode: Show Front of House counter fast-lane */}
        {isCashierMode ? (
          <div>
            {!collapsed && (
              <div className="flex items-center justify-between px-2.5 py-1.5 mb-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Store Front
                </span>
              </div>
            )}

            <div className="space-y-0.5">
              {cashierNavItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center transition-all ${
                      collapsed
                        ? "w-11 h-11 justify-center rounded-xl mx-auto"
                        : "gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                    } ${
                      active
                        ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                    }`}
                    title={item.label}
                  >
                    <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
                    {!collapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        {item.badge !== null && (
                          <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white shadow-2xs ${item.badgeColor || "bg-amber-500"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap rounded-lg bg-slate-950 text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-800">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ) : (
          /* If in Manager Mode: Show Executive Suite & Store Operations */
          <div className="space-y-4">
            {/* SECTION 1: OPERATIONS */}
            <div>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setDashboardsOpen(!dashboardsOpen)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 transition"
                >
                  <span>Operations</span>
                  <MdExpandMore
                    size={16}
                    className={`transition-transform duration-200 ${dashboardsOpen ? "rotate-0" : "-rotate-90"}`}
                  />
                </button>
              )}

              {dashboardsOpen && (
                <div className="space-y-0.5 mt-1">
                  {/* Live Shift Overview */}
                  <NavLink
                    to="/"
                    className={() => {
                      const active = location.pathname === "/";
                      return `flex items-center transition-all ${
                        collapsed
                          ? "w-11 h-11 justify-center rounded-xl mx-auto"
                          : "gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                      } ${
                        active
                          ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                      }`;
                    }}
                    title="Overview"
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <FcHome size={18} />
                    </div>
                    {!collapsed && <span className="truncate flex-1">Overview</span>}
                  </NavLink>

                  {/* Executive Analytics Dashboard */}
                  <NavLink
                    to="/dashboard?tab=Metrics"
                    className={() => {
                      const active = isDashboard && (currentTab === "Metrics" || !currentTab);
                      return `flex items-center transition-all ${
                        collapsed
                          ? "w-11 h-11 justify-center rounded-xl mx-auto"
                          : "gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                      } ${
                        active
                          ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                      }`;
                    }}
                    title="Analytics"
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <FcPositiveDynamic size={18} />
                    </div>
                    {!collapsed && <span className="truncate flex-1">Analytics</span>}
                  </NavLink>

                  {/* POS Cashier Terminal */}
                  <NavLink
                    to="/menu"
                    className={() => {
                      const active = location.pathname === "/menu";
                      return `flex items-center transition-all ${
                        collapsed
                          ? "w-11 h-11 justify-center rounded-xl mx-auto"
                          : "gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                      } ${
                        active
                          ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                      }`;
                    }}
                    title="Counter POS"
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <FcShop size={18} />
                    </div>
                    {!collapsed && <span className="truncate flex-1">Counter POS</span>}
                  </NavLink>

                  {/* Kitchen Display */}
                  <NavLink
                    to="/orders"
                    className={() => {
                      const active = location.pathname === "/orders";
                      return `flex items-center transition-all ${
                        collapsed
                          ? "w-11 h-11 justify-center rounded-xl mx-auto"
                          : "gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                      } ${
                        active
                          ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                      }`;
                    }}
                    title="Kitchen Queue"
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <FcShipped size={18} />
                    </div>
                    {!collapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate">Kitchen Queue</span>
                        {inProgressDineIn > 0 && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 shadow-2xs">
                            {inProgressDineIn}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>

                  {/* Online Dispatch */}
                  <NavLink
                    to="/online-orders"
                    className={() => {
                      const active = location.pathname === "/online-orders";
                      return `flex items-center transition-all ${
                        collapsed
                          ? "w-11 h-11 justify-center rounded-xl mx-auto"
                          : "gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                      } ${
                        active
                          ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                      }`;
                    }}
                    title="Online Delivery"
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <FcInTransit size={18} />
                    </div>
                    {!collapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate">Online Delivery</span>
                        {pendingOnline > 0 && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500 text-white animate-pulse shadow-2xs">
                            {pendingOnline}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>

                  {/* Takeaway Pickup */}
                  <NavLink
                    to="/outdoor"
                    className={() => {
                      const active = location.pathname === "/outdoor";
                      return `flex items-center transition-all ${
                        collapsed
                          ? "w-11 h-11 justify-center rounded-xl mx-auto"
                          : "gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                      } ${
                        active
                          ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                      }`;
                    }}
                    title="Takeaway Pickup"
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      <FcPackage size={18} />
                    </div>
                    {!collapsed && <span className="truncate flex-1">Takeaway Pickup</span>}
                  </NavLink>
                </div>
              )}
            </div>

            {/* SECTION 2: ENTERPRISE ERP */}
            <div>
              {!collapsed && (
                <div className="px-2.5 pt-1 pb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Enterprise ERP
                </div>
              )}

              <div className="space-y-1">
                {storeInventoryNav.map((sec) => {
                  const isOpen = expandedSection === sec.id;
                  const isGroupActive =
                    (isDashboard &&
                      (currentTab === sec.summaryTab ||
                        sec.subItems.some((s) => s.tab === currentTab))) ||
                    (sec.mainTo === location.pathname && !isDashboard);

                  return (
                    <div key={sec.id} className="rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          if (collapsed) {
                            navigate(sec.mainTo);
                          } else {
                            // Expand this parent only and navigate to summary view of all child items
                            setExpandedSection(sec.id);
                            navigate(sec.mainTo);
                          }
                        }}
                        className={`w-full flex items-center transition-all ${
                          collapsed
                            ? "w-11 h-11 justify-center rounded-xl mx-auto"
                            : "justify-between px-3 py-2 rounded-lg text-[13px]"
                        } ${
                          isGroupActive
                            ? "bg-[#F1F3F5] dark:bg-slate-800 text-slate-950 dark:text-white font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-white font-medium"
                        }`}
                        title={sec.title}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="shrink-0">{sec.icon}</span>
                          {!collapsed && <span className="truncate">{sec.title}</span>}
                        </div>

                        {!collapsed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {sec.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-2xs ${
                                  sec.badgeColor || "bg-rose-500"
                                }`}
                              >
                                {sec.badge}
                              </span>
                            )}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSection(sec.id);
                              }}
                              className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-md transition"
                              title={isOpen ? "Collapse section" : "Expand section"}
                            >
                              <MdChevronRight
                                size={15}
                                className={`text-slate-400 transition-transform duration-200 ${
                                  isOpen ? "rotate-90" : "rotate-0"
                                }`}
                              />
                            </span>
                          </div>
                        )}
                      </button>

                      {!collapsed && isOpen && (
                        <div className="pl-6 pr-1 py-1 space-y-0.5">
                          {sec.subItems.map((sub) => {
                            const active =
                              (isDashboard && currentTab === sub.tab) ||
                              (sub.to === location.pathname && !isDashboard);

                            return (
                              <NavLink
                                key={sub.label}
                                to={sub.to}
                                className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12px] transition ${
                                  active
                                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border-l-2 border-amber-500"
                                    : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40 font-medium"
                                }`}
                              >
                                <span
                                  className={`shrink-0 transition-colors ${
                                    active
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                                  }`}
                                >
                                  {sub.icon}
                                </span>
                                <span className="truncate">{sub.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer User Info */}
      {!collapsed && (
        <div
          className={`p-3 border-t transition-colors ${
            isClean ? "border-slate-100 bg-slate-50/50" : "border-slate-800/80 bg-slate-900/40"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-slate-200 dark:ring-slate-700 shrink-0">
              {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                {userData.name || "User"}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate capitalize font-medium">
                {isCashierMode ? "Cashier Mode" : "Manager ERP Mode"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ModernSidebar;
