import React from "react";

/**
 * Score chip — mono tabular value with a kind label (`sim 0.695`, `bm25 12.4`).
 * Per spec the score KIND must be labeled so cosine `sim` and `bm25` never get
 * confused. A signed `gap` colors the border: negative = red, positive = green.
 */
export function ScoreChip({ kind = "sim", value, gap, decimals = 3, size = "md" }) {
  const sm = size === "sm";
  let border = "var(--border-strong)";
  let valColor = "var(--fg-default)";
  if (gap !== undefined && gap !== null) {
    if (gap < 0) { border = "var(--red-border)"; valColor = "var(--red)"; }
    else if (gap > 0) { border = "var(--green-border)"; valColor = "var(--green)"; }
  }
  const shown = typeof value === "number" ? value.toFixed(decimals) : value;

  return (
    <span
      style={{
        display: "inline-flex", alignItems: "baseline", gap: 5,
        height: sm ? 18 : 20, padding: sm ? "0 6px" : "0 8px",
        background: "var(--surface-2)", border: `1px solid ${border}`, borderRadius: "var(--radius-sm)",
        fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: sm ? 11 : 12, letterSpacing: "-0.005em",
      }}
    >
      <span style={{ color: "var(--fg-faint)", fontSize: sm ? 10 : 11 }}>{kind}</span>
      <span style={{ color: valColor, fontWeight: 500 }}>{shown}</span>
    </span>
  );
}
