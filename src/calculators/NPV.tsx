import { useMemo, useState } from "react";
import { LedgerField } from "../components/LedgerField";
import { Tape } from "../components/Tape";
import { calcNPV, formatCurrency, formatPercent } from "../utils/finance";

interface Flow {
  id: number;
  label: string;
  amount: number;
}

let nextId = 100;

export function NPVCalculator() {
  const [rate, setRate] = useState(8);
  const [flows, setFlows] = useState<Flow[]>([
    { id: 1, label: "Year 0 — initial outlay", amount: -20000 },
    { id: 2, label: "Year 1", amount: 6000 },
    { id: 3, label: "Year 2", amount: 7500 },
    { id: 4, label: "Year 3", amount: 8500 },
    { id: 5, label: "Year 4", amount: 9000 },
  ]);

  const npv = useMemo(() => calcNPV(rate / 100, flows.map((f) => f.amount)), [rate, flows]);
  const positive = npv >= 0;

  const updateFlow = (id: number, amount: number) => {
    setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, amount } : f)));
  };

  const addFlow = () => {
    setFlows((prev) => [...prev, { id: nextId++, label: `Year ${prev.length}`, amount: 0 }]);
  };

  const removeFlow = (id: number) => {
    setFlows((prev) => (prev.length > 2 ? prev.filter((f) => f.id !== id) : prev));
  };

  return (
    <div className="sheet">
      <div className="sheet-header">
        <h2 className="sheet-title">Net Present Value</h2>
        <span className="sheet-folio">Folio No. 02</span>
      </div>
      <p className="sheet-desc">
        Discount a series of future cash flows back to today's dollars at your required rate of
        return. The first line is usually the initial outlay, entered as a negative number.
      </p>

      <div className="field-grid" style={{ marginBottom: "0.5rem" }}>
        <LedgerField label="Discount rate (annual)" value={rate} onChange={setRate} suffix="%" step={0.25 as unknown as number} />
      </div>

      <div className="cashflow-list">
        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted-paper)" }}>
          Cash flows
        </label>
        {flows.map((f) => (
          <div className="cashflow-row" key={f.id}>
            <input
              value={f.label}
              onChange={(e) =>
                setFlows((prev) => prev.map((row) => (row.id === f.id ? { ...row, label: e.target.value } : row)))
              }
            />
            <input
              type="number"
              value={f.amount}
              onChange={(e) => updateFlow(f.id, e.target.value === "" ? 0 : parseFloat(e.target.value))}
            />
            <button className="remove-row" onClick={() => removeFlow(f.id)} aria-label={`Remove ${f.label}`} disabled={flows.length <= 2}>
              ✕
            </button>
          </div>
        ))}
        <button className="ghost-btn add-row-btn" onClick={addFlow}>
          + Add cash flow
        </button>
      </div>

      <Tape
        animationKey={`${rate}-${flows.map((f) => f.amount).join(",")}`}
        lines={flows.map((f, i) => ({
          label: f.label || `Period ${i}`,
          value: formatCurrency(f.amount),
          muted: true,
        }))}
        resultLabel={`Net present value at ${formatPercent(rate)}`}
        resultValue={formatCurrency(npv)}
        sentiment={positive ? "positive" : "negative"}
        stampLabel={positive ? "Value created" : "Value destroyed"}
        note="NPV = Σ cash flow ÷ (1 + rate)^period"
      />
    </div>
  );
}
