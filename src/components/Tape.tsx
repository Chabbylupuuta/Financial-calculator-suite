import { type ReactNode } from "react";

interface TapeLine {
  label: string;
  value: string;
  muted?: boolean;
}

interface TapeProps {
  lines: TapeLine[];
  resultLabel: string;
  resultValue: string;
  sentiment?: "positive" | "negative" | "neutral";
  stampLabel?: string;
  note?: ReactNode;
  animationKey?: string | number;
}

export function Tape({ lines, resultLabel, resultValue, sentiment = "neutral", stampLabel, note, animationKey }: TapeProps) {
  return (
    <div className="tape-wrap">
      <div className="tape-label">Printout</div>
      <div className="tape" key={animationKey}>
        {lines.map((line, i) => (
          <div className={`tape-line ${line.muted ? "muted" : ""}`} key={i}>
            <span>{line.label}</span>
            <span>{line.value}</span>
          </div>
        ))}
        <div className="tape-result">
          <div className="tape-result-label">{resultLabel}</div>
          <div
            className={`tape-result-value ${
              sentiment === "positive" ? "positive" : sentiment === "negative" ? "negative" : ""
            }`}
          >
            {resultValue}
          </div>
        </div>
        {stampLabel && (
          <div className={`tape-stamp ${sentiment === "negative" ? "negative" : ""}`}>{stampLabel}</div>
        )}
        {note && <div className="tape-note">{note}</div>}
      </div>
    </div>
  );
}
