import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  assignCoupon,
  createCoupon,
  getCategories,
  getCustomerCouponAssignments,
  getCouponRedemptions,
  getCoupons,
  getDishes,
  setCouponStatus,
  updateCoupon,
  regenerateCustomerCoupon,
  revokeCustomerCoupon,
} from "../../https";

const emptyForm = {
  name: "",
  description: "",
  code: "",
  discountType: "percentage",
  discountValue: "",
  minimumSubtotal: "0",
  maximumDiscount: "",
  usageLimit: "",
  perCustomerLimit: "1",
  startsAt: "",
  expiresAt: "",
  timezone: "Asia/Karachi",
  firstOrderOnly: false,
  stackable: false,
  status: "active",
  channels: ["online", "pos"],
  eligibleProducts: [],
  excludedProducts: [],
  eligibleCategories: [],
  excludedCategories: [],
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 16) : "");
const asOptionalNumber = (value) => (value === "" ? null : Number(value));

const CouponsManager = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [assignmentPhone, setAssignmentPhone] = useState("");
  const [assignmentSearchPhone, setAssignmentSearchPhone] = useState("");

  const { data: couponResponse, isLoading } = useQuery({
    queryKey: ["coupons", search, statusFilter, page],
    queryFn: () => getCoupons({ search, status: statusFilter || undefined, page, limit: 20 }),
  });
  const { data: redemptionResponse } = useQuery({
    queryKey: ["coupon-redemptions"],
    queryFn: () => getCouponRedemptions(),
  });
  const { data: categoryResponse } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: dishResponse } = useQuery({ queryKey: ["dishes"], queryFn: getDishes });
  const { data: assignmentResponse, isFetching: loadingAssignments, refetch: searchAssignments } = useQuery({
    queryKey: ["coupon-assignments", assignmentSearchPhone],
    queryFn: () => getCustomerCouponAssignments({ phone: assignmentSearchPhone }),
    enabled: Boolean(assignmentSearchPhone),
  });

  const coupons = couponResponse?.data?.data || [];
  const pagination = couponResponse?.data?.pagination || { page: 1, pages: 1, total: 0 };
  const categories = categoryResponse?.data?.data || [];
  const dishes = dishResponse?.data?.data || [];
  const stats = redemptionResponse?.data?.summary || [];
  const totalUses = stats
    .filter((item) => item._id === "reserved" || item._id === "redeemed")
    .reduce((sum, item) => sum + item.redemptions, 0);
  const totalDiscount = stats
    .filter((item) => item._id === "redeemed")
    .reduce((sum, item) => sum + item.discountGranted, 0);
  const assignments = assignmentResponse?.data?.data || [];

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editingId ? updateCoupon({ couponId: editingId, ...payload }) : createCoupon(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      enqueueSnackbar(editingId ? "Coupon updated." : `Coupon created: ${response.data?.data?.code || ""}`, {
        variant: "success",
      });
      setForm(emptyForm);
      setEditingId("");
    },
    onError: (error) =>
      enqueueSnackbar(error?.response?.data?.message || "Could not save coupon.", { variant: "error" }),
  });

  const statusMutation = useMutation({
    mutationFn: setCouponStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
    onError: (error) =>
      enqueueSnackbar(error?.response?.data?.message || "Could not update coupon status.", { variant: "error" }),
  });

  const assignMutation = useMutation({
    mutationFn: assignCoupon,
    onSuccess: (response) => {
      const code = response.data?.data?.code || "";
      enqueueSnackbar(`Private coupon assigned. Code: ${code}`, { variant: "success", autoHideDuration: 10000 });
    },
    onError: (error) =>
      enqueueSnackbar(error?.response?.data?.message || "Could not assign coupon.", { variant: "error" }),
  });
  const assignmentMutation = useMutation({
    mutationFn: revokeCustomerCoupon,
    onSuccess: () => searchAssignments(),
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not revoke coupon.", { variant: "error" }),
  });
  const regenerateMutation = useMutation({
    mutationFn: regenerateCustomerCoupon,
    onSuccess: (response) => {
      const code = response.data?.data?.code || "";
      enqueueSnackbar(`New private code: ${code}`, { variant: "success", autoHideDuration: 10000 });
      searchAssignments();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not regenerate code.", { variant: "error" }),
  });

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggleSelection = (field, id) =>
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(id)
        ? current[field].filter((value) => value !== id)
        : [...current[field], id],
    }));

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      minimumSubtotal: Number(form.minimumSubtotal || 0),
      maximumDiscount: asOptionalNumber(form.maximumDiscount),
      usageLimit: asOptionalNumber(form.usageLimit),
      perCustomerLimit: Number(form.perCustomerLimit || 1),
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      code: editingId ? undefined : form.code,
    };
    saveMutation.mutate(payload);
  };

  const edit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      ...emptyForm,
      ...coupon,
      code: coupon.code || "",
      discountValue: String(coupon.discountValue),
      minimumSubtotal: String(coupon.minimumSubtotal || 0),
      maximumDiscount: coupon.maximumDiscount == null ? "" : String(coupon.maximumDiscount),
      usageLimit: coupon.usageLimit == null ? "" : String(coupon.usageLimit),
      perCustomerLimit: String(coupon.perCustomerLimit || 1),
      startsAt: toDateInput(coupon.startsAt),
      expiresAt: toDateInput(coupon.expiresAt),
    });
  };

  const handleAssign = (coupon) => {
    const phone = window.prompt(`Assign ${coupon.name} to a customer phone number:`);
    if (phone) assignMutation.mutate({ couponId: coupon._id, phone });
  };

  const selectionGroup = (label, field, options, optionLabel) => (
    <fieldset className="rounded-lg border border-[#3b3b3b] p-3">
      <legend className="px-1 text-sm text-[#ababab]">{label}</legend>
      <div className="max-h-32 space-y-1 overflow-y-auto">
        {options.map((option) => (
          <label key={option._id} className="flex items-center gap-2 text-sm text-[#ddd]">
            <input
              type="checkbox"
              checked={form[field].includes(option._id)}
              onChange={() => toggleSelection(field, option._id)}
            />
            {optionLabel(option)}
          </label>
        ))}
        {!options.length && <span className="text-xs text-[#777]">No menu items available.</span>}
      </div>
    </fieldset>
  );

  return (
    <div className="container mx-auto space-y-5 px-4 text-[#f5f5f5] sm:px-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[#262626] p-4">
          <p className="text-sm text-[#ababab]">Coupon campaigns</p>
          <p className="text-2xl font-bold">{pagination.total}</p>
        </div>
        <div className="rounded-lg bg-[#262626] p-4">
          <p className="text-sm text-[#ababab]">Reserved and completed redemptions</p>
          <p className="text-2xl font-bold">{totalUses}</p>
        </div>
        <div className="rounded-lg bg-[#262626] p-4">
          <p className="text-sm text-[#ababab]">Discount granted (Rs)</p>
          <p className="text-2xl font-bold">{Number(totalDiscount).toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-lg bg-[#262626] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{editingId ? "Edit coupon" : "Create coupon"}</h2>
          {editingId && (
            <button type="button" className="text-sm text-[#f6b100]" onClick={() => { setEditingId(""); setForm(emptyForm); }}>
              Cancel edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="text-sm text-[#ababab]">Name<input required maxLength={120} value={form.name} onChange={(e) => setField("name", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Code (blank generates one)<input disabled={Boolean(editingId)} maxLength={32} value={form.code} onChange={(e) => setField("code", e.target.value.toUpperCase())} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white disabled:opacity-50" /></label>
          <label className="text-sm text-[#ababab]">Status<select value={form.status} onChange={(e) => setField("status", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white">{["draft", "scheduled", "active", "paused", "expired", "archived"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm text-[#ababab]">Discount type<select value={form.discountType} onChange={(e) => setField("discountType", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white"><option value="percentage">Percentage</option><option value="fixed">Fixed Rs</option></select></label>
          <label className="text-sm text-[#ababab]">Discount value<input required min="0.01" max={form.discountType === "percentage" ? "100" : undefined} step="0.01" type="number" value={form.discountValue} onChange={(e) => setField("discountValue", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Minimum eligible subtotal (Rs)<input min="0" step="0.01" type="number" value={form.minimumSubtotal} onChange={(e) => setField("minimumSubtotal", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Maximum discount (Rs)<input min="0" step="0.01" type="number" value={form.maximumDiscount} onChange={(e) => setField("maximumDiscount", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Campaign redemption limit<input min="1" step="1" type="number" value={form.usageLimit} onChange={(e) => setField("usageLimit", e.target.value)} placeholder="Unlimited" className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Uses per customer<input required min="1" step="1" type="number" value={form.perCustomerLimit} onChange={(e) => setField("perCustomerLimit", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Starts<input type="datetime-local" value={form.startsAt} onChange={(e) => setField("startsAt", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Expires<input type="datetime-local" value={form.expiresAt} onChange={(e) => setField("expiresAt", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab]">Timezone<input value={form.timezone} onChange={(e) => setField("timezone", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
          <label className="text-sm text-[#ababab] md:col-span-3">Description<textarea maxLength={1000} rows={2} value={form.description} onChange={(e) => setField("description", e.target.value)} className="mt-1 w-full rounded bg-[#1a1a1a] p-2 text-white" /></label>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[#ddd]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.channels.includes("online")} onChange={(e) => setField("channels", e.target.checked ? [...new Set([...form.channels, "online"])] : form.channels.filter((x) => x !== "online"))} /> Online</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.channels.includes("pos")} onChange={(e) => setField("channels", e.target.checked ? [...new Set([...form.channels, "pos"])] : form.channels.filter((x) => x !== "pos"))} /> In-store POS</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.firstOrderOnly} onChange={(e) => setField("firstOrderOnly", e.target.checked)} /> First order only</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.stackable} onChange={(e) => setField("stackable", e.target.checked)} /> Stack with other discounts</label>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {selectionGroup("Eligible products (empty = all)", "eligibleProducts", dishes, (dish) => dish.name)}
          {selectionGroup("Excluded products", "excludedProducts", dishes, (dish) => dish.name)}
          {selectionGroup("Eligible categories", "eligibleCategories", categories, (category) => category.name)}
          {selectionGroup("Excluded categories", "excludedCategories", categories, (category) => category.name)}
        </div>
        <button disabled={saveMutation.isPending} className="rounded-lg bg-[#f6b100] px-5 py-2 font-semibold text-[#1f1f1f] disabled:opacity-60">
          {saveMutation.isPending ? "Saving…" : editingId ? "Save changes" : "Create coupon"}
        </button>
      </form>

      <section className="rounded-lg bg-[#262626] p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search coupon name" className="flex-1 rounded bg-[#1a1a1a] p-2 text-white" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded bg-[#1a1a1a] p-2 text-white">
            <option value="">All statuses</option>
            {["draft", "scheduled", "active", "paused", "expired", "archived"].map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>
        {isLoading ? <p className="text-[#ababab]">Loading coupons…</p> : coupons.length === 0 ? (
          <p className="text-[#ababab]">No coupons found.</p>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <article key={coupon._id} className="flex flex-col justify-between gap-3 rounded-lg bg-[#1a1a1a] p-3 md:flex-row md:items-center">
                <div>
                  <h3 className="font-semibold">{coupon.name} <span className="ml-2 rounded bg-[#333] px-2 py-1 text-xs">{coupon.code || "private-only"}</span></h3>
                  <p className="text-sm text-[#ababab]">{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `Rs ${coupon.discountValue}`} · {coupon.status} · {coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""} uses</p>
                  {coupon.description && <p className="text-xs text-[#888]">{coupon.description}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => edit(coupon)} className="rounded bg-blue-600 px-3 py-2 text-sm">Edit</button>
                  <button onClick={() => handleAssign(coupon)} className="rounded bg-[#4b5563] px-3 py-2 text-sm">Assign private code</button>
                  <button
                    onClick={() => statusMutation.mutate({ couponId: coupon._id, status: coupon.status === "active" ? "paused" : "active" })}
                    className="rounded bg-[#8a5a00] px-3 py-2 text-sm"
                  >
                    {coupon.status === "active" ? "Pause" : "Activate"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId("");
                      setForm({ ...emptyForm, ...coupon, name: `${coupon.name} copy`, code: "", status: "draft" });
                    }}
                    className="rounded bg-[#444] px-3 py-2 text-sm"
                  >
                    Duplicate
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-sm text-[#ababab]">
          <span>Page {pagination.page} of {Math.max(1, pagination.pages)}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded bg-[#333] px-3 py-1 disabled:opacity-40">Previous</button>
            <button disabled={page >= pagination.pages} onClick={() => setPage((value) => value + 1)} className="rounded bg-[#333] px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-[#262626] p-4 sm:p-5">
        <h2 className="mb-3 text-lg font-semibold">Customer-specific assignments</h2>
        <form
          className="mb-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setAssignmentSearchPhone(assignmentPhone);
          }}
        >
          <input
            required
            type="tel"
            value={assignmentPhone}
            onChange={(event) => setAssignmentPhone(event.target.value)}
            placeholder="Search by customer mobile number"
            className="flex-1 rounded bg-[#1a1a1a] p-2 text-white"
          />
          <button disabled={loadingAssignments} className="rounded bg-[#444] px-4 py-2 text-sm">
            {loadingAssignments ? "Searching…" : "Search assignments"}
          </button>
        </form>
        {assignmentSearchPhone && assignments.length === 0 && !loadingAssignments && (
          <p className="text-sm text-[#ababab]">No coupon assignments found for that number.</p>
        )}
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="flex flex-col justify-between gap-2 rounded bg-[#1a1a1a] p-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium">{assignment.coupon?.name || "Coupon"} · {assignment.code}</p>
                <p className="text-xs text-[#ababab]">{assignment.customerKey} · {assignment.status}{assignment.expiresAt ? ` · expires ${new Date(assignment.expiresAt).toLocaleDateString()}` : ""}</p>
              </div>
              {assignment.status === "active" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => regenerateMutation.mutate({ couponId: assignment.coupon?._id, assignmentId: assignment._id })}
                    className="rounded bg-[#444] px-3 py-2 text-xs"
                  >
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => assignmentMutation.mutate({ couponId: assignment.coupon?._id, assignmentId: assignment._id })}
                    className="rounded bg-red-700 px-3 py-2 text-xs"
                  >
                    Revoke
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CouponsManager;
