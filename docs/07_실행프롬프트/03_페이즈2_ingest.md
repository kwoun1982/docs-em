> **이 파일 전체를 에이전트형 코딩 도구(Claude Code/Cursor)에 붙여넣어 이 페이즈 하나만 실행하세요.**
> 페이즈 사이에 컨텍스트를 초기화합니다. 사용법·순서·게이트는 [00_실행개요.md](./00_실행개요.md) 참조.
> 정본: [00_결정 통합](../00_결정/00_결정해야할것_통합.md) · [내부 API 계약](../04_아키텍처_API/02_내부API_인터페이스.md) · [불변식 INV-1~8](../99_AI참조/01_실측제약_불변식.md)

# 페이즈 2: 문서 로딩 · 한국어 청킹

### 이 페이즈의 목표 (1~2문장)
`.pdf`/`.docx` 원문을 `{text, doc_id, source_path, meta}` 표준 dict로 로딩하는 `loaders.py`(한국어 PDF 줄바꿈 정규화·노이즈 제거 포함)와, kss 문장분리 + langchain-text-splitters로 문자 기준(max_chars=500/overlap=80) 한국어 청킹을 수행하는 `chunker.py`의 `chunk()`를 구현한다. 이 페이즈 종료 시 "디스크의 문서 디렉토리 → `Chunk` 리스트"가 무손실·무음잘림 없이 흐른다.

### 사전 조건 (이전 페이즈 산출물 — 컨텍스트 초기화 후 파일에서 상태 읽어 확인)
컨텍스트가 초기화되었으므로, 먼저 아래를 **파일로 직접 확인**한 뒤 시작하라.

1. 프로젝트 루트 확인: `pyproject.toml`, `config/settings.yaml` 존재 여부.
2. **패키지 구조 확인 — `src/`·`src/ingest/`·`src/embed/`·`src/app/` 디렉토리와 각 `__init__.py`가 없으면**, 먼저 §B-11 스캐폴딩(03_개발환경셋업.md §5의 `mkdir -p`/`touch`)을 실행해 뼈대를 만든다. 이게 없으면 아래 검증 명령의 `python -c "from src.ingest.chunker import chunk"` import가 깨진다.
   ```bash
   mkdir -p config src/llm src/ingest src/embed src/store src/retrieve src/app scripts eval tests data
   touch src/__init__.py src/llm/__init__.py src/ingest/__init__.py src/embed/__init__.py \
         src/store/__init__.py src/retrieve/__init__.py src/app/__init__.py
   ```
3. **타입 계약 위치 탐색** — `Chunk` 데이터클래스와 `assert_within_embed_limit`의 **정본 정의는 04_아키텍처_API/02_내부API §1·§3.2의 코드블록**이다. **단, 이들을 어느 `.py` 파일에 둘지는 §B-11에서 고정되지 않았다.** `src/app/types.py`로 **단정하지 마라**. 먼저 grep으로 이미 정의된 위치를 탐색하라.
   ```bash
   grep -rn "class Chunk\|def assert_within_embed_limit\|DEFAULT_MAX_CHARS_FALLBACK" src/ 2>/dev/null
   ```
   - `Chunk(chunk_id, doc_id, text, source_path, chunk_index, meta)` 필드 6개와, `assert_within_embed_limit(text, max_chars=DEFAULT_MAX_CHARS_FALLBACK)` 및 `DEFAULT_MAX_CHARS_FALLBACK = 1000`이 어딘가에 정의돼 있어야 한다.
   - **이미 있으면**: 그 파일을 import 해서 재사용하고 **재정의하지 마라**.
   - **없으면**: 아래 작업 지시 0단계대로 최소 정의를 만든다.
4. 패키지 설치 확인: `pymupdf`, `python-docx`, `kss`, `langchain-text-splitters`가 설치돼 있는지. 없으면 설치한다.
   ```bash
   uv pip install pymupdf python-docx kss langchain-text-splitters 2>/dev/null \
     || pip install pymupdf python-docx kss langchain-text-splitters
   ```

