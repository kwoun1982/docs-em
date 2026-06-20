/* docs-em — D. 로컬 LLM·서버 모니터링 (mock)
   좌레일 6섹션 상세 모니터링: 개요 · 추론성능 · 안정성 · 모델/VRAM · 임베딩/검색 · 서버자원.
   각 섹션에 시계열 스파크라인(SVG) + 수치. "실제 개발(측정) 가능한 항목"만.
   측정 수치는 전부 (데모) 배지. 사실값(768·norm1·ctx 8192/65536·localhost:1234·모델명)만 진짜.
   DS 토큰·컴포넌트만. 외부 호출 0건(INV-3). */
const { Icon, Card, Metric, ScoreBar, ProgressBar, StatusPill, Tag, DataTable } = window.DocsEmDesignSystem_afe3d1;
import { MockSocket } from "../mock/socket.js";  // (mock) — 실 배선 시 new WebSocket(url) 로 교체

const SECTIONS = [
  { id: "overview",  label: "개요",        icon: "gauge" },
  { id: "inference", label: "추론 성능",   icon: "activity" },
  { id: "stability", label: "안정성",      icon: "alert-triangle" },
  { id: "models",    label: "모델·VRAM",   icon: "cpu" },
  { id: "embed",     label: "임베딩·검색", icon: "layers" },
  { id: "server",    label: "서버 자원",   icon: "database" },
];

// (데모) 배지.
function Demo() { return <Tag tone="amber" style={{ marginLeft: 8 }}>(데모)</Tag>; }

// 값이 바뀔 때마다 이전→새 값으로 rAF 보간해 흐르게 만드는 훅(count-up 롤링).
// decimals 만큼 소수 자릿수 유지. 보간 중에는 매 프레임 리렌더되어 숫자가 계속 움직인다.
function useCountUp(target, decimals = 0, ms = 650) {
  const [disp, setDisp] = React.useState(target);
  const fromRef = React.useRef(target);
  const startRef = React.useRef(0);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / ms);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = from + (to - from) * eased;
      setDisp(v);
      if (t < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { fromRef.current = to; setDisp(to); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, ms]);

  const p = Math.pow(10, decimals);
  return Math.round(disp * p) / p;
}

// 롤링 숫자 — 숫자/소수만 카운트업. 비수치(예: "1.0 (norm1)")는 그대로 출력.
function RollingNumber({ value, decimals, style }) {
  const num = typeof value === "number" ? value : parseFloat(value);
  const isNum = typeof value === "number" || (!Number.isNaN(num) && /^[\d.]+$/.test(String(value).trim()));
  const dec = decimals != null ? decimals : (isNum && !Number.isInteger(num) ? 1 : 0);
  const rolled = useCountUp(isNum ? num : 0, dec);
  if (!isNum) return <span style={style}>{value}</span>;
  return <span style={style}>{dec > 0 ? rolled.toFixed(dec) : Math.round(rolled)}</span>;
}

// 큰 수치 셀 — 라벨·값·단위·(데모/사실). 값이 바뀌면 짧게 펄스(동적 효과).
function Stat({ label, value, unit, real, tone }) {
  const prev = React.useRef(value);
  const [bump, setBump] = React.useState(false);
  React.useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setBump(true);
      const t = setTimeout(() => setBump(false), 360);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", borderRadius: "var(--radius-md)",
      background: "var(--surface-1)", border: `1px solid ${bump ? "var(--teal-border)" : "var(--border-default)"}`,
      boxShadow: bump ? "0 0 0 2px var(--teal-tint)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--fg-faint)" }}>{label}</span>
        {real ? <Tag tone="teal" style={{ marginLeft: "auto" }}>사실</Tag> : <Tag tone="amber" style={{ marginLeft: "auto" }}>데모</Tag>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <RollingNumber value={value} style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: tone || "var(--fg-default)", fontVariantNumeric: "tabular-nums" }} />
        {unit ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>{unit}</span> : null}
      </div>
    </div>
  );
}

// 자원 게이지 — % 숫자와 막대가 매 프레임 보간되어 흐른다.
function Gauge({ label, pct, sub, warn }) {
  const amber = warn != null ? pct >= warn : false;
  const rolled = useCountUp(pct, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: amber ? "var(--amber)" : "var(--fg-default)", fontVariantNumeric: "tabular-nums" }}>{rolled}%</span>
      </div>
      <ProgressBar value={rolled} tone={amber ? "warn" : "signal"} height={6} />
      {sub ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-faint)" }}>{sub}</span> : null}
    </div>
  );
}

