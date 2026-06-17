---
name: docs-em-design
description: Use this skill to generate well-branded interfaces and assets for docs-em — the 100% local Korean document-RAG operations console — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view. If working on production code, you can copy
assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or
design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.

## Quick orientation
- **Brand:** docs-em — air-gapped, calm dark console for local Korean document RAG. Let the
  measured scores speak; strip decoration.
- **Tokens & global CSS:** `styles.css` → `tokens/{colors,typography,spacing,fonts,base}.css`.
  Teal-green is the only resting signal; amber = regression/retry, red = failure.
- **Type:** Pretendard for UI prose, Geist Mono for every datum (scores, IDs, latency).
- **Components:** `components/<group>/<Name>.jsx` with sibling `.d.ts` + `.prompt.md`.
  Read the `.prompt.md` for usage. Reachable at `window.DocsEmDesignSystem_afe3d1` once the
  bundle is loaded.
- **Full screens:** `ui_kits/docs-em/` recreates the three product views — copy these as a
  starting point for any docs-em surface.
- **Iconography:** Lucide line icons at 1.75 stroke via the `Icon` component. No emoji.

See `readme.md` for the full content, visual, and iconography guidelines.
