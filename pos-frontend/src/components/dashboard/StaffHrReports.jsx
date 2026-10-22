import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { exportStaffHrReport, getStaffHrReport } from "../../https";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const startOfMonth = () => `${today().slice(0, 7)}-01`;
const types = [
  ["employees", "Employee register"],
  ["attendance", "Attendance"],
  ["leave", "Leave"],
  ["overtime", "Overtime"],
  ["payroll", "Payroll"],
  ["payments", "Salary payments"],
];
const statusesByType = {
  employees: ["Active", "On Probation", "On Leave", "Suspended", "Resigned", "Terminated", "Retired"],
  attendance: ["Present", "Absent", "Late Arrival", "Early Departure", "Half Day", "Leave", "Weekly Off", "Public Holiday", "Rest Day", "Work From Home", "Official Duty"],
  leave: ["Pending", "Approved", "Rejected", "Cancelled"],
  overtime: ["Pending", "Approved", "Rejected", "Paid"],
  payroll: ["Draft", "Pending Approval", "Approved", "Finalized"],
  payments: ["Draft", "Pending Approval", "Approved", "Processing", "Paid", "Failed", "Cancelled", "Unpaid"],
};
const errorMessage = (error) => error?.response?.data?.message || "The report could not be generated.";

const StaffHrReports = ({ role }) => {
  const roleName = String(role || "").toLowerCase();
  const payrollAccess = ["admin", "payroll manager", "accountant"].includes(roleName);
  const [type, setType] = useState("attendance");
  const [from, setFrom] = useState(startOfMonth());
  const [to, setTo] = useState(today());
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState("");
  const [filters, setFilters] = useState(null);
  const reportQuery = useQuery({
    queryKey: ["staffHrReport", filters],
    queryFn: () => getStaffHrReport(filters),
    enabled: Boolean(filters),
  });
  const report = reportQuery.data?.data?.data;
  const rows = report?.rows || [];
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const currentFilters = {
    type,
    from,
    to,
    ...(department.trim() ? { department: department.trim() } : {}),
    ...(branch.trim() ? { branch: branch.trim() } : {}),
    ...(status ? { status } : {}),
  };
  const filtersAreCurrent = Boolean(filters) && JSON.stringify(filters) === JSON.stringify(currentFilters);

  const runReport = (event) => {
    event.preventDefault();
    if (from > to) {
      enqueueSnackbar("Start date must not be after end date.", { variant: "error" });
      return;
    }
    setFilters(currentFilters);
  };
  const download = async (format) => {
    if (!filters) return;
    try {
      const response = await exportStaffHrReport({ ...filters, format });
      const objectUrl = URL.createObjectURL(response.data);
      const anchor = window.document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `hr-${filters.type}-${filters.from}-${filters.to}.${format}`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-[#383838] bg-[#222] p-4">
      <header>
        <h3 className="font-semibold text-white">HR reports and exports</h3>
        <p className="mt-1 text-xs text-[#999]">Export filtered employee, attendance, leave, overtime, payroll, or payment records. Export requests are audited.</p>
      </header>
      <form onSubmit={runReport} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <select value={type} onChange={(event) => { setType(event.target.value); setStatus(""); }} className="rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2 text-sm text-white">
          {types.filter(([value]) => payrollAccess || !["payroll", "payments"].includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label className="text-xs text-[#999]">From<input required type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-1 w-full rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2 text-sm text-white" /></label>
        <label className="text-xs text-[#999]">To<input required type="date" min={from} value={to} onChange={(event) => setTo(event.target.value)} className="mt-1 w-full rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2 text-sm text-white" /></label>
        <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Department (exact)" className="rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2 text-sm text-white" />
        <input value={branch} onChange={(event) => setBranch(event.target.value)} placeholder="Branch / location (exact)" className="rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2 text-sm text-white" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2 text-sm text-white">
          <option value="">Any status</option>
          {(statusesByType[type] || []).map((value) => <option key={value}>{value}</option>)}
        </select>
        <button type="submit" disabled={reportQuery.isFetching} className="rounded-lg bg-[#f6b100] px-4 py-2 text-sm font-semibold text-[#171717] disabled:opacity-50 sm:col-span-2 xl:col-span-3">
          {reportQuery.isFetching ? "Generating…" : "Generate report"}
        </button>
      </form>
      {reportQuery.isError && <p role="alert" className="text-sm text-red-300">{errorMessage(reportQuery.error)}</p>}
      {report && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#bbb]">{report.count} records · {report.range.from} to {report.range.to}</p>
            <div className="flex gap-2">
              {["csv", "xls", "pdf"].map((format) => <button key={format} type="button" disabled={!filtersAreCurrent} onClick={() => download(format)} className="rounded bg-[#383838] px-3 py-1.5 text-xs uppercase text-white hover:bg-[#484848] disabled:opacity-50">{format === "xls" ? "Excel" : format}</button>)}
            </div>
          </div>
          {!filtersAreCurrent && <p className="text-xs text-amber-300">Filters have changed. Generate the report again before exporting.</p>}
          {rows.length ? (
            <div className="overflow-auto">
              <table className="min-w-full text-left text-xs">
                <thead><tr className="border-b border-[#444] text-[#aaa]">{columns.map((column) => <th key={column} className="whitespace-nowrap px-2 py-2">{column}</th>)}</tr></thead>
                <tbody>{rows.slice(0, 100).map((row, index) => <tr key={`${index}-${row.employeeId || row.name || ""}`} className="border-b border-[#333]">
                  {columns.map((column) => <td key={column} className="whitespace-nowrap px-2 py-2 text-[#ddd]">{String(row[column] ?? "—")}</td>)}
                </tr>)}</tbody>
              </table>
              {rows.length > 100 && <p className="pt-2 text-xs text-[#999]">Showing 100 of {rows.length} records; exports include the full report.</p>}
            </div>
          ) : <p className="text-sm text-[#999]">No records matched these filters.</p>}
        </>
      )}
    </section>
  );
};

export default StaffHrReports;
