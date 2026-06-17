import React from "react";

/** Lightweight hover tooltip. Wraps a trigger; shows `label` on hover/focus. */
export function Tooltip({ label, children, side = "top", style }) {
  const [show, setShow] = React.useState(false);

  const pos = {
    top:    { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <span
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show ? (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: 50,
            ...pos[side],
            padding: "5px 9px",
            background: "var(--bg-overlay)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-md)",
            color: "var(--fg-default)",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
