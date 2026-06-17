> **이 파일 전체를 에이전트형 코딩 도구(Claude Code/Cursor)에 붙여넣어 이 페이즈 하나만 실행하세요.**
> 페이즈 사이에 컨텍스트를 초기화합니다. 사용법·순서·게이트는 [00_실행개요.md](./00_실행개요.md) 참조.
> 정본: [00_결정 통합](../00_결정/00_결정해야할것_통합.md) · [내부 API 계약](../04_아키텍처_API/02_내부API_인터페이스.md) · [불변식 INV-1~8](../99_AI참조/01_실측제약_불변식.md)

# 페이즈 1: LLM·임베딩 래퍼 (불변식 경계) ★핵심

### 이 페이즈의 목표
docs-em의 모든 LMStudio 특수처리(reasoning 폴백·`<think>` 정제·length 재시도·임베딩 norm 가드·입력 한계 가드)를 단 두 개의 래퍼(`src/llm/client.py`, `src/embed/embedder.py`)에 가두고, 각 불변식을 단위 테스트로 고정한다. 이 두 파일 바깥의 어떤 코드도 LMStudio의 별난 동작을 알 필요가 없어야 한다.

> **참조 코드 우선순위 (먼저 읽고 못 박을 것)**: 시작프롬프트.md `§B-7`에 LLM/임베딩 래퍼의 참조 스니펫이 있다. **이 참조는 골격일 뿐 정본이 아니다.** 본 페이즈의 지시가 `§B-7`과 충돌하는 경우 **본 페이즈 지시가 무조건 우선**한다. 특히 아래 두 지점은 `§B-7` 스니펫이 약한/모호한 버전이므로 **그대로 베끼지 말고 본 페이즈 지시로 덮어쓴다**:
> - (a) `§B-7`의 norm 가드는 `vecs[0]`(첫 원소)만 검사한다 → **약한 버전. 본 페이즈는 배치 전체를 순회해 assert한다.**
> - (b) `§B-7`의 `_clean_reasoning`은 여는 태그 없는 `</think>`만 있어도 `split`으로 정상 추출한다 → **본 페이즈의 close-only 정본 규칙(아래 1-③)으로 덮어쓴다.**

### 사전 조건 (이전 페이즈 산출물 — 컨텍스트 초기화 후 파일에서 상태 확인)
이 페이즈는 docs-em 프로젝트의 **첫 코드 작성 페이즈**이므로 이전 페이즈 코드 산출물은 없다. 다만 환경/설정 골격이 있을 수 있으니 실행 전 아래를 읽어 현재 상태를 확인하라.

```bash
# 프로젝트 루트에서
cat pyproject.toml 2>/dev/null            # 의존성·python 버전 확인 (없으면 신규 생성 대상)
cat .env.example 2>/dev/null              # LMSTUDIO_BASE_URL 키 존재 확인
cat config/settings.yaml 2>/dev/null      # 모델명·dim/norm/metric 플래그 확인
ls src/ src/llm/ src/embed/ tests/ 2>/dev/null # 이미 만든 파일 있는지 확인 (있으면 덮어쓰지 말고 병합)
python -c "import openai, numpy; print('deps ok')" 2>/dev/null
```

확정 환경 사실(발명 금지, 그대로 사용):
- LMStudio 엔드포인트: `http://localhost:1234/v1`, OpenAI 호환, `api_key="lm-studio"`(더미).
- 임베딩 모델: `text-embedding-nomic-embed-text-v1.5` (768차원, 출력 norm=1.0 — 이미 L2 정규화됨).
- 생성 모델 기본값: `google/gemma-4-e4b`. (대안 `qwen3.5-9b`, `qwen3.6-35b-a3b` — 이 페이즈에선 기본값만으로 충분.)
- 런타임 Python 3.11+. LLM 클라이언트는 `openai` SDK(`base_url`만 localhost로). 수치 계산은 `numpy`.

설정 골격이 없으면 이 페이즈 안에서 최소 구성으로 만들되, 모델명·base_url·api_key는 환경변수/`config`에서 읽고 코드에 하드코딩한 fallback만 위 확정값으로 둔다.

