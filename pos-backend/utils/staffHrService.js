const { StaffAdjustment, SalaryPayment } = require("../models/staffPayrollModels");
const Staff = require("../models/staffModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const {
  StaffLeaveRequest,
  StaffOvertime,
  StaffPayrollPolicy,
  StaffLoan,
  StaffLoanRepayment,
} = require("../models/staffHrModels");

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const monthBounds = (monthKey) => {
  if (!MONTH_RE.test(monthKey || "")) throw new Error("Payroll period must be YYYY-MM.");
  const [year, month] = monthKey.split("-").map(Number);
  return {
    start: `${monthKey}-01`,
    end: `${year}-${String(month).padStart(2, "0")}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`,
    days: new Date(year, month, 0).getDate(),
  };
};
const workingDaysInMonth = (monthKey) => {
  const { days } = monthBounds(monthKey);
  const [year, month] = monthKey.split("-").map(Number);
  let count = 0;
  for (let day = 1; day <= days; day += 1) {
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
  }
  return count;
};
const inPeriod = (date, start, end) => date >= start && date <= end;
const prorationRate = (days, divisor) => divisor > 0 ? Math.min(1, days / divisor) : 0;
const allocateLoanRepayments = (repayments, grossPay, currentDeductions, maxDeductionRate) => {
  let capacity = Math.max(0, grossPay - currentDeductions);
  if (maxDeductionRate !== null) {
    capacity = Math.min(capacity, Math.max(0, grossPay * maxDeductionRate - currentDeductions));
  }
  capacity = roundMoney(capacity);
  const deductions = [];
  const snapshots = [];
  const warnings = [];
  for (const { loan, amount } of repayments) {
    const appliedAmount = roundMoney(Math.min(amount, capacity));
    if (appliedAmount > 0) {
      deductions.push({ code: `LOAN_${loan._id}`, name: "Approved loan repayment", amount: appliedAmount });
      snapshots.push({ loan: loan._id, amount: appliedAmount });
      capacity = roundMoney(capacity - appliedAmount);
    }
    if (appliedAmount < amount) {
      warnings.push(`Loan repayment for ${loan._id} was partially deferred because of the configured deduction limit.`);
    }
  }
  return { deductions, snapshots, warnings };
};
const componentProrationRate = (component, dates, periodStart, periodEnd, employmentFrom, employmentTo, divisor, processedOneTime) => {
  if (component.recurring) {
    const effectiveDays = dates.filter((date) =>
      date >= component.effectiveFrom && (!component.effectiveTo || date <= component.effectiveTo)
    ).length;
    return prorationRate(effectiveDays, divisor);
  }
  const componentKey = `${component.code}:${component.effectiveFrom}`;
  if (
    component.effectiveFrom < periodStart ||
    component.effectiveFrom > periodEnd ||
    component.effectiveFrom < employmentFrom ||
    component.effectiveFrom > employmentTo ||
    processedOneTime.has(componentKey)
  ) return 0;
  processedOneTime.add(componentKey);
  return 1;
};

const getPayrollPolicy = async () => {
  const policy = await StaffPayrollPolicy.findOne({ key: "global" }).lean();
  const settings = policy || {
    currency: "PKR",
    financialYearStartMonth: 1,
    jurisdiction: "",
    prorationMethod: "CalendarDays",
    fixedDivisor: null,
    incomeTaxRate: null,
    employeeContributionRate: null,
    employerContributionRate: null,
    maxDeductionRate: null,
    deductUnpaidLeave: false,
    effectiveFrom: "2000-01-01",
  };
  return {
    currency: settings.currency || "PKR",
    financialYearStartMonth: settings.financialYearStartMonth || 1,
    jurisdiction: settings.jurisdiction || "",
    prorationMethod: settings.prorationMethod || "CalendarDays",
    fixedDivisor: settings.fixedDivisor ?? null,
    incomeTaxRate: settings.incomeTaxRate ?? null,
    employeeContributionRate: settings.employeeContributionRate ?? null,
    employerContributionRate: settings.employerContributionRate ?? null,
    maxDeductionRate: settings.maxDeductionRate ?? null,
    deductUnpaidLeave: settings.deductUnpaidLeave === true,
    effectiveFrom: settings.effectiveFrom || "2000-01-01",
  };
};

