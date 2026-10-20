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
import { useNavigate, useLocation } from "react-router-dom";
import { useUITheme } from "../../context/UIThemeContext";
import { isStockRole, LOW_STOCK_QUERY_KEY } from "../shared/LowStockAlert";
import MusicPlayer from "../shared/MusicPlayer";
import AlertsDrawer from "./AlertsDrawer";
import ShiftDrawer from "./ShiftDrawer";
import { getCurrentShift } from "../../https";
import { MdPointOfSale } from "react-icons/md";

const ModernHeader = ({ collapsed }) => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isClean, toggleColorTheme } = useUITheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const notifRef = useRef(null);

  const { data: shiftStatusData } = useQuery({
    queryKey: ["currentShift"],
    queryFn: async () => (await getCurrentShift()).data,
    refetchInterval: 15000,
  });
  const isShiftOpen = shiftStatusData?.isOpen;

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
        return "Live Shift Overview";
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
          Metrics: "Sales Analytics",
          Orders: "Order History",
          Profit: "Profit & Loss",
          Payments: "Payment Audits",
          Menu: "Dishes Catalog",
          Inventory: "Stock Balance",
          Staff: "Staff & Payroll",
          Deals: "Combo Deals",
          "Hero Slider": "Website Banners",
          Tax: "Tax & Billing Settings",
          Printers: "Thermal Hardware Printers",
          Assets: "Fixed Asset Register",
          Music: "In-Store Ambient Music",
          "Build Your Own": "Build Your Own Deal",
          "Finance Operations": "Finance Overview",
          "Stock Operations": "Inventory Overview",
          "Menu Operations": "Menu Overview",
          "HR Operations": "Staff Overview",
          "Marketing Operations": "Storefront Overview",
          "Admin Operations": "Administration Overview",
        };
        const label = (tab && tabLabels[tab]) ? tabLabels[tab] : (tab ? tab.replace(/_/g, " ") : "Enterprise ERP");
        return `ERP Portal · ${label}`;
      }
      default:
        return "Restaurant POS";
    }
  };

  const getBreadcrumbInfo = () => {
    if (location.pathname === "/dashboard") {
      const tab = new URLSearchParams(location.search).get("tab") || "Metrics";

      const tabToDept = {
        Metrics: { dept: "Finance", title: "Analytics" },
        Profit: { dept: "Finance", title: "Profit & Loss" },
        Orders: { dept: "Finance", title: "Order History" },
        Payments: { dept: "Finance", title: "Payments" },
        "Finance Operations": { dept: "Finance", title: "Finance Overview" },
        Orders_Summary: { dept: "Finance", title: "Finance Overview" },

        Inventory: { dept: "Inventory", title: "Stock Balance" },
        Assets: { dept: "Inventory", title: "Fixed Assets" },
        "Stock Operations": { dept: "Inventory", title: "Inventory Overview" },
        Inventory_Summary: { dept: "Inventory", title: "Inventory Overview" },

        Menu: { dept: "Menu & Dishes", title: "Dishes" },
        Categories: { dept: "Menu & Dishes", title: "Categories" },
        Deals: { dept: "Menu & Dishes", title: "Combo Deals" },
        "Build Your Own": { dept: "Menu & Dishes", title: "Deal Builder" },
        "Menu Operations": { dept: "Menu & Dishes", title: "Menu Overview" },
        Menu_Summary: { dept: "Menu & Dishes", title: "Menu Overview" },

        Staff: { dept: "Staff & HR", title: "Staff & Payroll" },
        "HR Operations": { dept: "Staff & HR", title: "Staff Overview" },
        CRM_Summary: { dept: "Staff & HR", title: "Staff Overview" },

        "Hero Slider": { dept: "Storefront", title: "Website Banners" },
        "Marketing Operations": { dept: "Storefront", title: "Storefront Overview" },

        Tax: { dept: "Administration", title: "Tax & Billing" },
        Printers: { dept: "Administration", title: "Thermal Printers" },
        Music: { dept: "Administration", title: "Store Music" },
        "Admin Operations": { dept: "Administration", title: "Admin Overview" },
        Settings_Summary: { dept: "Administration", title: "Admin Overview" },
      };

      if (tabToDept[tab]) {
        return tabToDept[tab];
      }

      const cleanTitle = tab ? tab.replace(/_/g, " ") : "Overview";
      return { dept: "Enterprise ERP", title: cleanTitle };
    }

    const pathMap = {
      "/": { dept: "Operations", title: "Overview" },
      "/menu": { dept: "Operations", title: "Counter POS" },
      "/tables": { dept: "Dining Tables", title: "Floor Plan" },
      "/orders": { dept: "Operations", title: "Kitchen Queue" },
      "/online-orders": { dept: "Operations", title: "Online Delivery" },
      "/outdoor": { dept: "Operations", title: "Takeaway Pickup" },
    };

    return pathMap[location.pathname] || { dept: "Operations", title: "Counter POS" };
  };

  const breadcrumb = getBreadcrumbInfo();

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 transition-all duration-300 flex items-center justify-between px-3 sm:px-4 lg:px-6 backdrop-blur-md ${
        isClean
          ? "bg-white/95 border-b border-slate-200/90 text-slate-900 shadow-xs"
          : "bg-[#0B0F19]/95 border-b border-slate-800/80 text-white"
      } ${collapsed ? "left-20" : "left-64"}`}
    >
      {/* Left: Clean Enterprise Breadcrumb Navigation */}
      <div className="flex items-center gap-2.5 text-[13px] font-medium">
        <span className="text-slate-500 dark:text-slate-400 font-semibold">
          {breadcrumb.dept}
        </span>
        <span className="text-slate-300 dark:text-slate-600 text-xs font-bold">›</span>
        <span className="text-slate-900 dark:text-white font-bold tracking-tight">
          {breadcrumb.title}
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

        {/* CASH DRAWER & SHIFT RECONCILIATION BUTTON */}
        <button
          type="button"
          onClick={() => setShowShiftModal(true)}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
            isShiftOpen
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
          }`}
          title={
            isShiftOpen
              ? "Cash drawer shift is active. Click for live tally & reconciliation."
              : "No active shift open. Click to input opening float."
          }
        >
          <MdPointOfSale size={15} />
          <span className="hidden md:inline">{isShiftOpen ? "Till Active" : "Open Till"}</span>
        </button>

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

      {/* Cash Drawer Shift Side Drawer */}
      <ShiftDrawer
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
      />
    </header>

  );
};

export default ModernHeader;
