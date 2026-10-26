import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEnvelope, FaSearch, FaWhatsapp } from "react-icons/fa";
import { getCoupons, searchCouponCustomerByPhone } from "../../https";

const responseData = (response) => response?.data?.data;

const normalizeWhatsAppNumber = (phone) => {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("92")) {
    if (digits.length === 13 && digits[2] === "0") digits = `92${digits.slice(3)}`;
  } else if (digits.startsWith("0")) {
    digits = `92${digits.slice(1)}`;
  } else if (digits.length === 10 && digits.startsWith("3")) {
    digits = `92${digits}`;
  }
  return /^\d{10,15}$/.test(digits) ? digits : "";
};

const couponMessage = (customer, coupon) => {
  const discount = coupon.discountType === "percentage"
    ? `${coupon.discountValue}% off`
    : `Rs ${Number(coupon.discountValue).toLocaleString()} off`;
  const minimum = Number(coupon.minimumSubtotal) > 0
    ? ` Minimum order: Rs ${Number(coupon.minimumSubtotal).toLocaleString()}.`
    : "";
  const expiry = coupon.expiresAt
    ? ` Valid until ${new Date(coupon.expiresAt).toLocaleDateString()}.`
    : "";
  const channels = Array.isArray(coupon.channels) && coupon.channels.length
    ? ` Available for ${coupon.channels.join(" and ")} orders.`
    : "";
  return `Hi ${customer.name}, enjoy ${discount} with coupon code ${coupon.code}.${minimum}${expiry}${channels} Terms and eligible items apply.`;
};

const CouponSharePanel = () => {
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [emailConsentConfirmed, setEmailConsentConfirmed] = useState(false);

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

  const coupons = (responseData(couponsQuery.data) || []).filter((coupon) => coupon.status === "active");
  const customer = responseData(customerQuery.data) || null;
  const coupon = coupons.find((item) => item._id === selectedCouponId);
  const whatsappNumber = customer ? normalizeWhatsAppNumber(customer.phone) : "";
  const message = customer && coupon ? couponMessage(customer, coupon) : "";
  const whatsAppHref = whatsappNumber && message
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : "";
  const emailHref = customer?.email && message && emailConsentConfirmed
    ? `mailto:${customer.email}?subject=${encodeURIComponent(`Your ${coupon.name} coupon`)}&body=${encodeURIComponent(message)}`
    : "";

  const findCustomer = (event) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      setValidationMessage("Enter at least the last 9 digits of the customer's phone number.");
      setSearchedPhone("");
      return;
    }
    setValidationMessage("");
    setSelectedCouponId("");
    setEmailConsentConfirmed(false);
    setSearchedPhone(digits);
  };

  return (
    <section className="space-y-4 rounded-lg border border-[#3a3a3a] bg-[#202020] p-5" aria-labelledby="coupon-share-title">
      <div>
        <h2 id="coupon-share-title" className="text-lg font-semibold text-white">Send a coupon to one customer</h2>
        <p className="mt-1 text-sm text-[#aaa]">
          Find a customer by phone, choose an active coupon, then review a prefilled message. WhatsApp and email open for you to send manually.
        </p>
      </div>

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
                }}
                disabled={couponsQuery.isLoading || coupons.length === 0}
                className="w-full rounded border border-[#444] bg-[#1a1a1a] px-3 py-2 text-white disabled:opacity-60"
              >
                <option value="">
                  {couponsQuery.isLoading ? "Loading coupons…" : coupons.length ? "Choose a coupon" : "No active coupons"}
                </option>
                {coupons.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} · {item.code} · {item.discountType === "percentage" ? `${item.discountValue}%` : `Rs ${item.discountValue}`}
                  </option>
                ))}
              </select>
            </label>

            {coupon && (
              <div className="rounded border border-[#333] bg-[#202020] p-3 text-sm text-[#ccc]" aria-live="polite">
                <p className="font-semibold text-white">{couponMessage(customer, coupon)}</p>
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
              <a
                href={whatsAppHref || undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!whatsAppHref || !customer.marketingConsent}
                className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${
                  whatsAppHref && customer.marketingConsent
                    ? "bg-[#25d366] text-[#11251a] hover:bg-[#32e174]"
                    : "cursor-not-allowed bg-[#303030] text-[#777]"
                }`}
                onClick={(event) => {
                  if (!whatsAppHref || !customer.marketingConsent) event.preventDefault();
                }}
              >
                <FaWhatsapp aria-hidden="true" /> Prepare WhatsApp message
              </a>
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
