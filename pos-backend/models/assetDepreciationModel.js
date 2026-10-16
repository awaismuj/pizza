const mongoose = require("mongoose");

const assetDepreciationSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
    period: { type: String, required: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    method: {
      type: String,
      enum: ["StraightLine", "DecliningBalance", "UnitsOfProduction"],
      required: true,
    },
    openingBookValue: { type: Number, required: true, min: 0 },
    depreciation: { type: Number, required: true, min: 0 },
    closingBookValue: { type: Number, required: true, min: 0 },
    unitsProduced: { type: Number, default: null, min: 0 },
    daysInService: { type: Number, required: true, min: 0 },
    calculatedAt: { type: Date, default: Date.now },
    calculatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    calculationSource: { type: String, enum: ["Scheduled", "Manual"], required: true },
  },
  { timestamps: true }
);

assetDepreciationSchema.index({ asset: 1, period: 1 }, { unique: true });
assetDepreciationSchema.index({ period: 1 });

module.exports = mongoose.model("AssetDepreciation", assetDepreciationSchema);
