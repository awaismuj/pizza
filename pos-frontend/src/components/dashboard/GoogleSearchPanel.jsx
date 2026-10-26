import { useEffect, useState } from "react";
import { FaSearch, FaWhatsapp } from "react-icons/fa";
import WhatsAppDock from "./WhatsAppDock";

const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID?.trim() || "";
const GOOGLE_CSE_SCRIPT_ID = "genz-google-cse-script";
const GOOGLE_CSE_NAME = "genz-coupon-search";
const GOOGLE_CSE_SEARCHBOX_ID = "genz-google-cse-searchbox";
const GOOGLE_CSE_RESULTS_ID = "genz-google-cse-results";

const renderSearchElements = () => {
  const searchElement = window.google?.search?.cse?.element;
  if (typeof searchElement?.render !== "function") return false;

  searchElement.render({
    div: GOOGLE_CSE_SEARCHBOX_ID,
    tag: "searchbox",
    attributes: { gname: GOOGLE_CSE_NAME },
  });
  searchElement.render({
    div: GOOGLE_CSE_RESULTS_ID,
    tag: "searchresults",
    attributes: { gname: GOOGLE_CSE_NAME },
  });
  return true;
};

const GoogleSearchPanel = () => {
  const [scriptError, setScriptError] = useState(false);
  // Both views stay mounted and the other one is only hidden, so Google's
  // search box is not torn down and WhatsApp keeps its place.
  const [tab, setTab] = useState("google");

  useEffect(() => {
    if (!GOOGLE_CSE_ID) return;

    const existingScript = document.getElementById(GOOGLE_CSE_SCRIPT_ID);
    if (existingScript) {
      if (existingScript.dataset.failed === "true") {
        setScriptError(true);
        return;
      }
      if (existingScript.dataset.loaded === "true") {
        if (!renderSearchElements()) setScriptError(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_CSE_SCRIPT_ID;
    script.async = true;
    script.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(GOOGLE_CSE_ID)}`;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
    }, { once: true });
    script.addEventListener("error", () => {
      script.dataset.failed = "true";
      setScriptError(true);
    }, { once: true });
    document.head.appendChild(script);
  }, []);

  return (
    <section className="space-y-3 rounded border border-[#333] bg-[#202020] p-4" aria-label="Search and WhatsApp">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">Search &amp; WhatsApp</h3>
          <p className="mt-1 text-xs text-[#999]">
            {tab === "google"
              ? "Search the web here. Search terms are sent directly to Google."
              : "WhatsApp opens in a window placed over the box below, not full screen."}
          </p>
        </div>
        <div className="flex shrink-0 rounded border border-[#444] p-1" role="tablist" aria-label="Search or WhatsApp">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "google"}
            onClick={() => setTab("google")}
            className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold ${tab === "google" ? "bg-[#383838] text-white" : "text-[#aaa] hover:text-white"}`}
          >
            <FaSearch aria-hidden="true" />
            Google
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "whatsapp"}
            onClick={() => setTab("whatsapp")}
            className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold ${tab === "whatsapp" ? "bg-[#25d366] text-[#11251a]" : "text-[#aaa] hover:text-white"}`}
          >
            <FaWhatsapp aria-hidden="true" />
            WhatsApp
          </button>
        </div>
      </div>

      <div className={tab === "google" ? "" : "hidden"}>
        {!GOOGLE_CSE_ID ? (
          <p className="rounded border border-amber-800 bg-amber-950/30 p-3 text-sm text-amber-100">
            Configure <code>VITE_GOOGLE_CSE_ID</code> with your Google Programmable Search Engine ID, then rebuild the POS frontend to enable search.
          </p>
        ) : scriptError ? (
          <p className="rounded border border-red-900 bg-red-950/40 p-3 text-sm text-red-200" role="alert">
            Google Search could not load. Check your connection and Programmable Search Engine ID.
          </p>
        ) : (
          <div className="space-y-2 rounded bg-white p-3 text-[#202124]">
            <div id={GOOGLE_CSE_SEARCHBOX_ID} className="gcse-searchbox" data-gname={GOOGLE_CSE_NAME} />
            <div className="max-h-[360px] min-h-24 overflow-y-auto border-t border-[#ddd] pt-2">
              <div id={GOOGLE_CSE_RESULTS_ID} className="gcse-searchresults" data-gname={GOOGLE_CSE_NAME} />
            </div>
          </div>
        )}
      </div>

      <div className={tab === "whatsapp" ? "" : "hidden"}>
        <WhatsAppDock embedded />
      </div>
    </section>
  );
};

export default GoogleSearchPanel;
