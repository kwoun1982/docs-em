import React from "react";

/**
 * Segmented control — active segment carries a teal underline (per spec, e.g. the
 * search-mode toggle 벡터 / BM25 / 하이브리드 RRF). Controlled via value/onChange.
 * options: [{ value, label }] or string[].
 */
export function Segmented({ options = [], value, onChange, size = "md", style }) {
  const sm = size === "sm";
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex", gap: 2, padding: 3,
        background: "var(--surface-1)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)", ...style,
      }}
    >
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange && onChange(opt.value)}
            style={{
              position: "relative",
              padding: sm ? "4px 10px 5px" : "5px 13px 6px",
              background: active ? "var(--surface-2)" : "transparent",
              border: "none",
              borderRadius: "var(--radius-sm)",
              color: active ? "var(--fg-default)" : "var(--fg-muted)",
              fontFamily: "var(--font-sans)", fontSize: sm ? 12 : 13, fontWeight: active ? 600 : 500,
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--fg-default)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--fg-muted)"; }}
          >
            {opt.label}
            <span style={{ position: "absolute", left: sm ? 10 : 13, right: sm ? 10 : 13, bottom: 1, height: 2, borderRadius: 2, background: active ? "var(--teal)" : "transparent", transition: "background var(--dur-fast) var(--ease-standard)" }} />
          </button>
        );
      })}
    </div>
  );
}
