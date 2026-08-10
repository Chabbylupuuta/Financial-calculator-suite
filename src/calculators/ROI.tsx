import { useMemo, useState } from "react";
import { LedgerField } from "../components/LedgerField";
import { Tape } from "../components/Tape";
import { calcROI, formatCurrency, formatPercent } from "../utils/finance";

export function ROICalculator() {
  const [initial, setInitial] = useState(10000);
  const [final, setFinal] = useState(13500);

  const { roi, gain } = useMemo(() => calcROI(initial, final), [initial, final]);
  const positive = gain >= 0;

  return (
    <div className="sheet">
      <div className="sheet-header">
        <h2 className="sheet-title">Return on Investment</h2>
        <span className="sheet-folio">Folio No. 01</span>
      </div>
      <p className="sheet-desc">
        Measure the gain or loss on an investment relative to what you put in. Enter the amount
        invested and its current or exit value.
      </p>

      <div className="field-grid">
        <LedgerField label="Initial investment" value={initial} onChange={setInitial} prefix="$" />
        <LedgerField label="Final value" value={final} onChange={setFinal} prefix="$" />
      </div>

      <Tape
        animationKey={`${initial}-${final}`}
        lines={[
          { label: "Initial investment", value: formatCurrency(initial) },
          { label: "Final value", value: formatCurrency(final) },
          { label: "Gain / loss", value: formatCurrency(gain), muted: false },
        ]}
        resultLabel="Return on investment"
        resultValue={formatPercent(roi)}
        sentiment={positive ? "positive" : "negative"}
        stampLabel={positive ? "Gain" : "Loss"}
        note="ROI = (final value − initial investment) ÷ initial investment × 100"
      />
    </div>
  );
}
