import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
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
    <section
      className={`min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4 pb-36 lg:pb-6 transition-colors ${
        isClean ? "bg-transparent text-slate-900" : "bg-[#1f1f1f] text-slate-100"
      }`}
    >
      {/* Left Div - Menu & Categories */}
      <div className="w-full lg:flex-[3] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isClean ? "text-slate-900" : "text-[#f5f5f5]"
              }`}
            >
              Point of Sale Menu
            </h1>
          </div>
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isClean ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-slate-800 text-amber-400"
                }`}
              >
                <MdRestaurantMenu size={24} />
              </div>
              <div className="flex flex-col items-start">
                <h2
                  className={`text-sm font-extrabold tracking-wide leading-tight ${
                    isClean ? "text-slate-900" : "text-[#f5f5f5]"
                  }`}
                >
                  {customerData.customerName || "Walk-In Guest"}
                </h2>
                <p
                  className={`text-xs font-semibold ${
                    isClean ? "text-slate-500" : "text-[#ababab]"
                  }`}
                >
                  Table: {customerData.table?.tableNo || "Counter / Takeaway"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>

      {/* Right Div - Cart & Billing Checkout Panel */}
      <div
        className={`w-full lg:flex-[1.1] flex flex-col rounded-2xl border shadow-sm overflow-hidden h-fit transition-all ${
          isClean
            ? "bg-white border-slate-200/90 text-slate-800"
            : "bg-[#1a1a1a] border-slate-800 text-white"
        }`}
      >
        <div className="shrink-0">
          <CustomerInfo />
          <hr className={isClean ? "border-slate-100" : "border-[#2a2a2a]"} />
        </div>
        <CartInfo />
        <div className="shrink-0">
          <hr className={isClean ? "border-slate-100" : "border-[#2a2a2a]"} />
          <Bill />
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
