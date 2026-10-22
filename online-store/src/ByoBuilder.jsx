import React, { useEffect, useMemo, useState } from "react";
import { I, FoodIcon } from "./AppIcons.jsx";
import { resolveImageUrl } from "./utils";

/* ---------------------------------------------------------------------------
   "Build Your Own Deal" — storefront side.

   The customer picks any items from the menu (minimum 3). The more they pick,
   the bigger the discount: the three percentages come live from the admin
   panel (Dashboard > Build Your Own) via GET /api/settings, and the server
   re-calculates them on every order, so what's shown here is only a preview.

   Exports:
     - BYO_STYLES      css, appended to the storefront stylesheet
     - normalizeByo    safe config (works before settings load / on old servers)
     - byoPercentFor   items picked -> percent off
     - ByoBanner       the promo card on the menu page
     - ByoBuilder      the full-screen "pick your items" builder
   --------------------------------------------------------------------------- */

export const DEFAULT_BYO = {
  enabled: true,
  minItems: 3,
  discount3: 15,
  discount4: 17,
  discount5Plus: 20,
  description:
    "Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically.",
};

export const normalizeByo = (raw) => {
  const num = (v, d) => (typeof v === "number" && !Number.isNaN(v) ? v : d);
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    enabled: typeof src.enabled === "boolean" ? src.enabled : DEFAULT_BYO.enabled,
    minItems: Math.max(1, Math.round(num(src.minItems, DEFAULT_BYO.minItems))),
    discount3: num(src.discount3, DEFAULT_BYO.discount3),
    discount4: num(src.discount4, DEFAULT_BYO.discount4),
    discount5Plus: num(src.discount5Plus, DEFAULT_BYO.discount5Plus),
    description: typeof src.description === "string" ? src.description : DEFAULT_BYO.description,
  };
};

export const byoPercentFor = (count, cfg) => {
  if (!cfg.enabled || count < cfg.minItems) return 0;
  if (count >= 5) return cfg.discount5Plus;
  if (count === 4) return cfg.discount4;
  return cfg.discount3;
};

