# 04-02. 내부 API / 인터페이스 명세

핵심 내부 함수(chat·embed 래퍼, chunk, search, rerank, evaluate)의 입출력 계약·타입·에러처리(reasoning 폴백·norm 가드·입력 가드)를 정의합니다. 외부 HTTP API가 아니라 모듈 간 함수 계약입니다.

> 관련: [상위문서] [04_아키텍처_API/01_모듈설계.md](./01_모듈설계.md) `[작성예정]` · 정본 SSOT [시작프롬프트.md](../../시작프롬프트.md)

> **참고 — 상위 문서 미작성**: 외부 REST/CLI 인터페이스 경계와 모듈 책임 배치를 다룰 `01_모듈설계.md`는 아직 **작성 전**입니다(`[작성예정]`). 형제 문서 [03_개발환경셋업.md](../01_시스템구성/03_개발환경셋업.md) §5도 같은 파일을 `01_모듈설계.md`로 부르므로 파일명은 이 이름으로 통일합니다. 생성 전까지 외부 인터페이스 계약을 찾는 독자는 정본 SSOT [시작프롬프트.md](../../시작프롬프트.md) §B-1·§B-11을 직접 참조하십시오.

---

## 0. 이 문서의 범위와 비범위

| 구분 | 내용 |
| --- | --- |
| **범위** | 내부 모듈 경계의 **함수 시그니처·타입·반환 계약·예외/폴백 동작**. 호출자가 의존해도 되는 불변식 |
| **비범위** | 외부 REST/CLI 인터페이스(→ [01_모듈설계.md](./01_모듈설계.md) `[작성예정]`, 생성 전에는 SSOT §B-1·§B-11), 데이터 스키마·인덱스 헤더(→ [03_DATABASE/00_벡터스토어_스키마.md](../03_DATABASE/00_벡터스토어_스키마.md)), 평가 지표 정의(→ 시작프롬프트.md §B-8) |

- 본 명세의 **함수 분할·파일 위치는 시작프롬프트.md §B-11 디렉토리 구조를 따릅니다.** 특히 **임베딩 래퍼 `embed()`는 §B-11대로 `src/embed/embedder.py`에 둡니다**(LLM 생성 래퍼 `chat()`만 `src/llm/client.py`). §2의 두 절은 서로 다른 파일에 위치하며, 본 문서는 편의상 "LLM·임베딩 래퍼"로 묶어 §2에서 함께 다룹니다.
- **현재 코드는 없습니다**(시작프롬프트.md §B-12: "코드 없음·스택 미확정"). 본 문서는 **구현 시 지켜야 할 계약**을 규정하는 설계 문서이며, 실제 코드가 작성되면 시그니처는 이 계약과 일치해야 합니다.
- 시그니처는 Python 3.11+ 타입 힌트 표기를 씁니다. **스택은 미확정**이므로 라이브러리 결정 포인트는 → 시작프롬프트.md §B-6·§B-9 참조.

---

## 1. 공통 타입 정의

모듈 간 주고받는 데이터 단위입니다. 실제 직렬화 스키마(벡터스토어 컬럼 등)는 → [03_DATABASE/00_벡터스토어_스키마.md](../03_DATABASE/00_벡터스토어_스키마.md) 참조. 여기서는 **함수 시그니처에 쓰이는 인메모리 타입**만 정의합니다.