### 절대 규칙 (이 페이즈에서 위반 금지인 불변식 — 관련 INV만)
- **INV-3 외부 API 금지**: 이 페이즈는 순수 로컬 파일 처리만 한다. 네트워크 호출 0건. 임베딩/LLM 호출 없음(청킹은 임베딩 전 단계).
- **INV-4 토큰 미신뢰**: 길이 제어·청크 분할 판단은 **반드시 `len(str)` 문자 수 기준**. 토크나이저 토큰 수로 청크 크기를 재지 마라. `tiktoken`/모델 토큰 카운트 금지.
- **임베딩 입력 가드(fail-closed)**: 모든 청크는 반환 직전 `assert_within_embed_limit(chunk.text)`를 통과해야 한다. 한계 초과를 "일단 통과"시키는 무음 처리 금지 — 초과 청크는 더 잘게 재분할하거나 명시적 예외로 막는다.
- **빈/공백 청크 제외**: `text.strip() == ""`인 청크는 절대 반환 리스트에 넣지 않는다(무음 빈 레코드 금지).
- **파싱 실패는 스킵·로그, 배치 중단 X**: 한 파일 파싱이 실패해도 전체 로딩을 멈추지 않는다. 해당 파일만 건너뛰고 경고 로그를 남긴 뒤 다음 파일로 진행한다.

### 작업 지시 (구체적 단계 — 파일 경로·시그니처 고정)

**0단계 (사전조건 3에서 grep 미발견일 때만): 최소 타입 정의**
- **`Chunk`**: §B-11(시작프롬프트.md §B-11)·스캐폴딩(03_개발환경셋업.md §5)에는 `src/app/types.py`가 **존재하지 않는다**. 정본 정의 위치가 고정돼 있지 않으므로, **새 `types.py`를 임의로 만들지 말고** `src/ingest/chunker.py` 상단(이 페이즈가 `chunk()`를 만드는 곳)에 둔다. 만약 부득이 별도 공용 모듈(`src/app/types.py` 등 §B-11에 없는 파일)을 만들어야 한다면, **그것이 §B-11 디렉토리 구조 일탈임을 완료 보고에 명시**하라(무단 발명 금지).
   ```python
   from dataclasses import dataclass, field

   @dataclass
   class Chunk:
       chunk_id: str
       doc_id: str
       text: str
       source_path: str
       chunk_index: int
       meta: dict = field(default_factory=dict)
   ```
- **`assert_within_embed_limit`**: 정본 위치는 02_내부API §3.2대로 `src/embed/embedder.py`다. 없으면 거기에 추가한다.
   ```python
   DEFAULT_MAX_CHARS_FALLBACK = 1000  # [추정] Phase 0 측정 즉시 settings.yaml 실측값으로 교체

   def assert_within_embed_limit(text: str, max_chars: int = DEFAULT_MAX_CHARS_FALLBACK) -> None:
       """임베딩 입력 한계 초과 시 예외. 무음 잘림 방지(fail-closed)."""
       n = len(text)
       if n > max_chars:
           raise ValueError(f"chunk text {n} chars exceeds embed limit {max_chars}")
   ```

**1단계: `src/ingest/loaders.py`**
- `.pdf` → **pymupdf**(`import pymupdf` 또는 `import fitz`)로 페이지별 텍스트 추출. `.docx` → **python-docx**(`from docx import Document`)로 문단 텍스트 추출. **`.pdf`/`.docx` 확장자만 허용**, 그 외 확장자는 스킵·로그.
- **한국어 PDF 텍스트 정규화 (§B-2 ① 필수 동작 — 누락 금지)**: pymupdf 페이지 텍스트를 **그대로 추출하지 마라**. 추출 직후 아래를 적용한다. 이걸 빠뜨리면 단어 중간 줄바꿈이 청크·임베딩·BM25 토큰화를 오염시켜 회귀케이스("연차 휴가 신청 절차") Recall에 직접 악영향을 준다.
  1. **줄바꿈 정규화(최소 필수)**: 한국어 PDF는 단어/문장 중간에 `\n`이 끼는 경우가 많다. 단어를 끊는 줄바꿈은 복원한다 — 한글 글자 사이의 단일 줄바꿈(예: `한글\n글자` → `한글글자`)은 제거하고, 문단 경계(빈 줄·이중 줄바꿈)는 보존한다. 하이픈으로 끊긴 영문/숫자 줄바꿈(`-\n`)도 이어붙인다.
  2. **노이즈 제거**: 페이지마다 반복되는 **머리말/꼬리말**(페이지 번호·문서 제목 반복 등)과 **표 잔여물**을 가능한 범위에서 제거한다(완벽 제거가 어려우면 최소한 ①의 줄바꿈 정규화는 반드시 수행).
- 함수 시그니처(고정):
  ```python
  def load_file(path: str) -> dict | None:
      """단일 파일 → {text, doc_id, source_path, meta}. 실패/미지원 확장자 시 None + 로그."""

  def load_dir(root: str) -> list[dict]:
      """디렉토리 재귀 순회 → load_file 결과 리스트(None 제외). 한 파일 실패해도 배치 중단 X."""
  ```
