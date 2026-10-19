import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { MdAdd, MdDelete, MdStorefront } from "react-icons/md";
import { addBranch, deleteBranch, getBranches, updateBranch } from "../../https";

// Dashboard > Branches. Everything the delivery / pickup rules need, per
// branch: opening hours, pickup availability, delivery zones + fees, minimum
// orders, preparation estimates and temporary restrictions. The website and
// the POS both read these same rules from the backend.

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const blankBranch = () => ({
  _id: "new",
  name: "",
  address: "",
  phone: "",
  isActive: true,
  hours: DAYS.map((_, day) => ({ day, open: true, from: "11:00", to: "23:00" })),
  pickup: { enabled: true, prepMinutes: 20, minOrder: 0, instructions: "Come to the counter and give your order number." },
  delivery: { enabled: true, prepMinutes: 25, minOrder: 0, freeAbove: 0, zones: [] },
  restriction: { active: false, applies: "delivery", message: "", until: "" },
});

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const hydrate = (b) => ({
  ...blankBranch(),
  ...b,
  hours: DAYS.map((_, day) => b.hours?.find((h) => h.day === day) || { day, open: true, from: "11:00", to: "23:00" }),
  pickup: { ...blankBranch().pickup, ...(b.pickup || {}) },
  delivery: { ...blankBranch().delivery, ...(b.delivery || {}), zones: (b.delivery?.zones || []).map((z) => ({ ...z })) },
  restriction: { ...blankBranch().restriction, ...(b.restriction || {}), until: toLocalInput(b.restriction?.until) },
});

const inputCls = "w-full rounded-lg bg-[#1a1a1a] border border-[#333] focus:border-[#525252] outline-none text-white px-3 py-2 text-sm";
const labelCls = "block text-[#ababab] mb-1 text-xs font-medium";

