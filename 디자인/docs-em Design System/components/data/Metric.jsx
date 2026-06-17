import React from "react";
import { Icon } from "../core/Icon.jsx";

/**
 * Big mono stat with label and optional delta. The delta colors itself:
 * teal up, amber down (regression). Pass `invertDelta` when down is good (e.g. latency).
 */
export function Metric({ label, value, unit, delta, deltaUnit, invertDelta = false, hint, align = "left" }) {
  const hasDelta = delta !== undefined && delta !== null;
  const num = typeof delta === "number" ? delta : parseFloat(delta);
  const positive = num > 0;
  const good = invertDelta ? !positive : positive;
  const neutral = num === 0;

  const deltaColor = neutral ? "var(--fg-faint)" : good ? "var(--green)" : "var(--red)";
  const arrow = neutral ? "minus" : positive ? "trending-up" : "trending-down";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-subtle)" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color: "var(--fg-default)", letterSpacing: "-0.02em", lineHeight: 1 }}>
          {value}
        </span>
        {unit ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-subtle)" }}>{unit}</span> : null}
      </div>
      {hasDelta ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "var(--font-mono)", fontSize: 12, color: deltaColor, letterSpacing: "-0.005em" }}>
          <Icon name={arrow} size={13} color={deltaColor} />
          {positive ? "+" : ""}{delta}{deltaUnit || ""}
        </span>
      ) : hint ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-subtle)" }}>{hint}</span>
      ) : null}
    </div>
  );
}
