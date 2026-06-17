Text input on the inset trough, teal focus ring. Set `mono` for queries, paths, and IDs that should read as data.

```jsx
<Input icon="search" placeholder="문서 검색…" value={q} onChange={e => setQ(e.target.value)} />
<Input mono placeholder="/corpus/policy_2024.md" />
<Input invalid value={bad} />
```

Sizes `sm`/`md`/`lg`. `invalid` switches the border to red.
