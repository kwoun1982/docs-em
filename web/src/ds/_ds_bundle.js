/* @ds-bundle: {"format":3,"namespace":"DocsEmDesignSystem_afe3d1","components":[{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"Kbd","sourcePath":"components/data/Kbd.jsx"},{"name":"Metric","sourcePath":"components/data/Metric.jsx"},{"name":"ScoreBar","sourcePath":"components/data/ScoreBar.jsx"},{"name":"ScoreChip","sourcePath":"components/data/ScoreChip.jsx"},{"name":"Tag","sourcePath":"components/data/Tag.jsx"},{"name":"ConnectionBadge","sourcePath":"components/feedback/ConnectionBadge.jsx"},{"name":"ExternalCallsCounter","sourcePath":"components/feedback/ConnectionBadge.jsx"},{"name":"GateChip","sourcePath":"components/feedback/GateChip.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusPill","sourcePath":"components/feedback/StatusPill.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Segmented","sourcePath":"components/forms/Segmented.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Tabs","sourcePath":"components/layout/Tabs.jsx"}],"sourceHashes":{"components/core/Icon.jsx":"11790b96bcb3","components/data/DataTable.jsx":"310f700ea35f","components/data/Kbd.jsx":"a2effaddc43d","components/data/Metric.jsx":"558566893635","components/data/ScoreBar.jsx":"7946d19c4c33","components/data/ScoreChip.jsx":"a5750921efd4","components/data/Tag.jsx":"80aba7781e4a","components/feedback/ConnectionBadge.jsx":"341dffe13bf4","components/feedback/GateChip.jsx":"508aac0d8e63","components/feedback/ProgressBar.jsx":"1963b493a4b6","components/feedback/StatusPill.jsx":"616d5ba307ef","components/feedback/Tooltip.jsx":"7419c654db87","components/forms/Button.jsx":"2609c89a2c82","components/forms/IconButton.jsx":"ff8c47d58845","components/forms/Input.jsx":"5385bbfabf93","components/forms/Segmented.jsx":"bc5a28616360","components/forms/Select.jsx":"1e415695830d","components/forms/Switch.jsx":"622a5ba7299e","components/layout/Card.jsx":"5ef0efc904eb","components/layout/Tabs.jsx":"46a7ed432efc","ui_kits/docs-em/AppShell.jsx":"889302b06d10","ui_kits/docs-em/EvalScreen.jsx":"9dfd6641d0fe","ui_kits/docs-em/IndexScreen.jsx":"e4f8d9e5c4df","ui_kits/docs-em/QueryScreen.jsx":"cafacea75850"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DocsEmDesignSystem_afe3d1 = window.DocsEmDesignSystem_afe3d1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Curated Lucide icon set (ISC-licensed path data), 24×24 stroke.
   docs-em uses a 1.75 stroke for a refined console line. Add glyphs here as needed. */
const PATHS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "check-circle": '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  "alert-triangle": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  "alert-circle": '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "x-circle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "rotate-cw": '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  "trash-2": '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  "settings-2": '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  "arrow-down-right": '<path d="m7 7 10 10"/><path d="M17 7v10H7"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  play: '<path d="M6 3l14 9-14 9z"/>',
  "loader-circle": '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  "panel-left": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  circle: '<circle cx="12" cy="12" r="10"/>',
  "more-horizontal": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  hash: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
  "trending-up": '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  "trending-down": '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  "list-filter": '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>'
};

/** Inline SVG icon (Lucide glyph set). `name` selects the glyph; `size` in px. */
function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  color = "currentColor",
  style,
  ...rest
}) {
  const inner = PATHS[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      display: "inline-block",
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner || ""
    }
  }, rest));
}
Icon.names = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
/**
 * Dense data table for eval results, retrieved chunks, and corpus listings.
 * Columns: { key, label, align?, mono?, width?, render?(value,row) }.
 */
function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  onRowClick,
  dense = false,
  style
}) {
  const cellPad = dense ? "6px 12px" : "9px 12px";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      overflowX: "auto",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-card)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
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
      top: 0
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: row[rowKey] ?? i,
    onClick: onRowClick ? () => onRowClick(row) : undefined,
    style: {
      cursor: onRowClick ? "pointer" : "default",
      transition: "background var(--dur-fast) var(--ease-standard)"
    },
    onMouseEnter: e => {
      if (onRowClick) e.currentTarget.style.background = "var(--bg-subtle)";
    },
    onMouseLeave: e => {
      if (onRowClick) e.currentTarget.style.background = "transparent";
    }
  }, columns.map(c => {
    const val = row[c.key];
    return /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        textAlign: c.align || "left",
        padding: cellPad,
        borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--border-subtle)",
        color: "var(--fg-default)",
        fontFamily: c.mono ? "var(--font-mono)" : "var(--font-sans)",
        fontSize: c.mono ? 12.5 : 13,
        letterSpacing: c.mono ? "-0.005em" : "normal",
        whiteSpace: "nowrap",
        verticalAlign: "middle"
      }
    }, c.render ? c.render(val, row) : val);
  }))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/Kbd.jsx
try { (() => {
/** Keyboard key cap for shortcut hints. */
function Kbd({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("kbd", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 18,
      height: 19,
      padding: "0 5px",
      background: "var(--bg-overlay)",
      border: "1px solid var(--border-strong)",
      borderBottomWidth: 2,
      borderRadius: "var(--radius-sm)",
      color: "var(--fg-muted)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      lineHeight: 1,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Kbd });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Kbd.jsx", error: String((e && e.message) || e) }); }

// components/data/Metric.jsx
try { (() => {
/**
 * Big mono stat with label and optional delta. The delta colors itself:
 * teal up, amber down (regression). Pass `invertDelta` when down is good (e.g. latency).
 */
function Metric({
  label,
  value,
  unit,
  delta,
  deltaUnit,
  invertDelta = false,
  hint,
  align = "left"
}) {
  const hasDelta = delta !== undefined && delta !== null;
  const num = typeof delta === "number" ? delta : parseFloat(delta);
  const positive = num > 0;
  const good = invertDelta ? !positive : positive;
  const neutral = num === 0;
  const deltaColor = neutral ? "var(--fg-faint)" : good ? "var(--green)" : "var(--red)";
  const arrow = neutral ? "minus" : positive ? "trending-up" : "trending-down";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: align === "right" ? "flex-end" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--fg-subtle)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 32,
      fontWeight: 600,
      color: "var(--fg-default)",
      letterSpacing: "-0.02em",
      lineHeight: 1
    }
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      color: "var(--fg-subtle)"
    }
  }, unit) : null), hasDelta ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: deltaColor,
      letterSpacing: "-0.005em"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: arrow,
    size: 13,
    color: deltaColor
  }), positive ? "+" : "", delta, deltaUnit || "") : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-subtle)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Metric });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Metric.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreBar.jsx
