import * as React from "react";

/**
 * @startingPoint section="Feedback" subtitle="Status pills — ok/warn/error/running" viewport="700x150"
 */
export interface StatusPillProps {
  /** ok = success/pass (green) · online = connection (teal) · warn = retry (amber) · error = fail (red) · running = in progress (teal, pulsing) · neutral = idle. */
  tone?: "ok" | "online" | "warn" | "error" | "neutral" | "running";
  children?: React.ReactNode;
  /** Leading mark: dot (dense rows) or icon (headers). */
  indicator?: "dot" | "icon";
  size?: "sm" | "md";
  /** Force the pulse halo (auto-on for `running`). */
  pulse?: boolean;
}

/** Status indicator for runs, documents, and checks. */
export function StatusPill(props: StatusPillProps): JSX.Element;
