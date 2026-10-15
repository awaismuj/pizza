// Automatically "closes the books" for a day: at 11:59pm server time, works
// out that day's revenue minus expenses and writes it as a locked
// DailyProfit record — the "actual profit" for the day, deducting whatever
// expenses were logged against it. Once locked, getDailyProfit serves that
// frozen number for that day instead of recomputing, so historical figures
// don't drift if e.g. an old order gets edited later.
//
// No external scheduler/cron package needed — this just checks the clock
// once a minute, which is more than accurate enough for an "end of day"
// job and keeps the dependency list untouched.
const DailyProfit = require("../models/dailyProfitModel");
const { todayKey, computeDayFigures } = require("../utils/profitService");

const CHECK_INTERVAL_MS = 60 * 1000;

const lockDayIfDue = async () => {
  const now = new Date();
  // Fires once the clock hits 23:59 and stays true until midnight, but
  // findOneAndUpdate below is a no-op on every check after the first
  // because the record already exists — safe to call every minute.
  if (now.getHours() !== 23 || now.getMinutes() < 59) return;

  const dayKey = todayKey();
  const alreadyLocked = await DailyProfit.exists({ dayKey });
  if (alreadyLocked) return;

  const figures = await computeDayFigures(dayKey);

  // Upsert (rather than plain create) so a restart in the same minute, or a
  // second server process, can never create a duplicate/conflicting lock
  // for the same day.
  await DailyProfit.findOneAndUpdate(
    { dayKey },
    { ...figures, lockedAt: new Date() },
    { upsert: true, setDefaultsOnInsert: true }
  );

  console.log(`💰 Locked daily profit for ${dayKey}: revenue ${figures.revenue}, expenses ${figures.expenses}, profit ${figures.profit}`);
};

const startDailyProfitScheduler = () => {
  setInterval(() => {
    lockDayIfDue().catch((err) => console.error("Daily profit lock failed:", err));
  }, CHECK_INTERVAL_MS);
};

module.exports = { startDailyProfitScheduler };