function FinishRow({ label, pct, tone }) {
  const rolled = useCountUp(pct, 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 56, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-muted)" }}>{label}</span>
      <div style={{ flex: 1, height: 7, background: "var(--bg-sunken)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <div style={{ width: `${rolled}%`, height: "100%", background: tone, borderRadius: "var(--radius-full)", transition: "width 0.12s linear" }} />
      </div>
      <span style={{ width: 36, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-muted)", fontVariantNumeric: "tabular-nums" }}>{rolled}%</span>
    </div>
  );
}

// 시계열 스파크라인(SVG). DS 토큰 색만 사용. 전부 (데모).
function Sparkline({ data = [], stroke = "var(--teal)", fill = "var(--teal-tint)", height = 48, unit, label }) {
  const W = 100, H = height;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - 6 - ((v - min) / span) * (H - 12);
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const last = data[data.length - 1];
  const [lx, ly] = pts[pts.length - 1] || [W, H];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--surface-1)", border: "1px solid var(--border-default)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--fg-faint)" }}>{label}</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "baseline", gap: 2 }}>
          <RollingNumber value={last} style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: stroke, fontVariantNumeric: "tabular-nums" }} />
          {unit ? <span style={{ fontSize: 10, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{unit}</span> : null}
        </span>
        <Tag tone="amber">데모</Tag>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H }}>
        <path d={area} fill={fill} stroke="none" opacity="0.6" style={{ transition: "d var(--dur-slow) var(--ease-out)" }} />
        <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "d var(--dur-slow) var(--ease-out)" }} />
        {/* 라이브 끝점 펄스 */}
        <circle cx={lx} cy={ly} r="2.4" fill={stroke} vectorEffect="non-scaling-stroke">
          <animate attributeName="opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-faint)" }}>최근 {data.length}틱 · 2s 간격</span>
    </div>
  );
}

// 소켓 연결 상태 배지 (mock).
function ConnState({ conn }) {
  if (conn === "open") return <StatusPill tone="ok" size="sm" pulse>연결됨</StatusPill>;
  if (conn === "reconnecting") return <StatusPill tone="warn" size="sm" pulse>재연결 중…</StatusPill>;
  return <StatusPill tone="neutral" size="sm" pulse>연결 중…</StatusPill>;
}

function SectionTitle({ icon, children, note }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Icon name={icon} size={17} color="var(--teal)" />
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--fg-default)" }}>{children}</h2>
      {note ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>{note}</span> : null}
    </div>
  );
}

function MonitorScreen() {
  const [sec, setSec] = React.useState("overview");
  const [data, setData] = React.useState(null);
  const [ticks, setTicks] = React.useState(0);     // 수신 메시지 수(라이브 표시용)
  const [conn, setConn] = React.useState("connecting");  // connecting | open | reconnecting

  // (mock) 소켓 구독 — 서버 push 를 수신. 실 배선 시 MockSocket → WebSocket 한 줄 교체.
  React.useEffect(() => {
    const ws = new MockSocket("ws://localhost:1234/monitor");
    let everOpen = false;

    ws.onopen = () => { everOpen = true; setConn("open"); };
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "monitor") { setData(msg.payload); setTicks((n) => n + 1); }
    };
    // 끊김 — 사용자가 닫은 게 아니면 소켓이 자동 재연결하므로 reconnecting 표시.
    ws.onclose = (ev) => { if (!ev.wasClean) setConn(everOpen ? "reconnecting" : "connecting"); };
    ws.onerror = () => setConn("reconnecting");

    return () => ws.close();
  }, []);

  const loading = data == null;

  return (
    <div style={{ display: "flex", width: "100%", minWidth: 0 }}>
      {/* 좌레일 — 6섹션 + 상태 */}
      <window.SideRail width={208}>
        <window.RailSection label="모니터링 섹션">
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {SECTIONS.map((s) => {
              const on = s.id === sec;
              return (
                <button key={s.id} type="button" onClick={() => setSec(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left", padding: "8px 9px", borderRadius: "var(--radius-md)", border: "1px solid", borderColor: on ? "var(--border-default)" : "transparent",
                    background: on ? "var(--surface-2)" : "transparent", color: on ? "var(--fg-default)" : "var(--fg-muted)",
                    fontSize: 13, fontWeight: on ? 600 : 500, cursor: "pointer" }}>
                  <Icon name={s.icon} size={14} color={on ? "var(--teal)" : "var(--fg-faint)"} />{s.label}
                </button>
              );
            })}
          </div>
        </window.RailSection>
        <window.RailSection label="실시간 소켓">
          <div style={{ padding: 10, borderRadius: "var(--radius-md)", background: "var(--surface-1)", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="lock" size={12} color="var(--fg-faint)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-muted)" }}>ws://localhost:1234/monitor</span>
            </div>
            <ConnState conn={conn} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: conn === "open" ? "var(--teal)" : "var(--fg-faint)", animation: conn === "open" ? "mon-pulse 1.6s var(--ease-standard) infinite" : "none" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-faint)" }}>{conn === "open" ? `수신 ${ticks} · push 2s` : "스트림 대기"}</span>
            </div>
          </div>
        </window.RailSection>
      </window.SideRail>

      {/* 메인 — 섹션 내용 */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "20px 24px" }}>
        {loading ? (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-muted)" }}>
            <Icon name="loader-circle" size={16} color="var(--teal)" />
            <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 12 }}>{conn === "reconnecting" ? "소켓 재연결 중…" : "소켓 연결 · 스트림 대기 중…"}</span>
          </div>
        ) : (
          <div style={{ maxWidth: 1000, display: "flex", flexDirection: "column", gap: 16,
            opacity: conn === "open" ? 1 : 0.6, transition: "opacity var(--dur-fast) var(--ease-standard)" }}>
            {conn === "reconnecting" ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, alignSelf: "flex-start", padding: "5px 10px", borderRadius: "var(--radius-full)", background: "var(--amber-tint)", border: "1px solid var(--amber-border)" }}>
                <Icon name="alert-triangle" size={12} color="var(--amber)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber)" }}>스트림 끊김 — 재연결 중 (마지막 스냅샷 표시)</span>
              </div>
            ) : null}
            <SectionContent sec={sec} data={data} />
          </div>
        )}
      </div>

      <style>{"@keyframes mon-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(0.7)}}@media (max-width:900px){.m-grid{grid-template-columns:1fr !important}}"}</style>
    </div>
  );
}

