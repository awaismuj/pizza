const mongoose = require("mongoose");

const ASSET_CATEGORIES = [
  "Computers and Laptops",
  "Servers and Networking Equipment",
  "Furniture and Office Equipment",
  "Vehicles",
  "Machinery and Equipment",
  "Buildings and Property",
  "Mobile Phones and Electronics",
  "Software and Licenses",
  "Tools and Other Equipment",
  "Other Business Assets",
];

const assignmentSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    employeeName: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    assignedAt: { type: Date, required: true },
    returnedAt: { type: Date, default: null },
    note: { type: String, trim: true, default: "" },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const valuationSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, min: 0 },
    source: { type: String, enum: ["Manual"], default: "Manual" },
    note: { type: String, trim: true, default: "" },
    valuedAt: { type: Date, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const maintenanceSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    cost: { type: Number, default: 0, min: 0 },
    serviceProvider: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
    scheduledAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    nextMaintenanceAt: { type: Date, default: null },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const auditSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    changes: { type: mongoose.Schema.Types.Mixed, default: {} },
    occurredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const disposalSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Sold", "Disposed", "Damaged", "Lost"], required: true },
    date: { type: Date, required: true },
    salePrice: { type: Number, default: 0, min: 0 },
    sellingExpenses: { type: Number, default: 0, min: 0 },
    bookValue: { type: Number, required: true, min: 0 },
    gainOrLoss: { type: Number, required: true },
    note: { type: String, trim: true, default: "" },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    name: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

const usageSchema = new mongoose.Schema(
  {
    period: { type: String, required: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    units: { type: Number, required: true, min: 0 },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const valueAdjustmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Acquisition correction", "Impairment", "Revaluation"], required: true },
    amount: { type: Number, required: true },
    effectiveAt: { type: Date, required: true },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const assetSchema = new mongoose.Schema(
  {
    assetId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, enum: ASSET_CATEGORIES, required: true },
    description: { type: String, trim: true, default: "", maxlength: 2000 },
    brand: { type: String, trim: true, default: "" },
    model: { type: String, trim: true, default: "" },
    serialNumber: { type: String, trim: true, default: "", index: true },
    purchaseDate: { type: Date, required: true },
    depreciationStartDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true, min: 0 },
    additionalCosts: { type: Number, default: 0, min: 0 },
    acquisitionCost: { type: Number, required: true, min: 0 },
    supplier: { type: String, trim: true, default: "" },
    invoiceNumber: { type: String, trim: true, default: "" },
    warrantyExpiry: { type: Date, default: null },
    location: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    assignedEmployeeName: { type: String, trim: true, default: "" },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor", "Damaged"],
      default: "Good",
    },
    usefulLifeYears: { type: Number, required: true, min: 0.01, max: 200 },
    residualValue: { type: Number, required: true, min: 0 },
    depreciationMethod: {
      type: String,
      enum: ["StraightLine", "DecliningBalance", "UnitsOfProduction"],
      required: true,
    },
    decliningBalanceMultiplier: { type: Number, default: 2, min: 1, max: 3 },
    estimatedLifetimeUsage: { type: Number, default: null, min: 0 },
    usageUnit: { type: String, trim: true, default: "" },
    marketValue: { type: Number, default: null, min: 0 },
    marketValueUpdatedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Active", "Archived", "Sold", "Disposed", "Damaged", "Lost"],
      default: "Active",
      index: true,
    },
    image: { type: String, default: "" },
    attachments: { type: [attachmentSchema], default: [] },
    assignmentHistory: { type: [assignmentSchema], default: [] },
    valuationHistory: { type: [valuationSchema], default: [] },
    maintenanceHistory: { type: [maintenanceSchema], default: [] },
    usageHistory: { type: [usageSchema], default: [] },
    valueAdjustments: { type: [valueAdjustmentSchema], default: [] },
    auditHistory: { type: [auditSchema], default: [] },
    disposal: { type: disposalSchema, default: null },
  },
  { timestamps: true }
);

assetSchema.index({ name: "text", assetId: "text", serialNumber: "text", supplier: "text" });
assetSchema.index({ category: 1, status: 1 });
assetSchema.index({ department: 1, location: 1 });

module.exports = { Asset: mongoose.model("Asset", assetSchema), ASSET_CATEGORIES };