### 절대 규칙 (이 페이즈에서 위반 금지인 불변식 — 관련 INV 발췌)
- **INV-1 (임베딩 재정규화 금지)**: nomic 출력은 이미 L2 정규화(norm=1.0)되어 있다. 코드에서 **재정규화하지 마라**. 대신 가드만 둔다: 빈 입력으로 생긴 0-벡터는 가드에서 제외하고, **반환된 벡터 배치의 모든 원소를 순회**하며 `abs(norm - 1.0) < 1e-3` assert(`vecs[0]`만 검사하는 것은 금지). 모델 교체 시 norm 재측정이 필요하므로 이 가드는 무음 통과시키지 말 것.
- **INV-2 (content 빈값 → reasoning_content 폴백)**: 생성모델 3종 모두 `message.content`가 빈 문자열이고 실제 답은 `message.reasoning_content`에 온다. `content`가 비면 `reasoning_content`로 폴백하라. **무효 우회책 4종을 코드에 절대 넣지 마라**: `/no_think`, `enable_thinking=false`, `reasoning_effort=low`, `max_tokens=4000`을 "thinking 끄는 용도"로 넣지 말 것(이들은 전부 무효로 실측됨). `max_tokens`는 일반 길이 제어 인자로만 쓴다.
- **INV-3 (외부 API 금지)**: `base_url`은 `localhost:1234` 외 호출 0건. OpenAI/Anthropic/Cohere 등 외부 클라우드 절대 금지. **이 가드는 모듈 로드 시점**(아래 1-① 참조)**에 발동해야 한다.**
- **INV-4 (prompt_tokens=0 불신 / 입력 가드 fail-closed)**: `usage.prompt_tokens`는 0으로 오보고될 수 있어 신뢰 불가. 길이 판단은 **문자 수** 기준으로 하라. `assert_within_embed_limit`은 fail-closed(한계 초과 시 조용히 통과시키지 말고 예외).
- **INV-5 (`<think>` 정제)**: `reasoning_content`에서 `<think>…</think>`를 제거하고 최종답을 추출하라. 여는/닫는 구분자가 짝이 안 맞으면(아래 1-③의 정본 규칙) **무음 빈답 금지** — 원문 + `[경고]` 표식을 반환.
- **INV-6 (length 재시도)**: `finish_reason == "length"`면 `max_tokens × 3`으로 **딱 1회** 재시도. 2회째에도 length면 경고를 부착해 반환(무한 루프 금지).

### 작업 지시 (파일 경로·시그니처 고정)

#### 0) 패키지 임포트 가능성 보장 (검증명령 4의 사전조건 — 먼저 처리)
검증명령 4는 `import src.llm.client`를 사용하므로, **컨텍스트 초기화 후 단독 실행에서 `ModuleNotFoundError: src`가 나지 않도록** 다음을 보장한다:
- 빈 `src/__init__.py`, `src/llm/__init__.py`, `src/embed/__init__.py`, `tests/__init__.py`를 생성(없으면).
- `pyproject.toml`에 패키지 인식 설정을 추가한다. setuptools 기준 예:
  ```toml
  [tool.setuptools.packages.find]
  where = ["."]
  include = ["src*"]
  ```
  (이미 빌드 백엔드/패키지 설정이 있으면 덮어쓰지 말고 병합. uv/hatchling 환경이면 동등한 `[tool.hatch.build.targets.wheel] packages = ["src"]`로 대체 가능.)
- 위 설정으로도 단독 실행이 불안하면, 검증·테스트는 **프로젝트 루트를 cwd로** 두고 `PYTHONPATH=.`를 전제로 돈다(검증명령 블록에 명시됨).

#### 1) `src/llm/client.py`
공개 함수 시그니처는 아래로 **고정**(변경 금지). 호출자는 content/reasoning 분기를 몰라도 항상 평문 `str`을 받는다.

