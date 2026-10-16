import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { motion } from "framer-motion";
import { getOrders, updateOrderStatus } from "../../https";

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
    refetchInterval: 10000,
  });

  useEffect(() => {
    const orders = resData?.data?.data ?? [];
    const pending = orders.filter(
      (o) => o.orderSource === "Online" && o.orderStatus === "Pending"
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

  useEffect(() => {
    if (!current) return;
    playChime();
    chimeInterval.current = setInterval(playChime, 6000);
    return () => clearInterval(chimeInterval.current);
  }, [current?._id]);

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["low-stock"]);
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

    return createPortal(
      <div className="pos-modal-backdrop">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pos-modal-card max-w-md p-6 border-amber-400 dark:border-amber-500 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">New Online Order</h2>
            </div>
            {queue.length > 1 && (
              <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                +{queue.length - 1} more waiting
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{current.customerDetails?.name}</h3>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {new Date(current.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{current.customerDetails?.phone}</p>
            {current.customerDetails?.address && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                📍 {current.customerDetails.address}
              </p>
            )}

            <ul className="mt-3 max-h-36 space-y-1 overflow-y-auto pr-1 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-2">
              {(current.items || []).map((item, idx) => (
                <li key={idx} className="flex justify-between py-0.5">
                  <span className="font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-mono font-semibold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total</span>
              <span className="font-black font-mono text-base text-amber-600 dark:text-amber-400">
                Rs {typeof total === "number" ? total.toFixed(2) : "-"}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => handleDecide("Cancelled")}
                disabled={statusMutation.isPending}
                className="flex-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 py-3 font-bold text-xs text-rose-600 dark:text-rose-400 transition disabled:opacity-60"
              >
                Decline
              </button>
              <button
                onClick={() => handleDecide("Accepted")}
                disabled={statusMutation.isPending}
                className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-3 font-bold text-xs text-slate-800 dark:text-slate-200 transition disabled:opacity-60"
              >
                Accept Only
              </button>
              <button
                onClick={handleAcceptAndProcess}
                disabled={statusMutation.isPending}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 font-black text-xs text-white shadow-md shadow-emerald-600/20 transition disabled:opacity-60"
              >
                Accept &amp; Send to Processing
              </button>
            </div>
          </div>
        </motion.div>
      </div>,
      document.body
    );
  };

export default NewOrderPopup;
