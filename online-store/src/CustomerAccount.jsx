import React, { useEffect, useState } from "react";
import {
  getCustomerProfile,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
} from "./api";

const emptyForm = { name: "", email: "", phone: "", password: "", dateOfBirth: "" };

export function useCustomerAccount() {
  const [customer, setCustomer] = useState(null);
  useEffect(() => {
    if (!sessionStorage.getItem("gzp_customer_token")) return;
    let active = true;
    getCustomerProfile()
      .then((response) => { if (active) setCustomer(response.data); })
      .catch(() => { if (active) sessionStorage.removeItem("gzp_customer_token"); });
    return () => { active = false; };
  }, []);
  return [customer, setCustomer];
}

export default function CustomerAccount({ customer, setCustomer, open, setOpen }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const close = () => {
    setOpen(false);
    setMessage("");
    setError("");
    setForm(emptyForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "register") {
        const response = await registerCustomer(form);
        setMessage(response.message);
        setMode("login");
      } else {
        const response = await loginCustomer({ email: form.email, password: form.password });
        setCustomer(response.data.customer);
        setMessage(`Welcome, ${response.data.customer.name}.`);
      }
    } catch (requestError) {
      setError(requestError.message || "Could not complete this account request.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    try {
      await logoutCustomer();
      setCustomer(null);
      setMessage("You are signed out.");
    } catch (requestError) {
      setCustomer(null);
      setError(`Signed out on this device, but the server could not revoke the session: ${requestError.message || "request failed"}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {open && (
        <div className="gzp-sheet-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="gzp-sheet" role="dialog" aria-modal="true" aria-label="Customer account">
            <div className="gzp-sheet-head">
              <h2>{customer ? "Your account" : mode === "register" ? "Create an account" : "Customer sign in"}</h2>
              <button className="gzp-icon-btn" type="button" onClick={close} aria-label="Close account dialog">×</button>
            </div>
            <div className="gzp-sheet-body">
              {customer ? (
                <div className="gzp-form">
                  <p>{customer.name}<br />{customer.email}<br />{customer.phone}</p>
                  <button type="button" className="gzp-btn gzp-btn-ghost" disabled={busy} onClick={signOut}>Sign out</button>
                </div>
              ) : (
                <form className="gzp-form" onSubmit={submit}>
                  {mode === "register" && (
                    <>
                      <label className="gzp-field"><span>Name</span><input required minLength={2} maxLength={120} value={form.name} onChange={(event) => update("name", event.target.value)} /></label>
                      <label className="gzp-field"><span>Mobile number</span><input required type="tel" inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></label>
                      <label className="gzp-field"><span>Date of birth (optional)</span><input type="date" value={form.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} /></label>
                    </>
                  )}
                  <label className="gzp-field"><span>Email</span><input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></label>
                  <label className="gzp-field"><span>Password {mode === "register" && "(at least 12 characters)"}</span><input required type="password" minLength={mode === "register" ? 12 : undefined} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} value={form.password} onChange={(event) => update("password", event.target.value)} /></label>
                  <button className="gzp-btn gzp-btn-primary gzp-btn-block" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button>
                  <button type="button" className="gzp-btn gzp-btn-ghost gzp-btn-block" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage(""); }}>
                    {mode === "login" ? "Create an account" : "I already have an account"}
                  </button>
                </form>
              )}
              {message && <p role="status">{message}</p>}
              {error && <p className="gzp-error" role="alert">{error}</p>}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
