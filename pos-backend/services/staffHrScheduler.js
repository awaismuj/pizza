const { accrueCurrentYearThroughMonth } = require("./staffLeaveAccrualService");
const { reconcileFinalizedLoanRepayments } = require("./staffLoanService");
const { retryPendingStaffNotifications, notifyStaff } = require("./staffHrNotificationService");
const Staff = require("../models/staffModel");
const { todayKey } = require("../utils/staffService");

const RUN_INTERVAL_MS = 6 * 60 * 60 * 1000;

const sendContractReminders = async () => {
  const today = todayKey();
  const todayDate = new Date(`${today}T00:00:00Z`);
  const reminderLimit = new Date(todayDate.getTime() + 30 * 86400000).toISOString().slice(0, 10);
  const staff = await Staff.find({
    isActive: true,
    contractEndDate: { $ne: "", $lte: reminderLimit },
  }).select("_id contractEndDate").limit(1000);
  for (const employee of staff) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(employee.contractEndDate || "")) {
      console.warn(`Contract reminder skipped for ${employee._id}: invalid contract end date.`);
      continue;
    }
    const contractDate = new Date(`${employee.contractEndDate}T00:00:00Z`);
    if (Number.isNaN(contractDate.getTime())) {
      console.warn(`Contract reminder skipped for ${employee._id}: invalid contract end date.`);
      continue;
    }
    const daysRemaining = Math.ceil((contractDate - todayDate) / 86400000);
    const stage = daysRemaining < 0 ? "expired" : daysRemaining === 0 ? "expiry" : daysRemaining <= 7 ? "7-day" : "30-day";
    const message = daysRemaining < 0
      ? `Your employment contract ended on ${employee.contractEndDate}. Please contact HR.`
      : daysRemaining === 0
        ? "Your employment contract expires today. Please contact HR."
        : `Your employment contract expires on ${employee.contractEndDate} (in ${daysRemaining} days). Please contact HR.`;
    await notifyStaff({
      staffId: employee._id,
      type: "contract-reminder",
      eventKey: `${employee.contractEndDate}:${stage}`,
      subject: "Employment contract reminder",
      message,
    });
  }
};

const startStaffHrScheduler = () => {
  const run = async () => {
    try {
      const { currentMonth, results } = await accrueCurrentYearThroughMonth();
      const created = results.reduce((sum, result) => sum + result.created, 0);
      if (created) console.log(`Created ${created} leave accrual entries through ${currentMonth}.`);
      const reconciled = await reconcileFinalizedLoanRepayments();
      if (reconciled) console.log(`Reconciled loan repayments for ${reconciled} finalized payroll run(s).`);
      const delivered = await retryPendingStaffNotifications();
      if (delivered) console.log(`Delivered ${delivered} queued HR notification(s).`);
      await sendContractReminders();
    } catch (error) {
      console.error("Scheduled HR processing failed:", error);
    }
  };
  setTimeout(run, 15 * 1000);
  setInterval(run, RUN_INTERVAL_MS);
};

module.exports = { startStaffHrScheduler };
