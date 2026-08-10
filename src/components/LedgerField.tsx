interface LedgerFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function LedgerField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  min,
  max,
  step = "any" as unknown as number,
}: LedgerFieldProps) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="field-input-row">
        {prefix && <span className="prefix">{prefix}</span>}
        <input
          type="number"
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          inputMode="decimal"
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

interface LedgerSelectProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: { label: string; value: number }[];
  hint?: string;
}

export function LedgerSelect({ label, value, onChange, options, hint }: LedgerSelectProps) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="field-input-row">
        <select value={value} onChange={(e) => onChange(parseFloat(e.target.value))}>
          {options.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
