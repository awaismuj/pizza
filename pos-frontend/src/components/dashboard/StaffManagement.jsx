import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  FaPlus,
  FaUserSlash,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaPen,
  FaTrash,
  FaSearch,
  FaShieldAlt,
  FaKey,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
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
  getAllUsers,
  createSystemUser,
  updateSystemUser,
  deleteSystemUser,
  updateUserPermissions,
} from "../../https";
import { formatCurrency } from "../../utils/orderMetrics";
import PermissionMatrix from "./PermissionMatrix";
import {
  ROLE_DEFAULT_PERMISSIONS,
  PERMISSION_DEFINITIONS,
  canUserAccessERP,
} from "../../utils/orderPermissions";

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

const SUB_TABS = ["Staff", "Attendance", "Payroll", "System Access"];

const defaultStaffForm = {
  name: "",
  phone: "",
  email: "",
  designation: "",
  cnic: "",
  address: "",
  joinDate: todayStr(),
  baseSalary: "",
  enableSystemLogin: false,
  loginPassword: "",
  systemRole: "Cashier",
  permissions: { ...ROLE_DEFAULT_PERMISSIONS["Cashier"] },
};

const defaultUserForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "Cashier",
  status: "Approved",
  permissions: { ...ROLE_DEFAULT_PERMISSIONS["Cashier"] },
};

