# LMStudio 로컬 환경 실측

로컬 LMStudio 서버(`http://localhost:1234/v1`)에 로드된 임베딩·생성 모델의 실측 스펙과 Phase 0 환경 점검(env_check) 절차를 환경 관점에서 정리합니다.

> 관련: [00_프로젝트개요.md](./00_프로젝트개요.md) · [01_기술스택결정서.md](./01_기술스택결정서.md) · [03_개발환경셋업.md](./03_개발환경셋업.md) · 정본 SSOT: [시작프롬프트.md](../../시작프롬프트.md)
>
> **역할 분담**: 본 문서는 **실측 수치와 그 해석**을 다룹니다. 셋업 절차·자동 실행은 → [03_개발환경셋업.md](./03_개발환경셋업.md), 모델/임베딩 교체의 확정은 → [01_기술스택결정서.md](./01_기술스택결정서.md).
>
> **[확인필요]** `00_프로젝트개요.md`·`01_기술스택결정서.md`는 형제 문서 03이 참조하는 계획 파일명이며, 작성 시점 기준 디렉터리에 **아직 생성되지 않았습니다**. 프로젝트 전체에서 00번 문서명은 `00_프로젝트개요.md`로 단일화합니다(파일 생성 여부 확인 필요).

---

## 1. 서버 개요

| 항목 | 값 | 비고 |
| --- | --- | --- |
| Base URL | `http://localhost:1234/v1` | OpenAI 호환 엔드포인트 |
| 프로토콜 | OpenAI Chat/Embeddings API 호환 | `openai` SDK에서 `base_url`만 교체 |
| `api_key` | 더미(`"lm-studio"` 등) | 로컬이라 인증이 무의미하므로 관례상 더미 키를 사용 (SSOT §A-1·§B-7: "키는 더미") |
| 외부 API | **없음** | OpenAI/Anthropic/Cohere 등 외부 클라우드 호출 절대 금지 |
| 실측일 | 2026-06-16 | 본 문서 수치 기준 시점 |

- 모든 추론(임베딩·생성)은 이 로컬 서버 한 곳에서만 수행됩니다. 클라우드 키·과금 경로가 존재하지 않는 것이 이 프로젝트의 전제입니다.
- 클라이언트 코드는 `OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")` 형태로 초기화합니다. 래퍼 구현은 → 시작프롬프트.md §B-7 참조.

> **`api_key` 보강 주의**: SSOT는 "로컬은 키 불필요·키는 더미"라고만 명시합니다(§A-1 L27, §B-7 L243). "빈 키를 OpenAI SDK가 거부한다"는 인과는 SSOT에 근거가 없는 **[추정]**이므로 단정하지 않습니다. 결론(더미 키 사용)만 따르면 충분합니다.

---

## 2. 로드된 모델 목록 (실측)

`GET /v1/models`로 확인되는 사용 모델은 임베딩 1종 + 생성 3종입니다.

| 모델 ID | 분류 | 용도 | 컨텍스트 | 비고 |
| --- | --- | --- | --- | --- |
| `text-embedding-nomic-embed-text-v1.5` | 임베딩 | 현재 인덱싱/질의 임베딩 | — (미기재) | 768차원, 한국어 약점(§4). ctx는 SSOT 미명시(§3.3 [확인필요]) |
| `qwen/qwen3.6-35b-a3b` | 생성(35B MoE) | 추론 품질 우선 | **8192** | 품질 우수, ctx 좁음 |
| `qwen/qwen3.5-9b` | 생성(9B급 [추정]) | 경량·빠름 | **8192** | 파라미터 수 [추정] |
| `google/gemma-4-e4b` | 생성(4B급 [추정]) | 긴 컨텍스트 RAG | **65536** | ctx 넓음, 소형이라 품질 한계 가능 |

- 생성 모델 3종은 모두 로컬이며 공통 설정 `parallel=4`입니다.
- 파라미터 수 9B/4B는 모델명에서 유추한 **[추정]**값입니다. 실측으로 확정된 것은 ctx 수치(8192/8192/65536)와 `qwen3.6-35b-a3b`의 35B MoE 구조뿐입니다.
- 임베딩 컨텍스트 칸은 SSOT가 nomic ctx를 명시하지 않으므로 의도적으로 비웠습니다(미기재). 입력 길이 한계는 §3.3 **[확인필요]**로 분리해 둡니다.

