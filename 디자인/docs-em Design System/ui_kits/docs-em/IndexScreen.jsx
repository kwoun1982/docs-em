/* docs-em — B. 문서 인덱싱 / 재색인 (운영자 콘솔)
   Demo per spec ④: active EMB nomic 768·norm1, BGE-M3 미채택 DECISION,
   pipeline pymupdf✔12 · kss✔1,842 · 청킹✔312 · 임베딩⟳188/312 · 저장○0,
   docs 휴가규정/출장경비 색인됨 + 손상스캔 파싱실패. */
const { Icon, IconButton, Button, Input, StatusPill, Tag, Card, DataTable, ProgressBar } = window.DocsEmDesignSystem_afe3d1;

const DOCS = [
  { id: 1, name: "휴가규정.pdf", chunks: "312", dim: "768", model: "nomic", at: "16:02:11", status: "ok", note: "재색인 0 · 신규" },
  { id: 2, name: "출장경비.docx", chunks: "188", dim: "768", model: "nomic", at: "16:01:40", status: "ok", note: "" },
  { id: 3, name: "손상스캔.pdf", chunks: "–", dim: "–", model: "–", at: "16:00:55", status: "error", note: "" },
];

const PIPE = [
  { label: "파싱", tool: "pymupdf", count: "✔ 12", state: "done" },
  { label: "문장분리", tool: "kss", count: "✔ 1,842", state: "done" },
  { label: "청킹", tool: "char-guard", count: "✔ 312", state: "done" },
  { label: "임베딩", tool: "nomic", count: "⟳ 188/312", state: "active", pct: 60 },
  { label: "저장", tool: "vectorstore", count: "○ 0", state: "pending", pct: 0 },
];

