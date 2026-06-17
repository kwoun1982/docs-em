Primary action control for docs-em — teal `primary` for the one key action per view, quiet `secondary`/`ghost` otherwise, `danger` for destructive.

```jsx
<Button variant="primary" size="md" onClick={run}>질의 실행</Button>
<Button variant="secondary" iconLeft={<Icon name="rotate-cw" />}>재인덱싱</Button>
<Button variant="ghost" size="sm">취소</Button>
<Button variant="danger">인덱스 삭제</Button>
```

Variants: `primary` (teal fill, dark ink), `secondary` (raised + border), `ghost` (transparent, toolbar/inline), `danger` (red tint). Sizes `sm` 26px / `md` 32px / `lg` 38px. Supports `iconLeft` / `iconRight`, `disabled`.
