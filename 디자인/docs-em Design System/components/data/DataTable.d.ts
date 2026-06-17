import * as React from "react";

export interface DataColumn {
  key: string;
  label: React.ReactNode;
  align?: "left" | "right" | "center";
  /** Render this column's cells in mono (scores, IDs, latency). */
  mono?: boolean;
  width?: number | string;
  /** Custom cell renderer. */
  render?: (value: any, row: any) => React.ReactNode;
}

/**
 * @startingPoint section="Data" subtitle="Dense results table" viewport="700x260"
 */
export interface DataTableProps {
  columns: DataColumn[];
  rows: Record<string, any>[];
  /** Field used as React key (default "id"). */
  rowKey?: string;
  onRowClick?: (row: any) => void;
  dense?: boolean;
  style?: React.CSSProperties;
}

/** Dense data table for eval results, retrieved chunks, corpus listings. */
export function DataTable(props: DataTableProps): JSX.Element;
