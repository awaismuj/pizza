import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaWhatsapp } from "react-icons/fa";
import { getCoupons, lookupCouponCustomer, sendCouponToCustomer } from "../../https";
import {
  closeWhatsAppWindow,
  navigateWhatsAppWindow,
  openWhatsAppWindow,
  prepareWhatsAppWindow,
  toWhatsAppNumber,
  whatsAppChatUrl,
} from "../../utils/whatsapp";

const inputClass = "w-full rounded border border-[#444] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#777]";
const labelClass = "block space-y-1 text-sm text-[#ccc]";

const amountText = (coupon) =>
  coupon.discountType === "percentage"
    ? `${coupon.discountValue}% off`
    : `Rs ${Number(coupon.discountValue).toLocaleString()} off`;

const useDebounced = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const copyText = async (text, doneMessage) => {
  try {
    await navigator.clipboard.writeText(text);
    enqueueSnackbar(doneMessage, { variant: "success" });
  } catch {
    enqueueSnackbar("Clipboard access is unavailable. Select and copy the text manually.", { variant: "warning" });
  }
};

const emailLine = (email) => {
  switch (email?.status) {
    case "sent":
      return { tone: "text-[#02ca3a]", text: `Also emailed to ${email.to}.` };
    case "failed":
      return { tone: "text-amber-300", text: `The email to ${email.to} could not be sent. WhatsApp is still ready.` };
    case "not_configured":
      return { tone: "text-amber-300", text: "Email is not set up on the server (SMTP), so only WhatsApp was prepared." };
    default:
      return { tone: "text-[#aaa]", text: "No email on file for this number, so this goes by WhatsApp only." };
  }
};

