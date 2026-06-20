/* docs-em mock 데이터 — 절대 규칙(가짜값 vs 사실값) 준수.
 *
 * 사실값(진짜 — 절대 변형 금지):
 *   768 · norm1 · −0.018 · 0.687→0.695 · 12,972자 · ctx 8192/65536 · localhost:1234
 * 가짜값(데모 식별자만):
 *   hr-0412 / tr-0203 / p.N · 휴가규정.pdf / 출장경비.docx 2종만
 *
 * 모든 데이터는 (mock) 이다. SSOT 실측 근거 없는 시각화는 (데모) 배지로 표기한다.
 * 이 모듈은 실 배선 페이즈에서 api/client.js 로 교체만 하면 되도록 모양을 고정한다.
 */

// 화면 A — Top-k (정답 휴가규정 hr-0412 3위, 격차 −0.018)
export const TOPK = [
  { rank: 1, doc: "출장경비.docx", loc: "p.2", id: "tr-0203", sim: 0.713, label: "wrong", snippet: "출장 신청은 출장 7일 전까지 시스템에 등록하며 부서장 전결로 승인한다.", cited: false },
  { rank: 2, doc: "출장경비.docx", loc: "p.5", id: "tr-0511", sim: 0.701, label: "none", snippet: "경비 정산은 귀임 후 5일 이내 영수증을 첨부하여 제출한다.", cited: false },
  { rank: 3, doc: "휴가규정.pdf", loc: "p.4", id: "hr-0412", sim: 0.695, label: "answer", gap: -0.018, snippet: "연차 휴가는 신청서 작성 후 팀장 승인을 거쳐 신청하며, 사용 7일 전까지 제출한다.", cited: true, note: "[¹]" },
  { rank: 4, doc: "출장경비.docx", loc: "p.8", id: "tr-0803", sim: 0.690, label: "none", snippet: "장기 출장 시 숙박비는 1박 기준 한도 내에서 실비로 정산한다.", cited: false },
  { rank: 5, doc: "휴가규정.pdf", loc: "p.7", id: "hr-0712", sim: 0.687, label: "none", snippet: "반차는 오전·오후 단위로 사용하며 연차에서 0.5일을 차감한다.", cited: true, note: "[²]" },
];

// 화면 A — 답변(인용 ⊆ Top-k). prompt_tokens=0 은 (unreliable).
export const ANSWER = {
  text: "연차 휴가는 신청서 작성 후 팀장 승인을 거쳐 신청합니다. 신청은 사용 7일 전까지 제출합니다.",
  citations: [
    { n: 1, id: "hr-0412", docId: "휴가규정.pdf", page: "p.4" },
    { n: 2, id: "hr-0712", docId: "휴가규정.pdf", page: "p.7" },
  ],
  meta: { prompt_tokens: 0 /* unreliable */, retries: 1, mode: "hybrid", truncated: "12,972자" },
};

// 화면 B — 색인된 문서(손상스캔 파싱실패 행 포함). 데모 문서는 2종 + 손상스캔.
export const DOCS = [
  { id: 1, name: "휴가규정.pdf", chunks: "312", dim: "768", model: "nomic", at: "16:02:11", status: "ok", note: "재색인 0 · 신규" },
  { id: 2, name: "출장경비.docx", chunks: "188", dim: "768", model: "nomic", at: "16:01:40", status: "ok", note: "" },
  { id: 3, name: "손상스캔.pdf", chunks: "–", dim: "–", model: "–", at: "16:00:55", status: "error", note: "" },
];

// 화면 B — 5노드 파이프라인 단계 정의. (mockIndexRun 이 ⟳ → ✔ 로 진행시킨다)
export const PIPE_STEPS = [
  { label: "파싱", tool: "pymupdf", done: "✔ 12" },
  { label: "문장분리", tool: "kss", done: "✔ 1,842" },
  { label: "청킹", tool: "char-guard", done: "✔ 312" },
  { label: "임베딩", tool: "nomic", done: "✔ 312", active: "⟳ 188/312", pct: 60 },
  { label: "저장", tool: "vectorstore", done: "✔ 312", pending: "○ 0" },
];

// 화면 B — 드롭존 거부 목록(.pdf/.docx 외 거부)
export const REJECTED = [
  { name: "report.xlsx", reason: "지원 안 함·스킵" },
  { name: "notes.hwp", reason: "지원 안 함·스킵" },
];

// 화면 C — 골든셋 지표. baseline/+bm25 = 회귀(Recall@1=0), +rrf = (데모) 성공.
export const GOLDEN = [
  { k: "Recall@1", before: 0, after: { rrf: 1.0 } },
  { k: "Recall@3", before: 1.0, after: {} },
  { k: "Recall@5", before: 1.0, after: {} },
  { k: "Recall@10", before: 1.0, after: {} },
  { k: "MRR", before: 0.333, after: { rrf: 1.0 } },
  { k: "nDCG@3", before: 0.500, after: { rrf: 1.0 } },
];

// 화면 D — 로컬 LLM/서버 모니터링. (mock) 화면만.
//   사실값(진짜): 768·norm1·ctx 8192/65536·localhost:1234·gemma/qwen 모델명.
//   측정 수치(tok/s·지연·VRAM·CPU·온도 등)는 전부 (데모) — 실 배선 시 측정으로 교체.
//   "실제 개발(측정) 가능한 항목"만 둔다: LMStudio /v1 응답 메타 · OpenAI 호환 usage ·
//   임베딩 처리량 · psutil 류 시스템 메트릭(cpu/mem/disk/temp).

