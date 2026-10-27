import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaWhatsapp } from "react-icons/fa";
import {
  closeWhatsAppWindow,
  focusWhatsAppWindow,
  isWhatsAppWindowOpen,
  openWhatsAppWindow,
  toWhatsAppNumber,
  whatsAppChatUrl,
} from "../../utils/whatsapp";

const BLOCKED_MESSAGE = "Your browser blocked the WhatsApp window. Allow pop-ups for this site and try again.";

// The WhatsApp area of a screen. WhatsApp Web cannot be embedded in a page
// (it refuses to load inside another site), so the dashed box below is a
// "dock": the WhatsApp window opens exactly over it at the same size, instead
// of taking over the whole screen.
//
// `dockRef` lets a parent (for example the coupon sender) place the window
// over this box itself; when it is left out the dock uses its own box.
// `embedded` drops the card styling and title so the dock can sit inside
// another panel.
const WhatsAppDock = ({ dockRef, embedded = false }) => {
  const ownRef = useRef(null);
  const anchor = dockRef || ownRef;
  const [open, setOpen] = useState(isWhatsAppWindowOpen());
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState("");

  // The window is not part of this page, so poll to notice it being closed.
  useEffect(() => {
    const timer = setInterval(() => setOpen(isWhatsAppWindowOpen()), 1000);
    return () => clearInterval(timer);
  }, []);

  const afterOpen = (handle) => {
    setOpen(Boolean(handle));
    setNumberError(handle ? "" : BLOCKED_MESSAGE);
  };

  const dock = () => afterOpen(openWhatsAppWindow(anchor.current));

  const redock = () => {
    closeWhatsAppWindow();
    dock();
  };

  const bringToFront = () => {
    if (!focusWhatsAppWindow()) setOpen(false);
  };

  const openChat = (event) => {
    event.preventDefault();
    if (!toWhatsAppNumber(number)) {
      setNumberError("Enter a valid mobile number, e.g. 0301 2345678.");
      return;
    }
    afterOpen(openWhatsAppWindow(anchor.current, whatsAppChatUrl(number)));
  };

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper className={embedded ? "space-y-3" : "space-y-3 rounded-xl bg-[#262626] p-5"} aria-label="WhatsApp">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {embedded ? (
          <p className="text-xs text-[#999]">Sign in once with the QR code; it stays signed in.</p>
        ) : (
          <div className="flex items-center gap-2">
            <FaWhatsapp className="text-2xl text-[#25d366]" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-white">WhatsApp</h3>
              <p className="text-xs text-[#999]">Sign in once with the QR code; it stays signed in.</p>
            </div>
          </div>
        )}
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            open ? "bg-[#1f3f28] text-[#02ca3a]" : "bg-[#333] text-[#aaa]"
          }`}
          aria-live="polite"
        >
          {open ? "Window open" : "Not open"}
        </span>
      </div>

      <div
        ref={anchor}
        className="flex h-[480px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#3d5a47] bg-[#1c2620] p-4 text-center sm:h-[560px]"
      >
        <FaWhatsapp className="text-5xl text-[#25d366]/70" aria-hidden="true" />
        <p className="max-w-xs text-sm text-[#c9d8cf]">
          {open
            ? "WhatsApp is open over this box. If it slips behind the POS, press Bring to front."
            : "WhatsApp opens in a window placed right here, not full screen."}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {!open ? (
            <button
              type="button"
              onClick={dock}
              className="rounded-lg bg-[#25d366] px-4 py-2 text-sm font-semibold text-[#11251a] hover:bg-[#32e174]"
            >
              Open WhatsApp
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={bringToFront}
                className="rounded-lg bg-[#25d366] px-4 py-2 text-sm font-semibold text-[#11251a] hover:bg-[#32e174]"
              >
                Bring to front
              </button>
              <button
                type="button"
                onClick={redock}
                className="rounded-lg bg-[#353535] px-4 py-2 text-sm font-semibold text-white hover:bg-[#444]"
              >
                Re-dock here
              </button>
              <button
                type="button"
                onClick={() => { closeWhatsAppWindow(); setOpen(false); }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#bbb] hover:bg-[#333]"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={openChat} className="flex flex-wrap gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Customer number</span>
          <input
            type="tel"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="Open a chat by number, e.g. 0301 2345678"
            className="w-full rounded border border-[#444] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-[#777]"
          />
        </label>
        <button type="submit" className="rounded bg-[#353535] px-4 py-2 text-sm font-semibold text-white hover:bg-[#444]">
          Open chat
        </button>
      </form>
      {numberError && <p className="text-sm text-red-300" role="alert">{numberError}</p>}
      <p className="text-xs text-[#888]">
        WhatsApp does not allow itself to be shown inside another page, so it opens as its own window. Keep pop-ups allowed for this site.
      </p>
    </Wrapper>
  );
};

WhatsAppDock.propTypes = {
  dockRef: PropTypes.shape({ current: PropTypes.any }),
  embedded: PropTypes.bool,
};

export default WhatsAppDock;
