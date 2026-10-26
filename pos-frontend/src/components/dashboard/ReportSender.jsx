import { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import {
  downloadReportPdf,
  sendReportToEmail,
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
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SCOPES = [
  { key: "today", label: "Today" },
  { key: "range", label: "Select days" },
  { key: "month", label: "Full month" },
];

const inputCls =
  "w-full bg-[#262626] text-white rounded px-3 py-2.5 sm:py-2 outline-none mt-1 text-sm focus:ring-1 focus:ring-[#f6b100]";

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
  const [busy, setBusy] = useState("");

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

  const [showEmail, setShowEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");

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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#262626] border border-[#333] text-[#f5f5f5] rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium w-full sm:w-auto"
      >
        <FaFilePdf className="text-[#e6402e] shrink-0" /> <span className="truncate">Generate report</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Profit & expense report">
        {/* ---- Scope picker ---- */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SCOPES.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setScope(opt.key)}
              className={`flex-1 min-w-[30%] rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium ${
                scope === opt.key ? "bg-[#f6b100] text-[#1a1a1a]" : "bg-[#262626] text-[#ababab]"
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

        {/* ---- Actions ---- */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDownload}
            disabled={busy !== ""}
            className="flex-1 flex items-center justify-center gap-2 bg-[#262626] hover:bg-[#333] text-white rounded-md px-4 py-2.5 sm:py-2 text-sm font-medium disabled:opacity-60"
          >
            <FaFilePdf /> {busy === "download" ? "Generating…" : "Download PDF"}
          </button>
        </div>

        {/* ---- Optional email delivery ---- */}
        <button
          onClick={() => setShowEmail((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-[#ababab] hover:text-[#f5f5f5] mt-4"
        >
          {showEmail ? <FaChevronUp /> : <FaChevronDown />} Send by email
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

      </Modal>
    </>
  );
};

export default ReportSender;
