// WhatsApp Web helpers for the POS.
//
// WhatsApp Web refuses to load inside another page (it sends headers that
// block framing), so it cannot be embedded in a panel. The closest thing is
// a small separate window placed exactly over the panel's dock area. One
// named window is reused, so every coupon goes to the same signed-in chat
// window instead of piling up tabs.

const WHATSAPP_WEB = "https://web.whatsapp.com/";
const WINDOW_NAME = "genz-whatsapp-web";
const DEFAULT_COUNTRY_CODE = "92";
const MIN_WIDTH = 480;
const MIN_HEIGHT = 480;

let whatsAppWindow = null;

// "0301 3310954", "+92 301 3310954" and "00923013310954" all become
// "923013310954". Returns "" when it does not look like a phone number.
export const toWhatsAppNumber = (value, countryCode = DEFAULT_COUNTRY_CODE) => {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith(countryCode)) {
    const national = digits.slice(countryCode.length);
    if (national.startsWith("0")) digits = `${countryCode}${national.slice(1)}`;
  } else if (digits.startsWith("0")) {
    digits = `${countryCode}${digits.slice(1)}`;
  } else if (digits.length === 10 && digits.startsWith("3")) {
    digits = `${countryCode}${digits}`;
  }
  return /^\d{10,15}$/.test(digits) ? digits : "";
};

// Opens the chat with this number in WhatsApp Web, optionally with the
// message already typed in (staff still press send themselves).
export const whatsAppChatUrl = (phone, text = "") => {
  const number = toWhatsAppNumber(phone);
  if (!number) return WHATSAPP_WEB;
  const query = new URLSearchParams({ phone: number });
  if (text) query.set("text", text);
  return `${WHATSAPP_WEB}send?${query.toString()}`;
};

export const isWhatsAppWindowOpen = () => Boolean(whatsAppWindow && !whatsAppWindow.closed);

const dockFeatures = (anchor) => {
  const rect = anchor?.getBoundingClientRect?.();
  const availWidth = window.screen?.availWidth || window.outerWidth;
  const availHeight = window.screen?.availHeight || window.outerHeight;
  // On a second monitor the usable area does not start at 0,0.
  const availLeft = window.screen?.availLeft ?? 0;
  const availTop = window.screen?.availTop ?? 0;
  const width = Math.min(availWidth, Math.max(MIN_WIDTH, Math.round(rect?.width || 640)));
  const height = Math.min(availHeight, Math.max(MIN_HEIGHT, Math.round(rect?.height || 640)));
  // Window chrome: browsers report outer vs inner size, which gives the
  // space taken by the side borders and the tab/address bar.
  const sideBorder = Math.max(0, (window.outerWidth - window.innerWidth) / 2);
  const topChrome = Math.max(0, window.outerHeight - window.innerHeight - sideBorder);
  const left = Math.round(window.screenX + sideBorder + (rect?.left ?? 80));
  const top = Math.round(window.screenY + topChrome + (rect?.top ?? 80));
  const clampedLeft = Math.max(availLeft, Math.min(left, availLeft + availWidth - width));
  const clampedTop = Math.max(availTop, Math.min(top, availTop + availHeight - height));
  return `popup=yes,resizable=yes,scrollbars=yes,width=${width},height=${height},left=${clampedLeft},top=${clampedTop}`;
};

// A window that is already showing WhatsApp is on another site, so reading
// its address throws; a brand-new blank window is still ours and readable.
const isFreshBlankWindow = (win) => {
  try {
    return win.location.href === "about:blank";
  } catch {
    return false;
  }
};

// Must be called straight from a click so the browser does not block it.
// Returns { win, reused } or null when the browser blocked the window.
//
// The window has a fixed name, so even after the POS page is refreshed (which
// forgets our handle) asking for that name finds the WhatsApp window that is
// already open instead of making a second one. The window is deliberately
// not cut off from the POS (no opener = null): that would stop the name
// lookup from finding it again. It only ever shows web.whatsapp.com.
export const openWhatsAppWindow = (anchor, url = "", { blank = false } = {}) => {
  if (isWhatsAppWindowOpen()) {
    if (url) whatsAppWindow.location.href = url;
    whatsAppWindow.focus();
    return { win: whatsAppWindow, reused: true };
  }
  // Empty address: only find an existing window by name, never reload it.
  const win = window.open("", WINDOW_NAME, dockFeatures(anchor));
  if (!win) return null;
  const reused = !isFreshBlankWindow(win);
  whatsAppWindow = win;
  if (!reused) {
    // blank: the caller loads the chat itself a moment later, so do not
    // load WhatsApp twice.
    if (!blank || url) win.location.href = url || WHATSAPP_WEB;
  } else if (url) {
    win.location.href = url;
  }
  win.focus();
  return { win, reused };
};

// For "press Send, then wait for the server": the window has to be opened
// inside the click, but the chat link is only known a moment later. A new
// window opens blank so WhatsApp Web loads once, straight into the chat; a
// window that is already open is just brought forward and left alone.
export const prepareWhatsAppWindow = (anchor) => openWhatsAppWindow(anchor, "", { blank: true });

export const navigateWhatsAppWindow = (url) => {
  if (!isWhatsAppWindowOpen()) return false;
  whatsAppWindow.location.href = url;
  whatsAppWindow.focus();
  return true;
};

// The window sits behind the POS once staff click back into it; this brings
// it forward again without reloading WhatsApp.
export const focusWhatsAppWindow = () => {
  if (!isWhatsAppWindowOpen()) return false;
  whatsAppWindow.focus();
  return true;
};

export const closeWhatsAppWindow = () => {
  if (isWhatsAppWindowOpen()) whatsAppWindow.close();
  whatsAppWindow = null;
};
