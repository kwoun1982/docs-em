> **이 파일 전체를 에이전트형 코딩 도구(Claude Code/Cursor)에 붙여넣어 이 페이즈 하나만 실행하세요.**
> 페이즈 사이에 컨텍스트를 초기화합니다. 사용법·순서·게이트는 [00_실행개요.md](./00_실행개요.md) 참조.
> 정본: [00_결정 통합](../00_결정/00_결정해야할것_통합.md) · [내부 API 계약](../04_아키텍처_API/02_내부API_인터페이스.md) · [불변식 INV-1~8](../99_AI참조/01_실측제약_불변식.md)

# 페이즈 0: 환경 셋업 · 스캐폴딩 · Phase 0 실측

### 이 페이즈의 목표
docs-em(100% 로컬 한국어 사내문서 RAG)의 빈 골격을 세운다: uv 가상환경·의존성, 설정 파일, §B-11 디렉토리 전체 스캐폴딩, 그리고 LMStudio 실측 스크립트(`scripts/env_check.py`)를 작성·실행해 임베딩 차원/norm·`prompt_tokens` 오보고·생성모델 content 빈값/reasoning_content·`finish_reason=length` 재현을 측정하고 그 실측값을 `config/settings.yaml`과 문서에 기록한 뒤 첫 커밋한다.

### 사전 조건 (이전 페이즈 산출물 — 컨텍스트 초기화 후 파일에서 확인)
이 프로젝트의 **첫 코드 페이즈**다. 이전 코드 산출물 없음. 실행 전 아래로 현재 상태를 직접 확인하라.
- 코드가 이미 있는지: `test -d src/llm && echo "이미 스캐폴딩됨 — 중복 생성 금지, 누락분만 채움" || echo "신규 스캐폴딩"`
- 이 리포지토리에는 설계 문서 사이트(`index.html`, `build.mjs`, `docs/`, `node_modules/`, `package.json`)가 이미 존재할 수 있다. **그것들을 절대 삭제·수정하지 마라.** Python 프로젝트 파일을 그 옆에 추가하는 것이다.
- 전제 사실(이 PC 실측 2026-06-17): LMStudio가 `http://localhost:1234/v1`에서 OpenAI 호환 서버로 떠 있고, 임베딩 모델 `text-embedding-nomic-embed-text-v1.5`와 생성 모델 `google/gemma-4-e4b`(대안 `qwen/qwen3.5-9b`·`qwen/qwen3.6-35b-a3b` — **prefix `qwen/` 필수**)가 로드되어 있다. api_key는 더미 `"lm-studio"`. **시작 전 `curl -s http://localhost:1234/v1/models`로 실제 id를 확인하고 settings에 그대로(prefix 포함) 기록**할 것(불일치 시 chat() 404).
- 런타임: Python 3.11+, 패키지 관리자 uv 0.8.4. **기본 `python3`이 3.14.5이므로 반드시 `uv venv --python 3.11`로 3.11 고정**(3.14는 lancedb/kiwipiepy 등 네이티브 휠 미존재). uv로 3.11.13 이미 설치돼 있어 그대로 작동.

### 절대 규칙 (이 페이즈에서 위반 금지 — INV 발췌)
- **INV-3 외부 API 금지**: `base_url`은 오직 `http://localhost:1234/v1`. OpenAI/Anthropic/Cohere 등 외부 호출 0건. `.env.example`/코드 어디에도 외부 엔드포인트 금지.
- **INV-1 임베딩 재정규화 금지**: nomic 출력은 이미 L2 정규화(norm≈1.0). 이 페이즈는 norm을 **측정만** 한다. 정규화 코드를 넣지 마라.
- **INV-4 prompt_tokens 불신**: `usage.prompt_tokens`가 0으로 오보고될 수 있음을 측정으로 확인. 길이 판단을 token 수에 의존하는 코드 금지(이 페이즈는 측정만).
- **INV-2 content 폴백**: 생성모델이 `message.content` 빈 문자열, 실제 답은 `message.reasoning_content`에 옴을 측정으로 확인. `/no_think`·`enable_thinking=false`·`reasoning_effort`·`max_tokens` 같은 우회책을 코드에 넣지 마라(전부 무효).
- 이 페이즈에서는 RAG 본 로직(임베딩/검색/생성 래퍼)을 **구현하지 않는다**. 스켈레톤 빈 파일만 만들고 `env_check.py`만 동작시킨다.

