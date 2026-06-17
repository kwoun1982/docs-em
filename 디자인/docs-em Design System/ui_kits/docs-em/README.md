# docs-em — 운영 콘솔 UI kit

High-fidelity recreation of the docs-em operations console (100% local Korean
document-RAG). Three screens, one fixed-trust header, composed from the design system's
primitives via the compiled bundle. Demo data is taken verbatim from the spec
(`06_UIUX/00_ClaudeDesign_프롬프트.md`, section ④).

## Files
- `index.html` — interactive shell; switch screens from the header (검색 / 인덱싱 / 평가).
- `AppShell.jsx` — common fixed header (logo, screen nav, `ConnectionBadge` +
  `EXTERNAL CALLS: 0` + `100% LOCAL` trust cluster) and the shared `SideRail`.
- `QueryScreen.jsx` — **A 질의응답**: 62/38 split. Answer with inline footnotes `[¹][²]`
  (hover ↔ Top-k highlight; citations ⊆ Top-k), `재시도 1` meta accordion, search-mode
  Segmented (벡터/BM25/하이브리드 RRF), Top-k=5 chunk cards with `sim` ScoreChips, 격차 -0.018
  on the 정답(#3), amber `cutoff —` line.
- `IndexScreen.jsx` — **B 인덱싱**: left rail (nomic 768·norm1 active, BGE-M3 1024 ⚠ → DECISION
  modal, LanceDB?/ChromaDB? placeholders). Dropzone + reject list, 5-node pipeline
  (pymupdf✔12 · kss✔1,842 · 청킹✔312 · 임베딩⟳188/312 · 저장○0), `prompt_tokens=0 (unreliable)`,
  indexed-doc table with 손상스캔 파싱실패.
- `EvalScreen.jsx` — **C 평가 대시보드**: left section nav + experiment dropdown
  (baseline / +bm25 / +rrf). Giant Recall@1 KPI (`[□■■■]`), 유사도 격차 KPI, golden-set
  before▸after table, 통제 실험 (단일 변수, 위반 ⚠), 안정성 게이지, 회귀 드릴다운, L1→L2→L3
  timeline. **Select +rrf** to see the Recall@1 `0 ▸ 1.0` success demo (red→green flash,
  gate G1 미달 → PASS).

## Conventions
- Every datum is JetBrains Mono tabular-nums; UI prose is Pretendard.
- Teal = connection/accent, green = success/Recall, amber = retry, red = regression/fail.
- Header trust signals (`localhost:1234`, `EXTERNAL CALLS: 0`, `100% LOCAL`) are fixed on
  all three screens and never hidden.
- BGE-M3 (1024) is an **unadopted DECISION** — shown only in screen B's rail behind a modal,
  never in screen A. Demo docs are **휴가규정.pdf / 출장경비.docx only**.

Cosmetic recreation — interactions are faked (screen switch, mode toggle, experiment switch,
hover highlights, modal). No real model or index is wired.
