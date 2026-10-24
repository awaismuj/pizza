const mongoose = require("mongoose");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const provider = require("./whatsAppCampaignProvider");

const MAX_CAMPAIGN_RECIPIENTS = 10000;
const CUSTOMER_STATUSES = ["all", "active", "regular", "new", "inactive"];
const DEFAULT_ELIGIBLE_ORDER_STATUSES = ["Completed", "Closed"];
const DISALLOWED_ORDER_STATUSES = ["Cancelled", "Payment Pending Verification"];

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const digitsExpression = (input) => {
  const value = { $ifNull: [input, ""] };
  return {
    $reduce: {
      input: { $range: [0, { $strLenCP: value }] },
      initialValue: "",
      in: {
        $let: {
          vars: { character: { $substrCP: [value, "$$this", 1] } },
          in: {
            $cond: [
              { $in: ["$$character", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]] },
              { $concat: ["$$value", "$$character"] },
              "$$value",
            ],
          },
        },
      },
    },
  };
};
const phoneSuffixExpression = (input) => {
  const digits = digitsExpression(input);
  return { $substrCP: [digits, { $max: [0, { $subtract: [{ $strLenCP: digits }, 9] }] }, 9] };
};

const selectionFilter = (selection = {}) => {
  const match = {};
  if (selection.mode === "selected" && Array.isArray(selection.customerIds)) {
    match._id = { $in: selection.customerIds };
  }
  if (["all-eligible", "filtered"].includes(selection.mode)) {
    if (Array.isArray(selection.excludedCustomerIds) && selection.excludedCustomerIds.length) {
      match._id = { $nin: selection.excludedCustomerIds };
    }
  }
  if (selection.search) {
    const expression = { $regex: escapeRegex(selection.search.trim().slice(0, 100)), $options: "i" };
    const searchDigits = selection.search.replace(/\D/g, "");
    match.$or = [{ name: expression }, { phone: expression }];
    if (searchDigits.length >= 9) {
      match.$or.push({
        $expr: {
          $eq: [phoneSuffixExpression("$phone"), searchDigits.slice(-9)],
        },
      });
    }
  }
  return match;
};

const customerPipeline = ({ selection = {}, page = 1, limit = 50, applyEligibility = false, eligibleOrderStatuses = DEFAULT_ELIGIBLE_ORDER_STATUSES } = {}) => {
  const pipeline = [
    { $match: selectionFilter(selection) },
    {
      $lookup: {
        from: Order.collection.name,
        let: { customerId: "$_id", customerPhone: "$phone" },
        pipeline: [
          {
            $match: {
              orderStatus: { $in: eligibleOrderStatuses },
              paymentStatus: { $ne: "Rejected" },
              $expr: {
                $or: [
                  { $eq: ["$customerId", "$$customerId"] },
                  {
                    $and: [
                      { $ne: [digitsExpression("$$customerPhone"), ""] },
                      { $eq: [phoneSuffixExpression("$customerDetails.phone"), phoneSuffixExpression("$$customerPhone")] },
                    ],
                  },
                ],
              },
            },
          },
          { $group: { _id: null, total: { $sum: 1 }, lastOrderDate: { $max: "$orderDate" } } },
        ],
        as: "orderStats",
      },
    },
    {
      $addFields: {
        orderCount: { $ifNull: [{ $arrayElemAt: ["$orderStats.total", 0] }, 0] },
        lastOrderDate: { $ifNull: [{ $arrayElemAt: ["$orderStats.lastOrderDate", 0] }, null] },
      },
    },
  ];
  const customerStatus = CUSTOMER_STATUSES.includes(selection.status) ? selection.status : "all";
  if (customerStatus === "inactive") pipeline.push({ $match: { active: false } });
  if (customerStatus === "active") pipeline.push({ $match: { active: true } });
  if (customerStatus === "new") pipeline.push({ $match: { active: true, orderCount: 0 } });
  if (customerStatus === "regular") pipeline.push({ $match: { active: true, orderCount: { $gte: 2 } } });
  if (applyEligibility) {
    pipeline.push({
      $match: {
        active: true,
        marketingConsent: true,
        orderCount: { $gte: 1 },
        phone: { $regex: "^(?:\\D*\\d){10,15}\\D*$" },
      },
    });
  }
  pipeline.push({ $project: { _id: 1, name: 1, phone: 1, phoneKey: 1, contactOnly: 1, active: 1, marketingConsent: 1, orderCount: 1, lastOrderDate: 1 } });
  if (page === null) return pipeline;
  pipeline.push({ $sort: { name: 1, _id: 1 } }, { $skip: (page - 1) * limit }, { $limit: limit });
  return pipeline;
};

const assignmentEligibilityFor = (customer) => {
  if (!customer.active) return { eligible: false, reason: "Account is inactive." };
  if (Number(customer.orderCount || 0) < 1) return { eligible: false, reason: "No qualifying completed order." };
  if (!/^\d{10,15}$/.test(provider.normalizeNumber(customer.phone))) {
    return { eligible: false, reason: "No valid WhatsApp number." };
  }
  return { eligible: true, reason: "" };
};

