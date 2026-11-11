const Settings = require("../models/settingsModel");

const DEFAULT_BRAND_NAME = "GenZ Pizza Land";

const getBrandName = async () => {
  const settings = await Settings.findOne({ key: "global" }).select("branding.name").lean();
  return String(settings?.branding?.name || DEFAULT_BRAND_NAME);
};

module.exports = { DEFAULT_BRAND_NAME, getBrandName };
