const Settings = require("../models/settingsModel");
const {
  generateFridayCoupons,
  generateBirthdayCoupons,
} = require("./couponCampaignService");
const {
  DEFAULT_COUPON_CAMPAIGNS,
  fridayCampaignCycle,
  isFridayCampaignDue,
  zonedParts,
} = require("../utils/couponCampaignRules");

let timer = null;
let running = false;
let lastFridayCycle = "";
let lastBirthdayDate = "";

const runCouponCampaigns = async (now = new Date()) => {
  if (running) return;
  running = true;
  try {
    const settings = await Settings.findOne({ key: "global" });
    const campaigns = settings?.couponCampaigns || DEFAULT_COUPON_CAMPAIGNS;
    const friday = campaigns.friday || {};
    if (friday.automaticGeneration &&
        isFridayCampaignDue(now, friday.timezone || "Asia/Karachi")) {
      const cycle = fridayCampaignCycle(now, friday.timezone || "Asia/Karachi");
      if (cycle !== lastFridayCycle) {
        const result = await generateFridayCoupons({
          now,
          settings: friday,
          timezone: friday.timezone || "Asia/Karachi",
        });
        lastFridayCycle = cycle;
        console.info(`Friday coupon campaign ${cycle}: ${result.generated} generated, ${result.skipped} skipped.`);
      }
    }

    const birthday = campaigns.birthday || {};
    if (birthday.enabled) {
      const timezone = birthday.timezone || "Asia/Karachi";
      const parts = zonedParts(now, timezone);
      const localDate = `${parts.year}-${parts.month}-${parts.day}`;
      if (localDate !== lastBirthdayDate) {
        const result = await generateBirthdayCoupons({ now, settings: birthday, timezone });
        lastBirthdayDate = localDate;
        if (result.generated) {
          console.info(`Birthday coupon run ${localDate}: ${result.generated} generated, ${result.skipped} skipped.`);
        }
      }
    }
  } finally {
    running = false;
  }
};

const startCouponCampaignScheduler = () => {
  if (timer) return timer;
  const run = () => runCouponCampaigns().catch((error) => {
    console.error("Coupon campaign scheduler failed:", error.message);
  });
  void run();
  timer = setInterval(run, 60 * 1000);
  timer.unref?.();
  return timer;
};

module.exports = { runCouponCampaigns, startCouponCampaignScheduler };
