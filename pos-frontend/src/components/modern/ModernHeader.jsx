import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
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
  const { uiMode, toggleUiMode } = useUITheme();

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
      className={`fixed top-0 right-0 z-30 h-16 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
        collapsed ? "left-20" : "left-64"
      }`}
    >
      {/* Current Page Title & Live Status */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-none sm:text-lg">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
            GenZ Pizza Land Operations Management
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden lg:flex items-center gap-2 ml-4">
          <div
            onClick={() => navigate("/tables")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 cursor-pointer hover:border-amber-500/50 transition"
            title="View table occupancy"
          >
            <MdTableBar className="text-amber-400" size={14} />
            <span>
              Tables: <strong className="text-white">{bookedTables}</strong>/{totalTables}
            </span>
          </div>

          <div
            onClick={() => navigate("/online-orders")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 cursor-pointer hover:border-emerald-500/50 transition"
            title="View active online orders"
          >
            <MdDeliveryDining className="text-emerald-400" size={16} />
            <span>
              Online Active: <strong className="text-white">{activeOnline}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* REVERT BUTTON - Clear, visible, and 1-click revertable! */}
        <button
          type="button"
          onClick={toggleUiMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition active:scale-95 shadow-sm"
          title="Switch between Modern Tossdown UI and Classic POS UI at any time"
        >
          <span className="text-sm">↩️</span>
          <span className="hidden sm:inline">Revert to Classic UI</span>
          <span className="sm:hidden">Classic</span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs ring-2 ring-slate-800">
            {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-none truncate max-w-[120px]">
              {userData.name || "Staff Member"}
            </span>
            <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
              {userData.role || "Role"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => logoutMutation.mutate()}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
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
