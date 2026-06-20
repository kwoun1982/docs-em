/* docs-em app shell — common fixed header (trust signals) + per-screen body.
   Composes DS primitives via the compiled bundle. */
const { Icon, IconButton, ConnectionBadge, ExternalCallsCounter, Tag, Tooltip } = window.DocsEmDesignSystem_afe3d1;

function Logo({ size = 24 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: size, height: size, borderRadius: 6, background: "var(--surface-1)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="terminal" size={size * 0.58} color="var(--teal)" strokeWidth={2} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--fg-default)", letterSpacing: "-0.02em" }}>docs</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--teal)", letterSpacing: "-0.02em" }}>·em</span>
      </div>
    </div>
  );
}

const SCREENS = [
  { id: "query", label: "검색", icon: "search" },
  { id: "index", label: "인덱싱", icon: "database" },
  { id: "eval", label: "평가", icon: "gauge" },
  { id: "monitor", label: "모니터", icon: "activity" },
];

function ScreenNav({ active, onNavigate }) {
  return (
    <div style={{ display: "flex", gap: 2, padding: 3, background: "var(--surface-1)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
      {SCREENS.map((s) => {
        const on = s.id === active;
        return (
          <button key={s.id} type="button" onClick={() => onNavigate(s.id)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: "var(--radius-sm)", border: "none",
              background: on ? "var(--surface-2)" : "transparent", color: on ? "var(--fg-default)" : "var(--fg-muted)",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: on ? 600 : 500, cursor: "pointer" }}>
            <Icon name={s.icon} size={15} color={on ? "var(--teal)" : "var(--fg-faint)"} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

/** The closed-network trust cluster — fixed on every screen, never hidden. */
function TrustCluster() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Tag tone="amber">(mock)</Tag>
      <ConnectionBadge status="ok" endpoint="localhost:1234" />
      <ExternalCallsCounter count={0} />
      <Tooltip label="모든 추론·임베딩·생성이 로컬에서 실행됩니다">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px", borderRadius: "var(--radius-md)", background: "var(--teal-tint)", border: "1px solid var(--teal-border)" }}>
          <Icon name="shield-check" size={13} color="var(--teal)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.02em", color: "var(--teal)" }}>100% LOCAL</span>
        </span>
      </Tooltip>
    </div>
  );
}

/* 다크/라이트 토글 — DS에 sun/moon 아이콘이 없어 상태를 글자로 명시한다. */
function ThemeToggle({ theme, onToggle }) {
  if (!onToggle) return null;
  const light = theme === "light";
  return (
    <Tooltip label={light ? "다크 모드로" : "라이트 모드로"}>
      <button type="button" onClick={onToggle}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px", borderRadius: "var(--radius-md)",
          background: "var(--surface-1)", border: "1px solid var(--border-default)", color: "var(--fg-muted)", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600 }}>
        <Icon name={light ? "circle" : "shield-check"} size={13} color="var(--teal)" />
        {light ? "LIGHT" : "DARK"}
      </button>
    </Tooltip>
  );
}

function AppShell({ active, onNavigate, onLogout, theme, onToggleTheme, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--surface-app)", color: "var(--text-primary)" }}>
      <header style={{ height: "var(--topbar-height)", flexShrink: 0, display: "flex", alignItems: "center", gap: 16, padding: "0 16px", borderBottom: "1px solid var(--border-default)", background: "var(--bg-canvas)" }}>
        <Logo />
        <div style={{ width: 1, height: 22, background: "var(--border-subtle)" }} />
        <ScreenNav active={active} onNavigate={onNavigate} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <TrustCluster />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {onLogout ? (
            <Tooltip label="로그아웃">
              <IconButton icon="external-link" size="sm" variant="ghost" onClick={onLogout} title="로그아웃" />
            </Tooltip>
          ) : null}
        </div>
      </header>
      <main style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex" }}>
        {children}
      </main>
    </div>
  );
}

/* Reusable left rail shell for screens B and C. */
function SideRail({ children, width = 220 }) {
  return (
    <aside style={{ width, flexShrink: 0, borderRight: "1px solid var(--border-default)", background: "var(--bg-sunken)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {children}
    </aside>
  );
}

function RailSection({ label, children }) {
  return (
    <div style={{ padding: "12px 12px 0" }}>
      {label ? <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-faint)", padding: "4px 8px 8px" }}>{label}</div> : null}
      {children}
    </div>
  );
}

Object.assign(window, { AppShell, Logo, SideRail, RailSection, ThemeToggle });
