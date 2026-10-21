const canonicalStatuses = new Map([
  ["pending", "Pending"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
]);

const normalizeApprovalStatus = (status) => {
  if (typeof status !== "string") return status;
  return canonicalStatuses.get(status.trim().toLowerCase()) || status;
};

module.exports = { normalizeApprovalStatus };
