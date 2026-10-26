import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getPublicCategories,
  getPublicDishes,
  getPublicDeals,
  getPublicHeroSlides,
  placeOrder,
  validatePublicCoupon,
  checkWelcomeOffer,
  getMyCoupons,
  getOrderStatus,
  cancelOrder,
  lookupOrderByPhone,
  getPublicSettings,
  getPublicReviews,
  submitReview,
  getCheckoutIdempotencyKey,
  clearCheckoutIdempotencyKey,
} from "./api";
import { resolveImageUrl } from "./utils";
import genzLogo from "./assets/genz-pizza-land-logo.jpg";
import sindbadLogo from "./assets/sindbad-solution-logo.png";
import { DESIGN_STYLES } from "./design";
import {
  PAY_COD,
  PAY_JAZZ,
  DEFAULT_PAYMENTS,
  useJazzForm,
  PaymentMethodPicker,
  JazzCashCard,
  PaymentStatusBanner,
} from "./Payment.jsx";
import { HeroIntro, FeaturesSection, HowItWorks, ReviewsSection, ContactSection, SiteFooter, SECTIONS_STYLES } from "./Sections.jsx";
import { I, FoodIcon } from "./AppIcons.jsx";
import { FulfillmentPicker, FULFILLMENT_STYLES, useFulfillment } from "./Fulfillment.jsx";
import { BYO_STYLES, ByoBanner, ByoBuilder, normalizeByo, byoPercentFor, byoNudge } from "./ByoBuilder.jsx";
import CustomerAccount, { useCustomerAccount } from "./CustomerAccount.jsx";
import { HelpPage, PrivacyPolicy, StoreNotFound, TermsAndConditions } from "./StorePages.jsx";

/* ---------------------------------------------------------------------------
   Everything the storefront needs lives in this one file: styles, fonts and
   markup. Nothing else to copy, nothing else to import.
   --------------------------------------------------------------------------- */

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400..800&display=swap";

