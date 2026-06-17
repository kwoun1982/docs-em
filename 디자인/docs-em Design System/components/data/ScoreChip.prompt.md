Mono score chip that always labels the score KIND (`sim`, `bm25`, `rrf`) so cosine and lexical scores never get confused. A signed `gap` colors the border red (negative) or green (positive).

```jsx
<ScoreChip kind="sim" value={0.695} />
<ScoreChip kind="sim" value={0.695} gap={-0.018} />   // red border
<ScoreChip kind="bm25" value={12.4} decimals={1} />
```
