import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getPublicReviews, submitReview } from "./api";
import genzLogo from "./assets/genz-pizza-land-logo.jpg";
import sindbadLogo from "./assets/sindbad-solution-logo.png";

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

export const HeroIntro = ({ onOrder, onTrack, summary, taxFree }) => (
  <section className="v2-hero">
    <div className="v2-wrap">
      <div className="v2-hero-grid">
        <div>
          <span className="v2-eyebrow">
            <i /> Now delivering across Gojra
          </span>
          <h1>
            Hot, cheesy &amp; <em>delivered</em> to your door.
          </h1>
          <p className="lead">
            Fresh pizzas, burgers and sides made to order. Build your own deal, pay cash when it
            arrives, and watch your order move from the kitchen to your doorstep.
          </p>
          <div className="v2-cta">
            <button type="button" className="gzp-btn gzp-btn-primary" onClick={onOrder}>
              Order now
            </button>
            <button type="button" className="gzp-btn gzp-btn-ghost" onClick={onTrack}>
              Track my order
            </button>
          </div>
        </div>

        <div className="v2-stats" aria-label="Highlights">
          <div className="v2-stat">
            <b>Cash</b>
            <span>on delivery, no account needed</span>
          </div>
          <div className="v2-stat">
            <b>Live</b>
            <span>order tracking, step by step</span>
          </div>
          <div className="v2-stat">
            <b>Custom</b>
            <span>build your own deal</span>
          </div>
          <div className="v2-stat">
            <b>{summary?.total ? `${summary.average} ★` : "Fresh"}</b>
            <span>{summary?.total ? `from ${summary.total} customer review${summary.total === 1 ? "" : "s"}` : "made to order, every time"}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* -------------------------- Features + how it works -------------------------- */

const FEATURES = [
  { icon: "🍕", title: "Made to order", text: "Every pizza is built fresh when you order — never sitting under a heat lamp." },
  { icon: "🛵", title: "Hot to your door", text: "Our riders deliver across Gojra, so it arrives the way it left the oven." },
  { icon: "💳", title: "Pay your way", text: "Cash on delivery, or scan the JazzCash / Raast QR at checkout. No sign-up needed." },
  { icon: "🧩", title: "Build your own deal", text: "Mix flavours, sizes and sides into a bundle that fits your crowd and budget." },
];

export const FeaturesSection = () => (
  <section className="v2-section" id="section-why">
    <span className="v2-kicker">Why GenZ Pizza Land</span>
    <h2 className="v2-title">Good food, without the fuss</h2>
    <div className="v2-features">
      {FEATURES.map((f) => (
        <div className="v2-feature" key={f.title}>
          <div className="v2-ico" aria-hidden="true">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export const HowItWorks = () => (
  <section className="v2-how" id="section-how">
    <span className="v2-kicker">How it works</span>
    <h2 className="v2-title" style={{ color: "#fff" }}>Three steps to a full table</h2>
    <p className="v2-sub">From first tap to first bite, it takes a couple of minutes.</p>
    <div className="v2-steps">
      <div className="v2-step">
        <b>1</b>
        <h3>Pick your food</h3>
        <p>Browse the menu and deals, choose your size and crust, and add everything to your order.</p>
      </div>
      <div className="v2-step">
        <b>2</b>
        <h3>Confirm your details</h3>
        <p>Enter your name, phone and address. No account, no card — just your delivery details.</p>
      </div>
      <div className="v2-step">
        <b>3</b>
        <h3>Track &amp; enjoy</h3>
        <p>Follow your order live as the kitchen cooks it, then pay the rider in cash on arrival.</p>
      </div>
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
            <div className="big" aria-hidden="true">🎉</div>
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
    <section className="v2-section" id="section-reviews">
      <div className="v2-reviews-head">
        <div>
          <span className="v2-kicker">Reviews</span>
          <h2 className="v2-title">What Gojra is saying</h2>
        </div>
        <button type="button" className="v2-write inline" onClick={openModal}>
          <PencilIcon /> Write a Review
        </button>
      </div>

      <div className="v2-rv-layout">
        <aside className="v2-rv-summary" aria-label="Rating summary">
          <div className="v2-rv-score">
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
          <div className="v2-bars">
            {bars.map((b) => (
              <div className="v2-bar" key={b.n}>
                <span>{b.n}★</span>
                <i><span style={{ width: `${b.pct}%` }} /></i>
                <em>{b.count}</em>
              </div>
            ))}
          </div>
          <button type="button" className="v2-write" onClick={openModal}>
            <PencilIcon /> Write a Review
          </button>
        </aside>

        <div>
          <div className="v2-rv-list">
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
                <span aria-hidden="true" style={{ fontSize: "2rem" }}>⭐</span>
                <b>Be the first to review</b>
                Ate with us? Tell others what you thought.
              </div>
            )}

            {reviews.slice(0, shown).map((r) => (
              <article className="v2-rv" key={r._id}>
                <div className="v2-rv-top">
                  <div className="v2-avatar" style={{ background: colorFor(r.name) }} aria-hidden="true">
                    {(r.name || "?").trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{timeAgo(r.createdAt)}</span>
                  </div>
                </div>
                <Stars value={r.rating} />
                {r.title && <h4>{r.title}</h4>}
                <p>{r.comment}</p>
                {r.dish && <span className="v2-rv-dish">🍽 {r.dish}</span>}
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
        <li><span aria-hidden="true">📍</span> Delivering across Gojra</li>
        <li><span aria-hidden="true">💵</span> Cash on delivery or JazzCash / Raast QR</li>
        <li><span aria-hidden="true">⏱</span> Live order tracking from the kitchen to your door</li>
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