- 반환 dict 키 **고정**: `{"text": str, "doc_id": str, "source_path": str, "meta": dict}`.
  - `doc_id`: `"sha1:" + hashlib.sha1(<source_path 또는 정규화 원문 바이트>).hexdigest()[:12]` 형태(접두 `sha1:` + **12 hex**). 같은 입력 → 같은 ID(결정적). `#`을 `doc_id`에 절대 넣지 마라(나중에 chunk_id 구분자와 충돌).
  - `meta`: PDF는 `{"page_count": int}` 등 추출 가능한 정보. DOCX는 `{}` 또는 추출 가능 정보.
- 파싱 실패(손상 파일·암호화 PDF 등)는 `try/except`로 잡아 `logging.warning`으로 `source_path`와 예외를 남기고 `None` 반환. **예외를 위로 전파해 배치를 죽이지 마라.**
- 텍스트가 빈 문자열인 파일은(정규화 후 기준) 경고 로그 후 스킵.

**2단계: `src/ingest/chunker.py`의 `chunk()`**
- 시그니처(계약 고정 — 변경 금지):
  ```python
  def chunk(doc: dict, *, max_chars: int = 500, overlap_chars: int = 80, doc_type: str = "manual") -> list[Chunk]:
      """{text,doc_id,source_path,meta}(로딩 산출물) → list[Chunk]. 문자 기준, 빈/공백 청크 제외."""
  ```
- 알고리즘:
  1. **문장 분리**: `kss.split_sentences(doc["text"])`로 한국어 문장 리스트 생성. 단순 `.` 분할 금지(종결어미·소수점·약어 충돌). kss 실패/빈 입력 시 빈 리스트 반환.
  2. **구조 마커 경계 우선**: `"제N조"`(정규식 `^제\d+조`), 번호목록 `"1."`(`^\d+\.`) 같은 마커로 시작하는 문장은 **새 청크의 강제 경계**로 삼는다(이전 청크를 닫고 새로 시작). 가능하면 해당 마커를 `meta["section"]`에 누적한다.
  3. **묶기(슬라이딩 윈도우, 문자 기준)**: 문장을 이어붙이되 누적 문자 길이가 `max_chars`를 넘기 직전에 청크를 확정한다. 다음 청크는 직전 청크 끝에서 **`overlap_chars`만큼 문자 오버랩**을 두고 시작한다(문장 단위 아님, 문자 수/비율 기준). 단일 문장이 `max_chars`보다 길면 **langchain-text-splitters의 `RecursiveCharacterTextSplitter(chunk_size=max_chars, chunk_overlap=overlap_chars, length_function=len)`** 로 그 문장만 추가 분할한다.
  4. **빈/공백 청크 제외**: `text.strip() == ""`이면 버린다.
  5. **임베딩 가드**: 각 청크 확정 시 `assert_within_embed_limit(text)`를 호출한다. 만약 (구조 마커·오버랩 조합으로) `max_chars`보다 길어졌다면 위 RecursiveCharacterTextSplitter로 재분할해 모든 조각이 가드를 통과하게 만든다. **통과 못 하는 청크를 반환하지 마라.**
- `Chunk` 생성:
  - `chunk_index`: 0부터 연속(0,1,2,…). 같은 `doc_id` 내에서 유일.
  - `chunk_id`: `f'{doc["doc_id"]}#{chunk_index}'` (구분자 `#` 고정).
  - `source_path`: `doc["source_path"]` 그대로.
  - `meta`: `doc["meta"]` 복사 + 추출한 `section`/`page` 병합(없으면 생략).

**3단계: 단위 테스트 `tests/test_ingest.py`**
- `chunk()` 테스트(임베딩/LMStudio 의존 없이 순수 함수 테스트):
  - 빈 텍스트 → `[]` 반환.
  - 공백만 있는 텍스트 → `[]` 반환.
  - 모든 반환 청크가 `len(c.text) <= max_chars` (또는 단일 초장문 문장 재분할 후 가드 통과).
  - 모든 청크 `c.text.strip() != ""`.
  - `chunk_index`가 0..K-1 연속.
  - 모든 `chunk_id == f"{doc['doc_id']}#{c.chunk_index}"`.
  - 구조 마커 테스트: `"제1조 ...\n제2조 ..."` 입력 시 `제1조`/`제2조`가 서로 다른 청크 경계로 분리되는지.
  - `assert_within_embed_limit`가 모든 반환 청크에서 통과(예외 없음).
