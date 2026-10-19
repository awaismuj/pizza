/* ---------------------------------------------------------------------------
   GenZ Pizza Land — storefront design layer (v2)

   Loaded AFTER the base stylesheet in App.jsx, so everything here refines or
   replaces the base look: full-width layout, glass header, hero intro,
   modern cards, plus the new sections (features, how-it-works, reviews,
   contact, footer).
   --------------------------------------------------------------------------- */

export const DESIGN_STYLES = `
:root {
  --shell: 100%;
  --gutter: clamp(16px, 2.6vw, 56px);
  --header-h: 68px;
  --nav-h: 60px;

  --ink-900: #FFF8EF;
  --cream-2: #FFEFD9;
  --surface: #ffffff;
  --flour: #1f1b18;
  --flour-dim: #5d554d;
  --flour-faint: #85796e;
  --line: rgba(31, 27, 24, 0.10);

  --r-xl: 30px;
  --r-lg: 22px;
  --r-md: 14px;

  --shadow-soft: 0 1px 2px rgba(31, 27, 24, 0.05), 0 10px 30px -14px rgba(31, 27, 24, 0.18);
  --shadow-hover: 0 2px 4px rgba(31, 27, 24, 0.05), 0 26px 44px -18px rgba(230, 57, 47, 0.28);
}

html { scroll-padding-top: calc(var(--header-h) + var(--nav-h)); }

body {
  background:
    radial-gradient(1100px 600px at 100% -6%, rgba(255, 200, 61, 0.22), transparent 60%),
    radial-gradient(900px 600px at -6% 30%, rgba(230, 57, 47, 0.07), transparent 60%),
    var(--ink-900);
}
body::before { opacity: 0.025; }

/* The page itself spans the viewport. Content gets a modest gutter and,
   only on truly huge monitors, a very generous ceiling. */
.gzp-shell,
.gzp-header-inner,
.gzp-navbar-inner,
.v2-wrap {
  width: 100%;
  max-width: 2400px;
  margin-inline: auto;
}
.v2-wrap { padding-inline: var(--gutter); }

/* ---------- Header (glass) ---------- */

.gzp-header {
  background: rgba(255, 248, 239, 0.82);
  backdrop-filter: saturate(1.6) blur(16px);
  -webkit-backdrop-filter: saturate(1.6) blur(16px);
  border-bottom: 1px solid var(--line);
  box-shadow: none;
}
.gzp-header-inner { gap: 10px; }
.gzp-brand-mark { width: 42px; height: 42px; border-radius: 50%; box-shadow: 0 0 0 2px #fff, 0 4px 14px -4px rgba(230,57,47,.5); }
.gzp-brand-name { color: var(--flour); font-size: 1.12rem; }
.gzp-brand-sub { color: var(--flour-faint); }

.v2-links { display: none; align-items: center; gap: 4px; margin-right: 8px; }
@media (min-width: 1000px) { .v2-links { display: flex; } }
.v2-link {
  background: none; border: 0; cursor: pointer;
  padding: 9px 14px; border-radius: 999px;
  font-weight: 650; font-size: 0.93rem; color: var(--flour-dim);
  transition: background .15s, color .15s;
}
.v2-link:hover { background: rgba(31,27,24,.06); color: var(--flour); }

.gzp-icon-btn { background: #fff; border-color: var(--line); border-radius: 50%; width: 42px; height: 42px; }
.gzp-icon-btn:hover { background: #fff; border-color: var(--ember); color: var(--ember); }
.gzp-cart-btn { background: var(--ember); border-color: var(--ember); color: #fff; }
.gzp-cart-btn:hover { background: var(--ember-deep); border-color: var(--ember-deep); color: #fff; }
.gzp-cart-count { background: var(--gold); border-color: #fff; }

.v2-track-btn {
  display: none; align-items: center; gap: 8px;
  height: 42px; padding: 0 16px; border-radius: 999px;
  border: 1px solid var(--line); background: #fff; cursor: pointer;
  font-weight: 700; font-size: .9rem;
  transition: border-color .15s, color .15s;
}
.v2-track-btn:hover { border-color: var(--ember); color: var(--ember); }
.v2-track-btn svg { width: 18px; height: 18px; }
@media (min-width: 700px) { .v2-track-btn { display: inline-flex; } }

/* ---------- Hero intro ---------- */

.v2-hero { padding-top: clamp(20px, 3.4vw, 52px); }
.v2-hero-grid {
  display: grid; gap: clamp(20px, 3vw, 48px);
  grid-template-columns: 1fr; align-items: end;
}
@media (min-width: 1000px) { .v2-hero-grid { grid-template-columns: 1.35fr 1fr; } }

.v2-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 14px; border-radius: 999px;
  background: #fff; border: 1px solid var(--line);
  font-weight: 700; font-size: .8rem; letter-spacing: .02em; color: var(--flour-dim);
  box-shadow: var(--shadow-soft);
}
.v2-eyebrow i { width: 8px; height: 8px; border-radius: 50%; background: var(--basil); box-shadow: 0 0 0 4px rgba(26,158,86,.18); }

.v2-hero h1 {
  margin: 18px 0 14px;
  font-size: clamp(2.3rem, 5.6vw, 5rem);
  line-height: 1.02; letter-spacing: -0.04em; font-weight: 900;
  font-variation-settings: "wdth" 116;
}
.v2-hero h1 em { font-style: normal; color: var(--ember); position: relative; white-space: nowrap; }
.v2-hero h1 em::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0.06em; height: .22em;
  background: var(--gold); z-index: -1; border-radius: 6px; transform: rotate(-1deg);
}
.v2-hero p.lead { margin: 0; max-width: 56ch; font-size: clamp(1rem, 1.3vw, 1.2rem); color: var(--flour-dim); }
.v2-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.v2-cta .gzp-btn { padding: 15px 26px; border-radius: 999px; font-size: 1rem; }
.v2-cta .gzp-btn-ghost { background: #fff; }

.v2-stats {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
}
.v2-stat {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 18px 18px 16px; box-shadow: var(--shadow-soft);
}
.v2-stat:nth-child(1) { background: var(--ember); border-color: var(--ember); color: #fff; }
.v2-stat:nth-child(4) { background: var(--gold); border-color: var(--gold); }
.v2-stat b { display: block; font-family: "Archivo", sans-serif; font-size: clamp(1.4rem, 2.2vw, 2rem); font-weight: 850; letter-spacing: -.03em; line-height: 1.1; }
.v2-stat span { display: block; margin-top: 4px; font-size: .85rem; font-weight: 600; opacity: .8; }

/* Slider — rounded, framed, full width */
.gzp-hero { padding: clamp(18px, 2.4vw, 34px) var(--gutter) 0; }
.gzp-slider {
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--line);
  aspect-ratio: 16 / 7;
  max-width: 2400px; margin-inline: auto;
}
@media (min-width: 640px) { .gzp-slider { aspect-ratio: 16 / 6; } }
@media (min-width: 900px) { .gzp-slider { aspect-ratio: 21 / 6.4; } }
@media (min-width: 1500px) { .gzp-slider { aspect-ratio: 21 / 5.6; } }
.gzp-slider-dots { background: rgba(31,27,24,.55); }

/* ---------- Category nav ---------- */

.gzp-navbar { background: rgba(255,248,239,.9); border-bottom: 1px solid var(--line); }
.gzp-chip {
  border: 1px solid var(--line); background: #fff; color: var(--flour-dim);
  padding: 9px 18px; font-weight: 650;
}
.gzp-chip:hover { border-color: var(--ember); color: var(--ember); background: #fff; }
.gzp-chip.is-active { background: var(--flour); border-color: var(--flour); color: #fff; box-shadow: 0 8px 18px -8px rgba(31,27,24,.6); }

/* ---------- Section headings ---------- */

.gzp-section { padding-top: clamp(38px, 5vw, 76px); }
.gzp-section-head { margin-bottom: clamp(16px, 2vw, 26px); align-items: center; }
.gzp-section-head h2 {
  font-size: clamp(1.6rem, 3vw, 2.6rem); font-weight: 850; letter-spacing: -0.035em;
}
.gzp-section-count {
  padding: 5px 12px; border-radius: 999px; background: var(--cream-2);
  color: var(--flour-dim); font-weight: 700; font-size: .78rem;
}
.gzp-section-rule { background: linear-gradient(90deg, rgba(31,27,24,.14), transparent); }

/* ---------- Cards ---------- */

.gzp-grid { grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: clamp(12px, 1.4vw, 24px); }
@media (min-width: 640px)  { .gzp-grid { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); } }
@media (min-width: 1400px) { .gzp-grid { grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); } }

.gzp-card, .gzp-deal {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg); box-shadow: var(--shadow-soft);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.gzp-card:hover, .gzp-deal:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); border-color: rgba(230,57,47,.35); }
.gzp-card-media { aspect-ratio: 1 / 0.82; }
.gzp-card-body { padding: 14px 16px 16px; gap: 12px; }
.gzp-card-body h3 { font-size: 1.04rem; font-weight: 750; }
.gzp-deal { flex-basis: 300px; }
@media (min-width: 720px)  { .gzp-deal { flex-basis: 340px; } }
@media (min-width: 1400px) { .gzp-deal { flex-basis: 380px; } }
.gzp-rail { gap: clamp(14px, 1.4vw, 24px); padding-bottom: 14px; }
.gzp-price { color: var(--flour); font-weight: 850; }
.gzp-add { border-radius: 50%; }
.gzp-add-wide { border-radius: 999px; }
.gzp-badge { background: var(--ember); box-shadow: 0 6px 14px -6px rgba(230,57,47,.7); }
.gzp-save { background: #fff; color: var(--basil); border-color: rgba(26,158,86,.4); }
.gzp-stock { background: #fff; color: #9a6a00; }

.gzp-sheet, .gzp-modal { border-radius: var(--r-xl); }

/* ---------- Generic new-section scaffolding ---------- */

.v2-section { padding-top: clamp(48px, 6.5vw, 110px); }
.v2-kicker {
  display: inline-block; margin-bottom: 10px;
  font-weight: 800; font-size: .78rem; letter-spacing: .14em; text-transform: uppercase; color: var(--ember);
}
.v2-title {
  font-size: clamp(1.8rem, 3.6vw, 3.1rem); line-height: 1.05; letter-spacing: -0.04em; font-weight: 880;
  font-variation-settings: "wdth" 114; max-width: 22ch;
}
.v2-sub { margin: 12px 0 0; color: var(--flour-dim); max-width: 60ch; font-size: 1.04rem; }

/* Features strip */
.v2-features { display: grid; gap: clamp(12px, 1.4vw, 22px); grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); margin-top: clamp(20px, 2.6vw, 36px); }
.v2-feature {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 24px; box-shadow: var(--shadow-soft);
  transition: transform .2s ease, box-shadow .2s ease;
}
.v2-feature:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.v2-ico {
  width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px;
  background: var(--cream-2); font-size: 1.5rem; margin-bottom: 16px;
}
.v2-feature h3 { font-size: 1.15rem; font-weight: 800; letter-spacing: -.02em; margin-bottom: 6px; }
.v2-feature p { margin: 0; color: var(--flour-dim); font-size: .95rem; }

/* How it works */
.v2-how {
  margin-top: clamp(48px, 6.5vw, 110px);
  background: var(--flour); color: #fff; border-radius: var(--r-xl);
  padding: clamp(28px, 4.5vw, 72px); position: relative; overflow: hidden;
}
.v2-how::before {
  content: ""; position: absolute; width: 520px; height: 520px; right: -140px; top: -200px;
  background: radial-gradient(closest-side, rgba(255,200,61,.28), transparent); pointer-events: none;
}
.v2-how .v2-kicker { color: var(--gold); }
.v2-how .v2-sub { color: rgba(255,255,255,.7); }
.v2-steps { display: grid; gap: clamp(14px, 2vw, 30px); grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: clamp(24px, 3vw, 44px); position: relative; }
.v2-step { border-top: 2px solid rgba(255,255,255,.18); padding-top: 18px; }
.v2-step b {
  display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
  background: var(--ember); font-family: "Archivo", sans-serif; font-weight: 850;
}
.v2-step h3 { margin: 14px 0 6px; font-size: 1.25rem; font-weight: 800; letter-spacing: -.02em; }
.v2-step p { margin: 0; color: rgba(255,255,255,.68); }

/* ---------- Reviews ---------- */

.v2-reviews-head { display: flex; flex-wrap: wrap; gap: 22px 40px; align-items: flex-end; justify-content: space-between; }
.v2-rv-layout { display: grid; gap: clamp(16px, 2vw, 32px); margin-top: clamp(20px, 2.6vw, 36px); grid-template-columns: 1fr; align-items: start; }
@media (min-width: 1000px) { .v2-rv-layout { grid-template-columns: 340px 1fr; } }
@media (min-width: 1700px) { .v2-rv-layout { grid-template-columns: 400px 1fr; } }

.v2-rv-summary {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 26px; box-shadow: var(--shadow-soft);
}
@media (min-width: 1000px) { .v2-rv-summary { position: sticky; top: calc(var(--header-h) + var(--nav-h) + 16px); } }
.v2-rv-score { display: flex; align-items: center; gap: 16px; }
.v2-rv-score b { font-family: "Archivo", sans-serif; font-size: 3.6rem; line-height: 1; font-weight: 900; letter-spacing: -.05em; }
.v2-rv-score small { display: block; margin-top: 4px; color: var(--flour-faint); font-weight: 600; }
.v2-stars { display: inline-flex; gap: 2px; color: #f5a400; }
.v2-stars svg { width: 18px; height: 18px; }
.v2-stars .off { color: rgba(31,27,24,.16); }
.v2-bars { margin: 20px 0 22px; display: grid; gap: 8px; }
.v2-bar { display: grid; grid-template-columns: 22px 1fr 28px; align-items: center; gap: 10px; font-size: .82rem; font-weight: 700; color: var(--flour-dim); }
.v2-bar i { height: 8px; border-radius: 99px; background: rgba(31,27,24,.08); overflow: hidden; display: block; }
.v2-bar i span { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, #f5a400, var(--gold)); }
.v2-bar em { font-style: normal; text-align: right; color: var(--flour-faint); }

.v2-write {
  width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px 20px; border: 0; border-radius: 999px; cursor: pointer;
  background: var(--ember); color: #fff; font-weight: 800; font-size: 1rem;
  box-shadow: 0 14px 28px -14px rgba(230,57,47,.8);
  transition: background .15s, transform .12s;
}
.v2-write:hover { background: var(--ember-deep); }
.v2-write:active { transform: translateY(1px); }
.v2-write svg { width: 18px; height: 18px; }
.v2-write.inline { width: auto; padding-inline: 26px; }

.v2-rv-list { display: grid; gap: clamp(12px, 1.4vw, 20px); grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); }
.v2-rv {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 22px; box-shadow: var(--shadow-soft); display: flex; flex-direction: column; gap: 12px;
}
.v2-rv-top { display: flex; align-items: center; gap: 12px; }
.v2-avatar {
  width: 44px; height: 44px; border-radius: 50%; flex: none; display: grid; place-items: center;
  font-family: "Archivo", sans-serif; font-weight: 850; color: #fff;
}
.v2-rv-top strong { display: block; line-height: 1.2; }
.v2-rv-top span { color: var(--flour-faint); font-size: .82rem; }
.v2-rv h4 { margin: 0; font-size: 1.02rem; font-weight: 800; letter-spacing: -.01em; }
.v2-rv p { margin: 0; color: var(--flour-dim); overflow-wrap: anywhere; white-space: pre-line; }
.v2-rv-dish { align-self: flex-start; padding: 4px 11px; border-radius: 99px; background: var(--cream-2); font-size: .78rem; font-weight: 700; color: var(--flour-dim); }
.v2-rv-empty {
  grid-column: 1 / -1; text-align: center; padding: 44px 20px;
  border: 2px dashed rgba(31,27,24,.16); border-radius: var(--r-lg); color: var(--flour-dim);
}
.v2-rv-empty b { display: block; font-size: 1.2rem; color: var(--flour); margin: 6px 0 4px; }
.v2-more { margin: 22px auto 0; display: block; }

/* Review modal */
.v2-rvm-overlay {
  position: fixed; inset: 0; z-index: 120; display: flex; align-items: flex-end; justify-content: center;
  background: rgba(31,27,24,.55); backdrop-filter: blur(4px); padding: 0;
  animation: v2fade .18s ease;
}
@media (min-width: 700px) { .v2-rvm-overlay { align-items: center; padding: 24px; } }
.v2-rvm {
  width: 100%; max-width: 560px; max-height: 94vh; overflow-y: auto; background: #fff;
  border-radius: 28px 28px 0 0; padding: 26px 24px 28px; box-shadow: 0 40px 80px -20px rgba(0,0,0,.5);
  animation: v2up .22s ease;
}
@media (min-width: 700px) { .v2-rvm { border-radius: 28px; padding: 32px; } }
.v2-rvm-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.v2-rvm-head h3 { font-size: 1.6rem; font-weight: 880; letter-spacing: -.03em; }
.v2-rvm-head p { margin: 4px 0 0; color: var(--flour-dim); font-size: .94rem; }
.v2-rvm-form { display: grid; gap: 16px; }
.v2-rvm-form label.f { display: grid; gap: 6px; }
.v2-rvm-form label.f > span { font-weight: 700; font-size: .86rem; }
.v2-rvm-form label.f > span small { font-weight: 500; color: var(--flour-faint); }
.v2-rvm-form input[type="text"], .v2-rvm-form textarea {
  width: 100%; padding: 13px 15px; border-radius: 14px; background: #fff;
  border: 1.5px solid rgba(31,27,24,.16); transition: border-color .15s, box-shadow .15s;
}
.v2-rvm-form textarea { min-height: 120px; resize: vertical; }
.v2-rvm-form input:focus, .v2-rvm-form textarea:focus { outline: none; border-color: var(--ember); box-shadow: 0 0 0 4px rgba(230,57,47,.14); }
.v2-count { text-align: right; font-size: .76rem; color: var(--flour-faint); }
.v2-starpick { display: flex; gap: 6px; align-items: center; }
.v2-starpick button {
  background: none; border: 0; padding: 2px; cursor: pointer; color: rgba(31,27,24,.18);
  transition: transform .12s, color .12s;
}
.v2-starpick button svg { width: 38px; height: 38px; display: block; }
.v2-starpick button.on { color: #f5a400; }
.v2-starpick button:hover { transform: scale(1.12); }
.v2-starpick .lbl { margin-left: 10px; font-weight: 750; color: var(--flour-dim); }
.v2-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.v2-form-error { margin: 0; padding: 11px 14px; border-radius: 12px; background: rgba(230,57,47,.1); color: var(--ember-deep); font-weight: 650; font-size: .92rem; }
.v2-rvm-actions { display: flex; gap: 10px; }
.v2-rvm-actions .gzp-btn { flex: 1; padding: 15px; border-radius: 999px; }
.v2-thanks { text-align: center; padding: 18px 6px 6px; }
.v2-thanks .big { font-size: 3.2rem; }
.v2-thanks h3 { font-size: 1.6rem; font-weight: 880; letter-spacing: -.03em; margin: 8px 0; }
.v2-thanks p { color: var(--flour-dim); margin: 0 0 20px; }

@keyframes v2fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes v2up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

/* ---------- Contact panel ---------- */

.v2-contact {
  margin-top: clamp(48px, 6.5vw, 110px);
  display: grid; gap: clamp(14px, 2vw, 28px); grid-template-columns: 1fr;
}
@media (min-width: 900px) { .v2-contact { grid-template-columns: 1.2fr 1fr; } }
.v2-panel {
  border-radius: var(--r-xl); padding: clamp(26px, 3.4vw, 52px);
  border: 1px solid var(--line); background: #fff; box-shadow: var(--shadow-soft);
}
.v2-panel.warm { background: linear-gradient(135deg, var(--ember), #ff6a3d); color: #fff; border: 0; }
.v2-panel.warm .v2-kicker { color: var(--gold); }
.v2-panel.warm .v2-sub { color: rgba(255,255,255,.88); }
.v2-panel .gzp-btn { text-decoration: none; display: inline-flex; border-radius: 999px; padding: 14px 24px; margin-top: 22px; }
.v2-panel.warm .gzp-btn { background: #fff; color: var(--ember-deep); box-shadow: none; }
.v2-facts { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 12px; }
.v2-facts li { display: flex; gap: 12px; align-items: flex-start; font-weight: 600; color: var(--flour-dim); }
.v2-facts li span { flex: none; width: 36px; height: 36px; border-radius: 12px; background: var(--cream-2); display: grid; place-items: center; }

/* ---------- Footer ---------- */

.v2-footer { margin-top: clamp(56px, 7vw, 120px); background: var(--flour); color: rgba(255,255,255,.78); }
.v2-footer-grid {
  display: grid; gap: 32px; padding-block: clamp(36px, 5vw, 72px);
  grid-template-columns: 1fr;
}
@media (min-width: 800px) { .v2-footer-grid { grid-template-columns: 1.6fr 1fr 1fr; } }
.v2-footer h4 { margin: 0 0 14px; color: #fff; font-family: "Archivo", sans-serif; font-weight: 800; font-size: 1rem; }
.v2-footer .brand { display: flex; align-items: center; gap: 12px; color: #fff; font-family: "Archivo", sans-serif; font-weight: 850; font-size: 1.3rem; }
.v2-footer .brand img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.v2-footer p { margin: 12px 0 0; max-width: 46ch; font-size: .92rem; line-height: 1.6; color: rgba(255,255,255,.62); }
.v2-footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; }
.v2-footer li button { background: none; border: 0; padding: 0; cursor: pointer; color: rgba(255,255,255,.72); font-weight: 550; }
.v2-footer li button:hover { color: var(--gold); }
.v2-footer-bottom {
  border-top: 1px solid rgba(255,255,255,.12); padding-block: 18px; display: flex; flex-wrap: wrap;
  gap: 10px 20px; align-items: center; justify-content: space-between; font-size: .8rem; color: rgba(255,255,255,.5);
}
.v2-footer-bottom .credit { display: inline-flex; align-items: center; gap: 8px; }
.v2-footer-bottom .credit img { width: 24px; height: 24px; border-radius: 50%; }
.v2-footer-bottom .credit strong { color: rgba(255,255,255,.8); }

.gzp-app { padding-bottom: 0; }
.v2-footer-bottom { padding-bottom: 104px; }

/* ---------- Payment (JazzCash / Raast QR) ---------- */

.pay-methods { border: 0; padding: 0; margin: 4px 0 0; display: grid; gap: 10px; min-width: 0; }
.pay-methods legend { font-weight: 800; font-size: .86rem; margin-bottom: 8px; padding: 0; }
.pay-method {
  position: relative; display: flex; align-items: center; gap: 12px; cursor: pointer;
  padding: 14px 16px; border-radius: 16px; background: #fff;
  border: 2px solid rgba(31,27,24,.12); transition: border-color .15s, box-shadow .15s, background .15s;
}
.pay-method:hover { border-color: rgba(180,6,20,.4); }
.pay-method.is-on { border-color: #B40614; background: #fff5f4; box-shadow: 0 10px 24px -14px rgba(180,6,20,.6); }
.pay-method input { position: absolute; opacity: 0; pointer-events: none; }
.pay-method input:focus-visible ~ .pay-radio { outline: 2px solid var(--gold); outline-offset: 3px; }
.pay-ico { font-size: 1.6rem; flex: none; }
.pay-text { flex: 1; min-width: 0; display: grid; }
.pay-text b { font-size: .98rem; }
.pay-text small { color: var(--flour-dim); font-size: .8rem; }
.pay-radio { flex: none; width: 22px; height: 22px; border-radius: 50%; border: 2px solid rgba(31,27,24,.3); position: relative; }
.pay-method.is-on .pay-radio { border-color: #B40614; }
.pay-method.is-on .pay-radio::after { content: ""; position: absolute; inset: 3px; border-radius: 50%; background: #B40614; }

.pay-card { display: grid; gap: 18px; padding: 16px; border-radius: 20px; background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow-soft); }
.pay-amount {
  display: grid; gap: 2px; text-align: center; padding: 16px; border-radius: 16px;
  background: linear-gradient(135deg, #B40614, #EE4540); color: #fff;
}
.pay-amount span { font-weight: 700; font-size: .82rem; letter-spacing: .08em; text-transform: uppercase; opacity: .9; }
.pay-amount strong { font-family: "Archivo", sans-serif; font-size: clamp(1.8rem, 6vw, 2.4rem); font-weight: 900; letter-spacing: -.03em; line-height: 1.1; }
.pay-amount small { opacity: .9; font-size: .8rem; }

.pay-grid { display: grid; gap: 18px; grid-template-columns: 1fr; align-items: start; }
.pay-qr { display: grid; gap: 8px; justify-items: center; text-align: center; }
.pay-grid, .pay-card, .pay-info { min-width: 0; }
.pay-qr img {
  width: 100%; max-width: 320px; height: auto; border-radius: 14px;
  border: 1px solid var(--line); background: #ffd800;
}
.pay-qr p { margin: 0; font-weight: 700; font-size: .86rem; color: var(--flour-dim); }
.pay-info { display: grid; gap: 12px; min-width: 0; }
.pay-row { display: grid; gap: 4px; padding: 12px 14px; border-radius: 14px; background: var(--cream-2); }
.pay-row > span { font-size: .74rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--flour-faint); }
.pay-row > b { font-size: 1.1rem; overflow-wrap: anywhere; }
.pay-till { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.pay-till b { font-family: "Archivo", sans-serif; font-size: 1.35rem; letter-spacing: .08em; }
.pay-mini {
  border: 1.5px solid #B40614; background: #fff; color: #B40614; border-radius: 999px;
  padding: 6px 14px; font-weight: 800; font-size: .8rem; cursor: pointer; flex: none;
}
.pay-mini:hover { background: #B40614; color: #fff; }
.pay-btn-ghost {
  padding: 12px 16px; border-radius: 999px; cursor: pointer; font-weight: 800;
  background: #fff; border: 1.5px solid rgba(31,27,24,.2);
}
.pay-btn-ghost:hover { border-color: #B40614; color: #B40614; }
.pay-dial { margin: 0; padding: 12px 14px; border-radius: 14px; border: 1.5px dashed rgba(180,6,20,.45); font-size: .92rem; }
.pay-hint { margin: 0; font-size: .82rem; color: var(--flour-dim); }

.pay-proof { display: grid; gap: 14px; padding-top: 16px; border-top: 1px dashed rgba(31,27,24,.18); }
.pay-proof h4 { margin: 0; font-size: 1.05rem; font-weight: 850; }
.pay-err { font-style: normal; font-size: .8rem; font-weight: 650; color: #B40614; }
.pay-file { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.pay-drop {
  width: 100%; padding: 22px; border-radius: 16px; cursor: pointer; font-weight: 800;
  background: #fffaf3; border: 2px dashed rgba(180,6,20,.4); color: #B40614;
}
.pay-drop:hover { background: #fff1ee; }
.pay-shot { display: flex; align-items: center; gap: 14px; padding: 10px; border-radius: 16px; background: #fffaf3; border: 1px solid var(--line); }
.pay-shot img { width: 72px; height: 96px; object-fit: cover; border-radius: 10px; flex: none; }
.pay-shot > div { display: grid; gap: 6px; justify-items: start; min-width: 0; }
.pay-shot b { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .9rem; }
.pay-shot small { color: var(--flour-dim); font-weight: 700; }
.pay-shot small.ok { color: var(--basil); }

.pay-banner { margin-top: 14px; padding: 14px 16px; border-radius: 16px; display: grid; gap: 4px; }
.pay-banner b { font-size: 1.02rem; }
.pay-banner p { margin: 0; font-size: .92rem; }
.pay-banner small { opacity: .75; font-weight: 700; }
.pay-banner.is-wait { background: #fff4d6; border: 1px solid #f5c542; color: #6b4e00; }
.pay-banner.is-bad { background: #fde8e6; border: 1px solid #f19a94; color: #8d0511; }
.pay-banner.is-ok { background: #e3f6ea; border: 1px solid #8ad3a8; color: #0d6b38; }
.pay-btn-wa {
  justify-self: start; margin-top: 8px; padding: 10px 18px; border-radius: 999px; font-weight: 800;
  background: #25d366; color: #fff; text-decoration: none;
}
.gzp-btn.pay-help { text-decoration: none; margin-top: 16px; }

@media (prefers-reduced-motion: reduce) {
  .v2-rvm-overlay, .v2-rvm { animation: none; }
}
`;
