import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  addAssetMaintenance,
  addAssetAdjustment,
  createAsset,
  disposeAsset,
  downloadAssetDocument,
  exportAssetReport,
  getAsset,
  getAssetDashboard,
  getAssetDepreciation,
  getAssets,
  getAssetSettings,
  recordAssetUsage,
  runAssetDepreciation,
  setAssetArchiveStatus,
  transferAsset,
  updateAsset,
  updateAssetMaintenance,
  updateAssetSettings,
  updateAssetValuation,
  uploadAssetDocument,
  uploadImage,
} from "../../https";
import { resolveImageUrl } from "../../utils";

const CATEGORIES = [
  "Computers and Laptops",
  "Servers and Networking Equipment",
  "Furniture and Office Equipment",
  "Vehicles",
  "Machinery and Equipment",
  "Buildings and Property",
  "Mobile Phones and Electronics",
  "Software and Licenses",
  "Tools and Other Equipment",
  "Other Business Assets",
];
const STATUSES = ["Active", "Archived", "Sold", "Disposed", "Damaged", "Lost"];
const METHODS = [
  ["StraightLine", "Straight line"],
  ["DecliningBalance", "Declining balance (double-declining default)"],
  ["UnitsOfProduction", "Units of production"],
];
const TODAY = new Date().toISOString().slice(0, 10);
const PREVIOUS_MONTH = (() => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString().slice(0, 7);
})();
const BLANK_ASSET = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  brand: "",
  model: "",
  serialNumber: "",
  purchaseDate: TODAY,
  depreciationStartDate: TODAY,
  purchasePrice: "",
  additionalCosts: "0",
  supplier: "",
  invoiceNumber: "",
  warrantyExpiry: "",
  location: "",
  department: "",
  assignedEmployeeName: "",
  condition: "Good",
  usefulLifeYears: "5",
  residualValue: "0",
  depreciationMethod: "StraightLine",
  decliningBalanceMultiplier: "2",
  estimatedLifetimeUsage: "",
  usageUnit: "",
  image: "",
};

const money = (value, currency = "PKR") =>
  value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-PK", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value) || 0);
const dateText = (value) => value ? new Date(value).toLocaleDateString() : "—";
const dateInput = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
const roleKey = (role) => String(role || "").toLowerCase();
const isFinancialRole = (role) => ["admin", "accountant"].includes(roleKey(role));
const canManage = (role) => ["admin", "accountant", "asset manager"].includes(roleKey(role));
const displayMethod = (method) => METHODS.find(([value]) => value === method)?.[1] || method;

const download = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const inputClass = "w-full rounded-lg border border-[#383838] bg-[#171717] px-3 py-2.5 text-sm text-white outline-none focus:border-[#f6b100]";
const Field = ({ label, children, className = "" }) => (
  <label className={`block min-w-0 text-sm text-[#c8c8c8] ${className}`}>
    <span className="mb-1.5 block">{label}</span>
    {children}
  </label>
);
const SummaryCard = ({ label, value, detail }) => (
  <div className="rounded-xl border border-[#363636] bg-[#252525] p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-[#999]">{label}</p>
    <p className="mt-2 text-xl font-bold text-white">{value}</p>
    {detail && <p className="mt-1 text-xs text-[#888]">{detail}</p>}
  </div>
);

