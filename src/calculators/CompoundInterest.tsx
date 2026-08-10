import { useMemo, useState } from "react";
import { LedgerField, LedgerSelect } from "../components/LedgerField";
import { Tape } from "../components/Tape";
import { calcCompoundInterest, formatCurrency } from "../utils/finance";

const COMPOUND_OPTIONS = [
  { label: "Annually", value: 1 },
  { label: "Semi-annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const [compounds, setCompounds] = useState(12);
  const [contribution, setContribution] = useState(100);

  const result = useMemo(
    () => calcCompoundInterest(principal, rate, years, compounds, contribution),
    [principal, rate, years, compounds, contribution]
  );

  return (
    <div className="sheet">
      <div className="sheet-header">
        <h2 className="sheet-title">Compound Interest</h2>
        <span className="sheet-folio">Folio No. 04</span>
      </div>
      <p className="sheet-desc">
        Project how a balance grows when interest compounds over time, with an optional regular
        contribution added each period.
      </p>

      <div className="field-grid">
        <LedgerField label="Starting principal" value={principal} onChange={setPrincipal} prefix="$" />
        <LedgerField label="Annual interest rate" value={rate} onChange={setRate} suffix="%" step={0.1 as unknown as number} />
        <LedgerField label="Time horizon" value={years} onChange={setYears} suffix="yrs" step={1} />
        <LedgerSelect label="Compounding frequency" value={compounds} onChange={setCompounds} options={COMPOUND_OPTIONS} />
        <LedgerField
          label="Contribution per period"
          value={contribution}
          onChange={setContribution}
          prefix="$"
          hint="Added at the end of each compounding period"
        />
      </div>

      <Tape
        animationKey={`${principal}-${rate}-${years}-${compounds}-${contribution}`}
        lines={[
          { label: "Starting principal", value: formatCurrency(principal) },
          { label: "Total contributions", value: formatCurrency(result.totalContributions - principal) },
          { label: "Interest earned", value: formatCurrency(result.totalInterest) },
        ]}
        resultLabel={`Balance after ${years} years`}
        resultValue={formatCurrency(result.finalBalance)}
        sentiment="positive"
        stampLabel="Projected"
        note={`Compounded ${COMPOUND_OPTIONS.find((c) => c.value === compounds)?.label.toLowerCase()} for ${years} years.`}
      />
    </div>
  );
}
