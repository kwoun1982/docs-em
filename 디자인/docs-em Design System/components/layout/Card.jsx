import React from "react";

/**
 * Surface container. `header`/`footer` get hairline dividers; body padding
 * is on by default. Set `inset` for sunken wells (code, logs).
 */
export function Card({ children, header, footer, actions, padding = true, inset = false, style }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: inset ? "var(--bg-inset)" : "var(--surface-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        ...style,
      }}
    >
      {header ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--fg-default)" }}>{header}</div>
          {actions ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{actions}</div> : null}
        </div>
      ) : null}
      <div style={{ padding: padding ? 16 : 0, flex: 1 }}>{children}</div>
      {footer ? (
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-subtle)", fontSize: 12, color: "var(--fg-muted)" }}>
          {footer}
        </div>
      ) : null}
    </div>
  );
}