> **기본 생성모델 선택은 미확정 — DECISION**: SSOT §B-9 #8은 "답변 생성 기본 모델"을 **DECISION**(현재 제안값 `gemma-4-e4b`, ctx 65536)으로 명시합니다. 위 "용도" 칸과 §5.2 프로브가 `gemma-4-e4b`를 기본 chat 모델로 쓰는 것은 **확정 사실이 아니라 제안값**입니다. 4B급이라 품질 한계가 있어 §6 BLOCKING 해결 후 재평가 대상이며, 확정은 → [01_기술스택결정서.md](./01_기술스택결정서.md)(SSOT §B-9 #8)에서 합니다.
>
> 생성 모델별 상세 제약·운용 원칙은 → 시작프롬프트.md §B-3 참조. 본 문서는 환경(로드 상태·ctx)만 다룹니다.

---

## 3. 임베딩 스펙 실측 — `text-embedding-nomic-embed-text-v1.5`

| 항목 | 실측값 | 환경 영향 |
| --- | --- | --- |
| 차원 | **768** | 인덱스 벡터 차원 = 768 고정 |
| 정규화 | **출력 이미 L2 정규화됨**(norm=1.0) | 코드에서 **재정규화 금지** |
| metric 등가성 | 코사인 = 내적 | norm=1.0 전제에서만 성립 |
| prefix 효과 | 미미(`search_document`/`query` 적용 시 코사인 0.687 → 0.695) | 적용은 하되 품질 개선 기대 금지 |
| `usage.prompt_tokens` | **0 오보고** | 토큰 카운트 신뢰 불가 |

### 3.1 정규화 (재정규화 금지)

출력 벡터의 norm이 1.0이므로 코드에서 다시 정규화하면 안 됩니다. 정규화된 벡터끼리는 코사인 유사도 = 내적이라 metric은 dot/cosine 어느 쪽이든 동일합니다.

- **주의**: 이 등가성은 norm=1.0 전제에서만 성립합니다. 임베딩 모델을 교체하면(예: BGE-M3) norm 보장이 깨질 수 있으므로 norm을 재측정하고 정규화 분기를 갱신해야 합니다. `embed()` 래퍼의 norm 검증 가드 → 시작프롬프트.md §B-7 참조.
- 차원·정규화 여부는 인덱스 메타에 박아 둡니다(model·dim·normalized·metric). 스키마 정의 → [03_DATABASE/00_벡터스토어_스키마.md](../03_DATABASE/00_벡터스토어_스키마.md).

### 3.2 `prompt_tokens=0` 오보고의 환경적 함의

LMStudio 임베딩 응답의 `usage.prompt_tokens`가 0으로 잘못 보고됩니다. 이는 단순 표시 오류가 아니라 **입력이 모델 한계를 넘었는지 응답으로 알 수 없다**는 뜻입니다.

- 청크 길이 제어는 문자 수 기준을 1차로 사용합니다.
- 토큰 기준이 필요하면 해당 모델의 HF 토크나이저로 로컬 계산합니다(`tiktoken`은 OpenAI BPE라 불일치 → 근사 폴백용으로만).
- 무음 잘림(silent truncation) 방지 가드 적용은 → 시작프롬프트.md §B-2 ②③ 참조.

### 3.3 입력 최대 길이/배치 한계 — [확인필요]

한 번에 넣을 수 있는 input **개수(배치)**와 **토큰/문자 길이 상한**은 짧은/긴 입력으로 직접 떠봐야 합니다. **[확인필요]** — 현재 정확한 상한값 미측정.

- **측정 범위 명확화**: 본 문서 §5.2 프로브는 ① 단일 긴 문자열 길이 탐침과 ② **배치 input 개수 탐침**(원소 수를 1→N으로 늘려가며 거부 경계 관측) **둘 다**를 수행합니다. 두 축의 측정 결과로 §3.3 [확인필요]를 해소합니다. 판정 기준은 §5.3 표 참조.
- 이 상한은 청킹·배치 임베딩 설계(청크 길이·배치 분할 크기)와 직결되며, 평가 골든셋·Recall@k 측정의 전제가 됩니다. 청킹·인덱싱 설계는 시작프롬프트.md §B-2, 평가 연계는 §B-8, 스키마는 → [03_DATABASE/00_벡터스토어_스키마.md](../03_DATABASE/00_벡터스토어_스키마.md) 참조.

