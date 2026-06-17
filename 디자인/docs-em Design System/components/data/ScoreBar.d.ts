import * as React from "react";

export interface ScoreBarProps {
  /** Raw score. */
  value?: number;
  /** Scale max (default 1). */
  max?: number;
  showValue?: boolean;
  width?: number | string;
  height?: number;
  /** Optional pass/fail marker drawn as a vertical tick. */
  threshold?: number;
}

/** Horizontal score meter colored on the red→green eval scale. */
export function ScoreBar(props: ScoreBarProps): JSX.Element;
