import * as React from "react";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Optional trailing label. */
  label?: string;
  style?: React.CSSProperties;
}

/** On/off toggle — teal when on. */
export function Switch(props: SwitchProps): JSX.Element;
