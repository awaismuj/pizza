const crypto = require("crypto");
const QRCode = require("qrcode");

const encodeBase32 = (buffer) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const byte of buffer) bits += byte.toString(2).padStart(8, "0");
  let encoded = "";
  for (let offset = 0; offset < bits.length; offset += 5) {
    encoded += alphabet[parseInt(bits.slice(offset, offset + 5).padEnd(5, "0"), 2)];
  }
  return encoded;
};

const secret = encodeBase32(crypto.randomBytes(20));
const email = (process.env.OWNER_EMAIL || "awais.mj@gmail.com").trim().toLowerCase();
const issuer = "Pizza Owner Branding";
const label = encodeURIComponent(`${issuer}:${email}`);
const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

console.log("Set this value as OWNER_TOTP_SECRET in the backend environment:");
console.log(secret);
console.log("\nScan this QR code once with Google Authenticator to enroll the account:");
QRCode.toString(uri, { type: "terminal", small: true }, (error, qrCode) => {
  if (error) {
    console.error("Could not generate the authenticator QR code:", error.message);
    process.exitCode = 1;
    return;
  }
  console.log(qrCode);
  console.log("Keep the secret private. Enter the current six-digit code at each owner sign-in.");
});
