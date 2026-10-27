import React, { useCallback, useEffect, useRef, useState } from "react";
import { I } from "./AppIcons.jsx";
import { uploadPaymentProof } from "./api";
import { resolveImageUrl } from "./utils";
import defaultQr from "./assets/jazzcash-raast-qr.png";

/* JazzCash / Raast QR payment for checkout: the method picker, the payment
   card (QR, Till ID, amount, instructions), the proof form and the hook that
   holds its state. Kept out of App.jsx so the checkout there only mounts it. */

export const PAY_COD = "cod";
export const PAY_JAZZ = "jazzcash";

export const DEFAULT_PAYMENTS = {
  codEnabled: true,
  jazzcashEnabled: true,
  merchantName: "GEN Z FOOD",
  tillId: "984661930",
  dialCode: "*786*10#",
  qrImage: "",
};

const MAX_BYTES = 5 * 1024 * 1024;
const TID_RE = /^[A-Za-z0-9]{6,30}$/;
const SENDER_RE = /^[\p{L}\p{N} .+\-']{3,60}$/u;

/* ------------------------------- state hook ------------------------------- */

export function useJazzForm() {
  const [tid, setTid] = useState("");
  const [sender, setSender] = useState("");
  const [proofId, setProofId] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const seq = useRef(0);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const pickFile = useCallback(async (file) => {
    if (!file) return;
    setUploadError("");
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setUploadError("Please choose a JPG or PNG screenshot.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("That screenshot is over 5 MB. Please choose a smaller image.");
      return;
    }
    const mine = ++seq.current;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    setProofId("");
    setUploading(true);
    try {
      const res = await uploadPaymentProof(file);
      if (mine === seq.current) setProofId(res.data.proofId);
    } catch (err) {
      if (mine === seq.current) {
        setPreview("");
        setFileName("");
        setUploadError(err.message);
      }
    } finally {
      if (mine === seq.current) setUploading(false);
    }
  }, []);

  const clearFile = useCallback(() => {
    seq.current += 1;
    setPreview("");
    setFileName("");
    setProofId("");
    setUploading(false);
    setUploadError("");
  }, []);

  const reset = useCallback(() => {
    setTid("");
    setSender("");
    clearFile();
  }, [clearFile]);

  const tidOk = TID_RE.test(tid.replace(/\s+/g, ""));
  const senderOk = SENDER_RE.test(sender.trim().replace(/\s+/g, " "));
  const ready = tidOk && senderOk && Boolean(proofId) && !uploading;

  return {
    tid, setTid, sender, setSender, proofId, preview, fileName,
    uploading, uploadError, pickFile, clearFile, reset,
    tidOk, senderOk, ready,
  };
}

/* --------------------------------- helpers -------------------------------- */

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
};

/* ------------------------------ method picker ----------------------------- */

export const PaymentMethodPicker = ({ cfg, value, onChange, pickup = false, showCashDescription = true }) => {
  const options = [
    cfg.codEnabled && { id: PAY_COD, title: pickup ? "Pay at Pickup" : "Cash on Delivery", sub: showCashDescription ? (pickup ? "Pay at the counter when you collect" : "Pay the rider when it arrives") : "", icon: <I.Cash /> },
    cfg.jazzcashEnabled && { id: PAY_JAZZ, title: "Pay via JazzCash / Raast QR", sub: "Scan, pay & upload the screenshot", icon: <I.Phone /> },
  ].filter(Boolean);

  return (
    <fieldset className="pay-methods">
      <legend>Payment method</legend>
      {options.map((o) => (
        <label key={o.id} className={`pay-method${value === o.id ? " is-on" : ""}`}>
          <input type="radio" name="payMethod" value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
          <span className="pay-ico" aria-hidden="true">{o.icon}</span>
          <span className="pay-text">
            <b>{o.title}</b>
            <small>{o.sub}</small>
          </span>
          <span className="pay-radio" aria-hidden="true" />
        </label>
      ))}
    </fieldset>
  );
};

/* ------------------------------ payment card ------------------------------ */