const STYLES = `
/* ==========================================================================
   GenZ Pizza Land — storefront
   Palette: cream + charcoal with red actions and yellow offer accents.
   Green is reserved for live/delivery status.
   ========================================================================== */

:root {
  --ink-900: #FFF8EF;
  --ink-850: rgba(255, 248, 239, 0.98);
  --ink-800: rgba(255, 255, 255, 0.78);
  --ink-700: rgba(255, 255, 255, 0.56);
  --ink-600: rgba(37, 37, 37, 0.22);
  --line: rgba(37, 37, 37, 0.14);

  --flour: #252525;
  --flour-dim: #5b5b5b;
  --flour-faint: #777777;

  --ember: #E6392F;
  --ember-deep: #c92f27;
  --gold: #FFC83D;
  --basil: #1a9e56;
  --chili: #ff5d5d;

  --heat: #E6392F;

  --r-xl: 26px;
  --r-lg: 18px;
  --r-md: 12px;
  --r-pill: 999px;

  --shadow-lift: 0 18px 40px -18px rgba(37, 37, 37, 0.18);
  --shadow-float: 0 22px 50px -12px rgba(37, 37, 37, 0.22);

  --header-h: 60px;
  --nav-h: 54px;
  --shell: 100%;
  --gutter: clamp(16px, 2.6vw, 56px);
}

* {
  box-sizing: border-box;
}

html {
  /* clip (not hidden) — \`overflow-x: hidden\` turns the page into a scroll
     container and silently kills every \`position: sticky\` inside it. */
  overflow-x: clip;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  overflow-x: clip;
  font-family: "Hanken Grotesk", ui-sans-serif, system-ui, -apple-system,
    "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  background:
    radial-gradient(900px 520px at 88% -4%, rgba(255, 200, 61, 0.12), transparent 62%),
    radial-gradient(720px 520px at -4% 104%, rgba(230, 57, 47, 0.04), transparent 62%),
    var(--ink-900);
  background-attachment: fixed;
  color: var(--flour);
  color-scheme: light;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* See the scroll-hover-fix effect in App(). pointer-events is inherited,
   so suspending it on body while a scroll is in progress covers every
   descendant without touching each component's hover CSS individually. */
body.is-scrolling {
  pointer-events: none;
}

/* Fine grain over the whole page so flat dark panels don't look plastic. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}

h1,
h2,
h3,
.gzp-num {
  font-family: "Archivo", "Hanken Grotesk", system-ui, sans-serif;
  font-variation-settings: "wdth" 112;
  margin: 0;
}

img {
  display: block;
}

button,
input,
textarea,
select {
  font: inherit;
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
  border-radius: 6px;
}

::selection {
  background: var(--ember);
  color: #ffffff;
}

/* Scrollbars on the rails and sheets */
.gzp-rail::-webkit-scrollbar,
.gzp-sheet-body::-webkit-scrollbar,
.gzp-navbar-chips::-webkit-scrollbar {
  height: 0;
  width: 0;
}

/* ---------- Shell ---------- */

.gzp-app {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-bottom: 120px;
}

.gzp-shell {
  width: 100%;
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 900px) {
  .gzp-shell {
    padding: 0 var(--gutter);
  }
}

/* ---------- Header ---------- */

.gzp-header {
  position: sticky;
  top: 0;
  z-index: 60;
  height: var(--header-h);
  display: flex;
  align-items: center;
  background: var(--flour);
  box-shadow: 0 6px 18px -10px rgba(37, 37, 37, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
}

.gzp-header-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 900px) {
  .gzp-header-inner {
    padding: 0 var(--gutter);
  }
}

.gzp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto;
  min-width: 0;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.gzp-brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: cover;
  flex: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85);
}

.gzp-brand-name {
  color: #ffffff;
  font-family: "Archivo", sans-serif;
  font-variation-settings: "wdth" 108;
  font-weight: 750;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gzp-brand-sub {
  display: block;
  font-family: "Hanken Grotesk", sans-serif;
  font-variation-settings: normal;
  font-weight: 500;
  font-size: 0.7rem;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.86);
}

.gzp-icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--ink-800);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.gzp-icon-btn:hover {
  border-color: rgba(37, 37, 37, 0.32);
  background: var(--ink-700);
}

.gzp-icon-btn svg {
  width: 19px;
  height: 19px;
  flex: none;
}

.gzp-cart-btn {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 248, 239, 0.96);
}

.gzp-cart-btn:hover {
  border-color: #ffffff;
  background: #ffffff;
}

.gzp-cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: var(--r-pill);
  background: var(--gold);
  color: var(--flour);
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.68rem;
  display: grid;
  place-items: center;
  border: 2px solid var(--ink-900);
}

/* ---------- Hero ---------- */

/* Full-bleed slider — no text, no grid, just the banner staff configure
   from the POS dashboard (Dashboard > Hero Slider), edge-to-edge. */
.gzp-hero {
  position: relative;
}

/* Hero slider — now the entire hero: a full-width, edge-to-edge
   auto-rotating crossfade through whatever the admin panel has uploaded
   (Dashboard > Hero Slider), no rounded frame, no side padding. */
.gzp-slider {
  position: relative;
  overflow: hidden;
  background: var(--ink-800);
  width: 100%;
  aspect-ratio: 8 / 3;
  cursor: pointer;
}

@media (min-width: 640px) {
  .gzp-slider {
    aspect-ratio: 16 / 3.5;
  }
}

@media (min-width: 900px) {
  .gzp-slider {
    aspect-ratio: 21 / 3.5;
  }
}

.gzp-slider-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.7s ease;
}

.gzp-slider-img.is-active {
  opacity: 1;
}

.gzp-slider-fallback {
  display: grid;
  place-items: center;
  height: 100%;
  background: var(--ink-900);
}

.gzp-slider-fallback img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.gzp-slider-dots {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
  display: flex;
  gap: 6px;
  padding: 7px;
  border-radius: var(--r-pill);
  background: rgba(11, 13, 16, 0.6);
  backdrop-filter: blur(6px);
}

.gzp-slider-dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border-radius: 50%;
  border: 0;
  background: rgba(242, 239, 233, 0.4);
  cursor: pointer;
  transition: background 0.2s ease, width 0.2s ease;
}

.gzp-slider-dot.is-active {
  width: 16px;
  border-radius: var(--r-pill);
  background: var(--gold);
}

/* ---------- Buttons ---------- */

.gzp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--r-md);
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 0.94rem;
  cursor: pointer;
  transition: transform 0.12s ease, filter 0.15s ease, background 0.15s ease,
    border-color 0.15s ease;
}

.gzp-btn svg {
  flex: none;
}

.gzp-btn:active {
  transform: translateY(1px);
}

.gzp-btn-primary {
  background: var(--heat);
  color: #ffffff;
  box-shadow: 0 10px 26px -12px rgba(230, 57, 47, 0.55);
}

.gzp-btn-primary:hover {
  background: var(--ember-deep);
}

.gzp-btn-primary:disabled {
  filter: grayscale(0.5) brightness(0.8);
  cursor: not-allowed;
}

.gzp-btn-ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--flour);
}

.gzp-btn-ghost:hover {
  border-color: rgba(37, 37, 37, 0.32);
  background: var(--ink-800);
}

.gzp-btn-block {
  width: 100%;
}

/* ---------- Sticky category nav ---------- */

.gzp-navbar {
  position: sticky;
  top: var(--header-h);
  z-index: 50;
  background: rgba(255, 248, 239, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(37, 37, 37, 0.14);
}

.gzp-navbar-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 16px;
  height: var(--nav-h);
}

@media (min-width: 900px) {
  .gzp-navbar-inner {
    padding: 0 var(--gutter);
  }
}

.gzp-navbar-chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: 1;
  height: 100%;
  align-items: center;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.gzp-chip {
  flex: none;
  padding: 8px 15px;
  border-radius: var(--r-pill);
  border: 1px solid transparent;
  background: transparent;
  color: var(--flour-dim);
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  scroll-snap-align: center;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.gzp-chip:hover {
  color: var(--flour);
  background: var(--ink-800);
}

.gzp-chip.is-active {
  color: #ffffff;
  background: var(--heat);
  font-weight: 700;
}

/* ---------- Sections ---------- */

.gzp-section {
  padding-top: 34px;
  scroll-margin-top: calc(var(--header-h) + var(--nav-h) + 10px);
}

.gzp-section-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.gzp-section-head h2 {
  font-weight: 800;
  font-variation-settings: "wdth" 114;
  font-size: clamp(1.4rem, 3.6vw, 2.05rem);
  letter-spacing: -0.03em;
}

.gzp-section-count {
  color: var(--flour-faint);
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.gzp-section-rule {
  flex: 1;
  min-width: 20px;
  height: 1px;
  background: linear-gradient(90deg, var(--line), transparent);
}

/* ---------- Deals rail ---------- */

.gzp-rail-wrap {
  position: relative;
}

.gzp-rail {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 2px 2px 8px;
  -webkit-overflow-scrolling: touch;
}

.gzp-rail-nav {
  display: none;
  gap: 8px;
}

@media (min-width: 900px) {
  .gzp-rail-nav {
    display: flex;
  }
}

.gzp-rail-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--ink-800);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.gzp-rail-btn:hover {
  border-color: var(--ember);
  background: var(--ink-700);
}

.gzp-rail-btn svg {
  width: 17px;
  height: 17px;
}

.gzp-deal {
  position: relative;
  flex: 0 0 272px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: border-color 0.18s ease, transform 0.18s ease;
}

@media (min-width: 720px) {
  .gzp-deal {
    flex-basis: 310px;
  }
}

.gzp-deal:hover {
  border-color: rgba(230, 57, 47, 0.45);
  transform: translateY(-2px);
}

.gzp-deal-media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--ink-700);
}

.gzp-deal-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gzp-deal:hover .gzp-deal-media img {
  transform: scale(1.04);
}

.gzp-stock {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  background: rgba(11, 13, 16, 0.85);
  border: 1px solid rgba(246, 177, 0, 0.55);
  color: #FFC83D;
  font-weight: 700;
  font-size: 0.72rem;
}

.gzp-stock.is-out {
  border-color: rgba(228, 20, 43, 0.6);
  color: var(--ember);
}

.gzp-stock-note {
  margin: 6px 0 0;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--flour);
}

.gzp-stock-note.is-out {
  color: var(--ember);
}

.gzp-whatsapp {
  position: fixed;
  right: 16px;
  bottom: 92px;
  z-index: 60;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #25d366;
  box-shadow: 0 10px 26px -8px rgba(37, 211, 102, 0.75), 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
}

.gzp-whatsapp:hover {
  transform: scale(1.08);
}

.gzp-media-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 2.2rem;
  background: var(--ink-900);
}

.gzp-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: var(--r-pill);
  background: var(--heat);
  color: #ffffff;
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.68rem;
  letter-spacing: 0.02em;
}

.gzp-save {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: var(--r-pill);
  background: rgba(11, 13, 16, 0.82);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(86, 209, 141, 0.4);
  color: var(--basil);
  font-weight: 700;
  font-size: 0.72rem;
}

.gzp-deal-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  padding: 14px 15px 15px;
}

.gzp-deal-body h3 {
  font-weight: 750;
  font-size: 1.08rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.gzp-deal-contents {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--flour-dim);
  font-size: 0.85rem;
}

.gzp-deal-contents li {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  line-height: 1.35;
}

.gzp-deal-contents li::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ember);
  flex: none;
  margin-top: 7px;
}

.gzp-deal-more {
  color: var(--flour-faint);
  font-size: 0.8rem;
}

.gzp-deal-choice {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: var(--ink-800);
  border: 1px solid var(--line);
}

.gzp-deal-choice-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--flour);
}

.gzp-deal-choice .gzp-variant-row {
  flex-wrap: wrap;
}

.gzp-deal-desc {
  margin: 0;
  color: var(--flour-dim);
  font-size: 0.87rem;
  line-height: 1.45;
}

.gzp-deal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 4px;
}

/* ---------- Price ---------- */

.gzp-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: "Archivo", sans-serif;
  font-variation-settings: "wdth" 108;
  font-weight: 800;
  font-size: 1.12rem;
  letter-spacing: -0.02em;
  color: var(--ember); /* prices in Pepperoni Red */
  font-variant-numeric: tabular-nums;
}

.gzp-price s {
  font-weight: 500;
  font-size: 0.82rem;
  color: var(--flour-faint);
  text-decoration-thickness: 1px;
}

/* ---------- Menu grid ---------- */

.gzp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  gap: 12px;
}

@media (min-width: 640px) {
  .gzp-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
  }
}

.gzp-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: border-color 0.18s ease, transform 0.18s ease;
}

.gzp-card:hover {
  border-color: rgba(230, 57, 47, 0.35);
  transform: translateY(-2px);
}

.gzp-card-media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ink-700);
}

.gzp-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gzp-card:hover .gzp-card-media img {
  transform: scale(1.05);
}

.gzp-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  padding: 12px 13px 13px;
}

.gzp-card-body h3 {
  font-weight: 700;
  font-size: 0.98rem;
  line-height: 1.25;
  letter-spacing: -0.015em;
  cursor: pointer;
}

.gzp-card-desc {
  margin: -4px 0 0;
  color: var(--flour-dim);
  font-size: 0.82rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gzp-price-from {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--flour-faint);
  margin-right: -2px;
}

.gzp-variant-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gzp-select {
  flex: 1;
  min-width: 88px;
  appearance: none;
  -webkit-appearance: none;
  background: var(--ink-900)
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0l5 6 5-6z' fill='%2362666f'/></svg>")
    no-repeat right 10px center;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  padding: 8px 26px 8px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--flour);
  cursor: pointer;
}

.gzp-select:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 1px;
}

.gzp-wish {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 0;
  background: rgba(18, 18, 21, 0.78);
  color: #FFC83D;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.12s ease;
}

.gzp-wish svg {
  width: 15px;
  height: 15px;
}

.gzp-wish:active {
  transform: scale(0.9);
}

.gzp-wish.is-active {
  color: #ffffff;
  background: var(--ember);
}

.gzp-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}

/* Add control — circle on grid cards, pill on deals */
.gzp-add {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  border: 0;
  background: var(--heat);
  color: #ffffff;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.12s ease;
}

.gzp-add:hover {
  filter: brightness(1.08);
}

.gzp-add:active {
  transform: scale(0.94);
}

.gzp-add svg {
  width: 18px;
  height: 18px;
}

.gzp-add-wide {
  width: auto;
  padding: 0 16px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.88rem;
}

.gzp-add-wide svg {
  width: 16px;
  height: 16px;
}

.gzp-add-wide:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: none;
}

.gzp-stepper {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-radius: var(--r-md);
  border: 1px solid rgba(230, 57, 47, 0.35);
  background: rgba(230, 57, 47, 0.06);
  overflow: hidden;
}

.gzp-stepper button {
  width: 32px;
  height: 34px;
  border: 0;
  background: transparent;
  color: var(--ember);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease;
}

.gzp-stepper button:hover {
  background: rgba(230, 57, 47, 0.12);
}

.gzp-stepper span {
  min-width: 20px;
  text-align: center;
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.92rem;
  font-variant-numeric: tabular-nums;
}

.gzp-stepper-lg button {
  width: 44px;
  height: 46px;
  font-size: 1.4rem;
}

.gzp-stepper-lg span {
  min-width: 34px;
  font-size: 1.05rem;
}

/* ---------- Search overlay ---------- */

.gzp-search {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(7, 8, 10, 0.72);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.gzp-search-bar {
  width: 100%;
  max-width: 620px;
  margin-top: 14vh;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 16px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  box-shadow: var(--shadow-float);
}

.gzp-search-bar > svg {
  width: 20px;
  height: 20px;
  flex: none;
  color: var(--flour-faint);
}

.gzp-search-bar input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  padding: 12px 0;
  font-size: 1.05rem;
}

.gzp-search-bar input::placeholder {
  color: var(--flour-faint);
}

.gzp-search-results {
  width: 100%;
  max-width: 620px;
  margin-top: 12px;
  max-height: 58vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 20px;
}

.gzp-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--ink-850);
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.gzp-result:hover {
  border-color: rgba(37, 37, 37, 0.32);
}

.gzp-result img,
.gzp-result .gzp-result-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  object-fit: cover;
  flex: none;
  display: grid;
  place-items: center;
  background: var(--ink-700);
  font-size: 1.2rem;
}

.gzp-result-name {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gzp-result-cat {
  display: block;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--flour-faint);
}

.gzp-search-empty {
  text-align: center;
  color: var(--flour-dim);
  padding: 26px 0;
}

/* ---------- Quick view ---------- */

.gzp-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(7, 8, 10, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  animation: gzp-fade 0.18s ease;
}

@keyframes gzp-fade {
  from {
    opacity: 0;
  }
}

.gzp-modal {
  margin: auto;
  width: 100%;
  max-width: 460px;
  border-radius: var(--r-xl);
  border: 1px solid var(--line);
  background: var(--ink-850);
  box-shadow: var(--shadow-float);
  overflow: hidden;
  animation: gzp-rise 0.22s cubic-bezier(0.2, 0.8, 0.3, 1);
}

@keyframes gzp-rise {
  from {
    transform: translateY(14px);
    opacity: 0;
  }
}

.gzp-modal-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--ink-700);
}

.gzp-modal-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gzp-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: rgba(255, 248, 239, 0.96);
  backdrop-filter: blur(6px);
  color: var(--flour);
  font-size: 1rem;
  cursor: pointer;
  z-index: 3;
}

.gzp-modal-body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gzp-modal-body h2 {
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.gzp-modal-foot {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gzp-modal-foot .gzp-btn {
  flex: 1;
}

.gzp-btn-split {
  justify-content: space-between;
  padding-left: 18px;
  padding-right: 18px;
  font-variant-numeric: tabular-nums;
}

/* ---------- Bottom cart bar ---------- */

.gzp-cartbar {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 70;
  width: calc(100% - 32px);
  max-width: 460px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px 12px 18px;
  border-radius: var(--r-lg);
  border: 0;
  background: var(--heat);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 18px 40px -14px rgba(230, 57, 47, 0.5);
  animation: gzp-rise 0.24s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.gzp-cartbar-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.gzp-cartbar-label small {
  font-size: 0.74rem;
  font-weight: 600;
  opacity: 0.75;
}

.gzp-cartbar-label b {
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
}

.gzp-cartbar-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.2);
  font-weight: 800;
  font-size: 0.9rem;
}

/* ---------- Sheet (cart / checkout / track) ---------- */

.gzp-sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 85;
  background: rgba(7, 8, 10, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: gzp-fade 0.18s ease;
}

@media (min-width: 720px) {
  .gzp-sheet-overlay {
    align-items: stretch;
    justify-content: flex-end;
  }
}

.gzp-sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90vh;
  background: var(--ink-850);
  border: 1px solid var(--line);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  box-shadow: var(--shadow-float);
  animation: gzp-sheet-up 0.26s cubic-bezier(0.2, 0.8, 0.3, 1);
}

@keyframes gzp-sheet-up {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
}

@media (min-width: 720px) {
  .gzp-sheet {
    width: 430px;
    max-height: none;
    height: 100%;
    border-radius: 0;
    border-right: 0;
    animation: gzp-sheet-in 0.26s cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  @keyframes gzp-sheet-in {
    from {
      transform: translateX(30px);
      opacity: 0;
    }
  }
}

.gzp-sheet-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--line);
}

.gzp-sheet-head h2 {
  flex: 1;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}

.gzp-sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gzp-sheet-foot {
  padding: 14px 20px 20px;
  border-top: 1px solid var(--line);
  background: var(--ink-800);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gzp-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gzp-line img,
.gzp-line .gzp-line-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  flex: none;
  display: grid;
  place-items: center;
  background: var(--ink-700);
  font-size: 1.3rem;
}

.gzp-line-main {
  flex: 1;
  min-width: 0;
}

.gzp-line-main h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 650;
  line-height: 1.25;
}

.gzp-line-main span {
  font-size: 0.82rem;
  color: var(--flour-faint);
  font-variant-numeric: tabular-nums;
}

.gzp-line-variant {
  margin: 0;
  font-size: 0.76rem;
  color: var(--flour-faint);
}

.gzp-tag {
  display: inline-block;
  margin-right: 6px;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(37, 37, 37, 0.16);
  color: var(--gold);
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.62rem;
  letter-spacing: 0.04em;
  vertical-align: middle;
}

.gzp-totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.92rem;
  color: var(--flour-dim);
}

.gzp-totals div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-variant-numeric: tabular-nums;
}

.gzp-totals .gzp-grand {
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  color: var(--flour);
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 1.14rem;
  letter-spacing: -0.02em;
}

/* ---------- Forms ---------- */

.gzp-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gzp-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gzp-field span {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--flour-dim);
}

.gzp-field input,
.gzp-field textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--ink-900);
  outline: none;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.gzp-field input:focus,
.gzp-field textarea:focus {
  border-color: var(--ember);
  box-shadow: 0 0 0 3px rgba(230, 57, 47, 0.14);
}

.gzp-field input::placeholder,
.gzp-field textarea::placeholder {
  color: var(--flour-faint);
}

.gzp-note {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(86, 209, 141, 0.28);
  background: rgba(86, 209, 141, 0.07);
  color: var(--flour-dim);
  font-size: 0.86rem;
  line-height: 1.4;
}

.gzp-note svg {
  flex: none;
  color: var(--basil);
  margin-top: 1px;
}

.gzp-note b {
  color: var(--basil);
}

.gzp-error {
  padding: 11px 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255, 93, 93, 0.35);
  background: rgba(255, 93, 93, 0.09);
  color: var(--ember);
  font-size: 0.88rem;
}

.gzp-error-banner {
  max-width: var(--shell);
  margin: 14px auto 0;
}

/* ---------- Order tracking ---------- */

.gzp-track {
  max-width: 620px;
  margin: 0 auto;
  padding: 28px 0 40px;
}

.gzp-track-hero {
  border-radius: var(--r-xl);
  border: 1px solid var(--line);
  background: linear-gradient(180deg, var(--ink-800), var(--ink-850));
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.gzp-track-hero::after {
  content: "";
  position: absolute;
  top: -120px;
  right: -80px;
  width: 320px;
  height: 260px;
  background: radial-gradient(
    circle,
    rgba(230, 57, 47, 0.18),
    transparent 65%
  );
  pointer-events: none;
}

.gzp-track-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.gzp-track-top h1 {
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.gzp-track-id {
  margin: 6px 0 0;
  color: var(--flour-faint);
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
}

.gzp-eta {
  margin: 16px 0 0;
  color: var(--flour-dim);
  font-size: 0.95rem;
}

.gzp-steps {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.gzp-steps li {
  position: relative;
  padding: 0 0 20px 34px;
  color: var(--flour-faint);
  font-size: 0.95rem;
}

.gzp-steps li:last-child {
  padding-bottom: 0;
}

.gzp-steps li::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: var(--ink-850);
  z-index: 2;
}

.gzp-steps li::after {
  content: "";
  position: absolute;
  left: 10px;
  top: 17px;
  bottom: 0;
  width: 2px;
  background: var(--line);
}

.gzp-steps li:last-child::after {
  display: none;
}

.gzp-steps li.is-done {
  color: var(--flour);
  font-weight: 600;
}

.gzp-steps li.is-done::before {
  border-color: var(--basil);
  background: var(--basil);
}

.gzp-steps li.is-done::after {
  background: var(--basil);
}

.gzp-steps li.is-current::before {
  border-color: var(--ember);
  background: var(--ember);
  box-shadow: 0 0 0 5px rgba(230, 57, 47, 0.18);
}

.gzp-steps li.is-current {
  color: var(--flour);
  font-weight: 700;
}

.gzp-panel {
  margin-top: 16px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-850);
  padding: 18px 20px;
}

.gzp-panel h3 {
  font-size: 1.05rem;
  font-weight: 750;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.gzp-order-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(220, 222, 227, 0.9);
  font-size: 0.93rem;
  font-variant-numeric: tabular-nums;
}

.gzp-order-line:last-of-type {
  border-bottom: 0;
}

.gzp-order-sub {
  margin: 2px 0 0;
  color: var(--flour-faint);
  font-size: 0.8rem;
  line-height: 1.4;
}

.gzp-cancelled {
  margin: 18px 0 0;
  padding: 14px 16px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255, 93, 93, 0.3);
  background: rgba(255, 93, 93, 0.08);
  color: var(--ember);
}

/* ---------- Footer ---------- */

.gzp-footer {
  margin-top: 54px;
  border-top: 1px solid var(--line);
  padding: 28px 0 10px;
}

.gzp-footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
}

.gzp-footer p {
  margin: 0;
  color: var(--flour-faint);
  font-size: 0.85rem;
  max-width: 46ch;
  line-height: 1.5;
}

.gzp-footer strong {
  display: block;
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  color: var(--flour);
  margin-bottom: 4px;
}

.gzp-footer-credit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: var(--flour-faint);
  font-size: 0.75rem;
}

.gzp-footer-credit img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.gzp-footer-credit strong {
  display: inline;
  margin: 0;
  color: var(--flour-dim);
  font-family: inherit;
  font-size: inherit;
  font-weight: 700;
  letter-spacing: normal;
}

/* ---------- Toast ---------- */

.gzp-toast {
  position: fixed;
  left: 50%;
  bottom: 96px;
  transform: translateX(-50%);
  z-index: 95;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border-radius: var(--r-pill);
  background: var(--ink-700);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-float);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  animation: gzp-toast-in 0.22s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.gzp-toast i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--basil);
  color: #06301c;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 900;
}

@keyframes gzp-toast-in {
  from {
    transform: translate(-50%, 10px);
    opacity: 0;
  }
}

/* ---------- Loading / empty ---------- */

.gzp-boot {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--flour-dim);
}

.gzp-boot img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  animation: gzp-bob 1.3s ease-in-out infinite;
}

@keyframes gzp-bob {
  0%,
  100% {
    transform: translateY(0) rotate(-4deg);
  }
  50% {
    transform: translateY(-9px) rotate(4deg);
  }
}

.gzp-skeleton {
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  overflow: hidden;
}

.gzp-skeleton-media {
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    100deg,
    var(--ink-700) 30%,
    var(--ink-600) 50%,
    var(--ink-700) 70%
  );
  background-size: 220% 100%;
  animation: gzp-shimmer 1.4s linear infinite;
}

.gzp-skeleton-lines {
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.gzp-skeleton-lines i {
  height: 11px;
  border-radius: 5px;
  background: var(--ink-700);
}

.gzp-skeleton-lines i:last-child {
  width: 52%;
}

@keyframes gzp-shimmer {
  to {
    background-position: -220% 0;
  }
}

.gzp-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 44px 20px;
  border-radius: var(--r-lg);
  border: 1px dashed var(--line);
  color: var(--flour-dim);
  text-align: center;
}

.gzp-empty span {
  font-size: 1.9rem;
}

/* ---------- Motion preferences ---------- */


/* ---- Order-confirmation popup: a small centered card, not full screen ---- */
.gzp-thankyou-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(20, 22, 30, 0.55);
  backdrop-filter: blur(4px);
  overflow-y: auto;
}

.gzp-thankyou-card {
  position: relative;
  width: 100%;
  max-width: 380px;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 26px 24px 22px;
  border-radius: 24px;
  background: #FFF8EF;
  border: 1px solid rgba(230, 57, 47, 0.25);
  box-shadow: var(--shadow-float), 0 0 40px -10px rgba(230, 57, 47, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: gzp-thankyou-pop 0.35s ease-out;
}

@keyframes gzp-thankyou-pop {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: none; }
}

.gzp-thankyou-sticker {
  position: absolute;
  font-size: 20px;
  line-height: 1;
  pointer-events: none;
}
.gzp-thankyou-sticker.tl { top: 44px; left: 22px; transform: rotate(-14deg); }
.gzp-thankyou-sticker.tr { top: 30px; right: 34px; transform: rotate(10deg); }
.gzp-thankyou-sticker.bl { top: 82px; left: 64px; transform: rotate(-6deg); }
.gzp-thankyou-sticker.br { top: 70px; right: 22px; transform: rotate(14deg); }

.gzp-thankyou-badge {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
  border: 3px solid #FFF8EF;
  box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.4);
}
.gzp-thankyou-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gzp-thankyou-mascot {
  width: 96px;
  height: 96px;
  margin: 8px 0 4px;
  flex-shrink: 0;
}

.gzp-thankyou-title {
  margin: 8px 0 0;
  font-size: 26px;
  font-weight: 800;
  color: var(--flour);
}

.gzp-thankyou-sub {
  margin: 8px 0 14px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--flour-dim);
  max-width: 280px;
}

.gzp-thankyou-pill {
  padding: 8px 16px;
  border-radius: var(--r-pill);
  background: var(--ink-800);
  border: 1px solid var(--line);
  font-size: 14px;
  font-weight: 700;
  color: var(--flour);
}

.gzp-thankyou-track-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px 16px;
  border: 0;
  border-radius: var(--r-md);
  background: var(--heat);
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 10px 24px -10px rgba(230, 57, 47, 0.55);
}
.gzp-thankyou-track-btn:hover { filter: brightness(1.06); }

.gzp-thankyou-link {
  margin-top: 14px;
  padding: 4px;
  border: 0;
  background: none;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--flour-dim);
  text-decoration: underline;
  cursor: pointer;
}

.gzp-delivered-mascot {
  animation: gzp-delivered-bob 2.2s ease-in-out infinite;
}
@keyframes gzp-delivered-bob {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
.gzp-delivered-countdown {
  margin: 16px 0 0;
  color: var(--flour-dim);
  font-size: 13px;
}
@media (prefers-reduced-motion: reduce) {
  .gzp-delivered-mascot { animation: none; }
}

/* Popup on small phones / short screens */
@media (max-width: 400px) {
  .gzp-thankyou-overlay { padding: 12px; align-items: center; }
  .gzp-thankyou-card { padding: 22px 18px 18px; border-radius: 20px; }
  .gzp-thankyou-mascot { width: 80px; height: 80px; }
  .gzp-thankyou-title { font-size: 22px; }
  .gzp-thankyou-sub { font-size: 13px; }
  .gzp-thankyou-sticker { font-size: 17px; }
  .gzp-thankyou-sticker.bl { left: 50px; }
}
@media (max-height: 560px) {
  .gzp-thankyou-overlay { align-items: flex-start; padding-top: 40px; }
  .gzp-thankyou-mascot { width: 64px; height: 64px; }
}

/* ---------- Dark + animated background polish ---------- */

/* Cards sit over the moving background: frosted glass + ember glow on hover. */
.gzp-card,
.gzp-deal {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(37, 37, 37, 0.14);
  transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}
.gzp-card:hover,
.gzp-deal:hover {
  border-color: rgba(230, 57, 47, 0.45);
  box-shadow: 0 0 0 1px rgba(230, 57, 47, 0.18), 0 18px 44px -18px rgba(230, 57, 47, 0.3);
}

input,
textarea,
select {
  color-scheme: light;
}
input::placeholder,
textarea::placeholder {
  color: var(--flour-faint);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
/* ---------- Reviews section ---------- */

.gzp-reviews-section {
  padding: 56px 0 80px;
  background: var(--ink-900);
}

.gzp-reviews-section .gzp-shell {
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 20px;
}

.gzp-reviews-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 40px;
  text-align: left;
}

@media (min-width: 768px) {
  .gzp-reviews-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }
}

.gzp-reviews-intro h2 {
  font-family: "Archivo", "Hanken Grotesk", ui-sans-serif, system-ui,
    -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 8px;
  color: var(--flour);
}

.gzp-reviews-intro p {
  margin: 0;
  font-size: 1.05rem;
  color: var(--flour-dim);
}

.gzp-reviews-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.gzp-stats-rating {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.gzp-stats-average {
  font-family: "Archivo", "Hanken Grotesk", ui-sans-serif, system-ui,
    -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--flour);
  line-height: 1;
}

.gzp-stats-stars {
  display: flex;
  gap: 4px;
  color: var(--gold);
}

.gzp-stats-count {
  font-size: 1rem;
  color: var(--flour-dim);
}

.gzp-reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.gzp-review-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--ink-850);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gzp-review-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
}

.gzp-review-head {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

@media (min-width: 480px) {
  .gzp-review-head {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.gzp-review-head > div:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gzp-review-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--flour);
}

.gzp-review-verified {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--basil);
  background: rgba(26, 158, 86, 0.1);
  padding: 2px 8px;
  border-radius: var(--r-pill);
}

.gzp-review-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

@media (min-width: 480px) {
  .gzp-review-meta {
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }
}

.gzp-review-stars {
  display: flex;
  gap: 4px;
  color: var(--gold);
}

.gzp-review-product {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ember);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.gzp-review-date {
  font-size: 0.8rem;
  color: var(--flour-faint);
}

.gzp-review-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--flour);
}

.gzp-reviews-foot {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.gzp-empty-reviews {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: var(--flour-dim);
}

.gzp-rating-picker {
  display: flex;
  direction: rtl;
  gap: 6px;
  justify-content: center;
}

.gzp-star-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #ccc;
  transition: transform 0.1s ease;
}

.gzp-star-btn:hover,
.gzp-star-btn.is-active {
  color: var(--gold);
}

.gzp-star-btn:active {
  transform: scale(0.9);
}

.gzp-star-btn svg {
  display: block;
}

.gzp-review-form-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.gzp-review-success {
  color: var(--basil);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

/* ---------- All reviews page ---------- */

.gzp-all-reviews-page {
  padding: 26px 0 120px;
}

.gzp-all-reviews-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 26px;
  flex-wrap: wrap;
}

.gzp-all-reviews-intro {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gzp-all-reviews-intro h2 {
  font-weight: 800;
  font-variation-settings: "wdth" 114;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  letter-spacing: -0.03em;
}

.gzp-all-reviews-intro p {
  color: var(--flour-dim);
  font-size: 0.95rem;
}

.gzp-all-reviews-stats {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-shrink: 0;
}

.gzp-all-reviews-average {
  font-family: "Archivo", sans-serif;
  font-variation-settings: "wdth" 108;
  font-weight: 800;
  font-size: 2.4rem;
  letter-spacing: -0.02em;
  color: var(--flour);
}

.gzp-all-reviews-stars {
  display: flex;
  gap: 4px;
  color: var(--gold);
}

.gzp-all-reviews-count {
  color: var(--flour-faint);
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 8px;
}

.gzp-all-reviews-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  margin-top: 6px;
}

@media (min-width: 720px) {
  .gzp-all-reviews-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .gzp-all-reviews-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.gzp-all-reviews-foot {
  margin-top: 34px;
  display: flex;
  justify-content: center;
}

.gzp-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: var(--flour-dim);
  text-align: center;
}

.gzp-empty p {
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 640px) {
  .gzp-reviews-section {
    padding: 40px 0 60px;
  }
  .gzp-reviews-grid {
    grid-template-columns: 1fr;
  }
}
`;

