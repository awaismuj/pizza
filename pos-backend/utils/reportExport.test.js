const test = require("node:test");
const assert = require("node:assert/strict");
const ExcelJS = require("exceljs");
const { buildCsv, buildXlsx, buildPdf, normalizeFormat } = require("./reportExport");

const report = {
  title: "Daily Profit Report",
  subtitle: "Amounts in Rs",
  summary: [{ label: "Revenue", value: 1500.5, type: "money" }],
  sections: [{
    title: "Orders",
    columns: [
      { key: "name", label: "Customer" },
      { key: "revenue", label: "Revenue", type: "money" },
      { key: "date", label: "Date", type: "date" },
    ],
    rows: [
      { name: "Ali, \"Boss\"", revenue: 1000, date: "2026-10-19" },
      { name: "=cmd|calc", revenue: 500.5, date: "2026-10-19" },
    ],
    totals: { name: "Total", revenue: 1500.5 },
  }],
};

test("format aliases", () => {
  assert.equal(normalizeFormat("xls"), "xlsx");
  assert.equal(normalizeFormat("PDF"), "pdf");
  assert.throws(() => normalizeFormat("docx"));
});

test("csv escapes quotes, neutralises formulas, keeps numbers raw", () => {
  const csv = buildCsv(report);
  assert.ok(csv.includes('"Ali, ""Boss"""'));
  assert.ok(csv.includes("\"'=cmd|calc\""));
  assert.ok(csv.includes('"1500.5"'));
});

test("xlsx is a real workbook with numeric cells", async () => {
  const buffer = await buildXlsx(report);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  assert.equal(workbook.worksheets.length, 2);
  const sheet = workbook.getWorksheet("Orders");
  assert.equal(typeof sheet.getRow(3).getCell(2).value, "number");
});

test("pdf starts with the PDF signature and handles many rows", async () => {
  const many = { ...report, sections: [{ ...report.sections[0], rows: Array.from({ length: 200 }, (_, i) => ({ name: `Customer ${i}`, revenue: i * 10, date: "2026-10-19" })) }] };
  const pdf = await buildPdf(many);
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(pdf.length > 2000);
});

test("empty reports still export", async () => {
  const empty = { ...report, sections: [{ ...report.sections[0], rows: [], totals: undefined }] };
  assert.ok(buildCsv(empty).includes("No records"));
  assert.equal((await buildPdf(empty)).subarray(0, 5).toString(), "%PDF-");
});
