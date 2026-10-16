import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import StaffHrReports from "./StaffHrReports";
import {
  createHrLeaveRequest,
  createHrLeaveType,
  createHrOvertime,
  createHrPayrollPreview,
  createHrShift,
  assignHrShift,
  endHrShiftAssignment,
  getHrLeaveRequests,
  getHrLeaveBalances,
  getHrLeaveTypes,
  getHrLoans,
  getHrOvertime,
  getHrPayrollPolicy,
  getHrPayrollRuns,
  getHrShifts,
  getStaff,
  recordHrSalaryPayment,
  reviewHrLeaveRequest,
  reviewHrLoan,
  reviewHrOvertime,
  runHrLeaveAccrual,
  sendStaffSlips,
  transitionHrPayroll,
  updateHrPayrollPolicy,
} from "../../https";

const today = () => new Date().toISOString().slice(0, 10);
const month = () => today().slice(0, 7);
const inputClass = "w-full rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2 text-sm text-white";
const tabs = ["Leave", "Shifts", "Overtime", "Loans", "Payroll", "Reports"];
const amount = (value, currency = "PKR") => new Intl.NumberFormat("en", {
  style: "currency",
  currency,
  maximumFractionDigits: 2,
}).format(Number(value) || 0);
const useHrMutation = (mutationFn, successMessage, onSuccess) => useMutation({
  mutationFn,
  onSuccess: () => {
    onSuccess();
    enqueueSnackbar(successMessage, { variant: "success" });
  },
  onError: (error) => enqueueSnackbar(error?.response?.data?.message || "The HR operation failed.", { variant: "error" }),
});

