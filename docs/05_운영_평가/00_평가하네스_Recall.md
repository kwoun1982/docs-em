# 00. 평가 하네스: Recall 측정과 골든셋

RAG 검색 품질을 정량 증명하는 평가 하네스 설계. 골든셋 구축, Recall@k/MRR/nDCG 정의, 변수 1개씩 측정 절차, Recall@1 0→1 목표를 규정합니다.

> 관련: [운영 런북](./01_운영_런북.md) · [내부 API 레퍼런스](../04_아키텍처_API/02_내부API_인터페이스.md) · [시작프롬프트 §B-8](../../시작프롬프트.md)

---

## 1. 왜 평가 하네스인가

개선은 느낌이 아니라 **정량 지표로 증명**합니다. "임베딩을 바꿨더니 좋아진 것 같다"는 판단은 금지합니다. 모든 변경은 동일 골든셋·동일 지표로 전후를 비교하고, 회귀(기존에 맞던 질의가 틀리는 것)가 없음을 확인한 뒤에만 채택합니다.

이 프로젝트의 출발점은 명확한 실패 사례입니다.

- 질의: `연차 휴가 신청 절차`
- 정답 청크: 휴가규정 문서 소속 청크
- 현재 임베딩(text-embedding-nomic-embed-text-v1.5, 768차원) 결과: 정답이 **3위**, 오답(출장경비)보다 점수 격차 **-0.018**
- 즉 **Recall@1 = 0** (1위가 정답이 아님)

목표는 임베딩 교체(BGE-M3) 또는 리랭커 도입 후 이 질의의 **Recall@1 = 1**을 달성하는 것입니다. 이 단일 회귀 케이스가 하네스의 첫 번째 합격 기준입니다.

---

## 2. 골든셋 구축

### 2.1 형식: `eval/queries.yaml`

골든셋은 `(질의, 정답 청크 id 집합)` 쌍의 모음입니다. 최소 **20~50개**를 구축하며, 연차휴가 회귀 케이스를 **반드시** 포함합니다.

```yaml
# eval/queries.yaml
# 골든셋: (질의, 정답 청크 id 집합)
# relevant_ids 는 "이 질의에 대해 정답으로 인정하는 청크 id 들"
version: 1
queries:
  - id: q001
    query: "연차 휴가 신청 절차"
    relevant_ids: ["vacation_policy#c03", "vacation_policy#c04"]
    note: "회귀 케이스. 현재 정답 3위, 오답(출장경비)보다 -0.018. 목표 Recall@1=1"
    tags: [regression, hr, korean]

  - id: q002
    query: "출장 경비 정산 한도"
    relevant_ids: ["travel_expense#c07"]
    tags: [hr, korean]

  - id: q003
    query: "재택근무 신청 조건"
    relevant_ids: ["remote_work#c01", "remote_work#c02"]
    tags: [hr, korean]
  # ... 최소 20개, 권장 50개까지 확장
```

규칙:

- `relevant_ids`는 1개 이상. 정답이 여러 청크에 분산되면 모두 나열합니다.
- 청크 id는 인덱싱 파이프라인이 부여하는 안정적 식별자(`{doc_id}#{chunk_index}` 형식 권장)와 일치해야 합니다. → 식별자 규약은 [내부 API §청크 스키마](../04_아키텍처_API/02_내부API_인터페이스.md) 참조.
- `tags`로 도메인/회귀 여부를 분류해 부분 집계(예: `regression` 태그만 추출)를 가능하게 합니다.

### 2.2 청크 id 안정성 — **DECISION**

청크 id는 평가의 기준점이므로 재인덱싱 후에도 동일 청크가 동일 id를 유지해야 합니다. 청킹 전략(크기/오버랩)을 바꾸면 청크 경계가 달라져 id가 깨질 수 있습니다. 청크 전략 변경 시 골든셋의 `relevant_ids`를 **재검수**할지, 아니면 id를 내용 해시 기반으로 부여할지는 **DECISION** 사항입니다. L1 단계에서는 고정 전략으로 시작하고, 청크 전략을 변경하는 측정에서는 골든셋 재검수를 절차에 포함합니다(§4.3).

