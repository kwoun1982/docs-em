/* docs-em mock API — 실 API(api/client.js)와 동일 export 이름·동일 반환 모양.
 * 모든 함수는 setTimeout 기반 가짜 지연만 쓴다. fetch·서버 호출 0건(INV-3).
 * 실 배선 페이즈에서 이 파일을 api/client.js 로 교체만 하면 화면은 그대로 동작한다.
 */
import { TOPK, ANSWER, DOCS, PIPE_STEPS, REJECTED, GOLDEN, EVALS,
         LLM_PERF, LLM_STABILITY, LLM_MODELS, EMB_PERF, SERVER, SERIES } from "./data.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (lo, hi) => lo + Math.floor((hi - lo) * (performance.now() % 997) / 997);

// 로그인 — (mock) 화면만. 자격 검증 없이 항상 성공(가짜 지연만).
// 실 배선 시 api/client.js 에서 localhost:1234 인증으로 교체. 반환 모양 고정.
export async function mockLogin({ id = "", pw = "" } = {}) {
  await delay(rand(200, 500));
  return { ok: true, user: { id: id || "admin", name: id || "admin" }, token: "mock-session" };
}

// 화면 A — 답변 생성(검색 300–700ms 가짜 지연). 인용 ⊆ Top-k.
export async function mockAnswer({ query, mode = "hybrid", model = "gemma", topN = 5 } = {}) {
  await delay(rand(300, 700));
  return {
    text: ANSWER.text,
    citations: ANSWER.citations,
    topk: TOPK.slice(0, topN).map((c) => ({ rank: c.rank, docId: c.doc, page: c.loc, score: c.sim, isAnswer: c.label === "answer" })),
    meta: { ...ANSWER.meta, mode, model, query },
  };
}

// 화면 A — 검색만(모드 전환 시 재호출). 벡터/BM25/하이브리드RRF.
export async function mockSearch({ query, mode = "hybrid" } = {}) {
  await delay(rand(300, 700));
  // mock 은 모드와 무관하게 동일 Top-k 를 반환(데이터 소스가 가짜이므로). 모드만 메타로 전달.
  return TOPK.map((c) => ({ ...c, mode }));
}

// 화면 C — 평가(실험 전환 시 재호출). baseline/+bm25 회귀, +rrf (데모) 성공.
export async function mockEval({ experiment = "baseline" } = {}) {
  await delay(rand(300, 600));
  const e = EVALS[experiment] || EVALS.baseline;
  return {
    recall_at_1: e.recall_at_1, recall_at_3: e.recall_at_3, recall_at_5: e.recall_at_5, recall_at_10: e.recall_at_10,
    mrr: e.mrr, ndcg_at_10: e.ndcg_at_3,
    golden: GOLDEN, gap: e.gap, rank: e.rank, success: e.success,
    per_query: [{ query: "연차 휴가 신청 절차", doc: "휴가규정.pdf", rank: e.rank, gap: e.gap }],
  };
}

// 화면 B — 파일 업로드(거부 목록 반환).
export async function mockIndexUpload(files = []) {
  await delay(rand(200, 500));
  return { accepted: [], rejected: REJECTED };
}

// 화면 B — 재색인 실행. 5노드 파이프라인을 단계별로 onStep 콜백으로 진행(⟳ → ✔).
export async function mockIndexRun(onStep) {
  for (let i = 0; i < PIPE_STEPS.length; i++) {
    // 해당 노드 active(⟳)
    if (onStep) onStep(i, "active");
    await delay(rand(400, 800));
    // 해당 노드 done(✔)
    if (onStep) onStep(i, "done");
  }
  return { ok: true, docs: DOCS };
}

// 화면 B — 색인된 문서 목록(손상 스캔 파싱 실패 행 포함).
export async function mockIndexDocs() {
  await delay(rand(150, 350));
  return DOCS;
}

// 화면 D — 로컬 LLM/서버 모니터링 스냅샷(폴링 시그니처). (mock) 측정 수치는 (데모).
// 실 배선 시 LMStudio /v1 메타 + psutil 류 시스템 메트릭으로 교체.
export async function mockMonitor() {
  await delay(rand(120, 320));
  return snapshotMonitor();
}

// 즉시 스냅샷(지연 없음) — mock 소켓 push 가 호출한다. 매 호출마다 가변 상태 진화.
export function snapshotMonitor() {
  monitorTick();   // 한 스텝 진화(동적 효과).
  return {
    llm: { ...LLM_PERF, ...live.llm },
    stability: { ...LLM_STABILITY, ...live.stability },
    models: LLM_MODELS,
    emb: { ...EMB_PERF, ...live.emb },
    server: { ...SERVER, ...live.server },
    series: live.series,
  };
}

