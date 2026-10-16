import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getSettings, updateSettings } from "../../https";

// Dashboard > Delivery & Pickup. Branch, delivery-zone and opening-hour
// configuration shared by the POS and the public genzpizza.online storefront
// through one Settings document - one save applies everywhere.
const DAYS = [
  { key: 0, label: "Sun" },
  { key: 1, label: "Mon" },
  { key: 2, label: "Tue" },
  { key: 3, label: "Wed" },
  { key: 4, label: "Thu" },
  { key: 5, label: "Fri" },
  { key: 6, label: "Sat" },
];

const blankZone = () => ({
  area: "",
  fee: 0,
  minimumOrder: 0,
  estimatedDeliveryMinutes: 30,
  enabled: true,
});

const blankHours = () =>
  DAYS.map((d) => ({ dayOfWeek: d.key, open: "10:00", close: "23:00", closed: false }));

const blankBranch = () => ({
  branchId: "",
  name: "",
  address: "",
  enabled: true,
  pickupEnabled: true,
  deliveryEnabled: true,
  preparationMinutes: 25,
  pickupInstructions: "Please show your order number at the counter.",
  deliveryRestrictionActive: false,
  deliveryRestrictionMessage: "",
  openingHours: blankHours(),
  deliveryZones: [],
});

// Make sure every branch draft has every field the schema expects, even if
// an older settings document is missing some of them.
const normalizeBranch = (b) => ({
  ...blankBranch(),
  ...b,
  openingHours: Array.isArray(b.openingHours) && b.openingHours.length ? b.openingHours : blankHours(),
  deliveryZones: Array.isArray(b.deliveryZones) ? b.deliveryZones : [blankZone()],
});