try { (() => {
/** Horizontal score meter on the red→green scale. Mono value at the end. */
function ScoreBar({
  value = 0,
  max = 1,
  showValue = true,
  width,
  height = 6,
  threshold
}) {
  const ratio = Math.max(0, Math.min(1, value / max));
  const pct = ratio * 100;

  // 3-zone semantic coloring: red / amber / green
  const color = ratio < 0.5 ? "var(--red)" : ratio < 0.8 ? "var(--amber)" : "var(--green)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: width || "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      height,
      background: "var(--bg-inset)",
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      border: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      width: `${pct}%`,
      background: color,
      borderRadius: "var(--radius-full)",
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  }), threshold !== undefined ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -2,
      bottom: -2,
      left: `${threshold / max * 100}%`,
      width: 1.5,
      background: "var(--fg-muted)"
    }
  }) : null), showValue ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color,
      fontWeight: 500,
      minWidth: 38,
      textAlign: "right",
      letterSpacing: "-0.005em"
    }
  }, value.toFixed ? value.toFixed(3) : value) : null);
}
Object.assign(__ds_scope, { ScoreBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreBar.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreChip.jsx
try { (() => {
/**
 * Score chip — mono tabular value with a kind label (`sim 0.695`, `bm25 12.4`).
 * Per spec the score KIND must be labeled so cosine `sim` and `bm25` never get
 * confused. A signed `gap` colors the border: negative = red, positive = green.
 */
function ScoreChip({
  kind = "sim",
  value,
  gap,
  decimals = 3,
  size = "md"
}) {
  const sm = size === "sm";
  let border = "var(--border-strong)";
  let valColor = "var(--fg-default)";
  if (gap !== undefined && gap !== null) {
    if (gap < 0) {
      border = "var(--red-border)";
      valColor = "var(--red)";
    } else if (gap > 0) {
      border = "var(--green-border)";
      valColor = "var(--green)";
    }
  }
  const shown = typeof value === "number" ? value.toFixed(decimals) : value;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 5,
      height: sm ? 18 : 20,
      padding: sm ? "0 6px" : "0 8px",
      background: "var(--surface-2)",
      border: `1px solid ${border}`,
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-mono)",
      fontVariantNumeric: "tabular-nums",
      fontSize: sm ? 11 : 12,
      letterSpacing: "-0.005em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--fg-faint)",
      fontSize: sm ? 10 : 11
    }
  }, kind), /*#__PURE__*/React.createElement("span", {
    style: {
      color: valColor,
      fontWeight: 500
    }
  }, shown));
}
Object.assign(__ds_scope, { ScoreChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreChip.jsx", error: String((e && e.message) || e) }); }

// components/data/Tag.jsx
try { (() => {
/** Small mono token for IDs, models, corpora, metadata. Optional leading icon / remove. */
function Tag({
  children,
  icon,
  tone = "default",
  onRemove,
  mono = true,
  style
}) {
  const tones = {
    default: {
      bg: "var(--surface-2)",
      fg: "var(--fg-muted)",
      border: "var(--border-default)"
    },
    teal: {
      bg: "var(--teal-tint)",
      fg: "var(--teal)",
      border: "var(--teal-border)"
    },
    green: {
      bg: "var(--green-tint)",
      fg: "var(--green)",
      border: "var(--green-border)"
    },
    amber: {
      bg: "var(--amber-tint)",
      fg: "var(--amber)",
      border: "var(--amber-border)"
    },
    blue: {
      bg: "var(--blue-tint)",
      fg: "var(--blue)",
      border: "var(--blue-border)"
    },
    // legacy aliases
    signal: {
      bg: "var(--teal-tint)",
      fg: "var(--teal)",
      border: "var(--teal-border)"
    },
    slate: {
      bg: "var(--blue-tint)",
      fg: "var(--blue)",
      border: "var(--blue-border)"
    },
    warn: {
      bg: "var(--amber-tint)",
      fg: "var(--amber)",
      border: "var(--amber-border)"
    }
  };
  const t = tones[tone] || tones.default;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 20,
      padding: "0 7px",
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: "var(--radius-sm)",
      color: t.fg,
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontSize: 11.5,
      fontWeight: 500,
      letterSpacing: mono ? "-0.005em" : "normal",
      whiteSpace: "nowrap",
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12,
    color: t.fg
  }) : null, children, onRemove ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onRemove,
    style: {
      display: "inline-flex",
      padding: 0,
      margin: "0 -2px 0 1px",
      background: "none",
      border: "none",
      color: t.fg,
      opacity: 0.7,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12
  })) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ConnectionBadge.jsx
try { (() => {
const STATES = {
  ok: {
    dot: "var(--teal)",
    text: "연결됨",
    color: "var(--teal)"
  },
  delay: {
    dot: "var(--amber)",
    text: "지연",
    color: "var(--amber)"
  },
  down: {
    dot: "var(--red)",
    text: "연결 끊김",
    color: "var(--red)"
  }
};

/**
 * Air-gapped connection indicator — `● localhost:1234 연결됨`. The endpoint is
 * mono; a lock icon marks the closed network. teal = ok, amber = delay, red = down.
 * This is a 1급(first-class) trust signal — never hide it.
 */
function ConnectionBadge({
  status = "ok",
  endpoint = "localhost:1234",
  label
}) {
  const s = STATES[status] || STATES.ok;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 26,
      padding: "0 10px",
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: s.dot,
      flexShrink: 0
    }
  }, status === "ok" ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -2,
      borderRadius: "50%",
      border: `1px solid ${s.dot}`,
      animation: "dem-conn 1.8s var(--ease-out) infinite"
    }
  }) : null), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: 12,
    color: "var(--fg-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-default)",
      letterSpacing: "-0.005em"
    }
  }, endpoint), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: s.color
    }
  }, label || s.text), /*#__PURE__*/React.createElement("style", null, "@keyframes dem-conn{0%{opacity:.8;transform:scale(.8)}70%{opacity:0;transform:scale(2)}100%{opacity:0}}"));
}

/** `EXTERNAL CALLS: 0` counter — green at 0, red the instant it is ≥1 (violation). */
function ExternalCallsCounter({
  count = 0
}) {
  const violated = count >= 1;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: "0 10px",
      borderRadius: "var(--radius-md)",
      background: violated ? "var(--red-tint)" : "var(--green-tint)",
      border: `1px solid ${violated ? "var(--red-border)" : "var(--green-border)"}`
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: violated ? "alert-triangle" : "shield-check",
    size: 13,
    color: violated ? "var(--red)" : "var(--green)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      fontWeight: 600,
      letterSpacing: "0.02em",
      color: violated ? "var(--red)" : "var(--green)"
    }
  }, "EXTERNAL CALLS: ", count));
}
Object.assign(__ds_scope, { ConnectionBadge, ExternalCallsCounter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ConnectionBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/GateChip.jsx
try { (() => {
const STATES = {
  pass: {
    fg: "var(--green)",
    bg: "var(--green-tint)",
    border: "var(--green-border)",
    icon: "check-circle"
  },
  fail: {
    fg: "var(--red)",
    bg: "var(--red-tint)",
    border: "var(--red-border)",
    icon: "x-circle"
  },
  fallback: {
    fg: "var(--amber)",
    bg: "var(--amber-tint)",
    border: "var(--amber-border)",
    icon: "alert-triangle"
  },
  blocked: {
    fg: "var(--red)",
    bg: "var(--red-tint)",
    border: "var(--red-border)",
    icon: "lock"
  }
};

/**
 * Gate indicator — pass (green check), fail/blocked (red), fallback (amber, pulsing).
 * Used for eval gates (`L1 G1`) and runtime gates (`content empty → reasoning_content`).
 */
function GateChip({
  state = "pass",
  children,
  size = "md"
}) {
  const s = STATES[state] || STATES.pass;
  const sm = size === "sm";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: sm ? 20 : 24,
      padding: sm ? "0 8px" : "0 10px",
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: "var(--radius-md)",
      color: s.fg,
      fontFamily: "var(--font-mono)",
      fontSize: sm ? 11 : 12,
      fontWeight: 600,
      letterSpacing: "0.01em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: sm ? 13 : 14,
    color: s.fg
  }), state === "fallback" ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -3,
      borderRadius: "50%",
      border: `1px solid ${s.fg}`,
      animation: "dem-gate 1.2s var(--ease-out) infinite"
    }
  }) : null), children, /*#__PURE__*/React.createElement("style", null, "@keyframes dem-gate{0%{opacity:.8;transform:scale(.7)}70%{opacity:0;transform:scale(1.6)}100%{opacity:0}}"));
}
Object.assign(__ds_scope, { GateChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/GateChip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
const TONES = {
  signal: "var(--teal)",
  success: "var(--green)",
  warn: "var(--amber)",
  error: "var(--red)",
  slate: "var(--blue)",
  neutral: "var(--fg-subtle)"
};

/** Thin determinate progress bar for indexing / embedding / eval runs. */
function ProgressBar({
  value = 0,
  tone = "signal",
  height = 6,
  showLabel = false,
  indeterminate = false,
  style
}) {
  const pct = Math.max(0, Math.min(100, value));
  const color = TONES[tone] || TONES.signal;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      height,
      background: "var(--bg-inset)",
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      border: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: indeterminate ? "35%" : `${pct}%`,
      background: color,
      borderRadius: "var(--radius-full)",
      transition: indeterminate ? "none" : "width var(--dur-slow) var(--ease-out)",
      animation: indeterminate ? "dem-indeterminate 1.2s var(--ease-standard) infinite" : "none"
    }
  })), showLabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-muted)",
      minWidth: 38,
      textAlign: "right",
      letterSpacing: "-0.005em"
    }
  }, indeterminate ? "··" : `${Math.round(pct)}%`) : null, /*#__PURE__*/React.createElement("style", null, "@keyframes dem-indeterminate{0%{left:-35%}100%{left:100%}}"));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusPill.jsx
