> **이 파일 전체를 에이전트형 코딩 도구(Claude Code/Cursor)에 붙여넣어 이 페이즈 하나만 실행하세요.**
> 페이즈 사이에 컨텍스트를 초기화합니다. 사용법·순서·게이트는 [00_실행개요.md](./00_실행개요.md) 참조.
> 정본: [디자인 시스템 참조](../06_UIUX/01_디자인시스템_참조.md) · [내부 API 계약](../04_아키텍처_API/02_내부API_인터페이스.md) · [불변식 INV-1~8](../99_AI참조/01_실측제약_불변식.md) · 디자인 원본 `디자인/docs-em Design System/`

# 11단계: API 서버 · React/Vite 셋업 · AppShell

### 이 페이즈의 목표 (1~2문장)
백엔드(`answer`/`search`/`evaluate`/인덱싱)를 **로컬 전용 FastAPI**로 HTTP 노출하고, 디자인 키트(React JSX 3화면)를 **React 18 + Vite 프로젝트(`web/`)** 로 옮겨 폰트·React·디자인 번들을 전부 로컬 vendoring한 뒤, **AppShell**(고정 헤더 + 신뢰 클러스터 + 사이드레일 + 3화면 라우팅)을 `GET /api/health`에 실배선한다. 화면 내부 데이터 배선(질의응답/인덱싱/평가의 실제 fetch)은 다음 페이즈로 넘기고, 이 페이즈는 **껍데기·셋업·헬스 신호**까지만 한다.

---

### 사전 조건 (이전 페이즈 산출물 — 파일에서 직접 확인. 없으면 중단·보고)

컨텍스트 초기화 후 단독 실행되므로, 시작 전 아래를 **그대로 실행해 존재·시그니처를 확인**하라. 하나라도 빠지면 이 페이즈를 진행하지 말고 **누락 목록을 보고한 뒤 중단**한다.

```bash
# 1) 백엔드 핵심 산출물 (페이즈 7·8 결과). UI는 이 함수들을 HTTP로 감싼다 — 없으면 감쌀 대상이 없음 → 중단.
ls -1 src/app/answer.py eval/evaluate.py src/retrieve/search.py src/store/vector_store.py 2>&1
grep -n "def answer" src/app/answer.py 2>&1
grep -n "def evaluate" eval/evaluate.py 2>&1
grep -n "def search" src/retrieve/search.py 2>&1
# 인덱싱 경로 (페이즈 2·3): 로더·청커·벡터스토어
ls -1 src/ingest/loaders.py src/ingest/chunker.py 2>&1

# 2) 디자인 시스템 정본 (이미 리포에 존재해야 함)
ls -1 "디자인/docs-em Design System/tokens/fonts.css" \
      "디자인/docs-em Design System/styles.css" \
      "디자인/docs-em Design System/ui_kits/docs-em/AppShell.jsx" \
      "디자인/docs-em Design System/ui_kits/docs-em/QueryScreen.jsx" \
      "디자인/docs-em Design System/ui_kits/docs-em/IndexScreen.jsx" \
      "디자인/docs-em Design System/ui_kits/docs-em/EvalScreen.jsx" 2>&1
ls -1 "디자인/docs-em Design System/components" 2>&1

# 3) 런타임 도구
node --version 2>&1   # 없으면 안내 후 중단 (Vite는 Node 18+ 필요)
npm --version  2>&1
uv --version   2>&1
```

**중단 규칙**:
- `src/app/answer.py` 또는 `eval/evaluate.py` 또는 `src/retrieve/search.py`가 없으면 → **"백엔드 페이즈 7·8 미완료. 페이즈 9 진행 불가"** 보고 후 중단. (이 함수들을 감싸는 게 이 페이즈의 본질이므로 더미로 대체하지 말 것.)
- 디자인 키트(`ui_kits/docs-em/*.jsx`)가 없으면 → **"디자인 키트 누락"** 보고 후 중단. (UI를 처음부터 그리지 말 것. 정본 키트 복사가 출발점이다.)
- `node`/`npm`이 없으면 → **"Node 18+ 미설치. `brew install node` 또는 nvm 안내"** 출력 후 프론트 작업 중단(FastAPI 부분은 진행 가능). 실측 환경에서 Node가 있으면 그대로 진행.

