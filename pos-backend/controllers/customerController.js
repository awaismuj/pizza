const createHttpError = require("http-errors");
const Customer = require("../models/customerModel");

/**
 * Sync customer spend and accumulate loyalty points (1 pt per Rs 100 spent).
 */
async function recordCustomerLoyalty(phone, name, orderTotal, redeemedPoints = 0) {
  if (!phone || phone.length < 10) return null;
  const cleanPhone = phone.trim();
  const cleanName = name ? name.trim() : "Guest";
  const earnedPoints = Math.floor(Math.max(0, orderTotal) / 100);

  const customer = await Customer.findOneAndUpdate(
    { phone: cleanPhone },
    {
      $set: { name: cleanName, lastVisit: new Date() },
      $inc: {
        totalSpend: Math.max(0, orderTotal),
        orderCount: 1,
        loyaltyPoints: earnedPoints - Math.max(0, redeemedPoints),
        redeemedPoints: Math.max(0, redeemedPoints),
      },
    },
    { new: true, upsert: true }
  );

  return customer;
}

// GET /api/customer/lookup?phone=03xxxxxxxxx
const lookupCustomer = async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return next(createHttpError(400, "Phone number is required."));
    }

    const cleanDigits = String(phone).replace(/\D/g, "");
    const customer = await Customer.findOne({
      phone: { $regex: cleanDigits.slice(-10) },
    });

    res.status(200).json({
      success: true,
      data: customer || null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customer/all
const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find()
      .sort({ totalSpend: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordCustomerLoyalty,
  lookupCustomer,
  getAllCustomers,
};
