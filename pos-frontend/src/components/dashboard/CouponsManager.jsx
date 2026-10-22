import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import WhatsAppCampaignManager from "./WhatsAppCampaignManager";
import {
  addCoupon,
  archiveCoupon,
  duplicateCoupon,
  getCategories,
  getCouponRedemptions,
  getCouponAssignments,
  getCoupons,
  getDishes,
  getSettings,
  updateCoupon,
  updateSettings,
  assignCouponToCustomer,
  revokeCustomerCoupon,
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

const IdSelector = ({ title, options, selectedIds, onChange, loading, error, emptySelectionText }) => {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visibleOptions = options.filter((option) => String(option.name || "").toLowerCase().includes(query));

  const toggle = (id) => {
    onChange(selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id]);
  };

  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="mb-1 text-sm text-[#ccc]">{title}</legend>
      <p className="text-xs text-[#aaa]">
        {selectedIds.length ? `${selectedIds.length} selected` : emptySelectionText}
      </p>
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={`Search ${title.toLowerCase()}…`}
        aria-label={`Search ${title.toLowerCase()}`}
        className="w-full rounded border border-[#444] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-[#888]"
      />
      <div className="max-h-52 min-h-24 overflow-y-auto rounded border border-[#444] bg-[#1a1a1a] p-2">
        {loading ? (
          <p className="p-2 text-sm text-[#aaa]">Loading options…</p>
        ) : error ? (
          <p className="p-2 text-sm text-red-300">{error}</p>
        ) : visibleOptions.length ? (
          <div className="space-y-1">
            {visibleOptions.map((option) => (
              <label key={option._id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-white hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(option._id)}
                  onChange={() => toggle(option._id)}
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="p-2 text-sm text-[#aaa]">
            {options.length ? "No matches. Try a different search." : "No options available."}
          </p>
        )}
      </div>
    </fieldset>
  );
};

const CouponsManager = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [assignmentForm, setAssignmentForm] = useState({ couponId: "", email: "", redemptionLimit: 1 });
  const [lastAssignedCode, setLastAssignedCode] = useState("");
  const [welcomeOfferForm, setWelcomeOfferForm] = useState({
    enabled: false,
    minimumSubtotal: 1000,
    percentages: "5,7,10",
    maxDiscountAmount: "",
    startsAt: "",
    expiresAt: "",
    maxCampaignRedemptions: "",
    eligibleChannels: ["Online"],
    popupTitle: "Welcome to our Pizza Store!",
    popupDescription: "You're eligible for a special first-order reward.",
    applyButtonLabel: "Apply Discount",
    declineButtonLabel: "No Thanks",
  });

  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const { data: couponResponse, isLoading, error: couponsError, isError: couponsFailed } = useQuery({
    queryKey: ["coupons", search, statusFilter, page],
    queryFn: () => getCoupons({ search: search || undefined, status: statusFilter || undefined, page, limit: 10 }),
    placeholderData: (previousData) => previousData,
  });
  const dishesQuery = useQuery({ queryKey: ["dishes"], queryFn: getDishes });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: redemptionResponse } = useQuery({
    queryKey: ["coupon-redemptions"],
    queryFn: () => getCouponRedemptions({ limit: 10 }),
    placeholderData: (previousData) => previousData,
  });
  const { data: assignmentResponse } = useQuery({
    queryKey: ["coupon-assignments"],
    queryFn: () => getCouponAssignments({ limit: 25 }),
  });
  const coupons = useMemo(() => couponResponse?.data?.data || [], [couponResponse]);
  const pagination = couponResponse?.data?.pagination;
  const dishes = dishesQuery.data?.data?.data || [];
  const categories = categoriesQuery.data?.data?.data || [];
  const redemptions = redemptionResponse?.data?.data || [];
  const assignments = assignmentResponse?.data?.data || [];
  const welcomeOfferConfig = settingsQuery.data?.data?.data?.firstTimeCustomerOffer || null;
  const redemptionSummary = redemptionResponse?.data?.summary || {
    redeemed: 0,
    reserved: 0,
    reversed: 0,
    refunded: 0,
    discountTotal: 0,
  };
  const assignmentSummary = assignmentResponse?.data?.summary || { assigned: 0, active: 0 };
  const activeCount = useMemo(() => coupons.filter((coupon) => coupon.status === "active").length, [coupons]);

  useEffect(() => {
    if (!welcomeOfferConfig) return;
    setWelcomeOfferForm({
      enabled: Boolean(welcomeOfferConfig.enabled),
      minimumSubtotal: Number(welcomeOfferConfig.minimumSubtotal ?? 1000),
      percentages: Array.isArray(welcomeOfferConfig.percentages) ? welcomeOfferConfig.percentages.join(",") : "5,7,10",
      maxDiscountAmount: welcomeOfferConfig.maxDiscountAmount ?? "",
      startsAt: dateInputValue(welcomeOfferConfig.startsAt, "Asia/Karachi"),
      expiresAt: dateInputValue(welcomeOfferConfig.expiresAt, "Asia/Karachi"),
      maxCampaignRedemptions: welcomeOfferConfig.maxCampaignRedemptions ?? "",
      eligibleChannels: ["Online"],
      popupTitle: welcomeOfferConfig.popupTitle || "Welcome to our Pizza Store!",
      popupDescription: welcomeOfferConfig.popupDescription || "You're eligible for a special first-order reward.",
      applyButtonLabel: welcomeOfferConfig.applyButtonLabel || "Apply Discount",
      declineButtonLabel: welcomeOfferConfig.declineButtonLabel || "No Thanks",
    });
  }, [welcomeOfferConfig]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["coupons"] });
    queryClient.invalidateQueries({ queryKey: ["coupon-redemptions"] });
    queryClient.invalidateQueries({ queryKey: ["coupon-assignments"] });
    queryClient.invalidateQueries({ queryKey: ["settings"] });
  };
  const assignMutation = useMutation({
    mutationFn: assignCouponToCustomer,
    onSuccess: (response) => {
      const { code } = response.data.data;
      setLastAssignedCode(code);
      enqueueSnackbar("Private customer code assigned.", { variant: "success" });
      setAssignmentForm((current) => ({ ...current, email: "" }));
      refresh();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not assign coupon.", { variant: "error" }),
  });
  const revokeMutation = useMutation({
    mutationFn: revokeCustomerCoupon,
    onSuccess: () => {
      enqueueSnackbar("Customer coupon revoked.", { variant: "success" });
      refresh();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not revoke customer coupon.", { variant: "error" }),
  });
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
  const welcomeOfferMutation = useMutation({
    mutationFn: (payload) => updateSettings({ firstTimeCustomerOffer: payload }),
    onSuccess: () => {
      enqueueSnackbar("First-time customer welcome offer saved.", { variant: "success" });
      refresh();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not save welcome offer.", { variant: "error" }),
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

  const inputClass = "w-full rounded bg-[#1a1a1a] border border-[#444] px-3 py-2 text-white";
  const labelClass = "block text-sm text-[#ccc] space-y-1";

  return (
    <div className="mx-auto w-full px-6 pb-10 space-y-6">
      <WhatsAppCampaignManager />
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-lg bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Coupons matched</p><b className="text-2xl text-white">{pagination?.total || 0}</b></div>
        <div className="rounded-lg bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Active coupons on this page</p><b className="text-2xl text-white">{activeCount}</b></div>
        <div className="rounded-lg bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Private codes assigned</p><b className="text-2xl text-white">{assignmentSummary.assigned || 0}</b><p className="text-xs text-[#aaa]">{assignmentSummary.active || 0} active</p></div>
        <div className="rounded-lg bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Completed coupon uses</p><b className="text-2xl text-white">{redemptionSummary.redeemed || 0}</b><p className="text-xs text-[#aaa]">Pending: {redemptionSummary.reserved || 0} · Discounts: Rs {Number(redemptionSummary.discountTotal || 0).toLocaleString()}</p></div>
      </section>

      <section className="rounded-lg bg-[#262626] p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">First-Time Customer Welcome Offer</h2>
          <label className="flex items-center gap-2 text-sm text-white">
            <input type="checkbox" checked={Boolean(welcomeOfferForm.enabled)} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, enabled: event.target.checked }))} />
            Enabled
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <label className={labelClass}>Minimum subtotal (Rs)<input type="number" min="0" step="1" className={inputClass} value={welcomeOfferForm.minimumSubtotal} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, minimumSubtotal: event.target.value }))} /></label>
          <label className={labelClass}>Discount percentages<input className={inputClass} value={welcomeOfferForm.percentages} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, percentages: event.target.value }))} /></label>
          <label className={labelClass}>Maximum discount (Rs)<input type="number" min="0" step="1" className={inputClass} value={welcomeOfferForm.maxDiscountAmount} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, maxDiscountAmount: event.target.value }))} /></label>
          <label className={labelClass}>Campaign redemption cap<input type="number" min="1" step="1" className={inputClass} value={welcomeOfferForm.maxCampaignRedemptions} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, maxCampaignRedemptions: event.target.value }))} /></label>
          <label className={labelClass}>Starts at (Asia/Karachi)<input type="datetime-local" className={inputClass} value={welcomeOfferForm.startsAt} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, startsAt: event.target.value }))} /></label>
          <label className={labelClass}>Expires at (Asia/Karachi)<input type="datetime-local" className={inputClass} value={welcomeOfferForm.expiresAt} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, expiresAt: event.target.value }))} /></label>
          <label className={labelClass}>Popup title<input className={inputClass} value={welcomeOfferForm.popupTitle} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, popupTitle: event.target.value }))} /></label>
          <label className={labelClass}>Apply button<input className={inputClass} value={welcomeOfferForm.applyButtonLabel} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, applyButtonLabel: event.target.value }))} /></label>
        </div>
        <p className="text-xs text-[#aaa]">Available for online orders.</p>
        <p className="text-xs text-[#aaa]">Redemptions: {Number(welcomeOfferConfig?.redemptionCount || 0).toLocaleString()} / {welcomeOfferForm.maxCampaignRedemptions || "unlimited"}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={labelClass}>Decline button<input className={inputClass} value={welcomeOfferForm.declineButtonLabel} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, declineButtonLabel: event.target.value }))} /></label>
        </div>
        <label className={labelClass}>Popup description<textarea rows="2" className={inputClass} value={welcomeOfferForm.popupDescription} onChange={(event) => setWelcomeOfferForm((current) => ({ ...current, popupDescription: event.target.value }))} /></label>
        <div className="flex gap-3">
          <button type="button" disabled={welcomeOfferMutation.isPending} className="rounded bg-[#f6b100] px-4 py-2 font-semibold text-black" onClick={() => {
            const percentages = welcomeOfferForm.percentages.split(",").map((value) => Number(value.trim())).filter((value) => Number.isFinite(value) && value > 0);
            welcomeOfferMutation.mutate({
              enabled: Boolean(welcomeOfferForm.enabled),
              minimumSubtotal: Number(welcomeOfferForm.minimumSubtotal || 0),
              percentages,
              maxDiscountAmount: welcomeOfferForm.maxDiscountAmount === "" ? null : Number(welcomeOfferForm.maxDiscountAmount),
              startsAt: zonedDateToIso(welcomeOfferForm.startsAt, "Asia/Karachi"),
              expiresAt: zonedDateToIso(welcomeOfferForm.expiresAt, "Asia/Karachi"),
              maxCampaignRedemptions: welcomeOfferForm.maxCampaignRedemptions === "" ? null : Number(welcomeOfferForm.maxCampaignRedemptions),
              eligibleChannels: ["Online"],
              popupTitle: welcomeOfferForm.popupTitle,
              popupDescription: welcomeOfferForm.popupDescription,
              applyButtonLabel: welcomeOfferForm.applyButtonLabel,
              declineButtonLabel: welcomeOfferForm.declineButtonLabel,
            });
          }}>{welcomeOfferMutation.isPending ? "Saving…" : "Save welcome offer"}</button>
        </div>
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
          <p className="md:col-span-2 text-xs text-[#aaa]">
            Choose any combination of eligible items and categories. A matching item or category qualifies; exclusions always take priority.
          </p>
          <IdSelector
            title="Eligible menu items"
            options={dishes}
            selectedIds={form.eligibleDishIds}
            onChange={(value) => setField("eligibleDishIds", value)}
            loading={dishesQuery.isLoading}
            error={dishesQuery.isError ? dishesQuery.error?.response?.data?.message || "Menu items could not be loaded." : ""}
            emptySelectionText="Empty means all menu items are eligible."
          />
          <IdSelector
            title="Excluded menu items"
            options={dishes}
            selectedIds={form.excludedDishIds}
            onChange={(value) => setField("excludedDishIds", value)}
            loading={dishesQuery.isLoading}
            error={dishesQuery.isError ? dishesQuery.error?.response?.data?.message || "Menu items could not be loaded." : ""}
            emptySelectionText="No menu items are excluded."
          />
          <IdSelector
            title="Eligible categories"
            options={categories}
            selectedIds={form.eligibleCategoryIds}
            onChange={(value) => setField("eligibleCategoryIds", value)}
            loading={categoriesQuery.isLoading}
            error={categoriesQuery.isError ? categoriesQuery.error?.response?.data?.message || "Categories could not be loaded." : ""}
            emptySelectionText="Empty means all categories are eligible."
          />
          <IdSelector
            title="Excluded categories"
            options={categories}
            selectedIds={form.excludedCategoryIds}
            onChange={(value) => setField("excludedCategoryIds", value)}
            loading={categoriesQuery.isLoading}
            error={categoriesQuery.isError ? categoriesQuery.error?.response?.data?.message || "Categories could not be loaded." : ""}
            emptySelectionText="No categories are excluded."
          />
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-white">
          {["Online", "POS"].map((channel) => <label key={channel} className="flex items-center gap-2"><input type="checkbox" checked={form.channels.includes(channel)} onChange={() => toggleList("channels", channel)} />{channel}</label>)}
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.firstOrderOnly} onChange={(event) => setField("firstOrderOnly", event.target.checked)} />First order only</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.allowStacking} onChange={(event) => setField("allowStacking", event.target.checked)} />Allow combining with other discounts</label>
        </div>
        <button disabled={saveMutation.isPending} className="rounded bg-[#f6b100] px-5 py-2 font-semibold text-black">{saveMutation.isPending ? "Saving…" : editingId ? "Save changes" : "Create coupon"}</button>
      </form>

      <section className="rounded-lg bg-[#262626] p-5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Assign a private customer code</h2>
          <p className="text-sm text-[#aaa]">Only verified customer accounts can receive a private, random code. The generated code is shown once.</p>
          <p className="mt-1 text-xs text-[#aaa]">
            {assignmentSummary.assigned || 0} assigned total · {assignmentSummary.active || 0} active · {assignmentSummary.revoked || 0} revoked · {assignmentSummary.expired || 0} expired
          </p>
        </div>
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!assignmentForm.couponId) {
              enqueueSnackbar("Choose a coupon campaign.", { variant: "warning" });
              return;
            }
            assignMutation.mutate({ ...assignmentForm, redemptionLimit: Number(assignmentForm.redemptionLimit) });
          }}
        >
          <label className={labelClass}>Coupon
            <select required className={inputClass} value={assignmentForm.couponId} onChange={(event) => setAssignmentForm((current) => ({ ...current, couponId: event.target.value }))}>
              <option value="">Choose a campaign</option>
              {coupons.filter((coupon) => ["active", "scheduled"].includes(coupon.status)).map((coupon) => <option key={coupon._id} value={coupon._id}>{coupon.name} ({coupon.code})</option>)}
            </select>
          </label>
          <label className={labelClass}>Verified customer email<input required type="email" className={inputClass} value={assignmentForm.email} onChange={(event) => setAssignmentForm((current) => ({ ...current, email: event.target.value }))} /></label>
          <label className={labelClass}>Use limit<input required type="number" min="1" max="100" step="1" className={inputClass} value={assignmentForm.redemptionLimit} onChange={(event) => setAssignmentForm((current) => ({ ...current, redemptionLimit: event.target.value }))} /></label>
          <button disabled={assignMutation.isPending} className="self-end rounded bg-[#f6b100] px-4 py-2 font-semibold text-black">{assignMutation.isPending ? "Assigning…" : "Assign coupon"}</button>
        </form>
        {lastAssignedCode && (
          <div className="flex flex-wrap items-center gap-3 rounded border border-[#66531d] bg-[#30280f] p-3 text-white" role="status">
            <span>New private code (copy now): <code className="font-bold">{lastAssignedCode}</code></span>
            <button type="button" className="text-sm text-[#f6b100]" onClick={async () => {
              try {
                await navigator.clipboard.writeText(lastAssignedCode);
                enqueueSnackbar("Private code copied.", { variant: "success" });
              } catch {
                enqueueSnackbar("Clipboard access is unavailable. Select and copy the code manually.", { variant: "warning" });
              }
            }}>Copy code</button>
            <button type="button" className="text-sm text-[#aaa]" onClick={() => setLastAssignedCode("")}>Hide</button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm text-white">
            <thead className="text-[#aaa]"><tr><th className="py-2">Customer</th><th>Campaign</th><th>Use count</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{assignments.map((assignment) => (
              <tr key={assignment._id} className="border-t border-[#3c3c3c]">
                <td className="py-2">{assignment.customerId?.name}<div className="text-xs text-[#aaa]">{assignment.customerId?.email}</div></td>
                <td>{assignment.couponId?.name}</td>
                <td>{assignment.redemptionCount} / {assignment.redemptionLimit}</td>
                <td>{assignment.status}</td>
                <td>{assignment.status === "active" && <button type="button" disabled={revokeMutation.isPending} className="text-red-300" onClick={() => revokeMutation.mutate(assignment._id)}>Revoke</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg bg-[#262626] p-5">
        <div className="mb-4 flex flex-wrap gap-3">
          <input className={`${inputClass} max-w-sm`} placeholder="Search name or code" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          <select className="rounded bg-[#1a1a1a] border border-[#444] px-3 py-2 text-white" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
            <option value="">All statuses</option>{["draft", "scheduled", "active", "paused", "expired", "archived"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        {isLoading ? <p className="text-[#aaa]">Loading coupons…</p> : couponsFailed ? <p className="text-red-300">{couponsError?.response?.data?.message || couponsError?.message || "Coupons could not be loaded."}</p> : coupons.length === 0 ? <p className="text-[#aaa]">No coupons found.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm text-white">
              <thead className="text-[#aaa]"><tr><th className="py-2">Coupon</th><th>Discount</th><th>Completed uses</th><th>Private assignments</th><th>Schedule</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t border-[#3c3c3c]">
                  <td className="py-3"><b>{coupon.name}</b><div className="text-[#aaa]">{coupon.code}</div></td>
                  <td>{amountText(coupon)}</td>
                  <td>{coupon.redeemedCount || 0} / {coupon.usageLimit ?? "∞"}<div className="text-xs text-[#aaa]">{coupon.reservedCount || 0} pending (counts toward limit)</div><div className="text-xs text-[#aaa]">per phone: {coupon.perCustomerLimit}</div></td>
                  <td>{coupon.assignedCount || 0} total<div className="text-xs text-[#aaa]">{coupon.activeAssignmentCount || 0} active</div></td>
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
