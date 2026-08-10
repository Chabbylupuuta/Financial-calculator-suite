// Core financial math. Pure functions, no UI concerns.

export interface CashFlow {
  label: string;
  amount: number;
}

/** Return on Investment, as a percentage. */
export function calcROI(initialInvestment: number, finalValue: number) {
  if (initialInvestment === 0) return { roi: 0, gain: 0 };
  const gain = finalValue - initialInvestment;
  const roi = (gain / initialInvestment) * 100;
  return { roi, gain };
}

/**
 * Net Present Value.
 * cashFlows[0] is typically the initial outlay (negative).
 * rate is the annual discount rate as a decimal (e.g. 0.08 for 8%).
 */
export function calcNPV(rate: number, cashFlows: number[]) {
  return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}

/**
 * Internal Rate of Return via Newton-Raphson with a bisection fallback.
 * cashFlows[0] is the initial outlay (negative), followed by period returns.
 */
export function calcIRR(cashFlows: number[], guess = 0.1): number | null {
  const maxIter = 1000;
  const tol = 1e-7;

  const npvAt = (r: number) => calcNPV(r, cashFlows);
  const dNpvAt = (r: number) =>
    cashFlows.reduce((sum, cf, t) => (t === 0 ? sum : sum - (t * cf) / Math.pow(1 + r, t + 1)), 0);

  // Newton-Raphson
  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    const npv = npvAt(rate);
    const d = dNpvAt(rate);
    if (Math.abs(d) < 1e-12) break;
    const next = rate - npv / d;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - rate) < tol) return next;
    rate = next;
  }

  if (Number.isFinite(rate) && Math.abs(npvAt(rate)) < 1) return rate;

  // Bisection fallback across a wide bracket
  let lo = -0.999999;
  let hi = 10;
  let fLo = npvAt(lo);
  let fHi = npvAt(hi);
  if (Number.isNaN(fLo) || Number.isNaN(fHi) || fLo * fHi > 0) return null;

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npvAt(mid);
    if (Math.abs(fMid) < tol) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

/**
 * Compound interest.
 * principal grows at annualRate (decimal) compounded compoundsPerYear times per year,
 * for years, with an optional regular contribution added each period.
 */
export function calcCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear: number,
  contributionPerPeriod = 0
) {
  const r = annualRatePct / 100 / compoundsPerYear;
  const n = Math.round(years * compoundsPerYear);
  const schedule: { period: number; balance: number }[] = [];
  let balance = principal;
  schedule.push({ period: 0, balance });
  for (let i = 1; i <= n; i++) {
    balance = balance * (1 + r) + contributionPerPeriod;
    schedule.push({ period: i, balance });
  }
  const totalContributions = principal + contributionPerPeriod * n;
  const totalInterest = balance - totalContributions;
  return { finalBalance: balance, totalContributions, totalInterest, schedule };
}

/**
 * Loan repayment (amortizing loan, fixed payment).
 * annualRatePct is the nominal annual rate, paymentsPerYear e.g. 12 for monthly.
 */
export function calcLoanRepayment(
  principal: number,
  annualRatePct: number,
  years: number,
  paymentsPerYear = 12
) {
  const r = annualRatePct / 100 / paymentsPerYear;
  const n = Math.round(years * paymentsPerYear);
  let payment: number;
  if (r === 0) {
    payment = principal / n;
  } else {
    payment = (principal * r) / (1 - Math.pow(1 + r, -n));
  }

  const schedule: { period: number; payment: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interestPaid = balance * r;
    let principalPaid = payment - interestPaid;
    if (i === n) {
      // Clean up rounding drift on the final payment
      principalPaid = balance;
      payment = principalPaid + interestPaid;
    }
    balance = Math.max(0, balance - principalPaid);
    schedule.push({ period: i, payment, principalPaid, interestPaid, balance });
  }

  const totalPaid = schedule.reduce((s, row) => s + row.payment, 0);
  const totalInterest = totalPaid - principal;
  return { payment: schedule[0]?.payment ?? payment, totalPaid, totalInterest, schedule };
}

/** Compound Annual Growth Rate, as a percentage. */
export function calcCAGR(beginningValue: number, endingValue: number, years: number) {
  if (beginningValue <= 0 || years <= 0) return null;
  const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
  return cagr;
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, digits = 2) {
  return `${Number.isFinite(value) ? value.toFixed(digits) : "0.00"}%`;
}

export function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}
