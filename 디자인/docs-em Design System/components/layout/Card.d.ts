import * as React from "react";

/**
 * @startingPoint section="Layout" subtitle="Card surface with header" viewport="700x220"
 */
export interface CardProps {
  children?: React.ReactNode;
  /** Header title; pairs with `actions` on the right. */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  /** Body padding (default true). */
  padding?: boolean;
  /** Sunken well variant for code / logs. */
  inset?: boolean;
  style?: React.CSSProperties;
}

/** Surface container with optional header / footer. */
export function Card(props: CardProps): JSX.Element;
