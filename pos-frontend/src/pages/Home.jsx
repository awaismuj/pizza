import { useEffect, useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { MdReceiptLong } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import MiniCard from "../components/home/MiniCard";
import QuickActions from "../components/home/QuickActions";
import LiveStatus from "../components/home/LiveStatus";
import KitchenQueue from "../components/prep/KitchenQueue";
import RecentOrders from "../components/home/RecentOrders";
import { getOrders } from "../https";
<<<<<<< HEAD
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
=======
import { computeDailyMetrics, computeHomeStats, formatCurrency } from "../utils/orderMetrics";

const Home = () => {
  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  const { data: resData, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });
  const orders = useMemo(() => resData?.data?.data ?? [], [resData]);

  useEffect(() => {
    if (isError) enqueueSnackbar("Could not load orders.", { variant: "error" });
  }, [isError]);

  const metrics = useMemo(() => computeDailyMetrics(orders), [orders]);
  const stats = useMemo(() => computeHomeStats(orders), [orders]);

  return (
    <section className="min-h-[calc(100vh-5rem)] overflow-x-hidden bg-[#1f1f1f] px-3 pb-36 pt-3 sm:px-5 md:px-8">
      <div className="mx-auto w-full">
        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <Greetings />

          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            <MiniCard
              title="Earnings today"
              icon={<BsCashCoin />}
              accent="green"
              value={`Rs ${formatCurrency(metrics.todayEarnings)}`}
              change={metrics.earningsChangePct}
              hint="vs yesterday"
              spark={stats.hourly}
            />
            <MiniCard
              title="In progress"
              icon={<GrInProgress />}
              accent="gold"
              value={metrics.inProgressCount}
              change={metrics.inProgressChangePct}
              hint="vs yesterday"
            />
            <MiniCard
              title="Orders today"
              icon={<MdReceiptLong />}
              accent="blue"
              value={stats.ordersToday}
              hint={`${stats.onlineToday} online`}
            />
            <MiniCard
              title="Average order"
              icon={<FaChartLine />}
              accent="red"
              value={`Rs ${formatCurrency(Math.round(stats.averageTicket))}`}
              hint="per paid order"
            />
          </div>

          <QuickActions />

          <KitchenQueue orders={orders} />

          <div className="grid gap-4 2xl:grid-cols-3">
            <div className="min-w-0 2xl:col-span-2">
              <RecentOrders orders={orders} isLoading={isLoading} />
            </div>
            <LiveStatus stageCounts={stats.stageCounts} total={stats.liveCount} cancelledToday={stats.cancelledToday} />
          </div>
>>>>>>> origin/main
        </div>
        <RecentOrders />
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
