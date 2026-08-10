import { useMemo, useState } from "react";
import { Tape } from "../components/Tape";
import { calcIRR, calcNPV, formatCurrency, formatPercent } from "../utils/finance";

interface Flow {
  id: number;
  label: string;
  amount: number;
}

let nextId = 200;

export function IRRCalculator() {
  const [flows, setFlows] = useState<Flow[]>([
    { id: 1, label: "Year 0 — initial outlay", amount: -50000 },
    { id: 2, label: "Year 1", amount: 12000 },
    { id: 3, label: "Year 2", amount: 15000 },
    { id: 4, label: "Year 3", amount: 18000 },
    { id: 5, label: "Year 4", amount: 20000 },
    { id: 6, label: "Year 5", amount: 15000 },
  ]);

  const irr = useMemo(() => calcIRR(flows.map((f) => f.amount)), [flows]);
  const checkNpv = useMemo(() => (irr !== null ? calcNPV(irr, flows.map((f) => f.amount)) : null), [irr, flows]);
  const positive = (irr ?? 0) >= 0;

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
        <h2 className="sheet-title">Internal Rate of Return</h2>
        <span className="sheet-folio">Folio No. 03</span>
      </div>
      <p className="sheet-desc">
        Find the discount rate at which a project's cash flows net out to zero — the break-even
        rate of return. The first line is usually the initial outlay, entered as a negative
        number.
      </p>

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
        animationKey={flows.map((f) => f.amount).join(",")}
        lines={flows.map((f, i) => ({
          label: f.label || `Period ${i}`,
          value: formatCurrency(f.amount),
          muted: true,
        }))}
        resultLabel="Internal rate of return"
        resultValue={irr !== null ? formatPercent(irr * 100) : "No solution found"}
        sentiment={irr !== null ? (positive ? "positive" : "negative") : "neutral"}
        stampLabel={irr !== null ? (positive ? "Profitable" : "Below zero") : undefined}
        note={
          irr !== null
            ? `Verification: NPV at this rate ≈ ${formatCurrency(checkNpv ?? 0)}. Solved by Newton–Raphson iteration.`
            : "No rate converges for this cash-flow pattern — check that it includes at least one sign change."
        }
      />
    </div>
  );
}