const fmtPct = (n) => `${Number.isInteger(n) ? n : Number(n.toFixed(1))}%`;
const fmtRs = (value) => {
  const n = Number(value) || 0;
  return `Rs ${n.toLocaleString("en-PK", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

// Message under the progress bar: what the customer has unlocked and what
// one more item would get them. Never promises a "bigger" tier that the admin
// has set lower than the current one.
export const byoNudge = (count, cfg) => {
  const need = cfg.minItems - count;
  if (count === 0) return `Pick ${cfg.minItems} items to unlock ${fmtPct(cfg.discount3)} off`;
  if (need > 0) {
    return `Add ${need} more item${need === 1 ? "" : "s"} to unlock ${fmtPct(cfg.discount3)} off`;
  }
  const now = byoPercentFor(count, cfg);
  const nextCount = count >= 5 ? null : count + 1;
  const nextPct = nextCount ? byoPercentFor(nextCount, cfg) : null;
  if (nextPct && nextPct > now) {
    return `${fmtPct(now)} off unlocked — add 1 more item for ${fmtPct(nextPct)} off`;
  }
  return count >= 5
    ? `Best discount unlocked — ${fmtPct(now)} off your picks`
    : `${fmtPct(now)} off unlocked`;
};

/* ---------------------------------- Styles --------------------------------- */

export const BYO_STYLES = `
/* ===== Build Your Own Deal ===== */

.gzp-byo-section {
  padding-top: 30px;
}

.gzp-byo-banner {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 18px;
  padding: 22px 20px;
  border-radius: var(--r-xl);
  border: 1px solid rgba(230, 57, 47, 0.35);
  background:
    radial-gradient(520px 220px at 100% 0%, rgba(255, 200, 61, 0.2), transparent 65%),
    radial-gradient(420px 220px at 0% 100%, rgba(230, 57, 47, 0.08), transparent 65%),
    linear-gradient(135deg, #fff8ef, rgba(255, 248, 239, 0.9));
  box-shadow: 0 24px 60px -28px rgba(37, 37, 37, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@media (min-width: 820px) {
  .gzp-byo-banner {
    grid-template-columns: 1.25fr 1fr;
    align-items: center;
    padding: 30px 34px;
    gap: 30px;
  }
}

.gzp-byo-banner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.07) 50%, transparent 65%);
  transform: translateX(-120%);
  animation: gzp-byo-sheen 5.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes gzp-byo-sheen {
  0%, 55% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

.gzp-byo-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: var(--r-pill);
  background: var(--ember);
  border: 1px solid var(--ember-deep);
  color: #fff;
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.gzp-byo-banner h2 {
  margin: 12px 0 8px;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: clamp(1.55rem, 4.2vw, 2.3rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.gzp-byo-banner h2 em {
  font-style: normal;
  background: var(--heat);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.gzp-byo-banner p {
  margin: 0 0 16px;
  color: var(--flour-dim);
  max-width: 46ch;
  line-height: 1.5;
}

.gzp-byo-tiers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  position: relative;
  z-index: 1;
}

.gzp-byo-tier {
  text-align: center;
  padding: 14px 8px;
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.gzp-byo-tier:hover {
  transform: translateY(-3px);
  border-color: rgba(230, 57, 47, 0.45);
}

.gzp-byo-tier b {
  display: block;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  line-height: 1;
  background: var(--heat);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.gzp-byo-tier small {
  display: block;
  margin-top: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--flour-dim);
}

.gzp-byo-tier span {
  display: block;
  margin-top: 8px;
  font-size: 0.82rem;
  font-weight: 700;
}

.gzp-byo-tier.is-best {
  border-color: rgba(230, 57, 47, 0.45);
  background: rgba(230, 57, 47, 0.06);
}

/* ---- builder (full-screen) ---- */

.gzp-byo-overlay {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(7, 8, 10, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: stretch;
  justify-content: center;
  animation: gzp-fade 0.18s ease;
}

.gzp-byo-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1080px;
  height: 100%;
  background: #FFF8EF;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-float);
  animation: gzp-sheet-up 0.26s cubic-bezier(0.2, 0.8, 0.3, 1);
}

@media (min-width: 900px) {
  .gzp-byo-overlay {
    padding: 24px;
  }
  .gzp-byo-panel {
    border-radius: var(--r-xl);
    overflow: hidden;
  }
}

.gzp-byo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--line);
}

.gzp-byo-head h2 {
  margin: 0;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: 1.35rem;
  letter-spacing: -0.01em;
}

.gzp-byo-head p {
  margin: 4px 0 0;
  font-size: 0.86rem;
  color: var(--flour-dim);
}

.gzp-byo-progress {
  padding: 14px 18px 12px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(230, 57, 47, 0.06), transparent);
}

.gzp-byo-track {
  position: relative;
  height: 10px;
  border-radius: var(--r-pill);
  background: rgba(37, 37, 37, 0.16);
  margin: 6px 6px 26px;
}

.gzp-byo-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: var(--r-pill);
  background: var(--heat);
  box-shadow: 0 0 14px rgba(230, 57, 47, 0.4);
  transition: width 0.35s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.gzp-byo-mark {
  position: absolute;
  top: 50%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 800;
  background: #FFF8EF;
  border: 2px solid rgba(37, 37, 37, 0.28);
  color: var(--flour-dim);
  transition: all 0.25s ease;
}

.gzp-byo-mark.is-hit {
  background: var(--ember);
  border-color: #ffffff;
  color: #ffffff;
  transform: scale(1.12);
}

.gzp-byo-mark span {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--flour-dim);
}

.gzp-byo-mark.is-hit span {
  color: var(--gold);
}

.gzp-byo-nudge {
  margin: 0;
  text-align: center;
  font-weight: 700;
  font-size: 0.92rem;
}

.gzp-byo-nudge.is-ok {
  color: var(--gold);
}

.gzp-byo-cats {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 18px;
  scrollbar-width: none;
  border-bottom: 1px solid var(--line);
}

.gzp-byo-cats::-webkit-scrollbar {
  display: none;
}

.gzp-byo-cat {
  flex: none;
  padding: 8px 16px;
  border-radius: var(--r-pill);
  border: 1px solid var(--line);
  background: transparent;
  color: var(--flour-dim);
  font: inherit;
  font-weight: 700;
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.18s ease;
}

.gzp-byo-cat:hover {
  color: var(--flour);
  border-color: rgba(37, 37, 37, 0.32);
}

.gzp-byo-cat.is-active {
  background: var(--heat);
  border-color: transparent;
  color: #ffffff;
}

.gzp-byo-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 18px 20px;
  overscroll-behavior: contain;
}

.gzp-byo-group h3 {
  margin: 16px 0 10px;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: 1.05rem;
}

.gzp-byo-group:first-child h3 {
  margin-top: 4px;
}

.gzp-byo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 720px) {
  .gzp-byo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 980px) {
  .gzp-byo-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.gzp-byo-tile {
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.gzp-byo-tile.is-picked {
  border-color: rgba(230, 57, 47, 0.6);
  box-shadow: 0 0 0 1px rgba(230, 57, 47, 0.25), 0 14px 34px -16px rgba(230, 57, 47, 0.35);
}

.gzp-byo-tile-media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--ink-900);
  display: grid;
  place-items: center;
  font-size: 2.2rem;
}

