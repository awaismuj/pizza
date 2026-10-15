import React, { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders, getCategories, getDishes, getTables } from "../../https";
import { computeMonthlyMetrics, computeOverallMetrics, formatCurrency } from "../../utils/orderMetrics";

const Metrics = () => {
  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: keepPreviousData,
  });
  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    placeholderData: keepPreviousData,
  });
  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    placeholderData: keepPreviousData,
  });

  const orders = ordersData?.data?.data ?? [];
  const categories = categoriesData?.data?.data ?? [];
  const dishes = dishesData?.data?.data ?? [];
  const tables = tablesData?.data?.data ?? [];

  const monthly = useMemo(() => computeMonthlyMetrics(orders), [orders]);
  const overall = useMemo(() => computeOverallMetrics(orders), [orders]);

  const metricsData = [
    {
      title: "Revenue",
      value: `Rs ${formatCurrency(monthly.revenue.value)}`,
      percentage: `${monthly.revenue.percentage}%`,
      color: "#025cca",
      isIncrease: monthly.revenue.percentage >= 0,
    },
    {
      title: "Total Orders",
      value: monthly.totalOrders.value,
      percentage: `${monthly.totalOrders.percentage}%`,
      color: "#02ca3a",
      isIncrease: monthly.totalOrders.percentage >= 0,
    },
    {
      title: "Total Customers",
      value: monthly.totalCustomers.value,
      percentage: `${monthly.totalCustomers.percentage}%`,
      color: "#f6b100",
      isIncrease: monthly.totalCustomers.percentage >= 0,
    },
    {
      title: "Items Sold",
      value: monthly.itemsSold.value,
      percentage: `${monthly.itemsSold.percentage}%`,
      color: "#be3e3f",
      isIncrease: monthly.itemsSold.percentage >= 0,
    },
  ];

  const itemsData = [
    { title: "Total Categories", value: categories.length, color: "#5b45b0" },
    { title: "Total Dishes", value: dishes.length, color: "#285430" },
    { title: "Active Orders", value: overall.activeOrders, color: "#735f32" },
    { title: "Total Tables", value: tables.length, color: "#7f167f" },
  ];

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Live revenue and order stats, updated as orders come in.
          </p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]">
          Last 1 Month
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metricsData.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Item Details
          </h2>
          <p className="text-sm text-[#ababab]">
            Current menu and order counts.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {itemsData.map((item, index) => {
            return (
              <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                </div>
                <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