function EmbToggle({ active, label, dim, meta, warn, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%", textAlign: "left", padding: "9px 10px", marginBottom: 6,
        borderRadius: "var(--radius-md)", cursor: "pointer",
        background: active ? "var(--teal-tint)" : "var(--surface-1)",
        border: `1px solid ${active ? "var(--teal-border)" : "var(--border-default)"}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "var(--teal)" : "var(--fg-faint)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: active ? "var(--teal)" : "var(--fg-default)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", marginLeft: "auto" }}>{dim}</span>
        {warn ? <Icon name="alert-triangle" size={13} color="var(--amber)" /> : null}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-faint)", lineHeight: 1.4 }}>{meta}</span>
    </button>
  );
}

function PipeNode({ node, last }) {
  const c = node.state === "done" ? "var(--green)" : node.state === "active" ? "var(--teal)" : "var(--fg-faint)";
  return (
    <React.Fragment>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name={node.state === "done" ? "check-circle" : node.state === "active" ? "loader-circle" : "circle"} size={14} color={c} />
          <span style={{ fontSize: 12, fontWeight: 600, color: node.state === "pending" ? "var(--fg-faint)" : "var(--fg-default)" }}>{node.label}</span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: c }}>{node.count}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-faint)" }}>{node.tool}</span>
        <ProgressBar value={node.state === "done" ? 100 : node.pct || 0} tone={node.state === "active" ? "signal" : "success"} height={3} />
      </div>
      {!last ? <Icon name="chevron-right" size={15} color="var(--border-strong)" style={{ marginTop: 2, flexShrink: 0 }} /> : null}
    </React.Fragment>
  );
}

function DecisionModal({ onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(3,5,8,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 440, background: "var(--surface-1)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-overlay)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
          <Icon name="alert-triangle" size={16} color="var(--amber)" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-default)" }}>임베딩 모델 교체 — DECISION 미확정</span>
        </div>
        <div style={{ padding: 16, fontSize: 13, lineHeight: 1.7, color: "var(--fg-muted)" }}>
          <p style={{ margin: "0 0 10px" }}><strong style={{ color: "var(--fg-default)" }}>BGE-M3</strong> 채택 시 차원이 <span className="mono" style={{ color: "var(--amber)" }}>768 → 1024</span>로 바뀌어 <strong style={{ color: "var(--fg-default)" }}>전체 재인덱싱</strong>과 <strong style={{ color: "var(--fg-default)" }}>norm 재측정</strong>이 필요합니다.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Tag>1024</Tag><Tag>ctx 8192</Tag><Tag>Dense+Sparse+ColBERT</Tag><Tag tone="blue">MIT</Tag>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-sunken)" }}>
          <Button variant="secondary" onClick={onClose}>취소</Button>
          <Button variant="primary" onClick={onClose}>적용</Button>
        </div>
      </div>
    </div>
  );
}

function IndexScreen() {
  const [modal, setModal] = React.useState(false);
  return (
    <div style={{ position: "relative", display: "flex", width: "100%", minWidth: 0 }}>
      {/* SIDEBAR */}
      <window.SideRail width={222}>
        <window.RailSection label="임베딩 모델">
          <EmbToggle active label="nomic" dim="768 · norm1" meta="text-embedding-nomic-embed-text-v1.5 · L2 norm=1.0 (재정규화 금지)" />
          <EmbToggle label="BGE-M3" dim="1024" warn meta="ctx 8192 · Dense+Sparse+ColBERT · MIT" onClick={() => setModal(true)} />
        </window.RailSection>
        <window.RailSection label="벡터스토어">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["LanceDB", "ChromaDB"].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: "var(--radius-md)", background: "var(--surface-1)", border: "1px dashed var(--border-default)", opacity: 0.7 }}>
                <Icon name="database" size={13} color="var(--fg-faint)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>{s}?</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--fg-faint)" }}>DECISION</span>
              </div>
            ))}
          </div>
        </window.RailSection>
        <div style={{ marginTop: "auto", padding: 12 }}>
          <div style={{ padding: 10, borderRadius: "var(--radius-md)", background: "var(--surface-1)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Icon name="lock" size={12} color="var(--fg-faint)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-muted)" }}>localhost:1234/v1</span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-faint)" }}>api_key=lm-studio (dummy)</span>
          </div>
        </div>
      </window.SideRail>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1000, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* 1. Upload */}
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "20px", border: "1.5px dashed var(--border-strong)", borderRadius: "var(--radius-lg)", background: "var(--bg-sunken)" }}>
                <Icon name="arrow-up-right" size={20} color="var(--fg-muted)" />
                <span style={{ fontSize: 13, color: "var(--fg-default)" }}>PDF · DOCX 파일을 여기에 드래그</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>그 외 포맷은 거부 (.pdf / .docx 만)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}><Button variant="secondary" iconLeft={<Icon name="folder" size={14} />}>파일 선택</Button></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
              <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>거부:</span>
              <Tag tone="amber" icon="x">report.xlsx · 지원 안 함·스킵</Tag>
              <Tag tone="amber" icon="x">notes.hwp · 지원 안 함·스킵</Tag>
            </div>
          </div>

          {/* 2. Pipeline */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-default)" }}>파이프라인</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>파싱 → 문장분리 → 청킹 → 임베딩 → 저장</span>
              <Tag tone="amber" style={{ marginLeft: "auto" }}>가드: char / 로컬 토크나이저 기준</Tag>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              {PIPE.map((n, i) => <PipeNode key={n.label} node={n} last={i === PIPE.length - 1} />)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
              <Icon name="alert-triangle" size={13} color="var(--amber)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--amber)" }}>prompt_tokens=0 (unreliable)</span>
              <span style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>— 토큰 카운트 미사용, char 가드로 분할</span>
            </div>
          </Card>

          {/* 3. Indexed table */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--fg-default)" }}>색인된 문서</h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>멱등: 문서ID + 청크해시 동일 시 생성 안 함</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Button size="sm" variant="secondary" iconLeft={<Icon name="rotate-cw" size={14} />}>전체 재색인</Button>
                <Button size="sm" variant="secondary">선택 재색인</Button>
              </div>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "문서명", mono: true, render: (v, r) => (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Icon name={r.status === "error" ? "alert-circle" : "file-text"} size={14} color={r.status === "error" ? "var(--red)" : "var(--fg-faint)"} />{v}
                  </span>
                ) },
                { key: "chunks", label: "청크", align: "right", mono: true, width: 70 },
                { key: "dim", label: "차원", align: "right", mono: true, width: 64 },
                { key: "model", label: "모델", mono: true, width: 80 },
                { key: "at", label: "색인 시각", align: "right", mono: true, width: 96 },
                { key: "status", label: "상태", width: 210, render: (v, r) => (
                  v === "error"
                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><StatusPill tone="error" size="sm">파싱실패·스킵</StatusPill><a href="#log" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>[로그]</a></span>
                    : <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><StatusPill tone="ok" size="sm">색인됨</StatusPill>{r.note ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-faint)" }}>{r.note}</span> : null}</span>
                ) },
              ]}
              rows={DOCS}
            />
          </div>
        </div>
      </div>

      {modal ? <DecisionModal onClose={() => setModal(false)} /> : null}
    </div>
  );
}

Object.assign(window, { IndexScreen });
