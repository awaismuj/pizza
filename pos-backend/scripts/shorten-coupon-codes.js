// One-off: gives old long coupon codes (WACMP_..., PVT_..., WAC_...) the same
// short style new ones get now (FLAT7K4M).
//
// It RENAMES, it never deletes: coupons, customer assignments, redemptions and
// order history all stay. Past redemption records keep the code they were
// used with.
//
// Safe by default: without --apply it only prints what it would change.
//
//   node scripts/shorten-coupon-codes.js                         # preview, campaign coupons only
//   node scripts/shorten-coupon-codes.js --apply                 # rename campaign coupon codes
//   node scripts/shorten-coupon-codes.js --assignments           # preview customer codes too
//   node scripts/shorten-coupon-codes.js --assignments --apply   # rename customer codes too
//
// Customer codes (--assignments) are the ones already sent to customers.
// Renaming an UNUSED one means the old message stops working, so only unused,
// active codes are touched and you should send those customers the new code.
// Codes that were already used are left alone.
require("dotenv").config();

const mongoose = require("mongoose");
const config = require("../config/config");
const Coupon = require("../models/couponModel");
const CustomerCoupon = require("../models/customerCouponModel");
const WhatsAppCampaignRecipient = require("../models/whatsAppCampaignRecipientModel");
const { generatePrivateCode } = require("../services/couponDeliveryService");

const APPLY = process.argv.includes("--apply");
const INCLUDE_ASSIGNMENTS = process.argv.includes("--assignments");
const LONG_PREFIXES = /^(WACMP_|PVT_|WAC_)/;

// A code no coupon or customer code is using yet (checks both collections).
const freshCode = async (taken) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = generatePrivateCode();
    if (taken.has(code)) continue;
    const [coupon, assignment] = await Promise.all([
      Coupon.exists({ code }),
      CustomerCoupon.exists({ code }),
    ]);
    if (!coupon && !assignment) {
      taken.add(code);
      return code;
    }
  }
  throw new Error("Could not find an unused short code.");
};

const run = async () => {
  await mongoose.connect(config.databaseURI);
  console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
  console.log(APPLY ? "MODE: APPLY (changes will be saved)" : "MODE: PREVIEW (nothing is changed; add --apply to save)");

  const taken = new Set();

  const coupons = await Coupon.find({ code: LONG_PREFIXES }).select("name code");
  console.log(`\nCampaign coupons with a long code: ${coupons.length}`);
  for (const coupon of coupons) {
    const next = await freshCode(taken);
    console.log(`  ${coupon.code}  ->  ${next}   (${coupon.name})`);
    if (APPLY) await Coupon.updateOne({ _id: coupon._id }, { $set: { code: next } });
  }

  if (INCLUDE_ASSIGNMENTS) {
    const assignments = await CustomerCoupon.find({
      code: LONG_PREFIXES,
      status: "active",
      redemptionCount: 0,
    }).select("code");
    const used = await CustomerCoupon.countDocuments({ code: LONG_PREFIXES, redemptionCount: { $gt: 0 } });
    console.log(`\nUnused customer codes with a long code: ${assignments.length} (${used} already-used ones are left alone)`);
    for (const assignment of assignments) {
      const next = await freshCode(taken);
      if (APPLY) {
        await CustomerCoupon.updateOne({ _id: assignment._id }, { $set: { code: next } });
        // Keep the campaign results screen in step with the new code.
        await WhatsAppCampaignRecipient.updateMany(
          { customerCouponId: assignment._id },
          { $set: { couponCode: next } }
        );
      }
    }
    if (assignments.length) console.log("  (customer codes are not listed here)");
  }

  console.log(APPLY ? "\nDone." : "\nPreview only. Nothing was changed.");
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