const ChartList = ({ title, items, formatValue }) => {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <section className="rounded-xl border border-[#363636] bg-[#252525] p-4">
      <h3 className="mb-4 font-semibold text-white">{title}</h3>
      {items.length ? (
        <div className="space-y-3">
          {items.slice(0, 8).map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between gap-3 text-xs">
                <span className="truncate text-[#ccc]">{item.label}</span>
                <span className="shrink-0 text-[#999]">{formatValue(item.value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-[#171717]">
                <div className="h-full rounded bg-[#f6b100]" style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-sm text-[#888]">No asset data yet.</p>}
    </section>
  );
};

const AssetManagement = ({ role }) => {
  const queryClient = useQueryClient();
  const financeAccess = isFinancialRole(role);
  const managementAccess = canManage(role);
  const [filters, setFilters] = useState({ search: "", status: "", category: "", department: "", location: "", depreciationMethod: "", from: "", to: "", sort: "purchaseDate", direction: "desc" });
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(BLANK_ASSET);
  const [editingId, setEditingId] = useState("");
  const [dialog, setDialog] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [dialogForm, setDialogForm] = useState({});
  const [documentFiles, setDocumentFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState({ currency: "PKR", financialYearStartMonth: 1 });
  const [reportType, setReportType] = useState("register");

  const queryParams = useMemo(() => ({
    ...filters,
    page,
    limit: 20,
    ...(filters.search ? {} : { search: undefined }),
    ...(filters.status ? {} : { status: undefined }),
    ...(filters.category ? {} : { category: undefined }),
    ...(filters.department ? {} : { department: undefined }),
    ...(filters.location ? {} : { location: undefined }),
    ...(filters.depreciationMethod ? {} : { depreciationMethod: undefined }),
    ...(filters.from ? {} : { from: undefined }),
    ...(filters.to ? {} : { to: undefined }),
  }), [filters, page]);

  const { data: dashboardResponse, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ["asset-dashboard"],
    queryFn: getAssetDashboard,
    refetchInterval: 60000,
  });
  const { data: assetResponse, isLoading: assetsLoading, error: assetsError } = useQuery({
    queryKey: ["assets", queryParams],
    queryFn: () => getAssets(queryParams),
    placeholderData: keepPreviousData,
  });
  const { data: settingsResponse } = useQuery({ queryKey: ["asset-settings"], queryFn: getAssetSettings });
  const { data: selectedResponse } = useQuery({
    queryKey: ["asset", selectedId],
    queryFn: () => getAsset(selectedId),
    enabled: Boolean(selectedId),
  });
  const { data: depreciationResponse } = useQuery({
    queryKey: ["asset-depreciation", selectedId],
    queryFn: () => getAssetDepreciation(selectedId),
    enabled: Boolean(selectedId) && (financeAccess || roleKey(role) === "read only"),
  });

  const dashboard = dashboardResponse?.data?.data;
  const assets = assetResponse?.data?.data || [];
  const pagination = assetResponse?.data?.pagination;
  const selectedAsset = selectedResponse?.data?.data;
  const depreciationRows = depreciationResponse?.data?.data || [];
  const currency = settingsResponse?.data?.data?.currency || settingsDraft.currency;

  useEffect(() => {
    const saved = settingsResponse?.data?.data;
    if (saved) setSettingsDraft(saved);
  }, [settingsResponse]);

  const invalidateAssets = () => {
    queryClient.invalidateQueries({ queryKey: ["assets"] });
    queryClient.invalidateQueries({ queryKey: ["asset-dashboard"] });
    if (selectedId) {
      queryClient.invalidateQueries({ queryKey: ["asset", selectedId] });
      queryClient.invalidateQueries({ queryKey: ["asset-depreciation", selectedId] });
    }
  };

  const createMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      invalidateAssets();
      setDialog("");
      setEditingId("");
      setForm(BLANK_ASSET);
      setDocumentFiles([]);
      enqueueSnackbar("Asset registered.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not register asset.", { variant: "error" }),
  });
  const updateMutation = useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      invalidateAssets();
      setDialog("");
      setEditingId("");
      setForm(BLANK_ASSET);
      enqueueSnackbar("Asset details saved.", { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not save asset changes.", { variant: "error" }),
  });

  const actionMutations = {
    assignment: useMutation({
      mutationFn: transferAsset,
      onSuccess: () => { invalidateAssets(); setDialog(""); enqueueSnackbar("Assignment history updated.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not update assignment.", { variant: "error" }),
    }),
    maintenanceStatus: useMutation({
      mutationFn: updateAssetMaintenance,
      onSuccess: () => { invalidateAssets(); enqueueSnackbar("Maintenance status updated.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not update maintenance.", { variant: "error" }),
    }),
    adjustment: useMutation({
      mutationFn: addAssetAdjustment,
      onSuccess: () => { invalidateAssets(); setDialog(""); enqueueSnackbar("Accounting adjustment recorded in the asset history.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not post the accounting adjustment.", { variant: "error" }),
    }),
    valuation: useMutation({
      mutationFn: updateAssetValuation,
      onSuccess: () => { invalidateAssets(); setDialog(""); enqueueSnackbar("Manual market value recorded.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not save valuation.", { variant: "error" }),
    }),
    maintenance: useMutation({
      mutationFn: addAssetMaintenance,
      onSuccess: () => { invalidateAssets(); setDialog(""); enqueueSnackbar("Maintenance history updated.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not save maintenance.", { variant: "error" }),
    }),
    usage: useMutation({
      mutationFn: recordAssetUsage,
      onSuccess: () => { invalidateAssets(); setDialog(""); enqueueSnackbar("Production usage recorded.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not record usage.", { variant: "error" }),
    }),
    disposal: useMutation({
      mutationFn: disposeAsset,
      onSuccess: () => { invalidateAssets(); setDialog(""); enqueueSnackbar("Asset disposal recorded.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not dispose of asset.", { variant: "error" }),
    }),
    depreciation: useMutation({
      mutationFn: runAssetDepreciation,
      onSuccess: (result) => {
        invalidateAssets();
        enqueueSnackbar(`Depreciation posted for ${result?.data?.data?.period || "the selected period"}.`, { variant: "success" });
      },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not post depreciation.", { variant: "error" }),
    }),
    settings: useMutation({
      mutationFn: updateAssetSettings,
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["asset-settings"] }); enqueueSnackbar("Asset accounting settings saved.", { variant: "success" }); },
      onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not save settings.", { variant: "error" }),
    }),
  };
  const archiveMutation = useMutation({
    mutationFn: setAssetArchiveStatus,
    onSuccess: () => { invalidateAssets(); enqueueSnackbar("Asset status updated.", { variant: "success" }); },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not update asset status.", { variant: "error" }),
  });
  const reportMutation = useMutation({
    mutationFn: exportAssetReport,
    onSuccess: (response, variables) => download(response.data, `asset-${variables.type}.${variables.format}`),
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not export asset report.", { variant: "error" }),
  });

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateDialogForm = (field, value) => setDialogForm((current) => ({ ...current, [field]: value }));
  const openCreate = () => {
    setEditingId("");
    setForm({ ...BLANK_ASSET });
    setDocumentFiles([]);
    setDialog("asset");
  };
  const openEdit = (asset) => {
    setEditingId(asset._id);
    setDocumentFiles([]);
    setForm({
      ...BLANK_ASSET,
      ...asset,
      purchaseDate: dateInput(asset.purchaseDate),
      depreciationStartDate: dateInput(asset.depreciationStartDate),
      warrantyExpiry: dateInput(asset.warrantyExpiry),
      purchasePrice: String(asset.purchasePrice ?? ""),
      additionalCosts: String(asset.additionalCosts ?? "0"),
      usefulLifeYears: String(asset.usefulLifeYears ?? ""),
      residualValue: String(asset.residualValue ?? "0"),
      estimatedLifetimeUsage: String(asset.estimatedLifetimeUsage ?? ""),
    });
    setDialog("asset");
  };
  const openAction = (action) => {
    setDialogForm({
      assignedAt: TODAY,
      valuedAt: TODAY,
      scheduledAt: TODAY,
      completedAt: TODAY,
      date: TODAY,
      period: PREVIOUS_MONTH,
      status: "Scheduled",
      type: "Preventive",
      salePrice: "0",
      sellingExpenses: "0",
      cost: "0",
      units: "",
      value: selectedAsset?.marketValue ?? "",
      financialYearStartMonth: settingsDraft.financialYearStartMonth,
      currency: settingsDraft.currency,
    });
    setDialog(action);
  };

  const addDocuments = async (files) => {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(selected.map(async (file) => {
        const result = await uploadAssetDocument(file);
        return result.data.data;
      }));
      setDocumentFiles((current) => [...current, ...uploaded]);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Could not upload the supporting document.", { variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleAssetSave = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      brand: form.brand,
      model: form.model,
      serialNumber: form.serialNumber,
      supplier: form.supplier,
      invoiceNumber: form.invoiceNumber,
      warrantyExpiry: form.warrantyExpiry,
      location: form.location,
      department: form.department,
      assignedEmployeeName: form.assignedEmployeeName,
      condition: form.condition,
      image: form.image,
      attachments: documentFiles,
      ...(!editingId ? {
        purchaseDate: form.purchaseDate,
        depreciationStartDate: form.depreciationStartDate,
        purchasePrice: Number(form.purchasePrice),
        additionalCosts: Number(form.additionalCosts || 0),
        usefulLifeYears: Number(form.usefulLifeYears),
        residualValue: Number(form.residualValue || 0),
        depreciationMethod: form.depreciationMethod,
        decliningBalanceMultiplier: Number(form.decliningBalanceMultiplier || 2),
        estimatedLifetimeUsage: form.estimatedLifetimeUsage ? Number(form.estimatedLifetimeUsage) : undefined,
        usageUnit: form.usageUnit,
        marketValue: form.marketValue,
      } : financeAccess ? {
        usefulLifeYears: Number(form.usefulLifeYears),
        residualValue: Number(form.residualValue || 0),
        depreciationMethod: form.depreciationMethod,
        decliningBalanceMultiplier: Number(form.decliningBalanceMultiplier || 2),
        ...(form.depreciationMethod === "UnitsOfProduction" ? {
          estimatedLifetimeUsage: form.estimatedLifetimeUsage ? Number(form.estimatedLifetimeUsage) : undefined,
          usageUnit: form.usageUnit,
        } : {}),
      } : {}),
    };
    if (editingId) {
      updateMutation.mutate({ assetId: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const submitAction = (event) => {
    event.preventDefault();
    if (!selectedId) return;
    const body = { assetId: selectedId, ...dialogForm };
    if (dialog === "assignment") actionMutations.assignment.mutate(body);
    else if (dialog === "valuation") actionMutations.valuation.mutate(body);
    else if (dialog === "adjustment") actionMutations.adjustment.mutate(body);
    else if (dialog === "maintenance") actionMutations.maintenance.mutate(body);
    else if (dialog === "usage") actionMutations.usage.mutate(body);
    else if (dialog === "disposal") actionMutations.disposal.mutate(body);
    else if (dialog === "depreciation") actionMutations.depreciation.mutate({ period: dialogForm.period });
    else if (dialog === "settings") actionMutations.settings.mutate(dialogForm);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      const result = await uploadImage(file);
      updateForm("image", result?.data?.data?.url || "");
      enqueueSnackbar("Asset image uploaded.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Asset image upload failed.", { variant: "error" });
    }
  };

  const handleDocumentDownload = async (filename) => {
    try {
      const response = await downloadAssetDocument(filename);
      download(response.data, filename);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Could not download this asset document.", { variant: "error" });
    }
  };

  const handleFilters = (field, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const openReport = (format) => {
    reportMutation.mutate({ ...filters, page: undefined, limit: undefined, format, type: reportType });
  };

  const acquisitionCost = Number(form.purchasePrice || 0) + Number(form.additionalCosts || 0);
  const activityMutating = Object.values(actionMutations).some((mutation) => mutation.isPending);

  return (
    <main className="container mx-auto space-y-6 px-4 pb-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#f6b100]">Finance & operations</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Business Assets</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#999]">
            Asset register, monthly depreciation, maintenance, custody, valuation, and disposal history.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {financeAccess && (
            <>
              <button type="button" onClick={() => openAction("depreciation")} className="rounded-lg border border-[#454545] px-4 py-2 text-sm font-medium text-white hover:bg-[#303030]">
                Post depreciation
              </button>
              <button type="button" onClick={() => openAction("settings")} className="rounded-lg border border-[#454545] px-4 py-2 text-sm font-medium text-white hover:bg-[#303030]">
                Accounting settings
              </button>
            </>
          )}
          {financeAccess && (
            <button type="button" onClick={openCreate} className="rounded-lg bg-[#f6b100] px-4 py-2 text-sm font-bold text-[#191919] hover:bg-yellow-500">
              + Register asset
            </button>
          )}
        </div>
      </header>

      {(dashboardError || assetsError) && (
        <p role="alert" className="rounded-lg border border-red-700 bg-red-950/50 p-3 text-sm text-red-200">
          {dashboardError?.response?.data?.message || assetsError?.response?.data?.message || "Asset data could not be loaded."}
        </p>
      )}
      {dashboard?.maintenanceAlerts?.length > 0 && (
        <section className="rounded-xl border border-amber-700/50 bg-amber-950/25 p-4">
          <h2 className="font-semibold text-amber-200">Maintenance due soon</h2>
          <ul className="mt-2 space-y-1 text-sm text-amber-100/80">
            {dashboard.maintenanceAlerts.slice(0, 5).map((entry, index) => (
              <li key={`${entry.description}-${index}`}>{entry.type}: {entry.description} — {dateText(entry.scheduledAt)}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Assets registered" value={dashboardLoading ? "…" : dashboard?.totalAssets ?? 0} detail="Includes archived and disposed history" />
        {financeAccess && (
          <>
            <SummaryCard label="Original acquisition cost" value={money(dashboard?.originalPurchaseCost, currency)} />
            <SummaryCard label="Accumulated depreciation" value={money(dashboard?.accumulatedDepreciation, currency)} />
            <SummaryCard label="Current book value" value={money(dashboard?.currentBookValue, currency)} />
            <SummaryCard label="Estimated market value" value={money(dashboard?.estimatedMarketValue, currency)} detail="Manual estimates only" />
          </>
        )}
        <SummaryCard label="Purchased this month" value={dashboard?.assetsPurchasedThisMonth ?? 0} />
        <SummaryCard label="End of useful life nearing" value={dashboard?.nearingEndOfUsefulLife ?? 0} detail="Within the next 12 months" />
        <SummaryCard label="Maintenance due" value={dashboard?.maintenanceDue ?? 0} />
        <SummaryCard label="Expired warranties" value={dashboard?.expiredWarranties ?? 0} />
        <SummaryCard label="Sold / disposed / lost" value={dashboard?.disposedAssets ?? 0} />
      </section>

      {financeAccess && (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <ChartList title="Book value by category" items={dashboard?.assetsByCategory || []} formatValue={(value) => money(value, currency)} />
            <ChartList title="Book value by department" items={dashboard?.assetsByDepartment || []} formatValue={(value) => money(value, currency)} />
            <ChartList title="Book value by location" items={dashboard?.assetsByLocation || []} formatValue={(value) => money(value, currency)} />
          </section>
          <section className="grid gap-4 lg:grid-cols-2">
            <ChartList
              title="Monthly depreciation · last 12 months"
              items={(dashboard?.depreciationByMonth || []).map((item) => ({ label: item.period, value: item.amount }))}
              formatValue={(value) => money(value, currency)}
            />
            <ChartList title="Asset book value over time" items={(dashboard?.assetValueOverTime || []).map((item) => ({ label: item.period, value: item.bookValue }))} formatValue={(value) => money(value, currency)} />
          </section>
        </>
      )}

      {financeAccess && (
        <section className="rounded-xl border border-[#363636] bg-[#252525] p-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-semibold text-white">Asset reports</h2>
              <p className="mt-1 text-xs text-[#888]">Exports use the filters selected below. Excel export is SpreadsheetML (.xls).</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select aria-label="Report type" value={reportType} onChange={(event) => setReportType(event.target.value)} className={`${inputClass} w-auto`}>
                <option value="register">Complete asset register</option>
                <option value="valuation">Asset valuation</option>
                <option value="depreciation">Depreciation</option>
                <option value="category">By category</option>
                <option value="department">By department</option>
                <option value="location">By location</option>
                <option value="maintenance">Maintenance expenses</option>
                <option value="warranty">Warranty expiry</option>
                <option value="disposal">Disposals and sales</option>
                <option value="monthly-summary">Monthly summary</option>
                <option value="annual-summary">Financial-year summary</option>
              </select>
              {["csv", "xls", "pdf"].map((format) => (
                <button key={format} type="button" disabled={reportMutation.isPending} onClick={() => openReport(format)} className="rounded-lg border border-[#454545] px-3 py-2 text-xs font-semibold uppercase text-white hover:bg-[#303030] disabled:opacity-50">
                  {format === "xls" ? "Excel" : format}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-[#363636] bg-[#252525]">
        <div className="border-b border-[#363636] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">Asset register</h2>
              <p className="mt-1 text-xs text-[#888]">{pagination?.total ?? 0} total records · PKR/currency: {currency}</p>
            </div>
            <label className="min-w-[200px] flex-1 sm:max-w-xs">
              <span className="sr-only">Search assets</span>
              <input value={filters.search} onChange={(event) => handleFilters("search", event.target.value)} placeholder="Search name, ID, serial, brand…" className={inputClass} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <select aria-label="Filter by status" value={filters.status} onChange={(event) => handleFilters("status", event.target.value)} className={inputClass}>
              <option value="">All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select aria-label="Filter by category" value={filters.category} onChange={(event) => handleFilters("category", event.target.value)} className={inputClass}>
              <option value="">All categories</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
            <select aria-label="Filter by depreciation method" value={filters.depreciationMethod} onChange={(event) => handleFilters("depreciationMethod", event.target.value)} className={inputClass}>
              <option value="">All methods</option>{METHODS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select aria-label="Filter by department" value={filters.department} onChange={(event) => handleFilters("department", event.target.value)} className={inputClass}>
              <option value="">All departments</option>{(dashboard?.assetsByDepartment || []).map((row) => <option key={row.label} value={row.label}>{row.label}</option>)}
            </select>
            <select aria-label="Filter by location" value={filters.location} onChange={(event) => handleFilters("location", event.target.value)} className={inputClass}>
              <option value="">All locations</option>{(dashboard?.assetsByLocation || []).map((row) => <option key={row.label} value={row.label}>{row.label}</option>)}
            </select>
            <select aria-label="Sort assets" value={`${filters.sort}:${filters.direction}`} onChange={(event) => {
              const [sort, direction] = event.target.value.split(":");
              setFilters((current) => ({ ...current, sort, direction }));
            }} className={inputClass}>
              <option value="purchaseDate:desc">Newest purchase</option>
              <option value="purchaseDate:asc">Oldest purchase</option>
              <option value="name:asc">Name A–Z</option>
              <option value="name:desc">Name Z–A</option>
              <option value="acquisitionCost:desc">Highest acquisition cost</option>
            </select>
            <Field label="Purchased from">
              <input aria-label="Purchased from date" type="date" value={filters.from} onChange={(event) => handleFilters("from", event.target.value)} className={inputClass} />
            </Field>
            <Field label="Purchased to">
              <input aria-label="Purchased to date" type="date" value={filters.to} onChange={(event) => handleFilters("to", event.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>

        {assetsLoading ? <p className="p-6 text-sm text-[#999]">Loading asset register…</p> : assets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-white">No assets match these filters.</p>
            {financeAccess && <button type="button" onClick={openCreate} className="mt-3 text-sm font-semibold text-[#f6b100]">Register the first asset</button>}
          </div>
        ) : (
          <div className="divide-y divide-[#363636]">
            {assets.map((asset) => (
              <article key={asset._id} className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#171717] text-xl">
                    {asset.image ? <img src={resolveImageUrl(asset.image)} alt="" className="h-full w-full object-cover" /> : "▣"}
                  </div>
                  <div className="min-w-0">
                    <button type="button" onClick={() => setSelectedId(asset._id)} className="truncate text-left font-semibold text-white hover:text-[#f6b100]">
                      {asset.name}
                    </button>
                    <p className="text-xs text-[#888]">{asset.assetId} · {asset.category} · {asset.serialNumber || "No serial"}</p>
                    <p className="mt-1 text-xs text-[#999]">{asset.department || "No department"} · {asset.location || "No location"} · {asset.assignedEmployeeName || "Unassigned"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {financeAccess && <div className="min-w-24 text-sm"><span className="block text-[10px] uppercase text-[#777]">Book value</span><span className="font-semibold text-white">{money(asset.currentBookValue, currency)}</span></div>}
                  {financeAccess && <div className="min-w-24 text-sm"><span className="block text-[10px] uppercase text-[#777]">Market value</span><span className="font-semibold text-white">{money(asset.currentMarketValue, currency)}</span></div>}
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${asset.status === "Active" ? "bg-green-950 text-green-300" : asset.status === "Archived" ? "bg-amber-950 text-amber-300" : "bg-[#333] text-[#bbb]"}`}>{asset.status}</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setSelectedId(asset._id)} className="rounded-md border border-[#454545] px-3 py-2 text-xs text-white hover:bg-[#303030]">Details</button>
                    {managementAccess && !asset.disposal && <button type="button" onClick={() => openEdit(asset)} className="rounded-md border border-[#454545] px-3 py-2 text-xs text-white hover:bg-[#303030]">Edit</button>}
                    {managementAccess && !asset.disposal && (
                      <button type="button" onClick={() => archiveMutation.mutate({ assetId: asset._id, status: asset.status === "Archived" ? "Active" : "Archived" })} className="rounded-md border border-[#454545] px-3 py-2 text-xs text-white hover:bg-[#303030]">
                        {asset.status === "Archived" ? "Reactivate" : "Archive"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <footer className="flex items-center justify-between border-t border-[#363636] p-4 text-sm text-[#999]">
          <span>Page {pagination?.page || page} of {Math.max(1, pagination?.pages || 1)}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-md border border-[#454545] px-3 py-1.5 disabled:opacity-40">Previous</button>
            <button type="button" disabled={page >= (pagination?.pages || 1)} onClick={() => setPage((current) => current + 1)} className="rounded-md border border-[#454545] px-3 py-1.5 disabled:opacity-40">Next</button>
          </div>
        </footer>
      </section>

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 py-8 sm:p-6">
          <section role="dialog" aria-modal="true" aria-labelledby="asset-detail-title" className="w-full max-w-4xl rounded-2xl border border-[#404040] bg-[#202020] p-5 shadow-2xl sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#f6b100]">{selectedAsset.assetId}</p>
                <h2 id="asset-detail-title" className="mt-1 text-2xl font-bold text-white">{selectedAsset.name}</h2>
                <p className="mt-1 text-sm text-[#999]">{selectedAsset.category} · {displayMethod(selectedAsset.depreciationMethod)}</p>
              </div>
              <button type="button" onClick={() => setSelectedId("")} aria-label="Close asset details" className="rounded-lg border border-[#454545] px-3 py-2 text-white">Close</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard label="Status / condition" value={`${selectedAsset.status} · ${selectedAsset.condition}`} />
              <SummaryCard label="Book value" value={money(selectedAsset.currentBookValue, currency)} />
              <SummaryCard label="Market value" value={money(selectedAsset.currentMarketValue, currency)} detail={`Updated ${dateText(selectedAsset.marketValueUpdatedAt)}`} />
              <SummaryCard label="Maintenance total" value={money(selectedAsset.totalMaintenanceCost, currency)} />
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section className="rounded-xl bg-[#292929] p-4">
                <h3 className="mb-3 font-semibold text-white">Asset details</h3>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  {[
                    ["Brand / model", [selectedAsset.brand, selectedAsset.model].filter(Boolean).join(" ") || "—"],
                    ["Serial number", selectedAsset.serialNumber || "—"],
                    ["Purchase date", dateText(selectedAsset.purchaseDate)],
                    ["Acquisition cost", money(selectedAsset.acquisitionCost, currency)],
                    ["Accumulated depreciation", money(selectedAsset.accumulatedDepreciation, currency)],
                    ["Useful life", `${selectedAsset.usefulLifeYears} years`],
                    ["Residual value", money(selectedAsset.residualValue, currency)],
                    ["Warranty expiry", dateText(selectedAsset.warrantyExpiry)],
                    ["Department / location", `${selectedAsset.department || "—"} / ${selectedAsset.location || "—"}`],
                    ["Assigned to", selectedAsset.assignedEmployeeName || "Unassigned"],
                  ].map(([label, value]) => <div key={label}><dt className="text-xs text-[#888]">{label}</dt><dd className="mt-0.5 text-white">{value}</dd></div>)}
                </dl>
                {selectedAsset.description && <p className="mt-3 text-sm text-[#bbb]">{selectedAsset.description}</p>}
                {selectedAsset.attachments?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs uppercase text-[#888]">Invoices and documents</p>
                    {selectedAsset.attachments.map((file) => <button key={file.filename} type="button" onClick={() => handleDocumentDownload(file.filename)} className="mr-2 mb-2 rounded border border-[#454545] px-2 py-1 text-xs text-[#f6b100]">{file.name}</button>)}
                  </div>
                )}
              </section>
              <section className="rounded-xl bg-[#292929] p-4">
                <h3 className="mb-3 font-semibold text-white">Asset history</h3>
                <div className="max-h-72 space-y-2 overflow-y-auto">
                  {[...(selectedAsset.auditHistory || [])].reverse().map((entry, index) => (
                    <div key={`${entry.action}-${entry.occurredAt}-${index}`} className="border-l-2 border-[#f6b100] pl-3 text-sm">
                      <p className="text-white">{entry.action}</p>
                      <p className="text-xs text-[#888]">{dateText(entry.occurredAt)} · {entry.actorName} ({entry.actorRole})</p>
                    </div>
                  ))}
                  {!selectedAsset.auditHistory?.length && <p className="text-sm text-[#888]">No history recorded.</p>}
                </div>
              </section>
            </div>
            {financeAccess && (
              <section className="mt-5 rounded-xl bg-[#292929] p-4">
                <h3 className="mb-3 font-semibold text-white">Valuation & accounting adjustment history</h3>
                <div className="max-h-52 space-y-2 overflow-y-auto text-sm">
                  {(selectedAsset.valuationHistory || []).slice().reverse().map((entry) => (
                    <div key={entry._id}><p className="text-white">Manual market value · {money(entry.value, currency)}</p><p className="text-xs text-[#888]">{dateText(entry.valuedAt)} · {entry.note || "No source note"}</p></div>
                  ))}
                  {(selectedAsset.valueAdjustments || []).slice().reverse().map((entry, index) => (
                    <div key={`${entry.type}-${entry.effectiveAt}-${index}`}><p className="text-white">{entry.type} · {money(entry.amount, currency)}</p><p className="text-xs text-[#888]">{dateText(entry.effectiveAt)} · {entry.reason}</p></div>
                  ))}
                  {!selectedAsset.valuationHistory?.length && !selectedAsset.valueAdjustments?.length && <p className="text-sm text-[#888]">No market valuations or accounting adjustments recorded.</p>}
                </div>
              </section>
            )}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <section className="rounded-xl bg-[#292929] p-4">
                <h3 className="mb-3 font-semibold text-white">Depreciation history</h3>
                <div className="max-h-52 overflow-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[#888]"><tr><th className="py-2">Period</th><th>Opening</th><th>Depreciation</th><th>Closing</th></tr></thead>
                    <tbody className="text-[#ddd]">{depreciationRows.map((row) => <tr key={row._id} className="border-t border-[#3b3b3b]"><td className="py-2">{row.period}</td><td>{money(row.openingBookValue, currency)}</td><td>{money(row.depreciation, currency)}</td><td>{money(row.closingBookValue, currency)}</td></tr>)}</tbody>
                  </table>
                  {!depreciationRows.length && <p className="text-sm text-[#888]">No depreciation entries posted yet.</p>}
                </div>
              </section>
              <section className="rounded-xl bg-[#292929] p-4">
                <h3 className="mb-3 font-semibold text-white">Maintenance & transfers</h3>
                <div className="max-h-52 space-y-3 overflow-y-auto text-sm">
                  {(selectedAsset.maintenanceHistory || []).slice().reverse().map((entry) => (
                    <div key={entry._id} className="border-b border-[#3b3b3b] pb-2">
                      <p className="text-white">{entry.type}: {entry.description}</p>
                      <p className="text-xs text-[#888]">{entry.status} · {dateText(entry.completedAt || entry.scheduledAt)} · {money(entry.cost, currency)}</p>
                      {managementAccess && entry.status === "Scheduled" && <div className="mt-2 flex gap-2">
                        <button type="button" disabled={actionMutations.maintenanceStatus.isPending} onClick={() => actionMutations.maintenanceStatus.mutate({ assetId: selectedId, maintenanceId: entry._id, status: "Completed", completedAt: TODAY })} className="rounded border border-green-800 px-2 py-1 text-xs text-green-300">Mark complete</button>
                        <button type="button" disabled={actionMutations.maintenanceStatus.isPending} onClick={() => actionMutations.maintenanceStatus.mutate({ assetId: selectedId, maintenanceId: entry._id, status: "Cancelled" })} className="rounded border border-[#454545] px-2 py-1 text-xs text-[#aaa]">Cancel</button>
                      </div>}
                    </div>
                  ))}
                  {(selectedAsset.assignmentHistory || []).slice().reverse().map((entry) => <div key={entry._id}><p className="text-white">{entry.employeeName || "Unassigned"} · {entry.department || "No department"} · {entry.location || "No location"}</p><p className="text-xs text-[#888]">{dateText(entry.assignedAt)}{entry.returnedAt ? ` – returned ${dateText(entry.returnedAt)}` : " · current assignment"}</p></div>)}
                  {!selectedAsset.maintenanceHistory?.length && !selectedAsset.assignmentHistory?.length && <p className="text-sm text-[#888]">No maintenance or assignment history.</p>}
                </div>
              </section>
            </div>
            {managementAccess && !selectedAsset.disposal && (
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => openAction("assignment")} className="rounded-lg border border-[#454545] px-3 py-2 text-sm text-white">Assign / transfer</button>
                <button type="button" onClick={() => openAction("maintenance")} className="rounded-lg border border-[#454545] px-3 py-2 text-sm text-white">Maintenance</button>
                {selectedAsset.depreciationMethod === "UnitsOfProduction" && <button type="button" onClick={() => openAction("usage")} className="rounded-lg border border-[#454545] px-3 py-2 text-sm text-white">Record usage</button>}
                {financeAccess && <button type="button" onClick={() => openAction("valuation")} className="rounded-lg border border-[#454545] px-3 py-2 text-sm text-white">Update market value</button>}
                {financeAccess && <button type="button" onClick={() => openAction("adjustment")} className="rounded-lg border border-[#454545] px-3 py-2 text-sm text-white">Impairment / revaluation</button>}
                {financeAccess && <button type="button" onClick={() => openAction("disposal")} className="rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white">Dispose / sell</button>}
              </div>
            )}
          </section>
        </div>
      )}

      {dialog && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/75 p-3 py-8 sm:p-6">
          <section role="dialog" aria-modal="true" aria-labelledby="asset-dialog-title" className="w-full max-w-3xl rounded-2xl border border-[#404040] bg-[#202020] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="asset-dialog-title" className="text-xl font-bold text-white">
                {dialog === "asset" ? (editingId ? "Edit asset details" : "Register a business asset") : ({
                  assignment: "Assign or transfer asset",
                  valuation: "Record current market value",
                  adjustment: "Post accounting adjustment",
                  maintenance: "Schedule or record maintenance",
                  usage: "Record production usage",
                  disposal: "Record asset disposal or sale",
                  depreciation: "Post monthly depreciation",
                  settings: "Asset accounting settings",
                }[dialog])}
              </h2>
              <button type="button" onClick={() => setDialog("")} aria-label="Close form" className="rounded-lg border border-[#454545] px-3 py-2 text-white">Close</button>
            </div>
            {dialog === "asset" ? (
              <form onSubmit={handleAssetSave} className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Asset name *"><input required maxLength={160} value={form.name} onChange={(event) => updateForm("name", event.target.value)} className={inputClass} /></Field>
                  <Field label="Category *"><select required value={form.category} onChange={(event) => updateForm("category", event.target.value)} className={inputClass}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></Field>
                  <Field label="Condition"><select value={form.condition} onChange={(event) => updateForm("condition", event.target.value)} className={inputClass}>{["New", "Good", "Fair", "Poor", "Damaged"].map((condition) => <option key={condition}>{condition}</option>)}</select></Field>
                  <Field label="Brand"><input value={form.brand} onChange={(event) => updateForm("brand", event.target.value)} className={inputClass} /></Field>
                  <Field label="Model"><input value={form.model} onChange={(event) => updateForm("model", event.target.value)} className={inputClass} /></Field>
                  <Field label="Serial number"><input value={form.serialNumber} onChange={(event) => updateForm("serialNumber", event.target.value)} className={inputClass} /></Field>
                  {!editingId && <>
                    <Field label="Purchase date *"><input required type="date" value={form.purchaseDate} onChange={(event) => updateForm("purchaseDate", event.target.value)} className={inputClass} /></Field>
                    <Field label="Depreciation start date *"><input required type="date" value={form.depreciationStartDate} onChange={(event) => updateForm("depreciationStartDate", event.target.value)} className={inputClass} /></Field>
                    <Field label="Purchase price *"><input required min="0" step="0.01" type="number" value={form.purchasePrice} onChange={(event) => updateForm("purchasePrice", event.target.value)} className={inputClass} /></Field>
                    <Field label="Additional purchase costs"><input min="0" step="0.01" type="number" value={form.additionalCosts} onChange={(event) => updateForm("additionalCosts", event.target.value)} className={inputClass} /></Field>
                    <Field label="Total acquisition cost"><input readOnly value={money(acquisitionCost, currency)} className={`${inputClass} text-[#aaa]`} /></Field>
                  </>}
                  <Field label="Supplier"><input value={form.supplier} onChange={(event) => updateForm("supplier", event.target.value)} className={inputClass} /></Field>
                  <Field label="Invoice number"><input value={form.invoiceNumber} onChange={(event) => updateForm("invoiceNumber", event.target.value)} className={inputClass} /></Field>
                  <Field label="Warranty expiry"><input type="date" value={form.warrantyExpiry} onChange={(event) => updateForm("warrantyExpiry", event.target.value)} className={inputClass} /></Field>
                  <Field label="Location"><input value={form.location} onChange={(event) => updateForm("location", event.target.value)} className={inputClass} /></Field>
                  <Field label="Department"><input value={form.department} onChange={(event) => updateForm("department", event.target.value)} className={inputClass} /></Field>
                  <Field label="Assigned employee"><input value={form.assignedEmployeeName} onChange={(event) => updateForm("assignedEmployeeName", event.target.value)} className={inputClass} /></Field>
                  {(!editingId || financeAccess) && <>
                    <Field label="Useful life (years) *"><input required min="0.01" step="0.1" type="number" value={form.usefulLifeYears} onChange={(event) => updateForm("usefulLifeYears", event.target.value)} className={inputClass} /></Field>
                    <Field label="Residual / salvage value"><input min="0" step="0.01" type="number" value={form.residualValue} onChange={(event) => updateForm("residualValue", event.target.value)} className={inputClass} /></Field>
                    <Field label="Depreciation method"><select value={form.depreciationMethod} onChange={(event) => updateForm("depreciationMethod", event.target.value)} className={inputClass}>{METHODS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
                    {form.depreciationMethod === "DecliningBalance" && <Field label="Declining balance multiplier"><input min="1" max="3" step="0.1" type="number" value={form.decliningBalanceMultiplier} onChange={(event) => updateForm("decliningBalanceMultiplier", event.target.value)} className={inputClass} /></Field>}
                    {form.depreciationMethod === "UnitsOfProduction" && <>
                      <Field label="Estimated lifetime usage *"><input required min="0.01" type="number" value={form.estimatedLifetimeUsage} onChange={(event) => updateForm("estimatedLifetimeUsage", event.target.value)} className={inputClass} /></Field>
                      <Field label="Usage unit"><input placeholder="Hours, km, units…" value={form.usageUnit} onChange={(event) => updateForm("usageUnit", event.target.value)} className={inputClass} /></Field>
                    </>}
                  </>}
                  {financeAccess && !editingId && <Field label="Initial estimated market value (optional)"><input min="0" step="0.01" type="number" value={form.marketValue ?? ""} onChange={(event) => updateForm("marketValue", event.target.value)} className={inputClass} /></Field>}
                  <Field label="Asset image"><input type="file" accept="image/*" onChange={(event) => handleImageUpload(event.target.files?.[0])} className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-[#383838] file:px-2 file:py-1`} /></Field>
                  <Field label="Invoice / supporting documents (PDF, JPEG, PNG, WebP)"><input type="file" multiple accept=".pdf,image/jpeg,image/png,image/webp" onChange={(event) => addDocuments(event.target.files)} className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-[#383838] file:px-2 file:py-1`} /></Field>
                </div>
                <Field label="Asset description"><textarea rows={3} maxLength={2000} value={form.description} onChange={(event) => updateForm("description", event.target.value)} className={inputClass} /></Field>
                {documentFiles.length > 0 && <p className="text-xs text-[#aaa]">Uploaded documents: {documentFiles.map((file) => file.name).join(", ")}</p>}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setDialog("")} className="rounded-lg border border-[#454545] px-4 py-2 text-sm text-white">Cancel</button>
                  <button type="submit" disabled={uploading || createMutation.isPending || updateMutation.isPending} className="rounded-lg bg-[#f6b100] px-5 py-2 font-bold text-[#171717] disabled:opacity-50">
                    {uploading ? "Uploading documents…" : createMutation.isPending || updateMutation.isPending ? "Saving…" : editingId ? "Save changes" : "Register asset"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={submitAction} className="space-y-4">
                {dialog === "assignment" && <>
                  <Field label="Employee name"><input value={dialogForm.employeeName || ""} onChange={(event) => updateDialogForm("employeeName", event.target.value)} className={inputClass} /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Department"><input value={dialogForm.department || ""} onChange={(event) => updateDialogForm("department", event.target.value)} className={inputClass} /></Field>
                    <Field label="Location"><input value={dialogForm.location || ""} onChange={(event) => updateDialogForm("location", event.target.value)} className={inputClass} /></Field>
                    <Field label="Assignment date"><input required type="date" value={dialogForm.assignedAt} onChange={(event) => updateDialogForm("assignedAt", event.target.value)} className={inputClass} /></Field>
                  </div>
                  <Field label="Transfer note"><textarea rows={2} value={dialogForm.note || ""} onChange={(event) => updateDialogForm("note", event.target.value)} className={inputClass} /></Field>
                </>}
                {dialog === "valuation" && <>
                  <p className="text-sm text-[#999]">Market values are manually entered estimates and are not calculated from depreciation.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label={`Estimated market value (${currency}) *`}><input required min="0" step="0.01" type="number" value={dialogForm.value} onChange={(event) => updateDialogForm("value", event.target.value)} className={inputClass} /></Field>
                    <Field label="Valuation date"><input required type="date" value={dialogForm.valuedAt} onChange={(event) => updateDialogForm("valuedAt", event.target.value)} className={inputClass} /></Field>
                  </div>
                  <Field label="Source / valuation note"><textarea rows={2} value={dialogForm.note || ""} onChange={(event) => updateDialogForm("note", event.target.value)} className={inputClass} /></Field>
                </>}
                {dialog === "adjustment" && <>
                  <p className="text-sm text-[#999]">The original acquisition cost and posted depreciation are never overwritten. This adjustment is a separate audited accounting entry and affects book value and future depreciation only.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Adjustment type"><select value={dialogForm.type || "Impairment"} onChange={(event) => updateDialogForm("type", event.target.value)} className={inputClass}><option>Impairment</option><option>Revaluation</option><option>Acquisition correction</option></select></Field>
                    <Field label={`Adjustment amount (+/- ${currency})`}><input required step="0.01" type="number" value={dialogForm.amount || ""} onChange={(event) => updateDialogForm("amount", event.target.value)} className={inputClass} /></Field>
                    <Field label="Effective month (first day)"><input required type="month" min={TODAY.slice(0, 7)} value={dialogForm.effectiveAt || TODAY.slice(0, 7)} onChange={(event) => updateDialogForm("effectiveAt", event.target.value)} className={inputClass} /></Field>
                  </div>
                  <Field label="Reason / audit note *"><textarea required maxLength={500} rows={3} value={dialogForm.reason || ""} onChange={(event) => updateDialogForm("reason", event.target.value)} className={inputClass} /></Field>
                </>}
                {dialog === "maintenance" && <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Maintenance type *"><input required value={dialogForm.type || ""} onChange={(event) => updateDialogForm("type", event.target.value)} className={inputClass} /></Field>
                    <Field label="Service provider"><input value={dialogForm.serviceProvider || ""} onChange={(event) => updateDialogForm("serviceProvider", event.target.value)} className={inputClass} /></Field>
                    <Field label="Status"><select value={dialogForm.status} onChange={(event) => updateDialogForm("status", event.target.value)} className={inputClass}><option>Scheduled</option><option>Completed</option></select></Field>
                    <Field label={`Repair cost (${currency})`}><input min="0" step="0.01" type="number" value={dialogForm.cost} onChange={(event) => updateDialogForm("cost", event.target.value)} className={inputClass} /></Field>
                    <Field label="Scheduled / last maintenance date"><input type="date" value={dialogForm.scheduledAt || ""} onChange={(event) => updateDialogForm("scheduledAt", event.target.value)} className={inputClass} /></Field>
                    {dialogForm.status === "Completed" && <Field label="Completed date"><input type="date" value={dialogForm.completedAt || ""} onChange={(event) => updateDialogForm("completedAt", event.target.value)} className={inputClass} /></Field>}
                    <Field label="Next maintenance date"><input type="date" value={dialogForm.nextMaintenanceAt || ""} onChange={(event) => updateDialogForm("nextMaintenanceAt", event.target.value)} className={inputClass} /></Field>
                  </div>
                  <Field label="Repair description *"><textarea required rows={3} value={dialogForm.description || ""} onChange={(event) => updateDialogForm("description", event.target.value)} className={inputClass} /></Field>
                </>}
                {dialog === "usage" && <>
                  <p className="text-sm text-[#999]">Enter actual usage for the month. Monthly depreciation is calculated from the asset&apos;s lifetime estimated usage.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Usage period"><input required type="month" value={dialogForm.period} onChange={(event) => updateDialogForm("period", event.target.value)} className={inputClass} /></Field>
                    <Field label={`Actual usage (${selectedAsset?.usageUnit || "units"})`}><input required min="0" step="0.01" type="number" value={dialogForm.units} onChange={(event) => updateDialogForm("units", event.target.value)} className={inputClass} /></Field>
                  </div>
                </>}
                {dialog === "disposal" && <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Disposal type"><select value={dialogForm.type || "Sold"} onChange={(event) => updateDialogForm("type", event.target.value)} className={inputClass}>{["Sold", "Disposed", "Damaged", "Lost"].map((status) => <option key={status}>{status}</option>)}</select></Field>
                    <Field label="Disposal / sale date"><input required type="date" value={dialogForm.date} onChange={(event) => updateDialogForm("date", event.target.value)} className={inputClass} /></Field>
                    <Field label={`Sale price (${currency})`}><input min="0" step="0.01" type="number" value={dialogForm.salePrice} onChange={(event) => updateDialogForm("salePrice", event.target.value)} className={inputClass} /></Field>
                    <Field label={`Selling expenses (${currency})`}><input min="0" step="0.01" type="number" value={dialogForm.sellingExpenses} onChange={(event) => updateDialogForm("sellingExpenses", event.target.value)} className={inputClass} /></Field>
                  </div>
                  <Field label="Disposal note"><textarea rows={2} value={dialogForm.note || ""} onChange={(event) => updateDialogForm("note", event.target.value)} className={inputClass} /></Field>
                  <p className="text-sm text-[#e5c36a]">Gain / loss is calculated on the server as net sale proceeds less book value on the disposal date. Posting disposal stops future depreciation.</p>
                </>}
                {dialog === "depreciation" && <>
                  <p className="text-sm text-[#999]">Post a completed period only. Each asset/period is unique, so repeated scheduler runs cannot create duplicate depreciation entries. Units-of-production assets without usage recorded are skipped.</p>
                  <Field label="Financial period"><input required type="month" max={PREVIOUS_MONTH} value={dialogForm.period} onChange={(event) => updateDialogForm("period", event.target.value)} className={inputClass} /></Field>
                </>}
                {dialog === "settings" && <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Currency (ISO 4217)"><input required maxLength={3} pattern="[A-Za-z]{3}" value={dialogForm.currency || ""} onChange={(event) => updateDialogForm("currency", event.target.value.toUpperCase())} className={inputClass} /></Field>
                    <Field label="Financial year start month"><select value={dialogForm.financialYearStartMonth} onChange={(event) => updateDialogForm("financialYearStartMonth", Number(event.target.value))} className={inputClass}>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{new Date(2025, index, 1).toLocaleString(undefined, { month: "long" })}</option>)}</select></Field>
                  </div>
                  <p className="text-xs text-[#888]">The accounting period is calendar-monthly; this setting controls reporting year boundaries and currency presentation only.</p>
                </>}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setDialog("")} className="rounded-lg border border-[#454545] px-4 py-2 text-sm text-white">Cancel</button>
                  <button type="submit" disabled={activityMutating} className={`rounded-lg px-5 py-2 font-bold text-[#171717] disabled:opacity-50 ${dialog === "disposal" ? "bg-red-400" : "bg-[#f6b100]"}`}>
                    {activityMutating ? "Saving…" : dialog === "depreciation" ? "Post depreciation" : dialog === "disposal" ? "Confirm disposal" : "Save"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default AssetManagement;