// ── 동적 mock 상태 (랜덤 워크) ───────────────────────────────────────────
// 모듈 스코프에 가변 스냅샷을 두고 매 폴링마다 흔든다. 시계열은 한 칸씩 슬라이딩.
// 이건 브라우저 앱 코드라 Math.random() 사용 가능(워크플로 스크립트 제약과 무관).
const N = 30; // 시계열 보관 길이(틱)
const seed = (base, n = N) => Array.from({ length: n }, () => base);

const live = {
  llm: { tokens_per_sec: 38, ttft_ms: 412, latency_p50_ms: 1840, latency_p95_ms: 4120, gen_tokens_avg: 386 },
  stability: { content_empty_rate: 8, length_retry_rate: 12, reasoning_fallback_rate: 6, finish: { stop: 82, length: 12, empty: 6 } },
  emb: { docs_per_sec: 14, search_p50_ms: 36 },
  server: { cpu_pct: 34, gpu_pct: 62, mem_pct: 37, ssd_pct: 41, temp_cpu: 58, temp_gpu: 67 },
  series: {
    tokens_per_sec: seed(38), ttft_ms: seed(412), latency_p95_ms: seed(4120),
    content_empty: seed(8), length_retry: seed(12),
    cpu_pct: seed(34), gpu_pct: seed(62), mem_pct: seed(37),
    docs_per_sec: seed(14), search_p50_ms: seed(36), vram_gpu: seed(5.2),
  },
};

// 한 값을 평균(center) 주위로 흔들고 [lo,hi]로 클램프하는 랜덤 워크.
// pull(평균 회귀) 약하게 + amp 크게 → 더 넓고 활발하게 움직인다(역동적 체감).
function walk(v, center, amp, lo, hi) {
  const pull = (center - v) * 0.1;
  const next = v + pull + (Math.random() - 0.5) * amp;
  return Math.max(lo, Math.min(hi, next));
}
const push = (arr, v) => { arr.push(v); if (arr.length > N) arr.shift(); };
const r1 = (v) => Math.round(v * 10) / 10;

function monitorTick() {
  const L = live.llm, S = live.stability, E = live.emb, V = live.server;

  L.tokens_per_sec = r1(walk(L.tokens_per_sec, 39, 12, 22, 58));
  L.ttft_ms        = Math.round(walk(L.ttft_ms, 412, 150, 280, 660));
  L.latency_p50_ms = Math.round(walk(L.latency_p50_ms, 1840, 600, 980, 3200));
  L.latency_p95_ms = Math.round(walk(L.latency_p95_ms, 4120, 1000, 2600, 5900));
  L.gen_tokens_avg = Math.round(walk(L.gen_tokens_avg, 386, 70, 260, 540));

  S.content_empty_rate     = Math.round(walk(S.content_empty_rate, 8, 6, 2, 22));
  S.length_retry_rate      = Math.round(walk(S.length_retry_rate, 12, 7, 4, 26));
  S.reasoning_fallback_rate = Math.round(walk(S.reasoning_fallback_rate, 6, 4, 1, 18));
  // finish_reason 분포는 합 100 유지: length/empty 를 흔들고 stop 으로 보정.
  S.finish.length = Math.round(walk(S.finish.length, 12, 4, 4, 24));
  S.finish.empty  = Math.round(walk(S.finish.empty, 6, 3, 1, 16));
  S.finish.stop   = Math.max(0, 100 - S.finish.length - S.finish.empty);

  E.docs_per_sec   = r1(walk(E.docs_per_sec, 14, 7, 7, 24));
  E.search_p50_ms  = Math.round(walk(E.search_p50_ms, 36, 18, 18, 64));

  V.cpu_pct  = Math.round(walk(V.cpu_pct, 38, 22, 8, 94));
  V.gpu_pct  = Math.round(walk(V.gpu_pct, 64, 24, 18, 98));
  V.mem_pct  = Math.round(walk(V.mem_pct, 37, 7, 26, 62));
  V.ssd_pct  = Math.round(walk(V.ssd_pct, 41, 2, 38, 46));
  V.temp_cpu = Math.round(walk(V.temp_cpu, 58, 9, 42, 84));
  V.temp_gpu = Math.round(walk(V.temp_gpu, 67, 10, 48, 90));

  const vram = r1(walk(live.series.vram_gpu[live.series.vram_gpu.length - 1] || 5.2, 5.2, 0.5, 4.2, 6.4));

  // 시계열 슬라이딩 푸시.
  push(live.series.tokens_per_sec, L.tokens_per_sec);
  push(live.series.ttft_ms, L.ttft_ms);
  push(live.series.latency_p95_ms, L.latency_p95_ms);
  push(live.series.content_empty, S.content_empty_rate);
  push(live.series.length_retry, S.length_retry_rate);
  push(live.series.cpu_pct, V.cpu_pct);
  push(live.series.gpu_pct, V.gpu_pct);
  push(live.series.mem_pct, V.mem_pct);
  push(live.series.docs_per_sec, E.docs_per_sec);
  push(live.series.search_p50_ms, E.search_p50_ms);
  push(live.series.vram_gpu, vram);
}
