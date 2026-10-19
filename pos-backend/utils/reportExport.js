// Shared CSV / Excel (.xlsx) / PDF export used by the Assets and Profit
// reports, so all three formats always carry the same title, summary and
// tables.
//
// A report is described once:
//   {
//     title, subtitle, filename,
//     summary:  [{ label, value, type? }],            // optional key figures
//     sections: [{ title, columns, rows, totals? }],  // one or more tables
//   }
// where each column is { key, label, type?: "text"|"number"|"money"|"date",
// width? } and `totals` is an optional row object rendered in bold.

const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const createHttpError = require("http-errors");

const FORMATS = ["csv", "xlsx", "pdf"];

// "xls" is accepted as an alias so older clients keep working — it now
// returns a genuine .xlsx instead of the SpreadsheetML file that Excel
// warned about when opening.
const normalizeFormat = (value) => {
  const format = String(value || "csv").toLowerCase();
  const resolved = format === "xls" || format === "excel" ? "xlsx" : format;
  if (!FORMATS.includes(resolved)) throw createHttpError(400, "Choose CSV, Excel, or PDF export format.");
  return resolved;
};

const safeFilename = (name) => String(name || "report").replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "report";

const isBlank = (value) => value === null || value === undefined || value === "";
const toDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const isoDay = (value) => {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
};
const num = (value) => (isBlank(value) || !Number.isFinite(Number(value)) ? null : Number(value));
const fmtMoney = (value) => {
  const n = num(value);
  return n === null ? "" : n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const fmtNumber = (value) => {
  const n = num(value);
  return n === null ? "" : n.toLocaleString("en-PK", { maximumFractionDigits: 2 });
};

// Text shown in CSV and PDF cells.
const displayValue = (value, type) => {
  if (isBlank(value)) return "";
  if (type === "money") return fmtMoney(value);
  if (type === "number") return fmtNumber(value);
  if (type === "date") return isoDay(value) || String(value);
  return String(value);
};

// ---------- CSV ----------
const csvCell = (value) => {
  let cell = String(value ?? "");
  // Neutralise spreadsheet formula injection from user-entered text.
  if (/^[=+\-@\t\r]/.test(cell) && !/^-?\d+(\.\d+)?$/.test(cell)) cell = `'${cell}`;
  return `"${cell.replace(/"/g, '""')}"`;
};
const csvRaw = (value, type) => {
  if (isBlank(value)) return "";
  if (type === "money" || type === "number") {
    const n = num(value);
    return n === null ? String(value) : String(n);
  }
  if (type === "date") return isoDay(value) || String(value);
  return String(value);
};

const buildCsv = (report) => {
  const lines = [];
  lines.push(csvCell(report.title));
  if (report.subtitle) lines.push(csvCell(report.subtitle));
  if (report.summary?.length) {
    lines.push("");
    report.summary.forEach((item) => lines.push([csvCell(item.label), csvCell(csvRaw(item.value, item.type))].join(",")));
  }
  (report.sections || []).forEach((section) => {
    lines.push("");
    if (section.title) lines.push(csvCell(section.title));
    lines.push(section.columns.map((column) => csvCell(column.label)).join(","));
    section.rows.forEach((row) => lines.push(section.columns.map((column) => csvCell(csvRaw(row[column.key], column.type))).join(",")));
    if (section.totals) lines.push(section.columns.map((column) => csvCell(csvRaw(section.totals[column.key], column.type))).join(","));
    if (!section.rows.length) lines.push(csvCell("No records for the selected filters."));
  });
  // UTF-8 BOM so Excel reads the file with the right encoding.
  return `﻿${lines.join("\r\n")}\r\n`;
};

// ---------- XLSX ----------
const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F1F1F" } };
const NUMBER_FORMATS = { money: "#,##0.00", number: "#,##0.##", date: "yyyy-mm-dd" };

const sheetName = (name, used) => {
  let base = String(name || "Report").replace(/[\\/?*[\]:]/g, " ").trim().slice(0, 28) || "Report";
  let candidate = base;
  let i = 2;
  while (used.has(candidate.toLowerCase())) candidate = `${base.slice(0, 26)} ${i++}`;
  used.add(candidate.toLowerCase());
  return candidate;
};

const writeTableToSheet = (sheet, startRow, section) => {
  let rowIndex = startRow;
  if (section.title) {
    const titleRow = sheet.getRow(rowIndex++);
    titleRow.getCell(1).value = section.title;
    titleRow.getCell(1).font = { bold: true, size: 12 };
  }
  const header = sheet.getRow(rowIndex++);
  section.columns.forEach((column, index) => {
    const cell = header.getCell(index + 1);
    cell.value = column.label;
    cell.font = { bold: true, color: { argb: "FFF6B100" } };
    cell.fill = HEADER_FILL;
    cell.alignment = { vertical: "middle", horizontal: column.type === "money" || column.type === "number" ? "right" : "left", wrapText: true };
  });
  const dataStart = rowIndex;
  section.rows.forEach((row) => {
    const excelRow = sheet.getRow(rowIndex++);
    section.columns.forEach((column, index) => {
      const cell = excelRow.getCell(index + 1);
      const value = row[column.key];
      if (isBlank(value)) return;
      if (column.type === "money" || column.type === "number") {
        const n = num(value);
        cell.value = n === null ? String(value) : n;
        if (n !== null) cell.numFmt = NUMBER_FORMATS[column.type];
      } else if (column.type === "date") {
        const date = toDate(value);
        cell.value = date || String(value);
        if (date) cell.numFmt = NUMBER_FORMATS.date;
      } else {
        const text = String(value);
        // Stored as an explicit string so Excel never evaluates it as a formula.
        cell.value = /^[=+\-@]/.test(text) ? `'${text}` : text;
      }
    });
  });
  if (!section.rows.length) {
    sheet.getRow(rowIndex++).getCell(1).value = "No records for the selected filters.";
  }
  if (section.totals) {
    const totalRow = sheet.getRow(rowIndex++);
    section.columns.forEach((column, index) => {
      const value = section.totals[column.key];
      if (isBlank(value)) return;
      const cell = totalRow.getCell(index + 1);
      const n = column.type === "money" || column.type === "number" ? num(value) : null;
      cell.value = n === null ? String(value) : n;
      if (n !== null) cell.numFmt = NUMBER_FORMATS[column.type];
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
    });
  }
  return { nextRow: rowIndex + 1, dataStart, dataEnd: dataStart + section.rows.length - 1 };
};

const buildXlsx = async (report) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GenZPizza POS";
  workbook.created = new Date();
  const used = new Set();

  const first = workbook.addWorksheet(sheetName(report.sheetName || "Summary", used), { views: [{ state: "frozen", ySplit: 0 }] });
  first.getCell("A1").value = report.title;
  first.getCell("A1").font = { bold: true, size: 16 };
  let row = 2;
  if (report.subtitle) {
    first.getCell(`A${row}`).value = report.subtitle;
    first.getCell(`A${row}`).font = { color: { argb: "FF777777" } };
    row += 1;
  }
  row += 1;
  (report.summary || []).forEach((item) => {
    first.getCell(`A${row}`).value = item.label;
    first.getCell(`A${row}`).font = { bold: true };
    const n = item.type === "money" || item.type === "number" ? num(item.value) : null;
    first.getCell(`B${row}`).value = n === null ? (isBlank(item.value) ? "" : String(item.value)) : n;
    if (n !== null) first.getCell(`B${row}`).numFmt = NUMBER_FORMATS[item.type];
    first.getCell(`B${row}`).alignment = { horizontal: "left" };
    row += 1;
  });

  const sections = report.sections || [];
  // One sheet per table keeps every sheet filterable and analysis-ready.
  // The first table shares the summary sheet only when the report has no
  // other tables and no summary block.
  sections.forEach((section, index) => {
    const useFirst = index === 0 && !(report.summary || []).length && sections.length === 1;
    const sheet = useFirst ? first : workbook.addWorksheet(sheetName(section.sheetName || section.title || `Table ${index + 1}`, used));
    const startRow = useFirst ? row + 1 : 1;
    const { dataStart, dataEnd } = writeTableToSheet(sheet, startRow, section);
    const headerRow = dataStart - 1;
    section.columns.forEach((column, i) => {
      const longest = Math.max(
        String(column.label).length,
        ...section.rows.slice(0, 200).map((r) => displayValue(r[column.key], column.type).length),
      );
      sheet.getColumn(i + 1).width = Math.min(Math.max(column.width ? column.width / 5 : 10, longest + 2), 48);
    });
    if (useFirst) first.getColumn(1).width = Math.max(first.getColumn(1).width || 10, 22);
    if (section.rows.length) sheet.autoFilter = { from: { row: headerRow, column: 1 }, to: { row: dataEnd, column: section.columns.length } };
    sheet.views = [{ state: "frozen", ySplit: headerRow }];
  });
  if (!(report.summary || []).length) {
    // nothing else to show on the summary sheet when it is empty beyond the title
  }
  first.getColumn(1).width = Math.max(first.getColumn(1).width || 10, 26);
  first.getColumn(2).width = Math.max(first.getColumn(2).width || 10, 22);
  return workbook.xlsx.writeBuffer();
};

