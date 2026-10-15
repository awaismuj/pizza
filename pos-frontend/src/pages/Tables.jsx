import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getTables } from "../https";

const Tables = () => {
  const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "POS | Tables"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }, [isError]);

  const tables = resData?.data?.data ?? [];

  const visibleTables =
    status === "booked" ? tables.filter((table) => table.status === "Booked") : tables;

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-10">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-lg ${
              status === "all" && "bg-[#383838] rounded-lg px-5 py-2"
            }  rounded-lg px-5 py-2 font-semibold`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-[#ababab] text-lg ${
              status === "booked" && "bg-[#383838] rounded-lg px-5 py-2"
            }  rounded-lg px-5 py-2 font-semibold`}
          >
            Booked
          </button>
        </div>
      </div>

      {/* pb-40 clears both the fixed BottomNav and the WhatsApp button
          that floats above it (global, on every page) - pb-28 was only
          sized for the nav bar, so the last row of cards ended up hidden
          behind WhatsApp with no way to scroll past it. */}
      <div className="grid grid-cols-1 gap-3 px-4 py-4 pb-40 flex-1 overflow-y-scroll scrollbar-hide sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10 xl:grid-cols-5 xl:px-16">
        {visibleTables.length === 0 && (
          <p className="col-span-full text-gray-500">No tables yet — add one from the Dashboard.</p>
        )}
        {visibleTables.map((table) => {
          return (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails?.name}
              seats={table.seats}
            />
          );
        })}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
