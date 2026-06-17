> **이 파일 전체를 에이전트형 코딩 도구(Claude Code/Cursor)에 붙여넣어 이 페이즈 하나만 실행하세요.**
> 페이즈 사이에 컨텍스트를 초기화합니다. 사용법·순서·게이트는 [00_실행개요.md](./00_실행개요.md) 참조.
> 정본: [00_결정 통합](../00_결정/00_결정해야할것_통합.md) · [내부 API 계약](../04_아키텍처_API/02_내부API_인터페이스.md) · [불변식 INV-1~8](../99_AI참조/01_실측제약_불변식.md)

# 페이즈 7: 답변 생성 · 출처 인용 · CLI

### 이 페이즈의 목표 (1~2문장)
검색(+선택 리랭킹)으로 모은 상위 청크를 컨텍스트로 로컬 LLM에 질의해 **출처가 달린 답변**을 생성하는 `answer()`와, 이를 호출하는 CLI 진입점을 구현한다. 근거가 부족하면 추측하지 않고 "확실하지 않습니다"로 닫고, 모든 LLM 호출은 reasoning 폴백 게이트(`chat()` 래퍼)를 경유해 content 빈값/length를 흡수한다.

### 사전 조건 (이전 페이즈 산출물 — 파일에서 상태 확인)
이 페이즈는 컨텍스트 초기화 후 단독 실행된다. 시작 전 아래를 **파일 존재·시그니처로 직접 확인**하라(없으면 이 페이즈 진행 금지, 누락 파일 보고 후 중단).

```bash
# 필수 선행 산출물 존재 확인
ls -1 src/llm/client.py src/retrieve/search.py src/store/vector_store.py config/settings.yaml
# chat() 래퍼 시그니처·폴백 로직 확인 (content 빈값→reasoning_content, length 재시도, _clean_reasoning 존재)
grep -n "def chat" src/llm/client.py
grep -n "reasoning_content\|_clean_reasoning\|finish_reason" src/llm/client.py
# search() 시그니처·SearchHit/Chunk 타입 확인 (citation 매핑에 doc_id/source_path/meta 필드 필요)
grep -n "def search\|class SearchHit\|class Chunk" src/retrieve/search.py src/**/types*.py 2>/dev/null
# rerank()는 선택 의존성 — 있으면 경유, 없으면 우회
grep -n "def rerank" src/retrieve/rerank.py 2>/dev/null || echo "RERANK_ABSENT"
```

확인 계약(이전 페이즈에서 고정된 것, 그대로 사용):
- `chat(messages, model="google/gemma-4-e4b", max_tokens=4000, _retry=True, **kw) -> str` — content/reasoning 분기를 호출자가 몰라도 되고 **항상 평문 str** 반환. length 재시도·`<think>` 정제는 래퍼 내부 책임.
- `search(query, *, top_k=30, use_bm25=True) -> list[SearchHit]` — score 내림차순.
- `rerank(query, hits, *, top_n=5) -> list[SearchHit]` — 존재 시에만 사용.
- 타입: `Chunk(chunk_id, doc_id, text, source_path, chunk_index, meta)`, `SearchHit(chunk, score, rank, source∈dense|bm25|rrf|rerank)`.
  - **주의**: `SearchHit.source`는 검색 단계 표식(dense|bm25|rrf|rerank)이며 **citation의 출처 경로와 무관**하다. citation 출처는 `Chunk.source_path`에서 유도한다. 위치 정보(page/section)는 `Chunk.meta`에 있으면 쓰고, 없으면 키를 생략한다(`chunk_index`는 meta 보조 위치로만).

> `chat()` / `search()` 시그니처가 위와 다르면 **answer()를 그쪽에 맞춰 호출하지 말고**, 먼저 불일치를 보고하라. 이 페이즈에서 선행 래퍼의 시그니처를 바꾸지 않는다.

