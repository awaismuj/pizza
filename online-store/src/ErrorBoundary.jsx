import React from "react";

/**
 * Without this, any uncaught error thrown while rendering (a bad field in
 * an order/menu response, a null a component didn't expect, etc.) unmounts
 * the ENTIRE React tree and leaves a blank white page — no header, no
 * error message, nothing. That's the "blank screen after submitting an
 * order" bug: something threw during the order-confirmation render and
 * there was nothing to catch it.
 *
 * This catches render-time errors anywhere below it and shows a normal,
 * on-brand "something went wrong" screen instead, with a way to recover
 * (reload, or drop back to the menu) rather than a dead page.
 *
 * Note: this only catches errors thrown while React is rendering. Errors
 * inside async code (fetch handlers, setTimeout, etc.) don't trigger it —
 * those are already caught by the app's own try/catch blocks and shown via
 * the `error` state / gzp-error-banner.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface it in the console so it's easy to find in devtools, and hand
    // it to window.onerror-style reporting if that's ever wired up later.
    console.error("GenZ Pizza Land crashed while rendering:", error, info);
  }

  handleReload = () => {
    // A fresh load re-runs the app from scratch. If the crash was caused by
    // a bad "last order" pointer, clear it first so reloading doesn't just
    // walk straight back into the same broken render.
    try {
      localStorage.removeItem("gzp_last_order");
    } catch {
      // ignore — storage may be unavailable (private mode, etc.)
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: 24,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            background: "#0b0d10",
            color: "#f5f5f5",
          }}
        >
          <h1 style={{ fontSize: "1.3rem", margin: 0 }}>
            Something went wrong on our end
          </h1>
          <p style={{ maxWidth: 420, opacity: 0.8, margin: 0 }}>
            Your order may still have gone through — if you already saw an
            order number, it's safe. Reloading usually fixes this.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              border: "none",
              background: "#e6392b",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
