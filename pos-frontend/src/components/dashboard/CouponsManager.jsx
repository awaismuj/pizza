import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  addCoupon,
  archiveCoupon,
  duplicateCoupon,
  getCategories,
  getCouponRedemptions,
  getCoupons,
  getDishes,
  updateCoupon,
} from "../../https";

const EMPTY_FORM = {
  name: "",
  description: "",
  code: "",
  discountType: "percentage",
  discountValue: "",
  minimumSubtotal: 0,
  maximumDiscount: "",
  eligibleDishIds: [],
  excludedDishIds: [],
  eligibleCategoryIds: [],
  excludedCategoryIds: [],
  channels: ["Online", "POS"],
  usageLimit: "",
  perCustomerLimit: 1,
  startsAt: "",
  expiresAt: "",
  timezone: "Asia/Karachi",
  firstOrderOnly: false,
  allowStacking: false,
  status: "draft",
};

const dateInputValue = (value, timezone = "Asia/Karachi") => {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type) => parts.find((entry) => entry.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
};
const zonedDateToIso = (value, timezone) => {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(targetUtc));
  const part = (type) => Number(parts.find((entry) => entry.type === type)?.value);
  const representedUtc = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
  return new Date(targetUtc - (representedUtc - targetUtc)).toISOString();
};
const populatedIds = (values = []) => values.map((value) => String(value?._id || value));
const amountText = (coupon) =>
  coupon.discountType === "percentage"
    ? `${coupon.discountValue}%`
    : `Rs ${Number(coupon.discountValue).toLocaleString()}`;

const CouponsManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: couponResponse, isLoading, error: couponsError, isError: couponsFailed } = useQuery({
    queryKey: ["coupons", search, statusFilter, page],
    queryFn: () => getCoupons({ search: search || undefined, status: statusFilter || undefined, page, limit: 10 }),
    placeholderData: (previousData) => previousData,
  });
  const { data: dishesResponse } = useQuery({ queryKey: ["dishes"], queryFn: getDishes });
  const { data: categoriesResponse } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: redemptionResponse } = useQuery({
    queryKey: ["coupon-redemptions"],
    queryFn: () => getCouponRedemptions({ limit: 10 }),
    placeholderData: (previousData) => previousData,
  });
  const coupons = useMemo(() => couponResponse?.data?.data || [], [couponResponse]);
  const pagination = couponResponse?.data?.pagination;
  const dishes = dishesResponse?.data?.data || [];
  const categories = categoriesResponse?.data?.data || [];
  const redemptions = redemptionResponse?.data?.data || [];
  const redemptionSummary = redemptionResponse?.data?.summary || { redeemed: 0, discountTotal: 0 };
  const activeCount = useMemo(() => coupons.filter((coupon) => coupon.status === "active").length, [coupons]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["coupons"] });
    queryClient.invalidateQueries({ queryKey: ["coupon-redemptions"] });
  };
  const saveMutation = useMutation({
    mutationFn: (payload) => editingId ? updateCoupon({ couponId: editingId, ...payload }) : addCoupon(payload),
    onSuccess: () => {
      enqueueSnackbar(editingId ? "Coupon updated." : "Coupon created.", { variant: "success" });
      setEditingId("");
      setForm(EMPTY_FORM);
      refresh();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not save coupon.", { variant: "error" }),
  });
  const archiveMutation = useMutation({
    mutationFn: archiveCoupon,
    onSuccess: () => {
      enqueueSnackbar("Coupon archived.", { variant: "success" });
      refresh();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not archive coupon.", { variant: "error" }),
  });
  const duplicateMutation = useMutation({
    mutationFn: duplicateCoupon,
    onSuccess: (response) => {
      const coupon = response.data.data;
      setEditingId("");
      setForm({
        ...EMPTY_FORM,
        ...coupon,
        code: "",
        status: "draft",
        eligibleDishIds: populatedIds(coupon.eligibleDishIds),
        excludedDishIds: populatedIds(coupon.excludedDishIds),
        eligibleCategoryIds: populatedIds(coupon.eligibleCategoryIds),
        excludedCategoryIds: populatedIds(coupon.excludedCategoryIds),
        startsAt: dateInputValue(coupon.startsAt, coupon.timezone),
        expiresAt: dateInputValue(coupon.expiresAt, coupon.timezone),
      });
      enqueueSnackbar("Copy ready to edit. Give it a new code before saving.", { variant: "info" });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not duplicate coupon.", { variant: "error" }),
  });

  const beginEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      ...EMPTY_FORM,
      ...coupon,
      eligibleDishIds: populatedIds(coupon.eligibleDishIds),
      excludedDishIds: populatedIds(coupon.excludedDishIds),
      eligibleCategoryIds: populatedIds(coupon.eligibleCategoryIds),
      excludedCategoryIds: populatedIds(coupon.excludedCategoryIds),
      startsAt: dateInputValue(coupon.startsAt, coupon.timezone),
      expiresAt: dateInputValue(coupon.expiresAt, coupon.timezone),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggleList = (field, value) => {
    const current = form[field] || [];
    setField(field, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const submit = (event) => {
    event.preventDefault();
    let startsAt;
    let expiresAt;
    try {
      startsAt = zonedDateToIso(form.startsAt, form.timezone);
      expiresAt = zonedDateToIso(form.expiresAt, form.timezone);
    } catch {
      enqueueSnackbar("Enter a valid IANA timezone before saving.", { variant: "error" });
      return;
    }
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discountValue: Number(form.discountValue),
      minimumSubtotal: Number(form.minimumSubtotal || 0),
      maximumDiscount: form.maximumDiscount === "" ? null : Number(form.maximumDiscount),
      usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
      perCustomerLimit: Number(form.perCustomerLimit),
      startsAt,
      expiresAt,
    };
    saveMutation.mutate(payload);
  };

  const selectIds = (field, options) => (
    <select
      multiple
      value={form[field]}
      onChange={(event) => setField(field, Array.from(event.target.selectedOptions, (option) => option.value))}
      className="w-full min-h-24 rounded bg-[#1a1a1a] border border-[#444] p-2 text-sm text-white"
    >
      {options.map((option) => <option key={option._id} value={option._id}>{option.name}</option>)}
    </select>
  );
  const inputClass = "w-full rounded bg-[#1a1a1a] border border-[#444] px-3 py-2 text-white";
  const labelClass = "block text-sm text-[#ccc] space-y-1";

  return (
    <div className="container mx-auto px-6 pb-10 space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Coupons on this page</p><b className="text-2xl text-white">{pagination?.total || 0}</b></div>
        <div className="rounded-lg bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Active on this page</p><b className="text-2xl text-white">{activeCount}</b></div>
        <div className="rounded-lg bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Recorded redemptions</p><b className="text-2xl text-white">{redemptionSummary.redeemed || 0}</b><p className="text-xs text-[#aaa]">Discounts: Rs {Number(redemptionSummary.discountTotal || 0).toLocaleString()}</p></div>
      </section>

      <form onSubmit={submit} className="rounded-lg bg-[#262626] p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">{editingId ? "Edit coupon" : "Create coupon"}</h2>
          {editingId && <button type="button" className="text-sm text-[#f6b100]" onClick={() => { setEditingId(""); setForm(EMPTY_FORM); }}>Cancel edit</button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <label className={labelClass}>Name<input required maxLength="120" className={inputClass} value={form.name} onChange={(event) => setField("name", event.target.value)} /></label>
          <label className={labelClass}>Code<input required minLength="3" maxLength="40" pattern="[A-Za-z0-9_-]+" className={inputClass} value={form.code} onChange={(event) => setField("code", event.target.value.toUpperCase())} /></label>
          <label className={labelClass}>Discount type<select className={inputClass} value={form.discountType} onChange={(event) => setField("discountType", event.target.value)}><option value="percentage">Percentage</option><option value="fixed">Fixed amount (Rs)</option></select></label>
          <label className={labelClass}>Discount value<input required type="number" min="0.01" step="0.01" max={form.discountType === "percentage" ? "100" : undefined} className={inputClass} value={form.discountValue} onChange={(event) => setField("discountValue", event.target.value)} /></label>
          <label className={labelClass}>Minimum eligible subtotal (Rs)<input type="number" min="0" step="1" className={inputClass} value={form.minimumSubtotal} onChange={(event) => setField("minimumSubtotal", event.target.value)} /></label>
          <label className={labelClass}>Maximum discount (Rs)<input type="number" min="0" step="1" className={inputClass} value={form.maximumDiscount} onChange={(event) => setField("maximumDiscount", event.target.value)} /></label>
          <label className={labelClass}>Campaign uses (blank = unlimited)<input type="number" min="1" step="1" className={inputClass} value={form.usageLimit} onChange={(event) => setField("usageLimit", event.target.value)} /></label>
          <label className={labelClass}>Uses per phone<input required type="number" min="1" step="1" className={inputClass} value={form.perCustomerLimit} onChange={(event) => setField("perCustomerLimit", event.target.value)} /></label>
          <label className={labelClass}>Starts at ({form.timezone})<input type="datetime-local" className={inputClass} value={form.startsAt} onChange={(event) => setField("startsAt", event.target.value)} /></label>
          <label className={labelClass}>Expires at ({form.timezone})<input type="datetime-local" className={inputClass} value={form.expiresAt} onChange={(event) => setField("expiresAt", event.target.value)} /></label>
          <label className={labelClass}>Timezone (IANA)<input required className={inputClass} value={form.timezone} onChange={(event) => setField("timezone", event.target.value)} /></label>
          <label className={labelClass}>Status<select className={inputClass} value={form.status} onChange={(event) => setField("status", event.target.value)}>{["draft", "scheduled", "active", "paused", "expired", "archived"].map((status) => <option key={status}>{status}</option>)}</select></label>
        </div>
        <label className={labelClass}>Description<textarea rows="2" maxLength="1000" className={inputClass} value={form.description} onChange={(event) => setField("description", event.target.value)} /></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Eligible menu items (empty means all)", "eligibleDishIds", dishes],
            ["Excluded menu items", "excludedDishIds", dishes],
            ["Eligible categories (empty means all)", "eligibleCategoryIds", categories],
            ["Excluded categories", "excludedCategoryIds", categories],
          ].map(([title, field, options]) => <label key={field} className={labelClass}>{title}{selectIds(field, options)}<small className="text-[#888]">Use Ctrl/Cmd to select multiple.</small></label>)}
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-white">
          {["Online", "POS"].map((channel) => <label key={channel} className="flex items-center gap-2"><input type="checkbox" checked={form.channels.includes(channel)} onChange={() => toggleList("channels", channel)} />{channel}</label>)}
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.firstOrderOnly} onChange={(event) => setField("firstOrderOnly", event.target.checked)} />First order only</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.allowStacking} onChange={(event) => setField("allowStacking", event.target.checked)} />Allow combining with other discounts</label>
        </div>
        <button disabled={saveMutation.isPending} className="rounded bg-[#f6b100] px-5 py-2 font-semibold text-black">{saveMutation.isPending ? "Saving…" : editingId ? "Save changes" : "Create coupon"}</button>
      </form>

      <section className="rounded-lg bg-[#262626] p-5">
        <div className="mb-4 flex flex-wrap gap-3">
          <input className={`${inputClass} max-w-sm`} placeholder="Search name or code" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          <select className="rounded bg-[#1a1a1a] border border-[#444] px-3 py-2 text-white" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
            <option value="">All statuses</option>{["draft", "scheduled", "active", "paused", "expired", "archived"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        {isLoading ? <p className="text-[#aaa]">Loading coupons…</p> : couponsFailed ? <p className="text-red-300">{couponsError?.response?.data?.message || couponsError?.message || "Coupons could not be loaded."}</p> : coupons.length === 0 ? <p className="text-[#aaa]">No coupons found.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm text-white">
              <thead className="text-[#aaa]"><tr><th className="py-2">Coupon</th><th>Discount</th><th>Usage</th><th>Schedule</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t border-[#3c3c3c]">
                  <td className="py-3"><b>{coupon.name}</b><div className="text-[#aaa]">{coupon.code}</div></td>
                  <td>{amountText(coupon)}</td>
                  <td>{coupon.redemptionCount} / {coupon.usageLimit ?? "∞"}<div className="text-xs text-[#aaa]">per phone: {coupon.perCustomerLimit}</div></td>
                  <td className="text-xs">{coupon.startsAt ? new Date(coupon.startsAt).toLocaleString(undefined, { timeZone: coupon.timezone }) : "Now"}<br />to {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleString(undefined, { timeZone: coupon.timezone }) : "No expiry"}</td>
                  <td className="capitalize">{coupon.status}</td>
                  <td><div className="flex flex-wrap gap-2">
                    <button className="text-[#f6b100]" onClick={() => beginEdit(coupon)}>Edit</button>
                    <button className="text-[#f6b100]" onClick={() => duplicateMutation.mutate(coupon._id)}>Duplicate</button>
                    {coupon.status !== "archived" && <button className="text-red-300" onClick={() => archiveMutation.mutate(coupon._id)}>Archive</button>}
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-sm text-[#bbb]">
          <span>{pagination?.total || 0} coupons</span>
          <div className="flex gap-3">
            <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
            <span>{page} / {Math.max(1, pagination?.pages || 1)}</span>
            <button disabled={page >= (pagination?.pages || 1)} onClick={() => setPage((value) => value + 1)}>Next</button>
          </div>
        </div>
      </section>
      <section className="rounded-lg bg-[#262626] p-5">
        <h2 className="mb-3 text-lg font-semibold text-white">Recent redemptions</h2>
        {redemptions.length === 0 ? <p className="text-sm text-[#aaa]">No coupon redemptions yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm text-white">
              <thead className="text-[#aaa]"><tr><th className="py-2">Coupon</th><th>Order</th><th>Discount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{redemptions.map((redemption) => (
                <tr key={redemption._id} className="border-t border-[#3c3c3c]">
                  <td className="py-2">{redemption.couponId?.name || redemption.code}<div className="text-xs text-[#aaa]">{redemption.code}</div></td>
                  <td>{redemption.orderId?.orderNumber || redemption.orderId?._id || "—"}</td>
                  <td>Rs {Number(redemption.discountAmount).toLocaleString()}</td>
                  <td className="capitalize">{redemption.status}</td>
                  <td>{new Date(redemption.redeemedAt).toLocaleString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default CouponsManager;