### 작업 지시

**1. uv 프로젝트 초기화 (리포 루트에서, 기존 파일 보존)**
`pyproject.toml`을 직접 작성한다(아래 내용). 그 후 의존성을 잠금·설치한다.

```toml
# pyproject.toml
[project]
name = "docs-em"
version = "0.0.0"
description = "100% 로컬 한국어 사내문서 RAG"
requires-python = ">=3.11"
dependencies = [
  "openai>=1.30",          # LLM 클라이언트 (base_url만 localhost)
  "pyyaml>=6.0",
  "python-dotenv>=1.0",
  "lancedb>=0.33,<0.34",   # 벡터스토어 (확정). 이 PC 실측 0.33.0 — _distance API는 코드 전 버전 확인(아래 NOTE)
  "pymupdf>=1.24",         # PDF 파싱
  "python-docx>=1.1",      # DOCX 파싱
  "kss>=4.5,<5",           # 한국어 문장분리. NOTE: 최신 6.x는 mecab/pecab 백엔드가 4.x와 비호환 → macOS arm64에서 설치·동작 깨짐. 4.x로 상한 고정. 설치 실패 시 정규식 종결어미 규칙 자체구현으로 폴백(§B-6)
  "kiwipiepy>=0.17",       # 형태소/BM25 토큰화 (이 PC 실측 0.23.2, arm64 휠 존재)
  "rank-bm25>=0.2",        # BM25 (이 PC 실측 0.2.2)
  "langchain-text-splitters>=0.2",  # 청킹 분할기 부품
  "numpy>=1.26",
]
# NOTE(이 PC 실측 2026-06-17, macOS arm64): 기본 python3=3.14.5라 반드시 `uv venv --python 3.11`로 3.11 고정(3.14는 lancedb/kiwipiepy 휠 미존재).
# NOTE(lancedb): 설치 직후 `python -c "import lancedb; print(lancedb.__version__)"`로 버전 확정 후, cosine _distance 반환범위를 코드 주석에 명시(임의 단정 금지).

[project.optional-dependencies]
dev = ["pytest>=8.0"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src"]
```

> **import 경로 주의(페이즈1+ 핸드오프)**: `packages = ["src"]`이므로 top-level 패키지명은 `src`다. 모든 코드·테스트는 `from src.embed.embedder import embed` 형태(`src.*` 접두)로 import한다. `scripts/`는 패키지가 아니다(`scripts/__init__.py` 없음) — `scripts/env_check.py`는 모듈 import가 아니라 `uv run python scripts/env_check.py`로 직접 실행하고, 테스트에서는 아래 6번처럼 `importlib.util`로 경로 로드한다.

설치:
```bash
uv venv --python 3.11
uv pip install -e ".[dev]"
```
설치 실패 패키지가 있으면(예: kss/kiwipiepy 빌드) **중단하지 말고** 해당 줄에 `# TODO: 설치실패 <사유>` 주석을 달고 나머지를 설치한 뒤 완료 기준의 env_check만 통과시켜라. env_check는 openai/pyyaml/python-dotenv만 필요하다.

**2. `.env.example`, `.env`, `.gitignore`**
`.env.example` (커밋함):
```
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_API_KEY=lm-studio
EMBED_MODEL=text-embedding-nomic-embed-text-v1.5
GEN_MODEL=google/gemma-4-e4b
```
`.env`는 `.env.example`을 복사해 만들되 **커밋 금지**(`.gitignore`에 추가).
`.gitignore`에 **추가**(기존 줄 보존, 중복 추가 금지):
```
.venv/
__pycache__/
*.pyc
.env
data/*
!data/.gitkeep
.pytest_cache/
```
> **주의(실버그 회피)**: `data/`(슬래시로 끝나는 디렉토리 통째 무시)로 쓰면 `data/.gitkeep`까지 무시되어 `git add data/.gitkeep`이 거부되고(`check-ignore`로 확인됨) 빈 `data/`가 커밋에서 사라진다. 따라서 반드시 `data/*` + 예외 `!data/.gitkeep` 두 줄로 쓴다. 이렇게 하면 `data/` 실제 내용물은 무시되고 `.gitkeep`만 추적된다.

