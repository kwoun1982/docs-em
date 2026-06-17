import * as React from "react";

export interface TagProps {
  children?: React.ReactNode;
  /** Leading Lucide glyph. */
  icon?: string;
  tone?: "default" | "teal" | "green" | "amber" | "blue" | "signal" | "slate" | "warn";
  /** When set, renders a remove affordance. */
  onRemove?: () => void;
  /** Mono by default (IDs/models); set false for words. */
  mono?: boolean;
  style?: React.CSSProperties;
}

/** Small token for IDs, models, corpora, metadata. */
export function Tag(props: TagProps): JSX.Element;
