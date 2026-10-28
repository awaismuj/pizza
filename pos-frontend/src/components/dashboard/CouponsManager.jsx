import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  cancelCoupon,
  generateFridayCoupons,
  getBirthdayCouponNotifications,
  getCoupon,
  getCouponCampaignSettings,
  getCouponRedemptions,
  getCouponReport,
  getCoupons,
  markBirthdayCouponNotificationRead,
  updateCouponCampaignSettings,
} from "../../https";

const initialSettings = {
  welcome: {
    enabled: false,
    minimumSubtotal: 1000,
    percentages: [2, 3, 4],
    expiryHours: 72,
    maxOnePerCustomer: true,
  },
  friday: {
    campaignName: "Friday Campaign",
    automaticGeneration: false,
    campaignDay: 5,
    generationTime: "18:00",
    minimumSubtotal: 1000,
    percentages: [4, 5, 6, 7],
    expiryHours: 72,
    timezone: "Asia/Karachi",
  },
  birthday: {
    campaignName: "Birthday Coupon",
    enabled: false,
    discountMode: "random",
    fixedPercentage: 5,
    percentages: [5, 6, 7],
    minimumSubtotal: 1000,
    expiryHours: 72,
    checkTime: "00:00",
    timezone: "Asia/Karachi",
  },
};

const getCouponStatus = (coupon) => {
  if (!coupon.isActive || coupon.cancelledAt) return "Cancelled";
  if (Number(coupon.redeemedCount) > 0) return "Redeemed";
  if (coupon.expiresAt && new Date(coupon.expiresAt) <= new Date()) return "Expired";
  return "Active";
};

const expiryTimezone = (coupon, settings) => {
  if (coupon.campaignType === "friday") return settings?.friday?.timezone || "Asia/Karachi";
  if (coupon.campaignType === "birthday") return settings?.birthday?.timezone || "Asia/Karachi";
  return "UTC";
};

const formatDate = (value, timezone = "UTC") => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
};

const formatCurrency = (value, currency) => new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: currency || "PKR",
}).format(Number(value) || 0);

const customerCouponMessage = (coupon, customer, currency, timezone) => {
  const greetingName = String(customer?.name || "").trim() || "there";
  const expiresAt = formatDate(coupon.expiresAt, timezone);
  const minimumOrder = formatCurrency(coupon.minimumOrderAmount, currency);
  return [
    `Hi ${greetingName}! 🍕 A special offer from GenZ Pizza Land.`,
    "",
    `🎉 **${coupon.discountValue}% OFF on your order!**`,
    "",
    `🎟️ Coupon code: ${coupon.code}`,
    "",
    `🛒 Minimum order: ${minimumOrder}`,
    "",
    `⏰ Valid until: ${expiresAt} (${timezone})`,
    "",
    "🍕 Order online: https://online.sindbandsolution.com/",
    "",
    "Enjoy your delicious pizza! 🍕❤️",
  ].join("\n");
};

const birthdayCouponMessage = (coupon, customer, currency, timezone) => {
  const customerName = String(customer?.name || "").trim();
  const greeting = customerName ? `🎂 Happy Birthday, ${customerName}! 🎉🍕` : "🎂 Happy Birthday! 🎉🍕";
  return [
    greeting,
    "",
    "GenZ Pizza Land has a special birthday treat just for you!",
    "",
    `🎁 **Enjoy ${coupon.discountValue}% OFF on your order!**`,
    "",
    `🎟️ Coupon code: ${coupon.code}`,
    "",
    `🛒 Minimum order: ${formatCurrency(coupon.minimumOrderAmount, currency)}`,
    "",
    `⏰ Valid until: ${formatDate(coupon.expiresAt, timezone)} (${timezone})`,
    "",
    "🍕 Order online: https://online.sindbandsolution.com/",
    "",
    "Celebrate your special day with delicious pizza! ❤️🍕",
  ].join("\n");
};

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    enqueueSnackbar("Coupon code copied.", { variant: "success" });
  } catch {
    enqueueSnackbar("Could not copy the coupon code. Please copy it manually.", { variant: "error" });
  }
};

const copyMessage = async (message) => {
  try {
    await navigator.clipboard.writeText(message);
    enqueueSnackbar("Personalized coupon message copied. It has not been sent.", { variant: "success" });
  } catch {
    enqueueSnackbar("Could not copy the message. Please try again.", { variant: "error" });
  }
};

