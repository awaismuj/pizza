const { ensureAttendance, todayKey } = require("../utils/staffService");

// Keeps today's attendance auto-marked Present for every active staff
// member. Runs at startup and every 30 minutes; also runs lazily whenever
// attendance is viewed, so nothing depends on this timer alone.
const startStaffAttendanceScheduler = () => {
  const run = () => ensureAttendance([todayKey()]).catch((e) => console.warn("Attendance auto-mark failed:", e.message));
  setTimeout(run, 10 * 1000);
  setInterval(run, 30 * 60 * 1000);
};

module.exports = { startStaffAttendanceScheduler };
