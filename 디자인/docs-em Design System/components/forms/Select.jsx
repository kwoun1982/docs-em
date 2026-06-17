import React from "react";
import { Icon } from "../core/Icon.jsx";

/** Native-backed select styled as a docs-em control. */
export function Select({ value, onChange, options = [], size = "md", disabled = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const heights = { sm: 28, md: 34, lg: 40 };
  const h = heights[size] || heights.md;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "100%",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          height: h,
          padding: "0 32px 0 12px",
          background: "var(--bg-raised)",
          color: "var(--fg-default)",
          border: `1px solid ${hover ? "var(--fg-faint)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-md)",
          fontFamily: "var(--font-sans)",
          fontSize: size === "sm" ? 12 : 13,
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
          transition: "border-color var(--dur-fast) var(--ease-standard)",
        }}
        {...rest}
      >
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <span style={{ position: "absolute", right: 10, pointerEvents: "none", display: "inline-flex" }}>
        <Icon name="chevron-down" size={15} color="var(--fg-subtle)" />
      </span>
    </div>
  );
}
