import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrders } from "../../https";
import useNow from "../../hooks/useNow";
import usePrepSettings from "../../hooks/usePrepSettings";
import { canExtendPrep } from "../../utils/orderPermissions";
import { isPrepActive } from "../../utils/prepTimer";
import { playChime } from "../../utils/prepSound";
import PrepAlertCard from "./PrepAlertCard";
import ExtendTimeModal from "./ExtendTimeModal";

// How alerts avoid spamming:
//  * The SERVER stamps each level once per deadline (prep.alerts.<level>), so
//    every screen agrees on what has fired; an extension re-arms only the
//    levels that are in the future again.
//  * This device remembers which stamps it has already shown in localStorage
//    (shared by all tabs on this browser), so refreshing the page or opening
//    another tab never repeats a popup. Another terminal has its own storage
//    and shows each alert once too.
//  * Closing a popup only hides it here - it never touches the order timer.
//  * If several levels were crossed at once (e.g. page opened late), only the
//    most urgent one is shown.
const SEEN_KEY = "genz.prep.alertsSeen.v1";
const SOUND_KEY = "genz.prep.sound";
const STALE_MS = 10 * 60 * 1000; // ignore alerts raised long before this screen looked
const AUTO_HIDE_MS = 30 * 1000;
const SEVERITY = ["overdue", "warn3", "warn2", "warn1"];

const readSeen = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return Object.fromEntries(Object.entries(raw).filter(([, ts]) => ts > cutoff));
  } catch {
    return {};
  }
};
const writeSeen = (seen) => {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    /* storage unavailable: worst case an alert shows again after refresh */
  }
};
const readSound = (fallback) => {
  try {
    const v = localStorage.getItem(SOUND_KEY);
    return v === null ? fallback : v === "on";
  } catch {
    return fallback;
  }
};

const stampKey = (order, level) => `${order._id}:${level}:${new Date(order.prep.alerts[level]).getTime()}`;

// Is this alert still true right now? (Guards against a stale one when the
// order was just extended, readied or cancelled on another screen.)
const stillValid = (order, level, settings, nowMs) => {
  if (!isPrepActive(order) || !order.prep.alerts?.[level]) return false;
  const rem = new Date(order.prep.deadline).getTime() - nowMs;
  if (level === "overdue") return settings.alerts.overdue.enabled && rem <= 0;
  const cfg = settings.alerts[level];
  return cfg.enabled && rem <= cfg.minutes * 60 * 1000;
};

const PrepAlertCenter = () => {
  const { isAuth, role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const settings = usePrepSettings();
  const now = useNow();
  const [queue, setQueue] = useState([]); // [{ id, orderId, level }]
  const [soundOn, setSoundOn] = useState(() => readSound(true));
  const [extending, setExtending] = useState(null);

  // Same query/key as the rest of the app (10s poll), so no extra requests.
  const { data } = useQuery({ queryKey: ["orders"], queryFn: getOrders, enabled: isAuth, refetchInterval: 10000 });
  const orders = useMemo(() => data?.data?.data ?? [], [data]);

  // Honour the admin's default until this device chooses otherwise.
  useEffect(() => {
    try {
      if (localStorage.getItem(SOUND_KEY) === null) setSoundOn(settings.soundEnabled);
    } catch {
      /* ignore */
    }
  }, [settings.soundEnabled]);

  // Find new alerts whenever fresh order data arrives.
  useEffect(() => {
    if (!isAuth || !settings.enabled || !settings.mascotEnabled) return;
    const nowMs = Date.now();
    const seen = readSeen();
    const fresh = [];

    for (const order of orders) {
      if (!isPrepActive(order)) continue;
      const level = SEVERITY.find((l) => order.prep.alerts?.[l] && stillValid(order, l, settings, nowMs));
      if (!level) continue;
      const id = stampKey(order, level);
      // Whatever was crossed on the way counts as handled for this order.
      let isNew = !seen[id];
      for (const l of SEVERITY) {
        if (order.prep.alerts?.[l]) {
          const k = stampKey(order, l);
          if (!seen[k]) seen[k] = nowMs;
        }
      }
      const age = nowMs - new Date(order.prep.alerts[level]).getTime();
      // Alerts raised long before this screen looked (e.g. just logged in) are
      // recorded as handled instead of replayed; the queue still shows them red.
      if (isNew && age > STALE_MS) isNew = false;
      if (isNew) fresh.push({ id, orderId: order._id, level });
    }

    writeSeen(seen);
    if (fresh.length) {
      // Most urgent first.
      fresh.sort((a, b) => SEVERITY.indexOf(a.level) - SEVERITY.indexOf(b.level));
      setQueue((q) => [...q, ...fresh.filter((f) => !q.some((x) => x.id === f.id))]);
    }
  }, [orders, settings, isAuth]);

  // Drop queued alerts that stopped being true (extended, ready, cancelled...).
  const live = useMemo(() => {
    const nowMs = now;
    return queue.filter((a) => {
      const order = orders.find((o) => o._id === a.orderId);
      return order && stillValid(order, a.level, settings, nowMs);
    });
  }, [queue, orders, settings, now]);
  useEffect(() => {
    if (live.length !== queue.length) setQueue(live);
  }, [live, queue.length]);

  const current = live[0];
  const currentOrder = current ? orders.find((o) => o._id === current.orderId) : null;

  // Sound once per alert shown.
  useEffect(() => {
    if (current && soundOn && settings.soundEnabled) playChime(current.level);
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Gentle auto-hide so an unattended screen doesn't pile up.
  useEffect(() => {
    if (!current) return undefined;
    const t = setTimeout(() => setQueue((q) => q.filter((x) => x.id !== current.id)), AUTO_HIDE_MS);
    return () => clearTimeout(t);
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => {
    if (current) setQueue((q) => q.filter((x) => x.id !== current.id));
  }, [current]);

  const toggleSound = () => {
    setSoundOn((v) => {
      const next = !v;
      try {
        localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      if (next && current) playChime(current.level);
      return next;
    });
  };

  if (!isAuth) return null;

  return (
    <>
      {current && currentOrder && (
        <div className="pointer-events-none fixed inset-x-3 bottom-24 z-[90] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end">
          <div className="pointer-events-auto w-full max-w-md">
            <PrepAlertCard
              level={current.level}
              order={currentOrder}
              queueCount={live.length - 1}
              soundOn={soundOn && settings.soundEnabled}
              onToggleSound={toggleSound}
              onClose={close}
              onView={() => {
                navigate(currentOrder.orderSource === "Online" ? "/online-orders" : "/orders");
                close();
              }}
              onExtend={canExtendPrep(role) ? () => setExtending(currentOrder) : undefined}
            />
          </div>
        </div>
      )}
      {extending && <ExtendTimeModal order={orders.find((o) => o._id === extending._id) || extending} onClose={() => setExtending(null)} />}
    </>
  );
};

export default PrepAlertCenter;