> 확인된 백엔드 시그니처(고정 — 이 페이즈에서 **변경 금지**, 그대로 HTTP로 감싸기):
> - `answer(query, *, model="google/gemma-4-e4b", top_n=5) -> {"text": str, "citations": [{doc_id, source_path, page|section}]}`
> - `search(query, *, top_k=30, use_bm25=True) -> list[SearchHit(chunk, score, rank, source)]`
> - `evaluate(golden_path="eval/queries.yaml", *, k_list=(1,3,5,10), use_bm25=False, use_rerank=False) -> EvalResult(recall_at_1/3/5/10, mrr, ndcg_at_10, per_query)`
> - 인덱싱: `src/ingest/{loaders,chunker}` + `src/store/vector_store.py` (LanceDB, 사이드카 `_index_header.json`)
>
> **실제 시그니처가 위와 다르면** API 라우터를 억지로 끼워맞추지 말고 **불일치를 먼저 보고**하라. 백엔드 함수 시그니처는 이 페이즈에서 손대지 않는다.

---

### 절대 규칙 (이 페이즈에서 위반 금지)

- **INV-3 외부 API 0건 — 최우선.** 폰트·아이콘·React·번들·CSS 어디에도 외부 호출(`http(s)://`, CDN, unpkg, jsdelivr, fonts.googleapis, fonts.gstatic)이 빌드 산출물에 남으면 안 된다. **모두 빌드타임 vendoring**으로 로컬화한다. 완료 기준에서 정적 grep으로 0건을 강제한다.
- **백엔드 경유만.** UI/API 서버는 **LMStudio(`localhost:1234`)를 직접 호출하지 않는다.** 추론은 백엔드 `answer()`/`search()`/`evaluate()`만 경유한다. API 서버 안에서 `openai` 클라이언트를 새로 만들거나 `localhost:1234`를 직접 fetch하지 말 것(`grep`으로 0건 강제).
- **CORS는 로컬만.** `allow_origins`는 `http://localhost:*` / `http://127.0.0.1:*`만. `"*"` 금지.
- **신뢰 시그널 고정.** 헤더의 `ConnectionBadge`(localhost:1234) · `ExternalCallsCounter`(0) · `100% LOCAL`은 3화면 모두에서 **항상 노출, 숨김·제거 금지.** 이 페이즈에서 이 셋을 `GET /api/health` 실데이터에 연결한다. `ExternalCallsCounter`는 **항상 0**을 표시한다(외부 호출이 0이므로). 0이 아닌 값이 나오면 그건 버그다.
  - **`ConnectionBadge`의 status 값은 정본 `components/feedback/ConnectionBadge.jsx`의 `STATES`에 정의된 `ok`/`delay`/`down` **3개만** 사용한다.** 코드는 `const s = STATES[status] || STATES.ok`이므로 **정의에 없는 문자열(예: `"error"`)을 넘기면 조용히 `ok`(청록 "연결됨")로 폴백**해 연결이 끊겼는데 초록 정상으로 표시되는 신뢰 시그널 왜곡 버그가 난다. **`"error"`는 절대 사용 금지.** 헬스 실패/연결 끊김 → `status="down"`(빨강 "연결 끊김"), 지연 → `status="delay"`(앰버 "지연"), 정상 → `status="ok"`(청록 "연결됨"). (키트·정본 컴포넌트는 수정하지 않고 그대로 쓴다.)
