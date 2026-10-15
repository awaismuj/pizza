import React, { useEffect, useMemo } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https";
import { computeDailyMetrics, formatCurrency } from "../utils/orderMetrics";

const Home = () => {

    useEffect(() => {
      document.title = "POS | Home"
    }, [])

    const { data: resData } = useQuery({
      queryKey: ["orders"],
      queryFn: getOrders,
      placeholderData: keepPreviousData,
    });

    const { todayEarnings, earningsChangePct, inProgressCount, inProgressChangePct } =
      useMemo(() => computeDailyMetrics(resData?.data?.data ?? []), [resData]);

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] overflow-x-hidden px-3 pb-36 pt-2 sm:px-4 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:gap-3">
        <div className="w-full md:flex-1">
          <Greetings />
          <div className="mt-6 flex w-full flex-col gap-3 px-2 sm:px-4 md:flex-row md:items-stretch md:px-8">
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
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
