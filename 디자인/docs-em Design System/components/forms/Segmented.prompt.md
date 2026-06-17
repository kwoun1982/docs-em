Segmented control, teal underline on the active segment. Use for the search-mode toggle and similar exclusive choices.

```jsx
<Segmented
  value={mode}
  onChange={setMode}
  options={[
    { value: "vector", label: "벡터" },
    { value: "bm25", label: "BM25" },
    { value: "hybrid", label: "하이브리드 RRF" },
  ]}
/>
```

Default the meaningful option active (e.g. 하이브리드 RRF). Switching BM25 should flip score-chip labels from `sim` to `bm25` in the consuming screen.