- **디자인 토큰만.** 색/간격/타이포/radius는 전부 `tokens/*.css` CSS 변수(`var(--teal)`, `var(--bg-default)`, `var(--font-mono)`, `var(--radius-md)` 등)로. HEX·px 하드코딩 신규 도입 금지(키트가 inline style로 이미 쓰는 값은 보존하되 새로 추가하지 말 것). 데이터·식별자·점수는 `.mono`(JetBrains Mono).
- **이모지 금지.** 아이콘은 Lucide(`Icon` 컴포넌트, strokeWidth 1.75)만. 정본 `Icon.jsx`는 Lucide 경로 데이터를 이미 인라인 vendoring한 자기완결 컴포넌트다 — **추가 아이콘 패키지(`lucide-react` 등)·아이콘 CDN 도입 금지.**
- **BGE-M3 화면A 노출 금지.** 이 페이즈는 화면 껍데기/셸만 다루므로 BGE-M3(1024) 미채택 DECISION을 새로 노출하지 않는다. 키트 IndexScreen(화면 B)의 기존 `⚠+모달` 표현은 건드리지 말 것.
- **데모 수치 확정값만.** 셸/헬스에는 수치를 발명하지 않는다. 확정 사실(`localhost:1234`·`768`·`EXTERNAL CALLS: 0`)만 노출.
- **범위 한정.** 이 페이즈에서 화면 내부의 가짜 데이터를 실제 API 응답으로 바꾸지 **않는다**(키트 하드코딩 그대로 유지). 셸·라우팅·헬스 신호만 실배선. 화면별 배선은 페이즈 10~11.

---

### 작업 지시 (구체 단계)

#### 1. FastAPI API 서버 — `src/api/server.py`

백엔드와 **같은 venv(Python 3.11)** 에 FastAPI를 설치한다.

```bash
uv venv --python 3.11           # 이미 있으면 재사용
source .venv/bin/activate
uv pip install "fastapi>=0.111" "uvicorn[standard]>=0.30" "python-multipart>=0.0.9"
```

`src/api/__init__.py`(빈 파일)와 `src/api/server.py`를 생성한다. 엔드포인트:

- `GET /api/health` → 다음 JSON:
  ```json
  {
    "ok": true,
    "llm_endpoint": "localhost:1234",
    "llm_connected": true,
    "external_calls": 0,
    "embedding_dim": 768,
    "normalized": true
  }
  ```
  - `llm_connected`: LMStudio 연결 여부를 **백엔드를 통해서만** 판단한다. `localhost:1234`를 API 서버가 직접 fetch하지 말 것. 백엔드(`src/llm/client.py`)에 헬스/핑 함수가 있으면 그걸 호출한다. **단, 정본 계약(`docs/04_아키텍처_API/02_내부API_인터페이스.md` §2.1)의 `src/llm/client.py`에는 `chat()`만 정의돼 있고 헬스/핑 함수가 없다** — 없으면 새로 LMStudio에 연결 판정 로직을 박지 말고 `llm_connected`를 `null`(불확실) 또는 `false`로 **정직하게** 두고, `external_calls`는 항상 `0`을 반환한다.
  - `external_calls`는 **상수 0**. 절대 외부 호출 카운터를 켜지 말 것.
