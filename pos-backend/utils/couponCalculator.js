const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "").slice(-10);

const calculateDiscount = (coupon, items, subtotal) => {
  const eligibleProducts = new Set((coupon.eligibleProducts || []).map(String));
  const excludedProducts = new Set((coupon.excludedProducts || []).map(String));
  const eligibleCategories = new Set((coupon.eligibleCategories || []).map(String));
  const excludedCategories = new Set((coupon.excludedCategories || []).map(String));
  const isRestricted =
    eligibleProducts.size > 0 ||
    excludedProducts.size > 0 ||
    eligibleCategories.size > 0 ||
    excludedCategories.size > 0;

  let eligibleSubtotal = 0;
  for (const item of items) {
    const productId = String(item.dishId || "");
    const categoryId = String(item.categoryId || "");
    if (item.isDeal) {
      if (!isRestricted) eligibleSubtotal += Number(item.price) * Number(item.quantity);
      continue;
    }
    if (!productId) continue;
    if (excludedProducts.has(productId) || excludedCategories.has(categoryId)) continue;
    if (eligibleProducts.size && !eligibleProducts.has(productId)) continue;
    if (eligibleCategories.size && !eligibleCategories.has(categoryId)) continue;
    eligibleSubtotal += Number(item.price) * Number(item.quantity);
  }

  if (isRestricted && eligibleSubtotal <= 0) {
    throw new Error("This coupon is restricted to selected products.");
  }
  if (eligibleSubtotal < Number(coupon.minimumSubtotal || 0)) {
    throw new Error(`Add Rs ${Number(coupon.minimumSubtotal).toFixed(0)} in eligible items to use this coupon.`);
  }

  let discount =
    coupon.discountType === "percentage"
      ? (eligibleSubtotal * Number(coupon.discountValue)) / 100
      : Number(coupon.discountValue);

  if (coupon.maximumDiscount !== null && coupon.maximumDiscount !== undefined) {
    discount = Math.min(discount, Number(coupon.maximumDiscount));
  }

  discount = Math.min(discount, eligibleSubtotal, Number(subtotal));
  return { discountAmount: Math.max(0, Math.round(discount * 100) / 100), eligibleSubtotal };
};

module.exports = { calculateDiscount, normalizePhone };
