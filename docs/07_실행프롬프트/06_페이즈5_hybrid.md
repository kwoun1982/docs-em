> **이 파일 전체를 에이전트형 코딩 도구(Claude Code/Cursor)에 붙여넣어 이 페이즈 하나만 실행하세요.**
> 페이즈 사이에 컨텍스트를 초기화합니다. 사용법·순서·게이트는 [00_실행개요.md](./00_실행개요.md) 참조.
> 정본: [00_결정 통합](../00_결정/00_결정해야할것_통합.md) · [내부 API 계약](../04_아키텍처_API/02_내부API_인터페이스.md) · [불변식 INV-1~8](../99_AI참조/01_실측제약_불변식.md)

# 페이즈 5: BM25 · RRF 하이브리드 검색 (L2)

### 이 페이즈의 목표
Kiwi 형태소 토큰화 기반 BM25 검색 경로를 추가하고, dense 결과와 BM25 결과를 순위 기반 RRF(k=60)로 결합한다. 그 후 evaluate로 `dense만` vs `+bm25` vs `+rrf` 기여도를 변수 1개씩만 바꿔 정량 측정한다.

### 사전 조건 (이전 페이즈 산출물 — 파일에서 상태 확인)
컨텍스트가 초기화된 상태에서 시작하므로, 코드를 쓰기 전에 아래를 **파일로 직접 읽어** 존재를 확인한다.

```bash
# 1) 임베딩/검색/평가가 이미 있는지 확인
ls -1 src/embed/embedder.py src/store/vector_store.py src/retrieve/search.py eval/queries.yaml eval/evaluate.py config/settings.yaml 2>&1
# 2) 인덱스 사이드카 헤더 존재 확인 (glob 비의존, find 기반). 0건이면 인덱스 부재이므로 즉시 중단(아래 차단 조건)
find data -name _index_header.json 2>/dev/null
# 3) dense 전용 search()가 동작하고 회귀 케이스가 평가되는지 확인 (이 결과가 페이즈5 baseline)
#    주의: 직전 페이즈 상태에 따라 evaluate가 아직 use_bm25를 search로 전달하지 않을 수 있다.
#    그 경우 이 baseline은 dense-only와 동일하며, 본 페이즈에서 use_bm25 전달을 추가한다.
python -c "from eval.evaluate import evaluate; r=evaluate(use_bm25=False, use_rerank=False); print('dense recall@1=', r.recall_at_1, 'mrr=', r.mrr)"
```

