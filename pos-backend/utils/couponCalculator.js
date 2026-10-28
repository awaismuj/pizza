const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const idString = (value) => String(value?._id || value || "");

const calculateCoupon = (coupon, items, options = {}) => {
  const {
    orderType,
    deliveryFee = 0,
    customerId = null,
    hasPromotion = false,
  } = options;

  if (hasPromotion) return { error: "This coupon cannot be combined with another offer." };

  const eligibleDishIds = new Set((coupon.eligibleDishIds || []).map(idString));
  const eligibleCategoryIds = new Set((coupon.eligibleCategoryIds || []).map(idString));
  const hasItemRules = eligibleDishIds.size > 0 || eligibleCategoryIds.size > 0;
  const eligibleItems = (items || []).filter((item) => {
    if (!hasItemRules) return true;
    return (
      eligibleDishIds.has(idString(item.dishId)) ||
      eligibleCategoryIds.has(idString(item.categoryId))
    );
  });
  const eligibleSubtotal = roundMoney(
    eligibleItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Math.max(1, Number(item.quantity) || 1),
      0
    )
  );
  const qualifyingQuantity = eligibleItems.reduce(
    (sum, item) => sum + Math.max(1, Number(item.quantity) || 1),
    0
  );

  if (!eligibleItems.length || eligibleSubtotal <= 0) {
    return { error: "This coupon is not applicable to the selected items." };
  }
  if (
    coupon.minimumOrderAmount != null &&
    eligibleSubtotal < Number(coupon.minimumOrderAmount)
  ) {
    return {
      error: `Minimum order subtotal is Rs ${Number(coupon.minimumOrderAmount).toFixed(2)}; eligible subtotal is Rs ${eligibleSubtotal.toFixed(2)}.`,
    };
  }
  if (
    coupon.minimumQualifyingQuantity != null &&
    qualifyingQuantity < Number(coupon.minimumQualifyingQuantity)
  ) {
    return { error: `Add at least ${coupon.minimumQualifyingQuantity} eligible item(s) to use this coupon.` };
  }
  if (
    (coupon.eligibleOrderTypes || []).length > 0 &&
    !coupon.eligibleOrderTypes.includes(orderType)
  ) {
    return { error: "This coupon is not available for the selected order type." };
  }
  if (
    (coupon.eligibleCustomerIds || []).length > 0 &&
    !(customerId && coupon.eligibleCustomerIds.some((id) => idString(id) === idString(customerId)))
  ) {
    return { error: "This coupon is not available for this customer." };
  }

  let discountAmount = 0;
  let deliveryDiscount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = roundMoney((eligibleSubtotal * Number(coupon.discountValue)) / 100);
    if (coupon.maximumDiscountAmount != null) {
      discountAmount = Math.min(discountAmount, Number(coupon.maximumDiscountAmount));
    }
  } else if (coupon.discountType === "fixed") {
    discountAmount = Math.min(Number(coupon.discountValue), eligibleSubtotal);
  } else if (coupon.discountType === "freeDelivery") {
    if (orderType !== "delivery") {
      return { error: "This coupon is only valid for delivery orders." };
    }
    deliveryDiscount = Math.max(0, Number(deliveryFee) || 0);
  } else {
    return { error: "This coupon is not available." };
  }

  discountAmount = roundMoney(Math.max(0, Math.min(discountAmount, eligibleSubtotal)));
  deliveryDiscount = roundMoney(deliveryDiscount);
  return {
    eligibleSubtotal,
    qualifyingQuantity,
    discountAmount,
    deliveryDiscount,
    totalDiscount: roundMoney(discountAmount + deliveryDiscount),
  };
};

module.exports = { calculateCoupon, roundMoney };