const eligibilityFor = (customer) => {
  const assignmentEligibility = assignmentEligibilityFor(customer);
  if (!assignmentEligibility.eligible) return assignmentEligibility;
  if (customer.marketingConsent !== true) return { eligible: false, reason: "Marketing consent not granted." };
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
      contactOnly: customer.contactOnly === true,
      accountActive: Boolean(customer.active),
      marketingConsent: customer.marketingConsent === true,
      status: !customer.active ? "inactive" : customer.orderCount >= 2 ? "regular" : customer.orderCount > 0 ? "active" : "new",
      orderCount: customer.orderCount || 0,
      lastOrderDate: customer.lastOrderDate || null,
      eligible: eligibility.eligible,
      ineligibleReason: eligibility.reason,
      previousCampaignStatus: latest.get(String(customer._id)) || "none",
    };
  });
};

const normalizeEligibleOrderStatuses = (statuses) => {
  const allowed = Order.ORDER_STATUSES.filter((status) => !DISALLOWED_ORDER_STATUSES.includes(status));
  const normalized = [...new Set((Array.isArray(statuses) && statuses.length ? statuses : DEFAULT_ELIGIBLE_ORDER_STATUSES)
    .filter((status) => allowed.includes(status)))];
  if (!normalized.length) throw new Error("Choose at least one valid qualifying order status.");
  return normalized;
};

const listCustomers = async ({ search = "", status = "all", page = 1, limit = 50, eligibleOrderStatuses } = {}) => {
  const selection = { mode: "selected", customerIds: undefined, status, search };
  const orderStatuses = normalizeEligibleOrderStatuses(eligibleOrderStatuses);
  const [customers, [totalResult], eligibleRows] = await Promise.all([
    Customer.aggregate(customerPipeline({ selection, page, limit, eligibleOrderStatuses: orderStatuses })),
    Customer.aggregate([...customerPipeline({ selection, page: null, eligibleOrderStatuses: orderStatuses }), { $count: "total" }]),
    Customer.aggregate([...customerPipeline({ selection, page: null, applyEligibility: true, eligibleOrderStatuses: orderStatuses }), { $count: "total" }]),
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

const resolveRecipients = async (selection, eligibleOrderStatuses) => {
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
  const orderStatuses = normalizeEligibleOrderStatuses(eligibleOrderStatuses);
  const records = await Customer.aggregate([
    ...customerPipeline({ selection: selectionForQuery, page: null, eligibleOrderStatuses: orderStatuses }),
    { $limit: MAX_CAMPAIGN_RECIPIENTS + 1 },
  ]);
  if (records.length > MAX_CAMPAIGN_RECIPIENTS) {
    throw new Error(`Campaigns are limited to ${MAX_CAMPAIGN_RECIPIENTS} selected customers per launch.`);
  }
  const phoneKeys = [...new Set(records.map((customer) => customer.phoneKey).filter(Boolean))];
  const phoneRecords = phoneKeys.length
    ? await Customer.find({ phoneKey: { $in: phoneKeys } }).select("phone phoneKey").lean()
    : records;
  const phoneCounts = new Map();
  const selectedPhoneCounts = new Map();
  for (const customer of phoneRecords) {
    const normalizedPhone = provider.normalizeNumber(customer.phone);
    if (/^\d{10,15}$/.test(normalizedPhone)) {
      phoneCounts.set(normalizedPhone, (phoneCounts.get(normalizedPhone) || 0) + 1);
    }
  }
  for (const customer of records) {
    const normalizedPhone = provider.normalizeNumber(customer.phone);
    if (/^\d{10,15}$/.test(normalizedPhone)) {
      selectedPhoneCounts.set(normalizedPhone, (selectedPhoneCounts.get(normalizedPhone) || 0) + 1);
    }
  }

  return records.map((customer) => {
    const eligibility = eligibilityFor(customer);
    const assignmentEligibility = assignmentEligibilityFor(customer);
    const normalizedPhone = provider.normalizeNumber(customer.phone);
    if (/^\d{10,15}$/.test(normalizedPhone)
      && Math.max(phoneCounts.get(normalizedPhone) || 0, selectedPhoneCounts.get(normalizedPhone) || 0) > 1) {
      return { customer, eligible: false, reason: "Duplicate phone number.", assignmentEligible: false, assignmentReason: "Duplicate phone number." };
    }
    return {
      customer,
      ...eligibility,
      assignmentEligible: assignmentEligibility.eligible,
      assignmentReason: assignmentEligibility.reason,
    };
  });
};

const MAX_CAMPAIGN_RECIPIENTS_LIMIT = MAX_CAMPAIGN_RECIPIENTS;

module.exports = {
  CUSTOMER_STATUSES,
  DEFAULT_ELIGIBLE_ORDER_STATUSES,
  normalizeEligibleOrderStatuses,
  MAX_CAMPAIGN_RECIPIENTS: MAX_CAMPAIGN_RECIPIENTS_LIMIT,
  attachCampaignHistory,
  assignmentEligibilityFor,
  eligibilityFor,
  digitsExpression,
  listCustomers,
  resolveRecipients,
  selectionFilter,
};