### 2.3 골든셋 구축 절차

1. 실제·예상 사용자 질의를 수집(현장 질문, 문서 제목 기반 변형 등).
2. 각 질의에 대해 현재 인덱스에서 상위 결과를 사람이 검토해 정답 청크 id를 라벨링.
3. 도메인이 한쪽으로 쏠리지 않도록 분산(인사/총무/규정/절차 등).
4. 회귀 케이스(연차휴가 등 실측 실패 질의)를 우선 등록.
5. 라벨 검수는 2인 교차 권장([확인필요] 인력 가용 여부).

---

## 3. 지표 정의와 계산식

검색 결과는 질의 `q`에 대해 점수 내림차순으로 정렬된 청크 id 리스트입니다. `rel(i)`는 i번째(1-base) 결과가 정답이면 1, 아니면 0입니다. 정답 집합은 `R = relevant_ids`입니다.

### 3.1 Recall@k (k = 1, 3, 5, 10)

상위 k개 안에 정답이 **하나라도** 포함되면 1, 아니면 0으로 보는 **hit 기반**(질의당 이진) 정의를 기본으로 사용합니다. 골든셋의 정답 청크가 소수(1~2개)이고 "사용자가 첫 화면에서 답을 찾는가"를 측정하기 위함입니다.

$$
\text{Recall@k}(q) = \mathbb{1}\left[\,\exists\, i \le k : \text{rel}(i) = 1\,\right]
$$

전체 지표는 질의 평균입니다.

$$
\text{Recall@k} = \frac{1}{|Q|} \sum_{q \in Q} \text{Recall@k}(q)
$$

참고: 정답이 여러 개인 질의에서 "상위 k 안에 든 정답 비율"을 보는 **집합 기반 Recall**($|\text{top-}k \cap R| / |R|$)도 보조 지표로 함께 출력합니다. 기본 합격 기준은 hit 기반입니다.

### 3.2 MRR (Mean Reciprocal Rank)

각 질의에서 **첫 번째 정답의 순위** 역수의 평균입니다. 1위에 정답이면 1.0, 3위면 1/3입니다. 상위 k 안에 정답이 없으면 0으로 처리합니다.

$$
\text{MRR} = \frac{1}{|Q|} \sum_{q \in Q} \frac{1}{\text{rank}_q}, \quad
\text{rank}_q = \min\{\, i : \text{rel}(i) = 1 \,\}
$$

연차휴가 케이스: 현재 정답이 3위이므로 이 질의의 RR은 1/3 ≈ 0.333입니다. 목표는 1.0입니다.

### 3.3 nDCG@k

순위 가중 지표. DCG는 상위 순위 정답에 더 큰 가중을 주고, IDCG(이상적 정렬의 DCG)로 정규화합니다.

$$
\text{DCG@k}(q) = \sum_{i=1}^{k} \frac{\text{rel}(i)}{\log_2(i+1)}, \qquad
\text{nDCG@k}(q) = \frac{\text{DCG@k}(q)}{\text{IDCG@k}(q)}
$$

`IDCG@k`는 정답들을 1위부터 채웠을 때의 DCG입니다(정답 수 `m`, `j = 1..min(m,k)`에 대해 `Σ 1/log2(j+1)`). 전체 nDCG@k는 질의 평균입니다. 이진 relevance 기준이며, 등급별 relevance는 도입하지 않습니다.

### 3.4 지표 요약

| 지표 | 측정 대상 | 연차휴가 현재값 | 목표값 |
|---|---|---|---|
| Recall@1 | 1위가 정답인가 | 0 | **1** |
| Recall@3 | 상위 3에 정답 | 1 (3위 포함) | 1 |
| MRR | 첫 정답 순위 역수 | 0.333 (3위) | 1.0 |
| nDCG@3 | 순위 가중 | 0.5 (3위 1개) | 1.0 |

