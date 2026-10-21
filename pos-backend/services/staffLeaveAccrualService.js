const Staff = require("../models/staffModel");
const { StaffLeaveAccrual, StaffLeaveRequest, StaffLeaveType } = require("../models/staffHrModels");

const monthKeyFromDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const monthRange = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return {
    start: `${monthKey}-01`,
    end: `${year}-${String(month).padStart(2, "0")}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`,
    days: new Date(year, month, 0).getDate(),
  };
};
const daysInRange = (start, end) => {
  if (start > end) return 0;
  return Math.floor((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) + 1;
};
const roundDays = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const monthlyAccrualDays = (annualEntitlementDays, eligibleDays, periodDays) =>
  roundDays((annualEntitlementDays / 12) * (eligibleDays / periodDays));

const approvedLeaveUsed = async (staffId, leaveTypeId, start, end) => {
  const requests = await StaffLeaveRequest.find({
    staff: staffId,
    leaveType: leaveTypeId,
    status: "Approved",
    startDate: { $lte: end },
    endDate: { $gte: start },
  }).select("startDate endDate partialDay").lean();
  return requests.reduce((total, request) => {
    const from = request.startDate > start ? request.startDate : start;
    const to = request.endDate < end ? request.endDate : end;
    return total + Math.max(0, daysInRange(from, to) - (request.partialDay ? 0.5 : 0));
  }, 0);
};

const previousYearCarryForward = async (staffId, leaveType, year) => {
  const previousYear = String(year - 1);
  const start = `${previousYear}-01-01`;
  const end = `${previousYear}-12-31`;
  const accruals = await StaffLeaveAccrual.find({
    staff: staffId,
    leaveType: leaveType._id,
    monthKey: { $gte: `${previousYear}-01`, $lte: `${previousYear}-12` },
  }).select("accruedDays carryForwardDays").lean();
  if (!accruals.length) return 0;
  const accrued = accruals.reduce((sum, item) => sum + item.accruedDays + item.carryForwardDays, 0);
  const used = await approvedLeaveUsed(staffId, leaveType._id, start, end);
  return roundDays(Math.min(leaveType.carryForwardLimitDays || 0, Math.max(0, accrued - used)));
};

const accrueMonth = async (monthKey, source = "Scheduled", actorId = null) => {
  const { start, end, days } = monthRange(monthKey);
  const [staff, leaveTypes] = await Promise.all([
    Staff.find({
      joinDate: { $lte: end },
      $or: [{ isActive: true }, { lastWorkingDate: { $gte: start } }],
    }).select("_id joinDate lastWorkingDate").lean(),
    StaffLeaveType.find({ isActive: true, annualEntitlementDays: { $gt: 0 } }).lean(),
  ]);
  let created = 0;
  let skipped = 0;
  for (const person of staff) {
    const employmentEnd = person.lastWorkingDate && person.lastWorkingDate < end ? person.lastWorkingDate : end;
    for (const leaveType of leaveTypes) {
      const typeStart = leaveType.createdAt instanceof Date
        ? leaveType.createdAt.toISOString().slice(0, 10)
        : String(leaveType.createdAt || start).slice(0, 10);
      const employmentStart = [person.joinDate, start, typeStart].sort().at(-1);
      const eligibleDays = daysInRange(employmentStart, employmentEnd);
      if (!eligibleDays) continue;
      if (await StaffLeaveAccrual.exists({ staff: person._id, leaveType: leaveType._id, monthKey })) {
        skipped += 1;
        continue;
      }
      const accruedDays = monthlyAccrualDays(leaveType.annualEntitlementDays, eligibleDays, days);
      const carryForwardDays = monthKey.endsWith("-01")
        ? await previousYearCarryForward(person._id, leaveType, Number(monthKey.slice(0, 4)))
        : 0;
      try {
        await StaffLeaveAccrual.create({
          staff: person._id,
          leaveType: leaveType._id,
          monthKey,
          accruedDays,
          carryForwardDays,
          source,
          createdBy: actorId,
        });
        created += 1;
      } catch (error) {
        if (error.code !== 11000) throw error;
        skipped += 1;
      }
    }
  }
  return { monthKey, created, skipped };
};

const accrueCurrentYearThroughMonth = async (now = new Date()) => {
  const currentMonth = monthKeyFromDate(now);
  const year = now.getFullYear();
  const results = [];
  for (let month = 1; month <= now.getMonth() + 1; month += 1) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    results.push(await accrueMonth(key));
  }
  return { currentMonth, results };
};

const getLeaveBalances = async ({ staffId, year = new Date().getFullYear() }) => {
  const yearText = String(year);
  const throughMonth = monthKeyFromDate(new Date()).startsWith(yearText)
    ? monthKeyFromDate(new Date())
    : `${yearText}-12`;
  const throughEnd = monthRange(throughMonth).end;
  const [staff, leaveTypes, accruals, requests] = await Promise.all([
    Staff.find(staffId ? { _id: staffId, isActive: true } : { isActive: true })
      .select("_id employeeId name department branch").sort({ name: 1 }).lean(),
    StaffLeaveType.find({ isActive: true, annualEntitlementDays: { $gt: 0 } }).sort({ name: 1 }).lean(),
    StaffLeaveAccrual.find({ monthKey: { $gte: `${yearText}-01`, $lte: throughMonth } }).lean(),
    StaffLeaveRequest.find({
      status: "Approved",
      startDate: { $lte: throughEnd },
      endDate: { $gte: `${yearText}-01-01` },
    }).select("staff leaveType startDate endDate partialDay").lean(),
  ]);
  const result = [];
  for (const person of staff) {
    for (const leaveType of leaveTypes) {
      const personAccruals = accruals.filter((entry) =>
        String(entry.staff) === String(person._id) && String(entry.leaveType) === String(leaveType._id)
      );
      const earned = personAccruals.reduce((sum, entry) => sum + entry.accruedDays, 0);
      const carried = personAccruals.reduce((sum, entry) => sum + entry.carryForwardDays, 0);
      const used = requests.filter((request) =>
        String(request.staff) === String(person._id) &&
        String(request.leaveType) === String(leaveType._id)
      ).reduce((sum, request) => {
        const from = request.startDate > `${yearText}-01-01` ? request.startDate : `${yearText}-01-01`;
        const endOfPeriod = throughEnd;
        const to = request.endDate < endOfPeriod ? request.endDate : endOfPeriod;
        return sum + Math.max(0, daysInRange(from, to) - (request.partialDay ? 0.5 : 0));
      }, 0);
      result.push({
        staffId: person._id,
        employeeId: person.employeeId,
        name: person.name,
        department: person.department,
        branch: person.branch,
        leaveTypeId: leaveType._id,
        leaveType: leaveType.name,
        year: Number(yearText),
        annualEntitlementDays: leaveType.annualEntitlementDays,
        accruedDays: roundDays(earned),
        carryForwardDays: roundDays(carried),
        usedDays: roundDays(used),
        availableDays: roundDays(earned + carried - used),
      });
    }
  }
  return result;
};

module.exports = { accrueMonth, accrueCurrentYearThroughMonth, getLeaveBalances, daysInRange, monthlyAccrualDays };
