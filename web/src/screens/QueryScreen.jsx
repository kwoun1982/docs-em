/* docs-em — A. 질의응답 + 출처 인용 (핵심 화면)
   Demo data per spec ④: query "연차 휴가 신청 절차", docs 휴가규정/출장경비 only,
   Top-k k=5, 정답(휴가규정 hr-0412) 첫 히트 3위, 격차 -0.018, 인용 ⊆ Top-k. */
const { Icon, IconButton, Button, Segmented, Select, ScoreChip, StatusPill, GateChip, Tag } = window.DocsEmDesignSystem_afe3d1;
import { mockSearch } from "../mock/index.js";  // (mock) — 실 배선 시 api/client.js 로 교체

const LABELS = {
  answer: { t: "▲정답", c: "var(--green)" },
  wrong:  { t: "✕오답", c: "var(--red)" },
  none:   { t: "—", c: "var(--fg-faint)" },
};

function ChunkCard({ c, mode, hl, onHover }) {
  const lab = LABELS[c.label];
  const active = hl === c.id;
  const barColor = c.cited ? "var(--teal)" : c.label === "wrong" ? "var(--red)" : "var(--border-strong)";
  return (
    <div
      onMouseEnter={() => onHover(c.id)} onMouseLeave={() => onHover(null)}
      style={{
        position: "relative", padding: "11px 12px 11px 15px", borderRadius: "var(--radius-md)",
        background: "var(--surface-1)",
        border: `1px solid ${active || c.cited ? "var(--teal-border)" : "var(--border-default)"}`,
        boxShadow: active ? "0 0 0 2px var(--teal-tint)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)",
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 4, borderRadius: 4, background: barColor }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>#{c.rank}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg-default)" }}>{c.doc}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)" }}>· {c.loc}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: lab.c }}>{lab.t}</span>
      </div>
      <p style={{ margin: "0 0 9px", fontSize: 12.5, lineHeight: 1.5, color: "var(--fg-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.snippet}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>{c.id}</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}>
          {c.gap !== undefined ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--red)" }}>격차 {c.gap} ▼</span> : null}
          <ScoreChip kind={mode === "bm25" ? "bm25" : "sim"} value={c.sim} gap={c.gap} size="sm" />
        </span>
      </div>
    </div>
  );
}

function Footnote({ n, id, hl, onHover }) {
  const active = hl === id;
  return (
    <sup
      onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 15, height: 15, padding: "0 3px", margin: "0 1px", borderRadius: 3,
        background: active ? "var(--teal-tint-2)" : "var(--teal-tint)", border: "1px solid var(--teal-border)", color: "var(--teal)",
        fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 600, verticalAlign: "top", cursor: "pointer" }}>{n}</sup>
  );
}

function QueryScreen() {
  const [mode, setMode] = React.useState("hybrid");
  const [q, setQ] = React.useState("연차 휴가 신청 절차");
  const [hl, setHl] = React.useState(null);
  const [metaOpen, setMetaOpen] = React.useState(false);
  // (mock) 검색 상태: 가짜 지연·로딩·Top-k 결과. 초기 1회 자동 검색으로 데모 화면을 채운다.
  const [topk, setTopk] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const runSearch = React.useCallback((nextMode) => {
    setLoading(true);
    mockSearch({ query: q, mode: nextMode != null ? nextMode : mode }).then((rows) => {
      setTopk(rows);
      setLoading(false);
    });
  }, [q, mode]);

  React.useEffect(() => { runSearch(mode); /* 모드 전환 시 mockSearch 재호출 */ }, [mode]);

  const onSend = () => runSearch(mode);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      {/* Screen-A model + mode sub-bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 20px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-canvas)", flexShrink: 0 }}>
        <Segmented value={mode} onChange={setMode} size="sm" options={[
          { value: "vector", label: "벡터" }, { value: "bm25", label: "BM25" }, { value: "hybrid", label: "하이브리드 RRF" },
        ]} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "var(--fg-faint)" }}>GEN</span>
            <div style={{ width: 210 }}><Select size="sm" options={[
              { value: "gemma", label: "gemma-4-e4b · ctx 65536" },
              { value: "qwen-35", label: "qwen3.6-35b-a3b · ctx 8192" },
              { value: "qwen-9", label: "qwen3.5-9b · ctx 8192" },
            ]} /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: "var(--fg-faint)" }}>EMB</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-muted)" }}>text-embedding-nomic… · 768d</span>
          </div>
        </div>
      </div>

      {/* Body: 62 / 38 */}
      <div className="qa-grid" style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "62fr 38fr" }}>
        {/* MAIN */}
        <section style={{ display: "flex", flexDirection: "column", minWidth: 0, borderRight: "1px solid var(--border-default)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>
            <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Question */}
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", background: "var(--surface-2)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: "var(--fg-muted)" }}>나</div>
                <div style={{ paddingTop: 3, fontSize: 15, fontWeight: 600, color: "var(--fg-default)" }}>연차 휴가 신청 절차</div>
              </div>
              {/* Answer */}
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", background: "var(--teal-tint)", border: "1px solid var(--teal-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="terminal" size={14} color="var(--teal)" strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Tag icon="cpu">gemma-4-e4b</Tag>
                    <button type="button" onClick={() => setMetaOpen((v) => !v)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 20, padding: "0 8px", borderRadius: "var(--radius-full)", background: "var(--surface-2)", border: "1px solid var(--border-default)", color: "var(--fg-muted)", fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer" }}>
                      재시도 1 <Icon name={metaOpen ? "chevron-down" : "chevron-right"} size={12} color="var(--fg-faint)" />
                    </button>
                  </div>
                  {metaOpen ? (
                    <div style={{ marginBottom: 12, padding: "9px 11px", borderRadius: "var(--radius-md)", background: "var(--bg-sunken)", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 6 }}>
                      <MetaLine state="fallback" text="content 빈값 → reasoning_content 폴백" />
                      <MetaLine state="pass" text="<think> 정제됨" />
                      <MetaLine state="warn" text="finish_reason=length 재시도 1회 (잘림 12,972자)" />
                    </div>
                  ) : null}
                  <div style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--fg-default)" }}>
                    연차 휴가는 신청서 작성 후 팀장 승인을 거쳐 신청합니다<Footnote n="1" id="hr-0412" hl={hl} onHover={setHl} />. 신청은 사용 <strong style={{ fontWeight: 600 }}>7일 전</strong>까지 제출합니다<Footnote n="2" id="hr-0712" hl={hl} onHover={setHl} />.
                  </div>
                  {/* Sources */}
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-faint)", marginBottom: 8 }}>출처</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <SourceLine n="1" id="hr-0412" doc="휴가규정.pdf" loc="p.4" hl={hl} onHover={setHl} />
                      <SourceLine n="2" id="hr-0712" doc="휴가규정.pdf" loc="p.7" hl={hl} onHover={setHl} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Composer */}
          <div style={{ padding: "12px 26px 18px", borderTop: "1px solid var(--border-default)", background: "var(--bg-canvas)", flexShrink: 0 }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <div style={{ display: "flex", gap: 7, marginBottom: 9 }}>
                {["연차 휴가 신청 절차", "출장경비 정산"].map((ex) => (
                  <button key={ex} type="button" onClick={() => setQ(ex)}
                    style={{ padding: "4px 10px", borderRadius: "var(--radius-full)", background: "var(--surface-1)", border: "1px solid var(--border-default)", color: "var(--fg-muted)", fontSize: 12, cursor: "pointer" }}>{ex}</button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, padding: 10, background: "var(--bg-sunken)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-lg)" }}>
                <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={1}
                  style={{ flex: 1, resize: "none", background: "transparent", border: "none", outline: "none", color: "var(--fg-default)", fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5, padding: "4px 2px" }} />
                <Button variant="primary" iconRight={<Icon name="send" size={14} />} onClick={onSend}>전송</Button>
              </div>
            </div>
          </div>
        </section>

        {/* PANEL: Top-k */}
        <aside style={{ display: "flex", flexDirection: "column", background: "var(--bg-canvas)", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 15px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
            <Icon name="layers" size={15} color="var(--fg-muted)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-default)" }}>근거 청크 Top-k</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)", marginLeft: "auto" }}>{loading ? "검색 중…" : "k=5"} · {mode === "bm25" ? "BM25" : mode === "vector" ? "벡터" : "RRF"} 정렬</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 13, display: "flex", flexDirection: "column", gap: 9 }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "40px 0", color: "var(--fg-muted)" }}>
                <Icon name="loader-circle" size={16} color="var(--teal)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>로딩…</span>
              </div>
            ) : (
              <React.Fragment>
                {topk.map((c) => <ChunkCard key={c.id} c={c} mode={mode} hl={hl} onHover={setHl} />)}
                {/* cutoff line */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 2px 4px" }}>
                  <div style={{ flex: 1, borderTop: "1px dashed var(--amber)", opacity: 0.7 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--amber)" }}>cutoff —</span>
                </div>
              </React.Fragment>
            )}
          </div>
        </aside>
      </div>

      <style>{"@media (max-width: 1024px){.qa-grid{grid-template-columns:1fr !important;grid-auto-rows:min-content}}"}</style>
    </div>
  );
}

function MetaLine({ state, text }) {
  const c = state === "pass" ? "var(--green)" : state === "warn" ? "var(--amber)" : "var(--amber)";
  const icon = state === "pass" ? "check" : "alert-triangle";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <Icon name={icon} size={12} color={c} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-muted)" }}>{text}</span>
    </div>
  );
}

function SourceLine({ n, id, doc, loc, hl, onHover }) {
  const active = hl === id;
  return (
    <div onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: "var(--radius-sm)", background: active ? "var(--teal-tint)" : "transparent", cursor: "default" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--teal)" }}>[{n}]</span>
      <span style={{ fontSize: 12.5, color: "var(--fg-default)" }}>{doc}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)" }}>· {loc} · {id}</span>
    </div>
  );
}

Object.assign(window, { QueryScreen });
