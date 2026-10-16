import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaPlus, FaUserSlash, FaDownload, FaPen } from "react-icons/fa";
import StaffHrWorkspace from "./StaffHrWorkspace";
import StaffHrDocumentsPanel from "./StaffHrDocumentsPanel";
import {
  getStaff,
  addStaff,
  updateStaff,
  deactivateStaff,
  getStaffAttendance,
  markStaffAttendance,
  getStaffAttendanceHistory,
  getStaffMonthlySummary,
  addStaffAdjustment,
  deleteStaffAdjustment,
} from "../../https";
import { formatCurrency } from "../../utils/orderMetrics";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const localDateTimeValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};
const thisMonthStr = () => todayStr().slice(0, 7);
const prettyMonth = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

const SUB_TABS = ["Staff", "Attendance", "Payroll", "HR & Payroll"];

const defaultStaffForm = {
  name: "",
  phone: "",
  email: "",
  designation: "",
  cnic: "",
  address: "",
  joinDate: todayStr(),
  effectiveAt: todayStr(),
  department: "",
  branch: "",
  employmentType: "Permanent",
  employmentStatus: "Active",
  contractEndDate: "",
  probationEndDate: "",
  salaryComponents: [],
  baseSalary: "",
};
const defaultSalaryComponentDraft = {
  code: "",
  name: "",
  type: "Earning",
  amount: "",
  effectiveFrom: todayStr(),
  recurring: true,
  taxable: false,
  pensionable: false,
};

