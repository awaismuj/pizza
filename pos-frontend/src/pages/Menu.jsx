import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { ColoredPizzaIcon } from "../utils/foodIcons";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useUITheme } from "../context/UIThemeContext";

const Menu = () => {
  const { isClean } = useUITheme();

  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const customerData = useSelector((state) => state.customer);

  return (
    <section className="min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-3 pb-32 lg:pb-4 transition-colors">
      {/* Left Div - Menu & Categories */}
      <div className="w-full lg:flex-[3] flex flex-col min-w-0">
        <div
          className={`flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl border shadow-xs mb-3 transition-colors ${
            isClean
              ? "bg-white border-slate-200/90 text-slate-900"
              : "bg-slate-900/90 border-slate-800 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1
                className={`text-lg sm:text-xl font-bold tracking-tight leading-none ${
                  isClean ? "text-slate-900" : "text-white"
                }`}
              >
                Point of Sale Menu
              </h1>
              <p className={`text-[11px] mt-0.5 ${isClean ? "text-slate-400" : "text-slate-500"}`}>
                Browse categories and add dishes to order
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl flex items-center justify-center ${
                isClean
                  ? "bg-amber-50 border border-amber-200/70"
                  : "bg-slate-800 border border-slate-700/60"
              }`}
            >
              <ColoredPizzaIcon size={24} />
            </div>
            <div className="flex flex-col items-start">
              <h2
                className={`text-xs sm:text-sm font-bold tracking-tight leading-tight ${
                  isClean ? "text-slate-900" : "text-white"
                }`}
              >
                {customerData.customerName || "Walk-In Guest"}
              </h2>
              <p
                className={`text-[11px] font-semibold mt-0.5 ${
                  isClean ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Table: {customerData.table?.tableNo || "Counter / Takeaway"}
              </p>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>

      {/* Right Div - Cart & Billing Checkout Panel */}
      <div
        className={`w-full lg:flex-[1.1] flex flex-col rounded-2xl border shadow-xs overflow-hidden h-fit transition-all ${
          isClean
            ? "bg-white border-slate-200/90 text-slate-900"
            : "bg-slate-900/90 border-slate-800 text-white"
        }`}
      >
        <div className="shrink-0">
          <CustomerInfo />
          <hr className={isClean ? "border-slate-100" : "border-slate-800/80"} />
        </div>
        <CartInfo />
        <div className="shrink-0">
          <hr className={isClean ? "border-slate-100" : "border-slate-800/80"} />
          <Bill />
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
