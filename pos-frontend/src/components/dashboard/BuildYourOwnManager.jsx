import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getSettings, updateSettings } from "../../https";

// Dashboard > Build Your Own.
//
// The customer builds their own deal on the online store: pick at least 3
// items, and the more they pick the more they save. The three percentages
// below are the ONLY place those numbers live - the store reads them live,
// and the server re-checks them on every order, so changing a number here
// takes effect on the very next order without a redeploy.

const DEFAULTS = {
  enabled: true,
  minItems: 3,
  discount3: 15,
  discount4: 17,
  discount5Plus: 20,
  description:
    "Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically.",
};

const TIERS = [
  { field: "discount3", title: "3 items", hint: "Minimum to unlock the deal", icon: "🍕" },
  { field: "discount4", title: "4 items", hint: "Exactly four items", icon: "🍔" },
  { field: "discount5Plus", title: "5+ items", hint: "Five or more items", icon: "🔥" },
];

const toDraft = (cfg) => ({
  enabled: cfg.enabled,
  discount3: String(cfg.discount3),
  discount4: String(cfg.discount4),
  discount5Plus: String(cfg.discount5Plus),
  description: cfg.description,
});

const validPercent = (v) => {
  if (String(v).trim() === "") return false;
  const n = Number(v);
  return !Number.isNaN(n) && n >= 0 && n <= 90;
};

