const test = require("node:test");
const assert = require("node:assert/strict");
const {
  monthBounds,
  workingDaysInMonth,
  prorationRate,
  componentProrationRate,
  allocateLoanRepayments,
} = require("./staffHrService");

test("month bounds handle leap years and reject invalid periods", () => {
  assert.deepEqual(monthBounds("2024-02"), {
    start: "2024-02-01",
    end: "2024-02-29",
    days: 29,
  });
  assert.throws(() => monthBounds("2024-13"), /YYYY-MM/);
});

test("loan repayments respect outstanding balances and configured deduction capacity", () => {
  const repayments = [
    { loan: { _id: "loan-1" }, amount: 80 },
    { loan: { _id: "loan-2" }, amount: 50 },
  ];
  const allocated = allocateLoanRepayments(repayments, 200, 100, 0.6);
  assert.deepEqual(allocated.deductions, [
    { code: "LOAN_loan-1", name: "Approved loan repayment", amount: 20 },
  ]);
  assert.deepEqual(allocated.snapshots, [{ loan: "loan-1", amount: 20 }]);
  assert.equal(allocated.warnings.length, 2);
});

test("working-day divisor excludes weekends", () => {
  assert.equal(workingDaysInMonth("2024-02"), 21);
});

test("salary proration is capped at one full period", () => {
  assert.equal(prorationRate(10, 20), 0.5);
  assert.equal(prorationRate(25, 20), 1);
  assert.equal(prorationRate(10, 0), 0);
});

test("recurring components respect effective dates and one-time components pay once", () => {
  const recurring = {
    code: "ALLOWANCE",
    recurring: true,
    effectiveFrom: "2024-02-15",
    effectiveTo: null,
  };
  assert.equal(
    componentProrationRate(
      recurring,
      ["2024-02-14", "2024-02-15", "2024-02-16"],
      "2024-02-01",
      "2024-02-29",
      "2024-02-01",
      "2024-02-29",
      20,
      new Set()
    ),
    0.1
  );

  const processed = new Set();
  const oneTime = {
    code: "SIGNING_BONUS",
    recurring: false,
    effectiveFrom: "2024-02-15",
  };
  const args = [oneTime, [], "2024-02-01", "2024-02-29", "2024-02-01", "2024-02-29", 20, processed];
  assert.equal(componentProrationRate(...args), 1);
  assert.equal(componentProrationRate(...args), 0);
});
