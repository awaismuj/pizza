import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getSettings, updateSettings } from "../../https";
import { FoodIcon } from "../shared/AppIcons";

import { MdLocalPizza, MdLunchDining, MdLocalFireDepartment } from "react-icons/md";

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
  { field: "discount3", title: "3 items", hint: "Minimum to unlock the deal", icon: "pizza" },
  { field: "discount4", title: "4 items", hint: "Exactly four items", icon: "burger" },
  { field: "discount5Plus", title: "5+ items", hint: "Five or more items", icon: "flame" },
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
    <div className="mx-auto w-full px-6 pb-10">
      <div className="max-w-2xl bg-[#262626] rounded-lg p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg sm:text-xl font-bold tracking-tight">Build Your Own Deal</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Customers pick any <b className="text-slate-800 dark:text-slate-200">{live.minItems}+ items</b> from the menu and save
              more the more they add. Set the discount for each size below.
            </p>
          </div>

          {/* On / off switch */}
          <button
            type="button"
            role="switch"
            aria-checked={draft.enabled}
            onClick={() => setField("enabled", !draft.enabled)}
            className={`shrink-0 relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors ${
              draft.enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
            title={draft.enabled ? "Switched on — tap to turn off" : "Switched off — tap to turn on"}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm transition-transform ${
                draft.enabled ? "translate-x-6 sm:translate-x-7" : ""
              }`}
            />
          </button>
        </div>

        <p className={`text-xs mb-5 font-semibold ${draft.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
          {draft.enabled
            ? "● ACTIVE — Visible and usable by customers on the online store."
            : "○ INACTIVE — Deal is hidden and discounts are disabled."}
        </p>

        {isLoading ? (
          <p className="text-slate-400 text-sm">Loading current discounts…</p>
        ) : (
          <>
            <div className="mb-5">
              <label htmlFor="byo-description" className="block text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider mb-2">
                Storefront description
              </label>
              <textarea
                id="byo-description"
                maxLength={300}
                rows={3}
                value={draft.description}
                onChange={(e) => setField("description", e.target.value)}
                aria-describedby="byo-description-help"
                className="w-full resize-y rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2.5 text-slate-900 dark:text-white text-sm outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
              <p id="byo-description-help" className="text-slate-400 text-xs mt-1">
                Shown below the Build Your Own Deal heading on the online store. {draft.description.length}/300
                characters.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIERS.map((t) => {
                const ok = validPercent(draft[t.field]);
                const IconComponent = t.icon;
                return (
                  <div
                    key={t.field}
                    className={`rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border transition ${
                      ok ? "border-slate-200 dark:border-slate-700/80 focus-within:border-amber-500" : "border-rose-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl" aria-hidden="true"><FoodIcon icon={t.icon} /></span>
                      <span className="text-[#f5f5f5] font-semibold">{t.title}</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-3">{t.hint}</p>
                    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 shadow-xs">
                      <input
                        type="number"
                        min="0"
                        max="90"
                        step="0.5"
                        inputMode="decimal"
                        value={draft[t.field]}
                        onChange={(e) => setField(t.field, e.target.value)}
                        aria-label={`Discount percent for ${t.title}`}
                        className="flex-1 min-w-0 bg-transparent text-slate-900 dark:text-white text-lg font-black outline-none"
                      />
                      <span className="text-slate-400 font-bold">%</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-2">
                      Live now: <span className="text-slate-700 dark:text-slate-200 font-bold">{live[t.field]}%</span>
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <p className="text-amber-800 dark:text-amber-400 font-bold mb-1">Quick sanity check</p>
              A customer who builds a deal of {exampleItems} items worth Rs {exampleBase.toLocaleString()} gets{" "}
              <b className="text-amber-600 dark:text-amber-400">{examplePct}% off</b> — they save{" "}
              <b className="text-slate-900 dark:text-white">Rs {exampleSaved.toLocaleString()}</b> and pay{" "}
              <b className="text-slate-900 dark:text-white">Rs {(exampleBase - exampleSaved).toLocaleString()}</b> before tax.
            </div>

            <button
              onClick={handleSave}
              disabled={!allValid || unchanged || saveMutation.isPending}
              className="w-full sm:w-auto mt-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl px-7 py-3 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
            >
              {saveMutation.isPending ? "Saving Changes…" : "Save Changes"}
            </button>
            <p className="text-slate-400 text-xs mt-2.5">
              Changes apply immediately to next orders.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BuildYourOwnManager;
