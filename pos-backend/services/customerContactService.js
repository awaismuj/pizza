const Customer = require("../models/customerModel");
const customerPhoneKey = require("../utils/customerPhoneKey");

const normalizeContactPhone = (phone) => {
  const value = String(phone || "").trim();
  if (!/^\+?[\d\s().-]+$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return { value, digits, phoneKey: customerPhoneKey(digits) };
};

const saveOrderContact = async ({ name, phone }) => {
  const normalized = normalizeContactPhone(phone);
  if (!normalized) return null;

  const existing = await Customer.findOne({ phoneKey: normalized.phoneKey });
  if (existing) return existing;

  try {
    return await Customer.create({
      name: String(name || "").trim().slice(0, 120) || "Order customer",
      phone: normalized.value,
      phoneKey: normalized.phoneKey,
      contactOnly: true,
      active: true,
      marketingConsent: false,
    });
  } catch (error) {
    if (error.code !== 11000) throw error;
    const racedContact = await Customer.findOne({ phoneKey: normalized.phoneKey });
    if (!racedContact) throw error;
    return racedContact;
  }
};

module.exports = { normalizeContactPhone, saveOrderContact };
