/* docs-em — C. 검색 품질 평가 대시보드 (평가자)
   Demo per spec ④: 회귀 케이스 "연차 휴가 신청 절차", Recall@1=0, 격차 -0.018,
   정답 휴가규정 첫 히트 3위, MRR 0.333, nDCG@3 0.500. baseline/+bm25 = 회귀,
   +rrf = 개선 성공(0▸1, 격차 +0.012, 순위 3▸1) 시안. 8%/12%/+0.012 는 데모값. */
const { Icon, Button, Select, StatusPill, GateChip, Tag, Card, ScoreChip } = window.DocsEmDesignSystem_afe3d1;
import { mockEval } from "../mock/index.js";  // (mock) — 실 배선 시 api/client.js 로 교체

const SECTIONS = ["전체지표", "통제실험", "회귀상세", "이력", "안정성"];
const EXPS = [
  { value: "baseline", label: "baseline · 변수 0" },
  { value: "bm25", label: "+bm25 · 변수 1 ✔" },
  { value: "rrf", label: "+rrf · 변수 1 ✔" },
];

const GOLDEN = [
  { k: "Recall@1", before: 0, after: { rrf: 1.0 } },
  { k: "Recall@3", before: 1.0, after: {} },
  { k: "Recall@5", before: 1.0, after: {} },
  { k: "Recall@10", before: 1.0, after: {} },
  { k: "MRR", before: 0.333, after: { rrf: 1.0 } },
  { k: "nDCG@3", before: 0.500, after: { rrf: 1.0 } },
];

