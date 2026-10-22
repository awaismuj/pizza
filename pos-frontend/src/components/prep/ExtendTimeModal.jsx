import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { extendPrepTime } from "../../https";
import useNow from "../../hooks/useNow";
import usePrepSettings from "../../hooks/usePrepSettings";
import { formatLocalTime, getPrepState, orderLabel } from "../../utils/prepTimer";

const QUICK = [5, 10, 15, 20];

// "Extend preparation time" popup for ONE order. The server does the real
// work (and records who/when/why); this just collects minutes and a reason.
const ExtendTimeModal = ({ order, onClose }) => {
  const queryClient = useQueryClient();
  const { timezone } = usePrepSettings();
  const now = useNow();
  const st = getPrepState(order, now);
  const [picked, setPicked] = useState(10);
  const [custom, setCustom] = useState("");
  const [reason, setReason] = useState("");

  const minutes = custom.trim() !== "" ? Number(custom) : picked;
  const valid = Number.isInteger(minutes) && minutes >= 1 && minutes <= 180;

  const mutation = useMutation({
    mutationFn: extendPrepTime,
    onSuccess: (res) => {
      const updated = res?.data?.data;
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      enqueueSnackbar(
        `Order #${orderLabel(order)} extended by ${minutes} minutes. New preparation deadline: ${formatLocalTime(updated?.prep?.deadline, timezone)}.`,
        { variant: "success" }
      );
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Couldn't extend this order.", { variant: "error" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (st.phase !== "running") {
    // Order finished while the popup was open.
    return null;
  }

  const newDeadline = st.deadline + (valid ? minutes : 0) * 60 * 1000;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Extend preparation time"
        onClick={(e) => e.stopPropagation()}
        className="chef-pop w-full max-w-md overflow-hidden rounded-2xl border border-[#3a3a3a] bg-[#1f1f1f] shadow-2xl"
      >
        <div className="bg-gradient-to-r from-[#f6b100] to-[#fb923c] px-5 py-3">
          <h2 className="text-base font-extrabold tracking-wide text-[#1f1f1f]">🍕 EXTEND PREPARATION TIME</h2>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-[#262626] p-2.5">
              <p className="text-[#8a8a8a]">Order</p>
              <p className="mt-0.5 text-sm font-bold text-[#f5f5f5]">#{orderLabel(order)}</p>
            </div>
            <div className="rounded-xl bg-[#262626] p-2.5">
              <p className="text-[#8a8a8a]">Current deadline</p>
              <p className="mt-0.5 text-sm font-bold text-[#f5f5f5]">{formatLocalTime(st.deadline, timezone)}</p>
            </div>
            <div className="rounded-xl bg-[#262626] p-2.5">
              <p className="text-[#8a8a8a]">{st.overdue ? "Overdue by" : "Remaining"}</p>
              <p className={`mt-0.5 text-sm font-bold tabular-nums ${st.overdue ? "text-[#f87171]" : "text-[#f5f5f5]"}`}>{st.clock}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#f5f5f5]">Choose additional time</p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK.map((m) => {
                const on = custom.trim() === "" && picked === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setPicked(m); setCustom(""); }}
                    className={`rounded-xl border py-2.5 text-sm font-bold transition-colors ${
                      on ? "border-[#f6b100] bg-[#f6b100] text-[#1f1f1f]" : "border-[#3a3a3a] bg-[#262626] text-[#f5f5f5] hover:border-[#f6b100]/60"
                    }`}
                  >
                    +{m} min
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block text-sm text-[#cfcfcf]">
            Or add custom minutes
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={180}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. 7"
              className="mt-1 w-full rounded-lg border border-[#3a3a3a] bg-[#262626] px-3 py-2 text-[#f5f5f5] outline-none focus:border-[#f6b100]"
            />
          </label>

          <label className="block text-sm text-[#cfcfcf]">
            Reason <span className="text-[#7a7a7a]">(optional)</span>
            <input
              type="text"
              maxLength={200}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Oven backed up"
              className="mt-1 w-full rounded-lg border border-[#3a3a3a] bg-[#262626] px-3 py-2 text-[#f5f5f5] outline-none focus:border-[#f6b100]"
            />
          </label>

          <p className="rounded-lg bg-[#262626] px-3 py-2 text-xs text-[#ababab]">
            {valid ? (
              <>New deadline will be <span className="font-bold text-[#f5f5f5]">{formatLocalTime(newDeadline, timezone)}</span> (+{minutes} min).</>
            ) : (
              "Enter a whole number of minutes between 1 and 180."
            )}
          </p>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-[#2a2a2a] py-2.5 font-semibold text-[#cfcfcf] hover:bg-[#333]">
              Cancel
            </button>
            <button
              type="button"
              disabled={!valid || mutation.isPending}
              onClick={() => mutation.mutate({ orderId: order._id, minutes, reason: reason.trim() })}
              className="flex-1 rounded-xl bg-[#02ca3a] py-2.5 font-bold text-[#1f1f1f] disabled:opacity-50"
            >
              {mutation.isPending ? "Extending…" : "Confirm Extension"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendTimeModal;
