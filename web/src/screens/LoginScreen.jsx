/* docs-em — 로그인 (ID/PW) · (mock)
   화면만. 로그인 버튼 → 자격 검증 없이 바로 onSuccess() (첫 화면 진입).
   기능(실 인증)은 후속 페이즈에서 mockLogin → api/client.js 로 교체.
   DS 토큰·컴포넌트만 사용. 외부 호출 0건(INV-3). */
const { Icon, Button, Input, Tag, Tooltip } = window.DocsEmDesignSystem_afe3d1;
import { mockLogin } from "../mock/index.js";  // (mock) — 실 배선 시 api/client.js 로 교체

function Logo({ size = 30 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, borderRadius: 8, background: "var(--surface-1)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="terminal" size={size * 0.58} color="var(--teal)" strokeWidth={2} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 19, fontWeight: 600, color: "var(--fg-default)", letterSpacing: "-0.02em" }}>docs</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 19, fontWeight: 600, color: "var(--teal)", letterSpacing: "-0.02em" }}>·em</span>
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess, theme, onToggleTheme }) {
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  // 화면만 — 자격 검증 없이 바로 진입. 가짜 지연만 거친다.
  const submit = (e) => {
    if (e) e.preventDefault();
    if (busy) return;
    setBusy(true);
    mockLogin({ id, pw }).then(() => onSuccess && onSuccess());
  };

  return (
    <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-app)", color: "var(--text-primary)" }}>
      {onToggleTheme ? (
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <window.ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      ) : null}
      <form onSubmit={submit} style={{ width: 360, display: "flex", flexDirection: "column", gap: 18, padding: "28px 26px", borderRadius: "var(--radius-lg)", background: "var(--bg-canvas)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-overlay)" }}>
        {/* 헤더 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingBottom: 4 }}>
          <Logo />
          <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>운영 콘솔 로그인</span>
        </div>

        {/* 입력 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--fg-faint)" }}>아이디</span>
            <Input value={id} onChange={setId} placeholder="아이디" icon="hash" />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--fg-faint)" }}>비밀번호</span>
            <Input value={pw} onChange={setPw} placeholder="비밀번호" icon="lock" type="password" />
          </label>
        </div>

        {/* 로그인 버튼 */}
        <Button variant="primary" type="submit" onClick={submit} disabled={busy} iconRight={<Icon name="arrow-up-right" size={14} />}>
          {busy ? "로그인 중…" : "로그인"}
        </Button>

        {/* 데모 계정 힌트 (mock) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 2 }}>
          <Tag tone="amber">(mock)</Tag>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>데모: admin / docs-em · 입력 없이 바로 진입</span>
        </div>

        {/* 폐쇄망 신뢰 시그널 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, paddingTop: 6, borderTop: "1px solid var(--border-subtle)" }}>
          <Icon name="shield-check" size={12} color="var(--teal)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.02em", color: "var(--teal)" }}>100% LOCAL · localhost:1234</span>
        </div>
      </form>
    </div>
  );
}

Object.assign(window, { LoginScreen });
