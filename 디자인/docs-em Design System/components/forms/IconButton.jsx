import React from "react";
import { Icon } from "../core/Icon.jsx";

const SIZES = { sm: 26, md: 30, lg: 36 };
const ICON = { sm: 14, md: 16, lg: 18 };

/** Square icon-only control for toolbars and inline actions. */
export function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  disabled = false,
  active = false,
  onClick,
  title,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dim = SIZES[size] || SIZES.md;

  const variants = {
    ghost: {
      background: active ? "var(--bg-overlay)" : "transparent",
      color: active ? "var(--fg-default)" : "var(--fg-muted)",
      border: "1px solid transparent",
    },
    outline: {
      background: "var(--bg-raised)",
      color: "var(--fg-default)",
      border: "1px solid var(--border-strong)",
    },
  };
  const hoverFill = { background: "var(--bg-overlay)", color: "var(--fg-default)" };

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)",
        ...variants[variant],
        ...(hover && !disabled ? hoverFill : null),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={ICON[size]} />
    </button>
  );
}