### 절대 규칙 (이 페이즈에서 위반 금지 — 관련 INV 발췌)
- **INV-3 외부 API 금지**: `answer()`/`cli`는 LLM에 직접 `openai` 클라이언트를 새로 만들지 말고 **반드시 `src/llm/client.py`의 `chat()`만** 호출한다. base_url은 localhost:1234 외 0건.
- **INV-2 content 빈값 → reasoning 폴백**: 빈 답 흡수는 `chat()` 래퍼 책임. `answer()`에서 `/no_think`, `enable_thinking=false`, `reasoning_effort=low` 같은 우회책을 **추가하지 말 것**. `answer()`는 `chat()`이 돌려준 평문 str만 신뢰한다.
- **INV-5 `<think>` 정제**: `answer()`는 `<think>` 처리를 **직접 하지 않는다**(정제는 `_clean_reasoning`/`chat()` 책임). `chat()` 결과를 그대로 답변 본문으로 쓴다.
- **INV-6 length 재시도**: max_tokens 재시도 루프를 `answer()`에 중복 구현 금지. 컨텍스트 예산 초과 방지는 입력 측(컨텍스트 청크 절삭)에서 처리하고, 출력 length 흡수는 `chat()`에 위임한다.
- **INV-4 prompt_tokens=0 불신**: 컨텍스트 예산 계산은 `usage.prompt_tokens`가 아니라 **문자 수 기반**으로 한다(로컬 토크나이저 가드가 있으면 사용, 없으면 문자 수). fail-closed: 예산 초과 시 무음 통과 금지, 청크를 잘라내고 그 사실을 메타에 남긴다.
- **인용 무결성(내부 키 = chunk_id)**: 컨텍스트 직렬화 라벨과 부분집합 검증에는 `chunk_id`를 **내부 키**로 쓴다. 단 **외부로 내보내는 citation 객체는 정본 스키마**(`doc_id`/`source_path`/`page`|`section`)로 변환해 채운다. 부분집합 무결성은 "각 citation이 가리키는 청크의 `doc_id`·`source_path`가 `chat()`에 실제 전달한 컨텍스트 청크들의 `doc_id`·`source_path` 집합의 부분집합"으로 검증한다(컨텍스트에 없는 출처 발명 금지).
- **추측 금지**: 근거 청크가 비었거나 점수가 임계 미달이면 LLM에 생성시키지 말고 `"확실하지 않습니다. ..."`로 닫는다.

### 작업 지시 (구체적 단계)

**1. `src/app/answer.py` 생성** — 시그니처 고정:
```python
def answer(query, *, model="google/gemma-4-e4b", top_n=5) -> dict:
    # 반환: {"text": str, "citations": list[dict]}
    # citation 객체 = {"doc_id": str, "source_path": str, "page": int}  또는
    #                 {"doc_id": str, "source_path": str, "section": str}
    #                 (page/section은 Chunk.meta에서 유도, 없으면 위치 키 생략)
```
구현 단계:
1. `search(query, top_k=30, use_bm25=True)`로 후보 수집(score 내림차순).
2. `src/retrieve/rerank.py`에 `rerank`가 있으면 `rerank(query, hits, top_n=top_n)`로 상위 `top_n` 추림. 없으면 hits 상위 `top_n` 슬라이스. (둘 중 무엇을 썼는지 결과 메타에 `"reranked": bool`로 기록.)
3. **근거 부족 가드(추측 금지)**: 추린 hits가 비었으면 즉시
   `{"text": "확실하지 않습니다. 관련 문서를 찾지 못했습니다.", "citations": []}` 반환.