const Field = ({ label, children }) => (
  <label className="block text-sm text-[#c8c8c8]">
    <span className="mb-1.5 block">{label}</span>
    {children}
  </label>
);
Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const inputClass = "w-full rounded-lg border border-[#3b3b3b] bg-[#171717] px-3 py-2.5 text-sm text-white outline-none focus:border-[#f6b100]";

const CampaignSettingsPanel = ({ type, title, initial, canManage, onSave, saving }) => {
  const [form, setForm] = useState(() => ({
    ...initial,
    percentages: (initial.percentages || []).join(", "),
  }));
  useEffect(() => {
    setForm({
      ...initial,
      percentages: (initial.percentages || []).join(", "),
    });
  }, [initial]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    const percentages = String(form.percentages)
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value));
    const payload = {
      ...form,
      minimumSubtotal: Number(form.minimumSubtotal),
      expiryHours: Number(form.expiryHours),
      percentages,
    };
    if (type === "friday") payload.campaignDay = Number(form.campaignDay);
    if (type === "birthday") payload.fixedPercentage = Number(form.fixedPercentage);
    onSave(type, payload);
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-[#343434] bg-[#222] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{type === "welcome" ? title : form.campaignName || title}</h3>
          <p className="mt-1 text-xs text-[#969696]">Expiry is stored at issuance and shown in the configured timezone.</p>
        </div>
        {type !== "friday" && (
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={Boolean(form.enabled)}
              onChange={(event) => update("enabled", event.target.checked)}
              disabled={!canManage}
            />
            Enabled
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {type === "friday" && (
          <>
            <label className="flex items-center gap-2 text-sm text-[#e2e2e2] sm:col-span-2">
              <input
                type="checkbox"
                checked={Boolean(form.automaticGeneration)}
                onChange={(event) => update("automaticGeneration", event.target.checked)}
                disabled={!canManage}
              />
              Enable automatic campaign generation
            </label>
            <Field label="Campaign / deal name">
              <input className={inputClass} maxLength={100} value={form.campaignName} onChange={(event) => update("campaignName", event.target.value)} disabled={!canManage} />
            </Field>
            <Field label="Generate every">
              <select className={inputClass} value={form.campaignDay} onChange={(event) => update("campaignDay", event.target.value)} disabled={!canManage}>
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, value) => (
                  <option key={day} value={value}>{day}</option>
                ))}
              </select>
            </Field>
            <Field label="Generation time">
              <input className={inputClass} type="time" value={form.generationTime} onChange={(event) => update("generationTime", event.target.value)} disabled={!canManage} />
            </Field>
          </>
        )}
        {type === "birthday" && (
          <Field label="Birthday campaign name">
            <input className={inputClass} maxLength={100} value={form.campaignName} onChange={(event) => update("campaignName", event.target.value)} disabled={!canManage} />
          </Field>
        )}
        {type === "birthday" && (
          <>
            <Field label="Discount method">
              <select className={inputClass} value={form.discountMode} onChange={(event) => update("discountMode", event.target.value)} disabled={!canManage}>
                <option value="random">Random from percentages</option>
                <option value="fixed">Fixed percentage</option>
              </select>
            </Field>
            {form.discountMode === "fixed" && (
              <Field label="Fixed discount (%)">
                <input className={inputClass} type="number" min="0.1" max="100" step="0.1" value={form.fixedPercentage} onChange={(event) => update("fixedPercentage", event.target.value)} disabled={!canManage} />
              </Field>
            )}
          </>
        )}
        <Field label={type === "welcome" ? "Minimum order subtotal" : "Minimum order subtotal (0 = none)"}>
          <input className={inputClass} type="number" min="0" step="1" value={form.minimumSubtotal} onChange={(event) => update("minimumSubtotal", event.target.value)} disabled={!canManage} />
        </Field>
        <Field label={type === "birthday" && form.discountMode === "fixed" ? "Allowed percentages (used if changed to random)" : "Allowed discount percentages (comma separated)"}>
          <input className={inputClass} value={form.percentages} onChange={(event) => update("percentages", event.target.value)} disabled={!canManage} placeholder="2, 3, 4" />
        </Field>
        <Field label="Coupon expiry after generation (hours)">
          <input className={inputClass} type="number" min="1" max="8760" step="1" value={form.expiryHours} onChange={(event) => update("expiryHours", event.target.value)} disabled={!canManage} />
        </Field>
        {type === "welcome" && (
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-[#e2e2e2]">
            <input type="checkbox" checked={Boolean(form.maxOnePerCustomer)} onChange={(event) => update("maxOnePerCustomer", event.target.checked)} disabled={!canManage} />
            Limit each customer to one welcome coupon
          </label>
        )}
        {type !== "welcome" && (
          <>
            {type === "birthday" && (
              <Field label="Daily birthday check time">
                <input className={inputClass} type="time" value={form.checkTime} onChange={(event) => update("checkTime", event.target.value)} disabled={!canManage} />
              </Field>
            )}
            <Field label="Timezone">
              <input className={inputClass} value={form.timezone} onChange={(event) => update("timezone", event.target.value)} disabled={!canManage} placeholder="Asia/Karachi" />
            </Field>
          </>
        )}
      </div>

      {canManage && (
        <button type="submit" disabled={saving} className="mt-5 rounded-lg bg-[#f6b100] px-4 py-2.5 text-sm font-bold text-[#171717] disabled:opacity-50">
          {saving ? "Saving…" : "Save settings"}
        </button>
      )}
    </form>
  );
};