const FulfillmentManager = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const live = data?.data?.data?.deliveryFulfillment || {};
  const timeZoneFromServer = live.timeZone || "Asia/Karachi";
  const branchesFromServer = live.branches;
  const [timeZone, setTimeZone] = useState(timeZoneFromServer);
  // Draft branches - only written back to the backend on Save.
  const [branches, setBranches] = useState(
    Array.isArray(branchesFromServer) && branchesFromServer.length
      ? branchesFromServer.map(normalizeBranch)
      : [blankBranch()]
  );
  // Bumped after a save so the draft re-syncs with the saved document, but
  // never while the admin is mid-edit.
  const [serverVersion, setServerVersion] = useState(0);

  // Only overwrite the draft from the server the first time it loads (or
  // after a save), never while the admin is mid-edit.
  useEffect(() => {
    setTimeZone(timeZoneFromServer);
    if (Array.isArray(branchesFromServer) && branchesFromServer.length) {
      setBranches(branchesFromServer.map(normalizeBranch));
    }
  }, [serverVersion, timeZoneFromServer, JSON.stringify(branchesFromServer)]);

  const saveMutation = useMutation({
    mutationFn: (payload) => updateSettings({ deliveryFulfillment: payload }),
    onSuccess: (resData) => {
      enqueueSnackbar("Delivery & pickup settings saved — live on the store now.", { variant: "success" });
      queryClient.setQueryData(["settings"], (old) => ({
        ...old,
        data: { ...old?.data, data: resData?.data?.data },
      }));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setServerVersion((v) => v + 1);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to save delivery & pickup settings.", { variant: "error" });
    },
  });

  const setBranch = (index, field, value) => {
    setBranches((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };
  const toggleBranch = (index, field) => {
    setBranches((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: !next[index][field] };
      return next;
    });
  };
  const addBranch = () => setBranches((prev) => [...prev, blankBranch()]);
  const removeBranch = (index) => {
    if (branches.length <= 1) return;
    setBranches((prev) => prev.filter((_, i) => i !== index));
  };

  const setHour = (bi, dayKey, field, value) => {
    setBranches((prev) => {
      const next = [...prev];
      const hour = next[bi].openingHours.find((h) => h.dayOfWeek === dayKey);
      if (hour) hour[field] = value;
      return next;
    });
  };
  const toggleClosed = (bi, dayKey) => {
    setBranches((prev) => {
      const next = [...prev];
      const hour = next[bi].openingHours.find((h) => h.dayOfWeek === dayKey);
      if (hour) hour.closed = !hour.closed;
      return next;
    });
  };

  const addZone = (bi) => {
    setBranches((prev) => {
      const next = [...prev];
      next[bi] = { ...next[bi], deliveryZones: [...(next[bi].deliveryZones || []), blankZone()] };
      return next;
    });
  };
  const removeZone = (bi, zi) => {
    setBranches((prev) => {
      const next = [...prev];
      next[bi] = {
        ...next[bi],
        deliveryZones: (next[bi].deliveryZones || []).filter((_, i) => i !== zi),
      };
      return next;
    });
  };
  const setZone = (bi, zi, field, value) => {
    setBranches((prev) => {
      const next = [...prev];
      const zones = next[bi].deliveryZones || [];
      zones[zi] = { ...zones[zi], [field]: value };
      return next;
    });
  };
  const toggleZone = (bi, zi) => {
    setBranches((prev) => {
      const next = [...prev];
      const zones = next[bi].deliveryZones || [];
      zones[zi] = { ...zones[zi], enabled: !zones[zi].enabled };
      return next;
    });
  };

  const handleSave = () => {
    const invalid = branches.find((b) => !b.branchId.trim() || !b.name.trim());
    if (invalid) {
      enqueueSnackbar("Give every branch an ID and a name before saving.", { variant: "warning" });
      return;
    }
    saveMutation.mutate({ timeZone, branches });
  };

  const zoneRows = (bi) => {
    const zones = branches[bi].deliveryZones || [];
    return (
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => addZone(bi)}
            className="text-xs text-[#ababab] hover:text-white underline underline-offset-4"
          >
            + Add delivery zone
          </button>
          <span className="text-xs text-[#6b6b6b]">Zones set where this branch delivers and what it costs.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-1">
          <div className="text-[#6b6b6b] text-xs font-medium">Area</div>
          <div className="text-[#6b6b6b] text-xs font-medium">Fee</div>
          <div className="text-[#6b6b6b] text-xs font-medium">Min. order</div>
          <div className="text-[#6b6b6b] text-xs font-medium">Est. delivery (min)</div>
        </div>
        {zones.map((z, zi) => (
          <div key={zi} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-end mb-2">
            <input
              value={z.area}
              onChange={(e) => setZone(bi, zi, "area", e.target.value)}
              placeholder="e.g. Gojra"
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none border border-[#333] focus-within:border-[#525252] text-sm"
            />
            <input
              type="number"
              min="0"
              value={z.fee}
              onChange={(e) => setZone(bi, zi, "fee", Number(e.target.value) || 0)}
              placeholder="0"
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none border border-[#333] focus-within:border-[#525252] text-sm"
            />
            <input
              type="number"
              min="0"
              value={z.minimumOrder}
              onChange={(e) => setZone(bi, zi, "minimumOrder", Number(e.target.value) || 0)}
              placeholder="0"
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none border border-[#333] focus-within:border-[#525252] text-sm"
            />
            <input
              type="number"
              min="0"
              max="240"
              value={z.estimatedDeliveryMinutes}
              onChange={(e) => setZone(bi, zi, "estimatedDeliveryMinutes", Number(e.target.value) || 30)}
              placeholder="30"
              className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none border border-[#333] focus-within:border-[#525252] text-sm"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={z.enabled}
                onChange={() => toggleZone(bi, zi)}
                className="rounded bg-[#1a1a1a] border border-[#333] text-[#F6B100] focus:ring-0"
              />
              <span className="text-xs text-[#ababab]">Enabled</span>
            </label>
            <button
              type="button"
              onClick={() => removeZone(bi, zi)}
              className="text-[#ff5d5d] text-xs hover:underline"
              title="Remove zone"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    );
  };

  const hoursGrid = (bi) => (
    <div className="mt-3">
      <h4 className="text-[#ababab] text-xs font-semibold mb-2">Opening hours</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2 text-sm">
        <div className="text-[#6b6b6b] text-xs font-medium">Day</div>
        <div className="text-[#6b6b6b] text-xs font-medium">Closed</div>
        <div className="text-[#6b6b6b] text-xs font-medium">Opens</div>
        <div className="text-[#6b6b6b] text-xs font-medium">Closes</div>
        {DAYS.map((day) => {
          const hour = branches[bi].openingHours.find((h) => h.dayOfWeek === day.key);
          return (
            <div key={day.key} className="flex items-center gap-2">
              <span className="text-[#ababab]">{day.label}</span>
              <label className="flex items-center gap-1 ml-1">
                <input
                  type="checkbox"
                  checked={hour.closed}
                  onChange={() => toggleClosed(bi, day.key)}
                  className="rounded bg-[#1a1a1a] border border-[#333] text-[#F6B100] focus:ring-0"
                />
                <span className="text-[#ababab] text-xs">{hour.closed ? "closed" : "open"}</span>
              </label>
              <input
                type="time"
                disabled={hour.closed}
                value={hour.open}
                onChange={(e) => setHour(bi, day.key, "open", e.target.value)}
                className="bg-[#1a1a1a] text-white rounded px-2 py-1.5 outline-none border border-[#333] focus-within:border-[#525252] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <input
                type="time"
                disabled={hour.closed}
                value={hour.close}
                onChange={(e) => setHour(bi, day.key, "close", e.target.value)}
                className="bg-[#1a1a1a] text-white rounded px-2 py-1.5 outline-none border border-[#333] focus-within:border-[#525252] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-6">
        <p className="text-[#ababab]">Loading delivery & pickup settings…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6">
      <div className="max-w-4xl bg-[#262626] rounded-lg p-5 sm:p-6">
        <h3 className="text-[#f5f5f5] text-xl font-semibold mb-1">Delivery &amp; pickup</h3>
        <p className="text-[#ababab] text-sm mb-6">
          One rule set for the POS and the online store. Branches, delivery
          zones, fees and opening hours are applied at checkout everywhere.
        </p>

        <label className="block text-[#ababab] mb-2 text-sm font-medium">Time zone</label>
        <div className="rounded-lg bg-[#1a1a1a] px-4 py-3 border border-[#333] focus-within:border-[#525252] mb-6">
          <input
            type="text"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            placeholder="Asia/Karachi"
            className="bg-transparent text-white outline-none w-full"
          />
        </div>

        {branches.map((b, bi) => {
          const restricted = b.deliveryRestrictionActive;
          return (
            <div key={b.branchId || bi} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 sm:p-5 mb-5">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <input
                  value={b.branchId}
                  onChange={(e) => setBranch(bi, "branchId", e.target.value)}
                  placeholder="Branch ID (e.g. gojra-main)"
                  className="bg-transparent text-white outline-none sm:w-40"
                />
                <input
                  value={b.name}
                  onChange={(e) => setBranch(bi, "name", e.target.value)}
                  placeholder="Branch name"
                  className="bg-transparent text-white outline-none flex-1 min-w-0"
                />
                <input
                  value={b.address}
                  onChange={(e) => setBranch(bi, "address", e.target.value)}
                  placeholder="Street address"
                  className="bg-transparent text-white outline-none flex-1 min-w-0"
                />
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={b.enabled}
                    onChange={() => toggleBranch(bi, "enabled")}
                    className="rounded bg-[#1a1a1a] border border-[#333] text-[#F6B100] focus:ring-0"
                  />
                  <span className={`text-sm ${!b.enabled ? "text-[#6b6b6b]" : "text-[#f5f5f5]"}`}>Branch active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={b.pickupEnabled}
                    onChange={() => toggleBranch(bi, "pickupEnabled")}
                    className="rounded bg-[#1a1a1a] border border-[#333] text-[#F6B100] focus:ring-0"
                  />
                  <span className={`text-sm ${!b.pickupEnabled ? "text-[#6b6b6b]" : "text-[#f5f5f5]"}`}>Pickup available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={b.deliveryEnabled}
                    onChange={() => toggleBranch(bi, "deliveryEnabled")}
                    className="rounded bg-[#1a1a1a] border border-[#333] text-[#F6B100] focus:ring-0"
                  />
                  <span className={`text-sm ${!b.deliveryEnabled ? "text-[#6b6b6b]" : "text-[#f5f5f5]"}`}>Delivers to zones</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-[#ababab] mb-1 text-xs font-medium">Prep time (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="240"
                    value={b.preparationMinutes}
                    onChange={(e) => setBranch(bi, "preparationMinutes", Number(e.target.value) || 25)}
                    className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none border border-[#333] focus-within:border-[#525252] w-full"
                  />
                </div>
                <div>
                  <label className="block text-[#ababab] mb-1 text-xs font-medium">Pickup instructions</label>
                  <input
                    value={b.pickupInstructions}
                    onChange={(e) => setBranch(bi, "pickupInstructions", e.target.value)}
                    placeholder="e.g. Show your order number at the counter"
                    className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none border border-[#333] focus-within:border-[#525252] w-full"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={restricted}
                    onChange={() => toggleBranch(bi, "deliveryRestrictionActive")}
                    className="rounded bg-[#1a1a1a] border border-[#333] text-[#ff5d5d] focus:ring-0"
                  />
                  <span className="text-sm text-[#f5f5f5]">Temporarily stop deliveries from this branch</span>
                </label>
                {restricted && (
                  <div className="mt-2">
                    <label className="block text-[#ababab] mb-1 text-xs font-medium">Message shown to customers</label>
                    <input
                      value={b.deliveryRestrictionMessage}
                      onChange={(e) => setBranch(bi, "deliveryRestrictionMessage", e.target.value)}
                      placeholder="e.g. Rider unavailable today - try pickup"
                      className="bg-[#1a1a1a] text-white rounded px-3 py-2 outline-none border border-[#333] focus-within:border-[#525252] w-full"
                    />
                  </div>
                )}
              </div>
              {hoursGrid(bi)}
              {zoneRows(bi)}
              <div className="mt-3 flex justify-end">
                {branches.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBranch(bi)}
                    className="text-[#ff5d5d] text-sm font-medium hover:underline"
                  >
                    Remove branch
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div className="mt-4">
          <button
            type="button"
            onClick={addBranch}
            className="text-[#ababab] hover:text-white text-sm underline underline-offset-4"
          >
            + Add another branch
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="mt-6 w-full sm:w-auto bg-[#F6B100] text-[#1f1f1f] font-semibold rounded-lg px-8 py-3 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveMutation.isPending ? "Saving…" : "Save delivery & pickup settings"}
        </button>
      </div>
    </div>
  );
};

export default FulfillmentManager;