**3. §B-11 디렉토리 전체 스캐폴딩 (빈 파일 touch)**
아래를 그대로 생성한다. 각 `__init__.py`는 빈 파일, 기능 모듈은 한 줄 docstring + `# TODO: <페이즈N>에서 구현` 주석만 둔다(빈 import 에러 방지). `data/`는 `.gitkeep`만.

```
src/__init__.py
src/llm/__init__.py
src/llm/client.py                 # chat()·_clean_reasoning() — TODO 페이즈2/3
src/ingest/__init__.py
src/ingest/loaders.py             # TODO 페이즈1
src/ingest/chunker.py             # chunk() — TODO 페이즈1
src/embed/__init__.py
src/embed/embedder.py             # embed()·assert_within_embed_limit() — TODO 페이즈1
src/store/__init__.py
src/store/vector_store.py         # VectorStore Protocol·LanceDB — TODO 페이즈1
src/retrieve/__init__.py
src/retrieve/search.py            # search() — TODO 페이즈1
src/retrieve/fusion.py            # rrf() — TODO 페이즈2
src/retrieve/rerank.py            # rerank() — TODO 페이즈3
src/app/__init__.py
src/app/answer.py                 # answer() — TODO 페이즈2
src/app/cli.py                    # TODO 페이즈2
scripts/env_check.py              # 이 페이즈에서 구현 (패키지 아님: __init__.py 없음)
eval/queries.yaml                 # 골든셋 — TODO 페이즈1
eval/evaluate.py                  # evaluate() — TODO 페이즈1
tests/__init__.py
tests/test_env_check.py           # 이 페이즈에서 구현
config/settings.yaml              # 이 페이즈에서 초기값+실측 기록
data/.gitkeep
```

기능 모듈 스텁의 함수 시그니처는 **계약 고정**(본문은 `raise NotImplementedError`). 예: `src/embed/embedder.py`에
```python
"""임베딩 래퍼 — 페이즈1에서 구현."""
DEFAULT_MAX_CHARS_FALLBACK = 1000
def embed(texts: list[str], model: str = "text-embedding-nomic-embed-text-v1.5") -> list[list[float]]:
    raise NotImplementedError  # TODO 페이즈1
def assert_within_embed_limit(text: str, max_chars: int = DEFAULT_MAX_CHARS_FALLBACK) -> None:
    raise NotImplementedError  # TODO 페이즈1
```
나머지 모듈도 동일 패턴으로 계약 시그니처만 박아둔다(client.chat / chunker.chunk / vector_store.VectorStore Protocol / search.search / fusion.rrf / rerank.rerank / answer.answer / evaluate.evaluate). 본문 구현 금지.

**4. `config/settings.yaml` 초기값 (실측 전 플레이스홀더 포함)**
```yaml
llm:
  base_url: http://localhost:1234/v1
  api_key: lm-studio
  gen_model: google/gemma-4-e4b
  gen_alternatives: [qwen/qwen3.5-9b, qwen/qwen3.6-35b-a3b]  # 이 PC 실측 LMStudio id (prefix qwen/ 필수 — 누락 시 chat() 404). 추가 로드 모델: qwen/qwen3.6-27b, qwen/qwen3-vl-30b(멀티모달, 비범위)
  max_tokens: 4000
embed:
  model: text-embedding-nomic-embed-text-v1.5
  dim: 768          # 실측으로 확정 (env_check가 덮어씀)
  norm: null        # 실측: 1.0 기대 (INV-1)
  metric: cosine    # LanceDB create_index에서 명시 (기본 L2 금지)
chunk:
  max_chars: 500
  overlap_chars: 80
retrieve:
  top_k: 30
  top_n: 5
  rrf_k: 60
# === Phase 0 실측 (env_check.py가 기록) ===
measured:
  embed_dim: null
  embed_norm: null
  prompt_tokens_zero: null     # INV-4: usage.prompt_tokens 0 오보고 여부
  content_empty: null          # INV-2: message.content 빈 문자열 여부
  reasoning_content_present: null
  length_retry_reproduced: null  # INV-6: finish_reason=length 재현 여부
  measured_at: null
```

