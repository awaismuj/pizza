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

const ModernLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const location = useLocation();
  const { isAuth } = useSelector((state) => state.user);

  // If on /auth or not logged in, render plain children without sidebar/header
  if (location.pathname === "/auth" || !isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex overflow-x-hidden font-sans">
      {/* Tossdown Navigation Sidebar */}
      <ModernSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onOpenNewOrder={() => setNewOrderOpen(true)}
        onOpenExpense={() => setExpenseOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Top Header */}
        <ModernHeader collapsed={collapsed} />

        {/* Page Content Container (with top clearance for header) */}
        <main className="flex-1 mt-16 p-4 sm:p-6 overflow-y-auto">
          {children}
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
