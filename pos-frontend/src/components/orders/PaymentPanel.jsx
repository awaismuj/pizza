import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { verifyOrderPayment, rejectOrderPayment, getPaymentProofBlob } from "../../https";
import { canVerifyPayment } from "../../utils/orderPermissions";
import { PM_JAZZ, paymentKind, paymentKindLabel, PAYMENT_STATUS_STYLE } from "../../utils/payments";

// Small badge: "JazzCash/Raast · Verified" / "Cash on Delivery".
export const PaymentBadge = ({ order }) => {
  const kind = paymentKind(order);
  if (kind === "pos") return null;
  const status = order.paymentStatus;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
      <span className="rounded-md bg-[#2a2a2a] px-2 py-0.5 text-[#f5f5f5]">{paymentKindLabel(order)}</span>
      {status && (
        <span className={`rounded-md px-2 py-0.5 ${PAYMENT_STATUS_STYLE[status] || "bg-[#333] text-[#ababab]"}`}>
          {status}
        </span>
      )}
      {kind === "jazz" && order.jazzcash?.tid && (
        <span className="rounded-md bg-[#2a2a2a] px-2 py-0.5 text-[#ababab]">TID {order.jazzcash.tid}</span>
      )}
    </div>
  );
};

// The payment screenshot is private (staff cookie only), so it's fetched
// as a blob and shown from an object URL.
export const PaymentProofImage = ({ orderId, className = "" }) => {
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    let url = "";
    let cancelled = false;
    setSrc("");
    setFailed(false);
    getPaymentProofBlob(orderId)
      .then((res) => {
        if (cancelled) return;
        url = URL.createObjectURL(res.data);
        setSrc(url);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [orderId]);

  if (failed) return <p className="text-xs text-[#e6402e]">Couldn't load the screenshot.</p>;
  if (!src) return <div className={`animate-pulse rounded-lg bg-[#333] ${className}`} style={{ minHeight: 120 }} />;

  return (
    <>
      <button type="button" onClick={() => setZoom(true)} className="block w-full" aria-label="Enlarge payment screenshot">
        <img src={src} alt="Customer payment screenshot" className={`w-full rounded-lg object-contain bg-black ${className}`} />
      </button>
      {zoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4" onClick={() => setZoom(false)}>
          <img src={src} alt="Payment screenshot, enlarged" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}
    </>
  );
};

const row = "flex items-start justify-between gap-3 text-sm";

// What staff need to verify a JazzCash/Raast payment: amount, TID, sender,
// customer and the screenshot.
export const PaymentDetails = ({ order, showScreenshot = true, proofClassName = "max-h-72" }) => {
  if (order?.paymentMethod !== PM_JAZZ) return null;
  const jz = order.jazzcash || {};
  const amount = jz.amount ?? order.bills?.totalWithTax;
  return (
    <div className="mt-3 rounded-lg border border-[#f6b100]/40 bg-[#2b2618] p-3">
      <div className={row}>
        <span className="text-[#ababab]">Amount to match</span>
        <span className="text-lg font-bold text-[#f6b100]">Rs {Number(amount || 0).toFixed(2)}</span>
      </div>
      <div className={row}>
        <span className="text-[#ababab]">TID</span>
        <span className="break-all font-mono font-semibold text-[#f5f5f5]">{jz.tid || "-"}</span>
      </div>
      <div className={row}>
        <span className="text-[#ababab]">Sender</span>
        <span className="text-right text-[#f5f5f5]">{jz.senderInfo || "-"}</span>
      </div>
      {showScreenshot && jz.proofId && (
        <div className="mt-3">
          <PaymentProofImage orderId={order._id} className={proofClassName} />
          <p className="mt-1 text-center text-[10px] text-[#8a8a8a]">Tap the screenshot to enlarge</p>
        </div>
      )}
    </div>
  );
};

const REASONS = ["Payment not received", "Amount doesn't match", "TID not found", "Screenshot unclear"];

// Verify & Accept / Reject Payment. Rejecting asks for a reason, restores
// the reserved stock (server side) and shows the reason to the customer.
export const PaymentActions = ({ order, role, onDone, compact = false }) => {
  const queryClient = useQueryClient();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const refresh = () => {
    queryClient.invalidateQueries(["orders"]);
    queryClient.invalidateQueries(["inventory"]);
    queryClient.invalidateQueries(["low-stock"]);
    queryClient.invalidateQueries(["dailyProfit"]);
    queryClient.invalidateQueries(["monthlyProfit"]);
  };
  const onError = (error) =>
    enqueueSnackbar(error?.response?.data?.message || "Something went wrong. Please try again.", { variant: "error" });

  const verify = useMutation({
    mutationFn: () => verifyOrderPayment(order._id),
    onSuccess: () => {
      refresh();
      enqueueSnackbar("Payment verified — order accepted", { variant: "success" });
      onDone?.("verified");
    },
    onError,
  });
  const reject = useMutation({
    mutationFn: () => rejectOrderPayment({ orderId: order._id, reason: reason.trim() }),
    onSuccess: () => {
      refresh();
      enqueueSnackbar("Payment rejected — stock released", { variant: "default" });
      onDone?.("rejected");
    },
    onError,
  });

  if (!canVerifyPayment(role)) {
    return (
      <p className="mt-3 rounded-lg bg-[#2a2a2a] p-2 text-center text-xs text-[#ababab]">
        A Cashier or Admin needs to verify this payment.
      </p>
    );
  }

  const busy = verify.isPending || reject.isPending;

  if (rejecting) {
    return (
      <div className="mt-3 space-y-2">
        <label className="block text-xs font-semibold text-[#ababab]">
          Reason (the customer will see this)
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 200))}
            rows={2}
            autoFocus
            className="mt-1 w-full rounded-lg border border-[#444] bg-[#1a1a1a] p-2 text-sm text-[#f5f5f5] outline-none focus:border-[#be3e3f]"
            placeholder="e.g. Payment not received in our account"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {REASONS.map((r) => (
            <button key={r} type="button" onClick={() => setReason(r)} className="rounded-full bg-[#333] px-2.5 py-1 text-[11px] text-[#f5f5f5] hover:bg-[#444]">
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setRejecting(false)} disabled={busy} className="flex-1 rounded-lg bg-[#333] py-2.5 font-semibold text-[#f5f5f5] disabled:opacity-60">
            Back
          </button>
          <button
            type="button"
            onClick={() => reject.mutate()}
            disabled={busy || reason.trim().length < 3}
            className="flex-1 rounded-lg bg-[#be3e3f] py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {reject.isPending ? "Rejecting…" : "Confirm reject"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-3 flex gap-2 ${compact ? "" : "flex-wrap"}`}>
      <button
        type="button"
        onClick={() => setRejecting(true)}
        disabled={busy}
        className="flex-1 rounded-lg bg-[#be3e3f] py-2.5 font-semibold text-white disabled:opacity-60"
      >
        Reject Payment
      </button>
      <button
        type="button"
        onClick={() => verify.mutate()}
        disabled={busy}
        className="flex-1 rounded-lg bg-[#02ca3a] py-2.5 font-semibold text-[#1f1f1f] disabled:opacity-60"
      >
        {verify.isPending ? "Verifying…" : "Verify & Accept"}
      </button>
    </div>
  );
};
