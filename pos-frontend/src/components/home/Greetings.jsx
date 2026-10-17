import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUITheme } from "../../context/UIThemeContext";

const Greetings = () => {
  const userData = useSelector(state => state.user);
  const { isClean } = useUITheme();
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
    <div className="flex flex-col gap-3 px-0 md:flex-row md:items-center md:justify-between mb-1">
      <div className="min-w-0">
        <h1
          className={`text-xl font-black tracking-tight sm:text-2xl ${
            isClean ? "text-slate-900" : "text-white"
          }`}
        >
          {greetingText}, {userData.name || "Shift Manager"}
        </h1>
        <p
          className={`text-xs sm:text-sm mt-0.5 ${
            isClean ? "text-slate-600 font-medium" : "text-slate-400"
          }`}
        >
          Terminal ready. Monitor live sales, manage floor tables, and fulfill kitchen orders.
        </p>
      </div>

      <div
        className={`flex items-center gap-4 px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-auto transition-colors ${
          isClean
            ? "bg-white border border-slate-200/90 text-slate-800"
            : "bg-slate-900/90 border border-slate-800 text-white"
        }`}
      >
        <div className="text-right">
          <p
            className={`text-xl font-bold tracking-tight font-mono leading-none ${
              isClean ? "text-slate-900" : "text-white"
            }`}
          >
            {formatTime(dateTime)}
          </p>
          <p
            className={`text-[11px] font-semibold mt-1 ${
              isClean ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {formatDate(dateTime)}
          </p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Synchronized"></span>
      </div>
    </div>
  );
};

export default Greetings;