try { (() => {
/* Per spec: status = color + shape (dot/icon) + text label. Never color alone.
   GREEN = success/pass, TEAL = connection/online, AMBER = retry/warn, RED = fail. */
const TONES = {
  ok: {
    fg: "var(--green)",
    bg: "var(--green-tint)",
    border: "var(--green-border)",
    dot: "var(--green)",
    icon: "check-circle"
  },
  online: {
    fg: "var(--teal)",
    bg: "var(--teal-tint)",
    border: "var(--teal-border)",
    dot: "var(--teal)",
    icon: "circle"
  },
  warn: {
    fg: "var(--amber)",
    bg: "var(--amber-tint)",
    border: "var(--amber-border)",
    dot: "var(--amber)",
    icon: "alert-triangle"
  },
  error: {
    fg: "var(--red)",
    bg: "var(--red-tint)",
    border: "var(--red-border)",
    dot: "var(--red)",
    icon: "x-circle"
  },
  running: {
    fg: "var(--teal)",
    bg: "var(--teal-tint)",
    border: "var(--teal-border)",
    dot: "var(--teal)",
    icon: "loader-circle"
  },
  neutral: {
    fg: "var(--fg-muted)",
    bg: "var(--surface-2)",
    border: "var(--border-strong)",
    dot: "var(--fg-faint)",
    icon: "circle"
  }
};

/**
 * Status indicator. `ok` (green) = success/pass, `online` (teal) = connection,
 * `warn` (amber) = retry, `error` (red) = fail, `running` (teal, pulsing) = in progress.
 */
function StatusPill({
  tone = "neutral",
  children,
  indicator = "dot",
  size = "md",
  pulse = false
}) {
  const t = TONES[tone] || TONES.neutral;
  const sm = size === "sm";
  const doPulse = pulse || tone === "running";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: sm ? 5 : 6,
      height: sm ? 18 : 22,
      padding: sm ? "0 7px" : "0 9px",
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: "var(--radius-md)",
      color: t.fg,
      fontFamily: "var(--font-mono)",
      fontSize: sm ? 11 : 12,
      fontWeight: 500,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.005em",
      whiteSpace: "nowrap"
    }
  }, indicator === "icon" ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: sm ? 12 : 13,
    color: t.fg
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: sm ? 6 : 7,
      height: sm ? 6 : 7,
      borderRadius: "50%",
      background: t.dot,
      flexShrink: 0
    }
  }, doPulse ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -2,
      borderRadius: "50%",
      border: `1px solid ${t.dot}`,
      animation: "dem-pulse 1.2s var(--ease-out) infinite"
    }
  }) : null), children, /*#__PURE__*/React.createElement("style", null, "@keyframes dem-pulse{0%{opacity:.9;transform:scale(.8)}70%{opacity:0;transform:scale(1.8)}100%{opacity:0}}"));
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Lightweight hover tooltip. Wraps a trigger; shows `label` on hover/focus. */
function Tooltip({
  label,
  children,
  side = "top",
  style
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: "calc(100% + 6px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    bottom: {
      top: "calc(100% + 6px)",
      left: "50%",
      transform: "translateX(-50%)"
    },
    left: {
      right: "calc(100% + 6px)",
      top: "50%",
      transform: "translateY(-50%)"
    },
    right: {
      left: "calc(100% + 6px)",
      top: "50%",
      transform: "translateY(-50%)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false)
  }, children, show ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      zIndex: 50,
      ...pos[side],
      padding: "5px 9px",
      background: "var(--bg-overlay)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-md)",
      color: "var(--fg-default)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      lineHeight: 1.3,
      whiteSpace: "nowrap",
      pointerEvents: "none"
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 26,
    padding: "0 10px",
    fontSize: 12,
    gap: 6,
    radius: "var(--radius-sm)"
  },
  md: {
    height: 32,
    padding: "0 14px",
    fontSize: 13,
    gap: 7,
    radius: "var(--radius-md)"
  },
  lg: {
    height: 38,
    padding: "0 18px",
    fontSize: 14,
    gap: 8,
    radius: "var(--radius-md)"
  }
};
const VARIANTS = {
  primary: {
    base: {
      background: "var(--signal)",
      color: "var(--accent-fg)",
      border: "1px solid transparent",
      fontWeight: 600
    },
    hover: {
      background: "var(--signal-bright)"
    }
  },
  secondary: {
    base: {
      background: "var(--bg-raised)",
      color: "var(--fg-default)",
      border: "1px solid var(--border-strong)",
      fontWeight: 500
    },
    hover: {
      background: "var(--bg-overlay)",
      borderColor: "var(--fg-faint)"
    }
  },
  ghost: {
    base: {
      background: "transparent",
      color: "var(--fg-muted)",
      border: "1px solid transparent",
      fontWeight: 500
    },
    hover: {
      background: "var(--bg-overlay)",
      color: "var(--fg-default)"
    }
  },
  danger: {
    base: {
      background: "var(--error-bg)",
      color: "var(--error-bright)",
      border: "1px solid var(--error-border)",
      fontWeight: 500
    },
    hover: {
      background: "var(--error-bg-hi)"
    }
  }
};

/**
 * docs-em primary action control. Teal `primary` for the single key action,
 * `secondary` for everything else, `ghost` for toolbar/inline, `danger` for destructive.
 */
function Button({
  children,
  variant = "secondary",
  size = "md",
  iconLeft,
  iconRight,
  disabled = false,
  onClick,
  type = "button",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const sz = SIZES[size] || SIZES.md;
  const vr = VARIANTS[variant] || VARIANTS.secondary;
  const styles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sz.gap,
    height: sz.height,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontFamily: "var(--font-sans)",
    lineHeight: 1,
    borderRadius: sz.radius,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    whiteSpace: "nowrap",
    transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)",
    ...vr.base,
    ...(hover && !disabled ? vr.hover : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: styles
  }, rest), iconLeft ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexShrink: 0
    }
  }, iconLeft) : null, children, iconRight ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexShrink: 0
    }
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 26,
  md: 30,
  lg: 36
};
const ICON = {
  sm: 14,
  md: 16,
  lg: 18
};

/** Square icon-only control for toolbars and inline actions. */
function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  disabled = false,
  active = false,
  onClick,
  title,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dim = SIZES[size] || SIZES.md;
  const variants = {
    ghost: {
      background: active ? "var(--bg-overlay)" : "transparent",
      color: active ? "var(--fg-default)" : "var(--fg-muted)",
      border: "1px solid transparent"
    },
    outline: {
      background: "var(--bg-raised)",
      color: "var(--fg-default)",
      border: "1px solid var(--border-strong)"
    }
  };
  const hoverFill = {
    background: "var(--bg-overlay)",
    color: "var(--fg-default)"
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    title: title,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dim,
      height: dim,
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)",
      ...variants[variant],
      ...(hover && !disabled ? hoverFill : null),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: ICON[size]
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input with optional leading icon. Mono-friendly: set `mono` for paths,
 * IDs, and queries that should read as data.
 */
function Input({
  value,
  onChange,
  placeholder,
  icon,
  mono = false,
  size = "md",
  disabled = false,
  invalid = false,
  type = "text",
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: 28,
    md: 34,
    lg: 40
  };
  const h = heights[size] || heights.md;
  const borderColor = invalid ? "var(--error-border)" : focus ? "var(--signal-border)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: h,
      width: "100%",
      padding: icon ? "0 12px 0 10px" : "0 12px",
      background: "var(--bg-inset)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      boxShadow: focus ? "0 0 0 3px rgba(41,195,153,0.16)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15,
    color: "var(--fg-subtle)"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--fg-default)",
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontSize: size === "sm" ? 12 : 13,
      letterSpacing: mono ? "-0.005em" : "normal"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Segmented.jsx
try { (() => {
/**
 * Segmented control — active segment carries a teal underline (per spec, e.g. the
 * search-mode toggle 벡터 / BM25 / 하이브리드 RRF). Controlled via value/onChange.
 * options: [{ value, label }] or string[].
 */
function Segmented({
  options = [],
  value,
  onChange,
  size = "md",
  style
}) {
  const sm = size === "sm";
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "inline-flex",
      gap: 2,
      padding: 3,
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      ...style
    }
  }, options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    const active = opt.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: opt.value,
      type: "button",
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(opt.value),
      style: {
        position: "relative",
        padding: sm ? "4px 10px 5px" : "5px 13px 6px",
        background: active ? "var(--surface-2)" : "transparent",
        border: "none",
        borderRadius: "var(--radius-sm)",
        color: active ? "var(--fg-default)" : "var(--fg-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: sm ? 12 : 13,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)"
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = "var(--fg-default)";
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = "var(--fg-muted)";
      }
    }, opt.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: sm ? 10 : 13,
        right: sm ? 10 : 13,
        bottom: 1,
        height: 2,
        borderRadius: 2,
        background: active ? "var(--teal)" : "transparent",
        transition: "background var(--dur-fast) var(--ease-standard)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Segmented });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Segmented.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native-backed select styled as a docs-em control. */
function Select({
  value,
  onChange,
  options = [],
  size = "md",
  disabled = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const heights = {
    sm: 28,
    md: 34,
    lg: 40
  };
  const h = heights[size] || heights.md;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      width: "100%",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      width: "100%",
      height: h,
      padding: "0 32px 0 12px",
      background: "var(--bg-raised)",
      color: "var(--fg-default)",
      border: `1px solid ${hover ? "var(--fg-faint)" : "var(--border-strong)"}`,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      fontSize: size === "sm" ? 12 : 13,
      cursor: disabled ? "not-allowed" : "pointer",
      outline: "none",
      transition: "border-color var(--dur-fast) var(--ease-standard)"
    }
  }, rest), options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 10,
      pointerEvents: "none",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 15,
    color: "var(--fg-subtle)"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** On/off toggle. Teal when on; quiet track when off. */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  style
}) {
  const dims = {
    sm: {
      w: 30,
      h: 17,
      knob: 13
    },
    md: {
      w: 36,
      h: 20,
      knob: 16
    }
  };
  const d = dims[size] || dims.md;
  const pad = (d.h - d.knob) / 2;
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  const sw = /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: toggle,
    style: {
      position: "relative",
      width: d.w,
      height: d.h,
      flexShrink: 0,
      padding: 0,
      border: `1px solid ${checked ? "transparent" : "var(--border-strong)"}`,
      borderRadius: "var(--radius-full)",
      background: checked ? "var(--signal)" : "var(--bg-overlay)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background var(--dur-base) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: pad,
      left: checked ? d.w - d.knob - pad - 1 : pad,
      width: d.knob,
      height: d.knob,
      borderRadius: "50%",
      background: checked ? "var(--text-on-signal)" : "var(--fg-muted)",
      transition: "left var(--dur-base) var(--ease-out)"
    }
  }));
  if (!label) return sw;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    }
  }, sw, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--fg-default)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
