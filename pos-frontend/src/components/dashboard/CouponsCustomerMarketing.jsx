import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import CouponsManager from "./CouponsManager";
import {
  getCouponAssignments,
  getPromotionCustomers,
  getPromotionExecutionIssues,
  getPromotionExecutions,
  getPromotionPreview,
  getPromotionSettings,
  queuePromotionIssueDelivery,
  revokePromotionCoupon,
  retryPromotionIssueDelivery,
  runPromotionCampaign,
  updatePromotionSettings,
} from "../../https";

const sections = [
  "Coupon Dashboard",
  "Customer Database",
  "Welcome Coupons",
  "Friday Campaign",
  "Birthday Coupons",
  "Manual Coupon Campaigns",
  "Coupon History",
  "Email & WhatsApp Delivery Logs",
  "Coupon Settings",
];

const createRequestKey = () => {
  if (!globalThis.crypto?.randomUUID) throw new Error("Secure random generation is unavailable in this browser.");
  return globalThis.crypto.randomUUID();
};
const errorMessage = (error) => error?.response?.data?.message || error?.message || "Request failed.";
const amount = (value) => `Rs ${Number(value || 0).toLocaleString("en-US")}`;
const emailStatus = (row) => row.emailError || row.emailStatus || "—";
const whatsappStatus = (row) => row.whatsappError || row.whatsappStatus || "—";

