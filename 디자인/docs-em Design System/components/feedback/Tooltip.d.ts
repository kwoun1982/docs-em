import * as React from "react";

export interface TooltipProps {
  /** Tooltip text. */
  label: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  style?: React.CSSProperties;
}

/** Lightweight hover/focus tooltip wrapping a trigger. */
export function Tooltip(props: TooltipProps): JSX.Element;
