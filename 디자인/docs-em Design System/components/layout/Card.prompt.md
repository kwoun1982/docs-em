Surface container with optional `header`, `footer`, and `actions`. Set `inset` for sunken code/log wells.

```jsx
<Card header="검색된 청크" actions={<IconButton icon="copy" size="sm" />}>
  <ScoreBar value={0.91} />
</Card>
<Card inset padding={false}><pre>…log…</pre></Card>
```
