import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSun, FaMoon, FaSearch } from "react-icons/fa";
import {
  IoLogOut,
  IoNotificationsOutline,
  IoCloseOutline,
} from "react-icons/io5";
import {
  FcShop,
  FcBriefcase,
  FcPlanner,
  FcInTransit,
  FcShipped,
  FcMultipleInputs,
} from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout, getTables, getOrders, getLowStockItems } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useUITheme } from "../../context/UIThemeContext";
import { isStockRole, LOW_STOCK_QUERY_KEY } from "../shared/LowStockAlert";
import MusicPlayer from "../shared/MusicPlayer";
import AlertsDrawer from "./AlertsDrawer";

const ModernHeader = ({ collapsed }) => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isClean, toggleColorTheme } = useUITheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);
  const notifRef = useRef(null);

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (err) => {
      console.error("Logout error", err);
    },
  });

  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    refetchInterval: 15000,
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 15000,
  });

  const canSeeStock = userData.isAuth && isStockRole(userData.role);
  const { data: lowStockData } = useQuery({
    queryKey: LOW_STOCK_QUERY_KEY,
    queryFn: getLowStockItems,
    enabled: canSeeStock,
    refetchInterval: 15000,
  });

  const tables = tablesData?.data?.data || [];
  const bookedTables = tables.filter((t) => t.status === "Booked").length;
  const totalTables = tables.length;

  const orders = ordersData?.data?.data || [];
  const activeOnline = orders.filter(
    (o) => o.orderSource === "Online" && !["Completed", "Cancelled"].includes(o.orderStatus)
  ).length;

  const inProgressDineIn = orders.filter(
    (o) => o.orderSource !== "Online" && o.orderStatus === "In Progress"
  ).length;

  const lowStockCount = canSeeStock ? lowStockData?.data?.data?.length ?? 0 : 0;

  const totalAlertsCount =
    (activeOnline > 0 ? 1 : 0) +
    (bookedTables > 0 ? 1 : 0) +
    (inProgressDineIn > 0 ? 1 : 0) +
    (lowStockCount > 0 ? 1 : 0);

  const getPageTitle = (path) => {
    switch (path) {
      case "/":
        return "Executive Overview";
      case "/menu":
        return "Point of Sale & Billing";
      case "/tables":
        return "Floor Plan & Table Management";
      case "/orders":
        return "Kitchen Display & Orders";
      case "/online-orders":
        return "Online Delivery Orders Dispatch";
      case "/outdoor":
        return "Takeaway & Outdoor Window";
      case "/dashboard": {
        const tab = new URLSearchParams(location.search).get("tab");
        const tabLabels = {
          Metrics: "Analytics & Executive KPIs",
          Orders: "Order Audit Ledger",
          Profit: "Profit & Loss Financial Statement",
          Payments: "Payment Settlements & Gateways",
          Menu: "Menu Engineering & Dish Catalog",
          Inventory: "Inventory & Stock Control",
          Staff: "Staff & Payroll Management",
          Deals: "Deals & Promotions Manager",
          "Hero Slider": "Web Hero Banner Manager",
          Tax: "Store Settings & Tax Configuration",
          Assets: "Fixed Asset Management",
          Music: "In-Store Ambient Music Player",
          "Build Your Own": "Build Your Own Pizza Configurator",
        };
        return tab && tabLabels[tab] ? `ERP Portal · ${tabLabels[tab]}` : "Food & Beverage ERP Portal";
      }
      default:
        return "Restaurant POS";
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 transition-all duration-300 flex items-center justify-between px-3 sm:px-4 lg:px-6 backdrop-blur-md ${
        isClean
          ? "bg-white/95 border-b border-slate-200/90 text-slate-900 shadow-xs"
          : "bg-[#0B0F19]/95 border-b border-slate-800/80 text-white"
      } ${collapsed ? "left-20" : "left-64"}`}
    >
      {/* Left: Clean Breadcrumb Navigation */}
      <div className="flex items-center gap-2.5 text-[13px] font-medium">
        <span className="text-slate-600 dark:text-slate-300">
          {location.pathname === "/dashboard" ? "Store Operations" : "Front-of-House"}
        </span>
        <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">›</span>
        <span className="text-slate-900 dark:text-white font-semibold tracking-tight">
          {location.pathname === "/dashboard"
            ? new URLSearchParams(location.search).get("tab") || "Analytics Overview"
            : getPageTitle(location.pathname)}
        </span>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="hidden lg:flex items-center relative bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 w-52 xl:w-64 focus-within:border-amber-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition">
          <FaSearch className="text-slate-500 dark:text-slate-400 mr-2 shrink-0" size={12} />
          <input
            type="text"
            placeholder="Search menu, orders..."
            className="bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none text-xs flex-1 font-medium"
          />
          <span className="text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 shadow-2xs font-medium">
            ⌘ K
          </span>
        </div>

        {/* Notifications Icon Button with Clean Alert Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition ${
              showNotifications
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Notifications & Operational Alerts"
          >
            <IoNotificationsOutline size={20} />
            {totalAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 px-0.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[9px] font-bold text-white" />
            )}
          </button>

          {/* Clean Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 rounded-2xl border shadow-xl bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 overflow-hidden z-50 animate-fadeIn">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">
                  Notifications
                </h4>
                {totalAlertsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    {totalAlertsCount} Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    All caught up
                  </span>
                )}
              </div>

              {/* Simplified Clean Notifications */}
              <div className="p-2 space-y-1">
                {activeOnline > 0 && (
                  <div
                    onClick={() => {
                      navigate("/online-orders");
                      setShowNotifications(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Online Delivery Orders
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {activeOnline} pending
                    </span>
                  </div>
                )}

                {bookedTables > 0 && (
                  <div
                    onClick={() => {
                      navigate("/tables");
                      setShowNotifications(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Dining Floor Occupancy
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      {bookedTables}/{totalTables} Seated
                    </span>
                  </div>
                )}

                {inProgressDineIn > 0 && (
                  <div
                    onClick={() => {
                      navigate("/orders");
                      setShowNotifications(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Kitchen Prep Queue
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                      {inProgressDineIn} tickets
                    </span>
                  </div>
                )}

                {lowStockCount > 0 && (
                  <div
                    onClick={() => {
                      navigate("/dashboard?tab=Inventory");
                      setShowNotifications(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Inventory Low Stock
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      {lowStockCount} items
                    </span>
                  </div>
                )}

                {totalAlertsCount === 0 && (
                  <div className="py-6 text-center text-xs text-slate-600 dark:text-slate-300 font-medium">
                    No active alerts. All operations are normal.
                  </div>
                )}
              </div>

              {/* Dropdown Footer: Button to View All in Modal */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    setShowAllAlertsModal(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition text-center shadow-xs"
                >
                  Open Live Alerts Drawer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STORE MUSIC PLAYER */}
        <div className="hidden sm:block">
          <MusicPlayer
            variant="compact"
            canManage={String(userData.role || "").toLowerCase() === "admin"}
          />
        </div>

        {/* LIGHT / DARK COLOR THEME TOGGLE */}
        <button
          type="button"
          onClick={toggleColorTheme}
          className={`p-2 rounded-lg border text-xs transition ${
            isClean
              ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400"
          }`}
          title={isClean ? "Switch to Dark Mode" : "Switch to Clean Light Mode"}
        >
          {isClean ? <FaMoon size={14} className="text-slate-600" /> : <FaSun size={14} className="text-amber-400" />}
        </button>

        {/* User Profile Avatar with Online Ring */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="relative cursor-pointer" onClick={() => navigate("/dashboard?tab=Staff")}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs">
              {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
            title="Log out of terminal"
          >
            <IoLogOut size={20} />
          </button>
        </div>
      </div>

      {/* Live Operational Alerts Drawer */}
      <AlertsDrawer
        isOpen={showAllAlertsModal}
        onClose={() => setShowAllAlertsModal(false)}
      />
    </header>
  );
};

export default ModernHeader;
