import React from "react";
import { FaSearch, FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineHistory, MdTableBar, MdDeliveryDining } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout, getTables, getOrders } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useUITheme } from "../../context/UIThemeContext";

const ModernHeader = ({ collapsed }) => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { uiMode, toggleUiMode, isClean, toggleColorTheme } = useUITheme();

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
      case "/dashboard":
        return "Store Administration & Inventory Hub";
      default:
        return "Restaurant POS";
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 backdrop-blur-md ${
        isClean
          ? "bg-white/95 border-b border-slate-200/90 shadow-xs"
          : "bg-[#0F172A]/95 border-b border-slate-800"
      } ${collapsed ? "left-20" : "left-64"}`}
    >
      {/* Current Page Title & Live Status */}
      <div className="flex items-center gap-3">
        <div>
          <h1
            className={`text-base font-extrabold tracking-tight leading-none sm:text-lg ${
              isClean ? "text-slate-900" : "text-white"
            }`}
          >
            {getPageTitle(location.pathname)}
          </h1>
          <p
            className={`text-[11px] hidden sm:block mt-0.5 ${
              isClean ? "text-slate-500 font-medium" : "text-slate-400"
            }`}
          >
            GenZ Pizza Land Operations Management
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden lg:flex items-center gap-2 ml-4">
          <div
            onClick={() => navigate("/tables")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition ${
              isClean
                ? "bg-amber-50/80 border border-amber-200/70 text-amber-900 hover:bg-amber-100"
                : "bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:border-amber-500/50"
            }`}
            title="View table occupancy"
          >
            <MdTableBar className="text-amber-500" size={15} />
            <span>
              Tables:{" "}
              <strong className={isClean ? "text-slate-900 font-bold" : "text-white"}>
                {bookedTables}
              </strong>
              /{totalTables}
            </span>
          </div>

          <div
            onClick={() => navigate("/online-orders")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition ${
              isClean
                ? "bg-emerald-50 border border-emerald-200/80 text-emerald-900 hover:bg-emerald-100"
                : "bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:border-emerald-500/50"
            }`}
            title="View active online orders"
          >
            <MdDeliveryDining className="text-emerald-500" size={16} />
            <span>
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
        {/* LIGHT / DARK COLOR THEME TOGGLE */}
        <button
          type="button"
          onClick={toggleColorTheme}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
            isClean
              ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400"
          }`}
          title={isClean ? "Switch to Dark Void Mode" : "Switch to Clean Restaurant POS Theme"}
        >
          {isClean ? <FaMoon size={12} className="text-slate-600" /> : <FaSun size={12} className="text-amber-400" />}
          <span className="hidden md:inline">{isClean ? "Dark Mode" : "Clean Light"}</span>
        </button>

        {/* REVERT BUTTON - Clear, visible, and 1-click revertable! */}
        <button
          type="button"
          onClick={toggleUiMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 shadow-xs ${
            isClean
              ? "border-amber-500/40 bg-amber-50 hover:bg-amber-100 text-amber-800"
              : "border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
          }`}
          title="Switch between Modern Tossdown UI and Classic POS UI at any time"
        >
          <span className="text-sm">↩️</span>
          <span className="hidden sm:inline">Revert to Classic UI</span>
          <span className="sm:hidden">Classic</span>
        </button>

        {/* User Card */}
        <div
          className={`flex items-center gap-2 pl-2 border-l ${
            isClean ? "border-slate-200" : "border-slate-800"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-amber-500/30">
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
            <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">
              {userData.role || "Role"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => logoutMutation.mutate()}
            className={`p-1.5 rounded-lg transition ${
              isClean
                ? "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
            }`}
            title="Log out of terminal"
          >
            <IoLogOut size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;