// 추론 속도·지연 (LMStudio /v1/chat/completions 응답 + 타이밍에서 측정 가능)
export const LLM_PERF = {
  model: "gemma-4-e4b",          // 사실: 로드된 모델명
  ctx: "65536",                  // 사실: ctx 창
  tokens_per_sec: 38.4,          // (데모)
  ttft_ms: 412,                  // (데모) 첫 토큰까지
  latency_p50_ms: 1840,          // (데모)
  latency_p95_ms: 4120,          // (데모)
  gen_tokens_avg: 386,           // (데모) 생성 토큰 평균
  prompt_tokens: 0,              // 사실: (unreliable) — LMStudio usage 미신뢰
};

// 안정성·품질 신호 (응답 메타에서 측정 가능 — 기존 실측 이슈와 연결)
export const LLM_STABILITY = {
  content_empty_rate: 8,         // (데모) % — reasoning_content 폴백 유발
  length_retry_rate: 12,         // (데모) % — finish_reason=length 재시도
  reasoning_fallback_rate: 6,    // (데모) % — qwen/gemma reasoning 빈값 폴백
  finish: { stop: 82, length: 12, empty: 6 },  // (데모) finish_reason 분포 %
};

// 모델·자원 상태 (LMStudio 모델 목록 + GPU 점유; 측정 가능)
export const LLM_MODELS = [
  { id: 1, name: "gemma-4-e4b", role: "GEN", ctx: "65536", vram: "5.2 GB", state: "loaded" },
  { id: 2, name: "qwen3.6-35b-a3b", role: "GEN", ctx: "8192", vram: "—", state: "unloaded" },
  { id: 3, name: "text-embedding-nomic-embed-text-v1.5", role: "EMB", ctx: "8192", vram: "0.4 GB", state: "loaded" },
];

// 임베딩·검색 지표 (인덱싱/검색 파이프라인에서 측정 가능)
export const EMB_PERF = {
  dim: "768",                    // 사실
  norm: "1.0 (norm1)",           // 사실: L2 norm=1
  docs_per_sec: 14.2,            // (데모)
  vectors: "500",                // (데모) 색인 벡터 수
  search_p50_ms: 36,             // (데모)
};

// 시계열 (스파크라인용, 최근 N틱). 전부 (데모) — 실 배선 시 폴링 누적으로 교체.
export const SERIES = {
  tokens_per_sec: [31, 34, 30, 37, 33, 39, 36, 41, 38, 40, 37, 38],
  ttft_ms:        [480, 450, 510, 420, 460, 400, 430, 390, 415, 405, 420, 412],
  latency_p95_ms: [3800, 4200, 3900, 4500, 4100, 4300, 3950, 4400, 4120, 4050, 4200, 4120],
  content_empty:  [5, 7, 6, 9, 8, 10, 7, 11, 8, 9, 7, 8],
  length_retry:   [10, 13, 11, 15, 12, 14, 11, 16, 13, 12, 13, 12],
  cpu_pct:        [28, 33, 41, 36, 30, 45, 38, 34, 40, 31, 35, 34],
  gpu_pct:        [55, 61, 70, 64, 58, 72, 66, 60, 68, 57, 63, 62],
  mem_pct:        [35, 36, 37, 36, 38, 37, 39, 37, 38, 36, 37, 37],
  docs_per_sec:   [11, 13, 12, 15, 14, 16, 13, 15, 14, 13, 14, 14],
  search_p50_ms:  [42, 38, 45, 33, 39, 31, 36, 30, 35, 34, 37, 36],
  vram_gpu:       [4.8, 5.0, 5.3, 5.1, 4.9, 5.4, 5.2, 5.0, 5.3, 4.9, 5.1, 5.2],
};

// 서버 상태 (psutil 류로 측정 가능: cpu/mem/disk/temp)
export const SERVER = {
  cpu_pct: 34,                   // (데모)
  mem_used: "11.8",              // (데모) GB
  mem_total: "32",               // 사실급(이 PC 사양) — 표기는 (데모) 유지
  mem_pct: 37,                   // (데모)
  ssd_used: "418",               // (데모) GB
  ssd_total: "1024",             // (데모) GB
  ssd_pct: 41,                   // (데모)
  gpu_pct: 62,                   // (데모)
  temp_cpu: 58,                  // (데모) °C
  temp_gpu: 67,                  // (데모) °C
  uptime: "04:12:33",            // (데모)
};

// 화면 C — 실험별 단일 요약(KPI/격차). +rrf 만 success.
export const EVALS = {
  baseline: { recall_at_1: 0, recall_at_3: 1.0, recall_at_5: 1.0, recall_at_10: 1.0, mrr: 0.333, ndcg_at_3: 0.5, gap: -0.018, rank: "3", success: false },
  bm25:     { recall_at_1: 0, recall_at_3: 1.0, recall_at_5: 1.0, recall_at_10: 1.0, mrr: 0.333, ndcg_at_3: 0.5, gap: -0.018, rank: "3", success: false },
  rrf:      { recall_at_1: 1.0, recall_at_3: 1.0, recall_at_5: 1.0, recall_at_10: 1.0, mrr: 1.0, ndcg_at_3: 1.0, gap: 0.012, rank: "3 ▸ 1", success: true /* (데모) */ },
};
