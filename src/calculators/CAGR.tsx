import { useMemo, useState } from "react";
import { LedgerField } from "../components/LedgerField";
import { Tape } from "../components/Tape";
import { calcCAGR, formatCurrency, formatPercent } from "../utils/finance";

export function CAGRCalculator() {
  const [begin, setBegin] = useState(10000);
  const [end, setEnd] = useState(21000);
  const [years, setYears] = useState(5);

  const cagr = useMemo(() => calcCAGR(begin, end, years), [begin, end, years]);
  const positive = (cagr ?? 0) >= 0;
  const valid = cagr !== null;

  return (
    <div className="sheet">
      <div className="sheet-header">
        <h2 className="sheet-title">Compound Annual Growth Rate</h2>
        <span className="sheet-folio">Folio No. 06</span>
      </div>
      <p className="sheet-desc">
        Smooth an investment's growth over several years into a single steady annual rate — useful
        for comparing investments that grew unevenly.
      </p>

      <div className="field-grid">
        <LedgerField label="Beginning value" value={begin} onChange={setBegin} prefix="$" />
        <LedgerField label="Ending value" value={end} onChange={setEnd} prefix="$" />
        <LedgerField label="Time period" value={years} onChange={setYears} suffix="yrs" min={0.1} step={0.5 as unknown as number} />
      </div>

      <Tape
        animationKey={`${begin}-${end}-${years}`}
        lines={[
          { label: "Beginning value", value: formatCurrency(begin) },
          { label: "Ending value", value: formatCurrency(end) },
          { label: "Period", value: `${years} yrs` },
        ]}
        resultLabel="CAGR"
        resultValue={valid ? formatPercent(cagr!) : "— n/a"}
        sentiment={valid ? (positive ? "positive" : "negative") : "neutral"}
        stampLabel={valid ? (positive ? "Growth" : "Decline") : undefined}
        note="CAGR = (ending value ÷ beginning value)^(1 ÷ years) − 1"
      />
    </div>
  );
}
