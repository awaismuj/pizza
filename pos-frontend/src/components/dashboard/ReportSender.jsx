import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaFilePdf,
  FaWhatsapp,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQrcode,
  FaRedo,
  FaLink,
  FaUnlink,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import {
  getWhatsappStatus,
  downloadReportPdf,
  sendReportToWhatsapp,
  sendReportToEmail,
  retryWhatsappLink,
  unlinkWhatsapp,
} from "../../https";

const pad2 = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const thisMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
};
const formatNumber = (n) => (n ? `+${n}` : "—");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_META = {
  ready: { label: "WhatsApp linked", color: "text-[#34c76f]", icon: FaCheckCircle },
  qr: { label: "Scan the QR code below to link", color: "text-[#f6b100]", icon: FaQrcode },
  initializing: { label: "Connecting to WhatsApp…", color: "text-[#8a7c66]", icon: FaExclamationTriangle },
  disabled: { label: "WhatsApp isn't linked yet", color: "text-[#7a7a7a]", icon: FaExclamationTriangle },
  init_failed: { label: "WhatsApp couldn't start — see error below", color: "text-[#e6402e]", icon: FaExclamationTriangle },
  auth_failure: { label: "WhatsApp link failed — retry", color: "text-[#e6402e]", icon: FaExclamationTriangle },
  disconnected: { label: "WhatsApp disconnected — relink", color: "text-[#e6402e]", icon: FaExclamationTriangle },
};

const SCOPES = [
  { key: "today", label: "Today" },
  { key: "range", label: "Select days" },
  { key: "month", label: "Full month" },
];

const inputCls =
  "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 outline-none mt-1 text-xs focus:border-amber-500 font-medium transition";

