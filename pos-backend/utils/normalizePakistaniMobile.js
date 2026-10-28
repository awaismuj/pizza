const normalizePakistaniMobile = (value) => {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return /^3\d{9}$/.test(digits) ? digits : "";
};

module.exports = normalizePakistaniMobile;
