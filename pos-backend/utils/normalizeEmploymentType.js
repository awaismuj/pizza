const aliases = new Map([
  ["full-time", "Permanent"],
  ["full time", "Permanent"],
  ["fulltime", "Permanent"],
  ["part-time", "Part-Time"],
  ["part time", "Part-Time"],
  ["daily wage", "Daily Wage"],
  ["hourly", "Hourly Employee"],
]);

const normalizeEmploymentType = (value, allowedValues) => {
  const normalizedValue = typeof value === "string" ? value.trim() : "";
  if (!normalizedValue) return "Permanent";

  const allowed = Array.isArray(allowedValues) ? allowedValues : [];
  const alias = aliases.get(normalizedValue.toLowerCase());
  if (alias && allowed.includes(alias)) return alias;

  return allowed.find((item) => item.toLowerCase() === normalizedValue.toLowerCase()) || "Permanent";
};

module.exports = normalizeEmploymentType;