// Send one coupon to one customer: type or search the number, press the
// button, and WhatsApp opens with the coupon message already typed in. If
// the customer has an email on file the server emails them automatically.
const SendCouponPanel = ({ dockRef, couponId, onCouponChange }) => {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("campaign");
  const [result, setResult] = useState(null);
  const nameTouched = useRef(false);
  const openedWindow = useRef(null);

  const couponsQuery = useQuery({
    queryKey: ["coupons", "sendable"],
    queryFn: () => getCoupons({ limit: 100 }),
    placeholderData: (previous) => previous,
  });
  const sendable = useMemo(
    () => (couponsQuery.data?.data?.data || []).filter((coupon) => ["active", "scheduled"].includes(coupon.status)),
    [couponsQuery.data]
  );
  const coupon = sendable.find((entry) => entry._id === couponId);

  const phoneDigits = toWhatsAppNumber(phone);
  const lookupPhone = useDebounced(phoneDigits);
  const lookupQuery = useQuery({
    queryKey: ["coupon-customer", lookupPhone],
    queryFn: () => lookupCouponCustomer(lookupPhone),
    enabled: Boolean(lookupPhone),
    staleTime: 30000,
    retry: false,
  });
  const lookup = lookupPhone && lookupPhone === phoneDigits ? lookupQuery.data?.data?.data : null;

  useEffect(() => {
    if (lookup?.found && lookup.name && lookup.name !== "Order customer" && !nameTouched.current) {
      setName(lookup.name);
    }
  }, [lookup]);

  const canPrivate = Boolean(lookup?.canReceivePrivateCode);
  const effectiveMode = mode === "private" && canPrivate ? "private" : "campaign";

  const sendMutation = useMutation({
    mutationFn: sendCouponToCustomer,
    onSuccess: (response) => {
      const data = response.data.data;
      const chatUrl = whatsAppChatUrl(data.whatsapp.phone, data.message);
      setResult({ ...data, chatUrl });
      // Point the WhatsApp window (opened on the click) at this customer's chat.
      if (!navigateWhatsAppWindow(chatUrl)) {
        enqueueSnackbar("WhatsApp window was blocked. Use “Open WhatsApp chat” below.", { variant: "warning" });
      }
      queryClient.invalidateQueries({ queryKey: ["coupon-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Could not prepare this coupon.", { variant: "error" });
      // Do not leave an empty WhatsApp window behind when nothing was sent.
      if (openedWindow.current && !openedWindow.current.reused) closeWhatsAppWindow();
    },
  });

  const submit = (event) => {
    event.preventDefault();
    if (!couponId || !coupon) {
      enqueueSnackbar("Choose a coupon first.", { variant: "warning" });
      return;
    }
    if (!phoneDigits) {
      enqueueSnackbar("Enter a valid mobile number, e.g. 0301 2345678.", { variant: "warning" });
      return;
    }
    // Open the window right here, inside the click, so the browser allows it.
    openedWindow.current = prepareWhatsAppWindow(dockRef.current);
    setResult(null);
    sendMutation.mutate({
      couponId,
      phone,
      name: name.trim(),
      email: lookup?.hasEmail ? "" : email.trim(),
      mode: effectiveMode,
    });
  };

  const reset = () => {
    setPhone("");
    setName("");
    setEmail("");
    setResult(null);
    nameTouched.current = false;
  };

  const reopenChat = () => {
    if (!result) return;
    const handle = openWhatsAppWindow(dockRef.current, result.chatUrl);
    if (!handle) enqueueSnackbar("Your browser blocked the WhatsApp window. Allow pop-ups for this site.", { variant: "warning" });
  };

  const status = emailLine(result?.email);

  return (
    <section className="space-y-4 rounded-xl bg-[#262626] p-5" aria-label="Send a coupon">
      <div>
        <h2 className="text-xl font-semibold text-white">Send a coupon</h2>
        <p className="text-sm text-[#aaa]">Pick a coupon, enter the customer&apos;s number, and WhatsApp opens with the message ready. Press Send there.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <label className={labelClass}>
          Coupon
          <select
            required
            className={inputClass}
            value={couponId}
            onChange={(event) => { onCouponChange(event.target.value); setResult(null); }}
          >
            <option value="">{couponsQuery.isLoading ? "Loading coupons…" : "Choose a coupon"}</option>
            {sendable.map((entry) => (
              <option key={entry._id} value={entry._id}>
                {entry.name} · {entry.code} · {amountText(entry)}
              </option>
            ))}
          </select>
        </label>
        {couponsQuery.isError && <p className="text-sm text-red-300" role="alert">Coupons could not be loaded.</p>}
        {!couponsQuery.isLoading && !couponsQuery.isError && sendable.length === 0 && (
          <p className="text-sm text-amber-200">No active coupons yet. Create one in the Campaigns tab and set its status to active.</p>
        )}

        <label className={labelClass}>
          Customer number
          <input
            required
            type="tel"
            inputMode="tel"
            className={inputClass}
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setResult(null);
              if (!nameTouched.current) setName("");
            }}
            placeholder="0301 2345678 or +92 301 2345678"
            autoComplete="off"
          />
        </label>
        <p className="min-h-5 text-xs text-[#aaa]" aria-live="polite">
          {!phone
            ? "Type the number you searched for in WhatsApp."
            : !phoneDigits
            ? "That doesn't look like a complete mobile number yet."
            : lookupQuery.isFetching
            ? "Looking up this number…"
            : lookup?.found
            ? `Known customer${lookup.name && lookup.name !== "Order customer" ? `: ${lookup.name}` : ""}.`
            : "New number. The coupon will be sent without an account."}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Name (optional)
            <input
              className={inputClass}
              maxLength={120}
              value={name}
              onChange={(event) => { nameTouched.current = true; setName(event.target.value); }}
              placeholder="Used in the greeting"
            />
          </label>
          {lookup?.hasEmail ? (
            <div className="rounded border border-[#3d5a47] bg-[#1c2620] px-3 py-2 text-sm text-[#c9d8cf]">
              <span className="block text-xs text-[#9db5a5]">Email on file</span>
              {lookup.emailMasked}
              <span className="block text-xs text-[#9db5a5]">They will also get this coupon by email automatically.</span>
            </div>
          ) : (
            <label className={labelClass}>
              Email (optional)
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Also send by email"
              />
            </label>
          )}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm text-[#ccc]">Which code?</legend>
          <label className={`flex cursor-pointer items-start gap-2 rounded border p-3 text-sm ${effectiveMode === "campaign" ? "border-[#f6b100] bg-[#2f2a18]" : "border-[#444]"}`}>
            <input type="radio" name="coupon-mode" checked={effectiveMode === "campaign"} onChange={() => setMode("campaign")} />
            <span className="text-white">
              Shared code{coupon ? ` (${coupon.code})` : ""}
              <span className="block text-xs text-[#aaa]">Works for any number. Use limits on the coupon still apply.</span>
            </span>
          </label>
          <label className={`flex items-start gap-2 rounded border p-3 text-sm ${canPrivate ? "cursor-pointer" : "cursor-not-allowed opacity-60"} ${effectiveMode === "private" ? "border-[#f6b100] bg-[#2f2a18]" : "border-[#444]"}`}>
            <input type="radio" name="coupon-mode" disabled={!canPrivate} checked={effectiveMode === "private"} onChange={() => setMode("private")} />
            <span className="text-white">
              Private one-time code
              <span className="block text-xs text-[#aaa]">
                {canPrivate
                  ? "A new code only this customer can use."
                  : "Only for customers with an account and a verified email."}
              </span>
            </span>
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={sendMutation.isPending || !couponId || !phoneDigits}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-3 font-semibold text-[#11251a] hover:bg-[#32e174] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaWhatsapp aria-hidden="true" />
          {sendMutation.isPending ? "Preparing…" : "Send via WhatsApp"}
        </button>
      </form>

      {result && (
        <div className="space-y-3 rounded-lg border border-[#3d5a47] bg-[#1c2620] p-4" role="status">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-white">
              Ready to send <code className="rounded bg-black/30 px-2 py-0.5 font-bold">{result.code}</code>
            </p>
            <button type="button" className="text-sm text-[#f6b100]" onClick={() => copyText(result.code, "Code copied.")}>Copy code</button>
          </div>
          <p className="text-sm text-[#c9d8cf]">The message is typed into the chat. Press Send in WhatsApp to deliver it.</p>
          <p className={`text-sm ${status.tone}`}>{status.text}</p>
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded bg-black/30 p-3 text-xs text-[#ddd]">{result.message}</pre>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={reopenChat} className="rounded bg-[#25d366] px-3 py-2 text-sm font-semibold text-[#11251a] hover:bg-[#32e174]">
              Open WhatsApp chat
            </button>
            <button type="button" onClick={() => copyText(result.message, "Message copied.")} className="rounded bg-[#353535] px-3 py-2 text-sm font-semibold text-white hover:bg-[#444]">
              Copy message
            </button>
            <button type="button" onClick={reset} className="rounded px-3 py-2 text-sm font-semibold text-[#bbb] hover:bg-[#333]">
              Next customer
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

SendCouponPanel.propTypes = {
  dockRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  couponId: PropTypes.string.isRequired,
  onCouponChange: PropTypes.func.isRequired,
};

export default SendCouponPanel;
