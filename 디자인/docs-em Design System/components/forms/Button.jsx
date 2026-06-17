import React from "react";

const SIZES = {
  sm: { height: 26, padding: "0 10px", fontSize: 12, gap: 6, radius: "var(--radius-sm)" },
  md: { height: 32, padding: "0 14px", fontSize: 13, gap: 7, radius: "var(--radius-md)" },
  lg: { height: 38, padding: "0 18px", fontSize: 14, gap: 8, radius: "var(--radius-md)" },
};

const VARIANTS = {
  primary: {
    base: { background: "var(--signal)", color: "var(--accent-fg)", border: "1px solid transparent", fontWeight: 600 },
    hover: { background: "var(--signal-bright)" },
  },
  secondary: {
    base: { background: "var(--bg-raised)", color: "var(--fg-default)", border: "1px solid var(--border-strong)", fontWeight: 500 },
    hover: { background: "var(--bg-overlay)", borderColor: "var(--fg-faint)" },
  },
  ghost: {
    base: { background: "transparent", color: "var(--fg-muted)", border: "1px solid transparent", fontWeight: 500 },
    hover: { background: "var(--bg-overlay)", color: "var(--fg-default)" },
  },
  danger: {
    base: { background: "var(--error-bg)", color: "var(--error-bright)", border: "1px solid var(--error-border)", fontWeight: 500 },
    hover: { background: "var(--error-bg-hi)" },
  },
};

/**
 * docs-em primary action control. Teal `primary` for the single key action,
 * `secondary` for everything else, `ghost` for toolbar/inline, `danger` for destructive.
 */
export function Button({
  children,
  variant = "secondary",
  size = "md",
  iconLeft,
  iconRight,
  disabled = false,
  onClick,
  type = "button",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const sz = SIZES[size] || SIZES.md;
  const vr = VARIANTS[variant] || VARIANTS.secondary;

  const styles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sz.gap,
    height: sz.height,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontFamily: "var(--font-sans)",
    lineHeight: 1,
    borderRadius: sz.radius,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    whiteSpace: "nowrap",
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)",
    ...vr.base,
    ...(hover && !disabled ? vr.hover : null),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={styles}
      {...rest}
    >
      {iconLeft ? <span style={{ display: "inline-flex", flexShrink: 0 }}>{iconLeft}</span> : null}
      {children}
      {iconRight ? <span style={{ display: "inline-flex", flexShrink: 0 }}>{iconRight}</span> : null}
    </button>
  );
}
