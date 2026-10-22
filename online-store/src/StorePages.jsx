import React from "react";

const PageShell = ({ children }) => (
  <main style={{ minHeight: "100vh", background: "#fff8ef", color: "#252525", fontFamily: "system-ui, sans-serif", padding: "clamp(24px, 6vw, 72px) 20px" }}>
    <div style={{ maxWidth: 820, margin: "0 auto" }}>{children}</div>
  </main>
);

export const PrivacyPolicy = () => (
  <PageShell>
    <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
      <ol style={{ display: "flex", gap: 8, listStyle: "none", margin: 0, padding: 0 }}>
        <li><a href="/" style={{ color: "#c92f27" }}>Home</a></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">Privacy Policy</li>
      </ol>
    </nav>
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