- `POST /api/answer` body `{"query": str, "model"?: str, "top_n"?: int}` → `answer(query, model=..., top_n=...)` 반환값을 그대로 JSON 응답.
- `POST /api/search` body `{"query": str, "top_k"?: int, "use_bm25"?: bool}` → `search(...)`를 호출하고 `SearchHit`를 **JSON 직렬화 가능한 dict**로 변환(`{chunk: {chunk_id, doc_id, text, source_path, chunk_index, meta}, score, rank, source}`)해 리스트로 반환.
- `POST /api/eval` body `{"use_bm25"?: bool, "use_rerank"?: bool, "golden_path"?: str}` → `evaluate(...)` 반환 `EvalResult`를 그대로 JSON.
- 인덱싱 엔드포인트(최소 3개, 백엔드 함수에 맞춰 얇게):
  - `POST /api/index/upload` (`multipart/form-data`, 파일) → 업로드 파일을 로컬 임시/데이터 디렉토리에 저장하고 저장 경로·수락여부를 반환. (휴가규정.pdf·출장경비.docx 같은 허용 형식만, 그 외는 거부 목록에 사유와 함께.)
  - `POST /api/index/reindex` → `src/ingest/{loaders,chunker}` + `src/store/vector_store.py`로 재색인. 정본 계약·아키텍처에는 top-level 재색인 진입 함수가 없고 `ingest`가 적재 시 embed/store를 호출하는 구조뿐이다. 재색인 진입 함수가 있으면 호출하고, 없으면 로더→청커→임베딩→저장을 조합한다. **불확실하면 백엔드 함수 시그니처를 grep으로 확인 후 배선**하고, 진입점이 모호하면 TODO 주석 + `501 Not Implemented`로 정직하게 두되 라우트는 만들어 둔다.
  - `GET /api/index/list` → 현재 색인 목록을 사이드카 `_index_header.json`(또는 벡터스토어 조회)에서 읽어 반환.

서버 공통:
- **CORS**: `CORSMiddleware`로 `allow_origins`를 `http://localhost:5173`, `http://127.0.0.1:5173`(Vite dev)만 허용. `allow_methods=["*"]`는 무방하나 origin은 로컬 고정.
- 백엔드 import는 `from src.app.answer import answer` 등 **기존 모듈 경로 그대로**. 함수 시그니처 변경 금지.
- LMStudio 직접 호출/`openai` import **0건**(완료 기준에서 grep 강제).
- 실행: `uvicorn src.api.server:app --port 8000 --host 127.0.0.1`. `if __name__ == "__main__"` 가드도 추가.

#### 2. React 18 + Vite 프론트 — `web/`

`web/` 디렉토리에 Vite + React 18 프로젝트를 만든다(대화형 `create` 금지, 파일을 직접 생성).

- `web/package.json`: `react@^18`, `react-dom@^18`, devDeps `vite@^5`, `@vitejs/plugin-react@^4`. `type: "module"`. 스크립트 `dev`/`build`/`preview`. **`lucide-react`는 추가하지 않는다** — 정본 `Icon.jsx`가 Lucide 경로 데이터를 이미 인라인 보유한 자기완결 컴포넌트이므로 외부 아이콘 패키지가 불필요하고, 추가하면 INV-3 검증 대상만 넓어진다.
- `web/vite.config.js`: React 플러그인. dev 서버 `server.proxy`로 `/api` → `http://127.0.0.1:8000` 프록시(프론트에서 같은 origin `fetch("/api/...")`로 호출, CORS·하드코딩 URL 회피).
- `npm install`로 React·Vite를 **npm 로컬 설치**(node_modules) — 더 이상 UMD CDN 사용 안 함.
- `web/index.html`: 키트 `ui_kits/docs-em/index.html`의 CDN `<script>`(react/react-dom/babel/`_ds_bundle.js`) 로딩 방식을 **버린다**. 대신 `<script type="module" src="/src/main.jsx">` 하나만. 폰트·토큰 CSS를 import로 연결.
- `web/src/main.jsx`: `createRoot`로 `App` 마운트. `import "./styles.css"`(아래 vendoring한 토큰 진입).