const CouponSettingsEditor = ({ settings, onChange, groups = ["welcome", "friday", "birthday", "manual"] }) => {
  const inputClass = "w-full rounded border border-[#444] bg-[#191919] px-3 py-2 text-sm text-white";
  const update = (group, field, value) => onChange((current) => ({
    ...current,
    [group]: { ...current[group], [field]: value },
  }));
  const renderPromotion = (key, title) => {
    const config = settings[key];
    return (
      <fieldset className="space-y-3 rounded border border-[#3c3c3c] bg-[#242424] p-4" key={key}>
        <legend className="px-2 font-semibold text-white">{title}</legend>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {key !== "manual" && (
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={Boolean(config.enabled)} onChange={(event) => update(key, "enabled", event.target.checked)} />
              Enabled
            </label>
          )}
          {(key === "friday" || key === "birthday") && (
            <label className="flex items-center gap-2 text-sm text-white">
              <input type="checkbox" checked={Boolean(config.automaticGeneration)} onChange={(event) => update(key, "automaticGeneration", event.target.checked)} />
              Enable automatic generation
            </label>
          )}
          {key !== "welcome" && <label className="space-y-1 text-xs text-[#bbb]">
            Discount mode
            <select className={inputClass} value={config.discountMode || "list"} onChange={(event) => update(key, "discountMode", event.target.value)}>
              <option value="list">Random from list</option><option value="range">Random range</option>
              {key === "birthday" && <option value="fixed">Fixed</option>}
            </select>
          </label>}
          {(key === "welcome" || config.discountMode === "list") && (
            <label className="space-y-1 text-xs text-[#bbb]">
              Allowed percentages (comma separated)
              <input className={inputClass} value={(config.percentages || []).join(", ")} onChange={(event) => update(key, "percentages", event.target.value.split(",").map((value) => Number(value.trim())).filter(Number.isFinite))} />
            </label>
          )}
          {config.discountMode === "range" && <>
            <label className="space-y-1 text-xs text-[#bbb]">Minimum percentage<input type="number" min="0.01" max="100" step="0.01" className={inputClass} value={config.rangeMin} onChange={(event) => update(key, "rangeMin", Number(event.target.value))} /></label>
            <label className="space-y-1 text-xs text-[#bbb]">Maximum percentage<input type="number" min="0.01" max="100" step="0.01" className={inputClass} value={config.rangeMax} onChange={(event) => update(key, "rangeMax", Number(event.target.value))} /></label>
            <label className="space-y-1 text-xs text-[#bbb]">Decimal precision<select className={inputClass} value={config.precision || 0} onChange={(event) => update(key, "precision", Number(event.target.value))}><option value="0">Whole percent</option><option value="1">One decimal</option><option value="2">Two decimals</option></select></label>
          </>}
          {config.discountMode === "fixed" && <label className="space-y-1 text-xs text-[#bbb]">Fixed percentage<input type="number" min="0.01" max="100" step="0.01" className={inputClass} value={config.fixedPercentage} onChange={(event) => update(key, "fixedPercentage", Number(event.target.value))} /></label>}
          <label className="space-y-1 text-xs text-[#bbb]">Minimum order amount<input type="number" min="0" step="1" className={inputClass} value={config.minimumSubtotal} onChange={(event) => update(key, "minimumSubtotal", Number(event.target.value))} /></label>
          <label className="space-y-1 text-xs text-[#bbb]">Maximum discount (blank = no cap)<input type="number" min="0" step="1" className={inputClass} value={config.maximumDiscount ?? ""} onChange={(event) => update(key, "maximumDiscount", event.target.value === "" ? null : Number(event.target.value))} /></label>
          <label className="space-y-1 text-xs text-[#bbb]">Expiry mode<select className={inputClass} value={config.expiryMode} onChange={(event) => update(key, "expiryMode", event.target.value)}><option value="duration">Duration after issue</option><option value="calendar">Calendar days</option></select></label>
          {config.expiryMode === "duration"
            ? <label className="space-y-1 text-xs text-[#bbb]">Expiry duration (hours)<input type="number" min="1" max="87600" step="1" className={inputClass} value={config.expiryHours} onChange={(event) => update(key, "expiryHours", Number(event.target.value))} /></label>
            : <>
              <label className="space-y-1 text-xs text-[#bbb]">Calendar days<input type="number" min="1" max="3650" className={inputClass} value={config.calendarDays} onChange={(event) => update(key, "calendarDays", Number(event.target.value))} /></label>
              <label className="space-y-1 text-xs text-[#bbb]">Expiry time<input type="time" className={inputClass} value={config.expiryTime} onChange={(event) => update(key, "expiryTime", event.target.value)} /></label>
            </>}
          {(key === "friday" || key === "birthday") && <>
            <label className="space-y-1 text-xs text-[#bbb]">Timezone<input className={inputClass} value={config.timezone} onChange={(event) => update(key, "timezone", event.target.value)} /></label>
            <label className="space-y-1 text-xs text-[#bbb]">{key === "friday" ? "Friday generation time" : "Daily birthday processing time"}<input type="time" className={inputClass} value={key === "friday" ? config.generationTime : config.processingTime} onChange={(event) => update(key, key === "friday" ? "generationTime" : "processingTime", event.target.value)} /></label>
          </>}
          <fieldset className="space-y-1 text-xs text-[#bbb]">
            <legend>Eligible order channels</legend>
            {["Online", "POS"].map((channel) => (
              <label className="mr-3 inline-flex items-center gap-1" key={channel}>
                <input
                  type="checkbox"
                  checked={(config.eligibleChannels || []).includes(channel)}
                  onChange={(event) => update(key, "eligibleChannels", event.target.checked
                    ? [...new Set([...(config.eligibleChannels || []), channel])]
                    : (config.eligibleChannels || []).filter((value) => value !== channel))}
                />
                {channel}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={Boolean(config.sendEmail)} onChange={(event) => update(key, "sendEmail", event.target.checked)} /> Send email (with recorded marketing consent)</label>
          <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={Boolean(config.sendWhatsApp)} onChange={(event) => update(key, "sendWhatsApp", event.target.checked)} /> Send WhatsApp (approved Cloud API and consent required)</label>
        </div>
      </fieldset>
    );
  };
  const titles = { welcome: "Welcome offers", friday: "Friday campaigns", birthday: "Birthday coupons", manual: "Manual campaigns" };
  return <div className="space-y-4">{groups.map((key) => renderPromotion(key, titles[key]))}</div>;
};

const CouponsCustomerMarketing = () => {
  const queryClient = useQueryClient();
  const [section, setSection] = useState(sections[0]);
  const [settingsDraft, setSettingsDraft] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedExecutionId, setSelectedExecutionId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [sendNow, setSendNow] = useState(false);
  const campaignRequestKey = useRef(null);
  const settingsQuery = useQuery({ queryKey: ["promotion-settings"], queryFn: getPromotionSettings });
  const customersQuery = useQuery({
    queryKey: ["promotion-customers", search, page],
    queryFn: () => getPromotionCustomers({ search, page, limit: 25 }),
    enabled: section === "Customer Database",
    placeholderData: (previous) => previous,
  });
  const queueDeliveryMutation = useMutation({
    mutationFn: queuePromotionIssueDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotion-execution-issues", selectedExecutionId] });
      enqueueSnackbar("Delivery queued.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const executionsQuery = useQuery({
    queryKey: ["promotion-executions"],
    queryFn: () => getPromotionExecutions({ page: 1, limit: 50 }),
    enabled: ["Coupon Dashboard", "Coupon History", "Email & WhatsApp Delivery Logs", "Friday Campaign", "Birthday Coupons", "Manual Coupon Campaigns"].includes(section),
    refetchInterval: section === "Email & WhatsApp Delivery Logs" ? 5000 : false,
  });
  const issuesQuery = useQuery({
    queryKey: ["promotion-execution-issues", selectedExecutionId],
    queryFn: () => getPromotionExecutionIssues({ executionId: selectedExecutionId, page: 1, limit: 100 }),
    enabled: Boolean(selectedExecutionId),
    refetchInterval: section === "Email & WhatsApp Delivery Logs" ? 5000 : false,
  });
  const customerHistoryQuery = useQuery({
    queryKey: ["promotion-customer-history", selectedCustomerId],
    queryFn: () => getCouponAssignments({ customerId: selectedCustomerId, page: 1, limit: 100 }),
    enabled: Boolean(selectedCustomerId),
  });
  useEffect(() => {
    const data = settingsQuery.data?.data?.data;
    if (data) setSettingsDraft(data);
  }, [settingsQuery.data]);
  const customers = customersQuery.data?.data?.data || [];
  const executions = executionsQuery.data?.data?.data || [];
  const issues = issuesQuery.data?.data?.data || [];
  const selectedExecution = executions.find((execution) => execution._id === selectedExecutionId);
  const saveMutation = useMutation({
    mutationFn: updatePromotionSettings,
    onSuccess: (response) => {
      setSettingsDraft(response.data?.data || settingsDraft);
      queryClient.invalidateQueries({ queryKey: ["promotion-settings"] });
      enqueueSnackbar("Coupon marketing settings saved.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const runMutation = useMutation({
    mutationFn: runPromotionCampaign,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["promotion-executions"] });
      queryClient.invalidateQueries({ queryKey: ["promotion-customers"] });
      const executionId = response.data?.data?.execution?._id || "";
      setSelectedExecutionId(executionId);
      campaignRequestKey.current = null;
      if (executionId) queryClient.invalidateQueries({ queryKey: ["promotion-execution-issues", executionId] });
      enqueueSnackbar(response.data?.message || "Campaign complete.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const revokeMutation = useMutation({
    mutationFn: revokePromotionCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotion-customers"] });
      queryClient.invalidateQueries({ queryKey: ["promotion-customer-history"] });
      enqueueSnackbar("Unused coupon revoked.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const retryMutation = useMutation({
    mutationFn: retryPromotionIssueDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotion-execution-issues", selectedExecutionId] });
      enqueueSnackbar("Delivery retry queued.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const assignments = customerHistoryQuery.data?.data?.data || [];
  const activeIssueCount = useMemo(() => executions.reduce((sum, execution) => sum + Number(execution.counts?.generated || 0), 0), [executions]);

  const executeCampaign = async (kind) => {
    try {
      const previewResponse = await getPromotionPreview(kind, selectedCustomerIds);
      const preview = previewResponse.data?.data;
      const config = settingsDraft?.[kind === "manual" ? "manual" : kind] || {};
      const discount = config.discountMode === "range"
        ? `${config.rangeMin}%–${config.rangeMax}%`
        : config.discountMode === "fixed"
          ? `${config.fixedPercentage}%`
          : (config.percentages || []).map((value) => `${value}%`).join(", ");
      const sends = sendNow
        ? `\nEmail candidates: ${preview.emailEligible}; WhatsApp candidates: ${preview.whatsappEligible}. Delivery is still gated by settings, consent, and provider readiness.`
        : "\nCoupons will be generated without sending messages.";
      if (!window.confirm(`Run ${kind} coupon campaign now?\nDiscount configuration: ${discount || "not configured"}\nEligible customers: ${preview.eligible}${sends}`)) return;
      campaignRequestKey.current ||= createRequestKey();
      runMutation.mutate({
        kind,
        requestKey: campaignRequestKey.current,
        sendNow,
        ...(selectedCustomerIds.length ? { customerIds: selectedCustomerIds } : {}),
      });
    } catch (error) {
      enqueueSnackbar(errorMessage(error), { variant: "error" });
    }
  };
  const deliveryActions = (row) => {
    const customer = row.customerId;
    const canEmail = customer?.marketingConsent && customer.email && ["not_requested", "skipped"].includes(row.emailStatus);
    const canWhatsApp = customer?.marketingConsent && customer.phone && ["not_requested", "skipped"].includes(row.whatsappStatus);
    return <>
      {canEmail && <button type="button" disabled={queueDeliveryMutation.isPending} className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => { if (window.confirm("Queue this coupon email? The customer has recorded promotional consent.")) queueDeliveryMutation.mutate({ issueId: row._id, channel: "email" }); }}>Send email</button>}
      {canWhatsApp && <button type="button" disabled={queueDeliveryMutation.isPending} className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => { if (window.confirm("Queue this WhatsApp coupon message? The customer has recorded promotional consent.")) queueDeliveryMutation.mutate({ issueId: row._id, channel: "whatsapp" }); }}>Send WhatsApp</button>}
      {row.emailStatus === "failed" && <button type="button" disabled={retryMutation.isPending} className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => { if (window.confirm("Retry this failed email? The previous send outcome may be uncertain.")) retryMutation.mutate({ issueId: row._id, channel: "email" }); }}>Retry email</button>}
      {row.whatsappStatus === "failed" && <button type="button" disabled={retryMutation.isPending} className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => { if (window.confirm("Retry this failed WhatsApp message? The previous send outcome may be uncertain.")) retryMutation.mutate({ issueId: row._id, channel: "whatsapp" }); }}>Retry WhatsApp</button>}
    </>;
  };
  const generatedIssuesTable = () => (
    <section className="space-y-3 rounded-lg border border-[#383838] bg-[#242424] p-4">
      <h3 className="font-semibold text-white">Generated coupons</h3>
      {!selectedExecutionId && <p className="text-sm text-[#aaa]">Run a campaign to view its issued coupons here.</p>}
      {selectedExecutionId && issues.length === 0 && <p className="text-sm text-[#aaa]">No coupon assignments were recorded for this execution.</p>}
      {issues.length > 0 && <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm text-white">
          <thead className="bg-[#292929] text-xs text-[#bbb]"><tr><th className="p-3">Customer</th><th>Coupon code</th><th>Discount</th><th>Expiry</th><th>Email</th><th>WhatsApp</th><th>Actions</th></tr></thead>
          <tbody>{issues.map((row) => <tr key={row._id} className="border-t border-[#383838]">
            <td className="p-3">{row.customerId?.name || "—"}</td>
            <td className="font-mono">{row.couponCode}<button type="button" className="ml-2 rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => copyCode(row.couponCode)}>Copy</button></td>
            <td>{row.discountPercentage}%</td><td>{row.expiresAt ? new Date(row.expiresAt).toLocaleString() : "No expiry"}</td>
            <td className="capitalize">{emailStatus(row)}</td><td className="capitalize">{whatsappStatus(row)}</td><td className="space-x-1">{deliveryActions(row)}</td>
          </tr>)}</tbody>
        </table>
      </div>}
    </section>
  );
  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      enqueueSnackbar("Coupon code copied.", { variant: "success" });
    } catch {
      window.prompt("Copy coupon code:", code);
    }
  };
  const executionTable = (items) => (
    <div className="overflow-x-auto rounded border border-[#383838]">
      <table className="w-full min-w-[760px] text-left text-sm text-white">
        <thead className="bg-[#292929] text-xs text-[#bbb]"><tr><th className="p-3">Type</th><th>Trigger</th><th>Status</th><th>Started</th><th>Eligible</th><th>Generated</th><th>Skipped / failed</th></tr></thead>
        <tbody>{items.map((row) => <tr key={row._id} className="border-t border-[#383838]">
          <td className="p-3 capitalize">{row.kind}</td><td className="capitalize">{row.trigger}</td><td className="capitalize">{row.status}</td>
          <td>{row.startedAt ? new Date(row.startedAt).toLocaleString() : "—"}</td><td>{row.counts?.eligible ?? 0}</td><td>{row.counts?.generated ?? 0}</td>
          <td>{Number(row.counts?.skipped || 0) + Number(row.counts?.failed || 0)}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
  const campaignControls = (kind, title) => (
    <section className="space-y-4 rounded-lg border border-[#383838] bg-[#242424] p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-sm text-[#bbb]">
        Current configuration: {settingsDraft?.[kind]?.discountMode || "list"} · {settingsDraft?.[kind]?.discountMode === "range"
          ? `${settingsDraft?.[kind]?.rangeMin}% to ${settingsDraft?.[kind]?.rangeMax}%`
          : settingsDraft?.[kind]?.discountMode === "fixed"
            ? `${settingsDraft?.[kind]?.fixedPercentage}%`
            : `${(settingsDraft?.[kind]?.percentages || []).join(", ")}%`}
        · Minimum {amount(settingsDraft?.[kind]?.minimumSubtotal)} · Expiry {settingsDraft?.[kind]?.expiryMode === "duration"
          ? `${settingsDraft?.[kind]?.expiryHours} hours`
          : `${settingsDraft?.[kind]?.calendarDays} calendar days`}
      </p>
      {(kind === "friday" || kind === "birthday") && (
        <p className="text-sm text-[#bbb]">Automatic generation: {settingsDraft?.[kind]?.automaticGeneration ? "Enabled" : "Disabled"} · {settingsDraft?.[kind]?.timezone} at {kind === "friday" ? settingsDraft?.friday?.generationTime : settingsDraft?.birthday?.processingTime}</p>
      )}
      <label className="flex items-center gap-2 text-sm text-[#ddd]"><input type="checkbox" checked={sendNow} onChange={(event) => setSendNow(event.target.checked)} />Queue configured email/WhatsApp messages after generation</label>
      <button type="button" disabled={runMutation.isPending || (kind !== "manual" && !settingsDraft?.[kind]?.enabled)} className="rounded bg-amber-400 px-4 py-2 font-semibold text-black disabled:opacity-50" onClick={() => executeCampaign(kind)}>
        {runMutation.isPending ? "Generating…" : kind === "friday" ? "Generate Friday Coupons Now" : kind === "birthday" ? "Run Birthday Check Now" : "Generate Manual Coupons"}
      </button>
      {kind !== "manual" && !settingsDraft?.[kind]?.enabled && <p className="text-xs text-amber-200">Enable this coupon type in Coupon Settings before manual generation.</p>}
    </section>
  );

  return (
    <div className="mx-auto w-full space-y-5 px-4 pb-10 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white">Coupons &amp; Customer Marketing</h1><p className="mt-1 text-sm text-[#aaa]">Manage coupon rules, customer assignments, scheduled campaigns, and delivery records.</p></div>
        <span className="rounded border border-[#444] px-3 py-2 text-xs text-[#bbb]">Marketing messages require recorded consent</span>
      </header>
      <nav className="flex flex-wrap gap-2" aria-label="Coupon marketing modules">
        {sections.map((item) => <button key={item} type="button" className={`rounded px-3 py-2 text-sm ${section === item ? "bg-amber-400 font-semibold text-black" : "bg-[#303030] text-white hover:bg-[#3c3c3c]"}`} onClick={() => setSection(item)}>{item}</button>)}
      </nav>

      {section === "Coupon Dashboard" && (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Promotion executions</p><b className="text-2xl text-white">{executions.length}</b></div>
            <div className="rounded bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Coupons generated in recent executions</p><b className="text-2xl text-white">{activeIssueCount}</b></div>
            <div className="rounded bg-[#262626] p-4"><p className="text-sm text-[#aaa]">Upcoming automatic Friday run</p><b className="text-lg text-white">{settingsDraft?.friday?.automaticGeneration ? `Friday ${settingsDraft.friday.generationTime} (${settingsDraft.friday.timezone})` : "Disabled"}</b></div>
          </div>
          <CouponsManager showWelcomeOfferSettings={false} />
          <h2 className="text-lg font-semibold text-white">Recent campaign executions</h2>{executionTable(executions.slice(0, 10))}
        </div>
      )}

      {section === "Customer Database" && (
        <section className="space-y-4 rounded-lg bg-[#242424] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input className="w-full max-w-md rounded border border-[#444] bg-[#191919] px-3 py-2 text-white" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search customer name, email, or phone" />
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#aaa]">
              <span>{selectedCustomerIds.length} selected for campaign generation</span>
              <button type="button" className="rounded bg-[#383838] px-2 py-1" onClick={() => setSelectedCustomerIds([...new Set([...selectedCustomerIds, ...customers.map((customer) => customer._id)])])}>Select this page</button>
              <button type="button" className="rounded bg-[#383838] px-2 py-1" onClick={() => setSelectedCustomerIds([])}>Clear selection</button>
            </div>
          </div>
          <div className="overflow-x-auto rounded border border-[#383838]">
            <table className="w-full min-w-[1100px] text-left text-sm text-white">
              <thead className="bg-[#292929] text-xs text-[#bbb]"><tr><th className="p-3">Select</th><th>Customer</th><th>Email</th><th>Mobile</th><th>Date of birth</th><th>Latest coupon</th><th>Discount</th><th>Type / status</th><th>Expiry</th><th>Consent</th><th>Actions</th></tr></thead>
              <tbody>{customers.map((customer) => {
                const latest = customer.latestCoupon;
                return <tr key={customer._id} className="border-t border-[#383838]">
                  <td className="p-3"><input aria-label={`Select ${customer.name}`} type="checkbox" checked={selectedCustomerIds.includes(customer._id)} onChange={(event) => setSelectedCustomerIds((current) => event.target.checked ? [...new Set([...current, customer._id])] : current.filter((id) => id !== customer._id))} /></td>
                  <td>{customer.name}</td><td>{customer.email || "—"}</td><td>{customer.phone}</td><td>{customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : "—"}</td>
                  <td className="font-mono">{latest?.code || "—"}</td><td>{latest?.couponId?.discountType === "percentage" ? `${latest.couponId.discountValue}%` : latest?.couponId ? amount(latest.couponId.discountValue) : "—"}</td>
                  <td className="capitalize">{latest ? `${latest.source} · ${latest.status}` : "—"}</td><td>{latest?.expiresAt ? new Date(latest.expiresAt).toLocaleString() : "—"}</td>
                  <td>{customer.marketingConsent ? "Opted in" : "No consent"}</td>
                  <td className="space-x-1">
                    {latest?.code && <button type="button" className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => copyCode(latest.code)}>Copy code</button>}
                    <button type="button" className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => setSelectedCustomerId(customer._id)}>History</button>
                    {latest?.status === "active" && latest.redemptionCount === 0 && <button type="button" className="rounded bg-red-900 px-2 py-1 text-xs" onClick={() => revokeMutation.mutate(latest._id)}>Revoke</button>}
                  </td>
                </tr>;
              })}</tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-3 text-sm text-[#bbb]">
            <button type="button" disabled={page <= 1} className="rounded bg-[#383838] px-3 py-1 disabled:opacity-40" onClick={() => setPage((value) => value - 1)}>Previous</button>
            <span>Page {page} of {customersQuery.data?.data?.pagination?.pages || 1}</span>
            <button type="button" disabled={page >= (customersQuery.data?.data?.pagination?.pages || 1)} className="rounded bg-[#383838] px-3 py-1 disabled:opacity-40" onClick={() => setPage((value) => value + 1)}>Next</button>
          </div>
        </section>
      )}

      {section === "Welcome Coupons" && (
        <div className="space-y-4"><section className="rounded-lg bg-[#242424] p-5 text-sm text-[#bbb]">Welcome coupons are available to eligible customers signed in to a verified customer account. Customers can check their offer in the storefront checkout.</section>{settingsDraft && <CouponSettingsEditor settings={settingsDraft} groups={["welcome"]} onChange={setSettingsDraft} />}<button type="button" disabled={saveMutation.isPending || !settingsDraft} className="rounded bg-amber-400 px-4 py-2 font-semibold text-black disabled:opacity-50" onClick={() => saveMutation.mutate(settingsDraft)}>Save welcome settings</button></div>
      )}
      {section === "Friday Campaign" && <div className="space-y-4">{campaignControls("friday", "Friday Coupon Campaign")}{generatedIssuesTable()}</div>}
      {section === "Birthday Coupons" && <div className="space-y-4">{campaignControls("birthday", "Birthday Coupon Campaign")}{generatedIssuesTable()}<p className="text-xs text-[#aaa]">February 29 birthdays are issued on February 28 in non-leap years. Birthday remains optional in the customer account.</p></div>}
      {section === "Manual Coupon Campaigns" && <div className="space-y-4">{campaignControls("manual", "Manual Coupon Campaign")}{generatedIssuesTable()}<p className="text-xs text-[#aaa]">Manual runs are separately recorded and can be generated without sending messages.</p></div>}
      {section === "Coupon History" && <div className="space-y-4"><h2 className="text-xl font-semibold text-white">Campaign history</h2>{executionTable(executions)}</div>}
      {section === "Email & WhatsApp Delivery Logs" && (
        <div className="space-y-4">
          <label className="block max-w-lg space-y-1 text-sm text-[#bbb]">Campaign execution<select className="w-full rounded border border-[#444] bg-[#191919] px-3 py-2 text-white" value={selectedExecutionId} onChange={(event) => setSelectedExecutionId(event.target.value)}><option value="">Choose execution</option>{executions.map((execution) => <option key={execution._id} value={execution._id}>{execution.kind} · {new Date(execution.startedAt).toLocaleString()} · {execution.status}</option>)}</select></label>
          {selectedExecution && <p className="text-sm text-[#aaa]">Email and WhatsApp logs show queued/sent/failed/skipped state. A `sent` state means the provider accepted the message; delivery is not asserted without webhook confirmation.</p>}
          <div className="overflow-x-auto rounded border border-[#383838]"><table className="w-full min-w-[1040px] text-left text-sm text-white"><thead className="bg-[#292929] text-xs text-[#bbb]"><tr><th className="p-3">Customer</th><th>Coupon</th><th>Email</th><th>Email message ID</th><th>WhatsApp</th><th>WhatsApp message ID</th><th>Retry</th></tr></thead><tbody>{issues.map((row) => <tr key={row._id} className="border-t border-[#383838]"><td className="p-3">{row.customerId?.name || "—"}<span className="block text-xs text-[#aaa]">{row.customerId?.email || ""}</span></td><td className="font-mono">{row.couponCode}</td><td className="capitalize" title={row.emailError || ""}>{emailStatus(row)}</td><td className="font-mono text-xs">{row.emailMessageId || "—"}</td><td className="capitalize" title={row.whatsappError || ""}>{whatsappStatus(row)}</td><td className="font-mono text-xs">{row.whatsappMessageId || "—"}</td><td className="space-x-1">{row.emailStatus === "failed" && <button type="button" disabled={retryMutation.isPending} className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => { if (window.confirm("Retry this failed email? The previous send outcome may be uncertain.")) retryMutation.mutate({ issueId: row._id, channel: "email" }); }}>Email</button>}{row.whatsappStatus === "failed" && <button type="button" disabled={retryMutation.isPending} className="rounded bg-[#383838] px-2 py-1 text-xs" onClick={() => { if (window.confirm("Retry this failed WhatsApp message? The previous send outcome may be uncertain.")) retryMutation.mutate({ issueId: row._id, channel: "whatsapp" }); }}>WhatsApp</button>}</td></tr>)}</tbody></table></div>
        </div>
      )}
      {section === "Coupon Settings" && settingsDraft && (
        <div className="space-y-4"><CouponSettingsEditor settings={settingsDraft} onChange={setSettingsDraft} /><button type="button" disabled={saveMutation.isPending} className="rounded bg-amber-400 px-4 py-2 font-semibold text-black" onClick={() => saveMutation.mutate(settingsDraft)}>{saveMutation.isPending ? "Saving…" : "Save all coupon settings"}</button></div>
      )}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4" onClick={() => setSelectedCustomerId("")}>
          <section className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-lg border border-[#444] bg-[#202020] p-5" role="dialog" aria-modal="true" aria-label="Customer coupon history" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex justify-between"><h2 className="text-lg font-semibold text-white">Customer coupon history</h2><button type="button" className="text-white" onClick={() => setSelectedCustomerId("")}>Close</button></div>
            {assignments.map((assignment) => <div key={assignment._id} className="flex flex-wrap justify-between gap-2 border-t border-[#383838] py-2 text-sm text-white"><span>{assignment.couponId?.name || assignment.source} · <code>{assignment.code}</code></span><span>{assignment.status} · {assignment.redemptionCount}/{assignment.redemptionLimit} uses · {assignment.expiresAt ? new Date(assignment.expiresAt).toLocaleString() : "No expiry"}</span></div>)}
          </section>
        </div>
      )}
    </div>
  );
};

export default CouponsCustomerMarketing;
