const createHttpError = require("http-errors");
const { StaffLoan, StaffLoanRepayment, StaffPayrollRun } = require("../models/staffHrModels");

const prepareLoanRepayments = async (run, actorId) => {
  for (const item of run.items) {
    for (const repayment of item.loanRepayments || []) {
      const values = {
        loan: repayment.loan,
        staff: item.staff,
        monthKey: run.monthKey,
        amount: repayment.amount,
        status: "Pending",
        payrollRun: run._id,
        createdBy: actorId,
      };
      try {
        await StaffLoanRepayment.create(values);
      } catch (error) {
        if (error.code !== 11000) throw error;
        const existing = await StaffLoanRepayment.findOne({ loan: repayment.loan, monthKey: run.monthKey });
        if (
          !existing ||
          String(existing.payrollRun) !== String(run._id) ||
          Math.abs(existing.amount - repayment.amount) >= 0.01
        ) {
          throw createHttpError(409, "A different repayment is already recorded for this loan and payroll period.");
        }
      }
    }
  }
};

const postFinalizedLoanRepayments = async (payrollRunId) => {
  const run = await StaffPayrollRun.findOne({ _id: payrollRunId, status: "Finalized" }).select("_id");
  if (!run) return false;
  await StaffLoanRepayment.updateMany(
    { payrollRun: run._id, status: "Pending" },
    { $set: { status: "Posted", postedAt: new Date() } }
  );
  const repaymentRows = await StaffLoanRepayment.find({ payrollRun: run._id, status: "Posted" }).lean();
  const loanIds = [...new Set(repaymentRows.map((row) => String(row.loan)))];
  for (const loanId of loanIds) {
    const loan = await StaffLoan.findById(loanId);
    if (!loan || loan.status !== "Active") continue;
    const totalRepaid = await StaffLoanRepayment.aggregate([
      { $match: { loan: loan._id, status: "Posted" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    if ((totalRepaid[0]?.total || 0) + 0.005 < Number(loan.approvedAmount || 0)) continue;
    const actor = repaymentRows.find((row) => String(row.loan) === loanId)?.createdBy;
    await StaffLoan.updateOne(
      { _id: loan._id, status: "Active" },
      {
        $set: { status: "Completed" },
        $push: {
          auditHistory: {
            action: "Completed",
            actor,
            note: "Approved loan balance fully repaid through finalized payroll.",
          },
        },
      }
    );
  }
  return true;
};

const reconcileFinalizedLoanRepayments = async () => {
  const [pending, activeLoanIds] = await Promise.all([
    StaffLoanRepayment.find({ status: "Pending" }).distinct("payrollRun"),
    StaffLoan.find({ status: "Active" }).distinct("_id"),
  ]);
  const previouslyPosted = activeLoanIds.length
    ? await StaffLoanRepayment.find({ status: "Posted", loan: { $in: activeLoanIds } }).distinct("payrollRun")
    : [];
  const payrollRuns = new Set([...pending, ...previouslyPosted].map(String));
  let reconciled = 0;
  for (const payrollRunId of payrollRuns) {
    if (await postFinalizedLoanRepayments(payrollRunId)) reconciled += 1;
  }
  return reconciled;
};

module.exports = { prepareLoanRepayments, postFinalizedLoanRepayments, reconcileFinalizedLoanRepayments };