**디자인 시스템 vendoring (복사, 정본 수정 금지)**:
- `디자인/docs-em Design System/tokens/*.css`, `styles.css` → `web/src/styles/`로 복사. `web/src/main.jsx`가 진입 CSS를 import.
- `디자인/docs-em Design System/components/**/*.jsx` → `web/src/ds/components/`로 복사.
- `디자인/docs-em Design System/ui_kits/docs-em/{AppShell,QueryScreen,IndexScreen,EvalScreen}.jsx` → `web/src/screens/`로 복사.
- **`window.DocsEmDesignSystem_afe3d1` 전역 의존 제거 → ESM import로 전환.** 키트/컴포넌트는 현재 `const { Button, ... } = window.DocsEmDesignSystem_afe3d1`로 전역에서 구조분해한다. 이를 각 컴포넌트 파일의 `export`(named export) + 화면 파일 상단의 `import { Button, IconButton, ConnectionBadge, ExternalCallsCounter, ... } from "../ds/components"`로 바꾼다. `components/`에 배럴 `index.js`를 만들어 21개 컴포넌트를 re-export(이름은 `_ds_manifest.json`/`_ds_bundle.js` 헤더의 컴포넌트 명 그대로: Icon, DataTable, Kbd, Metric, ScoreBar, ScoreChip, Tag, ConnectionBadge, ExternalCallsCounter, GateChip, ProgressBar, StatusPill, Tooltip, Button, IconButton, Input, Segmented, Select, Switch, Card, Tabs). `ExternalCallsCounter`는 `ConnectionBadge.jsx`에 함께 있으니 거기서 둘 다 export.
- **`Icon`은 정본 `Icon.jsx`를 그대로 복사해 쓴다.** 이미 Lucide 1.75 경로 데이터가 `PATHS` 상수에 인라인 vendoring돼 있으므로 **내부 구조를 다시 쓰지 말고**, 같은 디렉토리의 `ConnectionBadge` 등에서 `import { Icon } from "../core/Icon.jsx"`처럼 import하는 **상대경로만 ESM으로 유지**하면 된다. `lucide-react`나 외부 아이콘 CDN 도입 금지.
- **키트 레이아웃 함수 `SideRail`/`RailSection` ESM 전환 (누락 방지 — 필수).** 정본 `AppShell.jsx`는 `SideRail`(L77)·`RailSection`(L85)·`AppShell`·`Logo`를 **export 없는 plain function**으로 정의하고 파일 끝에서 `Object.assign(window, { AppShell, Logo, SideRail, RailSection })`로 전역 노출한다. 그리고 `EvalScreen.jsx`(L129·130·143·156)·`IndexScreen.jsx`(L85·86·90·110)는 이들을 `<window.SideRail>`·`<window.RailSection>`으로 교차 참조한다. babel/UMD에선 최상위 함수가 전역이라 동작하지만 **ESM 전환 시 이 `window.*` 참조가 미정의로 깨진다.** 처리:
  - `web/src/screens/AppShell.jsx`에서 `SideRail`·`RailSection`(필요 시 `Logo`도)을 **named `export`**로 바꾸고, 파일 끝의 `Object.assign(window, { ... })` 줄은 **삭제**한다.
  - `web/src/screens/EvalScreen.jsx`·`IndexScreen.jsx` 상단에서 `import { SideRail, RailSection } from "./AppShell.jsx"`로 가져오고 `<window.SideRail>`/`<window.RailSection>` 참조를 `<SideRail>`/`<RailSection>`으로 교체한다. (`SideRail`/`RailSection`은 매니페스트 21개 컴포넌트에 **포함되지 않으므로** `ds/components` 배럴이 아니라 `AppShell`(또는 별도 `web/src/screens/layout.jsx` 모듈로 분리)에서 export한다.)
  - 각 화면 파일 끝의 `Object.assign(window, { QueryScreen })`·`{ IndexScreen }`·`{ EvalScreen }`도 **삭제**하고 화면 컴포넌트를 named `export`로 바꿔, `App.jsx`가 `import { AppShell } from "./screens/AppShell.jsx"` / `import { QueryScreen } from "./screens/QueryScreen.jsx"` 식으로 직접 import한다.
  - 결과적으로 `web/src/screens`·`web/src/ds` 어디에도 `window.` 참조가 남지 않아야 한다(완료 기준 #5의 `window\.` grep이 이를 검증한다).

> JSX 전역→ESM 전환은 키트의 **시각/구조를 바꾸지 말 것.** import 배선만 바꾼다. 인라인 style·로직·문구·레이아웃은 그대로.

#### 3. 폐쇄망 vendoring — 폰트

`tokens/fonts.css`(정본)는 Pretendard(jsdelivr CDN)·JetBrains Mono(Google Fonts `@import`)를 외부에서 끌어온다. **빌드 산출물에 외부 URL이 남으면 INV-3 위반**이다.

- `web/src/styles/fonts/`에 `.woff2`를 로컬로 둔다:
  - Pretendard Regular/Medium/SemiBold/Bold (woff2 4종).
  - JetBrains Mono 400/500/600/700 (woff2).
- 폰트 바이너리가 리포에 없으면: **인터넷 차단 가정이므로 자동 다운로드를 시도하지 말고**, `web/src/styles/fonts/README.md`에 "필요한 .woff2 파일명 목록 + 출처(Pretendard v1.3.9, JetBrains Mono)"를 적고 **사용자에게 업로드를 1회 요청**한다. (네트워크가 허용되면 그때 받아 vendoring. 이 PC 환경 정책을 따른다.) 파일이 들어오기 전까지 `fonts.css`는 로컬 경로로 작성해 두되, 폰트 누락 시 fallback(시스템 sans/mono)이 동작하도록 `font-family` 스택에 `system-ui`/`monospace`를 남긴다.
- `web/src/styles/fonts.css`: 모든 `@import url("https://...")`·`src: url("https://...")`를 **로컬 상대경로**(`url("./fonts/Pretendard-Regular.woff2")`)로 재지정. Google Fonts `@import` 줄은 **삭제**하고 JetBrains Mono도 `@font-face` + 로컬 woff2로 선언.
- 정본(`디자인/...`)의 `fonts.css`는 **수정하지 말고**(정본 보존), `web/` 사본만 로컬화한다.

#### 4. AppShell 배선 — `web/src/screens/AppShell.jsx` + `web/src/App.jsx`

- `web/src/App.jsx`: 화면 라우팅을 **상태 토글**로 구현(`react-router` 도입은 선택 — 3화면뿐이라 `useState("query"|"index"|"eval")`로 충분, 가볍게 가라). `AppShell`·`QueryScreen`·`IndexScreen`·`EvalScreen`은 **ESM import**로 직접 가져온다(전역 `window.*` 사용 금지). `AppShell`에 `active`/`onNavigate`/`children`을 넘기고, `active`에 따라 `<QueryScreen/>`/`<IndexScreen/>`/`<EvalScreen/>`을 children으로 렌더.
- **헬스 배선**: `App`(또는 AppShell)에서 마운트 시 `fetch("/api/health")` 1회 호출:
  - 성공·`llm_connected: true` → `ConnectionBadge status="ok" endpoint="localhost:1234"`(청록 "연결됨").
  - 실패/`false`/`null` → `ConnectionBadge status="down" endpoint="localhost:1234"`(빨강 "연결 끊김"). 응답이 느려 지연 판정일 때만 `status="delay"`(앰버 "지연"). **`status="error"` 등 정본 `STATES`에 없는 문자열은 절대 넘기지 말 것 — 조용히 `ok`로 폴백돼 끊겼는데 초록으로 보이는 신뢰 시그널 왜곡 버그가 난다.** (연결 실패해도 "100% LOCAL"·"EXTERNAL CALLS: 0"은 유지 — 로컬 정체성은 연결과 무관.)
  - `ExternalCallsCounter count={health.external_calls ?? 0}` — 항상 0. `100% LOCAL` 라벨은 고정.
- 키트 `AppShell`의 트러스트 클러스터는 현재 `status="ok"`·`count={0}` 하드코딩이다. 이를 health state로 바꾸되 **시각·문구·구성은 동일**하게.
- 사이드레일·고정 헤더·`ScreenNav`(검색/인덱싱/평가 + Lucide 아이콘 search/database/gauge)는 키트 구조 그대로 유지.
- 화면 컴포넌트 내부의 가짜 데이터·인터랙션은 **이 페이즈에서 건드리지 않는다**(껍데기만 정상 렌더되면 OK).

---

### 산출물 (생성/수정 파일 목록)

- 생성: `src/api/__init__.py`
- 생성: `src/api/server.py` (FastAPI — health/answer/search/eval/index 라우트, CORS 로컬, 외부호출 0)
- 생성: `web/package.json`, `web/vite.config.js`, `web/index.html`
- 생성: `web/src/main.jsx`, `web/src/App.jsx`
- 복사·전환: `web/src/screens/{AppShell,QueryScreen,IndexScreen,EvalScreen}.jsx` (전역→ESM import; `window.*`·`Object.assign(window,...)` 전부 제거, `SideRail`/`RailSection`은 AppShell에서 named export)
- 복사·전환: `web/src/ds/components/**` + `web/src/ds/components/index.js`(배럴, 21 컴포넌트 named export. `Icon.jsx`는 정본 그대로 복사 — lucide-react 미사용)
- 복사: `web/src/styles/{styles.css,tokens/*.css}`
- 생성·로컬화: `web/src/styles/fonts.css` + `web/src/styles/fonts/` (woff2 또는 업로드 요청 README)
- 수정: `web/src/screens/AppShell.jsx` (트러스트 클러스터를 `/api/health` 실데이터에 배선)
- (정본 `디자인/...`·백엔드 `src/app`·`eval/`은 **수정 금지**)

---

### 완료 기준 (통과 못 하면 다음 페이즈 금지)

1. **외부 호출 0건 — 최우선(INV-3).** 빌드 산출물·소스에서 외부 URL 0건:
   ```bash
   cd web && npm run build
   # 빌드 산출물(dist) + 소스에서 외부 호출 패턴 0건이어야 함
   grep -rEn "https?://(cdn|unpkg|fonts\.googleapis|fonts\.gstatic|jsdelivr)" web/dist web/src 2>/dev/null && echo "FAIL: 외부 URL 잔존" || echo "PASS: 외부 URL 0건"
   ```
   하나라도 잡히면 **실패** — vendoring을 끝낼 때까지 다음 페이즈 금지.
2. **API 서버가 LMStudio·openai 직접 호출 0건:**
   ```bash
   grep -rEn "openai|OpenAI\(|localhost:1234|127\.0\.0\.1:1234|:1234" src/api/ && echo "FAIL" || echo "PASS"
   ```
   (`localhost:1234`는 health 응답의 **문자열 라벨**로만 등장 가능 — fetch/클라이언트 생성이 아니라면 허용. 위 grep에 걸리면 라벨인지 호출인지 사람이 확인.)
3. **헬스 라우트 동작:** `GET /api/health`가 `external_calls: 0`을 포함한 JSON 200 반환.
4. **CORS 로컬 고정:** `src/api/server.py`에 `allow_origins="*"`가 없고 `localhost`/`127.0.0.1`만.
5. **프론트 빌드 성공·전역 의존 제거:** `npm run build` 성공, 그리고
   ```bash
   grep -rn "DocsEmDesignSystem_afe3d1\|window\." web/src/screens web/src/ds && echo "FAIL: 전역 잔존" || echo "PASS: ESM 전환"
   ```
   이 광의 `window\.` grep은 `DocsEmDesignSystem_afe3d1` 전역뿐 아니라 **키트의 `window.SideRail`·`window.RailSection` 교차 참조와 `window.AppShell`/`window.QueryScreen` 등 화면 전역 참조, `Object.assign(window, ...)` 노출까지 모두 잡는다.** 즉 작업 지시 #2의 SideRail/RailSection·화면 ESM 전환을 빠뜨리면 여기서 **FAIL**로 걸러진다(의도된 검증). 정당한 `window` 사용(예: `window.matchMedia`)이 꼭 필요하면 해당 줄만 사람이 확인해 예외 처리.
6. **AppShell 렌더·신뢰 시그널 노출:** dev 서버에서 3화면 모두 `ConnectionBadge`(localhost:1234)·`ExternalCallsCounter`(0)·`100% LOCAL`이 헤더에 보이고, `ScreenNav`로 query↔index↔eval 토글이 된다. 헬스 실패 시 `ConnectionBadge`가 `down`(빨강 "연결 끊김")으로 표시되는지 확인(초록 "연결됨"으로 폴백되면 status 값 오류).
7. **BGE-M3 화면A 미노출:** QueryScreen에 BGE-M3(1024) 신규 표현이 추가되지 않았다(키트 원본과 화면A 표현 동일).

---

### 검증 명령 (복붙 실행 — macOS BSD 기준)

```bash
# --- 백엔드 API 서버 ---
source .venv/bin/activate
uv pip install "fastapi>=0.111" "uvicorn[standard]>=0.30" "python-multipart>=0.0.9"
# 서버 기동(백그라운드)
uvicorn src.api.server:app --host 127.0.0.1 --port 8000 &
SERVER_PID=$!
sleep 2
# health
curl -s http://127.0.0.1:8000/api/health | python3 -m json.tool
# external_calls=0 확인
curl -s http://127.0.0.1:8000/api/health | grep -q '"external_calls": 0' && echo "PASS health" || echo "FAIL health"
# API 서버 외부호출/openai 0건
grep -rEn "openai|OpenAI\(" src/api/ && echo "FAIL openai" || echo "PASS no-openai"
# CORS 와일드카드 금지
grep -rn 'allow_origins=\["\*"\]\|allow_origins=\"\*\"' src/api/ && echo "FAIL cors-wildcard" || echo "PASS cors-local"
kill $SERVER_PID 2>/dev/null

# --- 프론트 ---
cd web
node --version && npm --version
npm install
npm run build
# 외부 URL 0건 (빌드 산출물 + 소스)
grep -rEn "https?://(cdn|unpkg|fonts\.googleapis|fonts\.gstatic|jsdelivr)" dist src 2>/dev/null && echo "FAIL external-url" || echo "PASS no-external-url"
# 전역 의존 제거 (DocsEmDesignSystem 전역 + window.SideRail/RailSection + 화면 전역 + Object.assign(window,...) 모두 검출)
grep -rn "DocsEmDesignSystem_afe3d1\|window\." src && echo "FAIL global-dep" || echo "PASS esm"
# lucide-react 미도입 확인 (정본 Icon.jsx 자기완결)
grep -rn "lucide-react" package.json src && echo "FAIL lucide-react 도입" || echo "PASS no-lucide-react"
# dev 서버 수동 확인 (백엔드도 8000에 떠 있어야 /api 프록시 동작)
echo "수동: 'npm run dev' 후 http://localhost:5173 에서 3화면 토글·헤더 신뢰 클러스터 확인. 백엔드 정지 상태로 새로고침 시 ConnectionBadge가 down(빨강 '연결 끊김')인지 확인"
```

---

### 다음 페이즈 핸드오프

- **산출**: 로컬 FastAPI(`:8000`, `/api/health|answer|search|eval|index/*`) + Vite 프론트(`web/`, `:5173`, `/api` 프록시) + ESM 전환된 디자인 시스템 + 폐쇄망 vendoring 폰트 + 헬스 배선된 AppShell·3화면 라우팅 껍데기.
- **다음(페이즈 10)**: QueryScreen(화면 A) 실배선 — `POST /api/answer`·`POST /api/search`로 가짜 데이터를 교체. 인라인 각주(인용⊆Top-k), 검색모드 Segmented(벡터/BM25/하이브리드RRF), Top-k=5 청크카드, 격차 -0.018, cutoff 앰버점선을 실응답에 연결. (citation은 전달 Top-k의 부분집합, 추측 금지, prompt_tokens=0 앰버 태그.)
- **남은 일 메모**: 폰트 woff2가 아직 업로드 안 됐으면 페이즈 10 시작 전 vendoring 마무리. `/api/index/reindex`가 `501`로 남았으면 인덱싱 화면(B) 배선 페이즈에서 백엔드 진입점 확정 후 구현.
```
