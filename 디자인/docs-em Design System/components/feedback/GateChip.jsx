import React from "react";
import { Icon } from "../core/Icon.jsx";

const STATES = {
  pass:     { fg: "var(--green)", bg: "var(--green-tint)", border: "var(--green-border)", icon: "check-circle" },
  fail:     { fg: "var(--red)",   bg: "var(--red-tint)",   border: "var(--red-border)",   icon: "x-circle" },
  fallback: { fg: "var(--amber)", bg: "var(--amber-tint)", border: "var(--amber-border)", icon: "alert-triangle" },
  blocked:  { fg: "var(--red)",   bg: "var(--red-tint)",   border: "var(--red-border)",   icon: "lock" },
};

/**
 * Gate indicator — pass (green check), fail/blocked (red), fallback (amber, pulsing).
 * Used for eval gates (`L1 G1`) and runtime gates (`content empty → reasoning_content`).
 */
export function GateChip({ state = "pass", children, size = "md" }) {
  const s = STATES[state] || STATES.pass;
  const sm = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: sm ? 20 : 24, padding: sm ? "0 8px" : "0 10px",
        background: s.bg, border: `1px solid ${s.border}`, borderRadius: "var(--radius-md)",
        color: s.fg, fontFamily: "var(--font-mono)", fontSize: sm ? 11 : 12, fontWeight: 600, letterSpacing: "0.01em",
      }}
    >
      <span style={{ position: "relative", display: "inline-flex" }}>
        <Icon name={s.icon} size={sm ? 13 : 14} color={s.fg} />
        {state === "fallback" ? <span style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `1px solid ${s.fg}`, animation: "dem-gate 1.2s var(--ease-out) infinite" }} /> : null}
      </span>
      {children}
      <style>{"@keyframes dem-gate{0%{opacity:.8;transform:scale(.7)}70%{opacity:0;transform:scale(1.6)}100%{opacity:0}}"}</style>
    </span>
  );
}
