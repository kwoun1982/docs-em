import * as React from "react";

/**
 * @startingPoint section="Forms" subtitle="Button variants & sizes" viewport="700x150"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual weight. Use `primary` once per view for the key action. */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}

/** Primary action control for docs-em. */
export function Button(props: ButtonProps): JSX.Element;
