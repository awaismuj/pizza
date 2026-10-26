import { useEffect, useState } from "react";

const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID?.trim() || "";
const GOOGLE_CSE_SCRIPT_ID = "genz-google-cse-script";
const GOOGLE_CSE_RESULTS_ID = "genz-google-cse-results";

const GoogleSearchPanel = () => {
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CSE_ID) return;

    const existingScript = document.getElementById(GOOGLE_CSE_SCRIPT_ID);
    if (existingScript) {
      if (existingScript.dataset.failed === "true") {
        setScriptError(true);
        return;
      }
      if (existingScript.dataset.loaded === "true") {
        const searchElement = window.google?.search?.cse?.element;
        if (typeof searchElement?.render === "function") {
          searchElement.render({
            div: GOOGLE_CSE_RESULTS_ID,
            tag: "search",
          });
        } else {
          setScriptError(true);
        }
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
    <section className="space-y-3 rounded border border-[#333] bg-[#202020] p-4" aria-label="Google Search">
      <div>
        <h3 className="font-semibold text-white">Google Search</h3>
        <p className="mt-1 text-xs text-[#999]">Search the web here. Search terms are sent directly to Google.</p>
      </div>
      {!GOOGLE_CSE_ID ? (
        <p className="rounded border border-amber-800 bg-amber-950/30 p-3 text-sm text-amber-100">
          Configure <code>VITE_GOOGLE_CSE_ID</code> with your Google Programmable Search Engine ID, then rebuild the POS frontend to enable search.
        </p>
      ) : scriptError ? (
        <p className="rounded border border-red-900 bg-red-950/40 p-3 text-sm text-red-200" role="alert">
          Google Search could not load. Check your connection and Programmable Search Engine ID.
        </p>
      ) : (
        <div className="max-h-[420px] min-h-36 overflow-y-auto rounded bg-white p-3 text-[#202124]">
          <div id={GOOGLE_CSE_RESULTS_ID} className="gcse-search" />
        </div>
      )}
    </section>
  );
};

export default GoogleSearchPanel;