> nDCG@3 = 1/log2(4) / (1/log2(2)) = 0.5 (정답 1개가 3위일 때).

---

## 4. 측정 절차

### 4.1 철칙: 변수는 한 번에 하나만

여러 변수를 동시에 바꾸면 무엇이 개선/악화에 기여했는지 분리할 수 없습니다. 반드시 **베이스라인 → 변수 1개 변경 → 측정 → 비교**를 반복합니다. → 측정 원칙 [시작프롬프트 §B-8](../../시작프롬프트.md) 참조.

### 4.2 변경 변수 순서

| 단계 | 변경 변수 | 베이스라인 대비 |
|---|---|---|
| 0 | 베이스라인 (nomic 768, 고정 청크, dense only) | 기준점 |
| 1 | 임베딩 교체 (nomic → BGE-M3 1024) | 임베딩만 변경. 768→1024 인덱스 재생성 + norm 재측정 필수 |
| 2 | 청크 전략 (크기/오버랩) | 청크만 변경. 골든셋 재검수 포함 |
| 3 | 하이브리드 (dense + BM25, RRF 결합) | 결합 방식만 추가 |
| 4 | 리랭커 (BGE-reranker-v2-m3) | 리랭킹 단계만 추가 |

각 단계는 독립적으로 측정하고, 채택 여부를 정량 지표로 결정합니다. 임베딩 교체·재정규화 제약, 모델 사양은 [시작프롬프트 §임베딩](../../시작프롬프트.md) 참조.

### 4.3 단계별 절차

1. **베이스라인 고정**: 현재 인덱스로 골든셋 전체를 평가해 표를 기록(`reports/baseline.json`).
2. **변수 1개 변경**: 위 순서 중 하나만 적용.
   - 임베딩 교체 시: 768→1024 인덱스 **재생성**, 임베딩 출력 norm 재측정(`abs(norm-1.0)<1e-3` 가드 통과 확인).
   - 청크 변경 시: 청크 경계가 바뀌므로 골든셋 `relevant_ids` **재검수**(§2.2).
3. **재측정**: 동일 골든셋·동일 지표로 평가.
4. **회귀 확인**: 이전 단계에서 통과하던 질의(특히 `regression` 태그)가 깨지지 않았는지 점검. 깨졌다면 채택 보류.
5. **전후 표 비교**: 아래 형식으로 출력.

### 4.4 전후 비교 표 (예시 형식)

| 지표 | 베이스라인 (nomic) | 변경 (BGE-M3) | Δ |
|---|---|---|---|
| Recall@1 | 0.00 | 0.00 | — |
| Recall@3 | 0.00 | 0.00 | — |
| Recall@5 | 0.00 | 0.00 | — |
| Recall@10 | 0.00 | 0.00 | — |
| MRR | 0.00 | 0.00 | — |
| nDCG@5 | 0.00 | 0.00 | — |
| **연차휴가 Recall@1** | **0** | **목표 1** | — |

> 위 표의 수치는 자리표시자입니다. 코드와 인덱스 구축 후 실측으로 채웁니다(현재 코드 없음).

---

## 5. `evaluate.py` 구조

`eval/evaluate.py`는 골든셋을 로드하고, 검색 파이프라인을 호출해 결과를 받아 지표를 계산하고 표/JSON을 출력합니다. 검색 호출은 [내부 API의 retrieve 인터페이스](../04_아키텍처_API/02_내부API_인터페이스.md)에 의존합니다.

