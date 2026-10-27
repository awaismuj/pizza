import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUITheme } from "../../context/UIThemeContext";

const greetingFor = (hour) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Greetings = () => {
<<<<<<< HEAD
  const userData = useSelector(state => state.user);
  const { isClean } = useUITheme();
  const [dateTime, setDateTime] = useState(new Date());
=======
  const userName = useSelector((state) => state.user.name);
  const [now, setNow] = useState(new Date());
>>>>>>> origin/main

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const date = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const hours = dateTime.getHours();
  const greetingText =
    hours < 12
      ? "Good Morning"
      : hours < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
<<<<<<< HEAD
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
=======
    <header className="relative overflow-hidden rounded-2xl border border-[#2b2b2b] bg-gradient-to-br from-[#262626] via-[#1c1c1c] to-[#171717] px-5 py-4 sm:px-8 sm:py-5">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#f6b100]/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f6b100]">GenZ Pizza Land</p>
          <h1 className="mt-2 break-words text-2xl font-bold text-[#f5f5f5] sm:text-3xl">
            {greetingFor(now.getHours())}, {userName || "there"}
          </h1>
          <p className="mt-1 text-sm text-[#9a9a9a]">Shop overview</p>
        </div>
        <div className="sm:text-right">
          <p className="font-bold tabular-nums leading-none text-[#f5f5f5] text-4xl sm:text-5xl">
            {time}
            <span className="ml-1 align-top text-base font-medium text-[#6f6f6f] sm:text-lg">{seconds}</span>
          </p>
          <p className="mt-2 text-sm text-[#9a9a9a]">{date}</p>
        </div>
      </div>
    </header>
>>>>>>> origin/main
  );
};

export default Greetings;