```python
from dataclasses import dataclass, field
from typing import TypedDict

Vector = list[float]   # 임베딩 벡터. 현재 모델은 len=768, norm=1.0 (시작프롬프트.md §B-12)

@dataclass
class Chunk:
    """청킹 산출물. 임베딩·인덱싱·검색에서 동일하게 흐른다."""
    chunk_id: str          # 전역 고유 ID (예: f"{doc_id}#{chunk_index}")
    doc_id: str            # 원본 문서 ID
    text: str              # 청크 본문 (한국어, 길이 제어는 '문자 수' 기준 — §B-2)
    source_path: str       # 원본 파일 경로
    chunk_index: int       # 문서 내 순번
    meta: dict = field(default_factory=dict)  # page/section 등 원문 위치

@dataclass
class SearchHit:
    """검색/리랭킹이 반환하는 단일 결과."""
    chunk: Chunk
    score: float           # 검색기 스케일 의존 점수 (단계마다 의미가 다름 — 1.4 주의)
    rank: int              # 0부터. 정렬 순위
    source: str            # "dense" | "bm25" | "rrf" | "rerank" — 어느 단계 점수인지

class EvalResult(TypedDict):
    """평가 하네스 반환. 지표 정의는 시작프롬프트.md §B-8."""
    recall_at_1: float
    recall_at_3: float
    recall_at_5: float
    recall_at_10: float
    mrr: float
    ndcg_at_10: float
    per_query: list[dict]  # 질의별 상세 (회귀 케이스 추적용)
```

**계약 주의**: `Chunk.text`의 길이는 **문자 수**로 제어합니다. `usage.prompt_tokens=0` 오보고(시작프롬프트.md §B-12)로 토큰 카운트를 신뢰할 수 없기 때문입니다. → 시작프롬프트.md §B-2 ② 참조.

---

## 2. LLM·임베딩 래퍼 — 핵심

세 생성 모델 공통의 **reasoning_content 이슈**(시작프롬프트.md §B-4)와 임베딩 **norm 불변식**(§B-12)을 흡수하는 가장 중요한 경계입니다. 두 래퍼는 서로 다른 파일에 위치합니다.

- `chat()` → `src/llm/client.py` (생성 래퍼, §B-11)
- `embed()` → `src/embed/embedder.py` (임베딩 래퍼, §B-11)

정본 코드는 → 시작프롬프트.md §B-7 참조. 여기서는 **호출자가 의존하는 계약**을 규정합니다.

> **역참조**: 본 §2의 `Vector` 타입·norm 가드는 [03_DATABASE/00_벡터스토어_스키마.md](../03_DATABASE/00_벡터스토어_스키마.md) §2(metric·정규화)와 묶입니다. §7 에러처리 표는 [05_운영_평가/01_운영_런북.md](../05_운영_평가/01_운영_런북.md) §3.3(reasoning 이슈)에서 들어옵니다.

### 2.1 `chat()` — 생성 호출 래퍼 (`src/llm/client.py`)

```python
def chat(
    messages: list[dict],
    model: str = "google/gemma-4-e4b",
    max_tokens: int = 4000,
    _retry: bool = True,
    **kw,
) -> str: ...
```

| 항목 | 계약 |
| --- | --- |
| **입력** | `messages`: OpenAI chat 포맷(`[{"role","content"}, ...]`). `model`: §B-3의 3종 중 하나(기본 `gemma-4-e4b`, ctx 65536). `**kw`: temperature 등 통과 |
| **반환** | **항상 `str`**. 호출자는 `content` vs `reasoning_content` 분기를 알 필요 없음 — 래퍼가 단일 평문 답으로 정규화 |
| **불변식 1 — 폴백** | `message.content`가 빈 문자열이면 `message.reasoning_content`로 폴백한다. **세 모델 모두에서 재현된 실측**이므로 선택이 아니라 필수(§B-4) |
| **불변식 2 — 정제** | 폴백 시 `<think>…</think>` 제거·최종답 추출(`_clean_reasoning`, 2.1.1)을 거친 뒤 반환한다. 정제를 건너뛰면 사고과정 전체가 노출됨 |
| **불변식 3 — length 재시도** | `finish_reason == "length"`이고 `_retry`면 `max_tokens*3`으로 **1회** 재시도한다. 무한 사고로 잘림이 상시 발생("한 문장" 질문에 12,972자, §B-12) |
| **재시도 실패 시** | 2회째도 `length`면 잘린 답에 `[경고] ... finish_reason=length ...` 안내를 덧붙여 반환(빈값 방치 금지) |
| **에러 전파** | 네트워크/모델 미로드 등 SDK 예외는 **삼키지 않고 그대로 전파**한다. 호출자가 재시도·폴백 모델 전환을 결정 |