```python
# eval/evaluate.py (구조 스케치 — 실제 retrieve 시그니처는 내부 API 문서 기준)
import math
import yaml

def load_golden(path="eval/queries.yaml"):
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)["queries"]

def recall_at_k(ranked_ids, relevant, k):
    """hit 기반: 상위 k에 정답이 하나라도 있으면 1.0"""
    return 1.0 if set(ranked_ids[:k]) & set(relevant) else 0.0

def reciprocal_rank(ranked_ids, relevant):
    rel = set(relevant)
    for i, cid in enumerate(ranked_ids, start=1):
        if cid in rel:
            return 1.0 / i
    return 0.0

def ndcg_at_k(ranked_ids, relevant, k):
    rel = set(relevant)
    dcg = sum(1.0 / math.log2(i + 1)
              for i, cid in enumerate(ranked_ids[:k], start=1) if cid in rel)
    m = min(len(rel), k)
    idcg = sum(1.0 / math.log2(j + 1) for j in range(1, m + 1))
    return dcg / idcg if idcg > 0 else 0.0

def evaluate(search_fn, golden, ks=(1, 3, 5, 10), ndcg_k=5):
    """search_fn(query) -> 점수 내림차순 청크 id 리스트"""
    agg = {f"recall@{k}": 0.0 for k in ks}
    agg["mrr"] = 0.0
    agg[f"ndcg@{ndcg_k}"] = 0.0
    rows = []
    for q in golden:
        ranked = search_fn(q["query"])          # 검색 파이프라인 호출
        rel = q["relevant_ids"]
        r = {f"recall@{k}": recall_at_k(ranked, rel, k) for k in ks}
        r["mrr"] = reciprocal_rank(ranked, rel)
        r[f"ndcg@{ndcg_k}"] = ndcg_at_k(ranked, rel, ndcg_k)
        for key, val in r.items():
            agg[key] += val
        rows.append({"id": q["id"], **r})
    n = len(golden)
    summary = {key: round(val / n, 4) for key, val in agg.items()}
    return summary, rows  # summary=전체 평균, rows=질의별(회귀 점검용)

# 사용:
# golden = load_golden()
# summary, rows = evaluate(retrieve.search, golden)
# print(summary)  # {'recall@1': ..., 'mrr': ..., 'ndcg@5': ...}
# regression = [r for r in rows if r["id"] == "q001"]  # 연차휴가 회귀 점검
```

설계 원칙:

- `search_fn`은 주입(injection)합니다. 임베딩/청크/하이브리드/리랭커 어떤 구성이든 동일 함수 시그니처(`query -> ranked id 리스트`)로 받아 **하네스 자체는 변경하지 않습니다**. 변수 1개씩 측정의 전제입니다.
- 질의별 결과(`rows`)를 반드시 보존해 회귀(특정 질의 악화)를 집계 평균에 묻히지 않게 합니다.
- 결과는 `reports/{step}.json`으로 저장해 단계 간 비교(§4.4)에 사용합니다.

---

## 6. 정량 목표 (합격 기준)

| 항목 | 현재 | 목표 |
|---|---|---|
| 연차휴가 `Recall@1` | 0 | **1** |
| 연차휴가 MRR | 0.333 | 1.0 |
| 골든셋 규모 | 0 | 20~50개 (회귀 케이스 포함) |
| 회귀 케이스 통과 | — | 변경 채택 시 회귀 0건 |

L1(검색 MVP) 단계의 종료 조건은 "골든셋 구축 + 베이스라인 측정 완료"이며, L2(임베딩 교체/하이브리드) 단계의 핵심 합격 기준은 **연차휴가 Recall@1 = 1** 달성입니다. 로드맵 단계 정의는 [시작프롬프트 §로드맵](../../시작프롬프트.md) 참조.

---

## 7. 형제 문서 링크

- 운영 절차·인덱스 재생성·재측정 운영 흐름: [운영 런북](./01_운영_런북.md)
- `search_fn` 시그니처·청크 id 스키마·retrieve 인터페이스: [내부 API 레퍼런스](../04_아키텍처_API/02_내부API_인터페이스.md)
- 측정 원칙·임베딩 제약·로드맵 SSOT: [시작프롬프트](../../시작프롬프트.md)
