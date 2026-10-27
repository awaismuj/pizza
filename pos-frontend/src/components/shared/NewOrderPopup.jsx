import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { motion } from "framer-motion";
import { getOrders, updateOrderStatus } from "../../https";
import { PAYMENT_WAITING } from "../../utils/orderStages";
import { refreshAfterOrderChange } from "../../hooks/useOrderActions";
import { PaymentBadge, PaymentDetails, PaymentActions } from "../orders/PaymentPanel";

// Short two-note chime using the Web Audio API - no audio file needed.
// Browsers block audio until the user has interacted with the page at
// least once, so this can silently no-op on the very first order after
// a fresh page load; the popup itself still shows regardless.
const playChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const tone = (freq, startAt) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startAt);
      osc.stop(ctx.currentTime + startAt + 0.4);
    };
    tone(880, 0);
    tone(1175, 0.18);
    setTimeout(() => ctx.close(), 900);
  } catch (err) {
    // Audio not available / blocked - ignore, the visual popup is enough.
  }
};

// App-wide popup that alerts staff the instant a new order comes in from
// genzpizza.online, wherever they are in the POS. Polls the shared "orders"
// query, queues up any Pending online orders it hasn't shown yet, and lets
// staff Accept or Decline right from the popup.
const NewOrderPopup = () => {
  const { isAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [queue, setQueue] = useState([]);
  const seenIds = useRef(new Set());
  const isFirstLoad = useRef(true);
  const chimeInterval = useRef(null);

  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: isAuth,
    // This is the alert for a new order, so it keeps checking every few
    // seconds even while the POS tab is in the background, and checks again
    // the moment staff switch back to it.
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: "always",
  });

  useEffect(() => {
    const orders = resData?.data?.data ?? [];
    // New online orders (Pending) AND JazzCash/Raast payments waiting to be
    // verified both trigger the alert.
    const pending = orders.filter(
      (o) => o.orderSource === "Online" && (o.orderStatus === "Pending" || o.orderStatus === PAYMENT_WAITING)
    );

    if (isFirstLoad.current) {
      // Don't fire a popup for every order that was already sitting there
      // when the app was opened/refreshed - just mark them as already seen.
      pending.forEach((o) => seenIds.current.add(o._id));
      isFirstLoad.current = false;
      return;
    }

    const fresh = pending.filter((o) => !seenIds.current.has(o._id));
    if (fresh.length > 0) {
      fresh.forEach((o) => seenIds.current.add(o._id));
      setQueue((prev) => [...prev, ...fresh]);
    }

    // If an order stopped being Pending (e.g. handled from the Online
    // Orders page directly, in another tab), drop it from the queue too.
    setQueue((prev) => prev.filter((q) => pending.some((p) => p._id === q._id)));
  }, [resData]);

  const current = queue[0];
  const role = useSelector((state) => state.user.role);
  const isPaymentAlert = current?.orderStatus === PAYMENT_WAITING;

  useEffect(() => {
    if (!current) return;
    playChime();
    chimeInterval.current = setInterval(playChime, 6000);
    return () => clearInterval(chimeInterval.current);
  }, [current?._id]);

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (_response, { orderStatus }) => {
      refreshAfterOrderChange(queryClient, orderStatus);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to update order.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleDecide = (orderStatus) => {
    if (!current || statusMutation.isPending) return;
    statusMutation.mutate(
      { orderId: current._id, orderStatus },
      {
        onSuccess: () => {
          enqueueSnackbar(
            orderStatus === "Accepted" ? "Order accepted" : "Order declined",
            { variant: orderStatus === "Accepted" ? "success" : "default" }
          );
          setQueue((prev) => prev.slice(1));
          if (orderStatus === "Accepted" && location.pathname !== "/online-orders") {
            navigate("/online-orders");
          }
        },
      }
    );
  };

  // Accept (stock is deducted here) and send straight to processing.
  const handleAcceptAndProcess = async () => {
    if (!current || statusMutation.isPending) return;
    const orderId = current._id;
    try {
      await statusMutation.mutateAsync({ orderId, orderStatus: "Accepted" });
      await statusMutation.mutateAsync({ orderId, orderStatus: "Preparing" });
      enqueueSnackbar("Order accepted and sent to processing", { variant: "success" });
      setQueue((prev) => prev.filter((q) => q._id !== orderId));
      if (location.pathname !== "/online-orders") navigate("/online-orders");
    } catch {
      // onError already showed the reason (e.g. not enough stock).
    }
  };

  if (!current) return null;

  const total = current.bills?.totalWithTax;

  // Payment alerts: screenshot, TID, amount and customer in one place, with
  // Verify & Accept / Reject Payment right here.
  if (isPaymentAlert) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="my-auto w-full max-w-lg overflow-hidden rounded-xl border border-[#f6b100] bg-[#1f1f1f] shadow-2xl"
        >
          <div className="flex items-center justify-between bg-[#f6b100] px-5 py-3">
            <h2 className="text-lg font-bold text-[#1f1f1f]">Payment to Verify · JazzCash/Raast</h2>
            {queue.length > 1 && (
              <span className="rounded-full bg-[#1f1f1f]/20 px-2 py-0.5 text-xs font-semibold text-[#1f1f1f]">
                +{queue.length - 1} more waiting
              </span>
            )}
          </div>

          <div className="max-h-[78vh] overflow-y-auto px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#f5f5f5]">{current.customerDetails?.name}</h3>
              <span className="text-xs text-[#ababab]">{new Date(current.orderDate).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-[#ababab]">{current.customerDetails?.phone}</p>
            {current.customerDetails?.address && (
              <p className="mt-1 text-xs text-[#ababab]">{current.customerDetails.address}</p>
            )}
            <PaymentBadge order={current} />

            <PaymentDetails order={current} proofClassName="max-h-64" />

            <ul className="mt-3 max-h-28 space-y-1 overflow-y-auto text-sm text-[#f5f5f5]">
              {(current.items || []).map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <PaymentActions
              order={current}
              role={role}
              onDone={(result) => {
                setQueue((prev) => prev.filter((q) => q._id !== current._id));
                if (result === "verified" && location.pathname !== "/online-orders") navigate("/online-orders");
              }}
            />
            <button
              type="button"
              onClick={() => setQueue((prev) => prev.slice(1))}
              className="mt-2 w-full rounded-lg bg-[#2a2a2a] py-2 text-sm font-semibold text-[#ababab] hover:bg-[#333]"
            >
              Review later (find it under Online Orders → Verify Payment)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md overflow-hidden rounded-xl border border-[#f6b100] bg-[#1f1f1f] shadow-2xl"
      >
        <div className="flex items-center justify-between bg-[#f6b100] px-5 py-3">
          <h2 className="text-lg font-bold text-[#1f1f1f]">New Online Order</h2>
          {queue.length > 1 && (
            <span className="rounded-full bg-[#1f1f1f]/20 px-2 py-0.5 text-xs font-semibold text-[#1f1f1f]">
              +{queue.length - 1} more waiting
            </span>
          )}
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#f5f5f5]">{current.customerDetails?.name}</h3>
            <span className="text-xs text-[#ababab]">
              {new Date(current.orderDate).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-xs text-[#ababab]">{current.customerDetails?.phone}</p>
          {current.customerDetails?.address && (
            <p className="mt-1 text-xs text-[#ababab]">{current.customerDetails.address}</p>
          )}

          <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto text-sm text-[#f5f5f5]">
            {(current.items || []).map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between border-t border-[#383838] pt-2">
            <span className="text-sm text-[#ababab]">Total</span>
            <span className="font-semibold text-[#f5f5f5]">
              Rs {typeof total === "number" ? total.toFixed(2) : "-"}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => handleDecide("Cancelled")}
              disabled={statusMutation.isPending}
              className="flex-1 rounded-lg bg-[#be3e3f] py-3 font-semibold text-[#f5f5f5] disabled:opacity-60"
            >
              {statusMutation.isPending && statusMutation.variables?.orderStatus === "Cancelled" ? "Declining…" : "Decline"}
            </button>
            <button
              onClick={() => handleDecide("Accepted")}
              disabled={statusMutation.isPending}
              className="flex-1 rounded-lg bg-[#2e4a40] py-3 font-semibold text-[#02ca3a] disabled:opacity-60"
            >
              {statusMutation.isPending && statusMutation.variables?.orderStatus === "Accepted" ? "Accepting…" : "Accept"}
            </button>
            <button
              onClick={handleAcceptAndProcess}
              disabled={statusMutation.isPending}
              className="w-full rounded-lg bg-[#02ca3a] py-3 font-semibold text-[#1f1f1f] disabled:opacity-60"
            >
              {statusMutation.isPending ? "Working…" : "Accept & Send to Processing"}
            </button>
          </div>
        </div>
        </motion.div>
      </div>
    );
};

export default NewOrderPopup;
