import React from "react";
import { Icon } from "../core/Icon.jsx";

/* Per spec: status = color + shape (dot/icon) + text label. Never color alone.
   GREEN = success/pass, TEAL = connection/online, AMBER = retry/warn, RED = fail. */
const TONES = {
  ok:      { fg: "var(--green)", bg: "var(--green-tint)", border: "var(--green-border)", dot: "var(--green)", icon: "check-circle" },
  online:  { fg: "var(--teal)",  bg: "var(--teal-tint)",  border: "var(--teal-border)",  dot: "var(--teal)",  icon: "circle" },
  warn:    { fg: "var(--amber)", bg: "var(--amber-tint)", border: "var(--amber-border)", dot: "var(--amber)", icon: "alert-triangle" },
  error:   { fg: "var(--red)",   bg: "var(--red-tint)",   border: "var(--red-border)",   dot: "var(--red)",   icon: "x-circle" },
  running: { fg: "var(--teal)",  bg: "var(--teal-tint)",  border: "var(--teal-border)",  dot: "var(--teal)",  icon: "loader-circle" },
  neutral: { fg: "var(--fg-muted)", bg: "var(--surface-2)", border: "var(--border-strong)", dot: "var(--fg-faint)", icon: "circle" },
};

/**
 * Status indicator. `ok` (green) = success/pass, `online` (teal) = connection,
 * `warn` (amber) = retry, `error` (red) = fail, `running` (teal, pulsing) = in progress.
 */
export function StatusPill({ tone = "neutral", children, indicator = "dot", size = "md", pulse = false }) {
  const t = TONES[tone] || TONES.neutral;
  const sm = size === "sm";
  const doPulse = pulse || tone === "running";

  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: sm ? 5 : 6,
        height: sm ? 18 : 22, padding: sm ? "0 7px" : "0 9px",
        background: t.bg, border: `1px solid ${t.border}`, borderRadius: "var(--radius-md)",
        color: t.fg, fontFamily: "var(--font-mono)", fontSize: sm ? 11 : 12, fontWeight: 500,
        fontVariantNumeric: "tabular-nums", letterSpacing: "-0.005em", whiteSpace: "nowrap",
      }}
    >
      {indicator === "icon" ? (
        <Icon name={t.icon} size={sm ? 12 : 13} color={t.fg} />
      ) : (
        <span style={{ position: "relative", width: sm ? 6 : 7, height: sm ? 6 : 7, borderRadius: "50%", background: t.dot, flexShrink: 0 }}>
          {doPulse ? <span style={{ position: "absolute", inset: -2, borderRadius: "50%", border: `1px solid ${t.dot}`, animation: "dem-pulse 1.2s var(--ease-out) infinite" }} /> : null}
        </span>
      )}
      {children}
      <style>{"@keyframes dem-pulse{0%{opacity:.9;transform:scale(.8)}70%{opacity:0;transform:scale(1.8)}100%{opacity:0}}"}</style>
    </span>
  );
}
