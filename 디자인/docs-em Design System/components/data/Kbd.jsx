import React from "react";

/** Keyboard key cap for shortcut hints. */
export function Kbd({ children, style }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 19,
        padding: "0 5px",
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-strong)",
        borderBottomWidth: 2,
        borderRadius: "var(--radius-sm)",
        color: "var(--fg-muted)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </kbd>
  );
}
