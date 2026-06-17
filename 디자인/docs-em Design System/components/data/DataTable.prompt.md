Dense table for eval results, retrieved chunks, and corpus listings. Mark numeric/ID columns `mono`; use `render` for pills and score bars.

```jsx
<DataTable
  columns={[
    { key: "doc", label: "document", mono: true },
    { key: "recall", label: "recall@5", align: "right", mono: true,
      render: v => <ScoreBar value={v} width={120} /> },
    { key: "status", label: "status", render: v => <StatusPill tone={v}>{v}</StatusPill> },
  ]}
  rows={rows}
  onRowClick={openCase}
/>
```

`dense` tightens row height for long lists.
