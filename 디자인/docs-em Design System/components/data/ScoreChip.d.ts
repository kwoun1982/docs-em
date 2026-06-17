import * as React from "react";

export interface ScoreChipProps {
  /** Score kind label — `sim` (cosine), `bm25`, `rrf`, etc. Always labeled. */
  kind?: string;
  value: number | string;
  /** Signed gap vs. another score; negative → red border, positive → green border. */
  gap?: number;
  decimals?: number;
  size?: "sm" | "md";
}

/** Mono score chip with an explicit score-kind label and optional gap coloring. */
export function ScoreChip(props: ScoreChipProps): JSX.Element;