// Full Staff Management screen: staff records, daily attendance (auto
// Present, Cashier/Admin can mark Absent/Leave), and monthly payroll.
// Salary fields are rendered only for payroll-authorized roles; the backend
// independently strips confidential fields from all other responses.
const StaffManagement = () => {
  const role = useSelector((state) => state.user.role);
  const roleName = String(role || "").toLowerCase();
  const canEditStaff = ["admin", "hr manager"].includes(roleName);
  const canViewPayroll = ["admin", "payroll manager", "accountant"].includes(roleName);
  const canEditPayroll = ["admin", "payroll manager"].includes(roleName);
  const canManageAttendance = ["admin", "cashier", "hr manager"].includes(roleName);
  const canManageHr = ["admin", "hr manager"].includes(roleName);
  const queryClient = useQueryClient();

  const [subTab, setSubTab] = useState("Staff");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState(defaultStaffForm);
  const [staffSearch, setStaffSearch] = useState("");
  const [salaryComponentDraft, setSalaryComponentDraft] = useState(defaultSalaryComponentDraft);

  const [attendanceDate, setAttendanceDate] = useState(todayStr());
  const [attendanceDrafts, setAttendanceDrafts] = useState({});
  const [payrollMonth, setPayrollMonth] = useState(thisMonthStr());
  const [adjustmentFor, setAdjustmentFor] = useState(null); // staffId
  const [adjustmentForm, setAdjustmentForm] = useState({ type: "Advance", amount: "", note: "" });
  const [historyFor, setHistoryFor] = useState(null); // staffId

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: () => getStaff(),
    placeholderData: keepPreviousData,
  });
  const staff = staffData?.data?.data ?? [];
  const filteredStaff = staff.filter((person) =>
    [person.name, person.employeeId, person.designation, person.department, person.branch]
      .some((value) => String(value || "").toLowerCase().includes(staffSearch.toLowerCase()))
  );

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["staffAttendance", attendanceDate],
    queryFn: () => getStaffAttendance(attendanceDate),
    enabled: subTab === "Attendance",
    placeholderData: keepPreviousData,
  });
  const attendanceRows = attendanceData?.data?.data ?? [];

  const { data: historyData } = useQuery({
    queryKey: ["staffAttendanceHistory", historyFor, payrollMonth],
    queryFn: () => getStaffAttendanceHistory({ staffId: historyFor, month: payrollMonth }),
    enabled: Boolean(historyFor),
  });

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["staffSummary", payrollMonth],
    queryFn: () => getStaffMonthlySummary(payrollMonth),
    enabled: subTab === "Payroll",
    placeholderData: keepPreviousData,
  });
  const summary = summaryData?.data?.data ?? [];

  const invalidateAll = () => {
    queryClient.invalidateQueries(["staff"]);
    queryClient.invalidateQueries(["staffAttendance"]);
    queryClient.invalidateQueries(["staffAttendanceHistory"]);
    queryClient.invalidateQueries(["staffSummary"]);
  };

  const onError = (err, fallback) =>
    enqueueSnackbar(err?.response?.data?.message || fallback, { variant: "error" });

  const addMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      invalidateAll();
      setIsFormOpen(false);
      setForm(defaultStaffForm);
      enqueueSnackbar("Staff member added.", { variant: "success" });
    },
    onError: (e) => onError(e, "Failed to add staff."),
  });
  const updateMutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: () => {
      invalidateAll();
      setIsFormOpen(false);
      setEditingStaff(null);
      setForm(defaultStaffForm);
      enqueueSnackbar("Staff member updated.", { variant: "success" });
    },
    onError: (e) => onError(e, "Failed to update staff."),
  });
  const deactivateMutation = useMutation({
    mutationFn: deactivateStaff,
    onSuccess: () => {
      invalidateAll();
      enqueueSnackbar("Staff member removed (history kept).", { variant: "success" });
    },
    onError: (e) => onError(e, "Failed to remove staff."),
  });
  const markMutation = useMutation({
    mutationFn: markStaffAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffAttendance"]);
      queryClient.invalidateQueries(["staffSummary"]);
      setAttendanceDrafts({});
    },
    onError: (e) => onError(e, "Failed to update attendance."),
  });
  const addAdjMutation = useMutation({
    mutationFn: addStaffAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffSummary"]);
      setAdjustmentFor(null);
      setAdjustmentForm({ type: "Advance", amount: "", note: "" });
      enqueueSnackbar("Saved.", { variant: "success" });
    },
    onError: (e) => onError(e, "Failed to save."),
  });
  const deleteAdjMutation = useMutation({
    mutationFn: deleteStaffAdjustment,
    onSuccess: () => queryClient.invalidateQueries(["staffSummary"]),
    onError: (e) => onError(e, "Failed to delete."),
  });

  const openAddForm = () => {
    setEditingStaff(null);
    setForm(defaultStaffForm);
    setSalaryComponentDraft({ ...defaultSalaryComponentDraft, effectiveFrom: todayStr() });
    setIsFormOpen(true);
  };
  const openEditForm = (s) => {
    setEditingStaff(s);
    setSalaryComponentDraft({ ...defaultSalaryComponentDraft, effectiveFrom: todayStr() });
    setForm({
      name: s.name || "",
      phone: s.phone || "",
      email: s.email || "",
      designation: s.designation || "",
      cnic: s.cnic || "",
      address: s.address || "",
      joinDate: s.joinDate || todayStr(),
      effectiveAt: todayStr(),
      department: s.department || "",
      branch: s.branch || "",
      employmentType: s.employmentType || "Permanent",
      employmentStatus: s.employmentStatus || "Active",
      contractEndDate: s.contractEndDate || "",
      probationEndDate: s.probationEndDate || "",
      salaryComponents: canViewPayroll ? s.salaryComponents || [] : [],
      baseSalary: canViewPayroll ? s.baseSalary ?? "" : "",
    });
    setIsFormOpen(true);
  };

  const submitStaffForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      enqueueSnackbar("Enter a name.", { variant: "error" });
      return;
    }
    const payload = { ...form };
    if (canViewPayroll) payload.baseSalary = form.baseSalary === "" ? 0 : Number(form.baseSalary);
    else delete payload.baseSalary;
    if (editingStaff) updateMutation.mutate({ staffId: editingStaff._id, ...payload });
    else addMutation.mutate(payload);
  };

  const totals = useMemo(
    () =>
      summary.reduce(
        (acc, r) => ({
          present: acc.present + (r.present || 0),
          absent: acc.absent + (r.absent || 0),
          payable: acc.payable + (r.payable || 0),
        }),
        { present: 0, absent: 0, payable: 0 }
      ),
    [summary]
  );

  return (
    <div className="px-4 sm:px-10 pb-10">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {SUB_TABS.filter((t) => (t !== "Attendance" || canManageAttendance) &&
          (t !== "Payroll" || canViewPayroll) &&
          (t !== "HR & Payroll" || canManageHr || canViewPayroll)).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold ${
              subTab === t ? "bg-[#383838] text-[#f5f5f5]" : "bg-[#1f1f1f] text-[#ababab] hover:bg-[#262626]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ---------------- Staff list ---------------- */}
      {subTab === "Staff" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#f5f5f5] text-lg font-semibold">Staff members</h3>
            {canEditStaff && (
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-[#f6b100] text-[#1f1f1f] font-semibold px-4 py-2 rounded-lg"
              >
                <FaPlus /> Add staff
              </button>
            )}
          </div>
          <input value={staffSearch} onChange={(event) => setStaffSearch(event.target.value)} placeholder="Search employees, department, branch…" className="mb-3 w-full max-w-md rounded-lg bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none" />

          {staffLoading ? (
            <p className="text-[#ababab]">Loading…</p>
          ) : filteredStaff.length === 0 ? (
            <p className="text-[#ababab]">No staff added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm text-left">
                <thead>
                  <tr className="text-[#ababab] border-b border-[#333]">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Designation</th>
                    <th className="py-2 pr-3">Phone</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Joined</th>
                    <th className="py-2 pr-3">Employee ID</th>
                    <th className="py-2 pr-3">Department / branch</th>
                    <th className="py-2 pr-3">Status</th>
                    {canViewPayroll && <th className="py-2 pr-3">Salary</th>}
                    {canEditStaff && <th className="py-2 pr-3" />}
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((s) => (
                    <tr key={s._id} className="text-[#f5f5f5] border-b border-[#262626]">
                      <td className="py-2 pr-3 font-medium">{s.name}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.designation || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.phone || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.email || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.joinDate}</td>
                      <td className="py-2 pr-3">{s.employeeId || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{[s.department, s.branch].filter(Boolean).join(" / ") || "—"}</td>
                      <td className="py-2 pr-3">{s.employmentStatus || (s.isActive ? "Active" : "Inactive")}</td>
                      {canViewPayroll && <td className="py-2 pr-3">{formatCurrency(s.baseSalary)}/mo</td>}
                      {canEditStaff && (
                        <td className="py-2 pr-3">
                          <div className="flex gap-3">
                            <button onClick={() => openEditForm(s)} className="text-[#ababab] hover:text-[#f5f5f5]" title="Edit">
                              <FaPen />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Remove ${s.name}? Their attendance/salary history is kept.`)) {
                                  deactivateMutation.mutate(s._id);
                                }
                              }}
                              className="text-red-400 hover:text-red-300"
                              title="Remove"
                            >
                              <FaUserSlash />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---------------- Attendance ---------------- */}
      {subTab === "Attendance" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-[#f5f5f5] text-lg font-semibold mr-auto">Today's attendance</h3>
            <input
              type="date"
              value={attendanceDate}
              max={todayStr()}
              onChange={(e) => {
                setAttendanceDate(e.target.value);
                setAttendanceDrafts({});
              }}
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none text-sm"
            />
          </div>
          <p className="text-[#7a7a7a] text-xs mb-3">
            Everyone is marked Present automatically. Flip someone to Absent or Leave if they didn't come in.
          </p>

          {attendanceLoading ? (
            <p className="text-[#ababab]">Loading…</p>
          ) : attendanceRows.length === 0 ? (
            <p className="text-[#ababab]">No active staff for this date.</p>
          ) : (
            <div className="space-y-2">
              {attendanceRows.map((row) => (
                <div
                  key={row.staffId}
                  className="flex flex-wrap items-center justify-between gap-3 bg-[#262626] rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-[#f5f5f5] font-medium">{row.name}</p>
                    <p className="text-[#7a7a7a] text-xs">
                      {row.designation || "Staff"}
                      {!row.auto && row.markedBy ? ` · marked by ${row.markedBy}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Present", "Absent", "Leave"].map((st) => (
                      <button
                        key={st}
                        onClick={() =>
                          markMutation.mutate({ staffId: row.staffId, date: attendanceDate, status: st })
                        }
                        disabled={markMutation.isPending}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          row.status === st
                            ? st === "Present"
                              ? "bg-[#34c76f] text-[#0f1f14]"
                              : st === "Absent"
                              ? "bg-[#e6402e] text-white"
                              : "bg-[#f6b100] text-[#1f1f1f]"
                            : "bg-[#1a1a1a] text-[#ababab]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setHistoryFor(row.staffId);
                        setPayrollMonth(attendanceDate.slice(0, 7));
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a1a1a] text-[#ababab] hover:text-[#f5f5f5]"
                    >
                      History
                    </button>
                  </div>
                  <div className="flex w-full flex-wrap items-end gap-2 border-t border-[#383838] pt-3">
                    <label className="text-[10px] text-[#888]">Check in<input type="datetime-local" value={attendanceDrafts[row.staffId]?.checkIn ?? localDateTimeValue(row.actualCheckIn)} onChange={(event) => setAttendanceDrafts((current) => ({ ...current, [row.staffId]: { ...current[row.staffId], checkIn: event.target.value } }))} className="mt-1 block rounded bg-[#1a1a1a] px-2 py-1 text-xs text-white" /></label>
                    <label className="text-[10px] text-[#888]">Check out<input type="datetime-local" value={attendanceDrafts[row.staffId]?.checkOut ?? localDateTimeValue(row.actualCheckOut)} onChange={(event) => setAttendanceDrafts((current) => ({ ...current, [row.staffId]: { ...current[row.staffId], checkOut: event.target.value } }))} className="mt-1 block rounded bg-[#1a1a1a] px-2 py-1 text-xs text-white" /></label>
                    <label className="text-[10px] text-[#888]">Break minutes<input type="number" min="0" value={attendanceDrafts[row.staffId]?.breakMinutes ?? row.breakMinutes} onChange={(event) => setAttendanceDrafts((current) => ({ ...current, [row.staffId]: { ...current[row.staffId], breakMinutes: event.target.value } }))} className="mt-1 block w-24 rounded bg-[#1a1a1a] px-2 py-1 text-xs text-white" /></label>
                    <button type="button" disabled={markMutation.isPending} onClick={() => {
                      const draft = attendanceDrafts[row.staffId] || {};
                      const checkIn = draft.checkIn ?? localDateTimeValue(row.actualCheckIn);
                      const checkOut = draft.checkOut ?? localDateTimeValue(row.actualCheckOut);
                      markMutation.mutate({
                        staffId: row.staffId,
                        date: attendanceDate,
                        status: row.status,
                        actualCheckIn: checkIn ? new Date(checkIn).toISOString() : null,
                        actualCheckOut: checkOut ? new Date(checkOut).toISOString() : null,
                        breakMinutes: Number(draft.breakMinutes ?? row.breakMinutes),
                        correctionReason: "Attendance time details updated",
                      });
                    }} className="rounded border border-[#555] px-3 py-1.5 text-xs text-white">Save times · {row.totalWorkingHours} h</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Payroll (Admin only tab, but guard anyway) ---------------- */}
      {subTab === "Payroll" && canViewPayroll && (
        <div>
          <p className="mb-3 text-xs text-amber-300">
            This is a reference summary only. Prepare, approve, finalize, and record payments in HR &amp; Payroll.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-[#f5f5f5] text-lg font-semibold mr-auto">
              Payroll — {prettyMonth(payrollMonth)}
            </h3>
            <input
              type="month"
              value={payrollMonth}
              max={thisMonthStr()}
              onChange={(e) => setPayrollMonth(e.target.value)}
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none text-sm"
            />
            <button
              onClick={() => setSubTab("HR & Payroll")}
              className="bg-[#1a1a1a] text-[#ababab] hover:text-[#f5f5f5] px-3 py-2 rounded-lg text-sm"
            >
              Open payroll approvals and payments
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[#262626] rounded-lg p-4">
              <p className="text-[#ababab] text-xs">Total present-days</p>
              <p className="text-[#f5f5f5] text-xl font-bold">{totals.present}</p>
            </div>
            <div className="bg-[#262626] rounded-lg p-4">
              <p className="text-[#ababab] text-xs">Total absent-days</p>
              <p className="text-[#f5f5f5] text-xl font-bold">{totals.absent}</p>
            </div>
            <div className="bg-[#262626] rounded-lg p-4">
              <p className="text-[#ababab] text-xs">Total payable</p>
              <p className="text-[#34c76f] text-xl font-bold">{formatCurrency(totals.payable)}</p>
            </div>
          </div>

          {summaryLoading ? (
            <p className="text-[#ababab]">Loading…</p>
          ) : summary.length === 0 ? (
            <p className="text-[#ababab]">No active staff.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm text-left">
                <thead>
                  <tr className="text-[#ababab] border-b border-[#333]">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Present</th>
                    <th className="py-2 pr-3">Absent</th>
                    <th className="py-2 pr-3">Advance</th>
                    <th className="py-2 pr-3">Deduction</th>
                    <th className="py-2 pr-3">Payable</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3" />
                  </tr>
                </thead>
                <tbody>
                  {summary.map((r) => (
                    <tr key={r.staffId} className="text-[#f5f5f5] border-b border-[#262626] align-top">
                      <td className="py-2 pr-3 font-medium">{r.name}</td>
                      <td className="py-2 pr-3">{r.present}</td>
                      <td className="py-2 pr-3">{r.absent}</td>
                      <td className="py-2 pr-3">{formatCurrency(r.advance)}</td>
                      <td className="py-2 pr-3">{formatCurrency(r.deduction)}</td>
                      <td className="py-2 pr-3 font-semibold">{formatCurrency(r.payable)}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === "Paid" ? "bg-green-600/20 text-green-300" : "bg-yellow-600/20 text-yellow-300"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex flex-wrap gap-2">
                          {canEditPayroll && <button
                            onClick={() => setAdjustmentFor(r.staffId)}
                            className="text-xs px-2 py-1 rounded bg-[#1a1a1a] text-[#ababab] hover:text-[#f5f5f5]"
                          >
                            + Advance/Deduction
                          </button>}
                        </div>
                        {r.adjustments?.length > 0 && (
                          <ul className="mt-1 text-[10px] text-[#7a7a7a] space-y-0.5">
                            {r.adjustments.map((a) => (
                              <li key={a._id} className="flex items-center gap-2">
                                {a.dayKey} · {a.type} · {formatCurrency(a.amount)}
                                {a.note ? ` · ${a.note}` : ""}
                                <button
                                  onClick={() => deleteAdjMutation.mutate(a._id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === "HR & Payroll" && (canManageHr || canViewPayroll) && <StaffHrWorkspace role={role} />}

      {/* ---- Add/Edit staff form ---- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={submitStaffForm}
            className="bg-[#1a1a1a] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-3"
          >
            <h3 className="text-[#f5f5f5] text-lg font-semibold">
              {editingStaff ? "Edit staff" : "Add staff"}
            </h3>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="w-full bg-[#262626] text-white rounded px-3 py-2 outline-none"
            />
            <input
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              placeholder="Designation (e.g. Delivery rider)"
              className="w-full bg-[#262626] text-white rounded px-3 py-2 outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
                className="bg-[#262626] text-white rounded px-3 py-2 outline-none"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email (for salary slip)"
                className="bg-[#262626] text-white rounded px-3 py-2 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.cnic}
                onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                placeholder="CNIC (optional)"
                className="bg-[#262626] text-white rounded px-3 py-2 outline-none"
              />
              <input
                type="date"
                value={form.joinDate}
                onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                className="bg-[#262626] text-white rounded px-3 py-2 outline-none"
              />
            </div>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address (optional)"
              className="w-full bg-[#262626] text-white rounded px-3 py-2 outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" className="bg-[#262626] text-white rounded px-3 py-2 outline-none" />
              <input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="Branch / location" className="bg-[#262626] text-white rounded px-3 py-2 outline-none" />
              <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="bg-[#262626] text-white rounded px-3 py-2 outline-none">
                {["Permanent", "Contract", "Part-Time", "Temporary", "Intern", "Daily Wage", "Hourly Employee"].map((value) => <option key={value}>{value}</option>)}
              </select>
              <select value={form.employmentStatus} onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })} className="bg-[#262626] text-white rounded px-3 py-2 outline-none">
                {["Active", "On Probation", "On Leave", "Suspended", "Resigned", "Terminated", "Retired"].map((value) => <option key={value}>{value}</option>)}
              </select>
              <label className="text-xs text-[#aaa]">Probation end<input type="date" value={form.probationEndDate} onChange={(e) => setForm({ ...form, probationEndDate: e.target.value })} className="mt-1 w-full bg-[#262626] text-white rounded px-3 py-2 outline-none" /></label>
              <label className="text-xs text-[#aaa]">Contract end<input type="date" value={form.contractEndDate} onChange={(e) => setForm({ ...form, contractEndDate: e.target.value })} className="mt-1 w-full bg-[#262626] text-white rounded px-3 py-2 outline-none" /></label>
              <label className="text-xs text-[#aaa]">Changes effective from<input type="date" value={form.effectiveAt} onChange={(e) => setForm({ ...form, effectiveAt: e.target.value })} className="mt-1 w-full bg-[#262626] text-white rounded px-3 py-2 outline-none" /></label>
            </div>
            {canEditPayroll && (
              <input
                type="number"
                min="0"
                value={form.baseSalary}
                onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                placeholder="Monthly base salary (Rs)"
                className="w-full bg-[#262626] text-white rounded px-3 py-2 outline-none"
              />
            )}
            {canEditPayroll && (
              <section className="space-y-2 rounded-lg border border-[#383838] p-3">
                <h4 className="text-sm font-semibold text-white">Recurring salary components</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input value={salaryComponentDraft.name} onChange={(event) => setSalaryComponentDraft({ ...salaryComponentDraft, name: event.target.value, code: event.target.value.toUpperCase().replace(/[^A-Z0-9]+/g, "_") })} placeholder="Component name" className="bg-[#262626] text-white rounded px-3 py-2 outline-none" />
                  <select value={salaryComponentDraft.type} onChange={(event) => setSalaryComponentDraft({ ...salaryComponentDraft, type: event.target.value })} className="bg-[#262626] text-white rounded px-3 py-2 outline-none">
                    {["Earning", "Deduction", "EmployerContribution"].map((type) => <option key={type}>{type}</option>)}
                  </select>
                  <input type="number" min="0" step="0.01" value={salaryComponentDraft.amount} onChange={(event) => setSalaryComponentDraft({ ...salaryComponentDraft, amount: event.target.value })} placeholder="Amount" className="bg-[#262626] text-white rounded px-3 py-2 outline-none" />
                  <input type="date" value={salaryComponentDraft.effectiveFrom} onChange={(event) => setSalaryComponentDraft({ ...salaryComponentDraft, effectiveFrom: event.target.value })} className="bg-[#262626] text-white rounded px-3 py-2 outline-none" />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-[#bbb]">
                  <label><input type="checkbox" checked={salaryComponentDraft.taxable} onChange={(event) => setSalaryComponentDraft({ ...salaryComponentDraft, taxable: event.target.checked })} /> Taxable</label>
                  <label><input type="checkbox" checked={salaryComponentDraft.pensionable} onChange={(event) => setSalaryComponentDraft({ ...salaryComponentDraft, pensionable: event.target.checked })} /> Pensionable</label>
                </div>
                <button type="button" onClick={() => {
                  const amount = Number(salaryComponentDraft.amount);
                  if (!salaryComponentDraft.name.trim() || salaryComponentDraft.amount === "" ||
                      !(amount >= 0) || !salaryComponentDraft.effectiveFrom) {
                    enqueueSnackbar("Enter a component name, effective date, and valid amount.", { variant: "error" });
                    return;
                  }
                  setForm((current) => ({
                    ...current,
                    salaryComponents: [...(current.salaryComponents || []), {
                      ...salaryComponentDraft,
                      amount,
                      recurring: true,
                    }],
                  }));
                  setSalaryComponentDraft({ ...defaultSalaryComponentDraft, effectiveFrom: todayStr() });
                }} className="rounded border border-[#555] px-3 py-1.5 text-xs text-white">Add component</button>
                <ul className="space-y-1 text-xs text-[#aaa]">
                  {(form.salaryComponents || []).map((component, index) => (
                    <li key={`${component.code}-${index}`} className="flex justify-between gap-2">
                      <span>{component.name} · {component.type} · {formatCurrency(component.amount)} · from {component.effectiveFrom}</span>
                      <button type="button" onClick={() => setForm((current) => ({ ...current, salaryComponents: current.salaryComponents.filter((_, itemIndex) => itemIndex !== index) }))} className="text-red-300">Remove</button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {editingStaff && canEditStaff && <StaffHrDocumentsPanel staff={editingStaff} />}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingStaff(null);
                }}
                className="flex-1 bg-[#333] text-white rounded-lg py-2.5 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-[#f6b100] text-[#1f1f1f] rounded-lg py-2.5 font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---- Add advance/deduction ---- */}
      {adjustmentFor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!(Number(adjustmentForm.amount) > 0)) {
                enqueueSnackbar("Enter an amount greater than 0.", { variant: "error" });
                return;
              }
              addAdjMutation.mutate({
                staffId: adjustmentFor,
                type: adjustmentForm.type,
                amount: Number(adjustmentForm.amount),
                date: todayStr(),
                note: adjustmentForm.note,
              });
            }}
            className="bg-[#1a1a1a] rounded-lg w-full max-w-sm p-5 space-y-3"
          >
            <h3 className="text-[#f5f5f5] text-lg font-semibold">Advance / deduction</h3>
            <div className="flex gap-2">
              {["Advance", "Deduction"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAdjustmentForm((p) => ({ ...p, type: t }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                    adjustmentForm.type === t ? "bg-[#f6b100] text-[#1f1f1f]" : "bg-[#262626] text-[#ababab]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="0"
              value={adjustmentForm.amount}
              onChange={(e) => setAdjustmentForm((p) => ({ ...p, amount: e.target.value }))}
              placeholder="Amount (Rs)"
              className="w-full bg-[#262626] text-white rounded px-3 py-2 outline-none"
            />
            <input
              value={adjustmentForm.note}
              onChange={(e) => setAdjustmentForm((p) => ({ ...p, note: e.target.value }))}
              placeholder="Note (optional)"
              className="w-full bg-[#262626] text-white rounded px-3 py-2 outline-none"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAdjustmentFor(null)}
                className="flex-1 bg-[#333] text-white rounded-lg py-2.5 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addAdjMutation.isPending}
                className="flex-1 bg-[#f6b100] text-[#1f1f1f] rounded-lg py-2.5 font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---- Attendance history ---- */}
      {historyFor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#f5f5f5] text-lg font-semibold">
                Attendance — {staff.find((s) => s._id === historyFor)?.name}
              </h3>
              <input
                type="month"
                value={payrollMonth}
                max={thisMonthStr()}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="bg-[#262626] text-white rounded px-2 py-1 outline-none text-xs"
              />
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {(historyData?.data?.data ?? []).map((row) => (
                <div key={row.dayKey} className="flex items-center justify-between text-sm bg-[#262626] rounded px-3 py-1.5">
                  <span className="text-[#ababab]">{row.dayKey}</span>
                  <span
                    className={
                      row.status === "Present"
                        ? "text-[#34c76f]"
                        : row.status === "Absent"
                        ? "text-[#e6402e]"
                        : "text-[#f6b100]"
                    }
                  >
                    {row.status}
                  </span>
                </div>
              ))}
              {(historyData?.data?.data ?? []).length === 0 && (
                <p className="text-[#ababab] text-sm">No records for this month yet.</p>
              )}
            </div>
            <button
              onClick={() => setHistoryFor(null)}
              className="mt-4 w-full bg-[#333] text-white rounded-lg py-2.5 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
