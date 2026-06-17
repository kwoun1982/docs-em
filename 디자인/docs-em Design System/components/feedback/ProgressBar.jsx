import React from "react";

const TONES = {
  signal: "var(--teal)",
  success: "var(--green)",
  warn: "var(--amber)",
  error: "var(--red)",
  slate: "var(--blue)",
  neutral: "var(--fg-subtle)",
};

/** Thin determinate progress bar for indexing / embedding / eval runs. */
export function ProgressBar({ value = 0, tone = "signal", height = 6, showLabel = false, indeterminate = false, style }) {
  const pct = Math.max(0, Math.min(100, value));
  const color = TONES[tone] || TONES.signal;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", ...style }}>
      <div
        style={{
          position: "relative",
          flex: 1,
          height,
          background: "var(--bg-inset)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: indeterminate ? "35%" : `${pct}%`,
            background: color,
            borderRadius: "var(--radius-full)",
            transition: indeterminate ? "none" : "width var(--dur-slow) var(--ease-out)",
            animation: indeterminate ? "dem-indeterminate 1.2s var(--ease-standard) infinite" : "none",
          }}
        />
      </div>
      {showLabel ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)", minWidth: 38, textAlign: "right", letterSpacing: "-0.005em" }}>
          {indeterminate ? "··" : `${Math.round(pct)}%`}
        </span>
      ) : null}
      <style>{"@keyframes dem-indeterminate{0%{left:-35%}100%{left:100%}}"}</style>
    </div>
  );
}
