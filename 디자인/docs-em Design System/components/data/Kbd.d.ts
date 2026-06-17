import * as React from "react";

export interface KbdProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Keyboard key cap for shortcut hints. */
export function Kbd(props: KbdProps): JSX.Element;
