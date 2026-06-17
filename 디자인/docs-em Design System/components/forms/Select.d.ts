import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Options as strings or {value,label} objects. */
  options?: (string | SelectOption)[];
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** Native-backed select styled as a docs-em control. */
export function Select(props: SelectProps): JSX.Element;