```python
def chat(messages, model="google/gemma-4-e4b", max_tokens=4000, _retry=True, **kw) -> str: ...
def _clean_reasoning(raw: str) -> str: ...
```

구현 요구:
- **① 모듈 로드 시 클라이언트 1회 생성 + 그 시점에 base_url 가드(INV-3 결합 명시)**: `openai.OpenAI(base_url=..., api_key=...)` 클라이언트를 **모듈 최상위에서 1회 생성**한다. `base_url`은 env `LMSTUDIO_BASE_URL`(기본 `http://localhost:1234/v1`), `api_key`는 env `LMSTUDIO_API_KEY`(기본 `"lm-studio"`). **클라이언트 생성 직전 또는 직후, 모듈 최상위 코드에서** base_url을 검사해 `localhost`(또는 `127.0.0.1`)가 아니면 **즉시 예외**를 던진다.
  - 이 가드는 반드시 **모듈 import 시점**에 돌아야 한다(클래스/모듈 레벨 실행). **`chat()` 함수 내부의 지연 가드는 금지** — 함수 내부로 넣으면 `import src.llm.client`만으로는 예외가 나지 않아 **검증명령 4가 FAIL을 못 잡고 무한 통과**한다. 검증명령 4(`import` + `importlib.reload`로 예외 기대)는 이 모듈-레벨 가드와 1:1로 결합되어 있다.
- **② `chat()`**: `client.chat.completions.create(model=, messages=, max_tokens=, **kw)` 호출.
  - 응답 `msg = resp.choices[0].message`에서 **`msg.content`가 비어 있으면(`None` 또는 공백만) `msg.reasoning_content`로 폴백**(INV-2). 둘 다 비면 `[경고] 빈 응답` 표식 문자열 반환(무음 빈답 금지).
  - 폴백으로 얻은 원문은 `_clean_reasoning()`을 통과시켜 `<think>` 제거(INV-5).
  - `finish_reason == "length"`이고 `_retry`가 True면 `max_tokens*3`, `_retry=False`로 **딱 1회** 재귀 재시도(INV-6). 재시도 결과도 length면 반환 문자열 앞/뒤에 `[경고] length 재시도 후에도 잘림` 표식을 붙여 반환.
  - **금지**: `/no_think` 주입, `enable_thinking`/`reasoning_effort` 같은 thinking-off kwargs 자동 주입(INV-2). `**kw`로 호출자가 명시적으로 넘긴 건 그대로 전달하되, 코드가 알아서 thinking-off 인자를 끼워넣지 말 것.
- **③ `_clean_reasoning(raw)` — 구분자 정본 규칙(§B-7 split-동작 덮어쓰기)**:
  - 정상 케이스: `<think>...</think>` 짝이 맞는(여는·닫는 태그 개수 동일) 블록은 정규식으로 제거하고 남은 텍스트를 strip해 반환.
  - **close-only 정본 결정**: 여는 태그가 없고 `</think>`만 있는 경우(개수 0:1, 불균형)는 **`[경고] think 구분자 불일치`를 붙인 경고 케이스로 처리한다**(원문 strip + 경고 표식 반환). 즉 `§B-7`의 "마지막 `</think>` 이후를 최종답으로 split 추출"하는 동작은 **채택하지 않는다**. (정본: open-only·close-only·기타 불균형은 모두 경고. 균형 0:0 = think 없는 평문은 정상.)
  - 짝이 안 맞거나(여는/닫는 개수 불일치) 정제 후 결과가 비면 → `raw.strip()` 원문에 `[경고] think 구분자 불일치` 표식을 붙여 반환(무음 빈답 금지, INV-5).
  - 정상 케이스(짝 맞고 내용 있음)는 정제된 평문만 반환.

#### 2) `src/embed/embedder.py`
공개 시그니처 **고정**:

```python
Vector = list[float]  # 타입 별칭 — 다음 페이즈 핸드오프 계약(list[Vector])과 일치시킬 것
DEFAULT_MAX_CHARS_FALLBACK = 1000

def embed(texts: list[str], model="text-embedding-nomic-embed-text-v1.5") -> list[Vector]: ...
def assert_within_embed_limit(text, max_chars=DEFAULT_MAX_CHARS_FALLBACK) -> None: ...
```

