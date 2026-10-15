import { useEffect } from "react";

// On laptop trackpads, scrolling doesn't move the actual cursor - so
// whatever card/button/row the pointer happens to be resting over stays
// visually ":hover"ed as content slides underneath it, making hover
// highlights look "broken"/stuck while scrolling. This briefly disables
// pointer events (which pauses hover matching) for the duration of a
// scroll, then restores it once scrolling settles.
// `capture: true` is required to catch scroll events from any scrollable
// container on the page, not just window - the native `scroll` event
// doesn't bubble.
//
// Touchscreens don't have this problem (no cursor to get stuck), and
// disabling pointer-events site-wide after every scroll is actively
// harmful there: mobile browsers fire a scroll event whenever they
// auto-scroll a tapped field into view (e.g. inside a tall, scrollable
// modal), so a tap that lands within the ~150ms window right after that
// gets silently swallowed - a dropdown or button can look like it "isn't
// responding". So this only runs on devices that actually have a
// hover-capable, fine pointer (a real mouse/trackpad).
const useScrollHoverFix = () => {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }

    let timeoutId = null;

    const onScroll = () => {
      document.body.classList.add("is-scrolling");
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      if (timeoutId) clearTimeout(timeoutId);
      document.body.classList.remove("is-scrolling");
    };
  }, []);
};

export default useScrollHoverFix;
