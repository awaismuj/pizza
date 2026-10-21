import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { updateOrderStatus } from "../../https";
import useNow from "../../hooks/useNow";
import usePrepSettings from "../../hooks/usePrepSettings";
import { STAGE_LABELS, statusPillClass } from "../../utils/orderStages";
import { canExtendPrep } from "../../utils/orderPermissions";
import { TONES, formatLocalTime, getPrepState, kitchenGroup, orderLabel } from "../../utils/prepTimer";
import ExtendTimeModal from "./ExtendTimeModal";

const INITIAL_VISIBLE = 6;

// What the primary button does for each status without skipping steps of the
// existing lifecycle (e.g. an online order must be Accepted before it can be
// readied, because Accept is when stock is deducted).
const PRIMARY = {
  "In Progress": { to: "Ready", label: "Mark Ready", ready: true },
  Preparing: { to: "Ready to Deliver", label: "Mark Ready", ready: true },
  Pending: { to: "Accepted", label: "Accept" },
  Accepted: { to: "Preparing", label: "Start Preparing" },
};

const SummaryChip = ({ label, value, color, icon }) => (
  <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#2b2b2b] bg-[#1f1f1f] px-3 py-2.5">
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base" style={{ background: `${color}22`, color }}>{icon}</span>
    <div className="min-w-0">
      <p className="text-xl font-bold leading-none tabular-nums text-[#f5f5f5]">{value}</p>
      <p className="mt-1 truncate text-[11px] font-medium text-[#8a8a8a]">{label}</p>
    </div>
  </div>
);