export const JazzCashCard = ({ cfg, amountLabel, jazz }) => {
  const [copied, setCopied] = useState(false);
  const [downloadNote, setDownloadNote] = useState("");
  const fileInput = useRef(null);
  const qrSrc = cfg.qrImage ? resolveImageUrl(cfg.qrImage) : defaultQr;

  const handleCopy = async () => {
    const ok = await copyText(cfg.tillId);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloadNote("");
    try {
      const res = await fetch(qrSrc);
      if (!res.ok) throw new Error("bad response");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cfg.merchantName.replace(/\s+/g, "-")}-JazzCash-QR.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // Cross-origin image that can't be fetched: let the browser open it.
      window.open(qrSrc, "_blank", "noopener,noreferrer");
      setDownloadNote("Opened in a new tab — press and hold the image to save it.");
    }
  };

  return (
    <div className="pay-card">
      <div className="pay-amount" aria-live="polite">
        <span>Amount to pay</span>
        <strong>{amountLabel}</strong>
        <small>Send exactly this amount so we can match your payment.</small>
      </div>

      <div className="pay-grid">
        <div className="pay-qr">
          <img src={qrSrc} alt={`${cfg.merchantName} JazzCash and Raast payment QR code`} width="340" height="480" />
          <p>Scan with JazzCash, Easypaisa or any banking app</p>
        </div>

        <div className="pay-info">
          <div className="pay-row">
            <span>Merchant</span>
            <b>{cfg.merchantName}</b>
          </div>
          <div className="pay-row">
            <span>Till ID</span>
            <div className="pay-till">
              <b>{cfg.tillId}</b>
              <button type="button" className="pay-mini" onClick={handleCopy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <button type="button" className="pay-btn-ghost" onClick={handleDownload}>
            ⬇ Download QR
          </button>
          {downloadNote && <p className="pay-hint">{downloadNote}</p>}
          <p className="pay-dial">
            Or dial <b>{cfg.dialCode}</b> and enter the Till ID.
          </p>
        </div>
      </div>

      <div className="pay-proof">
        <h4>After paying, add your payment details</h4>

        <label className="gzp-field">
          <span>Transaction ID (TID)</span>
          <input
            value={jazz.tid}
            onChange={(e) => jazz.setTid(e.target.value.replace(/[^A-Za-z0-9 ]/g, "").slice(0, 34))}
            placeholder="From your payment confirmation SMS / app"
            autoCapitalize="characters"
            autoComplete="off"
            required
            aria-invalid={jazz.tid !== "" && !jazz.tidOk}
          />
          {jazz.tid !== "" && !jazz.tidOk && <em className="pay-err">TID should be 6–30 letters or digits.</em>}
        </label>

        <label className="gzp-field">
          <span>Sender's name or mobile number</span>
          <input
            value={jazz.sender}
            onChange={(e) => jazz.setSender(e.target.value.slice(0, 60))}
            placeholder="Account holder name or 03001234567"
            autoComplete="off"
            required
            aria-invalid={jazz.sender !== "" && !jazz.senderOk}
          />
          {jazz.sender !== "" && !jazz.senderOk && <em className="pay-err">Use 3–60 letters or digits, no special symbols.</em>}
        </label>

        <div className="gzp-field">
          <span>Payment screenshot <small>(JPG or PNG, up to 5 MB)</small></span>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg"
            className="pay-file"
            onChange={(e) => {
              jazz.pickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {jazz.preview ? (
            <div className="pay-shot">
              <img src={jazz.preview} alt="Your payment screenshot" />
              <div>
                <b>{jazz.fileName}</b>
                <small className={jazz.proofId ? "ok" : ""}>
                  {jazz.uploading ? "Uploading…" : jazz.proofId ? "Uploaded" : ""}
                </small>
                <button type="button" className="pay-mini" onClick={() => { jazz.clearFile(); fileInput.current?.click(); }}>
                  Change
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="pay-drop" onClick={() => fileInput.current?.click()}>
              <I.Camera aria-hidden="true" style={{ marginRight: 8, verticalAlign: "-2px" }} />Choose screenshot
            </button>
          )}
          {jazz.uploadError && <em className="pay-err" role="alert">{jazz.uploadError}</em>}
        </div>

        <p className="pay-hint">
          We'll check your payment and confirm your order shortly. Place Order unlocks once all three details are filled.
        </p>
      </div>
    </div>
  );
};

/* ------------------------------- order status ------------------------------ */

export const PaymentStatusBanner = ({ order, whatsappHref }) => {
  const p = order?.payment;
  if (!p || p.method !== "JazzCash/Raast") return null;

  if (order.orderStatus === "Payment Pending Verification") {
    return (
      <div className="pay-banner is-wait">
        <b><I.Hourglass aria-hidden="true" style={{ marginRight: 6, verticalAlign: "-2px" }} />Payment under verification</b>
        <p>Thanks! We'll verify your payment and confirm your order shortly. This page updates automatically.</p>
        <small>TID {p.tid}</small>
      </div>
    );
  }
  if (p.status === "Rejected") {
    return (
      <div className="pay-banner is-bad" role="alert">
        <b><I.CrossCircle aria-hidden="true" style={{ marginRight: 6, verticalAlign: "-2px" }} />Payment not verified</b>
        <p>{p.rejectionReason || "We couldn't confirm your payment."}</p>
        <a className="pay-btn-wa" href={whatsappHref} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
      </div>
    );
  }
  if (p.status === "Verified") {
    return (
      <div className="pay-banner is-ok">
        <b><I.CheckCircle aria-hidden="true" style={{ marginRight: 6, verticalAlign: "-2px" }} />Payment verified</b>
        <p>Paid via JazzCash/Raast · TID {p.tid}</p>
      </div>
    );
  }
  return null;
};