function SectionContent({ sec, data }) {
  const { llm, stability, models, emb, server, series } = data;

  if (sec === "overview") {
    return (
      <React.Fragment>
        <SectionTitle icon="gauge" note="localhost:1234 · 5s 폴링">개요</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <Stat label="처리량" value={llm.tokens_per_sec} unit="tok/s" tone="var(--teal)" />
          <Stat label="지연 p95" value={llm.latency_p95_ms} unit="ms" tone="var(--amber)" />
          <Stat label="content 빈값" value={stability.content_empty_rate} unit="%" />
          <Stat label="GPU" value={server.gpu_pct} unit="%" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="m-grid">
          <Sparkline label="처리량 추이" data={series.tokens_per_sec} unit="tok/s" stroke="var(--teal)" fill="var(--teal-tint)" />
          <Sparkline label="GPU 사용률 추이" data={series.gpu_pct} unit="%" stroke="var(--amber)" fill="var(--amber-tint)" />
        </div>
        <Card header="요약">
          <div style={{ fontSize: 12.5, lineHeight: 1.8, color: "var(--fg-muted)" }}>
            로드 모델 <strong style={{ color: "var(--fg-default)" }}>{llm.model}</strong> (ctx {llm.ctx}) · 임베딩 768d·norm1 · 좌측 섹션에서 항목별 상세 추이를 확인하세요. 모든 측정 수치는 <Tag tone="amber">(데모)</Tag>이며, 실 배선 시 LMStudio /v1 메타 + 시스템 메트릭으로 교체됩니다.
          </div>
        </Card>
      </React.Fragment>
    );
  }

  if (sec === "inference") {
    return (
      <React.Fragment>
        <SectionTitle icon="activity" note={`${llm.model} · ctx ${llm.ctx}`}>추론 성능 <Demo /></SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <Stat label="처리량" value={llm.tokens_per_sec} unit="tok/s" tone="var(--teal)" />
          <Stat label="TTFT" value={llm.ttft_ms} unit="ms" />
          <Stat label="지연 p50" value={llm.latency_p50_ms} unit="ms" />
          <Stat label="지연 p95" value={llm.latency_p95_ms} unit="ms" tone="var(--amber)" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="m-grid">
          <Sparkline label="처리량 (tok/s)" data={series.tokens_per_sec} unit="tok/s" stroke="var(--teal)" fill="var(--teal-tint)" />
          <Sparkline label="TTFT (ms)" data={series.ttft_ms} unit="ms" stroke="var(--fg-muted)" fill="var(--surface-2)" />
        </div>
        <Sparkline label="지연 p95 (ms)" data={series.latency_p95_ms} unit="ms" stroke="var(--amber)" fill="var(--amber-tint)" height={56} />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="alert-triangle" size={13} color="var(--amber)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--amber)" }}>prompt_tokens=0 (unreliable)</span>
            <span style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>— LMStudio usage 미신뢰, 생성 토큰 평균 {llm.gen_tokens_avg}</span>
          </div>
        </Card>
      </React.Fragment>
    );
  }

  if (sec === "stability") {
    return (
      <React.Fragment>
        <SectionTitle icon="alert-triangle">안정성·품질 신호 <Demo /></SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <Gauge label="content 빈값 발생률" pct={stability.content_empty_rate} warn={25} sub="reasoning_content 폴백 유발" />
            <Gauge label="length 재시도율" pct={stability.length_retry_rate} warn={25} sub="finish_reason=length" />
            <Gauge label="reasoning 폴백률" pct={stability.reasoning_fallback_rate} warn={25} sub="qwen/gemma reasoning 빈값" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--fg-faint)" }}>finish_reason 분포</span>
            <FinishRow label="stop" pct={stability.finish.stop} tone="var(--green)" />
            <FinishRow label="length" pct={stability.finish.length} tone="var(--amber)" />
            <FinishRow label="empty" pct={stability.finish.empty} tone="var(--red)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-faint)", marginTop: 4 }}>임계 ≥25% 부터 앰버 · 값은 데모</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="m-grid">
          <Sparkline label="content 빈값률 추이" data={series.content_empty} unit="%" stroke="var(--red)" fill="var(--red-tint)" />
          <Sparkline label="length 재시도율 추이" data={series.length_retry} unit="%" stroke="var(--amber)" fill="var(--amber-tint)" />
        </div>
      </React.Fragment>
    );
  }

  if (sec === "models") {
    return (
      <React.Fragment>
        <SectionTitle icon="cpu">로드된 모델·VRAM <Demo /></SectionTitle>
        <Card padding={false}>
          <DataTable
            columns={[
              { key: "name", label: "모델", mono: true, render: (v, r) => (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name={r.role === "EMB" ? "layers" : "cpu"} size={14} color="var(--fg-faint)" />{v}
                </span>
              ) },
              { key: "role", label: "역할", width: 70, render: (v) => <Tag tone={v === "EMB" ? "blue" : "teal"}>{v}</Tag> },
              { key: "ctx", label: "ctx", align: "right", mono: true, width: 80 },
              { key: "vram", label: "VRAM", align: "right", mono: true, width: 80 },
              { key: "state", label: "상태", width: 110, render: (v) => (
                v === "loaded" ? <StatusPill tone="ok" size="sm">로드됨</StatusPill> : <StatusPill tone="neutral" size="sm">언로드</StatusPill>
              ) },
            ]}
            rows={models}
          />
        </Card>
        <Sparkline label="GEN 모델 VRAM 점유 (GB)" data={series.vram_gpu} unit="GB" stroke="var(--teal)" fill="var(--teal-tint)" height={56} />
      </React.Fragment>
    );
  }

  if (sec === "embed") {
    return (
      <React.Fragment>
        <SectionTitle icon="layers">임베딩·검색 <Demo /></SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <Stat label="차원" value={emb.dim} unit="d" real />
          <Stat label="정규화" value={emb.norm} real />
          <Stat label="임베딩 처리량" value={emb.docs_per_sec} unit="doc/s" />
          <Stat label="검색 p50" value={emb.search_p50_ms} unit="ms" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="m-grid">
          <Sparkline label="임베딩 처리량 추이" data={series.docs_per_sec} unit="doc/s" stroke="var(--teal)" fill="var(--teal-tint)" />
          <Sparkline label="검색 p50 추이" data={series.search_p50_ms} unit="ms" stroke="var(--fg-muted)" fill="var(--surface-2)" />
        </div>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Stat label="색인 벡터 수" value={emb.vectors} unit="vec" />
            <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>768차원 · L2 norm=1.0 (재정규화 금지) — <Tag tone="teal">사실</Tag></span>
          </div>
        </Card>
      </React.Fragment>
    );
  }

  // server
  return (
    <React.Fragment>
      <SectionTitle icon="database" note={`uptime ${server.uptime}`}>서버 자원 <Demo /></SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <Stat label="CPU" value={server.cpu_pct} unit="%" />
        <Stat label="GPU" value={server.gpu_pct} unit="%" />
        <Stat label="CPU 온도" value={server.temp_cpu} unit="°C" />
        <Stat label="GPU 온도" value={server.temp_gpu} unit="°C" />
      </div>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <Gauge label="CPU" pct={server.cpu_pct} warn={85} sub={`온도 ${server.temp_cpu}°C`} />
          <Gauge label="GPU" pct={server.gpu_pct} warn={85} sub={`온도 ${server.temp_gpu}°C`} />
          <Gauge label={`메모리 · ${server.mem_used}/${server.mem_total} GB`} pct={server.mem_pct} warn={85} />
          <Gauge label={`SSD · ${server.ssd_used}/${server.ssd_total} GB`} pct={server.ssd_pct} warn={90} />
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="m-grid">
        <Sparkline label="CPU 사용률 추이" data={series.cpu_pct} unit="%" stroke="var(--teal)" fill="var(--teal-tint)" />
        <Sparkline label="메모리 사용률 추이" data={series.mem_pct} unit="%" stroke="var(--fg-muted)" fill="var(--surface-2)" />
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { MonitorScreen });
