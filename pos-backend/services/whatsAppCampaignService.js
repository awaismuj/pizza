const mongoose = require("mongoose");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const provider = require("./whatsAppCampaignProvider");

const MAX_CAMPAIGN_RECIPIENTS = 10000;
const CUSTOMER_STATUSES = ["all", "active", "regular", "new", "inactive"];

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const selectionFilter = (selection = {}) => {
  const match = {};
  if (selection.mode === "selected" && Array.isArray(selection.customerIds)) {
    match._id = { $in: selection.customerIds };
  } else if (selection.mode === "all-eligible") {
    match.active = true;
    match.marketingConsent = true;
  }
  if (["all-eligible", "filtered"].includes(selection.mode)) {
    if (Array.isArray(selection.excludedCustomerIds) && selection.excludedCustomerIds.length) {
      match._id = { $nin: selection.excludedCustomerIds };
    }
  }
  if (selection.search) {
    const expression = { $regex: escapeRegex(selection.search.trim().slice(0, 100)), $options: "i" };
    match.$or = [{ name: expression }, { phone: expression }];
  }
  return match;
};

const customerPipeline = ({ selection = {}, page = 1, limit = 50, applyEligibility = false } = {}) => {
  const pipeline = [
    { $match: selectionFilter(selection) },
    {
      $lookup: {
        from: Order.collection.name,
        let: {
          customerId: "$_id",
          customerPhoneDigits: { $regexReplace: { input: { $ifNull: ["$phone", ""] }, regex: "\\D", replacement: "" } },
        },
        pipeline: [
          {
            $match: {
              orderStatus: { $ne: "Cancelled" },
              $expr: {
                $or: [
                  { $eq: ["$customerId", "$$customerId"] },
                  {
                    $and: [
                      { $gte: [{ $strLenCP: "$$customerPhoneDigits" }, 9] },
                      {
                        $regexMatch: {
                          input: { $ifNull: ["$customerDetails.phone", ""] },
                          regex: {
                            $concat: [
                              {
                                $substrCP: [
                                  "$$customerPhoneDigits",
                                  { $max: [0, { $subtract: [{ $strLenCP: "$$customerPhoneDigits" }, 9] }] },
                                  9,
                                ],
                              },
                              "$",
                            ],
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
          { $count: "total" },
        ],
        as: "orderStats",
      },
    },
    { $addFields: { orderCount: { $ifNull: [{ $arrayElemAt: ["$orderStats.total", 0] }, 0] } } },
  ];
  const customerStatus = CUSTOMER_STATUSES.includes(selection.status) ? selection.status : "all";
  if (customerStatus === "inactive") pipeline.push({ $match: { active: false } });
  if (customerStatus === "active") pipeline.push({ $match: { active: true } });
  if (customerStatus === "new") pipeline.push({ $match: { active: true, orderCount: 0 } });
  if (customerStatus === "regular") pipeline.push({ $match: { active: true, orderCount: { $gte: 2 } } });
  if (applyEligibility) {
    pipeline.push(
      { $addFields: { normalizedPhone: { $regexReplace: { input: { $ifNull: ["$phone", ""] }, regex: "\\D", replacement: "" } } } },
      { $match: { active: true, marketingConsent: true, normalizedPhone: { $regex: "^\\d{10,15}$" } } }
    );
  }
  pipeline.push({ $project: { _id: 1, name: 1, phone: 1, active: 1, marketingConsent: 1, orderCount: 1 } });
  if (page === null) return pipeline;
  pipeline.push({ $sort: { name: 1, _id: 1 } }, { $skip: (page - 1) * limit }, { $limit: limit });
  return pipeline;
};

const eligibilityFor = (customer) => {
  if (!customer.active) return { eligible: false, reason: "Account is inactive." };
  if (customer.marketingConsent !== true) return { eligible: false, reason: "Marketing consent not granted." };
  if (!/^\d{10,15}$/.test(provider.normalizeNumber(customer.phone))) {
    return { eligible: false, reason: "No valid WhatsApp number." };
  }
  return { eligible: true, reason: "" };
};

const attachCampaignHistory = async (customers) => {
  const customerIds = customers.map((customer) => customer._id);
  if (!customerIds.length) return customers;
  const previous = await WhatsAppCampaignRecipient.find({ customerId: { $in: customerIds } })
    .sort({ createdAt: -1 })
    .select("customerId status")
    .lean();
  const latest = new Map();
  previous.forEach((record) => {
    const key = String(record.customerId);
    if (!latest.has(key)) latest.set(key, record.status);
  });
  return customers.map((customer) => {
    const eligibility = eligibilityFor(customer);
    return {
      id: String(customer._id),
      name: customer.name,
      phone: customer.phone,
      accountActive: Boolean(customer.active),
      marketingConsent: customer.marketingConsent === true,
      status: !customer.active ? "inactive" : customer.orderCount >= 2 ? "regular" : customer.orderCount > 0 ? "active" : "new",
      orderCount: customer.orderCount || 0,
      eligible: eligibility.eligible,
      ineligibleReason: eligibility.reason,
      previousCampaignStatus: latest.get(String(customer._id)) || "none",
    };
  });
};

const listCustomers = async ({ search = "", status = "all", page = 1, limit = 50 } = {}) => {
  const selection = { mode: "selected", customerIds: undefined, status, search };
  const [customers, [totalResult], eligibleRows] = await Promise.all([
    Customer.aggregate(customerPipeline({ selection, page, limit })),
    Customer.aggregate([...customerPipeline({ selection, page: null }), { $count: "total" }]),
    Customer.aggregate([...customerPipeline({ selection, page: null, applyEligibility: true }), { $count: "total" }]),
  ]);
  const rows = await attachCampaignHistory(customers);
  return {
    data: rows,
    pagination: { page, limit, total: totalResult?.total || 0, pages: Math.ceil((totalResult?.total || 0) / limit) },
    summary: {
      matching: totalResult?.total || 0,
      eligible: eligibleRows[0]?.total || 0,
      skipped: Math.max(0, (totalResult?.total || 0) - (eligibleRows[0]?.total || 0)),
    },
  };
};

const resolveRecipients = async (selection) => {
  if (!selection || !["all-eligible", "filtered", "selected"].includes(selection.mode)) {
    throw new Error("Choose eligible customers or selected customer records.");
  }
  if (selection.mode === "selected") {
    if (!Array.isArray(selection.customerIds) || !selection.customerIds.length || selection.customerIds.length > MAX_CAMPAIGN_RECIPIENTS) {
      throw new Error(`Select between 1 and ${MAX_CAMPAIGN_RECIPIENTS} customers.`);
    }
    if (selection.customerIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error("A selected customer ID is invalid.");
    }
  }
  if (["all-eligible", "filtered"].includes(selection.mode) && selection.excludedCustomerIds !== undefined) {
    if (!Array.isArray(selection.excludedCustomerIds) || selection.excludedCustomerIds.length > MAX_CAMPAIGN_RECIPIENTS
      || selection.excludedCustomerIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error("An excluded customer selection is invalid.");
    }
  }
  const selectionForQuery = {
    ...selection,
    customerIds: selection.mode === "selected" ? selection.customerIds.map((id) => new mongoose.Types.ObjectId(id)) : undefined,
    excludedCustomerIds: ["all-eligible", "filtered"].includes(selection.mode)
      ? (selection.excludedCustomerIds || []).map((id) => new mongoose.Types.ObjectId(id))
      : undefined,
    search: String(selection.search || "").trim().slice(0, 100),
    status: CUSTOMER_STATUSES.includes(selection.status) ? selection.status : "all",
  };
  const records = await Customer.aggregate([
    ...customerPipeline({ selection: selectionForQuery, page: null }),
    { $limit: MAX_CAMPAIGN_RECIPIENTS + 1 },
  ]);
  if (records.length > MAX_CAMPAIGN_RECIPIENTS) {
    throw new Error(`Campaigns are limited to ${MAX_CAMPAIGN_RECIPIENTS} selected customers per launch.`);
  }
  return records.map((customer) => ({ customer, ...eligibilityFor(customer) }));
};

const MAX_CAMPAIGN_RECIPIENTS_LIMIT = MAX_CAMPAIGN_RECIPIENTS;

module.exports = {
  CUSTOMER_STATUSES,
  MAX_CAMPAIGN_RECIPIENTS: MAX_CAMPAIGN_RECIPIENTS_LIMIT,
  attachCampaignHistory,
  eligibilityFor,
  listCustomers,
  resolveRecipients,
};