.gzp-byo-tile-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gzp-byo-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  border-radius: var(--r-pill);
  display: grid;
  place-items: center;
  background: var(--ember);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.8rem;
  box-shadow: 0 6px 16px -6px rgba(230, 57, 47, 0.55);
  animation: gzp-byo-pop 0.25s ease;
}

@keyframes gzp-byo-pop {
  from { transform: scale(0.4); }
  to { transform: scale(1); }
}

.gzp-byo-tile-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 10px 12px;
  flex: 1;
}

.gzp-byo-tile-body h4 {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.25;
}

.gzp-byo-price {
  font-weight: 800;
  color: var(--gold);
  font-size: 0.92rem;
}

.gzp-byo-price small {
  font-weight: 600;
  color: var(--flour-faint);
  margin-right: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.gzp-byo-selects {
  display: grid;
  gap: 6px;
}

.gzp-byo-tile-foot {
  margin-top: auto;
  padding-top: 4px;
}

.gzp-byo-add {
  width: 100%;
  padding: 9px 10px;
  border-radius: var(--r-md);
  border: 1px solid rgba(230, 57, 47, 0.4);
  background: rgba(230, 57, 47, 0.06);
  color: var(--ember);
  font: inherit;
  font-weight: 800;
  font-size: 0.86rem;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.gzp-byo-add:hover:not(:disabled) {
  background: var(--ember);
  color: #ffffff;
}

.gzp-byo-add:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.gzp-byo-foot {
  padding: 12px 18px calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--line);
  background: rgba(255, 243, 218, 0.97);
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.gzp-byo-sum {
  flex: 1 1 200px;
  min-width: 0;
}

.gzp-byo-sum small {
  display: block;
  color: var(--flour-dim);
  font-size: 0.78rem;
  font-weight: 700;
}

.gzp-byo-sum b {
  font-family: "Archivo", system-ui, sans-serif;
  font-size: 1.3rem;
}

.gzp-byo-sum s {
  margin-left: 8px;
  color: var(--flour-faint);
  font-size: 0.9rem;
}

.gzp-byo-sum em {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  background: rgba(26, 158, 86, 0.18);
  color: #137a43;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 800;
}

.gzp-byo-foot .gzp-btn {
  flex: 0 1 260px;
  min-width: 190px;
}

@media (max-width: 520px) {
  .gzp-byo-foot .gzp-btn {
    flex: 1 1 100%;
  }
}

/* ---- cart group ---- */

.gzp-byo-cart {
  margin: 4px 0 14px;
  padding: 12px;
  border-radius: var(--r-lg);
  border: 1px solid rgba(230, 57, 47, 0.4);
  background: linear-gradient(135deg, rgba(230, 57, 47, 0.08), rgba(255, 255, 255, 0.02));
}

.gzp-byo-cart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.gzp-byo-cart-head h4 {
  margin: 0;
  font-size: 0.98rem;
}

.gzp-byo-cart-head button {
  background: none;
  border: none;
  color: var(--gold);
  font: inherit;
  font-weight: 800;
  font-size: 0.84rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.gzp-byo-cart-note {
  margin: 4px 0 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #137a43;
}

.gzp-byo-cart-note.is-warn {
  color: var(--gold);
}

.gzp-byo-cart-saving {
  margin: 8px 0 0;
  font-size: 0.82rem;
  color: var(--flour-dim);
}

.gzp-byo-cart-saving b {
  color: #137a43;
}

.gzp-totals .is-discount span {
  color: #137a43;
  font-weight: 700;
}

.gzp-byo-warn {
  margin: 0 0 10px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: rgba(230, 57, 47, 0.08);
  border: 1px solid rgba(230, 57, 47, 0.4);
  color: var(--gold);
  font-size: 0.86rem;
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .gzp-byo-banner::after,
  .gzp-byo-badge {
    animation: none;
  }
  .gzp-byo-fill {
    transition: none;
  }
}
`;

/* --------------------------------- Banner ---------------------------------- */

export const ByoBanner = ({ cfg, pickedCount, onStart }) => (
  <section className="gzp-byo-section" aria-label="Build your own deal">
    <div className="gzp-shell">
      <div className="gzp-byo-banner">
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="gzp-byo-eyebrow"><I.Target aria-hidden="true" /> Make it yours</span>
          <h2>
            Build your <em>own deal</em>
          </h2>
          {cfg.description && <p>{cfg.description}</p>}
          <button type="button" className="gzp-btn gzp-btn-primary" onClick={onStart}>
            {pickedCount > 0 ? `Edit your deal (${pickedCount} item${pickedCount === 1 ? "" : "s"})` : "Start building"}
          </button>
        </div>

        <div className="gzp-byo-tiers">
          <div className="gzp-byo-tier">
            <b>{fmtPct(cfg.discount3)}</b>
            <small>off</small>
            <span>{cfg.minItems} items</span>
          </div>
          <div className="gzp-byo-tier">
            <b>{fmtPct(cfg.discount4)}</b>
            <small>off</small>
            <span>4 items</span>
          </div>
          <div className="gzp-byo-tier is-best">
            <b>{fmtPct(cfg.discount5Plus)}</b>
            <small>off</small>
            <span>5+ items</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------- Builder tile ------------------------------- */

const variantSizes = (dish) => {
  const seen = [];
  (dish?.variants || []).forEach((v) => {
    if (v.size && !seen.includes(v.size)) seen.push(v.size);
  });
  return seen;
};
const crustsForSize = (dish, size) => {
  const seen = [];
  (dish?.variants || []).forEach((v) => {
    if (v.size === size && v.crust && !seen.includes(v.crust)) seen.push(v.crust);
  });
  return seen;
};
const findVariant = (dish, size, crust) =>
  (dish?.variants || []).find((v) => v.size === size && (v.crust || "") === (crust || "")) || null;

// One key per dish + size + crust - same shape the cart uses after "byo:".
const pickKey = (dishId, size = "", crust = "") => `${dishId}:${size || ""}||${crust || ""}`;

const ByoTile = ({ dish, picks, dishQty, stockLeft, onAdd, onRemove }) => {
  const sizes = useMemo(() => variantSizes(dish), [dish]);
  const hasVariants = sizes.length > 0;
  const [size, setSize] = useState(sizes[0] || "");
  const crusts = useMemo(() => crustsForSize(dish, size), [dish, size]);
  const [crust, setCrust] = useState(crusts[0] || "");
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (crusts.length > 0 && !crusts.includes(crust)) setCrust(crusts[0]);
    else if (crusts.length === 0 && crust !== "") setCrust("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const variant = hasVariants ? findVariant(dish, size, crust) : null;
  const cheapest = hasVariants
    ? (dish.variants || []).reduce((m, v) => (m === null || v.price < m.price ? v : m), null)
    : null;
  const unitPrice = hasVariants ? variant?.price ?? cheapest?.price ?? dish.price : dish.price;
  const key = pickKey(dish._id, size, crust);
  const qty = picks[key] || 0;
  const totalForDish = dishQty;
  const soldOut = typeof dish.availableQty === "number" && stockLeft <= 0 && totalForDish === 0;
  const atLimit = typeof dish.availableQty === "number" && stockLeft <= 0;
  const canAdd = (!hasVariants || Boolean(variant)) && !atLimit;
  const img = resolveImageUrl(dish.image);

  return (
    <div className={`gzp-byo-tile${totalForDish > 0 ? " is-picked" : ""}`}>
      <div className="gzp-byo-tile-media">
        {img && !imgFailed ? (
          <img src={img} alt={dish.name} loading="lazy" onError={() => setImgFailed(true)} />
        ) : (
          <span aria-hidden="true"><FoodIcon icon={dish.icon} /></span>
        )}
        {totalForDish > 0 && <span className="gzp-byo-badge">×{totalForDish}</span>}
      </div>

      <div className="gzp-byo-tile-body">
        <h4>{dish.name}</h4>
        <div className="gzp-byo-price">
          {hasVariants && <small>From</small>}
          {fmtRs(unitPrice)}
        </div>

        {hasVariants && (
          <div className="gzp-byo-selects">
            <select className="gzp-select" value={size} onChange={(e) => setSize(e.target.value)} aria-label={`Size for ${dish.name}`}>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {crusts.length > 0 && (
              <select className="gzp-select" value={crust} onChange={(e) => setCrust(e.target.value)} aria-label={`Crust for ${dish.name}`}>
                {crusts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="gzp-byo-tile-foot">
          {qty > 0 ? (
            <div className="gzp-stepper" style={{ width: "100%", justifyContent: "space-between" }}>
              <button type="button" onClick={() => onRemove(key)} aria-label={`Remove one ${dish.name}`}>
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" disabled={!canAdd} onClick={() => onAdd(dish, size, crust)} aria-label={`Add one more ${dish.name}`}>
                +
              </button>
            </div>
          ) : (
            <button type="button" className="gzp-byo-add" disabled={!canAdd} onClick={() => onAdd(dish, size, crust)}>
              {soldOut ? "Sold out" : "+ Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Builder ---------------------------------- */

export const ByoBuilder = ({ cfg, dishes, categories, initialPicks, getOtherQty, onClose, onConfirm }) => {
  const [picks, setPicks] = useState(() => ({ ...(initialPicks || {}) }));
  const [activeCat, setActiveCat] = useState("all");

  // Lock page scroll behind the builder; Escape closes it.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const dishById = useMemo(() => {
    const m = {};
    dishes.forEach((d) => {
      m[d._id] = d;
    });
    return m;
  }, [dishes]);

  const sections = useMemo(() => {
    const byCat = new Map();
    dishes.forEach((d) => {
      const id = d.category?._id || d.category || "other";
      if (!byCat.has(id)) byCat.set(id, []);
      byCat.get(id).push(d);
    });
    const out = categories
      .filter((c) => (byCat.get(c._id) || []).length > 0)
      .map((c) => ({ id: c._id, name: c.name, items: byCat.get(c._id) }));
    const known = new Set(categories.map((c) => c._id));
    const loose = dishes.filter((d) => !known.has(d.category?._id || d.category));
    if (loose.length) out.push({ id: "other", name: "More to eat", items: loose });
    return out;
  }, [dishes, categories]);

  const dishQtyIn = (dishId) =>
    Object.entries(picks).reduce((sum, [k, q]) => (k.startsWith(`${dishId}:`) ? sum + q : sum), 0);

  const stockLeftFor = (dish) =>
    typeof dish.availableQty === "number"
      ? dish.availableQty - dishQtyIn(dish._id) - (getOtherQty ? getOtherQty(dish._id) : 0)
      : Infinity;

  const add = (dish, size, crust) => {
    if (stockLeftFor(dish) <= 0) return;
    const k = pickKey(dish._id, size, crust);
    setPicks((p) => ({ ...p, [k]: (p[k] || 0) + 1 }));
  };
  const remove = (k) =>
    setPicks((p) => {
      const next = { ...p, [k]: Math.max(0, (p[k] || 0) - 1) };
      if (next[k] === 0) delete next[k];
      return next;
    });

  // Live preview of the numbers - the server recalculates the real ones.
  const { count, gross } = useMemo(() => {
    let c = 0;
    let g = 0;
    Object.entries(picks).forEach(([k, q]) => {
      const [dishId, variantPart = "||"] = k.split(/:(.+)/);
      const dish = dishById[dishId];
      if (!dish) return;
      const [size, crust] = variantPart.split("||");
      const v = size ? findVariant(dish, size, crust) : null;
      c += q;
      g += (v ? v.price : dish.price) * q;
    });
    return { count: c, gross: g };
  }, [picks, dishById]);

  const pct = byoPercentFor(count, cfg);
  const saved = Math.round((gross * pct) / 100);
  const net = gross - saved;
  const unlocked = count >= cfg.minItems;

  const marks = [
    { n: cfg.minItems, label: fmtPct(cfg.discount3) },
    { n: 4, label: fmtPct(cfg.discount4) },
    { n: 5, label: fmtPct(cfg.discount5Plus) },
  ].filter((m, i, arr) => i === 0 || m.n > arr[i - 1].n);
  const lastN = marks[marks.length - 1].n;
  const posOf = (n) => `${(n / lastN) * 100}%`;
  const fillPct = `${(Math.min(count, lastN) / lastN) * 100}%`;

  const visible = activeCat === "all" ? sections : sections.filter((s) => s.id === activeCat);

  return (
    <div className="gzp-byo-overlay" onClick={onClose}>
      <div className="gzp-byo-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Build your own deal">
        <div className="gzp-byo-head">
          <div>
            <h2><I.Target aria-hidden="true" style={{ marginRight: 8, verticalAlign: "-3px" }} />Build your own deal</h2>
            <p>
              Choose at least {cfg.minItems} items — your discount grows with every item.
            </p>
          </div>
          <button className="gzp-icon-btn" type="button" onClick={onClose} aria-label="Close">
            <I.Close aria-hidden="true" />
          </button>
        </div>

        <div className="gzp-byo-progress">
          <div className="gzp-byo-track" role="progressbar" aria-valuemin={0} aria-valuemax={lastN} aria-valuenow={Math.min(count, lastN)}>
            <div className="gzp-byo-fill" style={{ width: fillPct }} />
            {marks.map((m) => (
              <div key={m.n} className={`gzp-byo-mark${count >= m.n ? " is-hit" : ""}`} style={{ left: posOf(m.n) }}>
                {m.n === lastN && m.n >= 5 ? `${m.n}+` : m.n}
                <span>{m.label} off</span>
              </div>
            ))}
          </div>
          <p className={`gzp-byo-nudge${unlocked ? " is-ok" : ""}`}>{byoNudge(count, cfg)}</p>
        </div>

        <div className="gzp-byo-cats" role="tablist" aria-label="Menu categories">
          <button type="button" className={`gzp-byo-cat${activeCat === "all" ? " is-active" : ""}`} onClick={() => setActiveCat("all")}>
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`gzp-byo-cat${activeCat === s.id ? " is-active" : ""}`}
              onClick={() => setActiveCat(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="gzp-byo-body">
          {visible.map((s) => (
            <div className="gzp-byo-group" key={s.id}>
              <h3>{s.name}</h3>
              <div className="gzp-byo-grid">
                {s.items.map((dish) => (
                  <ByoTile
                    key={dish._id}
                    dish={dish}
                    picks={picks}
                    dishQty={dishQtyIn(dish._id)}
                    stockLeft={stockLeftFor(dish)}
                    onAdd={add}
                    onRemove={remove}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="gzp-byo-foot">
          <div className="gzp-byo-sum">
            <small>
              {count} item{count === 1 ? "" : "s"} picked
            </small>
            <div>
              <b>{fmtRs(net)}</b>
              {saved > 0 && <s>{fmtRs(gross)}</s>}
              {saved > 0 && <em>You save {fmtRs(saved)}</em>}
            </div>
          </div>
          <button
            type="button"
            className="gzp-btn gzp-btn-primary"
            disabled={!unlocked}
            onClick={() => onConfirm(picks)}
          >
            {unlocked
              ? `Add to my order · ${fmtPct(pct)} off`
              : `Pick ${cfg.minItems - count} more to continue`}
          </button>
        </div>
      </div>
    </div>
  );
};
