# docs-em Design System

A design system for **docs-em** — the operations console for a **100% local, Korean
internal-document RAG** (retrieval-augmented generation) tool. Every inference,
embedding, and generation runs on a local **LMStudio** endpoint
(`http://localhost:1234/v1`, OpenAI-compatible, dummy key `lm-studio`); **zero**
external cloud API calls.

The product is a responsive **dark web UI** with three screens:
**A 질의응답** (grounded Q&A + 출처 인용), **B 인덱싱** (문서 인덱싱/재색인),
**C 평가 대시보드** (검색 품질 평가).

> **Tone:** an air-gapped terminal that stays calm. Strip the decoration and let the
> measured scores speak. Two "normal" signals are split on purpose — **teal #2DD4BF**
> = connection-ok / accent action, **green #3FB950** = success / Recall achieved.
> Only risk earns **amber** (retry) / **red** (regression, failure).
> **References: LM Studio UI, Linear, Vercel dashboards, Grafana.**

## Sources
Built from the docs-em design-doc hub:
- **Doc hub:** https://kwoun1982.github.io/docs-em/ (client-rendered; individual `.md`
  bodies load in-app)
- **Driving spec:** `06_UIUX/00_ClaudeDesign_프롬프트.md` — "docs-em UI/UX 시안 생성 프롬프트"
  (full body pasted by the user). This system's colors, type, components, three screens,
  and **all demo data** are taken verbatim from it.
- Related (referenced, not yet read in full): `02_기획서/00_PRD`, `01_유스케이스`,
  `99_AI참조/01_실측제약_불변식` (변경금지 invariants), `05_운영_평가/00_평가하네스_Recall`,
  `03_DATABASE/02_데이터모델_청크`.

No codebase or Figma was attached — only the written spec. If the real docs-em repo or
Figma exists, attach it to reconcile exact component implementations.

> **Demo-data note (from spec ④):** identifiers like `hr-0412` / `tr-0203` and positions
> `p.N` are **demo-only placeholders** (real chunk-id schema lives in `03_DATABASE`, e.g.
> `{doc_id}#{chunk_index}`). Only the **confirmed numbers are real**: `768`, `-0.018`,
> `0.687→0.695`, `12,972자`, `ctx 8192/65536`, `localhost:1234`. The stability gauges
> (`8%`/`12%`), threshold `25%`, and the improvement value `+0.012` are demo fill, labeled
> as such on the cards.

---

## Content fundamentals — how docs-em writes

- **Bilingual, Korean-first.** UI labels and prose are Korean (`질의응답`, `인덱싱`,
  `근거 청크 Top-k`, `재색인`, `통제 위반`). Technical identifiers stay mono/Latin
  (`Recall@1`, `MRR`, `nDCG@3`, `sim 0.695`, `finish_reason=length`, `gemma-4-e4b`).
- **Voice: neutral-operational.** The console states facts, never cheerleads or apologizes,
  no first person. Buttons are bare imperatives/nouns: `전송`, `파일 선택`, `전체 재색인`,
  `평가 실행`, `취소`, `적용`.
- **Numbers are the message, and they are honest.** Negative truths are shown unbeautified:
  `Recall@1 = 0`, `격차 -0.018`, `REGRESS`. Unreliable data carries an amber inline tag —
  `prompt_tokens=0 (unreliable)`. Never round a bad number into a soft adjective.
- **Casing.** Korean has no case; English identifiers stay lowercase/mono. Eyebrow labels are
  UPPERCASE wide-tracked (`EXTERNAL CALLS: 0`, `100% LOCAL`). No Title-Case marketing headers.
- **No emoji, no exclamation.** Status is carried by a small colored dot + shape + text label,
  never punctuation.
- **The local guarantee is a first-class citizen.** `● localhost:1234 연결됨`,
  `EXTERNAL CALLS: 0`, `100% LOCAL`, lock icon — fixed on every screen's header, never hidden.

---

## Visual foundations

- **Backgrounds (exact):** `#0D1117` canvas, `#0A0C10` sidebar/code (one step deeper).
  **Surfaces:** `#161B22` tier-1 card, `#1C2128` tier-2 hover/nested. **Borders:** `#30363D`
  default, `#3D444D` strong, `#21262D` fine. Surfaces separate by **hairline first**, shadow second.