**5. `scripts/env_check.py` 작성 (이 페이즈의 핵심)**
`.env`를 로드해 `openai` SDK로 LMStudio에 붙어 아래를 측정하고, 콘솔에 표로 출력한 뒤 `config/settings.yaml`의 `measured` 블록을 **실측값으로 덮어쓴다**(파일 다시 읽어 yaml.safe_load → 갱신 → yaml.safe_dump). 측정 함수는 테스트에서 존재 확인 가능하도록 **이름을 고정**한다: `measure_embed()`, `measure_chat_content()`, `measure_length_retry()`, `write_measured(result: dict)`, `main()`. 측정 항목:

- (a) **임베딩 차원·norm** (`measure_embed`): `client.embeddings.create(model=EMBED_MODEL, input=["연차 휴가 신청 절차"])` → `len(vec)` == 768 확인, `numpy`로 L2 norm 계산 후 `abs(norm-1.0)<1e-3` 여부 출력. (재정규화하지 말 것 — 측정만.)
- (b) **prompt_tokens 오보고**: 위 임베딩 또는 chat 응답의 `resp.usage.prompt_tokens`를 출력. 0이면 `prompt_tokens_zero=true`.
- (c) **content 빈값 / reasoning_content** (`measure_chat_content`): `client.chat.completions.create(model=GEN_MODEL, messages=[{"role":"user","content":"연차 휴가는 며칠인가요?"}], max_tokens=4000)` → `choices[0].message.content`가 빈 문자열인지, `getattr(message,"reasoning_content",None)`에 값이 있는지 출력. (우회 파라미터 넣지 말 것.)
- (d) **finish_reason=length 재현** (`measure_length_retry`): 일부러 `max_tokens=16` 같은 작은 값으로 위 chat을 한 번 더 호출해 `choices[0].finish_reason == "length"`가 나오는지 출력. (이 페이즈는 재시도 로직 구현 X — 재현 확인만.)
  > **참고(차단 아님)**: content가 빈 문자열이고 답이 reasoning_content로만 오므로 16토큰에서 length가 날 개연성은 높으나 **보장은 아니다**. 재현 안 되면 `length_retry_reproduced=false`로 기록만 하고 **실패로 보지 않는다**(완료 기준 2는 "항목 출력"만 요구). false여도 다음 페이즈 진행 차단 요소가 아니다.

연결 실패 시 명확한 한국어 에러로 즉시 종료(무음 통과 금지): "LMStudio 연결 실패 — http://localhost:1234/v1 서버·모델 로드 확인 필요". 모든 측정은 try/except로 감싸 항목별 결과를 기록하되, 한 항목 실패가 다른 측정을 막지 않게 한다.

**6. `tests/test_env_check.py`**
서버 없이도 통과하는 최소 테스트:
- `scripts/env_check.py`를 **`importlib.util`로 경로 기반 로드**한다(`scripts/`는 패키지가 아니므로 `import scripts.env_check`는 불가). 다음 패턴을 쓴다:
  ```python
  import importlib.util, pathlib
  _p = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "env_check.py"
  _spec = importlib.util.spec_from_file_location("env_check", _p)
  env_check = importlib.util.module_from_spec(_spec)
  _spec.loader.exec_module(env_check)
  ```
- 로드 후 측정 함수가 존재하는지 검증: `assert hasattr(env_check, name)` for `name in ("measure_embed","measure_chat_content","measure_length_retry","write_measured","main")`.
- `config/settings.yaml`이 유효한 YAML로 파싱되고 필요한 키(`embed.dim`, `measured`)가 있는지 검증.
- LMStudio 의존 부분(실제 호출)은 환경변수/연결 가능 시에만 실행(없으면 `pytest.skip`).

**7. git**
이미 git 리포지토리이면 `git init` 생략. 추가 파일을 스테이징해 커밋:
```bash
git add pyproject.toml .env.example .gitignore src scripts eval tests config
git add data/.gitkeep   # data/* 무시 + !data/.gitkeep 예외로 정상 스테이징됨
git commit -m "페이즈0: 환경 셋업·스캐폴딩·LMStudio 실측(env_check)"
```
> `.gitignore`를 `data/*`+`!data/.gitkeep`로 썼으면 `git add data/.gitkeep`은 강제 옵션 없이 스테이징된다. (만약 사정상 `data/`로 썼다면 `git add -f data/.gitkeep`로 강제 추가해야 하나, 위 2번 권장 형식을 따르면 `-f` 불필요.)
`.env`와 `data/` 내용물(.gitkeep 제외)은 커밋되지 않아야 한다(`.gitignore` 확인).

