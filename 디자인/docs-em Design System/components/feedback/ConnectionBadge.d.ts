import * as React from "react";

export interface ConnectionBadgeProps {
  /** ok = connected (teal) · delay = stale healthcheck (amber) · down = no response (red). */
  status?: "ok" | "delay" | "down";
  /** Mono endpoint string, default "localhost:1234". */
  endpoint?: string;
  /** Override the trailing status word. */
  label?: string;
}

/** Air-gapped connection indicator (1급 trust signal). */
export function ConnectionBadge(props: ConnectionBadgeProps): JSX.Element;

export interface ExternalCallsCounterProps {
  /** External API call count. 0 → green, ≥1 → red violation. */
  count?: number;
}

/** `EXTERNAL CALLS: 0` counter — green at 0, red on violation. */
export function ExternalCallsCounter(props: ExternalCallsCounterProps): JSX.Element;