// `defaultDate`: when this is opened from the Daily Profit picker, pre-load
// the scope to that exact day (scope "range" with from = to = that date)
// instead of always defaulting to today — so "Generate report" always
// means "for the day I'm looking at", not "for today" regardless of what's
// on screen.
const ReportSender = ({ defaultDate } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState(defaultDate ? "range" : "today"); // today | range | month
  const [from, setFrom] = useState(defaultDate || todayStr());
  const [to, setTo] = useState(defaultDate || todayStr());
  const [month, setMonth] = useState(thisMonthStr());
  const [busy, setBusy] = useState(""); // "" | "download" | "send" | "email" | "retry" | "unlink"

  // Keep the scope in sync with whatever day is currently picked outside
  // this component, but only re-sync each time the panel is (re)opened —
  // never while it's open and the person may be mid-edit of their own.
  useEffect(() => {
    if (isOpen && defaultDate) {
      setScope("range");
      setFrom(defaultDate);
      setTo(defaultDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultDate]);

  // The number reports go to — always shown and editable, never sent
  // silently from a hidden default. Pre-filled once from the server's
  // configured default, but the person must have this field in front of
  // them (and can change it) before every WhatsApp send.
  const [numberInput, setNumberInput] = useState("");
  const [numberTouched, setNumberTouched] = useState(false);

  const [showEmail, setShowEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Auto-send: once armed, the report fires itself the moment status flips
  // to "ready" (i.e. right after the QR gets scanned) — no second click.
  const [pendingSend, setPendingSend] = useState(false);
  // Ask-first step: shown before we ever request a QR, so linking a phone
  // is always a deliberate action, never something that happens silently.
  const [awaitingLinkConfirm, setAwaitingLinkConfirm] = useState(false);

  const { data: statusData } = useQuery({
    queryKey: ["whatsappStatus"],
    queryFn: getWhatsappStatus,
    refetchInterval: isOpen ? (pendingSend || awaitingLinkConfirm ? 2000 : 5000) : false,
  });
  const status = statusData?.data?.data;
  const meta = STATUS_META[status?.status] || STATUS_META.disabled;
  const StatusIcon = meta.icon;
  const needsLink = status && !["ready", "qr", "initializing"].includes(status.status);

  // Fill the number field from the server default exactly once, without
  // ever overwriting something the person already typed.
  useEffect(() => {
    if (!numberTouched && status?.targetNumber && !numberInput) {
      setNumberInput(status.targetNumber);
    }
  }, [status?.targetNumber, numberTouched, numberInput]);

  const buildParams = () => {
    const base =
      scope === "today"
        ? { scope: "today" }
        : scope === "range"
        ? { scope: "range", from, to }
        : { scope: "month", month };
    return base;
  };

  const handleDownload = async () => {
    try {
      setBusy("download");
      const res = await downloadReportPdf(buildParams());
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar("Report downloaded.", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to generate report.", { variant: "error" });
    } finally {
      setBusy("");
    }
  };

  const handleSendWhatsapp = async () => {
    const number = numberInput.replace(/[^\d]/g, "");
    if (!number) {
      enqueueSnackbar("Enter the WhatsApp number to send this to.", { variant: "warning" });
      return;
    }
    try {
      setBusy("send");
      const res = await sendReportToWhatsapp({ ...buildParams(), number });
      enqueueSnackbar(res?.data?.message || "Report sent to WhatsApp.", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to send to WhatsApp.", { variant: "error" });
    } finally {
      setBusy("");
    }
  };

  const handleSendEmail = async () => {
    if (!EMAIL_RE.test(emailInput)) {
      enqueueSnackbar("Enter a valid email address.", { variant: "warning" });
      return;
    }
    try {
      setBusy("email");
      const res = await sendReportToEmail({ ...buildParams(), email: emailInput });
      enqueueSnackbar(res?.data?.message || "Report emailed.", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to email report.", { variant: "error" });
    } finally {
      setBusy("");
    }
  };

  // Actually requests a fresh QR — only ever called after the explicit
  // confirm step below, never automatically.
  const handleRetryLink = async () => {
    try {
      setBusy("retry");
      await retryWhatsappLink();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Retry failed.", { variant: "error" });
    } finally {
      setBusy("");
    }
  };

  const confirmAndShowQr = () => {
    setAwaitingLinkConfirm(false);
    handleRetryLink();
  };

  // Logs the currently-linked phone out and clears it, so a fresh QR can
  // link the correct one instead.
  const handleUnlink = async () => {
    try {
      setBusy("unlink");
      await unlinkWhatsapp();
      enqueueSnackbar("Unlinked. Scan a new QR with the correct phone.", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to unlink.", { variant: "error" });
    } finally {
      setBusy("");
    }
  };

  // Main "Send to WhatsApp" click. Always requires the number field to be
  // filled first — the field sits right above the button, so this is
  // always a deliberate, visible step, never a silent hidden-default send.
  const handleSendClick = () => {
    if (!numberInput.replace(/[^\d]/g, "")) {
      enqueueSnackbar("Type the WhatsApp number to send this report to first.", { variant: "warning" });
      return;
    }
    if (status?.status === "ready") {
      handleSendWhatsapp();
      return;
    }
    setPendingSend(true);
    if (status?.status === "qr") return; // QR already showing, just wait
    setAwaitingLinkConfirm(true); // ask first, don't request a QR silently
  };

  // Fires the queued send the instant WhatsApp reports "ready".
  useEffect(() => {
    if (pendingSend && status?.status === "ready" && busy === "") {
      setPendingSend(false);
      handleSendWhatsapp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.status, pendingSend]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl px-3.5 sm:px-4 py-2 text-xs uppercase tracking-wider shadow-sm transition active:scale-95 w-full sm:w-auto"
      >
        <FaFilePdf size={13} className="shrink-0" /> <span className="truncate">Generate Report</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Profit & expense report">
        {/* ---- WhatsApp link status ---- */}
        <div className={`flex items-center gap-2 text-xs sm:text-sm mb-2 ${meta.color}`}>
          <StatusIcon className="shrink-0" /> <span>{meta.label}</span>
        </div>

        {status?.status === "ready" && (
          <div className="mb-4 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-1">
            <p className="text-slate-600 dark:text-slate-400 break-all font-medium">
              Sending from: <span className="text-slate-900 dark:text-white font-bold">{formatNumber(status.linkedNumber)}</span>
            </p>
            <button
              onClick={handleUnlink}
              disabled={busy !== ""}
              className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 mt-1 font-bold text-[11px] disabled:opacity-60"
            >
              <FaUnlink /> {busy === "unlink" ? "Unlinking…" : "Wrong phone? Unlink & relink"}
            </button>
          </div>
        )}

        {/* ---- Ask-first confirmation, shown before any QR is requested ---- */}
        {awaitingLinkConfirm && (
          <div className="mb-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-3.5">
            <p className="text-xs text-amber-800 dark:text-amber-300 mb-3 leading-relaxed font-medium">
              The next QR code can be scanned by <strong>any</strong> WhatsApp — whichever phone scans it becomes
              the one reports send from. Make sure you're ready with the correct phone before continuing.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={confirmAndShowQr}
                disabled={busy !== ""}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider disabled:opacity-60 transition"
              >
                <FaLink /> I'm ready — show QR
              </button>
              <button
                onClick={() => {
                  setAwaitingLinkConfirm(false);
                  setPendingSend(false);
                }}
                className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 text-xs font-bold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {status?.status === "qr" && status?.qrDataUrl && (
          <div className="mb-4 flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4">
            <img src={status.qrDataUrl} alt="WhatsApp QR code" className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg" />
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              WhatsApp on your phone → Settings → Linked Devices → Link a Device, then scan this.
              {pendingSend && " Your report sends automatically the second it links."}
            </p>
          </div>
        )}

        {needsLink && !awaitingLinkConfirm && (
          <div className="mb-4">
            {status?.lastError && (
              <p className="text-xs text-[#e6402e] bg-[#2a1414] rounded px-3 py-2 mb-2 break-words">
                {status.lastError}
              </p>
            )}
            <button
              onClick={() => setAwaitingLinkConfirm(true)}
              disabled={busy !== ""}
              className="flex items-center gap-2 text-xs bg-[#262626] hover:bg-[#333] text-[#f5f5f5] rounded-md px-3 py-1.5 disabled:opacity-60"
            >
              <FaRedo className={busy === "retry" ? "animate-spin" : ""} /> {status?.lastError ? "Retry" : "Link WhatsApp"}
            </button>
          </div>
        )}

        {/* ---- Scope picker ---- */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {SCOPES.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setScope(opt.key)}
              className={`flex-1 min-w-[30%] rounded-xl px-2 sm:px-3 py-2 text-xs font-bold transition ${
                scope === opt.key
                  ? "bg-amber-500 text-slate-950 shadow-xs font-black"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {scope === "range" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div>
              <label className="text-xs text-[#ababab]">From</label>
              <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-[#ababab]">To</label>
              <input
                type="date"
                value={to}
                min={from}
                max={todayStr()}
                onChange={(e) => setTo(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        )}

        {scope === "month" && (
          <div className="mb-4">
            <label className="text-xs text-[#ababab]">Month</label>
            <input type="month" value={month} max={thisMonthStr()} onChange={(e) => setMonth(e.target.value)} className={inputCls} />
          </div>
        )}

        {/* ---- WhatsApp number (always visible, always editable) ---- */}
        <div className="mb-3">
          <label className="text-xs text-[#ababab]">Send report to this WhatsApp number</label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="e.g. 923013310954"
            value={numberInput}
            onChange={(e) => {
              setNumberTouched(true);
              setNumberInput(e.target.value);
            }}
            className={inputCls}
          />
          <p className="text-[10px] text-[#7a7a7a] mt-1">International format, no "+" or spaces.</p>
        </div>

        {/* ---- Actions ---- */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleDownload}
            disabled={busy !== ""}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 sm:py-2 text-xs font-bold transition disabled:opacity-60"
          >
            <FaFilePdf size={12} /> {busy === "download" ? "Generating…" : "Download PDF"}
          </button>
          <button
            onClick={handleSendClick}
            disabled={busy !== "" || (pendingSend && status?.status !== "ready")}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl px-4 py-2.5 sm:py-2 text-xs font-black uppercase tracking-wider shadow-sm transition active:scale-95 disabled:opacity-60"
          >
            <FaWhatsapp size={14} />{" "}
            {busy === "send" ? "Sending…" : pendingSend ? "Waiting for scan…" : "Send WhatsApp"}
          </button>
        </div>

        {pendingSend && status?.status !== "ready" && !awaitingLinkConfirm && (
          <p className="text-xs text-[#f6b100] mt-2 text-center">
            Report will send automatically once the QR code above is scanned.
          </p>
        )}

        {/* ---- Optional email delivery ---- */}
        <button
          onClick={() => setShowEmail((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-[#ababab] hover:text-[#f5f5f5] mt-4"
        >
          {showEmail ? <FaChevronUp /> : <FaChevronDown />} Also send by email (optional)
        </button>

        {showEmail && (
          <div className="mt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className={`${inputCls} sm:mt-0 flex-1`}
            />
            <button
              onClick={handleSendEmail}
              disabled={busy !== ""}
              className="flex items-center justify-center gap-2 bg-[#025cca] hover:bg-[#0347a0] text-white rounded-md px-4 py-2.5 sm:py-2 text-sm font-medium disabled:opacity-60 whitespace-nowrap"
            >
              <FaEnvelope /> {busy === "email" ? "Sending…" : "Send to Email"}
            </button>
          </div>
        )}

        <p className="text-[10px] text-[#7a7a7a] mt-4 leading-relaxed">
          If nobody generates today's report manually, it's sent to WhatsApp automatically shortly after midnight.
        </p>
      </Modal>
    </>
  );
};

export default ReportSender;
