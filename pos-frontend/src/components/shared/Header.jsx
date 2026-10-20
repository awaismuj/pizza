import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOut } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout, getLowStockItems } from "../../https";
import { LOW_STOCK_QUERY_KEY, OPEN_LOW_STOCK_EVENT, isStockRole } from "./LowStockAlert";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdDeliveryDining, MdReceiptLong } from "react-icons/md";
import genzLogo from "../../assets/images/genz-pizza-land-logo.jpg";
import ExpenseQuickAdd from "./ExpenseQuickAdd";
import OrderSearch from "../menu/OrderSearch";
import MusicPlayer from "./MusicPlayer";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expenseOpen, setExpenseOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      console.log(data);
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Bell badge = how many inventory items are low / out of stock. Same query
  // as the popup, so it costs no extra requests. Admin + Cashier only.
  const canSeeStock = userData.isAuth && isStockRole(userData.role);
  const { data: lowStockData } = useQuery({
    queryKey: LOW_STOCK_QUERY_KEY,
    queryFn: getLowStockItems,
    enabled: canSeeStock,
    refetchInterval: 15000,
  });
  const lowStockCount = canSeeStock ? lowStockData?.data?.data?.length ?? 0 : 0;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    // Every icon here (dashboard, online, bell, expenses, user card) can be
    // visible at the same time, so this row needs to shrink gracefully
    // across the whole desktop range — not just "mobile vs desktop" — or it
    // squeezes/wraps badly on the ~1024-1366px width common on 13-14"
    // laptops (especially with Windows display scaling), even though it
    // looks fine on a phone (everything collapses) and on a wide 15-16"+
    // laptop (there's simply more room). `min-w-0` + `truncate` let the
    // flex children actually shrink instead of forcing the row to overflow.
    <header className="flex flex-wrap items-center justify-between gap-2 py-3 px-3 bg-[#1a1a1a] sm:gap-3 sm:px-4 lg:flex-nowrap lg:gap-4 lg:px-8 lg:py-4">
      {/* LOGO */}
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to home"
          className="flex min-w-0 items-center gap-2 text-left"
        >
          <img
            src={genzLogo}
            alt="GenZ Pizza Land"
            className="h-8 w-8 shrink-0 rounded-full object-cover shadow-sm lg:h-9 lg:w-9"
          />
          <h1 className="truncate text-base font-semibold text-[#f5f5f5] tracking-wide lg:text-lg">
            GenZ Pizza Land
          </h1>
        </button>
        <MusicPlayer variant="compact" canManage={String(userData.role || "").toLowerCase() === "admin"} />
      </div>

      {/* SEARCH - only where there's real room for it, so it never competes
          with the icons for space in the tight 1024-1366px band. */}
      <div className="order-last hidden min-w-0 flex-1 lg:order-none lg:block lg:max-w-xs xl:max-w-[500px]">
        <OrderSearch variant="header" />
      </div>

      {/* LOGGED USER DETAILS */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
        {["admin", "accountant", "asset manager", "read only"].includes(String(userData.role || "").toLowerCase()) && (
          <div
            onClick={() => navigate("/dashboard")}
            title="Dashboard"
            className="rounded-[12px] bg-[#1f1f1f] p-2.5 cursor-pointer lg:rounded-[15px] lg:p-3"
          >
            <MdDashboard className="text-[#f5f5f5] text-xl lg:text-2xl" />
          </div>
        )}
        <div
          onClick={() => navigate("/online-orders")}
          title="Online orders"
          className="hidden rounded-[12px] bg-[#1f1f1f] p-2.5 cursor-pointer md:block lg:rounded-[15px] lg:p-3"
        >
          <MdDeliveryDining className="text-[#f5f5f5] text-xl lg:text-2xl" />
        </div>
        <div
          onClick={() => setExpenseOpen(true)}
          title="Add expense"
          className="hidden rounded-[12px] bg-[#1f1f1f] p-2.5 cursor-pointer md:block lg:rounded-[15px] lg:p-3"
        >
          <MdReceiptLong className="text-[#f5f5f5] text-xl lg:text-2xl" />
        </div>
        <div
          onClick={() => canSeeStock && window.dispatchEvent(new Event(OPEN_LOW_STOCK_EVENT))}
          title={lowStockCount > 0 ? `${lowStockCount} item(s) low on stock` : "No stock alerts"}
          className="relative hidden rounded-[12px] bg-[#1f1f1f] p-2.5 cursor-pointer md:block lg:rounded-[15px] lg:p-3"
        >
          <FaBell className={`text-xl lg:text-2xl ${lowStockCount > 0 ? "text-[#f6b100]" : "text-[#f5f5f5]"}`} />
          {lowStockCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#be3e3f] px-1 text-[11px] font-bold text-white">
              {lowStockCount}
            </span>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 lg:gap-3 cursor-pointer">
          <FaUserCircle className="shrink-0 text-[#f5f5f5] text-2xl sm:text-3xl lg:text-4xl" />
          <div className="hidden min-w-0 max-w-[140px] flex-col items-start xl:flex">
            <h1 className="w-full truncate text-md text-[#f5f5f5] font-semibold tracking-wide">
              {userData.name || "TEST USER"}
            </h1>
            <p className="w-full truncate text-xs text-[#ababab] font-medium">
              {userData.role || "Role"}
            </p>
          </div>
          <IoLogOut
            onClick={handleLogout}
            className="shrink-0 text-[#f5f5f5] ml-1 lg:ml-2"
            size={28}
          />
        </div>
      </div>

      <ExpenseQuickAdd open={expenseOpen} onClose={() => setExpenseOpen(false)} />
    </header>
  );
};

export default Header;
