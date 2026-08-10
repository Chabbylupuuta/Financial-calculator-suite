# 🧮 Financial Calculator Suite

ROI, NPV, IRR, compound interest, loan repayment, and CAGR calculators — a small
suite of everyday finance tools with a ledger-and-adding-machine aesthetic.
Built with TypeScript and React (Vite).

Everything runs client-side. Nothing you type is sent anywhere.

## Calculators

| Calculator | What it answers |
|---|---|
| **ROI** | What was my return, as a percentage of what I put in? |
| **NPV** | What are a series of future cash flows worth in today's dollars? |
| **IRR** | What discount rate makes a project's cash flows net to zero? |
| **Compound Interest** | How does a balance grow with compounding and regular contributions? |
| **Loan Repayment** | What's the fixed payment on an amortizing loan, and how much is interest? |
| **CAGR** | What steady annual growth rate would explain this change in value? |

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Tech

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev) for dev/build tooling
- No UI framework or component library — hand-styled with plain CSS
  (design tokens in `src/index.css`)
- No backend, no analytics, no external requests — all math runs in
  `src/utils/finance.ts`

## Project structure

```
src/
  calculators/       One component per calculator (ROI, NPV, IRR, ...)
  components/         Shared input field and "paper tape" output components
  utils/finance.ts    Pure calculation functions (unit-testable, no UI deps)
  App.tsx             Tab navigation shell
  index.css           Design tokens and all styling
```

## Notes on the math

- **IRR** is solved numerically with Newton–Raphson, falling back to
  bisection if the first method doesn't converge. Cash-flow patterns with no
  sign change (e.g. all positive or all negative) have no real IRR and will
  say so.
- **Loan Repayment** uses the standard fixed-payment amortization formula
  and cleans up floating-point drift on the final payment.
- **Compound Interest** supports a per-period contribution, added at the end
  of each compounding period.

## License

MIT — see [LICENSE](./LICENSE).
