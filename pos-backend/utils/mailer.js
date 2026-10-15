const nodemailer = require("nodemailer");
const config = require("../config/config");

// Lazily build the transporter so the app doesn't crash on boot if SMTP
// env vars aren't set yet — emails will just fail (and get logged) until
// they are.
let transporter = null;
const getTransporter = () => {
  if (transporter) return transporter;

  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  return transporter;
};

const sendMail = async ({ to, subject, html, attachments }) => {
  const t = getTransporter();

  if (!t) {
    console.warn(
      `⚠️ SMTP is not configured (set SMTP_HOST/SMTP_USER/SMTP_PASS in .env) — skipped sending email "${subject}" to ${to}.`
    );
    return { skipped: true };
  }

  return t.sendMail({
    from: config.smtp.from || config.smtp.user,
    to,
    subject,
    html,
    attachments, // [{ filename, content: Buffer, contentType }]
  });
};

// Notifies the admin inbox that a new staff account needs approval before
// it can log in, with one-click Approve / Reject links.
const sendSignupApprovalRequest = async (user) => {
  const approveUrl = `${config.backendUrl}/api/user/approve/${user._id}/${user.approvalToken}`;
  const rejectUrl = `${config.backendUrl}/api/user/reject/${user._id}/${user.approvalToken}`;

  return sendMail({
    to: config.adminApprovalEmail,
    subject: `New ${user.role} signup awaiting approval — ${user.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px;">
        <h2>New staff signup</h2>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Requested role:</strong> ${user.role}</p>
        <p>This person cannot log in until you approve them.</p>
        <div style="margin-top: 24px;">
          <a href="${approveUrl}" style="background:#02ca3a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;margin-right:12px;">Approve</a>
          <a href="${rejectUrl}" style="background:#be3e3f;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">Reject</a>
        </div>
      </div>
    `,
  });
};

module.exports = { sendMail, sendSignupApprovalRequest };
