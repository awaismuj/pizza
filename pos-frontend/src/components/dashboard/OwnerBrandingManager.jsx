import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  getOwnerBranding,
  getOwnerSession,
  logoutOwner,
  ownerBrandLogin,
  ownerBrandVerify,
  updateOwnerBranding,
  uploadOwnerBrandingLogo,
} from "../../https";
import { resolveImageUrl } from "../../utils";
import useBrand from "../../hooks/useBrand";

const OwnerBrandingManager = () => {
  const queryClient = useQueryClient();
  const { brandLogo: fallbackLogo } = useBrand();
  const [email, setEmail] = useState("awais.mj@gmail.com");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [secondFactorRequired, setSecondFactorRequired] = useState(false);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [uploading, setUploading] = useState(false);

  const sessionQuery = useQuery({
    queryKey: ["owner-brand-session"],
    queryFn: getOwnerSession,
    retry: false,
  });
  const ownerAuthenticated = Boolean(sessionQuery.data?.data?.data?.email);
  const brandingQuery = useQuery({
    queryKey: ["owner-branding"],
    queryFn: getOwnerBranding,
    enabled: ownerAuthenticated,
    retry: false,
  });

  useEffect(() => {
    const branding = brandingQuery.data?.data?.data;
    if (branding) {
      setName(branding.name || "");
      setLogo(branding.logo || "");
    }
  }, [brandingQuery.data]);

  const loginMutation = useMutation({
    mutationFn: ownerBrandLogin,
    onSuccess: () => {
      setPassword("");
      setSecondFactorRequired(true);
      enqueueSnackbar("Enter the current code from Google Authenticator.", { variant: "info" });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Owner sign-in failed.", { variant: "error" }),
  });
  const verifyMutation = useMutation({
    mutationFn: ownerBrandVerify,
    onSuccess: async () => {
      setCode("");
      setSecondFactorRequired(false);
      await queryClient.invalidateQueries({ queryKey: ["owner-brand-session"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-branding"] });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Authenticator verification failed.", { variant: "error" }),
  });
  const saveMutation = useMutation({
    mutationFn: updateOwnerBranding,
    onSuccess: async () => {
      enqueueSnackbar("Brand name and image saved.", { variant: "success" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["owner-branding"] }),
        queryClient.invalidateQueries({ queryKey: ["settings"] }),
      ]);
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Brand settings could not be saved.", { variant: "error" }),
  });
  const logoutMutation = useMutation({
    mutationFn: logoutOwner,
    onSuccess: async () => {
      setSecondFactorRequired(false);
      setCode("");
      await queryClient.invalidateQueries({ queryKey: ["owner-brand-session"] });
      queryClient.removeQueries({ queryKey: ["owner-branding"] });
    },
    onError: (error) => enqueueSnackbar(error?.response?.data?.message || "Could not end owner session.", { variant: "error" }),
  });

  const handleLogoPick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadOwnerBrandingLogo(file);
      const url = response?.data?.data?.url;
      if (!url) throw new Error("The server did not return an image link.");
      setLogo(url);
      enqueueSnackbar("Brand image uploaded. Save changes to publish it.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error?.message || "Brand image upload failed.", { variant: "error" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const inputClass = "w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-[#f6b100]";

  if (sessionQuery.isLoading) {
    return <p className="p-6 text-sm text-[#ababab]">Checking owner session…</p>;
  }

  if (!ownerAuthenticated) {
    return (
      <section className="mx-auto max-w-lg rounded-xl border border-[#3a3a3a] bg-[#262626] p-5 sm:p-7">
        <h2 className="text-xl font-bold text-white">Owner-only branding</h2>
        <p className="mt-2 text-sm text-[#ababab]">Sign in with the configured owner credentials and verify the current Google Authenticator code.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (secondFactorRequired) verifyMutation.mutate(code);
            else loginMutation.mutate({ email, password });
          }}
        >
          {!secondFactorRequired ? (
            <>
              <label className="block space-y-1 text-sm text-[#d0d0d0]">
                <span>Owner email</span>
                <input className={inputClass} type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="block space-y-1 text-sm text-[#d0d0d0]">
                <span>Password</span>
                <input className={inputClass} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </label>
              <button className="w-full rounded-lg bg-[#f6b100] px-4 py-2.5 font-bold text-black disabled:opacity-50" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Checking…" : "Continue"}
              </button>
            </>
          ) : (
            <>
              <label className="block space-y-1 text-sm text-[#d0d0d0]">
                <span>Google Authenticator code</span>
                <input className={inputClass} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required />
              </label>
              <button className="w-full rounded-lg bg-[#f6b100] px-4 py-2.5 font-bold text-black disabled:opacity-50" disabled={verifyMutation.isPending || code.length !== 6}>
                {verifyMutation.isPending ? "Verifying…" : "Verify and open branding"}
              </button>
              <button type="button" className="w-full text-sm text-[#ababab] underline" onClick={() => { setSecondFactorRequired(false); setCode(""); }}>
                Back to password
              </button>
            </>
          )}
        </form>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-[#3a3a3a] bg-[#262626] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Restaurant branding</h2>
          <p className="mt-1 text-sm text-[#ababab]">Changes appear in the POS, receipts, and online store.</p>
        </div>
        <button type="button" className="rounded-lg border border-[#555] px-3 py-2 text-sm text-white hover:bg-white/5" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>

      {brandingQuery.isLoading ? (
        <p className="mt-6 text-sm text-[#ababab]">Loading branding…</p>
      ) : brandingQuery.isError ? (
        <p className="mt-6 text-sm text-red-300">Could not load brand settings. Please sign in again.</p>
      ) : (
        <form className="mt-6 space-y-5" onSubmit={(event) => { event.preventDefault(); saveMutation.mutate({ name, logo }); }}>
          <label className="block space-y-1 text-sm text-[#d0d0d0]">
            <span>Restaurant name</span>
            <input className={inputClass} maxLength={80} minLength={2} value={name} onChange={(event) => setName(event.target.value)} required />
          </label>

          <div>
            <span className="block text-sm text-[#d0d0d0]">Brand image</span>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] p-2">
                <img src={logo ? resolveImageUrl(logo) : fallbackLogo} alt={`${name || "Restaurant"} logo preview`} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-2">
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-[#555] px-3 py-2 text-sm text-white hover:bg-white/5">
                  {uploading ? "Uploading…" : "Upload image"}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleLogoPick} disabled={uploading} />
                </label>
                {logo && <button type="button" className="block text-sm text-[#fca5a5] underline" onClick={() => setLogo("")}>Use default image</button>}
                <p className="max-w-md text-xs text-[#8f8f8f]">Uploads are fitted into a 512 × 512 transparent image. The full logo shows in every frame without stretching or cropping.</p>
              </div>
            </div>
          </div>

          <button className="rounded-lg bg-[#f6b100] px-5 py-2.5 font-bold text-black disabled:opacity-50" disabled={saveMutation.isPending || uploading}>
            {saveMutation.isPending ? "Saving…" : "Save branding"}
          </button>
        </form>
      )}
    </section>
  );
};

export default OwnerBrandingManager;
