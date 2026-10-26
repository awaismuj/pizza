import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaEnvelope, FaSearch, FaWhatsapp } from "react-icons/fa";
import {
  getCampaignWhatsAppProvider,
  getCoupons,
  searchCouponCustomerByPhone,
  sendWhatsAppIndividualCoupon,
} from "../../https";

const responseData = (response) => response?.data?.data;

const couponMessage = (customer, coupon, templateText) => {
  const expiry = coupon.expiresAt
    ? new Intl.DateTimeFormat("en-PK", { timeZone: coupon.timezone || "Asia/Karachi", dateStyle: "medium" }).format(new Date(coupon.expiresAt))
    : "No expiry";
  const parameters = [
    String(customer.name || "Customer"),
    String(coupon.discountValue),
    String(coupon.code),
    Number(coupon.minimumSubtotal || 0).toLocaleString("en-US"),
    expiry,
  ];
  return String(templateText || "Hi {{1}}! Enjoy {{2}}% OFF with coupon code {{3}}. Minimum order: Rs {{4}}. Valid until {{5}}.")
    .replaceAll("\\n", "\n")
    .replace(/\{\{([1-5])\}\}/g, (_, index) => parameters[Number(index) - 1]);
};

const CouponSharePanel = () => {
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [emailConsentConfirmed, setEmailConsentConfirmed] = useState(false);
  const [sendFeedback, setSendFeedback] = useState("");

  const providerQuery = useQuery({
    queryKey: ["wa-campaign-provider"],
    queryFn: getCampaignWhatsAppProvider,
  });
  const couponsQuery = useQuery({
    queryKey: ["coupon-share-active"],
    queryFn: () => getCoupons({ status: "active", page: 1, limit: 100 }),
  });
  const customerQuery = useQuery({
    queryKey: ["coupon-share-customer", searchedPhone],
    queryFn: () => searchCouponCustomerByPhone(searchedPhone),
    enabled: Boolean(searchedPhone),
    retry: false,
  });
  const sendMutation = useMutation({
    mutationFn: sendWhatsAppIndividualCoupon,
    onSuccess: () => setSendFeedback("WhatsApp accepted the coupon message for delivery."),
    onError: (error) => setSendFeedback(error?.response?.data?.message || error?.message || "Could not send the WhatsApp coupon."),
  });

  const now = Date.now();
  const coupons = (responseData(couponsQuery.data) || []).filter((item) =>
    item.status === "active"
    && item.source === "admin"
    && item.discountType === "percentage"
    && item.channels?.includes("Online")
    && (!item.startsAt || new Date(item.startsAt).getTime() <= now)
    && (!item.expiresAt || new Date(item.expiresAt).getTime() > now)
    && (item.usageLimit == null || Number(item.redemptionCount) < Number(item.usageLimit))
  );
  const customer = responseData(customerQuery.data) || null;
  const coupon = coupons.find((item) => item._id === selectedCouponId);
  const providerStatus = providerQuery.data?.data?.data || providerQuery.data?.data;
  const message = customer && coupon ? couponMessage(customer, coupon, providerStatus?.templatePreviewText) : "";
  const emailHref = customer?.email && message && emailConsentConfirmed
    ? `mailto:${customer.email}?subject=${encodeURIComponent(`Your ${coupon.name} coupon`)}&body=${encodeURIComponent(message)}`
    : "";
  const cloudReady = providerStatus?.provider === "cloud" && providerStatus?.configured === true;

  const findCustomer = (event) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      setValidationMessage("Enter at least the last 9 digits of the customer's phone number.");
      setSearchedPhone("");
      setSelectedCouponId("");
      setSendFeedback("");
      sendMutation.reset();
      return;
    }
    setValidationMessage("");
    setSelectedCouponId("");
    setEmailConsentConfirmed(false);
    setSendFeedback("");
    sendMutation.reset();
    setSearchedPhone(digits);
  };

  return (
    <section className="space-y-4 rounded-lg border border-[#3a3a3a] bg-[#202020] p-5" aria-labelledby="coupon-share-title">
      <div>
        <h2 id="coupon-share-title" className="text-lg font-semibold text-white">Send a WhatsApp coupon</h2>
        <button
          type="button"
          onClick={() => window.open("https://web.whatsapp.com/", "_blank", "noopener,noreferrer")}
          className="mt-3 inline-flex items-center gap-2 rounded bg-[#25d366] px-3 py-2 text-sm font-semibold text-[#11251a] hover:bg-[#32e174]"
        >
          <FaWhatsapp aria-hidden="true" /> Open WhatsApp Web
        </button>
      </div>

      {providerQuery.isError && (
        <p className="text-sm text-red-300" role="alert">
          {providerQuery.error?.response?.data?.message || "Could not check WhatsApp Cloud API readiness."}
        </p>
      )}
      <form className="flex flex-col gap-2 sm:flex-row" onSubmit={findCustomer}>
        <label className="sr-only" htmlFor="coupon-share-phone">Customer phone number</label>
        <input
          id="coupon-share-phone"
          type="search"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            setSearchedPhone("");
            setSelectedCouponId("");
            setEmailConsentConfirmed(false);
            setValidationMessage("");
            setSendFeedback("");
            sendMutation.reset();
          }}
          placeholder="Search by customer phone number"
          className="min-w-0 flex-1 rounded border border-[#444] bg-[#191919] px-3 py-2 text-sm text-white placeholder:text-[#888]"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded bg-[#383838] px-4 py-2 text-sm font-semibold text-white hover:bg-[#454545]"
        >
          <FaSearch aria-hidden="true" /> Find customer
        </button>
      </form>

      {validationMessage && <p className="text-sm text-amber-200" role="alert">{validationMessage}</p>}
      {customerQuery.isFetching && <p className="text-sm text-[#aaa]" role="status">Searching customer…</p>}
      {customerQuery.isError && (
        <p className="text-sm text-red-300" role="alert">
          {customerQuery.error?.response?.data?.message || "Could not find the customer. Check the number and try again."}
        </p>
      )}
      {couponsQuery.isError && (
        <p className="text-sm text-red-300" role="alert">
          {couponsQuery.error?.response?.data?.message || "Could not load active coupons. Refresh the page and try again."}
        </p>
      )}

      {customer && (
        <div className="grid gap-4 rounded border border-[#3a3a3a] bg-[#191919] p-4 md:grid-cols-2">
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-white">{customer.name}</p>
            <p className="text-[#aaa]">{customer.phone}</p>
            <p className="text-[#aaa]">{customer.email || "No email on this customer record"}</p>
            <p className={customer.marketingConsent ? "text-emerald-300" : "text-amber-200"}>
              WhatsApp marketing consent: {customer.marketingConsent ? "confirmed" : "not recorded"}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block space-y-1 text-sm text-[#ccc]">
              Active coupon
              <select
                value={selectedCouponId}
                onChange={(event) => {
                  setSelectedCouponId(event.target.value);
                  setEmailConsentConfirmed(false);
                  setSendFeedback("");
                  sendMutation.reset();
                }}
                disabled={couponsQuery.isLoading || coupons.length === 0}
                className="w-full rounded border border-[#444] bg-[#1a1a1a] px-3 py-2 text-white disabled:opacity-60"
              >
                <option value="">
                  {couponsQuery.isLoading ? "Loading coupons…" : coupons.length ? "Choose a coupon" : "No compatible percentage coupons"}
                </option>
                {coupons.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} · {item.code} · {item.discountValue}% off
                  </option>
                ))}
              </select>
            </label>

            {coupon && (
              <div className="rounded border border-[#333] bg-[#202020] p-3 text-sm text-[#ccc]" aria-live="polite">
                <p className="font-semibold whitespace-pre-wrap text-white">{message}</p>
                <p className="mt-2 text-xs text-[#999]">The coupon's existing expiry, order-channel, eligibility, and usage rules still apply.</p>
              </div>
            )}

            {customer.email && coupon && (
              <label className="flex items-start gap-2 text-xs text-[#bbb]">
                <input
                  type="checkbox"
                  checked={emailConsentConfirmed}
                  onChange={(event) => setEmailConsentConfirmed(event.target.checked)}
                  className="mt-0.5"
                />
                I confirm the customer agreed to receive promotional email.
              </label>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!customer.marketingConsent || !coupon || !cloudReady || sendMutation.isPending || sendMutation.isSuccess}
                className="inline-flex items-center gap-2 rounded bg-[#25d366] px-3 py-2 text-sm font-semibold text-[#11251a] hover:bg-[#32e174] disabled:cursor-not-allowed disabled:bg-[#303030] disabled:text-[#777]"
                onClick={() => {
                  setSendFeedback("");
                  sendMutation.mutate({ customerId: customer._id, couponId: coupon._id });
                }}
              >
                <FaWhatsapp aria-hidden="true" /> {sendMutation.isPending ? "Sending…" : sendMutation.isSuccess ? "Sent" : "Send via WhatsApp"}
              </button>
              <a
                href={emailHref || undefined}
                aria-disabled={!emailHref}
                className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${
                  emailHref ? "bg-[#383838] text-white hover:bg-[#454545]" : "cursor-not-allowed bg-[#303030] text-[#777]"
                }`}
                onClick={(event) => {
                  if (!emailHref) event.preventDefault();
                }}
              >
                <FaEnvelope aria-hidden="true" /> Prepare email
              </a>
            </div>
            {!customer.marketingConsent && (
              <p className="text-xs text-amber-200">WhatsApp marketing is disabled until the customer's explicit consent is recorded.</p>
            )}
            {sendFeedback && (
              <p className={`text-sm ${sendMutation.isError ? "text-red-300" : "text-emerald-300"}`} role={sendMutation.isError ? "alert" : "status"}>
                {sendFeedback}
              </p>
            )}
            {customer.email && !emailHref && (
              <p className="text-xs text-[#999]">Confirm email consent and choose a coupon to prepare the message in your device's mail app.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CouponSharePanel;
