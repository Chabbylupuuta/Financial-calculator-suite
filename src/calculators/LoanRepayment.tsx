import { useMemo, useState } from "react";
import { LedgerField, LedgerSelect } from "../components/LedgerField";
import { Tape } from "../components/Tape";
import { calcLoanRepayment, formatCurrency } from "../utils/finance";

const FREQUENCY_OPTIONS = [
  { label: "Monthly", value: 12 },
  { label: "Fortnightly", value: 26 },
  { label: "Weekly", value: 52 },
  { label: "Annually", value: 1 },
];

export function LoanRepaymentCalculator() {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [freq, setFreq] = useState(12);

  const result = useMemo(() => calcLoanRepayment(principal, rate, years, freq), [principal, rate, years, freq]);
  const freqLabel = FREQUENCY_OPTIONS.find((f) => f.value === freq)?.label ?? "Monthly";

  return (
    <div className="sheet">
      <div className="sheet-header">
        <h2 className="sheet-title">Loan Repayment</h2>
        <span className="sheet-folio">Folio No. 05</span>
      </div>
      <p className="sheet-desc">
        Work out the fixed payment on an amortizing loan, and how much of it goes to interest over
        the life of the loan.
      </p>

      <div className="field-grid">
        <LedgerField label="Loan principal" value={principal} onChange={setPrincipal} prefix="$" />
        <LedgerField label="Annual interest rate" value={rate} onChange={setRate} suffix="%" step={0.05 as unknown as number} />
        <LedgerField label="Loan term" value={years} onChange={setYears} suffix="yrs" step={1} />
        <LedgerSelect label="Payment frequency" value={freq} onChange={setFreq} options={FREQUENCY_OPTIONS} />
      </div>

      <Tape
        animationKey={`${principal}-${rate}-${years}-${freq}`}
        lines={[
          { label: "Loan principal", value: formatCurrency(principal) },
          { label: "Total interest paid", value: formatCurrency(result.totalInterest) },
          { label: "Total of all payments", value: formatCurrency(result.totalPaid) },
        ]}
        resultLabel={`${freqLabel} payment`}
        resultValue={formatCurrency(result.payment)}
        sentiment="neutral"
        stampLabel={`${(years * freq).toLocaleString()} payments`}
        note="Fixed-payment amortization: payment = P × r ÷ (1 − (1 + r)^−n)"
      />
    </div>
  );
}
