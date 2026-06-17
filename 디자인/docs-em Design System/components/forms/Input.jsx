import React from "react";
import { Icon } from "../core/Icon.jsx";

/**
 * Text input with optional leading icon. Mono-friendly: set `mono` for paths,
 * IDs, and queries that should read as data.
 */
export function Input({
  value,
  onChange,
  placeholder,
  icon,
  mono = false,
  size = "md",
  disabled = false,
  invalid = false,
  type = "text",
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = { sm: 28, md: 34, lg: 40 };
  const h = heights[size] || heights.md;

  const borderColor = invalid
    ? "var(--error-border)"
    : focus
    ? "var(--signal-border)"
    : "var(--border-strong)";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: h,
        width: "100%",
        padding: icon ? "0 12px 0 10px" : "0 12px",
        background: "var(--bg-inset)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? "0 0 0 3px rgba(41,195,153,0.16)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={15} color="var(--fg-subtle)" /> : null}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1,
          minWidth: 0,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--fg-default)",
          fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
          fontSize: size === "sm" ? 12 : 13,
          letterSpacing: mono ? "-0.005em" : "normal",
        }}
        {...rest}
      />
    </div>
  );
}