const StaffHrWorkspace = ({ role }) => {
  const queryClient = useQueryClient();
  const roleName = String(role || "").toLowerCase();
  const hrAccess = ["admin", "hr manager"].includes(roleName);
  const payrollAccess = ["admin", "payroll manager", "accountant"].includes(roleName);
  const mayConfigurePayroll = ["admin", "payroll manager"].includes(roleName);
  const [tab, setTab] = useState(hrAccess ? "Leave" : "Payroll");
  const [period, setPeriod] = useState(month());
  const [leaveForm, setLeaveForm] = useState({ staffId: "", leaveTypeId: "", startDate: today(), endDate: today(), reason: "" });
  const [leaveTypeForm, setLeaveTypeForm] = useState({ name: "", annualEntitlementDays: "0", paid: true });
  const [shiftForm, setShiftForm] = useState({ name: "", startTime: "09:00", endTime: "17:00", breakMinutes: "60", expectedDailyHours: "7", gracePeriodMinutes: "0", branch: "" });
  const [assignmentForm, setAssignmentForm] = useState({ staffId: "", shiftId: "", effectiveFrom: today(), effectiveTo: "" });
  const [assignmentEndDates, setAssignmentEndDates] = useState({});
  const [overtimeForm, setOvertimeForm] = useState({ staffId: "", date: today(), hoursRequested: "", hourlyRate: "", rateMultiplier: "1", kind: "Regular" });
  const [policyDraft, setPolicyDraft] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [loanDrafts, setLoanDrafts] = useState({});

  const invalidate = () => {
    ["hr-shifts", "hr-leave", "hr-leave-types", "hr-leave-balances", "hr-loans", "hr-overtime", "hr-payroll-policy", "hr-payroll-runs", "staff"].forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };
  const { data: staffResponse } = useQuery({ queryKey: ["staff"], queryFn: () => getStaff({ all: "1" }) });
  const { data: shiftsResponse } = useQuery({ queryKey: ["hr-shifts"], queryFn: getHrShifts, enabled: hrAccess });
  const { data: leaveTypesResponse } = useQuery({ queryKey: ["hr-leave-types"], queryFn: getHrLeaveTypes, enabled: hrAccess });
  const { data: leaveResponse } = useQuery({ queryKey: ["hr-leave"], queryFn: () => getHrLeaveRequests({ status: "Pending" }), enabled: hrAccess });
  const { data: leaveBalancesResponse } = useQuery({ queryKey: ["hr-leave-balances"], queryFn: () => getHrLeaveBalances(), enabled: hrAccess });
  const { data: loansResponse } = useQuery({ queryKey: ["hr-loans"], queryFn: getHrLoans, enabled: hrAccess });
  const { data: overtimeResponse } = useQuery({ queryKey: ["hr-overtime"], queryFn: () => getHrOvertime({ month: period }), enabled: hrAccess });
  const { data: policyResponse } = useQuery({ queryKey: ["hr-payroll-policy"], queryFn: getHrPayrollPolicy, enabled: payrollAccess });
  const { data: runsResponse } = useQuery({ queryKey: ["hr-payroll-runs"], queryFn: getHrPayrollRuns, enabled: payrollAccess });

  const staff = staffResponse?.data?.data || [];
  const shifts = shiftsResponse?.data?.data?.shifts || [];
  const assignments = shiftsResponse?.data?.data?.assignments || [];
  const leaveTypes = leaveTypesResponse?.data?.data || [];
  const leaveRequests = leaveResponse?.data?.data || [];
  const leaveBalances = leaveBalancesResponse?.data?.data || [];
  const loans = loansResponse?.data?.data || [];
  const overtimeRows = overtimeResponse?.data?.data || [];
  const policy = policyDraft || policyResponse?.data?.data || {};
  const runs = runsResponse?.data?.data || [];
  const activeRun = runs.find((run) => run.monthKey === period);

  const createLeave = useHrMutation(createHrLeaveRequest, "Leave request created.", invalidate);
  const addLeaveType = useHrMutation(createHrLeaveType, "Leave type created.", () => {
    invalidate();
    setLeaveTypeForm({ name: "", annualEntitlementDays: "0", paid: true });
  });
  const reviewLeave = useHrMutation(reviewHrLeaveRequest, "Leave request updated.", invalidate);
  const accrueLeave = useHrMutation(runHrLeaveAccrual, "Leave accrual completed.", invalidate);
  const reviewLoanMutation = useHrMutation(reviewHrLoan, "Loan request reviewed.", invalidate);
  const addShift = useHrMutation(createHrShift, "Shift created.", () => { invalidate(); setShiftForm((value) => ({ ...value, name: "" })); });
  const assignShiftMutation = useHrMutation(assignHrShift, "Shift assignment recorded.", invalidate);
  const endShiftMutation = useHrMutation(
    ({ assignmentId, effectiveTo }) => endHrShiftAssignment(assignmentId, { effectiveTo }),
    "Shift assignment ended.",
    invalidate
  );
  const addOvertime = useHrMutation(createHrOvertime, "Overtime request created.", invalidate);
  const reviewOvertimeMutation = useHrMutation(reviewHrOvertime, "Overtime request updated.", invalidate);
  const previewPayroll = useHrMutation(createHrPayrollPreview, "Payroll preview calculated.", invalidate);
  const updatePolicy = useHrMutation(updateHrPayrollPolicy, "Payroll rules saved.", () => { invalidate(); setPolicyDraft(null); });
  const transitionPayrollMutation = useHrMutation(transitionHrPayroll, "Payroll workflow updated.", invalidate);
  const paymentMutation = useHrMutation(recordHrSalaryPayment, "Salary payment status updated.", invalidate);
  const sendSlipsMutation = useMutation({
    mutationFn: sendStaffSlips,
    onSuccess: (response) => {
      const results = response?.data?.data || [];
      const sent = results.filter((result) => result.sent).length;
      const skipped = results.filter((result) => result.skipped).length;
      enqueueSnackbar(`Payslips emailed: ${sent}${skipped ? `; ${skipped} skipped` : ""}.`, {
        variant: sent ? "success" : "warning",
      });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Payslips could not be emailed.", { variant: "error" }),
  });

  const submit = (event, operation, payload) => {
    event.preventDefault();
    operation.mutate(payload);
  };
  const staffName = (person) => `${person.employeeId ? `${person.employeeId} · ` : ""}${person.name}`;

  return (
    <section className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#f6b100]">People operations</p>
        <h2 className="mt-1 text-2xl font-bold text-white">HR & payroll workspace</h2>
        <p className="mt-1 text-sm text-[#999]">Leave approvals, shift planning, approved overtime, configurable payroll, and payment tracking.</p>
      </header>
      <nav className="flex flex-wrap gap-2">
        {tabs.filter((item) => (
          item === "Payroll" ? payrollAccess :
            item === "Reports" ? hrAccess || payrollAccess :
              item === "Loans" ? hrAccess :
              hrAccess
        )).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === item ? "bg-[#f6b100] text-[#171717]" : "bg-[#282828] text-white"}`}>{item}</button>
        ))}
      </nav>

      {tab === "Leave" && hrAccess && (
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="space-y-4 rounded-xl border border-[#383838] bg-[#222] p-4">
            <h3 className="font-semibold text-white">Submit leave request</h3>
            <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => submit(event, createLeave, leaveForm)}>
              <select required className={inputClass} value={leaveForm.staffId} onChange={(event) => setLeaveForm({ ...leaveForm, staffId: event.target.value })}>
                <option value="">Select employee</option>{staff.map((person) => <option key={person._id} value={person._id}>{staffName(person)}</option>)}
              </select>
              <select required className={inputClass} value={leaveForm.leaveTypeId} onChange={(event) => setLeaveForm({ ...leaveForm, leaveTypeId: event.target.value })}>
                <option value="">Select leave type</option>{leaveTypes.map((item) => <option key={item._id} value={item._id}>{item.name}{item.paid ? " · paid" : " · unpaid"}</option>)}
              </select>
              <input required type="date" className={inputClass} value={leaveForm.startDate} onChange={(event) => setLeaveForm({ ...leaveForm, startDate: event.target.value })} />
              <input required type="date" className={inputClass} value={leaveForm.endDate} onChange={(event) => setLeaveForm({ ...leaveForm, endDate: event.target.value })} />
              <input className={`${inputClass} sm:col-span-2`} placeholder="Reason (optional)" value={leaveForm.reason} onChange={(event) => setLeaveForm({ ...leaveForm, reason: event.target.value })} />
              <button disabled={createLeave.isPending} className="rounded-lg bg-[#f6b100] px-4 py-2 font-semibold text-[#171717] sm:col-span-2">Create request</button>
            </form>
            {["Admin", "HR Manager"].includes(role) && (
              <form className="grid gap-2 border-t border-[#383838] pt-4 sm:grid-cols-3" onSubmit={(event) => submit(event, addLeaveType, { ...leaveTypeForm, annualEntitlementDays: Number(leaveTypeForm.annualEntitlementDays) })}>
                <input required className={inputClass} placeholder="New leave type" value={leaveTypeForm.name} onChange={(event) => setLeaveTypeForm({ ...leaveTypeForm, name: event.target.value })} />
                <input type="number" min="0" className={inputClass} aria-label="Annual entitlement days" value={leaveTypeForm.annualEntitlementDays} onChange={(event) => setLeaveTypeForm({ ...leaveTypeForm, annualEntitlementDays: event.target.value })} />
                <button className="rounded-lg border border-[#555] px-3 py-2 text-sm text-white">Add type</button>
                <label className="text-sm text-[#bbb]"><input type="checkbox" checked={leaveTypeForm.paid} onChange={(event) => setLeaveTypeForm({ ...leaveTypeForm, paid: event.target.checked })} /> Paid leave</label>
              </form>
            )}
          </section>
          <section className="space-y-3 rounded-xl border border-[#383838] bg-[#222] p-4">
            <h3 className="font-semibold text-white">Pending leave approvals</h3>
            {!leaveRequests.length && <p className="text-sm text-[#888]">No pending requests.</p>}
            {leaveRequests.map((request) => (
              <article key={request._id} className="rounded-lg bg-[#181818] p-3 text-sm">
                <div className="flex flex-wrap justify-between gap-2 text-white"><b>{request.staff?.name || "Employee"} · {request.leaveType?.name}</b><span>{request.startDate} – {request.endDate}</span></div>
                <p className="mt-1 text-[#999]">{request.reason || "No reason supplied"}</p>
                <div className="mt-3 flex gap-2">
                  {["Approved", "Rejected"].map((status) => <button key={status} type="button" disabled={reviewLeave.isPending} onClick={() => reviewLeave.mutate({ requestId: request._id, status })} className="rounded border border-[#555] px-3 py-1 text-xs text-white">{status}</button>)}
                </div>
              </article>
            ))}
          </section>
          <section className="space-y-3 rounded-xl border border-[#383838] bg-[#222] p-4 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><h3 className="font-semibold text-white">Leave balances</h3><p className="text-xs text-[#999]">Accrual is idempotent by employee, leave type, and month; carry-forward is capped by the leave type policy.</p></div>
              <button type="button" disabled={accrueLeave.isPending} onClick={() => accrueLeave.mutate({ monthKey: month() })} className="rounded border border-[#555] px-3 py-2 text-xs text-white disabled:opacity-50">Run current-month accrual</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="text-[#999]"><tr><th className="p-2">Employee</th><th>Leave type</th><th>Entitlement</th><th>Accrued</th><th>Carry-forward</th><th>Used</th><th>Available</th></tr></thead>
                <tbody>{leaveBalances.map((balance) => <tr key={`${balance.staffId}-${balance.leaveTypeId}`} className="border-t border-[#383838] text-[#ddd]"><td className="p-2">{balance.employeeId} · {balance.name}</td><td>{balance.leaveType}</td><td>{balance.annualEntitlementDays}</td><td>{balance.accruedDays}</td><td>{balance.carryForwardDays}</td><td>{balance.usedDays}</td><td className={balance.availableDays < 0 ? "text-red-300" : ""}>{balance.availableDays}</td></tr>)}</tbody>
              </table>
              {!leaveBalances.length && <p className="py-3 text-sm text-[#999]">No active leave entitlements are configured.</p>}
            </div>
          </section>
        </div>
      )}

      {tab === "Shifts" && hrAccess && (
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="space-y-4 rounded-xl border border-[#383838] bg-[#222] p-4">
            <h3 className="font-semibold text-white">Create shift</h3>
            <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => submit(event, addShift, { ...shiftForm, breakMinutes: Number(shiftForm.breakMinutes), expectedDailyHours: Number(shiftForm.expectedDailyHours), gracePeriodMinutes: Number(shiftForm.gracePeriodMinutes), workingDays: [1, 2, 3, 4, 5], weeklyOffDays: [0, 6] })}>
              <input required className={inputClass} placeholder="Shift name" value={shiftForm.name} onChange={(event) => setShiftForm({ ...shiftForm, name: event.target.value })} />
              <input className={inputClass} placeholder="Branch" value={shiftForm.branch} onChange={(event) => setShiftForm({ ...shiftForm, branch: event.target.value })} />
              <label className="text-xs text-[#aaa]">Start<input required type="time" className={inputClass} value={shiftForm.startTime} onChange={(event) => setShiftForm({ ...shiftForm, startTime: event.target.value })} /></label>
              <label className="text-xs text-[#aaa]">End<input required type="time" className={inputClass} value={shiftForm.endTime} onChange={(event) => setShiftForm({ ...shiftForm, endTime: event.target.value })} /></label>
              <input type="number" min="0" className={inputClass} aria-label="Break duration in minutes" placeholder="Break minutes" value={shiftForm.breakMinutes} onChange={(event) => setShiftForm({ ...shiftForm, breakMinutes: event.target.value })} />
              <input type="number" min="0" className={inputClass} aria-label="Grace period in minutes" placeholder="Grace minutes" value={shiftForm.gracePeriodMinutes} onChange={(event) => setShiftForm({ ...shiftForm, gracePeriodMinutes: event.target.value })} />
              <button className="rounded-lg bg-[#f6b100] px-4 py-2 font-semibold text-[#171717] sm:col-span-2">Save shift</button>
            </form>
            <form className="grid gap-2 border-t border-[#383838] pt-4 sm:grid-cols-3" onSubmit={(event) => {
              event.preventDefault();
              const { shiftId, ...data } = assignmentForm;
              assignShiftMutation.mutate({ shiftId, ...data, effectiveTo: data.effectiveTo || undefined });
            }}>
              <select required className={inputClass} value={assignmentForm.staffId} onChange={(event) => setAssignmentForm({ ...assignmentForm, staffId: event.target.value })}>
                <option value="">Employee</option>{staff.map((person) => <option key={person._id} value={person._id}>{staffName(person)}</option>)}
              </select>
              <select required className={inputClass} value={assignmentForm.shiftId} onChange={(event) => setAssignmentForm({ ...assignmentForm, shiftId: event.target.value })}>
                <option value="">Shift</option>{shifts.map((item) => <option key={item._id} value={item._id}>{item.name} · {item.startTime}–{item.endTime}</option>)}
              </select>
              <input required type="date" className={inputClass} value={assignmentForm.effectiveFrom} onChange={(event) => setAssignmentForm({ ...assignmentForm, effectiveFrom: event.target.value })} />
              <input type="date" min={assignmentForm.effectiveFrom} className={inputClass} aria-label="Assignment end date (optional)" value={assignmentForm.effectiveTo} onChange={(event) => setAssignmentForm({ ...assignmentForm, effectiveTo: event.target.value })} />
              <button className="rounded-lg border border-[#555] px-3 py-2 text-sm text-white sm:col-span-3">Assign shift</button>
            </form>
          </section>
          <section className="rounded-xl border border-[#383838] bg-[#222] p-4">
            <h3 className="mb-3 font-semibold text-white">Shift assignment history</h3>
            <div className="space-y-2">{assignments.map((item) => <div key={item._id} className="space-y-2 rounded bg-[#181818] p-3 text-sm text-white">
              <p>{item.staff?.name || "Employee"} · {item.shift?.name || "Shift"} · {item.effectiveFrom}{item.effectiveTo ? ` – ${item.effectiveTo}` : " · Ongoing"}</p>
              {!item.effectiveTo && <form className="flex flex-wrap gap-2" onSubmit={(event) => {
                event.preventDefault();
                endShiftMutation.mutate({ assignmentId: item._id, effectiveTo: assignmentEndDates[item._id] || today() });
              }}>
                <input required type="date" min={item.effectiveFrom} className="rounded border border-[#444] bg-[#222] px-2 py-1 text-xs text-white" aria-label={`End date for ${item.staff?.name || "employee"} shift`} value={assignmentEndDates[item._id] || today()} onChange={(event) => setAssignmentEndDates({ ...assignmentEndDates, [item._id]: event.target.value })} />
                <button disabled={endShiftMutation.isPending} className="rounded border border-[#555] px-2 py-1 text-xs text-white disabled:opacity-50">End assignment</button>
              </form>}
              {item.endedBy && <p className="text-xs text-[#999]">Ended by HR on {item.endedAt ? new Date(item.endedAt).toLocaleDateString() : "recorded"}</p>}
            </div>)}</div>
          </section>
        </div>
      )}

      {tab === "Loans" && hrAccess && (
        <section className="space-y-4 rounded-xl border border-[#383838] bg-[#222] p-4">
          <header>
            <h3 className="font-semibold text-white">Staff loan requests</h3>
            <p className="mt-1 text-xs text-[#999]">Approved loans use fixed, interest-free installments. Repayments are snapshotted in payroll and posted idempotently when payroll is finalized.</p>
          </header>
          {!loans.length && <p className="text-sm text-[#999]">No loan requests.</p>}
          <div className="grid gap-3 xl:grid-cols-2">
            {loans.map((loan) => {
              const draft = loanDrafts[loan._id] || {
                approvedAmount: String(loan.requestedAmount),
                monthlyInstallment: String(loan.requestedAmount),
                startMonth: month(),
                note: "",
              };
              return (
                <article key={loan._id} className="space-y-2 rounded-lg bg-[#181818] p-3 text-sm">
                  <div className="flex flex-wrap justify-between gap-2"><b className="text-white">{loan.staff?.employeeId} · {loan.staff?.name}</b><span className="text-yellow-300">{loan.status}</span></div>
                  <p className="text-[#aaa]">Requested: {amount(loan.requestedAmount)} · Reason: {loan.reason || "—"}</p>
                  {loan.status === "Pending" ? <>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <input aria-label="Approved amount" type="number" min="0.01" max={loan.requestedAmount} step="0.01" className={inputClass} value={draft.approvedAmount} onChange={(event) => setLoanDrafts({ ...loanDrafts, [loan._id]: { ...draft, approvedAmount: event.target.value } })} />
                      <input aria-label="Monthly installment" type="number" min="0.01" step="0.01" className={inputClass} value={draft.monthlyInstallment} onChange={(event) => setLoanDrafts({ ...loanDrafts, [loan._id]: { ...draft, monthlyInstallment: event.target.value } })} />
                      <input aria-label="Repayment start month" type="month" min={month()} className={inputClass} value={draft.startMonth} onChange={(event) => setLoanDrafts({ ...loanDrafts, [loan._id]: { ...draft, startMonth: event.target.value } })} />
                    </div>
                    <input aria-label="Review note" className={inputClass} placeholder="Review note" value={draft.note} onChange={(event) => setLoanDrafts({ ...loanDrafts, [loan._id]: { ...draft, note: event.target.value } })} />
                    <div className="flex gap-2">
                      <button type="button" disabled={reviewLoanMutation.isPending} onClick={() => reviewLoanMutation.mutate({ loanId: loan._id, status: "Active", approvedAmount: Number(draft.approvedAmount), monthlyInstallment: Number(draft.monthlyInstallment), startMonth: draft.startMonth, note: draft.note })} className="rounded bg-green-800 px-3 py-1.5 text-xs text-white">Approve and schedule</button>
                      <button type="button" disabled={reviewLoanMutation.isPending} onClick={() => reviewLoanMutation.mutate({ loanId: loan._id, status: "Rejected", note: draft.note })} className="rounded bg-red-900 px-3 py-1.5 text-xs text-white">Reject</button>
                    </div>
                  </> : <p className="text-xs text-[#aaa]">Approved: {amount(loan.approvedAmount)} · Installment: {amount(loan.monthlyInstallment)} from {loan.startMonth || "—"} · Repaid: {amount(loan.repaidAmount)} · Remaining: {amount(loan.remainingBalance)}</p>}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {tab === "Overtime" && hrAccess && (
        <div className="grid gap-5 xl:grid-cols-2">
          <form className="grid content-start gap-3 rounded-xl border border-[#383838] bg-[#222] p-4" onSubmit={(event) => submit(event, addOvertime, { ...overtimeForm, hoursRequested: Number(overtimeForm.hoursRequested), hourlyRate: Number(overtimeForm.hourlyRate), rateMultiplier: Number(overtimeForm.rateMultiplier) })}>
            <h3 className="font-semibold text-white">Request approved-rate overtime</h3>
            <select required className={inputClass} value={overtimeForm.staffId} onChange={(event) => setOvertimeForm({ ...overtimeForm, staffId: event.target.value })}><option value="">Select employee</option>{staff.map((person) => <option key={person._id} value={person._id}>{staffName(person)}</option>)}</select>
            <div className="grid grid-cols-2 gap-2"><input required type="date" className={inputClass} value={overtimeForm.date} onChange={(event) => setOvertimeForm({ ...overtimeForm, date: event.target.value })} /><select className={inputClass} value={overtimeForm.kind} onChange={(event) => setOvertimeForm({ ...overtimeForm, kind: event.target.value })}>{["Regular", "Rest Day", "Public Holiday", "Night"].map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="grid grid-cols-3 gap-2"><input required type="number" min="0.01" step="0.01" className={inputClass} placeholder="Hours" value={overtimeForm.hoursRequested} onChange={(event) => setOvertimeForm({ ...overtimeForm, hoursRequested: event.target.value })} /><input required type="number" min="0" step="0.01" className={inputClass} placeholder="Hourly rate" value={overtimeForm.hourlyRate} onChange={(event) => setOvertimeForm({ ...overtimeForm, hourlyRate: event.target.value })} /><input required type="number" min="0.01" step="0.01" className={inputClass} aria-label="Overtime multiplier" value={overtimeForm.rateMultiplier} onChange={(event) => setOvertimeForm({ ...overtimeForm, rateMultiplier: event.target.value })} /></div>
            <p className="text-xs text-[#888]">Enter the rate and multiplier approved for the employee's applicable jurisdiction and terms; no legal rate is assumed.</p>
            <button className="rounded-lg bg-[#f6b100] px-4 py-2 font-semibold text-[#171717]">Submit overtime</button>
          </form>
          <section className="space-y-2 rounded-xl border border-[#383838] bg-[#222] p-4">
            <h3 className="font-semibold text-white">Overtime review · {period}</h3>
            {overtimeRows.map((row) => <div key={row._id} className="flex flex-wrap items-center justify-between gap-2 rounded bg-[#181818] p-3 text-sm text-white"><span>{row.staff?.name} · {row.date} · {row.kind} · {row.hoursApproved || row.hoursRequested} h</span>{row.status === "Pending" && <div className="flex gap-2"><button type="button" onClick={() => reviewOvertimeMutation.mutate({ overtimeId: row._id, status: "Approved", hoursApproved: row.hoursRequested })} className="rounded border border-[#555] px-2 py-1">Approve</button><button type="button" onClick={() => reviewOvertimeMutation.mutate({ overtimeId: row._id, status: "Rejected", hoursApproved: 0 })} className="rounded border border-[#555] px-2 py-1">Reject</button></div>}</div>)}
          </section>
        </div>
      )}

      {tab === "Payroll" && payrollAccess && (
        <div className="space-y-5">
          <section className="grid gap-5 lg:grid-cols-[1fr_2fr]">
            <form className="space-y-3 rounded-xl border border-[#383838] bg-[#222] p-4" onSubmit={(event) => submit(event, previewPayroll, { monthKey: period })}>
              <h3 className="font-semibold text-white">Payroll preparation</h3>
              <label className="block text-xs text-[#aaa]">Payroll period<input type="month" className={inputClass} value={period} onChange={(event) => setPeriod(event.target.value)} /></label>
              <button disabled={previewPayroll.isPending || activeRun?.status === "Finalized"} className="w-full rounded-lg bg-[#f6b100] px-4 py-2 font-semibold text-[#171717] disabled:opacity-50">Calculate preview</button>
              {activeRun && <div className="space-y-2 text-sm text-[#ccc]"><p>Run status: <b>{activeRun.status}</b></p><p>Gross: {amount(activeRun.grossTotal, activeRun.currency)}</p><p>Deductions: {amount(activeRun.deductionTotal, activeRun.currency)}</p><p>Net: {amount(activeRun.netTotal, activeRun.currency)}</p><p>Employer contributions: {amount(activeRun.employerContributionTotal, activeRun.currency)}</p></div>}
            </form>
            <section className="space-y-3 rounded-xl border border-[#383838] bg-[#222] p-4">
              <h3 className="font-semibold text-white">Effective payroll policy</h3>
              <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => {
                event.preventDefault();
                const payload = {
                  ...policy,
                  fixedDivisor: policy.fixedDivisor === "" || policy.fixedDivisor === null ? null : Number(policy.fixedDivisor),
                  incomeTaxRate: policy.incomeTaxRate === "" || policy.incomeTaxRate === null ? null : Number(policy.incomeTaxRate),
                  employeeContributionRate: policy.employeeContributionRate === "" || policy.employeeContributionRate === null ? null : Number(policy.employeeContributionRate),
                  employerContributionRate: policy.employerContributionRate === "" || policy.employerContributionRate === null ? null : Number(policy.employerContributionRate),
                  maxDeductionRate: policy.maxDeductionRate === "" || policy.maxDeductionRate === null ? null : Number(policy.maxDeductionRate),
                };
                updatePolicy.mutate(payload);
              }}>
                <input className={inputClass} aria-label="Payroll currency" maxLength={3} value={policy.currency || "PKR"} onChange={(event) => setPolicyDraft({ ...policy, currency: event.target.value.toUpperCase() })} />
                <select aria-label="Financial year start month" className={inputClass} value={policy.financialYearStartMonth || 1} onChange={(event) => setPolicyDraft({ ...policy, financialYearStartMonth: Number(event.target.value) })}>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{new Date(2024, index, 1).toLocaleString("en", { month: "long" })} financial year start</option>)}</select>
                <input className={inputClass} aria-label="Payroll jurisdiction" placeholder="Jurisdiction (required for statutory rules)" value={policy.jurisdiction || ""} onChange={(event) => setPolicyDraft({ ...policy, jurisdiction: event.target.value })} />
                <label className="text-xs text-[#aaa] sm:col-span-2">Policy effective from<input required type="date" className={inputClass} value={policy.effectiveFrom || "2000-01-01"} onChange={(event) => setPolicyDraft({ ...policy, effectiveFrom: event.target.value })} /></label>
                <select className={inputClass} value={policy.prorationMethod || "CalendarDays"} onChange={(event) => setPolicyDraft({ ...policy, prorationMethod: event.target.value })}><option value="CalendarDays">Actual calendar days</option><option value="WorkingDays">Scheduled weekdays (Mon–Fri)</option><option value="FixedDivisor">Fixed divisor</option></select>
                <input type="number" min="1" step="0.01" className={inputClass} placeholder="Fixed divisor" value={policy.fixedDivisor ?? ""} onChange={(event) => setPolicyDraft({ ...policy, fixedDivisor: event.target.value })} />
                {["incomeTaxRate", "employeeContributionRate", "employerContributionRate", "maxDeductionRate"].map((key) => <label key={key} className="text-xs text-[#aaa]">{key.replace(/([A-Z])/g, " $1")} (0–1)<input type="number" min="0" max="1" step="0.0001" className={inputClass} value={policy[key] ?? ""} onChange={(event) => setPolicyDraft({ ...policy, [key]: event.target.value === "" ? null : event.target.value })} /></label>)}
                <label className="flex items-center gap-2 text-sm text-[#bbb] sm:col-span-2"><input type="checkbox" checked={policy.deductUnpaidLeave === true} onChange={(event) => setPolicyDraft({ ...policy, deductUnpaidLeave: event.target.checked })} /> Deduct approved unpaid leave using this proration policy</label>
                {mayConfigurePayroll && <button className="rounded-lg border border-[#555] px-4 py-2 text-white sm:col-span-2">Save policy</button>}
              </form>
              <p className="text-xs text-[#888]">Unconfigured tax or contribution rules remain warnings, not invented deductions. Payroll runs retain a policy snapshot.</p>
            </section>
          </section>

          {activeRun?.warnings?.length > 0 && <div className="rounded-lg border border-amber-800 bg-amber-950/40 p-3 text-sm text-amber-100"><b>Review before approval</b><ul className="mt-1 list-disc pl-5">{activeRun.warnings.map((warning, index) => <li key={`${warning}-${index}`}>{warning}</li>)}</ul></div>}
          {activeRun && <section className="overflow-x-auto rounded-xl border border-[#383838] bg-[#222] p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {activeRun.status === "Draft" && <button type="button" onClick={() => transitionPayrollMutation.mutate({ monthKey: period, action: "submit" })} className="rounded bg-[#333] px-3 py-2 text-sm text-white">Submit for approval</button>}
              {activeRun.status === "Pending Approval" && <button type="button" onClick={() => transitionPayrollMutation.mutate({ monthKey: period, action: "approve" })} className="rounded bg-[#333] px-3 py-2 text-sm text-white">Approve payroll</button>}
              {activeRun.status === "Approved" && <button type="button" onClick={() => {
                const confirmWarnings = activeRun.warnings.length === 0 || window.confirm(`Confirm ${activeRun.warnings.length} payroll warning(s) were reviewed.`);
                if (confirmWarnings) transitionPayrollMutation.mutate({ monthKey: period, action: "finalize", confirmWarnings });
              }} className="rounded bg-green-800 px-3 py-2 text-sm text-white">Finalize and lock</button>}
              {activeRun.status === "Finalized" && <>
                <select aria-label="Payment method" className={`${inputClass} max-w-48`} value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>{["Bank Transfer", "Cash", "Digital Payment", "Other"].map((method) => <option key={method}>{method}</option>)}</select>
                <input aria-label="Payment reference" className={`${inputClass} max-w-56`} placeholder="Transaction reference" value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} />
                <button type="button" disabled={sendSlipsMutation.isPending} onClick={() => sendSlipsMutation.mutate({ month: period })} className="rounded border border-[#555] px-3 py-2 text-sm text-white">Email payslips</button>
              </>}
            </div>
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="text-xs uppercase text-[#888]"><tr><th className="p-2">Employee</th><th>Present / absent</th><th>Paid / unpaid leave</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Payment</th></tr></thead>
              <tbody>{activeRun.items.map((item) => <tr key={item.staff} className="border-t border-[#383838] text-[#ddd]"><td className="p-2">{item.employeeId} · {item.name}<small className="block text-[#888]">{item.department}</small>{item.warnings?.map((warning) => <small key={warning} className="block text-amber-300">{warning}</small>)}</td><td>{item.presentDays} / {item.absentDays}</td><td>{item.paidLeaveDays} / {item.unpaidLeaveDays}</td><td>{amount(item.grossPay, activeRun.currency)}</td><td>{amount(item.totalDeductions, activeRun.currency)}</td><td className="font-semibold">{amount(item.netPay, activeRun.currency)}</td><td>{activeRun.status === "Finalized" ? item.paymentStatus === "Paid" ? <span>Paid</span> : <select className={inputClass} value={item.paymentStatus || "Draft"} onChange={(event) => paymentMutation.mutate({ monthKey: period, staffId: item.staff, status: event.target.value, method: paymentMethod, reference: paymentReference })}><option value="Draft" disabled>Not started</option>{["Pending Approval", "Approved", "Processing", "Paid", "Failed", "Cancelled"].map((status) => <option key={status}>{status}</option>)}</select> : item.paymentStatus || "Draft"}</td></tr>)}</tbody>
            </table>
          </section>}
          <section className="rounded-xl border border-[#383838] bg-[#222] p-4">
            <h3 className="mb-3 font-semibold text-white">Payroll run history</h3>
            <div className="grid gap-2 md:grid-cols-3">{runs.map((run) => <button key={run._id} type="button" onClick={() => setPeriod(run.monthKey)} className="rounded bg-[#181818] p-3 text-left text-sm text-white">{run.monthKey} · {run.status}<span className="mt-1 block text-[#aaa]">Net {amount(run.netTotal, run.currency)}</span></button>)}</div>
          </section>
        </div>
      )}
      {tab === "Reports" && (hrAccess || payrollAccess) && <StaffHrReports role={role} />}
    </section>
  );
};

export default StaffHrWorkspace;
