const config = require("../config/config");
const { decodeBase32 } = require("../utils/ownerBrandAuth");

const passwordHash = /^\$2[aby]\$(\d\d)\$[./A-Za-z0-9]{53}$/.exec(config.ownerPasswordHash || "");
const totpSecret = decodeBase32(config.ownerTotpSecret);
const checks = [
  ["OWNER_EMAIL", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.ownerEmail || "")],
  ["OWNER_PASSWORD_HASH", Boolean(passwordHash && Number(passwordHash[1]) >= 10 && Number(passwordHash[1]) <= 15)],
  ["OWNER_TOTP_SECRET", Boolean(totpSecret && totpSecret.length >= 20)],
  [
    "OWNER_SESSION_SECRET",
    typeof config.ownerSessionSecret === "string" &&
      config.ownerSessionSecret.length >= 32 &&
      config.ownerSessionSecret !== "change_this_to_a_long_random_secret_key" &&
      config.ownerSessionSecret !== config.accessTokenSecret,
  ],
];

for (const [name, configured] of checks) {
  console.log(`${configured ? "OK" : "MISSING OR INVALID"} ${name}`);
}

if (checks.some(([, configured]) => !configured)) {
  console.error("Owner branding is not ready. Set valid values in the backend environment and restart the service.");
  process.exitCode = 1;
} else {
  console.log("Owner branding configuration is valid.");
}
