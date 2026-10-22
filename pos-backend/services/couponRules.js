const normalizeCouponCode = (code) => String(code || "").trim().toUpperCase();

const calculateCoupon = (coupon, { items, subtotal, channel, hasPreviousOrder, existingDiscount = 0, hasOtherPromotion = false, now = new Date() }) => {
  const code = normalizeCouponCode(coupon?.code);
  if (!code || !["active", "scheduled", "expired"].includes(coupon.status)) {
    return { valid: false, message: "Invalid or inactive coupon code." };
  }
  if (coupon.status === "expired") return { valid: false, message: "Coupon expired." };
  if (coupon.status === "scheduled" && coupon.startsAt && new Date(coupon.startsAt) > now) {
    return { valid: false, message: "Coupon is not active yet." };
  }
  if (coupon.startsAt && new Date(coupon.startsAt) > now) return { valid: false, message: "Coupon is not active yet." };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return { valid: false, message: "Coupon expired." };
  if (coupon.channels?.length && !coupon.channels.includes(channel)) {
    return { valid: false, message: "Coupon not valid for this order channel." };
  }
  if (coupon.firstOrderOnly && hasPreviousOrder) {
    return { valid: false, message: "This coupon is only available on your first order." };
  }
  const hasAppliedPromotion = hasOtherPromotion || (items || []).some((item) => item.isDeal || item.isPromotion || item.byo);
  if ((existingDiscount > 0 || hasAppliedPromotion) && !coupon.allowStacking) {
    return { valid: false, message: "This coupon cannot be combined with other discounts." };
  }

  const ids = (values) => new Set((values || []).map((value) => String(value?._id || value)));
  const eligibleDishIds = ids(coupon.eligibleDishIds);
  const excludedDishIds = ids(coupon.excludedDishIds);
  const eligibleCategoryIds = ids(coupon.eligibleCategoryIds);
  const excludedCategoryIds = ids(coupon.excludedCategoryIds);
  const hasIncludes = eligibleDishIds.size > 0 || eligibleCategoryIds.size > 0;
  const eligibleItems = (items || []).filter((item) => {
    const dishId = String(item.dishId || "");
    const categoryId = String(item.categoryId || "");
    if (excludedDishIds.has(dishId) || excludedCategoryIds.has(categoryId)) return false;
    return !hasIncludes || eligibleDishIds.has(dishId) || eligibleCategoryIds.has(categoryId);
  });
  const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + Math.max(0, Number(item.subtotal) || 0), 0);

  if (eligibleSubtotal <= 0) return { valid: false, message: "Coupon is restricted to selected products." };
  if (eligibleSubtotal < Number(coupon.minimumSubtotal || 0)) {
    return { valid: false, message: `Minimum eligible order amount is Rs ${coupon.minimumSubtotal}.` };
  }
  if (coupon.usageLimit != null && coupon.redemptionCount >= coupon.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached." };
  }

  let discountAmount = coupon.discountType === "percentage"
    ? eligibleSubtotal * Number(coupon.discountValue) / 100
    : Number(coupon.discountValue);
  if (coupon.maximumDiscount != null) discountAmount = Math.min(discountAmount, Number(coupon.maximumDiscount));
  discountAmount = Math.min(eligibleSubtotal, Math.max(0, Math.round(discountAmount)));

  return {
    valid: true,
    coupon,
    discountAmount,
    eligibleSubtotal,
    message: "Coupon applied.",
  };
};

module.exports = { normalizeCouponCode, calculateCoupon };