const StaffManagement = () => {
  const currentUser = useSelector((state) => state.user);
  const role = currentUser.role;
  const isAdmin = String(role || "").toLowerCase() === "admin";
  const queryClient = useQueryClient();

  const [subTab, setSubTab] = useState("Staff");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState(defaultStaffForm);

  // System User CRUD State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState(defaultUserForm);
  const [userSearchTerm, setUserSearchTerm] = useState("");

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

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
    enabled: subTab === "System Access" || isFormOpen,
    placeholderData: keepPreviousData,
  });
  const allUsers = usersData?.data?.data ?? [];

  // System User Mutations
  const createUserMutation = useMutation({
    mutationFn: createSystemUser,
    onSuccess: (res) => {
      enqueueSnackbar(res.data?.message || "User account created successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsUserModalOpen(false);
      setUserForm(defaultUserForm);
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to create user account.", { variant: "error" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateSystemUser,
    onSuccess: (res) => {
      enqueueSnackbar(res.data?.message || "User account updated successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsUserModalOpen(false);
      setEditingUser(null);
      setUserForm(defaultUserForm);
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to update user.", { variant: "error" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteSystemUser,
    onSuccess: (res) => {
      enqueueSnackbar(res.data?.message || "User account deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to delete user.", { variant: "error" });
    },
  });

  const permissionMutation = useMutation({
    mutationFn: updateUserPermissions,
    onSuccess: (res) => {
      enqueueSnackbar(res.data?.message || "User permissions updated successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      enqueueSnackbar(err?.response?.data?.message || "Failed to update permissions.", { variant: "error" });
    },
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries(["staff"]);
    queryClient.invalidateQueries(["staffAttendance"]);
    queryClient.invalidateQueries(["staffAttendanceHistory"]);
    queryClient.invalidateQueries(["staffSummary"]);
    queryClient.invalidateQueries(["users"]);
  };

  const addMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: async (res) => {
      invalidateAll();
      enqueueSnackbar("Staff member added successfully!", { variant: "success" });

      // If system login was enabled, create/link the user account
      if (form.enableSystemLogin && form.email && form.loginPassword) {
        try {
          const numericPhone = form.phone.replace(/\D/g, "");
          const phoneValid = numericPhone.length >= 10 ? Number(numericPhone.slice(-10)) : 9999999999;
          await createSystemUser({
            name: form.name.trim(),
            email: form.email.toLowerCase().trim(),
            phone: phoneValid,
            password: form.loginPassword,
            role: form.systemRole,
            status: "Approved",
            permissions: form.permissions,
            canAccessERP: Boolean(form.permissions?.canAccessERP),
          });
          enqueueSnackbar(`System user account created for ${form.name}!`, { variant: "success" });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        } catch (uErr) {
          enqueueSnackbar(uErr?.response?.data?.message || "Staff saved, but failed to create system user.", {
            variant: "warning",
          });
        }
      }

      setIsFormOpen(false);
      setForm(defaultStaffForm);
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to add staff.", { variant: "error" }),
  });

  const updateMutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: async () => {
      invalidateAll();
      enqueueSnackbar("Staff details updated!", { variant: "success" });

      // If user enabled system login on edit
      if (form.enableSystemLogin && form.email) {
        try {
          const existing = allUsers.find(
            (u) => u.email?.toLowerCase().trim() === form.email.toLowerCase().trim()
          );
          if (existing) {
            await updateSystemUser({
              id: existing._id,
              name: form.name.trim(),
              role: form.systemRole,
              permissions: form.permissions,
              canAccessERP: Boolean(form.permissions?.canAccessERP),
              ...(form.loginPassword ? { password: form.loginPassword } : {}),
            });
            enqueueSnackbar(`Linked system user updated!`, { variant: "success" });
            queryClient.invalidateQueries({ queryKey: ["users"] });
          } else if (form.loginPassword) {
            const numericPhone = form.phone.replace(/\D/g, "");
            const phoneValid = numericPhone.length >= 10 ? Number(numericPhone.slice(-10)) : 9999999999;
            await createSystemUser({
              name: form.name.trim(),
              email: form.email.toLowerCase().trim(),
              phone: phoneValid,
              password: form.loginPassword,
              role: form.systemRole,
              status: "Approved",
              permissions: form.permissions,
              canAccessERP: Boolean(form.permissions?.canAccessERP),
            });
            enqueueSnackbar(`New system login account created for staff member!`, { variant: "success" });
            queryClient.invalidateQueries({ queryKey: ["users"] });
          }
        } catch (uErr) {
          console.error("Staff user link error", uErr);
        }
      }

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
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to remove adjustment.", { variant: "error" }),
  });

  const payMutation = useMutation({
    mutationFn: setStaffSalaryPaid,
    onSuccess: () => {
      queryClient.invalidateQueries(["staffSummary"]);
      enqueueSnackbar("Salary payment status updated.", { variant: "success" });
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to update payment.", { variant: "error" }),
  });

  const sendSlipsMutation = useMutation({
    mutationFn: sendStaffSlips,
    onSuccess: (res) => {
      const { sent = 0, failed = 0 } = res?.data?.data || {};
      enqueueSnackbar(`Salary slips sent: ${sent} delivered, ${failed} failed.`, {
        variant: failed ? "warning" : "success",
      });
    },
    onError: (e) => enqueueSnackbar(e?.response?.data?.message || "Failed to email salary slips.", { variant: "error" }),
  });

  const openAddStaffForm = () => {
    setEditingStaff(null);
    setForm(defaultStaffForm);
    setIsFormOpen(true);
  };

  const openEditStaffForm = (s) => {
    setEditingStaff(s);
    const existingUser = allUsers.find(
      (u) => u.email?.toLowerCase().trim() === (s.email || "").toLowerCase().trim()
    );

    setForm({
      name: s.name || "",
      phone: s.phone || "",
      email: s.email || "",
      designation: s.designation || "",
      cnic: s.cnic || "",
      address: s.address || "",
      joinDate: s.joinDate || todayStr(),
      baseSalary: s.baseSalary === undefined ? "" : s.baseSalary,
      enableSystemLogin: Boolean(existingUser),
      loginPassword: "",
      systemRole: existingUser ? existingUser.role : "Cashier",
      permissions: existingUser?.permissions
        ? { ...ROLE_DEFAULT_PERMISSIONS[existingUser.role || "Cashier"], ...existingUser.permissions }
        : { ...ROLE_DEFAULT_PERMISSIONS["Cashier"] },
    });
    setIsFormOpen(true);
  };

  const submitStaffForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      enqueueSnackbar("Enter a staff name.", { variant: "error" });
      return;
    }
    if (form.enableSystemLogin) {
      if (!form.email.trim()) {
        enqueueSnackbar("An email address is required to create a system login account.", { variant: "error" });
        return;
      }
      if (!editingStaff && !form.loginPassword.trim()) {
        enqueueSnackbar("Set an initial login password for this staff member.", { variant: "error" });
        return;
      }
    }
    const payload = { ...form, baseSalary: form.baseSalary === "" ? 0 : Number(form.baseSalary) };
    if (editingStaff) updateMutation.mutate({ staffId: editingStaff._id, ...payload });
    else addMutation.mutate(payload);
  };

  // User CRUD Handlers
  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "Cashier",
      status: "Approved",
      permissions: { ...ROLE_DEFAULT_PERMISSIONS["Cashier"] },
    });
    setIsUserModalOpen(true);
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    const roleKey = u.role || "Cashier";
    const basePreset = ROLE_DEFAULT_PERMISSIONS[roleKey] || ROLE_DEFAULT_PERMISSIONS["Cashier"];
    setUserForm({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone ? String(u.phone) : "",
      password: "",
      role: u.role || "Cashier",
      status: u.status || "Approved",
      permissions: {
        ...basePreset,
        ...(u.permissions || {}),
        canAccessERP: u.canAccessERP ?? basePreset.canAccessERP,
      },
    });
    setIsUserModalOpen(true);
  };

  const handleUserRoleChange = (newRole) => {
    const preset = ROLE_DEFAULT_PERMISSIONS[newRole];
    setUserForm((prev) => ({
      ...prev,
      role: newRole,
      permissions: preset ? { ...preset } : prev.permissions,
    }));
  };

  const submitUserForm = (e) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.phone) {
      enqueueSnackbar("Name, email, and phone number are required.", { variant: "error" });
      return;
    }
    const cleanPhone = String(userForm.phone).replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      enqueueSnackbar("Please enter a valid phone number (at least 10 digits).", { variant: "error" });
      return;
    }
    const phoneNum = Number(cleanPhone.slice(-10));

    if (!editingUser) {
      if (!userForm.password || userForm.password.length < 4) {
        enqueueSnackbar("Password must be at least 4 characters long.", { variant: "error" });
        return;
      }
      createUserMutation.mutate({
        name: userForm.name.trim(),
        email: userForm.email.toLowerCase().trim(),
        phone: phoneNum,
        password: userForm.password,
        role: userForm.role,
        status: userForm.status,
        permissions: userForm.permissions,
        canAccessERP: Boolean(userForm.permissions?.canAccessERP),
      });
    } else {
      updateUserMutation.mutate({
        id: editingUser._id,
        name: userForm.name.trim(),
        email: userForm.email.toLowerCase().trim(),
        phone: phoneNum,
        role: userForm.role,
        status: userForm.status,
        permissions: userForm.permissions,
        canAccessERP: Boolean(userForm.permissions?.canAccessERP),
        ...(userForm.password ? { password: userForm.password } : {}),
      });
    }
  };

  const handleDeleteUser = (u) => {
    if (currentUser._id === u._id) {
      enqueueSnackbar("You cannot delete your own logged-in account.", { variant: "error" });
      return;
    }
    if (window.confirm(`Are you sure you want to delete the user account for ${u.name} (${u.email})?`)) {
      deleteUserMutation.mutate(u._id);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return allUsers;
    const term = userSearchTerm.toLowerCase().trim();
    return allUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        String(u.phone).includes(term) ||
        u.role?.toLowerCase().includes(term)
    );
  }, [allUsers, userSearchTerm]);

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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === t
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ===================== TAB 1: STAFF DIRECTORY ===================== */}
      {subTab === "Staff" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                Staff Directory & Roster
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Active restaurant workforce, job roles, contacts, and base payroll rates
              </p>
            </div>
            <button
              onClick={openAddStaffForm}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition active:scale-95"
            >
              <FaPlus size={11} /> ADD STAFF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pr-3">Name</th>
                  <th className="py-2.5 pr-3">Designation</th>
                  <th className="py-2.5 pr-3">Joined Date</th>
                  {isAdmin && <th className="py-2.5 pr-3">Monthly Base</th>}
                  <th className="py-2.5 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {staff.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 pr-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{s.designation || "—"}</td>
                    <td className="py-3 pr-3 text-slate-500 font-mono">{s.joinDate || "—"}</td>
                    {isAdmin && (
                      <td className="py-3 pr-3 font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(s.baseSalary || 0)}
                      </td>
                    )}
                    <td className="py-3 pr-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditStaffForm(s)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 transition"
                          title="Edit details"
                        >
                          <FaPen size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deactivate staff member ${s.name}?`)) {
                              deactivateMutation.mutate(s._id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                          title="Deactivate staff"
                        >
                          <FaUserSlash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && !staffLoading && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="py-8 text-center text-slate-400 text-xs">
                      No staff members enrolled yet. Click &ldquo;ADD STAFF&rdquo; to add your team.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: ATTENDANCE ===================== */}
      {subTab === "Attendance" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                Daily Shift Attendance
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Mark staff present, half-day, or absent for shifts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setAttendanceDate(todayStr())}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-200 dark:border-slate-700"
              >
                Today
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pr-3">Staff Name</th>
                  <th className="py-2.5 pr-3">Designation</th>
                  <th className="py-2.5 pr-3">Mark Status</th>
                  <th className="py-2.5 pr-3 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {attendanceRows.map((row) => (
                  <tr key={row.staffId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 pr-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                    <td className="py-3 pr-3 text-slate-500 dark:text-slate-400">{row.designation || "—"}</td>
                    <td className="py-3 pr-3">
                      <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {["Present", "Half-Day", "Absent"].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              markMutation.mutate({
                                staffId: row.staffId,
                                date: attendanceDate,
                                status: st,
                              })
                            }
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                              row.status === st
                                ? st === "Present"
                                  ? "bg-emerald-500 text-slate-950 shadow-xs"
                                  : st === "Absent"
                                  ? "bg-rose-500 text-white shadow-xs"
                                  : "bg-amber-500 text-slate-950 shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-right">
                      <button
                        onClick={() => setHistoryFor(row.staffId)}
                        className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-[11px]"
                      >
                        Monthly Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: PAYROLL ===================== */}
      {subTab === "Payroll" && isAdmin && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                Monthly Payroll & Pay Slips
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Attendance prorated base salaries, advance deductions, and payout status
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="month"
                value={payrollMonth}
                max={thisMonthStr()}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-amber-500"
              />
              <button
                onClick={() => sendSlipsMutation.mutate(payrollMonth)}
                disabled={sendSlipsMutation.isPending}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
              >
                <FaEnvelope size={11} /> Email Slips
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Present Days</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{totals.present}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Absent Days</span>
              <p className="text-lg font-black text-rose-500 mt-0.5">{totals.absent}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Net Payable</span>
              <p className="text-lg font-black text-amber-500 mt-0.5">{formatCurrency(totals.payable)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pr-3">Staff</th>
                  <th className="py-2.5 pr-3">Base Rate</th>
                  <th className="py-2.5 pr-3">Attendance</th>
                  <th className="py-2.5 pr-3">Earned Base</th>
                  <th className="py-2.5 pr-3">Advances / Deduct</th>
                  <th className="py-2.5 pr-3">Net Payable</th>
                  <th className="py-2.5 pr-3 text-right">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {summary.map((r) => (
                  <tr key={r.staffId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 pr-3 font-bold text-slate-900 dark:text-white">{r.name}</td>
                    <td className="py-3 pr-3 text-slate-500">{formatCurrency(r.baseSalary)}</td>
                    <td className="py-3 pr-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{r.present}P</span> ·{" "}
                      <span className="text-rose-500 font-bold">{r.absent}A</span>
                    </td>
                    <td className="py-3 pr-3 text-slate-700 dark:text-slate-300 font-semibold">
                      {formatCurrency(r.earnedSalary)}
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        onClick={() => setAdjustmentFor(r.staffId)}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        {formatCurrency(r.advances || 0)} (+ Add)
                      </button>
                    </td>
                    <td className="py-3 pr-3 font-black text-amber-500">{formatCurrency(r.payable)}</td>
                    <td className="py-3 pr-3 text-right">
                      <button
                        onClick={() =>
                          payMutation.mutate({
                            staffId: r.staffId,
                            month: payrollMonth,
                            isPaid: !r.isPaid,
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                          r.isPaid
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 hover:border-amber-500"
                        }`}
                      >
                        {r.isPaid ? "✓ Paid" : "Mark Paid"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: SYSTEM ACCESS (FULL CRUD & PERMISSION MATRIX) ===================== */}
      {subTab === "System Access" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-amber-500" size={16} />
                <h3 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                  User Accounts & Permission Matrix
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Manage system login credentials, assigned roles, and granular module capability matrices
              </p>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={openAddUser}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition active:scale-95"
              >
                <FaUserPlus size={12} /> ADD SYSTEM USER
              </button>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-slate-200/80 dark:border-slate-700">
            <FaSearch className="text-slate-400 text-xs shrink-0" />
            <input
              type="text"
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              placeholder="Search users by name, email, phone, or assigned role..."
              className="bg-transparent text-slate-900 dark:text-white text-xs outline-none w-full placeholder:text-slate-400"
            />
            {userSearchTerm && (
              <button
                type="button"
                onClick={() => setUserSearchTerm("")}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pr-3">User / Identity</th>
                  <th className="py-2.5 pr-3">Phone</th>
                  <th className="py-2.5 pr-3">Role</th>
                  <th className="py-2.5 pr-3">Status</th>
                  <th className="py-2.5 pr-3">Granted Permissions</th>
                  <th className="py-2.5 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredUsers.map((u) => {
                  const roleName = String(u.role || "").toLowerCase();
                  const isManagement = ["admin", "manager", "accountant"].includes(roleName);
                  const isSelf = currentUser._id === u._id;

                  // Count active permissions
                  const perms = u.permissions || {};
                  const activePermCount = PERMISSION_DEFINITIONS.filter((p) => {
                    if (p.key === "canAccessERP") return u.canAccessERP || perms.canAccessERP || isManagement;
                    return Boolean(perms[p.key]) || roleName === "admin";
                  }).length;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-bold">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-slate-400 text-[11px] font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-slate-500 font-mono">{u.phone}</td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                            roleName === "admin"
                              ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30"
                              : roleName === "manager"
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30"
                              : roleName === "cashier"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                              : u.status === "Pending"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200"
                          }`}
                        >
                          {u.status || "Approved"}
                        </span>
                      </td>

                      {/* Permission Matrix Badges */}
                      <td className="py-3 pr-3">
                        <div className="flex flex-wrap items-center gap-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                              activePermCount === PERMISSION_DEFINITIONS.length
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                                : activePermCount > 0
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {activePermCount} of {PERMISSION_DEFINITIONS.length} Granted
                          </span>
                          {(u.canAccessERP || perms.canAccessERP || isManagement) && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60">
                              ERP
                            </span>
                          )}
                          {(perms.canManageOrders || roleName === "admin" || roleName === "cashier") && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60">
                              Orders
                            </span>
                          )}
                          {(perms.canManageInventory || roleName === "admin") && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60">
                              Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick ERP Switcher Toggle */}
                          {!isManagement && (
                            <button
                              type="button"
                              onClick={() =>
                                permissionMutation.mutate({
                                  userId: u._id,
                                  canAccessERP: !u.canAccessERP,
                                })
                              }
                              disabled={permissionMutation.isPending}
                              title={u.canAccessERP ? "Revoke ERP Switcher" : "Grant ERP Switcher"}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition border shadow-2xs ${
                                u.canAccessERP
                                  ? "bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-amber-500"
                              }`}
                            >
                              {u.canAccessERP ? "✓ ERP On" : "+ ERP"}
                            </button>
                          )}

                          {/* Edit User & Permissions Button */}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => openEditUser(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Edit user credentials and permissions matrix"
                            >
                              <FaPen size={12} />
                            </button>
                          )}

                          {/* Delete User Button */}
                          {isAdmin && !isSelf && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                              title="Delete user account"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && !usersLoading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No matching user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== MODAL 1: ADD/EDIT STAFF (WITH PERMISSION MATRIX) ===================== */}
      {isFormOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] overflow-hidden" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
              onClick={() => {
                setIsFormOpen(false);
                setEditingStaff(null);
              }}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
              <form
                onSubmit={submitStaffForm}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto w-screen max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between">
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                      {editingStaff ? "Edit Staff Details" : "Enroll New Staff Member"}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      Enter personnel information, salary rate, and optional system login permissions
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingStaff(null);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4 flex-1 overflow-y-auto">

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ali Ahmed"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Designation / Position
                </label>
                <input
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. Head Chef / Cashier / Delivery Rider / Store Manager"
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
                    placeholder="35201-1234567-1"
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

              {/* System Login & Permission Matrix Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <FaKey className="text-amber-500" size={14} />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Grant System Login Account & Access
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Assign user credentials and configure granular permissions for this staff member
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.enableSystemLogin}
                    onChange={(e) => setForm({ ...form, enableSystemLogin: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                  />
                </div>

                {form.enableSystemLogin && (
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                          Assigned Role *
                        </label>
                        <select
                          value={form.systemRole}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            const preset = ROLE_DEFAULT_PERMISSIONS[newRole];
                            setForm({
                              ...form,
                              systemRole: newRole,
                              permissions: preset ? { ...preset } : form.permissions,
                            });
                          }}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-amber-500"
                        >
                          <option value="Cashier">Cashier</option>
                          <option value="Manager">Manager</option>
                          <option value="Admin">Admin</option>
                          <option value="Accountant">Accountant</option>
                          <option value="Asset Manager">Asset Manager</option>
                          <option value="Kitchen">Kitchen</option>
                          <option value="Waiter">Waiter</option>
                          <option value="Rider">Rider</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                          {editingStaff ? "New Password (optional)" : "Login Password *"}
                        </label>
                        <input
                          type="password"
                          value={form.loginPassword}
                          onChange={(e) => setForm({ ...form, loginPassword: e.target.value })}
                          placeholder={editingStaff ? "Leave blank to keep" : "Min 4 characters"}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Integrated Permission Matrix */}
                    <div>
                      <PermissionMatrix
                        permissions={form.permissions}
                        onChange={(newPerms) => setForm({ ...form, permissions: newPerms })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 shrink-0">
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
          </div>,
          document.body
        )}

      {/* ===================== MODAL 2: USER CRUD MODAL (SYSTEM ACCESS TAB) ===================== */}
      {isUserModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] overflow-hidden" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
              onClick={() => {
                setIsUserModalOpen(false);
                setEditingUser(null);
              }}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
              <form
                onSubmit={submitUserForm}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto w-screen max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between">
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">
                      {editingUser ? "Edit User Account & Permissions" : "Enroll New System User"}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      Configure login credentials and grant granular module capabilities
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4 flex-1 overflow-y-auto">

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Shahzaib Naseem"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="user@genzpizza.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Phone Number (10 digits) *
                  </label>
                  <input
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="03001234567"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Assigned Role *
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => handleUserRoleChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-amber-500"
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Asset Manager">Asset Manager</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Rider">Rider</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Account Status *
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-amber-500"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  {editingUser ? "Change Password (leave empty to keep current)" : "Account Password *"}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder={editingUser ? "Leave empty to keep existing password" : "Enter secure password (min 4 chars)"}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Granular Permission Matrix */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <PermissionMatrix
                  permissions={userForm.permissions}
                  onChange={(newPerms) => setUserForm({ ...userForm, permissions: newPerms })}
                />
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createUserMutation.isPending || updateUserMutation.isPending}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl py-2.5 text-xs font-black shadow-sm transition active:scale-95 disabled:opacity-50"
                  >
                    {editingUser ? "Update User & Permissions" : "Create User Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ===================== MODAL 3: RECORD SALARY ADJUSTMENT ===================== */}
      {adjustmentFor &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] overflow-hidden" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
              onClick={() => setAdjustmentFor(null)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
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
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between">
                  <h3 className="text-slate-900 dark:text-white text-base font-bold">Record Salary Adjustment</h3>
                  <button
                    type="button"
                    onClick={() => setAdjustmentFor(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                  <div className="flex gap-2">
                    {["Advance", "Deduction"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAdjustmentForm((p) => ({ ...p, type: t }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                          adjustmentForm.type === t
                            ? "bg-amber-500 text-slate-950 shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                      Adjustment Amount (Rs) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={adjustmentForm.amount}
                      onChange={(e) => setAdjustmentForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="Amount (Rs)"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                      Note / Reason
                    </label>
                    <input
                      value={adjustmentForm.note}
                      onChange={(e) => setAdjustmentForm((p) => ({ ...p, note: e.target.value }))}
                      placeholder="Note or reason (optional)"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 shrink-0">
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
          </div>,
          document.body
        )}

      {/* ===================== MODAL 4: ATTENDANCE HISTORY ===================== */}
      {historyFor &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[99999] overflow-hidden" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
              onClick={() => setHistoryFor(null)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
              <div
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900 shrink-0 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-slate-900 dark:text-white text-base font-bold">
                      Attendance History
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {staff.find((s) => s._id === historyFor)?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="month"
                      value={payrollMonth}
                      max={thisMonthStr()}
                      onChange={(e) => setPayrollMonth(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-1 outline-none text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setHistoryFor(null)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-2 flex-1 overflow-y-auto">
                  {(historyData?.data?.data ?? []).map((row) => (
                    <div
                      key={row.dayKey}
                      className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 rounded-xl px-3 py-2.5"
                    >
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
                    <p className="text-slate-400 text-xs py-8 text-center font-medium">No attendance records for this month.</p>
                  )}
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 shrink-0">
                  <button
                    onClick={() => setHistoryFor(null)}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 text-xs font-bold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default StaffManagement;
