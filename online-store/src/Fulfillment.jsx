import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getPublicBranches, quoteFulfillment } from "./api";
import { I } from "./AppIcons.jsx";

/* Delivery / pickup selection for checkout.
   All rules (fees, minimums, hours, restrictions) live on the server; this
   component only asks for a quote and shows the answer, so the website and
   the POS can never disagree. */

const STORE_KEY = "gzp-fulfillment";
const rs = (n) => `Rs. ${Math.round(Number(n) || 0).toLocaleString("en-PK")}`;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fmt12 = (hhmm = "00:00") => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const todayHours = (branch) => {
  const d = new Date().getDay();
  const h = (branch?.hours || []).find((x) => x.day === d);
  return h?.open ? `${fmt12(h.from)} – ${fmt12(h.to)}` : "Closed today";
};

const etaText = (q) => (q && q.etaMin != null ? `${q.etaMin}–${q.etaMax} min` : "");

const readSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
};

/* ------------------------------- hook ------------------------------------ */

export function useFulfillment(subtotal) {
  const saved = useMemo(readSaved, []);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [method, setMethodState] = useState(saved.method || "delivery");
  const [branchId, setBranchId] = useState(saved.branchId || "");
  const [zoneId, setZoneId] = useState(saved.zoneId || "");
  const [address, setAddress] = useState(saved.address || "");
  const [quote, setQuote] = useState(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getPublicBranches();
      setBranches(res.data || []);
    } catch (err) {
      setLoadError(err.message || "Couldn't load branches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the selection valid when branches/zones change on the server.
  useEffect(() => {
    if (!branches.length) return;
    const b = branches.find((x) => x._id === branchId) || branches[0];
    if (b._id !== branchId) setBranchId(b._id);
    const zones = b.delivery.zones;
    if (zoneId && !zones.some((z) => z._id === zoneId)) setZoneId("");
    if (!zoneId && zones.length === 1) setZoneId(zones[0]._id);
  }, [branches, branchId, zoneId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ method, branchId, zoneId, address }));
    } catch {
      /* private mode */
    }
  }, [method, branchId, zoneId, address]);

  const branch = branches.find((b) => b._id === branchId) || null;

  // Ask the server what this choice costs. Debounced so typing/qty changes
  // don't spam it; re-runs whenever method, branch, area or subtotal change.
  useEffect(() => {
    if (!branchId) return undefined;
    let cancelled = false;
    setQuoting(true);
    const t = setTimeout(async () => {
      try {
        const res = await quoteFulfillment({ branchId, method, zoneId, subtotal });
        if (!cancelled) {
          setQuote(res.data);
          setQuoteError("");
        }
      } catch (err) {
        if (!cancelled) {
          setQuote(null);
          setQuoteError(err.message || "Couldn't check delivery details.");
        }
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [branchId, method, zoneId, subtotal]);

  const addressOk = method !== "delivery" || address.trim().length >= 10;
  const ready = !!quote && quote.ok && !quoting && addressOk;
  const fee = quote?.ok ? quote.fee : 0;

  // The one message shown above the Place Order button.
  const blocker = quoteError || (quote && !quote.ok ? quote.error : "") ||
    (method === "delivery" && quote?.ok && !addressOk ? "Enter your full delivery address (house, street, landmark)." : "");

  const payload = () => ({
    method,
    branchId,
    zoneId: method === "delivery" ? zoneId : undefined,
  });

  return {
    branches, branch, loading, loadError, reload: load,
    method, setMethod: (m) => setMethodState(m),
    branchId, setBranchId, zoneId, setZoneId, address, setAddress,
    quote, quoting, fee, ready, blocker, addressOk, payload,
  };
}

/* ------------------------------- picker ---------------------------------- */

const OptionCard = ({ active, onClick, icon: Icon, title, desc, meta, disabled, note }) => (
  <button
    type="button"
    className={`fx-opt${active ? " is-on" : ""}`}
    onClick={onClick}
    disabled={disabled}
    aria-pressed={active}
  >
    <span className="fx-opt-ico"><Icon aria-hidden="true" /></span>
    <span className="fx-opt-body">
      <b>{title}</b>
      <small>{desc}</small>
      {note ? <em className="fx-opt-note">{note}</em> : meta ? <em>{meta}</em> : null}
    </span>
    <span className="fx-opt-tick" aria-hidden="true">{active && <I.Check />}</span>
  </button>
);

export const FulfillmentPicker = ({ f }) => {
  const { branch, branches, method, quote } = f;

  if (f.loading) return <div className="fx-skeleton" aria-busy="true">Loading delivery options…</div>;
  if (f.loadError)
    return (
      <div className="fx-alert is-bad" role="alert">
        <I.Warning aria-hidden="true" />
        <span>
          {f.loadError} <button type="button" className="fx-link" onClick={f.reload}>Try again</button>
        </span>
      </div>
    );
  if (!branch) return <div className="fx-alert is-bad">No branch is accepting orders right now.</div>;

  const dZones = branch.delivery.zones;
  const delivery = branch.delivery;
  const pickup = branch.pickup;
  const deliveryOff = !delivery.enabled || !!delivery.blockedReason;
  const pickupOff = !pickup.enabled || !!pickup.blockedReason;
  const zone = dZones.find((z) => z._id === f.zoneId);

  const deliveryMeta = zone ? `${rs(zone.fee)} · ${zone.travelMinutes + delivery.prepMinutes}+ min` : dZones.length
    ? `From ${rs(Math.min(...dZones.map((z) => z.fee)))}` : "";
  const pickupMeta = `Free · ready in ~${pickup.prepMinutes} min`;

  return (
    <section className="fx" aria-label="Delivery or pickup">
      <h3 className="fx-h">How do you want your order?</h3>

      <div className="fx-opts" role="group" aria-label="Fulfillment method">
        <OptionCard
          active={method === "delivery"}
          onClick={() => f.setMethod("delivery")}
          icon={I.Rider}
          title="Home Delivery"
          desc="A rider brings it to your door"
          meta={deliveryMeta}
          note={deliveryOff ? (delivery.blockedReason || "Unavailable at this branch") : ""}
        />
        <OptionCard
          active={method === "pickup"}
          onClick={() => f.setMethod("pickup")}
          icon={I.Store}
          title="Pickup from Restaurant"
          desc="Collect it fresh from the counter"
          meta={pickupMeta}
          note={pickupOff ? (pickup.blockedReason || "Unavailable at this branch") : ""}
        />
      </div>

      {branches.length > 1 && (
        <div className="fx-block">
          <span className="fx-label">{method === "pickup" ? "Pickup branch" : "Delivering from"}</span>
          <div className="fx-branches" role="radiogroup" aria-label="Branch">
            {branches.map((b) => {
              const disabled = method === "pickup" ? !b.pickup.enabled : !b.delivery.enabled;
              return (
                <button
                  key={b._id}
                  type="button"
                  role="radio"
                  aria-checked={b._id === branch._id}
                  disabled={disabled}
                  className={`fx-branch${b._id === branch._id ? " is-on" : ""}`}
                  onClick={() => { f.setBranchId(b._id); f.setZoneId(""); }}
                >
                  <b>{b.name}</b>
                  <small>{b.address}</small>
                  <span className={`fx-pill ${b.openNow ? "is-open" : "is-closed"}`}>
                    {disabled ? "Not available" : b.openNow ? "Open now" : `Opens ${b.nextOpen || "soon"}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {method === "delivery" ? (
        <div className="fx-block">
          <span className="fx-label">Delivery area</span>
          {dZones.length === 0 ? (
            <div className="fx-alert is-bad"><I.Warning aria-hidden="true" /><span>No delivery areas are set up for this branch yet. Please choose Pickup.</span></div>
          ) : (
            <div className="fx-zones" role="radiogroup" aria-label="Delivery area">
              {dZones.map((z) => (
                <button
                  key={z._id}
                  type="button"
                  role="radio"
                  aria-checked={z._id === f.zoneId}
                  className={`fx-zone${z._id === f.zoneId ? " is-on" : ""}`}
                  onClick={() => f.setZoneId(z._id)}
                >
                  <span className="fx-zone-main">
                    <b>{z.name}</b>
                    {z.areas && <small>{z.areas}</small>}
                  </span>
                  <span className="fx-zone-fee">
                    {z.fee > 0 ? rs(z.fee) : "Free"}
                    <small>{z.travelMinutes + delivery.prepMinutes}–{z.travelMinutes + delivery.prepMinutes + 10} min</small>
                  </span>
                </button>
              ))}
            </div>
          )}

          <label className="gzp-field fx-address">
            <span>Full delivery address</span>
            <textarea
              rows={3}
              value={f.address}
              onChange={(e) => f.setAddress(e.target.value)}
              placeholder="House or flat number, street, nearest landmark"
              aria-invalid={f.address.trim().length > 0 && f.address.trim().length < 10}
            />
          </label>

          {delivery.freeAbove > 0 && (
            <p className="fx-hint"><I.Bolt aria-hidden="true" /> Free delivery on orders over {rs(delivery.freeAbove)} (before tax).</p>
          )}
        </div>
      ) : (
        <div className="fx-block">
          <span className="fx-label">Pickup details</span>
          <div className="fx-pickup">
            <div className="fx-pickup-row"><I.Pin aria-hidden="true" /><span><b>{branch.name}</b><br />{branch.address || "Address available at the restaurant"}</span></div>
            <div className="fx-pickup-row"><I.Clock aria-hidden="true" /><span>Today: {todayHours(branch)}</span></div>
            {branch.phone && <div className="fx-pickup-row"><I.Call aria-hidden="true" /><span>{branch.phone}</span></div>}
            {pickup.instructions && <div className="fx-pickup-row"><I.Bag aria-hidden="true" /><span>{pickup.instructions}</span></div>}
          </div>
        </div>
      )}

      {/* Live summary straight from the server's quote */}
      <div className="fx-summary" aria-live="polite">
        <div>
          <small>Estimated {method === "delivery" ? "delivery" : "ready in"}</small>
          <b>{quote ? etaText(quote) || "—" : f.quoting ? "…" : "—"}</b>
        </div>
        <div>
          <small>{method === "delivery" ? "Delivery fee" : "Pickup fee"}</small>
          <b>{quote?.ok ? (quote.fee > 0 ? rs(quote.fee) : "Free") : "—"}</b>
        </div>
        {quote?.minOrder > 0 && (
          <div>
            <small>Minimum order</small>
            <b>{rs(quote.minOrder)}</b>
          </div>
        )}
      </div>

      {f.blocker && (
        <div className="fx-alert is-bad" role="alert">
          <I.Warning aria-hidden="true" />
          <span>{f.blocker}</span>
        </div>
      )}
    </section>
  );
};

export const FULFILLMENT_STYLES = `
.fx { display: flex; flex-direction: column; gap: 14px; }
.fx-h { margin: 0; font-size: 1.02rem; font-weight: 800; color: var(--flour); }
.fx-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 520px) { .fx-opts { grid-template-columns: 1fr; } }
.fx-opt { position: relative; display: flex; gap: 12px; align-items: flex-start; text-align: left; padding: 14px; border: 1.5px solid var(--line); border-radius: var(--r-lg); background: #fff; color: var(--flour); cursor: pointer; font: inherit; transition: border-color .15s, box-shadow .15s, transform .15s; }
.fx-opt:hover:not(:disabled) { border-color: rgba(230,57,47,.45); transform: translateY(-1px); }
.fx-opt:disabled { opacity: .55; cursor: not-allowed; }
.fx-opt.is-on { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(230,57,47,.12); background: #fff7f5; }
.fx-opt-ico { flex: none; width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: #fff0ec; color: var(--ember); font-size: 1.1rem; }
.fx-opt.is-on .fx-opt-ico { background: var(--ember); color: #fff; }
.fx-opt-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding-right: 22px; }
.fx-opt-body b { font-size: .95rem; }
.fx-opt-body small { color: var(--flour-dim); font-size: .8rem; line-height: 1.3; }
.fx-opt-body em { font-style: normal; font-weight: 700; font-size: .8rem; color: var(--ember-deep); margin-top: 4px; }
.fx-opt-body em.fx-opt-note { color: #b42318; }
.fx-opt-tick { position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--line); display: grid; place-items: center; font-size: .65rem; color: #fff; }
.fx-opt.is-on .fx-opt-tick { background: var(--ember); border-color: var(--ember); }
.fx-block { display: flex; flex-direction: column; gap: 8px; }
.fx-label { font-size: .85rem; font-weight: 700; color: var(--flour-dim); }
.fx-branches, .fx-zones { display: flex; flex-direction: column; gap: 8px; }
.fx-branch, .fx-zone { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 14px; border: 1.5px solid var(--line); border-radius: var(--r-md); background: #fff; font: inherit; color: var(--flour); text-align: left; cursor: pointer; }
.fx-branch { flex-wrap: wrap; }
.fx-branch b, .fx-zone b { font-size: .92rem; }
.fx-branch small, .fx-zone small { display: block; color: var(--flour-dim); font-size: .78rem; }
.fx-branch.is-on, .fx-zone.is-on { border-color: var(--ember); background: #fff7f5; box-shadow: 0 0 0 3px rgba(230,57,47,.1); }
.fx-branch:disabled { opacity: .5; cursor: not-allowed; }
.fx-zone-fee { text-align: right; font-weight: 800; white-space: nowrap; }
.fx-zone-fee small { font-weight: 500; }
.fx-pill { font-size: .72rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; }
.fx-pill.is-open { background: #e3f6ea; color: #15753f; }
.fx-pill.is-closed { background: #fdeaea; color: #b42318; }
.fx-pickup { display: flex; flex-direction: column; gap: 10px; padding: 14px; border: 1.5px dashed var(--line); border-radius: var(--r-md); background: #fff; }
.fx-pickup-row { display: flex; gap: 10px; align-items: flex-start; font-size: .88rem; color: var(--flour-dim); line-height: 1.4; }
.fx-pickup-row svg { flex: none; margin-top: 3px; color: var(--ember); }
.fx-pickup-row b { color: var(--flour); }
.fx-hint { margin: 0; display: flex; gap: 8px; align-items: center; font-size: .82rem; color: #15753f; font-weight: 600; }
.fx-summary { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--r-md); overflow: hidden; }
.fx-summary > div { background: #fff; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.fx-summary small { font-size: .72rem; color: var(--flour-faint); }
.fx-summary b { font-size: .95rem; }
.fx-alert { display: flex; gap: 10px; align-items: flex-start; padding: 11px 13px; border-radius: var(--r-md); font-size: .86rem; line-height: 1.4; }
.fx-alert.is-bad { background: #fdeaea; color: #8f1d14; border: 1px solid #f6c7c3; }
.fx-alert svg { flex: none; margin-top: 2px; }
.fx-link { background: none; border: 0; padding: 0; font: inherit; font-weight: 700; color: inherit; text-decoration: underline; cursor: pointer; }
.fx-skeleton { padding: 18px; border-radius: var(--r-md); background: #fff; border: 1px dashed var(--line); color: var(--flour-dim); font-size: .9rem; text-align: center; }
`;
