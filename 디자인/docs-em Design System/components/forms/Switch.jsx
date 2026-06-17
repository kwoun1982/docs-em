import React from "react";

/** On/off toggle. Teal when on; quiet track when off. */
export function Switch({ checked = false, onChange, disabled = false, size = "md", label, style }) {
  const dims = {
    sm: { w: 30, h: 17, knob: 13 },
    md: { w: 36, h: 20, knob: 16 },
  };
  const d = dims[size] || dims.md;
  const pad = (d.h - d.knob) / 2;

  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };

  const sw = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={toggle}
      style={{
        position: "relative",
        width: d.w,
        height: d.h,
        flexShrink: 0,
        padding: 0,
        border: `1px solid ${checked ? "transparent" : "var(--border-strong)"}`,
        borderRadius: "var(--radius-full)",
        background: checked ? "var(--signal)" : "var(--bg-overlay)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background var(--dur-base) var(--ease-standard)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: pad,
          left: checked ? d.w - d.knob - pad - 1 : pad,
          width: d.knob,
          height: d.knob,
          borderRadius: "50%",
          background: checked ? "var(--text-on-signal)" : "var(--fg-muted)",
          transition: "left var(--dur-base) var(--ease-out)",
        }}
      />
    </button>
  );

  if (!label) return sw;
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", ...style }}>
      {sw}
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-default)" }}>{label}</span>
    </label>
  );
}
