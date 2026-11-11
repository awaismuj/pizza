const crypto = require("crypto");

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
console.log("Add this value to the backend secret environment as OWNER_TOTP_SECRET:");
console.log(secret);
console.log("Add it to Google Authenticator using the app's manual setup key option.");