- **Text (exact):** `#E6EDF3` primary, `#9DA7B3` secondary/label, `#6E7681` faint/placeholder.
- **The two normal signals (deliberately split):** **teal `#2DD4BF`** = connection-ok /
  accent action / focus ring; **green `#3FB950`** = success / Recall achieved / score-up /
  positive delta. **amber `#D29922`** = retry / thinking-cut / unreliable. **red `#F85149`** =
  failure / regression / Recall@1=0 / disconnect. **blue `#58A6FF`** = neutral link / meta,
  kept apart from the three states. Tints are the base color at 10% over the dark ground,
  borders at ~40%.
- **Type:** `Pretendard` (Inter fallback) for UI prose — line-height **1.6**, tracking 0.
  `JetBrains Mono` (IBM Plex Mono fallback) with **tabular-nums** for every datum: similarity
  (`0.687`), gap (`-0.018`), dimension (`768`), context length (`65536`), chunk_id, model name,
  `localhost:1234`, `finish_reason`. Hierarchy: screen title 20–24 / section 16 / body 14 /
  data·label 12–13 mono / **1급 지표 (Recall@1) 28–32 mono standalone** / giant KPI up to 56.
  Never set long Korean in mono.
- **Backgrounds:** flat color only. **No gradients, no illustration, no imagery, no texture.**
- **Cards:** tier-1 surface + `1px` border + `8px` radius, no resting shadow. Chunk cards get a
  **4px left status bar** (cited = teal, below-cutoff = dim 0.45). Cutoff = amber 1px **dashed**
  line + right label `cutoff` (number blank when threshold is DECISION-undecided).
- **Elevation:** restrained; shadow only on truly floating layers (modals). Resting surfaces
  rely on borders.
- **Motion:** pipeline segment fill 200–300ms ease-out, in-progress segment teal pulse
  (1.2s loop), score count-up 400ms tabular-nums (monotonic), regression 0→1 a single
  red→green border flash. **No bounce, parallax, or decorative loops.** `prefers-reduced-motion`
  → final state only.
- **Hover / press:** hover lifts the fill one step and brightens text; primary teal →
  brighter teal. No scale/translate on press. Focus = teal 2px ring.
- **Accessibility:** WCAG AA (4.5:1). **Never color alone** — color + shape (dot/check/✕) +
  text label (`OK`/`RETRY`/`FAIL`). Responsive: desktop ≥1200px; `<1024px` screen-A Top-k
  panel stacks below the answer and B/C sidebars collapse; `<768px` screen-C 2-col compares
  stack to 1-col.

---

## Iconography

- **Set:** [Lucide](https://lucide.dev) line icons at a **1.75 stroke** (Linear/Vercel register).
  A curated subset is embedded as path data in `components/core/Icon.jsx` so the bundle is
  offline-safe — `Icon.names` lists them; the **Icon** card shows them all.
- **Usage:** functional only. Status icons mirror tone (`check-circle`, `alert-triangle`,
  `x-circle`); domain glyphs `search`/`send`, `database`/`layers`, `gauge`/`activity`/
  `trending-up`, `cpu`/`terminal`/`shield-check`/`lock`.
- **No emoji, no PNG icons, no Unicode dingbats.** (The spec's `▲정답`/`✕오답`/`⟳` marks are
  rendered as plain mono text glyphs alongside icons, not as emoji.)
- **Brand mark:** `assets/logo-mark.svg` — a console-prompt caret in teal, paired with the
  `docs·em` mono wordmark (`AppShell.jsx`). **Original placeholder — swap for the official mark.**

---

## Index / manifest

**Root**
- `styles.css` — global entry (import list only). Consumers link this one file.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`.
- `assets/` — `logo-mark.svg`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing).
- `SKILL.md` — Agent-Skills-compatible entry.

**Components** (`components/`, namespace `window.DocsEmDesignSystem_afe3d1`)
- `core/` — **Icon**
- `forms/` — **Button**, **IconButton**, **Input**, **Select**, **Switch**, **Segmented**
- `feedback/` — **StatusPill**, **ConnectionBadge** + **ExternalCallsCounter**, **GateChip**,
  **ProgressBar**, **Tooltip**
- `data/` — **Metric**, **ScoreChip**, **ScoreBar**, **DataTable**, **Tag**, **Kbd**
- `layout/` — **Card**, **Tabs**

**UI kits** (`ui_kits/`)
- `docs-em/` — the three-screen console (A 질의응답 · B 인덱싱 · C 평가 대시보드), spec-aligned
  demo data, interactive screen-switching, search-mode toggle, BGE-M3 DECISION modal, and the
  Recall@1 0→1 success demo (select **+rrf** on screen C). See its `README.md`.

**Generated (do not edit):** `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`.