---

## 4. 한국어 약점 (환경 관점 요약)

현재 임베딩 모델은 영어 중심이라 한국어 의미 변별이 약합니다. 실측 재현 사례:

- 질의 "연차 휴가 신청 절차" → 정답(휴가규정)이 **3위**로 밀리고, 오답(출장경비)보다 점수가 **-0.018** 낮음 → Recall@1 = 0.

이는 환경의 한계이지 코드 버그가 아닙니다. 한국어 검색 품질이 1순위 목표이므로 임베딩 교체가 환경 차원의 핵심 변경 포인트입니다. 이 사례는 평가 골든셋의 **회귀 케이스**로 고정합니다(목표: 교체·리랭킹 후 Recall@1 = 1). → 시작프롬프트.md §B-8.

### 교체 후보 환경 스펙 — BGE-M3

| 항목 | 값 |
| --- | --- |
| 차원 | 1024 |
| 컨텍스트 | 8192 |
| 검색 방식 | Dense + Sparse + ColBERT |
| 라이선스 | MIT |
| 한국어 | Recall@1 우수 |
| 배포 | GGUF 1~2GB (LMStudio 다운로드 가능) |

- BGE-M3 다운로드 여부는 사용자 결정 사항입니다 → **DECISION**(SSOT §B-9 #2). 다운로드(1~2GB)·교체는 사용자가 승인해야 진행하며, 확정 문서는 → [01_기술스택결정서.md](./01_기술스택결정서.md)입니다.
- 교체 시 차원이 768 → 1024로 바뀌어 **인덱스 전체 재생성**이 필요하고, norm 재측정도 필수입니다(§3.1). 교체 판단 근거·정량 비교는 → 시작프롬프트.md §B-5, 평가는 §B-8 참조.

---

## 5. Phase 0 환경 점검 (env_check) 절차

가정 대신 재측정으로 시작합니다. 아래는 → 시작프롬프트.md §A-4 의 환경 점검 항목을 환경 관점에서 절차화한 것입니다.

> **실행/자동화는 03 소관**: 가상환경·의존성·`.env`·모델 로드 등 **셋업 절차**와 `scripts/env_check.py` 자동화는 → [03_개발환경셋업.md](./03_개발환경셋업.md)에서 다룹니다. 본 문서는 **점검 항목의 정의와 실측 수치 해석**만 담당합니다.

### 5.1 점검 항목

1. **모델 목록 확인**: `GET /v1/models`로 로드된 모델을 출력. §2 표와 일치하는지 대조.
2. **임베딩 실측**: 임베딩 1건 호출 → 차원(768)·norm(1.0)·`prompt_tokens`(0) 실제 값 출력.
3. **입력 한계 탐침**: ① 단일 긴 문자열 길이 상한과 ② **배치 input 개수 상한**(원소 수를 늘려가며 거부 경계 관측)을 직접 떠봄 → §3.3 **[확인필요]** 해소. 판정 기준은 §5.3.
4. **생성 모델 응답 형태 확인**: 생성 모델 1건 호출 → 답이 `content`/`reasoning_content` 중 어디에 오는지, 폴백 답에 사고과정이 섞이는지, `finish_reason`이 무엇인지 확인. 폴백·정제 로직 검증은 → 시작프롬프트.md §B-7.

### 5.2 점검 스크립트 예시

> **이 스크립트는 환경 점검용 최소 진단 도구입니다.** 폴백·정제·norm 가드·`length` 재시도가 **없으며**, ④ chat 프로브는 의도적으로 **폴백 없이 raw 증상을 관측**합니다(운영용 아님). 운영용 래퍼(폴백·정제·norm 가드·재시도 포함)는 → 시작프롬프트.md §B-7 의 정본을 사용하세요. 자동화 실행 위치는 `scripts/env_check.py`(→ [03_개발환경셋업.md](./03_개발환경셋업.md)).

```python
import math
from openai import OpenAI

# 로컬이라 인증 무의미 → 관례상 더미 키 (SSOT §A-1·§B-7)
client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")

EMB = "text-embedding-nomic-embed-text-v1.5"

# 1) 로드된 모델 목록
print("[models]")
for m in client.models.list().data:
    print(" -", m.id)

# 2) 임베딩 차원·norm·prompt_tokens 실측
r = client.embeddings.create(model=EMB, input=["연차 휴가 신청 절차"])
vec = r.data[0].embedding
norm = math.sqrt(sum(x * x for x in vec))
print("\n[embedding]")
print(" dim          =", len(vec))                 # 기대: 768
print(" norm         =", round(norm, 4))           # 기대: 1.0 (재정규화 금지)
print(" prompt_tokens=", r.usage.prompt_tokens)    # 실측: 0 (오보고, 신뢰 불가)

# 3a) 입력 길이 탐침 (단일 긴 문자열) — §3.3 [확인필요] 축①
print("\n[input-limit: length]")
for label, text in (("short", "휴가"), ("long", "가" * 20000)):
    try:
        rr = client.embeddings.create(model=EMB, input=[text])
        print(f" {label:5s}: chars={len(text):>6d} -> dim={len(rr.data[0].embedding)} ok")
    except Exception as e:
        # 길이 상한 도달 신호: 여기서 처음 ERROR가 나는 문자수가 단일 입력 상한
        print(f" {label:5s}: chars={len(text):>6d} -> ERROR {type(e).__name__}: {e}")

# 3b) 배치 input 개수 탐침 — §3.3 [확인필요] 축② (개수를 늘려가며 거부 경계 관측)
print("\n[input-limit: batch-count]")
for n in (1, 8, 32, 128, 512, 2048):
    batch = ["휴가"] * n
    try:
        rr = client.embeddings.create(model=EMB, input=batch)
        # 반환 벡터 수가 요청 개수와 다르면 무음 절단(silent truncation) 신호
        got = len(rr.data)
        flag = "" if got == n else f"  <-- 무음절단? sent={n} got={got}"
        print(f" n={n:>5d}: got={got} ok{flag}")
    except Exception as e:
        # 여기서 처음 ERROR가 나는 n 직전이 배치 개수 상한
        print(f" n={n:>5d}: ERROR {type(e).__name__}: {e}  <-- 배치 상한 도달")
        break

# 4) 생성 모델 응답 형태 (content vs reasoning_content)
#    [BLOCKING 주의] gemma-4-e4b는 §6 증상(content 빈값·무한사고 length 잘림) 재현 대상.
#    이 프로브는 폴백 없이 raw 증상을 관측하려는 의도이므로 운영 코드로 복사 금지.
#    또한 기본 생성모델 선택은 미확정 DECISION(§2, SSOT §B-9 #8).
resp = client.chat.completions.create(
    model="google/gemma-4-e4b",
    messages=[{"role": "user", "content": "한 문장으로 답하세요: 1+1은?"}],
    max_tokens=4000,
)
ch = resp.choices[0]
print("\n[chat] (raw 증상 관측 — 폴백 없음, 운영 금지)")
print(" finish_reason     =", ch.finish_reason)                       # length 주의
print(" content           =", repr((ch.message.content or "")[:80]))  # 실측: 빈 문자열
print(" reasoning_content =", repr((getattr(ch.message, 'reasoning_content', '') or '')[:80]))
```

### 5.3 기대 결과 vs 위험 신호

| 점검 | 기대(정상) | 위험 신호 / 판정 기준 |
| --- | --- | --- |
| 모델 목록 | §2 4종 로드됨 | 모델 미로드 → LMStudio에서 로드 필요 |
| 임베딩 dim | 768 | 다른 값 → 모델 교체됨, 인덱스 차원 재확인 |
| 임베딩 norm | 1.0 | ≠1.0 → 재정규화 분기·metric 재검토(§3.1) |
| `prompt_tokens` | 0 | (0이 정상값) 0 아니면 LMStudio 동작 변경 확인 |
| 입력한계(길이) | 짧은/긴 입력 모두 `dim=768 ok` | **처음 `ERROR`가 나는 문자수 = 단일 입력 상한**. ERROR 없이 통과하면 `'가'*20000`까지는 상한 미도달 → 더 키워 재탐침 |
| 입력한계(배치) | 요청 개수 == 반환 `got` | **처음 `ERROR`가 나는 `n` 직전 = 배치 개수 상한**. `sent≠got`(무음절단)도 상한 신호 → 청크 배치 분할 크기를 그 미만으로 고정(§3.3) |
| chat `content` | (정상이라면 답이 채워짐) | **빈 문자열 = §6 BLOCKING 재현** → `reasoning_content` 폴백 필요 |
| `finish_reason` | `stop` | `length` → 무한 사고 잘림(§6), `max_tokens` 상향 1회 재시도 필요(운영 §B-7) |

> 입력한계 두 행은 §3.3 **[확인필요]**를 해소하는 판정 기준입니다. 측정된 상한값은 인덱싱·배치 임베딩 설정에 그대로 반영하고, 스키마/배치 메타에 기록합니다(→ [03_DATABASE/00_벡터스토어_스키마.md](../03_DATABASE/00_벡터스토어_스키마.md)).

---

## 6. 생성 모델 reasoning_content 이슈 (BLOCKING)

환경 차원에서 가장 먼저 해결해야 하는 선결 이슈입니다.

### 증상 (실측)

- 세 모델(`qwen3.6-35b-a3b`, `qwen3.5-9b`, `gemma-4-e4b`) **모두** `message.content`가 빈 문자열로 오고, 실제 답이 `message.reasoning_content`에 담깁니다.
- reasoning이 종료 토큰을 못 만나 무한 사고하다 `finish_reason=length`로 잘립니다. "한 문장" 질문에 **12,972자** reasoning이 나온 사례가 실측됨.

### 무효 처리된 설정 (실측)

| 시도한 설정 | 결과 |
| --- | --- |
| `/no_think` | 무효 |
| `chat_template_kwargs.enable_thinking=false` | 무효 |
| `reasoning_effort=low` | 무효 |
| `max_tokens=4000` | 무효(잘림만 발생) |

### 대응 방향 (필수)

`content` 빈값 시 `reasoning_content` 폴백 → `<think>` 정제(사고과정 제거·최종답 추출) → `finish_reason=length`면 `max_tokens` 상향 1회 재시도. 모든 LLM 호출에 필수 적용합니다.

- **§5.2 chat 프로브와의 구분**: 위 프로브는 폴백을 **일부러 넣지 않아** raw 증상을 보여줄 뿐입니다. 진단용 출력과 런타임 필수 동작을 혼동하지 마세요. 실제 호출은 반드시 위 3단(폴백·정제·재시도) 래퍼를 거칩니다.
- 이 이슈가 해결되기 전에는 "RAG 답변 생성"을 완성으로 보고하지 않습니다(검색 단계는 이 이슈와 독립적으로 먼저 구현·검증 가능).
- LMStudio 프리셋의 reasoning 파서/종료 토큰 점검(근본 대응)은 → [03_개발환경셋업.md](./03_개발환경셋업.md) §4-4 (B). 원인 추정·진단·폴백 코드는 → 시작프롬프트.md §B-4·§B-7 참조. 본 문서는 환경 증상 기록까지만 다룹니다.

---

## 7. 환경 불변식 요약 (변경 금지)

- Base URL `http://localhost:1234/v1`, OpenAI 호환, `api_key` 더미(로컬이라 인증 무의미). 외부 API 없음.
- 임베딩 768차원, norm=1.0(재정규화 금지), prefix 효과 미미(0.687→0.695), `prompt_tokens=0` 오보고.
- 생성 3종 ctx: qwen3.6-35b-a3b=8192, qwen3.5-9b=8192, gemma-4-e4b=65536. 모두 로컬·`parallel=4`. 기본 생성모델 선택은 미확정 **DECISION**(§B-9 #8).
- 생성 3종 공통: `content` 빈값 + `reasoning_content` 응답 + 무한 사고로 `length` 잘림(12,972자) → 폴백·정제·재시도 필수.
- 임베딩 입력 개수·길이 상한은 **[확인필요]**(§3.3) — §5 env_check로 측정해 해소.
- 현재 코드 없음·스택 확정(2026-06-17). 본 문서는 환경 실측·점검 절차 정리 단계.

> 상세 정본은 → 시작프롬프트.md §B-12(실측 사실 요약) 참조. AI 에이전트용 불변식 체크리스트는 → [99_AI참조/01_실측제약_불변식.md](../99_AI참조/01_실측제약_불변식.md).
