const crypto = require("crypto");

const decodeBase32 = (value) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const normalized = String(value || "").toUpperCase().replace(/=+$/, "");
  let bits = "";
  for (const char of normalized) {
    const index = alphabet.indexOf(char);
    if (index < 0) return null;
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes = [];
  for (let offset = 0; offset + 8 <= bits.length; offset += 8) {
    bytes.push(parseInt(bits.slice(offset, offset + 8), 2));
  }
  return Buffer.from(bytes);
};

const totp = (secret, time = Date.now(), period = 30) => {
  const key = decodeBase32(secret);
  if (!key || key.length < 20) throw new Error("TOTP secret must be a Base32 key of at least 160 bits.");

  const counter = Math.floor(time / 1000 / period);
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac("sha1", key).update(message).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = digest.readUInt32BE(offset) & 0x7fffffff;
  return String(binary % 1_000_000).padStart(6, "0");
};

const verifyTotp = (secret, code, time = Date.now()) => {
  const normalizedCode = String(code || "").trim();
  if (!/^\d{6}$/.test(normalizedCode)) return false;
  const submitted = Buffer.from(normalizedCode);
  for (const offset of [-30_000, 0, 30_000]) {
    const expected = Buffer.from(totp(secret, time + offset));
    if (crypto.timingSafeEqual(submitted, expected)) return true;
  }
  return false;
};

const validOwnerConfiguration = ({
  ownerEmail,
  ownerPasswordHash,
  ownerTotpSecret,
  ownerSessionSecret,
  accessTokenSecret,
}) => {
  const secret = decodeBase32(ownerTotpSecret);
  const hashMatches = /^\$2[aby]\$(\d\d)\$[./A-Za-z0-9]{53}$/.exec(ownerPasswordHash || "");
  const cost = Number(hashMatches?.[1]);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail || "") &&
    Boolean(hashMatches && cost >= 10 && cost <= 15) &&
    Boolean(secret && secret.length >= 20) &&
    typeof ownerSessionSecret === "string" &&
    ownerSessionSecret.length >= 32 &&
    ownerSessionSecret !== "change_this_to_a_long_random_secret_key" &&
    ownerSessionSecret !== accessTokenSecret;
};

module.exports = { decodeBase32, totp, verifyTotp, validOwnerConfiguration };
