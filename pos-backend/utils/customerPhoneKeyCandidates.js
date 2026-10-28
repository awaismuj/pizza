const customerPhoneKey = require("./customerPhoneKey");

const customerPhoneKeyCandidates = (canonicalMobile) => {
  const mobile = String(canonicalMobile || "").replace(/\D/g, "");
  if (!/^3\d{9}$/.test(mobile)) return [];
  return [...new Set([
    mobile,
    `0${mobile}`,
    `92${mobile}`,
    `920${mobile}`,
  ].map(customerPhoneKey))];
};

module.exports = customerPhoneKeyCandidates;
