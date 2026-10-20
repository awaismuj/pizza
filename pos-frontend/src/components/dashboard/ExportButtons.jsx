import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { blobErrorMessage, filenameFromResponse, saveBlob } from "../../utils/download";

const FORMATS = [
  { key: "csv", label: "CSV", hint: "Plain data" },
  { key: "xlsx", label: "Excel", hint: ".xlsx" },
  { key: "pdf", label: "PDF", hint: "Print-ready" },
];

// Three download buttons (CSV / Excel / PDF). `request(format)` must return
// an axios response made with responseType "blob".
const ExportButtons = ({ request, fallbackName, disabled = false, label = "Export" }) => {
  const [busy, setBusy] = useState("");

  const run = async (format) => {
    setBusy(format);
    try {
      const response = await request(format);
      saveBlob(response.data, filenameFromResponse(response, `${fallbackName}.${format}`));
    } catch (error) {
      enqueueSnackbar(await blobErrorMessage(error, "Could not export this report."), { variant: "error" });
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={label}>
      <span className="hidden text-xs font-semibold uppercase tracking-wide text-[#8a8a8a] sm:inline">{label}</span>
      <div className="inline-flex overflow-hidden rounded-lg border border-[#454545]">
        {FORMATS.map((format, index) => (
          <button
            key={format.key}
            type="button"
            disabled={disabled || Boolean(busy)}
            onClick={() => run(format.key)}
            title={`Download as ${format.label} (${format.hint})`}
            className={`px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-50 ${index > 0 ? "border-l border-[#454545]" : ""}`}
          >
            {busy === format.key ? "…" : format.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExportButtons;
