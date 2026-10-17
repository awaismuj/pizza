import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaPlus, FaUserSlash, FaEnvelope, FaCheck, FaTimes, FaPen } from "react-icons/fa";
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
  setStaffSalaryPaid,
  sendStaffSlips,
} from "../../https";
import { formatCurrency } from "../../utils/orderMetrics";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const thisMonthStr = () => todayStr().slice(0, 7);
const prettyMonth = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

const SUB_TABS = ["Staff", "Attendance", "Payroll"];

const defaultStaffForm = {
  name: "",
  phone: "",
  email: "",
  designation: "",
  cnic: "",
  address: "",
  joinDate: todayStr(),
  baseSalary: "",
};

const StaffManagement = () => {
  const role = useSelector((state) => state.user.role);
  const isAdmin = String(role || "").toLowerCase() === "admin";
  const queryClient = useQueryClient();

  const [subTab, setSubTab] = useState("Staff");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState(defaultStaffForm);

  const [attendanceDate, setAttendanceDate] = useState(todayStr());
  const [payrollMonth, setPayrollMonth] = useState(thisMonthStr());
  const [adjustmentFor, setAdjustmentFor] = useState(null);
  const [adjustmentForm, setAdjustmentForm] = useState({ type: "Advance", amount: "", note: "" });
  const [historyFor, setHistoryFor] = useState(null);

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: () => getStaff(),
    placeholderData: keepPreviousData,
  });
  const staff = staffData?.data?.data ?? [];

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

  const addMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      invalidateAll();
      enqueueSnackbar("Staff member added successfully!", { variant: "success" });
      setIsFormOpen(false);
      setForm(defaultStaffForm);
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to add staff.", { variant: "error" }),
  });

  const updateMutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: () => {
      invalidateAll();
      enqueueSnackbar("Staff details updated!", { variant: "success" });
      setIsFormOpen(false);
      setEditingStaff(null);
      setForm(defaultStaffForm);
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to update staff.", { variant: "error" }),
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateStaff,
    onSuccess: () => {
      invalidateAll();
      enqueueSnackbar("Staff member removed.", { variant: "success" });
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to remove staff.", { variant: "error" }),
  });

  const markMutation = useMutation({
    mutationFn: markStaffAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffAttendance"]);
      queryClient.invalidateQueries(["staffSummary"]);
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to mark attendance.", { variant: "error" }),
  });

  const addAdjMutation = useMutation({
    mutationFn: addStaffAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffSummary"]);
      enqueueSnackbar("Adjustment saved.", { variant: "success" });
      setAdjustmentFor(null);
      setAdjustmentForm({ type: "Advance", amount: "", note: "" });
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to save adjustment.", { variant: "error" }),
  });

  const deleteAdjMutation = useMutation({
    mutationFn: deleteStaffAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffSummary"]);
      enqueueSnackbar("Adjustment removed.", { variant: "success" });
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to delete adjustment.", { variant: "error" }),
  });

  const paidMutation = useMutation({
    mutationFn: setStaffSalaryPaid,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["staffSummary"]);
      enqueueSnackbar(res?.data?.message || "Salary status updated.", { variant: "success" });
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to update salary status.", { variant: "error" }),
  });

  const sendSlipsMutation = useMutation({
    mutationFn: sendStaffSlips,
    onSuccess: (res) => {
      enqueueSnackbar(res?.data?.message || "Salary slips sent to all staff.", { variant: "success" });
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to send slips.", { variant: "error" }),
  });

  const openAddForm = () => {
    setEditingStaff(null);
    setForm(defaultStaffForm);
    setIsFormOpen(true);
  };

  const openEditForm = (s) => {
    setEditingStaff(s);
    setForm({
      name: s.name || "",
      phone: s.phone || "",
      email: s.email || "",
      designation: s.designation || "",
      cnic: s.cnic || "",
      address: s.address || "",
      joinDate: s.joinDate || todayStr(),
      baseSalary: s.baseSalary === undefined ? "" : s.baseSalary,
    });
    setIsFormOpen(true);
  };

  const submitStaffForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      enqueueSnackbar("Enter a staff name.", { variant: "error" });
      return;
    }
    const payload = { ...form, baseSalary: form.baseSalary === "" ? 0 : Number(form.baseSalary) };
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
    <div className="space-y-4 pb-10">
      {/* Subtab pill switcher */}
      <div className="flex items-center gap-2">
        {SUB_TABS.filter((t) => t !== "Payroll" || isAdmin).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              subTab === t
                ? "bg-amber-500 text-slate-950 font-black shadow-amber-500/20"
                : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ---------------- Staff list ---------------- */}
      {subTab === "Staff" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">
                Staff Directory & Roster
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Active restaurant workforce, job roles, contacts, and base payroll rates
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider shadow-sm transition active:scale-95"
              >
                <FaPlus size={11} /> Add Staff
              </button>
            )}
          </div>

          {staffLoading ? (
            <p className="text-slate-400 text-xs py-4">Loading staff directory…</p>
          ) : staff.length === 0 ? (
            <p className="text-slate-400 text-xs py-8 text-center">No staff members enrolled yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-xs text-left">
                <thead>
                  <tr className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] font-black border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 pr-3">Name</th>
                    <th className="py-2.5 pr-3">Designation</th>
                    <th className="py-2.5 pr-3">Phone</th>
                    <th className="py-2.5 pr-3">Email</th>
                    <th className="py-2.5 pr-3">Joined Date</th>
                    {isAdmin && <th className="py-2.5 pr-3">Monthly Base</th>}
                    {isAdmin && <th className="py-2.5 pr-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {staff.map((s) => (
                    <tr key={s._id} className="text-slate-900 dark:text-white hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 pr-3 font-bold">{s.name}</td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 font-semibold">{s.designation || "—"}</td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{s.phone || "—"}</td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{s.email || "—"}</td>
                      <td className="py-3 pr-3 text-slate-400">{s.joinDate}</td>
                      {isAdmin && <td className="py-3 pr-3 font-bold text-amber-600 dark:text-amber-400">{formatCurrency(s.baseSalary)}</td>}
                      {isAdmin && (
                        <td className="py-3 pr-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditForm(s)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Edit"
                            >
                              <FaPen size={12} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deactivate staff member "${s.name}"? Attendance & salary history will be preserved.`)) {
                                  deactivateMutation.mutate(s._id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Remove"
                            >
                              <FaUserSlash size={12} />
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">
                Daily Attendance Register
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Automatic baseline Present. Mark Absent or Leave as shift duties vary.
              </p>
            </div>
            <input
              type="date"
              value={attendanceDate}
              max={todayStr()}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-500 font-semibold"
            />
          </div>

          {attendanceLoading ? (
            <p className="text-slate-400 text-xs py-4">Loading attendance records…</p>
          ) : attendanceRows.length === 0 ? (
            <p className="text-slate-400 text-xs py-8 text-center">No active staff found for this date.</p>
          ) : (
            <div className="space-y-2">
              {attendanceRows.map((row) => (
                <div
                  key={row.staffId}
                  className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-xs">{row.name}</p>
                    <p className="text-slate-400 text-[11px]">
                      {row.designation || "Staff"}
                      {!row.auto && row.markedBy ? ` · verified by ${row.markedBy}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {["Present", "Absent", "Leave"].map((st) => (
                      <button
                        key={st}
                        onClick={() =>
                          markMutation.mutate({ staffId: row.staffId, date: attendanceDate, status: st })
                        }
                        disabled={markMutation.isPending}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          row.status === st
                            ? st === "Present"
                              ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                              : st === "Absent"
                              ? "bg-rose-500 text-white font-black shadow-xs"
                              : "bg-amber-500 text-slate-950 font-black shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-400"
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
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-amber-500"
                    >
                      History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Payroll (Admin Only) ---------------- */}
      {subTab === "Payroll" && isAdmin && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-slate-900 dark:text-white text-base sm:text-lg font-bold tracking-tight">
                Monthly Payroll Audit · {prettyMonth(payrollMonth)}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Net pay calculations, advances, deductions, and electronic salary slips
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="month"
                value={payrollMonth}
                max={thisMonthStr()}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-500 font-semibold"
              />
              <button
                onClick={() => sendSlipsMutation.mutate({ month: payrollMonth })}
                disabled={sendSlipsMutation.isPending}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-200 dark:border-slate-700"
              >
                <FaEnvelope size={11} /> Email Slips
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Present Days</p>
              <p className="text-slate-900 dark:text-white text-2xl font-black mt-1">{totals.present}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Absent Days</p>
              <p className="text-slate-900 dark:text-white text-2xl font-black mt-1">{totals.absent}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-4">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Net Payable</p>
              <p className="text-emerald-600 dark:text-emerald-400 text-2xl font-black mt-1">
                {formatCurrency(totals.payable)}
              </p>
            </div>
          </div>

          {summaryLoading ? (
            <p className="text-slate-400 text-xs py-4">Computing monthly payroll ledger…</p>
          ) : summary.length === 0 ? (
            <p className="text-slate-400 text-xs py-8 text-center">No staff records for this billing month.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-xs text-left">
                <thead>
                  <tr className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] font-black border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 pr-3">Employee</th>
                    <th className="py-2.5 pr-3">Present</th>
                    <th className="py-2.5 pr-3">Absent</th>
                    <th className="py-2.5 pr-3">Advance</th>
                    <th className="py-2.5 pr-3">Deduction</th>
                    <th className="py-2.5 pr-3">Net Payable</th>
                    <th className="py-2.5 pr-3">Status</th>
                    <th className="py-2.5 pr-3 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {summary.map((r) => (
                    <tr key={r.staffId} className="text-slate-900 dark:text-white hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition align-top">
                      <td className="py-3 pr-3 font-bold">{r.name}</td>
                      <td className="py-3 pr-3 font-semibold text-emerald-600 dark:text-emerald-400">{r.present}</td>
                      <td className="py-3 pr-3 font-semibold text-rose-500">{r.absent}</td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{formatCurrency(r.advance)}</td>
                      <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{formatCurrency(r.deduction)}</td>
                      <td className="py-3 pr-3 font-black text-slate-900 dark:text-white">{formatCurrency(r.payable)}</td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setAdjustmentFor(r.staffId)}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                          >
                            + Adjustment
                          </button>
                          <button
                            onClick={() =>
                              paidMutation.mutate({
                                staffId: r.staffId,
                                month: payrollMonth,
                                paid: r.status !== "Paid",
                              })
                            }
                            disabled={paidMutation.isPending}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                              r.status === "Paid"
                                ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
                            }`}
                          >
                            {r.status === "Paid" ? <><FaTimes size={10} /> Unpaid</> : <><FaCheck size={10} /> Mark Paid</>}
                          </button>
                        </div>
                        {r.adjustments?.length > 0 && (
                          <ul className="mt-1.5 text-[10px] text-slate-400 space-y-0.5 text-right">
                            {r.adjustments.map((a) => (
                              <li key={a._id} className="inline-block mr-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {a.type} {formatCurrency(a.amount)}
                                <button
                                  onClick={() => deleteAdjMutation.mutate(a._id)}
                                  className="text-rose-500 hover:text-rose-700 ml-1 font-bold"
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

      {/* ---- Add/Edit staff Modal ---- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={submitStaffForm}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-3.5 shadow-2xl"
          >
            <div>
              <h3 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                {editingStaff ? "Edit Staff Details" : "Enroll New Staff Member"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Enter contact and monthly base salary data
              </p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Full Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ali Ahmed"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Designation / Position
              </label>
              <input
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. Master Chef / Cashier / Delivery Rider"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Phone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ali@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  CNIC Number
                </label>
                <input
                  value={form.cnic}
                  onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                  placeholder="35201-..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-semibold"
                />
              </div>
            </div>

            {isAdmin && (
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Base Salary (PKR / Month)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.baseSalary}
                  onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                  placeholder="e.g. 45000"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-bold"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingStaff(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl py-2.5 text-xs font-black shadow-sm transition active:scale-95 disabled:opacity-50"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---- Add advance/deduction Modal ---- */}
      {adjustmentFor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
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
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-slate-900 dark:text-white text-base font-bold">Record Salary Adjustment</h3>
            <div className="flex gap-2">
              {["Advance", "Deduction"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAdjustmentForm((p) => ({ ...p, type: t }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    adjustmentForm.type === t
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
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
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-bold"
            />
            <input
              value={adjustmentForm.note}
              onChange={(e) => setAdjustmentForm((p) => ({ ...p, note: e.target.value }))}
              placeholder="Note or reason (optional)"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustmentFor(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addAdjMutation.isPending}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl py-2.5 text-xs font-black shadow-sm transition active:scale-95"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---- Attendance history Modal ---- */}
      {historyFor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-slate-900 dark:text-white text-base font-bold">
                Attendance: {staff.find((s) => s._id === historyFor)?.name}
              </h3>
              <input
                type="month"
                value={payrollMonth}
                max={thisMonthStr()}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2 py-1 outline-none text-xs font-semibold"
              />
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {(historyData?.data?.data ?? []).map((row) => (
                <div key={row.dayKey} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 rounded-xl px-3 py-2">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">{row.dayKey}</span>
                  <span
                    className={`font-bold ${
                      row.status === "Present"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : row.status === "Absent"
                        ? "text-rose-500"
                        : "text-amber-500"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
              {(historyData?.data?.data ?? []).length === 0 && (
                <p className="text-slate-400 text-xs py-4 text-center">No attendance records for this month.</p>
              )}
            </div>
            <button
              onClick={() => setHistoryFor(null)}
              className="mt-4 w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 text-xs font-bold transition"
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
