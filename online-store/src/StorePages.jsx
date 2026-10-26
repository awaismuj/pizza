import React from "react";

const PageShell = ({ children }) => (
  <main style={{ minHeight: "100vh", background: "#fff8ef", color: "#252525", fontFamily: "system-ui, sans-serif", padding: "clamp(24px, 6vw, 72px) 20px" }}>
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <nav aria-label="Store pages" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <a href="/" style={{ color: "#c92f27" }}>Home</a>
        <a href="/help" style={{ color: "#c92f27" }}>Help</a>
        <a href="/terms" style={{ color: "#c92f27" }}>Terms and Conditions</a>
        <a href="/privacy" style={{ color: "#c92f27" }}>Privacy Policy</a>
      </nav>
      {children}
    </div>
  </main>
);

export const PrivacyPolicy = () => (
  <PageShell>
    <article>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0 0 8px" }}>Privacy Policy</h1>
      <p>Last updated: October 22, 2026</p>
      <p>GenZ Pizza Land respects your privacy. This policy explains what information is used when you browse our online store, place an order, create a customer account, or submit a review.</p>

      <h2>Information we collect</h2>
      <ul>
        <li>Order details you provide, such as your name, phone number, delivery address, selected items, and fulfillment instructions.</li>
        <li>Account details, if you register, such as your name, email, phone number, date of birth if supplied, and marketing preference.</li>
        <li>Payment verification details for JazzCash/Raast orders, including the transaction information and screenshot you choose to upload.</li>
        <li>Reviews and ratings you submit. Do not include sensitive personal information in a public review.</li>
        <li>Basic technical information that our hosting and API providers may log to secure and operate the service.</li>
      </ul>

      <h2>How we use information</h2>
      <p>We use this information to prepare and deliver orders, confirm payments, provide order status, support customer accounts, prevent abuse, respond to requests, and meet applicable legal or accounting requirements. Marketing messages are sent only when you opt in; you can withdraw that choice in your account.</p>

      <h2>Analytics</h2>
      <p>If Google Analytics is enabled for this store, Google receives usage information such as page views and browser/device details to help us understand how visitors use the site. Google processes this information under its own privacy policy. You can manage cookies and other browser storage through your browser settings.</p>

      <h2>Sharing and storage</h2>
      <p>Order and account information is processed by the restaurant's ordering system and its hosting, database, email, and payment-verification providers as needed to provide the service. We do not sell your personal information. Payment screenshots are used for verification and are not a substitute for confirmation from the payment provider.</p>

      <h2>Retention and your choices</h2>
      <p>We keep order and financial records for operational, dispute-resolution, and legal recordkeeping needs. Account and review information is retained while needed to provide those features. You may request access, correction, or deletion of information that is not required to be retained by contacting the restaurant.</p>

      <h2>Security and children</h2>
      <p>We use access controls and technical safeguards appropriate to operate the service, but no internet transmission or storage system can be guaranteed completely secure. This store is intended for customers placing orders with the restaurant; an adult should place orders on behalf of children.</p>

      <h2>Contact us</h2>
      <p>For a privacy question or request, contact GenZ Pizza Land using the WhatsApp contact link on our <a href="/#section-contact" style={{ color: "#c92f27" }}>home page</a>.</p>
    </article>
  </PageShell>
);

