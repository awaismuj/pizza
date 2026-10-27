import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaSignOutAlt } from "react-icons/fa";
import { removeUser } from "../redux/slices/userSlice";
import {
  createEmployeeLeaveRequest,
  clockEmployeeAttendance,
  createEmployeeLoanRequest,
  downloadStaffHrDocument,
  getEmployeeAttendanceSelf,
  getEmployeeDocuments,
  getEmployeeLeaveRequests,
  getEmployeeLeaveBalances,
  getEmployeeLeaveTypes,
  getEmployeeLoans,
  getEmployeeNotifications,
  getEmployeeSelf,
  logout,
  uploadEmployeeDocument,
} from "../https";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const inputClass = "w-full rounded bg-[#262626] px-3 py-2 text-white outline-none";
const panelClass = "rounded-xl border border-[#353535] bg-[#1a1a1a] p-4";
const errorMessage = (error) => error?.response?.data?.message || "The request failed. Please try again.";

const EmployeePortal = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [leaveForm, setLeaveForm] = useState({ leaveTypeId: "", startDate: today(), endDate: today(), reason: "" });
  const [documentFile, setDocumentFile] = useState(null);
  const [documentCategory, setDocumentCategory] = useState("Other");
  const [loanForm, setLoanForm] = useState({ requestedAmount: "", reason: "" });

  const profileQuery = useQuery({ queryKey: ["employeeSelf"], queryFn: getEmployeeSelf });
  const attendanceQuery = useQuery({
    queryKey: ["employeeAttendanceSelf"],
    queryFn: () => getEmployeeAttendanceSelf(),
  });
  const leaveTypesQuery = useQuery({ queryKey: ["employeeLeaveTypes"], queryFn: getEmployeeLeaveTypes });
  const leaveQuery = useQuery({ queryKey: ["employeeLeaveRequests"], queryFn: getEmployeeLeaveRequests });
  const leaveBalancesQuery = useQuery({ queryKey: ["employeeLeaveBalances"], queryFn: () => getEmployeeLeaveBalances() });
  const loansQuery = useQuery({ queryKey: ["employeeLoans"], queryFn: getEmployeeLoans });
  const notificationsQuery = useQuery({ queryKey: ["employeeNotifications"], queryFn: getEmployeeNotifications });
  const documentsQuery = useQuery({ queryKey: ["employeeDocuments"], queryFn: getEmployeeDocuments });
  const profile = profileQuery.data?.data?.data;
  const attendance = attendanceQuery.data?.data?.data || [];
  const todayAttendance = attendance.find((row) => row.date === today());
  const leaveTypes = leaveTypesQuery.data?.data?.data || [];
  const leaveRequests = leaveQuery.data?.data?.data || [];
  const leaveBalances = leaveBalancesQuery.data?.data?.data || [];
  const loans = loansQuery.data?.data?.data || [];
  const notifications = notificationsQuery.data?.data?.data || [];
  const documents = documentsQuery.data?.data?.data || [];

  const leaveMutation = useMutation({
    mutationFn: createEmployeeLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeLeaveRequests"] });
      setLeaveForm({ leaveTypeId: "", startDate: today(), endDate: today(), reason: "" });
      enqueueSnackbar("Leave request submitted.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const clockMutation = useMutation({
    mutationFn: clockEmployeeAttendance,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employeeAttendanceSelf"] }),
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const loanMutation = useMutation({
    mutationFn: createEmployeeLoanRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeLoans"] });
      setLoanForm({ requestedAmount: "", reason: "" });
      enqueueSnackbar("Loan request submitted for HR review.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const documentMutation = useMutation({
    mutationFn: uploadEmployeeDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeDocuments"] });
      setDocumentFile(null);
      enqueueSnackbar("Document uploaded securely.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(removeUser());
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });

  const downloadDocument = async (document) => {
    try {
      const response = await downloadStaffHrDocument(document._id);
      const objectUrl = URL.createObjectURL(response.data);
      const anchor = window.document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = document.originalName;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  };

  const submitLeave = (event) => {
    event.preventDefault();
    if (!leaveForm.leaveTypeId) {
      enqueueSnackbar("Select a leave type.", { variant: "error" });
      return;
    }
    leaveMutation.mutate(leaveForm);
  };
  const submitDocument = (event) => {
    event.preventDefault();
    if (!documentFile) {
      enqueueSnackbar("Select a document to upload.", { variant: "error" });
      return;
    }
    documentMutation.mutate({ file: documentFile, category: documentCategory });
  };

  return (
    <main className="min-h-screen bg-[#111] px-4 py-6 text-white sm:px-8">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-sm text-yellow-400">Staff self-service</p>
          <h1 className="text-2xl font-semibold">Employee Portal</h1>
        </div>
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-2 rounded bg-[#292929] px-3 py-2 text-sm hover:bg-[#383838] disabled:opacity-50"
        >
          <FaSignOutAlt /> Sign out
        </button>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        <section className={panelClass}>
          <h2 className="mb-3 text-lg font-semibold">My profile</h2>
          {profileQuery.isLoading ? <p className="text-sm text-[#aaa]">Loading profile…</p> : profileQuery.isError ? (
            <p role="alert" className="text-sm text-red-300">{errorMessage(profileQuery.error)}</p>
          ) : profile ? (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Employee ID", profile.employeeId],
                ["Name", profile.name],
                ["Position", profile.designation],
                ["Department", profile.department],
                ["Branch", profile.branch],
                ["Employment", profile.employmentStatus],
                ["Join date", profile.joinDate],
                ["Contract end", profile.contractEndDate || "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[#999]">{label}</dt>
                  <dd className="mt-1">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>

        <section className={panelClass}>
          <h2 className="mb-3 text-lg font-semibold">Request leave</h2>
          <form onSubmit={submitLeave} className="grid gap-3 sm:grid-cols-2">
            <select
              value={leaveForm.leaveTypeId}
              onChange={(event) => setLeaveForm({ ...leaveForm, leaveTypeId: event.target.value })}
              className={`${inputClass} sm:col-span-2`}
              required
            >
              <option value="">Select leave type</option>
              {leaveTypes.map((type) => <option key={type._id} value={type._id}>{type.name}{type.paid ? " (paid)" : " (unpaid)"}</option>)}
            </select>
            <label className="text-xs text-[#aaa]">From<input type="date" value={leaveForm.startDate} onChange={(event) => setLeaveForm({ ...leaveForm, startDate: event.target.value })} className={`${inputClass} mt-1`} required /></label>
            <label className="text-xs text-[#aaa]">To<input type="date" min={leaveForm.startDate} value={leaveForm.endDate} onChange={(event) => setLeaveForm({ ...leaveForm, endDate: event.target.value })} className={`${inputClass} mt-1`} required /></label>
            <textarea value={leaveForm.reason} onChange={(event) => setLeaveForm({ ...leaveForm, reason: event.target.value })} placeholder="Reason (optional)" className={`${inputClass} min-h-20 sm:col-span-2`} maxLength={1000} />
            <button type="submit" disabled={leaveMutation.isPending} className="rounded bg-yellow-400 px-4 py-2 font-medium text-black disabled:opacity-50 sm:col-span-2">
              {leaveMutation.isPending ? "Submitting…" : "Submit leave request"}
            </button>
          </form>
        </section>

        <section className={panelClass}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">My attendance</h2>
            <button
              type="button"
              disabled={clockMutation.isPending || Boolean(todayAttendance?.checkOut)}
              onClick={() => clockMutation.mutate(todayAttendance?.checkIn ? "out" : "in")}
              className="rounded bg-yellow-400 px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {clockMutation.isPending ? "Saving…" : todayAttendance?.checkOut ? "Shift complete" : todayAttendance?.checkIn ? "Check out" : "Check in"}
            </button>
          </div>
          {attendanceQuery.isError ? <p role="alert" className="text-sm text-red-300">{errorMessage(attendanceQuery.error)}</p> : attendance.length ? (
            <div className="max-h-72 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[#999]"><tr><th className="py-2">Date</th><th>Status</th><th>Check-in</th><th>Check-out</th><th>Hours</th></tr></thead>
                <tbody>{attendance.map((row) => <tr key={row._id} className="border-t border-[#303030]">
                  <td className="py-2">{row.date}</td><td>{row.status}</td>
                  <td>{row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td>{row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td>{row.hoursWorked ?? "—"}</td>
                </tr>)}</tbody>
              </table>
            </div>
          ) : <p className="text-sm text-[#999]">No attendance records for this month.</p>}
        </section>

        <section className={panelClass}>
          <h2 className="mb-3 text-lg font-semibold">My leave requests</h2>
          {leaveQuery.isError ? <p role="alert" className="text-sm text-red-300">{errorMessage(leaveQuery.error)}</p> : leaveRequests.length ? (
            <ul className="max-h-72 space-y-2 overflow-auto">
              {leaveRequests.map((request) => (
                <li key={request._id} className="rounded bg-[#242424] p-3 text-sm">
                  <div className="flex items-center justify-between gap-2"><span>{request.leaveType?.name || "Leave"} · {request.startDate} to {request.endDate}</span><span className="text-yellow-300">{request.status}</span></div>
                  {request.reason && <p className="mt-1 text-xs text-[#aaa]">{request.reason}</p>}
                  {request.reviewNote && <p className="mt-1 text-xs text-[#aaa]">Review: {request.reviewNote}</p>}
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-[#999]">You have no leave requests.</p>}
          <div className="mt-4 border-t border-[#353535] pt-3">
            <h3 className="mb-2 text-sm font-semibold">Leave balances</h3>
            {leaveBalancesQuery.isError ? <p role="alert" className="text-xs text-red-300">{errorMessage(leaveBalancesQuery.error)}</p> : leaveBalances.length ? (
              <ul className="space-y-1 text-xs text-[#bbb]">
                {leaveBalances.map((balance) => <li key={balance.leaveTypeId} className="flex justify-between gap-2"><span>{balance.leaveType} · used {balance.usedDays}</span><span>{balance.availableDays} available</span></li>)}
              </ul>
            ) : <p className="text-xs text-[#999]">No accrued leave entitlements.</p>}
          </div>
        </section>

        <section className={`${panelClass} lg:col-span-2`}>
          <h2 className="mb-1 text-lg font-semibold">My documents</h2>
          <p className="mb-3 text-xs text-[#999]">Files are private and available only to you and authorized HR staff.</p>
          <form onSubmit={submitDocument} className="mb-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <select value={documentCategory} onChange={(event) => setDocumentCategory(event.target.value)} className={inputClass}>
              {["Contract", "Identity", "Certification", "Medical", "Tax", "Other"].map((category) => <option key={category}>{category}</option>)}
            </select>
            <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-[#383838] file:px-2 file:py-1`} />
            <button type="submit" disabled={documentMutation.isPending} className="rounded bg-yellow-400 px-4 py-2 font-medium text-black disabled:opacity-50">
              {documentMutation.isPending ? "Uploading…" : "Upload"}
            </button>
          </form>
          {documentsQuery.isError ? <p role="alert" className="text-sm text-red-300">{errorMessage(documentsQuery.error)}</p> : documents.length ? (
            <ul className="divide-y divide-[#303030]">
              {documents.map((document) => (
                <li key={document._id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0"><span className="block truncate">{document.originalName}</span><span className="text-xs text-[#999]">{document.category} · {new Date(document.uploadedAt).toLocaleDateString()}</span></span>
                  <button type="button" onClick={() => downloadDocument(document)} className="shrink-0 rounded bg-[#303030] px-3 py-1.5 hover:bg-[#414141]">Download</button>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-[#999]">No documents have been added.</p>}
        </section>

        <section className={`${panelClass} lg:col-span-2`}>
          <h2 className="mb-3 text-lg font-semibold">Salary advance / loan request</h2>
          <form onSubmit={(event) => {
            event.preventDefault();
            loanMutation.mutate({ requestedAmount: Number(loanForm.requestedAmount), reason: loanForm.reason });
          }} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
            <input required type="number" min="0.01" step="0.01" value={loanForm.requestedAmount} onChange={(event) => setLoanForm({ ...loanForm, requestedAmount: event.target.value })} placeholder="Requested amount" className={inputClass} />
            <input value={loanForm.reason} onChange={(event) => setLoanForm({ ...loanForm, reason: event.target.value })} maxLength={1000} placeholder="Reason (optional)" className={inputClass} />
            <button type="submit" disabled={loanMutation.isPending} className="rounded bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-50">{loanMutation.isPending ? "Submitting…" : "Request"}</button>
          </form>
          <p className="mt-2 text-xs text-[#999]">Requests require HR approval. Approved repayments are fixed, interest-free payroll deductions.</p>
          {loansQuery.isError ? <p role="alert" className="mt-2 text-sm text-red-300">{errorMessage(loansQuery.error)}</p> : loans.length ? (
            <ul className="mt-3 divide-y divide-[#303030]">
              {loans.map((loan) => <li key={loan._id} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
                <span>{loan.status} · {loan.reason || "No reason supplied"}</span>
                <span>{loan.status === "Pending" ? `Requested ${loan.requestedAmount}` : `Remaining ${loan.remainingBalance} · ${loan.monthlyInstallment}/month from ${loan.startMonth}`}</span>
              </li>)}
            </ul>
          ) : <p className="mt-3 text-sm text-[#999]">You have no loan requests.</p>}
        </section>

        <section className={`${panelClass} lg:col-span-2`}>
          <h2 className="mb-3 text-lg font-semibold">HR notifications</h2>
          {notificationsQuery.isError ? <p role="alert" className="text-sm text-red-300">{errorMessage(notificationsQuery.error)}</p> : notifications.length ? (
            <ul className="divide-y divide-[#303030]">
              {notifications.map((notification) => <li key={notification._id} className="py-3">
                <div className="flex flex-wrap justify-between gap-2 text-sm"><b>{notification.subject}</b><span className="text-xs text-[#999]">{new Date(notification.createdAt).toLocaleString()}</span></div>
                <p className="mt-1 text-sm text-[#bbb]">{notification.message}</p>
                <p className="mt-1 text-xs text-[#888]">{notification.status === "Delivered" ? "Email sent" : notification.status === "Failed" ? "Email delivery failed" : "Email pending delivery"}</p>
              </li>)}
            </ul>
          ) : <p className="text-sm text-[#999]">No notifications.</p>}
        </section>
      </div>
    </main>
  );
};

export default EmployeePortal;
