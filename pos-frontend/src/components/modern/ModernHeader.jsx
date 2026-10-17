import React from "react";
import { FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdTableBar, MdDeliveryDining } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout, getTables, getOrders } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useUITheme } from "../../context/UIThemeContext";
import MusicPlayer from "../shared/MusicPlayer";

const ModernHeader = ({ collapsed }) => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isClean, toggleColorTheme } = useUITheme();

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

  const tables = tablesData?.data?.data || [];
  const bookedTables = tables.filter((t) => t.status === "Booked").length;
  const totalTables = tables.length;

  const orders = ordersData?.data?.data || [];
  const activeOnline = orders.filter(
    (o) => o.orderSource === "Online" && !["Completed", "Cancelled"].includes(o.orderStatus)
  ).length;

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
      {/* Current Page Title & Live Status */}
      <div className="flex items-center gap-3">
        <div>
          <h1
            className={`text-sm sm:text-base font-extrabold tracking-tight leading-none ${
              isClean ? "text-slate-900" : "text-white"
            }`}
          >
            {getPageTitle(location.pathname)}
          </h1>
          <p
            className={`text-[10px] sm:text-[11px] hidden sm:block mt-0.5 ${
              isClean ? "text-slate-400 font-medium" : "text-slate-500 font-medium"
            }`}
          >
            GenZ Pizza Land Operations Management
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden lg:flex items-center gap-2 ml-3">
          <div
            onClick={() => navigate("/tables")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer transition border ${
              isClean
                ? "bg-amber-50/70 border-amber-200/80 text-amber-900 hover:bg-amber-100/80"
                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-500/50"
            }`}
            title="View table occupancy"
          >
            <MdTableBar className="text-amber-500 shrink-0" size={15} />
            <span className="text-[11px] font-medium">
              Tables:{" "}
              <strong className={isClean ? "text-slate-950 font-bold" : "text-white"}>
                {bookedTables}
              </strong>
              /{totalTables}
            </span>
          </div>

          <div
            onClick={() => navigate("/online-orders")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer transition border ${
              isClean
                ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100/80"
                : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-500/50"
            }`}
            title="View active online orders"
          >
            <MdDeliveryDining className="text-emerald-500 shrink-0" size={16} />
            <span className="text-[11px] font-medium">
              Online Active:{" "}
              <strong className={isClean ? "text-emerald-950 font-bold" : "text-white"}>
                {activeOnline}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
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
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
            isClean
              ? "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
              : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400"
          }`}
          title={isClean ? "Switch to Dark Mode" : "Switch to Clean Light Mode"}
        >
          {isClean ? <FaMoon size={12} className="text-slate-600" /> : <FaSun size={12} className="text-amber-400" />}
          <span className="hidden md:inline text-[11px] font-bold">{isClean ? "Dark Mode" : "Clean Light"}</span>
        </button>

        {/* User Card */}
        <div
          className={`flex items-center gap-2 pl-2 border-l ${
            isClean ? "border-slate-200" : "border-slate-800"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-amber-500/30 shrink-0 shadow-xs">
            {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="hidden xl:flex flex-col text-left">
            <span
              className={`text-xs font-bold leading-none truncate max-w-[120px] ${
                isClean ? "text-slate-900" : "text-white"
              }`}
            >
              {userData.name || "Staff Member"}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider mt-0.5">
              {userData.role || "Role"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => logoutMutation.mutate()}
            className={`p-1.5 rounded-lg transition ${
              isClean
                ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            }`}
            title="Log out of terminal"
          >
            <IoLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
