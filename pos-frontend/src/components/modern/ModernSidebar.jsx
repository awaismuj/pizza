import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MdRestaurantMenu,
  MdTableBar,
  MdOutlineReorder,
  MdDeliveryDining,
  MdDashboard,
  MdReceiptLong,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { FaBell, FaVolumeUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getLowStockItems } from "../../https";
import { isStockRole, LOW_STOCK_QUERY_KEY, OPEN_LOW_STOCK_EVENT } from "../shared/LowStockAlert";
import genzLogo from "../../assets/images/genz-pizza-land-logo.jpg";
import MusicPlayer from "../shared/MusicPlayer";

const ModernSidebar = ({ collapsed, setCollapsed, onOpenNewOrder, onOpenExpense }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const isAdmin = ["admin", "accountant", "asset manager", "read only"].includes(
    String(userData.role || "").toLowerCase()
  );

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

  const navItems = [
    {
      to: "/menu",
      label: "POS Terminal",
      short: "POS",
      icon: <MdRestaurantMenu size={22} />,
      badge: null,
      desc: "Order & Cashier",
    },
    {
      to: "/tables",
      label: "Tables & Floors",
      short: "Tables",
      icon: <MdTableBar size={22} />,
      badge: null,
      desc: "Floor seating plan",
    },
    {
      to: "/orders",
      label: "Dine-In Orders",
      short: "Kitchen",
      icon: <MdOutlineReorder size={22} />,
      badge: inProgressDineIn > 0 ? inProgressDineIn : null,
      badgeColor: "bg-amber-500",
      desc: "Kitchen display",
    },
    {
      to: "/online-orders",
      label: "Online Orders",
      short: "Online",
      icon: <MdDeliveryDining size={24} />,
      badge: pendingOnline > 0 ? pendingOnline : null,
      badgeColor: "bg-emerald-500 animate-pulse",
      desc: "Delivery & pickup",
    },
    {
      to: "/outdoor",
      label: "Takeaway & Outdoor",
      short: "Outdoor",
      icon: <MdOutlineShoppingBag size={22} />,
      badge: null,
      desc: "Counter takeaway",
    },
  ];

  if (isAdmin) {
    navItems.push({
      to: "/dashboard",
      label: "Management Hub",
      short: "Admin",
      icon: <MdDashboard size={22} />,
      badge: null,
      desc: "Menu, stock & reports",
    });
  }

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0F172A] border-r border-slate-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-900/50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 overflow-hidden text-left focus:outline-none"
        >
          <img
            src={genzLogo}
            alt="GenZ Pizza Land"
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500/40 shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-bold tracking-tight text-white truncate">
                GenZ Pizza Land
              </h2>
              <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Tossdown POS
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs hidden md:block"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Quick Action Button: New Order */}
      <div className="p-3">
        <button
          type="button"
          onClick={onOpenNewOrder}
          className={`w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition shadow-lg ${
            collapsed
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20"
          }`}
          title="New Dine-In Order"
        >
          <BiSolidDish size={20} className="shrink-0" />
          {!collapsed && <span>+ New Order</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title={item.label}
            >
              <div
                className={`shrink-0 ${
                  active ? "text-slate-950" : "text-slate-400 group-hover:text-amber-400"
                }`}
              >
                {item.icon}
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="truncate">
                    <p className="truncate text-xs leading-none">{item.label}</p>
                    <p
                      className={`text-[10px] leading-tight truncate mt-0.5 ${
                        active ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-[11px] font-extrabold rounded-full text-white ${
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

        {/* Quick Tools Divider */}
        <div className="pt-3 border-t border-slate-800/80 my-2">
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
              Quick Operations
            </p>
          )}

          <button
            type="button"
            onClick={onOpenExpense}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition group"
            title="Add Cash Expense"
          >
            <MdReceiptLong size={20} className="text-slate-400 group-hover:text-amber-400 shrink-0" />
            {!collapsed && <span>Record Expense</span>}
          </button>

          {canSeeStock && (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_LOW_STOCK_EVENT))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition group ${
                lowStockCount > 0 ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20" : "text-slate-300 hover:bg-slate-800"
              }`}
              title={lowStockCount > 0 ? `${lowStockCount} items need restock` : "Inventory Stock"}
            >
              <FaBell size={18} className="shrink-0" />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Stock Alerts</span>
                  {lowStockCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {lowStockCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Music Player & System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="mb-2">
          <MusicPlayer
            variant="compact"
            canManage={String(userData.role || "").toLowerCase() === "admin"}
          />
        </div>

        {!collapsed && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              POS Online
            </span>
            <span className="text-[10px] text-slate-400 font-mono">v2.0-TD</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ModernSidebar;
