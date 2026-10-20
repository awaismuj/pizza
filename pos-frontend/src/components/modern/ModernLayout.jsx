import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ModernSidebar from "./ModernSidebar";
import ModernHeader from "./ModernHeader";
import ModernNewOrderModal from "./ModernNewOrderModal";
import ExpenseQuickAdd from "../shared/ExpenseQuickAdd";
import NewOrderPopup from "../shared/NewOrderPopup";
import LowStockAlert from "../shared/LowStockAlert";
import WhatsAppButton from "../shared/WhatsAppButton";
import { useSelector } from "react-redux";
import { useUITheme } from "../../context/UIThemeContext";

const ModernLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const location = useLocation();
  const { isAuth } = useSelector((state) => state.user);
  const { isClean } = useUITheme();

  // If on /auth or not logged in, render plain children without sidebar/header
  if (location.pathname === "/auth" || !isAuth) {
    return <>{children}</>;
  }

  return (
    <div
      className={`h-screen flex overflow-hidden font-sans transition-colors duration-200 ${
        isClean ? "bg-[#F8FAFC] text-slate-900" : "bg-[#0B0F19] text-slate-100"
      }`}
    >
      {/* POS Navigation Sidebar */}
      <ModernSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onOpenNewOrder={() => setNewOrderOpen(true)}
        onOpenExpense={() => setExpenseOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Top Header */}
        <ModernHeader collapsed={collapsed} />

        {/* Page Content Container - Full Height POS view without window scrolling */}
        <main className="flex-1 mt-16 px-3 sm:px-4 py-3 overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
          <div className="w-full h-full flex flex-col max-w-[1920px] mx-auto min-h-0">
            {children}
          </div>
        </main>
      </div>

      {/* Popups & Modals */}
      <ModernNewOrderModal isOpen={newOrderOpen} onClose={() => setNewOrderOpen(false)} />
      <ExpenseQuickAdd open={expenseOpen} onClose={() => setExpenseOpen(false)} />
      <NewOrderPopup />
      <LowStockAlert />
      {location.pathname !== "/menu" && <WhatsAppButton />}
    </div>
  );
};

export default ModernLayout;
