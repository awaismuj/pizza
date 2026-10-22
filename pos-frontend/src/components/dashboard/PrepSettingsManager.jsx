import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getPrepReport, getSettings, updateSettings } from "../../https";
import { DEFAULT_PREP_SETTINGS, withPrepDefaults } from "../../utils/prepTimer";
import PrepAlertCard, { ALERT_STYLE } from "../prep/PrepAlertCard";

const LEVELS = [
  { key: "warn1", label: "First warning" },
  { key: "warn2", label: "Second warning" },
  { key: "warn3", label: "Final warning" },
];

const Toggle = ({ checked, onChange, label, hint }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-[#1a1a1a] px-4 py-3">
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-[#f5f5f5]">{label}</span>
      {hint && <span className="block text-xs text-[#8a8a8a]">{hint}</span>}
    </span>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
    <span className="relative h-6 w-11 shrink-0 rounded-full bg-[#3a3a3a] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-[#02ca3a] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#f6b100]" />
  </label>
);

const Stat = ({ label, value, sub }) => (
  <div className="rounded-xl bg-[#1a1a1a] p-3">
    <p className="text-[11px] uppercase tracking-wider text-[#8a8a8a]">{label}</p>
    <p className="mt-1 text-xl font-bold tabular-nums text-[#f5f5f5]">{value}</p>
    {sub && <p className="text-[11px] text-[#7a7a7a]">{sub}</p>}
  </div>
);

const fmt = (v, suffix = "") => (v === null || v === undefined ? "—" : `${v}${suffix}`);

// Fake order used only by the on-screen mascot preview (never saved).
const sampleOrder = (level) => {
  const mins = { warn1: 10, warn2: 5, warn3: 2, overdue: -1 }[level];
  const deadline = new Date(Date.now() + mins * 60 * 1000 - 5000).toISOString();
  return {
    _id: "preview",
    orderNumber: "1051",
    orderStatus: "Preparing",
    orderDate: new Date().toISOString(),
    prep: { startedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), deadline },
  };
};

// Dashboard > Order Prep (Admin). Default prep time, alert thresholds, mascot
// & sound switches, a live mascot preview, and the performance report.
const PrepSettingsManager = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const saved = useMemo(() => withPrepDefaults(data?.data?.data?.orderPrep), [data]);
  const [draft, setDraft] = useState(DEFAULT_PREP_SETTINGS);
  const [previewLevel, setPreviewLevel] = useState(null);
  const [previewSound, setPreviewSound] = useState(false);

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const save = useMutation({
    mutationFn: (orderPrep) => updateSettings({ orderPrep }),
    onSuccess: (res) => {
      enqueueSnackbar("Order preparation settings saved. Orders already in progress keep their current deadlines.", { variant: "success" });
      queryClient.setQueryData(["settings"], (old) => ({ ...old, data: { ...old?.data, data: res?.data?.data } }));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Couldn't save settings.", { variant: "error" }),
  });

  const patchAlert = (key, patch) => setDraft((d) => ({ ...d, alerts: { ...d.alerts, [key]: { ...d.alerts[key], ...patch } } }));
  const minutes = Number(draft.defaultMinutes);
  const w = [draft.alerts.warn1.minutes, draft.alerts.warn2.minutes, draft.alerts.warn3.minutes].map(Number);
  const orderOk = w[0] > w[1] && w[1] > w[2] && w.every((n) => Number.isInteger(n) && n >= 1 && n <= 120);
  const valid = Number.isInteger(minutes) && minutes >= 1 && minutes <= 240 && orderOk;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // Report (last 30 days by default)
  const [range, setRange] = useState(() => {
    const to = new Date();
    const from = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000);
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { from: iso(from), to: iso(to) };
  });
  const { data: reportRes, isLoading: reportLoading } = useQuery({
    queryKey: ["prepReport", range.from, range.to],
    queryFn: () => getPrepReport(range),
  });
  const report = reportRes?.data?.data;

  return (
    <div className="mx-auto w-full space-y-6 px-6 pb-6">
      <div className="max-w-3xl rounded-lg bg-[#262626] p-5 sm:p-6">
        <h3 className="mb-1 text-xl font-semibold text-[#f5f5f5]">⚙️ Order Preparation Settings</h3>
        <p className="mb-5 text-sm text-[#ababab]">
          Every new order — POS or online store — gets a countdown from this default. Changing it never alters the deadlines of orders already in progress.
        </p>

        {isLoading ? (
          <p className="text-[#ababab]">Loading…</p>
        ) : (
          <div className="space-y-4">
            <Toggle checked={draft.enabled} onChange={(v) => setDraft({ ...draft, enabled: v })} label="Preparation countdowns" hint="Off = new orders get no timer (existing timers keep running)." />

            <div className="rounded-xl bg-[#1a1a1a] px-4 py-3">
              <label htmlFor="prep-default" className="block text-sm font-semibold text-[#f5f5f5]">Default preparation time</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="prep-default"
                  type="number"
                  min={1}
                  max={240}
                  value={draft.defaultMinutes}
                  onChange={(e) => setDraft({ ...draft, defaultMinutes: e.target.value })}
                  className="w-28 rounded-lg border border-[#333] bg-[#262626] px-3 py-2 text-[#f5f5f5] outline-none focus:border-[#f6b100]"
                />
                <span className="text-sm text-[#ababab]">minutes (1–240)</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#1a1a1a] px-4 py-3">
              <p className="text-sm font-semibold text-[#f5f5f5]">Alert settings</p>
              <p className="mb-3 text-xs text-[#8a8a8a]">Minutes remaining when each warning appears (earliest to latest).</p>
              <div className="space-y-2">
                {LEVELS.map(({ key, label }) => (
                  <div key={key} className="flex flex-wrap items-center gap-3 rounded-lg bg-[#232323] px-3 py-2">
                    <input type="checkbox" checked={draft.alerts[key].enabled} onChange={(e) => patchAlert(key, { enabled: e.target.checked })} aria-label={`${label} enabled`} className="h-4 w-4 accent-[#02ca3a]" />
                    <span className="min-w-[110px] text-sm text-[#f5f5f5]">{label}</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={draft.alerts[key].minutes}
                      onChange={(e) => patchAlert(key, { minutes: e.target.value })}
                      aria-label={`${label} minutes`}
                      className="w-20 rounded-lg border border-[#333] bg-[#262626] px-2 py-1.5 text-[#f5f5f5] outline-none focus:border-[#f6b100]"
                    />
                    <span className="text-xs text-[#8a8a8a]">min left · {draft.alerts[key].enabled ? "Enabled" : "Disabled"}</span>
                  </div>
                ))}
                <div className="flex flex-wrap items-center gap-3 rounded-lg bg-[#232323] px-3 py-2">
                  <input type="checkbox" checked={draft.alerts.overdue.enabled} onChange={(e) => patchAlert("overdue", { enabled: e.target.checked })} aria-label="Overdue warning enabled" className="h-4 w-4 accent-[#02ca3a]" />
                  <span className="min-w-[110px] text-sm text-[#f5f5f5]">Overdue warning</span>
                  <span className="text-xs text-[#8a8a8a]">when the deadline passes · {draft.alerts.overdue.enabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              {!orderOk && <p className="mt-2 text-xs text-[#f87171]">Warning times must be whole minutes that go from earliest to latest (e.g. 10, 5, 2).</p>}
            </div>

            <Toggle checked={draft.mascotEnabled} onChange={(v) => setDraft({ ...draft, mascotEnabled: v })} label="Mascot popups" hint="Chef Pep pops up with a friendly reminder." />
            <Toggle checked={draft.soundEnabled} onChange={(v) => setDraft({ ...draft, soundEnabled: v })} label="Notification sounds" hint="Staff can still mute sound on their own screen." />

            <div className="rounded-xl bg-[#1a1a1a] px-4 py-3">
              <label htmlFor="prep-tz" className="block text-sm font-semibold text-[#f5f5f5]">Restaurant timezone</label>
              <input
                id="prep-tz"
                type="text"
                value={draft.timezone}
                onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                className="mt-2 w-64 rounded-lg border border-[#333] bg-[#262626] px-3 py-2 text-[#f5f5f5] outline-none focus:border-[#f6b100]"
              />
              <p className="mt-1 text-xs text-[#8a8a8a]">Deadlines are stored in UTC and shown in this timezone (e.g. Asia/Karachi).</p>
            </div>

            <button
              type="button"
              onClick={() => save.mutate({ ...draft, defaultMinutes: minutes, alerts: { warn1: { ...draft.alerts.warn1, minutes: w[0] }, warn2: { ...draft.alerts.warn2, minutes: w[1] }, warn3: { ...draft.alerts.warn3, minutes: w[2] }, overdue: draft.alerts.overdue } })}
              disabled={!valid || !dirty || save.isPending}
              className="w-full rounded-xl bg-[#f6b100] py-3 font-bold text-[#1f1f1f] disabled:opacity-50 sm:w-auto sm:px-8"
            >
              {save.isPending ? "Saving…" : "Save Settings"}
            </button>
          </div>
        )}
      </div>

      <div className="max-w-3xl rounded-lg bg-[#262626] p-5 sm:p-6">
        <h3 className="mb-1 text-xl font-semibold text-[#f5f5f5]">🐣 Preview Chef Pep alerts</h3>
        <p className="mb-4 text-sm text-[#ababab]">Just a preview on this screen — no order is touched and nothing is sent to other terminals.</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ALERT_STYLE).map(([key, st]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPreviewLevel(key)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${previewLevel === key ? "bg-white/10" : "bg-transparent"}`}
              style={{ borderColor: `${st.accent}88`, color: st.accent }}
            >
              {st.chip}
            </button>
          ))}
        </div>
        {previewLevel && (
          <div className="mt-4 max-w-md">
            <PrepAlertCard
              key={previewLevel}
              preview
              level={previewLevel}
              order={sampleOrder(previewLevel)}
              soundOn={previewSound}
              onToggleSound={() => setPreviewSound((v) => !v)}
              onClose={() => setPreviewLevel(null)}
            />
          </div>
        )}
      </div>

      <div className="max-w-3xl rounded-lg bg-[#262626] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#f5f5f5]">📊 Preparation performance</h3>
            <p className="text-sm text-[#ababab]">Real recorded data only — older orders without a timer aren't counted.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#ababab]">
            <input type="date" value={range.from} max={range.to} onChange={(e) => setRange({ ...range, from: e.target.value })} aria-label="From date" className="rounded-lg border border-[#333] bg-[#1a1a1a] px-2 py-1.5 text-[#f5f5f5]" />
            to
            <input type="date" value={range.to} min={range.from} onChange={(e) => setRange({ ...range, to: e.target.value })} aria-label="To date" className="rounded-lg border border-[#333] bg-[#1a1a1a] px-2 py-1.5 text-[#f5f5f5]" />
          </div>
        </div>

        {reportLoading ? (
          <p className="text-[#ababab]">Loading…</p>
        ) : !report || report.total === 0 ? (
          <p className="rounded-xl bg-[#1a1a1a] px-4 py-5 text-center text-sm text-[#8a8a8a]">No finished prep timers in this period yet. Stats appear as orders are marked Ready.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Stat label="Total orders" value={report.total} sub={`${report.withTimer} with timers`} />
              <Stat label="Ready on time" value={report.onTime} sub={fmt(report.onTimePercent, "%")} />
              <Stat label="Late orders" value={report.late} />
              <Stat label="Avg prep time" value={fmt(report.avgPrepMinutes, " min")} />
              <Stat label="Avg delay (late)" value={fmt(report.avgDelayMinutes, " min")} />
              <Stat label="Extended" value={report.extendedOrders} sub={`${report.totalExtensionMinutes} min added`} />
            </div>
            <div className="mt-3 overflow-x-auto rounded-xl bg-[#1a1a1a]">
              <table className="w-full min-w-[420px] text-left text-sm text-[#f5f5f5]">
                <thead className="text-xs uppercase tracking-wider text-[#8a8a8a]">
                  <tr><th className="px-3 py-2">Source</th><th className="px-3 py-2">Orders</th><th className="px-3 py-2">On time</th><th className="px-3 py-2">Late</th><th className="px-3 py-2">Avg prep</th><th className="px-3 py-2">Avg delay</th></tr>
                </thead>
                <tbody>
                  {[["Online Store", report.bySource.Online], ["POS", report.bySource.POS]].map(([name, r]) => (
                    <tr key={name} className="border-t border-[#2b2b2b]">
                      <td className="px-3 py-2 font-semibold">{name}</td>
                      <td className="px-3 py-2 tabular-nums">{r.total}</td>
                      <td className="px-3 py-2 tabular-nums">{r.onTime} ({fmt(r.onTimePercent, "%")})</td>
                      <td className="px-3 py-2 tabular-nums">{r.late}</td>
                      <td className="px-3 py-2 tabular-nums">{fmt(r.avgPrepMinutes, " min")}</td>
                      <td className="px-3 py-2 tabular-nums">{fmt(r.avgDelayMinutes, " min")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrepSettingsManager;