const BuildYourOwnManager = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  const live = useMemo(
    () => ({ ...DEFAULTS, ...(data?.data?.data?.buildYourOwnDeal || {}) }),
    [data]
  );
  const loaded = Boolean(data?.data?.data);

  const [draft, setDraft] = useState(toDraft(DEFAULTS));

  // Only reset the draft when the SAVED values change (first load / after a
  // save) - not on every background refetch, which would wipe what's being typed.
  useEffect(() => {
    if (loaded) setDraft(toDraft(live));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, live.enabled, live.discount3, live.discount4, live.discount5Plus, live.description]);

  const saveMutation = useMutation({
    mutationFn: (payload) => updateSettings({ buildYourOwnDeal: payload }),
    onSuccess: (resData) => {
      enqueueSnackbar("Build Your Own Deal saved — live on the store now.", { variant: "success" });
      queryClient.setQueryData(["settings"], (old) => ({
        ...old,
        data: { ...old?.data, data: resData?.data?.data },
      }));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to save.", { variant: "error" });
    },
  });

  const allValid = TIERS.every((t) => validPercent(draft[t.field]));
  const unchanged =
    draft.enabled === live.enabled &&
    TIERS.every((t) => Number(draft[t.field]) === live[t.field]) &&
    draft.description === live.description;

  const handleSave = () => {
    if (!allValid) {
      enqueueSnackbar("Each discount must be a number from 0 to 90.", { variant: "warning" });
      return;
    }
    saveMutation.mutate({
      enabled: draft.enabled,
      discount3: Number(draft.discount3),
      discount4: Number(draft.discount4),
      discount5Plus: Number(draft.discount5Plus),
      description: draft.description,
    });
  };

  const setField = (field, value) => setDraft((d) => ({ ...d, [field]: value }));

  // Example the admin can sanity-check against: 4 items worth Rs 2,000.
  const exampleItems = 4;
  const examplePct = validPercent(draft.discount4) ? Number(draft.discount4) : 0;
  const exampleBase = 2000;
  const exampleSaved = Math.round((exampleBase * examplePct) / 100);

  return (
    <div className="container mx-auto px-6 pb-10">
      <div className="max-w-2xl bg-[#262626] rounded-lg p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h3 className="text-[#f5f5f5] text-xl font-semibold">Build Your Own Deal</h3>
            <p className="text-[#ababab] text-sm mt-1">
              Customers pick any <b className="text-[#f5f5f5]">{live.minItems}+ items</b> from the menu and save
              more the more they add. Set the discount for each size below.
            </p>
          </div>

          {/* On / off switch */}
          <button
            type="button"
            role="switch"
            aria-checked={draft.enabled}
            onClick={() => setField("enabled", !draft.enabled)}
            className={`shrink-0 relative w-14 h-8 rounded-full transition-colors ${
              draft.enabled ? "bg-[#02ca3a]" : "bg-[#444]"
            }`}
            title={draft.enabled ? "Switched on — tap to turn off" : "Switched off — tap to turn on"}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                draft.enabled ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <p className={`text-xs mb-5 ${draft.enabled ? "text-[#02ca3a]" : "text-[#f6b100]"}`}>
          {draft.enabled
            ? "ON — the “Build your own deal” section is visible on the online store."
            : "OFF — the section is hidden and the discount is not given."}
        </p>

        {isLoading ? (
          <p className="text-[#ababab]">Loading current discounts…</p>
        ) : (
          <>
            <div className="mb-5">
              <label htmlFor="byo-description" className="block text-[#f5f5f5] font-semibold mb-2">
                Storefront description
              </label>
              <textarea
                id="byo-description"
                maxLength={300}
                rows={3}
                value={draft.description}
                onChange={(e) => setField("description", e.target.value)}
                aria-describedby="byo-description-help"
                className="w-full resize-y rounded-lg border border-[#444] bg-[#1a1a1a] px-3 py-2 text-white outline-none focus:border-[#F6B100]"
              />
              <p id="byo-description-help" className="text-[#7a7a7a] text-xs mt-1">
                Shown below the Build Your Own Deal heading on the online store. {draft.description.length}/300
                characters.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIERS.map((t) => {
                const ok = validPercent(draft[t.field]);
                return (
                  <div
                    key={t.field}
                    className={`rounded-lg bg-[#1a1a1a] p-4 border ${
                      ok ? "border-[#333] focus-within:border-[#F6B100]" : "border-[#be3e3f]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl" aria-hidden="true">{t.icon}</span>
                      <span className="text-[#f5f5f5] font-semibold">{t.title}</span>
                    </div>
                    <p className="text-[#7a7a7a] text-xs mb-3">{t.hint}</p>
                    <div className="flex items-center gap-2 rounded-lg bg-[#262626] px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        step="0.5"
                        inputMode="decimal"
                        value={draft[t.field]}
                        onChange={(e) => setField(t.field, e.target.value)}
                        aria-label={`Discount percent for ${t.title}`}
                        className="flex-1 min-w-0 bg-transparent text-white text-xl font-semibold outline-none"
                      />
                      <span className="text-[#ababab] font-semibold">%</span>
                    </div>
                    <p className="text-[#7a7a7a] text-xs mt-2">
                      Live now: <span className="text-[#f5f5f5]">{live[t.field]}%</span>
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg bg-[#1a1a1a] border border-dashed border-[#444] p-4 text-sm text-[#ababab]">
              <p className="text-[#f5f5f5] font-medium mb-1">Quick check</p>
              A customer who builds a deal of {exampleItems} items worth Rs {exampleBase.toLocaleString()} gets{" "}
              <b className="text-[#F6B100]">{examplePct}% off</b> — they save{" "}
              <b className="text-[#f5f5f5]">Rs {exampleSaved.toLocaleString()}</b> and pay{" "}
              <b className="text-[#f5f5f5]">Rs {(exampleBase - exampleSaved).toLocaleString()}</b> before tax.
            </div>

            <button
              onClick={handleSave}
              disabled={!allValid || unchanged || saveMutation.isPending}
              className="w-full sm:w-auto mt-6 bg-[#F6B100] text-[#1f1f1f] font-semibold rounded-lg px-8 py-3 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveMutation.isPending ? "Saving…" : "Save changes"}
            </button>
            <p className="text-[#7a7a7a] text-xs mt-3">
              Changes apply to the next order. The discount is worked out on the server, so it can't be edited by customers.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BuildYourOwnManager;
