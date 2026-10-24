import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaWhatsapp, FaSearch, FaPause, FaPlay, FaTimes, FaRedo, FaDownload } from "react-icons/fa";
import {
  cancelWhatsAppCampaign,
  createCampaignWhatsAppContact,
  createWhatsAppCampaign,
  generateWhatsAppCampaignTokens,
  getCampaignWhatsAppCustomers,
  getCampaignWhatsAppProvider,
  getWhatsAppCampaign,
  getWhatsAppCampaignRecipients,
  getWhatsAppCampaigns,
  launchWhatsAppCampaign,
  pauseWhatsAppCampaign,
  previewWhatsAppCampaign,
  retryWhatsAppCampaignFailures,
  scanWhatsAppCampaign,
  sendWhatsAppCampaignTest,
  updateCampaignWhatsAppContact,
} from "../../https";

const inputClass = "w-full rounded border border-[#444] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-[#888]";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";
const currency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;

const localDateTime = (daysAhead = 7, timeZone = "Asia/Karachi") => {
  const date = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type)?.value || "00";
  return `${part("year")}-${part("month")}-${part("day")}T23:59`;
};

const zonedDateTimeToIso = (value, timeZone) => {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
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

const makeRequestKey = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (!globalThis.crypto?.getRandomValues) throw new Error("Secure random generation is unavailable in this browser.");
  return Array.from(globalThis.crypto.getRandomValues(new Uint8Array(24)), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const initialForm = () => ({
  name: "",
  campaignType: "customer appreciation",
  discountOptions: [5, 7, 8, 10],
  discountWeights: { 5: 1, 7: 1, 8: 1, 10: 1 },
  minimumOrderAmount: 1000,
  maximumDiscount: "",
  maxUsesPerCoupon: 1,
  expiresAt: localDateTime(),
  timezone: "Asia/Karachi",
  scheduledAt: "",
});

const customerRows = (response) => response?.data?.data || [];
const campaignRows = (response) => response?.data?.data || [];
const campaignData = (response) => response?.data?.data || null;
const errorMessage = (error) => error?.response?.data?.message || error?.message || "Request failed.";

const Status = ({ value }) => {
  const colors = {
    delivered: "text-emerald-300",
    sent: "text-sky-300",
    queued: "text-amber-300",
    sending: "text-amber-200",
    failed: "text-red-300",
    skipped: "text-[#aaa]",
    running: "text-emerald-300",
    completed: "text-emerald-300",
    scheduled: "text-sky-300",
    paused: "text-amber-300",
    cancelled: "text-[#aaa]",
    draft: "text-[#aaa]",
  };
  return <span className={`capitalize ${colors[value] || "text-white"}`}>{value || "—"}</span>;
};

const WhatsAppCampaignManager = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("create");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectionMode, setSelectionMode] = useState("all-eligible");
  const [selectedIds, setSelectedIds] = useState([]);
  const [excludedIds, setExcludedIds] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [requestKey, setRequestKey] = useState(() => makeRequestKey());
  const requestSignatureRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [tokenResult, setTokenResult] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [createdCampaignId, setCreatedCampaignId] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [recipientStatus, setRecipientStatus] = useState("all");
  const [tablePage, setTablePage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [contactEditorOpen, setContactEditorOpen] = useState(false);
  const [contactDraft, setContactDraft] = useState({ customerId: "", name: "", phone: "", marketingConsent: false });

  const providerQuery = useQuery({
    queryKey: ["wa-campaign-provider"],
    queryFn: getCampaignWhatsAppProvider,
    enabled: isOpen,
    staleTime: 30000,
  });
  const customersQuery = useQuery({
    queryKey: ["wa-campaign-customers", search, statusFilter, page],
    queryFn: () => getCampaignWhatsAppCustomers({ search, status: statusFilter, page, limit: 50 }),
    enabled: isOpen && view === "create",
    placeholderData: (previous) => previous,
  });
  const campaignsQuery = useQuery({
    queryKey: ["wa-campaigns"],
    queryFn: () => getWhatsAppCampaigns({ page: 1, limit: 50 }),
    enabled: isOpen && view === "results",
    refetchInterval: isOpen && view === "results" ? 4000 : false,
  });
  const campaignQuery = useQuery({
    queryKey: ["wa-campaign", selectedCampaignId],
    queryFn: () => getWhatsAppCampaign(selectedCampaignId),
    enabled: isOpen && view === "results" && Boolean(selectedCampaignId),
    refetchInterval: isOpen && view === "results" && Boolean(selectedCampaignId) ? 4000 : false,
  });
  const recipientsQuery = useQuery({
    queryKey: ["wa-campaign-recipients", selectedCampaignId, recipientStatus, tablePage],
    queryFn: () => getWhatsAppCampaignRecipients({ campaignId: selectedCampaignId, status: recipientStatus === "all" ? undefined : recipientStatus, page: tablePage, limit: 50 }),
    enabled: isOpen && view === "results" && Boolean(selectedCampaignId),
    refetchInterval: isOpen && view === "results" && Boolean(selectedCampaignId) ? 4000 : false,
  });

  const rows = customerRows(customersQuery.data);
  const customerSummary = customersQuery.data?.summary || { matching: 0, eligible: 0, skipped: 0 };
  const customerPagination = customersQuery.data?.pagination;
  const campaigns = campaignRows(campaignsQuery.data);
  const selectedCampaign = campaignData(campaignQuery.data);
  const recipients = customerRows(recipientsQuery.data);
  const recipientsPagination = recipientsQuery.data?.pagination;
  const providerStatus = providerQuery.data?.data?.data || providerQuery.data?.data;
  const selectedCountLabel = selectionMode === "all-eligible"
    ? "all eligible customers"
    : selectionMode === "filtered" ? "all matching records" : selectedIds.length.toLocaleString();

  const selection = useMemo(() => ["all-eligible", "filtered"].includes(selectionMode)
    ? { mode: selectionMode, status: statusFilter, search: search.trim(), excludedCustomerIds: excludedIds }
    : { mode: "selected", customerIds: selectedIds },
  [selectionMode, statusFilter, search, excludedIds, selectedIds]);

  useEffect(() => {
    setPreview(null);
  }, [form, selection]);

  useEffect(() => {
    const signature = JSON.stringify({ form, selection });
    if (requestSignatureRef.current !== null && requestSignatureRef.current !== signature) {
      setRequestKey(makeRequestKey());
      setCreatedCampaignId("");
      setTokenResult(null);
    }
    requestSignatureRef.current = signature;
  }, [form, selection]);

  const requestPayload = () => ({
    name: form.name.trim() || "Customer Appreciation",
    campaignType: form.campaignType,
    discountOptions: form.discountOptions,
    discountWeights: form.discountWeights,
    minimumOrderAmount: Number(form.minimumOrderAmount),
    maximumDiscount: form.maximumDiscount === "" ? null : Number(form.maximumDiscount),
    maxUsesPerCoupon: Number(form.maxUsesPerCoupon),
    expiresAt: zonedDateTimeToIso(form.expiresAt, form.timezone),
    scheduledAt: zonedDateTimeToIso(form.scheduledAt, form.timezone),
    timezone: form.timezone,
    selection,
  });

  const refreshCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ["wa-campaigns"] });
    queryClient.invalidateQueries({ queryKey: ["wa-campaign", selectedCampaignId] });
    queryClient.invalidateQueries({ queryKey: ["wa-campaign-recipients", selectedCampaignId] });
  };

  const previewMutation = useMutation({
    mutationFn: previewWhatsAppCampaign,
    onSuccess: (response) => {
      setPreview(response.data?.data || null);
      setFeedback("");
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const testMutation = useMutation({
    mutationFn: sendWhatsAppCampaignTest,
    onSuccess: () => enqueueSnackbar("Test message submitted to the configured test number.", { variant: "success" }),
    onError: (error) => enqueueSnackbar(errorMessage(error), { variant: "error" }),
  });
  const createMutation = useMutation({
    mutationFn: createWhatsAppCampaign,
    onSuccess: (response) => {
      const campaign = response.data?.data?.campaign;
      if (campaign?._id) {
        setCreatedCampaignId(campaign._id);
        setSelectedCampaignId(campaign._id);
        setTokenResult(null);
        setRequestKey(makeRequestKey());
      }
      setFeedback("");
      refreshCampaigns();
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const tokenMutation = useMutation({
    mutationFn: generateWhatsAppCampaignTokens,
    onSuccess: (response) => {
      setTokenResult(response.data?.data?.counts || null);
      enqueueSnackbar("Campaign coupon tokens generated and saved.", { variant: "success" });
      refreshCampaigns();
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const scanMutation = useMutation({
    mutationFn: scanWhatsAppCampaign,
    onSuccess: (response) => {
      setScanResult(response.data?.data || null);
      refreshCampaigns();
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const contactMutation = useMutation({
    mutationFn: (draft) => {
      const { customerId, ...data } = draft;
      return customerId
        ? updateCampaignWhatsAppContact({ customerId, ...data, consentConfirmed: data.marketingConsent })
        : createCampaignWhatsAppContact({ ...data, consentConfirmed: data.marketingConsent });
    },
    onSuccess: (response) => {
      const existing = response.data?.existing;
      setContactEditorOpen(false);
      setContactDraft({ customerId: "", name: "", phone: "", marketingConsent: false });
      setFeedback("");
      queryClient.invalidateQueries({ queryKey: ["wa-campaign-customers"] });
      enqueueSnackbar(existing ? "This mobile number is already in the customer contacts." : "Customer contact saved.", {
        variant: existing ? "info" : "success",
      });
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const autoAssignMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...requestPayload(),
        name: form.name.trim() || "Customer Appreciation",
        selection: { mode: "all-eligible", status: "active", search: "", excludedCustomerIds: [] },
      };
      const previewResponse = await previewWhatsAppCampaign(payload);
      const previewData = previewResponse.data?.data;
      const eligibleForAssignment = Number(previewData?.counts?.assignmentEligible || 0);
      if (!eligibleForAssignment) throw new Error("No active customers with qualifying orders and valid mobile numbers were found.");
      if (!window.confirm(`Generate and assign unique coupons to ${eligibleForAssignment} active customers with qualifying orders? ${Number(previewData.counts.eligible || 0)} customers can also receive WhatsApp marketing. No messages will be sent.`)) {
        return { cancelled: true };
      }
      const draftResponse = await createWhatsAppCampaign({ ...payload, requestKey });
      const campaignId = draftResponse.data?.data?.campaign?._id;
      if (!campaignId) throw new Error("Could not save the campaign draft.");
      const tokenResponse = await generateWhatsAppCampaignTokens(campaignId);
      return { campaignId, counts: tokenResponse.data?.data?.counts, preview: previewData };
    },
    onSuccess: (result) => {
      if (result.cancelled) return;
      setPreview(result.preview);
      setTokenResult(result.counts);
      setCreatedCampaignId(result.campaignId);
      setSelectedCampaignId(result.campaignId);
      setRequestKey(makeRequestKey());
      setFeedback("");
      enqueueSnackbar(`${result.counts?.created || 0} coupon tokens assigned. No messages were sent.`, { variant: "success" });
      refreshCampaigns();
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });
  const launchMutation = useMutation({
    mutationFn: launchWhatsAppCampaign,
    onSuccess: (response) => {
      const campaign = response.data?.data?.campaign;
      enqueueSnackbar(campaign?.status === "scheduled" ? "Campaign scheduled." : "Campaign queued for sending.", { variant: "success" });
      setCreatedCampaignId("");
      setView("results");
      setSelectedCampaignId(campaign?._id || selectedCampaignId);
      refreshCampaigns();
    },
    onError: (error) => {
      const currentCount = error?.response?.data?.data?.eligibleCount;
      const currentSkipped = error?.response?.data?.data?.skippedCount;
      if (Number.isInteger(currentCount)) {
        setTokenResult((current) => ({ ...current, eligible: currentCount, failedValidation: Number.isInteger(currentSkipped) ? currentSkipped : current?.failedValidation }));
        setPreview((current) => ({
          ...current,
          counts: {
            ...current?.counts,
            eligible: currentCount,
            skipped: Number.isInteger(currentSkipped) ? currentSkipped : current?.counts?.skipped,
            estimatedMessages: currentCount,
          },
        }));
      }
      setFeedback(errorMessage(error));
      refreshCampaigns();
    },
  });
  const actionMutation = useMutation({
    mutationFn: ({ action, campaignId, confirmedEligibleCount, reason }) => {
      if (action === "pause") return pauseWhatsAppCampaign(campaignId);
      if (action === "resume") return launchWhatsAppCampaign({ campaignId, confirmedEligibleCount });
      if (action === "cancel") return cancelWhatsAppCampaign(campaignId);
      return retryWhatsAppCampaignFailures({ campaignId, reason });
    },
    onSuccess: () => {
      setFeedback("");
      refreshCampaigns();
    },
    onError: (error) => setFeedback(errorMessage(error)),
  });

  const updateDiscountOption = (index, rawValue) => setForm((current) => {
    const previous = current.discountOptions[index];
    const value = rawValue === "" ? "" : Number(rawValue);
    if (value !== "" && current.discountOptions.some((option, optionIndex) => optionIndex !== index && Number(option) === value)) {
      return current;
    }

    const discountOptions = [...current.discountOptions];
    discountOptions[index] = value;
    const discountWeights = { ...current.discountWeights };
    if (typeof previous === "number" && !discountOptions.some((option) => Number(option) === previous)) {
      delete discountWeights[previous];
    }
    if (Number.isInteger(value) && value >= 1 && discountWeights[value] === undefined) {
      discountWeights[value] = 1;
    }
    return { ...current, discountOptions, discountWeights };
  });

  const addDiscountOption = () => setForm((current) => {
    if (current.discountOptions.length >= 20) return current;
    let value = 1;
    while (current.discountOptions.some((option) => Number(option) === value) && value <= 100) value += 1;
    if (value > 100) return current;
    return {
      ...current,
      discountOptions: [...current.discountOptions, value],
      discountWeights: { ...current.discountWeights, [value]: 1 },
    };
  });

  const removeDiscountOption = (index) => setForm((current) => {
    if (current.discountOptions.length <= 1) return current;
    const removed = current.discountOptions[index];
    const discountOptions = current.discountOptions.filter((_, optionIndex) => optionIndex !== index);
    const discountWeights = { ...current.discountWeights };
    if (!discountOptions.some((option) => Number(option) === Number(removed))) delete discountWeights[removed];
    return { ...current, discountOptions, discountWeights };
  });

  const chooseAllEligible = () => {
    setSelectionMode("all-eligible");
    setStatusFilter("all");
    setSearch("");
    setExcludedIds([]);
    setSelectedIds([]);
    setPage(1);
    setPreview(null);
  };

  const chooseActiveEligible = () => {
    setSelectionMode("all-eligible");
    setStatusFilter("active");
    setSearch("");
    setExcludedIds([]);
    setSelectedIds([]);
    setPage(1);
    setPreview(null);
  };

  const chooseFiltered = () => {
    setSelectionMode("filtered");
    setExcludedIds([]);
    setSelectedIds([]);
    setPage(1);
    setPreview(null);
  };

  const deselectAll = () => {
    setSelectionMode("selected");
    setSelectedIds([]);
    setExcludedIds([]);
    setPreview(null);
  };

  const toggleCustomer = (customer) => {
    if (["all-eligible", "filtered"].includes(selectionMode)) {
      if (selectionMode === "all-eligible" && !customer.eligible) return;
      setExcludedIds((current) => current.includes(customer.id)
        ? current.filter((id) => id !== customer.id)
        : [...current, customer.id]);
    } else {
      setSelectedIds((current) => current.includes(customer.id)
        ? current.filter((id) => id !== customer.id)
        : [...current, customer.id]);
    }
    setPreview(null);
  };

  const buildPreview = () => {
    try {
      previewMutation.mutate(requestPayload());
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const generateAutoCoupons = () => {
    if (createdCampaignId) {
      tokenMutation.mutate(createdCampaignId);
      return;
    }
    autoAssignMutation.mutate();
  };

  const saveContact = (event) => {
    event.preventDefault();
    contactMutation.mutate(contactDraft);
  };

  const createDraft = () => {
    if (!preview) {
      setFeedback("Preview recipients before creating the campaign.");
      return;
    }
    try {
      createMutation.mutate({ ...requestPayload(), requestKey });
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const confirmLaunch = () => {
    const eligibleCount = Number(tokenResult?.eligible || 0);
    if (!createdCampaignId || !eligibleCount || tokenResult?.failedAssignment) return;
    const plannedStart = form.scheduledAt ? `Scheduled for ${form.scheduledAt} (${form.timezone})` : "Starts immediately";
    const summary = `${eligibleCount} messages will be queued. ${Number(tokenResult.failedValidation || 0)} customers will be excluded after revalidation. ${plannedStart}.`;
    if (!window.confirm(`Confirm WhatsApp campaign\n\n${form.name}\nDiscounts: ${form.discountOptions.join("%, ")}%\nMinimum order: ${currency(form.minimumOrderAmount)}\n${summary}\n\nContinue?`)) return;
    launchMutation.mutate({ campaignId: createdCampaignId, confirmedEligibleCount: eligibleCount });
  };

  const confirmSavedDraftLaunch = () => {
    const queuedCount = Number(stats?.queued || 0);
    if (!queuedCount || !selectedCampaign) return;
    if (!window.confirm(`Confirm WhatsApp campaign\n\n${selectedCampaign.name}\n${queuedCount} queued recipients will be rechecked for consent and valid numbers.\n\nStart or schedule this campaign now?`)) return;
    launchMutation.mutate({ campaignId: selectedCampaignId, confirmedEligibleCount: queuedCount });
  };

  const sendTest = () => {
    try {
      testMutation.mutate({
        ...requestPayload(),
        testName: "Admin test",
        selection: { mode: "all-eligible" },
      });
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const exportRecipients = () => {
    const header = ["Name", "Phone", "Status", "Skip reason", "Coupon", "Discount", "Provider message ID", "Last error"];
    const quoteCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [header, ...recipients.map((row) => [row.customerName, row.phone, row.status, row.skipReason, row.couponCode, row.discountPercentage, row.providerMessageId, row.lastError])]
      .map((line) => line.map(quoteCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `whatsapp-campaign-${selectedCampaignId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const providerConfig = providerStatus?.configured === true;
  const previewData = preview?.counts;
  const stats = selectedCampaign?.stats || campaigns.find((campaign) => campaign._id === selectedCampaignId)?.stats;
  const recipientStatusOptions = ["all", "pending", "failed", "delivered", "sent", "redeemed", "skipped"];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Automated Customer Coupons</h2>
          <p className="text-xs text-[#999]">Scan eligible customers, save campaign tokens, and track consent-based WhatsApp delivery.</p>
        </div>
        <button type="button" className={`${buttonClass} bg-[#25d366] px-4 py-2.5 text-[#11251a]`} onClick={() => setIsOpen(true)}>
          <FaWhatsapp /> Send Coupons
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-5" onClick={() => setIsOpen(false)}>
          <section className="flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#191919] shadow-2xl" role="dialog" aria-modal="true" aria-label="WhatsApp coupon campaigns" onClick={(event) => event.stopPropagation()}>
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#333] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-xl text-[#25d366]" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Send Coupons</h2>
                  <p className="text-xs text-[#999]">Approved WhatsApp template campaigns</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded border border-[#444] p-1">
                  <button type="button" className={`${buttonClass} ${view === "create" ? "bg-[#383838] text-white" : "text-[#aaa]"}`} onClick={() => setView("create")}>New campaign</button>
                  <button type="button" className={`${buttonClass} ${view === "results" ? "bg-[#383838] text-white" : "text-[#aaa]"}`} onClick={() => setView("results")}>Campaign results</button>
                </div>
                <button type="button" className="rounded p-2 text-xl text-[#aaa] hover:bg-[#333]" aria-label="Close" onClick={() => setIsOpen(false)}>×</button>
              </div>
            </header>

            {view === "create" && <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#333] bg-[#191919] px-4 py-3 sm:px-6">
              <p className="text-xs text-[#bbb]">Assign coupons to active customers with qualifying orders. Marketing consent is still required before any WhatsApp send.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={`${buttonClass} bg-[#353535] text-white`} onClick={buildPreview} disabled={previewMutation.isPending || autoAssignMutation.isPending}>{previewMutation.isPending ? "Scanning…" : "Scan Eligible Customers"}</button>
                <button type="button" className={`${buttonClass} bg-amber-400 px-4 text-[#1c1600]`} onClick={generateAutoCoupons} disabled={autoAssignMutation.isPending || tokenMutation.isPending}>{autoAssignMutation.isPending || tokenMutation.isPending ? "Generating & assigning…" : "Generate & Assign Auto Coupons"}</button>
              </div>
            </div>}

            <div className="overflow-y-auto p-4 sm:p-6">
              {feedback && <p className="mb-4 rounded border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">{feedback}</p>}

              {view === "create" ? (
                <div className="space-y-5">
                  <section className="grid grid-cols-2 gap-3 rounded border border-[#333] bg-[#202020] p-3 text-sm sm:grid-cols-4">
                    <span>Provider: <b className="capitalize text-white">{providerStatus?.provider || "checking"}</b></span>
                    <span>Configuration: <b className={providerConfig ? "text-emerald-300" : "text-amber-300"}>{providerConfig ? "Ready" : "Not ready"}</b></span>
                    <span>Template: <b className="text-white">{providerStatus?.templateName || "not configured"}</b></span>
                    <span>Test number: <b className="text-white">{providerStatus?.testNumberConfigured ? "configured" : "not configured"}</b></span>
                  </section>
                  {providerStatus?.provider === "cloud" && !providerConfig && (
                    <p className="text-sm text-amber-200">Bulk sending stays disabled until the approved template and Cloud API credentials are configured. No free-form production messages are sent.</p>
                  )}

                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
                    <section className="space-y-3 rounded border border-[#333] bg-[#202020] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white">Recipients</h3>
                          <p className="text-xs text-[#999]">Phone contacts are added from new POS/online orders and can also be entered here. Completed/closed orders are matched by the last 9 phone digits, regardless of format. Coupon assignment requires an active contact with a valid mobile and qualifying order; WhatsApp sending also requires explicit marketing consent.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className={`${buttonClass} bg-amber-400 text-[#1c1600]`} onClick={() => { setContactDraft({ customerId: "", name: "", phone: "", marketingConsent: false }); setContactEditorOpen(true); }}>Add customer phone</button>
                          <button type="button" className={`${buttonClass} bg-[#353535] text-white`} onClick={chooseActiveEligible}>Active &amp; opted-in customers</button>
                          <button type="button" className={`${buttonClass} bg-[#353535] text-white`} onClick={chooseAllEligible}>All eligible customers</button>
                          <button type="button" className={`${buttonClass} bg-[#353535] text-white`} onClick={chooseFiltered}>Select Filtered Customers</button>
                          <button type="button" className={`${buttonClass} bg-[#353535] text-white`} onClick={() => { setSelectionMode("selected"); setSelectedIds(rows.filter((customer) => customer.eligible).map((customer) => customer.id)); setExcludedIds([]); setPreview(null); }}>Select Current Page</button>
                          <button type="button" className={`${buttonClass} text-[#bbb] hover:bg-[#303030]`} onClick={deselectAll}>Deselect All</button>
                        </div>
                      </div>
                      {contactEditorOpen && (
                        <form className="space-y-3 rounded border border-[#444] bg-[#191919] p-3" onSubmit={saveContact}>
                          <h4 className="font-semibold text-white">{contactDraft.customerId ? "Edit customer contact" : "Add customer phone"}</h4>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <label className="space-y-1 text-xs text-[#aaa]">Customer name
                              <input className={inputClass} required minLength="2" maxLength="120" value={contactDraft.name} onChange={(event) => setContactDraft((current) => ({ ...current, name: event.target.value }))} />
                            </label>
                            <label className="space-y-1 text-xs text-[#aaa]">Mobile number
                              <input className={inputClass} required type="tel" value={contactDraft.phone} onChange={(event) => setContactDraft((current) => ({ ...current, phone: event.target.value }))} placeholder="03xx, +92, or 0092" />
                            </label>
                          </div>
                          <label className="flex items-start gap-2 text-xs text-[#bbb]">
                            <input type="checkbox" checked={contactDraft.marketingConsent} onChange={(event) => setContactDraft((current) => ({ ...current, marketingConsent: event.target.checked }))} />
                            <span>I confirm the customer explicitly agreed to receive WhatsApp marketing. A phone number from an order is not consent.</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <button type="submit" className={`${buttonClass} bg-emerald-700 text-white`} disabled={contactMutation.isPending}>{contactMutation.isPending ? "Saving…" : "Save contact"}</button>
                            <button type="button" className={`${buttonClass} text-[#bbb] hover:bg-[#333]`} onClick={() => setContactEditorOpen(false)}>Cancel</button>
                          </div>
                        </form>
                      )}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_190px_auto]">
                        <label className="relative">
                          <FaSearch className="absolute left-3 top-3 text-xs text-[#777]" />
                          <input className={`${inputClass} pl-9`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search customer name or phone" aria-label="Search customer name or phone" />
                        </label>
                        <select className={inputClass} value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} aria-label="Filter customer status">
                          <option value="all">All statuses</option>
                          <option value="active">Active</option>
                          <option value="regular">Regular (2+ linked orders)</option>
                          <option value="new">New (no linked orders)</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <div className="flex items-center text-xs text-[#aaa]">Eligible in filter: {Number(customerSummary.eligible || 0).toLocaleString()} · Selected: {selectedCountLabel}</div>
                      </div>
                      <div className="overflow-x-auto rounded border border-[#333]">
                        <table className="w-full min-w-[900px] text-left text-sm text-white">
                          <thead className="bg-[#292929] text-xs text-[#aaa]"><tr><th className="w-10 p-2"><span className="sr-only">Select</span></th><th className="p-2">Customer</th><th>Mobile</th><th>Record</th><th>Status</th><th>Consent</th><th>Eligibility</th><th>Action</th></tr></thead>
                          <tbody>
                            {customersQuery.isLoading ? <tr><td colSpan="8" className="p-4 text-center text-[#999]">Loading customer records…</td></tr> : rows.length ? rows.map((customer) => {
                              const checked = ["all-eligible", "filtered"].includes(selectionMode)
                                ? (selectionMode === "filtered" || customer.eligible) && !excludedIds.includes(customer.id)
                                : selectedIds.includes(customer.id);
                              const disabled = selectionMode === "all-eligible" && !customer.eligible;
                              return (
                                <tr key={customer.id} className="border-t border-[#333]">
                                  <td className="p-2"><input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleCustomer(customer)} aria-label={`Select ${customer.name}`} /></td>
                                  <td className="p-2">{customer.name || "—"}</td>
                                  <td className="font-mono text-xs">{customer.phone || "—"}</td>
                                  <td className="text-xs text-[#aaa]">{customer.contactOnly ? "Order/manual contact" : "Store account"}</td>
                                  <td className="capitalize text-[#ccc]">{customer.status}</td>
                                  <td className={customer.marketingConsent ? "text-emerald-300" : "text-[#aaa]"}>{customer.marketingConsent ? "Opted in" : "Opted out"}</td>
                                  <td className={customer.eligible ? "text-emerald-300" : "text-[#999]"}>{customer.eligible ? "Eligible" : customer.ineligibleReason}</td>
                                  <td><button type="button" className="rounded px-2 py-1 text-xs text-sky-300 hover:bg-[#333]" onClick={() => { setContactDraft({ customerId: customer.id, name: customer.name || "", phone: customer.phone || "", marketingConsent: customer.marketingConsent }); setContactEditorOpen(true); }}>Edit</button></td>
                                </tr>
                              );
                            }) : <tr><td colSpan="8" className="p-4 text-center text-[#999]">No matching customer records. Add a phone contact or place an order with a mobile number.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#999]">
                        <span>{customerPagination?.total || 0} matching records</span>
                        <div className="flex items-center gap-3">
                          <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
                          <span>{page} / {Math.max(1, customerPagination?.pages || 1)}</span>
                          <button type="button" disabled={page >= (customerPagination?.pages || 1)} onClick={() => setPage((value) => value + 1)}>Next</button>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4 rounded border border-[#333] bg-[#202020] p-4">
                      <h3 className="font-semibold text-white">Campaign setup</h3>
                      <label className="block space-y-1 text-xs text-[#aaa]">Campaign name<input className={inputClass} maxLength="120" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Friday Pizza Special" /></label>
                      <label className="block space-y-1 text-xs text-[#aaa]">Campaign type<input className={inputClass} maxLength="80" value={form.campaignType} onChange={(event) => setForm((current) => ({ ...current, campaignType: event.target.value }))} placeholder="Friday Special" /></label>
                      <div className="rounded border border-[#333] bg-[#191919] px-3 py-2 text-sm text-white">Send method <b className="ml-2 text-[#25d366]">WhatsApp</b></div>
                      <fieldset>
                        <legend className="mb-2 text-xs text-[#aaa]">Coupon discount options (random per customer)</legend>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {form.discountOptions.map((discount, index) => (
                            <div key={index} className="flex items-end gap-2 rounded border border-[#444] p-2">
                              <label className="flex-1 space-y-1 text-xs text-[#aaa]">
                                Discount percentage
                                <div className="flex items-center gap-2">
                                  <input
                                    className={inputClass}
                                    type="number"
                                    min="1"
                                    max="100"
                                    step="1"
                                    value={discount}
                                    onChange={(event) => updateDiscountOption(index, event.target.value)}
                                    aria-label={`Discount option ${index + 1} percentage`}
                                  />
                                  <span className="text-white">%</span>
                                </div>
                              </label>
                              <label className="w-28 space-y-1 text-xs text-[#aaa]">
                                Random weight
                                <input
                                  className={inputClass}
                                  type="number"
                                  min="0"
                                  max="1000"
                                  step="1"
                                  value={form.discountWeights[discount] ?? 1}
                                  onChange={(event) => setForm((current) => ({ ...current, discountWeights: { ...current.discountWeights, [discount]: event.target.value } }))}
                                  aria-label={`${discount}% discount random weight`}
                                />
                              </label>
                              <button
                                type="button"
                                className="rounded px-2 py-2 text-sm text-red-300 hover:bg-[#333] disabled:opacity-40"
                                onClick={() => removeDiscountOption(index)}
                                disabled={form.discountOptions.length <= 1}
                                aria-label={`Remove ${discount}% discount option`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="mt-2 rounded bg-[#353535] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                          onClick={addDiscountOption}
                          disabled={form.discountOptions.length >= 20}
                        >
                          Add discount option
                        </button>
                      </fieldset>
                      <label className="block space-y-1 text-xs text-[#aaa]">Minimum order amount<input className={inputClass} type="number" min="0" step="1" value={form.minimumOrderAmount} onChange={(event) => setForm((current) => ({ ...current, minimumOrderAmount: event.target.value }))} /></label>
                      <label className="block space-y-1 text-xs text-[#aaa]">Maximum discount (optional)<input className={inputClass} type="number" min="0" step="1" value={form.maximumDiscount} onChange={(event) => setForm((current) => ({ ...current, maximumDiscount: event.target.value }))} placeholder="No cap" /></label>
                      <label className="block space-y-1 text-xs text-[#aaa]">Maximum uses per coupon<input className={inputClass} type="number" min="1" max="100" step="1" value={form.maxUsesPerCoupon} onChange={(event) => setForm((current) => ({ ...current, maxUsesPerCoupon: event.target.value }))} /></label>
                      <label className="block space-y-1 text-xs text-[#aaa]">Coupon expiry ({form.timezone})<input className={inputClass} type="datetime-local" value={form.expiresAt} onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))} /></label>
                      <label className="block space-y-1 text-xs text-[#aaa]">Schedule send (optional, {form.timezone})<input className={inputClass} type="datetime-local" value={form.scheduledAt} onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))} /></label>
                      <label className="block space-y-1 text-xs text-[#aaa]">Timezone<input className={inputClass} value={form.timezone} onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))} /></label>
                      <div className="rounded border border-[#333] bg-[#191919] p-3 text-xs text-[#bbb]">
                        <b className="text-white">WhatsApp template</b>
                        <p className="mt-1">{providerStatus?.templateName || "Template configured by server"} · {providerStatus?.templateLanguage || "en"}</p>
                        <p className="mt-2 whitespace-pre-line">{(providerStatus?.templatePreviewText || "Hi {{1}}! 🍕 Enjoy a special treat from our pizza shop!\\n\\nYour exclusive discount: {{2}}% OFF\\nCoupon Code: {{3}}\\nMinimum Order: Rs. {{4}}\\nValid Until: {{5}}\\n\\nOrder now and enjoy your pizza!").replaceAll("\\n", "\n")}</p>
                        <p className="mt-2 text-[#888]">Production sends use only this provider-approved template; message text cannot be changed here.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className={`${buttonClass} bg-[#3a3a3a] text-white`} onClick={sendTest} disabled={!providerConfig || !providerStatus?.testNumberConfigured || testMutation.isPending}>{testMutation.isPending ? "Sending test…" : "Send test message"}</button>
                      </div>
                    </section>
                  </div>

                  {previewData && (
                    <section className="grid grid-cols-2 gap-3 rounded border border-[#3b583f] bg-[#1d2a20] p-4 text-sm sm:grid-cols-4" aria-live="polite">
                      <div>Selected customers<b className="mt-1 block text-xl text-white">{previewData.selected}</b></div>
                      <div>Eligible recipients<b className="mt-1 block text-xl text-emerald-300">{previewData.eligible}</b></div>
                      <div>Skipped<b className="mt-1 block text-xl text-amber-300">{previewData.skipped}</b></div>
                      <div>Estimated messages<b className="mt-1 block text-xl text-white">{previewData.estimatedMessages}</b></div>
                      {preview?.skipReasons && Object.entries(preview.skipReasons).length > 0 && <p className="col-span-2 text-xs text-[#bbb] sm:col-span-4">Skip reasons: {Object.entries(preview.skipReasons).map(([reason, count]) => `${reason} (${count})`).join(" · ")}</p>}
                      <div className="col-span-2 rounded border border-[#333] bg-[#191919] p-3 text-xs text-[#bbb] sm:col-span-4">
                        <b className="text-white">Sample message with campaign details</b>
                        <p className="mt-2 whitespace-pre-line">{preview?.template?.preview || "Provider template preview unavailable."}</p>
                      </div>
                      {previewData.eligible === 0 && (
                        <p className="col-span-2 rounded border border-amber-800 bg-amber-950/30 p-3 text-xs text-amber-100 sm:col-span-4">
                          No WhatsApp messages can be sent yet. Recipients need an active account, a valid mobile number, at least one completed/closed order, and explicit marketing consent. Use Edit in the customer list to record consent only if the customer agreed, verify their qualifying order, then click Generate &amp; Assign Tokens again before sending.
                        </p>
                      )}
                    </section>
                  )}

                  {createdCampaignId ? (
                    <section className="flex flex-wrap items-center justify-between gap-3 rounded border border-amber-800 bg-amber-950/30 p-4">
                      <div><b className="text-white">Draft saved.</b><p className="text-sm text-[#bbb]">{tokenResult ? `${tokenResult.created || 0} new · ${tokenResult.retained || 0} retained · ${tokenResult.failedValidation || 0} excluded` : "Assign and save coupon tokens before launch."} · {form.name}</p></div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className={`${buttonClass} bg-[#3a3a3a] text-white`} onClick={() => scanMutation.mutate(createdCampaignId)} disabled={scanMutation.isPending}>{scanMutation.isPending ? "Refreshing…" : "Refresh Customer & Delivery Status"}</button>
                        <button type="button" className={`${buttonClass} bg-amber-700 text-white`} onClick={() => tokenMutation.mutate(createdCampaignId)} disabled={tokenMutation.isPending}>{tokenMutation.isPending ? "Generating…" : "Generate & Assign Tokens"}</button>
                        <button type="button" className={`${buttonClass} bg-[#25d366] px-4 text-[#11251a]`} onClick={confirmLaunch} title={!tokenResult?.eligible ? "No customers currently meet WhatsApp send requirements. Check consent and qualifying orders." : undefined} disabled={!providerConfig || !tokenResult?.eligible || tokenResult?.failedAssignment > 0 || launchMutation.isPending}>{launchMutation.isPending ? "Queueing…" : selectionMode === "selected" ? "Send to Selected" : "Send to All Eligible"}</button>
                      </div>
                      {scanResult?.counts && <p className="w-full text-xs text-[#bbb]" aria-live="polite">Latest scan: {scanResult.counts.customerRecordsFound} records · {scanResult.counts.uniqueValidPhoneNumbers} valid unique numbers · {scanResult.counts.customersWithQualifyingOrders} qualifying buyers · {scanResult.counts.eligibleForWhatsApp} marketing-eligible · {scanResult.counts.alreadyHaveValidCoupon} assigned · {scanResult.counts.excluded} excluded</p>}
                    </section>
                  ) : (
                    <div className="flex justify-end">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-[#999]">Drafts do not send messages. Tokens must be saved before launch.</span>
                        <button type="button" className={`${buttonClass} bg-[#25d366] px-5 py-2.5 text-[#11251a]`} onClick={createDraft} disabled={!previewData?.eligible || createMutation.isPending}>{createMutation.isPending ? "Preparing campaign…" : "Prepare campaign for sending"}</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
                  <section className="space-y-2">
                    <h3 className="mb-2 font-semibold text-white">Campaigns</h3>
                    {campaignsQuery.isLoading ? <p className="text-sm text-[#999]">Loading campaigns…</p> : campaigns.length ? campaigns.map((campaign) => (
                      <button key={campaign._id} type="button" onClick={() => { setSelectedCampaignId(campaign._id); setTablePage(1); }} className={`w-full rounded border p-3 text-left ${selectedCampaignId === campaign._id ? "border-[#25d366] bg-[#1d2a20]" : "border-[#333] bg-[#202020]"}`}>
                        <span className="flex items-center justify-between gap-2"><b className="truncate text-white">{campaign.name}</b><Status value={campaign.status} /></span>
                        <span className="mt-1 block text-xs text-[#999]">{campaign.stats?.eligible || 0} eligible · {campaign.stats?.delivered || 0} delivered · {campaign.stats?.failed || 0} failed</span>
                      </button>
                    )) : <p className="text-sm text-[#999]">No campaigns yet.</p>}
                  </section>
                  {selectedCampaign ? (
                    <section className="min-w-0 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 rounded border border-[#333] bg-[#202020] p-4">
                        <div><h3 className="text-lg font-semibold text-white">{selectedCampaign.name}</h3><p className="mt-1 text-xs text-[#999]">Started: {selectedCampaign.startedAt ? new Date(selectedCampaign.startedAt).toLocaleString() : "Not started"} · Completed: {selectedCampaign.completedAt ? new Date(selectedCampaign.completedAt).toLocaleString() : "—"}</p></div>
                        <div className="flex flex-wrap gap-2">
                          {selectedCampaign.status === "draft" && <button type="button" className={`${buttonClass} bg-[#25d366] text-[#11251a]`} onClick={confirmSavedDraftLaunch} disabled={!providerConfig || launchMutation.isPending || !(stats?.queued > 0)}><FaPlay /> Confirm and launch draft</button>}
                          {selectedCampaign.status === "running" && <button type="button" className={`${buttonClass} bg-amber-700 text-white`} onClick={() => actionMutation.mutate({ action: "pause", campaignId: selectedCampaignId })}><FaPause /> Pause</button>}
                          {["draft", "scheduled", "running", "paused"].includes(selectedCampaign.status) && <button type="button" className={`${buttonClass} bg-red-900 text-white`} onClick={() => window.confirm("Cancel messages that have not yet been sent?") && actionMutation.mutate({ action: "cancel", campaignId: selectedCampaignId })}><FaTimes /> Cancel</button>}
                          {selectedCampaign.status === "paused" && <button type="button" className={`${buttonClass} bg-[#25d366] text-[#11251a]`} onClick={() => window.confirm(`Resume this campaign and queue ${stats?.queued || 0} remaining messages?`) && actionMutation.mutate({ action: "resume", campaignId: selectedCampaignId, confirmedEligibleCount: stats?.queued || 0 })}><FaPlay /> Resume queued messages</button>}
                          {(stats?.retryableFailed || 0) > 0 && <button type="button" className={`${buttonClass} bg-[#3a3a3a] text-white`} onClick={() => { const reason = window.prompt("Why are these failed messages being retried?"); if (reason?.trim()) actionMutation.mutate({ action: "retry", campaignId: selectedCampaignId, reason: reason.trim() }); }}><FaRedo /> Retry safe failures ({stats.retryableFailed})</button>}
                          <button type="button" className={`${buttonClass} bg-[#3a3a3a] text-white`} onClick={exportRecipients} disabled={!recipients.length}><FaDownload /> Export page</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
                        {[["Selected", stats?.selected], ["Eligible", stats?.eligible], ["Skipped", stats?.skipped], ["Queued", stats?.queued], ["Sent", stats?.sent], ["Delivered", stats?.delivered], ["Failed", stats?.failed], ["Redeemed", stats?.redeemed]].map(([label, value]) => <div key={label} className="rounded border border-[#333] bg-[#202020] p-3"><span className="text-xs text-[#999]">{label}</span><b className="mt-1 block text-lg text-white">{Number(value || 0).toLocaleString()}</b></div>)}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-white">Recipients</h4>
                        <select className={`${inputClass} w-auto`} value={recipientStatus} onChange={(event) => { setRecipientStatus(event.target.value); setTablePage(1); }} aria-label="Filter campaign results">
                          {recipientStatusOptions.map((option) => <option key={option} value={option}>{option === "all" ? "All results" : option[0].toUpperCase() + option.slice(1)}</option>)}
                        </select>
                      </div>
                      <div className="overflow-x-auto rounded border border-[#333]">
                        <table className="w-full min-w-[900px] text-left text-sm text-white">
                          <thead className="bg-[#292929] text-xs text-[#aaa]"><tr><th className="p-2">Customer</th><th>Phone</th><th>Status</th><th>Coupon</th><th>Offer</th><th>Redemption</th><th>Details</th></tr></thead>
                          <tbody>{recipients.length ? recipients.map((recipient) => (
                            <tr key={recipient._id} className="border-t border-[#333]">
                              <td className="p-2">{recipient.customerName || "—"}</td>
                              <td className="font-mono text-xs">{recipient.phone || "—"}</td>
                              <td><Status value={recipient.status} /></td>
                              <td className="font-mono text-xs">{recipient.couponCode || "—"}</td>
                              <td>{recipient.discountPercentage ? `${recipient.discountPercentage}% · ${currency(selectedCampaign.minimumOrderAmount)}` : "—"}</td>
                              <td>{recipient.redemption ? "Redeemed" : "—"}</td>
                              <td className="max-w-[260px] truncate text-xs text-[#aaa]" title={recipient.skipReason || recipient.lastError}>{recipient.skipReason || recipient.lastError || recipient.providerMessageId || "—"}</td>
                            </tr>
                          )) : <tr><td colSpan="7" className="p-4 text-center text-[#999]">No matching recipient records.</td></tr>}</tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#999]">
                        <span>{recipientsPagination?.total || 0} recipient records</span>
                        <div className="flex gap-3"><button type="button" disabled={tablePage <= 1} onClick={() => setTablePage((value) => value - 1)}>Previous</button><span>{tablePage} / {Math.max(1, recipientsPagination?.pages || 1)}</span><button type="button" disabled={tablePage >= (recipientsPagination?.pages || 1)} onClick={() => setTablePage((value) => value + 1)}>Next</button></div>
                      </div>
                    </section>
                  ) : <div className="rounded border border-[#333] bg-[#202020] p-5 text-sm text-[#999]">Select a campaign to review its progress and results.</div>}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default WhatsAppCampaignManager;