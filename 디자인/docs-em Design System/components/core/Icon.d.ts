import * as React from "react";

export interface IconProps {
  /** Lucide glyph name, e.g. "search", "database", "check-circle". */
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

/** Inline SVG icon from the curated Lucide set. */
export function Icon(props: IconProps): JSX.Element;