> 반환 타입은 `list[Vector]`(= `list[list[float]]`)로 표기한다. `Vector = list[float]` 별칭을 `embedder.py` 상단에 정의해 다음 페이즈가 import해 쓸 수 있게 한다.

구현 요구:
- `embed([])` → **즉시 `[]` 반환**(빈 입력 가드, API 호출 안 함).
- 입력 리스트의 각 원소에 대해 `assert_within_embed_limit(t)`를 먼저 호출(INV-4, fail-closed). 한계 초과면 여기서 예외.
- **③ 빈/공백 원소의 입력↔출력 인덱스 정렬 정본 규칙(핸드오프 계약)**: 빈 문자열/공백-only 원소가 섞여 있어도 **출력 길이는 입력 길이와 같아야 한다**: `len(out) == len(texts)`. 빈/공백 원소 자리에는 **0-벡터(`[0.0] * dim`)를 채워 인덱스를 보존**한다(필터링으로 출력 길이를 줄여 `texts[i] ↔ vecs[i]` 정렬을 깨뜨리는 것 금지). 다음 페이즈가 `chunk[i] ↔ vec[i]`를 가정하므로 이 정렬 보존은 **계약**이다.
  - API에는 빈/공백 원소를 보내지 않거나(자리표시 후 재삽입), 보내더라도 norm 가드 대상에서 0-벡터는 제외한다. **어떤 방식이든 최종 `out`의 인덱스는 입력과 1:1 정렬**되어야 한다.
- `client.embeddings.create(model=, input=non_empty_texts)`로 임베딩 요청 → `list[list[float]]` 추출 → 위 정렬 규칙대로 0-벡터와 병합해 `out` 구성.
- **④ norm 가드(INV-1) — 배치 전체 순회(§B-7의 `vecs[0]`-only 덮어쓰기)**: `out`의 **모든 원소를 순회**하며 `numpy`로 L2 norm 계산 후 각각 `assert abs(norm - 1.0) < 1e-3`. **첫 원소만 검사(`vecs[0]`)하는 약한 버전 금지.** **재정규화 금지** — 위반 시 assert로 실패시켜라(무음 통과 금지). 빈/공백 입력으로 채운 0-벡터는 가드 대상에서 제외.
- `assert_within_embed_limit(text, max_chars=1000)`: `len(text) > max_chars`면 `ValueError`(문자 수 기준, fail-closed). `prompt_tokens` 등 usage 기반 판단 **사용 금지**(INV-4).
- LMStudio 클라이언트는 `client.py`와 동일 패턴으로 **모듈 최상위 1회 생성 + 모듈 로드 시점 localhost 가드** 적용(또는 공용 모듈에서 import). 가드 발동 시점 규칙은 1-①과 동일.

#### 3) `tests/` 단위 테스트 (각 불변식 1:1 매핑)
`tests/test_llm_client.py`, `tests/test_embedder.py`를 만들고 **LMStudio를 호출하지 않는 mock 기반**으로 작성(외부/네트워크 의존 0).

**테스트 사전조건 (단독 실행 절차 — 빠지면 import 자체가 실패)**:
- 두 모듈은 import 시점에 localhost 가드를 돌리므로, **테스트는 `LMSTUDIO_BASE_URL`이 localhost인 환경**에서 import돼야 한다. 테스트 파일 상단(또는 `conftest.py`)에서 import 이전에 `os.environ.setdefault("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")`를 설정하거나, `monkeypatch.setenv` 후 import하라. 그래야 가드를 통과해 모듈-레벨 클라이언트 생성이 성공한다.
- mock 패치 대상은 **모듈 1회 생성 클라이언트의 절대 경로**로 명시한다(가드는 그대로 통과시키고 네트워크 호출 메서드만 patch):
  - LLM: `src.llm.client.client.chat.completions.create`
  - 임베딩: `src.embed.embedder.client.embeddings.create`
  - (클라이언트를 공용 모듈에 두었다면 실제 생성 위치의 절대 경로로 맞춰 patch.)

