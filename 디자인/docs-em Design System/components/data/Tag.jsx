import React from "react";
import { Icon } from "../core/Icon.jsx";

/** Small mono token for IDs, models, corpora, metadata. Optional leading icon / remove. */
export function Tag({ children, icon, tone = "default", onRemove, mono = true, style }) {
  const tones = {
    default: { bg: "var(--surface-2)", fg: "var(--fg-muted)", border: "var(--border-default)" },
    teal:    { bg: "var(--teal-tint)", fg: "var(--teal)", border: "var(--teal-border)" },
    green:   { bg: "var(--green-tint)", fg: "var(--green)", border: "var(--green-border)" },
    amber:   { bg: "var(--amber-tint)", fg: "var(--amber)", border: "var(--amber-border)" },
    blue:    { bg: "var(--blue-tint)", fg: "var(--blue)", border: "var(--blue-border)" },
    // legacy aliases
    signal:  { bg: "var(--teal-tint)", fg: "var(--teal)", border: "var(--teal-border)" },
    slate:   { bg: "var(--blue-tint)", fg: "var(--blue)", border: "var(--blue-border)" },
    warn:    { bg: "var(--amber-tint)", fg: "var(--amber)", border: "var(--amber-border)" },
  };
  const t = tones[tone] || tones.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 20,
        padding: "0 7px",
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: "var(--radius-sm)",
        color: t.fg,
        fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
        fontSize: 11.5,
        fontWeight: 500,
        letterSpacing: mono ? "-0.005em" : "normal",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={12} color={t.fg} /> : null}
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          style={{ display: "inline-flex", padding: 0, margin: "0 -2px 0 1px", background: "none", border: "none", color: t.fg, opacity: 0.7, cursor: "pointer" }}
        >
          <Icon name="x" size={12} />
        </button>
      ) : null}
    </span>
  );
}