const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className={labelCls}>{label}</span>
    {children}
    {hint && <span className="block text-[#6f6f6f] text-[11px] mt-1">{hint}</span>}
  </label>
);

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex items-center gap-2 text-sm text-[#f5f5f5]"
  >
    <span className={`w-10 h-6 rounded-full p-0.5 transition-colors ${checked ? "bg-[#f6b100]" : "bg-[#444]"}`}>
      <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : ""}`} />
    </span>
    {label}
  </button>
);

const Card = ({ title, subtitle, children, right }) => (
  <section className="bg-[#262626] rounded-2xl p-5 border border-[#333]">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-[#f5f5f5] text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-[#8a8a8a] text-sm mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
    {children}
  </section>
);

const BranchesManager = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["branches"], queryFn: getBranches });
  const branches = data?.data?.data ?? [];

  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(null);
  const [dirty, setDirty] = useState(false);

  // Load the selected branch into the form (only when the selection changes
  // or a save refreshes the list - never mid-typing).
  useEffect(() => {
    if (selectedId === "new") return;
    const found = branches.find((b) => b._id === selectedId) || branches[0];
    if (found && !dirty) {
      setSelectedId(found._id);
      setForm(hydrate(found));
    }
  }, [branches, selectedId, dirty]);

  const select = (id) => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setDirty(false);
    if (id === "new") {
      setSelectedId("new");
      setForm(blankBranch());
    } else {
      setSelectedId(id);
      setForm(hydrate(branches.find((b) => b._id === id)));
    }
  };

  const patch = (path, value) => {
    setDirty(true);
    setForm((f) => {
      const next = structuredClone(f);
      const keys = path.split(".");
      let node = next;
      keys.slice(0, -1).forEach((k) => (node = node[k]));
      node[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const buildPayload = () => ({
    ...form,
    restriction: { ...form.restriction, until: form.restriction.until ? new Date(form.restriction.until).toISOString() : null },
  });

  const onError = (e) => enqueueSnackbar(e?.response?.data?.message || "Couldn't save the branch.", { variant: "error" });

  const saveMutation = useMutation({
    mutationFn: () => (selectedId === "new" ? addBranch(buildPayload()) : updateBranch({ id: selectedId, ...buildPayload() })),
    onSuccess: (res) => {
      enqueueSnackbar("Branch saved. The website and POS now use these rules.", { variant: "success" });
      setDirty(false);
      setSelectedId(res?.data?.data?._id || selectedId);
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBranch(selectedId),
    onSuccess: () => {
      enqueueSnackbar("Branch deleted.", { variant: "success" });
      setDirty(false);
      setSelectedId("");
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
    onError,
  });

  const addZone = () =>
    patch("delivery.zones", [...form.delivery.zones, { name: "", areas: "", fee: 100, minOrder: 0, travelMinutes: 20, active: true }]);
  const setZone = (i, key, value) => patch(`delivery.zones.${i}.${key}`, value);
  const removeZone = (i) => patch("delivery.zones", form.delivery.zones.filter((_, idx) => idx !== i));
  const num = (v) => (v === "" ? "" : Number(v));

  if (isLoading) return <div className="px-6 text-[#ababab]">Loading branches…</div>;

  return (
    <div className="px-4 sm:px-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        {branches.map((b) => (
          <button
            key={b._id}
            onClick={() => select(b._id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              selectedId === b._id ? "bg-[#f6b100] text-[#1f1f1f] border-[#f6b100]" : "bg-[#262626] text-[#b5b5b5] border-[#333] hover:bg-[#2e2e2e]"
            }`}
          >
            <MdStorefront /> {b.name}
            {!b.isActive && <span className="text-[10px] uppercase opacity-70">off</span>}
          </button>
        ))}
        <button
          onClick={() => select("new")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-dashed ${
            selectedId === "new" ? "border-[#f6b100] text-[#f6b100]" : "border-[#444] text-[#b5b5b5] hover:text-[#f5f5f5]"
          }`}
        >
          <MdAdd /> Add branch
        </button>
      </div>

      {!form ? (
        <p className="text-[#ababab]">No branches yet. Add your first one.</p>
      ) : (
        <>
          <Card
            title="Branch details"
            subtitle="Customers see the name and address when choosing where to pick up."
            right={<Toggle checked={form.isActive} onChange={(v) => patch("isActive", v)} label="Accepting orders" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Branch name"><input className={inputCls} value={form.name} onChange={(e) => patch("name", e.target.value)} /></Field>
              <Field label="Address"><input className={inputCls} value={form.address} onChange={(e) => patch("address", e.target.value)} /></Field>
              <Field label="Phone"><input className={inputCls} value={form.phone} onChange={(e) => patch("phone", e.target.value)} /></Field>
            </div>
          </Card>

          <Card title="Opening hours" subtitle="Orders are blocked outside these hours. A closing time earlier than the opening time means it closes after midnight.">
            <div className="flex flex-col gap-2">
              {form.hours.map((h, i) => (
                <div key={h.day} className="grid grid-cols-[110px_1fr] sm:grid-cols-[130px_120px_1fr] items-center gap-3">
                  <span className="text-[#f5f5f5] text-sm font-medium">{DAYS[h.day]}</span>
                  <Toggle checked={h.open} onChange={(v) => patch(`hours.${i}.open`, v)} label={h.open ? "Open" : "Closed"} />
                  <div className={`flex items-center gap-2 col-span-2 sm:col-span-1 ${h.open ? "" : "opacity-40 pointer-events-none"}`}>
                    <input type="time" className={`${inputCls} max-w-[140px]`} value={h.from} onChange={(e) => patch(`hours.${i}.from`, e.target.value)} />
                    <span className="text-[#8a8a8a] text-sm">to</span>
                    <input type="time" className={`${inputCls} max-w-[140px]`} value={h.to} onChange={(e) => patch(`hours.${i}.to`, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Pickup"
            subtitle="Customers collect from this branch. No delivery fee."
            right={<Toggle checked={form.pickup.enabled} onChange={(v) => patch("pickup.enabled", v)} label="Pickup available" />}
          >
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${form.pickup.enabled ? "" : "opacity-50"}`}>
              <Field label="Preparation time (minutes)" hint="Shown to customers as the ready-in estimate.">
                <input type="number" min="0" className={inputCls} value={form.pickup.prepMinutes} onChange={(e) => patch("pickup.prepMinutes", num(e.target.value))} />
              </Field>
              <Field label="Minimum order (Rs.)" hint="Before tax. 0 = no minimum.">
                <input type="number" min="0" className={inputCls} value={form.pickup.minOrder} onChange={(e) => patch("pickup.minOrder", num(e.target.value))} />
              </Field>
              <Field label="Pickup instructions">
                <input className={inputCls} value={form.pickup.instructions} onChange={(e) => patch("pickup.instructions", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card
            title="Home delivery"
            subtitle="Set the areas you deliver to and what each one costs."
            right={<Toggle checked={form.delivery.enabled} onChange={(v) => patch("delivery.enabled", v)} label="Delivery available" />}
          >
            <div className={form.delivery.enabled ? "" : "opacity-50"}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <Field label="Preparation time (minutes)" hint="Kitchen time before the rider leaves.">
                  <input type="number" min="0" className={inputCls} value={form.delivery.prepMinutes} onChange={(e) => patch("delivery.prepMinutes", num(e.target.value))} />
                </Field>
                <Field label="Minimum order (Rs.)" hint="Before tax. 0 = no minimum.">
                  <input type="number" min="0" className={inputCls} value={form.delivery.minOrder} onChange={(e) => patch("delivery.minOrder", num(e.target.value))} />
                </Field>
                <Field label="Free delivery above (Rs.)" hint="Before tax. 0 = never free.">
                  <input type="number" min="0" className={inputCls} value={form.delivery.freeAbove} onChange={(e) => patch("delivery.freeAbove", num(e.target.value))} />
                </Field>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[#f5f5f5] font-semibold text-sm">Delivery zones</h4>
                <button onClick={addZone} type="button" className="flex items-center gap-1 text-sm font-semibold text-[#f6b100] hover:underline"><MdAdd /> Add zone</button>
              </div>

              {form.delivery.zones.length === 0 && (
                <p className="text-[#ef9a9a] text-sm bg-[#3a1f1f] rounded-lg px-3 py-2">No zones yet. Customers can't choose delivery until you add at least one.</p>
              )}

              <div className="flex flex-col gap-3">
                {form.delivery.zones.map((z, i) => (
                  <div key={z._id || i} className="rounded-xl bg-[#1f1f1f] border border-[#333] p-3">
                    <div className="grid grid-cols-2 lg:grid-cols-[1.2fr_1.6fr_90px_110px_110px_auto] gap-3 items-end">
                      <Field label="Zone name"><input className={inputCls} value={z.name} onChange={(e) => setZone(i, "name", e.target.value)} placeholder="e.g. Gojra city" /></Field>
                      <Field label="Areas covered (optional)"><input className={inputCls} value={z.areas} onChange={(e) => setZone(i, "areas", e.target.value)} placeholder="e.g. Model Town, Railway Road" /></Field>
                      <Field label="Fee (Rs.)"><input type="number" min="0" className={inputCls} value={z.fee} onChange={(e) => setZone(i, "fee", num(e.target.value))} /></Field>
                      <Field label="Zone minimum"><input type="number" min="0" className={inputCls} value={z.minOrder} onChange={(e) => setZone(i, "minOrder", num(e.target.value))} /></Field>
                      <Field label="Travel (min)"><input type="number" min="0" className={inputCls} value={z.travelMinutes} onChange={(e) => setZone(i, "travelMinutes", num(e.target.value))} /></Field>
                      <div className="flex items-center gap-3 col-span-2 lg:col-span-1 justify-between">
                        <Toggle checked={z.active !== false} onChange={(v) => setZone(i, "active", v)} label="Active" />
                        <button type="button" onClick={() => removeZone(i)} aria-label={`Remove ${z.name || "zone"}`} className="w-9 h-9 rounded-lg bg-[#3a1f1f] text-[#ef9a9a] hover:bg-[#4a2525] flex items-center justify-center text-lg"><MdDelete /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card
            title="Temporary restriction"
            subtitle="Pause delivery or pickup for a while (weather, rider shortage, rush). It switches off by itself at the end time."
            right={<Toggle checked={form.restriction.active} onChange={(v) => patch("restriction.active", v)} label="Restriction on" />}
          >
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${form.restriction.active ? "" : "opacity-50"}`}>
              <Field label="Applies to">
                <select className={inputCls} value={form.restriction.applies} onChange={(e) => patch("restriction.applies", e.target.value)}>
                  <option value="delivery">Delivery only</option>
                  <option value="pickup">Pickup only</option>
                  <option value="both">Delivery and pickup</option>
                </select>
              </Field>
              <Field label="Ends at (optional)" hint="Leave empty to keep it on until you switch it off.">
                <input type="datetime-local" className={inputCls} value={form.restriction.until} onChange={(e) => patch("restriction.until", e.target.value)} />
              </Field>
              <Field label="Message shown to customers">
                <input className={inputCls} value={form.restriction.message} onChange={(e) => patch("restriction.message", e.target.value)} placeholder="Delivery is paused due to heavy rain." />
              </Field>
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-3 sticky bottom-0 bg-[#1f1f1f]/95 backdrop-blur py-3 border-t border-[#333]">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !dirty && selectedId !== "new"}
              className="bg-[#F6B100] text-[#1f1f1f] font-semibold rounded-lg px-8 py-3 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveMutation.isPending ? "Saving…" : selectedId === "new" ? "Create branch" : "Save changes"}
            </button>
            {dirty && <span className="text-[#f6b100] text-sm">Unsaved changes</span>}
            {selectedId !== "new" && (
              <button
                onClick={() => window.confirm(`Delete branch "${form.name}"?`) && deleteMutation.mutate()}
                className="ml-auto text-[#ef9a9a] hover:text-white text-sm font-semibold flex items-center gap-1"
              >
                <MdDelete /> Delete branch
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BranchesManager;