최소 케이스:
- `test_content_empty_falls_back_to_reasoning` — `content=""`, `reasoning_content="답"`인 mock 응답 → `chat()`이 `"답"` 반환(INV-2).
- `test_clean_reasoning_strips_think` — `"<think>속</think>최종답"` → `"최종답"`(INV-5).
- `test_clean_reasoning_unbalanced_warns` — `"<think>열기만"`(open-only) → 원문 + `[경고]` 포함, 빈 문자열 아님(INV-5).
- `test_clean_reasoning_close_only_warns` — `"앞</think>최종답"`(close-only, 여는 태그 없음) → **경고 케이스로 처리됨**(원문 + `[경고]` 포함). split 추출로 `"최종답"`만 반환되지 **않음**을 단정(1-③ 정본 검증).
- `test_length_retry_once` — 1차 `finish_reason="length"`, 2차 정상 → `create`가 정확히 2회 호출, 2차 `max_tokens`가 1차의 3배(INV-6).
- `test_length_retry_gives_up_with_warning` — 1·2차 모두 `finish_reason="length"` → `create` 정확히 2회, 결과에 `[경고]` 포함(무한 루프 없음, INV-6).
- `test_embed_empty_returns_empty` — `embed([])` → `[]`, API 미호출(INV-1).
- `test_embed_norm_guard_trips` — **배치의 비-첫번째 원소**(예: index 1)의 norm이 1.0에서 충분히 벗어난(예: 1.5) mock 벡터 → `embed()`가 `AssertionError`. 첫 원소만 검사하는 약한 가드라면 통과해버리므로, **이 케이스가 배치 전체 순회를 강제**한다(INV-1, 무음 통과 안 함).
- `test_embed_norm_guard_passes` — 모든 원소 norm≈1.0 mock 벡터 → 통과(정상 경로).
- `test_embed_preserves_index_alignment` — 빈/공백 원소가 섞인 입력(예: `["a", "", "b"]`)에 대해 `len(embed(input)) == len(input)`이고, 빈 자리는 0-벡터로 채워져 정렬이 보존됨을 검증(1-③ 핸드오프 계약).
- `test_assert_within_embed_limit_raises` — `len > max_chars` 입력 → `ValueError`(INV-4).
- `test_no_thinking_off_kwargs_injected` — `chat()` 호출 시 `create`에 전달된 kwargs에 `enable_thinking`/`reasoning_effort`/`/no_think`가 **자동 주입되지 않음** 검증(INV-2).

테스트는 `unittest.mock`(또는 pytest `monkeypatch`)으로 위 절대 경로의 `create`만 패치한다. **실제 localhost:1234를 때리지 않는다**(CI/오프라인에서 통과해야 함).

### 산출물 (생성/수정 파일)
- `src/llm/client.py` (신규) — `chat()`, `_clean_reasoning()`, 모듈-레벨 클라이언트 + **모듈 로드 시점** localhost 가드
- `src/embed/embedder.py` (신규) — `Vector` 별칭, `embed()`, `assert_within_embed_limit()`, **배치 전체 순회** norm 가드, 인덱스 정렬 보존
- `tests/test_llm_client.py` (신규)
- `tests/test_embedder.py` (신규)
- `src/__init__.py`, `src/llm/__init__.py`, `src/embed/__init__.py`, `tests/__init__.py` (없으면 빈 파일 생성 — `src.*` 임포트 가능성 보장, 작업지시 0 참조)
- `pyproject.toml`에 `[tool.setuptools.packages.find]`(또는 동등 백엔드 설정) + `openai`·`numpy`·`pytest` 의존성 추가(기존 값 덮어쓰지 말고 병합)
- (필요 시) `config/settings.yaml` / `.env.example`에 `LMSTUDIO_BASE_URL`·모델명 키 추가(병합)

