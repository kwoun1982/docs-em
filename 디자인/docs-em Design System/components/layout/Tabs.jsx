import React from "react";

/**
 * Underline tab bar. `items` = [{ value, label, count? }]. Controlled via
 * `value` / `onChange`. Quiet by default; active tab carries the teal underline.
 */
export function Tabs({ items = [], value, onChange, style }) {
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border-default)", ...style }}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange && onChange(it.value)}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 12px",
              marginBottom: -1,
              background: "none",
              border: "none",
              borderBottom: `2px solid ${active ? "var(--signal)" : "transparent"}`,
              color: active ? "var(--fg-default)" : "var(--fg-subtle)",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              cursor: "pointer",
              transition: "color var(--dur-fast) var(--ease-standard)",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--fg-muted)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--fg-subtle)"; }}
          >
            {it.label}
            {it.count !== undefined ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: active ? "var(--signal)" : "var(--fg-faint)", background: active ? "var(--signal-bg)" : "var(--bg-overlay)", padding: "1px 5px", borderRadius: "var(--radius-full)" }}>
                {it.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
