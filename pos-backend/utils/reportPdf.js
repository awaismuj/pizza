const PDFDocument = require("pdfkit");
const Expense = require("../models/expenseModel");
const DeletedOrderLog = require("../models/deletedOrderLogModel");
const { computeDayFigures } = require("./profitService");

const money = (n) => `Rs ${Number(n || 0).toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;

const prettyDay = (dayKey) => {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// All dayKeys ("YYYY-MM-DD") from `fromKey` to `toKey` inclusive.
const dayKeysBetween = (fromKey, toKey) => {
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  const cursor = new Date(fy, fm - 1, fd);
  const end = new Date(ty, tm - 1, td);
  const keys = [];
  while (cursor <= end) {
    const pad2 = (n) => String(n).padStart(2, "0");
    keys.push(`${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}-${pad2(cursor.getDate())}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
};

// Figures + itemized expenses for every day in [fromKey, toKey], plus totals.
const collectReportData = async (fromKey, toKey) => {
  const dayKeys = dayKeysBetween(fromKey, toKey);

  const days = await Promise.all(
    dayKeys.map(async (dayKey) => {
      const [figures, expenseDocs] = await Promise.all([
        computeDayFigures(dayKey),
        Expense.find({ dayKey }).sort({ createdAt: 1 }).select("amount description"),
      ]);
      return { ...figures, expenseItems: expenseDocs };
    })
  );

  const totals = days.reduce(
    (acc, d) => ({
      revenue: acc.revenue + d.revenue,
      couponDiscount: acc.couponDiscount + d.couponDiscount,
      cost: acc.cost + d.cost,
      expenses: acc.expenses + d.expenses,
      profit: acc.profit + d.profit,
      ordersCount: acc.ordersCount + d.ordersCount,
      itemsSold: acc.itemsSold + d.itemsSold,
    }),
    { revenue: 0, couponDiscount: 0, cost: 0, expenses: 0, profit: 0, ordersCount: 0, itemsSold: 0 }
  );

  const deletedOrders = await DeletedOrderLog.find({
    dayKey: { $gte: fromKey, $lte: toKey },
  }).sort({ deletedAt: 1 });

  return { days, totals, deletedOrders };
};

// Renders the report to a PDF Buffer. `rangeLabel` is the human title
// shown at the top (e.g. "Today — 22 Sep 2026", "1–22 Sep 2026", "September 2026").
const buildReportPdfBuffer = ({ rangeLabel, days, totals, deletedOrders = [], businessName = "GenZ Pizza Land" }) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fontSize(18).fillColor("#1a1a1a").text(businessName, { align: "center" });
      doc.fontSize(12).fillColor("#555").text("Daily Profit & Expense Report", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#888").text(rangeLabel, { align: "center" });
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#e0e0e0").stroke();
      doc.moveDown(1);

      // Summary boxes
      const boxY = doc.y;
      const boxWidth = 95;
      const boxes = [
        { label: "Revenue (excl. tax)", value: money(totals.revenue), color: "#025cca" },
        { label: "Coupon Discounts", value: money(totals.couponDiscount), color: "#7c3aed" },
        { label: "Purchases/Cost", value: money(totals.cost), color: "#735f32" },
        { label: "Total Expenses", value: money(totals.expenses), color: "#be3e3f" },
        { label: "Net Profit", value: money(totals.profit), color: totals.profit >= 0 ? "#02ca3a" : "#7a1f1f" },
      ];
      boxes.forEach((b, i) => {
        const x = 40 + i * (boxWidth + 8);
        doc.roundedRect(x, boxY, boxWidth, 55, 4).fillColor(b.color).fill();
        doc.fillColor("#fff").fontSize(9).text(b.label, x + 10, boxY + 10);
        doc.fontSize(15).text(b.value, x + 10, boxY + 26);
      });
      doc.y = boxY + 70;
      doc.fillColor("#1a1a1a");
      doc.moveDown(0.5);
      doc
        .fontSize(9)
        .fillColor("#666")
        .text(`Orders: ${totals.ordersCount}    |    Items sold: ${totals.itemsSold}`, { align: "left" });
      doc.moveDown(1);

      // Per-day table
      days.forEach((d, idx) => {
        if (doc.y > 700) doc.addPage();

        doc.fontSize(12).fillColor("#1a1a1a").text(prettyDay(d.dayKey), { continued: false, underline: false });
        doc.moveDown(0.2);

        const rowY = doc.y;
        doc.fontSize(10).fillColor("#333");
        doc.text(`Revenue: ${money(d.revenue)}    Coupon discounts: ${money(d.couponDiscount)}`, 50, rowY);
        doc.text(`Cost: ${money(d.cost)}    Expenses: ${money(d.expenses)}`, 50);
        doc
          .fillColor(d.profit >= 0 ? "#0a7a2f" : "#a01f1f")
          .text(`Profit: ${money(d.profit)}`, 50);
        doc.fillColor("#333");
        doc.fillColor("#333");
        doc.fontSize(9).fillColor("#888").text(`Orders: ${d.ordersCount}   Items sold: ${d.itemsSold}`, 50);

        if (d.expenseItems.length > 0) {
          doc.moveDown(0.2);
          doc.fontSize(9).fillColor("#555").text("Expenses:", 50);
          d.expenseItems.forEach((e) => {
            doc
              .fontSize(9)
              .fillColor("#666")
              .text(`• ${money(e.amount)}${e.description ? ` — ${e.description}` : ""}`, 60);
          });
        }

        doc.moveDown(0.4);
        if (idx < days.length - 1) {
          doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#f0f0f0").stroke();
          doc.moveDown(0.4);
        }
      });

      // Deleted-orders audit section
      doc.moveDown(0.5);
      if (doc.y > 680) doc.addPage();
      doc.fontSize(12).fillColor("#a01f1f").text(`Deleted Orders (${deletedOrders.length})`, 40);
      doc.moveDown(0.3);
      if (deletedOrders.length === 0) {
        doc.fontSize(9).fillColor("#888").text("No orders were deleted in this period.", 50);
      } else {
        deletedOrders.forEach((d) => {
          if (doc.y > 720) doc.addPage();
          const who = d.deletedBy?.name ? `${d.deletedBy.name} (${d.deletedBy.role})` : "Unknown";
          const items = (d.items || []).map((i) => `${i.quantity}x ${i.name}`).join(", ");
          doc
            .fontSize(9)
            .fillColor("#333")
            .text(
              `#${d.orderNumber || String(d.originalOrderId || "").slice(-6).toUpperCase()} — ${money(d.bills?.totalWithTax)} — deleted by ${who} at ${new Date(d.deletedAt).toLocaleString("en-GB")}`,
              50
            );
          doc
            .fontSize(8)
            .fillColor("#777")
            .text(
              `Stage when deleted: ${d.statusAtDelete}   |   Stock returned to inventory: ${d.stockReturned ? "Yes" : "No (none was held)"}${items ? `   |   Items: ${items}` : ""}`,
              60
            );
          doc.moveDown(0.3);
        });
      }

      doc.moveDown(1);
      doc
        .fontSize(8)
        .fillColor("#aaa")
        .text(`Generated ${new Date().toLocaleString("en-GB")}`, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });

module.exports = { collectReportData, buildReportPdfBuffer, dayKeysBetween, money, prettyDay };
