import React from "react";
import { Icon } from "../core/Icon.jsx";

const STATES = {
  ok:   { dot: "var(--teal)",  text: "연결됨",   color: "var(--teal)" },
  delay:{ dot: "var(--amber)", text: "지연",     color: "var(--amber)" },
  down: { dot: "var(--red)",   text: "연결 끊김", color: "var(--red)" },
};

/**
 * Air-gapped connection indicator — `● localhost:1234 연결됨`. The endpoint is
 * mono; a lock icon marks the closed network. teal = ok, amber = delay, red = down.
 * This is a 1급(first-class) trust signal — never hide it.
 */
export function ConnectionBadge({ status = "ok", endpoint = "localhost:1234", label }) {
  const s = STATES[status] || STATES.ok;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 26, padding: "0 10px", background: "var(--surface-1)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
      <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: s.dot, flexShrink: 0 }}>
        {status === "ok" ? <span style={{ position: "absolute", inset: -2, borderRadius: "50%", border: `1px solid ${s.dot}`, animation: "dem-conn 1.8s var(--ease-out) infinite" }} /> : null}
      </span>
      <Icon name="lock" size={12} color="var(--fg-faint)" />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-default)", letterSpacing: "-0.005em" }}>{endpoint}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: s.color }}>{label || s.text}</span>
      <style>{"@keyframes dem-conn{0%{opacity:.8;transform:scale(.8)}70%{opacity:0;transform:scale(2)}100%{opacity:0}}"}</style>
    </span>
  );
}

/** `EXTERNAL CALLS: 0` counter — green at 0, red the instant it is ≥1 (violation). */
export function ExternalCallsCounter({ count = 0 }) {
  const violated = count >= 1;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px", borderRadius: "var(--radius-md)", background: violated ? "var(--red-tint)" : "var(--green-tint)", border: `1px solid ${violated ? "var(--red-border)" : "var(--green-border)"}` }}>
      <Icon name={violated ? "alert-triangle" : "shield-check"} size={13} color={violated ? "var(--red)" : "var(--green)"} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.02em", color: violated ? "var(--red)" : "var(--green)" }}>EXTERNAL CALLS: {count}</span>
    </span>
  );
}
