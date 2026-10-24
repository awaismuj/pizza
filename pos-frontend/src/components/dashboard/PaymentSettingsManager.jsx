import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getSettings, updateSettings, uploadImage } from "../../https";
import { resolveImageUrl } from "../../utils";

const DEFAULTS = {
  codEnabled: true,
  jazzcashEnabled: true,
  merchantName: "GEN Z FOOD",
  tillId: "984661930",
  dialCode: "*786*10#",
  qrImage: "",
};

const Toggle = ({ checked, onChange, label, hint }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#333] bg-[#1f1f1f] p-4">
    <span>
      <span className="block font-semibold text-[#f5f5f5]">{label}</span>
      <span className="block text-xs text-[#8a8a8a]">{hint}</span>
    </span>
    <span className="relative inline-flex shrink-0">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="h-7 w-12 rounded-full bg-[#444] transition-colors peer-checked:bg-[#02ca3a] peer-focus-visible:ring-2 peer-focus-visible:ring-[#f6b100]" />
      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
    </span>
  </label>
);

// Dashboard > Payment Settings (Admin). Controls what customers see at
// checkout on the online store: which methods are available and the
// JazzCash / Raast merchant details + QR.
const PaymentSettingsManager = () => {
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const saved = { ...DEFAULTS, ...(data?.data?.data?.payments || {}) };

  const [form, setForm] = useState(DEFAULTS);
  const [uploading, setUploading] = useState(false);
  const loadedRef = useRef(false);

  // Fill the form once from the server (not on every background refetch,
  // which would wipe what's being typed).
  useEffect(() => {
    if (data?.data?.data && !loadedRef.current) {
      loadedRef.current = true;
      setForm({ ...DEFAULTS, ...(data.data.data.payments || {}) });
    }
  }, [data]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const saveMutation = useMutation({
    mutationFn: (payments) => updateSettings({ payments }),
    onSuccess: (res) => {
      enqueueSnackbar("Payment settings saved — the store updates right away.", { variant: "success" });
      loadedRef.current = false;
      queryClient.setQueryData(["settings"], (old) => ({ ...old, data: { ...old?.data, data: res?.data?.data } }));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Failed to save payment settings.", { variant: "error" }),
  });

  const onPickQr = async (file) => {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      enqueueSnackbar("Please choose a PNG or JPG image.", { variant: "warning" });
      return;
    }
    setUploading(true);
    try {
      const res = await uploadImage(file);
      const url = res?.data?.data?.url || res?.data?.url || res?.data?.data?.image || res?.data?.data;
      if (typeof url !== "string") throw new Error("no url");
      set({ qrImage: url });
      enqueueSnackbar("QR uploaded — press Save to publish it.", { variant: "info" });
    } catch {
      enqueueSnackbar("Couldn't upload the QR image. Please try again.", { variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const tillOk = /^\d{6,20}$/.test(String(form.tillId).replace(/\s+/g, ""));
  const nameOk = String(form.merchantName).trim().length >= 2;
  const dialOk = /^[*#0-9]{3,20}$/.test(String(form.dialCode).trim());
  const methodOk = form.codEnabled || form.jazzcashEnabled;
  const valid = tillOk && nameOk && dialOk && methodOk;
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const qrPreview = form.qrImage ? resolveImageUrl(form.qrImage) : null;
  const input = "w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-3 py-2.5 text-[#f5f5f5] outline-none focus:border-[#f6b100]";

  if (isLoading) return <div className="mx-auto w-full px-6 text-[#ababab]">Loading payment settings…</div>;

  return (
    <div className="mx-auto w-full px-4 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl bg-[#262626] p-5 sm:p-6">
          <div>
            <h3 className="text-xl font-semibold text-[#f5f5f5]">Payment methods</h3>
            <p className="text-sm text-[#ababab]">Choose what customers can pick at checkout.</p>
          </div>
          <Toggle checked={form.codEnabled} onChange={(v) => set({ codEnabled: v })} label="Cash on Delivery" hint="Customer pays the rider in cash." />
          <Toggle checked={form.jazzcashEnabled} onChange={(v) => set({ jazzcashEnabled: v })} label="JazzCash / Raast QR" hint="Customer scans the QR, then uploads a screenshot + TID for you to verify." />
          {!methodOk && <p className="text-sm text-[#e6402e]">At least one payment method must stay on.</p>}

          <div className="grid gap-4 pt-2">
            <label className="block text-sm font-semibold text-[#ababab]">
              Merchant name
              <input className={`${input} mt-1`} value={form.merchantName} maxLength={60} onChange={(e) => set({ merchantName: e.target.value })} />
              {!nameOk && <span className="text-xs text-[#e6402e]">Enter at least 2 characters.</span>}
            </label>
            <label className="block text-sm font-semibold text-[#ababab]">
              JazzCash Till ID
              <input className={`${input} mt-1 font-mono tracking-wider`} inputMode="numeric" value={form.tillId} maxLength={20} onChange={(e) => set({ tillId: e.target.value.replace(/[^\d ]/g, "") })} />
              {!tillOk && <span className="text-xs text-[#e6402e]">Till ID must be 6–20 digits.</span>}
            </label>
            <label className="block text-sm font-semibold text-[#ababab]">
              Dial code shown to customers
              <input className={`${input} mt-1 font-mono`} value={form.dialCode} maxLength={20} onChange={(e) => set({ dialCode: e.target.value.replace(/[^*#0-9]/g, "") })} />
              {!dialOk && <span className="text-xs text-[#e6402e]">Only digits, * and # (e.g. *786*10#).</span>}
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={!valid || !dirty || saveMutation.isPending}
              className="rounded-lg bg-[#f6b100] px-6 py-2.5 font-semibold text-[#1f1f1f] disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving…" : "Save changes"}
            </button>
            {dirty && (
              <button onClick={() => set(saved)} className="rounded-lg bg-[#333] px-5 py-2.5 font-semibold text-[#f5f5f5]">
                Discard
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-[#262626] p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-[#f5f5f5]">Payment QR image</h3>
          <p className="mb-4 text-sm text-[#ababab]">
            Shown on the checkout page. Upload your JazzCash / Raast QR poster (PNG or JPG).
            {!form.qrImage && " Right now the QR that ships with the store is used."}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="w-full max-w-[220px] overflow-hidden rounded-xl border border-[#444] bg-[#1a1a1a]">
              {qrPreview ? (
                <img src={qrPreview} alt="Payment QR preview" className="h-auto w-full" />
              ) : (
                <div className="p-6 text-center text-sm text-[#8a8a8a]">Using the built-in QR</div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => { onPickQr(e.target.files?.[0]); e.target.value = ""; }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-lg bg-[#333] px-4 py-2.5 font-semibold text-[#f5f5f5] hover:bg-[#444] disabled:opacity-60">
                {uploading ? "Uploading…" : "Upload new QR"}
              </button>
              {form.qrImage && (
                <button onClick={() => set({ qrImage: "" })} className="rounded-lg bg-[#2a2a2a] px-4 py-2.5 text-sm font-semibold text-[#ababab] hover:bg-[#333]">
                  Use the built-in QR
                </button>
              )}
              <p className="max-w-xs text-xs text-[#8a8a8a]">Remember to press “Save changes” after uploading.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsManager;