CampaignSettingsPanel.propTypes = {
  type: PropTypes.oneOf(["welcome", "friday", "birthday"]).isRequired,
  title: PropTypes.string.isRequired,
  initial: PropTypes.shape({
    enabled: PropTypes.bool,
    automaticGeneration: PropTypes.bool,
    minimumSubtotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    percentages: PropTypes.arrayOf(PropTypes.number),
    expiryHours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxOnePerCustomer: PropTypes.bool,
    timezone: PropTypes.string,
    discountMode: PropTypes.string,
    fixedPercentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  canManage: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};

const CouponsManager = ({ canManage }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [contact, setContact] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [birthdayPage, setBirthdayPage] = useState(1);
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [generationSummary, setGenerationSummary] = useState(null);
  const listQuery = useQuery({
    queryKey: ["coupons", search, status, type, contact, from, to, page],
    queryFn: () => getCoupons({
      search,
      status,
      ...(type !== "all" ? { type } : {}),
      ...(contact !== "all" ? { contact } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      page,
      limit: 20,
    }),
    placeholderData: (previous) => previous,
  });
  const settingsQuery = useQuery({
    queryKey: ["couponCampaignSettings"],
    queryFn: getCouponCampaignSettings,
  });
  const reportQuery = useQuery({
    queryKey: ["couponReport"],
    queryFn: () => getCouponReport({}),
  });
  const notificationsQuery = useQuery({
    queryKey: ["birthdayCouponNotifications", birthdayPage],
    queryFn: () => getBirthdayCouponNotifications({ page: birthdayPage, limit: 20 }),
    placeholderData: (previous) => previous,
    refetchInterval: 60_000,
  });
  const couponDetailsQuery = useQuery({
    queryKey: ["couponDetails", selectedCouponId],
    queryFn: () => getCoupon(selectedCouponId),
    enabled: Boolean(selectedCouponId),
  });
  const redemptionQuery = useQuery({
    queryKey: ["couponRedemptions", selectedCouponId],
    queryFn: () => getCouponRedemptions({ couponId: selectedCouponId, page: 1, limit: 20 }),
    enabled: Boolean(selectedCouponId),
  });

  const invalidateCouponViews = () => {
    queryClient.invalidateQueries({ queryKey: ["coupons"] });
    queryClient.invalidateQueries({ queryKey: ["birthdayCouponNotifications"] });
  };
  const settingsMutation = useMutation({
    mutationFn: (values) => updateCouponCampaignSettings(values),
    onSuccess: () => {
      enqueueSnackbar("Coupon settings saved.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["couponCampaignSettings"] });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not save coupon settings.", { variant: "error" }),
  });
  const generateMutation = useMutation({
    mutationFn: generateFridayCoupons,
    onSuccess: (response) => {
      const result = response?.data?.data || {};
      setGenerationSummary(result);
      enqueueSnackbar(
        result.errors
          ? `Generation completed with errors: ${result.generated || 0} generated, ${result.skipped || 0} skipped, ${result.errors} errors.`
          : result.totalCustomers === 0
            ? "No eligible customers were found."
            : `Coupons: ${result.generated || 0} generated, ${result.skipped || 0} skipped, 0 errors.`,
        { variant: result.errors ? "warning" : "success" }
      );
      invalidateCouponViews();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not generate Friday coupons.", { variant: "error" }),
  });
  const cancelMutation = useMutation({
    mutationFn: cancelCoupon,
    onSuccess: () => {
      enqueueSnackbar("Coupon cancelled.", { variant: "success" });
      invalidateCouponViews();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not cancel coupon.", { variant: "error" }),
  });
  const readMutation = useMutation({
    mutationFn: markBirthdayCouponNotificationRead,
    onSuccess: () => {
      enqueueSnackbar("Birthday notification marked as read.", { variant: "success" });
      invalidateCouponViews();
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not update notification.", { variant: "error" }),
  });

  const listData = listQuery.data?.data || {};
  const coupons = listData.data || [];
  const summary = listData.summary || {};
  const settings = settingsQuery.data?.data?.data || initialSettings;
  const currency = settings.currency || "PKR";
  const report = reportQuery.data?.data?.data || {};
  const birthdayData = notificationsQuery.data?.data || {};
  const notifications = birthdayData.data || [];
  const birthdayPagination = birthdayData.pagination || { page: 1, pages: 1 };
  const detail = couponDetailsQuery.data?.data?.data;
  const redemptions = redemptionQuery.data?.data?.data || [];
  const pagination = listData.pagination || { page: 1, pages: 1 };

  const openFridayGeneration = () => {
    if (!window.confirm("Generate a Friday coupon for each eligible customer? Duplicate customer records and customers already issued a coupon this campaign will be skipped.")) return;
    generateMutation.mutate();
  };

  return (
    <section className="space-y-6 text-[#f5f5f5]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Coupons</h2>
          <p className="mt-1 text-sm text-[#a3a3a3]">Manage customer coupon campaigns, expiry, usage and birthday notifications.</p>
        </div>
        {canManage && (
          <button type="button" onClick={openFridayGeneration} disabled={generateMutation.isPending} className="rounded-lg bg-[#f6b100] px-4 py-2.5 text-sm font-bold text-[#171717] disabled:opacity-50">
            {generateMutation.isPending ? "Generating coupons…" : "Generate coupons now"}
          </button>
        )}
      </header>

      {generationSummary && (
        <section className="rounded-xl border border-[#49402a] bg-[#242117] p-4" aria-live="polite">
          <h3 className="font-semibold text-white">Last generation summary</h3>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p>Total customer records: <strong>{generationSummary.totalCustomers ?? 0}</strong></p>
            <p>Unique eligible customers: <strong>{generationSummary.eligible ?? 0}</strong></p>
            <p>Coupons created: <strong>{generationSummary.generated ?? 0}</strong></p>
            <p>Skipped customers: <strong>{generationSummary.skipped ?? 0}</strong></p>
            <p>Duplicate customer records: <strong>{generationSummary.duplicateCustomers ?? 0}</strong></p>
            <p>Already issued this campaign: <strong>{generationSummary.alreadyIssued ?? 0}</strong></p>
            <p>Errors: <strong className={generationSummary.errors ? "text-red-300" : ""}>{generationSummary.errors ?? 0}</strong></p>
            <p>Batches processed: <strong>{generationSummary.batchesProcessed ?? 0}/{generationSummary.batchesTotal ?? 0}</strong></p>
          </div>
          {generationSummary.errorSamples?.length > 0 && (
            <ul className="mt-3 list-inside list-disc text-xs text-red-200">
              {generationSummary.errorSamples.map((entry) => <li key={entry.customerId}>{entry.message} (Customer ID: {entry.customerId})</li>)}
            </ul>
          )}
        </section>
      )}
      {generateMutation.isPending && (
        <p className="rounded-lg border border-[#49402a] bg-[#242117] p-3 text-sm text-amber-100" role="status" aria-live="polite">
          Generating coupons in batches. This may take a while for a large customer database; keep this page open until the summary appears.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Active coupons", summary.active],
          ["Redeemed coupons", summary.redeemed],
          ["Expired coupons", summary.expired],
          ["Generated today", summary.generatedToday],
          ["Birthday alerts unread", summary.birthdayUnread],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#343434] bg-[#222] p-4">
            <p className="text-xs text-[#9b9b9b]">{label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{value ?? "—"}</p>
          </div>
        ))}
      </div>

      {settingsQuery.isLoading ? <p className="text-sm text-[#999]">Loading coupon settings…</p> : settingsQuery.isError ? (
        <p className="text-sm text-red-300" role="alert">{settingsQuery.error?.response?.data?.message || "Coupon settings could not be loaded."}</p>
      ) : (
      <div className="grid gap-4 xl:grid-cols-3">
        <CampaignSettingsPanel type="welcome" title="Welcome coupons" initial={settings.welcome || initialSettings.welcome} canManage={canManage} saving={settingsMutation.isPending} onSave={(key, value) => settingsMutation.mutate({ [key]: value })} />
        <CampaignSettingsPanel type="friday" title="Friday campaign" initial={settings.friday || initialSettings.friday} canManage={canManage} saving={settingsMutation.isPending} onSave={(key, value) => settingsMutation.mutate({ [key]: value })} />
        <CampaignSettingsPanel type="birthday" title="Birthday coupons" initial={settings.birthday || initialSettings.birthday} canManage={canManage} saving={settingsMutation.isPending} onSave={(key, value) => settingsMutation.mutate({ [key]: value })} />
      </div>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["Successful redemptions", report.successfulRedemptions],
          ["Discount granted", report.discountGranted],
          ["Average coupon order value", report.averageOrderValue],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#343434] bg-[#222] p-4">
            <p className="text-xs text-[#9b9b9b]">{label}</p>
            <p className="mt-1 text-xl font-bold text-white">{value ?? (reportQuery.isLoading ? "…" : "—")}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[#343434] bg-[#222] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Customer coupons</h3>
            <p className="text-xs text-[#999]">Codes are displayed as Flat plus random digits. Expiry times use the campaign timezone shown in settings; welcome coupons use UTC.</p>
          </div>
        </div>
        <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <input className={inputClass} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, phone, email or code" />
          <select className={inputClass} value={type} onChange={(event) => { setType(event.target.value); setPage(1); }}>
            <option value="all">All coupon types</option>
            <option value="welcome">Welcome</option>
            <option value="friday">Friday</option>
            <option value="birthday">Birthday</option>
            <option value="manual">Manual</option>
          </select>
          <select className={inputClass} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className={inputClass} value={contact} onChange={(event) => { setContact(event.target.value); setPage(1); }} aria-label="Filter by customer contact information">
            <option value="all">All contact states</option>
            <option value="available">Contact available</option>
            <option value="missing">No contact information</option>
          </select>
          <input className={inputClass} type="date" value={from} onChange={(event) => { setFrom(event.target.value); setPage(1); }} aria-label="Created from" />
          <input className={inputClass} type="date" value={to} onChange={(event) => { setTo(event.target.value); setPage(1); }} aria-label="Created through" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase text-[#999]">
              <tr>
                <th className="p-3">Customer</th><th className="p-3">Contact</th><th className="p-3">Coupon</th><th className="p-3">Type</th><th className="p-3">Created</th><th className="p-3">Expires</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {listQuery.isError ? <tr><td className="p-5 text-center text-red-300" colSpan="8" role="alert">{listQuery.error?.response?.data?.message || "Coupons could not be loaded."}</td></tr> : coupons.map((coupon) => {
                const customer = coupon.customerId && typeof coupon.customerId === "object" ? coupon.customerId : null;
                const timezone = expiryTimezone(coupon, settings);
                const couponStatus = getCouponStatus(coupon);
                return (
                  <tr key={coupon._id}>
                    <td className="p-3">{customer?.name || "—"}</td>
                    <td className="p-3 text-xs text-[#bbb]">
                      {customer?.phone || "—"}<br />{customer?.email || ""}
                      {!customer?.phone && !customer?.email && <span className="text-amber-300">No contact information</span>}
                    </td>
                    <td className="p-3"><strong>{coupon.code}</strong><br /><span className="text-xs text-[#aaa]">{coupon.name} · {coupon.discountValue}% off</span></td>
                    <td className="p-3 capitalize">{coupon.campaignType}</td>
                    <td className="p-3">{formatDate(coupon.createdAt, timezone)}</td>
                    <td className="p-3">{formatDate(coupon.expiresAt, timezone)}<br /><span className="text-[11px] text-[#888]">{timezone}</span></td>
                    <td className="p-3">{couponStatus}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded bg-[#333] px-2 py-1 text-xs" onClick={() => copyCode(coupon.code)}>Copy coupon</button>
                        {coupon.campaignType === "friday" && (
                          <button
                            className="rounded bg-[#333] px-2 py-1 text-xs"
                            onClick={() => copyMessage(customerCouponMessage(coupon, customer, currency, timezone))}
                          >
                            Copy message
                          </button>
                        )}
                        <button className="rounded bg-[#333] px-2 py-1 text-xs" onClick={() => setSelectedCouponId(coupon._id)}>View details</button>
                        <button className="rounded bg-[#333] px-2 py-1 text-xs" onClick={() => setSelectedCouponId(coupon._id)}>View history</button>
                        {canManage && couponStatus === "Active" && <button className="rounded bg-red-900/70 px-2 py-1 text-xs" onClick={() => {
                          if (window.confirm(`Cancel ${coupon.code}?`)) cancelMutation.mutate(coupon._id);
                        }}>Cancel</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!listQuery.isLoading && !listQuery.isError && coupons.length === 0 && <tr><td className="p-5 text-center text-[#999]" colSpan="8">No coupons match these filters.</td></tr>}
              {listQuery.isLoading && <tr><td className="p-5 text-center text-[#999]" colSpan="8">Loading coupons…</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-[#aaa]">
          <span>Page {pagination.page || page} of {Math.max(1, pagination.pages || 1)}</span>
          <div className="flex gap-2">
            <button className="rounded bg-[#333] px-3 py-1.5 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
            <button className="rounded bg-[#333] px-3 py-1.5 disabled:opacity-40" disabled={page >= (pagination.pages || 1)} onClick={() => setPage((value) => value + 1)}>Next</button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#343434] bg-[#222] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">Birthday Coupons</h3>
            <p className="text-xs text-[#999]">{birthdayData.unreadCount || 0} unread · history is retained</p>
          </div>
        </div>
        <div className="space-y-3">
          {notifications.map((coupon) => {
            const customer = coupon.customerId && typeof coupon.customerId === "object" ? coupon.customerId : null;
            const timezone = settings.birthday?.timezone || "Asia/Karachi";
            return (
              <article key={coupon._id} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 ${coupon.notificationReadAt ? "border-[#343434] bg-[#1a1a1a]" : "border-[#8b6a14] bg-[#2b271a]"}`}>
                <div>
                  <button
                    type="button"
                    className="text-left font-semibold hover:text-[#f6b100]"
                    onClick={() => setSelectedCouponId(coupon._id)}
                  >
                    🎂 Birthday coupon ready for {customer?.name || "you"}!
                  </button>
                  <p className="text-xs text-[#b3b3b3]">{customer?.phone || "—"} · {customer?.email || "—"}</p>
                  <div className="mt-2 grid gap-x-5 gap-y-1 text-sm sm:grid-cols-2">
                    <p>Campaign: <strong>{coupon.name}</strong></p>
                    <p>Coupon: <strong>{coupon.code}</strong></p>
                    <p>Discount: <strong>{coupon.discountValue}%</strong></p>
                    <p>Minimum order: <strong>{formatCurrency(coupon.minimumOrderAmount, currency)}</strong></p>
                    <p>Status: <strong>{getCouponStatus(coupon)}</strong></p>
                    <p>Created: {formatDate(coupon.createdAt, timezone)}</p>
                    <p>Expires: {formatDate(coupon.expiresAt, timezone)} ({timezone})</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded bg-[#333] px-3 py-1.5 text-xs" onClick={() => copyCode(coupon.code)}>Copy coupon</button>
                  <button className="rounded bg-[#333] px-3 py-1.5 text-xs" onClick={() => copyMessage(birthdayCouponMessage(coupon, customer, currency, timezone))}>Copy birthday message</button>
                  <button className="rounded bg-[#333] px-3 py-1.5 text-xs" onClick={() => setSelectedCouponId(coupon._id)}>View customer</button>
                  <button className="rounded bg-[#333] px-3 py-1.5 text-xs" onClick={() => setSelectedCouponId(coupon._id)}>View history</button>
                  {!coupon.notificationReadAt && canManage && <button className="rounded bg-[#f6b100] px-3 py-1.5 text-xs font-semibold text-[#171717]" onClick={() => readMutation.mutate(coupon._id)}>Mark as read</button>}
                </div>
              </article>
            );
          })}
          {notificationsQuery.isError && <p className="text-sm text-red-300" role="alert">{notificationsQuery.error?.response?.data?.message || "Birthday notifications could not be loaded."}</p>}
          {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length === 0 && <p className="text-sm text-[#999]">No birthday coupons have been generated yet.</p>}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-[#aaa]">
          <span>Page {birthdayPagination.page || birthdayPage} of {Math.max(1, birthdayPagination.pages || 1)}</span>
          <div className="flex gap-2">
            <button type="button" className="rounded bg-[#333] px-3 py-1.5 disabled:opacity-40" disabled={birthdayPage <= 1} onClick={() => setBirthdayPage((value) => Math.max(1, value - 1))}>Previous</button>
            <button type="button" className="rounded bg-[#333] px-3 py-1.5 disabled:opacity-40" disabled={birthdayPage >= (birthdayPagination.pages || 1)} onClick={() => setBirthdayPage((value) => value + 1)}>Next</button>
          </div>
        </div>
      </section>

      {selectedCouponId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedCouponId(""); }}>
          <section className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#444] bg-[#202020] p-5" role="dialog" aria-modal="true" aria-label="Coupon details and history">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold">Coupon details</h3>
              <button className="rounded bg-[#333] px-3 py-1.5" onClick={() => setSelectedCouponId("")}>Close</button>
            </div>
            {couponDetailsQuery.isLoading ? <p>Loading coupon…</p> : detail ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <p><span className="text-[#999]">Code:</span> {detail.coupon.code}</p>
                  <p><span className="text-[#999]">Status:</span> {getCouponStatus(detail.coupon)}</p>
                  <p><span className="text-[#999]">Customer:</span> {detail.coupon.customerId?.name || "—"}</p>
                  <p><span className="text-[#999]">Mobile:</span> {detail.coupon.customerId?.phone || "—"}</p>
                  <p><span className="text-[#999]">Email:</span> {detail.coupon.customerId?.email || "—"}</p>
                  <p><span className="text-[#999]">Discount:</span> {detail.coupon.discountValue}%</p>
                  <p><span className="text-[#999]">Minimum subtotal:</span> {formatCurrency(detail.coupon.minimumOrderAmount, currency)}</p>
                  <p><span className="text-[#999]">Created:</span> {formatDate(detail.coupon.createdAt, expiryTimezone(detail.coupon, settings))}</p>
                  <p><span className="text-[#999]">Expires:</span> {formatDate(detail.coupon.expiresAt, expiryTimezone(detail.coupon, settings))}</p>
                </div>
                {detail.coupon.campaignType === "birthday" && (
                  <div className="mt-4 rounded-lg border border-[#3b3b3b] bg-[#171717] p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold">Birthday message</h4>
                      <button
                        type="button"
                        className="rounded bg-[#333] px-3 py-1.5 text-xs"
                        onClick={() => copyMessage(birthdayCouponMessage(
                          detail.coupon,
                          detail.coupon.customerId,
                          currency,
                          expiryTimezone(detail.coupon, settings)
                        ))}
                      >
                        Copy Birthday Message
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-[#ccc]">
                      {birthdayCouponMessage(
                        detail.coupon,
                        detail.coupon.customerId,
                        currency,
                        expiryTimezone(detail.coupon, settings)
                      )}
                    </p>
                  </div>
                )}
                <p className="mt-3 text-sm text-[#bbb]">
                  Successful redemptions: {detail.performance?.successfulRedemptions || 0}
                  {detail.performance?.redemptions?.length ? ` · Usage records: ${detail.performance.redemptions.reduce((sum, item) => sum + item.count, 0)}` : ""}
                </p>
                <h4 className="mb-2 mt-6 font-semibold">Usage history</h4>
                {redemptionQuery.isLoading ? <p className="text-sm text-[#999]">Loading history…</p> : redemptions.length ? (
                  <div className="space-y-2">
                    {redemptions.map((redemption) => <p key={redemption._id} className="rounded bg-[#171717] p-3 text-sm">
                      {redemption.status} · discount {redemption.discountAmount} · {formatDate(redemption.appliedAt)}
                    </p>)}
                  </div>
                ) : <p className="text-sm text-[#999]">No usage history yet.</p>}
              </>
            ) : <p className="text-sm text-[#999]">Coupon details could not be loaded.</p>}
          </section>
        </div>
      )}
    </section>
  );
};
CouponsManager.propTypes = {
  canManage: PropTypes.bool.isRequired,
};

export default CouponsManager;
