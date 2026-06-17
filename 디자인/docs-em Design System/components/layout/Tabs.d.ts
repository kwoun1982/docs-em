import * as React from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** Optional count badge. */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/** Underline tab bar; active tab carries the teal underline. */
export function Tabs(props: TabsProps): JSX.Element;