// ---------- PDF ----------
const PDF = {
  ink: "#1a1a1a",
  muted: "#6b6b6b",
  line: "#d8d8d8",
  head: "#1f1f1f",
  headText: "#f6b100",
  stripe: "#f6f6f6",
};

const buildPdf = (report) =>
  new Promise((resolve, reject) => {
    try {
      const sections = report.sections || [];
      const widest = Math.max(0, ...sections.map((section) => section.columns.length));
      const landscape = widest > 6 || report.landscape;
      const doc = new PDFDocument({ size: "A4", layout: landscape ? "landscape" : "portrait", margin: 36, bufferPages: true });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const left = doc.page.margins.left;
      const pageWidth = doc.page.width - left - doc.page.margins.right;
      const bottom = () => doc.page.height - doc.page.margins.bottom - 18;

      // Header block
      doc.rect(left, doc.y, pageWidth, 4).fill("#f6b100");
      doc.moveDown(0.6);
      doc.fillColor(PDF.ink).font("Helvetica-Bold").fontSize(18).text(report.title, left, doc.y, { width: pageWidth });
      if (report.subtitle) doc.font("Helvetica").fontSize(9).fillColor(PDF.muted).text(report.subtitle, left, doc.y + 2, { width: pageWidth });
      doc.moveDown(0.8);

      // Summary tiles
      if (report.summary?.length) {
        const perRow = Math.min(4, report.summary.length);
        const gap = 8;
        const tileWidth = (pageWidth - gap * (perRow - 1)) / perRow;
        const tileHeight = 42;
        let y = doc.y;
        report.summary.forEach((item, index) => {
          const col = index % perRow;
          if (col === 0 && index > 0) y += tileHeight + gap;
          if (y + tileHeight > bottom()) { doc.addPage(); y = doc.y; }
          const x = left + col * (tileWidth + gap);
          doc.roundedRect(x, y, tileWidth, tileHeight, 4).lineWidth(0.6).strokeColor(PDF.line).stroke();
          doc.font("Helvetica").fontSize(7).fillColor(PDF.muted).text(String(item.label).toUpperCase(), x + 8, y + 7, { width: tileWidth - 16, lineBreak: false, ellipsis: true });
          doc.font("Helvetica-Bold").fontSize(12).fillColor(PDF.ink).text(displayValue(item.value, item.type) || "—", x + 8, y + 20, { width: tileWidth - 16, lineBreak: false, ellipsis: true });
        });
        doc.y = y + tileHeight + 14;
        doc.x = left;
      }

      sections.forEach((section) => {
        const columns = section.columns;
        const weights = columns.map((column) => column.width || (column.type === "money" || column.type === "number" ? 70 : column.type === "date" ? 62 : 100));
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const widths = weights.map((weight) => (weight / totalWeight) * pageWidth);
        const fontSize = columns.length > 10 ? 6.5 : columns.length > 7 ? 7.5 : 8.5;
        const padX = 4;

        const drawHeader = () => {
          const height = 22;
          if (doc.y + height + 20 > bottom()) doc.addPage();
          const y = doc.y;
          doc.rect(left, y, pageWidth, height).fill(PDF.head);
          let x = left;
          columns.forEach((column, i) => {
            doc.font("Helvetica-Bold").fontSize(fontSize).fillColor(PDF.headText).text(column.label, x + padX, y + 7, {
              width: widths[i] - padX * 2,
              align: column.type === "money" || column.type === "number" ? "right" : "left",
              lineBreak: false,
              ellipsis: true,
            });
            x += widths[i];
          });
          doc.y = y + height;
        };

        const drawRow = (row, index, bold = false) => {
          const cells = columns.map((column) => displayValue(row[column.key], column.type));
          doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(fontSize);
          const height = Math.max(
            16,
            ...cells.map((cell, i) => doc.heightOfString(cell || " ", { width: widths[i] - padX * 2 }) + 8),
          );
          if (doc.y + height > bottom()) {
            doc.addPage();
            drawHeader();
          }
          const y = doc.y;
          if (bold) doc.rect(left, y, pageWidth, height).fill("#efefef");
          else if (index % 2 === 1) doc.rect(left, y, pageWidth, height).fill(PDF.stripe);
          let x = left;
          columns.forEach((column, i) => {
            doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(fontSize).fillColor(PDF.ink).text(cells[i], x + padX, y + 4, {
              width: widths[i] - padX * 2,
              align: column.type === "money" || column.type === "number" ? "right" : "left",
            });
            x += widths[i];
          });
          doc.moveTo(left, y + height).lineTo(left + pageWidth, y + height).lineWidth(0.3).strokeColor(PDF.line).stroke();
          doc.y = y + height;
        };

        if (section.title) {
          if (doc.y + 60 > bottom()) doc.addPage();
          doc.font("Helvetica-Bold").fontSize(11).fillColor(PDF.ink).text(section.title, left, doc.y, { width: pageWidth });
          doc.moveDown(0.4);
        }
        drawHeader();
        if (!section.rows.length) {
          doc.font("Helvetica-Oblique").fontSize(9).fillColor(PDF.muted).text("No records for the selected filters.", left + padX, doc.y + 6);
          doc.moveDown(1.2);
        }
        section.rows.forEach((row, index) => drawRow(row, index));
        if (section.totals) drawRow(section.totals, 0, true);
        doc.x = left;
        doc.moveDown(1.2);
      });

      // Footer with page numbers on every page
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i += 1) {
        doc.switchToPage(i);
        // Writing inside the bottom margin would make pdfkit add a page, so
        // the margin is released while the footer is drawn.
        const footerY = doc.page.height - doc.page.margins.bottom + 6;
        doc.page.margins.bottom = 0;
        doc.font("Helvetica").fontSize(7).fillColor(PDF.muted);
        doc.text(`${report.footer || "GenZPizza POS"} · Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`, left, footerY, { width: pageWidth - 80, lineBreak: false });
        doc.text(`Page ${i - range.start + 1} of ${range.count}`, left + pageWidth - 80, footerY, { width: 80, align: "right", lineBreak: false });
      }
      doc.end();
    } catch (error) {
      reject(error);
    }
  });

const MIME = {
  csv: "text/csv; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf: "application/pdf",
};

// Builds the requested format and writes it to the response as a download.
const sendReport = async (res, report, formatInput) => {
  const format = normalizeFormat(formatInput);
  const filename = `${safeFilename(report.filename || report.title)}.${format}`;
  let body;
  if (format === "csv") body = Buffer.from(buildCsv(report), "utf8");
  else if (format === "xlsx") body = Buffer.from(await buildXlsx(report));
  else body = await buildPdf(report);
  res.setHeader("Content-Type", MIME[format]);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  res.setHeader("Cache-Control", "no-store");
  res.send(body);
};

module.exports = { FORMATS, normalizeFormat, buildCsv, buildXlsx, buildPdf, sendReport, safeFilename };
