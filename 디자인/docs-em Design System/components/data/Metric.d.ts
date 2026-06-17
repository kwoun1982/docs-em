import * as React from "react";

/**
 * @startingPoint section="Data" subtitle="Metric tiles with delta" viewport="700x150"
 */
export interface MetricProps {
  label: string;
  /** The headline figure (string keeps formatting like 0.912 or 1,284). */
  value: string | number;
  unit?: string;
  /** Signed change vs. previous. Colors teal (up) / amber (down). */
  delta?: number | string;
  deltaUnit?: string;
  /** Set when a decrease is good (e.g. latency, error rate). */
  invertDelta?: boolean;
  /** Fallback caption shown when no delta. */
  hint?: string;
  align?: "left" | "right";
}

/** Big mono stat with label and optional delta. */
export function Metric(props: MetricProps): JSX.Element;