/**
 * Surface container. `header`/`footer` get hairline dividers; body padding
 * is on by default. Set `inset` for sunken wells (code, logs).
 */
function Card({
  children,
  header,
  footer,
  actions,
  padding = true,
  inset = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      background: inset ? "var(--bg-inset)" : "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      ...style
    }
  }, header ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "12px 16px",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--fg-default)"
    }
  }, header), actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, actions) : null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: padding ? 16 : 0,
      flex: 1
    }
  }, children), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 16px",
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--bg-subtle)",
      fontSize: 12,
      color: "var(--fg-muted)"
    }
  }, footer) : null);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/Tabs.jsx
try { (() => {
/**
 * Underline tab bar. `items` = [{ value, label, count? }]. Controlled via
 * `value` / `onChange`. Quiet by default; active tab carries the teal underline.
 */
function Tabs({
  items = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      borderBottom: "1px solid var(--border-default)",
      ...style
    }
  }, items.map(it => {
    const active = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      onClick: () => onChange && onChange(it.value),
      style: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 12px",
        marginBottom: -1,
        background: "none",
        border: "none",
        borderBottom: `2px solid ${active ? "var(--signal)" : "transparent"}`,
        color: active ? "var(--fg-default)" : "var(--fg-subtle)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        transition: "color var(--dur-fast) var(--ease-standard)"
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.color = "var(--fg-muted)";
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.color = "var(--fg-subtle)";
      }
    }, it.label, it.count !== undefined ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: active ? "var(--signal)" : "var(--fg-faint)",
        background: active ? "var(--signal-bg)" : "var(--bg-overlay)",
        padding: "1px 5px",
        borderRadius: "var(--radius-full)"
      }
    }, it.count) : null);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs-em/AppShell.jsx
try { (() => {
/* docs-em app shell — common fixed header (trust signals) + per-screen body.
   Composes DS primitives via the compiled bundle. */
const {
  Icon,
  IconButton,
  ConnectionBadge,
  ExternalCallsCounter,
  Tag,
  Tooltip
} = window.DocsEmDesignSystem_afe3d1;
function Logo({
  size = 24
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 6,
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "terminal",
    size: size * 0.58,
    color: "var(--teal)",
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--fg-default)",
      letterSpacing: "-0.02em"
    }
  }, "docs"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--teal)",
      letterSpacing: "-0.02em"
    }
  }, "\xB7em")));
}
const SCREENS = [{
  id: "query",
  label: "검색",
  icon: "search"
}, {
  id: "index",
  label: "인덱싱",
  icon: "database"
}, {
  id: "eval",
  label: "평가",
  icon: "gauge"
}];
function ScreenNav({
  active,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      padding: 3,
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)"
    }
  }, SCREENS.map(s => {
    const on = s.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      type: "button",
      onClick: () => onNavigate(s.id),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 11px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        background: on ? "var(--surface-2)" : "transparent",
        color: on ? "var(--fg-default)" : "var(--fg-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: on ? 600 : 500,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 15,
      color: on ? "var(--teal)" : "var(--fg-faint)"
    }), s.label);
  }));
}

/** The closed-network trust cluster — fixed on every screen, never hidden. */
function TrustCluster() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(ConnectionBadge, {
    status: "ok",
    endpoint: "localhost:1234"
  }), /*#__PURE__*/React.createElement(ExternalCallsCounter, {
    count: 0
  }), /*#__PURE__*/React.createElement(Tooltip, {
    label: "\uBAA8\uB4E0 \uCD94\uB860\xB7\uC784\uBCA0\uB529\xB7\uC0DD\uC131\uC774 \uB85C\uCEEC\uC5D0\uC11C \uC2E4\uD589\uB429\uB2C8\uB2E4"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: "0 10px",
      borderRadius: "var(--radius-md)",
      background: "var(--teal-tint)",
      border: "1px solid var(--teal-border)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 13,
    color: "var(--teal)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      fontWeight: 600,
      letterSpacing: "0.02em",
      color: "var(--teal)"
    }
  }, "100% LOCAL"))));
}
function AppShell({
  active,
  onNavigate,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--surface-app)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--topbar-height)",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 16px",
      borderBottom: "1px solid var(--border-default)",
      background: "var(--bg-canvas)"
    }
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 22,
      background: "var(--border-subtle)"
    }
  }), /*#__PURE__*/React.createElement(ScreenNav, {
    active: active,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(TrustCluster, null))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minHeight: 0,
      overflow: "hidden",
      display: "flex"
    }
  }, children));
}