**기본 모델 크기 [추정]**: 기본값 `gemma-4-e4b`의 ctx 65536은 §B-3 실측이나, 모델 **크기(4B급)는 [추정]**입니다(§B-12: 9B/4B 크기 추정). 마찬가지로 `qwen3.5-9b`의 9B도 [추정]입니다. → 시작프롬프트.md §B-3 참조.

**무효 확인된 우회책(코드에 넣지 말 것)**: `/no_think`, `chat_template_kwargs.enable_thinking=false`, `reasoning_effort=low`, `max_tokens=4000` — 전부 효과 없음(실측, §B-4). 근본 해결은 LMStudio 프리셋의 reasoning 종료 토큰(`</think>`/EOS) 설정이며 정확한 메뉴 위치는 버전 의존 [확인필요].

**계약 안정성 경고**: `reasoning_content` 속성명·`<think>` 구분자는 모델 프리셋에 의존합니다. 폴백·정제 로직은 모델별로 달라질 수 있으므로 **이 래퍼 한 곳에만 가둡니다**(호출부 분산 금지).

#### 2.1.1 `_clean_reasoning()` — 정제 보조 (정제 실패 폴백 계약 포함)

```python
def _clean_reasoning(raw: str) -> str: ...
```

| 항목 | 계약 |
| --- | --- |
| **목적** | `reasoning_content` 원문에서 `<think>…</think>` 블록을 제거하고 **최종답만** 추출 |
| **정상 경로** | `<think>…</think>` 쌍 또는 닫는 `</think>`만 있는 경우 → 해당 블록 이후 텍스트 반환(§B-7 정제 regex) |
| **불변식 — 정제 실패 폴백** | `<think>` 구분자가 **없거나 다른 토큰**(모델 프리셋 변경)이라 최종답을 분리하지 못하면, **빈 문자열을 반환하지 않는다.** **원문 `reasoning_content`를 그대로 반환하되 선두에 `[경고] reasoning 구분자 불일치 — 원문 반환` 표식을 부착**한다. "무음 실패(빈 답)"는 금지 |
| **이유** | §B-7 regex는 `<think>` 계열만 처리한다. 다른 구분자 모델로 교체 시 무음 실패하면 답이 사라진 것처럼 보여 디버깅 불가. 경고 표식이 모델 프리셋 점검(§B-4)을 유도 |

### 2.2 `embed()` — 임베딩 호출 래퍼 (`src/embed/embedder.py`)

> **위치 정렬(§B-11)**: 본 래퍼는 `src/llm/client.py`가 아니라 **`src/embed/embedder.py`** 에 있습니다(§B-11 디렉토리 구조). 입력 가드(3.2)도 같은 파일에 위치합니다.

```python
def embed(
    texts: list[str],
    model: str = "text-embedding-nomic-embed-text-v1.5",
) -> list[Vector]: ...
```

| 항목 | 계약 |
| --- | --- |
| **입력** | `texts`: 임베딩할 문자열 리스트. **배치 한계는 Phase 0 실측 후 호출자가 분할**(§B-2 ③). 입력 길이 한계는 임베딩 입력 가드(3.2)에서 사전 검사 |
| **빈 입력 계약** | `texts == []`이면 **즉시 `[]`를 반환**한다(norm 가드·모델 호출 스킵). 빈 배치에서 첫 벡터에 접근해 `IndexError`를 내지 않는다 |
| **반환** | `list[Vector]` — 입력 순서와 1:1 대응. 현재 모델은 각 벡터 `len=768`, `norm≈1.0` |
| **불변식 1 — 재정규화 금지** | 출력은 **이미 L2 정규화됨**(norm=1.0). 코드에서 다시 정규화하지 않는다. 정규화 벡터끼리는 코사인=내적이므로 metric은 dot/cosine 동일(§B-12, §A-2 ①) |
| **불변식 2 — norm 가드** | 비어 있지 않은 결과에 대해 **반환 직전 모든 벡터의 `abs(norm - 1.0) < 1e-3`를 assert**한다. 모델 교체(BGE-M3 등)로 정규화가 깨지면 여기서 즉시 감지 → 정규화 분기·metric 재검토 유도 |
| **토큰 무신뢰** | `usage.prompt_tokens=0`은 오보고이므로 길이 판단에 쓰지 않는다(입력 가드는 3.2에서 별도 처리) |