const QueueCard = ({ order, now, timezone, canExtend, onExtend, onAction, busy, onView }) => {
  const st = getPrepState(order, now);
  const tone = TONES[st.tone] || null;
  const isOnline = order.orderSource === "Online";
  const primary = PRIMARY[order.orderStatus];
  const extra = Number(order.prep?.totalExtensionMinutes) || 0;
  const duration = order.prep?.durationMinutes;

  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-2xl border bg-[#1f1f1f] p-4"
      style={{ borderColor: tone ? tone.border : "#2b2b2b" }}
    >
      {tone && <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: tone.bar }} />}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold tracking-wide text-[#f5f5f5]">🍕 ORDER #{orderLabel(order)}</p>
          <p className="mt-0.5 truncate text-sm text-[#cfcfcf]">{order.customerDetails?.name || "Customer"}</p>
        </div>
        <span className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold ${statusPillClass(order.orderStatus)}`}>
          {STAGE_LABELS[order.orderStatus] || order.orderStatus}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8a8a8a]">
        <span className={`rounded-md px-1.5 py-0.5 font-semibold ${isOnline ? "bg-[#2f7de1]/15 text-[#5aa0ff]" : "bg-[#f6b100]/15 text-[#f6b100]"}`}>
          {isOnline ? "Online Store" : order.table?.tableNo ? `POS · Table ${order.table.tableNo}` : "POS · Takeaway"}
        </span>
        <span>Placed {formatLocalTime(order.orderDate || order.createdAt, timezone)}</span>
        {st.deadline && <span>Due {formatLocalTime(st.deadline, timezone)}</span>}
      </div>

      {st.phase === "running" ? (
        <>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#7a7a7a]">{st.overdue ? "Overdue by" : "Time remaining"}</p>
              <p className="text-3xl font-extrabold leading-tight tabular-nums" style={{ color: tone.text }}>{st.clock}</p>
            </div>
            <p className="pb-1 text-right text-[11px] text-[#8a8a8a]">
              Prep time: {duration ? `${Math.round(duration)} min` : "—"}
              {extra > 0 && <span className="block text-[#fb923c]">+{extra} min extended</span>}
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#2b2b2b]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(st.progress * 100)}>
            <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${Math.max(3, st.progress * 100)}%`, background: tone.bar }} />
          </div>
        </>
      ) : st.phase === "ready" ? (
        <p className="mt-3 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: TONES.ready.bg, color: TONES.ready.text }}>
          ✅ Ready{st.readyAt ? ` at ${formatLocalTime(st.readyAt, timezone)}` : ""}
          {st.late === true ? " · late" : st.late === false ? " · on time" : ""}
        </p>
      ) : (
        <p className="mt-3 rounded-lg bg-[#262626] px-3 py-2 text-xs text-[#8a8a8a]">No preparation timer on this order.</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 pt-1">
        <button type="button" onClick={() => onView(order)} className="rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-xs font-semibold text-[#f5f5f5] hover:bg-[#333]">
          View Order
        </button>
        {primary && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(order, primary)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-60 ${primary.ready ? "bg-[#02ca3a] text-[#1f1f1f]" : "bg-[#f6b100] text-[#1f1f1f]"}`}
          >
            {primary.label}
          </button>
        )}
        {canExtend && st.phase === "running" && (
          <button type="button" onClick={() => onExtend(order)} className="rounded-lg border border-[#f6b100]/50 bg-[#f6b100]/10 px-3 py-1.5 text-xs font-bold text-[#f6b100] hover:bg-[#f6b100]/20">
            Extend Time
          </button>
        )}
      </div>
    </article>
  );
};

// 🍕 LIVE KITCHEN QUEUE - every active order from the POS and the online store
// with a live countdown, most urgent first. Time is computed from the saved
// deadline against one shared 1-second clock; data comes from the existing
// 10s orders poll, so there is no per-second request.
const KitchenQueue = ({ orders = [] }) => {
  const now = useNow();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useSelector((state) => state.user.role);
  const { timezone, enabled } = usePrepSettings();
  const [showAll, setShowAll] = useState(false);
  const [extending, setExtending] = useState(null);

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      enqueueSnackbar(`Order is now ${STAGE_LABELS[vars.orderStatus] || vars.orderStatus}`, { variant: "success" });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Failed to update order.", { variant: "error" }),
  });

  const { cards, counts } = useMemo(() => {
    const c = { new: 0, preparing: 0, almost: 0, overdue: 0, ready: 0 };
    const active = [];
    const ready = [];
    for (const o of orders) {
      const g = kitchenGroup(o);
      if (!g) continue;
      if (g === "ready") {
        c.ready += 1;
        ready.push(o);
        continue;
      }
      c[g] += 1;
      active.push(o);
    }
    return { cards: { active, ready }, counts: c };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  // Almost due / overdue change every second, so derive them from `now`.
  const { sorted, almost, overdue } = useMemo(() => {
    let almostN = 0;
    let overdueN = 0;
    const withState = cards.active.map((o) => {
      const st = getPrepState(o, now);
      if (st.phase === "running") {
        if (st.remainingMs <= 0) overdueN += 1;
        else if (st.remainingMs <= 5 * 60 * 1000) almostN += 1;
      }
      return { o, rem: st.phase === "running" ? st.remainingMs : Number.POSITIVE_INFINITY };
    });
    // Most urgent (smallest / most negative remaining) first; orders with no timer last.
    withState.sort((a, b) => a.rem - b.rem || new Date(a.o.orderDate) - new Date(b.o.orderDate));
    return { sorted: withState.map((x) => x.o), almost: almostN, overdue: overdueN };
  }, [cards.active, now]);

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE);
  const readyList = cards.ready.slice(0, showAll ? 12 : 3);
  const canExtend = canExtendPrep(role);

  const onView = (order) => navigate(order.orderSource === "Online" ? "/online-orders" : "/orders");
  const onAction = (order, primary) => statusMutation.mutate({ orderId: order._id, orderStatus: primary.to });
  const cardProps = { now, timezone, canExtend, onExtend: setExtending, onAction, busy: statusMutation.isPending, onView };

  return (
    <section aria-label="Live kitchen queue" className="rounded-2xl border border-[#2b2b2b] bg-gradient-to-b from-[#1d1d1d] to-[#1a1a1a] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold tracking-wide text-[#f5f5f5] sm:text-lg">🍕 LIVE KITCHEN QUEUE</h2>
          <p className="text-xs text-[#7a7a7a]">
            {enabled ? "POS and online orders, most urgent first." : "Countdowns are switched off in settings; new orders get no timer."}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-[#7a7a7a]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#02ca3a]" /> Live
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryChip label="New Orders" value={counts.new} color="#fb923c" icon="🆕" />
        <SummaryChip label="Preparing" value={counts.preparing} color="#f6b100" icon="👨‍🍳" />
        <SummaryChip label="Almost Due" value={almost} color="#fb923c" icon="⏳" />
        <SummaryChip label="Overdue" value={overdue} color="#ef4444" icon="⏰" />
        <SummaryChip label="Ready for Delivery" value={counts.ready} color="#02ca3a" icon="✅" />
      </div>

      {sorted.length === 0 && readyList.length === 0 ? (
        <p className="mt-4 rounded-xl bg-[#222] px-3 py-5 text-center text-sm text-[#8a8a8a]">The kitchen is clear — no orders being prepared. 🍕</p>
      ) : (
        <>
          {sorted.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((order) => (
                <QueueCard key={order._id} order={order} {...cardProps} />
              ))}
            </div>
          )}
          {readyList.length > 0 && (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#02ca3a]">Ready for delivery</p>
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {readyList.map((order) => (
                  <QueueCard key={order._id} order={order} {...cardProps} />
                ))}
              </div>
            </>
          )}
          {(sorted.length > INITIAL_VISIBLE || cards.ready.length > 3) && (
            <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-4 w-full rounded-xl bg-[#262626] py-2 text-sm font-semibold text-[#f6b100] hover:bg-[#2e2e2e]">
              {showAll ? "Show fewer" : `Show all (${sorted.length + cards.ready.length})`}
            </button>
          )}
        </>
      )}

      {extending && <ExtendTimeModal order={orders.find((o) => o._id === extending._id) || extending} onClose={() => setExtending(null)} />}
    </section>
  );
};

export default KitchenQueue;
