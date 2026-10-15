import React, { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https";
import { isEarnedOrder, orderTotal, formatCurrency } from "../../utils/orderMetrics";

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

const StatBox = ({ label, value, color, sub }) => (
  <div className="rounded-lg p-4" style={{ backgroundColor: color }}>
    <p className="font-medium text-xs text-[#f5f5f5]">{label}</p>
    <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">Rs {formatCurrency(value)}</p>
    {sub && <p className="mt-1 text-[11px] text-[#f5f5f5]/80">{sub}</p>}
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
      <div className="container mx-auto py-2 px-6 md:px-4 text-red-400 text-sm">
        Couldn't load orders — check the connection to the server and try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">Payments</h2>
          <p className="text-sm text-[#ababab]">
            Every collected payment — cash, card and cash-on-delivery — across the POS and online store.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRange(opt.key)}
              className={`text-xs font-semibold px-3 py-2 rounded-md ${
                range === opt.key ? "bg-[#262626] text-[#f5f5f5]" : "bg-[#1a1a1a] text-[#ababab] hover:bg-[#262626]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-[#ababab] text-sm mt-6">Loading payments…</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatBox
              label={`Total collected (${RANGE_OPTIONS.find((o) => o.key === range)?.label.toLowerCase()})`}
              value={totalCollected}
              color="#025cca"
              sub={`${filtered.length} paid order${filtered.length === 1 ? "" : "s"}`}
            />
            <StatBox label="Collected today" value={totalToday} color="#02ca3a" />
            <StatBox
              label="Awaiting payment"
              value={orders
                .filter((o) => !isEarnedOrder(o) && o.orderStatus !== "Cancelled")
                .reduce((sum, o) => sum + orderTotal(o), 0)}
              color="#f6b100"
              sub="Online orders not yet delivered"
            />
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-[#f5f5f5] mb-3">By payment method</h3>
            {byMethod.length === 0 ? (
              <p className="text-[#7a7a7a] text-sm">No paid orders in this range yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {byMethod.map((m) => (
                  <div key={m.method} className="bg-[#1a1a1a] rounded-lg p-4">
                    <p className="text-[#ababab] text-xs">{methodLabel(m.method)}</p>
                    <p className="text-[#f5f5f5] text-xl font-semibold mt-1">Rs {formatCurrency(m.amount)}</p>
                    <p className="text-[#7a7a7a] text-xs mt-1">
                      {m.count} order{m.count === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 bg-[#1a1a1a] rounded-lg p-4">
            <h3 className="font-semibold text-[#f5f5f5] mb-3">Recent payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#f5f5f5]">
                <thead className="text-[#ababab] border-b border-[#333]">
                  <tr>
                    <th className="py-2 pr-3">Date &amp; time</th>
                    <th className="py-2 pr-3">Customer</th>
                    <th className="py-2 pr-3">Source</th>
                    <th className="py-2 pr-3">Method</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-[#7a7a7a]">
                        No payments in this range yet.
                      </td>
                    </tr>
                  )}
                  {recent.map((o) => (
                    <tr key={o._id} className="border-b border-[#262626]">
                      <td className="py-2 pr-3 text-[#ababab]">
                        {new Date(o.orderDate || o.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-2 pr-3">{o.customerDetails?.name || "—"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{o.orderSource === "Online" ? "🌐 Online" : "🧾 POS"}</td>
                      <td className="py-2 pr-3 text-[#ababab]">{methodLabel(o.paymentMethod)}</td>
                      <td className="py-2 text-right font-semibold">Rs {formatCurrency(orderTotal(o))}</td>
                    </tr>
                  ))}
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
