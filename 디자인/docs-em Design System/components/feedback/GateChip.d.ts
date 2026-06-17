import * as React from "react";

export interface GateChipProps {
  /** pass = green check · fail/blocked = red · fallback = amber pulse. */
  state?: "pass" | "fail" | "fallback" | "blocked";
  children?: React.ReactNode;
  size?: "sm" | "md";
}

/** Gate indicator for eval gates (L1 G1) and runtime fallbacks. */
export function GateChip(props: GateChipProps): JSX.Element;