- `loaders.py` 테스트:
  - `load_file("nonexistent.txt")`(미지원 확장자) → `None`.
  - 임시 손상 파일/빈 파일 → `None` + 배치 중단 안 함(`load_dir`가 정상 파일은 계속 처리).
  - **줄바꿈 정규화 테스트**: 단어 중간 줄바꿈(`"한글\n글자"`)이 정규화 후 `"한글글자"`로 복원되고, 문단 경계 빈 줄은 보존되는지(가능하면 내부 정규화 함수 단위로).
  - (가능하면) 임시 `.docx` 생성 후 `load_file` → dict 키 4종 검증.

### 산출물 (생성/수정 파일 목록)
- `src/ingest/loaders.py` (신규)
- `src/ingest/chunker.py` (신규)
- `tests/test_ingest.py` (신규)
- `Chunk`/`assert_within_embed_limit` 최소 정의 (사전조건 3에서 grep 미발견일 때만 — `Chunk`는 `src/ingest/chunker.py` 상단, `assert_within_embed_limit`는 `src/embed/embedder.py`. §B-11 밖 새 파일을 만들면 일탈 명시 보고)
- `pyproject.toml` (의존성에 `pymupdf`, `python-docx`, `kss`, `langchain-text-splitters` 추가)

### 완료 기준 (통과 못 하면 다음 페이즈 금지)
1. `pytest tests/test_ingest.py -q`가 **전부 통과**.
2. `chunk()`가 반환한 **모든 청크**가 `assert_within_embed_limit` 통과(가드 위반 0건).
3. 빈/공백 텍스트 입력 시 `chunk()`가 `[]` 반환(빈 청크 0건).
4. `load_dir`가 한 파일 파싱 실패에도 **중단되지 않고** 나머지를 반환(스킵+로그 동작 확인).
5. 한국어 PDF 줄바꿈 정규화가 동작(단어 중간 줄바꿈 복원, 문단 경계 보존) — 테스트로 검증.
6. 외부 네트워크 호출 0건(이 페이즈는 로컬 파일 처리만).
7. `Chunk`/`assert_within_embed_limit`를 §B-11 밖 파일에 정의했다면, 그 일탈을 완료 보고에 명시.

### 검증 명령 (복붙 실행)
```bash
# 1) 의존성·import 확인
python -c "import pymupdf, docx, kss; from langchain_text_splitters import RecursiveCharacterTextSplitter; print('deps OK')"

# 2) 단위 테스트
pytest tests/test_ingest.py -q

# 3) 청킹 스모크 — 모든 청크가 문자 한계·비빈값·연속 인덱스 만족하는지 즉석 검증
python - <<'PY'
from src.ingest.chunker import chunk
text = ("제1조 목적. 이 규정은 직원의 연차 휴가 신청 절차를 정한다. "
        "직원은 1년간 80% 이상 출근한 경우 15일의 유급휴가를 받는다. " * 6
        + "제2조 신청. 연차 휴가 신청은 사전 결재를 받아 인사팀에 제출한다. " * 6)
doc = {"text": text, "doc_id": "sha1:a1b2c3d4e5f6", "source_path": "corpus/hr/휴가규정.docx", "meta": {}}
cs = chunk(doc, max_chars=500, overlap_chars=80, doc_type="manual")
assert cs, "청크가 비어있음"
assert all(c.text.strip() for c in cs), "빈/공백 청크 존재"
assert [c.chunk_index for c in cs] == list(range(len(cs))), "chunk_index 불연속"
assert all(c.chunk_id == f"sha1:a1b2c3d4e5f6#{c.chunk_index}" for c in cs), "chunk_id 포맷 불일치"
assert all(len(c.text) <= 500 for c in cs), "max_chars 초과 청크 존재"
print(f"OK: {len(cs)} chunks, max_len={max(len(c.text) for c in cs)}")
PY

# 4) 빈 입력 가드 — [] 반환 확인
python -c "from src.ingest.chunker import chunk; print('empty ->', chunk({'text':'   ','doc_id':'sha1:000000000000','source_path':'a','meta':{}}))"
```

### 다음 페이즈 핸드오프 (다음 페이즈가 의존하는 것)
다음 페이즈(임베딩·벡터스토어 적재)는 `load_dir()` → `chunk()`로 만들어진 `Chunk` 리스트를 입력으로 받는다. 각 `Chunk.text`는 한국어 PDF 줄바꿈 정규화를 거친 뒤 임베딩 입력 한계를 통과한 상태이며, `chunk_id`는 `{doc_id}#{index}` 결정적 ID(여기서 `doc_id` = `sha1:` + 12 hex)여서 재색인 시 upsert 키로 그대로 쓰인다.
```
