Big mono stat with label and signed delta. Delta auto-colors teal (up) / amber (down); set `invertDelta` when down is good (latency, error rate).

```jsx
<Metric label="recall@5" value="0.912" delta={0.018} />
<Metric label="p50 latency" value="1,284" unit="ms" delta={-112} deltaUnit="ms" invertDelta />
<Metric label="indexed docs" value="3,418" hint="42 corpora" />
```
