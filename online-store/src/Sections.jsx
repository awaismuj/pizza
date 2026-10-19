import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getPublicReviews, submitReview } from "./api";
import genzLogo from "./assets/genz-pizza-land-logo.jpg";
import sindbadLogo from "./assets/sindbad-solution-logo.png";
import { I } from "./AppIcons.jsx";

/* New storefront sections: hero intro, features, how-it-works, reviews,
   contact panel and footer. Self-contained so App.jsx only mounts them. */

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
  </svg>
);

const PencilIcon = () => (
  <svg {...svgProps}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg {...svgProps} width="20" height="20">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const Stars = ({ value, label }) => (
  <span className="v2-stars" role="img" aria-label={label || `${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={n <= Math.round(value) ? "" : "off"} style={{ display: "inline-flex" }}>
        <StarIcon />
      </span>
    ))}
  </span>
);

const AVATAR_COLORS = ["#E6392F", "#d97706", "#1a9e56", "#2563eb", "#7c3aed", "#db2777", "#0f766e"];
const colorFor = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

const timeAgo = (iso) => {
  const t = new Date(iso).getTime();
  if (!t) return "";
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return "just now";
  const m = s / 60;
  if (m < 60) return `${Math.floor(m)} min ago`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)} hour${Math.floor(h) === 1 ? "" : "s"} ago`;
  const d = h / 24;
  if (d < 30) return `${Math.floor(d)} day${Math.floor(d) === 1 ? "" : "s"} ago`;
  const mo = d / 30;
  if (mo < 12) return `${Math.floor(mo)} month${Math.floor(mo) === 1 ? "" : "s"} ago`;
  return `${Math.floor(mo / 12)} year${Math.floor(mo / 12) === 1 ? "" : "s"} ago`;
};

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const NAME_KEY = "gzp-reviewer-name";

const readSavedName = () => {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
};
const saveName = (name) => {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* private mode — fine */
  }
};

/* ------------------------------ Hero intro ------------------------------ */

export const HeroIntro = ({ onOrder, onTrack, summary }) => (
  <section className="v2-hero">
    <div className="v2-wrap">
      <div className="v2-intro">
        <div className="v2-intro-copy">
          <span className="v2-eyebrow">
            <i /> Delivery &amp; pickup in Gojra
          </span>
          <h1>
            Hot, cheesy &amp; <em>delivered</em> to your door
          </h1>
          <p className="lead">Fresh pizzas, burgers and sides made to order.</p>
        </div>

        <div className="v2-cta">
          <button type="button" className="gzp-btn gzp-btn-primary" onClick={onOrder}>
            Order now
          </button>
          <button type="button" className="gzp-btn gzp-btn-ghost" onClick={onTrack}>
            Track my order
          </button>
        </div>
      </div>

      <ul className="v2-chips" aria-label="Highlights">
        <li><I.Cash aria-hidden="true" /> Cash on delivery</li>
        <li><I.Pin aria-hidden="true" /> Live order tracking</li>
        <li><I.Puzzle aria-hidden="true" /> Build your own deal</li>
        {summary?.total > 0 && (
          <li className="rating">
            <StarIcon /> {summary.average} · {summary.total} review{summary.total === 1 ? "" : "s"}
          </li>
        )}
      </ul>
    </div>
  </section>
);

/* -------------------------- Features + how it works -------------------------- */

const FEATURES = [
  { Icon: I.Pizza, title: "Made to order", text: "Every pizza is built fresh when you order, never sitting under a heat lamp.", tag: "Fresh" },
  { Icon: I.Rider, title: "Home delivery", text: "Riders bring it hot to your door. See your area's fee and time before you pay.", tag: "Door to door" },
  { Icon: I.Store, title: "Pickup from the restaurant", text: "Skip the delivery fee. Order ahead and collect it from the counter when it is ready.", tag: "No fee" },
  { Icon: I.Card, title: "Pay your way", text: "Cash on delivery or at pickup, or scan the JazzCash / Raast QR. No sign-up needed.", tag: "Flexible" },
  { Icon: I.Puzzle, title: "Build your own deal", text: "Mix flavours, sizes and sides into a bundle that fits your crowd and your budget.", tag: "Save more" },
  { Icon: I.Pin, title: "Live order tracking", text: "Follow your order from the kitchen to your hands, with an estimated time on the way.", tag: "Real time" },
];

export const FeaturesSection = () => (
  <section className="s3-section" id="section-why">
    <div className="s3-head">
      <span className="v2-kicker">What we deliver</span>
      <h2 className="v2-title">Good food, your way</h2>
      <p className="s3-lead">Fresh from the oven, to your door or your hands. Here is what you get with every order.</p>
    </div>
    <div className="s3-deliver">
      {FEATURES.map(({ Icon, title, text, tag }) => (
        <article className="s3-card" key={title}>
          <div className="s3-card-top">
            <span className="s3-ico"><Icon aria-hidden="true" /></span>
            <span className="s3-tag">{tag}</span>
          </div>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  </section>
);

const STEPS = [
  { Icon: I.Utensils, title: "Pick your food", text: "Browse the menu and deals, choose size and crust, and add everything to your order." },
  { Icon: I.Rider, title: "Delivery or pickup", text: "Choose home delivery or collect it yourself. Fees and times are shown up front." },
  { Icon: I.Card, title: "Confirm and pay", text: "Add your name and phone. Pay in cash or by JazzCash / Raast. No account needed." },
  { Icon: I.Clock, title: "Track and enjoy", text: "Watch your order progress live, then enjoy it hot, at your door or at the counter." },
];

export const HowItWorks = () => (
  <section className="s3-how" id="section-how">
    <div className="s3-how-inner">
      <div className="s3-head is-light">
        <span className="v2-kicker">How it works</span>
        <h2 className="v2-title">Four easy steps to a full table</h2>
        <p className="s3-lead">From first tap to first bite takes just a couple of minutes.</p>
      </div>
      <ol className="s3-steps">
        {STEPS.map(({ Icon, title, text }, i) => (
          <li className="s3-step" key={title}>
            <div className="s3-step-ico">
              <Icon aria-hidden="true" />
              <b>{i + 1}</b>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* --------------------------------- Reviews --------------------------------- */

const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div
      className="v2-starpick"
      role="radiogroup"
      aria-label="Your rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? "" : "s"} — ${RATING_WORDS[n]}`}
          className={n <= shown ? "on" : ""}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onChange(n)}
        >
          <StarIcon />
        </button>
      ))}
      <span className="lbl">{RATING_WORDS[shown] || "Tap a star"}</span>
    </div>
  );
};

const ReviewModal = ({ onClose, onSubmitted }) => {
  const [name, setName] = useState(readSavedName);
  const [rating, setRating] = useState(0);
  const [dish, setDish] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!name.trim()) return setError("Please enter your name.");
    if (!rating) return setError("Please choose a star rating.");
    if (comment.trim().length < 10) return setError("Please write at least a few words about your experience.");
    setError("");
    setBusy(true);
    try {
      const res = await submitReview({ name, rating, dish, title, comment, website });
      saveName(name.trim());
      setDone(true);
      onSubmitted(res?.data);
    } catch (err) {
      setError(err.message || "Could not send your review. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="v2-rvm-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div className="v2-rvm" role="dialog" aria-modal="true" aria-label="Write a review">
        {done ? (
          <div className="v2-thanks">
            <div className="big" aria-hidden="true"><I.CheckCircle /></div>
            <h3>Thank you!</h3>
            <p>Your review is live. It really helps other hungry people in Gojra.</p>
            <button type="button" className="gzp-btn gzp-btn-primary gzp-btn-block" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="v2-rvm-head">
              <div>
                <h3>Write a review</h3>
                <p>Tell us how we did — it only takes a minute.</p>
              </div>
              <button type="button" className="gzp-icon-btn" onClick={onClose} aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            <form className="v2-rvm-form" onSubmit={submit} noValidate>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".86rem", marginBottom: 6 }}>Your rating</div>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <label className="f">
                <span>Your name</span>
                <input
                  type="text"
                  value={name}
                  maxLength={60}
                  autoComplete="name"
                  placeholder="e.g. Ayesha K."
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="f">
                <span>What did you order? <small>(optional)</small></span>
                <input
                  type="text"
                  value={dish}
                  maxLength={80}
                  placeholder="e.g. Fajita pizza"
                  onChange={(e) => setDish(e.target.value)}
                />
              </label>

              <label className="f">
                <span>Headline <small>(optional)</small></span>
                <input
                  type="text"
                  value={title}
                  maxLength={100}
                  placeholder="Sum it up in a few words"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label className="f">
                <span>Your review</span>
                <textarea
                  value={comment}
                  maxLength={1200}
                  placeholder="How was the food, the delivery, the service?"
                  onChange={(e) => setComment(e.target.value)}
                />
                <span className="v2-count">{comment.length}/1200</span>
              </label>

              {/* Honeypot — hidden from people, bots fill it in. */}
              <input
                className="v2-hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />

              {error && <p className="v2-form-error" role="alert">{error}</p>}

              <div className="v2-rvm-actions">
                <button type="button" className="gzp-btn gzp-btn-ghost" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="gzp-btn gzp-btn-primary" disabled={busy}>
                  {busy ? "Sending…" : "Post review"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export const ReviewsSection = ({ onSummary }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ total: 0, average: 0, distribution: {} });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(6);

  const load = useCallback(async () => {
    try {
      const res = await getPublicReviews(60);
      setReviews(res.data?.reviews || []);
      setSummary(res.data?.summary || { total: 0, average: 0, distribution: {} });
      setLoadError("");
    } catch (err) {
      setLoadError(err.message || "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    onSummary?.(summary);
  }, [summary, onSummary]);

  const bars = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((n) => {
        const count = summary.distribution?.[n] || 0;
        return { n, count, pct: summary.total ? Math.round((count / summary.total) * 100) : 0 };
      }),
    [summary]
  );

  const openModal = () => setOpen(true);

  return (
    <section className="s3-section" id="section-reviews">
      <div className="s3-head">
        <span className="v2-kicker">Reviews</span>
        <h2 className="v2-title">What Gojra is saying</h2>
        <p className="s3-lead">Honest words from people who ordered with us.</p>
      </div>

      <div className="s3-rv-layout">
        <aside className="s3-rv-summary" aria-label="Rating summary">
          <div className="s3-rv-score">
            <b>{summary.total ? summary.average.toFixed(1) : "–"}</b>
            <div>
              <Stars value={summary.average} />
              <small>
                {summary.total
                  ? `${summary.total} review${summary.total === 1 ? "" : "s"}`
                  : "No reviews yet"}
              </small>
            </div>
          </div>
          <div className="s3-bars">
            {bars.map((b) => (
              <div className="s3-bar" key={b.n}>
                <span className="s3-barn">{b.n} <StarIcon /></span>
                <i><span style={{ width: `${b.pct}%` }} /></i>
                <em>{b.count}</em>
              </div>
            ))}
          </div>
          <button type="button" className="s3-write" onClick={openModal}>
            <PencilIcon /> Write a review
          </button>
        </aside>

        <div>
          <div className="s3-rv-list">
            {loading && <div className="v2-rv-empty">Loading reviews…</div>}

            {!loading && loadError && reviews.length === 0 && (
              <div className="v2-rv-empty">
                <b>Couldn't load reviews</b>
                {loadError}
                <div style={{ marginTop: 14 }}>
                  <button type="button" className="gzp-btn gzp-btn-ghost" onClick={() => { setLoading(true); load(); }}>
                    Try again
                  </button>
                </div>
              </div>
            )}

            {!loading && !loadError && reviews.length === 0 && (
              <div className="v2-rv-empty">
                <span aria-hidden="true" className="s3-empty-ico"><I.Star /></span>
                <b>Be the first to review</b>
                Ate with us? Tell others what you thought.
              </div>
            )}

            {reviews.slice(0, shown).map((r) => (
              <article className="s3-rv" key={r._id}>
                <I.Quote className="s3-quote" aria-hidden="true" />
                <Stars value={r.rating} />
                {r.title && <h4>{r.title}</h4>}
                <p>{r.comment}</p>
                <div className="s3-rv-foot">
                  <div className="v2-avatar" style={{ background: colorFor(r.name) }} aria-hidden="true">
                    {(r.name || "?").trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{timeAgo(r.createdAt)}</span>
                  </div>
                  {r.dish && <span className="v2-rv-dish"><I.Utensils aria-hidden="true" /> {r.dish}</span>}
                </div>
              </article>
            ))}
          </div>

          {reviews.length > shown && (
            <button type="button" className="gzp-btn gzp-btn-ghost v2-more" onClick={() => setShown((n) => n + 6)}>
              Show more reviews
            </button>
          )}
        </div>
      </div>

      {open && (
        <ReviewModal
          onClose={() => setOpen(false)}
          onSubmitted={() => {
            load();
          }}
        />
      )}
    </section>
  );
};

/* --------------------------- Contact + footer --------------------------- */

export const ContactSection = ({ whatsappLink, onTrack }) => (
  <section className="v2-contact" id="section-contact">
    <div className="v2-panel warm">
      <span className="v2-kicker">Questions?</span>
      <h2 className="v2-title" style={{ color: "#fff" }}>Talk to us on WhatsApp</h2>
      <p className="v2-sub">Special requests, party orders or a question about your delivery — message the shop directly.</p>
      <a className="gzp-btn" href={whatsappLink} target="_blank" rel="noopener noreferrer">
        Chat on WhatsApp
      </a>
    </div>
    <div className="v2-panel">
      <span className="v2-kicker">Good to know</span>
      <ul className="v2-facts">
        <li><span aria-hidden="true"><I.Pin /></span> Home delivery and restaurant pickup in Gojra</li>
        <li><span aria-hidden="true"><I.Cash /></span> Cash on delivery or JazzCash / Raast QR</li>
        <li><span aria-hidden="true"><I.Clock /></span> Live order tracking from the kitchen to you</li>
      </ul>
      <button type="button" className="gzp-btn gzp-btn-ghost" onClick={onTrack}>
        Track an order
      </button>
    </div>
  </section>
);

export const SiteFooter = ({ taxRatePercent, onNavigate, onTrack }) => (
  <footer className="v2-footer">
    <div className="v2-wrap">
      <div className="v2-footer-grid">
        <div>
          <div className="brand">
            <img src={genzLogo} alt="" /> GenZ Pizza Land
          </div>
          <p>
            Fresh pizzas, burgers and sides, delivered hot across Gojra. Prices are in rupees;
            {" "}{taxRatePercent}% tax is added at checkout. Pay cash on delivery or by JazzCash / Raast QR.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><button type="button" onClick={() => onNavigate("menu")}>Menu</button></li>
            <li><button type="button" onClick={() => onNavigate("deals")}>Deals</button></li>
            <li><button type="button" onClick={() => onNavigate("reviews")}>Reviews</button></li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><button type="button" onClick={onTrack}>Track an order</button></li>
            <li><button type="button" onClick={() => onNavigate("how")}>How it works</button></li>
            <li><button type="button" onClick={() => onNavigate("contact")}>Contact us</button></li>
          </ul>
        </div>
      </div>
      <div className="v2-footer-bottom">
        <span>© {new Date().getFullYear()} GenZ Pizza Land. All rights reserved.</span>
        <span className="credit">
          Developed by <img src={sindbadLogo} alt="" /> <strong>Sindbad Solution</strong>
        </span>
      </div>
    </div>
  </footer>
);


export const SECTIONS_STYLES = `
.s3-section { padding: clamp(40px, 6vw, 84px) var(--gutter); }
.s3-head { max-width: 640px; margin: 0 auto 32px; text-align: center; }
.s3-head .v2-title { margin: 6px 0 10px; }
.s3-lead { margin: 0; color: var(--flour-dim); font-size: 1.02rem; line-height: 1.55; }
.s3-head.is-light .v2-title, .s3-head.is-light .s3-lead { color: #fff; }
.s3-head.is-light .s3-lead { opacity: .78; }

.s3-deliver { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; max-width: 1200px; margin: 0 auto; }
@media (max-width: 960px) { .s3-deliver { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px) { .s3-deliver { grid-template-columns: 1fr; } }
.s3-card { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 22px; display: flex; flex-direction: column; gap: 10px; transition: transform .2s, box-shadow .2s, border-color .2s; }
.s3-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: rgba(230,57,47,.3); }
.s3-card-top { display: flex; justify-content: space-between; align-items: center; }
.s3-ico { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; font-size: 1.3rem; color: #fff; background: linear-gradient(135deg, #E6392F, #ff7a45); box-shadow: 0 10px 20px -8px rgba(230,57,47,.55); }
.s3-tag { font-size: .72rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: var(--ember-deep); background: #fff0ec; padding: 5px 10px; border-radius: 999px; }
.s3-card h3 { margin: 6px 0 0; font-size: 1.12rem; }
.s3-card p { margin: 0; color: var(--flour-dim); font-size: .94rem; line-height: 1.55; }

.s3-how { background: linear-gradient(160deg, #2a1d17, #1c1410); padding: clamp(44px, 6vw, 88px) var(--gutter); }
.s3-how-inner { max-width: 1200px; margin: 0 auto; }
.s3-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; position: relative; counter-reset: s; }
@media (min-width: 961px) { .s3-steps::before { content: ""; position: absolute; top: 36px; left: 12%; right: 12%; border-top: 2px dashed rgba(255,255,255,.22); } }
@media (max-width: 960px) { .s3-steps { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .s3-steps { grid-template-columns: 1fr; } }
.s3-step { position: relative; text-align: center; padding: 0 6px; }
.s3-step-ico { position: relative; width: 72px; height: 72px; margin: 0 auto 16px; border-radius: 50%; display: grid; place-items: center; font-size: 1.5rem; color: #fff; background: linear-gradient(135deg, #E6392F, #ff7a45); box-shadow: 0 0 0 6px #2a1d17, 0 14px 26px -8px rgba(230,57,47,.6); }
.s3-step-ico b { position: absolute; top: -4px; right: -4px; width: 26px; height: 26px; border-radius: 50%; background: #FFC83D; color: #2a1d17; font-size: .8rem; display: grid; place-items: center; box-shadow: 0 0 0 3px #2a1d17; }
.s3-step h3 { margin: 0 0 6px; color: #fff; font-size: 1.08rem; }
.s3-step p { margin: 0; color: rgba(255,255,255,.72); font-size: .92rem; line-height: 1.55; }

.s3-rv-layout { display: grid; grid-template-columns: 320px 1fr; gap: 22px; max-width: 1200px; margin: 0 auto; align-items: start; }
@media (max-width: 900px) { .s3-rv-layout { grid-template-columns: 1fr; } }
.s3-rv-summary { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 24px; display: flex; flex-direction: column; gap: 18px; position: sticky; top: calc(var(--header-h) + var(--nav-h) + 12px); }
@media (max-width: 900px) { .s3-rv-summary { position: static; } }
.s3-rv-score { display: flex; align-items: center; gap: 14px; }
.s3-rv-score > b { font-size: 3.4rem; line-height: 1; font-weight: 900; color: var(--flour); }
.s3-rv-score small { display: block; margin-top: 4px; color: var(--flour-dim); }
.s3-bars { display: flex; flex-direction: column; gap: 8px; }
.s3-bar { display: grid; grid-template-columns: 34px 1fr 26px; align-items: center; gap: 10px; font-size: .82rem; color: var(--flour-dim); }
.s3-barn { display: inline-flex; align-items: center; gap: 3px; font-weight: 700; }
.s3-barn svg { width: 11px; height: 11px; color: #f5a524; }
.s3-bar i { height: 8px; background: #f3e8dc; border-radius: 999px; overflow: hidden; display: block; }
.s3-bar i span { display: block; height: 100%; background: linear-gradient(90deg, #f5a524, #E6392F); border-radius: 999px; }
.s3-bar em { font-style: normal; text-align: right; }
.s3-write { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 14px; padding: 13px 16px; font: inherit; font-weight: 800; color: #fff; background: var(--ember); cursor: pointer; box-shadow: 0 12px 22px -10px rgba(230,57,47,.6); }
.s3-write:hover { background: var(--ember-deep); }
.s3-write svg { width: 16px; height: 16px; }
.s3-rv-list { columns: 2 280px; column-gap: 16px; }
.s3-rv-list > .v2-rv-empty { column-span: all; }
.s3-rv { position: relative; break-inside: avoid; margin: 0 0 16px; background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.s3-rv .s3-quote { position: absolute; top: 16px; right: 18px; font-size: 1.4rem; color: #ffd9d3; }
.s3-rv h4 { margin: 0; font-size: 1rem; }
.s3-rv p { margin: 0; color: var(--flour-dim); line-height: 1.6; font-size: .94rem; }
.s3-rv-foot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px; padding-top: 12px; border-top: 1px solid var(--line); }
.s3-rv-foot strong { display: block; font-size: .9rem; }
.s3-rv-foot > div:nth-child(2) span { font-size: .76rem; color: var(--flour-faint); }
.s3-rv-foot .v2-rv-dish { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-size: .76rem; background: #fff0ec; color: var(--ember-deep); padding: 4px 10px; border-radius: 999px; }
.s3-empty-ico { display: grid; place-items: center; font-size: 2rem; color: #f5a524; margin-bottom: 6px; }
.v2-thanks .big svg { width: 54px; height: 54px; color: var(--basil); }
.v2-chips li svg { width: 14px; height: 14px; vertical-align: -2px; margin-right: 4px; }
.v2-facts li > span svg { color: var(--ember); }
`;
