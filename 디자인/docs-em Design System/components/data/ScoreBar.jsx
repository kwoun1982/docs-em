import React from "react";

/** Horizontal score meter on the red→green scale. Mono value at the end. */
export function ScoreBar({ value = 0, max = 1, showValue = true, width, height = 6, threshold }) {
  const ratio = Math.max(0, Math.min(1, value / max));
  const pct = ratio * 100;

  // 3-zone semantic coloring: red / amber / green
  const color = ratio < 0.5 ? "var(--red)" : ratio < 0.8 ? "var(--amber)" : "var(--green)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: width || "100%" }}>
      <div style={{ position: "relative", flex: 1, height, background: "var(--bg-inset)", borderRadius: "var(--radius-full)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
        <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: color, borderRadius: "var(--radius-full)", transition: "width var(--dur-slow) var(--ease-out)" }} />
        {threshold !== undefined ? (
          <div style={{ position: "absolute", top: -2, bottom: -2, left: `${(threshold / max) * 100}%`, width: 1.5, background: "var(--fg-muted)" }} />
        ) : null}
      </div>
      {showValue ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color, fontWeight: 500, minWidth: 38, textAlign: "right", letterSpacing: "-0.005em" }}>
          {value.toFixed ? value.toFixed(3) : value}
        </span>
      ) : null}
    </div>
  );
}