const calculatePayrollPreview = async (monthKey) => {
  const { start, end, days } = monthBounds(monthKey);
  const [staff, attendance, leaveRequests, overtime, adjustments, policy, payments, loans, loanRepayments] = await Promise.all([
    Staff.find({
      joinDate: { $lte: end },
      $or: [{ isActive: true }, { lastWorkingDate: { $gte: start } }],
    }).sort({ name: 1 }).lean(),
    StaffAttendance.find({ dayKey: { $gte: start, $lte: end } }).lean(),
    StaffLeaveRequest.find({
      status: "Approved",
      startDate: { $lte: end },
      endDate: { $gte: start },
    }).populate("leaveType").lean(),
    StaffOvertime.find({ status: "Approved", date: { $gte: start, $lte: end }, payrollMonth: { $exists: false } }).lean(),
    StaffAdjustment.find({ monthKey, isVoided: { $ne: true } }).lean(),
    getPayrollPolicy(),
    SalaryPayment.find({ monthKey }).lean(),
    StaffLoan.find({ status: "Active", startMonth: { $lte: monthKey } }).lean(),
    StaffLoanRepayment.find({ status: "Posted", monthKey: { $lt: monthKey } }).lean(),
  ]);
  if (policy.effectiveFrom.slice(0, 7) > monthKey) {
    throw new Error(`No payroll policy is effective for ${monthKey}.`);
  }
  const warnings = [];
  if (staff.length === 0) warnings.push("No eligible employees were found for this payroll period.");
  if (!policy.jurisdiction) warnings.push("Payroll jurisdiction has not been configured; statutory calculations require review.");
  if (policy.incomeTaxRate === null) warnings.push("Income tax rate is unconfigured; no income tax was calculated.");
  if (policy.employeeContributionRate === null) warnings.push("Employee statutory contribution rate is unconfigured.");
  if (policy.employerContributionRate === null) warnings.push("Employer contribution rate is unconfigured.");

  const attendanceByStaff = new Map();
  for (const row of attendance) {
    const key = String(row.staff);
    const list = attendanceByStaff.get(key) || [];
    list.push(row);
    attendanceByStaff.set(key, list);
  }
  const paidByStaff = new Map();
  for (const request of leaveRequests) {
    const id = String(request.staff);
    const list = paidByStaff.get(id) || [];
    list.push(request);
    paidByStaff.set(id, list);
  }

  const items = staff.map((person) => {
    const employmentFrom = person.joinDate > start ? person.joinDate : start;
    const employmentTo = ["Resigned", "Terminated", "Retired"].includes(person.employmentStatus)
      ? (person.lastWorkingDate && person.lastWorkingDate < end ? person.lastWorkingDate : end)
      : end;
    const personAttendance = (attendanceByStaff.get(String(person._id)) || []).filter((row) =>
      row.dayKey >= employmentFrom && row.dayKey <= employmentTo
    );
    const personLeaves = paidByStaff.get(String(person._id)) || [];
    const personOvertime = overtime.filter((row) =>
      String(row.staff) === String(person._id) &&
      row.date >= (person.joinDate > start ? person.joinDate : start) &&
      row.date <= (
        ["Resigned", "Terminated", "Retired"].includes(person.employmentStatus) &&
        person.lastWorkingDate && person.lastWorkingDate < end
          ? person.lastWorkingDate
          : end
      )
    );
    const personAdjustments = adjustments.filter((row) => String(row.staff) === String(person._id));
    const confirmedAttendance = personAttendance.filter((row) => !row.auto || row.approvedAt);
    const absentDays = confirmedAttendance.filter((row) => ["Absent", "Half Day"].includes(row.status)).length;
    const presentDays = confirmedAttendance.filter((row) => ["Present", "Late Arrival", "Early Departure", "Work From Home", "Official Duty"].includes(row.status)).length;
    const salaryDivisor = policy.prorationMethod === "FixedDivisor"
      ? Number(policy.fixedDivisor)
      : policy.prorationMethod === "WorkingDays" ? workingDaysInMonth(monthKey) : days;
    const leaveDays = (leave) => {
      const from = [leave.startDate, start, employmentFrom].sort().at(-1);
      const to = [leave.endDate, end, employmentTo].sort()[0];
      if (from > to) return 0;
      let count = 0;
      for (let date = from; date <= to; date = new Date(new Date(`${date}T00:00:00Z`).getTime() + 86400000).toISOString().slice(0, 10)) {
        const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
        if (policy.prorationMethod !== "WorkingDays" || (weekday !== 0 && weekday !== 6)) count += 1;
      }
      return Math.max(0, count - (leave.partialDay ? 0.5 : 0));
    };
    const paidLeaveDays = personLeaves
      .filter((leave) => leave.leaveType?.paid)
      .reduce((total, leave) => total + leaveDays(leave), 0);
    const unpaidLeaveDays = personLeaves
      .filter((leave) => leave.leaveType && !leave.leaveType.paid)
      .reduce((total, leave) => total + leaveDays(leave), 0);
    const salaryHistory = [...(person.salaryHistory || [])]
      .filter((entry) => entry.effectiveAt <= end)
      .sort((a, b) => a.effectiveAt.localeCompare(b.effectiveAt));
    const salaryForDay = (date) => {
      const history = salaryHistory.filter((entry) => entry.effectiveAt <= date).at(-1);
      if (!history && (!person.salaryEffectiveFrom || date < person.salaryEffectiveFrom)) {
        return { baseSalary: 0, components: [] };
      }
      const historySalary = history?.changes?.baseSalary;
      const historicalBase = typeof historySalary === "number" ? historySalary : historySalary?.to;
      return {
        baseSalary: Number.isFinite(Number(historicalBase)) ? Number(historicalBase) : Number(person.baseSalary || 0),
        components: history?.changes?.salaryComponents || person.salaryComponents || [],
      };
    };
    const salaryDayGroups = new Map();
    for (let day = 1; day <= days; day += 1) {
      const date = `${monthKey}-${String(day).padStart(2, "0")}`;
      if (!inPeriod(date, employmentFrom, employmentTo)) continue;
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
      if (policy.prorationMethod === "WorkingDays" && (weekday === 0 || weekday === 6)) continue;
      const salary = salaryForDay(date);
      const key = JSON.stringify(salary);
      const group = salaryDayGroups.get(key) || { ...salary, days: 0, dates: [] };
      group.days += 1;
      group.dates.push(date);
      salaryDayGroups.set(key, group);
    }
    const earningsByCode = new Map();
    const deductionsByCode = new Map();
    const employerByCode = new Map();
    const processedOneTimeComponents = new Set();
    let proratedBaseSalary = 0;
    salaryDayGroups.forEach((group) => {
      const denominator = salaryDivisor > 0 ? salaryDivisor : 0;
      const proratedRate = prorationRate(group.days, denominator);
      proratedBaseSalary += group.baseSalary * proratedRate;
      const components = [
        { code: "BASE", name: "Basic Salary", type: "Earning", amount: group.baseSalary, taxable: true },
        ...group.components,
      ];
      components.forEach((component) => {
        if (component.code === "BASE") {
          earningsByCode.set("BASE", {
            code: "BASE",
            name: "Basic Salary",
            amount: (earningsByCode.get("BASE")?.amount || 0) + group.baseSalary * proratedRate,
            taxable: true,
          });
          return;
        }
        const componentRate = componentProrationRate(
          component, group.dates, start, end, employmentFrom, employmentTo, denominator, processedOneTimeComponents
        );
        if (!componentRate) return;
        const bucket = component.type === "Earning" ? earningsByCode
          : component.type === "Deduction" ? deductionsByCode : employerByCode;
        const existing = bucket.get(component.code);
        bucket.set(component.code, {
          code: component.code,
          name: component.name,
          amount: (existing?.amount || 0) + Number(component.amount || 0) * componentRate,
          taxable: component.taxable === true,
        });
      });
    });
    const earnings = [...earningsByCode.values()].map((item) => ({ ...item, amount: roundMoney(item.amount) }));
    const salaryDeductions = [...deductionsByCode.values()].map((item) => ({ ...item, amount: roundMoney(item.amount) }));
    const employerContributions = [...employerByCode.values()].map((item) => ({ ...item, amount: roundMoney(item.amount) }));
    const overtimePay = roundMoney(personOvertime.reduce((sum, row) =>
      sum + row.hoursApproved * row.hourlyRate * row.rateMultiplier, 0));
    if (overtimePay > 0) earnings.push({ code: "APPROVED_OVERTIME", name: "Approved overtime", amount: overtimePay });
    const deductions = [...salaryDeductions];
    const baseSalary = roundMoney(proratedBaseSalary);
    const grossPay = roundMoney(earnings.reduce((sum, item) => sum + item.amount, 0));
    const taxableGross = roundMoney(earnings.filter((item) => item.taxable).reduce((sum, item) => sum + item.amount, 0));
    if (policy.incomeTaxRate !== null) deductions.push({ code: "INCOME_TAX", name: "Configured income tax", amount: roundMoney(taxableGross * policy.incomeTaxRate) });
    if (policy.employeeContributionRate !== null) deductions.push({ code: "EMPLOYEE_CONTRIBUTION", name: "Employee contribution", amount: roundMoney(grossPay * policy.employeeContributionRate) });
    if (policy.employerContributionRate !== null) employerContributions.push({ code: "EMPLOYER_CONTRIBUTION", name: "Employer contribution", amount: roundMoney(grossPay * policy.employerContributionRate) });
    const adjustmentRows = personAdjustments.map((adjustment) => ({
      code: adjustment.type.toUpperCase(),
      name: adjustment.note || adjustment.type,
      amount: roundMoney(adjustment.amount),
    }));
    deductions.push(...adjustmentRows);
    if (policy.deductUnpaidLeave && unpaidLeaveDays > 0) {
      const unpaidLeaveDeduction = roundMoney(proratedBaseSalary / salaryDivisor * unpaidLeaveDays);
      deductions.push({ code: "UNPAID_LEAVE", name: "Approved unpaid leave", amount: unpaidLeaveDeduction });
    }
    const warningsForPerson = [];
    const personLoans = loans.filter((loan) => String(loan.staff) === String(person._id));
    const repaymentsForLoans = personLoans.map((loan) => {
      const alreadyRepaid = loanRepayments
        .filter((repayment) => String(repayment.loan) === String(loan._id))
        .reduce((sum, repayment) => sum + repayment.amount, 0);
      const remainingBalance = Math.max(0, Number(loan.approvedAmount || 0) - alreadyRepaid);
      return {
        loan,
        amount: roundMoney(Math.min(Number(loan.monthlyInstallment || 0), remainingBalance)),
      };
    }).filter((repayment) => repayment.amount > 0);
    const currentDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
    const loanAllocation = allocateLoanRepayments(
      repaymentsForLoans,
      grossPay,
      currentDeductions,
      policy.maxDeductionRate
    );
    deductions.push(...loanAllocation.deductions);
    warningsForPerson.push(...loanAllocation.warnings);
    const totalDeductions = roundMoney(deductions.reduce((sum, item) => sum + item.amount, 0));
    if (personAttendance.some((row) => row.auto && !row.approvedAt)) warningsForPerson.push("Some attendance days were system-generated and not confirmed.");
    if (personAttendance.length === 0 && employmentFrom <= employmentTo) {
      warningsForPerson.push("No attendance records were found for this employment period.");
    }
    if (!person.salaryEffectiveFrom && salaryHistory.length === 0) {
      warningsForPerson.push("Salary terms lack an effective-date history; migrate or configure them before approval.");
    }
    if (!earnings.some((item) => item.amount > 0)) {
      warningsForPerson.push("No salary is configured for this employment period.");
    }
    if (unpaidLeaveDays > 0 && !policy.deductUnpaidLeave) warningsForPerson.push("Approved unpaid leave is not deducted because the policy is not configured to do so.");
    const paid = payments.find((payment) => String(payment.staff) === String(person._id));

    return {
      staff: person._id,
      employeeId: person.employeeId || "",
      name: person.name,
      email: person.email || "",
      phone: person.phone || "",
      department: person.department || "",
      designation: person.designation || "",
      baseSalary,
      earnings,
      deductions,
      employerContributions,
      presentDays,
      absentDays,
      paidLeaveDays: roundMoney(paidLeaveDays),
      unpaidLeaveDays: roundMoney(unpaidLeaveDays),
      overtimeHours: roundMoney(personOvertime.reduce((sum, row) => sum + row.hoursApproved, 0)),
      loanRepayments: loanAllocation.snapshots,
      grossPay,
      totalDeductions,
      netPay: roundMoney(Math.max(0, grossPay - totalDeductions)),
      warnings: warningsForPerson,
      paymentStatus: paid?.status || "Unpaid",
    };
  });

  return {
    monthKey,
    currency: policy.currency,
    policy,
    warnings,
    items,
    grossTotal: roundMoney(items.reduce((sum, item) => sum + item.grossPay, 0)),
    deductionTotal: roundMoney(items.reduce((sum, item) => sum + item.totalDeductions, 0)),
    netTotal: roundMoney(items.reduce((sum, item) => sum + item.netPay, 0)),
    employerContributionTotal: roundMoney(items.reduce((sum, item) =>
      sum + item.employerContributions.reduce((total, component) => total + component.amount, 0), 0)),
  };
};

module.exports = {
  monthBounds,
  workingDaysInMonth,
  prorationRate,
  componentProrationRate,
  allocateLoanRepayments,
  getPayrollPolicy,
  calculatePayrollPreview,
};
