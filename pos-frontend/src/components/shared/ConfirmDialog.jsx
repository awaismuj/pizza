import { useEffect } from "react";

// In-app replacement for window.confirm(). The browser's confirm() freezes
// the whole page until it is answered, which feels laggy on a busy POS
// screen; this opens instantly and never blocks the app.
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep",
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-[#3a3a3a] bg-[#1f1f1f] p-5 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-[#f5f5f5]">{title}</h2>
        {message && <p className="mt-2 text-sm text-[#ababab]">{message}</p>}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#2a2a2a] py-2.5 font-semibold text-[#cfcfcf] hover:bg-[#333]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            disabled={busy}
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 font-bold disabled:opacity-60 ${
              danger ? "bg-[#be3e3f] text-[#f5f5f5]" : "bg-[#f6b100] text-[#1f1f1f]"
            }`}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
