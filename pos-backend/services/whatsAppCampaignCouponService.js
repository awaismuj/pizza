const crypto = require("crypto");
const Coupon = require("../models/couponModel");
const CustomerCoupon = require("../models/customerCouponModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");

const chooseDiscount = (campaign) => {
  const options = campaign.discountOptions || [];
  if (!options.length) throw new Error("Campaign has no available discount percentages.");
  const weights = campaign.discountWeights;
  const weighted = options.map((discount) => ({
    discount,
    weight: Math.max(0, Number(weights?.get?.(String(discount)) ?? weights?.[discount] ?? 1)),
  }));
  const totalWeight = weighted.reduce((sum, option) => sum + option.weight, 0);
  if (!Number.isSafeInteger(totalWeight) || totalWeight <= 0) {
    throw new Error("Campaign discount weights must include a positive value.");
  }
  let draw = crypto.randomInt(totalWeight);
  for (const option of weighted) {
    draw -= option.weight;
    if (draw < 0) return option.discount;
  }
  return weighted.at(-1).discount;
};

const getCampaignCoupon = async (campaign, discount) => {
  const query = { campaignId: campaign._id, campaignDiscountPercentage: discount };
  let coupon = await Coupon.findOne(query);
  if (coupon) return coupon;

  try {
    coupon = await Coupon.create({
      name: `${campaign.name} (${discount}% WhatsApp offer)`.slice(0, 120),
      description: `Private WhatsApp campaign coupon for ${campaign.name}.`,
      code: `WACMP_${crypto.randomBytes(16).toString("hex").toUpperCase()}`,
      source: "whatsapp_campaign",
      campaignId: campaign._id,
      campaignDiscountPercentage: discount,
      discountType: "percentage",
      discountValue: discount,
      minimumSubtotal: campaign.minimumOrderAmount,
      maximumDiscount: campaign.maximumDiscount,
      channels: ["Online", "POS"],
      usageLimit: Math.max(1, campaign.confirmedAssignmentCount * campaign.maxUsesPerCoupon),
      perCustomerLimit: campaign.maxUsesPerCoupon,
      startsAt: campaign.scheduledAt || campaign.startedAt || new Date(),
      expiresAt: campaign.expiresAt,
      timezone: campaign.timezone,
      firstOrderOnly: false,
      allowStacking: false,
      status: "active",
      createdBy: campaign.createdBy,
    });
    return coupon;
  } catch (error) {
    if (error.code !== 11000) throw error;
    coupon = await Coupon.findOne(query);
    if (!coupon) throw error;
    return coupon;
  }
};

const getOrCreateAssignment = async (campaign, recipient, customer) => {
  const idempotencyKey = `wa-campaign:${campaign._id}`;
  let assignment = await CustomerCoupon.findOne({ customerId: customer._id, idempotencyKey });
  let created = false;
  if (!assignment) {
    const discount = chooseDiscount(campaign);
    const coupon = await getCampaignCoupon(campaign, discount);
    try {
      assignment = await CustomerCoupon.create({
        couponId: coupon._id,
        customerId: customer._id,
        code: `WAC_${crypto.randomBytes(18).toString("hex").toUpperCase()}`,
        source: "whatsapp_campaign",
        idempotencyKey,
        redemptionLimit: campaign.maxUsesPerCoupon,
        redemptionCount: 0,
        startsAt: campaign.scheduledAt || campaign.startedAt || new Date(),
        expiresAt: campaign.expiresAt,
        status: "active",
        assignedBy: campaign.createdBy,
      });
      created = true;
    } catch (error) {
      if (error.code !== 11000) throw error;
      assignment = await CustomerCoupon.findOne({ customerId: customer._id, idempotencyKey });
      if (!assignment) throw error;
    }
  }

  const coupon = await Coupon.findById(assignment.couponId);
  if (!coupon) throw new Error("Assigned campaign coupon no longer exists.");
  await WhatsAppCampaignRecipient.updateOne(
    { _id: recipient._id, campaignId: campaign._id },
    {
      $set: {
        couponId: coupon._id,
        customerCouponId: assignment._id,
        couponCode: assignment.code,
        discountPercentage: Number(coupon.discountValue),
      },
    }
  );
  return { assignment, coupon, created };
};

const getExistingAssignment = async (campaign, recipient, customer) => {
  const idempotencyKey = `wa-campaign:${campaign._id}`;
  const assignment = await CustomerCoupon.findOne({
    customerId: customer._id,
    idempotencyKey,
    status: "active",
  });
  if (!assignment) {
    const error = new Error("Coupon token must be generated before campaign dispatch.");
    error.retryable = false;
    throw error;
  }
  const coupon = await Coupon.findById(assignment.couponId);
  if (!coupon || coupon.campaignId?.toString() !== campaign._id.toString()) {
    const error = new Error("Assigned campaign coupon no longer exists.");
    error.retryable = false;
    throw error;
  }
  await WhatsAppCampaignRecipient.updateOne(
    { _id: recipient._id, campaignId: campaign._id },
    {
      $set: {
        couponId: coupon._id,
        customerCouponId: assignment._id,
        couponCode: assignment.code,
        discountPercentage: Number(coupon.discountValue),
      },
    }
  );
  return { assignment, coupon };
};

module.exports = { chooseDiscount, getExistingAssignment, getOrCreateAssignment };