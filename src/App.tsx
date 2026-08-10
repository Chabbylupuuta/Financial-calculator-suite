import { useState } from "react";
import { ROICalculator } from "./calculators/ROI";
import { NPVCalculator } from "./calculators/NPV";
import { IRRCalculator } from "./calculators/IRR";
import { CompoundInterestCalculator } from "./calculators/CompoundInterest";
import { LoanRepaymentCalculator } from "./calculators/LoanRepayment";
import { CAGRCalculator } from "./calculators/CAGR";

const TABS = [
  { id: "roi", index: "01", label: "ROI", render: () => <ROICalculator /> },
  { id: "npv", index: "02", label: "NPV", render: () => <NPVCalculator /> },
  { id: "irr", index: "03", label: "IRR", render: () => <IRRCalculator /> },
  { id: "compound", index: "04", label: "Compound Interest", render: () => <CompoundInterestCalculator /> },
  { id: "loan", index: "05", label: "Loan Repayment", render: () => <LoanRepaymentCalculator /> },
  { id: "cagr", index: "06", label: "CAGR", render: () => <CAGRCalculator /> },
];

function App() {
  const [activeTab, setActiveTab] = useState("roi");
  const current = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">LEDGER &amp; TAPE</span>
        </div>
        <h1>Financial Calculator Suite</h1>
        <p className="brand-tagline">Figures, honestly kept.</p>
      </header>

      <div className="layout">
        <nav className="tabs" aria-label="Calculators">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${tab.id === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={tab.id === activeTab ? "page" : undefined}
            >
              <span className="tab-index">{tab.index}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main className="sheet-wrap">{current.render()}</main>
      </div>

      <footer className="app-footer">Client-side only — nothing you enter here leaves your browser.</footer>
    </div>
  );
}

export default App;