4. **컨텍스트 예산 절삭(INV-4, 문자 기준)**: 모델별 ctx 한계를 `config/settings.yaml`에서 읽되, 없으면 모델명으로 폴백한다. 폴백 매핑은 fully-qualified id 기준으로도 동작해야 한다 — `model`에서 `"/"` 앞 공급자 접두(`google/`, `qwen/`)를 제거(또는 `endswith` 매칭)해 **정규화한 뒤** 조회한다(`google/gemma-4-e4b`/`gemma-4-e4b`→65536, `qwen/qwen3.5-9b`/`qwen3.5-9b`→8192, `qwen/qwen3.6-35b-a3b`/`qwen3.6-35b-a3b`→8192; ctx는 실측, 파라미터수는 [추정]). 정규화 후에도 미스면 보수적 최소 폴백(8192)으로 fail-closed. **출력 여유분과 프롬프트 골격을 뺀 문자 예산**을 잡고, 컨텍스트 청크를 순서대로 누적하다 예산 초과 직전에서 멈춘다. 절삭이 일어나면 그 사실을 결과 메타에 남긴다(무음 통과 금지). `usage.prompt_tokens` 사용 금지.
5. **프롬프트 구성**: 시스템 메시지에 규칙(제공 컨텍스트만 근거로, 모르면 "확실하지 않습니다", 답변 끝에 사용한 출처를 청크 라벨로 표기)을 넣고, 각 컨텍스트 청크를 **고유 라벨(예 `[1] (chunk_id=...)`)** 과 함께 user 메시지에 직렬화한다. **라벨↔Chunk 매핑**(라벨 → 해당 Chunk 객체 전체)을 보관한다 — 인용 변환 시 `doc_id`/`source_path`/`meta`를 꺼내야 하므로 chunk_id만이 아니라 Chunk 참조를 잡아둔다.
6. **생성**: `chat(messages, model=model, max_tokens=4000)` 호출(평문 str 수신). 빈값/length는 `chat()`가 이미 흡수했다고 신뢰 — `answer()`에서 재처리 금지.
7. **인용 추출·변환(무결성)**: 생성 텍스트에서 사용된 라벨/chunk_id를 파싱해 매핑으로 해당 Chunk를 복원한다. **전달한 컨텍스트 청크 집합과 교집합만** 채택(부분집합 강제, 컨텍스트 밖 식별자 폐기). 모델이 출처를 안 달았으면 컨텍스트 상위 청크를 보수적으로 채우되, 발명은 금지. 채택된 각 Chunk를 **정본 citation 객체로 변환**한다:
   - `doc_id` ← `Chunk.doc_id`
   - `source_path` ← `Chunk.source_path` (이름 충돌 회피: `SearchHit.source`(단계 표식)와 무관, 절대 `source` 키로 내보내지 말 것)
   - 위치 ← `Chunk.meta`에 `page`가 있으면 `{"page": ...}`, `section`이 있으면 `{"section": ...}`; 둘 다 없으면 위치 키 생략(보조로 `chunk_index`만 meta에 보존, citation 최상위 위치 필드로는 쓰지 않음).
   - `chunk_id`는 **citation 출력 필드로 노출하지 않는다**(내부 부분집합 검증 전용). 디버깅용으로 남기려면 메타(`result["meta"]`) 쪽에만 둔다.
8. **공백/거부 응답 처리**: `chat()`가 빈 문자열을 돌려준 극단 케이스(폴백까지 빈값)면 `"확실하지 않습니다. 답변을 생성하지 못했습니다."`로 닫는다(무음 빈답 금지, citations는 그대로 둘 수 있음).

**2. `src/app/cli.py` 생성** — 진입점:
- `argparse`(또는 표준 라이브러리만)로 `ask` 서브커맨드: `query`(위치 인자), `--model`(기본 `google/gemma-4-e4b`), `--top-n`(기본 5).
- `answer(query, model=..., top_n=...)` 호출 후 사람이 읽을 형식으로 출력: 본문 → 빈 줄 → `출처:` 목록. 각 줄은 정본 citation 필드에서 구성(`[n] {source_path} (page={page})` 또는 `(section={section})`, 위치 키가 없으면 경로만).
- `python -m src.app.cli ask "..."`로 실행되도록 `if __name__ == "__main__":` 가드 + 패키지 `__init__.py` 보장.

**3. 설정 키 보강(신규 도입 — 선행 페이즈에 없음)**: `config/settings.yaml`에 모델별 ctx 예산 힌트 키(`ctx_chars` 또는 `ctx_tokens`)를 추가한다. **이 키들은 이전 페이즈의 settings 문서화 키(모델명·청크크기·top_k·dim/norm/metric)에 존재하지 않는 신규 키**이므로, 실행자는 "이미 있어야 할 키"로 오인하지 말 것 — 없는 게 정상이며 이 페이즈에서 처음 추가한다. 폴백 상수(65536/8192/8192)와 정규화 키 이름(`gemma-4-e4b`/`qwen3.5-9b`/`qwen3.6-35b-a3b`)을 주석으로 함께 기록해 코드 폴백과 일치시킨다.

### 산출물 (생성/수정되는 파일)
- 생성: `src/app/answer.py`
- 생성: `src/app/cli.py`
- 생성(없으면): `src/app/__init__.py`
- 수정(필요 시): `config/settings.yaml` (모델별 ctx 예산 힌트 — 신규 키)
- 생성: `tests/test_answer.py` (아래 완료 기준 검증용)

