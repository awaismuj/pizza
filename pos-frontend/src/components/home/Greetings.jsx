import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Greetings = () => {
  const userData = useSelector(state => state.user);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
  };

  const formatTime = (date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  const hours = dateTime.getHours();
  const greetingText =
    hours < 12
      ? "Good Morning"
      : hours < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="flex flex-col gap-3 px-2 sm:px-4 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="min-w-0">
        <h1 className="text-white text-xl font-extrabold tracking-tight sm:text-2xl">
          {greetingText}, {userData.name || "Shift Manager"}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Terminal ready. Monitor live sales, manage floor tables, and fulfill kitchen orders.
        </p>
      </div>

      <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-md self-start md:self-auto">
        <div className="text-right">
          <p className="text-white text-xl font-bold tracking-tight font-mono leading-none">
            {formatTime(dateTime)}
          </p>
          <p className="text-slate-400 text-[11px] font-medium mt-1">
            {formatDate(dateTime)}
          </p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Synchronized"></span>
      </div>
    </div>
  );
};

export default Greetings;