function KpiRecall({ success }) {
  const cells = success ? [1, 1, 1, 1] : [0, 1, 1, 1];
  return (
    <div key={success ? "s" : "b"} style={{
      flex: "1.15", padding: "18px 20px", borderRadius: "var(--radius-lg)", background: "var(--surface-1)",
      border: `1px solid ${success ? "var(--green-border)" : "var(--red-border)"}`,
      animation: success ? "dem-flash 0.9s var(--ease-out) 1" : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--fg-muted)" }}>회귀 · Recall@1</span>
        <span style={{ fontSize: 12, color: "var(--fg-faint)" }}>"연차 휴가 신청 절차"</span>
        <span style={{ marginLeft: "auto" }}>
          {success ? <GateChip state="pass" size="sm">G1 PASS</GateChip> : <GateChip state="fail" size="sm">L1 G1 미달</GateChip>}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.03em", color: success ? "var(--green)" : "var(--red)" }}>{success ? "1.0" : "0"}</span>
        <div style={{ paddingBottom: 6 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>▸ 목표 1</div>
          {success
            ? <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--green)" }}><Icon name="check" size={13} color="var(--green)" />REGRESS 해소</div>
            : <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--red)" }}><Icon name="x" size={13} color="var(--red)" />REGRESS</div>}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, paddingBottom: 6 }}>
          {cells.map((on, i) => (
            <div key={i} style={{ width: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: 22, borderRadius: 3, background: on ? "var(--green)" : "transparent", border: `1px solid ${on ? "var(--green)" : "var(--red-border)"}` }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-faint)" }}>@{[1, 3, 5, 10][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiGap({ success }) {
  return (
    <div style={{ flex: "1", padding: "18px 20px", borderRadius: "var(--radius-lg)", background: "var(--surface-1)", border: "1px solid var(--border-default)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--fg-muted)" }}>정답−오답 유사도 격차</span>
        <span style={{ marginLeft: "auto" }}>{success ? <GateChip state="pass" size="sm">PASS</GateChip> : null}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", color: success ? "var(--green)" : "var(--red)" }}>{success ? "+0.012" : "−0.018"}</span>
        <div style={{ paddingBottom: 5 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>▸ 목표 +양수 역전</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)", marginTop: 3 }}>정답 hr-0412 vs 오답 tr-0203</div>
        </div>
      </div>
      {/* gap bars */}
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
        <GapBar label="정답 휴가규정" v={success ? 0.713 : 0.695} max={0.72} good={success} />
        <GapBar label="오답 출장경비" v={success ? 0.701 : 0.713} max={0.72} good={false} dim />
      </div>
    </div>
  );
}

function GapBar({ label, v, max, good, dim }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 92, fontSize: 11, color: dim ? "var(--fg-faint)" : "var(--fg-muted)" }}>{label}</span>
      <div style={{ flex: 1, height: 7, background: "var(--bg-sunken)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <div style={{ width: `${(v / max) * 100}%`, height: "100%", background: good ? "var(--green)" : dim ? "var(--fg-faint)" : "var(--red)", borderRadius: "var(--radius-full)" }} />
      </div>
      <span style={{ width: 44, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)" }}>{v.toFixed(3)}</span>
    </div>
  );
}

function GoldenRow({ row, exp }) {
  const after = row.after[exp] !== undefined ? row.after[exp] : row.before;
  const delta = +(after - row.before).toFixed(3);
  const big = row.k === "Recall@1";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "92px 1fr 1fr 70px", alignItems: "center", gap: 12, padding: "7px 0", borderTop: "1px solid var(--border-subtle)" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: big ? 700 : 500, color: big ? "var(--fg-default)" : "var(--fg-muted)" }}>{row.k}</span>
      <MiniBar v={row.before} />
      <MiniBar v={after} hl={delta > 0} />
      <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: delta > 0 ? "var(--green)" : delta < 0 ? "var(--red)" : "var(--fg-faint)" }}>
        {delta > 0 ? "▲ +" : delta < 0 ? "▼ " : ""}{delta === 0 ? "0" : delta.toFixed(3)}
      </span>
    </div>
  );
}

function MiniBar({ v, hl }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "var(--bg-sunken)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <div style={{ width: `${v * 100}%`, height: "100%", background: hl ? "var(--green)" : v >= 0.99 ? "var(--green)" : v === 0 ? "var(--red)" : "var(--teal)", borderRadius: "var(--radius-full)" }} />
      </div>
      <span style={{ width: 34, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)" }}>{v.toFixed(v < 1 && v > 0 ? 3 : 1)}</span>
    </div>
  );
}

function EvalScreen() {
  const [exp, setExp] = React.useState("baseline");
  const [sec, setSec] = React.useState("전체지표");
  // (mock) 실험 전환 시 mockEval 가짜 지연 → 결과 반영. success 는 결과에서 파생.
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    mockEval({ experiment: exp }).then((r) => { setResult(r); setLoading(false); });
  }, [exp]);

  const success = result ? result.success : exp === "rrf";

  return (
    <div style={{ display: "flex", width: "100%", minWidth: 0 }}>
      {/* SIDE NAV */}
      <window.SideRail width={208}>
        <window.RailSection label="섹션">
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {SECTIONS.map((s) => {
              const on = s === sec;
              return (
                <button key={s} type="button" onClick={() => setSec(s)}
                  style={{ textAlign: "left", padding: "7px 9px", borderRadius: "var(--radius-md)", border: "1px solid", borderColor: on ? "var(--border-default)" : "transparent",
                    background: on ? "var(--surface-2)" : "transparent", color: on ? "var(--fg-default)" : "var(--fg-muted)",
                    fontSize: 13, fontWeight: on ? 600 : 500, cursor: "pointer" }}>{s}</button>
              );
            })}
          </div>
        </window.RailSection>
        <window.RailSection label="활성 실험">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {EXPS.map((e) => {
              const on = e.value === exp;
              return (
                <button key={e.value} type="button" onClick={() => setExp(e.value)}
                  style={{ textAlign: "left", padding: "8px 10px", borderRadius: "var(--radius-md)", cursor: "pointer",
                    background: on ? "var(--teal-tint)" : "var(--surface-1)", border: `1px solid ${on ? "var(--teal-border)" : "var(--border-default)"}`,
                    fontFamily: "var(--font-mono)", fontSize: 11.5, color: on ? "var(--teal)" : "var(--fg-muted)" }}>{e.label}</button>
              );
            })}
          </div>
        </window.RailSection>
      </window.SideRail>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1000, display: "flex", flexDirection: "column", gap: 16, opacity: loading ? 0.55 : 1, transition: "opacity var(--dur-fast) var(--ease-standard)" }}>
          {loading ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, alignSelf: "flex-start", color: "var(--fg-muted)" }}>
              <Icon name="loader-circle" size={14} color="var(--teal)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>평가 재계산 중…</span>
            </div>
          ) : null}
          {/* 섹션 전환 — 좌레일 '섹션' 클릭 시 해당 카드만 표시 */}

          {/* [전체지표] KPI row + 골든셋 */}
          {sec === "전체지표" ? (
          <React.Fragment>
          <div style={{ display: "flex", gap: 14 }}>
            <KpiRecall success={success} />
            <KpiGap success={success} />
          </div>

          <Card header="골든셋 전체 지표" actions={<span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>before ▸ after</span>}>
            <div style={{ display: "grid", gridTemplateColumns: "92px 1fr 1fr 70px", gap: 12, paddingBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-faint)" }}>지표</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-faint)" }}>before</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-faint)" }}>after</span>
              <span style={{ textAlign: "right", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-faint)" }}>Δ</span>
            </div>
            {GOLDEN.map((r) => <GoldenRow key={r.k} row={r} exp={exp} />)}
          </Card>
          </React.Fragment>
          ) : null}

          {/* [통제실험] 통제 실험 비교 */}
          {sec === "통제실험" ? (
            <Card header="통제 실험 비교" actions={<span style={{ fontSize: 11, color: "var(--fg-faint)" }}>단일 변수 원칙</span>}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ExpRow name="baseline" vars={0} note="기준" />
                <ExpRow name="+bm25 (Kiwi 형태소)" vars={1} ok />
                <ExpRow name="+rrf" vars={1} ok />
                <ExpRow name="임베딩교체 + RRF 동시" vars={2} violation />
              </div>
            </Card>
          ) : null}

          {/* [안정성] 안정성 보조 */}
          {sec === "안정성" ? (
            <Card header="안정성 보조">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Gauge label="content 빈값 발생률" pct={8} />
                <Gauge label="length 재시도율" pct={12} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-faint)" }}>임계 ≥25% 부터 앰버 · 값은 데모</div>
              </div>
            </Card>
          ) : null}

          {/* [회귀상세] 회귀 케이스 드릴다운 */}
          {sec === "회귀상세" ? (
          <Card header="회귀 케이스 드릴다운" padding={false}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
                <thead>
                  <tr>{["질의", "정답 문서", "순위", "정답 점수", "최상위 오답", "격차", "게이트"].map((h, i) => (
                    <th key={h} style={{ textAlign: i >= 2 && i <= 5 ? "right" : "left", padding: "9px 14px", background: "var(--bg-sunken)", borderBottom: "1px solid var(--border-default)", color: "var(--fg-faint)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  <tr style={{ background: success ? "var(--green-tint)" : "var(--red-tint)" }}>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--fg-default)" }}>연차 휴가 신청 절차</td>
                    <td style={{ padding: "11px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>휴가규정.pdf</td>
                    <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: success ? "var(--green)" : "var(--red)" }}>{success ? "3 ▸ 1" : "3"}</td>
                    <td style={{ padding: "11px 14px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-default)" }}>0.695</td>
                    <td style={{ padding: "11px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>출장경비.docx</td>
                    <td style={{ padding: "11px 14px", textAlign: "right" }}><ScoreChip kind="격차" value={success ? "+0.012" : "−0.018"} gap={success ? 0.012 : -0.018} decimals={3} size="sm" /></td>
                    <td style={{ padding: "11px 14px" }}>{success ? <GateChip state="pass" size="sm">G1 PASS</GateChip> : <GateChip state="fail" size="sm">G1 미달</GateChip>}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
          ) : null}

          {/* [이력] 실험 이력 타임라인 */}
          {sec === "이력" ? (
          <Card header="실험 이력 타임라인">
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <TimelineNode label="L1" sub="검색 MVP + 평가 하네스" done />
              <TimelineConn done />
              <TimelineNode label="L2" sub="임베딩 교체 · 하이브리드 · 폴백 게이트" done={success} active={!success} />
              <TimelineConn />
              <TimelineNode label="L3" sub="리랭킹 · 서빙" />
            </div>
          </Card>
          ) : null}
        </div>
      </div>

      <style>{"@keyframes dem-flash{0%{border-color:var(--red);box-shadow:0 0 0 2px var(--red-tint)}100%{border-color:var(--green-border);box-shadow:none}}@media (max-width:768px){.c-grid{grid-template-columns:1fr !important}}"}</style>
    </div>
  );
}

function ExpRow({ name, vars, ok, violation, note }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-md)", background: violation ? "var(--amber-tint)" : "var(--surface-2)", border: `1px solid ${violation ? "var(--amber-border)" : "var(--border-subtle)"}` }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-default)" }}>{name}</span>
      <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>변수 {vars}</span>
        {violation ? <StatusPill tone="warn" size="sm" indicator="icon">통제 위반</StatusPill>
          : ok ? <Icon name="check-circle" size={15} color="var(--green)" />
          : <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>{note}</span>}
      </span>
    </div>
  );
}

function Gauge({ label, pct }) {
  const amber = pct >= 25;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: amber ? "var(--amber)" : "var(--green)" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "var(--bg-sunken)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: amber ? "var(--amber)" : "var(--green)", borderRadius: "var(--radius-full)" }} />
      </div>
    </div>
  );
}

function TimelineNode({ label, sub, done, active }) {
  const c = done ? "var(--green)" : active ? "var(--teal)" : "var(--fg-faint)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0, width: 150 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: done ? "var(--green-tint)" : active ? "var(--teal-tint)" : "var(--surface-2)", border: `1.5px solid ${done ? "var(--green-border)" : active ? "var(--teal-border)" : "var(--border-strong)"}` }}>
        {done ? <Icon name="check" size={15} color="var(--green)" /> : <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: c }}>{label}</span>}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: c }}>{label}</span>
      <span style={{ fontSize: 10.5, color: "var(--fg-faint)", textAlign: "center", lineHeight: 1.35 }}>{sub}</span>
    </div>
  );
}

function TimelineConn({ done }) {
  return <div style={{ flex: 1, height: 2, background: done ? "var(--green-border)" : "var(--border-strong)", marginTop: -28 }} />;
}

Object.assign(window, { EvalScreen });