### 완료 기준 (통과 못 하면 다음 페이즈 금지)
1. 프로젝트 루트에서 `PYTHONPATH=. pytest -q tests/test_llm_client.py tests/test_embedder.py`가 **전부 통과**(네트워크 없이, mock만으로). `ModuleNotFoundError: src` 없이 import 성공.
2. 위 테스트 목록의 각 불변식(INV-1/2/4/5/6) 케이스가 최소 1개씩 존재하고 통과. **특히** norm 가드 비-첫번째-원소 케이스·인덱스 정렬 보존 케이스·close-only 경고 케이스가 포함되고 통과.
3. 코드에서 `/no_think`, `enable_thinking`, `reasoning_effort`가 thinking-off 목적으로 **자동 주입되는 경로가 0건**(아래 검증명령 2의 정밀 패턴 또는 AST 확인으로 검증).
4. `base_url`이 localhost가 아니면 **import/reload 시점에 예외**가 나는지 검증명령 4로 확인(함수 내부 지연 가드면 FAIL).
5. 임베딩에 재정규화 코드(`v / norm`, `normalize(`)가 **없음**(검증명령 3으로 확인) — 가드만 존재.

### 검증 명령
```bash
# (전제) 모든 명령은 프로젝트 루트를 cwd로 두고 실행. 단독 실행 시 PYTHONPATH=. 보장.

# 1) 단위 테스트 (네트워크 불필요, mock 기반)
PYTHONPATH=. pytest -q tests/test_llm_client.py tests/test_embedder.py

# 2) 무효 우회책 자동 주입 0건 확인 — 코드 라인의 kwargs 키 주입만 정밀 매칭
#    (a) 화이트리스트 grep의 오탐/누락을 피하려 "키=값으로 호출에 전달" 패턴으로 좁힘:
grep -rnE "(enable_thinking|reasoning_effort)\s*=" src/ \
  | grep -vE "^\s*#" \
  || echo "OK: thinking-off kwargs 주입 라인 없음"
grep -rn "no_think" src/ | grep -vE "^\s*#" \
  || echo "OK: /no_think 주입 없음"
#    (b) 권고: 더 신뢰할 판정이 필요하면 AST로 client.*.create(...) 호출의 키워드 인자에
#        enable_thinking/reasoning_effort 키가 박혔는지만 검사하는 스크립트를 쓴다
#        (변수명 우연 일치·한국어 주석 오탐을 모두 배제).

# 3) 재정규화 코드 부재 확인 (출력 없어야 정상)
grep -rnE "normalize\(|/\s*norm|/\s*np\.linalg\.norm" src/embed/ \
  | grep -viE "abs\(norm|assert|# " || echo "OK: 재정규화 없음"

# 4) localhost 외 base_url 가드가 "모듈 로드 시점"에 발동하는지 확인
#    (가드가 chat() 내부에 있으면 import만으로 예외가 안 나 이 명령이 무한 통과=FAIL 미검출)
PYTHONPATH=. python -c "
import os
os.environ['LMSTUDIO_BASE_URL']='https://api.openai.com/v1'
try:
    import importlib, src.llm.client as c; importlib.reload(c)
    print('FAIL: 외부 base_url 가드 미작동(모듈 로드 시점 가드 아님)')
except Exception as e:
    print('OK: 외부 base_url 차단 ->', type(e).__name__)
"
```

### 다음 페이즈 핸드오프
다음 페이즈(문서 파싱·청킹/인덱싱)는 여기서 만든 `embed()`(배치 전체 norm 가드 + 입력↔출력 인덱스 정렬 보존, 반환 `list[Vector]`)와 `assert_within_embed_limit()`를 그대로 import해 청크를 임베딩한다. `chunk[i] ↔ vec[i]` 정렬이 계약으로 보장되므로 호출자는 빈 청크 필터링으로 인한 어긋남을 걱정하지 않는다. 모든 LMStudio 별난 동작은 이 두 래퍼 뒤에 봉인되어 있으므로, 이후 페이즈 코드는 평문 `str`·정규화된 `Vector`만 다룬다.
