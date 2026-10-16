const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const Counter = require("../models/counterModel");
const { Asset, ASSET_CATEGORIES } = require("../models/assetModel");
const AssetDepreciation = require("../models/assetDepreciationModel");
const AssetDocument = require("../models/assetDocumentModel");
const Settings = require("../models/settingsModel");
const Staff = require("../models/staffModel");
const {
  roundMoney,
  periodBounds,
  daysInServiceForPeriod,
  calculateDepreciation,
  bookValueAt,
} = require("../utils/assetAccounting");

const VALID_ROLES = ["admin", "accountant", "asset manager", "read only"];
const FINANCIAL_ROLES = ["admin", "accountant"];
const ASSET_STATUSES = ["Active", "Archived", "Sold", "Disposed", "Damaged", "Lost"];
const validId = (value) => mongoose.Types.ObjectId.isValid(value);
const normalizedRole = (req) => String(req.user?.role || "").toLowerCase();
const isFinancialUser = (req) => FINANCIAL_ROLES.includes(normalizedRole(req));
const isReadOnlyUser = (req) => normalizedRole(req) === "read only";
const actorFor = (req) => ({
  actor: req.user?._id || null,
  actorName: req.user?.name || "Unknown user",
  actorRole: req.user?.role || "Unknown",
});

const audit = (asset, req, action, changes = {}) => {
  asset.auditHistory.push({ ...actorFor(req), action, changes, occurredAt: new Date() });
};

const money = (value) => roundMoney(Number(value) || 0);
const dateValue = (value, field, { optional = false } = {}) => {
  if ((value === undefined || value === null || value === "") && optional) return null;
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) throw createHttpError(400, `${field} must be a valid date.`);
  return date;
};
const endOfDate = (value, field) => {
  const date = dateValue(value, field);
  date.setUTCHours(23, 59, 59, 999);
  return date;
};

const getAssetOr404 = async (id) => {
  if (!validId(id)) throw createHttpError(400, "Invalid asset ID.");
  const asset = await Asset.findById(id);
  if (!asset) throw createHttpError(404, "Asset not found.");
  return asset;
};

const depreciationRowsFor = async (assetIds) =>
  AssetDepreciation.find({ asset: { $in: assetIds } }).sort({ period: 1 }).lean();

const decorateAssets = async (assets, req, asOf = new Date()) => {
  if (!assets.length) return [];
  const rows = await depreciationRowsFor(assets.map((asset) => asset._id));
  const byAsset = new Map();
  rows.forEach((row) => {
    const id = String(row.asset);
    if (!byAsset.has(id)) byAsset.set(id, []);
    byAsset.get(id).push(row);
  });
  const canSeeFinance = isFinancialUser(req) || normalizedRole(req) === "read only";
  return assets.map((asset) => {
    const raw = asset.toObject ? asset.toObject() : asset;
    const values = bookValueAt({
      acquisitionCost: raw.acquisitionCost,
      depreciationRows: byAsset.get(String(raw._id)) || [],
      adjustments: raw.valueAdjustments || [],
      residualValue: raw.residualValue,
      asOf,
    });
    const shaped = {
      ...raw,
      accumulatedDepreciation: values.accumulatedDepreciation,
      currentBookValue: values.currentBookValue,
      totalMaintenanceCost: money(
        (raw.maintenanceHistory || [])
          .filter((entry) => entry.status === "Completed")
          .reduce((sum, entry) => sum + (Number(entry.cost) || 0), 0)
      ),
      currentMarketValue: raw.marketValue,
    };
    if (!canSeeFinance) {
      delete shaped.purchasePrice;
      delete shaped.additionalCosts;
      delete shaped.acquisitionCost;
      delete shaped.accumulatedDepreciation;
      delete shaped.currentBookValue;
      delete shaped.currentMarketValue;
      delete shaped.marketValue;
      delete shaped.valuationHistory;
      delete shaped.valueAdjustments;
      delete shaped.disposal;
      delete shaped.totalMaintenanceCost;
      shaped.auditHistory = (raw.auditHistory || []).map((entry) => ({
        ...entry,
        changes: Object.fromEntries(
          Object.entries(entry.changes || {}).filter(([key]) =>
            !/price|cost|book|depreciation|market|value|gain|loss|proceeds/i.test(key)
          )
        ),
      }));
      shaped.maintenanceHistory = (raw.maintenanceHistory || []).map((entry) => {
        const maintenance = { ...entry };
        delete maintenance.cost;
        return maintenance;
      });
    }
    return shaped;
  });
};

const parseFilterQuery = (query) => {
  const filter = {};
  if (query.category && ASSET_CATEGORIES.includes(query.category)) filter.category = query.category;
  if (query.status && ASSET_STATUSES.includes(query.status)) filter.status = query.status;
  if (query.department === "Unassigned") filter.department = { $in: ["", null] };
  else if (query.department) filter.department = query.department;
  if (query.location === "Unassigned") filter.location = { $in: ["", null] };
  else if (query.location) filter.location = query.location;
  if (query.depreciationMethod && ["StraightLine", "DecliningBalance", "UnitsOfProduction"].includes(query.depreciationMethod)) {
    filter.depreciationMethod = query.depreciationMethod;
  }
  if (query.from || query.to) {
    filter.purchaseDate = {};
    if (query.from) filter.purchaseDate.$gte = dateValue(query.from, "From date");
    if (query.to) filter.purchaseDate.$lte = endOfDate(query.to, "To date");
  }
  if (query.search) {
    const escaped = String(query.search).trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (escaped) {
      const expression = new RegExp(escaped, "i");
      filter.$or = [{ assetId: expression }, { name: expression }, { serialNumber: expression }, { brand: expression }];
    }
  }
  return filter;
};

const getAssets = async (req, res, next) => {
  try {
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit) || 20)));
    const filter = parseFilterQuery(req.query);
    const sortableFields = ["purchaseDate", "name", "acquisitionCost", "status", "category", "location"];
    const requestedSort = req.query.sort === "acquisitionCost" && !isFinancialUser(req) && !isReadOnlyUser(req)
      ? "purchaseDate"
      : req.query.sort;
    const sortField = sortableFields.includes(requestedSort) ? requestedSort : "purchaseDate";
    const sortDirection = req.query.direction === "asc" ? 1 : -1;
    const [assets, total] = await Promise.all([
      Asset.find(filter)
        .populate({ path: "assignedEmployee", select: "name designation" })
        .sort({ [sortField]: sortDirection, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Asset.countDocuments(filter),
    ]);
    const data = await decorateAssets(assets, req);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getAsset = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    const [decorated] = await decorateAssets([asset], req);
    res.json({ success: true, data: decorated });
  } catch (error) {
    next(error);
  }
};

const getAssetSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ key: "global" });
    res.json({
      success: true,
      data: {
        currency: settings?.assetAccounting?.currency || "PKR",
        financialYearStartMonth: settings?.assetAccounting?.financialYearStartMonth || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAssetSettings = async (req, res, next) => {
  try {
    const currency = String(req.body?.currency || "").trim().toUpperCase();
    const financialYearStartMonth = Number(req.body?.financialYearStartMonth);
    let validCurrency = false;
    try {
      new Intl.NumberFormat("en", { style: "currency", currency }).format(0);
      validCurrency = /^[A-Z]{3}$/.test(currency);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
    }
    if (!validCurrency) throw createHttpError(400, "Currency must be a supported three-letter ISO code, such as PKR.");
    if (!Number.isInteger(financialYearStartMonth) || financialYearStartMonth < 1 || financialYearStartMonth > 12) {
      throw createHttpError(400, "Financial year start month must be from 1 to 12.");
    }
    const settings = await Settings.findOneAndUpdate(
      { key: "global" },
      { $set: { "assetAccounting.currency": currency, "assetAccounting.financialYearStartMonth": financialYearStartMonth } },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );
    res.json({
      success: true,
      data: {
        currency: settings.assetAccounting.currency,
        financialYearStartMonth: settings.assetAccounting.financialYearStartMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};

const validateNewAsset = (body) => {
  const requiredText = ["name", "category", "depreciationMethod", "condition"];
  if (requiredText.some((field) => !String(body[field] || "").trim())) {
    throw createHttpError(400, "Asset name, category, condition, and depreciation method are required.");
  }
  if (!ASSET_CATEGORIES.includes(body.category)) throw createHttpError(400, "Select a valid asset category.");
  if (!["StraightLine", "DecliningBalance", "UnitsOfProduction"].includes(body.depreciationMethod)) {
    throw createHttpError(400, "Select a valid depreciation method.");
  }
  if (body.purchasePrice === undefined || body.purchasePrice === null || body.purchasePrice === "" ||
      body.usefulLifeYears === undefined || body.usefulLifeYears === null || body.usefulLifeYears === "") {
    throw createHttpError(400, "Purchase price and useful life are required.");
  }
  const purchasePrice = Number(body.purchasePrice);
  const additionalCosts = Number(body.additionalCosts || 0);
  const usefulLifeYears = Number(body.usefulLifeYears);
  const residualValue = Number(body.residualValue || 0);
  if (!Number.isFinite(purchasePrice) || purchasePrice < 0 ||
      !Number.isFinite(additionalCosts) || additionalCosts < 0 ||
      !Number.isFinite(usefulLifeYears) || usefulLifeYears <= 0 || usefulLifeYears > 200 ||
      !Number.isFinite(residualValue) || residualValue < 0 ||
      residualValue > purchasePrice + additionalCosts) {
    throw createHttpError(400, "Enter valid acquisition costs, useful life, and residual value.");
  }
  if (body.depreciationMethod === "UnitsOfProduction" &&
      (!Number.isFinite(Number(body.estimatedLifetimeUsage)) || Number(body.estimatedLifetimeUsage) <= 0)) {
    throw createHttpError(400, "Units-of-production assets need an estimated lifetime usage greater than zero.");
  }
  const multiplier = Number(body.decliningBalanceMultiplier || 2);
  if (!Number.isFinite(multiplier) || multiplier < 1 || multiplier > 3) {
    throw createHttpError(400, "Declining-balance multiplier must be from 1 to 3.");
  }
  return {
    purchasePrice: money(purchasePrice),
    additionalCosts: money(additionalCosts),
    acquisitionCost: money(purchasePrice + additionalCosts),
    usefulLifeYears,
    residualValue: money(residualValue),
  };
};

const getUploadedAttachments = async (attachments, userId) => {
  if (attachments === undefined || attachments === null) return [];
  if (!Array.isArray(attachments)) {
    throw createHttpError(400, "Asset documents must be provided as a list.");
  }
  if (!attachments.length) return [];

  const filenames = attachments.map((item) =>
    typeof item?.filename === "string" ? item.filename : ""
  );
  if (filenames.some((filename) => !filename) || new Set(filenames).size !== filenames.length) {
    throw createHttpError(400, "Select valid, unique asset documents.");
  }
  const documents = await AssetDocument.find({
    filename: { $in: filenames },
    uploadedBy: userId,
  }).select("filename originalName mimeType size");
  if (documents.length !== filenames.length) {
    throw createHttpError(400, "One or more uploaded asset documents are unavailable.");
  }
  return documents.map((document) => ({
    filename: document.filename,
    name: document.originalName,
    mimeType: document.mimeType,
    size: document.size,
    uploadedBy: userId,
  }));
};

const createAsset = async (req, res, next) => {
  try {
    const body = req.body || {};
    const financial = validateNewAsset(body);
    const purchaseDate = dateValue(body.purchaseDate, "Purchase date");
    const depreciationStartDate = dateValue(body.depreciationStartDate || body.purchaseDate, "Depreciation start date");
    if (depreciationStartDate < purchaseDate) throw createHttpError(400, "Depreciation cannot start before the purchase date.");
    if (purchaseDate > new Date()) throw createHttpError(400, "Purchase date cannot be in the future.");

    const year = purchaseDate.getUTCFullYear();
    const counter = await Counter.findOneAndUpdate(
      { _id: `asset-${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const asset = new Asset({
      ...financial,
      assetId: `AST-${year}-${String(counter.seq).padStart(5, "0")}`,
      name: String(body.name).trim(),
      category: body.category,
      description: String(body.description || "").trim(),
      brand: String(body.brand || "").trim(),
      model: String(body.model || "").trim(),
      serialNumber: String(body.serialNumber || "").trim(),
      purchaseDate,
      depreciationStartDate,
      supplier: String(body.supplier || "").trim(),
      invoiceNumber: String(body.invoiceNumber || "").trim(),
      warrantyExpiry: dateValue(body.warrantyExpiry, "Warranty expiry", { optional: true }),
      location: String(body.location || "").trim(),
      department: String(body.department || "").trim(),
      assignedEmployeeName: String(body.assignedEmployeeName || "").trim(),
      condition: body.condition,
      decliningBalanceMultiplier: Number(body.decliningBalanceMultiplier || 2),
      estimatedLifetimeUsage: body.depreciationMethod === "UnitsOfProduction" ? Number(body.estimatedLifetimeUsage) : null,
      usageUnit: String(body.usageUnit || "").trim(),
      marketValue: body.marketValue === undefined || body.marketValue === "" ? null : money(body.marketValue),
      image: String(body.image || ""),
      attachments: [],
    });
    if (body.marketValue !== undefined && body.marketValue !== "") {
      const marketValue = Number(body.marketValue);
      if (!Number.isFinite(marketValue) || marketValue < 0) throw createHttpError(400, "Enter a valid market value.");
      asset.marketValue = money(marketValue);
      asset.marketValueUpdatedAt = new Date();
      asset.valuationHistory.push({
        value: asset.marketValue,
        source: "Manual",
        note: String(body.marketValueNote || "").trim(),
        valuedAt: asset.marketValueUpdatedAt,
        changedBy: req.user._id,
      });
      audit(asset, req, "Market value set at registration", { value: asset.marketValue, source: "Manual" });
    }
    asset.attachments = await getUploadedAttachments(body.attachments, req.user._id);
    if (body.assignedEmployee && validId(body.assignedEmployee)) {
      const employee = await Staff.findById(body.assignedEmployee);
      if (!employee) throw createHttpError(400, "Select an existing employee.");
      asset.assignedEmployee = employee._id;
      asset.assignedEmployeeName = employee.name;
    }
    if (asset.assignedEmployeeName || asset.department || asset.location) {
      asset.assignmentHistory.push({
        employee: asset.assignedEmployee,
        employeeName: asset.assignedEmployeeName,
        department: asset.department,
        location: asset.location,
        assignedAt: purchaseDate,
        changedBy: req.user._id,
      });
    }
    audit(asset, req, "Created", {
      assetId: asset.assetId,
      acquisitionCost: asset.acquisitionCost,
      depreciationMethod: asset.depreciationMethod,
    });
    await asset.save();
    res.status(201).json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    if (asset.disposal) throw createHttpError(409, "Disposed assets cannot be edited.");
    const fields = ["name", "category", "description", "brand", "model", "serialNumber", "supplier",
      "invoiceNumber", "condition", "image", "warrantyExpiry"];
    const changes = {};
    fields.forEach((field) => {
      if (req.body[field] === undefined) return;
      let value = req.body[field];
      if (field === "category" && !ASSET_CATEGORIES.includes(value)) {
        throw createHttpError(400, "Select a valid asset category.");
      }
      if (field === "warrantyExpiry") value = dateValue(value, "Warranty expiry", { optional: true });
      if (field === "name") value = String(value).trim();
      if (typeof value === "string") value = value.trim();
      if (String(asset[field] ?? "") !== String(value ?? "")) {
        changes[field] = { from: asset[field], to: value };
        asset[field] = value;
      }
    });
    if (req.body.attachments !== undefined) {
      const uploadedAttachments = await getUploadedAttachments(req.body.attachments, req.user._id);
      const existingFilenames = new Set((asset.attachments || []).map((attachment) => attachment.filename));
      const additions = uploadedAttachments.filter((attachment) => !existingFilenames.has(attachment.filename));
      if (additions.length) {
        asset.attachments.push(...additions);
        changes.attachments = { added: additions.map((attachment) => attachment.name) };
      }
    }
    const assignmentFields = ["assignedEmployeeName", "department", "location"];
    const assignmentChanged = assignmentFields.some((field) =>
      req.body[field] !== undefined && String(req.body[field] || "").trim() !== String(asset[field] || ""));
    if (assignmentChanged) {
      const previous = asset.assignmentHistory.find((assignment) => !assignment.returnedAt);
      const assignedAt = new Date();
      if (previous) previous.returnedAt = assignedAt;
      const employeeName = req.body.assignedEmployeeName === undefined
        ? asset.assignedEmployeeName
        : String(req.body.assignedEmployeeName || "").trim();
      const assignment = {
        employee: employeeName === asset.assignedEmployeeName ? asset.assignedEmployee : null,
        employeeName,
        department: req.body.department === undefined ? asset.department : String(req.body.department || "").trim(),
        location: req.body.location === undefined ? asset.location : String(req.body.location || "").trim(),
        assignedAt,
        note: "Updated via asset details",
        changedBy: req.user._id,
      };
      asset.assignmentHistory.push(assignment);
      asset.assignedEmployee = assignment.employee;
      asset.assignedEmployeeName = assignment.employeeName;
      asset.department = assignment.department;
      asset.location = assignment.location;
      changes.assignment = {
        from: previous ? { employeeName: previous.employeeName, department: previous.department, location: previous.location } : null,
        to: { employeeName: assignment.employeeName, department: assignment.department, location: assignment.location },
      };
    }
    const changedAccountingPolicy =
      (req.body.usefulLifeYears !== undefined && Number(req.body.usefulLifeYears) !== asset.usefulLifeYears) ||
      (req.body.residualValue !== undefined && Number(req.body.residualValue) !== asset.residualValue) ||
      (req.body.depreciationMethod !== undefined && req.body.depreciationMethod !== asset.depreciationMethod) ||
      (req.body.decliningBalanceMultiplier !== undefined && Number(req.body.decliningBalanceMultiplier) !== asset.decliningBalanceMultiplier) ||
      (req.body.estimatedLifetimeUsage !== undefined && Number(req.body.estimatedLifetimeUsage) !== asset.estimatedLifetimeUsage) ||
      (req.body.usageUnit !== undefined && String(req.body.usageUnit || "").trim() !== asset.usageUnit);
    if (changedAccountingPolicy) {
      if (!isFinancialUser(req)) throw createHttpError(403, "Only an Administrator or Accountant can change depreciation policy.");
      if (req.body.usefulLifeYears !== undefined && Number(req.body.usefulLifeYears) !== asset.usefulLifeYears) {
        const life = Number(req.body.usefulLifeYears);
        if (!Number.isFinite(life) || life <= 0 || life > 200) throw createHttpError(400, "Useful life must be greater than zero and no more than 200 years.");
        changes.usefulLifeYears = { from: asset.usefulLifeYears, to: life };
        asset.usefulLifeYears = life;
      }
      if (req.body.residualValue !== undefined && Number(req.body.residualValue) !== asset.residualValue) {
        const residual = Number(req.body.residualValue);
        if (!Number.isFinite(residual) || residual < 0 || residual > asset.acquisitionCost) {
          throw createHttpError(400, "Residual value must be between zero and total acquisition cost.");
        }
        changes.residualValue = { from: asset.residualValue, to: residual };
        asset.residualValue = residual;
      }
      if (req.body.depreciationMethod !== undefined && req.body.depreciationMethod !== asset.depreciationMethod) {
        if (!["StraightLine", "DecliningBalance", "UnitsOfProduction"].includes(req.body.depreciationMethod)) {
          throw createHttpError(400, "Select a valid depreciation method.");
        }
        changes.depreciationMethod = { from: asset.depreciationMethod, to: req.body.depreciationMethod };
        asset.depreciationMethod = req.body.depreciationMethod;
      }
      if (req.body.decliningBalanceMultiplier !== undefined && Number(req.body.decliningBalanceMultiplier) !== asset.decliningBalanceMultiplier) {
        const multiplier = Number(req.body.decliningBalanceMultiplier);
        if (!Number.isFinite(multiplier) || multiplier < 1 || multiplier > 3) {
          throw createHttpError(400, "Declining-balance multiplier must be from 1 to 3.");
        }
        changes.decliningBalanceMultiplier = { from: asset.decliningBalanceMultiplier, to: multiplier };
        asset.decliningBalanceMultiplier = multiplier;
      }
      if (req.body.estimatedLifetimeUsage !== undefined &&
          Number(req.body.estimatedLifetimeUsage) !== asset.estimatedLifetimeUsage) {
        const estimate = Number(req.body.estimatedLifetimeUsage);
        const recordedUsage = asset.usageHistory.reduce((sum, entry) => sum + entry.units, 0);
        if (!Number.isFinite(estimate) || estimate <= recordedUsage) {
          throw createHttpError(400, "Estimated lifetime usage must be greater than usage already recorded.");
        }
        changes.estimatedLifetimeUsage = { from: asset.estimatedLifetimeUsage, to: estimate };
        asset.estimatedLifetimeUsage = estimate;
      }
      if (req.body.usageUnit !== undefined) {
        const usageUnit = String(req.body.usageUnit || "").trim();
        if (usageUnit !== asset.usageUnit) {
          changes.usageUnit = { from: asset.usageUnit, to: usageUnit };
          asset.usageUnit = usageUnit;
        }
      }
      if (asset.depreciationMethod === "UnitsOfProduction") {
        const recordedUsage = asset.usageHistory.reduce((sum, entry) => sum + entry.units, 0);
        if (!Number.isFinite(asset.estimatedLifetimeUsage) || asset.estimatedLifetimeUsage <= recordedUsage) {
          throw createHttpError(400, "Units-of-production assets need estimated lifetime usage greater than usage already recorded.");
        }
      }
    }
    if (Object.keys(changes).length) {
      audit(asset, req, "Updated", changes);
      await asset.save();
    }
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const archiveAsset = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    if (asset.disposal) throw createHttpError(409, "Disposed assets are already inactive.");
    const status = req.body?.status === "Active" ? "Active" : "Archived";
    const before = asset.status;
    asset.status = status;
    audit(asset, req, status === "Archived" ? "Archived" : "Reactivated", { status: { from: before, to: status } });
    await asset.save();
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const recordAssignment = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    if (asset.disposal) throw createHttpError(409, "Cannot assign a disposed asset.");
    const body = req.body || {};
    const employee = body.employee && validId(body.employee) ? await Staff.findById(body.employee) : null;
    if (body.employee && !employee) throw createHttpError(400, "Select an existing employee.");
    const assignedAt = dateValue(body.assignedAt || new Date(), "Assignment date");
    if (assignedAt > new Date()) throw createHttpError(400, "Assignment date cannot be in the future.");
    const previous = asset.assignmentHistory.find((assignment) => !assignment.returnedAt);
    if (previous) previous.returnedAt = assignedAt;
    const assignment = {
      employee: employee?._id || null,
      employeeName: employee?.name || String(body.employeeName || "").trim(),
      department: String(body.department || "").trim(),
      location: String(body.location || "").trim(),
      assignedAt,
      note: String(body.note || "").trim(),
      changedBy: req.user._id,
    };
    asset.assignmentHistory.push(assignment);
    asset.assignedEmployee = assignment.employee;
    asset.assignedEmployeeName = assignment.employeeName;
    asset.department = assignment.department;
    asset.location = assignment.location;
    audit(asset, req, "Transferred", {
      from: previous ? { employeeName: previous.employeeName, department: previous.department, location: previous.location } : null,
      to: { employeeName: assignment.employeeName, department: assignment.department, location: assignment.location },
    });
    await asset.save();
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const recordValuation = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    const value = Number(req.body?.value);
    if (!Number.isFinite(value) || value < 0) throw createHttpError(400, "Enter a valid market value.");
    const oldValue = asset.marketValue;
    const valuedAt = dateValue(req.body?.valuedAt || new Date(), "Valuation date");
    if (valuedAt > new Date()) throw createHttpError(400, "Valuation date cannot be in the future.");
    const note = String(req.body?.note || "").trim();
    asset.marketValue = money(value);
    asset.marketValueUpdatedAt = valuedAt;
    asset.valuationHistory.push({ value: asset.marketValue, source: "Manual", note, valuedAt, changedBy: req.user._id });
    audit(asset, req, "Market value updated", { from: oldValue, to: asset.marketValue, valuedAt, source: "Manual", note });
    await asset.save();
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const recordValueAdjustment = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    if (asset.disposal) throw createHttpError(409, "Disposed assets cannot be revalued.");
    const type = req.body?.type;
    if (!["Acquisition correction", "Impairment", "Revaluation"].includes(type)) {
      throw createHttpError(400, "Select a valid accounting adjustment type.");
    }
    const amount = Number(req.body?.amount);
    const reason = String(req.body?.reason || "").trim();
    const effectiveAt = dateValue(req.body?.effectiveAt, "Effective date");
    if (!Number.isFinite(amount) || amount === 0 || !reason) {
      throw createHttpError(400, "Enter a non-zero adjustment amount and an audit reason.");
    }
    if (effectiveAt.getUTCDate() !== 1 || effectiveAt < new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1))) {
      throw createHttpError(400, "Accounting adjustments must take effect on the first day of the current or a future month.");
    }
    const [rows] = await Promise.all([
      AssetDepreciation.find({ asset: asset._id }).sort({ period: 1 }).lean(),
    ]);
    if (rows.some((row) => row.period >= effectiveAt.toISOString().slice(0, 7))) {
      throw createHttpError(409, "An accounting adjustment cannot change a month with posted depreciation.");
    }
    const current = bookValueAt({
      acquisitionCost: asset.acquisitionCost,
      depreciationRows: rows,
      adjustments: asset.valueAdjustments,
      residualValue: asset.residualValue,
      asOf: effectiveAt,
    }).currentBookValue;
    if (current + amount < asset.residualValue) {
      throw createHttpError(400, "An impairment or correction cannot reduce book value below residual value.");
    }
    asset.valueAdjustments.push({ type, amount: money(amount), effectiveAt, reason, changedBy: req.user._id });
    audit(asset, req, type, { amount: money(amount), effectiveAt, reason, bookValueBefore: current, bookValueAfter: money(current + amount) });
    await asset.save();
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const recordMaintenance = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    const body = req.body || {};
    const type = String(body.type || "").trim();
    const description = String(body.description || "").trim();
    const cost = Number(body.cost || 0);
    if (!type || !description || !Number.isFinite(cost) || cost < 0) {
      throw createHttpError(400, "Maintenance type, description, and a non-negative cost are required.");
    }
    const status = body.status === "Completed" ? "Completed" : "Scheduled";
    const entry = {
      type,
      description,
      cost: money(cost),
      serviceProvider: String(body.serviceProvider || "").trim(),
      status,
      scheduledAt: dateValue(body.scheduledAt, "Scheduled date", { optional: true }),
      completedAt: status === "Completed" ? dateValue(body.completedAt || new Date(), "Completed date") : null,
      nextMaintenanceAt: dateValue(body.nextMaintenanceAt, "Next maintenance date", { optional: true }),
      changedBy: req.user._id,
    };
    asset.maintenanceHistory.push(entry);
    audit(asset, req, status === "Completed" ? "Maintenance completed" : "Maintenance scheduled", {
      type, description, cost: entry.cost, status,
    });
    await asset.save();
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const updateMaintenance = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    const entry = asset.maintenanceHistory.id(req.params.maintenanceId);
    if (!entry) throw createHttpError(404, "Maintenance record not found.");
    const status = req.body?.status;
    if (!["Scheduled", "Completed", "Cancelled"].includes(status)) {
      throw createHttpError(400, "Select a valid maintenance status.");
    }
    const previous = { status: entry.status, cost: entry.cost, completedAt: entry.completedAt };
    entry.status = status;
    if (status === "Completed") {
      entry.completedAt = dateValue(req.body?.completedAt || new Date(), "Completed date");
      if (req.body?.cost !== undefined) {
        const cost = Number(req.body.cost);
        if (!Number.isFinite(cost) || cost < 0) throw createHttpError(400, "Maintenance cost must be non-negative.");
        entry.cost = money(cost);
      }
      if (req.body?.nextMaintenanceAt !== undefined) {
        entry.nextMaintenanceAt = dateValue(req.body.nextMaintenanceAt, "Next maintenance date", { optional: true });
      }
    }
    audit(asset, req, `Maintenance ${status.toLowerCase()}`, {
      maintenanceId: req.params.maintenanceId,
      type: entry.type,
      before: previous,
      after: { status, cost: entry.cost, completedAt: entry.completedAt },
    });
    await asset.save();
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const recordUsage = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    if (asset.depreciationMethod !== "UnitsOfProduction") {
      throw createHttpError(400, "Usage can only be recorded for units-of-production assets.");
    }
    const period = String(req.body?.period || "");
    periodBounds(period);
    if (await AssetDepreciation.exists({ asset: asset._id, period })) {
      throw createHttpError(409, "Usage for a posted depreciation period is locked. Record an authorized accounting adjustment instead.");
    }
    const units = Number(req.body?.units);
    if (!Number.isFinite(units) || units < 0) throw createHttpError(400, "Usage must be a non-negative number.");
    const record = { period, units, recordedBy: req.user._id, recordedAt: new Date() };
    const index = asset.usageHistory.findIndex((entry) => entry.period === period);
    if (index >= 0) asset.usageHistory[index] = record;
    else asset.usageHistory.push(record);
    audit(asset, req, "Production usage recorded", { period, units, unit: asset.usageUnit });
    await asset.save();
    res.json({ success: true, data: asset.usageHistory });
  } catch (error) {
    next(error);
  }
};

const processDepreciationForAsset = async (asset, period, source, user = null) => {
  if (asset.disposal && asset.disposal.date < periodBounds(period).start) return null;
  const bounds = periodBounds(period);
  if (asset.depreciationStartDate > bounds.end ||
      (["Sold", "Disposed", "Damaged", "Lost"].includes(asset.status) && !asset.disposal)) return null;
  const usefulLifeEnd = new Date(asset.depreciationStartDate);
  const usefulLifeMonths = Math.ceil(asset.usefulLifeYears * 12);
  const originalDay = usefulLifeEnd.getUTCDate();
  usefulLifeEnd.setUTCDate(1);
  usefulLifeEnd.setUTCMonth(usefulLifeEnd.getUTCMonth() + usefulLifeMonths);
  usefulLifeEnd.setUTCDate(Math.min(originalDay, new Date(Date.UTC(usefulLifeEnd.getUTCFullYear(), usefulLifeEnd.getUTCMonth() + 1, 0)).getUTCDate()));
  const usefulLifeLastDay = new Date(usefulLifeEnd.getTime() - 86400000);
  const depreciationEnd = asset.disposal?.date && asset.disposal.date < usefulLifeLastDay ? asset.disposal.date : usefulLifeLastDay;
  const daysInService = daysInServiceForPeriod(period, asset.depreciationStartDate, depreciationEnd);
  if (!daysInService) return null;

  const existing = await AssetDepreciation.findOne({ asset: asset._id, period });
  if (existing) return existing;
  const previousRows = await AssetDepreciation.find({ asset: asset._id, period: { $lt: period } }).sort({ period: 1 }).lean();
  const adjustmentsBeforePeriod = asset.valueAdjustments.filter((adjustment) => new Date(adjustment.effectiveAt) <= bounds.start);
  const adjustmentBalance = adjustmentsBeforePeriod.reduce((sum, adjustment) => sum + adjustment.amount, 0);
  const openingBookValue = money(Math.max(
    asset.residualValue,
    asset.acquisitionCost + adjustmentBalance - previousRows.reduce((sum, row) => sum + row.depreciation, 0)
  ));
  const usage = asset.usageHistory.find((entry) => entry.period === period);
  if (asset.depreciationMethod === "UnitsOfProduction" && !usage) return null;
  const startDate = new Date(asset.depreciationStartDate);
  const monthsElapsed = (Number(period.slice(0, 4)) - startDate.getUTCFullYear()) * 12 +
    (Number(period.slice(5, 7)) - 1 - startDate.getUTCMonth());
  const remainingMonths = Math.max(1, Math.ceil(asset.usefulLifeYears * 12) - monthsElapsed);
  const remainingUsage = asset.estimatedLifetimeUsage === null
    ? null
    : asset.estimatedLifetimeUsage - previousRows.reduce((sum, row) => sum + (row.unitsProduced || 0), 0);
  if (asset.depreciationMethod === "UnitsOfProduction" && remainingUsage <= 0) return null;
  const estimateWasRevised = (asset.auditHistory || []).some((entry) =>
    entry.action === "Updated" &&
    entry.occurredAt <= bounds.start &&
    ["usefulLifeYears", "residualValue", "depreciationMethod", "decliningBalanceMultiplier", "estimatedLifetimeUsage"]
      .some((field) => Object.prototype.hasOwnProperty.call(entry.changes || {}, field))
  );
  const depreciation = calculateDepreciation({
    method: asset.depreciationMethod,
    acquisitionCost: asset.acquisitionCost,
    residualValue: asset.residualValue,
    usefulLifeYears: asset.usefulLifeYears,
    decliningBalanceMultiplier: asset.decliningBalanceMultiplier,
    openingBookValue,
    daysInService,
    daysInPeriod: bounds.days,
    unitsProduced: usage ? usage.units * (daysInService / bounds.days) : undefined,
    estimatedLifetimeUsage: asset.depreciationMethod === "UnitsOfProduction" ? remainingUsage : asset.estimatedLifetimeUsage,
    remainingMonths: adjustmentsBeforePeriod.length || estimateWasRevised ? remainingMonths : undefined,
    depreciableBasis: adjustmentsBeforePeriod.length || estimateWasRevised ? openingBookValue : undefined,
  });
  const values = {
    asset: asset._id,
    period,
    method: asset.depreciationMethod,
    openingBookValue,
    depreciation,
    closingBookValue: money(Math.max(asset.residualValue, openingBookValue - depreciation)),
    unitsProduced: usage?.units ?? null,
    daysInService,
    calculatedAt: new Date(),
    calculatedBy: user?._id || null,
    calculationSource: source,
  };
  try {
    return await AssetDepreciation.create(values);
  } catch (error) {
    if (error.code === 11000) return AssetDepreciation.findOne({ asset: asset._id, period });
    throw error;
  }
};

const runDepreciationPeriod = async (req, res, next) => {
  try {
    const period = String(req.body?.period || "");
    periodBounds(period);
    if (period >= new Date().toISOString().slice(0, 7)) {
      throw createHttpError(400, "Depreciation can only be posted for a completed financial period.");
    }
    const assets = await Asset.find({ depreciationStartDate: { $lte: periodBounds(period).end } });
    const outcomes = await Promise.all(assets.map((asset) => processDepreciationForAsset(asset, period, "Manual", req.user)));
    res.json({
      success: true,
      data: {
        period,
        processed: outcomes.filter(Boolean).length,
        skipped: outcomes.filter((row) => !row).length,
        rows: outcomes.filter(Boolean),
      },
    });
  } catch (error) {
    next(error);
  }
};

const disposeAsset = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    if (asset.disposal) throw createHttpError(409, "This asset has already been disposed.");
    const body = req.body || {};
    const type = body.type;
    if (!["Sold", "Disposed", "Damaged", "Lost"].includes(type)) throw createHttpError(400, "Select a valid disposal type.");
    const date = dateValue(body.date, "Disposal date");
    if (date > new Date()) throw createHttpError(400, "Disposal date cannot be in the future.");
    const [rows, salePrice, sellingExpenses] = await Promise.all([
      AssetDepreciation.find({ asset: asset._id }).sort({ period: 1 }).lean(),
      Promise.resolve(Number(body.salePrice || 0)),
      Promise.resolve(Number(body.sellingExpenses || 0)),
    ]);
    if (!Number.isFinite(salePrice) || salePrice < 0 || !Number.isFinite(sellingExpenses) || sellingExpenses < 0) {
      throw createHttpError(400, "Sale proceeds and selling expenses must be non-negative amounts.");
    }
    if (date < asset.purchaseDate) throw createHttpError(400, "Disposal date cannot be before the asset purchase date.");
    const latestPeriod = rows.at(-1)?.period;
    if (latestPeriod && date < periodBounds(latestPeriod).end) {
      throw createHttpError(400, `Disposal date cannot be before the latest posted depreciation period (${latestPeriod}).`);
    }
    const { currentBookValue } = bookValueAt({
      acquisitionCost: asset.acquisitionCost,
      depreciationRows: rows,
      adjustments: asset.valueAdjustments,
      residualValue: asset.residualValue,
      asOf: date,
    });
    const netProceeds = type === "Sold" ? salePrice - sellingExpenses : -sellingExpenses;
    const gainOrLoss = money(netProceeds - currentBookValue);
    asset.disposal = {
      type, date, salePrice: money(salePrice), sellingExpenses: money(sellingExpenses),
      bookValue: currentBookValue, gainOrLoss, note: String(body.note || "").trim(), changedBy: req.user._id,
    };
    asset.status = type;
    audit(asset, req, "Disposed", {
      type, date, bookValue: currentBookValue, salePrice: money(salePrice),
      sellingExpenses: money(sellingExpenses), gainOrLoss,
    });
    await asset.save();
    res.json({ success: true, data: (await decorateAssets([asset], req))[0] });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const assets = await Asset.find().lean();
    const rows = assets.length ? await AssetDepreciation.find({ asset: { $in: assets.map((a) => a._id) } }).lean() : [];
    const byAsset = new Map();
    rows.forEach((row) => {
      const id = String(row.asset);
      if (!byAsset.has(id)) byAsset.set(id, []);
      byAsset.get(id).push(row);
    });
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const thisMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    const owned = assets.filter((asset) => ["Active", "Archived"].includes(asset.status));
    const currentRows = rows.filter((row) => row.period === currentMonth);
    const values = assets.map((asset) => ({
      asset,
      ...bookValueAt({
        acquisitionCost: asset.acquisitionCost,
        depreciationRows: byAsset.get(String(asset._id)) || [],
        adjustments: asset.valueAdjustments || [],
        residualValue: asset.residualValue,
        asOf: now,
      }),
    }));
    const valueByAsset = new Map(values.map((value) => [String(value.asset._id), value]));
    const categoryTotals = new Map();
    const departmentTotals = new Map();
    const locationTotals = new Map();
    values.filter(({ asset }) => ["Active", "Archived"].includes(asset.status)).forEach(({ asset, currentBookValue }) => {
      categoryTotals.set(asset.category, (categoryTotals.get(asset.category) || 0) + currentBookValue);
      const department = asset.department || "Unassigned";
      departmentTotals.set(department, (departmentTotals.get(department) || 0) + currentBookValue);
      const location = asset.location || "Unassigned";
      locationTotals.set(location, (locationTotals.get(location) || 0) + currentBookValue);
    });
    const periods = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (11 - index), 1));
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    });
    const depreciationByMonth = periods.map((period) => ({
      period,
      amount: money(rows.filter((row) => row.period === period).reduce((sum, row) => sum + row.depreciation, 0)),
    }));
    const valueOverTime = periods.map((period) => {
      const asOf = periodBounds(period).end;
      const book = assets.reduce((sum, asset) => {
        if (asset.purchaseDate > asOf || (asset.disposal?.date && asset.disposal.date < asOf)) return sum;
        const dep = (byAsset.get(String(asset._id)) || [])
          .filter((row) => row.period <= period)
          .reduce((total, row) => total + row.depreciation, 0);
        const adjustments = (asset.valueAdjustments || [])
          .filter((entry) => new Date(entry.effectiveAt) <= asOf)
          .reduce((total, entry) => total + entry.amount, 0);
        return sum + Math.max(asset.residualValue, asset.acquisitionCost + adjustments - dep);
      }, 0);
      return { period, bookValue: money(book) };
    });
    const latestMaintenance = owned.flatMap((asset) => asset.maintenanceHistory || []);
    const dueMaintenance = latestMaintenance.filter((entry) => {
      const dueDate = entry.status === "Scheduled" ? entry.scheduledAt : entry.nextMaintenanceAt;
      return dueDate && new Date(dueDate) <= nextMonthStart;
    });
    const warrantyExpired = owned.filter((asset) => asset.warrantyExpiry && new Date(asset.warrantyExpiry) < now);
    const purchasedThisMonth = assets.filter((asset) => asset.purchaseDate >= thisMonthStart && asset.purchaseDate < nextMonthStart);
    const endOfLife = owned.filter((asset) => {
      const endDate = new Date(asset.depreciationStartDate);
      endDate.setUTCMonth(endDate.getUTCMonth() + Math.ceil(asset.usefulLifeYears * 12));
      return endDate <= new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 12, 1));
    });
    const settings = await Settings.findOne({ key: "global" }).select("assetAccounting");
    const result = {
      totalAssets: assets.length,
      originalPurchaseCost: money(owned.reduce((sum, asset) => sum + asset.acquisitionCost, 0)),
      accumulatedDepreciation: money(owned.reduce((sum, asset) => sum + valueByAsset.get(String(asset._id)).accumulatedDepreciation, 0)),
      currentBookValue: money(owned.reduce((sum, asset) => sum + valueByAsset.get(String(asset._id)).currentBookValue, 0)),
      estimatedMarketValue: owned.some((asset) => asset.marketValue !== null)
        ? money(owned.reduce((sum, asset) => sum + (asset.marketValue || 0), 0))
        : null,
      assetsPurchasedThisMonth: purchasedThisMonth.length,
      nearingEndOfUsefulLife: endOfLife.length,
      maintenanceDue: dueMaintenance.length,
      expiredWarranties: warrantyExpired.length,
      disposedAssets: assets.filter((asset) => ["Sold", "Disposed", "Damaged", "Lost"].includes(asset.status)).length,
      currency: settings?.assetAccounting?.currency || "PKR",
      financialYearStartMonth: settings?.assetAccounting?.financialYearStartMonth || 1,
      assetsByCategory: [...categoryTotals].map(([label, value]) => ({ label, value: money(value) })),
      assetsByDepartment: [...departmentTotals].map(([label, value]) => ({ label, value: money(value) })),
      assetsByLocation: [...locationTotals].map(([label, value]) => ({ label, value: money(value) })),
      assetValueOverTime: valueOverTime,
      depreciationByMonth,
      maintenanceAlerts: dueMaintenance.map((entry) => ({
        type: entry.type,
        description: entry.description,
        scheduledAt: entry.status === "Scheduled" ? entry.scheduledAt : entry.nextMaintenanceAt,
        status: entry.status,
      })),
    };
    if (!isFinancialUser(req) && normalizedRole(req) !== "read only") {
      result.originalPurchaseCost = null;
      result.accumulatedDepreciation = null;
      result.currentBookValue = null;
      result.estimatedMarketValue = null;
      result.assetsByCategory = [];
      result.assetsByDepartment = [];
      result.assetsByLocation = [];
      result.assetValueOverTime = [];
      result.depreciationByMonth = [];
    }
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const reportRows = async (query) => {
  const type = String(query.type || "register");
  const filterQuery = ["depreciation", "maintenance", "disposal", "warranty"].includes(type)
    ? { ...query, from: undefined, to: undefined }
    : query;
  const filter = parseFilterQuery(filterQuery);
  const assets = await Asset.find(filter).populate({ path: "assignedEmployee", select: "name designation" }).sort({ purchaseDate: -1 });
  const decorated = await decorateAssets(assets, { user: { role: "Accountant" } });
  const registerRows = decorated.map((asset) => ({
    assetId: asset.assetId,
    name: asset.name,
    category: asset.category,
    brand: asset.brand,
    model: asset.model,
    serialNumber: asset.serialNumber,
    purchaseDate: asset.purchaseDate,
    purchasePrice: asset.purchasePrice,
    additionalCosts: asset.additionalCosts,
    acquisitionCost: asset.acquisitionCost,
    accumulatedDepreciation: asset.accumulatedDepreciation,
    currentBookValue: asset.currentBookValue,
    currentMarketValue: asset.currentMarketValue ?? "",
    marketValueUpdatedAt: asset.marketValueUpdatedAt ?? "",
    department: asset.department,
    location: asset.location,
    assignedEmployee: asset.assignedEmployeeName,
    depreciationMethod: asset.depreciationMethod,
    usefulLifeYears: asset.usefulLifeYears,
    residualValue: asset.residualValue,
    status: asset.status,
    warrantyExpiry: asset.warrantyExpiry ?? "",
    maintenanceCost: asset.totalMaintenanceCost,
    disposalGainOrLoss: asset.disposal?.gainOrLoss ?? "",
  }));
  if (type === "depreciation") {
    const periodFilter = {};
    if (query.from) periodFilter.$gte = String(query.from).slice(0, 7);
    if (query.to) periodFilter.$lte = String(query.to).slice(0, 7);
    const rows = await AssetDepreciation.find({
      asset: { $in: decorated.map((asset) => asset._id) },
      ...(Object.keys(periodFilter).length ? { period: periodFilter } : {}),
    }).sort({ period: 1 }).lean();
    return {
      assets: decorated,
      reports: rows.map((row) => {
        const asset = decorated.find((item) => String(item._id) === String(row.asset));
        return {
          assetId: asset?.assetId || "",
          name: asset?.name || "",
          period: row.period,
          method: row.method,
          openingBookValue: row.openingBookValue,
          depreciation: row.depreciation,
          closingBookValue: row.closingBookValue,
          unitsProduced: row.unitsProduced ?? "",
          daysInService: row.daysInService,
          calculatedAt: row.calculatedAt,
          calculationSource: row.calculationSource,
        };
      }),
    };
  }
  if (type === "maintenance") {
    const from = query.from ? dateValue(query.from, "From date") : null;
    const to = query.to ? dateValue(query.to, "To date") : null;
    if (to) to.setUTCHours(23, 59, 59, 999);
    return {
      assets: decorated,
      reports: decorated.flatMap((asset) => (asset.maintenanceHistory || [])
        .filter((entry) => entry.status === "Completed")
        .filter((entry) => {
          const date = entry.completedAt || entry.scheduledAt;
          return date && (!from || date >= from) && (!to || date <= to);
        })
        .map((entry) => ({
        assetId: asset.assetId,
        name: asset.name,
        category: asset.category,
        type: entry.type,
        description: entry.description,
        cost: entry.cost,
        serviceProvider: entry.serviceProvider,
        status: entry.status,
        scheduledAt: entry.scheduledAt || "",
        completedAt: entry.completedAt || "",
        nextMaintenanceAt: entry.nextMaintenanceAt || "",
      }))),
    };
  }
  if (type === "disposal") {
    return {
      assets: decorated,
      reports: decorated.filter((asset) => asset.disposal)
        .filter((asset) => (!query.from || asset.disposal.date >= dateValue(query.from, "From date")) &&
          (!query.to || asset.disposal.date <= endOfDate(query.to, "To date")))
        .map((asset) => ({
        assetId: asset.assetId,
        name: asset.name,
        category: asset.category,
        type: asset.disposal.type,
        date: asset.disposal.date,
        salePrice: asset.disposal.salePrice,
        sellingExpenses: asset.disposal.sellingExpenses,
        bookValue: asset.disposal.bookValue,
        gainOrLoss: asset.disposal.gainOrLoss,
        note: asset.disposal.note,
      })),
    };
  }
  if (type === "warranty") {
    return {
      assets: decorated,
      reports: decorated.filter((asset) => asset.warrantyExpiry)
        .filter((asset) => (!query.from || asset.warrantyExpiry >= dateValue(query.from, "From date")) &&
          (!query.to || asset.warrantyExpiry <= endOfDate(query.to, "To date")))
        .map((asset) => ({
        assetId: asset.assetId,
        name: asset.name,
        category: asset.category,
        supplier: asset.supplier,
        invoiceNumber: asset.invoiceNumber,
        warrantyExpiry: asset.warrantyExpiry,
        status: asset.status,
      })),
    };
  }
  if (type === "category" || type === "department" || type === "location") {
    const groupBy = type === "category" ? "category" : type;
    const groups = new Map();
    decorated.forEach((asset) => {
      const label = asset[groupBy] || "Unassigned";
      const current = groups.get(label) || {
        [groupBy]: label,
        assetCount: 0,
        originalAcquisitionCost: 0,
        accumulatedDepreciation: 0,
        currentBookValue: 0,
        estimatedMarketValue: 0,
      };
      current.assetCount += 1;
      current.originalAcquisitionCost += asset.acquisitionCost;
      current.accumulatedDepreciation += asset.accumulatedDepreciation;
      current.currentBookValue += asset.currentBookValue;
      current.estimatedMarketValue += asset.currentMarketValue || 0;
      groups.set(label, current);
    });
    return {
      assets: decorated,
      reports: [...groups.values()].map((group) => ({
        ...group,
        originalAcquisitionCost: money(group.originalAcquisitionCost),
        accumulatedDepreciation: money(group.accumulatedDepreciation),
        currentBookValue: money(group.currentBookValue),
        estimatedMarketValue: money(group.estimatedMarketValue),
      })),
    };
  }
  if (type === "monthly-summary" || type === "annual-summary") {
    const year = Number(query.year) || new Date().getUTCFullYear();
    const periodSettings = await Settings.findOne({ key: "global" }).select("assetAccounting");
    const fyStart = Number(periodSettings?.assetAccounting?.financialYearStartMonth || 1);
    const firstMonth = type === "annual-summary" ? fyStart : 1;
    const fiscalStart = new Date(Date.UTC(year, firstMonth - 1, 1));
    const monthPeriods = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(Date.UTC(fiscalStart.getUTCFullYear(), fiscalStart.getUTCMonth() + index, 1));
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    });
    const rows = await AssetDepreciation.find({
      asset: { $in: decorated.map((asset) => asset._id) },
      period: { $lte: monthPeriods[monthPeriods.length - 1] },
    }).lean();
    return {
      assets: decorated,
      reports: monthPeriods.map((period) => ({
        period,
        assetCount: decorated.filter((asset) => asset.purchaseDate <= periodBounds(period).end && asset.status === "Active").length,
        acquisitions: money(decorated.filter((asset) => asset.purchaseDate.toISOString().slice(0, 7) === period)
          .reduce((sum, asset) => sum + asset.acquisitionCost, 0)),
        depreciation: money(rows.filter((row) => row.period === period).reduce((sum, row) => sum + row.depreciation, 0)),
        bookValue: money(decorated.reduce((sum, asset) => {
          if (asset.purchaseDate > periodBounds(period).end || (asset.disposal?.date && asset.disposal.date < periodBounds(period).end)) return sum;
          const assetDepreciation = rows.filter((row) => String(row.asset) === String(asset._id) && row.period <= period)
            .reduce((total, row) => total + row.depreciation, 0);
          const adjustmentBalance = (asset.valueAdjustments || [])
            .filter((entry) => new Date(entry.effectiveAt) <= periodBounds(period).end)
            .reduce((total, entry) => total + entry.amount, 0);
          return sum + Math.max(asset.residualValue, asset.acquisitionCost + adjustmentBalance - assetDepreciation);
        }, 0)),
      })),
    };
  }
  if (type === "valuation") {
    return { assets: decorated, reports: registerRows.map((row) => ({
      assetId: row.assetId, name: row.name, category: row.category,
      acquisitionCost: row.acquisitionCost, accumulatedDepreciation: row.accumulatedDepreciation,
      currentBookValue: row.currentBookValue, currentMarketValue: row.currentMarketValue,
      marketValueUpdatedAt: row.marketValueUpdatedAt,
    })) };
  }
  return { assets: decorated, reports: registerRows };
};

const csvCell = (value) => {
  let cell = String(value ?? "");
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(cell)) cell = `'${cell}`;
  return `"${cell.replace(/"/g, '""')}"`;
};
const toCsv = (rows) => {
  const columns = Object.keys(rows[0] || {});
  return [columns.map(csvCell).join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\r\n");
};
const xmlCell = (value) => {
  const string = String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const numeric = typeof value === "number" && Number.isFinite(value);
  return `<Cell><Data ss:Type="${numeric ? "Number" : "String"}">${string}</Data></Cell>`;
};
const toExcelXml = (rows) => {
  const columns = Object.keys(rows[0] || {});
  const header = `<Row>${columns.map((column) => xmlCell(column)).join("")}</Row>`;
  const body = rows.map((row) => `<Row>${columns.map((column) => xmlCell(row[column])).join("")}</Row>`).join("");
  return `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Asset Report"><Table>${header}${body}</Table></Worksheet></Workbook>`;
};

const buildAssetReportPdf = (rows, title, currency = "PKR") =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 32 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fontSize(18).fillColor("#222").text(title);
    doc.fontSize(9).fillColor("#777").text(`Generated ${new Date().toISOString().slice(0, 10)} · ${currency}`);
    doc.moveDown();
    rows.forEach((row) => {
      if (doc.y > 520) doc.addPage();
      doc.fontSize(8).fillColor("#111")
        .text(`${row.assetId} · ${row.name} · ${row.category} · ${row.status}`, { continued: false })
        .fontSize(7).fillColor("#444")
        .text(`${currency} ${row.acquisitionCost || row.cost || 0} | Depreciation: ${row.accumulatedDepreciation || row.depreciation || 0} | Book: ${row.currentBookValue || row.closingBookValue || 0} | Market: ${row.currentMarketValue === "" ? "Not valued" : row.currentMarketValue || 0}`)
        .moveDown(0.4);
    });
    doc.end();
  });

const exportAssets = async (req, res, next) => {
  try {
    const { reports } = await reportRows(req.query);
    const format = String(req.query.format || "csv").toLowerCase();
    const type = String(req.query.type || "register").replace(/[^a-z-]/gi, "").slice(0, 32);
    const filename = `asset-${type || "register"}`;
    if (format === "csv") {
      res.type("text/csv").attachment(`${filename}.csv`).send(toCsv(reports));
    } else if (format === "xls") {
      res.type("application/vnd.ms-excel").attachment(`${filename}.xls`).send(toExcelXml(reports));
    } else if (format === "pdf") {
        const settings = await Settings.findOne({ key: "global" }).select("assetAccounting");
        const pdf = await buildAssetReportPdf(reports, `Business Asset Report — ${type}`, settings?.assetAccounting?.currency || "PKR");
      res.type("application/pdf").attachment(`${filename}.pdf`).send(pdf);
    } else {
      throw createHttpError(400, "Choose CSV, Excel, or PDF export format.");
    }
  } catch (error) {
    next(error);
  }
};

const uploadAssetDocument = async (req, res, next) => {
  try {
    if (!req.file) throw createHttpError(400, "Select an invoice or supporting document.");
    const bytes = req.file.buffer;
    const signatures = {
      "application/pdf": bytes.subarray(0, 5).toString("ascii") === "%PDF-",
      "image/jpeg": bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
      "image/png": bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
      "image/webp": bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
        bytes.subarray(8, 12).toString("ascii") === "WEBP",
    };
    if (!signatures[req.file.mimetype]) {
      throw createHttpError(400, "The uploaded document content does not match its declared file type.");
    }
    const filename = `asset-${Date.now()}-${require("crypto").randomBytes(8).toString("hex")}`;
    await AssetDocument.create({
      filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
      uploadedBy: req.user._id,
    });
    res.status(201).json({ success: true, data: { filename, name: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size } });
  } catch (error) {
    next(error);
  }
};

const getAssetDocument = async (req, res, next) => {
  try {
    const document = await AssetDocument.findOne({ filename: req.params.filename });
    if (!document) throw createHttpError(404, "Asset document not found.");
    res.set({
      "Content-Type": document.mimeType,
      "Content-Length": document.data.length,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(document.originalName)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    });
    res.send(document.data);
  } catch (error) {
    next(error);
  }
};

const getAssetDepreciation = async (req, res, next) => {
  try {
    const asset = await getAssetOr404(req.params.id);
    const entries = await AssetDepreciation.find({ asset: asset._id }).sort({ period: 1 }).lean();
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  archiveAsset,
  recordAssignment,
  recordValuation,
  recordValueAdjustment,
  recordMaintenance,
  updateMaintenance,
  recordUsage,
  disposeAsset,
  getDashboard,
  getAssetSettings,
  updateAssetSettings,
  exportAssets,
  uploadAssetDocument,
  getAssetDocument,
  getAssetDepreciation,
  runDepreciationPeriod,
  processDepreciationForAsset,
  ASSET_CATEGORIES,
  VALID_ROLES,
};