// Injected once, on first import, so the stylesheet is in place before the
// first paint and a hot reload never stacks duplicates.
(() => {
  if (typeof document === "undefined") return;

  if (!document.getElementById("gzp-fonts")) {
    const pre1 = document.createElement("link");
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";
    document.head.appendChild(pre1);

    const pre2 = document.createElement("link");
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "";
    document.head.appendChild(pre2);

    const fonts = document.createElement("link");
    fonts.id = "gzp-fonts";
    fonts.rel = "stylesheet";
    fonts.href = FONTS_HREF;
    document.head.appendChild(fonts);
  }

  let tag = document.getElementById("gzp-styles");
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "gzp-styles";
    document.head.appendChild(tag);
  }
  tag.textContent = STYLES + BYO_STYLES + DESIGN_STYLES + FULFILLMENT_STYLES + SECTIONS_STYLES;

  // Dark browser chrome on mobile, so the notch area matches the page.
  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#FFF8EF";
    document.head.appendChild(meta);
  }
})();

// Fallback only, for the instant before the live rate loads (see the
// taxRatePercent state in App() below) — the real value is admin-editable
// from POS Dashboard > Tax and fetched from the backend, same as the POS.
const FALLBACK_TAX_RATE_PERCENT = 16;

const STATUS_STEPS = ["Pending", "Accepted", "Preparing", "Ready to Deliver", "Completed"];
// JazzCash/Raast orders start one step earlier: staff confirm the money first.
const PAID_STATUS_STEPS = ["Payment Pending Verification", "Accepted", "Preparing", "Ready to Deliver", "Completed"];
const WAITING_STATUS = "Payment Pending Verification";

const STATUS_LABELS = {
  [WAITING_STATUS]: "Verifying your payment",
  Pending: "Order received",
  Accepted: "Accepted by the kitchen",
  Preparing: "Preparing your food",
  "Ready to Deliver": "Out for delivery",
  Completed: "Delivered",
  Cancelled: "Cancelled",
};

const STATUS_HEADLINES = {
  [WAITING_STATUS]: "Verifying your payment",
  Pending: "We've got your order",
  Accepted: "The kitchen is on it",
  Preparing: "Your food is cooking",
  "Ready to Deliver": "On the way to you",
  Completed: "Delivered — enjoy",
  Cancelled: "Order cancelled",
};

const DEALS_SECTION_ID = "deals";

// Shop WhatsApp number used by the floating "Inquiry" button.
const WHATSAPP_NUMBER = "923259061006"; // +92 325 9061006
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello GenZ Pizza Land, I have an inquiry."
)}`;

// How often the menu re-reads live stock from the inventory.
const STOCK_REFRESH_MS = 10000;

/* Rupee amounts with thousands separators; decimals only when they exist. */
const formatRs = (value) => {
  const n = Number(value) || 0;
  return `Rs ${n.toLocaleString("en-PK", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

/* ---------------- Size/crust variants (pizzas, mainly) ----------------
   A dish with `variants` needs a size (and sometimes a crust) picked before
   it can be added. The matching variant's price is what's charged — it's
   also recalculated server-side on checkout, so nothing here needs to be
   trusted blindly, this is purely for showing the right price as staff
   configured it. */
const variantSizes = (dish) => {
  const seen = [];
  (dish?.variants || []).forEach((v) => {
    if (v.size && !seen.includes(v.size)) seen.push(v.size);
  });
  return seen;
};

const variantCrustsForSize = (dish, size) => {
  const seen = [];
  (dish?.variants || []).forEach((v) => {
    if (v.size === size && v.crust && !seen.includes(v.crust)) seen.push(v.crust);
  });
  return seen;
};

const resolveVariant = (dish, size, crust) =>
  (dish?.variants || []).find((v) => v.size === size && (v.crust || "") === (crust || "")) || null;

// Cheapest variant — used for the "From Rs X" price shown before a size is picked.
const cheapestVariant = (dish) =>
  (dish?.variants || []).reduce((min, v) => (min === null || v.price < min.price ? v : min), null);

// Mobile numbers only - strips anything that isn't a digit or a leading "+"
// as the customer types, so letters/symbols can never even land in the field.
const sanitizePhoneInput = (value) => {
  let v = value.replace(/[^\d+]/g, "");
  // Only allow a "+" as the very first character (e.g. +923001234567).
  v = v[0] === "+" ? "+" + v.slice(1).replace(/\+/g, "") : v.replace(/\+/g, "");
  return v.slice(0, 14);
};

// A valid-looking mobile number once formatting characters are stripped:
// 10-13 digits covers local (03xxxxxxxxx) and +92 international formats.
const isValidPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
};

/* ---------------- Icons (inline so there's no icon dependency) ---------------- */

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

const IconSearch = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

const IconBag = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M6 8h12l-1 11H7L6 8Z" />
    <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
  </svg>
);

