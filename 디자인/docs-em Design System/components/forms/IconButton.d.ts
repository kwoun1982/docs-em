import * as React from "react";

export interface IconButtonProps {
  /** Lucide glyph name. */
  icon: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline";
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  style?: React.CSSProperties;
}

/** Square icon-only control for toolbars and inline actions. */
export function IconButton(props: IconButtonProps): JSX.Element;