/* Reusable left rail shell for screens B and C. */
function SideRail({
  children,
  width = 220
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width,
      flexShrink: 0,
      borderRight: "1px solid var(--border-default)",
      background: "var(--bg-sunken)",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column"
    }
  }, children);
}
function RailSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 12px 0"
    }
  }, label ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--fg-faint)",
      padding: "4px 8px 8px"
    }
  }, label) : null, children);
}
Object.assign(window, {
  AppShell,
  Logo,
  SideRail,
  RailSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs-em/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs-em/EvalScreen.jsx
try { (() => {
/* docs-em — C. 검색 품질 평가 대시보드 (평가자)
   Demo per spec ④: 회귀 케이스 "연차 휴가 신청 절차", Recall@1=0, 격차 -0.018,
   정답 휴가규정 첫 히트 3위, MRR 0.333, nDCG@3 0.500. baseline/+bm25 = 회귀,
   +rrf = 개선 성공(0▸1, 격차 +0.012, 순위 3▸1) 시안. 8%/12%/+0.012 는 데모값. */
const {
  Icon,
  Button,
  Select,
  StatusPill,
  GateChip,
  Tag,
  Card,
  ScoreChip
} = window.DocsEmDesignSystem_afe3d1;
const SECTIONS = ["전체지표", "통제실험", "회귀상세", "이력", "안정성"];
const EXPS = [{
  value: "baseline",
  label: "baseline · 변수 0"
}, {
  value: "bm25",
  label: "+bm25 · 변수 1 ✔"
}, {
  value: "rrf",
  label: "+rrf · 변수 1 ✔"
}];
const GOLDEN = [{
  k: "Recall@1",
  before: 0,
  after: {
    rrf: 1.0
  }
}, {
  k: "Recall@3",
  before: 1.0,
  after: {}
}, {
  k: "Recall@5",
  before: 1.0,
  after: {}
}, {
  k: "Recall@10",
  before: 1.0,
  after: {}
}, {
  k: "MRR",
  before: 0.333,
  after: {
    rrf: 1.0
  }
}, {
  k: "nDCG@3",
  before: 0.500,
  after: {
    rrf: 1.0
  }
}];
function KpiRecall({
  success
}) {
  const cells = success ? [1, 1, 1, 1] : [0, 1, 1, 1];
  return /*#__PURE__*/React.createElement("div", {
    key: success ? "s" : "b",
    style: {
      flex: "1.15",
      padding: "18px 20px",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-1)",
      border: `1px solid ${success ? "var(--green-border)" : "var(--red-border)"}`,
      animation: success ? "dem-flash 0.9s var(--ease-out) 1" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--fg-muted)"
    }
  }, "\uD68C\uADC0 \xB7 Recall@1"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--fg-faint)"
    }
  }, "\"\uC5F0\uCC28 \uD734\uAC00 \uC2E0\uCCAD \uC808\uCC28\""), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, success ? /*#__PURE__*/React.createElement(GateChip, {
    state: "pass",
    size: "sm"
  }, "G1 PASS") : /*#__PURE__*/React.createElement(GateChip, {
    state: "fail",
    size: "sm"
  }, "L1 G1 \uBBF8\uB2EC"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 56,
      fontWeight: 700,
      lineHeight: 0.9,
      letterSpacing: "-0.03em",
      color: success ? "var(--green)" : "var(--red)"
    }
  }, success ? "1.0" : "0"), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-muted)"
    }
  }, "\u25B8 \uBAA9\uD45C 1"), success ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--green)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 13,
    color: "var(--green)"
  }), "REGRESS \uD574\uC18C") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--red)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 13,
    color: "var(--red)"
  }), "REGRESS")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 4,
      paddingBottom: 6
    }
  }, cells.map((on, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 26,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 22,
      borderRadius: 3,
      background: on ? "var(--green)" : "transparent",
      border: `1px solid ${on ? "var(--green)" : "var(--red-border)"}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      color: "var(--fg-faint)"
    }
  }, "@", [1, 3, 5, 10][i]))))));
}
function KpiGap({
  success
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1",
      padding: "18px 20px",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "var(--fg-muted)"
    }
  }, "\uC815\uB2F5\u2212\uC624\uB2F5 \uC720\uC0AC\uB3C4 \uACA9\uCC28"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, success ? /*#__PURE__*/React.createElement(GateChip, {
    state: "pass",
    size: "sm"
  }, "PASS") : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 40,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: success ? "var(--green)" : "var(--red)"
    }
  }, success ? "+0.012" : "−0.018"), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-muted)"
    }
  }, "\u25B8 \uBAA9\uD45C +\uC591\uC218 \uC5ED\uC804"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)",
      marginTop: 3
    }
  }, "\uC815\uB2F5 hr-0412 vs \uC624\uB2F5 tr-0203"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(GapBar, {
    label: "\uC815\uB2F5 \uD734\uAC00\uADDC\uC815",
    v: success ? 0.713 : 0.695,
    max: 0.72,
    good: success
  }), /*#__PURE__*/React.createElement(GapBar, {
    label: "\uC624\uB2F5 \uCD9C\uC7A5\uACBD\uBE44",
    v: success ? 0.701 : 0.713,
    max: 0.72,
    good: false,
    dim: true
  })));
}
function GapBar({
  label,
  v,
  max,
  good,
  dim
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 92,
      fontSize: 11,
      color: dim ? "var(--fg-faint)" : "var(--fg-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 7,
      background: "var(--bg-sunken)",
      borderRadius: "var(--radius-full)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${v / max * 100}%`,
      height: "100%",
      background: good ? "var(--green)" : dim ? "var(--fg-faint)" : "var(--red)",
      borderRadius: "var(--radius-full)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-muted)"
    }
  }, v.toFixed(3)));
}
function GoldenRow({
  row,
  exp
}) {
  const after = row.after[exp] !== undefined ? row.after[exp] : row.before;
  const delta = +(after - row.before).toFixed(3);
  const big = row.k === "Recall@1";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "92px 1fr 1fr 70px",
      alignItems: "center",
      gap: 12,
      padding: "7px 0",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: big ? 700 : 500,
      color: big ? "var(--fg-default)" : "var(--fg-muted)"
    }
  }, row.k), /*#__PURE__*/React.createElement(MiniBar, {
    v: row.before
  }), /*#__PURE__*/React.createElement(MiniBar, {
    v: after,
    hl: delta > 0
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: delta > 0 ? "var(--green)" : delta < 0 ? "var(--red)" : "var(--fg-faint)"
    }
  }, delta > 0 ? "▲ +" : delta < 0 ? "▼ " : "", delta === 0 ? "0" : delta.toFixed(3)));
}
function MiniBar({
  v,
  hl
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      background: "var(--bg-sunken)",
      borderRadius: "var(--radius-full)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${v * 100}%`,
      height: "100%",
      background: hl ? "var(--green)" : v >= 0.99 ? "var(--green)" : v === 0 ? "var(--red)" : "var(--teal)",
      borderRadius: "var(--radius-full)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-muted)"
    }
  }, v.toFixed(v < 1 && v > 0 ? 3 : 1)));
}
function EvalScreen() {
  const [exp, setExp] = React.useState("baseline");
  const [sec, setSec] = React.useState("전체지표");
  const success = exp === "rrf";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: "100%",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(window.SideRail, {
    width: 208
  }, /*#__PURE__*/React.createElement(window.RailSection, {
    label: "\uC139\uC158"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1
    }
  }, SECTIONS.map(s => {
    const on = s === sec;
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      type: "button",
      onClick: () => setSec(s),
      style: {
        textAlign: "left",
        padding: "7px 9px",
        borderRadius: "var(--radius-md)",
        border: "1px solid",
        borderColor: on ? "var(--border-default)" : "transparent",
        background: on ? "var(--surface-2)" : "transparent",
        color: on ? "var(--fg-default)" : "var(--fg-muted)",
        fontSize: 13,
        fontWeight: on ? 600 : 500,
        cursor: "pointer"
      }
    }, s);
  }))), /*#__PURE__*/React.createElement(window.RailSection, {
    label: "\uD65C\uC131 \uC2E4\uD5D8"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, EXPS.map(e => {
    const on = e.value === exp;
    return /*#__PURE__*/React.createElement("button", {
      key: e.value,
      type: "button",
      onClick: () => setExp(e.value),
      style: {
        textAlign: "left",
        padding: "8px 10px",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        background: on ? "var(--teal-tint)" : "var(--surface-1)",
        border: `1px solid ${on ? "var(--teal-border)" : "var(--border-default)"}`,
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        color: on ? "var(--teal)" : "var(--fg-muted)"
      }
    }, e.label);
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      overflowY: "auto",
      padding: "20px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(KpiRecall, {
    success: success
  }), /*#__PURE__*/React.createElement(KpiGap, {
    success: success
  })), /*#__PURE__*/React.createElement(Card, {
    header: "\uACE8\uB4E0\uC14B \uC804\uCCB4 \uC9C0\uD45C",
    actions: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--fg-faint)"
      }
    }, "before \u25B8 after")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "92px 1fr 1fr 70px",
      gap: 12,
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--fg-faint)"
    }
  }, "\uC9C0\uD45C"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--fg-faint)"
    }
  }, "before"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--fg-faint)"
    }
  }, "after"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--fg-faint)"
    }
  }, "\u0394")), GOLDEN.map(r => /*#__PURE__*/React.createElement(GoldenRow, {
    key: r.k,
    row: r,
    exp: exp
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gap: 14
    },
    className: "c-grid"
  }, /*#__PURE__*/React.createElement(Card, {
    header: "\uD1B5\uC81C \uC2E4\uD5D8 \uBE44\uAD50",
    actions: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--fg-faint)"
      }
    }, "\uB2E8\uC77C \uBCC0\uC218 \uC6D0\uCE59")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(ExpRow, {
    name: "baseline",
    vars: 0,
    note: "\uAE30\uC900"
  }), /*#__PURE__*/React.createElement(ExpRow, {
    name: "+bm25 (Kiwi \uD615\uD0DC\uC18C)",
    vars: 1,
    ok: true
  }), /*#__PURE__*/React.createElement(ExpRow, {
    name: "+rrf",
    vars: 1,
    ok: true
  }), /*#__PURE__*/React.createElement(ExpRow, {
    name: "\uC784\uBCA0\uB529\uAD50\uCCB4 + RRF \uB3D9\uC2DC",
    vars: 2,
    violation: true
  }))), /*#__PURE__*/React.createElement(Card, {
    header: "\uC548\uC815\uC131 \uBCF4\uC870"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Gauge, {
    label: "content \uBE48\uAC12 \uBC1C\uC0DD\uB960",
    pct: 8
  }), /*#__PURE__*/React.createElement(Gauge, {
    label: "length \uC7AC\uC2DC\uB3C4\uC728",
    pct: 12
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      color: "var(--fg-faint)"
    }
  }, "\uC784\uACC4 \u226525% \uBD80\uD130 \uC570\uBC84 \xB7 \uAC12\uC740 \uB370\uBAA8")))), /*#__PURE__*/React.createElement(Card, {
    header: "\uD68C\uADC0 \uCF00\uC774\uC2A4 \uB4DC\uB9B4\uB2E4\uC6B4",
    padding: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["질의", "정답 문서", "순위", "정답 점수", "최상위 오답", "격차", "게이트"].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: i >= 2 && i <= 5 ? "right" : "left",
      padding: "9px 14px",
      background: "var(--bg-sunken)",
      borderBottom: "1px solid var(--border-default)",
      color: "var(--fg-faint)",
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      whiteSpace: "nowrap"
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: success ? "var(--green-tint)" : "var(--red-tint)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "11px 14px",
      fontSize: 13,
      color: "var(--fg-default)"
    }
  }, "\uC5F0\uCC28 \uD734\uAC00 \uC2E0\uCCAD \uC808\uCC28"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "11px 14px",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-muted)"
    }
  }, "\uD734\uAC00\uADDC\uC815.pdf"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "11px 14px",
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: success ? "var(--green)" : "var(--red)"
    }
  }, success ? "3 ▸ 1" : "3"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "11px 14px",
      textAlign: "right",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-default)"
    }
  }, "0.695"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "11px 14px",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-muted)"
    }
  }, "\uCD9C\uC7A5\uACBD\uBE44.docx"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "11px 14px",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement(ScoreChip, {
    kind: "\uACA9\uCC28",
    value: success ? "+0.012" : "−0.018",
    gap: success ? 0.012 : -0.018,
    decimals: 3,
    size: "sm"
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "11px 14px"
    }
  }, success ? /*#__PURE__*/React.createElement(GateChip, {
    state: "pass",
    size: "sm"
  }, "G1 PASS") : /*#__PURE__*/React.createElement(GateChip, {
    state: "fail",
    size: "sm"
  }, "G1 \uBBF8\uB2EC"))))))), /*#__PURE__*/React.createElement(Card, {
    header: "\uC2E4\uD5D8 \uC774\uB825 \uD0C0\uC784\uB77C\uC778"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 0
    }
  }, /*#__PURE__*/React.createElement(TimelineNode, {
    label: "L1",
    sub: "\uAC80\uC0C9 MVP + \uD3C9\uAC00 \uD558\uB124\uC2A4",
    done: true
  }), /*#__PURE__*/React.createElement(TimelineConn, {
    done: true
  }), /*#__PURE__*/React.createElement(TimelineNode, {
    label: "L2",
    sub: "\uC784\uBCA0\uB529 \uAD50\uCCB4 \xB7 \uD558\uC774\uBE0C\uB9AC\uB4DC \xB7 \uD3F4\uBC31 \uAC8C\uC774\uD2B8",
    done: success,
    active: !success
  }), /*#__PURE__*/React.createElement(TimelineConn, null), /*#__PURE__*/React.createElement(TimelineNode, {
    label: "L3",
    sub: "\uB9AC\uB7AD\uD0B9 \xB7 \uC11C\uBE59"
  }))))), /*#__PURE__*/React.createElement("style", null, "@keyframes dem-flash{0%{border-color:var(--red);box-shadow:0 0 0 2px var(--red-tint)}100%{border-color:var(--green-border);box-shadow:none}}@media (max-width:768px){.c-grid{grid-template-columns:1fr !important}}"));
}
function ExpRow({
  name,
  vars,
  ok,
  violation,
  note
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px",
      borderRadius: "var(--radius-md)",
      background: violation ? "var(--amber-tint)" : "var(--surface-2)",
      border: `1px solid ${violation ? "var(--amber-border)" : "var(--border-subtle)"}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-default)"
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, "\uBCC0\uC218 ", vars), violation ? /*#__PURE__*/React.createElement(StatusPill, {
    tone: "warn",
    size: "sm",
    indicator: "icon"
  }, "\uD1B5\uC81C \uC704\uBC18") : ok ? /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 15,
    color: "var(--green)"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, note)));
}
function Gauge({
  label,
  pct
}) {
  const amber = pct >= 25;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--fg-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: amber ? "var(--amber)" : "var(--green)"
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: "var(--bg-sunken)",
      borderRadius: "var(--radius-full)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: amber ? "var(--amber)" : "var(--green)",
      borderRadius: "var(--radius-full)"
    }
  })));
}
function TimelineNode({
  label,
  sub,
  done,
  active
}) {
  const c = done ? "var(--green)" : active ? "var(--teal)" : "var(--fg-faint)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      flexShrink: 0,
      width: 150
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: done ? "var(--green-tint)" : active ? "var(--teal-tint)" : "var(--surface-2)",
      border: `1.5px solid ${done ? "var(--green-border)" : active ? "var(--teal-border)" : "var(--border-strong)"}`
    }
  }, done ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "var(--green)"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: c
    }
  }, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: c
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: "var(--fg-faint)",
      textAlign: "center",
      lineHeight: 1.35
    }
  }, sub));
}
function TimelineConn({
  done
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 2,
      background: done ? "var(--green-border)" : "var(--border-strong)",
      marginTop: -28
    }
  });
}
Object.assign(window, {
  EvalScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs-em/EvalScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs-em/IndexScreen.jsx
try { (() => {
/* docs-em — B. 문서 인덱싱 / 재색인 (운영자 콘솔)
   Demo per spec ④: active EMB nomic 768·norm1, BGE-M3 미채택 DECISION,
   pipeline pymupdf✔12 · kss✔1,842 · 청킹✔312 · 임베딩⟳188/312 · 저장○0,
   docs 휴가규정/출장경비 색인됨 + 손상스캔 파싱실패. */
const {
  Icon,
  IconButton,
  Button,
  Input,
  StatusPill,
  Tag,
  Card,
  DataTable,
  ProgressBar
} = window.DocsEmDesignSystem_afe3d1;
const DOCS = [{
  id: 1,
  name: "휴가규정.pdf",
  chunks: "312",
  dim: "768",
  model: "nomic",
  at: "16:02:11",
  status: "ok",
  note: "재색인 0 · 신규"
}, {
  id: 2,
  name: "출장경비.docx",
  chunks: "188",
  dim: "768",
  model: "nomic",
  at: "16:01:40",
  status: "ok",
  note: ""
}, {
  id: 3,
  name: "손상스캔.pdf",
  chunks: "–",
  dim: "–",
  model: "–",
  at: "16:00:55",
  status: "error",
  note: ""
}];
const PIPE = [{
  label: "파싱",
  tool: "pymupdf",
  count: "✔ 12",
  state: "done"
}, {
  label: "문장분리",
  tool: "kss",
  count: "✔ 1,842",
  state: "done"
}, {
  label: "청킹",
  tool: "char-guard",
  count: "✔ 312",
  state: "done"
}, {
  label: "임베딩",
  tool: "nomic",
  count: "⟳ 188/312",
  state: "active",
  pct: 60
}, {
  label: "저장",
  tool: "vectorstore",
  count: "○ 0",
  state: "pending",
  pct: 0
}];
function EmbToggle({
  active,
  label,
  dim,
  meta,
  warn,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
      width: "100%",
      textAlign: "left",
      padding: "9px 10px",
      marginBottom: 6,
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      background: active ? "var(--teal-tint)" : "var(--surface-1)",
      border: `1px solid ${active ? "var(--teal-border)" : "var(--border-default)"}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: active ? "var(--teal)" : "var(--fg-faint)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: active ? "var(--teal)" : "var(--fg-default)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-muted)",
      marginLeft: "auto"
    }
  }, dim), warn ? /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 13,
    color: "var(--amber)"
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      color: "var(--fg-faint)",
      lineHeight: 1.4
    }
  }, meta));
}
function PipeNode({
  node,
  last
}) {
  const c = node.state === "done" ? "var(--green)" : node.state === "active" ? "var(--teal)" : "var(--fg-faint)";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: node.state === "done" ? "check-circle" : node.state === "active" ? "loader-circle" : "circle",
    size: 14,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: node.state === "pending" ? "var(--fg-faint)" : "var(--fg-default)"
    }
  }, node.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: c
    }
  }, node.count), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--fg-faint)"
    }
  }, node.tool), /*#__PURE__*/React.createElement(ProgressBar, {
    value: node.state === "done" ? 100 : node.pct || 0,
    tone: node.state === "active" ? "signal" : "success",
    height: 3
  })), !last ? /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 15,
    color: "var(--border-strong)",
    style: {
      marginTop: 2,
      flexShrink: 0
    }
  }) : null);
}
function DecisionModal({
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(3,5,8,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 60
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 440,
      background: "var(--surface-1)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-overlay)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 16,
    color: "var(--amber)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--fg-default)"
    }
  }, "\uC784\uBCA0\uB529 \uBAA8\uB378 \uAD50\uCCB4 \u2014 DECISION \uBBF8\uD655\uC815")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      fontSize: 13,
      lineHeight: 1.7,
      color: "var(--fg-muted)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 10px"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--fg-default)"
    }
  }, "BGE-M3"), " \uCC44\uD0DD \uC2DC \uCC28\uC6D0\uC774 ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--amber)"
    }
  }, "768 \u2192 1024"), "\uB85C \uBC14\uB00C\uC5B4 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--fg-default)"
    }
  }, "\uC804\uCCB4 \uC7AC\uC778\uB371\uC2F1"), "\uACFC ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--fg-default)"
    }
  }, "norm \uC7AC\uCE21\uC815"), "\uC774 \uD544\uC694\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "1024"), /*#__PURE__*/React.createElement(Tag, null, "ctx 8192"), /*#__PURE__*/React.createElement(Tag, null, "Dense+Sparse+ColBERT"), /*#__PURE__*/React.createElement(Tag, {
    tone: "blue"
  }, "MIT"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      padding: "12px 16px",
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--bg-sunken)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onClose
  }, "\uCDE8\uC18C"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onClose
  }, "\uC801\uC6A9"))));
}
function IndexScreen() {
  const [modal, setModal] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      width: "100%",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(window.SideRail, {
    width: 222
  }, /*#__PURE__*/React.createElement(window.RailSection, {
    label: "\uC784\uBCA0\uB529 \uBAA8\uB378"
  }, /*#__PURE__*/React.createElement(EmbToggle, {
    active: true,
    label: "nomic",
    dim: "768 \xB7 norm1",
    meta: "text-embedding-nomic-embed-text-v1.5 \xB7 L2 norm=1.0 (\uC7AC\uC815\uADDC\uD654 \uAE08\uC9C0)"
  }), /*#__PURE__*/React.createElement(EmbToggle, {
    label: "BGE-M3",
    dim: "1024",
    warn: true,
    meta: "ctx 8192 \xB7 Dense+Sparse+ColBERT \xB7 MIT",
    onClick: () => setModal(true)
  })), /*#__PURE__*/React.createElement(window.RailSection, {
    label: "\uBCA1\uD130\uC2A4\uD1A0\uC5B4"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, ["LanceDB", "ChromaDB"].map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "8px 10px",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-1)",
      border: "1px dashed var(--border-default)",
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "database",
    size: 13,
    color: "var(--fg-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--fg-muted)"
    }
  }, s, "?"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 10,
      color: "var(--fg-faint)"
    }
  }, "DECISION"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-1)",
      border: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12,
    color: "var(--fg-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      color: "var(--fg-muted)"
    }
  }, "localhost:1234/v1")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--fg-faint)"
    }
  }, "api_key=lm-studio (dummy)")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      overflowY: "auto",
      padding: "20px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: "20px",
      border: "1.5px dashed var(--border-strong)",
      borderRadius: "var(--radius-lg)",
      background: "var(--bg-sunken)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 20,
    color: "var(--fg-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--fg-default)"
    }
  }, "PDF \xB7 DOCX \uD30C\uC77C\uC744 \uC5EC\uAE30\uC5D0 \uB4DC\uB798\uADF8"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, "\uADF8 \uC678 \uD3EC\uB9F7\uC740 \uAC70\uBD80 (.pdf / .docx \uB9CC)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "folder",
      size: 14
    })
  }, "\uD30C\uC77C \uC120\uD0DD"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, "\uAC70\uBD80:"), /*#__PURE__*/React.createElement(Tag, {
    tone: "amber",
    icon: "x"
  }, "report.xlsx \xB7 \uC9C0\uC6D0 \uC548 \uD568\xB7\uC2A4\uD0B5"), /*#__PURE__*/React.createElement(Tag, {
    tone: "amber",
    icon: "x"
  }, "notes.hwp \xB7 \uC9C0\uC6D0 \uC548 \uD568\xB7\uC2A4\uD0B5"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--fg-default)"
    }
  }, "\uD30C\uC774\uD504\uB77C\uC778"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, "\uD30C\uC2F1 \u2192 \uBB38\uC7A5\uBD84\uB9AC \u2192 \uCCAD\uD0B9 \u2192 \uC784\uBCA0\uB529 \u2192 \uC800\uC7A5"), /*#__PURE__*/React.createElement(Tag, {
    tone: "amber",
    style: {
      marginLeft: "auto"
    }
  }, "\uAC00\uB4DC: char / \uB85C\uCEEC \uD1A0\uD06C\uB098\uC774\uC800 \uAE30\uC900")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 8
    }
  }, PIPE.map((n, i) => /*#__PURE__*/React.createElement(PipeNode, {
    key: n.label,
    node: n,
    last: i === PIPE.length - 1
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginTop: 14,
      paddingTop: 12,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 13,
    color: "var(--amber)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      color: "var(--amber)"
    }
  }, "prompt_tokens=0 (unreliable)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--fg-faint)"
    }
  }, "\u2014 \uD1A0\uD070 \uCE74\uC6B4\uD2B8 \uBBF8\uC0AC\uC6A9, char \uAC00\uB4DC\uB85C \uBD84\uD560"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 600,
      color: "var(--fg-default)"
    }
  }, "\uC0C9\uC778\uB41C \uBB38\uC11C"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, "\uBA71\uB4F1: \uBB38\uC11CID + \uCCAD\uD06C\uD574\uC2DC \uB3D9\uC77C \uC2DC \uC0DD\uC131 \uC548 \uD568"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "rotate-cw",
      size: 14
    })
  }, "\uC804\uCCB4 \uC7AC\uC0C9\uC778"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary"
  }, "\uC120\uD0DD \uC7AC\uC0C9\uC778"))), /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: "name",
      label: "문서명",
      mono: true,
      render: (v, r) => /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: r.status === "error" ? "alert-circle" : "file-text",
        size: 14,
        color: r.status === "error" ? "var(--red)" : "var(--fg-faint)"
      }), v)
    }, {
      key: "chunks",
      label: "청크",
      align: "right",
      mono: true,
      width: 70
    }, {
      key: "dim",
      label: "차원",
      align: "right",
      mono: true,
      width: 64
    }, {
      key: "model",
      label: "모델",
      mono: true,
      width: 80
    }, {
      key: "at",
      label: "색인 시각",
      align: "right",
      mono: true,
      width: 96
    }, {
      key: "status",
      label: "상태",
      width: 210,
      render: (v, r) => v === "error" ? /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(StatusPill, {
        tone: "error",
        size: "sm"
      }, "\uD30C\uC2F1\uC2E4\uD328\xB7\uC2A4\uD0B5"), /*#__PURE__*/React.createElement("a", {
        href: "#log",
        style: {
          fontFamily: "var(--font-mono)",
          fontSize: 11
        }
      }, "[\uB85C\uADF8]")) : /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(StatusPill, {
        tone: "ok",
        size: "sm"
      }, "\uC0C9\uC778\uB428"), r.note ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: "var(--fg-faint)"
        }
      }, r.note) : null)
    }],
    rows: DOCS
  })))), modal ? /*#__PURE__*/React.createElement(DecisionModal, {
    onClose: () => setModal(false)
  }) : null);
}
Object.assign(window, {
  IndexScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs-em/IndexScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs-em/QueryScreen.jsx
try { (() => {
/* docs-em — A. 질의응답 + 출처 인용 (핵심 화면)
   Demo data per spec ④: query "연차 휴가 신청 절차", docs 휴가규정/출장경비 only,
   Top-k k=5, 정답(휴가규정 hr-0412) 첫 히트 3위, 격차 -0.018, 인용 ⊆ Top-k. */
const {
  Icon,
  IconButton,
  Button,
  Segmented,
  Select,
  ScoreChip,
  StatusPill,
  GateChip,
  Tag
} = window.DocsEmDesignSystem_afe3d1;
const TOPK = [{
  rank: 1,
  doc: "출장경비.docx",
  loc: "p.2",
  id: "tr-0203",
  sim: 0.713,
  label: "wrong",
  snippet: "출장 신청은 출장 7일 전까지 시스템에 등록하며 부서장 전결로 승인한다.",
  cited: false
}, {
  rank: 2,
  doc: "출장경비.docx",
  loc: "p.5",
  id: "tr-0511",
  sim: 0.701,
  label: "none",
  snippet: "경비 정산은 귀임 후 5일 이내 영수증을 첨부하여 제출한다.",
  cited: false
}, {
  rank: 3,
  doc: "휴가규정.pdf",
  loc: "p.4",
  id: "hr-0412",
  sim: 0.695,
  label: "answer",
  gap: -0.018,
  snippet: "연차 휴가는 신청서 작성 후 팀장 승인을 거쳐 신청하며, 사용 7일 전까지 제출한다.",
  cited: true,
  note: "[¹]"
}, {
  rank: 4,
  doc: "출장경비.docx",
  loc: "p.8",
  id: "tr-0803",
  sim: 0.690,
  label: "none",
  snippet: "장기 출장 시 숙박비는 1박 기준 한도 내에서 실비로 정산한다.",
  cited: false
}, {
  rank: 5,
  doc: "휴가규정.pdf",
  loc: "p.7",
  id: "hr-0712",
  sim: 0.687,
  label: "none",
  snippet: "반차는 오전·오후 단위로 사용하며 연차에서 0.5일을 차감한다.",
  cited: true,
  note: "[²]"
}];
const LABELS = {
  answer: {
    t: "▲정답",
    c: "var(--green)"
  },
  wrong: {
    t: "✕오답",
    c: "var(--red)"
  },
  none: {
    t: "—",
    c: "var(--fg-faint)"
  }
};
function ChunkCard({
  c,
  mode,
  hl,
  onHover
}) {
  const lab = LABELS[c.label];
  const active = hl === c.id;
  const barColor = c.cited ? "var(--teal)" : c.label === "wrong" ? "var(--red)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => onHover(c.id),
    onMouseLeave: () => onHover(null),
    style: {
      position: "relative",
      padding: "11px 12px 11px 15px",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-1)",
      border: `1px solid ${active || c.cited ? "var(--teal-border)" : "var(--border-default)"}`,
      boxShadow: active ? "0 0 0 2px var(--teal-tint)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 8,
      bottom: 8,
      width: 4,
      borderRadius: 4,
      background: barColor
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, "#", c.rank), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--fg-default)"
    }
  }, c.doc), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-muted)"
    }
  }, "\xB7 ", c.loc), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 11,
      fontWeight: 600,
      color: lab.c
    }
  }, lab.t)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 9px",
      fontSize: 12.5,
      lineHeight: 1.5,
      color: "var(--fg-muted)",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, c.snippet), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)"
    }
  }, c.id), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, c.gap !== undefined ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--red)"
    }
  }, "\uACA9\uCC28 ", c.gap, " \u25BC") : null, /*#__PURE__*/React.createElement(ScoreChip, {
    kind: mode === "bm25" ? "bm25" : "sim",
    value: c.sim,
    gap: c.gap,
    size: "sm"
  }))));
}
function Footnote({
  n,
  id,
  hl,
  onHover
}) {
  const active = hl === id;
  return /*#__PURE__*/React.createElement("sup", {
    onMouseEnter: () => onHover(id),
    onMouseLeave: () => onHover(null),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 15,
      height: 15,
      padding: "0 3px",
      margin: "0 1px",
      borderRadius: 3,
      background: active ? "var(--teal-tint-2)" : "var(--teal-tint)",
      border: "1px solid var(--teal-border)",
      color: "var(--teal)",
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      fontWeight: 600,
      verticalAlign: "top",
      cursor: "pointer"
    }
  }, n);
}
function QueryScreen() {
  const [mode, setMode] = React.useState("hybrid");
  const [q, setQ] = React.useState("연차 휴가 신청 절차");
  const [hl, setHl] = React.useState(null);
  const [metaOpen, setMetaOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 20px",
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-canvas)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: mode,
    onChange: setMode,
    size: "sm",
    options: [{
      value: "vector",
      label: "벡터"
    }, {
      value: "bm25",
      label: "BM25"
    }, {
      value: "hybrid",
      label: "하이브리드 RRF"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      color: "var(--fg-faint)"
    }
  }, "GEN"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 210
    }
  }, /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    options: [{
      value: "gemma",
      label: "gemma-4-e4b · ctx 65536"
    }, {
      value: "qwen-35",
      label: "qwen3.6-35b-a3b · ctx 8192"
    }, {
      value: "qwen-9",
      label: "qwen3.5-9b · ctx 8192"
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      color: "var(--fg-faint)"
    }
  }, "EMB"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      color: "var(--fg-muted)"
    }
  }, "text-embedding-nomic\u2026 \xB7 768d")))), /*#__PURE__*/React.createElement("div", {
    className: "qa-grid",
    style: {
      flex: 1,
      minHeight: 0,
      display: "grid",
      gridTemplateColumns: "62fr 38fr"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      borderRight: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "22px 26px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 11,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: "var(--radius-sm)",
      background: "var(--surface-2)",
      border: "1px solid var(--border-default)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: 11,
      color: "var(--fg-muted)"
    }
  }, "\uB098"), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 3,
      fontSize: 15,
      fontWeight: 600,
      color: "var(--fg-default)"
    }
  }, "\uC5F0\uCC28 \uD734\uAC00 \uC2E0\uCCAD \uC808\uCC28")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 11,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: "var(--radius-sm)",
      background: "var(--teal-tint)",
      border: "1px solid var(--teal-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "terminal",
    size: 14,
    color: "var(--teal)",
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    icon: "cpu"
  }, "gemma-4-e4b"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMetaOpen(v => !v),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 20,
      padding: "0 8px",
      borderRadius: "var(--radius-full)",
      background: "var(--surface-2)",
      border: "1px solid var(--border-default)",
      color: "var(--fg-muted)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      cursor: "pointer"
    }
  }, "\uC7AC\uC2DC\uB3C4 1 ", /*#__PURE__*/React.createElement(Icon, {
    name: metaOpen ? "chevron-down" : "chevron-right",
    size: 12,
    color: "var(--fg-faint)"
  }))), metaOpen ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      padding: "9px 11px",
      borderRadius: "var(--radius-md)",
      background: "var(--bg-sunken)",
      border: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MetaLine, {
    state: "fallback",
    text: "content \uBE48\uAC12 \u2192 reasoning_content \uD3F4\uBC31"
  }), /*#__PURE__*/React.createElement(MetaLine, {
    state: "pass",
    text: "<think> \uC815\uC81C\uB428"
  }), /*#__PURE__*/React.createElement(MetaLine, {
    state: "warn",
    text: "finish_reason=length \uC7AC\uC2DC\uB3C4 1\uD68C (\uC798\uB9BC 12,972\uC790)"
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.7,
      color: "var(--fg-default)"
    }
  }, "\uC5F0\uCC28 \uD734\uAC00\uB294 \uC2E0\uCCAD\uC11C \uC791\uC131 \uD6C4 \uD300\uC7A5 \uC2B9\uC778\uC744 \uAC70\uCCD0 \uC2E0\uCCAD\uD569\uB2C8\uB2E4", /*#__PURE__*/React.createElement(Footnote, {
    n: "1",
    id: "hr-0412",
    hl: hl,
    onHover: setHl
  }), ". \uC2E0\uCCAD\uC740 \uC0AC\uC6A9 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600
    }
  }, "7\uC77C \uC804"), "\uAE4C\uC9C0 \uC81C\uCD9C\uD569\uB2C8\uB2E4", /*#__PURE__*/React.createElement(Footnote, {
    n: "2",
    id: "hr-0712",
    hl: hl,
    onHover: setHl
  }), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 12,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--fg-faint)",
      marginBottom: 8
    }
  }, "\uCD9C\uCC98"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(SourceLine, {
    n: "1",
    id: "hr-0412",
    doc: "\uD734\uAC00\uADDC\uC815.pdf",
    loc: "p.4",
    hl: hl,
    onHover: setHl
  }), /*#__PURE__*/React.createElement(SourceLine, {
    n: "2",
    id: "hr-0712",
    doc: "\uD734\uAC00\uADDC\uC815.pdf",
    loc: "p.7",
    hl: hl,
    onHover: setHl
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 26px 18px",
      borderTop: "1px solid var(--border-default)",
      background: "var(--bg-canvas)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginBottom: 9
    }
  }, ["연차 휴가 신청 절차", "출장경비 정산"].map(ex => /*#__PURE__*/React.createElement("button", {
    key: ex,
    type: "button",
    onClick: () => setQ(ex),
    style: {
      padding: "4px 10px",
      borderRadius: "var(--radius-full)",
      background: "var(--surface-1)",
      border: "1px solid var(--border-default)",
      color: "var(--fg-muted)",
      fontSize: 12,
      cursor: "pointer"
    }
  }, ex))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 10,
      padding: 10,
      background: "var(--bg-sunken)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    rows: 1,
    style: {
      flex: 1,
      resize: "none",
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--fg-default)",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      lineHeight: 1.5,
      padding: "4px 2px"
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 14
    })
  }, "\uC804\uC1A1"))))), /*#__PURE__*/React.createElement("aside", {
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-canvas)",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 15px",
      borderBottom: "1px solid var(--border-subtle)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 15,
    color: "var(--fg-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--fg-default)"
    }
  }, "\uADFC\uAC70 \uCCAD\uD06C Top-k"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-faint)",
      marginLeft: "auto"
    }
  }, "k=5 \xB7 ", mode === "bm25" ? "BM25" : mode === "vector" ? "벡터" : "RRF", " \uC815\uB82C")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 13,
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, TOPK.map(c => /*#__PURE__*/React.createElement(ChunkCard, {
    key: c.id,
    c: c,
    mode: mode,
    hl: hl,
    onHover: setHl
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "2px 2px 4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderTop: "1px dashed var(--amber)",
      opacity: 0.7
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      color: "var(--amber)"
    }
  }, "cutoff \u2014"))))), /*#__PURE__*/React.createElement("style", null, "@media (max-width: 1024px){.qa-grid{grid-template-columns:1fr !important;grid-auto-rows:min-content}}"));
}
function MetaLine({
  state,
  text
}) {
  const c = state === "pass" ? "var(--green)" : state === "warn" ? "var(--amber)" : "var(--amber)";
  const icon = state === "pass" ? "check" : "alert-triangle";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 12,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      color: "var(--fg-muted)"
    }
  }, text));
}
function SourceLine({
  n,
  id,
  doc,
  loc,
  hl,
  onHover
}) {
  const active = hl === id;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => onHover(id),
    onMouseLeave: () => onHover(null),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 8px",
      borderRadius: "var(--radius-sm)",
      background: active ? "var(--teal-tint)" : "transparent",
      cursor: "default"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--teal)"
    }
  }, "[", n, "]"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--fg-default)"
    }
  }, doc), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--fg-muted)"
    }
  }, "\xB7 ", loc, " \xB7 ", id));
}
Object.assign(window, {
  QueryScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs-em/QueryScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.Kbd = __ds_scope.Kbd;

__ds_ns.Metric = __ds_scope.Metric;

__ds_ns.ScoreBar = __ds_scope.ScoreBar;

__ds_ns.ScoreChip = __ds_scope.ScoreChip;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ConnectionBadge = __ds_scope.ConnectionBadge;

__ds_ns.ExternalCallsCounter = __ds_scope.ExternalCallsCounter;

__ds_ns.GateChip = __ds_scope.GateChip;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Segmented = __ds_scope.Segmented;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
