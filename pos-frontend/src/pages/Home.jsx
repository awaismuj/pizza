import { useEffect, useMemo } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https";
import { computeDailyMetrics, formatCurrency } from "../utils/orderMetrics";
import { useUITheme } from "../context/UIThemeContext";

const Home = () => {
  const { isModern } = useUITheme();

  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });

  const { todayEarnings, earningsChangePct, inProgressCount, inProgressChangePct } =
    useMemo(() => computeDailyMetrics(resData?.data?.data ?? []), [resData]);

  return (
    <section
      className={`${
        isModern ? "bg-transparent" : "bg-[#1f1f1f]"
      } min-h-[calc(100vh-5rem)] overflow-x-hidden pb-8`}
    >
      <div className="flex w-full flex-col gap-3">
        <Greetings />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MiniCard
            title="Total Earnings"
            icon={<BsCashCoin />}
            number={formatCurrency(todayEarnings)}
            footerNum={earningsChangePct}
          />
          <MiniCard
            title="In Progress"
            icon={<GrInProgress />}
            number={inProgressCount}
            footerNum={inProgressChangePct}
          />
        </div>
        <RecentOrders />
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