### 산출물
- `pyproject.toml`, `.env.example`, `.env`(비커밋), `.gitignore`(갱신: `data/*`+`!data/.gitkeep`)
- `src/` 전체 스켈레톤(계약 시그니처 + `NotImplementedError`), `eval/`, `tests/`, `config/settings.yaml`, `data/.gitkeep`(추적됨)
- `scripts/env_check.py`(구현·실행됨, 고정 함수명 `measure_embed/measure_chat_content/measure_length_retry/write_measured/main`), `tests/test_env_check.py`
- `config/settings.yaml`의 `measured` 블록이 실측값으로 채워진 상태
- 첫 커밋(설계 문서 사이트 파일은 변경 없음)

### 완료 기준 (통과 못 하면 다음 페이즈 금지)
1. `uv run python -c "import openai, yaml, dotenv; print('deps ok')"` → `deps ok`.
2. `uv run python scripts/env_check.py` 정상 종료(exit 0), 콘솔에 4개 측정 항목(차원·norm / prompt_tokens / content·reasoning / length 재현) 모두 출력. (`length_retry_reproduced=false`도 항목이 출력되면 충족 — false는 실패 아님.)
3. 실측 확인: 임베딩 차원이 **768**, `embed_norm`이 1.0±1e-3(INV-1 부합). 만약 768이 아니거나 norm이 1에서 벗어나면 **중단하고 사람에게 보고**(모델 교체 신호).
4. `config/settings.yaml`의 `measured.embed_dim/embed_norm/measured_at`이 null이 아님(실측 기록됨).
5. `uv run pytest -q` 통과(서버 없으면 skip 허용, 실패 0).
6. 추적 누수 없음: `.env`와 `data/`의 실제 내용물(.gitkeep 제외)이 추적되지 않고, 첫 커밋이 존재한다.

### 검증 명령
```bash
uv run python -c "import openai, yaml, dotenv; print('deps ok')"
uv run python scripts/env_check.py
uv run python - <<'PY'
import yaml
m = yaml.safe_load(open("config/settings.yaml"))["measured"]
assert m["embed_dim"] == 768, f"차원 불일치: {m['embed_dim']} (INV-1 모델 교체 신호)"
assert m["embed_norm"] is not None and abs(m["embed_norm"]-1.0) < 1e-3, f"norm 이탈: {m['embed_norm']}"
print("실측 기록 OK:", m)
PY
uv run pytest -q
# 추적 누수 탐지: 추적 중(ls-files) 파일에서 .env 또는 data/ 내용물(.gitkeep 제외) 검출
git ls-files | grep -E '^\.env$|^data/' | grep -v '^data/.gitkeep$' && echo "경고: .env/data 추적됨(누수)" || echo "추적 누수 없음"
# data/.gitkeep은 의도된 추적 — 확인
git ls-files | grep -q '^data/.gitkeep$' && echo "data/.gitkeep 추적됨(정상)" || echo "경고: data/.gitkeep 누락"
git log --oneline -1
```
> **검증 명령 설계 메모**: 이전 버전의 `git status --porcelain | grep -E '^\?\? \.env$|data/'`는 (1) `.gitignore`로 무시된 파일은 porcelain에 안 나타나 누수를 못 잡고(거짓 음성), (2) `data/` 부분 매치라 무관 경로(`src/.../data/...`)나 수정 라인까지 매칭(거짓 양성)이라 폐기했다. 대신 **추적 중 파일 목록**(`git ls-files`)을 기준으로 `.env`·`data/`를 검사하되 의도적으로 추적하는 `data/.gitkeep`만 제외한다.

### 다음 페이즈 핸드오프
페이즈1은 이 스켈레톤(`src/embed/embedder.py`·`src/store/vector_store.py`·`src/retrieve/search.py`·`eval/evaluate.py`의 고정 시그니처)과 `config/settings.yaml`의 실측 `embed_dim=768`/`metric=cosine`을 그대로 이어받아 검색 MVP+평가 하네스를 구현한다. **import 경로는 `src.*` top-level 패키지**(`from src.embed.embedder import embed`)임을 전제한다(hatch `packages=["src"]` 귀결). `scripts/`는 패키지가 아니므로 모듈 참조 시 경로 로드. 회귀 케이스("연차 휴가 신청 절차" → 휴가규정 Recall@1=0→1)가 페이즈1 골든셋의 1급 시민이다.
```
