import * as React from "react";

export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Leading Lucide glyph name. */
  icon?: string;
  /** Render value in mono for paths / IDs / queries. */
  mono?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  invalid?: boolean;
  type?: string;
  style?: React.CSSProperties;
}

/** Text input with optional leading icon and mono mode. */
export function Input(props: InputProps): JSX.Element;
