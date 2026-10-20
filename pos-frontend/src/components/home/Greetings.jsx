import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const greetingFor = (hour) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Greetings = () => {
  const userName = useSelector((state) => state.user.name);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const date = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <header className="relative overflow-hidden rounded-2xl border border-[#2b2b2b] bg-gradient-to-br from-[#262626] via-[#1c1c1c] to-[#171717] px-5 py-6 sm:px-8 sm:py-7">
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
  );
};

export default Greetings;
