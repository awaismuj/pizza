// Shared thermal-printer helper for every slip this POS prints
// (final invoice, pending receipt, kitchen order slip).
//
// Target: 80 mm (3 inch) thermal roll, e.g. the 88AC POS receipt printer.
// An 80 mm roll has ~72 mm of real printable width, so everything is
// forced into 72 mm and centred on the 80 mm page. Content that is too
// long wraps instead of being cut off, and the page height is "auto" so
// the paper length follows the receipt (no blank A4 sheet / wasted roll).
//
// It prints through a hidden iframe instead of window.open(), so there is
// no popup-blocker problem and no stray window left on screen.

const THERMAL_CSS = `
  @page { size: 80mm auto; margin: 0; }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    width: 80mm;
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    line-height: 1.35;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .thermal-receipt {
    width: 72mm;
    max-width: 72mm;
    margin: 0 auto;
    padding: 2mm 0 6mm;
    overflow: hidden;
  }
  .thermal-receipt, .thermal-receipt * {
    box-sizing: border-box;
    max-width: 100%;
    color: #000 !important;
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  .thermal-receipt .p-4, .thermal-receipt .px-4, .thermal-receipt .py-4 { padding: 0 !important; }
  .thermal-receipt img { max-width: 100%; height: auto; }
  .thermal-receipt h2 { font-size: 16px !important; margin: 2px 0 !important; }
  .thermal-receipt h3 { font-size: 13px !important; }
  .thermal-receipt ul { list-style: none; margin: 0; padding: 0; }
  .thermal-receipt li { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; }
  .thermal-receipt li > span:first-child { flex: 1 1 auto; min-width: 0; }
  .thermal-receipt li > span:last-child { flex: 0 0 auto; white-space: nowrap; text-align: right; }
  .thermal-receipt .border-t { border-top: 1px dashed #000 !important; }
  .thermal-receipt .no-print { display: none !important; }
  .thermal-receipt p { margin: 1px 0; }
  .thermal-receipt { page-break-inside: avoid; }
`;

const waitFor = (doc) => {
  const pending = [];
  doc.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      pending.push(new Promise((r) => { img.onload = r; img.onerror = r; }));
    }
  });
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
    pending.push(new Promise((r) => { l.onload = r; l.onerror = r; }));
  });
  // Never hang the print forever if something fails to load.
  const timeout = new Promise((r) => setTimeout(r, 2500));
  return Promise.race([Promise.all(pending), timeout]);
};

export function printReceipt(innerHtml, title = "Receipt") {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = win.document;

  // Reuse the app's own (Tailwind) styles so the receipt looks the same as
  // on screen, then apply the 80 mm overrides on top.
  const appStyles = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((n) => n.outerHTML)
    .join("");

  doc.open();
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>` +
      appStyles +
      `<style>${THERMAL_CSS}</style></head><body><div class="thermal-receipt">${innerHtml}</div></body></html>`
  );
  doc.close();

  const cleanup = () => {
    setTimeout(() => iframe.parentNode && iframe.parentNode.removeChild(iframe), 500);
  };

  waitFor(doc).then(() => {
    try {
      win.focus();
      win.onafterprint = cleanup;
      win.print();
    } finally {
      // Fallback in case afterprint never fires.
      setTimeout(cleanup, 60000);
    }
  });
}

export default printReceipt;
