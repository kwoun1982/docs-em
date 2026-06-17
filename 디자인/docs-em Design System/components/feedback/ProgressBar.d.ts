import * as React from "react";

export interface ProgressBarProps {
  /** 0–100. Ignored when indeterminate. */
  value?: number;
  tone?: "signal" | "success" | "warn" | "error" | "slate" | "neutral";
  height?: number;
  showLabel?: boolean;
  indeterminate?: boolean;
  style?: React.CSSProperties;
}

/** Thin determinate progress bar for indexing / embedding / eval runs. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