- `src/embed/embedder.py`: `embed(texts, model="text-embedding-nomic-embed-text-v1.5") -> list[Vector]` 가 있어야 한다(norm 가드 포함).
- `src/store/vector_store.py`: VectorStore Protocol(add/search/delete)과 LanceDB 구현, 사이드카 `_index_header.json`이 있어야 한다.
- `src/retrieve/search.py`: dense 전용 `search(query, *, top_k=30, use_bm25=True) -> list[SearchHit]`가 이미 있어야 한다(이번에 BM25 경로를 채운다).
- `eval/queries.yaml`: 골든셋. 회귀 케이스 "연차 휴가 신청 절차" → 정답 휴가규정이 **반드시** 포함되어 있어야 한다.
- `eval/evaluate.py`: `evaluate(...) -> EvalResult`가 있어야 한다(이번에 `use_bm25` 스위치를 실제로 검색에 전달한다).
- **차단 조건 (선결, 미충족 시 즉시 중단)**:
  - 위 파일 중 하나라도 없으면 **이 페이즈를 시작하지 말고** 직전 페이즈로 돌아간다.
  - `find data -name _index_header.json`이 **0건**이거나, 인덱스에 골든셋 **정답 청크(회귀 케이스 휴가규정 포함)가 적재돼 있지 않으면** 이 페이즈를 시작하지 않는다. 인덱스/정답 청크 적재는 BM25 코퍼스 구성과 회귀 측정의 선결 조건이며, 부재 시 검증 명령(#2·#3 evaluate)이 빈 코퍼스로 전부 깨진다. 인덱싱은 이 페이즈 범위가 아니므로 직전 페이즈로 돌아간다.

타입 계약(고정):
- `Chunk(chunk_id, doc_id, text, source_path, chunk_index, meta)`
- `SearchHit(chunk, score, rank, source ∈ {dense, bm25, rrf, rerank})` — **`rank`는 0-기반(첫 결과 rank=0). 계약 §1·§4.1.**
- `EvalResult(recall_at_1/3/5/10, mrr, ndcg_at_10, per_query)` — `per_query`는 `list[dict]` 질의별 상세(스키마는 작업 지시 3에서 고정).

### 절대 규칙 (이 페이즈에서 위반 금지)
- **INV-3**: 외부 API 금지. BM25/RRF는 전부 로컬 인메모리 연산. 질의 임베딩도 `base_url=localhost:1234` 외 호출 0건.
- **INV-7**: 정량 증명. 변수는 **한 번에 1개만** 바꾼다(`dense만` → `+bm25` → `+rrf` 순서). 회귀 케이스 합격선 `Recall@1=1`은 **이 페이즈의 하드 게이트가 아니다** — SSOT(§A-2④, 평가하네스_Recall 라인17-20·143, 회귀케이스 절)는 이 -0.018/3위 실패의 직접 교정 수단을 **L2 임베딩 교체(BGE-M3) 또는 L3 리랭커(BGE-reranker-v2-m3)**로 규정한다. RRF 하이브리드만으로 이 질의가 1위로 전환된다는 실측 근거는 없다. 이 페이즈에서는 RRF 결합 후 회귀 케이스 순위를 **측정·관찰**할 뿐이며, 1로 전환되지 않아도 INV-7 위반이 아니다(다음 레버=리랭커로 이월). 미측정 결과를 "반드시 1로 전환"이라 단정하는 것 자체가 발명 금지 위반이다.
- **INV-1**: 임베딩 재정규화 금지. dense 경로에서 nomic 벡터(norm=1.0)를 다시 정규화하지 않는다. 이 페이즈는 임베딩 코드를 건드리지 않는다.
- **INV-8**: prefix는 nomic에서 미미. dense 질의 임베딩은 **인덱싱과 동일 모델·동일 prefix 규칙**을 그대로 따른다(BM25 추가를 빌미로 prefix를 바꾸지 않는다).
- dense 검색 점수 체계는 그대로 둔다. **RRF는 점수가 아니라 순위(rank) 기반**이므로 dense·BM25의 점수 스케일을 섞지 않는다.

### 작업 지시

#### 1) `src/retrieve/fusion.py` — RRF (신규)
순위 기반 RRF. 점수는 절대 쓰지 않는다.

```python
def rrf(rank_lists: list[list[str]], k: int = 60) -> dict[str, float]:
    """
    rank_lists: 각 검색기의 결과를 '순위 오름차순'으로 정렬한 id 리스트들.
                (rank_lists[0] = dense의 id들, rank_lists[1] = bm25의 id들 ...)
    반환: {id: rrf_score} — rrf_score = Σ 1/(k + rank),  rank는 1부터 시작.
    동일 id가 여러 리스트에 등장하면 점수 합산. 점수 내림차순이 최종 순위.

    주: 여기 docstring의 'rank 1부터'는 fusion 내부 표기일 뿐이며,
        SSOT §B-6의 enumerate(0-base)+1.0/(k+rank+1) 수식과 동치다
        (내부 rank=0-base일 때 1/(k+rank+1) = 내부 rank=1-base일 때 1/(k+rank)).
        이 rrf_score는 점수이며, SearchHit.rank(0-기반)와는 별개다.
    """
```
- `rank`는 fusion 내부에서 1-기반으로 표기(첫 결과 rank=1)하되 위 수식 동치를 docstring에 명기. 빈 리스트·중복 id 방어.
- 정렬 동률 시 결정적(deterministic) 정렬을 위해 id 기준 2차 정렬키를 둔다.

#### 2) `src/retrieve/search.py` — BM25 경로 + 하이브리드 결합 (수정)
시그니처 고정: `search(query, *, top_k=30, use_bm25=True) -> list[SearchHit]`

- **Kiwi 토큰화**: `kiwipiepy`의 Kiwi로 형태소 분석 후 토큰(형태소 표층형) 리스트를 만든다. 동일 토크나이저를 인덱싱 시점과 질의 시점에 **동일하게** 적용한다.
- **BM25 인덱스**: `rank_bm25`(BM25Okapi)로 전체 청크 코퍼스를 인덱싱. 코퍼스는 vector_store에서 전체 Chunk를 읽어 구성한다.
- **Kiwi 버전 = BM25 인덱스 무효화 키**: BM25 인덱스를 디스크에 캐시할 경우, 사이드카 메타에 `kiwi_version`(`from importlib.metadata import version; version("kiwipiepy")` — 패키지 메타데이터 기반이 가장 robust)과 코퍼스 청크 수·해시를 기록한다. 로드 시 현재 Kiwi 버전과 다르면 **인덱스를 폐기하고 재빌드**(무음 통과 금지, 재빌드 로그 남김). 캐시를 안 쓰면 매 호출 인메모리 재빌드라도 무방하나, 그 경우에도 사용한 `kiwi_version`을 SearchHit/로그로 노출한다.
- **dense 경로**: 기존대로 질의 임베딩(`embed([query])[0]`) → vector_store.search로 상위 후보. 점수 내림차순.
- **결합**:
  - `use_bm25=False`: dense 결과만 반환. 각 hit의 `source="dense"`, `score`=dense 점수, `rank`=**0-기반(첫 결과 rank=0, SearchHit 계약 §1/§4.1)**.
  - `use_bm25=True`: dense 상위 `top_k`개 id 순위 리스트와 BM25 상위 `top_k`개 id 순위 리스트를 만들어 `rrf([dense_ids, bm25_ids], k=60)`로 결합. 결과를 rrf_score 내림차순으로 정렬, 각 hit의 `source="rrf"`, `score`=rrf_score, `rank`=**0-기반(첫 결과 rank=0, SearchHit 계약 §1/§4.1)**. 최종 `top_k`개 반환.
- BM25/dense 각각은 내부적으로 최소 `top_k`개를 확보한 뒤 RRF에 넣는다(한쪽만 있는 id도 RRF 합산 대상).
- 반환은 항상 `score` 내림차순, `rank`는 그 순서대로 **0부터** 연속(SearchHit 계약).

#### 3) `eval/evaluate.py` — 스위치 전달 + per_query 스키마 고정 (수정)
시그니처 고정: `evaluate(golden_path="eval/queries.yaml", *, k_list=(1,3,5,10), use_bm25=False, use_rerank=False) -> EvalResult`
- `evaluate` 내부에서 `search(query, top_k=max(k_list), use_bm25=use_bm25)`로 호출하도록 `use_bm25`를 **키워드 인자로 그대로 전달**한다(`search`는 키워드 전용 시그니처). 이 페이즈에서 `use_rerank`는 전달만 받고 동작은 추가하지 않음 — 다음 페이즈.
- **per_query 스키마 고정 (검증 명령 #3이 읽는 키와 일치시킬 것)**: `per_query`는 `list[dict]`이며, 각 항목은 최소 아래 키를 갖는다(키 표기는 `@` 구분자 — 평가하네스 문서 rows와 통일).
  - `id`: 질의 식별자(회귀 케이스는 `q001`).
  - `query`: 질의 문자열.
  - `gold_rank`: 해당 질의에서 정답 청크가 검색 결과에서 차지한 순위. **SearchHit.rank와 동일하게 0-기반**(정답이 1위면 `gold_rank=0`). 정답이 결과에 없으면 `None`(또는 미발견 표식).
  - `recall@1`, `mrr`, `ndcg@5`: 질의별 지표(`@` 표기).
  - 회귀 케이스 추적이 가능하도록 `gold_rank`를 반드시 채운다.

#### 4) `config/settings.yaml` — 플래그 (수정)
- `retrieve.use_bm25`(기본 true), `retrieve.rrf_k`(기본 60), `retrieve.top_k`(기본 30) 항목 추가.
- **settings 기본값 적용 주체 고정**: settings의 이 기본값은 **호출자(예: `cli`/`answer`)가 읽어 `search`/`evaluate`에 키워드 인자로 주입**한다. `search`의 고정 시그니처 기본값(`top_k=30`, `use_bm25=True`)은 **인자가 명시되지 않았을 때의 함수 자체 폴백**이며, 호출자가 settings 값을 명시 주입하면 그 값이 우선한다(인자 우선). 즉 `search` 내부에서 settings를 조회하지 않는다(우선순위 충돌 제거 — settings→호출자→인자 명시 순으로 좁혀지고, 최종은 항상 명시 인자가 이김).

#### 5) `tests/test_fusion.py` — RRF 단위 테스트 (신규)
- 단일 리스트 입력 시 순위 보존.
- 두 리스트에서 공통 id가 양쪽 상위면 단독 1위 id들보다 높게 합산되는 케이스.
- 빈 리스트·중복 id 방어.
- 동률 결정성(같은 입력 → 같은 순서).

### 산출물
- 신규: `src/retrieve/fusion.py`
- 수정: `src/retrieve/search.py` (BM25 경로 + RRF 결합)
- 수정: `eval/evaluate.py` (`use_bm25` 전달 + per_query 스키마)
- 수정: `config/settings.yaml` (use_bm25 / rrf_k / top_k)
- 신규: `tests/test_fusion.py`

### 완료 기준 (통과 못 하면 다음 페이즈 금지)
1. `tests/test_fusion.py` 전부 통과.
2. 세 변수 측정이 **각각 1개 변수만** 바뀐 채로 돌아가고 수치가 출력된다: `dense만` / `+bm25(RRF off, bm25 단독)`는 옵션, **필수는 `dense만` vs `+rrf(use_bm25=True)`**.
3. **회귀 케이스 측정·관찰 (게이트 아님)**: "연차 휴가 신청 절차"가 `dense만`에서 정답 휴가규정 3위(`gold_rank=2`, Recall@1=0)였던 상태를 baseline으로, `use_bm25=True`(RRF 결합) 후 정답 순위를 per_query의 `gold_rank`에서 **측정·기록**한다. `gold_rank=0`(=Recall@1=1)으로 전환되면 기록하고, 전환되지 않으면 다음 레버(L3 리랭커 BGE-reranker-v2-m3, §A-2④)로 **이월**한다 — 하이브리드만으로 1 전환이 보장된 실측은 없으며(미측정 결과 발명 금지), 미전환이 곧 INV-7 위반은 아니다.
4. **비감소 게이트 (유지)**: RRF 결합이 골든셋 **전체 평균** `recall@k`를 dense-only 대비 떨어뜨리지 않는다(비감소). 떨어지면 변수 점검. 이 게이트는 단일 회귀 질의의 1 전환 강제와 **분리**한다.
5. dense 임베딩 코드·norm 가드는 변경 없음(INV-1). 외부 API 호출 0건(INV-3).

### 검증 명령
```bash
# 1) RRF 단위 테스트
pytest tests/test_fusion.py -q

# 2) 변수 1개씩 측정 (dense만 vs +rrf) — 전체 평균 비감소 게이트(유지)
python -c "
from eval.evaluate import evaluate
d = evaluate(use_bm25=False, use_rerank=False)
h = evaluate(use_bm25=True,  use_rerank=False)
print('dense  recall@1/3/5/10:', d.recall_at_1, d.recall_at_3, d.recall_at_5, d.recall_at_10, 'mrr=', d.mrr)
print('+rrf   recall@1/3/5/10:', h.recall_at_1, h.recall_at_3, h.recall_at_5, h.recall_at_10, 'mrr=', h.mrr)
assert h.recall_at_1 >= d.recall_at_1, 'RRF가 dense보다 전체 평균 recall@1을 떨어뜨림 — 변수 점검(비감소 게이트)'
"

# 3) 회귀 케이스 측정·관찰 (게이트 아님 — assert로 페이즈 진행 차단하지 않음)
python -c "
from eval.evaluate import evaluate
d = evaluate(use_bm25=False, use_rerank=False)
h = evaluate(use_bm25=True,  use_rerank=False)
def find(pq): return next(q for q in pq if '연차 휴가 신청 절차' in q['query'])
dq, hq = find(d.per_query), find(h.per_query)
print('회귀케이스(dense) gold_rank=', dq.get('gold_rank'), 'recall@1=', dq.get('recall@1'))
print('회귀케이스(+rrf)  gold_rank=', hq.get('gold_rank'), 'recall@1=', hq.get('recall@1'))
if hq.get('gold_rank') == 0:
    print('관찰: RRF 결합으로 회귀 케이스 0→1 전환됨 — 기록.')
else:
    print('관찰: 하이브리드만으로 1 전환 안 됨 — 정상 범위. 다음 레버=L3 리랭커(BGE-reranker-v2-m3, §A-2④)로 이월.')
"

# 4) Kiwi 버전(BM25 무효화 키) 실측 출력 — 패키지 메타데이터 기반(가장 robust)
python -c "from importlib.metadata import version; print('kiwi_version=', version('kiwipiepy'))"

# 5) 외부 API 호출 0건 가드 — localhost 외 base_url 흔적 검사
grep -rEn "api\.openai\.com|api\.anthropic\.com|api\.cohere|generativelanguage" src/ && echo "VIOLATION INV-3" || echo "OK: 외부 API 흔적 없음"
```

### 다음 페이즈 핸드오프
- 이 페이즈의 산출물인 `search(..., use_bm25=True)`의 RRF 상위 후보(`source="rrf"`, `top_k`개)가 페이즈 6(BGE-reranker-v2-m3 리랭킹, L3)의 입력 `hits`가 된다 — `rerank(query, hits, *, top_n=5)`.
- 회귀 케이스 "연차 휴가 신청 절차"의 1 전환이 이 페이즈(하이브리드)에서 관찰되지 않았다면, 그 0→1 전환은 **L3 리랭커 또는 L2 임베딩 교체(BGE-M3)**의 단독변수 측정 게이트로 이월된다(§A-2④, INV-7).
- `evaluate(..., use_rerank=True)` 경로는 이 페이즈에서 인자만 받아둔 상태이며, 다음 페이즈에서 실제 리랭킹 동작을 연결한다.
