import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import {
  changeManagedUserRole,
  createManagedUser,
  getManagedRoles,
  getManagedUsers,
  getPermissionCatalog,
  getUserAuditLogs,
  resetManagedUserPassword,
  saveManagedRole,
  updateManagedUser,
  updateManagedUserPermissions,
  updateManagedUserStatus,
} from "../../https";

const emptyForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  employeeId: "",
  password: "",
  confirmPassword: "",
  role: "Cashier",
  active: true,
  notes: "",
  permissions: null,
};

const errorMessage = (error) => error.response?.data?.message || "The request could not be completed.";
const keyOf = (role) => String(role || "").trim().toLowerCase();
const formatDate = (value) => value ? new Date(value).toLocaleString() : "Never";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { role: currentRole, permissions = [] } = useSelector((state) => state.user);
  const can = (permission) => permissions.includes(permission);
  const isOwner = keyOf(currentRole) === "super admin";
  const [section, setSection] = useState("users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialog, setDialog] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [confirmTemporaryPassword, setConfirmTemporaryPassword] = useState("");
  const [roleDraft, setRoleDraft] = useState({ name: "", permissions: [] });

  const usersQuery = useQuery({
    queryKey: ["managed-users", search, roleFilter, statusFilter, page],
    queryFn: () => getManagedUsers({
      search: search.trim(),
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      page,
      limit: 10,
    }),
    enabled: can("users.view") && section === "users",
  });
  const rolesQuery = useQuery({
    queryKey: ["managed-roles"],
    queryFn: getManagedRoles,
    enabled: can("users.view"),
  });
  const permissionsQuery = useQuery({
    queryKey: ["permission-catalog"],
    queryFn: getPermissionCatalog,
    enabled: can("users.view"),
  });
  const auditQuery = useQuery({
    queryKey: ["user-audit-log"],
    queryFn: () => getUserAuditLogs({ page: 1, limit: 50 }),
    enabled: can("users.viewAudit") && section === "audit",
  });

  const users = usersQuery.data?.data?.data || [];
  const pagination = usersQuery.data?.data?.pagination;
  const roles = rolesQuery.data?.data?.data || [];
  const catalog = permissionsQuery.data?.data?.data || [];
  const auditEvents = auditQuery.data?.data?.data || [];
  const rolesByKey = useMemo(() => new Map(roles.map((item) => [keyOf(item.name), item])), [roles]);

  const refreshUsers = () => queryClient.invalidateQueries({ queryKey: ["managed-users"] });
  const saveUserMutation = useMutation({
    mutationFn: (payload) => editingUser
      ? updateManagedUser({ userId: editingUser._id, ...payload })
      : createManagedUser(payload),
    onSuccess: async (response) => {
      enqueueSnackbar(response.data.message || (editingUser ? "Employee updated." : "Employee account created."), { variant: "success" });
      setForm(emptyForm);
      setEditingUser(null);
      setDialog("");
      setSection("users");
      await refreshUsers();
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const roleMutation = useMutation({
    mutationFn: changeManagedUserRole,
    onSuccess: async () => {
      enqueueSnackbar("Role changed.", { variant: "success" });
      setDialog("");
      await refreshUsers();
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const permissionMutation = useMutation({
    mutationFn: updateManagedUserPermissions,
    onSuccess: async () => {
      enqueueSnackbar("Permissions saved.", { variant: "success" });
      setDialog("");
      await refreshUsers();
      await queryClient.invalidateQueries({ queryKey: ["permission-catalog"] });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const statusMutation = useMutation({
    mutationFn: updateManagedUserStatus,
    onSuccess: async () => {
      enqueueSnackbar("Account status updated.", { variant: "success" });
      await refreshUsers();
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const passwordMutation = useMutation({
    mutationFn: resetManagedUserPassword,
    onSuccess: async (response) => {
      enqueueSnackbar(response.data.message, { variant: "success" });
      setDialog("");
      setTemporaryPassword("");
      setConfirmTemporaryPassword("");
      await refreshUsers();
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const roleSaveMutation = useMutation({
    mutationFn: saveManagedRole,
    onSuccess: async () => {
      enqueueSnackbar("Role permissions saved.", { variant: "success" });
      setRoleDraft({ name: "", permissions: [] });
      await queryClient.invalidateQueries({ queryKey: ["managed-roles"] });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });

  const rolePermissions = (roleName) => rolesByKey.get(keyOf(roleName))?.permissions || [];
  const permissionOverrides = (selected, baseline) => ({
    permissions: selected.filter((permission) => !baseline.includes(permission)),
    denied: baseline.filter((permission) => !selected.includes(permission)),
  });

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setSection("form");
  };
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: String(user.phone || ""),
      employeeId: user.employeeId || "",
      notes: user.notes || "",
      role: user.role,
      active: user.active !== false,
      permissions: null,
      password: "",
      confirmPassword: "",
    });
    setSection("form");
  };
  const startPermissions = (user) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setDialog("permissions");
  };
  const startRoleChange = (user) => {
    setSelectedUser(user);
    setDialog("role");
  };

  const submitUser = (event) => {
    event.preventDefault();
    if (!editingUser && form.password !== form.confirmPassword) {
      enqueueSnackbar("Passwords do not match.", { variant: "error" });
      return;
    }
    const common = {
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      employeeId: form.employeeId.trim(),
      notes: form.notes.trim(),
    };
    if (editingUser) {
      saveUserMutation.mutate(common);
      return;
    }
    if (form.password.length < 12) {
      enqueueSnackbar("Use at least 12 characters for the password.", { variant: "error" });
      return;
    }
    const baseline = rolePermissions(form.role);
    const selected = form.permissions || baseline;
    saveUserMutation.mutate({
      ...common,
      password: form.password,
      confirmPassword: form.confirmPassword,
      role: form.role,
      active: form.active,
      ...permissionOverrides(selected, baseline),
    });
  };

  const togglePermission = (permission, setter, current) => {
    setter(current.includes(permission)
      ? current.filter((item) => item !== permission)
      : [...current, permission]);
  };

  const sections = [
    ...(can("users.view") ? [{ key: "users", label: "All Users" }] : []),
    ...(can("users.create") ? [{ key: "form", label: "Add New User" }] : []),
    ...(can("users.manageRoles") ? [{ key: "roles", label: "Roles & Permissions" }] : []),
    ...(can("users.viewAudit") ? [{ key: "audit", label: "User Activity Logs" }] : []),
    { key: "security", label: "Account Security" },
  ];

  if (!can("users.view")) {
    return <div className="m-6 rounded-xl bg-[#262626] p-6 text-gray-300">You do not have permission to view employee accounts.</div>;
  }

  return (
    <section className="mx-auto w-full max-w-[1500px] space-y-5 px-4 pb-10 text-white sm:px-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-400">Security &amp; workforce</p>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">User &amp; Employee Management</h2>
        <p className="mt-2 text-sm text-gray-400">Manage login accounts, roles, and access to existing POS modules.</p>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="User management sections">
        {sections.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              if (item.key === "form" && section !== "form") openCreate();
              else if (item.key === "form") openCreate();
              else setSection(item.key);
            }}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${section === item.key ? "bg-yellow-400 text-black" : "bg-[#262626] text-gray-200 hover:bg-[#333]"}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {section === "users" && (
        <div className="overflow-hidden rounded-xl border border-[#333] bg-[#1f1f1f]">
          <div className="flex flex-col gap-3 border-b border-[#333] p-4 lg:flex-row">
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, username, or email" className="min-w-0 flex-1 rounded-lg border border-[#444] bg-[#171717] px-3 py-2 text-sm outline-none focus:border-yellow-400" />
            <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} className="rounded-lg border border-[#444] bg-[#171717] px-3 py-2 text-sm">
              <option value="">All roles</option>
              {roles.map((item) => <option key={item.key} value={item.name}>{item.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-lg border border-[#444] bg-[#171717] px-3 py-2 text-sm">
              <option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
            {can("users.create") && <button onClick={openCreate} className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black">Add New User</button>}
          </div>
          {usersQuery.isLoading ? <p className="p-6 text-gray-400">Loading accounts…</p> : usersQuery.isError ? <p className="p-6 text-red-300">{errorMessage(usersQuery.error)}</p> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left text-sm">
                <thead className="bg-[#292929] text-xs uppercase tracking-wide text-gray-400">
                  <tr>{["Employee", "Username", "Email", "Phone", "Role", "Permissions", "Status", "Last Login", "Created", "Actions"].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {users.map((user) => (
                    <tr key={user._id} className="align-top hover:bg-[#242424]">
                      <td className="px-4 py-4"><div className="font-semibold">{user.name}</div><div className="mt-1 text-xs text-gray-500">{user.employeeId || "No employee ID"}</div></td>
                      <td className="px-4 py-4">{user.username || "—"}</td>
                      <td className="px-4 py-4">{user.email}</td>
                      <td className="px-4 py-4">{user.phone || "—"}</td>
                      <td className="px-4 py-4">{user.role}</td>
                      <td className="max-w-48 px-4 py-4 text-xs text-gray-300">
                        {(user.permissions || []).slice(0, 3).join(", ") || "No permissions"}
                        {(user.permissions || []).length > 3 && <span className="ml-1 text-yellow-400">+{user.permissions.length - 3}</span>}
                      </td>
                      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${user.active === false ? "bg-red-950 text-red-300" : user.status !== "Approved" ? "bg-amber-950 text-amber-300" : "bg-green-950 text-green-300"}`}>{user.active === false ? "Inactive" : user.status !== "Approved" ? user.status : "Active"}</span></td>
                      <td className="px-4 py-4 text-xs text-gray-400">{formatDate(user.lastLoginAt)}</td>
                      <td className="px-4 py-4 text-xs text-gray-400">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex max-w-56 flex-wrap gap-1.5">
                          {(() => {
                            const mayManageAccount = isOwner || !["admin", "super admin"].includes(keyOf(user.role));
                            return <>
                          <button onClick={() => { setSelectedUser(user); setDialog("view"); }} className="action-button">View</button>
                          {mayManageAccount && can("users.edit") && <button onClick={() => openEdit(user)} className="action-button">Edit</button>}
                          {mayManageAccount && can("users.assignRole") && <button onClick={() => startRoleChange(user)} className="action-button">Role</button>}
                          {mayManageAccount && can("users.managePermissions") && <button onClick={() => startPermissions(user)} className="action-button">Permissions</button>}
                          {mayManageAccount && can("users.resetPassword") && <button onClick={() => { setSelectedUser(user); setDialog("password"); }} className="action-button">Reset Password</button>}
                          {mayManageAccount && can("users.deactivate") && <button onClick={() => {
                            const action = user.active === false ? "activate" : "deactivate";
                            if (window.confirm(`Are you sure you want to ${action} ${user.name}'s account?`)) {
                              statusMutation.mutate({ userId: user._id, active: user.active === false });
                            }
                          }} className="action-button">{user.active === false ? "Activate" : "Deactivate"}</button>}
                            </>;
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!users.length && <tr><td colSpan="10" className="px-4 py-12 text-center text-gray-500">No employee accounts match those filters.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-[#333] px-4 py-3 text-sm text-gray-400">
            <span>{pagination?.total || 0} account(s)</span>
            <div className="flex items-center gap-3">
              <button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded border border-[#444] px-3 py-1.5 disabled:opacity-40">Previous</button>
              <span>{page} / {Math.max(1, pagination?.pages || 1)}</span>
              <button disabled={page >= (pagination?.pages || 1)} onClick={() => setPage((value) => value + 1)} className="rounded border border-[#444] px-3 py-1.5 disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}

      {section === "form" && (
        <form onSubmit={submitUser} className="space-y-6 rounded-xl border border-[#333] bg-[#1f1f1f] p-5 sm:p-7">
          <div>
            <h3 className="text-xl font-bold">{editingUser ? "Edit Employee" : "Create New User"}</h3>
            <p className="mt-1 text-sm text-gray-400">Passwords are hashed on the server and are never returned to the browser.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["name", "Full name", true], ["username", "Username", true], ["email", "Email address", true],
              ["phone", "Phone number", true], ["employeeId", "Employee ID", false], ["notes", "Optional notes", false],
            ].map(([key, label, required]) => (
              <label key={key} className="space-y-1.5 text-sm">
                <span>{label}</span>
                <input required={required} type={key === "email" ? "email" : "text"} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5 outline-none focus:border-yellow-400" />
              </label>
            ))}
            {!editingUser && <>
              <label className="space-y-1.5 text-sm"><span>Password</span><input required type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5 outline-none focus:border-yellow-400" /></label>
              <label className="space-y-1.5 text-sm"><span>Confirm password</span><input required type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5 outline-none focus:border-yellow-400" /></label>
              <label className="space-y-1.5 text-sm"><span>Role</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value, permissions: rolePermissions(event.target.value) })} className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5">
                {roles.filter((item) => isOwner || !["super admin", "admin"].includes(keyOf(item.name))).map((item) => <option key={item.key} value={item.name}>{item.name}</option>)}
              </select></label>
              <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Account active</label>
            </>}
          </div>
          {!editingUser && (
            <div>
              <h4 className="mb-3 font-semibold">Individual permission overrides</h4>
              <p className="mb-4 text-xs text-gray-400">Role permissions are the baseline. Unchecking a baseline permission denies it for this employee; checked permissions beyond the role are explicit grants.</p>
              <PermissionChecklist catalog={catalog} selected={form.permissions || rolePermissions(form.role)} onToggle={(permission) => setForm((old) => {
                const current = old.permissions || rolePermissions(old.role);
                return { ...old, permissions: current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission] };
              })} />
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button disabled={saveUserMutation.isPending} className="rounded-lg bg-yellow-400 px-5 py-2.5 font-semibold text-black disabled:opacity-50">{saveUserMutation.isPending ? "Saving…" : editingUser ? "Save Changes" : "Create User"}</button>
            <button type="button" onClick={() => { setEditingUser(null); setForm(emptyForm); setSection("users"); }} className="rounded-lg border border-[#555] px-5 py-2.5">Cancel</button>
          </div>
        </form>
      )}

      {section === "roles" && can("users.manageRoles") && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-3 rounded-xl border border-[#333] bg-[#1f1f1f] p-5">
            <h3 className="text-lg font-bold">Existing roles</h3>
            {roles.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg bg-[#292929] p-3">
                <div><div className="font-medium">{item.name}</div><div className="text-xs text-gray-400">{item.permissions.length} permission(s){item.isSystem ? " · predefined" : " · custom"}</div></div>
                {!item.isSystem && <button className="action-button" onClick={() => setRoleDraft({ name: item.name, permissions: item.permissions })}>Edit</button>}
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-xl border border-[#333] bg-[#1f1f1f] p-5">
            <div><h3 className="text-lg font-bold">Custom role editor</h3><p className="mt-1 text-xs text-gray-400">A role can include only permissions you are allowed to delegate.</p></div>
            <label className="block space-y-1.5 text-sm"><span>Role name</span><input value={roleDraft.name} onChange={(event) => setRoleDraft({ ...roleDraft, name: event.target.value })} placeholder="e.g. Inventory Manager" className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5" /></label>
            <PermissionChecklist catalog={catalog} selected={roleDraft.permissions} onToggle={(permission) => setRoleDraft((old) => ({ ...old, permissions: old.permissions.includes(permission) ? old.permissions.filter((item) => item !== permission) : [...old.permissions, permission] }))} />
            <button disabled={roleSaveMutation.isPending} onClick={() => roleSaveMutation.mutate(roleDraft)} className="rounded-lg bg-yellow-400 px-5 py-2.5 font-semibold text-black disabled:opacity-50">Save Custom Role</button>
          </div>
        </div>
      )}

      {section === "audit" && (
        <div className="overflow-x-auto rounded-xl border border-[#333] bg-[#1f1f1f]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#292929] text-xs uppercase text-gray-400"><tr>{["Time", "Actor", "Target", "Action", "Outcome", "Reason"].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#333]">
              {auditEvents.map((event) => <tr key={event._id}>
                <td className="px-4 py-3 text-xs text-gray-400">{formatDate(event.createdAt)}</td>
                <td className="px-4 py-3">{event.actorId?.name || "System"}</td>
                <td className="px-4 py-3">{event.targetUserId?.name || "—"}</td>
                <td className="px-4 py-3 font-medium">{event.action}</td>
                <td className={`px-4 py-3 ${event.outcome === "failure" ? "text-red-300" : "text-green-300"}`}>{event.outcome}</td>
                <td className="px-4 py-3 text-gray-400">{event.reason || "—"}</td>
              </tr>)}
              {!auditEvents.length && <tr><td colSpan="6" className="px-4 py-10 text-center text-gray-400">No activity has been recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {section === "security" && (
        <div className="space-y-4 rounded-xl border border-[#333] bg-[#1f1f1f] p-5 sm:p-7">
          <h3 className="text-xl font-bold">Account Security</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-300">
            <li>Passwords require at least 12 characters, including uppercase, lowercase, a number, and a symbol.</li>
            <li>Passwords are hashed with the existing bcrypt authentication flow; hashes and current passwords are never exposed.</li>
            <li>Temporary passwords require a password change before other protected APIs are available.</li>
            <li>Sessions expire after 24 hours. Deactivation, role changes, permission changes, and password resets invalidate existing sessions.</li>
            <li>Only an existing active Admin can be promoted to Super Admin by an operator-run setup command. Admin accounts cannot manage the owner account.</li>
          </ul>
          {!isOwner && <p className="rounded-lg border border-amber-800 bg-amber-950/40 p-3 text-sm text-amber-200">Owner-level security settings are available only to the Super Admin.</p>}
        </div>
      )}

      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4" role="dialog" aria-modal="true">
          <div className="my-auto max-h-[90vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-xl border border-[#444] bg-[#202020] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold">
              {dialog === "view" ? "Employee details" : dialog === "role" ? "Change role" : dialog === "permissions" ? "Manage permissions" : "Reset password"}
            </h3><p className="mt-1 text-sm text-gray-400">{selectedUser?.name} · {selectedUser?.email}</p></div><button onClick={() => setDialog("")} aria-label="Close dialog" className="text-2xl text-gray-400">×</button></div>
            {dialog === "view" && selectedUser && <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[["Username", selectedUser.username], ["Phone", selectedUser.phone], ["Employee ID", selectedUser.employeeId], ["Role", selectedUser.role], ["Status", selectedUser.active === false ? "Inactive" : selectedUser.status], ["Last login", formatDate(selectedUser.lastLoginAt)], ["Permissions", (selectedUser.permissions || []).join(", ") || "None"], ["Notes", selectedUser.notes]].map(([label, value]) => <div key={label} className="rounded-lg bg-[#292929] p-3"><dt className="text-xs text-gray-400">{label}</dt><dd className="mt-1 break-words">{value || "—"}</dd></div>)}
            </dl>}
            {dialog === "role" && <div className="space-y-3"><label className="block space-y-2 text-sm"><span>New role</span><select id="managed-user-role" defaultValue={selectedUser?.role} className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5">
              {roles.filter((item) => isOwner || !["super admin", "admin"].includes(keyOf(item.name))).map((item) => <option key={item.key} value={item.name}>{item.name}</option>)}
            </select></label><button onClick={() => {
              const nextRole = document.getElementById("managed-user-role").value;
              if (window.confirm(`Change ${selectedUser.name}'s role to ${nextRole}? Their individual permission overrides will be cleared.`)) {
                roleMutation.mutate({ userId: selectedUser._id, role: nextRole });
              }
            }} className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black">Save Role</button></div>}
            {dialog === "permissions" && <div className="space-y-4">
              <p className="text-xs text-gray-400">Role permissions form the baseline. Explicit denials override role access.</p>
              <PermissionChecklist catalog={catalog} selected={selectedPermissions} onToggle={(permission) => togglePermission(permission, setSelectedPermissions, selectedPermissions)} />
              <button onClick={() => {
                const baseline = rolePermissions(selectedUser.role);
                const overrides = permissionOverrides(selectedPermissions, baseline);
                if (window.confirm(`Save access permissions for ${selectedUser.name}?`)) {
                  permissionMutation.mutate({ userId: selectedUser._id, ...overrides });
                }
              }} className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black">Save Permissions</button>
            </div>}
            {dialog === "password" && <div className="space-y-3">
              <p className="text-sm text-gray-400">Set a temporary password. The employee will be required to change it at their next sign-in.</p>
              <input type="password" autoComplete="new-password" value={temporaryPassword} onChange={(event) => setTemporaryPassword(event.target.value)} placeholder="Temporary password (12+ characters)" className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5" />
              <input type="password" autoComplete="new-password" value={confirmTemporaryPassword} onChange={(event) => setConfirmTemporaryPassword(event.target.value)} placeholder="Confirm temporary password" className="w-full rounded-lg border border-[#444] bg-[#171717] px-3 py-2.5" />
              <button disabled={passwordMutation.isPending} onClick={() => {
                if (!window.confirm(`Reset ${selectedUser.name}'s password? They will need to change it at next login.`)) return;
                passwordMutation.mutate({ userId: selectedUser._id, password: temporaryPassword, confirmPassword: confirmTemporaryPassword });
              }} className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-50">Reset Password</button>
            </div>}
          </div>
        </div>
      )}
      <style>{`.action-button{border:1px solid #444;border-radius:.45rem;padding:.35rem .55rem;font-size:.72rem;color:#ddd}.action-button:hover{border-color:#eab308;color:#facc15}`}</style>
    </section>
  );
};

const PermissionChecklist = ({ catalog, selected, onToggle }) => (
  <div className="grid max-h-[420px] gap-2 overflow-y-auto rounded-lg border border-[#333] bg-[#171717] p-3 sm:grid-cols-2">
    {catalog.map((permission) => (
      <label key={permission.key} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm hover:bg-[#252525]">
        <input type="checkbox" checked={selected.includes(permission.key)} onChange={() => onToggle(permission.key)} className="mt-0.5 accent-yellow-400" />
        <span><span className="block">{permission.label}</span><span className="text-[10px] text-gray-500">{permission.key}</span></span>
      </label>
    ))}
  </div>
);

export default UserManagement;
