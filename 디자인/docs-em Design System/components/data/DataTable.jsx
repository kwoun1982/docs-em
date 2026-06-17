import React from "react";

/**
 * Dense data table for eval results, retrieved chunks, and corpus listings.
 * Columns: { key, label, align?, mono?, width?, render?(value,row) }.
 */
export function DataTable({ columns = [], rows = [], rowKey = "id", onRowClick, dense = false, style }) {
  const cellPad = dense ? "6px 12px" : "9px 12px";

  return (
    <div style={{ width: "100%", overflowX: "auto", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "var(--surface-card)", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  padding: cellPad,
                  width: c.width,
                  background: "var(--bg-subtle)",
                  borderBottom: "1px solid var(--border-default)",
                  color: "var(--fg-subtle)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  position: "sticky",
                  top: 0,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[rowKey] ?? i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{ cursor: onRowClick ? "pointer" : "default", transition: "background var(--dur-fast) var(--ease-standard)" }}
              onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.background = "var(--bg-subtle)"; }}
              onMouseLeave={(e) => { if (onRowClick) e.currentTarget.style.background = "transparent"; }}
            >
              {columns.map((c) => {
                const val = row[c.key];
                return (
                  <td
                    key={c.key}
                    style={{
                      textAlign: c.align || "left",
                      padding: cellPad,
                      borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border-subtle)",
                      color: "var(--fg-default)",
                      fontFamily: c.mono ? "var(--font-mono)" : "var(--font-sans)",
                      fontSize: c.mono ? 12.5 : 13,
                      letterSpacing: c.mono ? "-0.005em" : "normal",
                      whiteSpace: "nowrap",
                      verticalAlign: "middle",
                    }}
                  >
                    {c.render ? c.render(val, row) : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