const IconPlus = (props) => (
  <svg {...iconProps} strokeWidth={2.4} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconChevron = ({ dir = "right", ...props }) => (
  <svg {...iconProps} strokeWidth={2} {...props}>
    <path d={dir === "left" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
  </svg>
);

const IconTruck = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
);

const IconHeart = ({ filled, ...props }) => (
  <svg {...iconProps} strokeWidth={2} fill={filled ? "currentColor" : "none"} {...props}>
    <path d="M12 20.5s-7.3-4.6-9.9-9.1C.5 8 1.9 4.6 5.1 3.6c2-.6 4.1.1 5.4 1.8l1.5 2 1.5-2c1.3-1.7 3.4-2.4 5.4-1.8 3.2 1 4.6 4.4 3 7.8-2.6 4.5-9.9 9.1-9.9 9.1Z" />
  </svg>
);

/* ---------------- Small shared pieces ---------------- */

const Price = ({ price, originalPrice, from }) => (
  <p className="gzp-price">
    {from && <span className="gzp-price-from">From</span>}
    {formatRs(price)}
    {originalPrice > price && <s>{formatRs(originalPrice)}</s>}
  </p>
);

// Shows the photo, and quietly falls back to the item's emoji if the image
// can't be loaded (missing file, wrong URL, offline) - so a broken upload
// never shows up as a torn-image icon with the dish name next to it.
const Media = ({ src, alt, icon, className }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return src && !failed ? (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <div className="gzp-media-fallback"><FoodIcon icon={icon} /></div>
  );
};

// Stock label shown on menu cards. qty === null means "not stock-tracked".
const stockLabel = (qty) => {
  if (typeof qty !== "number") return null;
  if (qty <= 0) return { text: "Sold out", out: true };
  if (qty <= 5) return { text: `Only ${qty} left`, out: false };
  return null;
};

// Auto-advancing hero slider. Crossfades between whatever full-width photos
// staff have uploaded (Dashboard > Hero Slider) — this is the entire hero
// section now, so it fills the whole banner edge-to-edge.
const HeroSlider = ({ slides, onSlideClick }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ).current;

  useEffect(() => {
    if (slides.length <= 1 || paused || reducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, [slides.length, paused, reducedMotion]);

  // If the shop swaps its photos and there are now fewer of them, don't get
  // stuck pointing past the end of the list.
  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  if (slides.length === 0) {
    return (
      <div className="gzp-slider" aria-hidden="true">
        <div className="gzp-slider-fallback">
          <img src={genzLogo} alt="" />
        </div>
      </div>
    );
  }

  const current = slides[index];
  const clickable = Boolean(onSlideClick);

  return (
    <div
      className="gzp-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onClick={clickable ? () => onSlideClick(current) : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onSlideClick(current);
            }
          : undefined
      }
    >
      {slides.map((slide, i) => (
        <img
          key={slide.url + i}
          src={slide.url}
          alt={slide.alt || "GenZ Pizza Land menu and food promotion"}
          aria-hidden={i !== index || undefined}
          className={`gzp-slider-img${i === index ? " is-active" : ""}`}
        />
      ))}

      {slides.length > 1 && (
        <div className="gzp-slider-dots" role="tablist" aria-label="Featured photos">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1} of ${slides.length}`}
              className={`gzp-slider-dot${i === index ? " is-active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// A little hand-drawn pizza slice mascot for the order-confirmation screen —
// steam lines, a couple of pepperoni, and a happy face. Pure geometry (no
// external art), so it always loads instantly and never breaks.
const PizzaMascot = () => (
  <svg viewBox="0 0 140 140" className="gzp-thankyou-mascot" aria-hidden="true">
    <g stroke="#e0b84a" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75">
      <path d="M52 20 C 47 12, 57 9, 53 1" />
      <path d="M70 20 C 65 12, 75 9, 71 1" />
      <path d="M88 20 C 83 12, 93 9, 89 1" />
    </g>
    <path
      d="M20 32 L120 32 L70 132 Z"
      fill="#ffcf5c"
      stroke="#e0a92e"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path d="M20 32 Q70 47 120 32" fill="none" stroke="#e0a92e" strokeWidth="4" strokeLinecap="round" />
    <circle cx="52" cy="58" r="6" fill="#e6503d" />
    <circle cx="88" cy="62" r="6" fill="#e6503d" />
    <circle cx="70" cy="90" r="6" fill="#e6503d" />
    <circle cx="56" cy="76" r="5.5" fill="#3a2b1a" />
    <circle cx="84" cy="76" r="5.5" fill="#3a2b1a" />
    <path d="M60 96 Q70 104 80 96" stroke="#3a2b1a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </svg>
);

// The confirmation card shown right after a NEW order is placed (see
// showThankYou in App() below) — deliberately separate from the full
// tracking view: this is a moment to celebrate, tracking is the next step.
const ThankYouScreen = ({ order, onTrack, onContinue }) => {
  const orderNumber = String(order?._id || "").slice(-6).toUpperCase();

  return (
    <div className="gzp-thankyou-overlay" role="dialog" aria-modal="true" aria-label="Order confirmed">
      <div className="gzp-thankyou-card">
        <span className="gzp-thankyou-sticker tl" aria-hidden="true"><I.Sparkles /></span>
        <span className="gzp-thankyou-sticker tr" aria-hidden="true"><I.Pizza /></span>
        <span className="gzp-thankyou-sticker bl" aria-hidden="true"><I.Cheese /></span>
        <span className="gzp-thankyou-sticker br" aria-hidden="true"><I.Star /></span>

        <div className="gzp-thankyou-badge">
          <img src={genzLogo} alt="GenZ Pizza Land" />
        </div>

        <PizzaMascot />

        <h2 className="gzp-thankyou-title">Thank you!</h2>
        <p className="gzp-thankyou-sub">
          {order?.orderStatus === WAITING_STATUS
            ? "We'll verify your payment and confirm your order shortly."
            : "Your order's in and the kitchen's already looking at it."}
        </p>

        {orderNumber && <span className="gzp-thankyou-pill">Order #{orderNumber}</span>}

        <button type="button" className="gzp-thankyou-track-btn" onClick={onTrack}>
          Track My Order
        </button>

        <button type="button" className="gzp-thankyou-link" onClick={onContinue}>
          Click for more order
        </button>
      </div>
    </div>
  );
};

const DeliveredThankYouScreen = ({ order, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(8);
  const orderNumber = String(order?._id || "").slice(-6).toUpperCase();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, 8000);
    const countdown = window.setInterval(
      () => setSecondsLeft((seconds) => Math.max(0, seconds - 1)),
      1000
    );

    if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
      const message = new SpeechSynthesisUtterance("Thank you for your order. Enjoy your meal!");
      message.lang = "en-US";
      message.rate = 0.95;
      window.speechSynthesis.speak(message);
    }

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(countdown);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [onComplete]);

  return (
    <div className="gzp-thankyou-overlay" role="status" aria-live="polite">
      <section className="gzp-thankyou-card" aria-labelledby="gzp-delivered-title">
        <div className="gzp-thankyou-badge">
          <img src={genzLogo} alt="GenZ Pizza Land" />
        </div>
        <div className="gzp-delivered-mascot">
          <PizzaMascot />
        </div>
        <h1 id="gzp-delivered-title" className="gzp-thankyou-title">Your order has arrived!</h1>
        <p className="gzp-thankyou-sub">
          {orderNumber ? `Order #${orderNumber} is delivered. ` : ""}
          Thank you for your order. Enjoy your meal!
        </p>
        <p className="gzp-delivered-countdown">
          Taking you back to the home page in {secondsLeft} seconds…
        </p>
      </section>
    </div>
  );
};

const Stepper = ({ qty, onAdd, onRemove, size, label }) => (
  <div className={`gzp-stepper${size === "lg" ? " gzp-stepper-lg" : ""}`}>
    <button type="button" onClick={onRemove} aria-label={`Remove one ${label}`}>
      −
    </button>
    <span aria-live="polite">{qty}</span>
    <button type="button" onClick={onAdd} aria-label={`Add one more ${label}`}>
      +
    </button>
  </div>
);

// A menu card for a dish. Plain single-price dishes just show a description
// and an Add button; dishes with a size/crust matrix (mainly pizzas) also
// get Size/Crust dropdowns, and the price shown always tracks whichever
// combination is currently selected.
const DishGridCard = ({ dish, cart, cartKey, addToCart, removeFromCart, onOpenQuickView }) => {
  const sizes = useMemo(() => variantSizes(dish), [dish]);
  const hasVariants = sizes.length > 0;
  const [size, setSize] = useState(sizes[0] || "");
  const crusts = useMemo(() => variantCrustsForSize(dish, size), [dish, size]);
  const [crust, setCrust] = useState(crusts[0] || "");
  const [liked, setLiked] = useState(false);

  // If switching size drops the crust this dish had selected (different
  // sizes can offer different crust choices), fall back to the first crust
  // the new size actually offers instead of pointing at an invalid combo.
  useEffect(() => {
    if (crusts.length > 0 && !crusts.includes(crust)) setCrust(crusts[0]);
    else if (crusts.length === 0 && crust !== "") setCrust("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const variant = hasVariants ? resolveVariant(dish, size, crust) : null;
  const cheapest = hasVariants ? cheapestVariant(dish) : null;
  const unitPrice = hasVariants ? variant?.price ?? cheapest?.price ?? dish.price : dish.price;
  const unitOriginalPrice = hasVariants ? variant?.originalPrice ?? 0 : dish.originalPrice;
  const key = cartKey("dish", dish._id, size, crust);
  const qtyInCart = cart[key] || 0;
  const stock = stockLabel(dish.availableQty);
  const soldOut = Boolean(stock?.out);
  const canAdd = (!hasVariants || Boolean(variant)) && !soldOut;

  const openQuickView = () => onOpenQuickView(dish);

  return (
    <div className="gzp-card">
      <div
        className="gzp-card-media"
        role="button"
        tabIndex={0}
        onClick={openQuickView}
        onKeyDown={(e) => e.key === "Enter" && openQuickView()}
      >
        <Media src={resolveImageUrl(dish.image)} alt={dish.name} icon={dish.icon} />
        {stock && <span className={`gzp-stock${stock.out ? " is-out" : ""}`}>{stock.text}</span>}
        {!hasVariants && dish.originalPrice > dish.price && (
          <span className="gzp-save">
            Save {Math.round(((dish.originalPrice - dish.price) / dish.originalPrice) * 100)}%
          </span>
        )}
        <button
          type="button"
          className={`gzp-wish${liked ? " is-active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${dish.name} from favourites` : `Add ${dish.name} to favourites`}
        >
          <IconHeart filled={liked} />
        </button>
      </div>

      <div className="gzp-card-body">
        <h3
          role="button"
          tabIndex={0}
          onClick={openQuickView}
          onKeyDown={(e) => e.key === "Enter" && openQuickView()}
        >
          {dish.name}
        </h3>
        <Price price={unitPrice} originalPrice={unitOriginalPrice} from={hasVariants} />
        {dish.description && <p className="gzp-card-desc">{dish.description}</p>}

        {hasVariants && (
          <div className="gzp-variant-row" onClick={(e) => e.stopPropagation()} role="presentation">
            <select
              className="gzp-select"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              aria-label={`Size for ${dish.name}`}
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {crusts.length > 0 && (
              <select
                className="gzp-select"
                value={crust}
                onChange={(e) => setCrust(e.target.value)}
                aria-label={`Crust for ${dish.name}`}
              >
                {crusts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="gzp-card-foot" onClick={(e) => e.stopPropagation()} role="presentation">
          {qtyInCart ? (
            <Stepper
              qty={qtyInCart}
              label={dish.name}
              onAdd={() => addToCart("dish", dish._id, dish.name, size, crust)}
              onRemove={() => removeFromCart("dish", dish._id, size, crust)}
            />
          ) : (
            <button
              type="button"
              className="gzp-add gzp-add-wide"
              disabled={!canAdd}
              onClick={() => addToCart("dish", dish._id, dish.name, size, crust)}
            >
              {soldOut ? (
                "Sold out"
              ) : (
                <>
                  <IconPlus /> Add
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="gzp-skeleton">
    <div className="gzp-skeleton-media" />
    <div className="gzp-skeleton-lines">
      <i />
      <i />
    </div>
  </div>
);

const WhatsAppButton = () => (
  <a
    className="gzp-whatsapp"
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp for any inquiry"
    title="WhatsApp inquiry: +92 325 9061006"
  >
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="#fff">
      <path d="M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
    </svg>
  </a>
);

const Header = ({ minimal, cartCount, customer, onSearch, onCart, onNavigate, onTrack, onAccount }) => (
  <header className="gzp-header">
    <div className="gzp-header-inner">
      <button
        className="gzp-brand"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="button"
      >
        <img src={genzLogo} alt="" className="gzp-brand-mark" />
        <span className="gzp-brand-name">
          GenZ Pizza Land
          <span className="gzp-brand-sub">Delivered hot across Gojra</span>
        </span>
      </button>

      {!minimal && (
        <>
          <nav className="v2-links" aria-label="Site">
            <button type="button" className="v2-link" onClick={() => onNavigate?.("menu")}>Menu</button>
            <button type="button" className="v2-link" onClick={() => onNavigate?.("deals")}>Deals</button>
            <button type="button" className="v2-link" onClick={() => onNavigate?.("reviews")}>Reviews</button>
            <button type="button" className="v2-link" onClick={() => onNavigate?.("contact")}>Contact</button>
          </nav>
          <button className="v2-track-btn" onClick={onTrack} type="button">
            <IconTruck /> Track order
          </button>
          <button className="v2-track-btn" onClick={onAccount} type="button">
            {customer ? customer.name : "Account"}
          </button>
          <button
            className="gzp-icon-btn"
            onClick={onSearch}
            aria-label="Search the menu"
            type="button"
          >
            <IconSearch />
          </button>
          <button
            className="gzp-icon-btn gzp-cart-btn"
            onClick={onCart}
            aria-label={`Your order, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            type="button"
          >
            <IconBag />
            {cartCount > 0 && <span className="gzp-cart-count">{cartCount}</span>}
          </button>
        </>
      )}
    </div>
  </header>
);

/* ================================ App ================================ */

function StorefrontHome() {
  const [customer, setCustomer] = useCustomerAccount();
  const [customerAccountOpen, setCustomerAccountOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [deals, setDeals] = useState([]);
  const [adminHeroSlides, setAdminHeroSlides] = useState([]);
  // Live tax rate (admin-editable, POS Dashboard > Tax). Starts at the
  // fallback so the estimate never flashes 0% while this loads.
  const [taxRatePercent, setTaxRatePercent] = useState(FALLBACK_TAX_RATE_PERCENT);
  const [welcomeOfferConfig, setWelcomeOfferConfig] = useState(null);
  // Build Your Own Deal: admin-set discounts (Dashboard > Build Your Own).
  const [byoConfig, setByoConfig] = useState(() => normalizeByo(null));
  const [byoOpen, setByoOpen] = useState(false);

  // Keyed by a composite "dish:<id>" / "deal:<id>" cart key so a dish and a
  // deal can never collide, even though they're both ObjectIds.
  const [cart, setCart] = useState({}); // { "dish:<id>" | "deal:<id>": quantity }
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [assignedCoupons, setAssignedCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [welcomeOffer, setWelcomeOffer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  /* ---------- Customer reviews ---------- */
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: "",
    rating: 5,
    reviewText: "",
    productName: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState({ type: "", text: "" });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [placing, setPlacing] = useState(false);
  const placingRef = useRef(false);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  const [orderId, setOrderId] = useState(() => localStorage.getItem("gzp_last_order") || null);
  const [order, setOrder] = useState(null);
  // Shown once, right after a NEW order is placed (not on a page reload
  // that re-loads an order already in progress — see handleCheckout).
  const [showThankYou, setShowThankYou] = useState(false);
  // Set when the customer taps "Click for more order" on the Thank You
  // screen — takes them back to the menu (to browse/order more) without
  // losing track of the order they just placed; the small banner below
  // the header lets them jump back into full tracking any time.
  const [trackingDismissed, setTrackingDismissed] = useState(false);
  const orderStillActive = order && !["Completed", "Closed", "Cancelled"].includes(order.orderStatus);
  const orderCouponDiscount = Number(order?.bills?.couponDiscount) || 0;
  const orderOtherDiscount = Math.max(0, (Number(order?.bills?.discount) || 0) - orderCouponDiscount);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  useEffect(() => {
    if (!customer) return;
    setForm((current) => ({ ...current, name: customer.name, phone: customer.phone }));
  }, [customer]);
  useEffect(() => {
    let active = true;
    if (!customer) {
      setAssignedCoupons([]);
      return () => { active = false; };
    }
    getMyCoupons()
      .then((response) => { if (active) setAssignedCoupons(response.data || []); })
      .catch((requestError) => { if (active) setError(requestError.message || "Could not load your assigned coupons."); });
    return () => { active = false; };
  }, [customer]);

  const [activeSection, setActiveSection] = useState(DEALS_SECTION_ID);

  // Trackpad-scroll hover fix. On laptop trackpads, scrolling doesn't move
  // the actual cursor, so whatever card/button the pointer happens to be
  // resting over stays visually ":hover"ed as content slides underneath
  // it - hover highlights look "stuck"/broken while scrolling. Briefly
  // suspending pointer-events (which pauses hover matching) while a scroll
  // is in progress fixes that; `capture: true` is needed because the
  // native `scroll` event doesn't bubble, so this is the only way to catch
  // scrolling inside the menu rails/cart drawer too, not just the window.
  useEffect(() => {
    let timeoutId = null;
    const onScroll = () => {
      document.body.classList.add("is-scrolling");
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => document.body.classList.remove("is-scrolling"), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      if (timeoutId) clearTimeout(timeoutId);
      document.body.classList.remove("is-scrolling");
    };
  }, []);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [quickView, setQuickView] = useState(null); // { type, item }
  // Size/crust picked in the quick-view modal — reset every time a
  // different item is opened so a previous dish's selection never leaks
  // into the next one.
  const [qvSize, setQvSize] = useState("");
  const [qvCrust, setQvCrust] = useState("");
  // What the customer has picked so far for each customizable slot in an
  // open deal: { "0": { dishId, size, crust }, "1": {...}, ... }, keyed by
  // the item's index in deal.items. Reset every time a different item is
  // opened (re-opening the SAME deal after it's already in the cart starts
  // the picker fresh too, rather than trying to guess which cart line the
  // customer means to edit).
  const [dealChoices, setDealChoices] = useState({});
  useEffect(() => {
    if (quickView?.type === "dish") {
      const sizes = variantSizes(quickView.item);
      const firstSize = sizes[0] || "";
      setQvSize(firstSize);
      setQvCrust(variantCrustsForSize(quickView.item, firstSize)[0] || "");
      setDealChoices({});
    } else if (quickView?.type === "deal") {
      setQvSize("");
      setQvCrust("");
      const initial = {};
      (quickView.item.items || []).forEach((it, idx) => {
        if (!it.customizable) return;
        const firstDish = (it.flavourOptions || [])[0];
        if (!firstDish) return;
        const firstVariant = firstDish.variants?.[0];
        initial[idx] = {
          dishId: firstDish._id,
          size: firstVariant?.size || "",
          crust: firstVariant?.crust || "",
        };
      });
      setDealChoices(initial);
    } else {
      setQvSize("");
      setQvCrust("");
      setDealChoices({});
    }
  }, [quickView]);
  const [toast, setToast] = useState("");

  // Manual "Track order" lookup (footer button) — lets a customer pull up
  // status on any device/browser, not just the one that placed the order.
  const [trackOpen, setTrackOpen] = useState(false);
  const [reviewSummary, setReviewSummary] = useState(null);
  // Payment options + merchant details, live from Dashboard > Payment Settings.
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
  const [payMethod, setPayMethod] = useState(PAY_COD);
  const jazz = useJazzForm();
  const [trackInput, setTrackInput] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  const railRef = useRef(null);
  const [dealsRailPaused, setDealsRailPaused] = useState(false);
  const chipsRef = useRef(null);
  const toastTimer = useRef(null);

  /* ---------------- Data ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const [catRes, dishRes, dealRes, heroRes, settingsRes] = await Promise.all([
          getPublicCategories(),
          getPublicDishes(),
          // Deals failing to load shouldn't block the whole menu — fall
          // back to an empty deals list instead of erroring the page out.
          getPublicDeals().catch(() => ({ data: [] })),
          // Same for the hero slider — no configured slides just means the
          // slider falls back to deal/dish photos (see heroSlides below).
          getPublicHeroSlides().catch(() => ({ data: [] })),
          // Tax rate is Admin-editable and shouldn't block the menu from
          // loading if it's briefly unreachable — falls back to the
          // constant above.
          getPublicSettings().catch(() => null),
        ]);
        setCategories(catRes.data || []);
        setDishes(dishRes.data || []);
        setDeals(dealRes.data || []);
        setAdminHeroSlides(heroRes.data || []);
        const liveTaxRate = settingsRes?.data?.taxRatePercent;
        if (typeof liveTaxRate === "number") setTaxRatePercent(liveTaxRate);
        if (settingsRes?.data?.firstTimeCustomerOffer) setWelcomeOfferConfig(settingsRes.data.firstTimeCustomerOffer);
        if (settingsRes?.data?.payments) setPayments({ ...DEFAULT_PAYMENTS, ...settingsRes.data.payments });
        if (settingsRes?.data?.buildYourOwnDeal) setByoConfig(normalizeByo(settingsRes.data.buildYourOwnDeal));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Poll order status once an order has been placed / is being tracked.
  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await getOrderStatus(orderId);
        if (!cancelled) setOrder(res.data);
      } catch (err) {
        if (cancelled) return;

        // Only a confirmed 404 means the order genuinely doesn't exist
        // (e.g. stale id from a previous deployment/db) — stop tracking it.
        // Any other failure (dropped connection, backend cold-starting,
        // brief timeout on refresh) is transient: keep the last known
        // order/orderId so the tracking screen doesn't vanish, and just
        // retry on the next poll tick.
        if (err.status === 404) {
          localStorage.removeItem("gzp_last_order");
          setOrderId(null);
          setOrder(null);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [orderId]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------------- Derived menu structure ---------------- */

  // One section per category, in the order staff set in the dashboard.
  // Categories with nothing in them are skipped so the nav never points
  // at an empty shelf.
  const sections = useMemo(() => {
    const byCategory = new Map();
    dishes.forEach((dish) => {
      const id = dish.category?._id || dish.category || "other";
      if (!byCategory.has(id)) byCategory.set(id, []);
      byCategory.get(id).push(dish);
    });

    const ordered = categories
      .filter((cat) => (byCategory.get(cat._id) || []).length > 0)
      .map((cat) => ({
        id: cat._id,
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        items: byCategory.get(cat._id),
      }));

    const known = new Set(categories.map((c) => c._id));
    const loose = dishes.filter((d) => !known.has(d.category?._id || d.category));
    if (loose.length > 0) {
      ordered.push({ id: "other", name: "More to eat", icon: "utensils", items: loose });
    }
    return ordered;
  }, [categories, dishes]);

  const navItems = useMemo(() => {
    const items = sections.map((s) => ({ id: s.id, name: s.name }));
    if (deals.length > 0) items.unshift({ id: DEALS_SECTION_ID, name: "Deals" });
    return items;
  }, [sections, deals]);

  const categoryNameById = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c._id] = c.name;
    });
    return map;
  }, [categories]);

  const searchResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    const hits = [];
    deals.forEach((d) => {
      if (d.name.toLowerCase().includes(q)) hits.push({ type: "deal", item: d });
    });
    dishes.forEach((d) => {
      if (d.name.toLowerCase().includes(q)) hits.push({ type: "dish", item: d });
    });
    return hits.slice(0, 20);
  }, [debouncedQuery, dishes, deals]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 180);
    return () => window.clearTimeout(timeout);
  }, [query]);

  /* ---------------- Cart ---------------- */

  // Composite key so a dish and a deal never collide even though both are
  // Mongo ObjectIds — "dish:507f..." vs "deal:507f...". The third segment
  // carries the chosen size/crust (e.g. "Large||Pan") so two different
  // variants of the same pizza sit in the cart as separate lines instead of
  // merging into one. Deals and simple dishes just get an empty variant.
  const cartKey = (type, id, size = "", crust = "") => `${type}:${id}:${size || ""}||${crust || ""}`;

  // A customizable deal's chosen flavours/sizes (one entry per bundle slot:
  // { "0": { dishId, size, crust }, ... }) get packed into the cart key's
  // size slot as "sel:<base64 json>" so two differently-configured orders
  // of the same deal sit in the cart as separate lines, same as two
  // different pizza sizes would. encodeDealSelections/decodeDealSelections
  // are the only two places that ever touch that encoding.
  const encodeDealSelections = (selections) => {
    try {
      return `sel:${btoa(encodeURIComponent(JSON.stringify(selections)))}`;
    } catch {
      return "sel:";
    }
  };
  const decodeDealSelections = (sizeSlot) => {
    if (!sizeSlot || !sizeSlot.startsWith("sel:")) return null;
    try {
      return JSON.parse(decodeURIComponent(atob(sizeSlot.slice(4))));
    } catch {
      return null;
    }
  };
  const dealNeedsChoice = (deal) => (deal?.items || []).some((it) => it.customizable);

  const cartLines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => {
        const [type, id, variantPart = "||"] = key.split(":");
        const item =
          type === "deal" ? deals.find((d) => d._id === id) : dishes.find((d) => d._id === id);
        if (!item) return null;

        const [size, crust] = variantPart.split("||");
        let unitPrice = item.price;
        let unitOriginalPrice = item.originalPrice;
        let variantLabel = "";
        let dealSelections = null;

        if ((type === "dish" || type === "byo") && size) {
          const match = resolveVariant(item, size, crust);
          if (match) {
            unitPrice = match.price;
            unitOriginalPrice = match.originalPrice;
            variantLabel = [match.size, match.crust].filter(Boolean).join(", ");
          }
        }

        if (type === "deal") {
          const decoded = decodeDealSelections(size);
          if (decoded) {
            dealSelections = decoded;
            // "Medium Chicken Fajita Pizza, Coke 1.5 Ltr" — the customer's
            // actual picks, resolved to real dish names for the cart/receipt.
            variantLabel = Object.values(decoded)
              .map((sel) => {
                const dish = dishes.find((d) => d._id === sel.dishId);
                if (!dish) return null;
                return [sel.size, dish.name].filter(Boolean).join(" ");
              })
              .filter(Boolean)
              .join(", ");
          }
        }

        return { type, item, qty, key, size, crust, unitPrice, unitOriginalPrice, variantLabel, dealSelections };
      })
      .filter(Boolean);
  }, [cart, dishes, deals]);

  const couponItems = useMemo(() => cartLines.map((line) =>
    line.type === "deal"
      ? { dealId: line.item._id, quantity: line.qty }
      : {
          dishId: line.item._id,
          quantity: line.qty,
          size: line.size || undefined,
          crust: line.crust || undefined,
          byo: line.type === "byo" || undefined,
        }
  ), [cartLines]);

  const grossSubtotal = cartLines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  // Build Your Own Deal preview (the server recalculates the real amount).
  const byoLines = cartLines.filter((l) => l.type === "byo");
  const byoUnits = byoLines.reduce((sum, l) => sum + l.qty, 0);
  const byoGross = byoLines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const byoPercent = byoUnits > 0 ? byoPercentFor(byoUnits, byoConfig) : 0;
  const byoDiscount = Math.round((byoGross * byoPercent) / 100);
  const byoShort = byoUnits > 0 && byoConfig.enabled ? Math.max(0, byoConfig.minItems - byoUnits) : 0;
  // A deal with fewer than the minimum items (or switched off by the shop)
  // can't be ordered as-is - the customer is shown why instead of an error.
  const byoBlocked = byoUnits > 0 && (byoShort > 0 || !byoConfig.enabled);

  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const subtotal = Math.max(0, grossSubtotal - byoDiscount - couponDiscount); // after discounts: what tax is charged on
  const tax = (subtotal * taxRatePercent) / 100;
  const cartTotal = subtotal + tax; // before any delivery fee
  // Delivery / pickup: the server prices and validates the choice; the fee
  // is added here so the total updates the moment the method changes.
  const fulfil = useFulfillment(subtotal);
  const checkoutIntentSnapshot = useRef(null);
  useEffect(() => {
    const snapshot = JSON.stringify({
      cart,
      name: form.name,
      phone: form.phone,
      fulfillment: [fulfil.method, fulfil.branchId, fulfil.zoneId, fulfil.address],
      payment: [payMethod, jazz.tid, jazz.sender, jazz.proofId],
      coupon: appliedCoupon?.code || "",
    });
    if (checkoutIntentSnapshot.current !== null && checkoutIntentSnapshot.current !== snapshot) {
      clearCheckoutIdempotencyKey();
    }
    checkoutIntentSnapshot.current = snapshot;
  }, [
    cart,
    form.name,
    form.phone,
    fulfil.method,
    fulfil.branchId,
    fulfil.zoneId,
    fulfil.address,
    payMethod,
    jazz.tid,
    jazz.sender,
    jazz.proofId,
    appliedCoupon?.code,
  ]);
  const total = cartTotal + fulfil.fee;
  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0);

  const showToast = useCallback((message, duration = 2000) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), duration);
  }, []);

  // Always-current copies for callbacks (avoids stale closures and lets two
  // quick taps on "+" both be checked against the real quantity).
  const cartRef = useRef(cart);
  cartRef.current = cart;
  const menuRef = useRef({ dishes, deals });
  menuRef.current = { dishes, deals };

  useEffect(() => {
    setAppliedCoupon(null);
  }, [cart, form.phone]);

  useEffect(() => {
    setWelcomeOffer(null);
  }, [cart, customer?.id, appliedCoupon, couponInput]);

  // How many of a dish/deal are already in the cart, across all its
  // size/crust lines (they all draw from the same stock).
  const qtyInCartFor = (cartObj, type, id) => {
    // A dish picked through "Build your own deal" draws from the same stock
    // as the same dish ordered normally.
    const types = type === "deal" ? ["deal"] : ["dish", "byo"];
    return Object.entries(cartObj).reduce(
      (sum, [key, qty]) => (types.some((t) => key.startsWith(`${t}:${id}:`)) ? sum + qty : sum),
      0
    );
  };

  const findMenuItem = (type, id) =>
    (type === "deal" ? menuRef.current.deals : menuRef.current.dishes).find((x) => x._id === id);

  const addToCart = useCallback(
    (type, id, name, size = "", crust = "", dealSelections = null) => {
      const item = findMenuItem(type, id);
      const label = name || item?.name || "This item";

      // Live stock check: availableQty comes straight from the inventory
      // (null = not stock-tracked, so no limit).
      const limit = typeof item?.availableQty === "number" ? item.availableQty : Infinity;
      const already = qtyInCartFor(cartRef.current, type, id);
      if (already + 1 > limit) {
        showToast(
          limit <= 0
            ? `Sorry, ${label} is out of stock right now.`
            : `Only ${limit} ${label} in stock. Please select ${limit}.`,
          3500
        );
        return;
      }

      // A customizable deal packs its chosen flavours/sizes into the key's
      // size slot (see encodeDealSelections) so each distinct configuration
      // is its own cart line, same as different pizza sizes would be.
      const k = dealSelections
        ? cartKey(type, id, encodeDealSelections(dealSelections))
        : cartKey(type, id, size, crust);
      cartRef.current = { ...cartRef.current, [k]: (cartRef.current[k] || 0) + 1 };
      setCart(cartRef.current);
      if (name) showToast(`${name} added`);
    },
    [showToast]
  );

  const removeFromCart = useCallback((type, id, size = "", crust = "") => {
    const k = cartKey(type, id, size, crust);
    cartRef.current = { ...cartRef.current, [k]: Math.max(0, (cartRef.current[k] || 0) - 1) };
    setCart(cartRef.current);
  }, []);

  // Real-time stock sync: re-read dishes + deals (with their availableQty)
  // from the backend every few seconds, when the tab is visible again, and
  // right after a checkout is refused for stock reasons.
  const refreshMenu = useCallback(async () => {
    try {
      const [dishRes, dealRes, settingsRes] = await Promise.all([
        getPublicDishes(),
        getPublicDeals().catch(() => null),
        getPublicSettings().catch(() => null),
      ]);
      setDishes(dishRes.data || []);
      if (dealRes) setDeals(dealRes.data || []);
      // Keep discount percentages / tax live too, so a change made in the
      // admin panel reaches customers who already have the page open.
      if (settingsRes?.data?.buildYourOwnDeal) setByoConfig(normalizeByo(settingsRes.data.buildYourOwnDeal));
      if (settingsRes?.data?.firstTimeCustomerOffer) setWelcomeOfferConfig(settingsRes.data.firstTimeCustomerOffer);
      if (typeof settingsRes?.data?.taxRatePercent === "number") setTaxRatePercent(settingsRes.data.taxRatePercent);
      if (settingsRes?.data?.payments) setPayments({ ...DEFAULT_PAYMENTS, ...settingsRes.data.payments });
    } catch (err) {
      // Transient network hiccup - keep showing the last known menu.
    }
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    const tick = () => {
      if (!document.hidden) refreshMenu();
    };
    const interval = setInterval(tick, STOCK_REFRESH_MS);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, [loading, refreshMenu]);

  // Whenever fresh stock numbers arrive, trim anything in the cart that no
  // longer fits (e.g. cart has 5, stock dropped to 4 -> cart becomes 4).
  useEffect(() => {
    const current = cartRef.current;
    const groups = {};
    Object.entries(current).forEach(([key, qty]) => {
      if (qty <= 0) return;
      const [rawType, id] = key.split(":");
      const type = rawType === "byo" ? "dish" : rawType; // same stock pool
      (groups[`${type}:${id}`] = groups[`${type}:${id}`] || []).push(key);
    });

    let next = current;
    const notes = [];
    Object.entries(groups).forEach(([groupKey, keys]) => {
      const [type, id] = groupKey.split(":");
      const item = (type === "deal" ? deals : dishes).find((x) => x._id === id);
      if (!item || typeof item.availableQty !== "number") return;

      let total = keys.reduce((sum, k) => sum + next[k], 0);
      if (total <= item.availableQty) return;

      next = { ...next };
      for (const k of [...keys].reverse()) {
        if (total <= item.availableQty) break;
        const cut = Math.min(next[k], total - item.availableQty);
        next[k] -= cut;
        total -= cut;
      }
      notes.push(
        item.availableQty <= 0
          ? `${item.name} just sold out and was removed from your order.`
          : `Only ${item.availableQty} ${item.name} in stock - your order was set to ${item.availableQty}.`
      );
    });

    if (notes.length > 0) {
      cartRef.current = next;
      setCart(next);
      showToast(notes.join(" "), 5000);
    }
  }, [dishes, deals, showToast]);

  /* ---------------- Navigation ---------------- */

  // Smooth-scrolls to a section and then double-checks it actually arrived.
  // (scrollIntoView on its own can be cut short — by the chip bar's own
  // scroll, or by images loading and shifting the layout mid-scroll —
  // which left the page stopping halfway.)
  const scrollToElement = (el) => {
    if (!el) return;
    const stickyOffset = (document.querySelector(".gzp-header")?.offsetHeight || 0) +
      (document.querySelector(".gzp-navbar")?.offsetHeight || 0) + 8;
    const targetFor = () => Math.max(0, el.getBoundingClientRect().top + window.scrollY - stickyOffset);
    window.scrollTo({ top: targetFor(), behavior: "smooth" });
    let tries = 0;
    const settle = () => {
      tries += 1;
      const diff = targetFor() - window.scrollY;
      if (Math.abs(diff) > 6 && tries <= 4) {
        window.scrollTo({ top: targetFor(), behavior: tries < 3 ? "smooth" : "auto" });
        window.setTimeout(settle, 450);
      }
    };
    window.setTimeout(settle, 650);
  };

  const goToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (!el) return;
    setActiveSection(id);
    scrollToElement(el);
  };

  // Header / hero / footer links: "menu" lands on the first menu section,
  // everything else scrolls to its own section if it exists.
  const navigateTo = (target) => {
    if (target === "menu") {
      const first = deals.length > 0 ? DEALS_SECTION_ID : navItems[0]?.id;
      if (first) return goToSection(first);
    }
    if (target === "deals" && deals.length === 0) return goToSection(navItems[0]?.id);
    scrollToElement(document.getElementById(`section-${target}`));
  };

  // Highlight the chip for whichever section is currently under the sticky
  // nav bar, and keep that chip scrolled into view on narrow screens.
  useEffect(() => {
    if (loading || orderId) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const offset = 160;
        let current = navItems[0]?.id;
        navItems.forEach((item) => {
          const el = document.getElementById(`section-${item.id}`);
          if (el && el.getBoundingClientRect().top <= offset) current = item.id;
        });
        if (current) setActiveSection(current);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [navItems, loading, orderId]);

  useEffect(() => {
    // Only scroll the chip bar itself — never scrollIntoView, which also
    // nudges the page and fights the user's own scrolling.
    const bar = chipsRef.current;
    const chip = bar?.querySelector(".is-active");
    if (bar && chip) {
      const left = chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2;
      bar.scrollTo({ left: Math.max(0, left), behavior: "auto" });
    }
  }, [activeSection]);

  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * (rail.clientWidth * 0.8), behavior: "smooth" });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (
      loading ||
      deals.length < 2 ||
      dealsRailPaused ||
      !rail ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      const card = rail.querySelector(".gzp-deal");
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (!card || maxScroll <= 0) return;

      const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0;
      const step = card.getBoundingClientRect().width + gap;
      if (rail.scrollLeft >= maxScroll - 2) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        rail.scrollBy({ left: Math.min(step, maxScroll - rail.scrollLeft), behavior: "smooth" });
      }
    }, 4000);

    return () => window.clearInterval(timer);
  }, [deals.length, dealsRailPaused, loading]);

  // Stop the menu scrolling underneath an open sheet.
  const overlayOpen = cartOpen || checkoutOpen || trackOpen || searchOpen || !!quickView;
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  // Escape closes whatever is on top.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (searchOpen) setSearchOpen(false);
      else if (quickView) setQuickView(null);
      else if (checkoutOpen) setCheckoutOpen(false);
      else if (trackOpen) setTrackOpen(false);
      else if (cartOpen) setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, quickView, checkoutOpen, trackOpen, cartOpen]);

  // Kept ABOVE the early returns below on purpose: hooks must run in the
  // same order every render, or placing an order (which swaps to the
  // thank-you screen) crashes React and shows "Something went wrong".
  // Deal photos first (that's what's on promotion today), then dish photos,
  // with duplicates dropped — however many the shop has uploaded, capped at
  // a sane number of slides.
  // The homepage slider plays whatever staff have uploaded from the POS
  // dashboard (Dashboard > Hero Slider), in the order they set. If nothing's
  // been configured there yet, fall back to deal/dish photos so the hero
  // isn't ever empty.
  const heroSlides = useMemo(() => {
    if (adminHeroSlides.length > 0) {
      return adminHeroSlides.map((slide) => ({
        url: resolveImageUrl(slide.image),
        link: slide.link || "",
        alt: slide.altText || "",
      }));
    }

    const seen = new Set();
    const fallback = [];
    [...deals, ...dishes].forEach((item) => {
      const url = resolveImageUrl(item.image);
      if (url && !seen.has(url)) {
        seen.add(url);
        fallback.push({ url, link: "", alt: "" });
      }
    });
    return fallback.slice(0, 8);
  }, [adminHeroSlides, deals, dishes]);

  /* ---------------- Checkout / tracking ---------------- */

  // If staff switch a method off while the customer has it selected, fall
  // back to whichever one is still available.
  useEffect(() => {
    if (payMethod === PAY_COD && !payments.codEnabled && payments.jazzcashEnabled) setPayMethod(PAY_JAZZ);
    if (payMethod === PAY_JAZZ && !payments.jazzcashEnabled && payments.codEnabled) setPayMethod(PAY_COD);
  }, [payments, payMethod]);

  const jazzSelected = payMethod === PAY_JAZZ && payments.jazzcashEnabled;
  const canPlace = !placing && fulfil.ready && (!jazzSelected || jazz.ready);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (placingRef.current) return;
    if (cartLines.length === 0) return;
    if (byoBlocked) {
      setError(
        byoConfig.enabled
          ? `Build Your Own Deal needs at least ${byoConfig.minItems} items - add ${byoShort} more or remove the deal.`
          : "Build Your Own Deal isn't available right now - please remove it from your order."
      );
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError("That mobile number doesn't look complete. Use digits only, e.g. 03001234567.");
      return;
    }

    if (!fulfil.ready) {
      setError(fulfil.blocker || "Please choose delivery or pickup and fill in the details.");
      return;
    }

    if (jazzSelected && !jazz.ready) {
      setError("Please add your Transaction ID, sender name/number and payment screenshot first.");
      return;
    }

    placingRef.current = true;
    setPlacing(true);
    setError("");

    try {
      const payload = {
        customerName: form.name,
        customerPhone: form.phone,
        address: fulfil.method === "delivery" ? fulfil.address : "",
        fulfillment: fulfil.payload(),
        ...(jazzSelected
          ? {
              paymentMethod: "jazzcash",
              tid: jazz.tid,
              senderInfo: jazz.sender,
              proofId: jazz.proofId,
            }
          : { paymentMethod: "cod" }),
        couponCode: appliedCoupon?.code || undefined,
        items: cartLines.map((l) =>
          l.type === "deal"
            ? { dealId: l.item._id, quantity: l.qty, dealSelections: l.dealSelections || undefined }
            : {
                dishId: l.item._id,
                quantity: l.qty,
                size: l.size || undefined,
                crust: l.crust || undefined,
                byo: l.type === "byo" ? true : undefined,
              }
        ),
      };
      const res = await placeOrder(payload, getCheckoutIdempotencyKey());

      clearCheckoutIdempotencyKey();
      const newOrderId = res.data._id;
      localStorage.setItem("gzp_last_order", newOrderId);
      setOrderId(newOrderId);
      setOrder(res.data);
      setShowThankYou(true);
      setTrackingDismissed(false);
      jazz.reset();
      setCart({});
      setCheckoutOpen(false);
      setCartOpen(false);
      window.scrollTo({ top: 0 });
    } catch (err) {
      // Stock ran short between adding to the cart and placing the order
      // (message reads e.g. "Only 4 Fries in stock. Please select 4.").
      // Pull fresh numbers now - the cart is trimmed to match automatically.
      if (err.status === 409 || /Build Your Own/i.test(err.message || "")) refreshMenu();
      setError(err.message);
    } finally {
      placingRef.current = false;
      setPlacing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setError("Enter a coupon code.");
      return;
    }
    if (!isValidPhone(form.phone)) {
      setError("Enter your mobile number before applying a coupon.");
      return;
    }
    setValidatingCoupon(true);
    setError("");
    try {
      const result = await validatePublicCoupon({
        code: couponInput,
        phone: form.phone,
        items: couponItems,
      });
      setAppliedCoupon({ code: result.data.code, discountAmount: result.data.discountAmount });
      setError("");
    } catch (err) {
      setAppliedCoupon(null);
      setError(err.message);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const applyWelcomeOffer = async () => {
    if (!welcomeOffer?.code || validatingCoupon) return;
    setValidatingCoupon(true);
    setError("");
    try {
      const result = await validatePublicCoupon({ code: welcomeOffer.code, phone: form.phone, items: couponItems });
      setCouponInput(result.data.code);
      setAppliedCoupon({ code: result.data.code, discountAmount: result.data.discountAmount });
      setWelcomeOffer(null);
    } catch (err) {
      setError(err.message);
      setWelcomeOffer(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const checkWelcomeCoupon = async () => {
    if (!customer?.id) {
      setCustomerAccountOpen(true);
      setError("Sign in to your verified customer account to check welcome coupons.");
      return;
    }
    if (!welcomeOfferConfig?.enabled) {
      setError("Welcome coupons are currently unavailable.");
      return;
    }
    if (!couponItems.length || validatingCoupon) return;
    setValidatingCoupon(true);
    setError("");
    try {
      const response = await checkWelcomeOffer({ items: couponItems });
      if (response.data?.eligible) {
        setWelcomeOffer(response.data);
      } else {
        setWelcomeOffer(null);
        setError("No welcome coupon is available for this account and basket.");
      }
    } catch (requestError) {
      setError(requestError.message || "Could not check coupon eligibility.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const declineWelcomeOffer = () => {
    setWelcomeOffer(null);
  };

  const refreshStatus = async () => {
    if (!orderId || refreshingStatus) return;
    setRefreshingStatus(true);
    try {
      const res = await getOrderStatus(orderId);
      setOrder(res.data);
    } catch (err) {
      if (err.status === 404) {
        localStorage.removeItem("gzp_last_order");
        setOrderId(null);
        setOrder(null);
      }
    } finally {
      setRefreshingStatus(false);
    }
  };

  // Lets a customer cancel their own order themselves, but only while it's
  // still "Pending" — the button that triggers this is only shown then
  // (see the tracking view below). The backend re-checks this too, so a
  // stale/cached view can't cancel an order that's already being made.
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const handleCancelOrder = async () => {
    if (!orderId || cancellingOrder) return;
    if (!window.confirm("Cancel this order? You won't be charged anything.")) return;
    setCancellingOrder(true);
    try {
      const res = await cancelOrder(orderId);
      setOrder((prev) => (prev ? { ...prev, orderStatus: res.data.orderStatus } : prev));
    } catch (err) {
      window.alert(err.message || "Couldn't cancel the order — please call the shop.");
    } finally {
      setCancellingOrder(false);
    }
  };

  const startNewOrder = () => {
    localStorage.removeItem("gzp_last_order");
    setOrderId(null);
    setOrder(null);
  };

  const returnHomeAfterDelivery = useCallback(() => {
    localStorage.removeItem("gzp_last_order");
    window.location.reload();
  }, []);

  // Manual "Track order" lookup — for when someone wants to check status on
  // a different device/browser than the one that placed the order, or after
  // clearing their browser data. Looks up by phone number (what they
  // actually remember) rather than the internal order ID.
  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    const phone = trackInput.trim();
    if (!phone) return;

    if (!isValidPhone(phone)) {
      setTrackError("Enter the full mobile number you used at checkout, digits only.");
      return;
    }

    setTrackLoading(true);
    setTrackError("");
    try {
      const res = await lookupOrderByPhone(phone);
      localStorage.setItem("gzp_last_order", res.data._id);
      setOrderId(res.data._id);
      setOrder(res.data);
      setTrackOpen(false);
      setTrackInput("");
    } catch (err) {
      setTrackError(
        err.status === 404
          ? "No recent order on that number. Check the digits and try again."
          : err.message || "Couldn't reach the kitchen. Try again in a moment."
      );
    } finally {
      setTrackLoading(false);
    }
  };

  /* ---------------- Build Your Own Deal ---------------- */

  // What's already in the cart as a custom deal, in the builder's own
  // "dishId:size||crust" shape, so "Edit your deal" reopens with it filled in.
  const byoPicksFromCart = () => {
    const picks = {};
    Object.entries(cart).forEach(([k, q]) => {
      if (k.startsWith("byo:") && q > 0) picks[k.slice(4)] = q;
    });
    return picks;
  };

  // Replaces whatever custom deal was in the cart with the builder's picks.
  const applyByoPicks = (picks) => {
    const next = {};
    Object.entries(cartRef.current).forEach(([k, q]) => {
      if (!k.startsWith("byo:")) next[k] = q;
    });
    Object.entries(picks).forEach(([k, q]) => {
      if (q > 0) next[`byo:${k}`] = q;
    });
    cartRef.current = next;
    setCart(next);
    setByoOpen(false);
    setCartOpen(true);
    showToast("Your custom deal is in your order");
  };

  const clearByo = () => {
    const next = {};
    Object.entries(cartRef.current).forEach(([k, q]) => {
      if (!k.startsWith("byo:")) next[k] = q;
    });
    cartRef.current = next;
    setCart(next);
  };

  // Units of a dish already in the cart as a NORMAL line - the builder
  // subtracts these from stock so the two can't oversell it together.
  const normalDishQty = (dishId) =>
    Object.entries(cartRef.current).reduce(
      (sum, [k, q]) => (k.startsWith(`dish:${dishId}:`) ? sum + q : sum),
      0
    );

  // One row of the cart (used for normal lines and for the custom-deal group).
  const renderCartLine = (l) => (
    <div key={l.key} className="gzp-line">
      {resolveImageUrl(l.item.image) ? (
        <img src={resolveImageUrl(l.item.image)} alt={l.item.name || "Menu item"} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} />
      ) : (
        <span className="gzp-line-icon"><FoodIcon icon={l.item.icon} /></span>
      )}
      <div className="gzp-line-main">
        <h4>
          {l.type === "deal" && <span className="gzp-tag">DEAL</span>}
          {l.item.name}
        </h4>
        {l.variantLabel && <p className="gzp-line-variant">{l.variantLabel}</p>}
        <span>{formatRs(l.unitPrice * l.qty)}</span>
      </div>
      <Stepper
        qty={l.qty}
        label={l.item.name}
        onAdd={() => addToCart(l.type, l.item._id, "", l.size, l.crust)}
        onRemove={() => removeFromCart(l.type, l.item._id, l.size, l.crust)}
      />
    </div>
  );

  /* ---------------- Order tracking view ---------------- */
  // Checked BEFORE the menu-loading gate below and shown whenever we have an
  // orderId to track — even before the first poll resolves — so refreshing
  // the page never drops back to the menu while the status is still loading.

  if (orderId && !order) {
    return (
      <div className="gzp-app">
        <Header minimal />
        <div className="gzp-boot">
          <img src={genzLogo} alt="" />
          Pulling up your order…
        </div>
      </div>
    );
  }

  if (orderId && order?.orderStatus === "Completed") {
    return <DeliveredThankYouScreen order={order} onComplete={returnHomeAfterDelivery} />;
  }

  // Right after a NEW order is placed — the polished confirmation card.
  // "Track My Order" drops straight into the full tracking view below;
  // "Click for more order" goes back to the menu instead (to add another
  // order), leaving a small banner up top so they can jump back into
  // tracking this one any time.
  if (orderId && order && showThankYou) {
    return (
      <ThankYouScreen
        order={order}
        onTrack={() => setShowThankYou(false)}
        onContinue={() => {
          setShowThankYou(false);
          setTrackingDismissed(true);
        }}
      />
    );
  }

  if (orderId && order && !trackingDismissed) {
    const isPaidFlow = order.payment?.method === "JazzCash/Raast";
    const steps = isPaidFlow ? PAID_STATUS_STEPS : STATUS_STEPS;
    const stepIndex = steps.indexOf(order.orderStatus);
    const isCancelled = order.orderStatus === "Cancelled";
    const orderRef = String(order._id || "").slice(-6).toUpperCase();
    const helpHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hello GenZ Pizza Land, I need help with order #${orderRef}.`
    )}`;

    return (
      <div className="gzp-app">
        <Header minimal />

        <div className="gzp-shell">
          <section className="gzp-track">
            <div className="gzp-track-hero">
              <div className="gzp-track-top">
                <div style={{ flex: 1 }}>
                  <h1>{STATUS_HEADLINES[order.orderStatus] || "Order status"}</h1>
                  <p className="gzp-track-id">
                    Order #{String(order._id || "").slice(-6).toUpperCase()} for{" "}
                    {order.customerDetails?.name || "you"}
                  </p>
                </div>
                <button
                  type="button"
                  className="gzp-btn gzp-btn-ghost"
                  onClick={refreshStatus}
                  disabled={refreshingStatus}
                >
                  {refreshingStatus ? "Checking…" : "Refresh"}
                </button>
              </div>

              <PaymentStatusBanner order={order} whatsappHref={helpHref} />

              {isCancelled ? (
                isPaidFlow ? null : (
                  <p className="gzp-cancelled">
                    This order was cancelled. Nothing has been charged — you can order again any time.
                  </p>
                )
              ) : (
                <>
                  <p className="gzp-eta">
                    This page updates itself every few seconds. Keep it open and watch it move.
                  </p>
                  <ol className="gzp-steps">
                    {steps.map((step, i) => (
                      <li
                        key={step}
                        className={
                          i < stepIndex ? "is-done" : i === stepIndex ? "is-current" : ""
                        }
                      >
                        {STATUS_LABELS[step]}
                      </li>
                    ))}
                  </ol>
                  {order.orderStatus === "Pending" && (
                    <button
                      type="button"
                      className="gzp-btn gzp-btn-ghost"
                      style={{ marginTop: 14, color: "#E6392F", borderColor: "#E6392F" }}
                      onClick={handleCancelOrder}
                      disabled={cancellingOrder}
                    >
                      {cancellingOrder ? "Cancelling…" : "Cancel this order"}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="gzp-panel">
              <h3>What's coming</h3>
              {(order.items || []).map((item, idx) => (
                <div key={idx}>
                  <div className="gzp-order-line">
                    <span>
                      {item.isDeal && <span className="gzp-tag">DEAL</span>}
                      {item.quantity}× {item.name}
                    </span>
                    <span>{formatRs(item.price * item.quantity)}</span>
                  </div>
                  {item.isDeal && item.dealItems?.length > 0 && (
                    <p className="gzp-order-sub">
                      {item.dealItems
                        .map((it) => `${it.quantity > 1 ? it.quantity + "× " : ""}${it.label}`)
                        .join(", ")}
                    </p>
                  )}
                </div>
              ))}

              <div className="gzp-totals" style={{ marginTop: 14 }}>
                {Number(order.bills?.discount) > 0 && (
                  <>
                    {orderOtherDiscount > 0 && (
                      <div className="is-discount">
                        <span>Build Your Own Deal discount</span>
                        <span>−{formatRs(orderOtherDiscount)}</span>
                      </div>
                    )}
                    {orderCouponDiscount > 0 && (
                      <div className="is-discount">
                        <span>Coupon ({order.coupon?.code || "discount"})</span>
                        <span>−{formatRs(orderCouponDiscount)}</span>
                      </div>
                    )}
                  </>
                )}
                {Number(order.bills?.deliveryFee) > 0 && (
                  <div>
                    <span>Delivery fee</span>
                    <span>{formatRs(order.bills.deliveryFee)}</span>
                  </div>
                )}
                <div className="gzp-grand">
                  <span>
                    {isPaidFlow
                      ? order.payment?.status === "Verified"
                        ? "Paid via JazzCash/Raast"
                        : "Total (JazzCash/Raast)"
                      : order.fulfillment?.method === "pickup" ? "Pay at pickup" : "Pay on delivery"}
                  </span>
                  <span>{formatRs(order.bills?.totalWithTax || 0)}</span>
                </div>
              </div>
            </div>

            {order.fulfillment?.method && (
              <div className="gzp-panel">
                <h3>{order.fulfillment.method === "pickup" ? "Pickup from" : "Delivering to"}</h3>
                <p style={{ margin: 0, color: "var(--flour-dim)", fontSize: "0.93rem", lineHeight: 1.5 }}>
                  {order.fulfillment.method === "pickup"
                    ? order.fulfillment.branchName
                    : order.customerDetails?.address}
                  {order.fulfillment.method === "delivery" && order.fulfillment.zoneName ? ` (${order.fulfillment.zoneName})` : ""}
                  {order.fulfillment.method === "delivery" && order.fulfillment.branchName ? <><br />From {order.fulfillment.branchName}</> : null}
                  {order.fulfillment.estimatedMinutes?.min != null && (
                    <><br />Estimated {order.fulfillment.method === "pickup" ? "ready time" : "arrival"}: {order.fulfillment.estimatedMinutes.min}–{order.fulfillment.estimatedMinutes.max} min after confirmation</>
                  )}
                </p>
              </div>
            )}

            <a
              className="gzp-btn gzp-btn-ghost gzp-btn-block pay-help"
              href={helpHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <I.Chat aria-hidden="true" style={{ marginRight: 8, verticalAlign: "-2px" }} />Need help? Chat with us on WhatsApp
            </a>

            <button
              className="gzp-btn gzp-btn-ghost gzp-btn-block"
              style={{ marginTop: 12 }}
              onClick={startNewOrder}
              type="button"
            >
              Start another order
            </button>
          </section>
        </div>
      </div>
    );
  }

  /* ---------------- Menu view ---------------- */

  /* ---------- Review components ---------- */

  const starsFor = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating));
    }
    return stars;
  };

  const formatReviewDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const ReviewCard = ({ review, size = "small" }) => (
    <article
      className={`gzp-review-card gzp-review-card--${size}`}
      role="listitem"
    >
      <div className="gzp-review-head">
        <div>
          <span className="gzp-review-name">{review.customerName}</span>
          {review.verified && (
            <span className="gzp-review-verified" aria-label="Verified purchase">
              <IconCheck /> <span className="gzp-visually-hidden">Verified purchase</span>
            </span>
          )}
        </div>
        <div className="gzp-review-meta">
          <div className="gzp-review-stars" aria-label={`Rating of ${review.rating} out of 5 stars`}>
            {starsFor(review.rating).map((filled, i) => (
              <IconStar key={i} filled={filled} size={size === "large" ? 22 : 18} />
            ))}
          </div>
          {review.productName && (
            <span className="gzp-review-product">{review.productName}</span>
          )}
          <span className="gzp-review-date">{formatReviewDate(review.createdAt)}</span>
        </div>
      </div>
      <p className="gzp-review-text">{review.reviewText}</p>
    </article>
  );

  const ReviewForm = () => (
    <div className="gzp-sheet-overlay" onClick={() => setReviewFormOpen(false)}>
      <div className="gzp-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Leave a review">
        <div className="gzp-sheet-head">
          <h2>Leave a Review</h2>
          <button className="gzp-icon-btn" onClick={() => setReviewFormOpen(false)} aria-label="Close" type="button">
            ✕
          </button>
        </div>
        <div className="gzp-sheet-body">
          {reviewSubmitMessage.type && (
            <p
              className={`gzp-error ${reviewSubmitMessage.type === "success" ? "gzp-review-success" : ""}`}
              role="status"
              aria-live="polite"
            >
              {reviewSubmitMessage.text}
            </p>
          )}
          <form onSubmit={handleSubmitReview} className="gzp-review-form">
            <div className="gzp-form">
              <label className="gzp-field">
                <span>Your name or nickname</span>
                <input
                  required
                  type="text"
                  maxLength={60}
                  value={newReview.customerName}
                  onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                  placeholder="e.g. Ayesha"
                />
              </label>
              <label className="gzp-field">
                <span>Your rating</span>
                <div className="gzp-rating-picker" role="radiogroup" aria-label="Select your rating">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={newReview.rating === star}
                      aria-label={`${star} star${star === 1 ? "" : "s"}`}
                      className={`gzp-star-btn${newReview.rating === star ? " is-active" : ""}`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <IconStar filled={newReview.rating >= star} size={24} />
                    </button>
                  ))}
                </div>
              </label>
              <label className="gzp-field">
                <span>Your review</span>
                <textarea
                  required
                  maxLength={1000}
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  rows={4}
                  placeholder="Tell us what you loved about your order…"
                />
              </label>
              <label className="gzp-field">
                <span>Product (optional)</span>
                <input
                  type="text"
                  maxLength={120}
                  value={newReview.productName}
                  onChange={(e) => setNewReview({ ...newReview, productName: e.target.value })}
                  placeholder="e.g. Large Pepperoni Pizza"
                />
              </label>
            </div>
            <div className="gzp-review-form-foot">
              <button
                type="button"
                className="gzp-btn gzp-btn-ghost"
                onClick={() => setReviewFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gzp-btn gzp-btn-primary"
                disabled={submittingReview}
              >
                {submittingReview ? "Sending…" : "Submit review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  /* ---------- All Reviews (full-page view) ---------- */

  const AllReviewsPage = () => (
    <section className="gzp-all-reviews-page" aria-label="All customer reviews">
      <div className="gzp-shell">
        <div className="gzp-all-reviews-header">
          <button
            className="gzp-btn gzp-btn-ghost"
            onClick={() => setShowAllReviews(false)}
            aria-label="Back to homepage"
          >
            ← Back
          </button>
          <div className="gzp-all-reviews-intro">
            <h2>Loved by Pizza Lovers</h2>
            <p>See what our customers have to say.</p>
          </div>
          {reviewCount > 0 && (
            <div className="gzp-all-reviews-stats">
              <span className="gzp-all-reviews-average">{avgRating.toFixed(1)}</span>
              <div className="gzp-all-reviews-stars" aria-hidden="true">
                {starsFor(avgRating).map((filled, i) => (
                  <IconStar key={i} filled={filled} size={32} />
                ))}
              </div>
              <span className="gzp-all-reviews-count">
                {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>

        <div className="gzp-all-reviews-grid">
          {reviews.length > 0 ? (
            <ul role="list">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} size="large" />
              ))}
            </ul>
          ) : (
            <div className="gzp-empty gzp-empty-reviews">
              <p>No reviews yet. Be the first to share your experience.</p>
            </div>
          )}
        </div>

        {reviewCount > 0 && (
          <div className="gzp-all-reviews-foot">
            <button
              className="gzp-btn gzp-btn-primary"
              onClick={() => setReviewFormOpen(true)}
            >
              Write a review
            </button>
          </div>
        )}
      </div>
    </section>
  );

  /* ---------- Reviews Section (homepage) ---------- */

  const ReviewsSection = () => (
    <section className="gzp-section gzp-reviews-section" id="section-reviews" aria-label="Customer reviews">
      <div className="gzp-shell">
        <div className="gzp-reviews-header">
          <div className="gzp-reviews-intro">
            <h2>Loved by Pizza Lovers</h2>
            <p>See what our customers have to say.</p>
          </div>
          {reviewCount > 0 && (
            <div className="gzp-reviews-stats">
              <span className="gzp-stats-average">{avgRating.toFixed(1)}</span>
              <div className="gzp-stats-stars" aria-hidden="true">
                {starsFor(avgRating).map((filled, i) => (
                  <IconStar key={i} filled={filled} size={20} />
                ))}
              </div>
              <span className="gzp-stats-count">{reviewCount} review{reviewCount === 1 ? "" : "s"}</span>
            </div>
          )}
          <button
            className="gzp-btn gzp-btn-ghost"
            onClick={() => setReviewFormOpen(true)}
          >
            Write a review
          </button>
        </div>

        <div className="gzp-reviews-grid">
          {reviews.length > 0 ? (
            <ul role="list">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} size="small" />
              ))}
            </ul>
          ) : (
            <div className="gzp-empty gzp-empty-reviews">
              <p>No reviews yet. Be the first to share your experience.</p>
            </div>
          )}
        </div>

        <div className="gzp-reviews-foot">
          <button
            className="gzp-btn gzp-btn-outline"
            onClick={() => setShowAllReviews(true)}
          >
            Read All Reviews
          </button>
        </div>
      </div>
    </section>
  );
  return (
    <div className="gzp-app">
      <Header
        cartCount={cartCount}
        customer={customer}
        onAccount={() => setCustomerAccountOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onCart={() => setCartOpen(true)}
        onNavigate={navigateTo}
        onTrack={() => setTrackOpen(true)}
      />
      <CustomerAccount
        customer={customer}
        setCustomer={setCustomer}
        open={customerAccountOpen}
        setOpen={setCustomerAccountOpen}
      />

      {/* Left up after "Click for more order" on the Thank You screen, so
          an order that's still cooking never just disappears from view. */}
      {trackingDismissed && orderStillActive && (
        <div className="gzp-tracking-banner">
          <span>
            Order #{String(order._id || "").slice(-6).toUpperCase()} — {STATUS_LABELS[order.orderStatus] || order.orderStatus}
          </span>
          <button type="button" onClick={() => setTrackingDismissed(false)}>
            Track it
          </button>
        </div>
      )}

      {error && !checkoutOpen && (
        <div className="gzp-shell">
          <p className="gzp-error gzp-error-banner">{error}</p>
        </div>
      )}

      {/* ---- Hero: full-width slider only, staff-managed from the POS
             dashboard (Dashboard > Hero Slider) ---- */}
      <HeroIntro
        summary={reviewSummary}
        onOrder={() => navigateTo("menu")}
        onTrack={() => setTrackOpen(true)}
      />

      <section className="gzp-hero">
        <HeroSlider
          slides={heroSlides}
          onSlideClick={(slide) => {
            if (slide?.link) {
              window.open(slide.link, "_blank", "noopener,noreferrer");
            } else {
              goToSection(navItems[0]?.id);
            }
          }}
        />
      </section>

      {/* ---- Sticky category nav ---- */}
      {!loading && navItems.length > 0 && (
        <nav className="gzp-navbar" aria-label="Menu sections">
          <div className="gzp-navbar-inner">
            <div className="gzp-navbar-chips" ref={chipsRef}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`gzp-chip${activeSection === item.id ? " is-active" : ""}`}
                  onClick={() => goToSection(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <div className="gzp-shell">
        {loading ? (
          <section className="gzp-section">
            <div className="gzp-section-head">
              <h2>Loading the menu</h2>
              <div className="gzp-section-rule" />
            </div>
            <div className="gzp-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* ---- Build your own deal ---- */}
            {byoConfig.enabled && dishes.length > 0 && (
              <ByoBanner cfg={byoConfig} pickedCount={byoUnits} onStart={() => setByoOpen(true)} />
            )}

            {/* ---- Deals rail ---- */}
            {deals.length > 0 && (
              <section className="gzp-section" id={`section-${DEALS_SECTION_ID}`}>
                <div className="gzp-section-head">
                  <h2>Today's deals</h2>
                  <span className="gzp-section-count">
                    {deals.length} bundle{deals.length === 1 ? "" : "s"}
                  </span>
                  <div className="gzp-section-rule" />
                  <div className="gzp-rail-nav">
                    <button
                      className="gzp-rail-btn"
                      onClick={() => scrollRail(-1)}
                      aria-label="Scroll deals back"
                      type="button"
                    >
                      <IconChevron dir="left" />
                    </button>
                    <button
                      className="gzp-rail-btn"
                      onClick={() => scrollRail(1)}
                      aria-label="Scroll deals forward"
                      type="button"
                    >
                      <IconChevron />
                    </button>
                  </div>
                </div>

                <div className="gzp-rail-wrap">
                  <div
                    className="gzp-rail"
                    ref={railRef}
                    onMouseEnter={() => setDealsRailPaused(true)}
                    onMouseLeave={() => setDealsRailPaused(false)}
                    onFocus={() => setDealsRailPaused(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setDealsRailPaused(false);
                      }
                    }}
                    onPointerDown={(event) => {
                      if (event.pointerType !== "mouse") setDealsRailPaused(true);
                    }}
                    onPointerUp={(event) => {
                      if (event.pointerType !== "mouse") setDealsRailPaused(false);
                    }}
                  >
                    {deals.map((deal) => {
                      const key = cartKey("deal", deal._id);
                      const saving =
                        deal.originalPrice > deal.price
                          ? Math.round(
                              ((deal.originalPrice - deal.price) / deal.originalPrice) * 100
                            )
                          : 0;
                      return (
                        <div
                          key={deal._id}
                          className="gzp-deal"
                          role="button"
                          tabIndex={0}
                          onClick={() => setQuickView({ type: "deal", item: deal })}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setQuickView({ type: "deal", item: deal })
                          }
                        >
                          <div className="gzp-deal-media">
                            <Media src={resolveImageUrl(deal.image)} alt={deal.name} icon={deal.icon || "flame"} />
                            {deal.badge && <span className="gzp-badge">{deal.badge}</span>}
                            {saving > 0 && <span className="gzp-save">Save {saving}%</span>}
                            {stockLabel(deal.availableQty) && (
                              <span className={`gzp-stock${stockLabel(deal.availableQty).out ? " is-out" : ""}`}>
                                {stockLabel(deal.availableQty).text}
                              </span>
                            )}
                          </div>

                          <div className="gzp-deal-body">
                            <h3>{deal.name}</h3>

                            {deal.items?.length > 0 ? (
                              <ul className="gzp-deal-contents">
                                {deal.items.slice(0, 3).map((it, idx) => (
                                  <li key={idx}>
                                    {it.quantity > 1 ? `${it.quantity}× ` : ""}
                                    {it.label}
                                  </li>
                                ))}
                                {deal.items.length > 3 && (
                                  <li className="gzp-deal-more">
                                    +{deal.items.length - 3} more in the box
                                  </li>
                                )}
                              </ul>
                            ) : (
                              deal.description && <p className="gzp-deal-desc">{deal.description}</p>
                            )}

                            <div
                              className="gzp-deal-foot"
                              onClick={(e) => e.stopPropagation()}
                              role="presentation"
                            >
                              <Price price={deal.price} originalPrice={deal.originalPrice} />
                              {/* A deal with a customizable slot (pick your pizza's
                                  category/flavour/size) can't be one-tap added — every
                                  tap needs those choices, so it always opens the picker
                                  instead of stepping a generic quantity. */}
                              {cart[key] && !dealNeedsChoice(deal) ? (
                                <Stepper
                                  qty={cart[key]}
                                  label={deal.name}
                                  onAdd={() => addToCart("deal", deal._id)}
                                  onRemove={() => removeFromCart("deal", deal._id)}
                                />
                              ) : (
                                <button
                                  type="button"
                                  className="gzp-add gzp-add-wide"
                                  disabled={stockLabel(deal.availableQty)?.out}
                                  onClick={() =>
                                    dealNeedsChoice(deal)
                                      ? setQuickView({ type: "deal", item: deal })
                                      : addToCart("deal", deal._id, deal.name)
                                  }
                                >
                                  {stockLabel(deal.availableQty)?.out
                                    ? "Sold out"
                                    : dealNeedsChoice(deal)
                                    ? "Choose & add"
                                    : "Add deal"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ---- One section per category ---- */}
            {sections.map((section) => (
              <section className="gzp-section" id={`section-${section.id}`} key={section.id}>
                <div className="gzp-section-head">
                  <h2>{section.name}</h2>
                  <span className="gzp-section-count">{section.items.length} items</span>
                  <div className="gzp-section-rule" />
                </div>

                <div className="gzp-grid">
                  {section.items.map((dish) => (
                    <DishGridCard
                      key={dish._id}
                      dish={dish}
                      cart={cart}
                      cartKey={cartKey}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                      onOpenQuickView={(d) => setQuickView({ type: "dish", item: d })}
                    />
                  ))}
                </div>
              </section>
            ))}

            {sections.length === 0 && deals.length === 0 && (
              <section className="gzp-section">
                <div className="gzp-empty">
                  <img src={genzLogo} alt="" className="gzp-empty-logo" />
                  The menu is being set up right now. Check back in a little while.
                </div>
              </section>
            )}
          </>
        )}

        <FeaturesSection />
        <ReviewsSection onSummary={setReviewSummary} />
        <HowItWorks />
        <ContactSection whatsappLink={WHATSAPP_LINK} onTrack={() => setTrackOpen(true)} />
      </div>

      <SiteFooter
        taxRatePercent={taxRatePercent}
        onNavigate={navigateTo}
        onTrack={() => setTrackOpen(true)}
      />

      {/* ---- Bottom cart bar ---- */}
      {cartCount > 0 && !cartOpen && !checkoutOpen && (
        <button className="gzp-cartbar" onClick={() => setCartOpen(true)} type="button">
          <span className="gzp-cartbar-label">
            <small>
              {cartCount} item{cartCount === 1 ? "" : "s"} in your order
            </small>
            <b>{formatRs(cartTotal)}</b>
          </span>
          <span className="gzp-cartbar-cta">View order</span>
        </button>
      )}

      <WhatsAppButton />

      {toast && (
        <div className="gzp-toast" role="status">
          <i><I.Check /></i>
          {toast}
        </div>
      )}

      {/* ---- Search ---- */}
      {searchOpen && (
        <div className="gzp-search" onClick={() => setSearchOpen(false)}>
          <div className="gzp-search-bar" onClick={(e) => e.stopPropagation()}>
            <IconSearch />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a pizza, burger or deal"
              aria-label="Search the menu"
            />
            <button className="gzp-btn gzp-btn-ghost" onClick={() => setSearchOpen(false)} type="button">
              Close
            </button>
          </div>

          <div className="gzp-search-results" onClick={(e) => e.stopPropagation()}>
            {query.trim() && searchResults.length === 0 && (
              <p className="gzp-search-empty">
                Nothing matches “{query.trim()}”. Try a shorter word, like “pizza”.
              </p>
            )}
            {searchResults.map(({ type, item }) => (
              <button
                key={`${type}-${item._id}`}
                className="gzp-result"
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setQuickView({ type, item });
                }}
              >
                {resolveImageUrl(item.image) ? (
                  <img src={resolveImageUrl(item.image)} alt={item.name || "Menu item"} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <span className="gzp-result-icon"><FoodIcon icon={item.icon} /></span>
                )}
                <span className="gzp-result-name">
                  {item.name}
                  <span className="gzp-result-cat">
                    {type === "deal"
                      ? "Deal"
                      : categoryNameById[item.category?._id || item.category] || "Menu"}
                  </span>
                </span>
                <Price price={item.price} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- Quick view ---- */}
      {quickView && (
        <div className="gzp-overlay" onClick={() => setQuickView(null)}>
          <div
            className="gzp-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={quickView.item.name}
          >
            <div className="gzp-modal-media">
              <Media
                src={resolveImageUrl(quickView.item.image)}
                alt={quickView.item.name}
                icon={quickView.item.icon}
              />
              {quickView.item.badge && <span className="gzp-badge">{quickView.item.badge}</span>}
              <button
                className="gzp-modal-close"
                onClick={() => setQuickView(null)}
                aria-label="Close"
                type="button"
              >
                <I.Close aria-hidden="true" />
              </button>
            </div>

            <div className="gzp-modal-body">
              <h2>{quickView.item.name}</h2>

              {quickView.type === "deal" && quickView.item.items?.length > 0 && (
                <ul className="gzp-deal-contents">
                  {quickView.item.items.map((it, idx) =>
                    it.customizable ? null : (
                      <li key={idx}>
                        {it.quantity > 1 ? `${it.quantity}× ` : ""}
                        {it.label}
                      </li>
                    )
                  )}
                </ul>
              )}

              {/* One picker per customizable slot: category, then flavour
                  (a real Dish in that category), then that dish's own
                  size/crust — exactly what gets sent to checkout and what
                  stock actually gets deducted. */}
              {quickView.type === "deal" &&
                quickView.item.items?.map((it, idx) => {
                  if (!it.customizable) return null;
                  const options = it.flavourOptions || [];
                  const choice = dealChoices[idx] || {};
                  const categories = [
                    ...new Map(
                      options.map((d) => [d.category?._id || "", d.category?.name || "Choose"])
                    ),
                  ];
                  const activeCategoryId =
                    options.find((d) => d._id === choice.dishId)?.category?._id ||
                    categories[0]?.[0] ||
                    "";
                  const flavoursInCategory = options.filter(
                    (d) => (d.category?._id || "") === activeCategoryId
                  );
                  const chosenDish = options.find((d) => d._id === choice.dishId);
                  const dishSizes = [...new Set((chosenDish?.variants || []).map((v) => v.size))];
                  const dishCrusts = (chosenDish?.variants || []).filter((v) => v.size === choice.size && v.crust);

                  const setChoice = (patch) =>
                    setDealChoices((prev) => ({ ...prev, [idx]: { ...prev[idx], ...patch } }));

                  return (
                    <div className="gzp-deal-choice" key={idx}>
                      <p className="gzp-deal-choice-label">
                        {it.quantity > 1 ? `${it.quantity}× ` : ""}
                        {it.label} — pick yours
                      </p>
                      <div className="gzp-variant-row">
                        {categories.length > 1 && (
                          <select
                            className="gzp-select"
                            value={activeCategoryId}
                            onChange={(e) => {
                              const firstInCat = options.find((d) => (d.category?._id || "") === e.target.value);
                              const firstVariant = firstInCat?.variants?.[0];
                              setChoice({
                                dishId: firstInCat?._id || "",
                                size: firstVariant?.size || "",
                                crust: firstVariant?.crust || "",
                              });
                            }}
                            aria-label={`Category for ${it.label}`}
                          >
                            {categories.map(([id, name]) => (
                              <option key={id} value={id}>
                                {name}
                              </option>
                            ))}
                          </select>
                        )}

                        <select
                          className="gzp-select"
                          value={choice.dishId || ""}
                          onChange={(e) => {
                            const dish = options.find((d) => d._id === e.target.value);
                            const firstVariant = dish?.variants?.[0];
                            setChoice({
                              dishId: dish?._id || "",
                              size: firstVariant?.size || "",
                              crust: firstVariant?.crust || "",
                            });
                          }}
                          aria-label={`Flavour for ${it.label}`}
                        >
                          {flavoursInCategory.length === 0 && <option value="">No flavours available</option>}
                          {flavoursInCategory.map((d) => (
                            <option key={d._id} value={d._id}>
                              {d.name}
                            </option>
                          ))}
                        </select>

                        {dishSizes.length > 0 && (
                          <select
                            className="gzp-select"
                            value={choice.size || ""}
                            onChange={(e) => {
                              const nextCrusts = (chosenDish?.variants || []).filter(
                                (v) => v.size === e.target.value && v.crust
                              );
                              setChoice({
                                size: e.target.value,
                                crust: nextCrusts.some((v) => v.crust === choice.crust) ? choice.crust : nextCrusts[0]?.crust || "",
                              });
                            }}
                            aria-label={`Size for ${it.label}`}
                          >
                            {dishSizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}

                        {dishCrusts.length > 0 && (
                          <select
                            className="gzp-select"
                            value={choice.crust || ""}
                            onChange={(e) => setChoice({ crust: e.target.value })}
                            aria-label={`Crust for ${it.label}`}
                          >
                            {dishCrusts.map((v) => (
                              <option key={v.crust} value={v.crust}>
                                {v.crust}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}

              {quickView.item.description && (
                <p className="gzp-deal-desc">{quickView.item.description}</p>
              )}

              {(() => {
                const isDish = quickView.type === "dish";
                const isDeal = quickView.type === "deal";
                const sizes = isDish ? variantSizes(quickView.item) : [];
                const hasVariants = sizes.length > 0;
                const crusts = isDish ? variantCrustsForSize(quickView.item, qvSize) : [];
                const variant = hasVariants ? resolveVariant(quickView.item, qvSize, qvCrust) : null;
                const cheapest = hasVariants ? cheapestVariant(quickView.item) : null;
                const unitPrice = hasVariants
                  ? variant?.price ?? cheapest?.price ?? quickView.item.price
                  : quickView.item.price;
                const unitOriginalPrice = hasVariants ? variant?.originalPrice ?? 0 : quickView.item.originalPrice;

                const needsChoice = isDeal && dealNeedsChoice(quickView.item);
                // Every customizable slot needs a flavour chosen, and a size
                // too if that flavour actually has variants.
                const dealChoicesComplete =
                  !needsChoice ||
                  (quickView.item.items || []).every((it, idx) => {
                    if (!it.customizable) return true;
                    const choice = dealChoices[idx];
                    if (!choice?.dishId) return false;
                    const dish = (it.flavourOptions || []).find((d) => d._id === choice.dishId);
                    if (dish?.variants?.length > 0) return Boolean(choice.size);
                    return true;
                  });

                const key = needsChoice
                  ? cartKey(quickView.type, quickView.item._id, encodeDealSelections(dealChoices))
                  : cartKey(quickView.type, quickView.item._id, qvSize, qvCrust);
                const qtyInCart = cart[key] || 0;
                // Use the live copy of the item so stock changes that arrive
                // while this popup is open are reflected immediately.
                const liveItem = (isDish ? dishes : deals).find((x) => x._id === quickView.item._id) || quickView.item;
                const qvStock = stockLabel(liveItem.availableQty);
                const canAdd = (!hasVariants || Boolean(variant)) && dealChoicesComplete && !qvStock?.out;

                return (
                  <>
                    <Price price={unitPrice} originalPrice={unitOriginalPrice} from={hasVariants} />
                    {qvStock && (
                      <p className={`gzp-stock-note${qvStock.out ? " is-out" : ""}`}>{qvStock.text}</p>
                    )}

                    {hasVariants && (
                      <div className="gzp-variant-row">
                        <select
                          className="gzp-select"
                          value={qvSize}
                          onChange={(e) => {
                            const nextSize = e.target.value;
                            setQvSize(nextSize);
                            const nextCrusts = variantCrustsForSize(quickView.item, nextSize);
                            setQvCrust(nextCrusts.includes(qvCrust) ? qvCrust : nextCrusts[0] || "");
                          }}
                          aria-label={`Size for ${quickView.item.name}`}
                        >
                          {sizes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {crusts.length > 0 && (
                          <select
                            className="gzp-select"
                            value={qvCrust}
                            onChange={(e) => setQvCrust(e.target.value)}
                            aria-label={`Crust for ${quickView.item.name}`}
                          >
                            {crusts.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}

                    <div className="gzp-modal-foot">
                      {qtyInCart ? (
                        <>
                          <Stepper
                            size="lg"
                            label={quickView.item.name}
                            qty={qtyInCart}
                            onAdd={() =>
                              needsChoice
                                ? addToCart(quickView.type, quickView.item._id, "", "", "", dealChoices)
                                : addToCart(quickView.type, quickView.item._id, "", qvSize, qvCrust)
                            }
                            onRemove={() => {
                              const [, , variantPart] = key.split(":");
                              const [size, crust] = variantPart.split("||");
                              removeFromCart(quickView.type, quickView.item._id, size, crust);
                            }}
                          />
                          <button
                            className="gzp-btn gzp-btn-primary"
                            onClick={() => {
                              setQuickView(null);
                              setCartOpen(true);
                            }}
                            type="button"
                          >
                            View order
                          </button>
                        </>
                      ) : (
                        <button
                          className="gzp-btn gzp-btn-primary gzp-btn-split"
                          disabled={!canAdd}
                          onClick={() => {
                            if (needsChoice) {
                              addToCart(quickView.type, quickView.item._id, quickView.item.name, "", "", dealChoices);
                            } else {
                              addToCart(quickView.type, quickView.item._id, quickView.item.name, qvSize, qvCrust);
                            }
                            setQuickView(null);
                          }}
                          type="button"
                        >
                          <span>
                            {qvStock?.out
                              ? "Sold out"
                              : needsChoice && !dealChoicesComplete
                              ? "Choose your options"
                              : "Add to order"}
                          </span>
                          <span>{formatRs(unitPrice)}</span>
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ---- Build your own deal builder ---- */}
      {byoOpen && (
        <ByoBuilder
          cfg={byoConfig}
          dishes={dishes}
          categories={categories}
          initialPicks={byoPicksFromCart()}
          getOtherQty={normalDishQty}
          onClose={() => setByoOpen(false)}
          onConfirm={applyByoPicks}
        />
      )}

      {/* ---- Cart ---- */}
      {cartOpen && (
        <div className="gzp-sheet-overlay" onClick={() => setCartOpen(false)}>
          <div className="gzp-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Your order">
            <div className="gzp-sheet-head">
              <h2>Your order</h2>
              <button className="gzp-icon-btn" onClick={() => setCartOpen(false)} aria-label="Close" type="button">
                <I.Close aria-hidden="true" />
              </button>
            </div>

            {cartLines.length === 0 ? (
              <div className="gzp-sheet-body">
                <div className="gzp-empty">
                  <span><I.Cart aria-hidden="true" /></span>
                  Nothing here yet. Add a deal or a pizza and it'll show up.
                </div>
                <button className="gzp-btn gzp-btn-primary" onClick={() => setCartOpen(false)} type="button">
                  Back to the menu
                </button>
              </div>
            ) : (
              <>
                <div className="gzp-sheet-body">
                  {cartLines.filter((l) => l.type !== "byo").map(renderCartLine)}

                  {byoLines.length > 0 && (
                    <div className="gzp-byo-cart">
                      <div className="gzp-byo-cart-head">
                        <h4><I.Target aria-hidden="true" style={{ marginRight: 6, verticalAlign: "-2px" }} />Your custom deal</h4>
                        <button type="button" onClick={() => { setCartOpen(false); setByoOpen(true); }}>
                          Edit
                        </button>
                      </div>
                      <p className={`gzp-byo-cart-note${byoShort > 0 || !byoConfig.enabled ? " is-warn" : ""}`}>
                        {!byoConfig.enabled
                          ? "This deal isn't available right now."
                          : byoNudge(byoUnits, byoConfig)}
                      </p>
                      {byoLines.map(renderCartLine)}
                      {byoDiscount > 0 && (
                        <p className="gzp-byo-cart-saving">
                          You save <b>{formatRs(byoDiscount)}</b> ({byoPercent}% off {byoUnits} items)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="gzp-sheet-foot">
                  <div className="gzp-totals">
                    <div>
                      <span>Subtotal</span>
                      <span>{formatRs(grossSubtotal)}</span>
                    </div>
                    {byoDiscount > 0 && (
                      <div className="is-discount">
                        <span>Custom deal discount ({byoPercent}%)</span>
                        <span>−{formatRs(byoDiscount)}</span>
                      </div>
                    )}
                    <div>
                      <span>Tax ({taxRatePercent}%)</span>
                      <span>{formatRs(tax)}</span>
                    </div>
                    <div>
                      <span>Delivery</span>
                      <span>Chosen at checkout</span>
                    </div>
                    <div className="gzp-grand">
                      <span>Total</span>
                      <span>{formatRs(cartTotal)}</span>
                    </div>
                  </div>
                  {byoBlocked && (
                    <p className="gzp-byo-warn">
                      {byoConfig.enabled
                        ? `Your custom deal needs ${byoShort} more item${byoShort === 1 ? "" : "s"} to qualify. Add more or remove the deal to continue.`
                        : "The custom deal isn't available right now. Remove it to continue."}
                    </p>
                  )}
                  <button
                    className="gzp-btn gzp-btn-primary gzp-btn-block"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    disabled={byoBlocked}
                    type="button"
                  >
                    Choose delivery or pickup
                  </button>
                  {byoBlocked && (
                    <button
                      type="button"
                      className="gzp-btn gzp-btn-ghost gzp-btn-block"
                      style={{ marginTop: 8 }}
                      onClick={() => {
                        if (byoConfig.enabled) {
                          setCartOpen(false);
                          setByoOpen(true);
                        } else {
                          clearByo();
                        }
                      }}
                    >
                      {byoConfig.enabled ? "Add more items to my deal" : "Remove custom deal"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- Checkout ---- */}
      {checkoutOpen && (
        <div className="gzp-sheet-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="gzp-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Delivery or pickup details">
            <div className="gzp-sheet-head">
              <button
                className="gzp-icon-btn"
                onClick={() => {
                  setCheckoutOpen(false);
                  setCartOpen(true);
                }}
                aria-label="Back to your order"
                type="button"
              >
                <IconChevron dir="left" />
              </button>
              <h2>Delivery or pickup</h2>
            </div>

            <form onSubmit={handleCheckout} style={{ display: "contents" }}>
              <div className="gzp-sheet-body">
                <div className="gzp-form">
                  <FulfillmentPicker f={fulfil} />

                  <label className="gzp-field">
                    <span>Your name</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>

                  <label className="gzp-field">
                    <span>Mobile number</span>
                    <input
                      required
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9+]*"
                      maxLength={14}
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: sanitizePhoneInput(e.target.value) })
                      }
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = (e.clipboardData || window.clipboardData).getData("text");
                        setForm((f) => ({ ...f, phone: sanitizePhoneInput(f.phone + pasted) }));
                      }}
                      placeholder="03001234567"
                    />
                  </label>

                  <div className="gzp-field">
                    <span>Coupon code</span>
                    {welcomeOfferConfig?.enabled && (
                      <button
                        type="button"
                        className="gzp-btn gzp-btn-ghost"
                        onClick={checkWelcomeCoupon}
                        disabled={validatingCoupon}
                      >
                        {validatingCoupon ? "Checking…" : customer?.id ? "Check Coupon" : "Sign in to check coupons"}
                      </button>
                    )}
                    {assignedCoupons.length > 0 && (
                      <select
                        value=""
                        aria-label="Choose an assigned coupon"
                        disabled={Boolean(appliedCoupon)}
                        onChange={(event) => {
                          const assignment = assignedCoupons.find((item) => item.code === event.target.value);
                          if (!assignment) return;
                          setCouponInput(assignment.code);
                          setAppliedCoupon(null);
                        }}
                      >
                        <option value="">Choose an assigned coupon</option>
                        {assignedCoupons.map((assignment) => (
                          <option key={assignment._id} value={assignment.code}>
                            {assignment.couponId?.name || "Assigned coupon"} — {assignment.couponId?.discountType === "percentage"
                              ? `${assignment.couponId.discountValue}%`
                              : `Rs ${assignment.couponId?.discountValue}`}
                          </option>
                        ))}
                      </select>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        aria-label="Coupon code"
                        disabled={Boolean(appliedCoupon)}
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          className="gzp-btn gzp-btn-ghost"
                          onClick={() => setAppliedCoupon(null)}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="gzp-btn gzp-btn-ghost"
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon}
                        >
                          {validatingCoupon ? "Checking…" : "Apply"}
                        </button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <small style={{ color: "#78d38b" }}>
                        {appliedCoupon.code} applied — save {formatRs(couponDiscount)}
                      </small>
                    )}
                  </div>

                  <PaymentMethodPicker
                    cfg={payments}
                    value={payMethod}
                    onChange={setPayMethod}
                    pickup={fulfil.method === "pickup"}
                    showCashDescription={fulfil.branch?.customerDisplay?.showCashPaymentNote !== false}
                  />

                  {jazzSelected ? (
                    <JazzCashCard cfg={payments} amountLabel={formatRs(total)} jazz={jazz} />
                  ) : fulfil.branch?.customerDisplay?.showCashPaymentNote !== false ? (
                    <p className="gzp-note">
                      <IconTruck />
                      <span>
                        {fulfil.method === "pickup" ? (
                          <><b>Pay at pickup.</b> Pay at the counter.</>
                        ) : (
                          <><b>Cash on delivery.</b> Pay the rider when the food arrives. We'll call this number if we can't find the address.</>
                        )}
                      </span>
                    </p>
                  ) : null}

                  {error && <p className="gzp-error">{error}</p>}
                </div>
              </div>

              <div className="gzp-sheet-foot">
                <div className="gzp-totals">
                  {couponDiscount > 0 && (
                    <div className="is-discount">
                      <span>Coupon discount ({appliedCoupon.code})</span>
                      <span>−{formatRs(couponDiscount)}</span>
                    </div>
                  )}
                  <div>
                    <span>Subtotal + tax</span>
                    <span>{formatRs(cartTotal)}</span>
                  </div>
                  {fulfil.branch?.customerDisplay?.showDeliveryFees === true && (
                    <div>
                      <span>{fulfil.method === "pickup" ? "Pickup" : "Delivery fee"}</span>
                      <span>{fulfil.quote?.ok ? (fulfil.fee > 0 ? formatRs(fulfil.fee) : "Free") : "—"}</span>
                    </div>
                  )}
                  <div className="gzp-grand">
                    <span>Total to pay</span>
                    <span>{formatRs(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="gzp-btn gzp-btn-primary gzp-btn-block"
                  disabled={!canPlace}
                >
                  {placing
                    ? "Sending to the kitchen…"
                    : !fulfil.ready
                    ? fulfil.quoting ? "Checking…" : fulfil.method === "delivery" ? "Complete delivery details" : "Check pickup details"
                    : jazzSelected && !jazz.ready
                    ? jazz.uploading
                      ? "Uploading screenshot…"
                      : "Add payment details to continue"
                    : "Place order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {welcomeOffer && (
        <div className="gzp-overlay" style={{ zIndex: 110 }} onClick={declineWelcomeOffer}>
          <div className="gzp-modal" role="dialog" aria-modal="true" aria-label={welcomeOffer.popupTitle || "First-order welcome offer"} onClick={(event) => event.stopPropagation()}>
            <div className="gzp-modal-body">
              <h2>{welcomeOffer.popupTitle || "Welcome to our Pizza Store!"}</h2>
              <p>{welcomeOffer.popupDescription || "You're eligible for a special first-order reward."}</p>
              <p><strong>{welcomeOffer.discountPercentage}% off</strong> your first order. Save {formatRs(welcomeOffer.discountAmount)} on this basket.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button type="button" className="gzp-btn gzp-btn-primary" onClick={applyWelcomeOffer} disabled={validatingCoupon}>
                  {validatingCoupon ? "Checking…" : welcomeOffer.applyButtonLabel || "Apply Discount"}
                </button>
                <button type="button" className="gzp-btn gzp-btn-ghost" onClick={declineWelcomeOffer}>
                  {welcomeOffer.declineButtonLabel || "No Thanks"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Track ---- */}
      {trackOpen && (
        <div className="gzp-sheet-overlay" onClick={() => setTrackOpen(false)}>
          <div className="gzp-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Track your order">
            <div className="gzp-sheet-head">
              <h2>Track your order</h2>
              <button className="gzp-icon-btn" onClick={() => setTrackOpen(false)} aria-label="Close" type="button">
                <I.Close aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleTrackSubmit} style={{ display: "contents" }}>
              <div className="gzp-sheet-body">
                <div className="gzp-form">
                  <label className="gzp-field">
                    <span>Mobile number used at checkout</span>
                    <input
                      required
                      autoFocus
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9+]*"
                      maxLength={14}
                      value={trackInput}
                      onChange={(e) => setTrackInput(sanitizePhoneInput(e.target.value))}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = (e.clipboardData || window.clipboardData).getData("text");
                        setTrackInput((v) => sanitizePhoneInput(v + pasted));
                      }}
                      placeholder="03001234567"
                    />
                  </label>
                  {trackError && <p className="gzp-error">{trackError}</p>}
                </div>
              </div>

              <div className="gzp-sheet-foot">
                <button
                  type="submit"
                  className="gzp-btn gzp-btn-primary gzp-btn-block"
                  disabled={trackLoading}
                >
                  {trackLoading ? "Looking…" : "Find my order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Write a review sheet ---- */}
      {reviewFormOpen && <ReviewForm />}

      {/* ---- All reviews page ---- */}
      {showAllReviews && <AllReviewsPage />}
    </div>
  );
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname.replace(/\/+$/, "") || "/");

  useEffect(() => {
    const updatePath = () => setPathname(window.location.pathname.replace(/\/+$/, "") || "/");
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  useEffect(() => {
    const pages = {
      "/": {
        title: "Pizza, Burgers & Deals in Gojra | GenZ Pizza Land",
        description: "Order fresh pizza, burgers and deals online from GenZ Pizza Land in Gojra. Choose delivery or pickup, pay at the door or by JazzCash/Raast.",
        canonical: "https://genzpizza.muscatfood.com/",
        robots: "index,follow",
      },
      "/privacy": {
        title: "Privacy Policy | GenZ Pizza Land",
        description: "Learn how GenZ Pizza Land uses and protects information for online orders, customer accounts, payment verification and reviews.",
        canonical: "https://genzpizza.muscatfood.com/privacy",
        robots: "index,follow",
        label: "Privacy Policy",
      },
      "/terms": {
        title: "Terms and Conditions | GenZ Pizza Land",
        description: "Read the terms for ordering online from GenZ Pizza Land, including order availability, delivery, pickup, payments and cancellations.",
        canonical: "https://genzpizza.muscatfood.com/terms",
        robots: "index,follow",
        label: "Terms and Conditions",
      },
      "/help": {
        title: "Customer Help | GenZ Pizza Land",
        description: "Get help with placing an order, delivery and pickup, payments, order tracking, changes and order issues.",
        canonical: "https://genzpizza.muscatfood.com/help",
        robots: "index,follow",
        label: "Customer Help",
      },
    };
    const page = pages[pathname] || {
      title: "Page Not Found | GenZ Pizza Land",
      description: "The page you requested could not be found. Return to the GenZ Pizza Land online store.",
      canonical: "",
      robots: "noindex,nofollow",
    };
    document.title = page.title;
    const setMeta = (selector, attributes, content) => {
      let meta = document.head.querySelector(selector);
      if (!meta) {
        meta = document.createElement("meta");
        Object.entries(attributes).forEach(([key, value]) => meta.setAttribute(key, value));
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    setMeta('meta[name="description"]', { name: "description" }, page.description);
    setMeta('meta[name="robots"]', { name: "robots" }, page.robots);
    setMeta('meta[property="og:title"]', { property: "og:title" }, page.title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, page.description);
    setMeta('meta[property="og:url"]', { property: "og:url" }, page.canonical || `https://genzpizza.muscatfood.com${pathname}`);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (page.canonical) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = page.canonical;
    } else {
      canonical?.remove();
    }

    let structuredData = document.getElementById("gzp-structured-data");
    if (page.canonical) {
      if (!structuredData) {
        structuredData = document.createElement("script");
        structuredData.id = "gzp-structured-data";
        structuredData.type = "application/ld+json";
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify(pathname === "/"
        ? {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "GenZ Pizza Land",
            url: page.canonical,
            servesCuisine: ["Pizza", "Burgers", "Fast Food"],
            address: { "@type": "PostalAddress", addressLocality: "Gojra", addressCountry: "PK" },
          }
        : {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://genzpizza.muscatfood.com/" },
              { "@type": "ListItem", position: 2, name: page.label, item: page.canonical },
            ],
          });
    } else {
      structuredData?.remove();
    }
  }, [pathname]);

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
    if (!measurementId) return;
    if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
      console.error("VITE_GA_MEASUREMENT_ID must be a valid GA4 measurement ID (G-...).");
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    const scriptId = "google-analytics-gtag";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });
    }

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
      page_title: document.title,
    });
  }, [pathname]);

  if (pathname === "/") return <StorefrontHome />;
  if (pathname === "/privacy") return <PrivacyPolicy />;
  if (pathname === "/terms") return <TermsAndConditions />;
  if (pathname === "/help") return <HelpPage />;
  return <StoreNotFound />;
}

export default App;