### 완료 기준 (통과 못 하면 다음 페이즈 금지)
1. **폴백 게이트 경유 검증(최우선)**: `answer()`가 LLM을 직접 호출하지 않고 `src/llm/client.py:chat()`만 경유함을 증명한다. `grep -n "import openai\|OpenAI(" src/app/answer.py`가 **0건**, `grep -n "from .*llm.*client import chat\|client.chat\|chat(" src/app/answer.py`가 chat() 호출을 보여야 한다. **이 검증 전에는 "완성" 보고 금지.**
2. **인용 스키마·부분집합 불변식**: 각 citation 객체가 정본 스키마 `{"doc_id", "source_path", "page"|"section"(선택)}`를 따르고 `source`·`location`·`chunk_id` 키를 최상위에 노출하지 않음을 단위 테스트로 단언. 더하여 **모든 citation의 `doc_id`·`source_path`가 컨텍스트로 전달된 청크들의 `doc_id`·`source_path` 집합의 부분집합**임을 단언(`chat`을 가짜 응답으로 monkeypatch).
3. **추측 금지**: 검색 결과 0건일 때 `text`가 `"확실하지 않습니다"`로 시작하고 `citations == []`.
4. **빈 content 흡수**: `chat`을 빈 문자열 반환으로 monkeypatch했을 때 `answer()`가 무음 빈답을 내지 않고 "확실하지 않습니다..." 또는 비빈 폴백 메시지를 반환.
5. **컨텍스트 예산(INV-4)**: 과도하게 긴 청크 다수를 주입했을 때 `chat`에 전달된 메시지 총 문자 수가 모델 ctx 예산 이하이고, 절삭 사실이 메타에 기록됨(테스트로 `chat` 인자 캡처해 단언). fully-qualified 모델 id(`google/gemma-4-e4b`)로 호출해도 폴백 매핑이 정규화로 적중함을 단언. `usage.prompt_tokens`에 의존하지 않음.
6. **CLI 스모크**: `python -m src.app.cli ask "테스트 질의"`가 예외 없이 본문+출처를 출력(검색/LLM은 가짜로 대체 가능).

### 검증 명령 (복붙 실행)
```bash
# 1) 폴백 게이트 경유 (외부 API 직호출 0건 + chat() 경유)
grep -nE "import openai|OpenAI\(" src/app/answer.py && echo "FAIL: 외부 API 직호출" || echo "OK: 외부 API 직호출 없음"
grep -nE "from .*llm.*client import|chat\(" src/app/answer.py | head

# 2) citation 스키마 위반 키가 최상위로 새지 않는지 (source/location 키, chunk_id 노출 금지)
grep -nE "\"source\"|'source'|\"location\"|'location'" src/app/answer.py | head

# 3) 단위 테스트 (chat/search monkeypatch — 외부 호출 없이 결정적)
python -m pytest tests/test_answer.py -q

# 4) 인용 스키마·부분집합·추측금지·예산·정규화 단언이 테스트에 존재하는지 확인
grep -nE "doc_id|source_path|subset|부분집합|확실하지 않습니다|ctx|budget|예산|normaliz|정규화" tests/test_answer.py | head

# 5) CLI 스모크 (search/chat를 가짜로 대체한 경로로 1회)
python -m src.app.cli ask "연차 휴가 신청 절차" --top-n 5
```

테스트 골격(참고 — `tests/test_answer.py`에 포함):
```python
def test_citation_schema_and_subset(monkeypatch):
    # search → 알려진 (doc_id, source_path, meta={"page":..}) 청크 반환
    # chat → 일부 라벨/chunk_id 인용한 가짜 답
    # 단언 1: 각 citation 키 == {"doc_id","source_path"}(+선택 "page"|"section"), "source"/"location"/"chunk_id" 키 없음
    # 단언 2: 모든 (citation["doc_id"], citation["source_path"]) in 전달된 컨텍스트 청크 (doc_id, source_path) 집합
    ...
def test_no_hits_no_guess(monkeypatch):
    # search → [] ; 단언: text.startswith("확실하지 않습니다") and citations == []
    ...
def test_empty_content_absorbed(monkeypatch):
    # chat → "" ; 단언: text 비어있지 않음, 무음 빈답 아님
    ...
def test_context_budget_chars(monkeypatch):
    # 거대한 청크 다수 주입, model="google/gemma-4-e4b"로 호출, chat 인자 캡처
    # 단언: 총 문자수 <= 정규화된 모델 예산, 메타에 절삭 기록, fully-qualified id가 폴백 매핑에 적중
    ...
```

### 다음 페이즈 핸드오프 (다음 페이즈가 의존하는 것)
`answer(query, *, model, top_n) -> {"text", "citations"}`가 폴백 게이트 경유로 동작하고, citation이 정본 스키마(`doc_id`/`source_path`/`page`|`section`)를 따르며 `doc_id`·`source_path` 부분집합 무결성이 보장됨 → L3(리랭킹 정식 도입·로컬 서빙·자동화)는 `src/retrieve/rerank.py`의 `rerank()`를 실제 BGE-reranker-v2-m3로 채워 `answer()`의 rerank 분기를 활성화하고, 골든셋 평가에 답변 품질 회귀를 연결한다.
