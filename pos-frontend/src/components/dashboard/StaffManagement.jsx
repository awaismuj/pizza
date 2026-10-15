import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaPlus, FaUserSlash, FaEnvelope, FaDownload, FaCheck, FaTimes, FaPen } from "react-icons/fa";
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

// Full Staff Management screen: staff records, daily attendance (auto
// Present, Cashier/Admin can mark Absent/Leave), and monthly payroll.
// Salary figures only ever render when `isAdmin` — the backend also
// strips them for non-admins, this is the second layer.
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
  const [adjustmentFor, setAdjustmentFor] = useState(null); // staffId
  const [adjustmentForm, setAdjustmentForm] = useState({ type: "Advance", amount: "", note: "" });
  const [historyFor, setHistoryFor] = useState(null); // staffId

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
  const paidMutation = useMutation({
    mutationFn: setStaffSalaryPaid,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["staffSummary"]);
      const slip = res?.data?.slip;
      if (slip?.sent) enqueueSnackbar("Marked paid — salary slip emailed.", { variant: "success" });
      else if (slip?.skipped) enqueueSnackbar(`Marked paid. Slip not emailed: ${slip.reason}`, { variant: "warning" });
      else enqueueSnackbar("Salary status updated.", { variant: "success" });
    },
    onError: (e) => onError(e, "Failed to update salary status."),
  });
  const sendSlipsMutation = useMutation({
    mutationFn: sendStaffSlips,
    onSuccess: (res) => {
      const results = res?.data?.data ?? [];
      const sent = results.filter((r) => r.sent).length;
      const skipped = results.filter((r) => r.skipped).length;
      enqueueSnackbar(`Slips emailed: ${sent}${skipped ? `, ${skipped} skipped (no email on file)` : ""}.`, {
        variant: sent > 0 ? "success" : "warning",
      });
    },
    onError: (e) => onError(e, "Failed to send slips."),
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
      baseSalary: isAdmin ? s.baseSalary ?? "" : "",
    });
    setIsFormOpen(true);
  };

  const submitStaffForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      enqueueSnackbar("Enter a name.", { variant: "error" });
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
    <div className="px-4 sm:px-10 pb-10">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {SUB_TABS.filter((t) => t !== "Payroll" || isAdmin).map((t) => (
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
            {isAdmin && (
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-[#f6b100] text-[#1f1f1f] font-semibold px-4 py-2 rounded-lg"
              >
                <FaPlus /> Add staff
              </button>
            )}
          </div>

          {staffLoading ? (
            <p className="text-[#ababab]">Loading…</p>
          ) : staff.length === 0 ? (
            <p className="text-[#ababab]">No staff added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm text-left">
                <thead>
                  <tr className="text-[#ababab] border-b border-[#333]">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Designation</th>
                    <th className="py-2 pr-3">Phone</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Joined</th>
                    {isAdmin && <th className="py-2 pr-3">Salary</th>}
                    {isAdmin && <th className="py-2 pr-3" />}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s._id} className="text-[#f5f5f5] border-b border-[#262626]">
                      <td className="py-2 pr-3 font-medium">{s.name}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.designation || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.phone || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.email || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{s.joinDate}</td>
                      {isAdmin && <td className="py-2 pr-3">{formatCurrency(s.baseSalary)}/mo</td>}
                      {isAdmin && (
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
              onChange={(e) => setAttendanceDate(e.target.value)}
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
                  <div className="flex gap-2">
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Payroll (Admin only tab, but guard anyway) ---------------- */}
      {subTab === "Payroll" && isAdmin && (
        <div>
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
              onClick={() => sendSlipsMutation.mutate({ month: payrollMonth })}
              disabled={sendSlipsMutation.isPending}
              className="flex items-center gap-2 bg-[#1a1a1a] text-[#ababab] hover:text-[#f5f5f5] px-3 py-2 rounded-lg text-sm"
            >
              <FaEnvelope /> Email all slips
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
                          <button
                            onClick={() => setAdjustmentFor(r.staffId)}
                            className="text-xs px-2 py-1 rounded bg-[#1a1a1a] text-[#ababab] hover:text-[#f5f5f5]"
                          >
                            + Advance/Deduction
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
                            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                              r.status === "Paid" ? "bg-[#1a1a1a] text-[#ababab]" : "bg-[#34c76f] text-[#0f1f14]"
                            }`}
                          >
                            {r.status === "Paid" ? (
                              <>
                                <FaTimes /> Mark unpaid
                              </>
                            ) : (
                              <>
                                <FaCheck /> Mark paid &amp; email slip
                              </>
                            )}
                          </button>
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
            {isAdmin && (
              <input
                type="number"
                min="0"
                value={form.baseSalary}
                onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                placeholder="Monthly base salary (Rs)"
                className="w-full bg-[#262626] text-white rounded px-3 py-2 outline-none"
              />
            )}
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