**norm 가드 동작 (빈 입력 가드 + 전체 배치 검사)**:

```python
import math

def _assert_normalized(vecs: list[Vector]) -> None:
    # 빈 입력은 가드 스킵 — vecs[0] 무방비 접근 금지(IndexError 방지)
    if not vecs:
        return
    for i, v in enumerate(vecs):
        n = math.sqrt(sum(x * x for x in v))
        assert abs(n - 1.0) < 1e-3, (
            f"임베딩 norm={n:.4f} (1.0 아님, idx={i}). 모델 교체로 정규화가 깨졌을 수 있습니다. "
            f"metric/정규화 분기를 재검토하세요(A-2 ①)."
        )
```

> **SSOT 차이 안내**: 시작프롬프트.md §B-7 발췌는 `vecs[0]`(1개 샘플)만 검사합니다. 본 문서는 빈 입력 `IndexError`(실측 크래시 유형)와 부분 비정규화 누락을 막기 위해 **빈 입력 가드 + 배치 전체 검사**로 강화합니다. SSOT 코드와 동작 방향은 동일하며(정규화 깨짐 즉시 감지), 더 엄격할 뿐입니다. 모순 시 본 강화 계약을 따릅니다.

**모델 교체 시 계약 변화**: BGE-M3로 교체하면 `Vector` 길이가 768→1024로 바뀌고 norm 보장이 깨질 수 있습니다(**DECISION** — §B-9 #2). 컨텍스트 측면은 BGE-M3 **ctx 8192**(§B-12 실측)로 현재 nomic과 사실상 동등하며, 생성 모델 기본값(gemma ctx 65536)과는 별개 축이므로 §5 컨텍스트 예산에 직접 영향은 없습니다(임베딩 입력 한계는 3.2에서 별도 관리). norm 가드가 트립하면 **재정규화 분기를 추가**하고 인덱스를 재생성합니다. → 시작프롬프트.md §B-5·§B-12 참조.

---

## 3. 인제스트 인터페이스 (`src/ingest/`)

### 3.1 `chunk()` — 한국어 청킹 (`src/ingest/chunker.py`)

```python
def chunk(
    doc: dict,                    # {text, doc_id, source_path, meta} (로딩 산출물)
    *,
    max_chars: int = 500,         # 길이 제어는 '문자 수' 기준 (토큰 아님 — §B-2)
    overlap_chars: int = 80,
    doc_type: str = "manual",     # "manual" | "report" | "technical" — 프리셋 선택
) -> list[Chunk]: ...
```

| 항목 | 계약 |
| --- | --- |
| **반환** | `list[Chunk]` — `chunk_index` 오름차순, 빈 청크·공백-only 청크 미포함 |
| **문장 경계** | 한국어 종결어미(`-다.`/`-요.`/`-까?`)와 소수점·약어를 혼동하지 않는다. 단순 `.` 분할 **금지**. KSS 등 한국어 문장 분리기 사용(라이브러리 → §B-6·§B-9 #6) |
| **의미 단위 우선** | "제N조"·"1." 등 구조 마커를 청크 경계로 우선 사용(§B-2 ②) |
| **불변식 — 입력 가드** | 어떤 반환 청크도 `len(text)`(문자)가 임베딩 입력 한계를 넘지 않는다. 초과 시 분할. `prompt_tokens=0`이라 모델이 초과를 알려주지 않으므로 **이 가드가 없으면 무음 잘림**(§B-2 ②③·§A-2 ②) |

**기본값 출처 [추정]**: `max_chars=500`·`overlap_chars=80` 기본값은 시작프롬프트.md **§B-2의 문서 유형별 권장 표**(사규/매뉴얼 300~500자·오버랩 50~100자 등)에서 가져온 **추정값**입니다(`max_chars`는 권장 범위 상단). 반드시 §B-8 Recall@k로 검증하며 조정합니다.

### 3.2 임베딩 입력 가드 (`src/embed/embedder.py` 내부 계약)

`chunk()`와 `embed()` 사이에서 입력 한계를 강제하는 경계입니다. `embed()`와 동일 파일(§B-11)에 둡니다.

```python
# nomic-v1.5 입력 한계 [확인필요](Phase 0 미측정).
# 측정 전 보수적 상한 — fail-closed 기본값(무음 통과 금지).
DEFAULT_MAX_CHARS_FALLBACK = 1000  # [추정] Phase 0 측정 즉시 settings.yaml 실측값으로 교체

def assert_within_embed_limit(text: str, max_chars: int = DEFAULT_MAX_CHARS_FALLBACK) -> None:
    """임베딩 입력 한계 초과 시 예외. 무음 잘림 방지."""
```

| 항목 | 계약 |
| --- | --- |
| **판정 기준** | **문자 수 1차**. 토큰 기준이 필요하면 해당 모델 HF 토크나이저로 로컬 계산(`tiktoken`은 OpenAI BPE라 nomic/BGE-M3와 불일치 → 근사 폴백용만 — §B-2 ②) |
| **한계값** | nomic-v1.5 입력 최대 길이는 **[확인필요]**. Phase 0 환경 점검에서 짧은/긴 입력으로 직접 측정(§A-4-1) |
| **기본값(미측정 상태)** | Phase 0 측정 전에는 `max_chars` 인자를 생략하면 **보수적 상한 `DEFAULT_MAX_CHARS_FALLBACK=1000자([추정])`** 가 적용된다. 측정 즉시 `config/settings.yaml`의 실측값으로 교체한다 |
| **동작(fail-closed)** | 초과 시 **명시적 예외 발생**(또는 호출자가 명시적으로 재분할). **무음 통과는 금지**한다. "측정 안 됐으니 일단 통과"는 허용하지 않음 — 보수 상한으로라도 막는다 |

---

## 4. 검색 인터페이스 (`src/retrieve/`)

### 4.1 `search()` — 하이브리드 1차 검색 (`src/retrieve/search.py`)

```python
def search(
    query: str,
    *,
    top_k: int = 30,              # 1차로 넓게 (20~50) → 이후 리랭킹으로 좁힘
    use_bm25: bool = True,        # 하이브리드 on/off
) -> list[SearchHit]: ...
```

| 항목 | 계약 |
| --- | --- |
| **반환** | `list[SearchHit]` — `score` 내림차순, 길이 ≤ `top_k`. `rank` 0부터 연속 |
| **불변식 — 동일 임베딩 규칙** | 질의 임베딩은 **인덱싱과 동일한 모델·prefix 규칙**으로 생성한다(`embed()` 경유). 모델/규칙이 다르면 검색이 무의미(§B-2 ⑤) |
| **prefix 주의** | nomic은 `search_query:`/`search_document:` prefix 효과 미미(코사인 0.687→0.695, §B-12). **단 e5 계열 교체 시 `query:`/`passage:` prefix는 필수** — nomic 경험을 그대로 적용해 생략하면 품질 급락(§B-5) |
| **결합** | `use_bm25=True`면 dense·BM25 두 랭킹을 `rrf()`(4.2)로 결합. BM25 토큰화는 Kiwi 형태소(§B-6·§B-9 #7) |
| **회귀 보장** | "연차 휴가 신청 절차" 질의는 현재 nomic dense-only에서 정답 3위(Recall@1=0). 이 계약을 만족하는 구현은 §B-8 회귀 케이스로 상시 검증된다 |

### 4.2 `rrf()` — 랭킹 결합 (`src/retrieve/fusion.py`)

정본 코드는 → 시작프롬프트.md §B-6 참조.

```python
def rrf(rank_lists: list[list[str]], k: int = 60) -> dict[str, float]: ...
```

| 항목 | 계약 |
| --- | --- |
| **입력** | `rank_lists`: 각 검색기의 **chunk_id 순위 리스트**(예: `[dense_ranking, bm25_ranking]`). 점수가 아니라 **순위만** 사용 |
| **반환** | `{chunk_id: rrf_score}` — 점수 내림차순 정렬된 dict |
| **불변식** | 점수 스케일 무관. dense·BM25 점수 스케일이 달라도 순위 기반이라 안전. `k` 기본 60 |

### 4.3 `rerank()` — 리랭킹 (`src/retrieve/rerank.py`, 선택)

```python
def rerank(
    query: str,
    hits: list[SearchHit],
    *,
    top_n: int = 5,               # 넓게 받은 1차 결과를 좁게 정제
) -> list[SearchHit]: ...
```

| 항목 | 계약 |
| --- | --- |
| **입력** | `search()`의 1차 결과(20~50개). cross-encoder로 재점수 |
| **반환** | `list[SearchHit]` — `source="rerank"`, 길이 ≤ `top_n`, 재점수 내림차순 |
| **목적** | 1차 순위 오류 교정. "정답 3위/오답보다 -0.018" 실패는 리랭커로 직접 교정 가능한 유형(§B-2 ⑥·§A-2 ④) |
| **구동 위치 [추정]** | 외부 API 금지. LMStudio가 cross-encoder를 OpenAI 호환으로 서빙한다는 보장이 없어, `sentence-transformers`/`FlagEmbedding` **별도 로컬 프로세스**가 필요할 수 있음 — Phase 0/L3에서 실측 [확인필요] |
| **도입 시점** | L1 생략 가능, 한국어 품질 미달 시 우선순위 상향(§B-9 #9·§B-10) |
| **권장 모델** | `BGE-reranker-v2-m3`(로컬) 또는 BGE-M3 ColBERT 점수 |

---

## 5. 답변 생성 인터페이스 (`src/app/answer.py`)

```python
def answer(
    query: str,
    *,
    model: str = "google/gemma-4-e4b",
    top_n: int = 5,
) -> dict:    # {"text": str, "citations": list[dict]}
    ...
```

| 항목 | 계약 |
| --- | --- |
| **흐름** | `search()` → (선택) `rerank()` → 상위 청크를 컨텍스트로 `chat()` 호출 |
| **반환** | `{"text": 답변, "citations": [{doc_id, source_path, page/section}, ...]}`. 출처 인용 필수 |
| **불변식 — reasoning 흡수** | `chat()`(2.1)을 경유하므로 content 빈값/length 잘림은 래퍼가 흡수. `answer()`는 reasoning 분기를 직접 다루지 **않는다** |
| **불변식 — 컨텍스트 예산** | 모델별 ctx 한계(qwen 8192 / gemma 65536, §B-3)를 넘지 않도록 청크 수를 제어. 긴 컨텍스트는 gemma, 추론 품질은 qwen(청크 수 축소). 임베딩 모델 교체(nomic→BGE-M3 ctx 8192)는 **임베딩 입력 한계 축(3.2)** 만 바꾸며 생성 ctx 예산과는 별개 |
| **상태** | reasoning 폴백 게이트(§B-4)가 검증되기 전(L2)에는 답변 생성을 "완성"으로 보고하지 않는다(§A-2 ③·§B-10) |

> 모델 기본값 `gemma-4-e4b`의 4B 크기는 [추정]입니다(§B-12). ctx 65536은 §B-3 실측입니다.

---

## 6. 평가 인터페이스 (`eval/evaluate.py`)

지표 정의·측정 절차·정량 목표는 → 시작프롬프트.md §B-8 참조. 여기서는 함수 계약만 규정합니다.

```python
def evaluate(
    golden_path: str = "eval/queries.yaml",  # (질의, 정답_chunk_id 집합) 골든셋
    *,
    k_list: tuple[int, ...] = (1, 3, 5, 10),
    use_bm25: bool = False,                  # 변수 1개씩 변경 측정
    use_rerank: bool = False,
) -> EvalResult: ...
```

| 항목 | 계약 |
| --- | --- |
| **반환** | `EvalResult`(1절) — Recall@{1,3,5,10}, MRR, nDCG@10, 질의별 상세 |
| **불변식 — 변수 1개 원칙** | 한 번에 하나의 변수만 바꿔 측정한다(임베딩/청크/하이브리드/리랭커). 토글 플래그로 강제(§B-8) |
| **불변식 — 회귀 케이스** | 골든셋에 "연차 휴가 신청 절차"(정답=휴가규정) 케이스를 **반드시 포함**. 매 변경마다 통과 여부 추적 |
| **정량 목표** | 회귀 케이스: nomic dense-only `Recall@1=0`(정답 3위, 격차 -0.018) → BGE-M3 교체 또는 리랭커 도입 후 `Recall@1=1` 목표(§B-8) |

---

## 7. 에러처리·폴백 계약 요약

내부 API 전반의 방어 동작입니다. 모두 **실측 제약**(시작프롬프트.md §B-12)에서 유도됩니다. 이 표는 [05_운영_평가/01_운영_런북.md](../05_운영_평가/01_운영_런북.md) §3.3에서 역참조됩니다.

| 위치 | 트리거 | 동작 | 출처 |
| --- | --- | --- | --- |
| `chat()` | `content` 빈 문자열 | `reasoning_content` 폴백 | §B-4 |
| `chat()` | 폴백 결과에 `<think>` 포함 | 정제(블록 제거·최종답 추출) | §B-4·§B-7 |
| `_clean_reasoning()` | 정제 구분자 불일치(`<think>` 부재) | **원문 반환 + `[경고]` 표식**(무음 빈 답 금지) | §B-7·본 문서 §2.1.1 |
| `chat()` | `finish_reason="length"` | `max_tokens*3`로 1회 재시도, 2회째도 length면 경고 부착 | §B-4·§B-7 |
| `embed()` | `texts==[]` | `[]` 즉시 반환(가드 스킵, `IndexError` 방지) | 본 문서 §2.2 |
| `embed()` | `norm != 1.0` (±1e-3) | 배치 전체 assert 트립 → 정규화/metric 분기 재검토 | §B-12·§A-2 ① |
| 입력 가드(`embedder.py`) | 청크 문자 수 > 임베딩 입력 한계 | 분할 또는 예외(fail-closed, 무음 잘림 차단) | §B-2 ②③ |
| 입력 가드(`embedder.py`) | 한계값 미측정([확인필요]) | 보수 상한(`1000자` [추정])으로 fail-closed 적용 | 본 문서 §3.2 |
| `search()` | 질의·인덱스 임베딩 모델/prefix 불일치 | 무효 검색 — 동일 규칙 강제 | §B-2 ⑤ |
| 공통 | LMStudio SDK 예외(미로드·네트워크) | 삼키지 않고 전파 | 본 문서 §2.1 |

**핵심 원칙**: reasoning·norm·입력 가드 같은 LMStudio 특수 처리는 **각 래퍼 한 곳에만 가둡니다**(`chat()`→`src/llm/client.py`, `embed()`·입력 가드→`src/embed/embedder.py`). 호출부에 흩뿌리면 디버깅이 어려워지고, 얇은 자체 파이프라인을 권장하는 이유와도 직결됩니다(§B-6).

---

> 본 문서의 모든 함수 계약은 정본 SSOT [시작프롬프트.md](../../시작프롬프트.md)의 실측 불변식(§B-7·§B-11·§B-12)과 일치합니다. 단, norm 가드(빈 입력·배치 전체)와 정제 실패 폴백은 실측 크래시·무음 실패 유형을 막기 위해 SSOT 발췌보다 **엄격하게 강화**했으며 동작 방향은 동일합니다. 모순 발견 시 SSOT가 우선합니다.