export const TermsAndConditions = () => (
  <PageShell>
    <article>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0 0 8px" }}>Terms and Conditions</h1>
      <p>Last updated: October 26, 2026</p>
      <p>These terms apply when you browse or place an order through the GenZ Pizza Land online store. By using the store, you agree to these terms. If you have a question, please visit our <a href="/help" style={{ color: "#c92f27" }}>Help page</a> or contact the restaurant before placing an order.</p>

      <h2>Orders and availability</h2>
      <p>Menu items, prices, offers, delivery availability and estimated times may change. Your order request is subject to restaurant confirmation and item availability. Please check your order details, phone number, delivery address and the total shown at checkout before submitting. We may contact you if we need to clarify an order or cannot fulfil an item as requested.</p>

      <h2>Delivery, pickup and charges</h2>
      <p>Delivery and pickup are offered in areas and at times shown by the store. Any delivery fee and applicable tax are shown during checkout before you submit your order. Please provide an accurate address and contact number, and be available to receive or collect your order.</p>

      <h2>Payments</h2>
      <p>Available payment methods are shown at checkout and may include cash on delivery or pickup, and JazzCash / Raast QR payment. For QR payments, follow the checkout instructions. A payment screenshot alone does not confirm that funds were received; submitted payments are subject to verification.</p>

      <h2>Changes, cancellations and order issues</h2>
      <p>If you need to change or cancel an order, contact the restaurant as soon as possible using the details on the <a href="/#section-contact" style={{ color: "#c92f27" }}>home page</a>. We cannot guarantee a change or cancellation after preparation has started. If an order is missing, incorrect or has another issue, contact us promptly with your order details so we can review it. Any refund or payment correction is handled after review of the order and payment record.</p>

      <h2>Website use</h2>
      <p>Please provide accurate information and use the store only for lawful purposes. Do not interfere with the website, attempt unauthorized access, or submit false or abusive orders, reviews or account information.</p>

      <h2>Updates and contact</h2>
      <p>We may update these terms when our service changes; the latest version will be posted on this page. For help with an order, see <a href="/help" style={{ color: "#c92f27" }}>customer help</a>. Our <a href="/privacy" style={{ color: "#c92f27" }}>Privacy Policy</a> explains how information is used.</p>
    </article>
  </PageShell>
);

export const HelpPage = () => (
  <PageShell>
    <article>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0 0 8px" }}>Customer Help</h1>
      <p>Need help ordering, paying or checking on an order? Here are quick answers. For personal order assistance, <a href="/#section-contact" style={{ color: "#c92f27" }}>contact GenZ Pizza Land</a>.</p>

      <h2>How do I place an order?</h2>
      <p>Choose items from the <a href="/" style={{ color: "#c92f27" }}>online menu</a>, add them to your order, select delivery or pickup, enter your contact details and review the total before submitting.</p>

      <h2>Where do you deliver, and how much does it cost?</h2>
      <p>Delivery availability and any delivery fee are shown during checkout for your address. Pickup availability is also shown by the store.</p>

      <h2>How can I pay?</h2>
      <p>Choose from the methods offered at checkout, which may include cash on delivery or pickup and JazzCash / Raast QR. If you pay by QR, follow the payment instructions and allow the restaurant to verify it. An uploaded screenshot by itself is not payment confirmation.</p>

      <h2>How do I track my order?</h2>
      <p>Use the order tracking option on the <a href="/" style={{ color: "#c92f27" }}>home page</a> and provide the requested order details.</p>

      <h2>Can I change or cancel my order?</h2>
      <p><a href="/#section-contact" style={{ color: "#c92f27" }}>Contact the restaurant as soon as possible</a> with your order details. Changes or cancellation may not be possible after preparation has started.</p>

      <h2>There is a problem with my order or payment</h2>
      <p>Contact the restaurant promptly and include your order details and the phone number used at checkout. Do not post payment details or personal information in a public review.</p>

      <h2>More information</h2>
      <p>Read our <a href="/terms" style={{ color: "#c92f27" }}>Terms and Conditions</a> and <a href="/privacy" style={{ color: "#c92f27" }}>Privacy Policy</a>.</p>
    </article>
  </PageShell>
);

export const StoreNotFound = () => (
  <PageShell>
    <section style={{ paddingTop: "15vh", textAlign: "center" }}>
      <p style={{ color: "#c92f27", fontWeight: 700 }}>404 · Page not found</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>This page isn’t on the menu.</h1>
      <p>That address may be incorrect, or the page may have moved.</p>
      <a href="/" style={{ display: "inline-block", marginTop: 16, borderRadius: 999, background: "#e6392f", color: "white", padding: "12px 20px", textDecoration: "none" }}>Return to the store</a>
    </section>
  </PageShell>
);
