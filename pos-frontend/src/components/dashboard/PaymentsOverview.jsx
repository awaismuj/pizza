import React, { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https";
import { isEarnedOrder, orderTotal, formatCurrency } from "../../utils/orderMetrics";
import { I } from "../shared/AppIcons";

const pad2 = (n) => String(n).padStart(2, "0");
const dayKeyOf = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const todayKey = () => dayKeyOf(new Date());

// Every payment method actually used across the app — "Cash", "Online"
// (Razorpay, from the POS) and "Cash on Delivery" (from genzpizza.online).
const METHOD_LABELS = {
  Cash: "Cash",
  Online: "Card / Online (Razorpay)",
  "Cash on Delivery": "Cash on Delivery (Online orders)",
};
const methodLabel = (method) => METHOD_LABELS[method] || method || "Unspecified";

const StatBox = ({ label, value, sub, accentBorder, badgeBg }) => (
  <div className={`pos-metric-card ${accentBorder || "border-l-4 border-l-amber-500"} flex flex-col justify-between`}>
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">Rs {formatCurrency(value)}</p>
    </div>
    {sub && (
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
        <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md ${badgeBg || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
          {sub}
        </span>
      </div>
    )}
  </div>
);

const RANGE_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "all", label: "All time" },
];

const PaymentsOverview = () => {
  const [range, setRange] = useState("7d");

  const { data: ordersData, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: keepPreviousData,
  });

  const orders = ordersData?.data?.data ?? [];

  // POS orders (dine-in + Outdoor/Takeaway) are paid at the register the
  // moment they're placed, so they count as soon as they exist; online
  // orders only count once actually delivered ("Completed").
  const paidOrders = useMemo(
    () => orders.filter((o) => isEarnedOrder(o)),
    [orders]
  );

  const rangeStart = useMemo(() => {
    const now = new Date();
    if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (range === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (range === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return null; // all time
  }, [range]);

  const filtered = useMemo(() => {
    if (!rangeStart) return paidOrders;
    return paidOrders.filter((o) => new Date(o.orderDate || o.createdAt) >= rangeStart);
  }, [paidOrders, rangeStart]);

  const totalCollected = filtered.reduce((sum, o) => sum + orderTotal(o), 0);
  const totalToday = paidOrders
    .filter((o) => dayKeyOf(new Date(o.orderDate || o.createdAt)) === todayKey())
    .reduce((sum, o) => sum + orderTotal(o), 0);

  const byMethod = useMemo(() => {
    const map = {};
    filtered.forEach((o) => {
      const key = o.paymentMethod || "Unspecified";
      if (!map[key]) map[key] = { amount: 0, count: 0 };
      map[key].amount += orderTotal(o);
      map[key].count += 1;
    });
    return Object.entries(map)
      .map(([method, v]) => ({ method, ...v }))
      .sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const recent = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
        .slice(0, 12),
    [filtered]
  );

  if (isError) {
    return (
<<<<<<< HEAD
      <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-600 dark:text-rose-400 text-sm">
=======
      <div className="mx-auto w-full py-2 px-6 md:px-4 text-red-400 text-sm">
>>>>>>> origin/main
        Couldn't load orders — check the connection to the server and try again.
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-6">
=======
    <div className="mx-auto w-full py-2 px-6 md:px-4">
>>>>>>> origin/main
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight">Payments & Settlement</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every collected payment — cash, card and cash-on-delivery — across the POS and online store.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRange(opt.key)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                range === opt.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-slate-400 text-sm">Loading payments…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatBox
              label={`Total collected (${RANGE_OPTIONS.find((o) => o.key === range)?.label.toLowerCase()})`}
              value={totalCollected}
              accentBorder="border-l-4 border-l-emerald-500"
              sub={`${filtered.length} paid order${filtered.length === 1 ? "" : "s"}`}
              badgeBg="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
            />
            <StatBox
              label="Collected today"
              value={totalToday}
              accentBorder="border-l-4 border-l-sky-500"
              sub="Live registered receipts"
              badgeBg="bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
            />
            <StatBox
              label="Awaiting payment"
              value={orders
                .filter((o) => !isEarnedOrder(o) && o.orderStatus !== "Cancelled")
                .reduce((sum, o) => sum + orderTotal(o), 0)}
              accentBorder="border-l-4 border-l-amber-500"
              sub="Online orders in dispatch"
              badgeBg="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
            />
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">By payment method</h3>
            {byMethod.length === 0 ? (
              <p className="text-slate-400 text-sm">No paid orders in this range yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {byMethod.map((m) => (
                  <div key={m.method} className="pos-card p-4">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{methodLabel(m.method)}</p>
                    <p className="text-slate-900 dark:text-white text-xl font-black mt-1">Rs {formatCurrency(m.amount)}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {m.count} order{m.count === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pos-card p-5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
                <thead className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Order</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    recent.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          #{(order._id || "").slice(-6).toUpperCase()}
                        </td>
                        <td className="py-2.5 px-3 font-semibold">{order.orderType || "Dine-in"}</td>
                        <td className="py-2.5 px-3">{methodLabel(order.paymentMethod)}</td>
                        <td className="py-2.5 px-3">{order.customerDetails?.name || "Walk-in Guest"}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                          Rs {formatCurrency(orderTotal(order))}
                        </td>
                      </tr>
                    ))
                  )}
<<<<<<< HEAD
=======
                  {recent.map((o) => (
                    <tr key={o._id} className="border-b border-[#262626]">
                      <td className="py-2 pr-3 text-[#ababab]">
                        {new Date(o.orderDate || o.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-2 pr-3">{o.customerDetails?.name || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]"><span className="inline-flex items-center gap-1.5">{o.orderSource === "Online" ? <><I.Cart /> Online</> : <><I.Store /> POS</>}</span></td>
                      <td className="py-2 pr-3 text-[#ababab]">{methodLabel(o.paymentMethod)}</td>
                      <td className="py-2 text-right font-semibold">Rs {formatCurrency(orderTotal(o))}</td>
                    </tr>
                  ))}
>>>>>>> origin/main
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsOverview;

